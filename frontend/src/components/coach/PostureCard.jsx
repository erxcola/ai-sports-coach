// src/frontend/src/components/coach/PostureCard.jsx
// Card de análise de postura (Computer Vision)

import React, { useState } from 'react';

export function PostureCard({ analysis, onRetakePhotos }) {
  if (!analysis) return null;

  const [expanded, setExpanded] = useState(false);

  const getSeverityColor = (severity) => {
    const colors = {
      none: '#10b981',
      mild: '#f59e0b',
      moderate: '#f97316',
      severe: '#ef4444',
      present: '#f97316',
      neutral: '#10b981',
      anterior: '#f97316',
      posterior: '#f97316',
      valgus: '#f97316',
      varus: '#f97316',
      hypolordotic: '#f59e0b',
      normal: '#10b981',
      hyperlordotic: '#f97316'
    };
    return colors[severity] || '#6b7280';
  };

  const getSeverityLabel = (key, value) => {
    const labels = {
      forwardHeadPosture: 'Cabeça Anterior',
      thoracicKyphosis: 'Cifose Torácica',
      roundedShoulders: 'Ombros Arredondados',
      pelvicTilt: 'Inclinação Pélvica',
      kneeValgusVarus: 'Joelho Valgo/Varus',
      lumbarLordosis: 'Lordose Lombar',
      scoliosisScreening: 'Triagem Escoliose'
    };
    const valueLabels = {
      none: 'Normal',
      mild: 'Leve',
      moderate: 'Moderado',
      severe: 'Severo',
      present: 'Presente',
      neutral: 'Neutra',
      anterior: 'Anterior',
      posterior: 'Posterior',
      valgus: 'Valgo',
      varus: 'Varo',
      hypolordotic: 'Hipolordose',
      normal: 'Normal',
      hyperlordotic: 'Hiperlordose'
    };
    return `${labels[key] || key}: <span style="color:${getSeverityColor(value)}">${valueLabels[value] || value}</span>`;
  };

  return (
    <div className="coach-card posture-card">
      <div className="card-header">
        <h3>👁️ Análise de Postura (IA)</h3>
        <div className="card-actions">
          <button
            className="btn-secondary btn-sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? '▲ Ocultar detalhes' : '▼ Ver detalhes'}
          </button>
          {onRetakePhotos && (
            <button className="btn-primary btn-sm" onClick={onRetakePhotos}>
              📸 Refazer fotos
            </button>
          )}
        </div>
      </div>

      <div className="card-content">
        {/* Posture Assessment */}
        <div className="posture-section">
          <h4>📐 Avaliação Postural</h4>
          <div className="posture-grid">
            {Object.entries(analysis.posture_assessment || {}).map(([key, value]) => (
              <div
                key={key}
                className="posture-item"
                style={{ borderLeftColor: getSeverityColor(value) }}
              >
                <div dangerouslySetInnerHTML={{ __html: getSeverityLabel(key, value) }} />
              </div>
            ))}
          </div>
        </div>

        {/* Physique Imbalances */}
        {analysis.physique_imbalances && (
          <div className="imbalances-section">
            <h4>⚖️ Desequilíbrios Musculares</h4>
            <div className="imbalances-grid">
              <div className="imbalance-column lagging">
                <h5>🔻 Grupos Atrasados (Lagging)</h5>
                <ul>
                  {analysis.physique_imbalances.laggingMuscleGroups?.map((muscle, i) => (
                    <li key={i}>{formatMuscleName(muscle)}</li>
                  ))}
                </ul>
              </div>
              <div className="imbalance-column dominant">
                <h5>🔺 Grupos Dominantes</h5>
                <ul>
                  {analysis.physique_imbalances.dominantMuscleGroups?.map((muscle, i) => (
                    <li key={i}>{formatMuscleName(muscle)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Orthopedic Risk Flags */}
        {analysis.orthopedic_risk_flags?.length > 0 && (
          <div className="risk-flags-section">
            <h4>🚩 Flags de Risco Ortopédico</h4>
            <ul className="risk-flags-list">
              {analysis.orthopedic_risk_flags.map((flag, i) => (
                <li key={i} className={`risk-flag ${flag.severity}`}>
                  <div className="flag-header">
                    <span className="flag-condition">{flag.condition}</span>
                    <span className={`flag-severity ${flag.severity}`}>{flag.severity}</span>
                  </div>
                  <p className="flag-description">{flag.description}</p>
                  <p className="flag-action">💡 {flag.recommendedAction}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Corrective Recommendations */}
        {analysis.recommendations && (
          <details className="recommendations-section">
            <summary>🎯 Recomendações Corretivas Personalizadas</summary>
            <div className="recommendations-grid">
              {analysis.recommendations.correctiveExercises?.length > 0 && (
                <div className="rec-column">
                  <h5>🏃 Exercícios Corretivos</h5>
                  <ul>
                    {analysis.recommendations.correctiveExercises.map((ex, i) => (
                      <li key={i}>{ex}</li>
                    ))}
                  </ul>
                </div>
              )}
              {analysis.recommendations.mobilityWork?.length > 0 && (
                <div className="rec-column">
                  <h5>🧘 Mobilidade</h5>
                  <ul>
                    {analysis.recommendations.mobilityWork.map((ex, i) => (
                      <li key={i}>{ex}</li>
                    ))}
                  </ul>
                </div>
              )}
              {analysis.recommendations.strengtheningPriorities?.length > 0 && (
                <div className="rec-column">
                  <h5>💪 Prioridades de Fortalecimento</h5>
                  <ul>
                    {analysis.recommendations.strengtheningPriorities.map((ex, i) => (
                      <li key={i}>{ex}</li>
                    ))}
                  </ul>
                </div>
              )}
              {analysis.recommendations.avoidMovements?.length > 0 && (
                <div className="rec-column avoid">
                  <h5>🚫 Evitar</h5>
                  <ul>
                    {analysis.recommendations.avoidMovements.map((ex, i) => (
                      <li key={i}>{ex}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </details>
        )}

        {/* Physique Landmarks */}
        {expanded && analysis.physique_landmarks && (
          <details className="landmarks-section">
            <summary>📏 Marcadores Antropométricos</summary>
            <div className="landmarks-grid">
              {Object.entries(analysis.physique_landmarks).map(([key, value]) => (
                <div key={key} className="landmark-item">
                  <span className="landmark-name">{formatLandmarkName(key)}</span>
                  <span className="landmark-value">{typeof value === 'object' ? JSON.stringify(value) : value}</span>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

function formatMuscleName(name) {
  const names = {
    lower_chest: 'Peitoral Inferior',
    rear_deltoids: 'Deltoide Posterior',
    lower_traps: 'Trapézio Inferior',
    hamstrings: 'Posterior de Coxa',
    glute_medius: 'Glúteo Médio',
    external_rotators: 'Rotadores Externos',
    serratus_anterior: 'Serrátil Anterior',
    upper_chest: 'Peitoral Superior',
    anterior_deltoids: 'Deltoide Anterior',
    upper_traps: 'Trapézio Superior',
    quadriceps: 'Quadríceps',
    biceps: 'Bíceps',
    lateral_deltoids: 'Deltoide Lateral'
  };
  return names[name] || name.replace(/_/g, ' ');
}

function formatLandmarkName(key) {
  const names = {
    shoulderWidth: 'Largura dos Ombros',
    hipWidth: 'Largura do Quadril',
    torsoLength: 'Comprimento do Torso',
    legLength: 'Comprimento das Pernas',
    armLength: 'Comprimento dos Braços',
    neckAngle: 'Ângulo Cervical',
    trunkAngle: 'Ângulo do Tronco',
    pelvicAngle: 'Ângulo Pélvico'
  };
  return names[key] || key;
}

export default PostureCard;