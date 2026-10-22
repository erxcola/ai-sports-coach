// src/frontend/src/components/coach/NutritionCard.jsx
// Card de plano nutricional modular com seletor de refeicoes, horarios customizaveis e livro de receitas fit integradas.

import React, { useState, useEffect } from 'react';
import { Section, Row, Segmented, Button } from '../ui.jsx';
import Icon from '../Icon.jsx';
import { RECIPE_BOOK, getRecipesForMeal, generateModularDietSchedule } from '../../lib/ai/recipe-book.js';
import { useUI } from '../../store/useUI.js';
import { useStore } from '../../store/useStore.js';

export function NutritionCard({ plan }) {
  if (!plan) return null;

  const totalCalories = plan.caloricTarget || 2200;
  const targetMacros = {
    protein: plan.macronutrients?.protein || plan.macros?.proteinGrams || 160,
    carbs: plan.macronutrients?.carbohydrates || plan.macros?.carbGrams || 220,
    fats: plan.macronutrients?.fats || plan.macros?.fatGrams || 65,
    fiber: plan.macronutrients?.fiber || 30
  };

  // State: meals count (3, 4, 5, or 6)
  const [mealCount, setMealCount] = useState(4);
  const [meals, setMeals] = useState(() => 
    generateModularDietSchedule(4, totalCalories, targetMacros)
  );

  // Substitution modal state
  const [substitutionTargetMealId, setSubstitutionTargetMealId] = useState(null);
  const [selectedRecipeDetail, setSelectedRecipeDetail] = useState(null);
  const [editingTimeMealId, setEditingTimeMealId] = useState(null);

  // Update meals schedule when mealCount changes
  const handleMealCountChange = (count) => {
    setMealCount(count);
    const newSchedule = generateModularDietSchedule(count, totalCalories, targetMacros);
    setMeals(newSchedule);
    persistToStore(newSchedule);
    useUI.getState().toast(`Plano redistribuído em ${count} refeições diárias!`);
  };

  // Persist customized diet schedule to openGym store
  const persistToStore = (currentMeals) => {
    const store = useStore.getState();
    if (store && store.update) {
      store.update(mut => {
        if (!mut.dietPlan) mut.dietPlan = {};
        mut.dietPlan.caloricTarget = totalCalories;
        mut.dietPlan.mealsPerDay = mealCount;
        mut.dietPlan.meals = currentMeals;
        mut.dietPlan.macros = {
          proteinGrams: targetMacros.protein,
          carbGrams: targetMacros.carbs,
          fatGrams: targetMacros.fats
        };
        mut.dietPlan.updatedAt = Date.now();
      }, true);
    }
  };

  // Handle recipe substitution
  const handleApplyRecipe = (mealId, recipe) => {
    const updated = meals.map(m => {
      if (m.id === mealId) {
        return {
          ...m,
          currentRecipe: recipe,
          calories: recipe.calories,
          protein: recipe.protein,
          carbs: recipe.carbs,
          fat: recipe.fat
        };
      }
      return m;
    });
    setMeals(updated);
    persistToStore(updated);
    setSubstitutionTargetMealId(null);
    setSelectedRecipeDetail(null);
    useUI.getState().toast(`Refeição substituída por: ${recipe.name}!`);
  };

  // Handle time update
  const handleTimeChange = (mealId, newTime) => {
    const updated = meals.map(m => m.id === mealId ? { ...m, time: newTime } : m);
    setMeals(updated);
    persistToStore(updated);
    setEditingTimeMealId(null);
  };

  const activeSubstitutionMeal = meals.find(m => m.id === substitutionTargetMealId);
  const availableRecipes = activeSubstitutionMeal ? getRecipesForMeal(activeSubstitutionMeal.category) : [];

  return (
    <div className="coach-nutrition-native">
      {/* 1. Header & Strategy Card */}
      <div className="coach-native-box" style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--acc)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {plan.strategy || 'Recomposição Corporal'}
          </span>
          <span style={{ fontSize: 12, color: 'var(--label-2)' }}>
            Meta Clínica Individualizada
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 12 }}>
          <span style={{ fontSize: 32, fontWeight: 800, color: 'var(--label)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
            {totalCalories.toLocaleString()}
          </span>
          <span style={{ fontSize: 14, color: 'var(--label-2)', fontWeight: 500 }}>
            kcal / dia
          </span>
        </div>

        {/* Macro Progress Pills */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          <div className="c-sub-metric">
            <span className="c-sub-val" style={{ color: 'var(--blue)' }}>{targetMacros.protein}g</span>
            <span className="c-sub-lbl">Proteína</span>
          </div>
          <div className="c-sub-metric">
            <span className="c-sub-val" style={{ color: 'var(--orange)' }}>{targetMacros.carbs}g</span>
            <span className="c-sub-lbl">Carboidrato</span>
          </div>
          <div className="c-sub-metric">
            <span className="c-sub-val" style={{ color: 'var(--pink)' }}>{targetMacros.fats}g</span>
            <span className="c-sub-lbl">Gorduras</span>
          </div>
          <div className="c-sub-metric">
            <span className="c-sub-val" style={{ color: 'var(--green)' }}>{targetMacros.fiber}g</span>
            <span className="c-sub-lbl">Fibras</span>
          </div>
        </div>
      </div>

      {/* 2. Modular Meals Per Day Selector */}
      <Section title="Frequência & Horários das Refeições" footer="Escolha a quantidade de refeições que melhor se adapta à sua rotina e estipule os horários.">
        <div style={{ padding: '8px 14px' }}>
          <Segmented
            value={mealCount}
            onChange={handleMealCountChange}
            options={[
              { value: 3, label: '3 Refeições' },
              { value: 4, label: '4 Refeições' },
              { value: 5, label: '5 Refeições' },
              { value: 6, label: '6 Refeições' }
            ]}
          />
        </div>
      </Section>

      {/* 3. Meals List with Timing, Suggestions & Substitution Book */}
      <div style={{ marginTop: 14 }}>
        {meals.map((meal, index) => {
          const hasRecipe = !!meal.currentRecipe;

          return (
            <Section key={meal.id} title={`${meal.name} · ${meal.time}`} style={{ marginBottom: 14 }}>
              {/* Meal Timing & Macro summary */}
              <div style={{ padding: '12px 14px', background: 'var(--surface-2)', borderBottom: 'var(--hair) solid var(--sep-op)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--label)' }}>
                      ⏱️ Horário:
                    </span>
                    {editingTimeMealId === meal.id ? (
                      <input
                        type="time"
                        defaultValue={meal.time}
                        onBlur={(e) => handleTimeChange(meal.id, e.target.value)}
                        autoFocus
                        style={{
                          background: 'var(--surface)',
                          border: '1px solid var(--acc)',
                          borderRadius: 6,
                          color: 'var(--label)',
                          padding: '2px 6px',
                          fontSize: 13
                        }}
                      />
                    ) : (
                      <button
                        onClick={() => setEditingTimeMealId(meal.id)}
                        style={{
                          background: 'var(--surface)',
                          border: 'var(--hair) solid var(--sep-op)',
                          borderRadius: 6,
                          padding: '2px 8px',
                          color: 'var(--acc)',
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {meal.time} ✎
                      </button>
                    )}
                  </div>

                  {/* Meal Macro Badge */}
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--label)', fontVariantNumeric: 'tabular-nums' }}>
                    {meal.calories} kcal <span style={{ color: 'var(--label-2)', fontWeight: 400 }}>({meal.protein}g P · {meal.carbs}g C · {meal.fat}g G)</span>
                  </div>
                </div>
              </div>

              {/* Meal Content / Plate */}
              <div style={{ padding: '14px', background: 'var(--surface)' }}>
                {hasRecipe ? (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--label)' }}>
                        🍲 {meal.currentRecipe.name}
                      </span>
                      <span style={{ fontSize: 11, background: 'var(--acc-soft)', color: 'var(--acc)', padding: '2px 6px', borderRadius: 6, fontWeight: 600 }}>
                        {meal.currentRecipe.prepTime}
                      </span>
                    </div>

                    <div style={{ fontSize: 13, color: 'var(--label-2)', marginBottom: 10, lineHeight: 1.4 }}>
                      <strong>Ingredientes:</strong>
                      <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
                        {meal.currentRecipe.ingredients.map((ing, i) => (
                          <li key={i}>{ing}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ fontSize: 12, color: 'var(--label-3)', background: 'var(--surface-2)', padding: '8px 10px', borderRadius: 8 }}>
                      📖 <strong>Modo de Preparo:</strong> {meal.currentRecipe.instructions}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--label)', marginBottom: 4 }}>
                      🍽️ Sugestão Padrão:
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--label-2)', lineHeight: 1.4 }}>
                      {meal.defaultFood}
                    </div>
                  </div>
                )}

                {/* Substitution Button */}
                <div style={{ marginTop: 12 }}>
                  <Button
                    size="sm"
                    variant="tinted"
                    icon="repeat"
                    onClick={() => setSubstitutionTargetMealId(meal.id)}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {hasRecipe ? 'Trocar por Outra Receita Fit' : '🔄 Substituir por Receita Gostosa'}
                  </Button>
                </div>
              </div>
            </Section>
          );
        })}
      </div>

      {/* 4. Hydration & Supplementation Section */}
      <Section title="Hidratação & Suporte Clínico" footer="Consumo mínimo de água para otimizar síntese proteica e filtração glomerular.">
        <Row
          icon="flame"
          iconTint="var(--blue)"
          title="Meta Hídrica Diária"
          subtitle={plan.hydration || `${((plan.weight || 75) * 40 / 1000).toFixed(1)}L de água pura por dia`}
        />
        {plan.jointSupport?.length > 0 && (
          <Row
            icon="shield"
            iconTint="var(--green)"
            title="Suporte Articular"
            subtitle={plan.jointSupport.join(' · ')}
          />
        )}
      </Section>

      {/* 5. Recipe Book & Substitution Modal */}
      {substitutionTargetMealId && (
        <div className="mobility-modal-backdrop" onClick={() => setSubstitutionTargetMealId(null)}>
          <div className="mobility-modal-card" onClick={e => e.stopPropagation()}>
            <div className="mobility-header">
              <div>
                <h3 className="mobility-title">📖 Livro de Receitas Fit</h3>
                <div className="mobility-subtitle">
                  Substitua {activeSubstitutionMeal?.name} mantendo seus macros calibrados
                </div>
              </div>
              <button className="mobility-close-btn" onClick={() => setSubstitutionTargetMealId(null)}>
                ✕
              </button>
            </div>

            <div style={{ padding: '14px 16px', maxHeight: '65vh', overflowY: 'auto' }}>
              <div style={{ fontSize: 12, color: 'var(--label-2)', marginBottom: 12 }}>
                Enjoou do prato atual? Escolha uma das receitas gastronômicas abaixo com as mesmas calorias e proteínas calculadas:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {availableRecipes.map(recipe => (
                  <div
                    key={recipe.id}
                    onClick={() => handleApplyRecipe(substitutionTargetMealId, recipe)}
                    style={{
                      background: 'var(--surface)',
                      border: 'var(--hair) solid var(--sep-op)',
                      borderRadius: 12,
                      padding: 12,
                      cursor: 'pointer',
                      transition: 'border 140ms'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--label)' }}>
                        {recipe.name}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--acc)', fontWeight: 700 }}>
                        {recipe.calories} kcal
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                      {recipe.tags.map(t => (
                        <span key={t} style={{ fontSize: 10, background: 'var(--surface-2)', color: 'var(--label-2)', padding: '2px 6px', borderRadius: 4 }}>
                          {t}
                        </span>
                      ))}
                    </div>

                    <div style={{ fontSize: 12, color: 'var(--label-2)', marginBottom: 6 }}>
                      {recipe.ingredients.slice(0, 3).join(' · ')}...
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: 'var(--label-3)' }}>
                        {recipe.protein}g Proteína · {recipe.carbs}g Carbs · {recipe.fat}g Gord
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--acc)' }}>
                        Escolher esta ➔
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NutritionCard;
