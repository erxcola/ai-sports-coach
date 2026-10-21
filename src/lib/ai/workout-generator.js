/**
 * Motor de geração de treinos - Periodização baseada em Schoenfeld/Helms
 * ES Module para openGym
 */

export class WorkoutGenerator {
  constructor() {}

  /**
   * Gera plano de treino periodizado
   * @param {Object} params - Parâmetros do usuário
   * @returns {Object} Plano de treino completo
   */
  generateWorkoutPlan(params) {
    const {
      userId,
      goal = 'hypertrophy',
      trainingDays = 4,
      restDays = 3,
      orthopedicConditions = [],
      experienceLevel = 'intermediate'
    } = params;

    // Determinar split baseado em dias de treino e objetivo
    const splitType = this.determineSplit(trainingDays, goal, experienceLevel);

    // Calcular volume semanal por grupo muscular (MEV-MAV)
    const weeklyVolume = this.calculateWeeklyVolume(goal, experienceLevel);

    // Gerar rotinas
    const routines = this.generateRoutines(splitType, goal, orthopedicConditions, weeklyVolume, experienceLevel);

    // Configuração de sobrecarga progressiva
    const progressiveOverload = this.getProgressiveOverloadConfig(experienceLevel);

    return {
      splitType,
      weeklyFrequency: trainingDays,
      targetVolumeSummary: weeklyVolume,
      routines,
      progressiveOverload
    };
  }

  determineSplit(trainingDays, goal, experienceLevel) {
    const splits = {
      2: 'Full Body / Upper-Lower',
      3: goal === 'hypertrophy' ? 'Push/Pull/Legs' : 'Full Body x3',
      4: goal === 'hypertrophy' ? 'Upper/Lower' : 'Upper/Lower/Push/Pull',
      5: 'Push/Pull/Legs/Upper/Lower',
      6: 'Push/Pull/Legs x2'
    };
    return splits[trainingDays] || 'Upper/Lower';
  }

  calculateWeeklyVolume(goal, experienceLevel) {
    // Volume landmarks per muscle group per week (sets)
    // Based on Schoenfeld/Helms: MEV ~10, MAV ~20, MRV ~25
    const baseVolumes = {
      hypertrophy: {
        beginner: { chest: 12, back: 14, shoulders: 12, quads: 12, hamstrings: 10, glutes: 10, arms: 10, calves: 8, core: 8 },
        intermediate: { chest: 16, back: 18, shoulders: 16, quads: 16, hamstrings: 14, glutes: 14, arms: 14, calves: 10, core: 10 },
        advanced: { chest: 20, back: 22, shoulders: 20, quads: 20, hamstrings: 18, glutes: 18, arms: 16, calves: 12, core: 12 }
      },
      strength: {
        beginner: { chest: 10, back: 12, shoulders: 10, quads: 10, hamstrings: 8, glutes: 8, arms: 8, calves: 6, core: 8 },
        intermediate: { chest: 12, back: 14, shoulders: 12, quads: 12, hamstrings: 10, glutes: 10, arms: 10, calves: 8, core: 10 },
        advanced: { chest: 14, back: 16, shoulders: 14, quads: 14, hamstrings: 12, glutes: 12, arms: 12, calves: 10, core: 12 }
      },
      recomp: {
        beginner: { chest: 10, back: 12, shoulders: 10, quads: 10, hamstrings: 8, glutes: 10, arms: 8, calves: 8, core: 10 },
        intermediate: { chest: 14, back: 16, shoulders: 14, quads: 14, hamstrings: 12, glutes: 14, arms: 12, calves: 10, core: 12 },
        advanced: { chest: 18, back: 20, shoulders: 18, quads: 18, hamstrings: 16, glutes: 18, arms: 14, calves: 12, core: 14 }
      }
    };

    return baseVolumes[goal]?.[experienceLevel] || baseVolumes.hypertrophy.intermediate;
  }

  generateRoutines(splitType, goal, orthopedicConditions, weeklyVolume, experienceLevel) {
    const routines = [];
    const days = this.parseSplit(splitType);

    for (const day of days) {
      const focus = day.focus;
      const exercises = this.selectExercisesForFocus(focus, goal, orthopedicConditions, experienceLevel);
      const volume = this.calculateDayVolume(focus, weeklyVolume, days.length);

      routines.push({
        day: day.name,
        focus: day.focus,
        exercises: exercises.slice(0, this.getExercisesPerSession(experienceLevel)),
        weeklyVolume: volume
      });
    }

    return routines;
  }

