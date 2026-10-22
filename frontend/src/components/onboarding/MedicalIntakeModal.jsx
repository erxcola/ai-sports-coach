/**
 * MedicalIntakeModal - Formulário Moderno de Onboarding e Avaliação do AI Coach
 * Interface redesenhada com Glassmorphism, Dark Mode e Seleção Visual de Biotipo
 */

import React, { useState, useEffect, useRef } from 'react';
import { ALL_ORTHOPEDIC_CONDITIONS, OrthopedicCondition } from '../../lib/types/biomechanics.js';
import { createComputerVisionAnalyzer } from '../../lib/ai/computer-vision.js';
import './medical-intake.css';

const CONDITION_LABELS = {
  [OrthopedicCondition.SCOLIOSIS]: 'Escoliose',
  [OrthopedicCondition.KYPHOSIS]: 'Cifose Torácica',
  [OrthopedicCondition.LORDOSIS]: 'Lordose Lombar',
  [OrthopedicCondition.KNEE_CHONDROMALACIA]: 'Condromalácia Patelar',
  [OrthopedicCondition.PATELLAR_TENDINITIS]: 'Tendinite Patelar',
  [OrthopedicCondition.MENISCUS_PATHOLOGY]: 'Lesão Meniscal',
  [OrthopedicCondition.ACL_INSTABILITY]: 'Instabilidade LCA',
  [OrthopedicCondition.SHOULDER_IMPINGEMENT]: 'Impacto no Ombro',
  [OrthopedicCondition.ROTATOR_CUFF_TENDINITIS]: 'Tendinite Manguito Rotador',
  [OrthopedicCondition.GLENO_HUMERAL_ARTHRITIS]: 'Artrose Glenoumeral',
  [OrthopedicCondition.AC_JOINT_OSTEOARTHRITIS]: 'Artrose Acrômio-Clavicular',
  [OrthopedicCondition.MEDIAL_EPICONDYLITIS]: 'Epicondilite Medial',
  [OrthopedicCondition.LATERAL_EPICONDYLITIS]: 'Epicondilite Lateral',
  [OrthopedicCondition.ACHILLES_TENDINITIS]: 'Tendinite de Aquiles',
  [OrthopedicCondition.PLANTAR_FASCIITIS]: 'Fascite Plantar',
  [OrthopedicCondition.ANKLE_INSTABILITY]: 'Instabilidade Tornozelo',
  [OrthopedicCondition.CARPAL_TUNNEL]: 'Túnel do Carpo',
  [OrthopedicCondition.POSTURAL_IMBALANCE]: 'Desequilíbrio Postural',
  [OrthopedicCondition.FATIGUE_SYNDROME]: 'Fadiga Crônica'
};

const GOALS = [
  {
    id: 'hypertrophy',
    icon: '🏆',
    title: 'Hipertrofia Muscular',
    desc: 'Ganho máximo de volume e massa muscular com superávit calórico limpo.'
  },
  {
    id: 'recomp',
    icon: '⚖️',
    title: 'Recomposição Corporal',
    desc: 'Construir massa magra e queimar gordura corporal simultaneamente.'
  },
  {
    id: 'fat_loss',
    icon: '🔥',
    title: 'Definição / Cutting',
    desc: 'Déficit calórico controlado preservando massa muscular e força.'
  },
  {
    id: 'strength',
    icon: '⚡',
    title: 'Força Máxima',
    desc: 'Adaptação neuromuscular e progressão focada em cargas pesadas.'
  }
];

const MALE_BF_ARCHETYPES = [
  { id: 'm_8_10', range: '8% – 10%', target: 9, label: 'Rasgado / Atleta', desc: 'Abdômen 6-pack e veias visíveis', iconType: 'shredded' },
  { id: 'm_11_14', range: '11% – 14%', target: 12.5, label: 'Atlético / Definido', desc: 'Retos abdominais bem marcados', iconType: 'athletic' },
  { id: 'm_15_18', range: '15% – 18%', target: 16.5, label: 'Fitness / Saudável', desc: 'Linha alba visível, flancos leves', iconType: 'fitness' },
  { id: 'm_19_23', range: '19% – 23%', target: 21, label: 'Moderado', desc: 'Parede abdominal sem definição', iconType: 'moderate' },
  { id: 'm_24_28', range: '24% – 28%', target: 26, label: 'Sobrepeso Leve', desc: 'Gordura localizada na cintura', iconType: 'soft' },
  { id: 'm_29_plus', range: '29%+', target: 31, label: 'Elevado', desc: 'Maior volume na cintura e peitoral', iconType: 'heavy' }
];

