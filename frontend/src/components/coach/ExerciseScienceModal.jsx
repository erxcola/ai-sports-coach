// frontend/src/components/coach/ExerciseScienceModal.jsx
import React, { useState } from 'react';
import { 
  VOLUME_LANDMARKS, 
  SCIENTIFIC_PRINCIPLES, 
  getExerciseBiomechanics 
} from '../../lib/ai/exercise-science.js';

export default function ExerciseScienceModal({ isOpen, onClose, exerciseName = '', targetMuscle = '' }) {
  const [activeTab, setActiveTab] = useState('biomechanics'); // 'biomechanics' | 'volume' | 'principles'
  const [selectedMuscle, setSelectedMuscle] = useState('peito');

  if (!isOpen) return null;

  const biomechanics = getExerciseBiomechanics(exerciseName, targetMuscle);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: 'var(--surface, #1e1e24)',
        color: 'var(--text, #fff)',
        borderRadius: '16px',
        maxWidth: '680px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.15) 100%)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>🔬</span>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', letterSpacing: '-0.3px' }}>
                Ciência & Biomecânica do Treino
              </h2>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.75 }}>
              Evidências do PubMed, Biomecânica de Hipertrofia & Marcos de Volume
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#fff',
              fontSize: '18px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)'
        }}>
          <button
            onClick={() => setActiveTab('biomechanics')}
            style={{
              flex: 1,
              padding: '12px 10px',
              border: 'none',
              background: activeTab === 'biomechanics' ? 'rgba(59, 130, 246, 0.18)' : 'transparent',
              borderBottom: activeTab === 'biomechanics' ? '2px solid #3b82f6' : '2px solid transparent',
              color: activeTab === 'biomechanics' ? '#60a5fa' : 'rgba(255,255,255,0.7)',
              fontSize: '13px',
              fontWeight: activeTab === 'biomechanics' ? '600' : '500',
              cursor: 'pointer'
            }}
          >
            🎯 Biomecânica {exerciseName ? `(${exerciseName.split(' ')[0]})` : ''}
          </button>
          <button
            onClick={() => setActiveTab('volume')}
            style={{
              flex: 1,
              padding: '12px 10px',
              border: 'none',
              background: activeTab === 'volume' ? 'rgba(59, 130, 246, 0.18)' : 'transparent',
              borderBottom: activeTab === 'volume' ? '2px solid #3b82f6' : '2px solid transparent',
              color: activeTab === 'volume' ? '#60a5fa' : 'rgba(255,255,255,0.7)',
              fontSize: '13px',
              fontWeight: activeTab === 'volume' ? '600' : '500',
              cursor: 'pointer'
            }}
          >
            📊 Marcos de Volume (MEV/MAV)
          </button>
          <button
            onClick={() => setActiveTab('principles')}
            style={{
              flex: 1,
              padding: '12px 10px',
              border: 'none',
              background: activeTab === 'principles' ? 'rgba(59, 130, 246, 0.18)' : 'transparent',
              borderBottom: activeTab === 'principles' ? '2px solid #3b82f6' : '2px solid transparent',
              color: activeTab === 'principles' ? '#60a5fa' : 'rgba(255,255,255,0.7)',
              fontSize: '13px',
              fontWeight: activeTab === 'principles' ? '600' : '500',
              cursor: 'pointer'
            }}
          >
            📚 Princípios do Treino
          </button>
        </div>

        {/* Content Body */}
        <div style={{
          padding: '20px',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* TAB 1: BIOMECHANICS */}
          {activeTab === 'biomechanics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderRadius: '12px',
                padding: '14px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', color: '#93c5fd' }}>
                    {exerciseName ? exerciseName.toUpperCase() : 'EXERCÍCIO'}
                  </h3>
                  <span style={{
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    color: '#bfdbfe'
                  }}>
                    {biomechanics.padrao}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', marginBottom: '8px' }}>
                  <strong>Músculos Ativados:</strong> {biomechanics.musculos.join(', ')}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)' }}>
                  <strong>Estiramento sob Carga:</strong> {biomechanics.estiramento}
                </div>
              </div>

              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🎯</span> Cues Técnicos de Execução (ExerciseBank / wger):
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {biomechanics.cues.map((cue, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      gap: '8px',
                      fontSize: '12.5px',
                      lineHeight: '1.45',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      borderLeft: '3px solid #3b82f6'
                    }}>
                      <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>{idx + 1}.</span>
                      <span>{cue}</span>
                    </div>
                  ))}
                </div>
              </div>

              {biomechanics.riscoLesao && (
                <div style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '10px',
                  padding: '12px',
                  fontSize: '12px',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'flex-start'
                }}>
                  <span style={{ fontSize: '16px' }}>⚠️</span>
                  <div>
                    <strong style={{ color: '#fca5a5' }}>Ponto Crítico de Segurança:</strong>
                    <div style={{ color: 'rgba(255,255,255,0.85)', marginTop: '2px' }}>
                      {biomechanics.riscoLesao}
                    </div>
                  </div>
                </div>
              )}

              {biomechanics.pmid && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  fontSize: '11.5px'
                }}>
                  <span style={{ opacity: 0.7 }}>Evidência Científica Indexada:</span>
                  <a 
                    href={`https://pubmed.ncbi.nlm.nih.gov/${biomechanics.pmid}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#60a5fa',
                      textDecoration: 'none',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>PubMed ID: {biomechanics.pmid}</span>
                    <span>↗</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: VOLUME LANDMARKS */}
          {activeTab === 'volume' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                {Object.keys(VOLUME_LANDMARKS).map(mKey => (
                  <button
                    key={mKey}
                    onClick={() => setSelectedMuscle(mKey)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: selectedMuscle === mKey ? '600' : '400',
                      background: selectedMuscle === mKey ? '#3b82f6' : 'rgba(255,255,255,0.06)',
                      color: selectedMuscle === mKey ? '#fff' : 'rgba(255,255,255,0.7)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {VOLUME_LANDMARKS[mKey].nome.split(' ')[0]}
                  </button>
                ))}
              </div>

              {(() => {
                const data = VOLUME_LANDMARKS[selectedMuscle] || VOLUME_LANDMARKS.peito;
                return (
                  <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#93c5fd' }}>
                      {data.nome}
                    </h3>

                    {/* Metrics Grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '8px'
                    }}>
                      <div style={{
                        padding: '10px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '10.5px', color: '#6ee7b7', fontWeight: 'bold' }}>MEV (Mínimo)</div>
                        <div style={{ fontSize: '12px', color: '#fff', marginTop: '4px' }}>{data.mev}</div>
                        <div style={{ fontSize: '9.5px', opacity: 0.6 }}>Para Manter/Crescer</div>
                      </div>

                      <div style={{
                        padding: '10px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(59, 130, 246, 0.15)',
                        border: '1px solid rgba(59, 130, 246, 0.35)',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '10.5px', color: '#93c5fd', fontWeight: 'bold' }}>MAV (Ótimo)</div>
                        <div style={{ fontSize: '12px', color: '#fff', marginTop: '4px' }}>{data.mav}</div>
                        <div style={{ fontSize: '9.5px', opacity: 0.6 }}>Hipertrofia Máxima</div>
                      </div>

                      <div style={{
                        padding: '10px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '10.5px', color: '#fca5a5', fontWeight: 'bold' }}>MRV (Limite)</div>
                        <div style={{ fontSize: '12px', color: '#fff', marginTop: '4px' }}>{data.mrv}</div>
                        <div style={{ fontSize: '9.5px', opacity: 0.6 }}>Teto Recuperativo</div>
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '8px',
                      fontSize: '12px'
                    }}>
                      <div style={{ padding: '8px 10px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                        <span style={{ opacity: 0.7 }}>Frequência Sugerida:</span>
                        <div style={{ fontWeight: '600', marginTop: '2px' }}>{data.frequenciaIdeal}</div>
                      </div>
                      <div style={{ padding: '8px 10px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                        <span style={{ opacity: 0.7 }}>Tempo de Recuperação:</span>
                        <div style={{ fontWeight: '600', marginTop: '2px' }}>{data.tempoRecuperacao}</div>
                      </div>
                    </div>

                    <div style={{ fontSize: '12px', lineHeight: '1.45', opacity: 0.85 }}>
                      <strong>Diretriz Prática:</strong> {data.recomendacao}
                    </div>

                    <div style={{ fontSize: '11px', opacity: 0.6, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
                      <em>Fonte: {data.evidencia}</em>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 3: PRINCIPLES */}
          {activeTab === 'principles' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {SCIENTIFIC_PRINCIPLES.map((principle, idx) => (
                <div key={idx} style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h4 style={{ margin: 0, fontSize: '14px', color: '#60a5fa' }}>
                      {principle.titulo}
                    </h4>
                  </div>
                  <div style={{ fontSize: '11px', color: '#a5b4fc', fontWeight: '500' }}>
                    {principle.subtitulo}
                  </div>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', lineHeight: '1.45', opacity: 0.85 }}>
                    {principle.descricao}
                  </p>
                  <div style={{
                    marginTop: '4px',
                    padding: '8px 10px',
                    backgroundColor: 'rgba(59, 130, 246, 0.08)',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    color: '#bfdbfe'
                  }}>
                    <strong>Aplicação Prática:</strong> {principle.aplicacao}
                  </div>
                  <div style={{ fontSize: '10.5px', opacity: 0.55, marginTop: '2px' }}>
                    {principle.referencia}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              background: '#3b82f6',
              color: '#fff',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
