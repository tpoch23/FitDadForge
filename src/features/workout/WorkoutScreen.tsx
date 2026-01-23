// src/features/workout/WorkoutScreen.tsx (FULL – Farmers Carry weight + timer stacked small right, Russian Twist horizontal, timer only Burpees, compact no scroll, expand for complete)

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, Alert, Share, SafeAreaView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { EXERCISES } from '../../data/exercises';
import { getDayTemplate, PROGRAM } from '../../data/program';
import { useUserStore } from '../../stores/useUserStore';
import { getRandomQuote } from '../../data/quotes';
import { Ionicons } from '@expo/vector-icons';

type RouteParams = {
  phase: number;
  sessionIndex: number;
};

type GroupedBlock = {
  title: string;
  items: {
    id: string;
    name: string;
    reps: string;
    isTimed?: boolean;
    timedSeconds?: number;
    canAddWeight: boolean;
    defaultWeight?: number;
  }[];
  sets: number;
};

export default function WorkoutScreen() {
  const route = useRoute<RouteParams>();
  const navigation = useNavigation<any>();
  const { phase = 0, sessionIndex = 0 } = route.params ?? {};
  const { lastWeights, updateLastWeight, advanceSession } = useUserStore();

  const template = getDayTemplate(phase, sessionIndex);
  if (!template) {
    return <View style={styles.container}><Text style={styles.error}>Workout not found</Text></View>;
  }

  const sessionName = PROGRAM[phase].sessionNames[sessionIndex];

  const capitalizeName = (id: string) => {
    return id
      .replace(/-/g, ' ')
      .replace(/^core /, '')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const blocks: GroupedBlock[] = [];

  // Primary
  const primaryEx = EXERCISES.find(e => e.id === template.primary);
  blocks.push({
    title: 'Primary Lift',
    items: [{
      id: template.primary,
      name: primaryEx?.name || 'Flat Barbell Bench Press',
      reps: template.primaryReps,
      canAddWeight: true,
      defaultWeight: 135,
    }],
    sets: template.primarySets,
  });

  // Supersets
  template.supersets.forEach((pair, i) => {
    const items = pair.exercises.map((id, j) => {
      const ex = EXERCISES.find(e => e.id === id);
      const isTimed = pair.reps[j].includes('s') || pair.reps[j].includes('hold');
      const timedSeconds = isTimed ? (pair.reps[j].includes('hold') ? 45 : parseInt(pair.reps[j])) : undefined;
      const canAddWeight = id === 'squat-goblet' || id === 'bench-dips';
      const defaultWeight = id === 'squat-goblet' ? 35 : (id === 'bench-dips' ? 0 : undefined);
      return {
        id,
        name: ex?.name || capitalizeName(id),
        reps: pair.reps[j],
        isTimed,
        timedSeconds,
        canAddWeight,
        defaultWeight,
      };
    });

    blocks.push({
      title: `Superset ${i + 1}`,
      items,
      sets: pair.sets,
    });
  });

  // Finisher grouped
  const finisherItems = template.finisher.exercises.map((id, i) => {
    const ex = EXERCISES.find(e => e.id === id);
    const isTimed = template.finisher.reps[i].includes('s');
    const timedSeconds = isTimed ? parseInt(template.finisher.reps[i]) : undefined;
    const canAddWeight = id === 'core-russian-twist' || id === 'core-farmers-carry';
    const defaultWeight = id === 'core-russian-twist' ? 20 : (id === 'core-farmers-carry' ? 0 : undefined);
    return {
      id,
      name: ex?.name || capitalizeName(id),
      reps: template.finisher.reps[i],
      isTimed,
      timedSeconds,
      canAddWeight,
      defaultWeight,
    };
  });

  blocks.push({
    title: 'Finisher Superset',
    items: finisherItems,
    sets: template.finisher.sets,
  });

  const [expandedIndex, setExpandedIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState<{ [index: number]: number }>({});
  const [weight, setWeight] = useState<{ [id: string]: number }>({});
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [completedRounds, setCompletedRounds] = useState<{ [index: number]: number }>({});
  const [restVisible, setRestVisible] = useState(false);
  const [restSecs, setRestSecs] = useState(90);
  const [quote, setQuote] = useState(getRandomQuote());
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [activeTimedBlock, setActiveTimedBlock] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setTotalSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const newWeight = { ...weight };
    blocks.flatMap(b => b.items).forEach(item => {
      newWeight[item.id] = lastWeights[item.id] ?? (item.defaultWeight || 0);
    });
    setWeight(newWeight);
  }, []);

  useEffect(() => {
    if (restVisible && restSecs > 0) {
      const t = setTimeout(() => setRestSecs(restSecs - 1), 1000);
      return () => clearTimeout(t);
    } else if (restSecs === 0) {
      setRestVisible(false);
      setRestSecs(90);
      setQuote(getRandomQuote());
    }
  }, [restVisible, restSecs]);

  useEffect(() => {
    if (timerRunning && timerSeconds > 0) {
      const t = setTimeout(() => setTimerSeconds(timerSeconds - 1), 1000);
      return () => clearTimeout(t);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
      if (activeTimedBlock !== null) {
        completeRound(activeTimedBlock);
        setActiveTimedBlock(null);
      }
    }
  }, [timerRunning, timerSeconds]);

  const completeRound = (blockIndex: number) => {
    const newCompleted = { ...completedRounds, [blockIndex]: (completedRounds[blockIndex] || 0) + 1 };
    setCompletedRounds(newCompleted);

    const current = (currentRound[blockIndex] || 0) + 1;
    setCurrentRound({ ...currentRound, [blockIndex]: current });

    if (current < blocks[blockIndex].sets) {
      setRestVisible(true);
      setRestSecs(blocks[blockIndex].restAfter || 90);
    } else {
      if (blockIndex < blocks.length - 1) {
        setExpandedIndex(blockIndex + 1);
        setRestVisible(true);
      } else {
        advanceSession();
        Alert.alert('Victory!', `Forged in ${formatTime(totalSeconds)}`, [{ text: 'Barracks', onPress: () => navigation.navigate('Home') }]);
      }
    }
  };

  const startTimer = (blockIndex: number, seconds: number) => {
    setTimerSeconds(seconds);
    setTimerRunning(true);
    setActiveTimedBlock(blockIndex);
  };

  const skipRest = () => setRestSecs(0);

  const shareQuote = async () => {
    await Share.share({
      message: `Forged this quote on #FitDadForge: "${quote.text}" — ${quote.author}`,
    });
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const renderBlock = ({ item, index }: { item: GroupedBlock; index: number }) => {
    const completed = completedRounds[index] || 0;
    const current = currentRound[index] || 1;
    const isExpanded = index === expandedIndex;

    return (
      <TouchableOpacity activeOpacity={0.9} onPress={() => setExpandedIndex(index)}>
        <View style={[styles.card, isExpanded && styles.expanded]}>
          <Text style={styles.title}>{item.title}</Text>
          {item.items.map(ex => (
            <View key={ex.id} style={styles.itemRow}>
              <Text style={styles.reps}>{ex.reps}</Text>
              <Text style={styles.name}>{ex.name}</Text>
              <View style={styles.rightColumn}>
                {ex.canAddWeight && (
                  <View style={styles.smallWeightRow}>
                    <TouchableOpacity style={styles.smallAdj} onPress={() => setWeight({ ...weight, [ex.id]: Math.max(0, (weight[ex.id] || ex.defaultWeight || 0) - 5) })}>
                      <Text style={styles.smallAdjText}>-5</Text>
                    </TouchableOpacity>
                    <Text style={styles.smallWeight}>{weight[ex.id] || ex.defaultWeight || 0} lbs</Text>
                    <TouchableOpacity style={styles.smallAdj} onPress={() => setWeight({ ...weight, [ex.id]: (weight[ex.id] || ex.defaultWeight || 0) + 5 })}>
                      <Text style={styles.smallAdjText}>+5</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {ex.isTimed && (
                  <View style={styles.smallTimerRow}>
                    <Text style={styles.smallTimer}>
                      {timerRunning && activeTimedBlock === index ? formatTime(timerSeconds) : formatTime(ex.timedSeconds || 30)}
                    </Text>
                    {!timerRunning || activeTimedBlock !== index ? (
                      <TouchableOpacity style={styles.smallTimerBtn} onPress={() => startTimer(index, ex.timedSeconds || 30)}>
                        <Text style={styles.smallTimerBtnText}>Start</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.smallRunning}>Running</Text>
                    )}
                  </View>
                )}
              </View>
            </View>
          ))}
          <View style={styles.starsRow}>
            {Array.from({ length: item.sets }, (_, i) => (
              <Ionicons key={i} name={i < completed ? 'star' : 'star-outline'} size={18} color="#ff4500" />
            ))}
          </View>

          {isExpanded && (
            <View style={styles.controls}>
              <TouchableOpacity style={styles.complete} onPress={() => completeRound(index)}>
                <Text style={styles.completeText}>Complete Round {current}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{sessionName}</Text>
          <Text style={styles.timer}>{formatTime(totalSeconds)}</Text>
        </View>
        <FlatList
          data={blocks}
          renderItem={renderBlock}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={styles.list}
        />

        <Modal visible={restVisible} transparent animationType="fade">
          <View style={styles.overlay}>
            <View style={styles.modal}>
              <Text style={styles.restTimer}>{restSecs}s Rest</Text>
              <TouchableOpacity style={styles.skip} onPress={skipRest}>
                <Text style={styles.skipText}>SKIP REST</Text>
              </TouchableOpacity>
              <Text style={styles.quoteText}>"{quote.text}"</Text>
              <Text style={styles.quoteAuthor}>— {quote.author}</Text>
              <TouchableOpacity style={styles.share} onPress={shareQuote}>
                <Text style={styles.shareText}>Share Quote</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  title: {
    fontSize: 20,
    color: '#ff4500',
    fontWeight: 'bold',
  },
  timer: {
    fontSize: 16,
    color: '#fff',
  },
  list: {
    padding: 10,
  },
  card: {
    backgroundColor: 'rgba(40,40,40,0.9)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#444',
    minHeight: 80,
  },
  expanded: {
    minHeight: 140,
    borderColor: '#ff4500',
    shadowColor: '#ff4500',
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  title: {
    fontSize: 18,
    color: '#ff4500',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  reps: {
    fontSize: 15,
    color: '#ff4500',
    width: 80,
  },
  name: {
    fontSize: 15,
    color: '#fff',
    flex: 1,
  },
  rightColumn: {
    alignItems: 'flex-end',
  },
  smallWeightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallAdj: {
    backgroundColor: '#333',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  smallAdjText: {
    fontSize: 18,
    color: '#ff4500',
    fontWeight: 'bold',
  },
  smallWeight: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  smallTimerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  smallTimer: {
    fontSize: 18,
    color: '#ff4500',
    fontWeight: 'bold',
    marginRight: 8,
  },
  smallTimerBtn: {
    backgroundColor: '#ff4500',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  smallTimerBtnText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  smallRunning: {
    fontSize: 14,
    color: '#ff4500',
  },
  starsRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  controls: {
    marginTop: 12,
    alignItems: 'center',
  },
  complete: {
    backgroundColor: '#ff4500',
    paddingHorizontal: 35,
    paddingVertical: 12,
    borderRadius: 12,
  },
  completeText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#111',
    padding: 30,
    borderRadius: 25,
    alignItems: 'center',
    width: '90%',
    borderWidth: 3,
    borderColor: '#ff4500',
  },
  restTimer: {
    fontSize: 60,
    color: '#ff4500',
    fontWeight: 'bold',
  },
  skip: {
    backgroundColor: '#444',
    padding: 15,
    borderRadius: 15,
    marginVertical: 20,
  },
  skipText: {
    color: '#ff4500',
    fontSize: 22,
    fontWeight: 'bold',
  },
  quoteText: {
    fontSize: 21,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 15,
    fontStyle: 'italic',
  },
  quoteAuthor: {
    fontSize: 17,
    color: '#ff4500',
    marginBottom: 20,
  },
  share: {
    backgroundColor: '#ff4500',
    padding: 15,
    borderRadius: 15,
  },
  shareText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  error: {
    color: '#ff4500',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 50,
  },
});