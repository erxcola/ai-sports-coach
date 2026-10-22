// src/frontend/src/components/coach/WorkoutCard.jsx
// Visualizacao de treino nativa openGym: estruturada por divisao, series, repeticoes, RIR e substituicoes articulares.

import React, { useState } from 'react';
import { Section, Row, Segmented, Button } from '../ui.jsx';
import Icon from '../Icon.jsx';

export function WorkoutCard({ plan }) {
  if (!plan) return null;

  const routines = plan.routines || plan.days || [];
  const [selectedRoutineIndex, setSelectedRoutineIndex] = useState(0);

  const activeRoutine = routines[selectedRoutineIndex] || routines[0];

  return (
    <div className="coach-workout-native">
      {/* 1. Header Overview & Volume */}
      <div className="coach-native-box" style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Divisão {plan.splitType || 'ABC'}
          </span>
          <span style={{ fontSize: 12, color: 'var(--label-2)' }}>
            {plan.weeklyFrequency || 3}x por semana
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 12 }}>
          <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--label)' }}>
            Sobrecarga Dupla
          </span>
          <span style={{ fontSize: 13, color: 'var(--label-2)' }}>
            ({plan.progressiveOverload?.weeklyIncrease || '+2.5% ou +1 rep'})
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
          footer={`Volume total desta sessão: ${activeRoutine.weeklyVolume || activeRoutine.exercises?.length * 3 || 15} séries efetivas.`}
          style={{ marginBottom: 14 }}
        >
          {activeRoutine.exercises?.map((exercise, exIndex) => {
            const isSafe = exercise.safe !== false;

            return (
              <div
                key={exIndex}
                style={{
                  padding: '12px 14px',
                  borderBottom: exIndex < activeRoutine.exercises.length - 1 ? 'var(--hair) solid var(--sep-op)' : 'none'
                }}
              >
                {/* Exercise Title & Badges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--label)', display: 'block' }}>
                      {exercise.name}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--label-3)' }}>
                      {exercise.muscleGroup || 'Grupamento Principal'}
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
                    {isSafe ? '✅ Articular Seguro' : '🛡️ Ajustado'}
                  </span>
                </div>

                {/* Badges: Sets x Reps, RIR, Rest */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                  <span className="ex-badge">
                    {exercise.sets} séries × {exercise.repRange} reps
                  </span>
                  <span className="ex-badge">
                    RIR {exercise.targetRIR ?? 2} (reserva)
                  </span>
                  <span className="ex-badge">
                    ⏱️ {exercise.restSeconds || 90}s descanso
                  </span>
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
          title="Progressão Dupla"
          subtitle="Atingiu o topo de repetições com RIR ≤ alvo? Aumente 2.5kg membros inferiores ou 1.25kg superiores."
        />
        <Row
          icon="repeat"
          iconTint="var(--blue)"
          title="Semana de Deload"
          subtitle={`A cada ${plan.progressiveOverload?.deloadFrequency || 5} semanas. Redução de 40% no volume para regeneração do SNC e cartilagens.`}
        />
      </Section>
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
