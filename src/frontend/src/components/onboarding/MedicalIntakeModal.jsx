/**
 * MedicalIntakeModal - Formulário de onboarding médico
 * React component para openGym
 */

import React, { useState, useEffect } from 'react';
import { ALL_ORTHOPEDIC_CONDITIONS, OrthopedicCondition } from '../../../lib/types/biomechanics.js';

const CONDITION_LABELS = {
  [OrthopedicCondition.SCOLIOSIS]: 'Escoliose',
  [OrthopedicCondition.KYPHOSIS]: 'Cifose Torácica',
  [OrthopedicCondition.LORDOSIS]: 'Lordose Lombar',
  [OrthopedicCondition.KNEE_CHONDROMALACIA]: 'Condromalácia de Joelho',
  [OrthopedicCondition.PATELLAR_TENDINITIS]: 'Tendinite Patelar',
  [OrthopedicCondition.MENISCUS_PATHOLOGY]: 'Lesão Meniscal',
  [OrthopedicCondition.ACL_INSTABILITY]: 'Instabilidade LCA',
  [OrthopedicCondition.SHOULDER_IMPINGEMENT]: 'Impingimento de Ombro',
  [OrthopedicCondition.ROTATOR_CUFF_TENDINITIS]: 'Tendinite Manguito Rotador',
  [OrthopedicCondition.GLENO_HUMERAL_ARTHRITIS]: 'Artrose Glenoumeral',
  [OrthopedicCondition.AC_JOINT_OSTEOARTHRITIS]: 'Artrose Acromioclavicular',
  [OrthopedicCondition.MEDIAL_EPICONDYLITIS]: 'Epicondilite Medial (Cotovelo Golfista)',
  [OrthopedicCondition.LATERAL_EPICONDYLITIS]: 'Epicondilite Lateral (Tennis Elbow)',
  [OrthopedicCondition.ACHILLES_TENDINITIS]: 'Tendinite de Aquiles',
  [OrthopedicCondition.PLANTAR_FASCIITIS]: 'Fascite Plantar',
  [OrthopedicCondition.ANKLE_INSTABILITY]: 'Instabilidade de Tornozelo',
  [OrthopedicCondition.CARPAL_TUNNEL]: 'Síndrome do Túnel do Carpo',
  [OrthopedicCondition.POSTURAL_IMBALANCE]: 'Desequilíbrio Postural',
  [OrthopedicCondition.FATIGUE_SYNDROME]: 'Síndrome de Fadiga Crônica'
};

const GOAL_LABELS = {
  hypertrophy: 'Hipertrofia Muscular',
  recomp: 'Recomposição Corporal',
  fat_loss: 'Perda de Gordura',
  strength: 'Força Máxima'
};

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentário (pouco ou nenhum exercício)' },
  { value: 'lightly_active', label: 'Levemente Ativo (exercício leve 1-3x/semana)' },
  { value: 'moderately_active', label: 'Moderadamente Ativo (exercício moderado 3-5x/semana)' },
  { value: 'very_active', label: 'Muito Ativo (exercício intenso 6-7x/semana)' },
  { value: 'extra_active', label: 'Extra Ativo (exercício muito intenso + trabalho físico)' }
];

const SEX_OPTIONS = [
  { value: 'male', label: 'Masculino' },
  { value: 'female', label: 'Feminino' },
  { value: 'other', label: 'Outro/Prefiro não dizer' }
];

