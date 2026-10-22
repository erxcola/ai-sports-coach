import React, { useState, useEffect, useRef } from 'react';
import { BluetoothHeartRateMonitor } from '../../lib/wearables/bluetooth-heartrate.js';

export function WearableSyncModal({ isOpen, onClose, userProfile = {}, onTelemetryUpdate }) {
  const [monitor, setMonitor] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Desconectado');
  const [deviceName, setDeviceName] = useState('');
  const [currentBpm, setCurrentBpm] = useState(0);
  const [zone, setZone] = useState(1);
  const [zoneName, setZoneName] = useState('Zona 1');
  const [calories, setCalories] = useState(0);
  const [peakBpm, setPeakBpm] = useState(0);
  const [avgBpm, setAvgBpm] = useState(0);
  const [activeTab, setActiveTab] = useState('monitor'); // 'monitor' | 'instructions'

  const monitorRef = useRef(null);

  useEffect(() => {
    const inst = new BluetoothHeartRateMonitor({
      age: userProfile.age || 28,
      weightKg: userProfile.bodyWeight || userProfile.weight || 75,
      gender: userProfile.gender || 'male',
      restingHeartRate: userProfile.restingHeartRate || 65,
      onHeartRate: (data) => {
        setCurrentBpm(data.bpm);
        setZone(data.zone);
        setZoneName(data.zoneName);
        setCalories(data.caloriesExpended);
        setPeakBpm(data.peakBpm);
        setAvgBpm(data.averageBpm);
        if (onTelemetryUpdate) onTelemetryUpdate(data);
      },
      onStatusChange: (s) => {
        setStatusMessage(s.message);
        if (s.status === 'connected') {
          setIsConnected(true);
          setDeviceName(s.deviceName);
        } else if (s.status === 'disconnected') {
          setIsConnected(false);
        }
      },
      onError: (err) => {
        setStatusMessage(`Erro: ${err.message}`);
      }
    });

    monitorRef.current = inst;
    setMonitor(inst);

    return () => {
      if (inst && inst.isConnected) {
        inst.disconnect();
      }
    };
  }, [userProfile]);

  const handleConnect = async () => {
    if (!monitorRef.current) return;
    try {
      await monitorRef.current.connect();
    } catch (e) {
      console.warn('Conexão BLE cancelada ou falhou:', e);
    }
  };

  const handleDisconnect = () => {
    if (monitorRef.current) {
      monitorRef.current.disconnect();
    }
  };

  if (!isOpen) return null;

  const zoneColors = {
    1: '#94a3b8', // Gray
    2: '#38bdf8', // Cyan/Blue (Zone 2)
    3: '#22c55e', // Green
    4: '#f97316', // Orange
    5: '#ef4444'  // Red
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        background: '#0f172a',
        border: '1px solid #1e293b',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '480px',
        padding: '24px',
        color: '#f8fafc',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>⌚</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Monitor Cardíaco & Relógio</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Amazfit, Garmin, Polar e relógios BLE</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: '#1e293b',
              border: 'none',
              color: '#94a3b8',
              borderRadius: '8px',
              padding: '6px 12px',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: '#020617', padding: '4px', borderRadius: '8px' }}>
          <button
            onClick={() => setActiveTab('monitor')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'monitor' ? '#2563eb' : 'transparent',
              color: '#fff',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Monitor em Tempo Real
          </button>
          <button
            onClick={() => setActiveTab('instructions')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'instructions' ? '#2563eb' : 'transparent',
              color: '#fff',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Como Conectar o Amazfit
          </button>
        </div>

        {activeTab === 'instructions' ? (
          <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#cbd5e1' }}>
            <h4 style={{ color: '#38bdf8', marginTop: 0 }}>Como ativar no Amazfit / Zepp:</h4>
            <ol style={{ paddingLeft: '20px', margin: '0 0 16px 0' }}>
              <li>Abra o aplicativo <b>Zepp</b> no seu celular.</li>
              <li>Acesse <b>Perfil</b> &gt; selecione o seu modelo Amazfit (Bip, GTS, GTR, Band, T-Rex).</li>
              <li>Toque em <b>Compartilhamento de Frequência Cardíaca</b> (Heart Rate Sharing).</li>
              <li>Ative a opção <b>Compartilhar frequência cardíaca</b>.</li>
              <li>Volte nesta tela e clique no botão azul abaixo para parear via Bluetooth!</li>
            </ol>
            <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
              * Funciona também com relógios Garmin (Transmit HR), cintas Polar H10, Whoop e transmissores padrão BLE (GATT 0x180D).
            </p>
          </div>
        ) : (
          <div>
            {/* Live Card */}
            <div style={{
              background: 'linear-gradient(145deg, #1e293b, #0f172a)',
              border: `2px solid ${isConnected ? zoneColors[zone] : '#334155'}`,
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              marginBottom: '20px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  backgroundColor: isConnected ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: isConnected ? '#4ade80' : '#f87171'
                }}>
                  {isConnected ? deviceName : 'Desconectado'}
                </span>
                {isConnected && (
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: zoneColors[zone],
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    padding: '4px 10px',
                    borderRadius: '8px'
                  }}>
                    {zoneName}
                  </span>
                )}
              </div>

              {/* Heart Pulse */}
              <div style={{ margin: '16px 0' }}>
                <span style={{
                  display: 'inline-block',
                  fontSize: '48px',
                  animation: isConnected ? 'pulse 1s infinite' : 'none'
                }}>
                  ❤️
                </span>
                <div style={{ fontSize: '56px', fontWeight: '900', letterSpacing: '-2px', color: '#f8fafc', lineHeight: 1 }}>
                  {isConnected ? currentBpm : '--'}
                  <span style={{ fontSize: '18px', fontWeight: '500', color: '#94a3b8', marginLeft: '6px' }}>BPM</span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                marginTop: '16px',
                borderTop: '1px solid #334155',
                paddingTop: '16px'
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Gasto Ativo</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#fbbf24' }}>
                    {calories} <span style={{ fontSize: '11px', fontWeight: '400' }}>kcal</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Média</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#38bdf8' }}>
                    {avgBpm} <span style={{ fontSize: '11px', fontWeight: '400' }}>BPM</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Pico</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#f87171' }}>
                    {peakBpm} <span style={{ fontSize: '11px', fontWeight: '400' }}>BPM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status bar */}
            <p style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', margin: '0 0 16px 0' }}>
              {statusMessage}
            </p>
          </div>
        )}

        {/* Action Button */}
        <div>
          {!isConnected ? (
            <button
              onClick={handleConnect}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '14px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
              }}
            >
              <span>🔍</span> Conectar Relógio / Sensor BLE
            </button>
          ) : (
            <button
              onClick={handleDisconnect}
              style={{
                width: '100%',
                background: '#dc2626',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Desconectar Sensor
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default WearableSyncModal;
