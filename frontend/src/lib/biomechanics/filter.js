/**
 * Motor de filtramento biomecânico - openGym Integration
 * Filtra exercícios baseado em condições ortopédicas
 */

import {
  OrthopedicCondition,
  CONTRAINDICATED_MECHANICS,
  EXERCISE_BIOMECHANICS,
  JointStressProfile
} from '../types/biomechanics.js';

/**
 * Classe principal do filtro biomecânico
 */
export class BiomechanicalFilter {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Filtra exercícios baseado nas condições ortopédicas do usuário
   * @param {Array} exercises - Lista de exercícios do openGym (CATALOGUE)
   * @param {Array} conditions - Array de OrthopedicCondition
   * @returns {Object} { safeExercises, avoidedExercises, alternatives }
   */
  filterExercises(exercises, conditions) {
    const safeExercises = [];
    const avoidedExercises = [];
    const alternatives = new Map();

    for (const exercise of exercises) {
      const isSafe = this.isExerciseSafeForConditions(exercise, conditions);

      if (isSafe) {
        safeExercises.push(exercise);
      } else {
        avoidedExercises.push(exercise);

        // Gerar alternativas seguras
        const safeAltIds = this.generateAlternatives(exercise.id, conditions);
        alternatives.set(exercise.id, safeAltIds);
      }
    }

    return { safeExercises, avoidedExercises, alternatives };
  }

