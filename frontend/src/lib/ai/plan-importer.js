// src/lib/ai/plan-importer.js
// Bridge that imports AI Coach workout routines, nutrition plans, and mobility data
// directly into the core openGym store (S.routines, S.week, S.dietPlan, S.mobility).

import { useStore } from '../../store/useStore.js';
import { CATALOGUE } from '../exercises.js';
import { uid } from '../format.js';

/**
 * Common exercise keyword to catalogue ID mappings for instant high-confidence matching.
 */
const CANONICAL_EXERCISE_IDS = {
  // Chest
  'supino reto': '0025',
  'bench press': '0025',
  'barbell bench press': '0025',
  'supino inclinado': '0047',
  'incline bench press': '0047',
  'crucifixo': '0308',
  'dumbbell fly': '0308',
  'flexao': '0662',
  'push up': '0662',
  'crossover': '0168',
  'cable crossover': '0168',

  // Back
  'puxada alta': '2330',
  'lat pulldown': '2330',
  'remada curvada': '0027',
  'barbell bent over row': '0027',
  'remada baixa': '0861',
  'cable seated row': '0861',
  'barra fixa': '0652',
  'pull up': '0652',
  'levantamento terra': '0032',
  'deadlift': '0032',
  'remada serrote': '0293',
  'dumbbell row': '0293',

  // Legs / Glutes / Calves
  'agachamento': '3593',
  'squat': '3593',
  'barbell squat': '3593',
  'leg press': '0739',
  'leg press 45': '0739',
  'cadeira extensora': '0585',
  'leg extension': '0585',
  'mesa flexora': '0587',
  'leg curl': '0587',
  'stiff': '0043',
  'stiff leg deadlift': '0043',
  'elevacao pelvica': '3304',
  'hip thrust': '3304',
  'panturrilha em pe': '0139',
  'standing calf raise': '0139',
  'panturrilha sentado': '0754',
  'seated calf raise': '0754',
  'afundo': '0334',
  'lunge': '0334',
  'agachamento bulgaro': '0112',
  'bulgarian split squat': '0112',

  // Shoulders
  'desenvolvimento': '0070',
  'overhead press': '0070',
  'elevacao lateral': '0336',
  'lateral raise': '0336',
  'crucifixo invertido': '0290',
  'face pull': '0878',

  // Arms
  'rosca direta': '0031',
  'barbell curl': '0031',
  'rosca martelo': '0313',
  'hammer curl': '0313',
  'triceps corda': '0241',
  'triceps pulley': '0241',
  'triceps testa': '0055',
  'skull crusher': '0055',
  'triceps frances': '0331',

  // Core / Mobility
  'prancha': '0468',
  'plank': '0468',
  'abdominal': '0001',
  'crunch': '0001',
  'mobilidade de tornozelo': '0139',
  'alongamento de isquiotibiais': '0043'
};

/**
 * Finds the closest catalogue exercise given an AI exercise name or string.
 */
export function matchCatalogueExercise(exerciseInput) {
  if (!exerciseInput) return null;
  const name = (typeof exerciseInput === 'string' ? exerciseInput : (exerciseInput.name || exerciseInput.n || '')).toLowerCase().trim();
  const idGiven = typeof exerciseInput === 'object' ? exerciseInput.id : null;

  // Direct ID check
  if (idGiven && CATALOGUE.some(e => e.id === String(idGiven))) {
    return CATALOGUE.find(e => e.id === String(idGiven));
  }

  // Canonical mapping check
  for (const [key, catId] of Object.entries(CANONICAL_EXERCISE_IDS)) {
    if (name.includes(key)) {
      const match = CATALOGUE.find(e => e.id === catId);
      if (match) return match;
    }
  }

  // Exact or contains name match in CATALOGUE
  const normalized = name.replace(/[^a-z0-9 ]/g, ' ');
  let found = CATALOGUE.find(e => e.n.toLowerCase() === normalized);
  if (found) return found;

  const words = normalized.split(/\s+/).filter(w => w.length > 2);
  if (words.length > 0) {
    found = CATALOGUE.find(e => {
      const en = e.n.toLowerCase();
      return words.every(w => en.includes(w));
    });
    if (found) return found;

    // Partial match on first two keywords
    found = CATALOGUE.find(e => {
      const en = e.n.toLowerCase();
      return words.some(w => en.includes(w));
    });
    if (found) return found;
  }

  // Fallback to first available compound exercise
  return CATALOGUE[0];
}

/**
 * Maps a single AI-generated exercise item into openGym routine exercise format.
 */
