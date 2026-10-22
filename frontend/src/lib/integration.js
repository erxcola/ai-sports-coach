/**
 * Camada de integração - Conecta todos os sistemas ao openGym
 * ES Module compatível com Vite/React
 */

import { BiomechanicalFilter, getFilter, filterExercisesForConditions, isExerciseSafe, getSafeAlternatives } from './biomechanics/filter.js';
import { OrthopedicCondition, CONTRAINDICATED_MECHANICS, EXERCISE_BIOMECHANICS, ALL_ORTHOPEDIC_CONDITIONS } from './types/biomechanics.js';
import { NutritionCalculator, createNutritionCalculator } from './ai/nutrition-calculator.js';
import { WorkoutGenerator, createWorkoutGenerator } from './ai/workout-generator.js';
import { ComputerVisionAnalyzer, createComputerVisionAnalyzer } from './ai/computer-vision.js';
import { CardioEngine, CARDIO_MODALITIES } from './ai/cardio-engine.js';
import { BluetoothHeartRateMonitor } from './wearables/bluetooth-heartrate.js';

export { OrthopedicCondition, CONTRAINDICATED_MECHANICS, EXERCISE_BIOMECHANICS, ALL_ORTHOPEDIC_CONDITIONS, CardioEngine, CARDIO_MODALITIES, BluetoothHeartRateMonitor };

// Import openGym catalog (will be available in frontend context)
// import { CATALOGUE, EXIDX } from '../../frontend/src/lib/exercises.js';

/**
 * Interface types for integration
 */

/**
 * UserProfile - Dados completos do usuário
 */
export class UserProfile {
  constructor(data = {}) {
    this.id = data.id || crypto.randomUUID();
    this.age = data.age || 0;
    this.sex = data.sex || 'male';
    this.height = data.height || 175; // cm
    this.weight = data.weight || 70; // kg
    this.bodyFatPercentage = data.bodyFatPercentage || 20;
    this.trainingAge = data.trainingAge || 0;
    this.goals = data.goals || ['hypertrophy'];
    this.orthopedicConditions = data.orthopedicConditions || [];
    this.painTriggers = data.painTriggers || [];
    this.mobilityLimits = data.mobilityLimits || {
      shoulderFlexion: 180,
      shoulderAbduction: 180,
      kneeFlexion: 150,
      hipFlexion: 160,
      thoracicExtension: 40,
      lumbarFlexion: 40
    };
    this.demographics = data.demographics || {
      dominantHand: 'right',
      occupation: 'desk',
      activityLevel: 'moderately_active'
    };
    this.profileImage = data.profileImage || null;
  }
}

/**
 * SafetyAssessment - Avaliação de segurança ortopédica
 */
export class SafetyAssessment {
  constructor(data = {}) {
    this.riskLevel = data.riskLevel || 'low';
    this.contraindicatedExercises = data.contraindicatedExercises || [];
    this.safeAlternatives = data.safeAlternatives || new Map();
    this.mobilityAssessment = data.mobilityAssessment || {
      shoulder: 'good',
      knee: 'good',
      hip: 'good',
      thoracic: 'good',
      lumbar: 'good'
    };
  }
}

/**
 * NutritionPlan - Plano nutricional
 */
export class NutritionPlan {
  constructor(data = {}) {
    this.caloricTarget = data.caloricTarget || 0;
    this.strategy = data.strategy || 'RECOMP';
    this.macronutrients = data.macronutrients || { protein: 0, carbohydrates: 0, fats: 0, fiber: 0 };
    this.perMealDistribution = data.perMealDistribution || {};
    this.hydration = data.hydration || '';
    this.jointSupport = data.jointSupport || [];
    this.micronutrients = data.micronutrients || {};
    this.timing = data.timing || {};
  }
}

/**
 * WorkoutPlan - Plano de treino
 */
export class WorkoutPlan {
  constructor(data = {}) {
    this.splitType = data.splitType || 'Upper/Lower';
    this.weeklyFrequency = data.weeklyFrequency || 4;
    this.targetVolumeSummary = data.targetVolumeSummary || {};
    this.routines = data.routines || [];
    this.progressiveOverload = data.progressiveOverload || {};
  }
}

