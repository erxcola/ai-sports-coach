// src/frontend/src/components/coach/WorkoutCard.jsx
// Visualizacao de treino nativa openGym: estruturada por divisao, series, repeticoes, RIR,
// videos de execucao funcionando e explicacao didatica de termos para leigos.

import React, { useState } from 'react';
import { Section, Row, Segmented, Button } from '../ui.jsx';
import Icon from '../Icon.jsx';
import { findCatalogueExercise } from '../../lib/ai/exercise-matcher.js';
import { ExercisePreviewModal } from './ExercisePreviewModal.jsx';
import { BeginnerGlossaryModal } from './BeginnerGlossaryModal.jsx';

export function WorkoutCard({ plan }) {
  if (!plan) return null;

  const routines = plan.routines || plan.days || [];
  const [selectedRoutineIndex, setSelectedRoutineIndex] = useState(0);
  const [previewExercise, setPreviewExercise] = useState(null);
  const [glossaryOpen, setGlossaryOpen] = useState(false);

  const activeRoutine = routines[selectedRoutineIndex] || routines[0];

  // Open video preview for an exercise
  const handleOpenPreview = (exercise) => {
    const matched = findCatalogueExercise(exercise.name);
    setPreviewExercise({
      ...exercise,
      ptName: exercise.name,
      id: matched?.id || '0025',
      gif: matched?.gif || '0025.mp4',
      bp: matched?.bp || exercise.muscleGroup,
      eq: matched?.eq || 'Halter / Barra'
    });
  };

  return (
    <div className="coach-workout-native">
      {/* 1. Header Overview & Beginner Terms Button */}
      <div className="coach-native-box" style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Divisão {plan.splitType || 'ABC'}
          </span>
          <button
            onClick={() => setGlossaryOpen(true)}
            style={{
              background: 'var(--surface-2)',
              border: 'var(--hair) solid var(--sep-op)',
              color: 'var(--orange)',
              padding: '4px 10px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            ❓ O que é RIR e Reps?
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 12 }}>
          <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--label)' }}>
            Sobrecarga Dupla
          </span>
          <span style={{ fontSize: 13, color: 'var(--label-2)' }}>
            ({plan.progressiveOverload?.weeklyIncrease || '+2.5% ou +1 repetição'})
          </span>
        </div>

        {/* Volume per Muscle Group Strip */}
        {plan.targetVolumeSummary && (
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
            {Object.entries(plan.targetVolumeSummary).map(([muscle, sets]) => (
              <div key={muscle} className="c-sub-metric" style={{ minWidth: 70 }}>
                <span className="c-sub-val" style={{ color: 'var(--label)' }}>{sets}s</span>
                <span className="c-sub-lbl">{formatMuscle(muscle)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Routine Selector (Segmented) */}
      {routines.length > 1 && (
        <Section title="Rotinas da Semana" style={{ marginBottom: 14 }}>
          <div style={{ padding: '8px 14px' }}>
            <Segmented
              value={selectedRoutineIndex}
              onChange={setSelectedRoutineIndex}
              options={routines.map((r, i) => ({
                value: i,
                label: r.day || r.name || `Treino ${String.fromCharCode(65 + i)}`
              }))}
            />
          </div>
        </Section>
      )}

      {/* 3. Active Routine Exercises List */}
      {activeRoutine && (
        <Section
          title={`${activeRoutine.day || activeRoutine.name || 'Treino'} · ${activeRoutine.focus || 'Foco Hipertrofia'}`}
          footer={`Toque em "Ver Execução" para assistir ao vídeo do movimento e conferir a postura correta.`}
          style={{ marginBottom: 14 }}
        >
          {activeRoutine.exercises?.map((exercise, exIndex) => {
            const isSafe = exercise.safe !== false;

            return (
              <div
                key={exIndex}
                style={{
                  padding: '14px',
                  borderBottom: exIndex < activeRoutine.exercises.length - 1 ? 'var(--hair) solid var(--sep-op)' : 'none'
                }}
              >
                {/* Exercise Title, Muscle & Safety Indicator */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--label)', display: 'block' }}>
                      {exercise.name}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--label-3)' }}>
                      {exercise.muscleGroup || 'Músculo Principal'}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 6,
                      background: isSafe ? 'var(--acc-soft)' : 'rgba(255, 149, 0, 0.15)',
                      color: isSafe ? 'var(--acc)' : 'var(--orange)'
                    }}
                  >
                    {isSafe ? '✅ Articulação Segura' : '🛡️ Ajustado'}
                  </span>
                </div>

                {/* Badges: Sets x Reps, RIR, Rest */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                  <span className="ex-badge">
                    📦 {exercise.sets} séries × {exercise.repRange} reps
                  </span>
                  <span className="ex-badge">
                    🎯 RIR {exercise.targetRIR ?? 2} (reserva)
                  </span>
                  <span className="ex-badge">
                    ⏱️ {exercise.restSeconds || 90}s descanso
                  </span>
                </div>

                {/* Video Preview Button */}
                <div style={{ marginBottom: 6 }}>
                  <button
                    onClick={() => handleOpenPreview(exercise)}
                    style={{
                      background: 'var(--surface-2)',
                      border: 'var(--hair) solid var(--sep-op)',
                      borderRadius: 8,
                      padding: '6px 12px',
                      color: 'var(--blue)',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    ▶️ Ver Vídeo de Execução & Postura
                  </button>
                </div>

                {/* Orthopedic adjustment / substitution cue */}
                {exercise.orthopedicNotes && (
                  <div style={{ fontSize: 12, color: 'var(--label-2)', background: 'var(--surface-2)', padding: '6px 10px', borderRadius: 8, marginBottom: 4 }}>
                    📝 <strong>Foco:</strong> {exercise.orthopedicNotes}
                  </div>
                )}

                {exercise.maleableSubstitute && (
                  <div style={{ fontSize: 12, color: 'var(--orange)', background: 'rgba(255, 149, 0, 0.08)', padding: '6px 10px', borderRadius: 8 }}>
                    🔄 <strong>Substituto se sentir dor:</strong> {exercise.maleableSubstitute}
                  </div>
                )}
              </div>
            );
          })}
        </Section>
      )}

      {/* 4. Progressive Overload Rules */}
      <Section title="Regras de Progressão Clínica">
        <Row
          icon="dumbbell"
          iconTint="var(--acc)"
          title="Como Progredir nos Treinos?"
          subtitle="Atingiu o topo de repetições com RIR ≤ alvo? Aumente 2.5kg membros inferiores ou 1.25kg superiores na semana seguinte."
        />
        <Row
          icon="repeat"
          iconTint="var(--blue)"
          title="Semana de Deload (Descanso Ativo)"
          subtitle={`A cada ${plan.progressiveOverload?.deloadFrequency || 5} semanas. Reduzimos o peso em 40% para recuperar seus tendões e cartilagens.`}
        />
      </Section>

      {/* Video Preview Modal */}
      <ExercisePreviewModal
        exercise={previewExercise}
        isOpen={!!previewExercise}
        onClose={() => setPreviewExercise(null)}
      />

      {/* Beginner Glossary Modal */}
      <BeginnerGlossaryModal
        isOpen={glossaryOpen}
        onClose={() => setGlossaryOpen(false)}
      />
    </div>
  );
}

function formatMuscle(m) {
  const map = {
    chest: 'Peito',
    back: 'Costas',
    shoulders: 'Ombro',
    quads: 'Quadríceps',
    hamstrings: 'Posterior',
    glutes: 'Glúteo',
    arms: 'Braços',
    calves: 'Panturrilha',
    core: 'Abdômen'
  };
  return map[m] || m;
}

export default WorkoutCard;
