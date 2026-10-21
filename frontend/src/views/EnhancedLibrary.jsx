// src/frontend/src/views/EnhancedLibrary.jsx
// Enhanced Library view with biomechanical safety filtering
// Integrates our AI Coach safety system with openGym's ExercisePicker

import React, { useDeferredValue, useMemo, useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import { EXDB, BODYPARTS, allExercises, equipmentOf, byCategory, searchExercises, similarExercises, EXIDX } from '../lib/exercises.js'
import { MUSCLE_NAME } from '../lib/muscles.js'
import { activeProfile, exAvailable } from '../lib/equipment.js'
import { bestWeightFor } from '../lib/history.js'
import { fmtNum, exCount } from '../lib/format.js'
import { t, tn, exerciseNameFor, exerciseNameClass } from '../lib/i18n.js'
import { Thumb } from '../components/Media.jsx'
import { exerciseDetailSheet, addToRoutineSheet, customExSheet } from '../sheets.jsx'
import Icon from '../components/Icon.jsx'
import ExerciseViewToggle from '../components/ExerciseViewToggle.jsx'
import { Button } from '../components/ui.jsx'
import { tappable, useRevealActiveChip } from '../lib/use-sheet-keyboard.js'
import { useAutoMore } from '../lib/use-auto-more.js'
import { isFav, sortFavouritesFirst, sortYoursFirst, usageOf } from '../lib/favourites.js'
import { useAICoach, useSafeExercises, useWorkoutValidator } from '../hooks/useAICoach'
import '../coach.css'

export default function EnhancedLibrary() {
  const nav = useNavigate()
  const S = useStore(s => s.S)
  const [q, setQ] = useState('')
  const [bp, setBp] = useState('')
  const [eq, setEq] = useState('')
  const [cat, setCat] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [shown, setShown] = useState(40)
  const [showSafetyInfo, setShowSafetyInfo] = useState(false)
  const bpStrip = useRef(null), eqStrip = useRef(null), catStrip = useRef(null)
  const moreRef = useAutoMore(() => setShown(s => s + 40))
  const profile = activeProfile(S)
  const ownCount = (S.customEx || []).filter(c => c && c.id).length

  // AI Coach integration
  const {
    safetyAssessment,
    userProfile,
    filterExercises,
    isExerciseSafe,
    getSafeAlternatives
  } = useAICoach()

  // Get user's orthopedic conditions from profile
  const orthopedicConditions = userProfile?.orthopedicConditions ||
    S.coach?.profile?.orthopedicConditions || []

  // Filter exercises with biomechanical safety
  const { safeExercises, avoidedExercises, alternatives } = useSafeExercises(
    allExercises(S),
    orthopedicConditions
  )

  // Search and filter
  const inPart = searchExercises(safeExercises.filter(e => !bp || e.bp === bp), q)
  const { opts: catOpts, on: catOn, list: base } = byCategory(inPart, cat)
  const eqFiltered = (profile && !showAll) ? base.filter(e => exAvailable(S, e)) : base
  const eqOpts = equipmentOf(eqFiltered)
  const eqOn = eqOpts.includes(eq) ? eq : ''
  const narrowedList = eqOn ? eqFiltered.filter(e => e.eq === eqOn) : eqFiltered
  const usage = useMemo(() => (q.trim() ? usageOf(S) : null), [q, S.routines, S.workouts])
  const f = usage ? sortYoursFirst(narrowedList, S, usage) : sortFavouritesFirst(narrowedList, S)

  useRevealActiveChip(bpStrip, bp)
  useRevealActiveChip(eqStrip, eqOn)
  useRevealActiveChip(catStrip, catOn)

  const narrowed = !!(q.trim() || bp || eqOn || catOn)
  const qLate = useDeferredValue(q)
  const similar = q.trim() && qLate === q && f.length <= shown
    ? similarExercises(safeExercises.filter(e => (!bp || e.bp === bp)), q, f, f.length ? 12 : 30)
    : []

  const row = e => {
    const best = bestWeightFor(S, e.id)
    const isSafe = isExerciseSafe(e, orthopedicConditions)
    const safeAlts = getSafeAlternatives(e.id, orthopedicConditions)

    return (
      <div
        key={e.id}
        className={`item ${!isSafe ? 'exercise-unsafe' : ''}`}
        {...tappable(() => exerciseDetailSheet(e))}
      >
        <Thumb ex={e} />
        <div className="grow">
          <div className={`tt ${exerciseNameClass(e)}`}>
            {isFav(S, e.id) && <Icon name="starFill" className="fav-star" />}
            {exerciseNameFor(e)}
            {!isSafe && (
              <span className="safety-badge unsafe" title={t('Contraindicado para suas condições')}>
                ⚠️
              </span>
            )}
            {safeAlts.length > 0 && isSafe && (
              <span className="safety-badge has-alternatives" title={t('Alternativas disponíveis')}>
                🔄
              </span>
            )}
          </div>
          <div className="ss capitalize">
            {t(MUSCLE_NAME[e.tg] || e.tg || e.bp)} · {t(e.eq)}
          </div>
        </div>
        {best > 0 && <span className="tag acc">{fmtNum(best)}</span>}
        <Button
          size="sm"
          variant="tinted"
          icon="plus"
          onClick={ev => { ev.stopPropagation(); addToRoutineSheet(e) }}
          disabled={!isSafe}
        >
          {isSafe ? t('Plan') : t('Não seguro')}
        </Button>
      </div>
    )
  }

  // Safety info panel
  const SafetyInfoPanel = () => {
    if (!safetyAssessment || orthopedicConditions.length === 0) return null

    return (
      <div className="safety-info-panel">
        <div className="panel-header" onClick={() => setShowSafetyInfo(!showSafetyInfo)}>
          <span className="panel-icon">{safetyAssessment.riskLevel === 'high' ? '🚨' : safetyAssessment.riskLevel === 'moderate' ? '⚠️' : '✅'}</span>
          <span className="panel-title">
            Segurança Ortopédica: {safetyAssessment.riskLevel === 'high' ? 'Alto Risco' : safetyAssessment.riskLevel === 'moderate' ? 'Risco Moderado' : 'Baixo Risco'}
          </span>
          <Icon name={showSafetyInfo ? 'chevronUp' : 'chevronDown'} className="panel-toggle" />
        </div>

        {showSafetyInfo && (
          <div className="panel-content">
            <div className="mobility-summary">
              <h4>Mobilidade Articular</h4>
              <div className="mobility-grid">
                {Object.entries(safetyAssessment.mobilityAssessment).map(([joint, level]) => (
                  <div key={joint} className={`mobility-item ${level}`}>
                    <span>{getJointLabel(joint)}</span>
                    <span className={level}>{getMobilityLabel(level)}</span>
                  </div>
                ))}
              </div>
            </div>

            {avoidedExercises.length > 0 && (
              <div className="avoided-section">
                <h4>Exercícios Evitados ({avoidedExercises.length})</h4>
                <ul className="avoided-list">
                  {avoidedExercises.slice(0, 5).map((ex, i) => (
                    <li key={i}>
                      <code>{ex.n || ex.id}</code>
                      {alternatives.get(ex.id)?.length > 0 && (
                        <button
                          className="btn-alt-mini"
                          onClick={(e) => { e.stopPropagation(); showAlternatives(ex.id) }}
                        >
                          {alternatives.get(ex.id).length} alt.
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="risk-explanation">
              {getRiskExplanation(safetyAssessment.riskLevel)}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="hdr lib-hdr">
        <div>
          <h1>{t('Exercises')}</h1>
          <div className="safety-indicator">
            {orthopedicConditions.length > 0 && safetyAssessment && (
              <span className={`safety-indicator ${safetyAssessment.riskLevel}`}>
                {safetyAssessment.riskLevel === 'high' ? '🚨' : safetyAssessment.riskLevel === 'moderate' ? '⚠️' : '✅'}
                {safetyAssessment.riskLevel === 'high' ? 'Alto Risco' : safetyAssessment.riskLevel === 'moderate' ? 'Risco Moderado' : 'Seguro'}
              </span>
            )}
          </div>
        </div>
        <Button size="sm" variant="tinted" icon="figureStrength" onClick={() => nav('/muscles')}>
          {t('By muscle')}
        </Button>
        <div className="sub lib-count">
          {ownCount
            ? tn('{1} animated exercises + 1 of your own', '{1} animated exercises + {0} of your own', ownCount, EXDB.length)
            : t('{0} exercises with animations', EXDB.length)}
          {avoidedExercises.length > 0 && (
            <span className="filtered-count">
              ({avoidedExercises.length} {t('filtered for safety')})
            </span>
          )}
        </div>
      </div>

      <div className="search-row" style={{ marginBottom: 10 }}>
        <div className={'search' + (narrowed ? ' has-count' : '') + (q ? ' has-clear' : '')}>
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
          <input
            className="input"
            placeholder={t('Search…')}
            value={q}
            onChange={e => { setQ(e.target.value); setShown(40) }}
          />
          {narrowed && <span className="search-count" role="status" aria-label={exCount(f.length)}>{fmtNum(f.length)}</span>}
          {q && <button className="clear" onClick={() => { setQ(''); setShown(40) }} aria-label={t('Clear')}><Icon name="xmark" /></button>}
        </div>
        <ExerciseViewToggle />
      </div>

      {profile && (
        <div className="small dim row" style={{ margin: '-4px 2px 10px', gap: 6, alignItems: 'center' }}>
          <Icon name="kettlebell" style={{ fontSize: 13 }} />
          {showAll ? t('Showing all equipment') : t('Showing what you have in "{0}"', profile.name)}
          <button className="chip nocap" style={{ marginInlineStart: 'auto', padding: '3px 10px', fontSize: 12 }} onClick={() => setShowAll(v => !v)}>
            {showAll ? t('Filter by "{0}"', profile.name) : t('Show all equipment')}
          </button>
        </div>
      )}

      {/* Safety Info Panel */}
      <SafetyInfoPanel />

      <div className="chips" ref={bpStrip} style={{ marginBottom: eqOpts.length > 1 || catOpts.length > 1 ? 8 : 12 }}>
        <button className={'chip nocap' + (!bp ? ' on' : '')} onClick={() => { setBp(''); setEq(''); setShown(40) }}>{t('All')}</button>
        {BODYPARTS.map(b => <button key={b} className={'chip' + (bp === b ? ' on' : '')} onClick={() => { setBp(b); setShown(40) }}>{t(b)}</button>)}
      </div>
      {catOpts.length > 1 && (
        <div className="chips" ref={catStrip} style={{ marginBottom: 8 }}>
          <button className={'chip nocap' + (!catOn ? ' on' : '')} onClick={() => { setCat(''); setShown(40) }}>{t('Any type')}</button>
          {catOpts.map(x => <button key={x} className={'chip' + (catOn === x ? ' on' : '')} onClick={() => { setCat(x); setShown(40) }}>{t(x)}</button>)}
        </div>
      )}
      {eqOpts.length > 1 && (
        <div className="chips" ref={eqStrip} style={{ marginBottom: 12 }}>
          <button className={'chip nocap' + (!eqOn ? ' on' : '')} onClick={() => { setEq(''); setShown(40) }}>{t('Any equipment')}</button>
          {eqOpts.map(x => <button key={x} className={'chip' + (eqOn === x ? ' on' : '')} onClick={() => { setEq(x); setShown(40) }}>{t(x)}</button>)}
        </div>
      )}

      <div className={'list' + (S.exerciseView === 'cards' ? ' ex-grid' : '')}>
        <div className="item ex-new" {...tappable(() => customExSheet(null, ex => exerciseDetailSheet(ex), q.trim()))}>
          <div className="thumb thumb-x"><Icon name="plusCircle" /></div>
          <div className="grow"><div className="tt">{t('Create your own exercise')}</div><div className="ss">{t('name + body part, and a photo or video if you like')}</div></div><Icon name="plus" className="chev" />
        </div>
        {f.slice(0, shown).map(row)}
        {f.length === 0 && !similar.length && <div className="empty"><div className="ico"><Icon name="magnifier" /></div>{t('No match')}</div>}
        {similar.length > 0 && <h4 className="sec similar-label">{f.length ? t('Similar exercises') : t('No exact match. These come close:')}</h4>}
        {similar.map(row)}
      </div>
      {f.length > shown && (
        <>
          <div style={{ height: 10 }} />
          <Button ref={moreRef} onClick={() => setShown(s => s + 40)}>{t('Show more')}</Button>
        </>
      )}
    </>
  )
}

// Helper functions
function getJointLabel(joint) {
  const labels = {
    shoulder: 'Ombro',
    knee: 'Joelho',
    hip: 'Quadril',
    thoracic: 'Coluna Torácica',
    lumbar: 'Coluna Lombar'
  }
  return labels[joint] || joint
}

function getMobilityLabel(level) {
  const labels = {
    good: 'Boa 🟢',
    limited: 'Limitada 🟡',
    restricted: 'Restrita 🔴'
  }
  return labels[level] || level
}

function getRiskExplanation(level) {
  const explanations = {
    low: 'Seu perfil não apresenta contraindicações significativas. Pode treinar normalmente.',
    moderate: 'Alguns exercícios foram filtrados por segurança. Alternativas seguras estão disponíveis.',
    high: 'Múltiplos exercícios são contraindicados. Foque nas alternativas seguras sugeridas.'
  }
  return explanations[level] || ''
}

function showAlternatives(exId) {
  // Could open a modal with alternatives
  console.log('Show alternatives for:', exId)
}

export default EnhancedLibrary