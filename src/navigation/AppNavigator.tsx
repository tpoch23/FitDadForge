// src/navigation/AppNavigator.tsx (UPDATED – hide tab bar on Program too)

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../features/home/HomeScreen';
import WorkoutScreen from '../features/workout/WorkoutScreen';
import ProgramScreen from '../features/program/ProgramScreen';
import HistoryScreen from '../features/history/HistoryScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Workout') iconName = focused ? 'barbell' : 'barbell-outline';
          else if (route.name === 'Program') iconName = focused ? 'calendar' : 'calendar-outline';
          else if (route.name === 'History') iconName = focused ? 'trophy' : 'trophy-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ff4500',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ tabBarStyle: { display: 'none' } }}
      />
      <Tab.Screen name="Workout" component={WorkoutScreen} />
      <Tab.Screen 
        name="Program" 
        component={ProgramScreen}
        options={{ tabBarStyle: { display: 'none' } }} // Hide tab bar on Program screen
      />
      <Tab.Screen name="History" component={HistoryScreen} />
    </Tab.Navigator>
  );
}