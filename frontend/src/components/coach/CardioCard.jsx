import React, { useState } from 'react';
import { HeartRateWidget } from './HeartRateWidget.jsx';
import { CARDIO_MODALITIES } from '../../lib/ai/cardio-engine.js';

export function CardioCard({ cardioPlan, userProfile = {} }) {
  const [selectedModality, setSelectedModality] = useState(cardioPlan?.primaryModality?.id || 'incline_treadmill');

  if (!cardioPlan) {
    return (
      <div className="cardio-card empty">
        <p>Plano de cardio sendo calculado...</p>
      </div>
    );
  }

  const {
    protocolType,
    weeklyFrequency,
    sessionDurationMin,
    neatStepsTarget,
    targetZone,
    calorieBurnPerSessionEst,
    weeklyCalorieDeficitEst,
    primaryModality,
    safeModalities = [],
    avoidedModalities = [],
    clinicalGuidelines = [],
    hrZones
  } = cardioPlan;

  const currentMod = Object.values(CARDIO_MODALITIES).find(m => m.id === selectedModality) || primaryModality;

  const zoneColors = {
    1: '#94a3b8',
    2: '#38bdf8',
    3: '#22c55e',
    4: '#f97316',
    5: '#ef4444'
  };

  return (
    <div className="cardio-card" style={{
      background: 'linear-gradient(145deg, #0f172a, #1e293b)',
      borderRadius: '16px',
      border: '1px solid #334155',
      padding: '24px',
      color: '#f8fafc',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '28px' }}>🏃</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>Prescrição Clínica de Cardio</h2>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                Protocolo: <span style={{ color: '#38bdf8', fontWeight: '600' }}>{protocolType}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Live Amazfit / BLE Widget */}
        <div>
          <HeartRateWidget userProfile={userProfile} />
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <div style={{ background: '#020617', padding: '14px', borderRadius: '12px', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Frequência</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#38bdf8' }}>{weeklyFrequency}x <span style={{ fontSize: '12px', color: '#64748b' }}>/sem</span></div>
        </div>
        <div style={{ background: '#020617', padding: '14px', borderRadius: '12px', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Duração</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#4ade80' }}>{sessionDurationMin} <span style={{ fontSize: '12px', color: '#64748b' }}>min/sessão</span></div>
        </div>
        <div style={{ background: '#020617', padding: '14px', borderRadius: '12px', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Gasto por Sessão</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#fbbf24' }}>~{calorieBurnPerSessionEst} <span style={{ fontSize: '12px', color: '#64748b' }}>kcal</span></div>
        </div>
        <div style={{ background: '#020617', padding: '14px', borderRadius: '12px', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Meta NEAT Diária</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#c084fc' }}>{neatStepsTarget.toLocaleString()} <span style={{ fontSize: '12px', color: '#64748b' }}>passos</span></div>
        </div>
      </div>

      {/* Target Heart Rate Zone Banner */}
      <div style={{
        background: 'rgba(56, 189, 248, 0.08)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Zona Cardíaca Alvo: {targetZone?.name || 'Zona 2'}
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#cbd5e1' }}>
            {targetZone?.focus || 'Oxidação pura de ácidos graxos sem catabolismo muscular.'}
          </p>
        </div>
        <div style={{
          background: '#020617',
          padding: '8px 16px',
          borderRadius: '8px',
          border: '1px solid #38bdf8',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Faixa Alvo no Relógio</div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: '#38bdf8' }}>
            {targetZone?.bpmRange?.[0]} - {targetZone?.bpmRange?.[1]} <span style={{ fontSize: '11px', fontWeight: '500' }}>BPM</span>
          </div>
        </div>
      </div>

      {/* Modalidades Recomendadas Selector */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '14px', margin: '0 0 12px 0', color: '#e2e8f0' }}>Escolha a Modalidade de Execução:</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {safeModalities.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedModality(m.id)}
              style={{
                background: selectedModality === m.id ? '#2563eb' : '#0f172a',
                color: selectedModality === m.id ? '#fff' : '#94a3b8',
                border: `1px solid ${selectedModality === m.id ? '#3b82f6' : '#334155'}`,
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* Selected Modality Card */}
        {currentMod && (
          <div style={{
            marginTop: '12px',
            background: '#020617',
            border: '1px solid #1e293b',
            borderRadius: '10px',
            padding: '14px',
            fontSize: '13px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontWeight: '700', color: '#f8fafc' }}>{currentMod.name}</span>
              <span style={{ fontSize: '11px', color: '#4ade80', background: 'rgba(74, 222, 128, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                Impacto: {currentMod.impact} | Carga Axial: {currentMod.axialLoad}
              </span>
            </div>
            <p style={{ margin: '0 0 8px 0', color: '#cbd5e1' }}>{currentMod.description}</p>
            <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: '#94a3b8' }}>
              {currentMod.defaultIncline && <span>📐 Inclinação: <b>{currentMod.defaultIncline}</b></span>}
              {currentMod.defaultSpeed && <span>⚡ Ritmo: <b>{currentMod.defaultSpeed}</b></span>}
              {currentMod.protocol && <span>⏱️ Protocolo: <b>{currentMod.protocol}</b></span>}
            </div>
          </div>
        )}
      </div>

      {/* Contraindicated / Filtered Out Modalities */}
      {avoidedModalities.length > 0 && (
        <div style={{
          marginBottom: '24px',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '10px',
          padding: '14px'
        }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#f87171', marginBottom: '8px' }}>
            🛡️ Modalidades Descartadas pela Ficha Médica:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {avoidedModalities.map(m => (
              <div key={m.id} style={{ fontSize: '12px', color: '#cbd5e1', display: 'flex', justifyContent: 'space-between' }}>
                <span>❌ {m.name}</span>
                <span style={{ color: '#f87171', fontSize: '11px' }}>{m.reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5 Heart Rate Zones Table */}
      {hrZones && (
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '14px', margin: '0 0 12px 0', color: '#e2e8f0' }}>Zonas Cardíacas Pessoais (Tanaka / Karvonen):</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[1, 2, 3, 4, 5].map(z => {
              const zoneData = hrZones[`zone${z}`];
              const isTarget = targetZone?.name?.includes(`Zona ${z}`);
              return (
                <div key={z} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: isTarget ? 'rgba(56, 189, 248, 0.15)' : '#020617',
                  border: `1px solid ${isTarget ? '#38bdf8' : '#1e293b'}`,
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      display: 'inline-block',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: zoneColors[z]
                    }}></span>
                    <span style={{ fontWeight: isTarget ? '700' : '500', color: '#f8fafc' }}>
                      {zoneData.name} ({zoneData.pctRange})
                    </span>
                    {isTarget && (
                      <span style={{ fontSize: '10px', background: '#38bdf8', color: '#000', padding: '1px 6px', borderRadius: '4px', fontWeight: '800' }}>
                        ALVO
                      </span>
                    )}
                  </div>
                  <div style={{ fontWeight: '700', color: zoneColors[z] }}>
                    {zoneData.bpmRange[0]} - {zoneData.bpmRange[1]} BPM
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Clinical Guidelines */}
      {clinicalGuidelines.length > 0 && (
        <div>
          <h4 style={{ fontSize: '14px', margin: '0 0 8px 0', color: '#e2e8f0' }}>Diretrizes do Coach:</h4>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', lineHeight: '1.6', color: '#94a3b8' }}>
            {clinicalGuidelines.map((g, idx) => (
              <li key={idx} style={{ marginBottom: '4px' }}>{g}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CardioCard;
