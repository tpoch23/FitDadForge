// src/features/home/HomeScreen.tsx (FULL – Border around anvil button fixed to fit tightly, nothing else changed)

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Image, Alert, Dimensions } from 'react-native';
import { getRandomQuote } from '../../data/quotes';
import { useUserStore } from '../../stores/useUserStore';
import { useNavigation } from '@react-navigation/native';
import { Audio, Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { userName, dadYear, completeOnboarding } = useUserStore();
  const quote = getRandomQuote();
  const videoRef = useRef<Video>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [inputName, setInputName] = useState('');
  const [inputYear, setInputYear] = useState('');

  useEffect(() => {
    if (!userName) {
      setModalVisible(true);
    }
  }, [userName]);

  const handleOnboardingSubmit = () => {
    if (!inputName.trim() || !inputYear.trim() || isNaN(Number(inputYear))) {
      Alert.alert('Invalid Input', 'Please enter your name and a valid year.');
      return;
    }
    completeOnboarding(inputName.trim(), Number(inputYear));
    setModalVisible(false);
  };

  const playAnvilSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../../../assets/anvil-strike.mp3')
    );
    await sound.playAsync();
  };

  const handleEnterForge = () => {
    playAnvilSound();
    navigation.navigate('Program');
  };

  return (
    <View style={styles.container}>
      {/* Realistic Smoke Background */}
      <Video
        ref={videoRef}
        source={require('../../../assets/smoke.mp4')}
        rate={1.0}
        volume={0}
        isMuted
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        style={styles.smokeBackground}
      />

      <View style={styles.contentOverlay}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image source={require('../../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        </View>

        {/* Personalized Greeting */}
        {userName && dadYear && (
          <Text style={styles.greeting}>
            Welcome back, {userName}{'\n'}
            <Text style={styles.dadEst}>Dad est. {dadYear}</Text>
          </Text>
        )}

        {/* Quote – Smaller */}
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>"{quote.text}"</Text>
          <Text style={styles.quoteAuthor}>— {quote.author}</Text>
        </View>

        {/* BADASS ANVIL VIDEO BUTTON with Tight Border */}
        <TouchableOpacity style={styles.anvilButton} onPress={handleEnterForge}>
          <Text style={styles.enterText}>ENTER HERE</Text>
          <View style={styles.anvilVideoContainer}>
            <Video
              source={require('../../../assets/anvil-button.mp4')}
              rate={1.0}
              volume={0}
              isMuted
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
              isLooping
              style={styles.anvilVideo}
            />
          </View>
        </TouchableOpacity>

        {/* Secondary Buttons – Smaller */}
        <View style={styles.secondaryButtonsColumn}>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('History')}>
            <Ionicons name="book" size={30} color="#ff4500" />
            <View style={styles.secondaryTextColumn}>
              <Text style={styles.secondaryButtonText}>Forge Ledger</Text>
              <Text style={styles.secondarySubtext}>(Battle & Workout Records)</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('History')}>
            <Ionicons name="military-tech" size={30} color="#ff4500" />
            <View style={styles.secondaryTextColumn}>
              <Text style={styles.secondaryButtonText}>Forge Medals</Text>
              <Text style={styles.secondarySubtext}>(Victories, PRs, Total Forged)</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Onboarding Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Welcome to FitDadForge</Text>
            <Text style={styles.modalSubtitle}>Let's personalize your journey</Text>

            <TextInput style={styles.input} placeholder="Your Name" placeholderTextColor="#999" value={inputName} onChangeText={setInputName} autoFocus />
            <TextInput style={styles.input} placeholder="Year You Became a Dad (e.g., 2015)" placeholderTextColor="#999" value={inputYear} onChangeText={setInputYear} keyboardType="numeric" />

            <TouchableOpacity style={styles.submitButton} onPress={handleOnboardingSubmit}>
              <Text style={styles.submitButtonText}>Begin Forging</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  smokeBackground: {
    position: 'absolute',
    width: '100%',
    height: height + 200,
    top: 0,
    left: 0,
    opacity: 0.8,
  },
  contentOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 60,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 300,
    shadowColor: '#ff4500',
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 30,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff4500',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowRadius: 8,
  },
  dadEst: {
    fontSize: 22,
    fontWeight: 'normal',
    color: '#fff',
  },
  quoteContainer: {
    backgroundColor: 'rgba(20,20,20,0.9)',
    padding: 20,
    borderRadius: 20,
    maxWidth: '90%',
    borderWidth: 2,
    borderColor: '#ff4500',
    shadowColor: '#ff4500',
    shadowOpacity: 0.7,
    shadowRadius: 15,
  },
  quoteText: {
    fontSize: 17,
    color: '#fff',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#ff4500',
    textAlign: 'right',
    marginTop: 8,
    fontWeight: 'bold',
  },
  anvilButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    height: 200,
    shadowColor: '#ff4500',
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 30,
  },
  enterText: {
    position: 'absolute',
    top: 10,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff4500',
    textShadowColor: '#000',
    textShadowRadius: 10,
  },
  anvilVideoContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#ff4500',
    overflow: 'hidden', // Fix border fit
  },
  anvilVideo: {
    width: '100%',
    height: '100%',
  },
  secondaryButtonsColumn: {
    width: '100%',
    alignItems: 'center',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(40,40,40,0.9)',
    padding: 15,
    borderRadius: 18,
    width: '80%',
    marginVertical: 8,
    borderWidth: 2,
    borderColor: '#ff4500',
    shadowColor: '#ff4500',
    shadowOpacity: 0.7,
    shadowRadius: 15,
  },
  secondaryTextColumn: {
    marginLeft: 15,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff4500',
  },
  secondarySubtext: {
    fontSize: 12,
    color: '#ccc',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#111',
    padding: 35,
    borderRadius: 25,
    width: '90%',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ff4500',
  },
  modalTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff4500',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 19,
    color: '#ccc',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#222',
    borderWidth: 2,
    borderColor: '#ff4500',
    borderRadius: 12,
    padding: 18,
    fontSize: 19,
    marginBottom: 25,
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#ff4500',
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 15,
    marginTop: 10,
  },
  submitButtonText: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
  },
});