  parseSplit(splitType) {
    const splits = {
      'Push/Pull/Legs': [
        { name: 'Day 1', focus: 'Push' },
        { name: 'Day 2', focus: 'Pull' },
        { name: 'Day 3', focus: 'Legs' }
      ],
      'Upper/Lower': [
        { name: 'Day 1', focus: 'Upper' },
        { name: 'Day 2', focus: 'Lower' },
        { name: 'Day 3', focus: 'Upper' },
        { name: 'Day 4', focus: 'Lower' }
      ],
      'Full Body x3': [
        { name: 'Day 1', focus: 'Full Body' },
        { name: 'Day 2', focus: 'Full Body' },
        { name: 'Day 3', focus: 'Full Body' }
      ],
      'Upper/Lower/Push/Pull': [
        { name: 'Day 1', focus: 'Upper' },
        { name: 'Day 2', focus: 'Lower' },
        { name: 'Day 3', focus: 'Push' },
        { name: 'Day 4', focus: 'Pull' }
      ],
      'Push/Pull/Legs/Upper/Lower': [
        { name: 'Day 1', focus: 'Push' },
        { name: 'Day 2', focus: 'Pull' },
        { name: 'Day 3', focus: 'Legs' },
        { name: 'Day 4', focus: 'Upper' },
        { name: 'Day 5', focus: 'Lower' }
      ],
      'Push/Pull/Legs x2': [
        { name: 'Day 1', focus: 'Push' },
        { name: 'Day 2', focus: 'Pull' },
        { name: 'Day 3', focus: 'Legs' },
        { name: 'Day 4', focus: 'Push' },
        { name: 'Day 5', focus: 'Pull' },
        { name: 'Day 6', focus: 'Legs' }
      ]
    };

    return splits[splitType] || splits['Upper/Lower'];
  }

