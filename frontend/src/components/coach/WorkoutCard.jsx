// src/frontend/src/components/coach/WorkoutCard.jsx
// Card de plano de treino

import React, { useState } from 'react';

export function WorkoutCard({ plan }) {
  if (!plan) return null;

  const [expandedDays, setExpandedDays] = useState(new Set([0])); // First day expanded by default

  const toggleDay = (index) => {
    setExpandedDays(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="coach-card workout-card">
      <div className="card-header">
        <h3>🏋️ Plano de Treino Periodizado</h3>
        <div className="plan-meta">
          <span className="meta-item">
            <strong>Divisão:</strong> {plan.splitType}
          </span>
          <span className="meta-item">
            <strong>Frequência:</strong> {plan.weeklyFrequency}x/semana
          </span>
          <span className="meta-item">
            <strong>Sobrecarga:</strong> {plan.progressiveOverload?.weeklyIncrease || '2.5%/semana'}
          </span>
        </div>
      </div>

      <div className="card-content">
        {/* Weekly Volume Summary */}
        <details className="volume-summary">
          <summary>📊 Volume Semanal Alvo (sets/músculo/semana)</summary>
          <div className="volume-grid">
            {Object.entries(plan.targetVolumeSummary || {}).map(([muscle, sets]) => (
              <div key={muscle} className="volume-item">
                <span className="muscle-name">{formatMuscleName(muscle)}</span>
                <span className="sets-value">{sets} sets</span>
              </div>
            ))}
          </div>
        </details>

        {/* Routines */}
        <div className="routines-list">
          {plan.routines?.map((routine, index) => (
            <div key={index} className="routine-card">
              <button
                className="routine-header"
                onClick={() => toggleDay(index)}
                style={{
                  backgroundColor: expandedDays.has(index) ? 'var(--color-primary-light, #eff6ff)' : 'transparent'
                }}
              >
                <div className="routine-info">
                  <span className="routine-day">{routine.day}</span>
                  <span className="routine-focus">{routine.focus}</span>
                  <span className="routine-volume">{routine.weeklyVolume} sets</span>
                </div>
                <span className={`expand-icon ${expandedDays.has(index) ? 'expanded' : ''}`}>
                  ▼
                </span>
              </button>

              {expandedDays.has(index) && (
                <div className="routine-exercises">
                  {routine.exercises?.map((exercise, exIndex) => (
                    <div key={exIndex} className={`exercise-row ${exercise.safe ? '' : 'unsafe'}`}>
                      <div className="exercise-main">
                        <span className="exercise-name">{exercise.name}</span>
                        <span className="exercise-sets-reps">{exercise.sets}x{exercise.repRange}</span>
                        <span className="exercise-rir">RIR {exercise.targetRIR}</span>
                        <span className="exercise-rest">{exercise.restSeconds}s</span>
                        {!exercise.safe && (
                          <span className="exercise-warning">⚠️ Ver alternativas</span>
                        )}
                      </div>

                      {exercise.orthopedicNotes && (
                        <div className="exercise-notes">
                          📝 {exercise.orthopedicNotes}
                        </div>
                      )}

                      {exercise.maleableSubstitute && (
                        <div className="exercise-substitute">
                          🔄 Substituto: {exercise.maleableSubstitute}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Progressive Overload Info */}
        <details className="progressive-overload">
          <summary>📈 Configuração de Sobrecarga Progressiva</summary>
          <div className="overload-details">
            <div className="overload-item">
              <strong>Incremento semanal:</strong> {plan.progressiveOverload?.weeklyIncrease || '2.5% ou +1 rep'}
            </div>
            <div className="overload-item">
              <strong>Frequência de Deload:</strong> A cada {plan.progressiveOverload?.deloadFrequency || 5} semanas
            </div>
            <div className="overload-item">
              <strong>Semana de Deload:</strong> Semana {plan.progressiveOverload?.deloadWeek || 5}
            </div>
          </div>
        </details>

        {/* Progression Rules */}
        <div className="progression-rules">
          <h4>📋 Regras de Progressão (baseado no openGym)</h4>
          <ul>
            <li>✅ <strong>Todas séries completas com RIR ≤ alvo</strong> → Aumentar carga (+2.5kg membros inferiores, +1.25kg superiores)</li>
            <li>⚠️ <strong>Algumas séries falham (RIR &gt; alvo)</strong> → Manter carga na próxima sessão</li>
            <li>🔄 <strong>Falha consistente 2+ semanas</strong> → Deload -10% carga</li>
            <li>🚫 <strong>Dor articular / flag ortopédica</strong> → Não progredir, considerar regressão</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function formatMuscleName(muscle) {
  const names = {
    chest: 'Peitoral',
    back: 'Costas',
    shoulders: 'Ombros',
    quads: 'Quadríceps',
    hamstrings: 'Posterior de Coxa',
    glutes: 'Glúteos',
    arms: 'Braços',
    calves: 'Panturrilhas',
    core: 'Core/Abdômen'
  };
  return names[muscle] || muscle;
}

export default WorkoutCard;