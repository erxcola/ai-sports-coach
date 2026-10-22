// src/frontend/src/components/coach/ExercisePreviewModal.jsx
// Modal de demonstracao em video e animacao da execucao correta do exercicio com instrucoes em portugues.

import React from 'react';
import Media from '../Media.jsx';
import { Button } from '../ui.jsx';
import Icon from '../Icon.jsx';
import { getExerciseBiomechanics } from '../../lib/ai/exercise-science.js';

export function ExercisePreviewModal({ exercise, isOpen, onClose }) {
  if (!isOpen || !exercise) return null;

  const exerciseName = exercise.ptName || exercise.name || exercise.n || '';
  const biomechanics = getExerciseBiomechanics(exerciseName, exercise.bp || exercise.muscleGroup || '');

  return (
    <div className="mobility-modal-backdrop" onClick={onClose}>
      <div className="mobility-modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
        {/* Header */}
        <div className="mobility-header">
          <div>
            <h3 className="mobility-title">
              {exercise.ptName || exercise.name || exercise.n}
            </h3>
            <div className="mobility-subtitle">
              {exercise.bp ? `Foco: ${exercise.bp} · Equipamento: ${exercise.eq || 'Livre'}` : 'Demonstração de Movimento'}
            </div>
          </div>
          <button className="mobility-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Video / Animated Media Player */}
        <div style={{ background: '#000', minHeight: 260, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Media ex={{
            ...exercise,
            id: exercise.id || '0025',
            n: exercise.n || exercise.name || exercise.ptName || 'exercise',
            gif: exercise.gif || `${exercise.id || '0025'}.mp4`
          }} />
        </div>

        {/* Instructions and Execution Tips */}
        <div style={{ padding: '16px', maxHeight: '40vh', overflowY: 'auto' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--label)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="sparkles" /> Padrão de Execução Correto:
          </div>

          <div style={{ fontSize: 13, color: 'var(--label-2)', lineHeight: 1.5, marginBottom: 12 }}>
            {exercise.instructions || (
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                <li>Mantenha a postura ereta e o abdômen contraído (bracing) durante todo o movimento.</li>
                <li>Controle a descida (fase excêntrica) em aproximadamente 2 segundos sem deixar o peso despencar.</li>
                <li>Mantenha as articulações alinhadas com a trajetória da carga para evitar sobrecarga em tendões.</li>
                <li>Respire fundo antes de descer e solte o ar na subida (fase concêntrica).</li>
              </ul>
            )}
          </div>

          {exercise.orthopedicNotes && (
            <div style={{ fontSize: 12, background: 'rgba(255, 149, 0, 0.1)', border: '1px solid rgba(255, 149, 0, 0.3)', padding: '10px 12px', borderRadius: 8, color: 'var(--orange)', marginBottom: 12 }}>
              🛡️ <strong>Ajuste Ortopédico Especial:</strong> {exercise.orthopedicNotes}
            </div>
          )}

          {/* Biomechanics and Technical Cues Card */}
          <div style={{
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            borderRadius: 10,
            padding: '12px',
            marginBottom: 8
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#93c5fd', display: 'flex', alignItems: 'center', gap: 6 }}>
                🔬 Biomecânica & Hipertrofia
              </span>
              <span style={{ fontSize: 10.5, padding: '2px 6px', borderRadius: 4, background: 'rgba(59, 130, 246, 0.2)', color: '#bfdbfe' }}>
                {biomechanics.padrao}
              </span>
            </div>

            <div style={{ fontSize: 12, color: 'var(--label-2)', marginBottom: 6 }}>
              ⚡ <strong>Tensão por Estiramento:</strong> {biomechanics.estiramento}
            </div>

            <div style={{ fontSize: 12, color: 'var(--label-2)', marginBottom: 6 }}>
              🎯 <strong>Cues Principais:</strong>
              <ul style={{ margin: '4px 0 0 0', paddingLeft: 18 }}>
                {biomechanics.cues.slice(0, 3).map((cue, i) => (
                  <li key={i} style={{ marginBottom: 2 }}>{cue}</li>
                ))}
              </ul>
            </div>

            {biomechanics.pmid && (
              <div style={{ fontSize: 11, textAlign: 'right', marginTop: 4 }}>
                <a
                  href={`https://pubmed.ncbi.nlm.nih.gov/${biomechanics.pmid}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 600 }}
                >
                  Estudo Científico (PubMed #{biomechanics.pmid}) ↗
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Close Button */}
        <div style={{ padding: '12px 16px', borderTop: 'var(--hair) solid var(--sep-op)' }}>
          <Button variant="primary" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
            Fechar Demonstração
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ExercisePreviewModal;
