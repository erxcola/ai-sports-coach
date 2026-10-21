/**
 * Integration layer for AI Sports Nutritionist & Biomechanical Personal Trainer
 * Connects all developed systems to the openGym codebase
 */

import { BiomechanicalFilter } from './biomechanics/filter';
import { OrthopedicCondition } from './types/biomechanics';
import { NutritionCalculator } from './ai/nutrition-calculator';
import { WorkoutGenerator } from './ai/workout-generator';
import { ComputerVisionAnalyzer } from './ai/computer-vision';
import { EXDB, EXIDX, CATALOGUE } from './exercises';

// Types for integration
export interface UserProfile {
  id: string;
  age: number;
  sex: 'male' | 'female' | 'other';
  height: number; // cm
  weight: number; // kg
  bodyFatPercentage: number;
  trainingAge: number;
  goals: string[];
  orthopedicConditions: OrthopedicCondition[];
  painTriggers: string[];
  mobilityLimits: {
    shoulderFlexion: number;
    shoulderAbduction: number;
    kneeFlexion: number;
    hipFlexion: number;
    thoracicExtension: number;
    lumbarFlexion: number;
  };
  demographics: {
    dominantHand: 'left' | 'right';
    occupation: string;
    activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
  };
  profileImage?: string;
}

export interface SafetyAssessment {
  riskLevel: 'low' | 'moderate' | 'high';
  contraindicatedExercises: string[];
  safeAlternatives: Map<string, string[]>;
  mobilityAssessment: {
    shoulder: 'good' | 'limited' | 'restricted';
    knee: 'good' | 'limited' | 'restricted';
    hip: 'good' | 'limited' | 'restricted';
    thoracic: 'good' | 'limited' | 'restricted';
    lumbar: 'good' | 'limited' | 'restricted';
  };
}

export interface NutritionPlan {
  caloricTarget: number;
  macronutrients: {
    protein: number; // g/kg
    carbohydrates: number; // g/kg
    fats: number; // g/kg
  };
  mealDistribution: number;
  hydration: string;
  jointSupport: string[];
}

export interface WorkoutPlan {
  splitType: string;
  trainingDays: number;
  restDays: number;
  routines: Array<{
    day: string;
    focus: string;
    exercises: Array<{
      id: string;
      name: string;
      sets: number;
      reps: string;
      rir: number;
      restSeconds: number;
      orthopedicNotes: string;
      safe: boolean;
    }>;
    weeklyVolume: number;
  }>;
  progressiveOverload: {
    weeklyIncrease: number;
    deloadFrequency: number;
    deloadWeek: number;
  };
}

export interface CoachRecommendations {
  safetyAssessment: SafetyAssessment;
  nutritionPlan: NutritionPlan;
  workoutPlan: WorkoutPlan;
  computerVision?: {
    postureAssessment: {
      forwardHead: 'none' | 'mild' | 'moderate' | 'severe';
      roundedShoulders: 'none' | 'mild' | 'moderate' | 'severe';
      pelvicTilt: 'anterior' | 'neutral' | 'posterior';
      kneeValgus: 'none' | 'present';
    };
    physiqueImbalances: {
      laggingMuscleGroups: string[];
      dominantMuscleGroups: string[];
    };
    orthopedicRiskFlags: string[];
  };
}

/**
 * Main integration class that connects all systems
 */
export class IntegrationLayer {
  private biomechanicalFilter: BiomechanicalFilter;
  private nutritionCalculator: NutritionCalculator;
  private workoutGenerator: WorkoutGenerator;
  private computerVision: ComputerVisionAnalyzer;

  constructor() {
    this.biomechanicalFilter = new BiomechanicalFilter();
    this.nutritionCalculator = new NutritionCalculator();
    this.workoutGenerator = new WorkoutGenerator();
    this.computerVision = new ComputerVisionAnalyzer();
  }

  /**
   * Generate complete coach recommendations from user data
   */
  async generateRecommendations(
    userData: {
      profile: UserProfile;
      profileImage?: string;
    }
  ): Promise<CoachRecommendations> {
    const { profile, profileImage } = userData;

    // 1. Safety assessment
    const safetyAssessment = await this.assessOrthopedicSafety(profile);

    // 2. Nutrition plan
    const nutritionPlan = this.calculateNutrition(profile);

    // 3. Workout plan
    const workoutPlan = this.generateWorkoutPlan(profile, safetyAssessment);

    // 4. Computer vision analysis (if image provided)
    let computerVision: CoachRecommendations['computerVision'] = undefined;
    if (profileImage) {
      computerVision = await this.analyzePosture(profileImage);
    }

    return {
      safetyAssessment,
      nutritionPlan,
      workoutPlan,
      computerVision
    };
  }

  private async assessOrthopedicSafety(
    profile: UserProfile
  ): Promise<SafetyAssessment> {
    // Filter exercises based on conditions
    const { safeExercises, avoidedExercises, alternatives } = this.biomechanicalFilter.filterExercises(
      CATALOGUE,
      profile.orthopedicConditions
    );

    // Mobility assessment
    const mobilityAssessment = this.assessMobility(profile.mobilityLimits);

    // Calculate risk level
    const riskLevel = this.calculateRiskLevel(
      avoidedExercises,
      profile.orthopedicConditions
    );

    return {
      riskLevel,
      contraindicatedExercises: avoidedExercises.map(ex => ex.id),
      safeAlternatives: alternatives,
      mobilityAssessment
    };
  }

