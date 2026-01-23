// src/stores/useUserStore.ts (UPDATED – add lastWeights map)

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CustomOverrides {
  [phase: number]: {
    push?: {
      upperPrimary?: string;
      lowerPrimary?: string;
      supersets?: { [index: number]: { secondary?: string; core?: string } };
      finalCircuit?: string[];
    };
    pull?: {
      upperPrimary?: string;
      lowerPrimary?: string;
      supersets?: { [index: number]: { secondary?: string; core?: string } };
      finalCircuit?: string[];
    };
  };
}

interface CompletedWorkout {
  date: string;
  phase: number;
  dayType: 'push' | 'pull';
  sessionName: string;
  loggedData: { [exerciseId: string]: { sets: { reps: number; weight?: number }[] } };
}

interface UserState {
  userName: string | null;
  dadYear: number | null;
  currentPhase: number;
  currentWeek: number;
  currentSession: number;
  lastWeights: { [exerciseId: string]: number };
  customOverrides: CustomOverrides;
  completedWorkouts: CompletedWorkout[];

  completeOnboarding: (name: string, year: number) => void;
  setCurrentPhase: (phase: number) => void;
  setCurrentWeek: (week: number) => void;
  setCurrentSession: (session: number) => void;
  advanceSession: () => void;
  updateLastWeight: (exerciseId: string, weight: number) => void;
  updateOverride: (phase: number, dayType: 'push' | 'pull', path: string[], newId: string) => void;
  addCompletedWorkout: (workout: CompletedWorkout) => void;
  resetProgress: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userName: null,
      dadYear: null,
      currentPhase: 0,
      currentWeek: 1,
      currentSession: 0,
      lastWeights: {},
      customOverrides: {},
      completedWorkouts: [],

      completeOnboarding: (name, year) => set({ userName: name, dadYear: year }),

      setCurrentPhase: (phase) =>
        set({ currentPhase: phase, currentWeek: 1, currentSession: 0 }),

      setCurrentWeek: (week) =>
        set({ currentWeek: week > 4 ? 1 : week < 1 ? 4 : week, currentSession: 0 }),

      setCurrentSession: (session) =>
        set({ currentSession: session >= 0 && session <= 3 ? session : 0 }),

      advanceSession: () =>
        set((state) => {
          let session = state.currentSession + 1;
          let week = state.currentWeek;
          let phase = state.currentPhase;

          if (session > 3) {
            session = 0;
            week += 1;
            if (week > 4) {
              week = 1;
              phase += 1;
              if (phase > 2) phase = 2;
            }
          }

          return { currentPhase: phase, currentWeek: week, currentSession: session };
        }),

      updateLastWeight: (exerciseId, weight) =>
        set((state) => ({
          lastWeights: { ...state.lastWeights, [exerciseId]: weight },
        })),

      updateOverride: (phase, dayType, path, newId) =>
        set((state) => {
          const overrides = { ...state.customOverrides };
          if (!overrides[phase]) overrides[phase] = {};
          if (!overrides[phase][dayType]) overrides[phase][dayType] = {};

          let current = overrides[phase][dayType] as any;
          for (let i = 0; i < path.length - 1; i++) {
            const key = path[i];
            if (!current[key]) current[key] = i === path.length - 2 && !isNaN(+path[i + 1]) ? [] : {};
            current = current[key];
          }
          current[path[path.length - 1]] = newId;

          return { customOverrides: overrides };
        }),

      addCompletedWorkout: (workout) =>
        set((state) => ({
          completedWorkouts: [...state.completedWorkouts, workout],
        })),

      resetProgress: () =>
        set({
          userName: null,
          dadYear: null,
          currentPhase: 0,
          currentWeek: 1,
          currentSession: 0,
          lastWeights: {},
          customOverrides: {},
          completedWorkouts: [],
        }),
    }),
    {
      name: 'fitdadforge-user-storage',
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);