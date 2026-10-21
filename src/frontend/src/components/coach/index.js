// src/frontend/src/components/coach/index.js
// Barrel export para todos os componentes do AI Coach

export { useAICoach, useSafeExercises, useWorkoutValidator } from '../../hooks/useAICoach';
export { SafetyCard } from './SafetyCard';
export { NutritionCard } from './NutritionCard';
export { WorkoutCard } from './WorkoutCard';
export { PostureCard } from './PostureCard';
export { CoachDashboard } from './CoachDashboard';
export { AICoachApp } from './AICoachApp';
export { MedicalIntakeModal } from '../onboarding/MedicalIntakeModal';

// Import styles
import './coach-styles.css';