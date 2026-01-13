import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Image, Modal, ScrollView, Share, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, Vibration, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LARGE_QUOTE_DATABASE } from './Quotes';

let MASTER_ARMORY = [
  // --- LOWER PULL ---
  { name: "Barbell Single Leg RDL", type: "Secondary", cat: "Lower Pull", reps: "8" },
  { name: "Hamstring Curls", type: "Secondary", cat: "Lower Pull", reps: "8" },
  { name: "Dumbbell RDL", type: "Secondary", cat: "Lower Pull", reps: "8" },
  { name: "Good Mornings", type: "Secondary", cat: "Lower Pull", reps: "8" },
  { name: "Hip Thrusts", type: "Accessory", cat: "Lower Pull", reps: "12" },
  { name: "Kettlebell Swings", type: "Accessory", cat: "Lower Pull", reps: "15" },
  { name: "Cable Pull-Throughs", type: "Accessory", cat: "Lower Pull", reps: "15" },
  { name: "Deficit Deadlift", type: "Secondary", cat: "Lower Pull", reps: "8" },
  { name: "Rack Pulls", type: "Secondary", cat: "Lower Pull", reps: "8" },
  { name: "Snatch Grip DL", type: "Secondary", cat: "Lower Pull", reps: "8" },
  { name: "Stiff Leg DL", type: "Secondary", cat: "Lower Pull", reps: "8" },
  { name: "B-Stance RDL", type: "Secondary", cat: "Lower Pull", reps: "8" },
  { name: "Zercher RDL", type: "Secondary", cat: "Lower Pull", reps: "8" },
  { name: "Pause Deadlift", type: "Secondary", cat: "Lower Pull", reps: "8" },
  { name: "Sumo RDL", type: "Secondary", cat: "Lower Pull", reps: "8" },
  { name: "Glute Ham Raise", type: "Secondary", cat: "Lower Pull", reps: "8" },
  { name: "Trap Bar RDL", type: "Secondary", cat: "Lower Pull", reps: "8" },
  { name: "Single Leg Ham Curl", type: "Accessory", cat: "Lower Pull", reps: "12" },
  { name: "Hyperextensions", type: "Accessory", cat: "Lower Pull", reps: "15" },
  { name: "Banded Good Mornings", type: "Accessory", cat: "Lower Pull", reps: "20" },
  { name: "Single Leg Hip Thrust", type: "Accessory", cat: "Lower Pull", reps: "12" },
  { name: "Frog Pumps", type: "Accessory", cat: "Lower Pull", reps: "30" },
  { name: "Cable Glute Kickbacks", type: "Accessory", cat: "Lower Pull", reps: "15" },
  { name: "Reverse Hyper", type: "Accessory", cat: "Lower Pull", reps: "15" },
  { name: "Seated Leg Curl", type: "Accessory", cat: "Lower Pull", reps: "15" },
  { name: "Slider Leg Curls", type: "Accessory", cat: "Lower Pull", reps: "12" },
  { name: "Nordic Curls", type: "Accessory", cat: "Lower Pull", reps: "8" },

  // --- LOWER PUSH ---
  { name: "Front Squat", type: "Secondary", cat: "Lower Push", reps: "8" },
  { name: "Goblet Squats", type: "Secondary", cat: "Lower Push", reps: "8" },
  { name: "Hack Squat", type: "Secondary", cat: "Lower Push", reps: "8" },
  { name: "Leg Press", type: "Secondary", cat: "Lower Push", reps: "8" },
  { name: "Bulgarian Split Squat", type: "Secondary", cat: "Lower Push", reps: "8" },
  { name: "Step Ups", type: "Secondary", cat: "Lower Push", reps: "8" },
  { name: "Safety Bar Squat", type: "Secondary", cat: "Lower Push", reps: "8" },
  { name: "Zercher Squat", type: "Secondary", cat: "Lower Push", reps: "8" },
  { name: "Box Squat", type: "Secondary", cat: "Lower Push", reps: "8" },
  { name: "Pause Squat", type: "Secondary", cat: "Lower Push", reps: "8" },
  { name: "Leg Extensions", type: "Accessory", cat: "Lower Push", reps: "15" },
  { name: "Walking Lunges", type: "Accessory", cat: "Lower Push", reps: "20 Steps" },
  { name: "Sissy Squat", type: "Accessory", cat: "Lower Push", reps: "12" },
  { name: "Calf Raises (Seated)", type: "Accessory", cat: "Lower Push", reps: "15" },
  { name: "Calf Raises (Standing)", type: "Accessory", cat: "Lower Push", reps: "15" },
  { name: "Copenhagen Plank", type: "Accessory", cat: "Lower Push", reps: "45s" },
  { name: "Adductor Machine", type: "Accessory", cat: "Lower Push", reps: "15" },
  { name: "Wall Sits", type: "Accessory", cat: "Lower Push", reps: "60s" },
  { name: "Reverse Lunges", type: "Accessory", cat: "Lower Push", reps: "12" },
  { name: "Lateral Lunges", type: "Accessory", cat: "Lower Push", reps: "12" },

  // --- UPPER PUSH ---
  { name: "Military Press", type: "Secondary", cat: "Upper Push", reps: "8" },
  { name: "Incline DB Press", type: "Secondary", cat: "Upper Push", reps: "8" },
  { name: "Close Grip Bench", type: "Secondary", cat: "Upper Push", reps: "8" },
  { name: "Dumbbell Lateral Raises", type: "Accessory", cat: "Upper Push", reps: "12" },
  { name: "Tricep Pushdowns", type: "Accessory", cat: "Upper Push", reps: "12" },
  { name: "Dips", type: "Accessory", cat: "Upper Push", reps: "AMRAP" },
  { name: "Floor Press", type: "Secondary", cat: "Upper Push", reps: "8" },
  { name: "Spoto Press", type: "Secondary", cat: "Upper Push", reps: "8" },
  { name: "Dumbbell Flat Press", type: "Secondary", cat: "Upper Push", reps: "8" },
  { name: "Arnold Press", type: "Secondary", cat: "Upper Push", reps: "8" },
  { name: "Push Press", type: "Secondary", cat: "Upper Push", reps: "8" },
  { name: "Machine Chest Press", type: "Secondary", cat: "Upper Push", reps: "8" },
  { name: "Landmine Press", type: "Secondary", cat: "Upper Push", reps: "8" },
  { name: "Pin Press", type: "Secondary", cat: "Upper Push", reps: "8" },
  { name: "Weighted Push-Ups", type: "Secondary", cat: "Upper Push", reps: "8" },
  { name: "Z-Press", type: "Secondary", cat: "Upper Push", reps: "8" },
  { name: "Skullcrushers", type: "Accessory", cat: "Upper Push", reps: "12" },
  { name: "Cable Flyes", type: "Accessory", cat: "Upper Push", reps: "15" },
  { name: "Overhead DB Extension", type: "Accessory", cat: "Upper Push", reps: "12" },
  { name: "Front Raises", type: "Accessory", cat: "Upper Push", reps: "15" },
  { name: "Diamond Pushups", type: "Accessory", cat: "Upper Push", reps: "AMRAP" },
  { name: "Rear Delt Flyes", type: "Accessory", cat: "Upper Push", reps: "15" },
  { name: "Kickbacks", type: "Accessory", cat: "Upper Push", reps: "15" },
  { name: "Plate Press-outs", type: "Accessory", cat: "Upper Push", reps: "15" },
  { name: "JM Press", type: "Accessory", cat: "Upper Push", reps: "10" },
  { name: "Deficit Push-Ups", type: "Accessory", cat: "Upper Push", reps: "AMRAP" },

  // --- UPPER PULL ---
  { name: "Pull-Ups", type: "Secondary", cat: "Upper Pull", reps: "8" },
  { name: "Lat Pulldowns", type: "Secondary", cat: "Upper Pull", reps: "8" },
  { name: "Face Pulls", type: "Accessory", cat: "Upper Pull", reps: "15" },
  { name: "Hammer Curls", type: "Accessory", cat: "Upper Pull", reps: "12" },
  { name: "Dumbbell Curls", type: "Accessory", cat: "Upper Pull", reps: "12" },
  { name: "Barbell Shrugs", type: "Accessory", cat: "Upper Pull/Trap", reps: "15" },
  { name: "Chest Supported Row", type: "Secondary", cat: "Upper Pull", reps: "8" },
  { name: "Meadows Row", type: "Secondary", cat: "Upper Pull", reps: "8" },
  { name: "Single Leg DB Row", type: "Secondary", cat: "Upper Pull", reps: "8" },
  { name: "Pendlay Row", type: "Secondary", cat: "Upper Pull", reps: "8" },
  { name: "T-Bar Row", type: "Secondary", cat: "Upper Pull", reps: "8" },
  { name: "Kroc Rows", type: "Secondary", cat: "Upper Pull", reps: "8" },
  { name: "Neutral Grip Pulldown", type: "Secondary", cat: "Upper Pull", reps: "8" },
  { name: "Seated Cable Row", type: "Secondary", cat: "Upper Pull", reps: "8" },
  { name: "Incline DB Row", type: "Secondary", cat: "Upper Pull", reps: "8" },
  { name: "Seal Row", type: "Secondary", cat: "Upper Pull", reps: "8" },
  { name: "Straight Arm Pulldowns", type: "Accessory", cat: "Upper Pull", reps: "12" },
  { name: "Reverse Pec Deck", type: "Accessory", cat: "Upper Pull", reps: "15" },
  { name: "Preacher Curls", type: "Accessory", cat: "Upper Pull", reps: "10" },
  { name: "Concentration Curls", type: "Accessory", cat: "Upper Pull", reps: "12" },
  { name: "Spider Curls", type: "Accessory", cat: "Upper Pull", reps: "12" },
  { name: "Face Pulls (High)", type: "Accessory", cat: "Upper Pull", reps: "15" },
  { name: "Single Arm Lat Pulldown", type: "Accessory", cat: "Upper Pull", reps: "12" },
  { name: "Dumbbell Shrugs", type: "Accessory", cat: "Upper Pull/Trap", reps: "15" },
  { name: "Incline DB Curls", type: "Accessory", cat: "Upper Pull", reps: "10" },
  { name: "Zottman Curls", type: "Accessory", cat: "Upper Pull", reps: "12" }
];

