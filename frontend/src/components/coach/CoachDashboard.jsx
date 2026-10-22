// src/frontend/src/components/coach/CoachDashboard.jsx
// Dashboard principal que agrega todos os cards

import React, { useState } from 'react';
import { SafetyCard } from './SafetyCard';
import { NutritionCard } from './NutritionCard';
import { WorkoutCard } from './WorkoutCard';
import { CardioCard } from './CardioCard';
import { PostureCard } from './PostureCard';

export function CoachDashboard({ recommendations, api, onRetakePhotos }) {
  if (!recommendations) {
    return (
      <div className="coach-dashboard empty">
        <div className="empty-state">
          <div className="empty-icon">🤖</div>
          <h2>AI Coach Pronto</h2>
          <p>Complete o onboarding médico para receber seu plano personalizado</p>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: '📊' },
    { id: 'safety', label: 'Segurança', icon: '🛡️' },
    { id: 'nutrition', label: 'Nutrição', icon: '🥗' },
    { id: 'workout', label: 'Treino', icon: '🏋️' },
    { id: 'cardio', label: 'Cardio & Relógio', icon: '🏃' },
    { id: 'posture', label: 'Postura', icon: '👁️' }
  ];

  return (
    <div className="coach-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>🤖 Seu AI Coach</h1>
          <p className="subtitle">Plano personalizado baseado em ciência e suas necessidades</p>
        </div>
        <div className="header-right">
          <span className="last-updated">
            Atualizado: {new Date().toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="quick-stats">
        <div className="stat-card safety">
          <span className="stat-icon">{getRiskIcon(recommendations.safetyAssessment?.riskLevel)}</span>
          <div className="stat-info">
            <span className="stat-value">{getRiskLabel(recommendations.safetyAssessment?.riskLevel)}</span>
            <span className="stat-label">Risco Ortopédico</span>
          </div>
        </div>
        <div className="stat-card nutrition">
          <span className="stat-icon">🥗</span>
          <div className="stat-info">
            <span className="stat-value">{recommendations.nutritionPlan?.caloricTarget?.toLocaleString()} kcal</span>
            <span className="stat-label">{getStrategyLabel(recommendations.nutritionPlan?.strategy)}</span>
          </div>
        </div>
        <div className="stat-card workout">
          <span className="stat-icon">🏋️</span>
          <div className="stat-info">
            <span className="stat-value">{recommendations.workoutPlan?.splitType}</span>
            <span className="stat-label">{recommendations.workoutPlan?.weeklyFrequency}x/semana</span>
          </div>
        </div>
        <div className="stat-card cardio">
          <span className="stat-icon">🏃</span>
          <div className="stat-info">
            <span className="stat-value">{recommendations.cardioPlan?.weeklyFrequency || 3}x/semana</span>
            <span className="stat-label">{recommendations.cardioPlan?.targetZone?.name || 'Zona 2'}</span>
          </div>
        </div>
        <div className="stat-card posture">
          <span className="stat-icon">👁️</span>
          <div className="stat-info">
            <span className="stat-value">{recommendations.computerVision ? 'Analisado' : 'Pendente'}</span>
            <span className="stat-label">Análise Postural</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-grid">
            <SafetyCard assessment={recommendations.safetyAssessment} />
            <NutritionCard plan={recommendations.nutritionPlan} />
            <WorkoutCard plan={recommendations.workoutPlan} />
            {recommendations.cardioPlan && (
              <CardioCard cardioPlan={recommendations.cardioPlan} userProfile={recommendations.userProfile} />
            )}
            {recommendations.computerVision && (
              <PostureCard
                analysis={recommendations.computerVision}
                onRetakePhotos={onRetakePhotos}
              />
            )}
          </div>
        )}

        {activeTab === 'safety' && (
          <div className="single-card">
            <SafetyCard assessment={recommendations.safetyAssessment} />
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div className="single-card">
            <NutritionCard plan={recommendations.nutritionPlan} />
          </div>
        )}

        {activeTab === 'workout' && (
          <div className="single-card">
            <WorkoutCard plan={recommendations.workoutPlan} />
          </div>
        )}

        {activeTab === 'cardio' && (
          <div className="single-card">
            <CardioCard cardioPlan={recommendations.cardioPlan} userProfile={recommendations.userProfile} />
          </div>
        )}

        {activeTab === 'posture' && (
          <div className="single-card">
            {recommendations.computerVision ? (
              <PostureCard
                analysis={recommendations.computerVision}
                onRetakePhotos={onRetakePhotos}
              />
            ) : (
              <div className="posture-pending">
                <div className="pending-icon">📸</div>
                <h3>Análise Postural Pendente</h3>
                <p>Adicione uma foto de perfil no onboarding ou tire novas fotos para análise</p>
                {onRetakePhotos && (
                  <button className="btn-primary" onClick={onRetakePhotos}>
                    Tirar Fotos Agora
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="dashboard-actions">
        <button className="btn-secondary" onClick={() => api?.reset?.()}>
          🔄 Resetar Recomendações
        </button>
        <button className="btn-primary" onClick={onRetakePhotos}>
          📸 Atualizar Análise Postural
        </button>
      </div>
    </div>
  );
}

function getRiskIcon(level) {
  const icons = { low: '✅', moderate: '⚠️', high: '🚨' };
  return icons[level] || '❓';
}

function getRiskLabel(level) {
  const labels = { low: 'Baixo', moderate: 'Moderado', high: 'Alto' };
  return labels[level] || 'Desconhecido';
}

function getStrategyLabel(strategy) {
  const labels = { SURPLUS: 'Superávit', DEFICIT: 'Déficit', RECOMP: 'Recomp' };
  return labels[strategy] || strategy;
}

export default CoachDashboard;