// src/frontend/src/components/onboarding/MedicalIntakeModal.jsx
// Questionário & Avaliação AI Sports Coach
// Design 100% integrado ao openGym: controles táteis ergonômicos para celular,
// esteiras numéricas com botões de incremento (sem sofrer digitando no teclado),
// seleção modular de refeições e rotina, e proteção ortopédica biomecânica.

import React, { useState } from 'react';
import { OrthopedicCondition } from '../../lib/types/biomechanics.js';
import { Button } from '../ui.jsx';

const GOALS = [
  {
    id: 'hypertrophy',
    emoji: '🥩',
    title: 'Hipertrofia Muscular',
    tag: 'Superávit Calórico',
    desc: 'Ganho máximo de massa magra com superávit nutricional limpo e volume MAV progressivo.',
    color: '#3b82f6'
  },
  {
    id: 'recomp',
    emoji: '⚖️',
    title: 'Recomposição Corporal',
    tag: 'Calorias de Manutenção',
    desc: 'Construir massa muscular e reduzir o percentual de gordura ao mesmo tempo.',
    color: '#10b981'
  },
  {
    id: 'fat_loss',
    emoji: '🔥',
    title: 'Definição / Cutting',
    tag: 'Déficit Calórico',
    desc: 'Queima de gordura preservando força e massa muscular com alta densidade proteica.',
    color: '#f97316'
  },
  {
    id: 'strength',
    emoji: '⚡',
    title: 'Força Máxima & Potência',
    tag: 'Adaptação Neural',
    desc: 'Foco em progressão de sobrecarga dupla em levantamentos compostos pesados (RIR 1-2).',
    color: '#8b5cf6'
  }
];

const COMMON_CONDITIONS = [
  {
    id: OrthopedicCondition.SHOULDER_IMPINGEMENT,
    emoji: '🛡️',
    label: 'Ombro / Impacto do Manguito',
    desc: 'Substitui desenvolvimentos atrás da nuca e abduções extremas por pegadas neutras no plano escapular.'
  },
  {
    id: OrthopedicCondition.KNEE_CHONDROMALACIA,
    emoji: '🦵',
    label: 'Joelho / Condromalácia Patelar',
    desc: 'Evita atrito fêmoro-patelar agudo no fundo da flexão, priorizando cadeia cinética fechada e isquiotibiais.'
  },
  {
    id: OrthopedicCondition.LORDOSIS,
    emoji: '🦴',
    label: 'Coluna Lombar / Desconforto',
    desc: 'Reduz sobrecarga axial direta na coluna, substituindo remadas livres por variações com apoio no peito.'
  },
  {
    id: OrthopedicCondition.PATELLAR_TENDINITIS,
    emoji: '⚡',
    label: 'Tendinite Patelar / Quadríceps',
    desc: 'Controle de aceleração excêntrica e foco em ativação isométrica e flexores de joelho.'
  },
  {
    id: OrthopedicCondition.SCOLIOSIS,
    emoji: '📐',
    label: 'Escoliose / Assimetria Postural',
    desc: 'Aumenta exercícios unilaterais com halteres para corrigir discrepâncias de força e volume entre lados.'
  }
];

