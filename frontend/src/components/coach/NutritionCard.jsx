// src/frontend/src/components/coach/NutritionCard.jsx
// Card de plano nutricional ultra-modular: seletor de refeicoes, horarios customizaveis por refeicao,
// tabela de substituicao individual de alimentos (enjoou de frango/arroz) e livro de receitas fit completas.

import React, { useState } from 'react';
import { Section, Row, Segmented, Button } from '../ui.jsx';
import Icon from '../Icon.jsx';
import { RECIPE_BOOK, getRecipesForMeal, generateModularDietSchedule } from '../../lib/ai/recipe-book.js';
import { FOOD_SUBSTITUTIONS } from '../../lib/ai/food-substitutions.js';
import { BeginnerGlossaryModal } from './BeginnerGlossaryModal.jsx';
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

  const [mealCount, setMealCount] = useState(4);
  const [meals, setMeals] = useState(() => 
    generateModularDietSchedule(4, totalCalories, targetMacros)
  );

  // Modals state
  const [substitutionTargetMealId, setSubstitutionTargetMealId] = useState(null);
  const [ingredientSubTarget, setIngredientSubTarget] = useState(null); // { mealId, category: 'protein'|'carb'|'fat' }
  const [editingTimeMealId, setEditingTimeMealId] = useState(null);
  const [showSchedulePresets, setShowSchedulePresets] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);

  // Update meals schedule when mealCount changes
  const handleMealCountChange = (count) => {
    setMealCount(count);
    const newSchedule = generateModularDietSchedule(count, totalCalories, targetMacros);
    setMeals(newSchedule);
    persistToStore(newSchedule);
    useUI.getState().toast(`Plano redistribuído para ${count} refeições ao dia!`);
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

  // Quick schedule presets
  const applySchedulePreset = (presetTimes) => {
    const updated = meals.map((m, idx) => ({
      ...m,
      time: presetTimes[idx] || m.time
    }));
    setMeals(updated);
    persistToStore(updated);
    setShowSchedulePresets(false);
    useUI.getState().toast('Horários atualizados para sua rotina!');
  };

  // Individual food substitution
  const handleApplyIngredientSub = (mealId, item) => {
    const updated = meals.map(m => {
      if (m.id === mealId) {
        return {
          ...m,
          defaultFood: `${item.name} (${item.portion}) - ${m.defaultFood.replace(/^[^+]+(?=\+|$)/, '')}`.trim(),
          customSubApplied: item.name
        };
      }
      return m;
    });
    setMeals(updated);
    persistToStore(updated);
    setIngredientSubTarget(null);
    useUI.getState().toast(`Alimento substituído por: ${item.name}!`);
  };

  // Whole recipe substitution
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
    useUI.getState().toast(`Refeição trocada por: ${recipe.name}!`);
  };

  // Time modification
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
          <button
            onClick={() => setShowGlossary(true)}
            style={{
              background: 'var(--surface-2)',
              border: 'var(--hair) solid var(--sep-op)',
              color: 'var(--acc)',
              padding: '4px 10px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            ❓ Entender Termos
          </button>
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
            <span className="c-sub-lbl">Proteína (P)</span>
          </div>
          <div className="c-sub-metric">
            <span className="c-sub-val" style={{ color: 'var(--orange)' }}>{targetMacros.carbs}g</span>
            <span className="c-sub-lbl">Carboidrato (C)</span>
          </div>
          <div className="c-sub-metric">
            <span className="c-sub-val" style={{ color: 'var(--pink)' }}>{targetMacros.fats}g</span>
            <span className="c-sub-lbl">Gorduras (G)</span>
          </div>
          <div className="c-sub-metric">
            <span className="c-sub-val" style={{ color: 'var(--green)' }}>{targetMacros.fiber}g</span>
            <span className="c-sub-lbl">Fibras</span>
          </div>
        </div>
      </div>

      {/* 2. Frequency & Schedule Setup */}
      <Section title="Frequência & Horários das Refeições" footer="Escolha quantas vezes quer comer no dia e ajuste os horários de acordo com seu trabalho e treino.">
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

          {/* Quick Schedule Presets */}
          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--label-2)' }}>Rotinas prontas de horários:</span>
            <Button size="sm" variant="tinted" icon="clock" onClick={() => setShowSchedulePresets(!showSchedulePresets)}>
              {showSchedulePresets ? 'Ocultar Rotinas' : 'Modelos de Rotina'}
            </Button>
          </div>

          {showSchedulePresets && (
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6, background: 'var(--surface-2)', padding: 10, borderRadius: 10 }}>
              <button
                onClick={() => applySchedulePreset(['07:30', '12:30', '16:30', '20:00', '22:30', '10:00'])}
                style={{ textAlign: 'left', background: 'var(--surface)', border: 'none', padding: '8px 10px', borderRadius: 6, color: 'var(--label)', fontSize: 12, cursor: 'pointer' }}
              >
                ☀️ <strong>Rotina Comercial:</strong> Café 07:30 · Almoço 12:30 · Lanche 16:30 · Jantar 20:00
              </button>
              <button
                onClick={() => applySchedulePreset(['06:00', '08:30', '13:00', '19:30', '22:00', '11:00'])}
                style={{ textAlign: 'left', background: 'var(--surface)', border: 'none', padding: '8px 10px', borderRadius: 6, color: 'var(--label)', fontSize: 12, cursor: 'pointer' }}
              >
                🏋️ <strong>Treino Cedo (Manhã):</strong> Pré-treino 06:00 · Pós-treino 08:30 · Almoço 13:00 · Jantar 19:30
              </button>
              <button
                onClick={() => applySchedulePreset(['08:30', '13:00', '17:30', '21:30', '23:30', '11:30'])}
                style={{ textAlign: 'left', background: 'var(--surface)', border: 'none', padding: '8px 10px', borderRadius: 6, color: 'var(--label)', fontSize: 12, cursor: 'pointer' }}
              >
                🌙 <strong>Treino à Noite:</strong> Café 08:30 · Almoço 13:00 · Pré-Treino 17:30 · Jantar Pós 21:30
              </button>
              <button
                onClick={() => applySchedulePreset(['12:00', '15:30', '18:30', '20:30', '22:00', '14:00'])}
                style={{ textAlign: 'left', background: 'var(--surface)', border: 'none', padding: '8px 10px', borderRadius: 6, color: 'var(--label)', fontSize: 12, cursor: 'pointer' }}
              >
                ⏳ <strong>Jejum Intermitente (16/8):</strong> 1ª Refeição 12:00 · Lanche 15:30 · Jantar 18:30 · Ceia 20:30
              </button>
            </div>
          )}
        </div>
      </Section>

      {/* 3. Meals List with Interactive Timings, Ingredient Swap & Recipe Book */}
      <div style={{ marginTop: 14 }}>
        {meals.map((meal) => {
          const hasRecipe = !!meal.currentRecipe;

          return (
            <Section key={meal.id} title={`${meal.name}`} style={{ marginBottom: 14 }}>
              {/* Header with interactive time picker */}
              <div style={{ padding: '10px 14px', background: 'var(--surface-2)', borderBottom: 'var(--hair) solid var(--sep-op)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--label)' }}>
                      🕒 Horário:
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
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {meal.time} ✎
                      </button>
                    )}
                  </div>

                  {/* Meal Calories & Macros */}
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--label)', fontVariantNumeric: 'tabular-nums' }}>
                    {meal.calories} kcal <span style={{ color: 'var(--label-2)', fontWeight: 400 }}>({meal.protein}g P · {meal.carbs}g C · {meal.fat}g G)</span>
                  </div>
                </div>
              </div>

              {/* Meal Plate Content */}
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
                      <strong>Ingredientes da Receita:</strong>
                      <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
                        {meal.currentRecipe.ingredients.map((ing, i) => (
                          <li key={i}>{ing}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ fontSize: 12, color: 'var(--label-3)', background: 'var(--surface-2)', padding: '8px 10px', borderRadius: 8, marginBottom: 10 }}>
                      📖 <strong>Modo de Preparo:</strong> {meal.currentRecipe.instructions}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--label)', marginBottom: 4 }}>
                      🍽️ Prato Equilibrado Sugerido:
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--label-2)', lineHeight: 1.45, marginBottom: 8 }}>
                      {meal.defaultFood}
                    </div>
                  </div>
                )}

                {/* Modular Action Buttons: Ingredient Swap OR Whole Recipe Swap */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                  <Button
                    size="sm"
                    variant="tinted"
                    icon="repeat"
                    onClick={() => setIngredientSubTarget({ mealId: meal.id, category: 'protein' })}
                    style={{ flex: 1, minWidth: 140, justifyContent: 'center' }}
                  >
                    🥩 Enjoou da Carne?
                  </Button>
                  <Button
                    size="sm"
                    variant="tinted"
                    icon="repeat"
                    onClick={() => setIngredientSubTarget({ mealId: meal.id, category: 'carb' })}
                    style={{ flex: 1, minWidth: 140, justifyContent: 'center' }}
                  >
                    🍚 Enjoou do Arroz?
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    icon="sparkles"
                    onClick={() => setSubstitutionTargetMealId(meal.id)}
                    style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
                  >
                    {hasRecipe ? 'Trocar por Outra Receita Fit' : '📖 Escolher Receita Fit Completa'}
                  </Button>
                </div>
              </div>
            </Section>
          );
        })}
      </div>

      {/* 4. Hydration Section */}
      <Section title="Hidratação & Saúde Articular">
        <Row
          icon="flame"
          iconTint="var(--blue)"
          title="Meta de Água Pura"
          subtitle={plan.hydration || `${((plan.weight || 75) * 40 / 1000).toFixed(1)} Litros ao longo do dia`}
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

      {/* 5. Individual Ingredient Substitution Modal */}
      {ingredientSubTarget && (
        <div className="mobility-modal-backdrop" onClick={() => setIngredientSubTarget(null)}>
          <div className="mobility-modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div className="mobility-header">
              <div>
                <h3 className="mobility-title">
                  🔄 Substituições Nutricionais Equivalentes
                </h3>
                <div className="mobility-subtitle">
                  {FOOD_SUBSTITUTIONS[ingredientSubTarget.category]?.categoryName}
                </div>
              </div>
              <button className="mobility-close-btn" onClick={() => setIngredientSubTarget(null)}>✕</button>
            </div>

            <div style={{ padding: '14px 16px', maxHeight: '60vh', overflowY: 'auto' }}>
              <div style={{ fontSize: 12, color: 'var(--label-2)', marginBottom: 12 }}>
                Se você enjoou do alimento atual, escolha qualquer uma das opções abaixo na quantidade indicada para manter suas calorias e macros idênticos:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {FOOD_SUBSTITUTIONS[ingredientSubTarget.category]?.items.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleApplyIngredientSub(ingredientSubTarget.mealId, item)}
                    style={{
                      background: 'var(--surface)',
                      border: 'var(--hair) solid var(--sep-op)',
                      borderRadius: 10,
                      padding: '10px 12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--label)', display: 'block' }}>
                        {item.name}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--acc)', fontWeight: 600 }}>
                        Porção equivalente: {item.portion}
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--label)', display: 'block' }}>
                        {item.kcal} kcal
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--label-2)' }}>
                        {item.p}g P · {item.c}g C · {item.f}g G
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Whole Recipe Book Substitution Modal */}
      {substitutionTargetMealId && (
        <div className="mobility-modal-backdrop" onClick={() => setSubstitutionTargetMealId(null)}>
          <div className="mobility-modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <div className="mobility-header">
              <div>
                <h3 className="mobility-title">📖 Livro de Receitas Fit</h3>
                <div className="mobility-subtitle">
                  Substitua {activeSubstitutionMeal?.name} mantendo seus macros calibrados
                </div>
              </div>
              <button className="mobility-close-btn" onClick={() => setSubstitutionTargetMealId(null)}>✕</button>
            </div>

            <div style={{ padding: '14px 16px', maxHeight: '65vh', overflowY: 'auto' }}>
              <div style={{ fontSize: 12, color: 'var(--label-2)', marginBottom: 12 }}>
                Enjoou do prato tradicional? Toque em uma das receitas fit abaixo para aplicá-la diretamente no lugar da refeição:
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
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--label)' }}>
                        {recipe.name}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--acc)', fontWeight: 700 }}>
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

      {/* 7. Beginner Glossary Modal */}
      <BeginnerGlossaryModal
        isOpen={showGlossary}
        onClose={() => setShowGlossary(false)}
      />
    </div>
  );
}

export default NutritionCard;
