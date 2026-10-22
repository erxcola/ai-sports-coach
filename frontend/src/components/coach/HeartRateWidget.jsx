import React, { useState } from 'react';
import { WearableSyncModal } from './WearableSyncModal.jsx';

export function HeartRateWidget({ userProfile = {} }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [telemetry, setTelemetry] = useState(null);

  const zoneColors = {
    1: '#94a3b8',
    2: '#38bdf8',
    3: '#22c55e',
    4: '#f97316',
    5: '#ef4444'
  };

  const currentZone = telemetry?.zone || 1;
  const currentBpm = telemetry?.bpm || 0;
  const calories = telemetry?.caloriesExpended || 0;

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(15, 23, 42, 0.8)',
          border: `1px solid ${telemetry ? zoneColors[currentZone] : '#334155'}`,
          borderRadius: '9999px',
          padding: '6px 14px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
          transition: 'all 0.2s ease',
          backdropFilter: 'blur(8px)'
        }}
        title="Clique para gerenciar conexão com relógio Amazfit / Garmin / BLE"
      >
        <span style={{
          display: 'inline-block',
          fontSize: '16px',
          animation: telemetry ? 'pulse 1s infinite' : 'none'
        }}>
          ❤️
        </span>

        {telemetry ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: '800', color: '#f8fafc' }}>
              {currentBpm} <span style={{ fontSize: '10px', color: '#94a3b8' }}>BPM</span>
            </span>
            <span style={{
              fontSize: '10px',
              fontWeight: '700',
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: `${zoneColors[currentZone]}22`,
              color: zoneColors[currentZone]
            }}>
              Z{currentZone}
            </span>
            <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: '600' }}>
              {calories} kcal
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1' }}>
              Conectar Amazfit / Relógio
            </span>
            <span style={{ fontSize: '10px', background: '#2563eb', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>
              BLE
            </span>
          </div>
        )}
      </div>

      <WearableSyncModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userProfile={userProfile}
        onTelemetryUpdate={(data) => setTelemetry(data)}
      />
    </>
  );
}

export default HeartRateWidget;