function toRoutineExercise(rawEx, correctiveNotes = '') {
  const match = matchCatalogueExercise(rawEx);
  const sets = Number(rawEx.sets) || 3;
  const reps = Number(rawEx.reps) || 10;
  const repsMin = rawEx.repsMin ? Number(rawEx.repsMin) : (reps >= 10 ? 8 : Math.max(5, reps - 2));
  const rest = Number(rawEx.restSec || rawEx.rest) || 90;
  const rpe = Number(rawEx.rpe) || 8;

  let notes = rawEx.notes || '';
  if (correctiveNotes) {
    notes = notes ? `${notes} · ${correctiveNotes}` : correctiveNotes;
  }

  return {
    id: match ? match.id : '0025',
    sets,
    reps,
    repsMin,
    weight: 0,
    rest,
    rpe,
    notes: notes.trim(),
    mode: 'reps'
  };
}

/**
 * Builds standard routine glyph based on routine name / target.
 */
function pickRoutineGlyph(name = '') {
  const n = name.toLowerCase();
  if (n.includes('push') || n.includes('peito') || n.includes('tríceps') || n.includes('ombro')) return 'chest';
  if (n.includes('pull') || n.includes('costas') || n.includes('bíceps') || n.includes('dorsal')) return 'back';
  if (n.includes('leg') || n.includes('perna') || n.includes('quadríceps') || n.includes('inferiores')) return 'leg';
  if (n.includes('cardio') || n.includes('hiit')) return 'flame';
  if (n.includes('core') || n.includes('abdômen')) return 'abs';
  return 'dumbbell';
}

/**
 * Imports full AI Coach recommendations into openGym store:
 * - Generates routines in S.routines
 * - Configures S.week schedule
 * - Stores S.dietPlan (nutrition calories & macros)
 * - Stores S.cardioPlan
 * - Stores S.mobilityAssessment
 */