const DAYS_SHORT = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export function MedicalIntakeModal({ onSubmit, onClose, initialValues, isOpen = true }) {
  const [form, setForm] = useState(initialValues || {
    age: 26,
    sex: 'male',
    height: 178,
    weight: 78,
    bodyFatPercentage: 15,
    trainingAge: 2,
    goals: ['hypertrophy'],
    weeklyFrequency: 4,
    preferredDays: [0, 1, 3, 4], // Seg, Ter, Qui, Sex
    mealsPerDay: 4,
    firstMealTime: '08:00',
    activityLevel: 'moderately_active',
    dietPreference: 'flexible',
    orthopedicConditions: [],
    painTriggers: []
  });

  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 'biometrics', title: 'Biometria', subtitle: 'Seu perfil corporal e experiência' },
    { id: 'goals', title: 'Objetivo', subtitle: 'Diretriz de calorias e treino' },
    { id: 'routine', title: 'Rotina & Dieta', subtitle: 'Dias de treino e horários de refeição' },
    { id: 'medical', title: 'Segurança', subtitle: 'Saúde articular e prevenção de dor' }
  ];

  if (!isOpen) return null;

  // Helpers para ajuste numérico rápido sem depender do teclado móvel
  const adjustValue = (field, delta, min, max) => {
    setForm(prev => {
      const current = Number(prev[field]) || 0;
      const next = Math.max(min, Math.min(max, Math.round((current + delta) * 10) / 10));
      return { ...prev, [field]: next };
    });
  };

  const toggleDay = (dayIndex) => {
    setForm(prev => {
      const days = prev.preferredDays || [];
      const next = days.includes(dayIndex)
        ? days.filter(d => d !== dayIndex)
        : [...days, dayIndex].sort((a, b) => a - b);
      return {
        ...prev,
        preferredDays: next,
        weeklyFrequency: next.length || 3
      };
    });
  };

  const toggleCondition = (condId) => {
    if (condId === 'none') {
      setForm(prev => ({ ...prev, orthopedicConditions: [] }));
      return;
    }
    setForm(prev => {
      const current = prev.orthopedicConditions || [];
      const next = current.includes(condId)
        ? current.filter(c => c !== condId)
        : [...current, condId];
      return { ...prev, orthopedicConditions: next };
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onSubmit(form);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div style={{
      maxWidth: '560px',
      margin: '0 auto',
      padding: '8px 16px 120px',
      color: 'var(--label, #fff)'
    }}>
      {/* Top Bar with Step Dots and Close */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 0 16px',
        borderBottom: '1px solid var(--sep-op, rgba(255,255,255,0.08))',
        marginBottom: '18px'
      }}>
        <div>
          <span style={{
            fontSize: '11.5px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--acc, #3b82f6)'
          }}>
            Passo {currentStep + 1} de {steps.length} · {steps[currentStep].title}
          </span>
          <h2 style={{ margin: '2px 0 0', fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em' }}>
            {steps[currentStep].subtitle}
          </h2>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'var(--surface, #1e1e24)',
              border: '1px solid var(--sep-op, rgba(255,255,255,0.1))',
              color: 'var(--label-2, #aaa)',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Progress Dots */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '22px' }}>
        {steps.map((s, idx) => (
          <div
            key={s.id}
            onClick={() => setCurrentStep(idx)}
            style={{
              flex: 1,
              height: '5px',
              borderRadius: '99px',
              backgroundColor: idx === currentStep
                ? 'var(--acc, #3b82f6)'
                : idx < currentStep
                  ? 'rgba(59, 130, 246, 0.4)'
                  : 'var(--surface-2, rgba(255,255,255,0.08))',
              transition: 'all 0.25s ease',
              cursor: 'pointer'
            }}
          />
        ))}
      </div>

      {/* ================= STEP 1: BIOMETRICS ================= */}
      {currentStep === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Sex Selection */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--label-2, #aaa)', display: 'block', marginBottom: '8px' }}>
              Sexo Biológico (Fórmula Metabólica Cunningham/Harris-Benedict)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, sex: 'male' }))}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  border: form.sex === 'male' ? '2px solid var(--acc, #3b82f6)' : '1px solid var(--sep-op, rgba(255,255,255,0.1))',
                  background: form.sex === 'male' ? 'rgba(59, 130, 246, 0.14)' : 'var(--surface, #1e1e24)',
                  color: form.sex === 'male' ? '#93c5fd' : 'var(--label)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <span>👨 Masculino</span>
              </button>
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, sex: 'female' }))}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  border: form.sex === 'female' ? '2px solid var(--acc, #3b82f6)' : '1px solid var(--sep-op, rgba(255,255,255,0.1))',
                  background: form.sex === 'female' ? 'rgba(59, 130, 246, 0.14)' : 'var(--surface, #1e1e24)',
                  color: form.sex === 'female' ? '#93c5fd' : 'var(--label)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <span>👩 Feminino</span>
              </button>
            </div>
          </div>

          {/* Weight Card with Tactile Stepper */}
          <div style={{
            background: 'var(--surface, #1e1e24)',
            borderRadius: '14px',
            padding: '16px',
            border: '1px solid var(--sep-op, rgba(255,255,255,0.08))'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--label-2, #aaa)' }}>
                ⚖️ Peso Corporal Atual
              </span>
              <span style={{ fontSize: '11px', color: 'var(--acc, #3b82f6)', fontWeight: 600 }}>
                Define Proteínas Diárias
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => adjustValue('weight', -1, 35, 220)}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'var(--surface-2, rgba(255,255,255,0.06))',
                    border: '1px solid var(--sep-op, rgba(255,255,255,0.1))',
                    color: 'var(--label)',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => adjustValue('weight', -5, 35, 220)}
                  style={{
                    padding: '0 8px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'var(--surface-2, rgba(255,255,255,0.06))',
                    border: '1px solid var(--sep-op, rgba(255,255,255,0.1))',
                    color: 'var(--label-2)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  -5
                </button>
              </div>

              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--label)' }}>
                  {form.weight} <span style={{ fontSize: '15px', color: 'var(--label-2)' }}>kg</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => adjustValue('weight', +1, 35, 220)}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'var(--surface-2, rgba(255,255,255,0.06))',
                    border: '1px solid var(--sep-op, rgba(255,255,255,0.1))',
                    color: 'var(--label)',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => adjustValue('weight', +5, 35, 220)}
                  style={{
                    padding: '0 8px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'var(--surface-2, rgba(255,255,255,0.06))',
                    border: '1px solid var(--sep-op, rgba(255,255,255,0.1))',
                    color: 'var(--label-2)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  +5
                </button>
              </div>
            </div>
          </div>

          {/* Height and Age Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* Height */}
            <div style={{
              background: 'var(--surface, #1e1e24)',
              borderRadius: '14px',
              padding: '14px',
              border: '1px solid var(--sep-op, rgba(255,255,255,0.08))'
            }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--label-2, #aaa)', display: 'block', marginBottom: '6px' }}>
                📏 Altura (cm)
              </span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={() => adjustValue('height', -1, 120, 230)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'var(--surface-2)',
                    border: 'none',
                    color: '#fff',
                    fontSize: '18px',
                    cursor: 'pointer'
                  }}
                >
                  -
                </button>
                <span style={{ fontSize: '20px', fontWeight: 800 }}>{form.height} cm</span>
                <button
                  type="button"
                  onClick={() => adjustValue('height', +1, 120, 230)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'var(--surface-2)',
                    border: 'none',
                    color: '#fff',
                    fontSize: '18px',
                    cursor: 'pointer'
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Age */}
            <div style={{
              background: 'var(--surface, #1e1e24)',
              borderRadius: '14px',
              padding: '14px',
              border: '1px solid var(--sep-op, rgba(255,255,255,0.08))'
            }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--label-2, #aaa)', display: 'block', marginBottom: '6px' }}>
                🎂 Idade (anos)
              </span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={() => adjustValue('age', -1, 14, 99)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'var(--surface-2)',
                    border: 'none',
                    color: '#fff',
                    fontSize: '18px',
                    cursor: 'pointer'
                  }}
                >
                  -
                </button>
                <span style={{ fontSize: '20px', fontWeight: 800 }}>{form.age} anos</span>
                <button
                  type="button"
                  onClick={() => adjustValue('age', +1, 14, 99)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'var(--surface-2)',
                    border: 'none',
                    color: '#fff',
                    fontSize: '18px',
                    cursor: 'pointer'
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Body Fat % Stepper */}
          <div style={{
            background: 'var(--surface, #1e1e24)',
            borderRadius: '14px',
            padding: '14px',
            border: '1px solid var(--sep-op, rgba(255,255,255,0.08))'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--label-2, #aaa)' }}>
                🩸 % de Gordura Estimado (BF)
              </span>
              <span style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '6px',
                background: form.bodyFatPercentage <= 14 ? 'rgba(16,185,129,0.15)' : form.bodyFatPercentage <= 20 ? 'rgba(59,130,246,0.15)' : 'rgba(249,115,22,0.15)',
                color: form.bodyFatPercentage <= 14 ? '#6ee7b7' : form.bodyFatPercentage <= 20 ? '#93c5fd' : '#fdba74',
                fontWeight: 600
              }}>
                {form.bodyFatPercentage <= 12 ? 'Atlético / Baixo' : form.bodyFatPercentage <= 18 ? 'Fitness / Saudável' : 'Moderado / Alto'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
              <button
                type="button"
                onClick={() => adjustValue('bodyFatPercentage', -1, 5, 50)}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  background: 'var(--surface-2)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '18px',
                  cursor: 'pointer'
                }}
              >
                -
              </button>
              <span style={{ fontSize: '22px', fontWeight: 800 }}>{form.bodyFatPercentage}%</span>
              <button
                type="button"
                onClick={() => adjustValue('bodyFatPercentage', +1, 5, 50)}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  background: 'var(--surface-2)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '18px',
                  cursor: 'pointer'
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Training Experience */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--label-2, #aaa)', display: 'block', marginBottom: '8px' }}>
              Tempo Praticando Musculação
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {[
                { val: 0.5, lbl: 'Iniciante', sub: '< 1 ano' },
                { val: 2, lbl: 'Intermediário', sub: '1 - 3 anos' },
                { val: 5, lbl: 'Avançado', sub: '3+ anos' }
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, trainingAge: opt.val }))}
                  style={{
                    padding: '10px 8px',
                    borderRadius: '10px',
                    border: form.trainingAge === opt.val ? '2px solid var(--acc, #3b82f6)' : '1px solid var(--sep-op, rgba(255,255,255,0.08))',
                    background: form.trainingAge === opt.val ? 'rgba(59, 130, 246, 0.15)' : 'var(--surface, #1e1e24)',
                    color: form.trainingAge === opt.val ? '#93c5fd' : 'var(--label)',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>{opt.lbl}</div>
                  <div style={{ fontSize: '11px', opacity: 0.7 }}>{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 2: GOALS ================= */}
      {currentStep === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {GOALS.map(g => {
            const isSelected = form.goals.includes(g.id);
            return (
              <div
                key={g.id}
                onClick={() => setForm(f => ({ ...f, goals: [g.id] }))}
                style={{
                  padding: '16px',
                  borderRadius: '14px',
                  border: isSelected ? `2px solid ${g.color}` : '1px solid var(--sep-op, rgba(255,255,255,0.08))',
                  background: isSelected ? 'rgba(255,255,255,0.04)' : 'var(--surface, #1e1e24)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '22px' }}>{g.emoji}</span>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: isSelected ? g.color : 'var(--label)' }}>
                      {g.title}
                    </h3>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: isSelected ? g.color : 'rgba(255,255,255,0.08)',
                    color: isSelected ? '#fff' : 'var(--label-2)'
                  }}>
                    {g.tag}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--label-2, #aaa)', lineHeight: '1.4' }}>
                  {g.desc}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= STEP 3: ROUTINE & MODULAR DIET ================= */}
      {currentStep === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Days of the Week Selector */}
          <div style={{
            background: 'var(--surface, #1e1e24)',
            borderRadius: '14px',
            padding: '16px',
            border: '1px solid var(--sep-op, rgba(255,255,255,0.08))'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700 }}>
                📅 Dias que você vai treinar ({form.preferredDays.length} dias/semana)
              </span>
              <span style={{ fontSize: '11px', color: 'var(--acc, #3b82f6)', fontWeight: 600 }}>
                Toque para marcar
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
              {DAYS_SHORT.map((dayName, idx) => {
                const active = (form.preferredDays || []).includes(idx);
                return (
                  <button
                    key={dayName}
                    type="button"
                    onClick={() => toggleDay(idx)}
                    style={{
                      aspectRatio: '1',
                      borderRadius: '10px',
                      border: active ? '2px solid var(--acc, #3b82f6)' : '1px solid var(--sep-op, rgba(255,255,255,0.08))',
                      background: active ? 'var(--acc, #3b82f6)' : 'var(--surface-2, rgba(255,255,255,0.05))',
                      color: active ? '#fff' : 'var(--label-2)',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '2px'
                    }}
                  >
                    <span>{dayName}</span>
                    {active && <span style={{ fontSize: '8px' }}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Meals Per Day Selection */}
          <div style={{
            background: 'var(--surface, #1e1e24)',
            borderRadius: '14px',
            padding: '16px',
            border: '1px solid var(--sep-op, rgba(255,255,255,0.08))'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700 }}>
                🍽️ Quantas refeições você quer fazer no dia?
              </span>
              <span style={{ fontSize: '12px', color: 'var(--acc, #3b82f6)', fontWeight: 700 }}>
                {form.mealsPerDay} refeições
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {[3, 4, 5, 6].map(count => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, mealsPerDay: count }))}
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    border: form.mealsPerDay === count ? '2px solid var(--acc, #3b82f6)' : '1px solid var(--sep-op, rgba(255,255,255,0.08))',
                    background: form.mealsPerDay === count ? 'rgba(59, 130, 246, 0.15)' : 'var(--surface-2)',
                    color: form.mealsPerDay === count ? '#93c5fd' : 'var(--label)',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  {count} refeições
                </button>
              ))}
            </div>
          </div>

          {/* First Meal Time & Daily Schedule */}
          <div style={{
            background: 'var(--surface, #1e1e24)',
            borderRadius: '14px',
            padding: '16px',
            border: '1px solid var(--sep-op, rgba(255,255,255,0.08))'
          }}>
            <span style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              ⏰ Horário aproximado da primeira refeição (Café da Manhã)
            </span>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {['06:30', '07:30', '08:30', '09:30', '11:00', '12:00'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, firstMealTime: t }))}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: form.firstMealTime === t ? '1.5px solid var(--acc, #3b82f6)' : '1px solid var(--sep-op, rgba(255,255,255,0.08))',
                    background: form.firstMealTime === t ? 'rgba(59, 130, 246, 0.2)' : 'var(--surface-2)',
                    color: form.firstMealTime === t ? '#93c5fd' : 'var(--label-2)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Level */}
          <div style={{
            background: 'var(--surface, #1e1e24)',
            borderRadius: '14px',
            padding: '16px',
            border: '1px solid var(--sep-op, rgba(255,255,255,0.08))'
          }}>
            <span style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
              🏃 Rotina e Gasto Diário (NEAT)
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {[
                { val: 'sedentary', lbl: 'Sedentário', sub: 'Escritório/Home' },
                { val: 'moderately_active', lbl: 'Moderado', sub: 'Caminha/Ativo' },
                { val: 'very_active', lbl: 'Muito Ativo', sub: 'Trabalho braçal' }
              ].map(act => (
                <button
                  key={act.val}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, activityLevel: act.val }))}
                  style={{
                    padding: '10px 6px',
                    borderRadius: '10px',
                    border: form.activityLevel === act.val ? '2px solid var(--acc, #3b82f6)' : '1px solid var(--sep-op, rgba(255,255,255,0.08))',
                    background: form.activityLevel === act.val ? 'rgba(59, 130, 246, 0.15)' : 'var(--surface-2)',
                    color: form.activityLevel === act.val ? '#93c5fd' : 'var(--label)',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 700 }}>{act.lbl}</div>
                  <div style={{ fontSize: '10px', opacity: 0.7 }}>{act.sub}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 4: ORTHOPEDIC SAFETY ================= */}
      {currentStep === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Healthy Card */}
          <div
            onClick={() => toggleCondition('none')}
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              border: form.orthopedicConditions.length === 0 ? '2px solid #10b981' : '1px solid var(--sep-op, rgba(255,255,255,0.08))',
              background: form.orthopedicConditions.length === 0 ? 'rgba(16, 185, 129, 0.12)' : 'var(--surface, #1e1e24)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '22px' }}>🟢</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: form.orthopedicConditions.length === 0 ? '#6ee7b7' : 'var(--label)' }}>
                  Nenhuma dor ou lesão ativa
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--label-2)' }}>
                  Articulações livres para todos os exercícios convencionais
                </div>
              </div>
            </div>
            {form.orthopedicConditions.length === 0 && (
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span>
            )}
          </div>

          <div style={{ fontSize: '12px', color: 'var(--label-3)', margin: '4px 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Ou marque se possui dores/desconfortos para filtrarmos:
          </div>

          {COMMON_CONDITIONS.map(c => {
            const isSelected = form.orthopedicConditions.includes(c.id);
            return (
              <div
                key={c.id}
                onClick={() => toggleCondition(c.id)}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  border: isSelected ? '2px solid #f97316' : '1px solid var(--sep-op, rgba(255,255,255,0.08))',
                  background: isSelected ? 'rgba(249, 115, 22, 0.1)' : 'var(--surface, #1e1e24)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{c.emoji}</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: isSelected ? '#fdba74' : 'var(--label)' }}>
                      {c.label}
                    </span>
                  </div>
                  {isSelected && <span style={{ color: '#f97316', fontWeight: 'bold' }}>✓ Ativo</span>}
                </div>
                <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--label-2)', lineHeight: '1.4' }}>
                  {c.desc}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= STICKY FOOTER ACTIONS ================= */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '12px 16px calc(14px + var(--sab, 0px))',
        background: 'linear-gradient(to top, var(--bg, #121216) 82%, transparent)',
        display: 'flex',
        gap: '10px',
        maxWidth: '560px',
        margin: '0 auto',
        zIndex: 50
      }}>
        {currentStep > 0 && (
          <Button
            variant="secondary"
            onClick={handleBack}
            style={{
              flex: 1,
              padding: '14px',
              fontSize: '15px',
              fontWeight: 600,
              borderRadius: '12px'
            }}
          >
            ← Voltar
          </Button>
        )}
        <Button
          variant="primary"
          onClick={handleNext}
          style={{
            flex: 2,
            padding: '14px',
            fontSize: '15px',
            fontWeight: 700,
            borderRadius: '12px',
            background: 'var(--acc, #3b82f6)',
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)'
          }}
        >
          {currentStep === steps.length - 1 ? '⚡ Gerar Meu Treino & Dieta' : 'Próximo →'}
        </Button>
      </div>
    </div>
  );
}

export default MedicalIntakeModal;