  selectExercisesForFocus(focus, goal, orthopedicConditions, experienceLevel) {
    // Base de exercícios por foco (simplificada - na prática usa CATALOGUE do openGym)
    const exerciseDatabase = {
      Push: [
        { id: '0021', name: 'Dumbbell Bench Press', primaryMover: 'chest', sets: 3, repRange: '8-12', targetRIR: 2, tempo: '3-0-1-0', restSeconds: 120 },
        { id: '0022', name: 'Incline Dumbbell Press', primaryMover: 'upper_chest', sets: 3, repRange: '8-12', targetRIR: 2, tempo: '3-0-1-0', restSeconds: 120 },
        { id: '0031', name: 'Overhead Dumbbell Press', primaryMover: 'anterior_deltoid', sets: 3, repRange: '8-12', targetRIR: 2, tempo: '3-0-1-0', restSeconds: 120 },
        { id: '0070', name: 'Lateral Raise', primaryMover: 'lateral_deltoid', sets: 3, repRange: '12-15', targetRIR: 1, tempo: '2-0-1-0', restSeconds: 90 },
        { id: '0081', name: 'Tricep Extension', primaryMover: 'triceps', sets: 3, repRange: '10-15', targetRIR: 1, tempo: '2-0-1-0', restSeconds: 90 }
      ],
      Pull: [
        { id: '0041', name: 'Single Arm Dumbbell Row', primaryMover: 'latissimus', sets: 3, repRange: '8-12', targetRIR: 2, tempo: '3-1-1-0', restSeconds: 120 },
        { id: '0042', name: 'Seal Row', primaryMover: 'latissimus', sets: 3, repRange: '8-12', targetRIR: 2, tempo: '3-1-1-0', restSeconds: 120 },
        { id: '0052', name: 'Lat Pulldown', primaryMover: 'latissimus', sets: 3, repRange: '10-12', targetRIR: 2, tempo: '3-1-1-0', restSeconds: 90 },
        { id: '0071', name: 'Face Pull', primaryMover: 'rear_deltoid', sets: 3, repRange: '12-15', targetRIR: 1, tempo: '2-0-1-0', restSeconds: 90 },
        { id: '0080', name: 'Bicep Curl', primaryMover: 'biceps', sets: 3, repRange: '10-15', targetRIR: 1, tempo: '2-0-1-0', restSeconds: 90 }
      ],
      Legs: [
        { id: '0003', name: 'Goblet Squat', primaryMover: 'quadriceps', sets: 3, repRange: '8-12', targetRIR: 2, tempo: '3-0-1-0', restSeconds: 150 },
        { id: '0011', name: 'Romanian Deadlift', primaryMover: 'hamstrings', sets: 3, repRange: '8-12', targetRIR: 2, tempo: '3-0-1-0', restSeconds: 150 },
        { id: '0005', name: 'Bulgarian Split Squat', primaryMover: 'quadriceps', sets: 3, repRange: '8-12', targetRIR: 2, tempo: '3-0-1-0', restSeconds: 120 },
        { id: '0062', name: 'Leg Curl', primaryMover: 'hamstrings', sets: 3, repRange: '10-15', targetRIR: 1, tempo: '2-0-1-0', restSeconds: 90 },
        { id: '0063', name: 'Calf Raise', primaryMover: 'calves', sets: 4, repRange: '12-20', targetRIR: 1, tempo: '2-1-1-0', restSeconds: 60 }
      ],
      Upper: [
        { id: '0021', name: 'Dumbbell Bench Press', primaryMover: 'chest', sets: 3, repRange: '8-12', targetRIR: 2, tempo: '3-0-1-0', restSeconds: 120 },
        { id: '0041', name: 'Single Arm Dumbbell Row', primaryMover: 'latissimus', sets: 3, repRange: '8-12', targetRIR: 2, tempo: '3-1-1-0', restSeconds: 120 },
        { id: '0031', name: 'Overhead Dumbbell Press', primaryMover: 'anterior_deltoid', sets: 3, repRange: '8-12', targetRIR: 2, tempo: '3-0-1-0', restSeconds: 120 },
        { id: '0071', name: 'Face Pull', primaryMover: 'rear_deltoid', sets: 3, repRange: '12-15', targetRIR: 1, tempo: '2-0-1-0', restSeconds: 90 },
        { id: '0080', name: 'Bicep Curl', primaryMover: 'biceps', sets: 3, repRange: '10-15', targetRIR: 1, tempo: '2-0-1-0', restSeconds: 90 },
        { id: '0081', name: 'Tricep Extension', primaryMover: 'triceps', sets: 3, repRange: '10-15', targetRIR: 1, tempo: '2-0-1-0', restSeconds: 90 }
      ],
      Lower: [
        { id: '0003', name: 'Goblet Squat', primaryMover: 'quadriceps', sets: 3, repRange: '8-12', targetRIR: 2, tempo: '3-0-1-0', restSeconds: 150 },
        { id: '0011', name: 'Romanian Deadlift', primaryMover: 'hamstrings', sets: 3, repRange: '8-12', targetRIR: 2, tempo: '3-0-1-0', restSeconds: 150 },
        { id: '0005', name: 'Bulgarian Split Squat', primaryMover: 'quadriceps', sets: 3, repRange: '8-12', targetRIR: 2, tempo: '3-0-1-0', restSeconds: 120 },
        { id: '0062', name: 'Leg Curl', primaryMover: 'hamstrings', sets: 3, repRange: '10-15', targetRIR: 1, tempo: '2-0-1-0', restSeconds: 90 },
        { id: '0063', name: 'Calf Raise', primaryMover: 'calves', sets: 4, repRange: '12-20', targetRIR: 1, tempo: '2-1-1-0', restSeconds: 60 }
      ],
      'Full Body': [
        { id: '0003', name: 'Goblet Squat', primaryMover: 'quadriceps', sets: 3, repRange: '8-12', targetRIR: 2, tempo: '3-0-1-0', restSeconds: 150 },
        { id: '0021', name: 'Dumbbell Bench Press', primaryMover: 'chest', sets: 3, repRange: '8-12', targetRIR: 2, tempo: '3-0-1-0', restSeconds: 120 },
        { id: '0041', name: 'Single Arm Dumbbell Row', primaryMover: 'latissimus', sets: 3, repRange: '8-12', targetRIR: 2, tempo: '3-1-1-0', restSeconds: 120 },
        { id: '0011', name: 'Romanian Deadlift', primaryMover: 'hamstrings', sets: 3, repRange: '8-12', targetRIR: 2, tempo: '3-0-1-0', restSeconds: 150 },
        { id: '0031', name: 'Overhead Dumbbell Press', primaryMover: 'anterior_deltoid', sets: 3, repRange: '8-12', targetRIR: 2, tempo: '3-0-1-0', restSeconds: 120 },
        { id: '0071', name: 'Face Pull', primaryMover: 'rear_deltoid', sets: 3, repRange: '12-15', targetRIR: 1, tempo: '2-0-1-0', restSeconds: 90 }
      ]
    };

    let exercises = exerciseDatabase[focus] || exerciseDatabase['Full Body'];

    // Filtrar exercícios contraindicados
    exercises = exercises.filter(ex => {
      for (const condition of orthopedicConditions) {
        if (!this.isExerciseSafeForCondition(ex, condition)) {
          return false;
        }
      }
      return true;
    });

    // Adicionar notas ortopédicas
    return exercises.map(ex => ({
      ...ex,
      orthopedicNotes: this.getOrthopedicNotes(ex.id, orthopedicConditions),
      safe: true,
      maleableSubstitute: this.getSubstitute(ex.id, orthopedicConditions)
    }));
  }