const FEMALE_BF_ARCHETYPES = [
  { id: 'f_14_17', range: '14% – 17%', target: 15.5, label: 'Competição / Atleta', desc: 'Linhas profundas, baixíssima gordura', iconType: 'shredded' },
  { id: 'f_18_21', range: '18% – 21%', target: 19.5, label: 'Atlética / Fitness', desc: 'Abdômen plano e pernas firmes', iconType: 'athletic' },
  { id: 'f_22_25', range: '22% – 25%', target: 23.5, label: 'Fitness / Saudável', desc: 'Curvas naturais com pouca gordura', iconType: 'fitness' },
  { id: 'f_26_29', range: '26% – 29%', target: 27.5, label: 'Moderada', desc: 'Curvas suaves em coxas e quadril', iconType: 'moderate' },
  { id: 'f_30_34', range: '30% – 34%', target: 32, label: 'Sobrepeso Leve', desc: 'Maior concentração nos quadris', iconType: 'soft' },
  { id: 'f_35_plus', range: '35%+', target: 37, label: 'Elevado', desc: 'Volume corporal e retenção maiores', iconType: 'heavy' }
];

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentário', detail: 'Pouca ou nenhuma atividade diária' },
  { value: 'lightly_active', label: 'Levemente Ativo', detail: 'Treino leve ou caminhada 1-3x/sem' },
  { value: 'moderately_active', label: 'Moderadamente Ativo', detail: 'Treino 3-5x/sem com rotina ativa' },
  { value: 'very_active', label: 'Muito Ativo', detail: 'Treino pesado 6-7x/semana' },
  { value: 'extra_active', label: 'Extremamente Ativo', detail: 'Treino 2x/dia ou trabalho braçal' }
];

