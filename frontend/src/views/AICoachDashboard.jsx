// src/frontend/src/views/AICoachDashboard.jsx
// View principal do AI Coach Dashboard - integra com o fluxo existente do openGym

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore.js';
import { useUI } from '../store/useUI.js';
import { t } from '../lib/i18n.js';
import { coachAvailable, hasConsent, emptyCoach } from '../lib/coach.js';
import { DEMO } from '../lib/demo.js'
import { MOBILE } from '../lib/mobile.js'
import { AICoachApp } from '../components/coach/AICoachApp';
import '../coach.css';

export default function AICoachDashboard() {
  const nav = useNavigate();
  const S = useStore(s => s.S);
  const user = useStore(s => s.user);
  const config = useStore(s => s.config);
  const coachLocal = useStore(s => s.coachLocal);
  const storeReady = useStore(s => s.ready);

  const coachMode = coachLocal?.mode;
  const ok = coachAvailable(config, user, { demo: DEMO, mobile: MOBILE, coachMode });
  const ready = ok && hasConsent(S) && !!S.coach?.profile;

  // Auto-redirect se não estiver pronto
  useEffect(() => {
    if (!storeReady) return;
    if (!ok) nav('/home', { replace: true });
    else if (!ready) nav('/coach/intake', { replace: true });
  }, [storeReady, ok, ready, nav]);

  if (!ready) return null;

  return (
    <div className="narrow">
      <div className="ob">
        <div className="ob-top">
          <h1 className="ob-h">{t('AI Sports Coach')}</h1>
        </div>
        <div className="ob-body">
          <AICoachApp />
        </div>
      </div>
    </div>
  );
}