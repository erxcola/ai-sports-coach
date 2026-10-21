// src/frontend/src/components/coach/NutritionCard.jsx
// Card de plano nutricional

import React from 'react';

export function NutritionCard({ plan }) {
  if (!plan) return null;

  const strategyLabels = {
    SURPLUS: { label: 'Superávit 📈', color: '#3b82f6' },
    DEFICIT: { label: 'Déficit 📉', color: '#ef4444' },
    RECOMP: { label: 'Manutenção ➡️', color: '#10b981' }
  };

  const strategy = strategyLabels[plan.strategy] || strategyLabels.RECOMP;

  return (
    <div className="coach-card nutrition-card">
      <div className="card-header">
        <h3>🥗 Plano Nutricional Clínico</h3>
        <span className="strategy-badge" style={{ backgroundColor: strategy.color }}>
          {strategy.label}
        </span>
      </div>

      <div className="card-content">
        {/* Caloric Target */}
        <div className="caloric-target">
          <div className="big-number">{plan.caloricTarget.toLocaleString()}</div>
          <div className="big-label">kcal/dia</div>
        </div>

        {/* Macronutrients */}
        <div className="macros-grid">
          <div className="macro-card protein">
            <div className="macro-icon">🥩</div>
            <div className="macro-value">{plan.macronutrients.protein}g</div>
            <div className="macro-label">Proteína</div>
            <div className="macro-detail">
              {plan.perMealDistribution?.proteinPerMeal
                ? `~${plan.perMealDistribution.proteinPerMeal}g/refeição`
                : ''}
            </div>
          </div>

          <div className="macro-card carbs">
            <div className="macro-icon">🍚</div>
            <div className="macro-value">{plan.macronutrients.carbohydrates}g</div>
            <div className="macro-label">Carboidratos</div>
            <div className="macro-detail">
              {plan.perMealDistribution?.carbDistribution
                ? `Dist: ${plan.perMealDistribution.carbDistribution.join(' | ')}g`
                : ''}
            </div>
          </div>

          <div className="macro-card fats">
            <div className="macro-icon">🥑</div>
            <div className="macro-value">{plan.macronutrients.fats}g</div>
            <div className="macro-label">Gorduras</div>
            <div className="macro-detail">
              {plan.perMealDistribution?.fatDistribution
                ? `${plan.perMealDistribution.fatDistribution[0]}g/refeição`
                : ''}
            </div>
          </div>

          <div className="macro-card fiber">
            <div className="macro-icon">🥦</div>
            <div className="macro-value">{plan.macronutrients.fiber}g</div>
            <div className="macro-label">Fibras</div>
          </div>
        </div>

        {/* Meal Distribution */}
        {plan.perMealDistribution?.mealsPerDay && (
          <div className="meals-section">
            <h4>🍽️ Distribuição: {plan.perMealDistribution.mealsPerDay} refeições/dia</h4>
            <div className="meals-timing">
              <div className="timing-item">
                <strong>Pré-treino:</strong> {plan.timing?.preWorkout || 'Carbs 30-60g + Proteína 20-30g (1-2h antes)'}
              </div>
              <div className="timing-item">
                <strong>Pós-treino:</strong> {plan.timing?.postWorkout || 'Proteína 30-40g + Carbs 40-60g (até 2h)'}
              </div>
              <div className="timing-item">
                <strong>Pré-sono:</strong> {plan.timing?.preSleep || 'Caseína 30-40g ou iogurte grego (30-60min antes)'}
              </div>
            </div>
          </div>
        )}

        {/* Hydration */}
        {plan.hydration && (
          <div className="hydration-section">
            <h4>💧 Hidratação</h4>
            <p>{plan.hydration}</p>
          </div>
        )}

        {/* Joint Support */}
        {plan.jointSupport?.length > 0 && (
          <div className="joint-support-section">
            <h4>🦴 Suporte Articular e Anti-inflamatório</h4>
            <ul className="supplement-list">
              {plan.jointSupport.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Micronutrients */}
        {plan.micronutrients && Object.keys(plan.micronutrients).length > 0 && (
          <details className="micronutrients-section">
            <summary>🔬 Micronutrientes Alvo (clique para expandir)</summary>
            <div className="micros-grid">
              {Object.entries(plan.micronutrients).map(([nutrient, value]) => (
                <div key={nutrient} className="micro-item">
                  <span className="micro-name">{formatNutrientName(nutrient)}</span>
                  <span className="micro-value">{value}{getNutrientUnit(nutrient)}</span>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

function formatNutrientName(name) {
  const names = {
    vitaminD: 'Vitamina D',
    vitaminK2: 'Vitamina K2',
    magnesium: 'Magnésio',
    zinc: 'Zinco',
    selenium: 'Selênio',
    iodine: 'Iodo',
    vitaminB12: 'Vitamina B12',
    folate: 'Folato',
    calcium: 'Cálcio',
    iron: 'Ferro',
    potassium: 'Potássio',
    sodium: 'Sódio'
  };
  return names[name] || name;
}

function getNutrientUnit(name) {
  const units = {
    vitaminD: ' UI',
    vitaminK2: ' mcg',
    magnesium: ' mg',
    zinc: ' mg',
    selenium: ' mcg',
    iodine: ' mcg',
    vitaminB12: ' mcg',
    folate: ' mcg',
    calcium: ' mg',
    iron: ' mg',
    potassium: ' mg',
    sodium: ' mg'
  };
  return units[name] || '';
}

export default NutritionCard;