  private calculateNutrition(profile: UserProfile): NutritionPlan {
    return this.nutritionCalculator.calculateNutritionPlan({
      userId: profile.id,
      goal: profile.goals[0] || 'hypertrophy',
      activityLevel: profile.demographics.activityLevel,
      dietaryRestrictions: this.detectDietaryRestrictions(profile)
    });
  }

  private generateWorkoutPlan(
    profile: UserProfile,
    safety: SafetyAssessment
  ): WorkoutPlan {
    return this.workoutGenerator.generateWorkoutPlan({
      userId: profile.id,
      goal: profile.goals[0] || 'hypertrophy',
      trainingDays: this.determineTrainingDays(profile.orthopedicConditions),
      restDays: this.determineRestDays(profile.orthopedicConditions),
      orthopedicConditions: profile.orthopedicConditions.map(c => c.toString()),
      experienceLevel: this.determineExperienceLevel(profile.trainingAge)
    });
  }

  private async analyzePosture(profileImage: string) {
    return this.computerVision.analyzePhysique({
      front: profileImage,
      side: '',
      back: ''
    });
  }

  private assessMobility(limits: UserProfile['mobilityLimits']) {
    const assess = (range: number, optimal: number = 180) => {
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

  private calculateRiskLevel(
    avoided: typeof CATALOGUE,
    conditions: OrthopedicCondition[]
  ): 'low' | 'moderate' | 'high' {
    if (conditions.length === 0) return 'low';
    if (avoided.length > CATALOGUE.length * 0.5) return 'high';
    if (avoided.length > 0) return 'moderate';
    return 'low';
  }

  private detectDietaryRestrictions(profile: UserProfile): string[] {
    const restrictions: string[] = [];
    if (profile.goals.some(g => g.toLowerCase().includes('vegetarian'))) {
      restrictions.push('vegetarian');
    }
    if (profile.goals.some(g => g.toLowerCase().includes('vegan'))) {
      restrictions.push('vegan');
    }
    if (profile.goals.some(g => g.toLowerCase().includes('gluten'))) {
      restrictions.push('gluten_free');
    }
    return restrictions;
  }

  private determineTrainingDays(conditions: string[]): number {
    if (conditions.some(c => c === 'scoliosis')) return 3;
    if (conditions.some(c => c === 'knee_chondromalacia')) return 3;
    if (conditions.some(c => c === 'shoulder_impingement')) return 4;
    return 5;
  }

  private determineRestDays(conditions: string[]): number {
    return conditions.length > 0 ? 3 : 2;
  }

  private determineExperienceLevel(trainingAge: number): string {
    if (trainingAge < 1) return 'beginner';
    if (trainingAge < 3) return 'intermediate';
    return 'advanced';
  }
}

/**
 * Utility functions for integration
 */

export function initIntegration(): IntegrationLayer {
  return new IntegrationLayer();
}

export function filterExercisesForConditions(
  exercises: typeof CATALOGUE,
  conditions: OrthopedicCondition[]
) {
  const filter = new (await import('./biomechanics/filter')).BiomechanicalFilter();
  return filter.filterExercises(exercises, conditions);
}

export function calculateNutritionForProfile(
  profile: UserProfile
) {
  const calculator = new (await import('./ai/nutrition-calculator')).NutritionCalculator();
  return calculator.calculateNutritionPlan({
    userId: profile.id,
    goal: profile.goals[0] || 'hypertrophy',
    activityLevel: profile.demographics.activityLevel,
    dietaryRestrictions: calculator.detectDietaryRestrictions(profile)
  });
}

export function generateWorkoutPlanForProfile(
  profile: UserProfile,
  safetyContraindicated: string[]
) {
  const generator = new (await import('./ai/workout-generator')).WorkoutGenerator();
  return generator.generateWorkoutPlan({
    userId: profile.id,
    goal: profile.goals[0] || 'hypertrophy',
    trainingDays: 5,
    restDays: 2,
    orthopedicConditions: safetyContraindicated,
    experienceLevel: generator.determineExperienceLevel(profile.trainingAge)
  });
}

/**
 * Example usage integration with openGym frontend
 */
export function setupCoachIntegration(
  onRecommendationsChange: (recommendations: CoachRecommendations) => void
) {
  const integration = initIntegration();

  return {
    /**
     * Process medical intake and generate recommendations
     */
    processIntake: async (intakeData: any) => {
      const profile: UserProfile = {
        id: crypto.randomUUID(),
        age: intakeData.age,
        sex: intakeData.sex,
        height: intakeData.height,
        weight: intakeData.weight,
        bodyFatPercentage: intakeData.bodyFatPercentage,
        trainingAge: intakeData.trainingAge,
        goals: intakeData.goals || ['hypertrophy'],
        orthopedicConditions: intakeData.orthopedicConditions?.map(
          (c: string) => (c === 'none' ? '' : c)
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
        }
      };

      const profileImage = intakeData.profileImage;

      const recommendations = await integration.generateRecommendations({
        profile,
        profileImage
      });

      onRecommendationsChange(recommendations);
      return recommendations;
    },

    /**
     * Get safe exercises for user conditions
     */
    getSafeExercises: (allExercises: typeof CATALOGUE, conditions: OrthopedicCondition[]) =>
      filterExercisesForConditions(allExercises, conditions),

    /**
     * Get nutrition plan for user profile
     */
    getNutritionPlan: (profile: UserProfile) => calculateNutritionForProfile(profile),

    /**
     * Get workout plan for user profile
     */
    getWorkoutPlan: (profile: UserProfile, contraindicated: string[]) =>
      generateWorkoutPlanForProfile(profile, contraindicated)
  };
}