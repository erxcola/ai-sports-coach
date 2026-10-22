// src/frontend/src/components/coach/ExercisePreviewModal.jsx
// Modal de demonstracao em video e animacao da execucao correta do exercicio com instrucoes em portugues.

import React from 'react';
import Media from '../Media.jsx';
import { Button } from '../ui.jsx';
import Icon from '../Icon.jsx';

export function ExercisePreviewModal({ exercise, isOpen, onClose }) {
  if (!isOpen || !exercise) return null;

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
            <div style={{ fontSize: 12, background: 'rgba(255, 149, 0, 0.1)', border: '1px solid rgba(255, 149, 0, 0.3)', padding: '10px 12px', borderRadius: 8, color: 'var(--orange)' }}>
              🛡️ <strong>Ajuste Ortopédico Especial:</strong> {exercise.orthopedicNotes}
            </div>
          )}
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
