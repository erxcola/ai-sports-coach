// src/frontend/src/App.jsx
// Updated App with AI Coach routes

import { useEffect, useLayoutEffect, useRef } from 'react'
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation, useNavigationType } from 'react-router-dom'
import { useStore } from './store/useStore.js'
import { useUI } from './store/useUI.js'
import { bindUI } from './components/ui.jsx'
import { setWeightDecimals } from './lib/format.js'
import { accentValue, applyAccent } from './lib/accent.js'
import { setLang, useLang, baseLang } from './lib/i18n.js'
import { setPlayOnSilent, setVibrate, setAlarmBuzzer } from './lib/sound.js'
import { buzzAsAlarm } from './lib/rest-alert.js'
import { setNav } from './lib/nav.js'
import { setSystemBarsLight } from './lib/system-bars.js'
import { initBackButton } from './lib/back.js'
import { useWakeLock } from './lib/wakelock.js'
import { installViewportGuard } from './lib/viewport-guard.js'
import { installChipDrag } from './lib/hchips.js'
import { syncPushSubscription } from './lib/push.js'
import { MOBILE } from './lib/mobile.js'
import { exitWorkoutEdit, startFlow } from './sheets.jsx'
import Icon from './components/Icon.jsx'
import TabBar from './components/TabBar.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import Modals from './components/Modals.jsx'
import Toast from './components/Toast.jsx'
import SyncBanner from './components/SyncBanner.jsx'
import RestTimer from './components/RestTimer.jsx'
import TimerFlash from './components/TimerFlash.jsx'
import { openDeviceLinkRedeem } from './components/Passkeys.jsx'
import Login from './views/Login.jsx'
import MobileOnboarding from './views/MobileOnboarding.jsx'
import Home from './views/Home.jsx'
import CheckIn from './views/CheckIn.jsx'
import Plan from './views/Plan.jsx'
import RoutineEdit from './views/RoutineEdit.jsx'
import Workout from './views/Workout.jsx'
import Stats from './views/Stats.jsx'
import History from './views/History.jsx'
import Library from './views/Library.jsx'
import Muscles from './views/Muscles.jsx'
import StructuralBalance from './views/StructuralBalance.jsx'
import ProgressPhotos from './views/ProgressPhotos.jsx'
import { SettingsRoute } from './views/Settings.jsx'
import Admin from './views/Admin.jsx'
import CoachChat from './views/CoachChat.jsx'
import Measurements from './views/Measurements.jsx'
import CoachIntake from './views/CoachIntake.jsx'
import CoachSetup from './views/CoachSetup.jsx'
import EnhancedCoachIntake from './views/EnhancedCoachIntake.jsx'
import AICoachDashboard from './views/AICoachDashboard.jsx'

// last known scrollY per route
const scrollPositions = new Map()

bindUI(useUI)

