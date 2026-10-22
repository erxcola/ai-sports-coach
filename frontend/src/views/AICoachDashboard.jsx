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
  return (
    <div className="narrow" style={{ paddingBottom: 80 }}>
      <AICoachApp />
    </div>
  );
}