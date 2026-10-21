// src/frontend/src/components/coach/SafetyCard.jsx
// Card de avaliação de segurança ortopédica

import React from 'react';

export function SafetyCard({ assessment }) {
  if (!assessment) return null;

  const riskColors = {
    low: 'var(--color-success, #10b981)',
    moderate: 'var(--color-warning, #f59e0b)',
    high: 'var(--color-error, #ef4444)'
  };

  const riskLabels = {
    low: 'Baixo Risco',
    moderate: 'Risco Moderado',
    high: 'Alto Risco'
  };

  const riskIcons = {
    low: '✅',
    moderate: '⚠️',
    high: '🚨'
  };

  return (
    <div className="coach-card safety-card">
      <div className="card-header">
        <h3>
          <span className="risk-icon">{riskIcons[assessment.riskLevel]}</span>
          Avaliação de Segurança
        </h3>
        <span
          className="risk-badge"
          style={{ backgroundColor: riskColors[assessment.riskLevel] }}
        >
          {riskLabels[assessment.riskLevel]}
        </span>
      </div>

      <div className="card-content">
        {/* Mobility Assessment */}
        <div className="mobility-section">
          <h4>📏 Mobilidade Articular</h4>
          <div className="mobility-grid">
            {Object.entries(assessment.mobilityAssessment).map(([joint, level]) => (
              <div key={joint} className={`mobility-item ${level}`}>
                <span className="joint-name">{getJointLabel(joint)}</span>
                <span className={`mobility-level ${level}`}>
                  {getMobilityLabel(level)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Contraindicated Exercises */}
        {assessment.contraindicatedExercises.length > 0 && (
          <div className="contraindicated-section">
            <h4>🚫 Exercícios Contraindicados ({assessment.contraindicatedExercises.length})</h4>
            <ul className="contraindicated-list">
              {assessment.contraindicatedExercises.map((exId, i) => (
                <li key={i}>
                  <code>{exId}</code>
                  <button
                    className="btn-alternatives"
                    onClick={() => showAlternatives(exId)}
                  >
                    Ver alternativas
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Safe Alternatives */}
        {assessment.safeAlternatives.size > 0 && (
          <div className="alternatives-section">
            <h4>✅ Alternativas Seguras Disponíveis</h4>
            <p className="alternatives-note">
              {assessment.safeAlternatives.size} exercícios têm substituições seguras configuradas
            </p>
          </div>
        )}

        {/* Risk Level Explanation */}
        <div className="risk-explanation">
          <h4>ℹ️ O que significa seu nível de risco:</h4>
          <p>{getRiskExplanation(assessment.riskLevel)}</p>
        </div>
      </div>
    </div>
  );
}

function getJointLabel(joint) {
  const labels = {
    shoulder: 'Ombro',
    knee: 'Joelho',
    hip: 'Quadril',
    thoracic: 'Coluna Torácica',
    lumbar: 'Coluna Lombar'
  };
  return labels[joint] || joint;
}

function getMobilityLabel(level) {
  const labels = {
    good: 'Boa 🟢',
    limited: 'Limitada 🟡',
    restricted: 'Restrita 🔴'
  };
  return labels[level] || level;
}

function getRiskExplanation(level) {
  const explanations = {
    low: 'Seu perfil não apresenta contraindicações significativas. Pode treinar normalmente seguindo as orientações gerais de progressão.',
    moderate: 'Alguns exercícios foram identificados como potencialmente arriscados para suas condições. Alternativas seguras foram sugeridas automaticamente.',
    high: 'Múltiplos exercícios padrão são contraindicados. Recomenda-se supervisão profissional e foco nas alternativas seguras fornecidas.'
  };
  return explanations[level] || '';
}

function showAlternatives(exId) {
  // Could open a modal with alternatives
  console.log('Show alternatives for:', exId);
}

export default SafetyCard;