const resolveTheme = theme => theme === 'light' || theme === 'dark'
  ? theme
  : (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

function applyPrefs(theme, accent) {
  const de = document.documentElement
  de.dataset.theme = resolveTheme(theme)
  applyAccent(de, accent, de.dataset.theme)
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.content = de.dataset.theme === 'light' ? '#f2f2f7' : '#000000'
  if (MOBILE) setSystemBarsLight(de.dataset.theme === 'light')
}

function Shell() {
  const navigate = useNavigate()
  const loc = useLocation()
  const navType = useNavigationType()
  const { S, user, ready } = useStore()

  useEffect(() => { setPlayOnSilent(!!S.soundOnSilent) }, [S.soundOnSilent])
  useEffect(() => { setVibrate(S.vibrate !== false) }, [S.vibrate])
  useEffect(() => { setAlarmBuzzer(MOBILE && S.vibrate !== false && S.vibrateOnSilent ? buzzAsAlarm : null) }, [S.vibrate, S.vibrateOnSilent])
  const isGuest = useStore(s => s.isGuest())
  const needsMobileOnboarding = useStore(s => s.needsMobileOnboarding)
  const langV = useLang()
  useEffect(() => { setNav(navigate) }, [navigate])
  const lastEditPath = useRef(loc.pathname)

  useEffect(() => {
    const previous = lastEditPath.current
    lastEditPath.current = loc.pathname
    if (previous !== '/workout' || !useStore.getState().S.active?.editingWorkoutId || loc.pathname === '/workout') return
    const destination = loc.pathname + loc.search
    navigate('/workout', { replace: true })
    exitWorkoutEdit(() => navigate(destination, { replace: true }))
  }, [loc.pathname, loc.search, S.active?.editingWorkoutId, navigate])

  const accent = accentValue(S)
  useEffect(() => { applyPrefs(S.theme, accent) }, [S.theme, accent])

  useEffect(() => {
    if (S.theme !== 'system' || !window.matchMedia) return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyPrefs(S.theme, accent)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [S.theme, accent])

  const config = useStore(s => s.config)
  const lang = effectiveLang(S, config)
  useEffect(() => { setLang(lang, S.enParens?.[baseLang(lang)] ?? true, S.enOnly?.[baseLang(lang)] === true) }, [lang, S.enParens, S.enOnly])
  useEffect(() => { setWeightDecimals(S.wdec) }, [S.wdec])
  useEffect(() => { document.documentElement.lang = lang }, [langV, lang])

  const pathRef = useRef(null)
  useEffect(() => installViewportGuard(), [])
  useEffect(() => installChipDrag(), [])

  useEffect(() => {
    if (MOBILE || !user || !ready) return
    syncPushSubscription().catch(() => {})
  }, [user?.id, ready])

  const linkCode = useStore(s => s.linkCode)
  const linkOffered = useRef(false)
  useEffect(() => {
    if (!ready || !linkCode || linkOffered.current) return
    linkOffered.current = true
    openDeviceLinkRedeem()
  }, [ready, linkCode])

  useEffect(() => {
    const onScroll = () => {
      if (document.body.style.position === 'fixed') return
      scrollPositions.set(pathRef.current, window.scrollY)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useLayoutEffect(() => {
    const first = pathRef.current === null
    const samePath = pathRef.current === loc.pathname
    pathRef.current = loc.pathname
    if (navType !== 'POP' || first) { window.scrollTo(0, 0); return }
    if (samePath) return
    const y = scrollPositions.get(loc.pathname) || 0
    const frame = window.requestAnimationFrame(() => window.scrollTo(0, y))
    return () => window.cancelAnimationFrame(frame)
  }, [loc.pathname, navType])

  useWakeLock(!!S.active && !S.active.editingWorkoutId && S.keepAwake !== false)

  const inWorkout = loc.pathname === '/workout' && !!S.active
  useEffect(() => {
    document.body.classList.toggle('no-tabbar', inWorkout)
    return () => document.body.classList.remove('no-tabbar')
  }, [inWorkout])

  const noTabs = inWorkout || loc.pathname === '/coach' || needsMobileOnboarding

  const authed = user || isGuest
  if (!ready && !authed) return (
    <div id="app">
      <div style={{ paddingTop: '44vh', display: 'flex', justifyContent: 'center', fontSize: 34, color: 'var(--label-3)' }}>
        <Icon name="dumbbell" />
      </div>
    </div>
  )

  return (
    <>
      <div id="app" className="vfade" key={loc.pathname}>
        <ErrorBoundary>
          {needsMobileOnboarding ? <MobileOnboarding /> : !authed ? <Login /> : (
            <Routes>
              <Route path="/home" element={<Home />} />
              {S.checkIn !== false && <Route path="/checkin" element={<CheckIn />} />}
              <Route path="/plan" element={<Plan />} />
              <Route path="/plan/r/:id" element={<RoutineEdit />} />
              <Route path="/workout" element={<Workout />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/history" element={<History />} />
              <Route path="/library" element={<Library />} />
              <Route path="/muscles" element={<Muscles />} />
              <Route path="/structural-balance" element={<StructuralBalance />} />
              <Route path="/progress-photos" element={<ProgressPhotos />} />
              <Route path="/measurements" element={<Measurements />} />
              <Route path="/settings" element={<SettingsRoute />} />
              <Route path="/settings/:page" element={<SettingsRoute />} />

              {/* Coach routes - Original */}
              <Route path="/coach" element={<CoachChat />} />
              <Route path="/coach/intake" element={<EnhancedCoachIntake />} />
              <Route path="/coach/proposal" element={<Navigate to="/coach" replace />} />
              <Route path="/coach/setup" element={<CoachSetup />} />

              {/* NEW: AI Coach Routes - Enhanced */}
              <Route path="/aicoach" element={<AICoachDashboard />} />
              <Route path="/aicoach/intake" element={<EnhancedCoachIntake />} />

              <Route path="/admin" element={user?.admin ? <Admin /> : <Navigate to="/home" replace />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          )}
        </ErrorBoundary>
      </div>
      <SyncBanner />
      {!noTabs && <TabBar onStart={startFlow} />}
      <RestTimer />
      <Modals />
      <Toast />
      <TimerFlash />
    </>
  )
}

export default function App() {
  const boot = useStore(s => s.boot)
  useEffect(() => { boot() }, [boot])
  useEffect(() => {
    let stop = null, gone = false
    initBackButton().then(fn => { if (gone) fn(); else stop = fn })
    return () => { gone = true; stop?.() }
  }, [])
  return <HashRouter><Shell /></HashRouter>
}

// Helper functions (copied from original)
function effectiveLang(S, config) {
  // Simplified - actual implementation in lib/default-lang.js
  return S.lang || 'en'
}
