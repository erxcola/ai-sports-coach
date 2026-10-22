// src/frontend/src/components/coach/CoachDashboard.jsx
// Dashboard do AI Coach integrado nativamente ao design system do openGym.
// Elimina headers duplicados, espacamento excessivo e textos cortados em telas de celular.

import React, { useState } from 'react';
import { Section, Row, Segmented, Button } from '../ui.jsx';
import Icon from '../Icon.jsx';
import { SafetyCard } from './SafetyCard';
import { NutritionCard } from './NutritionCard';
import { WorkoutCard } from './WorkoutCard';
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

  if (!recommendations) {
    return (
      <div className="empty" style={{ paddingTop: '30vh' }}>
        <div className="ico"><Icon name="sparkles" /></div>
        Nenhuma avaliação encontrada.<br />
        <div style={{ marginTop: 12 }}>
          <Button variant="primary" onClick={onRetakePhotos}>Iniciar Avaliação AI Coach</Button>
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
      useUI.getState().toast(`${res.routineCount} treinos e plano alimentar sincronizados no openGym!`);
    } catch (e) {
      console.error('Import error:', e);
      useUI.getState().toast('Erro ao sincronizar com o openGym');
    } finally {
      setIsImporting(false);
    }
  };

  const diet = recommendations.nutritionPlan;
  const workout = recommendations.workoutPlan;
  const cardio = recommendations.cardioPlan;

  return (
    <div className="coach-native-wrap">
      {/* Native Compact Header */}
      <div className="hdr" style={{ marginBottom: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 2px' }}>AI Sports Coach</h1>
          <div className="sub" style={{ fontSize: 13, color: 'var(--label-2)' }}>
            Prescrição individualizada & biomecânica
          </div>
        </div>
        <div className="hdr-actions">
          <Button size="sm" variant="tinted" icon="repeat" onClick={onRetakePhotos}>
            Refazer
          </Button>
        </div>
      </div>

      {/* 4-Metric Compact Strip */}
      <div className="coach-metrics-strip">
        <div className="c-metric-item">
          <span className="c-metric-val">{workout?.splitType || 'ABC'}</span>
          <span className="c-metric-lbl">Treino ({workout?.weeklyFrequency || 3}x/sem)</span>
        </div>
        <div className="c-metric-item">
          <span className="c-metric-val">{diet?.caloricTarget || 2200}</span>
          <span className="c-metric-lbl">kcal / dia</span>
        </div>
        <div className="c-metric-item">
          <span className="c-metric-val">{cardio?.weeklyMinutes || 120}</span>
          <span className="c-metric-lbl">min Cardio</span>
        </div>
        <div className="c-metric-item clickable" onClick={() => setMobilityModalOpen(true)}>
          <span className="c-metric-val highlight">
            {mobilityAssessment ? `${mobilityAssessment.score}/100` : 'Testar'}
          </span>
          <span className="c-metric-lbl">Mobilidade</span>
        </div>
      </div>

      {/* 1-Tap Sync to openGym Row */}
      <Section style={{ marginBottom: 14 }}>
        <Row
          icon="sparkles"
          iconTint="var(--acc)"
          title={imported ? "Treinos e Dieta Sincronizados no openGym" : "Importar Treinos & Dieta para o openGym"}
          subtitle="Gera as rotinas na aba Plano e salva as metas nutricionais"
          accessory={imported ? "check" : "chevron"}
          onClick={handleImportToOpenGym}
        />
      </Section>

      {/* Native Tab Segmented Control */}
      <Segmented
        className="plan-views"
        style={{ marginBottom: 16 }}
        value={activeTab}
        onChange={setActiveTab}
        options={[
          { value: 'overview', label: 'Resumo' },
          { value: 'workout', label: 'Treino' },
          { value: 'nutrition', label: 'Dieta' },
          { value: 'cardio', label: 'Cardio' },
          { value: 'mobility', label: 'Mobilidade' }
        ]}
      />

      {/* TAB 1: OVERVIEW (Resumo Compacto) */}
      {activeTab === 'overview' && (
        <div className="overview-flow">
          {/* Workout Summary */}
          <Section title="Treino Prescrito" footer="Rotinas adaptadas para hipertrofia sem sobrecarga articular lesiva.">
            <Row
              icon="dumbbell"
              iconTint="var(--orange)"
              title={`Divisão: ${workout?.splitType || 'Personalizada'} (${workout?.weeklyFrequency || 3} dias)`}
              subtitle={`${workout?.routines?.length || 3} rotinas estruturadas com progressão dupla`}
              accessory="chevron"
              onClick={() => setActiveTab('workout')}
            />
          </Section>

          {/* Nutrition Summary */}
          <Section title="Metas Nutricionais" footer="Distribuição de macronutrientes calculada para seu biotipo e meta.">
            <Row
              icon="scale"
              iconTint="var(--blue)"
              title={`Meta Diária: ${diet?.caloricTarget || 2200} kcal`}
              subtitle={`Proteínas: ${diet?.macros?.proteinGrams || 160}g · Carboidratos: ${diet?.macros?.carbGrams || 220}g · Gorduras: ${diet?.macros?.fatGrams || 65}g`}
              accessory="chevron"
              onClick={() => setActiveTab('nutrition')}
            />
          </Section>

          {/* Cardio & Mobility Summary */}
          <Section title="Condicionamento & Biomecânica">
            <Row
              icon="flame"
              iconTint="var(--pink)"
              title={`Cardio: ${cardio?.modality || 'Caminhada Inclinada'} (${cardio?.weeklyMinutes || 120} min/sem)`}
              subtitle={`Zona 2 (${cardio?.targetBpmRange || '120-138 BPM'})`}
              accessory="chevron"
              onClick={() => setActiveTab('cardio')}
            />
            <Row
              icon="camera"
              iconTint="var(--acc)"
              title={mobilityAssessment ? `Mobilidade: Score ${mobilityAssessment.score}/100` : "Avaliação de Mobilidade por Vídeo"}
              subtitle={mobilityAssessment ? mobilityAssessment.level : "Grave 6 segundos com sua câmera para mapear restrições articulares"}
              accessory="chevron"
              onClick={() => setMobilityModalOpen(true)}
            />
          </Section>
        </div>
      )}

      {/* TAB 2: WORKOUT DETAIL */}
      {activeTab === 'workout' && (
        <div>
          <WorkoutCard plan={recommendations.workoutPlan} />
          <div style={{ marginTop: 12 }}>
            <Button variant="primary" onClick={handleImportToOpenGym} style={{ width: '100%', padding: '12px' }}>
              📥 Sincronizar estes Treinos no openGym
            </Button>
          </div>
        </div>
      )}

      {/* TAB 3: NUTRITION DETAIL */}
      {activeTab === 'nutrition' && (
        <div>
          <NutritionCard plan={recommendations.nutritionPlan} />
          <div style={{ marginTop: 12 }}>
            <Button variant="primary" onClick={handleImportToOpenGym} style={{ width: '100%', padding: '12px' }}>
              🥗 Salvar Metas Nutricionais no Perfil
            </Button>
          </div>
        </div>
      )}

      {/* TAB 4: CARDIO DETAIL */}
      {activeTab === 'cardio' && (
        <CardioCard cardioPlan={recommendations.cardioPlan} userProfile={recommendations.userProfile} />
      )}

      {/* TAB 5: MOBILITY & VIDEO ASSESSMENT */}
      {activeTab === 'mobility' && (
        <div>
          <Section title="Avaliação Biomecânica por Vídeo" footer="Análise com visão computacional de agachamento profundo e dorsiflexão.">
            <Row
              icon="camera"
              iconTint="var(--acc)"
              title={mobilityAssessment ? `Score Atual: ${mobilityAssessment.score}/100` : "Gravar Teste de Mobilidade (6s)"}
              subtitle={mobilityAssessment ? mobilityAssessment.level : "Toque para abrir a câmera com guia visual de gestos"}
              accessory="chevron"
              onClick={() => setMobilityModalOpen(true)}
            />
            {mobilityAssessment && (
              <>
                <Row
                  icon="note"
                  iconTint="var(--blue)"
                  title="Diagnóstico Articular"
                  subtitle={mobilityAssessment.biomechanicalNotes}
                />
                {mobilityAssessment.workoutAdjustments?.map((a, i) => (
                  <Row
                    key={i}
                    icon="shield"
                    iconTint="var(--orange)"
                    title={`Ajuste no ${a.exercise}`}
                    subtitle={a.adaptation}
                  />
                ))}
              </>
            )}
          </Section>

          <div style={{ marginTop: 12 }}>
            <Button variant="primary" onClick={() => setMobilityModalOpen(true)} style={{ width: '100%', padding: '12px' }}>
              📹 {mobilityAssessment ? 'Refazer Teste com Câmera' : 'Abrir Gravador de Teste (6s)'}
            </Button>
          </div>
        </div>
      )}

      {/* Mobility Test Modal */}
      <MobilityTestModal
        isOpen={mobilityModalOpen}
        onClose={() => setMobilityModalOpen(false)}
        onAssessmentComplete={(res) => {
          useUI.getState().toast(`Mobilidade avaliada! Score: ${res.score}/100`);
        }}
      />
    </div>
  );
}

export default CoachDashboard;
