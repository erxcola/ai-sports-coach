// src/frontend/src/hooks/useAICoach.js
// Hook principal para integração do AI Coach no frontend openGym

import { useState, useCallback, useMemo } from 'react';
import {
  setupCoachIntegration,
  UserProfile,
  CoachRecommendations,
  SafetyAssessment,
  NutritionPlan,
  WorkoutPlan,
  OrthopedicCondition
} from '../../../lib/integration.js';

/**
 * Hook principal do AI Coach
 * Fornece API completa para o frontend openGym
 */
export function useAICoach() {
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // API de integração (singleton)
  const api = useMemo(() => setupCoachIntegration(setRecommendations), []);

  /**
   * Processa onboarding médico e gera recomendações
   */
  const processIntake = useCallback(async (intakeData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await api.processIntake(intakeData);
      setUserProfile(intakeData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  /**
   * Verifica se exercício é seguro para condições do usuário
   */
  const isExerciseSafe = useCallback((exercise, conditions) => {
    if (!conditions || conditions.length === 0) return true;

    for (const condition of conditions) {
      if (!api.isExerciseSafe(exercise, condition)) {
        return false;
      }
    }
    return true;
  }, [api]);

  /**
   * Obtém alternativas seguras para um exercício
   */
  const getSafeAlternatives = useCallback((exerciseId, conditions) => {
    return api.getSafeAlternatives(exerciseId, conditions);
  }, [api]);

  /**
   * Filtra lista de exercícios (ex: CATALOGUE do openGym)
   */
  const filterExercises = useCallback((allExercises, conditions) => {
    return api.getSafeExercises(allExercises, conditions);
  }, [api]);

  /**
   * Obtém plano nutricional para perfil
   */
  const getNutritionPlan = useCallback((profile) => {
    return api.getNutritionPlan(profile);
  }, [api]);

  /**
   * Obtém plano de treino para perfil
   */
  const getWorkoutPlan = useCallback((profile, contraindicated = []) => {
    return api.getWorkoutPlan(profile, contraindicated);
  }, [api]);

  /**
   * Análise de postura via visão computacional
   */
  const analyzePosture = useCallback(async (images) => {
    return api.analyzePhysique(images);
  }, [api]);

  /**
   * Reseta recomendações
   */
  const reset = useCallback(() => {
    setRecommendations(null);
    setUserProfile(null);
    setError(null);
  }, []);

  return {
    // State
    recommendations,
    isLoading,
    error,
    userProfile,

    // Actions
    processIntake,
    isExerciseSafe,
    getSafeAlternatives,
    filterExercises,
    getNutritionPlan,
    getWorkoutPlan,
    analyzePosture,
    reset,

    // Helpers
    hasRecommendations: !!recommendations,
    safetyAssessment: recommendations?.safetyAssessment,
    nutritionPlan: recommendations?.nutritionPlan,
    workoutPlan: recommendations?.workoutPlan,
    computerVision: recommendations?.computerVision
  };
}

/**
 * Hook para filtrar exercícios no ExercisePicker
 * Integra diretamente com CATALOGUE do openGym
 */
export function useSafeExercises(allExercises, orthopedicConditions) {
  const { filterExercises } = useAICoach();

  return useMemo(() => {
    if (!orthopedicConditions || orthopedicConditions.length === 0) {
      return { safeExercises: allExercises, avoidedExercises: [], alternatives: new Map() };
    }
    return filterExercises(allExercises, orthopedicConditions);
  }, [allExercises, orthopedicConditions, filterExercises]);
}

/**
 * Hook para validação de treino em tempo real
 */
export function useWorkoutValidator(routines, orthopedicConditions) {
  const { isExerciseSafe, getSafeAlternatives } = useAICoach();

  const validate = useCallback(() => {
    const violations = [];
    const suggestions = [];

    routines?.forEach(routine => {
      routine.exercises?.forEach(exercise => {
        orthopedicConditions?.forEach(condition => {
          if (!isExerciseSafe(exercise, condition)) {
            violations.push({
              exerciseId: exercise.id,
              exerciseName: exercise.n || exercise.name,
              condition,
              message: `Contraindicado para ${condition}`
            });

            const alternatives = getSafeAlternatives(exercise.id, [condition]);
            if (alternatives.length > 0) {
              suggestions.push({
                original: exercise.n || exercise.name,
                alternatives: alternatives.slice(0, 3),
                condition
              });
            }
          }
        });
      });
    });

    return { isValid: violations.length === 0, violations, suggestions };
  }, [routines, orthopedicConditions, isExerciseSafe, getSafeAlternatives]);

  return { validate, ...validate() };
}

export default useAICoach;