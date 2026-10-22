// src/frontend/src/components/coach/AICoachApp.jsx
// Integracao unificada do AI Coach no openGym sem wrappers duplicados.
// Carrega planos salvos automaticamente do store openGym (S.dietPlan, S.routines, S.cardioPlan).

import React, { useState, useEffect, useCallback } from 'react';
import { useAICoach } from '../../hooks/useAICoach';
import { MedicalIntakeModal } from '../onboarding/MedicalIntakeModal';
import { CoachDashboard } from './CoachDashboard';
import { importAICoachToOpenGym } from '../../lib/ai/plan-importer.js';
import { useStore } from '../../store/useStore.js';
import { useUI } from '../../store/useUI.js';
import './coach-styles.css';

export function AICoachApp() {
  const {
    recommendations,
    isLoading,
    error,
    userProfile,
    processIntake,
    reset,
    hasRecommendations
  } = useAICoach();

  const [showIntake, setShowIntake] = useState(false);

  // OpenGym store state
  const S = useStore(s => s.S) || {};
  const activeDiet = S.dietPlan;
  const activeCardio = S.cardioPlan;
  const activeMobility = S.mobilityAssessment;
  const activeRoutines = S.routines || [];

  // Reconstruct full recommendations from openGym store if already saved
  const effectiveRecommendations = recommendations || (activeDiet ? {
    workoutPlan: {
      splitType: activeRoutines.length >= 4 ? 'ABCD' : activeRoutines.length === 3 ? 'ABC' : 'Personalizada',
      weeklyFrequency: activeRoutines.length || 3,
      routines: activeRoutines.map((r, i) => ({
        day: r.name || `Treino ${String.fromCharCode(65 + i)}`,
        name: r.name,
        focus: r.name,
        weeklyVolume: (r.ex || []).length * 3,
        exercises: (r.ex || []).map(e => ({
          name: e.name || e.n,
          sets: e.sets || 3,
          repRange: `${e.minReps || 8}-${e.maxReps || 12}`,
          targetRIR: 2,
          restSeconds: e.rest || 90,
          safe: true,
          orthopedicNotes: e.note || null
        }))
      })),
      targetVolumeSummary: {
        chest: 12, back: 14, shoulders: 10, quads: 12, hamstrings: 10, arms: 8, calves: 6, core: 6
      },
      progressiveOverload: { weeklyIncrease: '+2.5% ou +1 repetição', deloadFrequency: 5 }
    },
    nutritionPlan: {
      caloricTarget: activeDiet.caloricTarget || 2200,
      strategy: activeDiet.strategy || 'Recomposição Corporal',
      macronutrients: {
        protein: activeDiet.proteinGrams || activeDiet.macros?.proteinGrams || 160,
        carbohydrates: activeDiet.carbGrams || activeDiet.macros?.carbGrams || 220,
        fats: activeDiet.fatGrams || activeDiet.macros?.fatGrams || 65,
        fiber: 30
      },
      hydration: `${activeDiet.hydrationLiters || 3.2} Litros de água por dia`,
      meals: activeDiet.meals || []
    },
    cardioPlan: {
      protocolType: activeCardio?.modality || 'Zona 2 (FatMax)',
      weeklyFrequency: 3,
      sessionDurationMin: 40,
      neatStepsTarget: activeCardio?.neatTarget || 10000,
      targetZone: { name: 'Zona 2 (FatMax)', bpmRange: [120, 138], focus: 'Oxidação máxima de lipídios sem catabolismo.' },
      calorieBurnPerSessionEst: 320,
      primaryModality: { name: activeCardio?.modality || 'Caminhada Inclinada', impact: 'Baixo' },
      safeModalities: [
        { id: 'incline_treadmill', name: 'Caminhada Inclinada', impact: 'Baixo' },
        { id: 'stationary_bike', name: 'Bicicleta Estática', impact: 'Nulo' },
        { id: 'elliptical', name: 'Transport / Elíptico', impact: 'Nulo' },
        { id: 'swimming', name: 'Natação Leve', impact: 'Nulo' }
      ]
    },
    userProfile: {
      name: 'Atleta',
      goal: 'Hipertrofia'
    }
  } : null);

  // Check localStorage for offline intake data if neither state nor store has it
  useEffect(() => {
    const savedProfile = localStorage.getItem('aiCoachProfile');
    if (savedProfile && !effectiveRecommendations && !hasRecommendations) {
      try {
        const profile = JSON.parse(savedProfile);
        processIntake(profile).catch(console.error);
      } catch (e) {
        console.error('Erro ao carregar profile salvo:', e);
      }
    }
  }, [effectiveRecommendations, hasRecommendations, processIntake]);

  const handleIntakeSubmit = useCallback(async (data) => {
    try {
      const recs = await processIntake(data);
      localStorage.setItem('aiCoachProfile', JSON.stringify(data));
      setShowIntake(false);

      // Auto-import direto para o store do openGym
      try {
        await importAICoachToOpenGym({
          workoutPlan: recs?.workoutPlan,
          nutritionPlan: recs?.nutritionPlan,
          cardioPlan: recs?.cardioPlan,
          mobilityAssessment: null
        });
        useUI.getState().toast('Treinos e plano alimentar sincronizados no openGym!');
      } catch (importErr) {
        console.warn('Auto import non-fatal:', importErr);
      }
    } catch (err) {
      console.error('Erro no onboarding:', err);
    }
  }, [processIntake]);

  const handleRetakePhotos = useCallback(() => {
    setShowIntake(true);
  }, []);

  const handleReset = useCallback(() => {
    localStorage.removeItem('aiCoachProfile');
    reset();
    setShowIntake(true);
  }, [reset]);

  // Loading state com estilo nativo openGym
  if (isLoading) {
    return (
      <div className="empty" style={{ paddingTop: '35vh' }}>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p style={{ marginTop: 14, fontWeight: 600 }}>Gerando prescrição personalizada...</p>
          <p style={{ fontSize: 13, color: 'var(--label-2)' }}>Calculando biomecânica, nutrição clínica e rotinas</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="empty" style={{ paddingTop: '30vh' }}>
        <p style={{ color: 'var(--red)', fontWeight: 600 }}>{error}</p>
        <div style={{ marginTop: 14 }}>
          <button className="btn-primary" onClick={() => setShowIntake(true)}>
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-coach-native-page">
      {/* Se showIntake for true OU se nao tiver nenhuma recomendacao salva, mostra o formulario */}
      {(showIntake || !effectiveRecommendations) ? (
        <MedicalIntakeModal
          isOpen={true}
          onSubmit={handleIntakeSubmit}
          onClose={effectiveRecommendations ? () => setShowIntake(false) : undefined}
        />
      ) : (
        <CoachDashboard
          recommendations={effectiveRecommendations}
          api={{ reset: handleReset }}
          onRetakePhotos={handleRetakePhotos}
        />
      )}
    </div>
  );
}

export default AICoachApp;
