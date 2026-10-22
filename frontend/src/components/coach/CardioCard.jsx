// src/frontend/src/components/coach/CardioCard.jsx
// Visualizacao de Cardio nativa openGym: Zona 2, controle de impacto articular, frequencia e integracao com wearable.

import React, { useState } from 'react';
import { Section, Row, Segmented, Button } from '../ui.jsx';
import Icon from '../Icon.jsx';
import { HeartRateWidget } from './HeartRateWidget.jsx';
import { CARDIO_MODALITIES } from '../../lib/ai/cardio-engine.js';

export function CardioCard({ cardioPlan, userProfile = {} }) {
  const [selectedModality, setSelectedModality] = useState(
    cardioPlan?.primaryModality?.id || 'incline_treadmill'
  );

  if (!cardioPlan) {
    return (
      <div className="empty" style={{ padding: '40px 0' }}>
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
    primaryModality,
    safeModalities = [],
    avoidedModalities = []
  } = cardioPlan;

  const currentMod = Object.values(CARDIO_MODALITIES).find(m => m.id === selectedModality) || primaryModality;

  return (
    <div className="coach-cardio-native">
      {/* 1. Cardio Overview Card */}
      <div className="coach-native-box" style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--pink)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>
              {protocolType || 'Zona 2 · Lipólise Máxima'}
            </span>
            <span style={{ fontSize: 12, color: 'var(--label-2)' }}>
              Prescrição Cardiorrespiratória & Biomecânica
            </span>
          </div>

          <HeartRateWidget userProfile={userProfile} />
        </div>

        {/* 4 Metrics Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginTop: 10 }}>
          <div className="c-sub-metric">
            <span className="c-sub-val" style={{ color: 'var(--blue)' }}>{weeklyFrequency}x</span>
            <span className="c-sub-lbl">Freq/sem</span>
          </div>
          <div className="c-sub-metric">
            <span className="c-sub-val" style={{ color: 'var(--green)' }}>{sessionDurationMin}m</span>
            <span className="c-sub-lbl">Duração</span>
          </div>
          <div className="c-sub-metric">
            <span className="c-sub-val" style={{ color: 'var(--orange)' }}>~{calorieBurnPerSessionEst}</span>
            <span className="c-sub-lbl">kcal/sessão</span>
          </div>
          <div className="c-sub-metric">
            <span className="c-sub-val" style={{ color: 'var(--pink)' }}>{(neatStepsTarget || 10000) / 1000}k</span>
            <span className="c-sub-lbl">Passos/dia</span>
          </div>
        </div>
      </div>

      {/* 2. Heart Rate Target Zone */}
      <Section title="Zona Cardíaca Alvo" footer="Mantenha os batimentos nessa faixa para oxidação pura de gordura sem degradar massa muscular.">
        <div style={{ padding: '14px', background: 'var(--surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--acc)' }}>
              {targetZone?.name || 'Zona 2 (FatMax)'}
            </span>
            <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--label)', fontVariantNumeric: 'tabular-nums' }}>
              {targetZone?.bpmRange?.[0] || 120} - {targetZone?.bpmRange?.[1] || 138} BPM
            </span>
          </div>

          <div style={{ fontSize: 13, color: 'var(--label-2)', lineHeight: 1.4, marginBottom: 12 }}>
            {targetZone?.focus || 'Oxidação pura de ácidos graxos sem catabolismo muscular e sem fadiga residual para os treinos de força.'}
          </div>

          {/* Visual Range Indicator Bar */}
          <div style={{ height: 6, background: 'var(--surface-2)', borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
            <div
              style={{
                position: 'absolute',
                left: '25%',
                width: '35%',
                height: '100%',
                background: 'var(--acc)',
                borderRadius: 3
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--label-3)', marginTop: 4 }}>
            <span>Repouso</span>
            <span style={{ color: 'var(--acc)', fontWeight: 600 }}>Zona 2 Alvo</span>
            <span>Máximo</span>
          </div>
        </div>
      </Section>

      {/* 3. Modalities Selector */}
      <Section title="Modalidade Selecionada" footer="Exercícios com baixo estresse axial e proteção para articulações vulneráveis.">
        <div style={{ padding: '8px 14px' }}>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 6 }}>
            {safeModalities.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedModality(m.id)}
                style={{
                  background: selectedModality === m.id ? 'var(--acc-soft)' : 'var(--surface-2)',
                  color: selectedModality === m.id ? 'var(--acc)' : 'var(--label-2)',
                  border: selectedModality === m.id ? '1px solid var(--acc)' : 'var(--hair) solid var(--sep-op)',
                  padding: '8px 12px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {currentMod && (
          <div style={{ padding: '14px', background: 'var(--surface)', borderTop: 'var(--hair) solid var(--sep-op)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--label)' }}>
                {currentMod.name}
              </span>
              <span style={{ fontSize: 11, color: 'var(--acc)', background: 'var(--acc-soft)', padding: '2px 6px', borderRadius: 6, fontWeight: 600 }}>
                Impacto: {currentMod.impact || 'Baixo'}
              </span>
            </div>

            <p style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--label-2)', lineHeight: 1.4 }}>
              {currentMod.description}
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', fontSize: 12, color: 'var(--label-2)', background: 'var(--surface-2)', padding: '8px 10px', borderRadius: 8 }}>
              {currentMod.defaultIncline && <span>📐 Inclinação: <strong>{currentMod.defaultIncline}</strong></span>}
              {currentMod.defaultSpeed && <span>⚡ Ritmo: <strong>{currentMod.defaultSpeed}</strong></span>}
              {currentMod.protocol && <span>⏱️ Protocolo: <strong>{currentMod.protocol}</strong></span>}
            </div>
          </div>
        )}
      </Section>

      {/* 4. Contraindications / Filtered Modalities */}
      {avoidedModalities.length > 0 && (
        <Section title="Restrições Articulares">
          {avoidedModalities.map(m => (
            <Row
              key={m.id}
              icon="shield"
              iconTint="var(--orange)"
              title={`Descartado: ${m.name}`}
              subtitle={m.reason}
            />
          ))}
        </Section>
      )}
    </div>
  );
}

export default CardioCard;
