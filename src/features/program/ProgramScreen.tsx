// src/features/program/ProgramScreen.tsx (FULL – Compact, fits, back button)

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useUserStore } from '../../stores/useUserStore';
import { PROGRAM } from '../../data/program';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { useRef } from 'react';

export default function ProgramScreen() {
  const navigation = useNavigation<any>();
  const videoRef = useRef<Video>(null);
  const { currentPhase, currentWeek, currentSession, setCurrentPhase, setCurrentWeek, setCurrentSession } = useUserStore();

  const handlePhasePress = (phase: number) => {
    setCurrentPhase(phase);
  };

  const handleWeekPress = (week: number) => {
    setCurrentWeek(week);
  };

  const handleSessionPress = (sessionIndex: number) => {
    setCurrentSession(sessionIndex);
    navigation.navigate('Workout', { phase: currentPhase, sessionIndex });
  };

  const handleBackToHome = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={require('../../../assets/fire.mp4')}
        rate={1.0}
        volume={0}
        isMuted
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        style={styles.backgroundVideo}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackToHome}>
          <Ionicons name="arrow-back" size={20} color="#ff4500" />
          <Text style={styles.backText}>Barracks</Text>
        </TouchableOpacity>

        <Text style={styles.title}>12-Week Forge</Text>

        <View style={styles.phaseGrid}>
          {PROGRAM.map((phase, phaseIndex) => (
            <View key={phaseIndex} style={styles.phaseRow}>
              <TouchableOpacity onPress={() => handlePhasePress(phaseIndex)}>
                <Text style={[styles.phaseLabel, currentPhase === phaseIndex && styles.highlightedPhase]}>
                  {phase.name}
                </Text>
              </TouchableOpacity>
              <View style={styles.weekButtons}>
                {[1, 2, 3, 4].map((week) => (
                  <TouchableOpacity
                    key={week}
                    style={[
                      styles.weekButton,
                      currentPhase === phaseIndex && currentWeek === week && styles.highlightedWeek,
                    ]}
                    onPress={() => {
                      handlePhasePress(phaseIndex);
                      handleWeekPress(week);
                    }}
                  >
                    <Text style={styles.weekText}>W{week}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.sessionsTitle}>This Week's Battles</Text>
        <View style={styles.sessionsGrid}>
          {PROGRAM[currentPhase].sessionNames.map((name, index) => {
            const isPush = index % 2 === 0;
            const isCurrent = index === currentSession;

            return (
              <TouchableOpacity
                key={index}
                style={[styles.sessionCard, isCurrent && styles.highlightedSession]}
                onPress={() => handleSessionPress(index)}
              >
                <Text style={styles.sessionName}>{name}</Text>
                <Text style={styles.badgeText}>{isPush ? 'PUSH' : 'PULL'}</Text>
                {isCurrent && <Ionicons name="flame" size={28} color="#ff4500" style={styles.currentIcon} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundVideo: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  content: {
    padding: 8,
    paddingTop: 40,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 6,
    borderRadius: 10,
    zIndex: 10,
  },
  backText: {
    color: '#ff4500',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ff4500',
    textAlign: 'center',
    marginVertical: 8,
  },
  phaseGrid: {
    marginVertical: 4,
  },
  phaseRow: {
    marginBottom: 6,
  },
  phaseLabel: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 3,
    fontWeight: 'bold',
  },
  highlightedPhase: {
    color: '#ff4500',
    fontSize: 15,
  },
  weekButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekButton: {
    backgroundColor: '#333',
    padding: 6,
    borderRadius: 6,
    width: 42,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#555',
  },
  highlightedWeek: {
    backgroundColor: '#ff4500',
    borderColor: '#ff4500',
  },
  weekText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sessionsTitle: {
    fontSize: 18,
    color: '#ff4500',
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  sessionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sessionCard: {
    backgroundColor: 'rgba(40,40,40,0.9)',
    padding: 10,
    borderRadius: 12,
    width: '48%',
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#555',
    position: 'relative',
  },
  highlightedSession: {
    borderColor: '#ff4500',
    shadowColor: '#ff4500',
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  sessionName: {
    fontSize: 13,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  badgeText: {
    color: '#ff4500',
    fontSize: 12,
    fontWeight: 'bold',
  },
  currentIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
});