export function MedicalIntakeModal({
  onSubmit,
  onClose,
  initialValues,
  isOpen = true
}) {
  const [form, setForm] = useState(initialValues || {
    age: 30,
    sex: 'male',
    height: 175,
    weight: 70,
    bodyFatPercentage: 20,
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
      occupation: 'desk',
      activityLevel: 'moderately_active'
    },
    profileImage: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 'basic', title: 'Dados Básicos', icon: '👤' },
    { id: 'goals', title: 'Objetivos', icon: '🎯' },
    { id: 'medical', title: 'Histórico Médico', icon: '🏥' },
    { id: 'mobility', title: 'Mobilidade', icon: '🤸' },
    { id: 'lifestyle', title: 'Estilo de Vida', icon: '💼' }
  ];

  useEffect(() => {
    if (initialValues) {
      setForm(initialValues);
    }
  }, [initialValues]);

  const validateStep = (stepId) => {
    const newErrors = {};

    switch (stepId) {
      case 'basic':
        if (!form.age || form.age < 13 || form.age > 100) newErrors.age = 'Idade deve ser entre 13 e 100';
        if (!form.height || form.height < 140 || form.height > 220) newErrors.height = 'Altura deve ser entre 140 e 220 cm';
        if (!form.weight || form.weight < 40 || form.weight > 150) newErrors.weight = 'Peso deve ser entre 40 e 150 kg';
        if (!form.bodyFatPercentage || form.bodyFatPercentage < 5 || form.bodyFatPercentage > 50) newErrors.bodyFatPercentage = '% gordura deve ser entre 5% e 50%';
        break;
      case 'goals':
        if (!form.goals || form.goals.length === 0) newErrors.goals = 'Selecione pelo menos um objetivo';
        break;
      case 'medical':
        // Medical conditions are optional
        break;
      case 'mobility':
        const limits = form.mobilityLimits;
        Object.entries(limits).forEach(([key, value]) => {
          if (value < 0 || value > 180) newErrors[key] = `${key} deve ser entre 0° e 180°`;
        });
        break;
      case 'lifestyle':
        if (!form.demographics.occupation?.trim()) newErrors.occupation = 'Informe sua ocupação';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value);

    if (name.includes('.')) {
      // Nested property like mobilityLimits.shoulderFlexion
      const [parent, child] = name.split('.');
      setForm(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: val }
      }));
    } else if (name === 'goals') {
      // Handle checkbox group
      const currentGoals = form.goals || [];
      const newGoals = checked
        ? [...currentGoals, value]
        : currentGoals.filter(g => g !== value);
      setForm(prev => ({ ...prev, goals: newGoals }));
    } else if (name === 'orthopedicConditions') {
      // Handle checkbox group
      const currentConditions = form.orthopedicConditions || [];
      const newConditions = checked
        ? [...currentConditions, value]
        : currentConditions.filter(c => c !== value);
      setForm(prev => ({ ...prev, orthopedicConditions: newConditions }));
    } else {
      setForm(prev => ({ ...prev, [name]: val }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all steps
    let allValid = true;
    for (let i = 0; i < steps.length; i++) {
      if (!validateStep(steps[i].id)) allValid = false;
    }

    if (!allValid) {
      // Go to first invalid step
      for (let i = 0; i < steps.length; i++) {
        if (!validateStep(steps[i].id)) {
          setCurrentStep(i);
          break;
        }
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Process pain triggers string to array
      const painTriggers = form.painTriggers
        ? form.painTriggers.split(',').map(t => t.trim()).filter(t => t.length > 0)
        : [];

      const submitData = {
        ...form,
        painTriggers,
        profileImage: form.profileImage
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Erro ao submeter:', error);
      alert('Erro ao processar formulário. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const step = steps[currentStep];

  return (
    <div className="medical-intake-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="medical-intake-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="progress-bar">
            {steps.map((s, i) => (
              <div
                key={s.id}
                className={`progress-step ${i < currentStep ? 'completed' : i === currentStep ? 'active' : ''}`}
              >
                <span className="step-icon">{s.icon}</span>
                <span className="step-label">{s.title}</span>
              </div>
            ))}
          </div>
          <button className="close-button" onClick={onClose} disabled={isSubmitting}>
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-content">
            {/* Step: Basic Info */}
            {step.id === 'basic' && (
              <div className="step-content">
                <h3>Dados Pessoais</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="age">Idade *</label>
                    <input
                      id="age"
                      name="age"
                      type="number"
                      value={form.age}
                      onChange={handleChange}
                      min={13}
                      max={100}
                      required
                    />
                    {errors.age && <span className="error">{errors.age}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="sex">Sexo *</label>
                    <select
                      id="sex"
                      name="sex"
                      value={form.sex}
                      onChange={handleChange}
                      required
                    >
                      {SEX_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="height">Altura (cm) *</label>
                    <input
                      id="height"
                      name="height"
                      type="number"
                      value={form.height}
                      onChange={handleChange}
                      min={140}
                      max={220}
                      required
                    />
                    {errors.height && <span className="error">{errors.height}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="weight">Peso (kg) *</label>
                    <input
                      id="weight"
                      name="weight"
                      type="number"
                      value={form.weight}
                      onChange={handleChange}
                      min={40}
                      max={150}
                      step={0.1}
                      required
                    />
                    {errors.weight && <span className="error">{errors.weight}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="bodyFatPercentage">% Gordura Corporal *</label>
                    <input
                      id="bodyFatPercentage"
                      name="bodyFatPercentage"
                      type="number"
                      value={form.bodyFatPercentage}
                      onChange={handleChange}
                      min={5}
                      max={50}
                      step={0.1}
                      required
                    />
                    <small>Estimativa visual ou bioimpedância</small>
                    {errors.bodyFatPercentage && <span className="error">{errors.bodyFatPercentage}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="trainingAge">Anos de Treino *</label>
                    <input
                      id="trainingAge"
                      name="trainingAge"
                      type="number"
                      value={form.trainingAge}
                      onChange={handleChange}
                      min={0}
                      max={50}
                      required
                    />
                    <small>0 = iniciante total</small>
                  </div>
                </div>
              </div>
            )}

            {/* Step: Goals */}
            {step.id === 'goals' && (
              <div className="step-content">
                <h3>Quais são seus objetivos?</h3>
                <p className="step-description">Selecione todos que se aplicam (máximo 2 recomendado)</p>
                <div className="goals-grid">
                  {Object.entries(GOAL_LABELS).map(([value, label]) => (
                    <label key={value} className={`goal-card ${form.goals.includes(value) ? 'selected' : ''}`}>
                      <input
                        type="checkbox"
                        name="goals"
                        value={value}
                        checked={form.goals.includes(value)}
                        onChange={handleChange}
                      />
                      <span className="goal-label">{label}</span>
                    </label>
                  ))}
                </div>
                {errors.goals && <span className="error">{errors.goals}</span>}
              </div>
            )}

            {/* Step: Medical History */}
            {step.id === 'medical' && (
              <div className="step-content">
                <h3>Condições Ortopédicas / Lesões</h3>
                <p className="step-description">
                  Marque todas as condições diagnosticadas por profissional de saúde.
                  Isso garante que seu treino seja seguro e adaptado.
                </p>

                <div className="conditions-grid">
                  {ALL_ORTHOPEDIC_CONDITIONS
                    .filter(c => c !== 'none')
                    .map(condition => (
                      <label key={condition} className={`condition-card ${form.orthopedicConditions.includes(condition) ? 'selected' : ''}`}>
                        <input
                          type="checkbox"
                          name="orthopedicConditions"
                          value={condition}
                          checked={form.orthopedicConditions.includes(condition)}
                          onChange={handleChange}
                        />
                        <span className="condition-label">{CONDITION_LABELS[condition] || condition}</span>
                      </label>
                    ))}
                  <label className="condition-card none-option">
                    <input
                      type="checkbox"
                      name="orthopedicConditions"
                      value="none"
                      checked={form.orthopedicConditions.includes('none')}
                      onChange={handleChange}
                    />
                    <span className="condition-label">✓ Nenhuma condição diagnosticada</span>
                  </label>
                </div>

                <div className="form-group">
                  <label htmlFor="painTriggers">Gatilhos de Dor (opcional)</label>
                  <textarea
                    id="painTriggers"
                    name="painTriggers"
                    value={form.painTriggers}
                    onChange={handleChange}
                    placeholder="Ex: agachamento profundo, levantamento terra, press militar, etc."
                    rows={3}
                  />
                  <small>Separe por vírgula. Exercícios ou movimentos que causam dor.</small>
                </div>
              </div>
            )}

            {/* Step: Mobility */}
            {step.id === 'mobility' && (
              <div className="step-content">
                <h3>Limites de Mobilidade Atual</h3>
                <p className="step-description">
                  Indique sua amplitude de movimento aproximada em graus.
                  Se não souber, deixe os valores padrão (máxima amplitude).
                </p>
                <div className="mobility-grid">
                  <div className="mobility-item">
                    <label htmlFor="shoulderFlexion">Flexão de Ombro (°)</label>
                    <input
                      id="shoulderFlexion"
                      name="mobilityLimits.shoulderFlexion"
                      type="range"
                      min={0}
                      max={180}
                      value={form.mobilityLimits.shoulderFlexion}
                      onChange={handleChange}
                    />
                    <span className="range-value">{form.mobilityLimits.shoulderFlexion}°</span>
                    {errors.shoulderFlexion && <span className="error">{errors.shoulderFlexion}</span>}
                  </div>

                  <div className="mobility-item">
                    <label htmlFor="shoulderAbduction">Abdução de Ombro (°)</label>
                    <input
                      id="shoulderAbduction"
                      name="mobilityLimits.shoulderAbduction"
                      type="range"
                      min={0}
                      max={180}
                      value={form.mobilityLimits.shoulderAbduction}
                      onChange={handleChange}
                    />
                    <span className="range-value">{form.mobilityLimits.shoulderAbduction}°</span>
                    {errors.shoulderAbduction && <span className="error">{errors.shoulderAbduction}</span>}
                  </div>

                  <div className="mobility-item">
                    <label htmlFor="kneeFlexion">Flexão de Joelho (°)</label>
                    <input
                      id="kneeFlexion"
                      name="mobilityLimits.kneeFlexion"
                      type="range"
                      min={0}
                      max={160}
                      value={form.mobilityLimits.kneeFlexion}
                      onChange={handleChange}
                    />
                    <span className="range-value">{form.mobilityLimits.kneeFlexion}°</span>
                    {errors.kneeFlexion && <span className="error">{errors.kneeFlexion}</span>}
                  </div>

                  <div className="mobility-item">
                    <label htmlFor="hipFlexion">Flexão de Quadril (°)</label>
                    <input
                      id="hipFlexion"
                      name="mobilityLimits.hipFlexion"
                      type="range"
                      min={0}
                      max={160}
                      value={form.mobilityLimits.hipFlexion}
                      onChange={handleChange}
                    />
                    <span className="range-value">{form.mobilityLimits.hipFlexion}°</span>
                    {errors.hipFlexion && <span className="error">{errors.hipFlexion}</span>}
                  </div>

                  <div className="mobility-item">
                    <label htmlFor="thoracicExtension">Extensão Torácica (°)</label>
                    <input
                      id="thoracicExtension"
                      name="mobilityLimits.thoracicExtension"
                      type="range"
                      min={0}
                      max={60}
                      value={form.mobilityLimits.thoracicExtension}
                      onChange={handleChange}
                    />
                    <span className="range-value">{form.mobilityLimits.thoracicExtension}°</span>
                    {errors.thoracicExtension && <span className="error">{errors.thoracicExtension}</span>}
                  </div>

                  <div className="mobility-item">
                    <label htmlFor="lumbarFlexion">Flexão Lombar (°)</label>
                    <input
                      id="lumbarFlexion"
                      name="mobilityLimits.lumbarFlexion"
                      type="range"
                      min={0}
                      max={60}
                      value={form.mobilityLimits.lumbarFlexion}
                      onChange={handleChange}
                    />
                    <span className="range-value">{form.mobilityLimits.lumbarFlexion}°</span>
                    {errors.lumbarFlexion && <span className="error">{errors.lumbarFlexion}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Step: Lifestyle */}
            {step.id === 'lifestyle' && (
              <div className="step-content">
                <h3>Estilo de Vida e Demografia</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="dominantHand">Mão Dominante</label>
                    <select
                      id="dominantHand"
                      name="dominantHand"
                      value={form.demographics.dominantHand}
                      onChange={handleChange}
                    >
                      <option value="right">Direita</option>
                      <option value="left">Esquerda</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="occupation">Ocupação *</label>
                    <input
                      id="occupation"
                      name="demographics.occupation"
                      type="text"
                      value={form.demographics.occupation}
                      onChange={handleChange}
                      placeholder="Ex: escritório, professor, atleta, etc."
                    />
                    {errors.occupation && <span className="error">{errors.occupation}</span>}
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="activityLevel">Nível de Atividade Diária *</label>
                    <select
                      id="activityLevel"
                      name="demographics.activityLevel"
                      value={form.demographics.activityLevel}
                      onChange={handleChange}
                    >
                      {ACTIVITY_LEVELS.map(level => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="profileImage">Foto de Perfil (opcional)</label>
                  <input
                    id="profileImage"
                    name="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setForm(prev => ({ ...prev, profileImage: event.target.result }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <small>Foto frontal relaxada. Usada para análise de postura por IA (futuro).</small>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="modal-footer">
            {currentStep > 0 && (
              <button type="button" className="btn-secondary" onClick={handleBack} disabled={isSubmitting}>
                ← Voltar
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button type="button" className="btn-primary" onClick={handleNext} disabled={isSubmitting}>
                Próximo →
              </button>
            ) : (
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Processando...' : 'Gerar Meu Plano'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default MedicalIntakeModal;