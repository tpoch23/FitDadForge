// src/features/home/HomeScreen.tsx (FULL – "Enter the Forge" button massively upgraded)

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Image, Alert, Dimensions, Animated } from 'react-native';
import { getRandomQuote } from '../../data/quotes';
import { useUserStore } from '../../stores/useUserStore';
import { useNavigation } from '@react-navigation/native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { userName, dadYear, completeOnboarding } = useUserStore();
  const quote = getRandomQuote();
  const videoRef = useRef<Video>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [inputName, setInputName] = useState('');
  const [inputYear, setInputYear] = useState('');

  // Pulse animation for badass feel
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

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

  return (
    <View style={styles.container}>
      {/* Realistic Smoke/Fire Background */}
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

        {/* Quote */}
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>"{quote.text}"</Text>
          <Text style={styles.quoteAuthor}>— {quote.author}</Text>
        </View>

        {/* BADASS ENTER THE FORGE BUTTON */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity style={styles.enterForgeButton} onPress={() => navigation.navigate('Program')}>
            <View style={styles.buttonContent}>
              <MaterialIcons name="local-fire-department" size={80} color="#000" />
              <Text style={styles.enterForgeText}>ENTER THE FORGE</Text>
              <Ionicons name="hammer" size={80} color="#000" />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Secondary Buttons */}
        <View style={styles.secondaryButtonsColumn}>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('History')}>
            <Ionicons name="book" size={35} color="#ff4500" />
            <View style={styles.secondaryTextColumn}>
              <Text style={styles.secondaryButtonText}>Forge Ledger</Text>
              <Text style={styles.secondarySubtext}>(Battle & Workout Records)</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('History')}>
            <MaterialIcons name="military-tech" size={35} color="#ff4500" />
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
    fontSize: 19,
    color: '#fff',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  quoteAuthor: {
    fontSize: 15,
    color: '#ff4500',
    textAlign: 'right',
    marginTop: 8,
    fontWeight: 'bold',
  },
  // BADASS BUTTON
  enterForgeButton: {
    backgroundColor: '#ff4500',
    paddingVertical: 30,
    paddingHorizontal: 50,
    borderRadius: 30,
    shadowColor: '#ff4500',
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 30,
    borderWidth: 4,
    borderColor: '#000',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  enterForgeText: {
    color: '#000',
    fontSize: 40,
    fontWeight: 'bold',
    marginHorizontal: 30,
    textShadowColor: '#fff',
    textShadowRadius: 10,
  },
  secondaryButtonsColumn: {
    width: '100%',
    alignItems: 'center',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(40,40,40,0.9)',
    padding: 18,
    borderRadius: 20,
    width: '90%',
    marginVertical: 10,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff4500',
  },
  secondarySubtext: {
    fontSize: 14,
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