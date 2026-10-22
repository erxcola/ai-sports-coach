// src/frontend/src/components/coach/FoodSearchModal.jsx
// Modal interativo de busca e calculo de macronutrientes por alimento real (Tabela TACO Brasil & Open Food Facts).

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../ui.jsx';
import Icon from '../Icon.jsx';
import { searchUnifiedFoods, searchLocalTaco } from '../../lib/ai/nutrition-api.js';

export function FoodSearchModal({ isOpen, onClose, targetMeal, onApplyFood }) {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState(() => searchLocalTaco(''));
  const [loading, setLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [portionGrams, setPortionGrams] = useState(150);

  // Busca reativa com debounce
  useEffect(() => {
    let cancelled = false;
    if (!query || query.trim().length === 0) {
      setResults(searchLocalTaco(''));
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await searchUnifiedFoods(query, { includeOnline: true });
        if (!cancelled) {
          setResults(res);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setResults(searchLocalTaco(query));
          setLoading(false);
        }
      }
    }, 280);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  // Se o alimento selecionado mudar, ajusta porção padrão
  useEffect(() => {
    if (selectedFood) {
      // Se for azeite ou sementes, porção padrão menor; carnes/arroz 150g
      if (selectedFood.name.toLowerCase().includes('azeite')) setPortionGrams(15);
      else if (selectedFood.name.toLowerCase().includes('pasta de amendoim')) setPortionGrams(20);
      else if (selectedFood.name.toLowerCase().includes('castanha')) setPortionGrams(20);
      else if (selectedFood.name.toLowerCase().includes('whey')) setPortionGrams(40);
      else setPortionGrams(150);
    }
  }, [selectedFood]);

  // Cálculo reativo dos macros para a porção escolhida
  const calculated = useMemo(() => {
    if (!selectedFood) return null;
    return selectedFood.calculate(portionGrams);
  }, [selectedFood, portionGrams]);

  const handleConfirm = () => {
    if (!selectedFood || !calculated) return;
    onApplyFood({
      mealId: targetMeal?.id,
      foodName: selectedFood.name + (selectedFood.brand ? ` (${selectedFood.brand})` : ''),
      portionStr: `${calculated.grams}g`,
      grams: calculated.grams,
      p: calculated.protein,
      c: calculated.carbs,
      f: calculated.fats,
      fiber: calculated.fiber,
      kcal: calculated.kcal,
      source: selectedFood.source
    });
    onClose();
  };

  const QUICK_GRAM_PRESETS = [30, 50, 100, 150, 200, 250, 300];

  return (
    <div className="mobility-modal-backdrop" onClick={onClose}>
      <div className="mobility-modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 540 }}>
        {/* Header */}
        <div className="mobility-header">
          <div>
            <h3 className="mobility-title">
              🔍 Tabela Nutricional & Macros
            </h3>
            <div className="mobility-subtitle">
              {targetMeal ? `Adicionar ou Substituir em: ${targetMeal.title || 'Refeição'}` : 'Tabela TACO (UNICAMP) & Open Food Facts'}
            </div>
          </div>
          <button className="mobility-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Search Bar */}
        <div style={{ padding: '12px 16px 8px 16px', background: 'var(--surface-2)', borderBottom: 'var(--hair) solid var(--sep-op)' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: 12, color: 'var(--label-2)', pointerEvents: 'none' }}>
              <Icon name="search" />
            </span>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar frango, patinho, arroz, aveia, whey, iogurte..."
              style={{
                width: '100%',
                padding: '10px 36px 10px 38px',
                background: 'var(--surface)',
                border: 'var(--hair) solid var(--sep-op)',
                borderRadius: 10,
                color: 'var(--label)',
                fontSize: 14,
                outline: 'none'
              }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{
                  position: 'absolute',
                  right: 10,
                  background: 'none',
                  border: 'none',
                  color: 'var(--label-2)',
                  fontSize: 16,
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8, fontSize: 11, color: 'var(--label-2)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              🇧🇷 <strong>TACO (UNICAMP)</strong>
            </span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              🌐 <strong>Open Food Facts</strong>
            </span>
            {loading && <span style={{ marginLeft: 'auto', color: 'var(--blue)' }}>Buscando...</span>}
          </div>
        </div>

        {/* Content Area: Selected Food Macro Calculator OR Search List */}
        <div style={{ maxHeight: '55vh', overflowY: 'auto', padding: '12px 16px' }}>
          {selectedFood ? (
            // DETALHE DO ALIMENTO & CALCULADORA DE PORÇÃO
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--label)' }}>
                    {selectedFood.name}
                  </div>
                  {selectedFood.brand && (
                    <div style={{ fontSize: 13, color: 'var(--blue)', fontWeight: 600 }}>
                      Marca: {selectedFood.brand}
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: 'var(--label-2)', marginTop: 2 }}>
                    Fonte oficial: {selectedFood.source}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFood(null)}
                  style={{
                    background: 'var(--surface-2)',
                    border: 'var(--hair) solid var(--sep-op)',
                    borderRadius: 6,
                    padding: '4px 8px',
                    fontSize: 12,
                    color: 'var(--label)',
                    cursor: 'pointer'
                  }}
                >
                  Trocar Alimento
                </button>
              </div>

              {/* Ajuste de Porção */}
              <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: '14px', marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--label)' }}>
                    Porção para esta refeição:
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input
                      type="number"
                      min="1"
                      max="2000"
                      value={portionGrams}
                      onChange={e => setPortionGrams(Math.max(1, Number(e.target.value) || 0))}
                      style={{
                        width: 75,
                        textAlign: 'center',
                        fontSize: 16,
                        fontWeight: 700,
                        padding: '6px',
                        borderRadius: 8,
                        background: 'var(--surface)',
                        border: 'var(--hair) solid var(--acc)',
                        color: 'var(--label)'
                      }}
                    />
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--label)' }}>g</span>
                  </div>
                </div>

                {/* Preset Chips */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {QUICK_GRAM_PRESETS.map(g => (
                    <button
                      key={g}
                      onClick={() => setPortionGrams(g)}
                      style={{
                        background: portionGrams === g ? 'var(--acc)' : 'var(--surface)',
                        color: portionGrams === g ? '#000' : 'var(--label)',
                        border: 'var(--hair) solid var(--sep-op)',
                        borderRadius: 16,
                        padding: '4px 10px',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {g}g
                    </button>
                  ))}
                </div>
              </div>

              {/* Macro Breakdown Card */}
              {calculated && (
                <div style={{ background: 'var(--surface)', border: 'var(--hair) solid var(--sep-op)', borderRadius: 12, padding: '14px', marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                    <span style={{ fontSize: 13, color: 'var(--label-2)', fontWeight: 600 }}>Total Calculado:</span>
                    <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--acc)' }}>
                      {calculated.kcal} <span style={{ fontSize: 14 }}>kcal</span>
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, textAlign: 'center' }}>
                    <div style={{ background: 'var(--surface-2)', padding: '8px 4px', borderRadius: 8 }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--blue)' }}>{calculated.protein}g</div>
                      <div style={{ fontSize: 11, color: 'var(--label-2)', fontWeight: 600 }}>Proteína</div>
                    </div>
                    <div style={{ background: 'var(--surface-2)', padding: '8px 4px', borderRadius: 8 }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--orange)' }}>{calculated.carbs}g</div>
                      <div style={{ fontSize: 11, color: 'var(--label-2)', fontWeight: 600 }}>Carboidrato</div>
                    </div>
                    <div style={{ background: 'var(--surface-2)', padding: '8px 4px', borderRadius: 8 }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--yellow)' }}>{calculated.fats}g</div>
                      <div style={{ fontSize: 11, color: 'var(--label-2)', fontWeight: 600 }}>Gordura</div>
                    </div>
                    <div style={{ background: 'var(--surface-2)', padding: '8px 4px', borderRadius: 8 }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--green)' }}>{calculated.fiber}g</div>
                      <div style={{ fontSize: 11, color: 'var(--label-2)', fontWeight: 600 }}>Fibras</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // LISTA DE RESULTADOS DA PESQUISA
            <div>
              {results.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--label-2)', fontSize: 14 }}>
                  Nenhum alimento encontrado. Tente buscar por palavras simples como "arroz", "carne" ou "queijo".
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {results.map(item => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedFood(item)}
                      style={{
                        padding: '10px 12px',
                        background: 'var(--surface)',
                        border: 'var(--hair) solid var(--sep-op)',
                        borderRadius: 10,
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ flex: 1, paddingRight: 8 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--label)', lineHeight: 1.3 }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--label-2)', marginTop: 2, display: 'flex', gap: 6, alignItems: 'center' }}>
                          <span style={{ color: item.source.includes('TACO') ? 'var(--green)' : 'var(--blue)', fontWeight: 600 }}>
                            {item.source}
                          </span>
                          {item.brand && <span>• {item.brand}</span>}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--label)' }}>
                          {item.per100g.kcal} kcal <span style={{ fontSize: 10, color: 'var(--label-2)' }}>/ 100g</span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--label-2)', marginTop: 1 }}>
                          P: <strong style={{ color: 'var(--blue)' }}>{item.per100g.protein}g</strong> · C: {item.per100g.carbs}g · G: {item.per100g.fats}g
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ padding: '12px 16px', borderTop: 'var(--hair) solid var(--sep-op)', display: 'flex', gap: 8 }}>
          {selectedFood ? (
            <>
              <Button variant="secondary" onClick={() => setSelectedFood(null)} style={{ flex: 1, justifyContent: 'center' }}>
                Voltar à Busca
              </Button>
              <Button variant="primary" onClick={handleConfirm} style={{ flex: 2, justifyContent: 'center' }}>
                ✓ Aplicar na Refeição ({calculated?.kcal} kcal)
              </Button>
            </>
          ) : (
            <Button variant="secondary" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
              Fechar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FoodSearchModal;