  isExerciseSafeForCondition(exercise, condition) {
    // Simplified - in practice use BiomechanicalFilter
    const unsafeMap = {
      scoliosis: ['0001', '0002', '0010', '0030'],
      knee_chondromalacia: ['0061', '0001', '0002'],
      patellar_tendinitis: ['0061', '0005', '0001'],
      shoulder_impingement: ['0030', '0020', '0050'],
      rotator_cuff_tendinitis: ['0030', '0031', '0020', '0050']
    };
    return !unsafeMap[condition]?.includes(exercise.id);
  }

  getOrthopedicNotes(exerciseId, conditions) {
    const notes = [];
    for (const condition of conditions) {
      const contraindications = {
        scoliosis: 'Avoid axial loading; use chest-supported variations',
        knee_chondromalacia: 'Keep knee flexion >90°; prefer hip-dominant',
        patellar_tendinitis: 'Isometric holds 45s; eccentric 3s down',
        shoulder_impingement: 'Neutral grip; scapular plane 30-45°',
        rotator_cuff_tendinitis: 'No overhead; focus on scapular stability'
      };
      if (contraindications[condition]) {
        notes.push(contraindications[condition]);
      }
    }
    return notes.join('; ') || 'No specific restrictions';
  }

  getSubstitute(exerciseId, conditions) {
    const substitutes = {
      '0001': 'Goblet Squat / Box Squat',
      '0002': 'Goblet Squat / Front Squat (DB)',
      '0010': 'Romanian Deadlift / Hip Thrust',
      '0030': 'Landmine Press / Floor Press',
      '0020': 'Floor Press / Neutral DB Press',
      '0050': 'Lat Pulldown / Cable Row',
      '0061': 'Spanish Squat / Leg Press (partial)'
    };
    return substitutes[exerciseId] || 'Consult exercise database for alternatives';
  }

  calculateDayVolume(focus, weeklyVolume, sessionsPerWeek) {
    const focusVolumes = {
      Push: weeklyVolume.chest + weeklyVolume.shoulders + weeklyVolume.arms,
      Pull: weeklyVolume.back + weeklyVolume.shoulders + weeklyVolume.arms,
      Legs: weeklyVolume.quads + weeklyVolume.hamstrings + weeklyVolume.glutes + weeklyVolume.calves,
      Upper: weeklyVolume.chest + weeklyVolume.back + weeklyVolume.shoulders + weeklyVolume.arms,
      Lower: weeklyVolume.quads + weeklyVolume.hamstrings + weeklyVolume.glutes + weeklyVolume.calves,
      'Full Body': Object.values(weeklyVolume).reduce((a, b) => a + b, 0)
    };

    const total = focusVolumes[focus] || 0;
    return Math.round(total / sessionsPerWeek);
  }

  getExercisesPerSession(experienceLevel) {
    return experienceLevel === 'beginner' ? 5 : experienceLevel === 'intermediate' ? 6 : 7;
  }

  getProgressiveOverloadConfig(experienceLevel) {
    const configs = {
      beginner: { weeklyIncrease: '2.5-5% weight or +1 rep', deloadFrequency: 6, deloadWeek: 6 },
      intermediate: { weeklyIncrease: '2.5% weight or +1 rep', deloadFrequency: 5, deloadWeek: 5 },
      advanced: { weeklyIncrease: '1-2.5% weight or +1 rep', deloadFrequency: 4, deloadWeek: 4 }
    };
    return configs[experienceLevel] || configs.intermediate;
  }

  determineExperienceLevel(trainingAge) {
    if (trainingAge < 1) return 'beginner';
    if (trainingAge < 3) return 'intermediate';
    return 'advanced';
  }
}

export function createWorkoutGenerator() {
  return new WorkoutGenerator();
}