const EXERCISE_DB = [
  // --- PHASE 1 ---
  { name: "Barbell Bench Press", type: "Primary", reps: "10", weight: 135, day: 1, phase: 1, targetSets: 4, cat: "Upper Push" },
  { name: "Seated DB Shoulder Press", type: "Accessory", reps: "12", weight: 30, day: 1, phase: 1, targetSets: 3, cat: "Upper Push" },
  { name: "Tricep Pushdowns", type: "Accessory", reps: "15", weight: 40, day: 1, phase: 1, targetSets: 3, cat: "Upper Push" },
  { name: "DB Lat Raise", type: "Accessory", reps: "15", weight: 10, day: 1, phase: 1, targetSets: 3, cat: "Upper Push" },
  { name: "Push Ups", type: "Finisher", reps: "60", weight: 0, day: 1, phase: 1, targetSets: 1, cat: "Upper Push" },
  { name: "Plank", type: "Superset", circuitId: "core", reps: "60", weight: 0, day: 1, phase: 1, targetSets: 3, cat: "Core" },
  { name: "Russian Twist", type: "Superset", circuitId: "core", reps: "20", weight: 0, day: 1, phase: 1, targetSets: 3, cat: "Core" },
  { name: "Bicycle Crunches", type: "Superset", circuitId: "core", reps: "20", weight: 0, day: 1, phase: 1, targetSets: 3, cat: "Core" },

  { name: "Front Squat", type: "Primary", reps: "10", weight: 135, day: 2, phase: 1, targetSets: 3, cat: "Lower Push" },
  { name: "Bulgarian Split Squat", type: "Secondary", reps: "12", weight: 30, day: 2, phase: 1, targetSets: 3, cat: "Lower Push" },
  { name: "Goblet Squats", type: "Accessory", reps: "15", weight: 40, day: 2, phase: 1, targetSets: 3, cat: "Lower Push" },
  { name: "Calf Raises", type: "Accessory", reps: "15", weight: 10, day: 2, phase: 1, targetSets: 3, cat: "Lower Push" },
  { name: "Bodyweight Squats", type: "Finisher", reps: "60", weight: 0, day: 2, phase: 1, targetSets: 1, cat: "Lower Push" },
  { name: "Plank", type: "Superset", circuitId: "core", reps: "60", weight: 0, day: 2, phase: 1, targetSets: 3, cat: "Core" },
  { name: "Russian Twist", type: "Superset", circuitId: "core", reps: "20", weight: 0, day: 2, phase: 1, targetSets: 3, cat: "Core" },
  { name: "Bicycle Crunches", type: "Superset", circuitId: "core", reps: "20", weight: 0, day: 2, phase: 1, targetSets: 3, cat: "Core" },

  { name: "Barbell Rows", type: "Primary", reps: "10", weight: 135, day: 3, phase: 1, targetSets: 3, cat: "Upper Pull" },
  { name: "Lat Pulldowns (Wide Grip)", type: "Secondary", reps: "12", weight: 30, day: 3, phase: 1, targetSets: 3, cat: "Upper Pull" },
  { name: "Barbell Bicep Curls", type: "Accessory", reps: "15", weight: 40, day: 3, phase: 1, targetSets: 3, cat: "Upper Pull" },
  { name: "Face Pulls", type: "Accessory", reps: "15", weight: 10, day: 3, phase: 1, targetSets: 3, cat: "Upper Pull" },
  { name: "Inverted Rows", type: "Finisher", reps: "20", weight: 0, day: 3, phase: 1, targetSets: 1, cat: "Upper Pull" },
  { name: "Plank", type: "Superset", circuitId: "core", reps: "60", weight: 0, day: 3, phase: 1, targetSets: 3, cat: "Core" },
  { name: "Russian Twist", type: "Superset", circuitId: "core", reps: "20", weight: 0, day: 3, phase: 1, targetSets: 3, cat: "Core" },
  { name: "Bicycle Crunches", type: "Superset", circuitId: "core", reps: "20", weight: 0, day: 3, phase: 1, targetSets: 3, cat: "Core" },

  { name: "Conventional Deadlift", type: "Primary", reps: "10", weight: 135, day: 4, phase: 1, targetSets: 3, cat: "Lower Pull" },
  { name: "Single Leg Barbell RDL", type: "Secondary", reps: "12", weight: 30, day: 4, phase: 1, targetSets: 3, cat: "Lower Pull" },
  { name: "Stability Ball Leg Curls", type: "Accessory", reps: "15", weight: 40, day: 4, phase: 1, targetSets: 3, cat: "Lower Pull" },
  { name: "Glute Bridges", type: "Accessory", reps: "15", weight: 10, day: 4, phase: 1, targetSets: 3, cat: "Lower Pull" },
  { name: "Glute Bridges (Finisher)", type: "Finisher", reps: "30", weight: 0, day: 4, phase: 1, targetSets: 1, cat: "Lower Pull" },
  { name: "Plank", type: "Superset", circuitId: "core", reps: "60", weight: 0, day: 4, phase: 1, targetSets: 3, cat: "Core" },
  { name: "Russian Twist", type: "Superset", circuitId: "core", reps: "20", weight: 0, day: 4, phase: 1, targetSets: 3, cat: "Core" },
  { name: "Bicycle Crunches", type: "Superset", circuitId: "core", reps: "20", weight: 0, day: 4, phase: 1, targetSets: 3, cat: "Core" },

  // --- PHASE 2 ---
  { name: "Incline Barbell Bench Press", type: "Superset", circuitId: "push", reps: "10", weight: 115, day: 1, phase: 2, targetSets: 4, cat: "Upper Push" },
  { name: "Arnold Press", type: "Superset", circuitId: "push", reps: "10", weight: 25, day: 1, phase: 2, targetSets: 4, cat: "Upper Push" },
  { name: "Close Grip Barbell Press", type: "Secondary", reps: "12", weight: 115, day: 1, phase: 2, targetSets: 3, cat: "Upper Push" },
  { name: "DB Flyes", type: "Accessory", reps: "15", weight: 20, day: 1, phase: 2, targetSets: 3, cat: "Upper Push" },
  { name: "Plyometric Clap Push-ups", type: "Finisher", reps: "10", weight: 0, day: 1, phase: 2, targetSets: 3, cat: "Upper Push" },
  { name: "Side-Plank (Left)", type: "Superset", circuitId: "core", reps: "45", weight: 0, day: 1, phase: 2, targetSets: 3, cat: "Core" },
  { name: "Side-Plank (Right)", type: "Superset", circuitId: "core", reps: "45", weight: 0, day: 1, phase: 2, targetSets: 3, cat: "Core" },
  { name: "Hanging Leg Raises", type: "Superset", circuitId: "core", reps: "12", weight: 0, day: 1, phase: 2, targetSets: 3, cat: "Core" },
  { name: "Mountain Climbers", type: "Superset", circuitId: "core", reps: "30", weight: 0, day: 1, phase: 2, targetSets: 3, cat: "Core" },

  { name: "Landmine Squat", type: "Superset", circuitId: "legpush", reps: "10", weight: 115, day: 2, phase: 2, targetSets: 4, cat: "Lower Push" },
  { name: "Bulgarian Split Squats", type: "Superset", circuitId: "legpush", reps: "10", weight: 20, day: 2, phase: 2, targetSets: 4, cat: "Lower Push" },
  { name: "Walking Lunges", type: "Secondary", reps: "12", weight: 20, day: 2, phase: 2, targetSets: 3, cat: "Lower Push" },
  { name: "Calf Raises", type: "Accessory", reps: "15", weight: 20, day: 2, phase: 2, targetSets: 3, cat: "Lower Push" },
  { name: "Jump Squats", type: "Finisher", reps: "10", weight: 0, day: 2, phase: 2, targetSets: 3, cat: "Lower Push" },
  { name: "Side-Plank (Left)", type: "Superset", circuitId: "core", reps: "45", weight: 0, day: 2, phase: 2, targetSets: 3, cat: "Core" },
  { name: "Side-Plank (Right)", type: "Superset", circuitId: "core", reps: "45", weight: 0, day: 2, phase: 2, targetSets: 3, cat: "Core" },
  { name: "Hanging Leg Raises", type: "Superset", circuitId: "core", reps: "12", weight: 0, day: 2, phase: 2, targetSets: 3, cat: "Core" },
  { name: "Mountain Climbers", type: "Superset", circuitId: "core", reps: "30", weight: 0, day: 2, phase: 2, targetSets: 3, cat: "Core" },

  { name: "Wide-grip Pullups", type: "Superset", circuitId: "pull", reps: "10", weight: 115, day: 3, phase: 2, targetSets: 4, cat: "Upper Pull" },
  { name: "Seated Cable Rows", type: "Superset", circuitId: "pull", reps: "10", weight: 20, day: 3, phase: 2, targetSets: 4, cat: "Upper Pull" },
  { name: "Hammer Curls", type: "Secondary", reps: "15", weight: 20, day: 3, phase: 2, targetSets: 3, cat: "Upper Pull" },
  { name: "DB Rear Delt Flyes", type: "Accessory", reps: "15", weight: 10, day: 3, phase: 2, targetSets: 3, cat: "Upper Pull" },
  { name: "Renegade Rows", type: "Finisher", reps: "10", weight: 15, day: 3, phase: 2, targetSets: 3, cat: "Upper Pull" },
  { name: "Side-Plank (Left)", type: "Superset", circuitId: "core", reps: "45", weight: 0, day: 3, phase: 2, targetSets: 3, cat: "Core" },
  { name: "Side-Plank (Right)", type: "Superset", circuitId: "core", reps: "45", weight: 0, day: 3, phase: 2, targetSets: 3, cat: "Core" },
  { name: "Hanging Leg Raises", type: "Superset", circuitId: "core", reps: "12", weight: 0, day: 3, phase: 2, targetSets: 3, cat: "Core" },
  { name: "Mountain Climbers", type: "Superset", circuitId: "core", reps: "30", weight: 0, day: 3, phase: 2, targetSets: 3, cat: "Core" },

  { name: "Barbell Single Leg RDL", type: "Superset", circuitId: "legpull", reps: "10", weight: 115, day: 4, phase: 2, targetSets: 4, cat: "Lower Pull" },
  { name: "Barbell Hip Thrusts", type: "Superset", circuitId: "legpull", reps: "10", weight: 20, day: 4, phase: 2, targetSets: 4, cat: "Lower Pull" },
  { name: "Good Mornings", type: "Secondary", reps: "12", weight: 20, day: 4, phase: 2, targetSets: 3, cat: "Lower Pull" },
  { name: "Nordic Curls", type: "Finisher", reps: "8", weight: 0, day: 4, phase: 2, targetSets: 3, cat: "Lower Pull" },
  { name: "Side-Plank (Left)", type: "Superset", circuitId: "core", reps: "45", weight: 0, day: 4, phase: 2, targetSets: 3, cat: "Core" },
  { name: "Side-Plank (Right)", type: "Superset", circuitId: "core", reps: "45", weight: 0, day: 4, phase: 2, targetSets: 3, cat: "Core" },
  { name: "Hanging Leg Raises", type: "Superset", circuitId: "core", reps: "12", weight: 0, day: 4, phase: 2, targetSets: 3, cat: "Core" },
  { name: "Mountain Climbers", type: "Superset", circuitId: "core", reps: "30", weight: 0, day: 4, phase: 2, targetSets: 3, cat: "Core" },

  // --- PHASE 3 ---
  { name: "Decline Barbell Bench Press", type: "Primary", reps: "10", weight: 135, day: 1, phase: 3, targetSets: 4, cat: "Upper Push" },
  { name: "Standing OH press", type: "Primary", reps: "10", weight: 95, day: 1, phase: 3, targetSets: 4, cat: "Upper Push" },
  { name: "Skull Crushers", type: "Secondary", reps: "12", weight: 50, day: 1, phase: 3, targetSets: 3, cat: "Upper Push" },
  { name: "DB Front Raises", type: "Secondary", reps: "15", weight: 10, day: 1, phase: 3, targetSets: 3, cat: "Upper Push" },
  { name: "Diamond Pushups", type: "Finisher", reps: "10", weight: 0, day: 1, phase: 3, targetSets: 3, cat: "Upper Push" },
  { name: "Ab wheel rollouts", type: "Superset", circuitId: "core", reps: "12", weight: 0, day: 1, phase: 3, targetSets: 3, cat: "Core" },
  { name: "Reverse Crunches", type: "Superset", circuitId: "core", reps: "15", weight: 0, day: 1, phase: 3, targetSets: 3, cat: "Core" },
  { name: "Flutter Kicks", type: "Superset", circuitId: "core", reps: "30", weight: 0, day: 1, phase: 3, targetSets: 3, cat: "Core" },

  { name: "OH squats", type: "Primary", reps: "10", weight: 95, day: 2, phase: 3, targetSets: 4, cat: "Lower Push" },
  { name: "Goblet Squats", type: "Primary", reps: "12", weight: 50, day: 2, phase: 3, targetSets: 4, cat: "Lower Push" },
  { name: "Pistol Squats", type: "Secondary", reps: "10", weight: 0, day: 2, phase: 3, targetSets: 3, cat: "Lower Push" },
  { name: "Tibialis Raises", type: "Secondary", reps: "20", weight: 0, day: 2, phase: 3, targetSets: 3, cat: "Lower Push" },
  { name: "Box jumps", type: "Superset", circuitId: "combat", reps: "10", weight: 1, day: 2, phase: 3, targetSets: 3, cat: "Lower Push" },
  { name: "Curtsy Lunges", type: "Superset", circuitId: "combat", reps: "10", weight: 1, day: 2, phase: 3, targetSets: 3, cat: "Lower Push" },
  { name: "Ab wheel rollouts", type: "Superset", circuitId: "core", reps: "12", weight: 0, day: 2, phase: 3, targetSets: 3, cat: "Core" },
  { name: "Reverse Crunches", type: "Superset", circuitId: "core", reps: "15", weight: 0, day: 2, phase: 3, targetSets: 3, cat: "Core" },
  { name: "Flutter Kicks", type: "Superset", circuitId: "core", reps: "30", weight: 0, day: 2, phase: 3, targetSets: 3, cat: "Core" },

  { name: "Chin ups", type: "Primary", reps: "10", weight: 0, day: 3, phase: 3, targetSets: 4, cat: "Upper Pull" },
  { name: "One arm DB rows", type: "Primary", reps: "12", weight: 40, day: 3, phase: 3, targetSets: 4, cat: "Upper Pull" },
  { name: "Concentraiton curls", type: "Secondary", reps: "15", weight: 20, day: 3, phase: 3, targetSets: 3, cat: "Upper Pull" },
  { name: "Rope Race pulls", type: "Secondary", reps: "20", weight: 30, day: 3, phase: 3, targetSets: 3, cat: "Upper Pull" },
  { name: "Straight arm pulldowns", type: "Superset", circuitId: "combat", reps: "10", weight: 40, day: 3, phase: 3, targetSets: 3, cat: "Upper Pull" },
  { name: "Upright rows", type: "Superset", circuitId: "combat", reps: "10", weight: 45, day: 3, phase: 3, targetSets: 3, cat: "Upper Pull" },
  { name: "Ab wheel rollouts", type: "Superset", circuitId: "core", reps: "12", weight: 0, day: 3, phase: 3, targetSets: 3, cat: "Core" },
  { name: "Reverse Crunches", type: "Superset", circuitId: "core", reps: "15", weight: 0, day: 3, phase: 3, targetSets: 3, cat: "Core" },
  { name: "Flutter Kicks", type: "Superset", circuitId: "core", reps: "30", weight: 0, day: 3, phase: 3, targetSets: 3, cat: "Core" },

  { name: "Sumo Deadlift", type: "Primary", reps: "10", weight: 185, day: 4, phase: 3, targetSets: 4, cat: "Lower Pull" },
  { name: "single leg RDLS DB", type: "Primary", reps: "12", weight: 20, day: 4, phase: 3, targetSets: 4, cat: "Lower Pull" },
  { name: "Glute-Ham Raises", type: "Secondary", reps: "12", weight: 0, day: 4, phase: 3, targetSets: 3, cat: "Lower Pull" },
  { name: "Frog Pumps", type: "Secondary", reps: "20", weight: 0, day: 4, phase: 3, targetSets: 3, cat: "Lower Pull" },
  { name: "Stability ball leg curls", type: "Superset", circuitId: "combat", reps: "10", weight: 1, day: 4, phase: 3, targetSets: 3, cat: "Lower Pull" },
  { name: "Clamshells", type: "Superset", circuitId: "combat", reps: "10", weight: 1, day: 4, phase: 3, targetSets: 3, cat: "Lower Pull" },
  { name: "Ab wheel rollouts", type: "Superset", circuitId: "core", reps: "12", weight: 0, day: 4, phase: 3, targetSets: 3, cat: "Core" },
  { name: "Reverse Crunches", type: "Superset", circuitId: "core", reps: "15", weight: 0, day: 4, phase: 3, targetSets: 3, cat: "Core" },
  { name: "Flutter Kicks", type: "Superset", circuitId: "core", reps: "30", weight: 0, day: 4, phase: 3, targetSets: 3, cat: "Core" }
];

