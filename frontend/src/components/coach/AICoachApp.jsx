// src/frontend/src/components/coach/AICoachApp.jsx
// Integracao unificada do AI Coach no openGym sem wrappers duplicados.

import React, { useState, useEffect, useCallback } from 'react';
import { useAICoach } from '../../hooks/useAICoach';
import { MedicalIntakeModal } from '../onboarding/MedicalIntakeModal';
import { CoachDashboard } from './CoachDashboard';
import { importAICoachToOpenGym } from '../../lib/ai/plan-importer.js';
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
  const [intakeCompleted, setIntakeCompleted] = useState(false);

  // Verificar se já existe profile salvo no localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('aiCoachProfile');
    if (savedProfile && !hasRecommendations) {
      try {
        const profile = JSON.parse(savedProfile);
        setIntakeCompleted(true);
        // Auto-processar se houver profile salvo
        processIntake(profile).then(() => {
          setShowIntake(false);
        }).catch(console.error);
      } catch (e) {
        console.error('Erro ao carregar profile salvo:', e);
      }
    }
  }, [hasRecommendations, processIntake]);

  const handleIntakeSubmit = useCallback(async (data) => {
    try {
      const recs = await processIntake(data);
      localStorage.setItem('aiCoachProfile', JSON.stringify(data));
      setIntakeCompleted(true);
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
    setIntakeCompleted(false);
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
      {/* Onboarding Form Sheet / Page */}
      {(showIntake || !intakeCompleted) ? (
        <MedicalIntakeModal
          isOpen={true}
          onSubmit={handleIntakeSubmit}
          onClose={intakeCompleted ? () => setShowIntake(false) : undefined}
        />
      ) : recommendations ? (
        <CoachDashboard
          recommendations={recommendations}
          api={{ reset: handleReset }}
          onRetakePhotos={handleRetakePhotos}
        />
      ) : null}
    </div>
  );
}

export default AICoachApp;
