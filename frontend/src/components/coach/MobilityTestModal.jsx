// src/components/coach/MobilityTestModal.jsx
// Interactive Mobility Assessment modal with gesture guides, video recording,
// biomechanical computer vision angle calculations and workout prescription integration.

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MOBILITY_TESTS, recordMobilityVideo, analyzeMobilityVideo } from '../../lib/ai/mobility-analyzer.js';
import { importAICoachToOpenGym } from '../../lib/ai/plan-importer.js';
import { useUI } from '../../store/useUI.js';
import { useStore } from '../../store/useStore.js';

export function MobilityTestModal({ isOpen, onClose, onAssessmentComplete }) {
  const [selectedTest, setSelectedTest] = useState('overhead_squat');
  const [stage, setStage] = useState('guide'); // 'guide' | 'countdown' | 'recording' | 'analyzing' | 'result'
  const [countdown, setCountdown] = useState(3);
  const [recordProgress, setRecordProgress] = useState(0);
  const [cameraFacing, setCameraFacing] = useState('user'); // 'user' | 'environment'
  const [cameraActive, setCameraActive] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isImporting, setIsImporting] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const activeTest = MOBILITY_TESTS[selectedTest];

  // Stop camera stream safely
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  // Start camera stream
  const startCamera = useCallback(async () => {
    stopCamera();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraFacing, width: { ideal: 720 }, height: { ideal: 1280 } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (e) {
      console.warn('Camera access error, fallback to simulation mode:', e);
      setCameraActive(false);
    }
  }, [cameraFacing, stopCamera]);

  useEffect(() => {
    if (isOpen && (stage === 'countdown' || stage === 'recording')) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, stage, startCamera, stopCamera]);

  // Clean exit
  const handleClose = () => {
    stopCamera();
    setStage('guide');
    setAnalysisResult(null);
    onClose();
  };

  // Start the countdown before recording
  const handleBeginRecording = () => {
    setStage('countdown');
    setCountdown(3);
    startCamera();

    let count = 3;
    const timer = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(timer);
        triggerActualRecording();
      }
    }, 1000);
  };

  // Trigger recording for test duration
  const triggerActualRecording = async () => {
    setStage('recording');
    setRecordProgress(0);

    try {
      let videoBlob = null;
      if (streamRef.current) {
        videoBlob = await recordMobilityVideo(streamRef.current, activeTest.durationSec, progress => {
          setRecordProgress(progress);
        });
      } else {
        // Simulated timer if camera unavailable in emulator
        for (let p = 0; p <= 100; p += 10) {
          setRecordProgress(p);
          await new Promise(r => setTimeout(r, 600));
        }
      }

      stopCamera();
      setStage('analyzing');

      const result = await analyzeMobilityVideo(videoBlob, selectedTest);
      setAnalysisResult(result);
      setStage('result');
      if (onAssessmentComplete) onAssessmentComplete(result);
    } catch (e) {
      console.error('Mobility recording error:', e);
      stopCamera();
      setStage('guide');
      useUI.getState().toast('Erro na captura do teste de mobilidade');
    }
  };

  // Apply adjustments directly to openGym workout store
  const handleApplyToWorkouts = async () => {
    if (!analysisResult) return;
    setIsImporting(true);
    try {
      const currentS = useStore.getState().S;
      await importAICoachToOpenGym({
        workoutPlan: { routines: currentS.routines },
        nutritionPlan: currentS.dietPlan,
        cardioPlan: currentS.cardioPlan,
        mobilityAssessment: analysisResult,
        orthopedicAdjustments: analysisResult.workoutAdjustments || []
      });
      useUI.getState().toast('Adaptações de mobilidade aplicadas aos seus treinos!');
      handleClose();
    } catch (e) {
      useUI.getState().toast('Erro ao atualizar rotinas');
    } finally {
      setIsImporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="mobility-modal-backdrop" onClick={handleClose}>
      <div className="mobility-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="mobility-header">
          <div>
            <h2 className="mobility-title">Avaliação de Mobilidade Funcional</h2>
            <span className="mobility-subtitle">Análise biomecânica guiada por vídeo & IA</span>
          </div>
          <button className="mobility-close-btn" onClick={handleClose}>×</button>
        </div>

        {/* Test Selector Tabs */}
        {stage === 'guide' && (
          <div className="mobility-tabs">
            {Object.values(MOBILITY_TESTS).map(test => (
              <button
                key={test.id}
                className={`mobility-tab ${selectedTest === test.id ? 'active' : ''}`}
                onClick={() => setSelectedTest(test.id)}
              >
                {test.name}
              </button>
            ))}
          </div>
        )}

        {/* STAGE 1: Guide & Gesture Explanation */}
        {stage === 'guide' && (
          <div className="mobility-content">
            <div className="mobility-focus-pill">
              <strong>Foco Clínico:</strong> {activeTest.focus}
            </div>

            {/* Gesture Visual Demo Box */}
            <div className="gesture-demo-box">
              <div className="gesture-animation-preview">
                {/* Biomechanical stick figure SVG animation demo */}
                <svg viewBox="0 0 200 200" className="mobility-svg-demo">
                  <circle cx="100" cy="35" r="12" fill="var(--acc)" />
                  <line x1="100" y1="47" x2="100" y2="100" stroke="var(--label-1)" strokeWidth="4" />
                  {/* Arms overhead */}
                  <line x1="100" y1="55" x2="65" y2="25" stroke="var(--acc)" strokeWidth="4" strokeLinecap="round" />
                  <line x1="100" y1="55" x2="135" y2="25" stroke="var(--acc)" strokeWidth="4" strokeLinecap="round" />
                  {/* Legs in squat position */}
                  <line x1="100" y1="100" x2="65" y2="130" stroke="var(--label-1)" strokeWidth="4" />
                  <line x1="65" y1="130" x2="65" y2="175" stroke="var(--label-1)" strokeWidth="4" />
                  <line x1="100" y1="100" x2="135" y2="130" stroke="var(--label-1)" strokeWidth="4" />
                  <line x1="135" y1="130" x2="135" y2="175" stroke="var(--label-1)" strokeWidth="4" />
                  {/* Alignment angles */}
                  <line x1="45" y1="175" x2="155" y2="175" stroke="var(--label-3)" strokeDasharray="4" />
                </svg>
                <span className="demo-caption">Exemplo de Alinhamento: Tronco Neutro & Calcanhares no Solo</span>
              </div>

              <div className="camera-setup-tip">
                <span className="tip-icon">📐</span>
                <div>
                  <strong>Posicionamento da Câmera:</strong>
                  <p>{activeTest.cameraGuide}</p>
                </div>
              </div>
            </div>

            {/* Step-by-Step Gestures */}
            <h4 style={{ margin: '14px 0 8px', fontSize: 15 }}>Gestos e Alinhamentos Exigidos:</h4>
            <div className="gesture-steps-list">
              {activeTest.gestures.map(g => (
                <div key={g.step} className="gesture-step-item">
                  <div className="step-num">{g.step}</div>
                  <div className="step-info">
                    <strong>{g.title}</strong>
                    <p>{g.desc}</p>
                    <span className="step-cue">Dica: {g.cue}</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="mobility-action-btn primary" onClick={handleBeginRecording}>
              📹 Iniciar Teste com Gravação (6s)
            </button>
          </div>
        )}

        {/* STAGE 2 & 3: Countdown and Recording View */}
        {(stage === 'countdown' || stage === 'recording') && (
          <div className="mobility-recording-viewport">
            <video ref={videoRef} autoPlay playsInline muted className="camera-video-elem" />

            {/* Target Alignment Overlay Grid */}
            <div className="camera-overlay-grid">
              <div className="overlay-line vertical"></div>
              <div className="overlay-line horizontal"></div>
              <div className="posture-silhouette-guide"></div>
            </div>

            {/* Countdown Overlay */}
            {stage === 'countdown' && (
              <div className="countdown-overlay">
                <span className="countdown-number">{countdown}</span>
                <p>Prepare-se na posição inicial...</p>
              </div>
            )}

            {/* Recording Active Bar */}
            {stage === 'recording' && (
              <div className="recording-hud">
                <div className="rec-indicator">
                  <span className="rec-dot"></span> GRAVANDO TESTE ({activeTest.durationSec}s)
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${recordProgress}%` }}></div>
                </div>
                <p className="hud-cue">Execute a descida controlada e suba de forma contínua</p>
              </div>
            )}

            {/* Camera switch toggle */}
            <button
              className="camera-switch-btn"
              onClick={() => setCameraFacing(f => f === 'user' ? 'environment' : 'user')}
            >
              🔄
            </button>
          </div>
        )}

        {/* STAGE 4: AI Analysis Loading */}
        {stage === 'analyzing' && (
          <div className="mobility-analyzing-box">
            <div className="analyzing-scanner">
              <div className="scanner-line"></div>
            </div>
            <h3>Processando Biomecânica...</h3>
            <p>Calculando ângulos de flexão de quadril, dorsiflexão de tornozelo e projeção do tronco via Visão Computacional.</p>
          </div>
        )}

        {/* STAGE 5: Result & Prescription */}
        {stage === 'result' && analysisResult && (
          <div className="mobility-result-content">
            <div className="result-score-card">
              <div className="score-circle">
                <span className="score-val">{analysisResult.score}</span>
                <span className="score-max">/100</span>
              </div>
              <div className="score-text">
                <h3>{analysisResult.level}</h3>
                <p>{analysisResult.testName}</p>
              </div>
            </div>

            {/* Biomechanical Angle Metrics */}
            <h4 style={{ margin: '14px 0 8px', fontSize: 15 }}>Ângulos Medidos na Execução:</h4>
            <div className="metrics-grid">
              {Object.entries(analysisResult.calculatedAngles).map(([k, val]) => (
                <div key={k} className="metric-cell">
                  <span className="metric-label">{k.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                  <span className="metric-val">{val}</span>
                </div>
              ))}
            </div>

            {/* Clinical Feedback */}
            <div className="diagnostic-box">
              <div className="diag-header">🩺 Diagnóstico Clínico</div>
              <p>{analysisResult.biomechanicalNotes}</p>
              {analysisResult.restrictions.length > 0 && (
                <ul className="restrictions-list">
                  {analysisResult.restrictions.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Corrective Exercise & Adaptations */}
            {analysisResult.workoutAdjustments.length > 0 && (
              <div className="adaptations-box">
                <div className="diag-header">⚡ Adaptações Automáticas para Seus Treinos:</div>
                {analysisResult.workoutAdjustments.map((adj, i) => (
                  <div key={i} className="adj-item">
                    <strong>{adj.exercise}:</strong> {adj.adaptation}
                  </div>
                ))}
                {analysisResult.correctiveExercise && (
                  <div className="corrective-ex-pill">
                    <span>Aquecimento Preventivo Sugerido:</span> <strong>{analysisResult.correctiveExercise}</strong>
                  </div>
                )}
              </div>
            )}

            <div className="result-actions">
              <button
                className="mobility-action-btn primary"
                onClick={handleApplyToWorkouts}
                disabled={isImporting}
              >
                {isImporting ? 'Atualizando openGym...' : '✓ Aplicar ao Meu Treino openGym'}
              </button>
              <button className="mobility-action-btn secondary" onClick={() => setStage('guide')}>
                Refazer Teste
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