export async function importAICoachToOpenGym({
  workoutPlan,
  nutritionPlan,
  cardioPlan,
  mobilityAssessment,
  orthopedicAdjustments = []
} = {}) {
  const store = useStore.getState();
  if (!store || !store.update) {
    throw new Error('openGym store not initialized');
  }

  const generatedRoutines = [];
  const weekMap = {};

  // 1. Process Workout Routines
  if (workoutPlan && Array.isArray(workoutPlan.routines) && workoutPlan.routines.length > 0) {
    workoutPlan.routines.forEach((r, idx) => {
      const routineId = uid();
      const exercises = (r.exercises || []).map(ex => {
        // Check if exercise has orthopedic or mobility adjustment
        const adjustment = orthopedicAdjustments.find(a => 
          a.exercise?.toLowerCase().includes((ex.name || '').toLowerCase())
        );
        return toRoutineExercise(ex, adjustment ? adjustment.note : '');
      });

      // Add mobility warm-up exercise if mobility assessment flagged restrictions
      if (mobilityAssessment?.correctiveExercise && idx === 0) {
        const warmupEx = toRoutineExercise(
          { name: mobilityAssessment.correctiveExercise, sets: 2, reps: 12, restSec: 45 },
          'Mobilidade preparatória pré-treino'
        );
        exercises.unshift(warmupEx);
      }

      const routineObj = {
        id: routineId,
        name: r.name || `Treino ${String.fromCharCode(65 + idx)}`,
        glyph: pickRoutineGlyph(r.name),
        ex: exercises
      };

      generatedRoutines.push(routineObj);
    });
  } else if (workoutPlan && Array.isArray(workoutPlan.days)) {
    // Alternate format: days array
    workoutPlan.days.forEach((day, idx) => {
      if (!day.exercises || day.exercises.length === 0) return;
      const routineId = uid();
      const routineObj = {
        id: routineId,
        name: day.name || `Treino ${String.fromCharCode(65 + idx)}`,
        glyph: pickRoutineGlyph(day.name),
        ex: day.exercises.map(ex => toRoutineExercise(ex))
      };
      generatedRoutines.push(routineObj);
    });
  } else {
    // Standard default 3-day split if none provided
    const pushId = uid();
    const pullId = uid();
    const legsId = uid();

    generatedRoutines.push(
      {
        id: pushId,
        name: 'Treino A - Push (Peito, Ombros e Tríceps)',
        glyph: 'chest',
        ex: [
          toRoutineExercise({ name: 'Barbell Bench Press', sets: 4, reps: 8, restSec: 120 }),
          toRoutineExercise({ name: 'Incline Dumbbell Press', sets: 3, reps: 10, restSec: 90 }),
          toRoutineExercise({ name: 'Lateral Raise', sets: 4, reps: 12, restSec: 60 }),
          toRoutineExercise({ name: 'Cable Triceps Pushdown', sets: 3, reps: 12, restSec: 60 })
        ]
      },
      {
        id: pullId,
        name: 'Treino B - Pull (Costas e Bíceps)',
        glyph: 'back',
        ex: [
          toRoutineExercise({ name: 'Cable Lat Pulldown', sets: 4, reps: 10, restSec: 90 }),
          toRoutineExercise({ name: 'Barbell Bent Over Row', sets: 4, reps: 8, restSec: 90 }),
          toRoutineExercise({ name: 'Face Pull', sets: 3, reps: 15, restSec: 60 }),
          toRoutineExercise({ name: 'Barbell Curl', sets: 3, reps: 10, restSec: 60 })
        ]
      },
      {
        id: legsId,
        name: 'Treino C - Legs (Pernas Completas)',
        glyph: 'leg',
        ex: [
          toRoutineExercise({ name: 'Barbell Squat', sets: 4, reps: 8, restSec: 120 }),
          toRoutineExercise({ name: 'Leg Press 45', sets: 3, reps: 10, restSec: 90 }),
          toRoutineExercise({ name: 'Stiff Leg Deadlift', sets: 3, reps: 10, restSec: 90 }),
          toRoutineExercise({ name: 'Standing Calf Raise', sets: 4, reps: 15, restSec: 45 })
        ]
      }
    );
  }

  // 2. Map to Weekly Schedule
  // Standard weekday mapping: Monday (1), Wednesday (3), Friday (5) or custom frequency
  if (generatedRoutines.length >= 3) {
    weekMap['1'] = generatedRoutines[0].id; // Seg
    weekMap['3'] = generatedRoutines[1].id; // Qua
    weekMap['5'] = generatedRoutines[2].id; // Sex
    if (generatedRoutines.length >= 4) weekMap['2'] = generatedRoutines[3].id; // Ter
    if (generatedRoutines.length >= 5) weekMap['6'] = generatedRoutines[4].id; // Sab
  } else {
    generatedRoutines.forEach((r, i) => {
      weekMap[String((i * 2 + 1) % 7)] = r.id;
    });
  }

  // 3. Prepare Diet Plan
  const dietPayload = nutritionPlan ? {
    caloricTarget: nutritionPlan.caloricTarget || 2200,
    strategy: nutritionPlan.strategy || 'Recomposição Corporal',
    proteinGrams: nutritionPlan.macros?.proteinGrams || 160,
    carbGrams: nutritionPlan.macros?.carbGrams || 220,
    fatGrams: nutritionPlan.macros?.fatGrams || 65,
    hydrationLiters: nutritionPlan.hydrationLiters || 3.2,
    meals: nutritionPlan.meals || [
      { name: 'Café da Manhã', calories: 500, protein: 35, carbs: 55, fat: 15 },
      { name: 'Almoço', calories: 750, protein: 50, carbs: 80, fat: 20 },
      { name: 'Lanche da Tarde (Pré-Treino)', calories: 400, protein: 30, carbs: 50, fat: 10 },
      { name: 'Jantar', calories: 550, protein: 45, carbs: 35, fat: 20 }
    ],
    updatedAt: Date.now()
  } : null;

  // 4. Prepare Cardio Plan
  const cardioPayload = cardioPlan ? {
    modality: cardioPlan.modality || 'Caminhada Inclinada',
    targetBpmRange: cardioPlan.targetBpmRange || '120 - 138 BPM (Zona 2 FatMax)',
    weeklyMinutes: cardioPlan.weeklyMinutes || 120,
    frequency: cardioPlan.frequency || '3x na semana (40 min)',
    neatTarget: cardioPlan.neatSteps || 10000,
    updatedAt: Date.now()
  } : null;

  // 5. Atomic Store Update with Persistence and Push
  store.update(mut => {
    // Append or replace routines
    const existing = mut.routines || [];
    // Keep user's custom routines, prepend or replace generated AI routines
    const filteredExisting = existing.filter(r => !r.name.startsWith('Treino AI') && !generatedRoutines.some(gr => gr.name === r.name));
    mut.routines = [...generatedRoutines, ...filteredExisting];
    mut.week = Object.assign({}, mut.week || {}, weekMap);

    if (dietPayload) mut.dietPlan = dietPayload;
    if (cardioPayload) mut.cardioPlan = cardioPayload;
    if (mobilityAssessment) mut.mobilityAssessment = mobilityAssessment;
  }, true);

  return {
    success: true,
    routineCount: generatedRoutines.length,
    exercisesCount: generatedRoutines.reduce((acc, r) => acc + (r.ex ? r.ex.length : 0), 0),
    dietPlan: dietPayload,
    cardioPlan: cardioPayload
  };
}
