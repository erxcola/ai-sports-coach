// src/frontend/src/views/EnhancedCoachIntake.jsx
// Enhanced Coach Intake usando nosso MedicalIntakeModal completo
// Substitui o CoachIntake.jsx básico com biomecânica, nutrição, CV

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../store/useStore.js';
import { useUI } from '../store/useUI.js';
import { t } from '../lib/i18n.js';
import { coachAvailable, hasConsent, emptyCoach, appendChat } from '../lib/coach.js';
import { requestPlan, disclosure, JOB_ERRORS } from '../lib/coach-api.js';
import { DEMO } from '../lib/demo.js';
import { MOBILE } from '../lib/mobile.js';
import { activeProfile } from '../lib/equipment.js';
import Icon from '../components/Icon.jsx';
import { Button, TextArea } from '../components/ui.jsx';
import { MedicalIntakeModal } from '../components/onboarding/MedicalIntakeModal';
import { useAICoach } from '../hooks/useAICoach';
import '../coach.css';

export default function EnhancedCoachIntake() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const editing = params.get('edit') === '1';
  const S = useStore(s => s.S);
  const user = useStore(s => s.user);
  const config = useStore(s => s.config);
  const coachLocal = useStore(s => s.coachLocal);
  const update = useStore(s => s.update);
  const toast = useUI(s => s.toast);

  const coachMode = coachLocal?.mode;
  const ok = coachAvailable(config, user, { demo: DEMO, mobile: MOBILE, coachMode });

  // Hook do AI Coach
  const {
    processIntake,
    isLoading,
    error,
    hasRecommendations
  } = useAICoach();

  const [needConsent] = useState(() => !editing && !hasConsent(S));
  const [reconsentOnly] = useState(() => !editing && !hasConsent(S) && !!S.coach?.profile);

  // Steps: nosso fluxo completo de 5 passos
  const STEPS = reconsentOnly ? ['consent'] : [...(needConsent ? ['consent'] : [])];
  const [step, setStep] = useState(0);

  const key = STEPS[step];
  const last = step === STEPS.length - 1;

  // Verificar disponibilidade
  useEffect(() => {
    if (!ok) nav('/home', { replace: true });
  }, [ok, nav]);

  // Se já tem recomendações (edit mode), vai direto para dashboard
  useEffect(() => {
    if (editing && hasRecommendations) {
      nav('/aicoach', { replace: true });
    }
  }, [hasRecommendations, nav]);

  const handleIntakeSubmit = async (data) => {
    try {
      await processIntake(data);
      if (editing) {
        toast(t('Perfil atualizado com sucesso'));
        nav('/aicoach', { replace: true });
      } else {
        // Build plan after intake
        await requestPlan({
          goal: data.goals[0] || 'hypertrophy',
          daysPerWeek: data.demographics.activityLevel === 'sedentary' ? 3 : 4,
          sessionMin: 60,
          equipment: data.demographics.activityLevel === 'sedentary' ? [] : ['body weight'],
          limitations: data.painTriggers.join(', '),
          likes: '',
          dislikes: '',
          notes: ''
        });
        nav('/aicoach', { replace: true });
      }
    } catch (err) {
      toast(JOB_ERRORS[err.data?.code] || err.message || t('Erro ao processar onboarding'));
    }
  };

  const agree = () => {
    update(s => {
      s.coach = { ...(s.coach || emptyCoach()), consent: { agreedAt: new Date().toISOString(), version: 1 } }
    });
    if (reconsentOnly) nav('/aicoach', { replace: true });
    else setStep(step + 1);
  };

  if (!ok) return null;

  return (
    <div className="narrow ob">
      {key === 'consent' ? (
        <>
          <div className="ob-top">
            <button className="iconbtn" onClick={() => nav(editing ? '/aicoach' : '/plan')} aria-label={t('Back')}>
              <Icon name="chevronLeft" />
            </button>
          </div>
          <div className="ob-body">
            <Consent onAgree={agree} onDecline={() => nav('/plan')} />
          </div>
        </>
      ) : (
        <MedicalIntakeModal
          isOpen={true}
          onSubmit={handleIntakeSubmit}
          onClose={() => {
            if (!editing && !hasRecommendations) {
              nav('/plan', { replace: true });
            } else {
              nav('/aicoach', { replace: true });
            }
          }}
        />
      )}
    </div>
  );
}

function Consent({ onAgree, onDecline }) {
  const config = useStore(s => s.config);
  const [info, setInfo] = useState(null);
  useEffect(() => { disclosure().then(setInfo).catch(() => {}) }, []);

  const who = info?.payer === 'you'
    ? t('Sent straight to {0} with your own API key. You pay for every request.', info.host || info.providerLabel)
    : t('Sent to {0}, running on this server under the instance owner\'s account.', info?.providerLabel || config?.coach?.providerLabel || t('the configured AI provider'));

  return (
    <>
      <div className="ob-eyebrow">{t('Antes de começar')}</div>
      <h1 className="ob-h">{t('Conheça seu AI Coach')}</h1>
      <p className="ob-p">{t('Ele desenha seu plano de treino, nutrição e analisa sua postura baseado em ciência. Nada muda sem sua aprovação.')}</p>
      <div className="ob-sub" style={{ marginTop: 0 }}>{t('O que ele analisa')}</div>
      <div className="ob-consent">
        <div className="ob-consent-row"><Icon name="check" /><div><b>Biomecânica e Segurança</b><span>Filtra exercícios perigosos para suas condições ortopédicas</span></div></div>
        <div className="ob-consent-row"><Icon name="check" /><div><b>Nutrição Clínica (ISSN)</b><span>Macros, timing, suplementação articular e anti-inflamatória</span></div></div>
        <div className="ob-consent-row"><Icon name="check" /><div><b>Periodização (Schoenfeld/Helms)</b><span>Volume MEV-MAV, RIR 1-3, deloads automáticos</span></div></div>
        <div className="ob-consent-row"><Icon name="check" /><div><b>Análise Postural (IA)</b><span>3 fotos: frente, lateral, costas - desvios e desequilíbrios</span></div></div>
      </div>
      <div className="ob-fine">
        <div>{who}</div>
        <div>{t('Seu nome, login e dados da conta ficam aqui. Dados de outros nunca são incluídos.')}</div>
        <div style={{ color: 'var(--yellow)' }}>{t('O Coach não é médico nem fisioterapeuta. Se algo dói, procure um profissional.')}</div>
      </div>
      <div className="ob-foot" style={{ flexDirection: 'column' }}>
        <Button variant="primary" onClick={onAgree}>{t('Entendi, vamos lá')}</Button>
        <Button onClick={onDecline}>{t('Agora não')}</Button>
      </div>
    </>
  );
}
