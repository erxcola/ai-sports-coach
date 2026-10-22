import React, { useState, useMemo } from 'react';
import { RECIPE_BOOK } from '../../lib/ai/recipe-book';

export default function RecipeBookModal({ isOpen, onClose, onSelectRecipe, targetMeal, currentGoal }) {
  const [selectedPhase, setSelectedPhase] = useState(() => {
    if (!currentGoal) return 'TODOS';
    const g = currentGoal.toLowerCase();
    if (g.includes('cut') || g.includes('def') || g.includes('perda')) return 'CUTTING';
    if (g.includes('bulk') || g.includes('hip') || g.includes('massa')) return 'BULKING';
    if (g.includes('rec')) return 'RECOMP';
    return 'TODOS';
  });
  const [selectedCategory, setSelectedCategory] = useState('TODAS');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);

  const filteredRecipes = useMemo(() => {
    return RECIPE_BOOK.filter(r => {
      // Phase filter
      if (selectedPhase !== 'TODOS' && r.phase.toUpperCase() !== selectedPhase.toUpperCase()) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'TODAS') {
        const cat = r.category.toUpperCase();
        if (selectedCategory === 'CAFÉ' && !cat.includes('CAFÉ')) return false;
        if (selectedCategory === 'ALMOÇO' && !cat.includes('ALMOÇO')) return false;
        if (selectedCategory === 'JANTAR' && !cat.includes('JANTAR')) return false;
        if (selectedCategory === 'LANCHE' && !cat.includes('LANCHE') && !cat.includes('SNACK') && !cat.includes('CEIA')) return false;
        if (selectedCategory === 'SOBREMESA' && !cat.includes('SOBREMESA')) return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = r.title.toLowerCase().includes(q);
        const matchesMeta = r.meta?.toLowerCase().includes(q);
        const matchesIng = r.ingredients?.some(i => i.toLowerCase().includes(q));
        if (!matchesTitle && !matchesMeta && !matchesIng) return false;
      }
      return true;
    });
  }, [selectedPhase, selectedCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '12px'
    }}>
      <div style={{
        background: 'var(--surface, #1e222b)',
        color: 'var(--fg, #e1e7ec)',
        width: '100%',
        maxWidth: '540px',
        maxHeight: '90vh',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Header */}
        <div style={{
          padding: '14px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--surface-2, #252a36)'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>📖</span> Enciclopédia Fit de Receitas
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', opacity: 0.7 }}>
              {targetMeal ? `Substituir em: "${targetMeal.name}"` : '36 receitas com pesagem e macros por porção'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--fg, #e1e7ec)',
              fontSize: '1.3rem',
              cursor: 'pointer',
              padding: '4px 8px',
              opacity: 0.8
            }}
          >
            ✕
          </button>
        </div>

        {/* Phase Tabs */}
        <div style={{
          display: 'flex',
          gap: '6px',
          padding: '10px 14px 4px 14px',
          overflowX: 'auto',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          {[
            { id: 'TODOS', label: '🔥 Todas (36)' },
            { id: 'CUTTING', label: '✂️ Cutting (12)' },
            { id: 'BULKING', label: '💪 Bulking (12)' },
            { id: 'RECOMP', label: '⚡ Recomp (12)' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPhase(p.id)}
              style={{
                flex: '0 0 auto',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: '600',
                border: '1px solid',
                borderColor: selectedPhase === p.id ? 'var(--acc, #3b82f6)' : 'rgba(255, 255, 255, 0.1)',
                background: selectedPhase === p.id ? 'rgba(59, 130, 246, 0.2)' : 'var(--surface-2, #252a36)',
                color: selectedPhase === p.id ? 'var(--acc, #60a5fa)' : 'var(--fg, #e1e7ec)',
                cursor: 'pointer'
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Search Bar & Category Filters */}
        <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '0.85rem' }}>🔍</span>
            <input
              type="text"
              placeholder="Buscar por receita ou ingrediente (ex: banana, tilápia, aveia)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '8px 12px 8px 32px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                background: 'var(--surface-2, #252a36)',
                color: 'var(--fg, #e1e7ec)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            {[
              { id: 'TODAS', label: 'Todas Categorias' },
              { id: 'CAFÉ', label: '☕ Café da Manhã' },
              { id: 'ALMOÇO', label: '🍗 Almoço' },
              { id: 'JANTAR', label: '🥩 Jantar' },
              { id: 'LANCHE', label: '🥪 Lanches / Snacks' },
              { id: 'SOBREMESA', label: '🍨 Sobremesas Fit' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  flex: '0 0 auto',
                  padding: '4px 10px',
                  borderRadius: '16px',
                  fontSize: '0.72rem',
                  fontWeight: selectedCategory === cat.id ? '600' : '400',
                  border: '1px solid',
                  borderColor: selectedCategory === cat.id ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
                  background: selectedCategory === cat.id ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                  color: 'var(--fg, #e1e7ec)',
                  cursor: 'pointer'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recipe List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '4px 14px 14px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {filteredRecipes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 10px', opacity: 0.6, fontSize: '0.85rem' }}>
              Nenhuma receita encontrada para os filtros selecionados.
            </div>
          ) : (
            filteredRecipes.map(recipe => {
              const isExpanded = expandedRecipeId === recipe.id;
              const phaseColor = recipe.phase === 'CUTTING' ? '#ef4444' : recipe.phase === 'BULKING' ? '#10b981' : '#3b82f6';

              return (
                <div
                  key={recipe.id}
                  style={{
                    background: 'var(--surface-2, #252a36)',
                    borderRadius: '12px',
                    border: isExpanded ? `1px solid ${phaseColor}` : '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {/* Top Badges & Title */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: '700',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: `${phaseColor}22`,
                        color: phaseColor,
                        border: `1px solid ${phaseColor}44`,
                        letterSpacing: '0.5px'
                      }}>
                        {recipe.phase}
                      </span>
                      <span style={{
                        fontSize: '0.65rem',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        opacity: 0.8
                      }}>
                        {recipe.category}
                      </span>
                      <span style={{
                        fontSize: '0.65rem',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        opacity: 0.8,
                        marginLeft: 'auto'
                      }}>
                        ⏱ {recipe.time}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.95rem', fontWeight: '700', lineHeight: 1.3 }}>
                      {recipe.title}
                    </div>

                    {recipe.meta && (
                      <div style={{ fontSize: '0.72rem', opacity: 0.65, marginTop: '2px' }}>
                        {recipe.meta.replace(/■\s*Tempo:[^|]+\|\s*■\s*Porção:[^|]+\|\s*■\s*/, '')}
                      </div>
                    )}
                  </div>

                  {/* Macros Banner */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '4px',
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '6px 8px',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#fbbf24' }}>{recipe.calories}</div>
                      <div style={{ fontSize: '0.62rem', opacity: 0.6 }}>kcal</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#38bdf8' }}>{recipe.protein}g</div>
                      <div style={{ fontSize: '0.62rem', opacity: 0.6 }}>Proteína</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#a78bfa' }}>{recipe.carbs}g</div>
                      <div style={{ fontSize: '0.62rem', opacity: 0.6 }}>Carbo</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f472b6' }}>{recipe.fats}g</div>
                      <div style={{ fontSize: '0.62rem', opacity: 0.6 }}>Gordura</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#4ade80' }}>{recipe.fiber}g</div>
                      <div style={{ fontSize: '0.62rem', opacity: 0.6 }}>Fibras</div>
                    </div>
                  </div>

                  {/* Expandable Details: Ingredients, Prep, Strategy */}
                  {isExpanded && (
                    <div style={{
                      marginTop: '6px',
                      paddingTop: '8px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      fontSize: '0.8rem'
                    }}>
                      {/* Ingredients */}
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.78rem', color: 'var(--acc, #3b82f6)', marginBottom: '4px' }}>
                          🛒 Ingredientes (Pesagem Exata):
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '16px', lineHeight: 1.45, opacity: 0.9 }}>
                          {recipe.ingredients.map((ing, i) => (
                            <li key={i}>{ing}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Preparation Steps */}
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.78rem', color: 'var(--acc, #3b82f6)', marginBottom: '4px' }}>
                          👨‍🍳 Modo de Preparo:
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', lineHeight: 1.45, opacity: 0.9 }}>
                          {recipe.preparation.map((step, i) => (
                            <div key={i} style={{ display: 'flex', gap: '6px' }}>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Strategy */}
                      {recipe.strategy && (
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontStyle: 'italic',
                          opacity: 0.85,
                          borderLeft: '3px solid var(--acc, #3b82f6)'
                        }}>
                          💡 {recipe.strategy}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                    <button
                      onClick={() => setExpandedRecipeId(isExpanded ? null : recipe.id)}
                      style={{
                        flex: 1,
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        background: 'transparent',
                        color: 'var(--fg, #e1e7ec)',
                        fontSize: '0.78rem',
                        cursor: 'pointer'
                      }}
                    >
                      {isExpanded ? '▲ Ocultar Detalhes' : '▼ Ver Ingredientes & Preparo'}
                    </button>

                    <button
                      onClick={() => {
                        onSelectRecipe(recipe, targetMeal);
                        onClose();
                      }}
                      style={{
                        flex: 1.2,
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'var(--acc, #3b82f6)',
                        color: '#fff',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>🍲</span> Usar nesta Refeição
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '10px 16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--surface-2, #252a36)',
          fontSize: '0.75rem',
          opacity: 0.8
        }}>
          <span>Manual Master • 36 Preparações</span>
          <button
            onClick={onClose}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'transparent',
              color: 'var(--fg, #e1e7ec)',
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