  /**
   * Verifica se um exercício é seguro para todas as condições
   */
  isExerciseSafeForConditions(exercise, conditions) {
    if (!conditions || conditions.length === 0) return true;

    // Verificar se o exercício tem biomecânica definida
    const biomech = this.getExerciseBiomechanics(exercise);
    if (!biomech) return true; // Se não temos dados, assumir seguro

    // Verificar contra cada condição
    for (const condition of conditions) {
      if (!this.isExerciseSafeForCondition(exercise, condition, biomech)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Verifica se um exercício é seguro para uma condição específica
   */
  isExerciseSafeForCondition(exercise, condition, biomech) {
    const contraindication = CONTRAINDICATED_MECHANICS[condition];
    if (!contraindication) return true;

    const prohibited = contraindication.prohibitedMechanics;

    // Verificar compressão axial
    if (prohibited.axialCompression !== 'none' &&
        this.levelExceeds(biomech.axial_compression, prohibited.axialCompression)) {
      return false;
    }

    // Verificar shear no joelho
    if (prohibited.shearStressKnee !== 'none' &&
        this.levelExceeds(biomech.shear_stress_knee, prohibited.shearStressKnee)) {
      return false;
    }

    // Verificar rotação do ombro
    if (prohibited.shoulderRotation !== 'neutral' &&
        biomech.shoulder_rotation === prohibited.shoulderRotation) {
      return false;
    }

    // Verificar loading espinhal
    if (prohibited.spinalLoading !== 'none' &&
        this.levelExceeds(biomech.spinal_loading, prohibited.spinalLoading)) {
      return false;
    }

    return true;
  }

  /**
   * Verifica se um nível excede o proibido
   */
  levelExceeds(actual, threshold) {
    const levels = { none: 0, low: 1, moderate: 2, high: 3, extreme: 4 };
    return (levels[actual] || 0) >= (levels[threshold] || 0);
  }

  /**
   * Obtém biomecânica de um exercício
   */
  getExerciseBiomechanics(exercise) {
    const exerciseId = exercise.id || exercise;
    return EXERCISE_BIOMECHANICS[exerciseId] || this.inferBiomechanics(exercise);
  }

  /**
   * Infere biomecânica baseada no tipo/equipamento do exercício
   */
  inferBiomechanics(exercise) {
    const eq = (exercise.eq || '').toLowerCase();
    const bp = Array.isArray(exercise.bp) ? exercise.bp : [exercise.bp];
    const name = (exercise.n || '').toLowerCase();

    // Padrões baseados em equipamento e body part
    if (eq.includes('barbell') || eq.includes('barbell')) {
      return {
        axial_compression: 'high',
        shear_stress_knee: 'high',
        shoulder_rotation: 'neutral',
        spinal_loading: 'high'
      };
    }

    if (eq.includes('dumbbell')) {
      if (bp.includes('shoulders') || name.includes('press')) {
        return {
          axial_compression: 'low',
          shear_stress_knee: 'none',
          shoulder_rotation: 'internal',
          spinal_loading: 'moderate'
        };
      }
      return {
        axial_compression: 'low',
        shear_stress_knee: 'none',
        shoulder_rotation: 'neutral',
        spinal_loading: 'low'
      };
    }

    if (eq.includes('cable') || eq.includes('machine')) {
      return {
        axial_compression: 'none',
        shear_stress_knee: 'low',
        shoulder_rotation: 'neutral',
        spinal_loading: 'low'
      };
    }

    if (eq.includes('body weight') || eq.includes('bodyweight')) {
      return {
        axial_compression: 'none',
        shear_stress_knee: 'moderate',
        shoulder_rotation: 'neutral',
        spinal_loading: 'low'
      };
    }

    // Default seguro
    return {
      axial_compression: 'low',
      shear_stress_knee: 'low',
      shoulder_rotation: 'neutral',
      spinal_loading: 'low'
    };
  }

  /**
   * Gera alternativas seguras para um exercício
   */
  generateAlternatives(exerciseId, conditions) {
    const allAlternatives = new Set();

    for (const condition of conditions) {
      const contraindication = CONTRAINDICATED_MECHANICS[condition];
      if (contraindication && contraindication.safeAlternatives) {
        for (const alt of contraindication.safeAlternatives) {
          if (alt.id !== exerciseId) {
            allAlternatives.add(alt.id);
          }
        }
      }
    }

    return Array.from(allAlternatives);
  }

  /**
   * Verifica se um exercício é seguro para um usuário com condição
   * @param {Object} exercise - Exercício do openGym
   * @param {string} condition - OrthopedicCondition
   * @param {Object} userBiomechanics - Biomecânica personalizada do usuário (opcional)
   */
  isSafeForUser(exercise, condition, userBiomechanics = null) {
    const contraindication = CONTRAINDICATED_MECHANICS[condition];
    if (!contraindication) return true;

    const exerciseBiomech = this.getExerciseBiomechanics(exercise);
    const prohibited = userBiomechanics
      ? { ...contraindication.prohibitedMechanics, ...userBiomechanics }
      : contraindication.prohibitedMechanics;

    // Verificar cada mecânica proibida
    return !(
      (prohibited.axialCompression !== 'none' &&
       this.levelExceeds(exerciseBiomech.axial_compression, prohibited.axialCompression)) ||
      (prohibited.shearStressKnee !== 'none' &&
       this.levelExceeds(exerciseBiomech.shear_stress_knee, prohibited.shearStressKnee)) ||
      (prohibited.shoulderRotation !== 'neutral' &&
       exerciseBiomech.shoulder_rotation === prohibited.shoulderRotation) ||
      (prohibited.spinalLoading !== 'none' &&
       this.levelExceeds(exerciseBiomech.spinal_loading, prohibited.spinalLoading))
    );
  }
}

/**
 * Funções utilitárias
 */

// Instância singleton
let filterInstance = null;

export function getFilter() {
  if (!filterInstance) {
    filterInstance = new BiomechanicalFilter();
  }
  return filterInstance;
}

export function filterExercisesForConditions(exercises, conditions) {
  const filter = getFilter();
  return filter.filterExercises(exercises, conditions);
}

export function isExerciseSafe(exercise, condition) {
  const filter = getFilter();
  return filter.isSafeForUser(exercise, condition);
}

export function getSafeAlternatives(exerciseId, conditions) {
  const filter = getFilter();
  return filter.generateAlternatives(exerciseId, conditions);
}