function SilhouetteIcon({ type }) {
  if (type === 'shredded') {
    return (
      <svg viewBox="0 0 48 56" fill="currentColor" width="40" height="46">
        <circle cx="24" cy="7" r="5" opacity="0.9" />
        <path d="M14 15 L34 15 L30 33 L27 34 L27 48 L25 48 L25 36 L23 36 L23 48 L21 48 L21 34 L18 33 Z" />
        {/* Abdominal 6-pack cuts */}
        <line x1="24" y1="19" x2="24" y2="31" stroke="#16181f" strokeWidth="1.5" />
        <line x1="20" y1="22" x2="28" y2="22" stroke="#16181f" strokeWidth="1.5" />
        <line x1="21" y1="26" x2="27" y2="26" stroke="#16181f" strokeWidth="1.5" />
      </svg>
    );
  }
  if (type === 'athletic') {
    return (
      <svg viewBox="0 0 48 56" fill="currentColor" width="40" height="46">
        <circle cx="24" cy="7" r="5" opacity="0.9" />
        <path d="M15 15 L33 15 L29 33 L26 34 L26 48 L24.5 48 L24.5 36 L23.5 36 L23.5 48 L22 48 L22 34 L19 33 Z" />
        <line x1="24" y1="20" x2="24" y2="30" stroke="#16181f" strokeWidth="1.5" />
        <line x1="21" y1="24" x2="27" y2="24" stroke="#16181f" strokeWidth="1.5" />
      </svg>
    );
  }
  if (type === 'fitness') {
    return (
      <svg viewBox="0 0 48 56" fill="currentColor" width="40" height="46">
        <circle cx="24" cy="7" r="5" opacity="0.9" />
        <path d="M16 15 L32 15 L29 33 L26 34 L26 48 L24.5 48 L24.5 36 L23.5 36 L23.5 48 L22 48 L22 34 L19 33 Z" />
        <line x1="24" y1="21" x2="24" y2="28" stroke="#16181f" strokeWidth="1.2" />
      </svg>
    );
  }
  if (type === 'moderate') {
    return (
      <svg viewBox="0 0 48 56" fill="currentColor" width="40" height="46">
        <circle cx="24" cy="7" r="5" opacity="0.9" />
        <path d="M16 15 L32 15 L30 33 L27 34 L27 48 L25 48 L25 36 L23 36 L23 48 L21 48 L21 34 L18 33 Z" />
      </svg>
    );
  }
  if (type === 'soft') {
    return (
      <svg viewBox="0 0 48 56" fill="currentColor" width="40" height="46">
        <circle cx="24" cy="7" r="5.2" opacity="0.9" />
        <path d="M15 15 L33 15 L32 34 L27 35 L27 48 L25 48 L25 36 L23 36 L23 48 L21 48 L21 35 L16 34 Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 56" fill="currentColor" width="40" height="46">
      <circle cx="24" cy="7" r="5.5" opacity="0.9" />
      <path d="M14 15 L34 15 L33.5 35 L28 36 L28 48 L25.5 48 L25.5 36 L22.5 36 L22.5 48 L20 48 L20 36 L14.5 35 Z" />
    </svg>
  );
}

export function MedicalIntakeModal({
  onSubmit,
  onClose,
  initialValues,
  isOpen = true
}) {
  const [form, setForm] = useState(initialValues || {
    age: 28,
    sex: 'male',
    height: 178,
    weight: 78,
    bodyFatPercentage: 16.5,
    trainingAge: 2,
    goals: ['hypertrophy'],
    orthopedicConditions: [],
    painTriggers: '',
    mobilityLimits: {
      shoulderFlexion: 180,
      shoulderAbduction: 180,
      kneeFlexion: 150,
      hipFlexion: 160,
      thoracicExtension: 40,
      lumbarFlexion: 40
    },
    demographics: {
      dominantHand: 'right',
      occupation: '',
      activityLevel: 'moderately_active'
    },
    profileImage: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showManualBf, setShowManualBf] = useState(false);
  const [selectedArchetypeId, setSelectedArchetypeId] = useState('m_15_18');
  const fileInputRef = useRef(null);

  const steps = [
    { id: 'basic', title: 'Biometria', icon: '👤' },
    { id: 'goals', title: 'Objetivos', icon: '🎯' },
    { id: 'medical', title: 'Ficha Médica', icon: '🏥' },
    { id: 'mobility', title: 'Mobilidade', icon: '🤸' },
    { id: 'lifestyle', title: 'Foto & Postura', icon: '📸' }
  ];

  const archetypes = form.sex === 'female' ? FEMALE_BF_ARCHETYPES : MALE_BF_ARCHETYPES;

  useEffect(() => {
    if (initialValues) {
      setForm(initialValues);
    }
  }, [initialValues]);

  const validateStep = (stepId) => {
    const newErrors = {};

    switch (stepId) {
      case 'basic':
        if (!form.age || form.age < 13 || form.age > 100) newErrors.age = 'Idade entre 13 e 100 anos';
        if (!form.height || form.height < 120 || form.height > 230) newErrors.height = 'Altura válida (120 - 230 cm)';
        if (!form.weight || form.weight < 35 || form.weight > 250) newErrors.weight = 'Peso válido (35 - 250 kg)';
        if (!form.bodyFatPercentage || form.bodyFatPercentage < 4 || form.bodyFatPercentage > 60) newErrors.bodyFatPercentage = '% gordura entre 4% e 60%';
        break;
      case 'goals':
        if (!form.goals || form.goals.length === 0) newErrors.goals = 'Selecione pelo menos um objetivo principal';
        break;
      case 'medical':
        break;
      case 'mobility':
        break;
      case 'lifestyle':
        if (!form.demographics.occupation?.trim()) newErrors.occupation = 'Informe sua ocupação ou rotina';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(steps[currentStep].id)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleGoal = (goalId) => {
    const current = form.goals || [];
    const next = current.includes(goalId)
      ? current.filter(g => g !== goalId)
      : [...current, goalId];
    setForm(prev => ({ ...prev, goals: next.length ? next : [goalId] }));
    if (errors.goals) setErrors(prev => ({ ...prev, goals: undefined }));
  };

  const toggleCondition = (cond) => {
    if (cond === 'none') {
      setForm(prev => ({ ...prev, orthopedicConditions: [] }));
      return;
    }
    const current = form.orthopedicConditions || [];
    const next = current.includes(cond)
      ? current.filter(c => c !== cond)
      : [...current, cond];
    setForm(prev => ({ ...prev, orthopedicConditions: next }));
  };

  const handleArchetypeSelect = (arch) => {
    setSelectedArchetypeId(arch.id);
    setForm(prev => ({ ...prev, bodyFatPercentage: arch.target }));
    if (errors.bodyFatPercentage) setErrors(prev => ({ ...prev, bodyFatPercentage: undefined }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setForm(prev => ({ ...prev, profileImage: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(steps[currentStep].id)) return;

    setIsSubmitting(true);
    try {
      const painTriggers = form.painTriggers
        ? form.painTriggers.split(',').map(t => t.trim()).filter(Boolean)
        : [];

      await onSubmit({
        ...form,
        painTriggers
      });
    } catch (err) {
      console.error('Erro ao enviar:', err);
      alert('Erro ao gerar plano. Verifique os campos e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;
  const step = steps[currentStep];

  return (
    <div className="medical-intake-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="medical-intake-modal" onClick={e => e.stopPropagation()}>
        {/* Header com Stepper */}
        <div className="intake-header">
          <div className="intake-header-top">
            <span className="intake-badge">🤖 AI Sports Coach • Avaliação Clínica</span>
            {onClose && (
              <button className="intake-close-btn" onClick={onClose} aria-label="Fechar">
                &times;
              </button>
            )}
          </div>

          <div className="intake-stepper">
            {steps.map((s, i) => (
              <div
                key={s.id}
                className={`intake-step-pill ${i === currentStep ? 'active' : i < currentStep ? 'completed' : ''}`}
                onClick={() => {
                  if (i < currentStep) setCurrentStep(i);
                }}
                style={{ cursor: i < currentStep ? 'pointer' : 'default' }}
              >
                <span>{i < currentStep ? '✓' : s.icon}</span>
                <span>{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Formulário / Conteúdo da Etapa */}
        <form onSubmit={handleSubmit} className="intake-body">
          {/* ETAPA 1: BIOMETRIA */}
          {step.id === 'basic' && (
            <div>
              <h2 className="step-heading">Dados Pessoais & Biometria</h2>
              <p className="step-subtitle">Insira suas medidas corporais básicas e selecione o biotipo visual que mais se parece com você.</p>

              <div className="form-grid-2">
                <div className="form-item">
                  <label className="form-label">Sexo Biológico</label>
                  <div className="segmented-control">
                    {[
                      { val: 'male', label: 'Masculino' },
                      { val: 'female', label: 'Feminino' },
                      { val: 'other', label: 'Outro' }
                    ].map(opt => (
                      <button
                        key={opt.val}
                        type="button"
                        className={`segmented-btn ${form.sex === opt.val ? 'active' : ''}`}
                        onClick={() => {
                          setForm(f => ({ ...f, sex: opt.val }));
                          setSelectedArchetypeId(opt.val === 'female' ? 'f_22_25' : 'm_15_18');
                          setForm(f => ({ ...f, bodyFatPercentage: opt.val === 'female' ? 23.5 : 16.5 }));
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-item">
                  <label className="form-label" htmlFor="age">Idade</label>
                  <div className="form-input-box">
                    <input
                      id="age"
                      type="number"
                      className="form-input"
                      value={form.age}
                      onChange={e => setForm(f => ({ ...f, age: +e.target.value }))}
                      min={13}
                      max={100}
                    />
                    <span className="form-input-unit">anos</span>
                  </div>
                  {errors.age && <span className="form-error">{errors.age}</span>}
                </div>

                <div className="form-item">
                  <label className="form-label" htmlFor="height">Altura</label>
                  <div className="form-input-box">
                    <input
                      id="height"
                      type="number"
                      className="form-input"
                      value={form.height}
                      onChange={e => setForm(f => ({ ...f, height: +e.target.value }))}
                      min={120}
                      max={230}
                    />
                    <span className="form-input-unit">cm</span>
                  </div>
                  {errors.height && <span className="form-error">{errors.height}</span>}
                </div>

                <div className="form-item">
                  <label className="form-label" htmlFor="weight">Peso Corporal</label>
                  <div className="form-input-box">
                    <input
                      id="weight"
                      type="number"
                      step="0.1"
                      className="form-input"
                      value={form.weight}
                      onChange={e => setForm(f => ({ ...f, weight: +e.target.value }))}
                      min={35}
                      max={250}
                    />
                    <span className="form-input-unit">kg</span>
                  </div>
                  {errors.weight && <span className="form-error">{errors.weight}</span>}
                </div>

                <div className="form-item">
                  <label className="form-label" htmlFor="trainingAge">Experiência de Musculação</label>
                  <div className="form-input-box">
                    <input
                      id="trainingAge"
                      type="number"
                      className="form-input"
                      value={form.trainingAge}
                      onChange={e => setForm(f => ({ ...f, trainingAge: +e.target.value }))}
                      min={0}
                      max={40}
                    />
                    <span className="form-input-unit">anos</span>
                  </div>
                  <span className="form-hint">0 = iniciante; 2+ = intermediário/avançado</span>
                </div>
              </div>

              {/* SELETOR VISUAL DE GORDURA CORPORAL (% BF) */}
              <div className="form-item full-span" style={{ marginTop: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <label className="form-label" style={{ margin: 0, fontSize: 14 }}>
                    Com qual físico você mais se parece atualmente?
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowManualBf(!showManualBf)}
                    style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}
                  >
                    {showManualBf ? '👁️ Voltar à seleção visual' : '✏️ Digitar % exato'}
                  </button>
                </div>

                {showManualBf ? (
                  <div style={{ marginTop: 8 }}>
                    <div className="form-input-box">
                      <input
                        id="bf"
                        type="number"
                        step="0.1"
                        className="form-input"
                        value={form.bodyFatPercentage}
                        onChange={e => {
                          const val = +e.target.value;
                          setForm(f => ({ ...f, bodyFatPercentage: val }));
                          setSelectedArchetypeId(null);
                        }}
                        min={4}
                        max={60}
                      />
                      <span className="form-input-unit">%</span>
                    </div>
                    <span className="form-hint">Inserção manual para quem possui bioimpedância InBody ou DEXA Scan.</span>
                  </div>
                ) : (
                  <>
                    <div className="bf-archetype-grid">
                      {archetypes.map(arch => {
                        const isSelected = selectedArchetypeId === arch.id || (!selectedArchetypeId && form.bodyFatPercentage === arch.target);
                        return (
                          <div
                            key={arch.id}
                            className={`bf-archetype-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleArchetypeSelect(arch)}
                          >
                            <div className="bf-silhouette-icon">
                              <SilhouetteIcon type={arch.iconType} />
                            </div>
                            <span className="bf-range-badge">{arch.range}</span>
                            <span className="bf-archetype-title">{arch.label}</span>
                            <span className="bf-archetype-desc">{arch.desc}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="bf-custom-toggle-bar">
                      <span style={{ fontSize: 12, color: '#9ca3af' }}>
                        Percentual selecionado: <strong style={{ color: '#3b82f6' }}>{form.bodyFatPercentage}%</strong>
                      </span>
                      <span style={{ fontSize: 11, color: '#6b7280' }}>
                        A foto completa será enviada na Etapa 5 para análise postural por IA.
                      </span>
                    </div>
                  </>
                )}
                {errors.bodyFatPercentage && <span className="form-error">{errors.bodyFatPercentage}</span>}
              </div>
            </div>
          )}

          {/* ETAPA 2: OBJETIVOS */}
          {step.id === 'goals' && (
            <div>
              <h2 className="step-heading">Objetivo Principal</h2>
              <p className="step-subtitle">Selecione a meta para calibrarmos a periodização de treino e as calorias da dieta.</p>

              <div className="goals-select-grid">
                {GOALS.map(g => {
                  const isSelected = form.goals.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      type="button"
                      className={`goal-card-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleGoal(g.id)}
                    >
                      <span className="goal-card-icon">{g.icon}</span>
                      <span className="goal-card-title">{g.title}</span>
                      <span className="goal-card-desc">{g.desc}</span>
                    </button>
                  );
                })}
              </div>
              {errors.goals && <p className="form-error" style={{ marginTop: 12 }}>{errors.goals}</p>}
            </div>
          )}

          {/* ETAPA 3: HISTÓRICO MÉDICO */}
          {step.id === 'medical' && (
            <div>
              <h2 className="step-heading">Ficha Médica & Articulações</h2>
              <p className="step-subtitle">Marque condições diagnosticadas. O motor biomecânico filtrará exercícios com compressão perigosa.</p>

              <div className="conditions-cloud">
                <button
                  type="button"
                  className={`condition-chip none-chip ${form.orthopedicConditions.length === 0 ? 'selected' : ''}`}
                  onClick={() => toggleCondition('none')}
                >
                  ✓ Nenhuma condição diagnosticada
                </button>

                {ALL_ORTHOPEDIC_CONDITIONS.filter(c => c !== 'none').map(cond => {
                  const isSelected = form.orthopedicConditions.includes(cond);
                  return (
                    <button
                      key={cond}
                      type="button"
                      className={`condition-chip ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleCondition(cond)}
                    >
                      {isSelected ? '✕ ' : '+ '}
                      {CONDITION_LABELS[cond] || cond}
                    </button>
                  );
                })}
              </div>

              <div className="form-item" style={{ marginTop: 16 }}>
                <label className="form-label" htmlFor="painTriggers">Gatilhos de Dor ou Desconforto (opcional)</label>
                <textarea
                  id="painTriggers"
                  className="form-input"
                  style={{ minHeight: 70, resize: 'vertical' }}
                  placeholder="Ex: agachamento profundo, supino com barra reta, desenvolvimento militar..."
                  value={form.painTriggers}
                  onChange={e => setForm(f => ({ ...f, painTriggers: e.target.value }))}
                />
                <span className="form-hint">Exercícios que causam pontadas ou dor articular (separados por vírgula).</span>
              </div>
            </div>
          )}

          {/* ETAPA 4: TESTE DE MOBILIDADE */}
          {step.id === 'mobility' && (
            <div>
              <h2 className="step-heading">Amplitude & Mobilidade Articular</h2>
              <p className="step-subtitle">Ajuste os controles com base no seu alcance. O algoritmo evitará movimentos além do seu limiar seguro.</p>

              {[
                { key: 'shoulderFlexion', label: 'Flexão de Ombro (elevação dos braços à frente)', max: 180, normal: 180 },
                { key: 'shoulderAbduction', label: 'Abdução de Ombro (abertura lateral dos braços)', max: 180, normal: 180 },
                { key: 'kneeFlexion', label: 'Flexão de Joelho (dobra da perna para trás)', max: 160, normal: 150 },
                { key: 'hipFlexion', label: 'Flexão de Quadril (joelho em direção ao peito)', max: 160, normal: 150 },
                { key: 'thoracicExtension', label: 'Extensão Torácica (abertura do peito para trás)', max: 60, normal: 40 },
                { key: 'lumbarFlexion', label: 'Flexão Lombar (inclinação à frente tocando os pés)', max: 60, normal: 40 }
              ].map(m => {
                const val = form.mobilityLimits[m.key] ?? m.normal;
                const isLimited = val < m.normal * 0.85;
                return (
                  <div key={m.key} className="mobility-slider-card">
                    <div className="mobility-slider-header">
                      <span className="mobility-title">{m.label}</span>
                      <span
                        className="mobility-val-badge"
                        style={isLimited ? { background: 'rgba(239,68,68,0.15)', color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' } : undefined}
                      >
                        {val}° {isLimited ? '(Restrito)' : '(Normal)'}
                      </span>
                    </div>
                    <input
                      type="range"
                      className="mobility-slider"
                      min={0}
                      max={m.max}
                      value={val}
                      onChange={e => {
                        const num = +e.target.value;
                        setForm(f => ({
                          ...f,
                          mobilityLimits: { ...f.mobilityLimits, [m.key]: num }
                        }));
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* ETAPA 5: ESTILO DE VIDA & UPLOAD DE FOTO POSTURAL */}
          {step.id === 'lifestyle' && (
            <div>
              <h2 className="step-heading">Foto Corporal para Análise Postural & Rotina</h2>
              <p className="step-subtitle">Suba sua foto corporal completa para a IA detectar desvios posturais (cifose, ombros, lordose) e músculos atrasados.</p>

              <div className="form-item" style={{ marginBottom: 16 }}>
                <label className="form-label">Foto do Físico (Frontal ou Tronco Inteiro)</label>
                <div
                  className="photo-upload-zone"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handlePhotoUpload}
                  />

                  {form.profileImage ? (
                    <div className="photo-preview-wrap">
                      <img src={form.profileImage} alt="Foto de perfil" className="photo-preview-img" />
                      <button
                        type="button"
                        className="btn-intake-back"
                        style={{ padding: '6px 14px', fontSize: 12 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                      >
                        🔄 Trocar Foto
                      </button>
                      <span className="form-hint" style={{ color: '#34d399', fontWeight: 600 }}>
                        ✓ Foto carregada para o scanner postural da IA
                      </span>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: 36, marginBottom: 8 }}>📸</div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#f3f4f6' }}>Clique para enviar sua foto</div>
                      <div className="form-hint" style={{ marginTop: 4 }}>
                        Foto de corpo inteiro em pé, relaxado. A IA analisará cabeça anterior, cifose, simetria escapular e desequilíbrios musculares.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-item">
                  <label className="form-label" htmlFor="occupation">Ocupação / Trabalho</label>
                  <input
                    id="occupation"
                    type="text"
                    className="form-input"
                    placeholder="Ex: Trabalho em escritório sentado, estudante..."
                    value={form.demographics.occupation}
                    onChange={e => setForm(f => ({
                      ...f,
                      demographics: { ...f.demographics, occupation: e.target.value }
                    }))}
                  />
                  {errors.occupation && <span className="form-error">{errors.occupation}</span>}
                </div>

                <div className="form-item">
                  <label className="form-label">Mão Dominante</label>
                  <div className="segmented-control">
                    {[
                      { val: 'right', label: 'Destro' },
                      { val: 'left', label: 'Canhoto' }
                    ].map(opt => (
                      <button
                        key={opt.val}
                        type="button"
                        className={`segmented-btn ${form.demographics.dominantHand === opt.val ? 'active' : ''}`}
                        onClick={() => setForm(f => ({
                          ...f,
                          demographics: { ...f.demographics, dominantHand: opt.val }
                        }))}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-item full-span">
                  <label className="form-label">Nível de Atividade Geral no Dia a Dia</label>
                  <div className="segmented-control" style={{ flexDirection: 'column' }}>
                    {ACTIVITY_LEVELS.map(act => {
                      const isSel = form.demographics.activityLevel === act.value;
                      return (
                        <button
                          key={act.value}
                          type="button"
                          className={`segmented-btn ${isSel ? 'active' : ''}`}
                          style={{ textAlign: 'left', padding: '10px 14px' }}
                          onClick={() => setForm(f => ({
                            ...f,
                            demographics: { ...f.demographics, activityLevel: act.value }
                          }))}
                        >
                          <div style={{ fontWeight: 700, color: isSel ? '#ffffff' : '#e5e7eb' }}>{act.label}</div>
                          <div style={{ fontSize: 12, opacity: 0.8, fontWeight: 400 }}>{act.detail}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer com Botões de Navegação */}
          <div className="intake-footer">
            {currentStep > 0 && (
              <button type="button" className="btn-intake-back" onClick={handleBack} disabled={isSubmitting}>
                &larr; Voltar
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button type="button" className="btn-intake-next" onClick={handleNext} disabled={isSubmitting}>
                Avançar &rarr;
              </button>
            ) : (
              <button type="submit" className="btn-intake-next" disabled={isSubmitting}>
                {isSubmitting ? 'Gerando Plano Personalizado...' : '✨ Gerar Plano Completo'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default MedicalIntakeModal;
