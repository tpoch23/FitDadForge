// src/data/program.ts (FULL – Phase 1 all 4 days exact from your messages)

import { Exercise } from './exercises';

export interface Superset {
  exercises: string[];
  sets: number;
  reps: string[];
  restAfter: number;
}

export interface DayTemplate {
  primary: string;
  primarySets: number;
  primaryReps: string;
  primaryRest: number;
  supersets: Superset[];
  finisher: Superset;
}

export interface Phase {
  name: string;
  templates: DayTemplate[]; // 0: Day 1 Push, 1: Day 2 Pull, 2: Day 3 Push, 3: Day 4 Pull
  sessionNames: string[];
}

export const PROGRAM: Phase[] = [
  {
    name: 'Phase 1: Foundation',
    templates: [
      // Day 1 Push (Lexington Alarm Push) – unchanged from nailed version
      {
        primary: 'flat-barbell-bench-press',
        primarySets: 4,
        primaryReps: '1x8 + 3x5',
        primaryRest: 90,
        supersets: [
          {
            exercises: ['squat-goblet', 'core-bicycle-crunch'],
            sets: 4,
            reps: ['10', '20/side'],
            restAfter: 90,
          },
          {
            exercises: ['bench-dips', 'core-mountain-climber'],
            sets: 3,
            reps: ['10', '20/side'],
            restAfter: 90,
          },
        ],
        finisher: {
          exercises: ['core-russian-twist', 'burpees', 'core-flutter-kick'],
          sets: 3,
          reps: ['20/side', '30s', '20/side'],
          restAfter: 60,
        },
      },
      // Day 2 Pull (Concord Bridge Pull)
      {
        primary: 'row-barbell',
        primarySets: 4,
        primaryReps: '1x8 + 3x5',
        primaryRest: 90,
        supersets: [
          {
            exercises: ['single-leg-rdls', 'core-side-plank-left', 'core-side-plank-right'],
            sets: 4,
            reps: ['10/leg', '20s', '20s'],
            restAfter: 90,
          },
          {
            exercises: ['stability-ball-leg-curls', 'core-dead-bugs'],
            sets: 3,
            reps: ['10', '20'],
            restAfter: 90,
          },
        ],
        finisher: {
          exercises: ['core-woodchoppers', 'chinup', 'core-toe-touches'],
          sets: 3,
          reps: ['20/side', '30s', '20'],
          restAfter: 60,
        },
      },
      // Day 3 Push (Bunker Hill Push)
      {
        primary: 'seated-dumbbell-shoulder-press',
        primarySets: 4,
        primaryReps: '1x8 + 3x5',
        primaryRest: 90,
        supersets: [
          {
            exercises: ['landmine-squats', 'core-hanging-leg-raise'],
            sets: 4,
            reps: ['10', '15'],
            restAfter: 90,
          },
          {
            exercises: ['calf-raise', 'core-windshield-wiper'],
            sets: 3,
            reps: ['15', '10/side'],
            restAfter: 90,
          },
        ],
        finisher: {
          exercises: ['core-heel-touches', 'jump-squats', 'core-v-sit'],
          sets: 3,
          reps: ['20/side', '30s', '15'],
          restAfter: 60,
        },
      },
      // Day 4 Pull (Declaration Strike Pull)
      {
        primary: 'deadlift-conventional',
        primarySets: 4,
        primaryReps: '1x8 + 3x5',
        primaryRest: 90,
        supersets: [
          {
            exercises: ['one-arm-dumbbell-rows', 'core-ab-wheel-rollouts'],
            sets: 4,
            reps: ['10/side', '15'],
            restAfter: 90,
          },
          {
            exercises: ['face-pull', 'core-reverse-crunch'],
            sets: 3,
            reps: ['15', '15'],
            restAfter: 90,
          },
        ],
        finisher: {
          exercises: ['core-farmers-carry', 'bicep-curl-21s', 'core-scissor-kick'],
          sets: 3,
          reps: ['30s', '21', '20'],
          restAfter: 60,
        },
      },
    ],
    sessionNames: [
      'Lexington Alarm Push',
      'Concord Bridge Pull',
      'Bunker Hill Push',
      'Declaration Strike Pull',
    ],
  },
  // Phase 2 and 3 placeholder
  {
    name: 'Phase 2: Build',
    templates: [
      { primary: 'flat-barbell-bench-press', primarySets: 4, primaryReps: '1x8 + 3x5', primaryRest: 90, supersets: [], finisher: { exercises: [], sets: 3, reps: [], restAfter: 60 } },
      { primary: 'row-barbell', primarySets: 4, primaryReps: '1x8 + 3x5', primaryRest: 90, supersets: [], finisher: { exercises: [], sets: 3, reps: [], restAfter: 60 } },
      { primary: 'seated-dumbbell-shoulder-press', primarySets: 4, primaryReps: '1x8 + 3x5', primaryRest: 90, supersets: [], finisher: { exercises: [], sets: 3, reps: [], restAfter: 60 } },
      { primary: 'deadlift-conventional', primarySets: 4, primaryReps: '1x8 + 3x5', primaryRest: 90, supersets: [], finisher: { exercises: [], sets: 3, reps: [], restAfter: 60 } },
    ],
    sessionNames: ['Saratoga Push Offensive', 'Valley Forge Pull Endurance', 'Yorktown Push Assault', 'Trenton Pull Surprise'],
  },
  {
    name: 'Phase 3: Forge',
    templates: [
      { primary: 'flat-barbell-bench-press', primarySets: 4, primaryReps: '1x8 + 3x5', primaryRest: 90, supersets: [], finisher: { exercises: [], sets: 3, reps: [], restAfter: 60 } },
      { primary: 'pendlay-rows', primarySets: 4, primaryReps: '1x8 + 3x5', primaryRest: 90, supersets: [], finisher: { exercises: [], sets: 3, reps: [], restAfter: 60 } },
      { primary: 'seated-dumbbell-shoulder-press', primarySets: 4, primaryReps: '1x8 + 3x5', primaryRest: 90, supersets: [], finisher: { exercises: [], sets: 3, reps: [], restAfter: 60 } },
      { primary: 'deadlift-conventional', primarySets: 4, primaryReps: '1x8 + 3x5', primaryRest: 90, supersets: [], finisher: { exercises: [], sets: 3, reps: [], restAfter: 60 } },
    ],
    sessionNames: ['Independence Push Triumph', 'Constitution Pull Resolve', 'Victory Push Charge', 'Liberty Pull Eternal'],
  },
];

export const getDayTemplate = (phaseIndex: number, sessionIndex: number): DayTemplate => {
  return PROGRAM[phaseIndex].templates[sessionIndex];
};