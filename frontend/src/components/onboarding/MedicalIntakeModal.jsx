// src/frontend/src/components/onboarding/MedicalIntakeModal.jsx
// Formulario de Avaliacao do AI Coach 100% nativo openGym:
// Usa Section, Row, Segmented, Button e campos de entrada nativos sem quebras de layout.

import React, { useState } from 'react';
import { OrthopedicCondition } from '../../lib/types/biomechanics.js';
import { Section, Row, Segmented, Button } from '../ui.jsx';

const GOALS = [
  { id: 'hypertrophy', icon: 'flame', color: 'var(--orange)', title: 'Hipertrofia Muscular', desc: 'Ganho máximo de massa magra com superávit limpo' },
  { id: 'recomp', icon: 'scale', color: 'var(--blue)', title: 'Recomposição Corporal', desc: 'Construir músculos e reduzir gordura simultaneamente' },
  { id: 'fat_loss', icon: 'flame', color: 'var(--red)', title: 'Definição / Cutting', desc: 'Déficit calórico controlado preservando força' },
  { id: 'strength', icon: 'sparkles', color: 'var(--purple)', title: 'Força Máxima', desc: 'Adaptação neuromuscular e progressão de cargas' }
];

const COMMON_CONDITIONS = [
  { id: OrthopedicCondition.SCOLIOSIS, label: 'Escoliose / Desvio na Coluna', desc: 'Evita cargas axiais assimétricas' },
  { id: OrthopedicCondition.LORDOSIS, label: 'Hiperlordose Lombar', desc: 'Fortalece glúteos e estabilizadores de core' },
  { id: OrthopedicCondition.KNEE_CHONDROMALACIA, label: 'Condromalácia Patelar', desc: 'Elimina atrito fêmoro-patelar profundo' },
  { id: OrthopedicCondition.PATELLAR_TENDINITIS, label: 'Tendinite Patelar', desc: 'Preserva joelho com foco em cadeia posterior' },
  { id: OrthopedicCondition.SHOULDER_IMPINGEMENT, label: 'Impacto no Ombro / Manguito', desc: 'Substitui abduções perigosas por pegadas neutras' }
];