/**
 * CoachRecommendations - Recomendações completas do AI Coach
 */
export class CoachRecommendations {
  constructor(data = {}) {
    this.safetyAssessment = data.safetyAssessment || new SafetyAssessment();
    this.nutritionPlan = data.nutritionPlan || new NutritionPlan();
    this.workoutPlan = data.workoutPlan || new WorkoutPlan();
    this.cardioPlan = data.cardioPlan || null;
    this.computerVision = data.computerVision || null;
  }
}

/**
 * IntegrationLayer - Classe principal que conecta todos os sistemas
 */
export class IntegrationLayer {
  constructor() {
    this.biomechanicalFilter = getFilter(); // singleton
    this.nutritionCalculator = createNutritionCalculator();
    this.workoutGenerator = createWorkoutGenerator();
    this.computerVision = createComputerVisionAnalyzer();
  }

  /**
   * Gera recomendações completas do coach AI
   * @param {Object} userData - { profile: UserProfile, profileImage?: string }
   * @returns {Promise<CoachRecommendations>}
   */
  async generateRecommendations(userData) {
    const { profile, profileImage } = userData;

    // 1. Avaliação de segurança ortopédica
    const safetyAssessment = await this.assessOrthopedicSafety(profile);

    // 2. Plano nutricional
    const nutritionPlan = this.calculateNutrition(profile);

    // 3. Plano de treino
    const workoutPlan = this.generateWorkoutPlan(profile, safetyAssessment);

    // 4. Prescrição de cardio clínico e aeróbio (ISSN / ACSM)
    const cardioPlan = CardioEngine.prescribeCardio({
      goal: profile.goals?.[0] || 'hypertrophy',
      age: profile.age || 28,
      bodyWeight: profile.weight || 75,
      restingHeartRate: profile.restingHeartRate || 65,
      orthopedicConditions: profile.orthopedicConditions || [],
      trainingDaysPerWeek: this.determineTrainingDays(profile.orthopedicConditions)
    });

    // 5. Análise de visão computacional (se houver imagem)
    let computerVision = null;
    if (profileImage) {
      computerVision = await this.analyzePosture(profileImage);
    }

    return new CoachRecommendations({
      safetyAssessment,
      nutritionPlan,
      workoutPlan,
      cardioPlan,
      computerVision
    });
  }

  async assessOrthopedicSafety(profile) {
    // Import CATALOGUE dynamically (available in frontend context)
    const exercises = this.getOpenGymCatalogue();

    const { safeExercises, avoidedExercises, alternatives } =
      this.biomechanicalFilter.filterExercises(exercises, profile.orthopedicConditions);

    const mobilityAssessment = this.assessMobility(profile.mobilityLimits);
    const riskLevel = this.calculateRiskLevel(avoidedExercises, profile.orthopedicConditions, exercises.length);

    return new SafetyAssessment({
      riskLevel,
      contraindicatedExercises: avoidedExercises.map(ex => ex.id),
      safeAlternatives: alternatives,
      mobilityAssessment
    });
  }

  calculateNutrition(profile) {
    const planData = this.nutritionCalculator.calculateNutritionPlan({
      userId: profile.id,
      goal: profile.goals[0] || 'hypertrophy',
      activityLevel: profile.demographics.activityLevel,
      dietaryRestrictions: this.detectDietaryRestrictions(profile),
      bodyWeight: profile.weight,
      bodyFatPercentage: profile.bodyFatPercentage,
      age: profile.age,
      sex: profile.sex,
      height: profile.height
    });

    return new NutritionPlan(planData);
  }

  generateWorkoutPlan(profile, safety) {
    const planData = this.workoutGenerator.generateWorkoutPlan({
      userId: profile.id,
      goal: profile.goals[0] || 'hypertrophy',
      trainingDays: this.determineTrainingDays(profile.orthopedicConditions),
      restDays: this.determineRestDays(profile.orthopedicConditions),
      orthopedicConditions: profile.orthopedicConditions,
      experienceLevel: this.determineExperienceLevel(profile.trainingAge)
    });

    return new WorkoutPlan(planData);
  }

