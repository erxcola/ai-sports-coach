// src/frontend/src/components/coach/CoachDashboard.jsx
// Dashboard do AI Coach integrado com openGym, importação direta de treinos/dieta e avaliação de mobilidade.

import React, { useState } from 'react';
import { SafetyCard } from './SafetyCard';
import { NutritionCard } from './NutritionCard';
import { WorkoutCard } from './WorkoutCard';
import { PostureCard } from './PostureCard';
import { CardioCard } from './CardioCard';
import { MobilityTestModal } from './MobilityTestModal';
import { importAICoachToOpenGym } from '../../lib/ai/plan-importer.js';
import { useUI } from '../../store/useUI.js';
import { useStore } from '../../store/useStore.js';

export function CoachDashboard({ recommendations, onRetakePhotos, api }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobilityModalOpen, setMobilityModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [imported, setImported] = useState(false);

  const mobilityAssessment = useStore(s => s.S?.mobilityAssessment);
  const dietPlanStored = useStore(s => s.S?.dietPlan);

  if (!recommendations) {
    return (
      <div className="coach-dashboard empty">
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h2>Nenhuma recomendação ainda</h2>
          <p>Complete o onboarding médico para gerar seu plano personalizado</p>
        </div>
      </div>
    );
  }

  const handleImportToOpenGym = async () => {
    setIsImporting(true);
    try {
      const res = await importAICoachToOpenGym({
        workoutPlan: recommendations.workoutPlan,
        nutritionPlan: recommendations.nutritionPlan,
        cardioPlan: recommendations.cardioPlan,
        mobilityAssessment: mobilityAssessment || null,
        orthopedicAdjustments: mobilityAssessment?.workoutAdjustments || []
      });
      setImported(true);
      useUI.getState().toast(`${res.routineCount} treinos e plano alimentar importados para o openGym!`);
    } catch (e) {
      console.error('Import error:', e);
      useUI.getState().toast('Erro ao importar para o openGym');
    } finally {
      setIsImporting(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: '📊' },
    { id: 'workout', label: 'Treino', icon: '🏋️' },
    { id: 'nutrition', label: 'Nutrição', icon: '🥗' },
    { id: 'cardio', label: 'Cardio', icon: '🏃' },
    { id: 'mobility', label: 'Mobilidade & Vídeo', icon: '📹' },
    { id: 'safety', label: 'Segurança', icon: '🛡️' },
    { id: 'posture', label: 'Postura', icon: '👁️' }
  ];

  return (
    <div className="coach-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>🤖 Seu AI Sports Coach</h1>
          <p className="subtitle">Prescrição biomecânica, metabólica e funcional integrada</p>
        </div>
        <div className="header-right">
          <span className="last-updated">
            Atualizado: {new Date().toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>

      {/* Sync / Import Call-to-Action Bar */}
      <div className="import-action-banner">
        <div className="banner-info">
          <span className="banner-badge">Sincronização Nativa</span>
          <h3>{imported ? '✓ Treinos & Dieta Sincronizados' : 'Importar Plano para o openGym'}</h3>
          <p>Transfere automaticamente as rotinas, repetições, metas calóricas e mobilidade para o seu diário de treino.</p>
        </div>
        <button
          className={`import-btn ${imported ? 'success' : 'primary'}`}
          onClick={handleImportToOpenGym}
          disabled={isImporting}
        >
          {isImporting ? 'Importando...' : imported ? '✓ Atualizar no openGym' : '📥 Importar Tudo para openGym'}
        </button>
      </div>

      {/* Quick Stats Bar */}
      <div className="quick-stats">
        <div className="stat-card workout">
          <span className="stat-icon">🏋️</span>
          <div className="stat-info">
            <span className="stat-value">{recommendations.workoutPlan?.splitType || 'ABC'}</span>
            <span className="stat-label">{recommendations.workoutPlan?.weeklyFrequency || 3}x/semana</span>
          </div>
        </div>
        <div className="stat-card nutrition">
          <span className="stat-icon">🥗</span>
          <div className="stat-info">
            <span className="stat-value">{recommendations.nutritionPlan?.caloricTarget?.toLocaleString()} kcal</span>
            <span className="stat-label">{getStrategyLabel(recommendations.nutritionPlan?.strategy)}</span>
          </div>
        </div>
        <div className="stat-card cardio">
          <span className="stat-icon">🏃</span>
          <div className="stat-info">
            <span className="stat-value">{recommendations.cardioPlan?.weeklyMinutes || 120} min</span>
            <span className="stat-label">{recommendations.cardioPlan?.modality || 'Zona 2'}</span>
          </div>
        </div>
        <div className="stat-card mobility-stat" onClick={() => setMobilityModalOpen(true)}>
          <span className="stat-icon">📹</span>
          <div className="stat-info">
            <span className="stat-value">{mobilityAssessment ? `${mobilityAssessment.score}/100` : 'Testar'}</span>
            <span className="stat-label">Mobilidade Funcional</span>
          </div>
        </div>
        <div className="stat-card safety">
          <span className="stat-icon">{getRiskIcon(recommendations.safetyAssessment?.riskLevel)}</span>
          <div className="stat-info">
            <span className="stat-value">{getRiskLabel(recommendations.safetyAssessment?.riskLevel)}</span>
            <span className="stat-label">Risco Ortopédico</span>
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
            <div className="coach-card mobility-promo-card">
              <div className="card-header">
                <h3>📹 Avaliação de Mobilidade por Vídeo</h3>
                <span className="badge badge-accent">Inteligência Biomecânica</span>
              </div>
              <p className="card-desc">
                Grave um teste rápido de 6 segundos com sua câmera. A IA analisa seus ângulos articulares de agachamento e dorsiflexão para blindar seus treinos.
              </p>
              {mobilityAssessment && (
                <div className="mobility-score-preview">
                  <strong>Último Score: {mobilityAssessment.score}/100</strong> — {mobilityAssessment.level}
                </div>
              )}
              <button className="btn-primary" onClick={() => setMobilityModalOpen(true)}>
                {mobilityAssessment ? 'Refazer Teste de Mobilidade' : 'Iniciar Avaliação com Câmera (6s)'}
              </button>
            </div>

            <WorkoutCard plan={recommendations.workoutPlan} />
            <NutritionCard plan={recommendations.nutritionPlan} />
            {recommendations.cardioPlan && (
              <CardioCard cardioPlan={recommendations.cardioPlan} userProfile={recommendations.userProfile} />
            )}
            <SafetyCard assessment={recommendations.safetyAssessment} />
            {recommendations.computerVision && (
              <PostureCard
                analysis={recommendations.computerVision}
                onRetakePhotos={onRetakePhotos}
              />
            )}
          </div>
        )}

        {activeTab === 'workout' && (
          <div className="single-card">
            <WorkoutCard plan={recommendations.workoutPlan} />
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <button className="btn-primary" onClick={handleImportToOpenGym}>
                📥 Importar estes Treinos para o openGym
              </button>
            </div>
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div className="single-card">
            <NutritionCard plan={recommendations.nutritionPlan} />
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <button className="btn-primary" onClick={handleImportToOpenGym}>
                🥗 Salvar Metas Nutricionais no Perfil
              </button>
            </div>
          </div>
        )}

        {activeTab === 'cardio' && (
          <div className="single-card">
            <CardioCard cardioPlan={recommendations.cardioPlan} userProfile={recommendations.userProfile} />
          </div>
        )}

        {activeTab === 'mobility' && (
          <div className="single-card">
            <div className="coach-card">
              <div className="card-header">
                <h3>📹 Testes de Mobilidade Funcional Guiados por Vídeo</h3>
                <button className="btn-primary small" onClick={() => setMobilityModalOpen(true)}>
                  Abrir Gravador de Testes
                </button>
              </div>
              <p className="card-desc">
                Grave um teste de 6 segundos de perfil com a câmera do celular. Nossa IA detecta limitações articulares e ajusta automaticamente seus exercícios no openGym.
              </p>

              {mobilityAssessment ? (
                <div className="mobility-assessment-details">
                  <div className="score-summary-box">
                    <div className="summary-val">{mobilityAssessment.score}<span>/100</span></div>
                    <div className="summary-desc">
                      <h4>{mobilityAssessment.level}</h4>
                      <p>{mobilityAssessment.testName}</p>
                    </div>
                  </div>

                  <h4 style={{ margin: '16px 0 8px' }}>Ângulos Medidos por IA:</h4>
                  <div className="metrics-grid">
                    {Object.entries(mobilityAssessment.calculatedAngles || {}).map(([k, val]) => (
                      <div key={k} className="metric-cell">
                        <span className="metric-label">{k}</span>
                        <span className="metric-val">{val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="diagnostic-box" style={{ marginTop: 14 }}>
                    <strong>Laudo Biomecânico:</strong>
                    <p>{mobilityAssessment.biomechanicalNotes}</p>
                  </div>

                  {mobilityAssessment.workoutAdjustments?.length > 0 && (
                    <div className="adaptations-box" style={{ marginTop: 14 }}>
                      <strong>Adaptações Recomendadas nos Treinos:</strong>
                      {mobilityAssessment.workoutAdjustments.map((a, i) => (
                        <div key={i} className="adj-item">
                          <strong>{a.exercise}:</strong> {a.adaptation}
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: 18 }}>
                    <button className="btn-primary" onClick={handleImportToOpenGym}>
                      ✓ Aplicar Adaptações aos Treinos openGym
                    </button>
                  </div>
                </div>
              ) : (
                <div className="empty-mobility-state">
                  <p>Nenhuma gravação de mobilidade realizada ainda.</p>
                  <button className="btn-primary" onClick={() => setMobilityModalOpen(true)}>
                    Gravar Primeiro Teste de Mobilidade
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'safety' && (
          <div className="single-card">
            <SafetyCard assessment={recommendations.safetyAssessment} />
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
                <p>Adicione fotos no intake para calcular assimetrias e percentual de gordura</p>
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
          🔄 Refazer Avaliação Completa
        </button>
        <button className="btn-primary" onClick={handleImportToOpenGym}>
          📥 Salvar e Importar para openGym
        </button>
      </div>

      {/* Mobility Test Modal */}
      <MobilityTestModal
        isOpen={mobilityModalOpen}
        onClose={() => setMobilityModalOpen(false)}
        onAssessmentComplete={(res) => {
          useUI.getState().toast(`Avaliação concluída! Score: ${res.score}/100`);
        }}
      />
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
  const labels = { SURPLUS: 'Superávit Calórico', DEFICIT: 'Déficit Calórico', RECOMP: 'Recomposição Corporal' };
  return labels[strategy] || strategy;
}

export default CoachDashboard;