export function MedicalIntakeModal({ onSubmit, onClose, initialValues, isOpen = true }) {
  const [form, setForm] = useState(initialValues || {
    age: 28,
    sex: 'male',
    height: 178,
    weight: 78,
    bodyFatPercentage: 16,
    trainingAge: 2,
    goals: ['hypertrophy'],
    orthopedicConditions: [],
    painTriggers: '',
    demographics: {
      occupation: 'Rotina de escritório / Ativa',
      activityLevel: 'moderately_active'
    }
  });

  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    { id: 'biometrics', title: '1. Biometria & Perfil' },
    { id: 'goals', title: '2. Objetivo de Treino' },
    { id: 'medical', title: '3. Saúde Articular' }
  ];

  if (!isOpen) return null;

  const toggleGoal = (goalId) => {
    setForm(prev => ({ ...prev, goals: [goalId] }));
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

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onSubmit(form);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="narrow" style={{ padding: '12px 0 80px', animation: 'fadeIn 0.15s ease-out' }}>
      {/* Header compact */}
      <div className="hdr" style={{ marginBottom: 14 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 2px' }}>Avaliação AI Coach</h1>
          <div className="sub" style={{ fontSize: 13, color: 'var(--label-2)' }}>
            Etapa {currentStep + 1} de {steps.length} — {steps[currentStep].title}
          </div>
        </div>
        {onClose && (
          <button className="iconbtn" onClick={onClose} aria-label="Fechar">
            ×
          </button>
        )}
      </div>

      {/* Progress pill indicator */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {steps.map((s, idx) => (
          <div
            key={s.id}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background: idx <= currentStep ? 'var(--acc)' : 'var(--surface-3)',
              transition: 'background 0.2s'
            }}
          />
        ))}
      </div>

      {/* STEP 1: Biometrics */}
      {currentStep === 0 && (
        <Section title="Dados Corporais" footer="Esses valores calibram sua Taxa Metabólica Basal e o volume semanal de treino.">
          <Row icon="person" iconTint="var(--blue)" title="Sexo Biológico">
            <Segmented
              className="seg-inline"
              options={[
                { value: 'male', label: 'Masculino' },
                { value: 'female', label: 'Feminino' }
              ]}
              value={form.sex}
              onChange={val => setForm(f => ({ ...f, sex: val }))}
            />
          </Row>

          <Row icon="calendar" iconTint="var(--orange)" title="Idade (anos)">
            <input
              type="number"
              inputMode="numeric"
              className="input"
              style={{ width: '84px', textAlign: 'end', fontWeight: 600, fontSize: 16, padding: '6px 10px' }}
              value={form.age || ''}
              onChange={e => setForm(f => ({ ...f, age: Number(e.target.value) || 0 }))}
            />
          </Row>

          <Row icon="scale" iconTint="var(--acc)" title="Peso Corporal (kg)">
            <input
              type="number"
              inputMode="decimal"
              className="input"
              style={{ width: '84px', textAlign: 'end', fontWeight: 600, fontSize: 16, padding: '6px 10px' }}
              value={form.weight || ''}
              onChange={e => setForm(f => ({ ...f, weight: Number(e.target.value) || 0 }))}
            />
          </Row>

          <Row icon="ruler" iconTint="var(--teal)" title="Altura (cm)">
            <input
              type="number"
              inputMode="numeric"
              className="input"
              style={{ width: '84px', textAlign: 'end', fontWeight: 600, fontSize: 16, padding: '6px 10px' }}
              value={form.height || ''}
              onChange={e => setForm(f => ({ ...f, height: Number(e.target.value) || 0 }))}
            />
          </Row>

          <Row icon="flame" iconTint="var(--pink)" title="% Gordura Estimado (BF)">
            <input
              type="number"
              inputMode="decimal"
              className="input"
              style={{ width: '84px', textAlign: 'end', fontWeight: 600, fontSize: 16, padding: '6px 10px' }}
              value={form.bodyFatPercentage || ''}
              onChange={e => setForm(f => ({ ...f, bodyFatPercentage: Number(e.target.value) || 0 }))}
            />
          </Row>

          <Row icon="timer" iconTint="var(--purple)" title="Experiência de Treino">
            <Segmented
              className="seg-inline"
              options={[
                { value: 0.5, label: '< 1 ano' },
                { value: 2, label: '1 - 3 anos' },
                { value: 5, label: '3+ anos' }
              ]}
              value={form.trainingAge}
              onChange={val => setForm(f => ({ ...f, trainingAge: val }))}
            />
          </Row>
        </Section>
      )}

      {/* STEP 2: Goals */}
      {currentStep === 1 && (
        <Section title="Objetivo Principal" footer="Define a proporção entre calorias, proteínas diárias e a frequência semanal de estímulos.">
          {GOALS.map(g => (
            <Row
              key={g.id}
              icon={g.icon}
              iconTint={g.color}
              title={g.title}
              subtitle={g.desc}
              accessory={form.goals.includes(g.id) ? 'check' : 'none'}
              onClick={() => toggleGoal(g.id)}
            />
          ))}
        </Section>
      )}

      {/* STEP 3: Orthopedic & Articular Safety */}
      {currentStep === 2 && (
        <Section title="Saúde Articular e Lesões" footer="Exercícios contraindicados serão trocados automaticamente por alternativas seguras e sem dor.">
          <Row
            icon="shield"
            iconTint="var(--green)"
            title="Nenhuma dor ou lesão ativa"
            subtitle="Articulações 100% saudáveis para treinar"
            accessory={form.orthopedicConditions.length === 0 ? 'check' : 'none'}
            onClick={() => toggleCondition('none')}
          />
          {COMMON_CONDITIONS.map(c => (
            <Row
              key={c.id}
              icon="warning"
              iconTint="var(--orange)"
              title={c.label}
              subtitle={c.desc}
              accessory={form.orthopedicConditions.includes(c.id) ? 'check' : 'none'}
              onClick={() => toggleCondition(c.id)}
            />
          ))}
        </Section>
      )}

      {/* Bottom Navigation Buttons */}
      <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
        {currentStep > 0 && (
          <Button variant="secondary" onClick={handleBack} style={{ flex: 1, padding: '12px' }}>
            Voltar
          </Button>
        )}
        <Button variant="primary" onClick={handleNext} style={{ flex: 2, padding: '12px', fontWeight: 600 }}>
          {currentStep === steps.length - 1 ? '⚡ Gerar Meu Treino & Dieta' : 'Continuar →'}
        </Button>
      </div>
    </div>
  );
}

export default MedicalIntakeModal;