export default function App() {
  const [screen, setScreen] = useState('loading'); 
  const [userData, setUserData] = useState({ 
    name: '', dadSince: '', xp: 0, pbWeights: {}, totalVolume: 0, totalTrainingMinutes: 0, currentStreak: 0, history: {}, currentPhase: 1, currentWeek: 1
  });
  const [workout, setWorkout] = useState([]);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [activeIdx, setActiveIdx] = useState(null);
  const [timer, setTimer] = useState({ visible: false, seconds: 90 });
  const [activeCoreTimer, setActiveCoreTimer] = useState({ active: false, seconds: 45, label: '' });
  const [vaultModal, setVaultModal] = useState(false);
  const [ledgerModal, setLedgerModal] = useState(false);
  const [armoryModal, setArmoryModal] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [currentQuote, setCurrentQuote] = useState(LARGE_QUOTE_DATABASE[0]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // PR Tracker State
  const [newPR, setNewPR] = useState({ exercise: '', weight: '' });

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const estPulseAnim = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets();

  const deployments = {
    1: [
      { id: 1, title: "BREACH THE PERIMETER", icon: "💥", focus: "UPPER PUSH / CORE" },
      { id: 2, title: "GROUND ASSAULT", icon: "🚜", focus: "LOWER PUSH / CORE" },
      { id: 3, title: "STEALTH EXTRACTION", icon: "🚁", focus: "UPPER PULL / CORE" },
      { id: 4, title: "HEAVY REINFORCEMENT", icon: "🛡️", focus: "LOWER PULL / CORE" }
    ],
    2: [
      { id: 1, title: "VANGUARD STRIKE", icon: "⚔️", focus: "UPPER PUSH / CORE" },
      { id: 2, title: "STEEL WALL", icon: "🧱", focus: "LOWER PUSH / CORE" },
      { id: 3, title: "RAPID RECOVERY", icon: "⚡", focus: "UPPER PULL / CORE" },
      { id: 4, title: "IRON FOUNDATION", icon: "🏗️", focus: "LOWER PULL / CORE" }
    ],
    3: [
      { id: 1, title: "TACTICAL BREACH", icon: "💣", focus: "UPPER PUSH / CORE" },
      { id: 2, title: "HEAVY ARTILLERY", icon: "🔭", focus: "LOWER PUSH / CORE" },
      { id: 3, title: "RECON STRIKE", icon: "🎯", focus: "UPPER PULL / CORE" },
      { id: 4, title: "FINAL DEFENSE", icon: "🏯", focus: "LOWER PULL / CORE" }
    ]
  };

  const getDadRank = (xp) => {
    let lvl = xp < 1000 ? 0 : Math.floor(Math.log(xp / 1000) / Math.log(1.5));
    if (lvl < 0) lvl = 0;
    const currentLvlXP = 1000 * Math.pow(1.5, lvl);
    const nextLvlXP = 1000 * Math.pow(1.5, lvl + 1);
    const progress = ((xp - currentLvlXP) / (nextLvlXP - currentLvlXP)) * 100;
    let rank = "SLEEP-DEPRIVED RECRUIT";
    if (lvl >= 5) rank = "BACKYARD GENERAL";
    if (lvl >= 15) rank = "MASTER OF THE GRILL";
    if (lvl >= 30) rank = "PATRIARCH OF IRON";
    if (lvl >= 50) rank = "THE FOUNDING FATHER";
    return { lvl, rank, progress: Math.max(0, progress) };
  };

  const calculateStreak = (history) => {
    const dates = Object.keys(history).sort().reverse();
    if (dates.length === 0) return 0;
    let streak = 0;
    let curr = new Date();
    curr.setHours(0,0,0,0);
    
    let checkDate = new Date(curr);
    if (!history[checkDate.toISOString().split('T')[0]]) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (history[dateStr]) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  useEffect(() => {
    const loadData = async () => {
      const savedUser = await AsyncStorage.getItem('fitdad_user_data');
      if (savedUser) { 
        let parsed = JSON.parse(savedUser);
        if (!parsed.history) parsed.history = {};
        if (!parsed.pbWeights) parsed.pbWeights = {};
        if (!parsed.currentWeek) parsed.currentWeek = 1;
        if (parsed.totalVolume === undefined) parsed.totalVolume = 0;
        if (parsed.totalTrainingMinutes === undefined) parsed.totalTrainingMinutes = 0;
        parsed.currentStreak = calculateStreak(parsed.history);
        setUserData(parsed); setSelectedWeek(parsed.currentWeek); setScreen('home'); 
      }
      else setScreen('onboarding');
    };
    loadData();
  }, []);

  const saveToStorage = async (data) => {
    data.currentStreak = calculateStreak(data.history);
    await AsyncStorage.setItem('fitdad_user_data', JSON.stringify(data));
    setUserData(data);
  };

  const handleAddPR = () => {
    if (newPR.exercise && newPR.weight) {
      const updatedPBs = { ...userData.pbWeights, [newPR.exercise]: parseInt(newPR.weight) };
      saveToStorage({ ...userData, pbWeights: updatedPBs });
      setNewPR({ exercise: '', weight: '' });
      Alert.alert("RECORD LOGGED", `${newPR.exercise} updated to ${newPR.weight} LB.`);
    }
  };

  useEffect(() => {
    let interval;
    if (timer.visible && timer.seconds > 0) interval = setInterval(() => setTimer(t => ({ ...t, seconds: t.seconds - 1 })), 1000);
    else if (timer.seconds === 0) { Vibration.vibrate(800); setTimer({ visible: false, seconds: 90 }); }
    return () => clearInterval(interval);
  }, [timer.visible, timer.seconds]);

  useEffect(() => {
    let interval;
    if (activeCoreTimer.active && activeCoreTimer.seconds > 0) {
      interval = setInterval(() => setActiveCoreTimer(t => ({ ...t, seconds: t.seconds - 1 })), 1000);
    } else if (activeCoreTimer.seconds === 0) {
      Vibration.vibrate([0, 500, 100, 500]);
      setActiveCoreTimer({ active: false, seconds: 0, label: '' });
    }
    return () => clearInterval(interval);
  }, [activeCoreTimer.active, activeCoreTimer.seconds]);

  const loadWorkout = (dayNum) => {
    const session = EXERCISE_DB.filter(ex => ex.day === dayNum && ex.phase === userData.currentPhase).map(ex => {
      const savedWeight = userData.pbWeights[ex.name] || ex.weight;
      return { ...ex, weight: savedWeight, setsDone: 0, completed: false };
    });
    setWorkout(session); 
    setWorkoutStartTime(Date.now());
    setScreen('active-workout');
  };

  const updateWeight = (index, delta) => {
    let nw = [...workout];
    nw[index].weight = Math.max(0, (nw[index].weight || 0) + delta);
    setWorkout(nw);
  };

  const startCoreTimer = (label, seconds) => {
    setActiveCoreTimer({ active: true, seconds, label });
  };

  const logSet = (index) => {
    Vibration.vibrate(60);
    let nw = [...workout];
    const targetCircuitId = nw[index].circuitId;
    
    nw.forEach((item, idx) => {
      if (item.type === "Superset" && item.circuitId === targetCircuitId) {
        nw[idx].setsDone += 1;
      }
    });
    
    if (nw[index].type !== "Superset") {
      nw[index].setsDone += 1;
    }
    
    setWorkout(nw);
    
    if (nw[index].setsDone >= nw[index].targetSets) setActiveIdx(null);
    else { 
      setCurrentQuote(LARGE_QUOTE_DATABASE[Math.floor(Math.random() * LARGE_QUOTE_DATABASE.length)]); 
      setTimer({ visible: true, seconds: 90 }); 
    }
  };

  const sharePB = async (records) => {
    const message = `⚔️ NEW PERSONAL RECORDS ⚔️\n\n${records.join('\n')}\n\nForged in steel with #FitDadForge ⚒️`;
    try {
        await Share.share({ message });
    } catch (error) {
        Alert.alert("Error", "Could not share at this time.");
    }
  };

  const finishWorkout = () => {
    const dateStr = new Date().toISOString().split('T')[0];
    const newHistory = { ...userData.history };
    const newPBs = { ...userData.pbWeights };
    let sessionVolume = 0;
    let recordsBroken = [];

    workout.forEach(ex => {
      const reps = parseInt(ex.reps) || 10;
      sessionVolume += (ex.weight * reps * ex.setsDone);

      const oldPB = userData.pbWeights[ex.name] || 0;
      if (ex.weight > oldPB && ex.weight > 0) {
        newPBs[ex.name] = ex.weight;
        recordsBroken.push(`${ex.name}: ${ex.weight} LB`);
      }
    });

    if (recordsBroken.length > 0) {
      Animated.sequence([
        Animated.timing(estPulseAnim, { toValue: 1.5, duration: 300, useNativeDriver: true }),
        Animated.timing(estPulseAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(estPulseAnim, { toValue: 1.5, duration: 300, useNativeDriver: true }),
        Animated.timing(estPulseAnim, { toValue: 1, duration: 300, useNativeDriver: true })
      ]).start();
    }

    const sessionDuration = Math.round((Date.now() - workoutStartTime) / 60000);
    newHistory[dateStr] = { type: 'workout', data: workout, xp: 250, volume: sessionVolume, duration: sessionDuration };
    
    let newWeek = userData.currentWeek;
    if (workout[0].day === 4) {
        newWeek = Math.min(12, userData.currentWeek + 1);
    }
    let newPhase = newWeek > 8 ? 3 : (newWeek > 4 ? 2 : 1);

    const newData = { 
      ...userData, 
      xp: userData.xp + 250, 
      history: newHistory, 
      pbWeights: newPBs, 
      currentWeek: newWeek, 
      currentPhase: newPhase,
      totalVolume: userData.totalVolume + sessionVolume,
      totalTrainingMinutes: userData.totalTrainingMinutes + sessionDuration
    };
    saveToStorage(newData);

    if (recordsBroken.length > 0) {
        Vibration.vibrate([0, 200, 100, 200, 100, 500]);
        Alert.alert(
            "⚔️ NEW RECORDS ⚔️",
            `Benchmarks Shattered:\n\n${recordsBroken.join('\n')}`,
            [
                { text: "SHARE ACHIEVEMENT", onPress: () => { sharePB(recordsBroken); setScreen('home'); } },
                { text: "FORGED IN STEEL", onPress: () => setScreen('home') }
            ]
        );
    } else {
        setScreen('home');
    }
  };

  const addRestDay = (date = new Date().toISOString().split('T')[0]) => {
    if (userData.history[date]) return;
    const newHistory = { ...userData.history };
    newHistory[date] = { type: 'rest', xp: 50 };
    const newData = { ...userData, xp: userData.xp + 50, history: newHistory };
    saveToStorage(newData);
    Alert.alert("REST LOGGED", "Recovery is a weapon. Streak maintained.");
  };

  const renderCalendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    for(let i=0; i<firstDay.getDay(); i++) days.push(null);
    for(let i=1; i<=lastDay.getDate(); i++) {
        const d = new Date(year, month, i);
        days.push(d.toISOString().split('T')[0]);
    }

    const monthName = today.toLocaleString('default', { month: 'long' }).toUpperCase();

    return (
      <View style={styles.calendarContainer}>
        <Text style={styles.libertyTitle}>{monthName} {year} DEPLOYMENT LOG</Text>
        <View style={styles.calendarGrid}>
          {['S','M','T','W','T','F','S'].map((day, i) => (
            <View key={i} style={styles.calendarHeaderDay}><Text style={styles.calendarHeaderText}>{day}</Text></View>
          ))}
          {days.map((d, i) => {
            if (!d) return <View key={i} style={styles.calendarDayEmpty} />;
            const record = userData.history[d];
            const isSelected = selectedDate === d;
            return (
              <TouchableOpacity key={d} 
                style={[styles.calendarDay, isSelected && {borderColor: '#d97706', backgroundColor: '#292524'}]} 
                onPress={() => setSelectedDate(d)}>
                <Text style={styles.dateNumText}>{d.split('-')[2]}</Text>
                <Text style={styles.dateIcon}>{record?.type === 'workout' ? '⚒️' : (record?.type === 'rest' ? '☕' : '')}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.dateDetailBox}>
          <Text style={styles.detailDateText}>{selectedDate}</Text>
          {userData.history[selectedDate] ? (
            <View>
              <Text style={styles.detailStatusText}>{userData.history[selectedDate].type === 'workout' ? 'MISSION COMPLETE' : 'REST & RECOVERY'}</Text>
              {userData.history[selectedDate].data && userData.history[selectedDate].data.map((ex, i) => (
                <Text key={i} style={styles.detailExText}>• {ex.name}</Text>
              ))}
            </View>
          ) : (
            <View>
              <Text style={styles.detailStatusText}>NO RECORD FOUND</Text>
              <TouchableOpacity style={styles.restBtn} onPress={() => addRestDay(selectedDate)}>
                <Text style={styles.restBtnText}>LOG AS REST DAY (+50 XP)</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  if (screen === 'loading') return <View style={styles.container}><Text style={styles.libertyTitle}>FORGING...</Text></View>;

  if (screen === 'onboarding') return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#1a1816" />
      <SafeAreaView style={styles.container}>
        <View style={styles.parchmentModal}>
          <Text style={styles.libertyTitle}>WHAT IS YOUR NAME, DAD?</Text>
          <TextInput style={styles.input} onChangeText={t => setUserData({...userData, name: t})}/>
          <Text style={styles.libertyTitle}>DATE YOU BECAME A DAD?</Text>
          <TextInput style={styles.input} placeholder="MM/DD/YYYY" placeholderTextColor="#444" onChangeText={t => setUserData({...userData, dadSince: t})}/>
          <TouchableOpacity style={styles.hammerBtn} onPress={() => saveToStorage({...userData, history: {}, currentWeek: 1, currentPhase: 1}).then(() => setScreen('home'))}><Text style={styles.hammerBtnText}>FORGE</Text></TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );

  if (screen === 'home') {
    const stats = getDadRank(userData.xp);
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#1a1816" />
        <SafeAreaView style={styles.container}>
          <View style={styles.sealHeader}>
            <Image 
              source={require('../assets/icon.png')} 
              style={styles.headerWatermark}
              resizeMode="contain"
            />
            <Text style={styles.brandLogo}>⚒ FITDADFORGE ⚒</Text>
            <Text style={styles.dadName}>{userData.name?.toUpperCase()}</Text>
            <Animated.Text style={[styles.estLabel, { transform: [{ scale: estPulseAnim }] }]}>DAD EST. {userData.dadSince}</Animated.Text>
            <Text style={styles.rankBadge}>{stats.rank} (LVL {stats.lvl})</Text>
            <View style={styles.xpBarContainer}><Animated.View style={[styles.xpBarFill, { width: `${stats.progress}%`, opacity: pulseAnim }]} /></View>
            <View style={styles.streakStrip}>
               <Text style={styles.streakText}>🔥 {userData.currentStreak} DAY STREAK</Text>
               <Text style={styles.streakText}>⚖️ {userData.totalVolume.toLocaleString()} LB MOVED</Text>
            </View>
          </View>
          
          <ScrollView style={{padding: 20}}>
            <TouchableOpacity style={styles.forgeActionBtn} onPress={() => setScreen('blueprint')}>
              <View>
                <Text style={styles.forgeBtnText}>ENTER THE FORGE</Text>
                <Text style={styles.forgeBtnSub}>READY DEPLOYMENT MAP</Text>
              </View>
              <Text style={styles.forgeBtnArrow}>⮕</Text>
            </TouchableOpacity>

            {/* QUICK PR TRACKER */}
            <Text style={styles.libertyTitle}>LOG A BENCHMARK</Text>
            <View style={[styles.ironCard, { borderLeftColor: '#fbbf24' }]}>
               <TextInput 
                  style={styles.input} 
                  placeholder="EXERCISE (E.G. BENCH PRESS)" 
                  placeholderTextColor="#444" 
                  value={newPR.exercise}
                  onChangeText={t => setNewPR({...newPR, exercise: t})}
                />
                <TextInput 
                  style={styles.input} 
                  placeholder="WEIGHT (LB)" 
                  placeholderTextColor="#444" 
                  keyboardType="numeric"
                  value={newPR.weight}
                  onChangeText={t => setNewPR({...newPR, weight: t})}
                />
                <TouchableOpacity style={styles.hammerBtn} onPress={handleAddPR}>
                  <Text style={styles.hammerBtnText}>LOG RECORD</Text>
                </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.homeRestBtn} onPress={() => addRestDay()}>
                <Text style={styles.homeRestBtnText}>☕ LOG REST DAY</Text>
            </TouchableOpacity>

            <View style={styles.utilityGrid}>
              <TouchableOpacity style={[styles.utilityBtn, styles.highPopBtn]} onPress={() => setVaultModal(true)}>
                <Text style={[styles.utilIcon, {color: '#fbbf24'}]}>🗄️</Text>
                <Text style={[styles.utilLabel, {color: '#fbbf24'}]}>ARCHIVE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.utilityBtn, styles.highPopBtn]} onPress={() => setLedgerModal(true)}>
                <Text style={[styles.utilIcon, {color: '#fbbf24'}]}>🛖</Text>
                <Text style={[styles.utilLabel, {color: '#fbbf24'}]}>BARRACKS</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.utilityBtn, styles.highPopBtn]} onPress={() => setArmoryModal(true)}>
                <Text style={[styles.utilIcon, {color: '#fbbf24'}]}>⚔️</Text>
                <Text style={[styles.utilLabel, {color: '#fbbf24'}]}>ARMORY</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.quoteCard}><Text style={styles.quoteText}>{currentQuote}</Text></View>
          </ScrollView>

          <Modal visible={vaultModal} animationType="slide">
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View style={styles.battleHeader}>
                    <Text style={styles.battleTitle}>THE ARCHIVE</Text>
                    <TouchableOpacity onPress={() => setVaultModal(false)}>
                        <Text style={styles.abortText}>CLOSE</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView>{renderCalendar()}</ScrollView>
            </View>
          </Modal>

          <Modal visible={armoryModal} animationType="slide">
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View style={styles.battleHeader}>
                    <Text style={styles.battleTitle}>EXERCISE ARMORY</Text>
                    <TouchableOpacity onPress={() => setArmoryModal(false)}>
                        <Text style={styles.abortText}>CLOSE</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    {MASTER_ARMORY.map((ex, i) => (
                        <View key={i} style={styles.ironCard}>
                            <Text style={styles.exerciseName}>{ex.name}</Text>
                            <Text style={styles.tacticalDesc}>{ex.cat} | {ex.type}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
          </Modal>

          <Modal visible={ledgerModal} animationType="slide">
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View style={styles.battleHeader}>
                    <Text style={styles.battleTitle}>THE BARRACKS COMMAND</Text>
                    <TouchableOpacity onPress={() => setLedgerModal(false)}>
                        <Text style={styles.abortText}>CLOSE</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView style={{padding: 20}}>
                   <View style={styles.ledgerStatsHeader}>
                      <View style={styles.ledgerStatBox}>
                        <Text style={styles.ledgerStatVal}>{userData.totalVolume.toLocaleString()}</Text>
                        <Text style={styles.ledgerStatLab}>TOTAL LBS</Text>
                      </View>
                      <View style={styles.ledgerStatBox}>
                        <Text style={styles.ledgerStatVal}>{Math.floor(userData.totalTrainingMinutes / 60)}h {userData.totalTrainingMinutes % 60}m</Text>
                        <Text style={styles.ledgerStatLab}>TOTAL TIME</Text>
                      </View>
                   </View>

                   <Text style={styles.libertyTitle}>HALL OF HEROES (PERSONAL BESTS)</Text>
                   {Object.keys(userData.pbWeights).length > 0 ? (
                      Object.keys(userData.pbWeights).map(exName => (
                        <View key={exName} style={[styles.ironCard, { borderColor: '#92400e', borderLeftWidth: 3 }]}>
                            <View style={styles.rowBetween}>
                                <Text style={styles.exerciseName}>{exName}</Text>
                                <View style={styles.pbTag}><Text style={styles.pbTagText}>RECORD</Text></View>
                            </View>
                            <Text style={[styles.tacticalDesc, { color: '#d97706', fontWeight: 'bold' }]}>{userData.pbWeights[exName]} LB</Text>
                        </View>
                      ))
                   ) : (
                     <Text style={[styles.tacticalDesc, { textAlign: 'center', marginBottom: 20 }]}>NO RECORDS ESTABLISHED YET.</Text>
                   )}

                   <Text style={[styles.libertyTitle, { marginTop: 30 }]}>MISSION HISTORY</Text>
                   <Text style={styles.tacticalDesc}>TOTAL XP ACCUMULATED: {userData.xp}</Text>
                   {Object.keys(userData.history).reverse().map(date => (
                     <View key={date} style={styles.ironCard}>
                        <Text style={styles.exerciseName}>{date}</Text>
                        <Text style={styles.tacticalDesc}>{userData.history[date].type.toUpperCase()} {userData.history[date].volume ? `| ${userData.history[date].volume.toLocaleString()} LB` : ''}</Text>
                     </View>
                   ))}
                </ScrollView>
            </View>
          </Modal>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (screen === 'blueprint') {
    const list = deployments[userData.currentPhase] || deployments[1];
    
    const renderWeekStrip = (phaseNum, start, end) => (
        <View style={styles.phaseStrip}>
            <Text style={styles.phaseStripTitle}>PHASE {phaseNum}</Text>
            <View style={styles.weekSelector}>
              {Array.from({length: (end-start)+1}, (_, i) => start + i).map(w => {
                  const isCurrent = userData.currentWeek === w;
                  const isSelected = selectedWeek === w;
                  return (
                    <TouchableOpacity 
                        key={w} 
                        style={[styles.weekBtn, isSelected && styles.weekBtnActive, isCurrent && {borderColor: '#d97706', borderStyle: 'dashed', borderWidth: 2}]} 
                        onPress={() => { setSelectedWeek(w); setUserData({...userData, currentPhase: phaseNum}); }}
                    >
                        <Text style={styles.weekBtnText}>{w}</Text>
                        {isCurrent && <View style={styles.currentDot} />}
                    </TouchableOpacity>
                  );
              })}
            </View>
        </View>
    );

    return (
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#0a0908" />
        <SafeAreaView style={styles.container}>
          <View style={styles.centered}>
            <Text style={[styles.libertyTitle, {marginTop: 20}]}>STRATEGIC DEPLOYMENT MAP</Text>
            
            <ScrollView style={{width: '100%'}} contentContainerStyle={{alignItems: 'center'}}>
              {renderWeekStrip(1, 1, 4)}
              {renderWeekStrip(2, 5, 8)}
              {renderWeekStrip(3, 9, 12)}

              <View style={{height: 20}} />
              <Text style={styles.libertyTitle}>SELECTED WEEK {selectedWeek} OPS</Text>
              
              {list.map(m => (
                <TouchableOpacity key={m.id} style={styles.woodPlate} onPress={() => loadWorkout(m.id)}>
                  <View style={styles.missionCardContent}>
                    <Text style={styles.missionIcon}>{m.icon}</Text>
                    <View style={styles.missionTextGroup}>
                      <Text style={styles.missionText}>{m.title}</Text>
                      <Text style={styles.tacticalDesc}>{m.focus}</Text>
                    </View>
                  </View>
                  <Image 
                    source={require('../assets/icon.png')} 
                    style={styles.cardSeal}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setScreen('home')}><Text style={styles.navLink}>RETREAT</Text></TouchableOpacity>
              <View style={{height: 40}} />
            </ScrollView>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (screen === 'active-workout') return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#1a1816" />
      <SafeAreaView style={styles.container}>
        <View style={styles.battleHeader}>
          <TouchableOpacity onPress={() => setScreen('blueprint')}><Text style={styles.abortText}>ABORT</Text></TouchableOpacity>
          <Text style={styles.battleTitle}>PHASE {userData.currentPhase} • DAY {workout[0]?.day}</Text>
          <TouchableOpacity onPress={finishWorkout}><Text style={styles.strikeText}>FINISH</Text></TouchableOpacity>
        </View>
        <ScrollView>
          {workout.map((ex, i) => {
            const isFirstInCircuit = ex.type === "Superset" && (i === 0 || workout[i-1].circuitId !== ex.circuitId);
            const isSuperset = ex.type === "Superset";
            if (isSuperset && !isFirstInCircuit) return null;
            const circuitItems = isSuperset ? workout.filter(item => item.circuitId === ex.circuitId) : [ex];
            
            const renderStars = (count, target) => {
                let stars = [];
                for(let s=1; s<=target; s++) {
                    stars.push(<Text key={s} style={{fontSize: 18, color: s <= count ? '#d97706' : '#292524'}}>★</Text>);
                }
                return stars;
            };

            return (
              <View key={i} style={[styles.ironCard, activeIdx === i && styles.ironCardActive]}>
                <TouchableOpacity onPress={() => setActiveIdx(i)}>
                  <Text style={styles.exerciseName}>{isSuperset ? circuitItems.map(c => c.name).join(' + ') : ex.name}</Text>
                  <View style={{flexDirection: 'row', marginTop: 5}}>
                      {renderStars(ex.setsDone, ex.targetSets)}
                  </View>
                </TouchableOpacity>
                {activeIdx === i && (
                  <View style={styles.forgeAction}>
                    {circuitItems.map((item) => {
                      const originalIdx = workout.findIndex(w => w.name === item.name && w.circuitId === item.circuitId);
                      return (
                        <View key={originalIdx}>
                          <View style={styles.weightRow}>
                            <Text style={styles.weightLabel}>{item.name}</Text>
                            {item.weight > 0 ? (
                              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <TouchableOpacity onPress={() => updateWeight(originalIdx, -5)}><Text style={styles.weightBtnText}>-</Text></TouchableOpacity>
                                <Text style={styles.weightText}>{item.weight}LB</Text>
                                <TouchableOpacity onPress={() => updateWeight(originalIdx, 5)}><Text style={styles.weightBtnText}>+</Text></TouchableOpacity>
                              </View>
                            ) : (<Text style={styles.weightText}>{item.reps}</Text>)}
                          </View>
                          {item.reps === "60" && (
                            <TouchableOpacity style={styles.plankBtn} onPress={() => startCoreTimer(item.name, 60)}>
                              <Text style={styles.strikeText}>{activeCoreTimer.label === item.name && activeCoreTimer.active ? `SEC: ${activeCoreTimer.seconds}` : `START 60s TIMER`}</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      )})}
                    <TouchableOpacity style={styles.strikeIronBtn} onPress={() => logSet(i)}><Text style={styles.strikeText}>COMPLETE SET</Text></TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
        <Modal visible={timer.visible} transparent><View style={styles.modalOverlay}><View style={styles.lanternCircle}><Text style={styles.timerCount}>{timer.seconds}s</Text><Text style={styles.restQuote}>{currentQuote}</Text><TouchableOpacity onPress={() => setTimer({visible: false, seconds: 90})}><Text style={styles.skipText}>SKIP REST</Text></TouchableOpacity></View></View></Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0908' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sealHeader: { padding: 30, backgroundColor: '#1a1816', alignItems: 'center', overflow: 'hidden' },
  headerWatermark: {
    position: 'absolute',
    top: -5,
    right: -10,
    width: 100,
    height: 100,
    opacity: 0.8,
    transform: [{ rotate: '12deg' }]
  },
  brandLogo: { color: '#d97706', fontSize: 10, letterSpacing: 5, fontWeight: '900' },
  dadName: { color: '#e7e5e4', fontSize: 24, fontWeight: 'bold', marginTop: 10 },
  estLabel: { color: '#78716c', fontSize: 10, fontWeight: 'bold', letterSpacing: 1, marginTop: 2 },
  rankBadge: { color: '#d97706', fontSize: 10, fontWeight: 'bold', marginTop: 5 },
  xpBarContainer: { width: '80%', height: 4, backgroundColor: '#292524', marginTop: 10, borderRadius: 2, overflow: 'hidden' },
  xpBarFill: { height: '100%', backgroundColor: '#d97706', borderRadius: 2 },
  streakStrip: { flexDirection: 'row', marginTop: 15, justifyContent: 'space-between', width: '90%' },
  streakText: { color: '#78716c', fontSize: 10, fontWeight: 'bold' },
  forgeActionBtn: { backgroundColor: '#1c1917', marginVertical: 10, padding: 25, borderRadius: 4, flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: '#92400e', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 5 },
  forgeBtnText: { color: '#fef3c7', fontWeight: '900', fontSize: 18, letterSpacing: 1 },
  forgeBtnSub: { color: '#d97706', fontSize: 10, fontWeight: 'bold', marginTop: 2 },
  forgeBtnArrow: { marginLeft: 'auto', fontSize: 24, color: '#92400e', fontWeight: 'bold' },
  homeRestBtn: { backgroundColor: '#1c1917', padding: 15, alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#444' },
  homeRestBtnText: { color: '#d97706', fontWeight: 'bold', fontSize: 12 },
  utilityGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  utilityBtn: { backgroundColor: '#1c1917', width: '31%', padding: 15, alignItems: 'center', borderRadius: 2 },
  highPopBtn: { backgroundColor: '#262626', borderWidth: 1, borderColor: '#fbbf24' },
  utilIcon: { fontSize: 20, marginBottom: 5 },
  utilLabel: { color: '#78716c', fontSize: 8, fontWeight: 'bold' },
  quoteCard: { padding: 20, backgroundColor: '#1c1917', borderLeftWidth: 3, borderLeftColor: '#d97706' },
  quoteText: { color: '#a8a29e', fontSize: 13, fontStyle: 'italic' },
  phaseStrip: { width: '90%', backgroundColor: '#141210', padding: 10, marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#292524' },
  phaseStripTitle: { color: '#d97706', fontSize: 10, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' },
  weekSelector: { flexDirection: 'row', justifyContent: 'center' },
  weekBtn: { backgroundColor: '#1c1917', width: 45, height: 45, margin: 5, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#444' },
  weekBtnActive: { borderColor: '#d97706', backgroundColor: '#92400e' },
  weekBtnText: { color: 'white', fontWeight: 'bold' },
  currentDot: { position: 'absolute', bottom: 2, width: 4, height: 4, borderRadius: 2, backgroundColor: '#d97706' },
  woodPlate: { backgroundColor: '#1a1816', padding: 20, width: '90%', marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#d97706', overflow: 'hidden', justifyContent: 'center' },
  missionCardContent: { flexDirection: 'row', alignItems: 'center' },
  missionIcon: { fontSize: 24, marginRight: 20 },
  missionTextGroup: { flex: 1 },
  cardSeal: { position: 'absolute', bottom: -10, right: -10, width: 60, height: 60, opacity: 0.25, transform: [{ rotate: '-10deg' }] },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  missionText: { color: '#e7e5e4', fontWeight: 'bold', fontSize: 16 },
  tacticalDesc: { color: '#78716c', fontSize: 10, marginTop: 2 },
  navLink: { color: '#78716c', fontWeight: 'bold', fontSize: 12, marginTop: 20 },
  battleHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20, backgroundColor: '#1a1816', alignItems: 'center' },
  battleTitle: { color: '#d97706', fontWeight: 'bold' },
  abortText: { color: '#7f1d1d', fontWeight: 'bold', fontSize: 12 },
  ironCard: { backgroundColor: '#141210', margin: 15, padding: 20, borderLeftWidth: 3, borderLeftColor: '#3d362f' },
  ironCardActive: { borderLeftColor: '#d97706' },
  exerciseName: { color: '#e7e5e4', fontWeight: 'bold' },
  forgeAction: { marginTop: 15, borderTopWidth: 1, borderTopColor: '#292524', paddingTop: 15 },
  weightRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  weightLabel: { color: '#78716c', fontSize: 10 },
  weightText: { color: 'white', fontWeight: 'bold', marginHorizontal: 15 },
  weightBtnText: { color: '#d97706', fontSize: 20, fontWeight: 'bold', paddingHorizontal: 10 },
  plankBtn: { backgroundColor: '#1a1816', padding: 10, marginVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: '#d97706' },
  strikeIronBtn: { backgroundColor: '#d97706', padding: 12, alignItems: 'center' },
  strikeText: { color: 'white', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' },
  parchmentModal: { width: '85%', backgroundColor: '#1c1917', padding: 20, borderWidth: 1, borderColor: '#d97706' },
  libertyTitle: { color: '#d97706', fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  input: { backgroundColor: '#141210', padding: 12, color: 'white', marginBottom: 15 },
  hammerBtn: { backgroundColor: '#92400e', padding: 15, alignItems: 'center' },
  hammerBtnText: { color: '#fef3c7', fontWeight: 'bold' },
  lanternCircle: { width: '85%', padding: 30, backgroundColor: '#0a0908', borderWidth: 2, borderColor: '#d97706', alignItems: 'center' },
  timerCount: { color: '#d97706', fontSize: 50, fontWeight: 'bold' },
  restQuote: { color: '#a8a29e', textAlign: 'center', marginVertical: 20, fontSize: 14, fontStyle: 'italic' },
  skipText: { color: '#78716c' },
  calendarContainer: { padding: 15 },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
  calendarDay: { width: '13.5%', aspectRatio: 1, backgroundColor: '#1c1917', margin: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#292524' },
  calendarDayEmpty: { width: '13.5%', aspectRatio: 1, margin: 1 },
  calendarHeaderDay: { width: '13.5%', margin: 1, alignItems: 'center', paddingBottom: 5 },
  calendarHeaderText: { color: '#78716c', fontSize: 10, fontWeight: 'bold' },
  dateNumText: { color: '#78716c', fontSize: 10 },
  dateIcon: { fontSize: 12, marginTop: 2 },
  dateDetailBox: { marginTop: 20, backgroundColor: '#141210', padding: 20, borderTopWidth: 2, borderTopColor: '#d97706' },
  detailDateText: { color: '#d97706', fontWeight: 'bold', fontSize: 18, marginBottom: 5 },
  detailStatusText: { color: 'white', fontWeight: 'bold', marginBottom: 10 },
  detailExText: { color: '#a8a29e', fontSize: 12, marginBottom: 3 },
  restBtn: { backgroundColor: '#292524', padding: 12, marginTop: 10, alignItems: 'center' },
  restBtnText: { color: '#d97706', fontWeight: 'bold', fontSize: 12 },
  pbTag: { backgroundColor: '#92400e', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 2 },
  pbTagText: { color: 'white', fontSize: 8, fontWeight: 'bold' },
  ledgerStatsHeader: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 25, backgroundColor: '#1c1917', padding: 15 },
  ledgerStatBox: { alignItems: 'center' },
  ledgerStatVal: { color: '#d97706', fontSize: 18, fontWeight: 'bold' },
  ledgerStatLab: { color: '#78716c', fontSize: 8, letterSpacing: 1 }
});