  async analyzePosture(profileImage) {
    return this.computerVision.analyzePhysique({
      front: profileImage,
      side: '',
      back: ''
    });
  }

  assessMobility(limits) {
    const assess = (range, optimal = 180) => {
      if (range >= optimal * 0.9) return 'good';
      if (range >= optimal * 0.7) return 'limited';
      return 'restricted';
    };

    return {
      shoulder: assess(limits.shoulderFlexion),
      knee: assess(limits.kneeFlexion),
      hip: assess(limits.hipFlexion),
      thoracic: assess(limits.thoracicExtension),
      lumbar: assess(limits.lumbarFlexion)
    };
  }

  calculateRiskLevel(avoidedExercises, conditions, totalExercises) {
    if (conditions.length === 0) return 'low';
    if (avoidedExercises.length > totalExercises * 0.5) return 'high';
    if (avoidedExercises.length > 0) return 'moderate';
    return 'low';
  }

  detectDietaryRestrictions(profile) {
    const restrictions = [];
    if (profile.goals.some(g => g.toLowerCase().includes('vegetarian'))) restrictions.push('vegetarian');
    if (profile.goals.some(g => g.toLowerCase().includes('vegan'))) restrictions.push('vegan');
    if (profile.goals.some(g => g.toLowerCase().includes('gluten'))) restrictions.push('gluten_free');
    if (profile.goals.some(g => g.toLowerCase().includes('dairy'))) restrictions.push('dairy_free');
    return restrictions;
  }

  determineTrainingDays(conditions) {
    if (conditions.includes(OrthopedicCondition.SCOLIOSIS)) return 3;
    if (conditions.includes(OrthopedicCondition.KNEE_CHONDROMALACIA)) return 3;
    if (conditions.includes(OrthopedicCondition.SHOULDER_IMPINGEMENT)) return 4;
    return 5;
  }

  determineRestDays(conditions) {
    return conditions.length > 0 ? 3 : 2;
  }

  determineExperienceLevel(trainingAge) {
    if (trainingAge < 1) return 'beginner';
    if (trainingAge < 3) return 'intermediate';
    return 'advanced';
  }

  /**
   * Obtém catálogo de exercícios do openGym
   * Na prática, isso vem do contexto do frontend (CATALOGUE)
   */
  getOpenGymCatalogue() {
    // This will be replaced by actual CATALOGUE import in frontend
    // For now, return empty array - the frontend will override
    return [];
  }
}

/**
 * Factory function para criar instância de integração
 */
export function initIntegration() {
  return new IntegrationLayer();
}

/**
 * Setup completo para integração com frontend openGym
 * @param {Function} onRecommendationsChange - Callback quando recomendações mudam
 * @returns {Object} API de integração
 */
