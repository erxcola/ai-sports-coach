// src/frontend/src/components/coach/AICoachApp.jsx
// Componente principal que integra tudo - ponto de entrada do AI Coach

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
      // Salvar no localStorage para próximas sessões
      localStorage.setItem('aiCoachProfile', JSON.stringify(data));
      setIntakeCompleted(true);
      setShowIntake(false);

      // Importar automaticamente para o core store do openGym (rotinas, metas e cardio)
      try {
        await importAICoachToOpenGym({
          workoutPlan: recs?.workoutPlan,
          nutritionPlan: recs?.nutritionPlan,
          cardioPlan: recs?.cardioPlan,
          mobilityAssessment: null
        });
        useUI.getState().toast('Treinos e plano alimentar importados automaticamente para o openGym!');
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

  // Mostrar loading durante processamento
  if (isLoading) {
    return (
      <div className="ai-coach-app loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Gerando seu plano personalizado...</p>
          <p className="loading-detail">Analisando biomecânica, calculando nutrição e montando treino</p>
        </div>
      </div>
    );
  }

  // Mostrar erro se houver
  if (error) {
    return (
      <div className="ai-coach-app error">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2>Erro ao processar</h2>
          <p>{error}</p>
          <button className="btn-primary" onClick={() => setShowIntake(true)}>
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-coach-app">
      {/* Header Global */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <span className="logo-icon">🤖</span>
            <div>
              <h1>AI Sports Coach</h1>
              <p className="tagline">Biomecânica • Nutrição Clínica • Periodização</p>
            </div>
          </div>
          {intakeCompleted && (
            <div className="header-actions">
              <button className="btn-secondary" onClick={handleReset}>
                🔄 Refazer Onboarding
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {/* Medical Intake Modal */}
        <MedicalIntakeModal
          isOpen={showIntake || !intakeCompleted}
          onSubmit={handleIntakeSubmit}
          onClose={intakeCompleted ? () => setShowIntake(false) : undefined}
        />

        {/* Coach Dashboard */}
        {intakeCompleted && recommendations && (
          <CoachDashboard
            recommendations={recommendations}
            api={{ reset }}
            onRetakePhotos={handleRetakePhotos}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Baseado em evidências científicas: Schoenfeld, Helms, ISSN, MediaPipe
        </p>
        <p className="disclaimer">
          ⚠️ Este sistema fornece recomendações baseadas em algoritmos.
          Consulte sempre um profissional de saúde qualificado antes de iniciar qualquer programa de exercícios ou dieta.
        </p>
      </footer>
    </div>
  );
}

export default AICoachApp;