export function setupCoachIntegration(onRecommendationsChange) {
  const integration = initIntegration();

  return {
    /**
     * Processa intake médico e gera recomendações
     * @param {Object} intakeData - Dados do formulário MedicalIntakeModal
     * @returns {Promise<CoachRecommendations>}
     */
    processIntake: async (intakeData) => {
      const profile = new UserProfile({
        age: intakeData.age,
        sex: intakeData.sex,
        height: intakeData.height,
        weight: intakeData.weight,
        bodyFatPercentage: intakeData.bodyFatPercentage,
        trainingAge: intakeData.trainingAge,
        goals: intakeData.goals || ['hypertrophy'],
        orthopedicConditions: intakeData.orthopedicConditions?.map(
          c => c === 'none' ? '' : c
        ).filter(c => c) || [],
        painTriggers: intakeData.painTriggers || [],
        mobilityLimits: {
          shoulderFlexion: intakeData.mobilityLimits?.shoulderFlexion ?? 180,
          shoulderAbduction: intakeData.mobilityLimits?.shoulderAbduction ?? 180,
          kneeFlexion: intakeData.mobilityLimits?.kneeFlexion ?? 150,
          hipFlexion: intakeData.mobilityLimits?.hipFlexion ?? 160,
          thoracicExtension: intakeData.mobilityLimits?.thoracicExtension ?? 40,
          lumbarFlexion: intakeData.mobilityLimits?.lumbarFlexion ?? 40
        },
        demographics: {
          dominantHand: intakeData.dominantHand ?? 'right',
          occupation: intakeData.occupation ?? 'desk',
          activityLevel: intakeData.activityLevel ?? 'moderately_active'
        },
        profileImage: intakeData.profileImage
      });

      const recommendations = await integration.generateRecommendations({
        profile,
        profileImage: intakeData.profileImage
      });

      if (onRecommendationsChange) {
        onRecommendationsChange(recommendations);
      }

      return recommendations;
    },

    /**
     * Obtém exercícios seguros para condições do usuário
     * @param {Array} allExercises - Lista completa (CATALOGUE)
     * @param {Array} conditions - Condições ortopédicas
     * @returns {Object} { safeExercises, avoidedExercises, alternatives }
     */
    getSafeExercises: (allExercises, conditions) =>
      filterExercisesForConditions(allExercises, conditions),

    /**
     * Verifica se exercício específico é seguro
     */
    isExerciseSafe: (exercise, condition) =>
      isExerciseSafe(exercise, condition),

    /**
     * Obtém alternativas seguras para exercício
     */
    getSafeAlternatives: (exerciseId, conditions) =>
      getSafeAlternatives(exerciseId, conditions),

    /**
     * Obtém plano nutricional
     */
    getNutritionPlan: (profile) =>
      integration.nutritionCalculator.calculateNutritionPlan({
        userId: profile.id,
        goal: profile.goals[0] || 'hypertrophy',
        activityLevel: profile.demographics.activityLevel,
        dietaryRestrictions: integration.detectDietaryRestrictions(profile),
        bodyWeight: profile.weight,
        bodyFatPercentage: profile.bodyFatPercentage,
        age: profile.age,
        sex: profile.sex,
        height: profile.height
      }),

    /**
     * Obtém plano de treino
     */
    getWorkoutPlan: (profile, contraindicated = []) =>
      integration.workoutGenerator.generateWorkoutPlan({
        userId: profile.id,
        goal: profile.goals[0] || 'hypertrophy',
        trainingDays: integration.determineTrainingDays(profile.orthopedicConditions),
        restDays: integration.determineRestDays(profile.orthopedicConditions),
        orthopedicConditions: contraindicated,
        experienceLevel: integration.determineExperienceLevel(profile.trainingAge)
      }),

    /**
     * Análise de visão computacional
     */
    analyzePhysique: (images) =>
      integration.computerVision.analyzePhysique(images),

    /**
     * Prescrição de cardio clínico e aeróbio
     */
    getCardioPlan: (profile) =>
      CardioEngine.prescribeCardio({
        goal: profile.goals?.[0] || 'hypertrophy',
        age: profile.age || 28,
        bodyWeight: profile.weight || 75,
        restingHeartRate: profile.restingHeartRate || 65,
        orthopedicConditions: profile.orthopedicConditions || [],
        trainingDaysPerWeek: integration.determineTrainingDays(profile.orthopedicConditions)
      }),

    // Expor classes para uso direto
    IntegrationLayer,
    UserProfile,
    SafetyAssessment,
    NutritionPlan,
    WorkoutPlan,
    CardioEngine,
    CARDIO_MODALITIES,
    BluetoothHeartRateMonitor,
    CoachRecommendations,
    OrthopedicCondition,
    CONTRAINDICATED_MECHANICS,
    EXERCISE_BIOMECHANICS,
    ALL_ORTHOPEDIC_CONDITIONS
  };
}

// Export default
export default {
  initIntegration,
  setupCoachIntegration,
  IntegrationLayer,
  UserProfile,
  SafetyAssessment,
  NutritionPlan,
  WorkoutPlan,
  CardioEngine,
  CARDIO_MODALITIES,
  BluetoothHeartRateMonitor,
  CoachRecommendations,
  OrthopedicCondition,
  CONTRAINDICATED_MECHANICS,
  EXERCISE_BIOMECHANICS,
  ALL_ORTHOPEDIC_CONDITIONS,
  BiomechanicalFilter,
  NutritionCalculator,
  WorkoutGenerator,
  ComputerVisionAnalyzer
};