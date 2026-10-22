import React, { useState } from 'react';
import { EVIDENCE_DATABASE, searchPubMedArticles, searchCitedHealthIngredient } from '../../lib/ai/nutrition-science.js';

export function ScientificEvidenceModal({ isOpen, onClose, targetTopic = null }) {
  const [activeTab, setActiveTab] = useState(targetTopic || 'ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [liveResults, setLiveResults] = useState([]);
  const [citedIngredient, setCitedIngredient] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchSearched, setSearchSearched] = useState(false);

  if (!isOpen) return null;

  const allTopics = Object.values(EVIDENCE_DATABASE);
  const displayedTopics = activeTab === 'ALL'
    ? allTopics
    : allTopics.filter(t => t.id === activeTab);

  const handleLiveSearch = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchSearched(true);
    try {
      const [pubMedArticles, citedData] = await Promise.all([
        searchPubMedArticles(searchQuery, 4),
        searchCitedHealthIngredient(searchQuery)
      ]);
      setLiveResults(pubMedArticles);
      setCitedIngredient(citedData);
    } catch (err) {
      console.warn('Erro na busca científica:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.78)',
      backdropFilter: 'blur(5px)',
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
        maxWidth: '560px',
        maxHeight: '92vh',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
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
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🔬</span> Respaldo Científico & PubMed
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.74rem', opacity: 0.75 }}>
              Ensaios Clínicos Randomizados (RCTs) & Evidências Nível A
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

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '6px',
          padding: '10px 14px 4px 14px',
          overflowX: 'auto',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          {[
            { id: 'ALL', label: 'Todos os Pilares' },
            { id: 'protein_target', label: '🥩 Proteína (1.6-2.2g)' },
            { id: 'creatine', label: '⚡ Creatina (5g)' },
            { id: 'omega3', label: '🐟 Ômega-3' },
            { id: 'collagen', label: '🦴 Articulações' },
            { id: 'SEARCH', label: '🔍 Consultar PubMed Ao Vivo' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: '0 0 auto',
                padding: '6px 11px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: '600',
                border: '1px solid',
                borderColor: activeTab === tab.id ? 'var(--acc, #3b82f6)' : 'rgba(255, 255, 255, 0.1)',
                background: activeTab === tab.id ? 'rgba(59, 130, 246, 0.2)' : 'var(--surface-2, #252a36)',
                color: activeTab === tab.id ? 'var(--acc, #60a5fa)' : 'var(--fg, #e1e7ec)',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {activeTab === 'SEARCH' ? (
            /* Live PubMed / CitedHealth Search */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <form onSubmit={handleLiveSearch} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Ex: cafeína, leucina, whey, jejum intermitente..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: 'var(--surface-2, #252a36)',
                    color: 'var(--fg, #e1e7ec)',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--acc, #3b82f6)',
                    color: '#fff',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    opacity: isSearching ? 0.7 : 1
                  }}
                >
                  {isSearching ? 'Buscando...' : 'Pesquisar'}
                </button>
              </form>

              {/* CitedHealth Ingredient Info if found */}
              {citedIngredient && (
                <div style={{
                  background: 'rgba(59, 130, 246, 0.12)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '0.8rem'
                }}>
                  <div style={{ fontWeight: '800', color: 'var(--acc, #3b82f6)', marginBottom: '4px' }}>
                    🏢 Ficha Técnica CitedHealth: {citedIngredient.name}
                  </div>
                  <div style={{ opacity: 0.9, lineHeight: 1.45, marginBottom: '6px' }}>
                    <strong>Mecanismo Farmacológico:</strong> {citedIngredient.mechanism}
                  </div>
                  {citedIngredient.dosage && (
                    <div style={{ opacity: 0.8, fontSize: '0.74rem' }}>
                      <strong>Dosagens Clínicas:</strong> {Object.entries(citedIngredient.dosage).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                    </div>
                  )}
                </div>
              )}

              {/* Results from PubMed */}
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: '700', opacity: 0.8, marginBottom: '8px' }}>
                  Artigos Indexados no PubMed NCBI (Meta-análises & Ensaios Clínicos):
                </div>

                {liveResults.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 10px', opacity: 0.6, fontSize: '0.82rem' }}>
                    {searchSearched ? 'Nenhum artigo encontrado para o termo pesquisado.' : 'Digite um ingrediente ou tópico acima para buscar revisões científicas.'}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {liveResults.map((article, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'var(--surface-2, #252a36)',
                          borderRadius: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          padding: '10px 12px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}
                      >
                        <div style={{ fontSize: '0.84rem', fontWeight: '700', lineHeight: 1.35, color: '#93c5fd' }}>
                          {article.title}
                        </div>
                        <div style={{ fontSize: '0.72rem', opacity: 0.75 }}>
                          {article.authors} · <em>{article.journal}</em> ({article.year})
                        </div>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            alignSelf: 'flex-start',
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            color: 'var(--acc, #3b82f6)',
                            textDecoration: 'none',
                            marginTop: '2px'
                          }}
                        >
                          Ler Estudo no PubMed ↗ (PMID: {article.pmid})
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Curated Pillars from Database */
            displayedTopics.map(topic => (
              <div
                key={topic.id}
                style={{
                  background: 'var(--surface-2, #252a36)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                {/* Topic Header & Grade Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', lineHeight: 1.3 }}>
                    {topic.topic}
                  </div>
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: topic.grade === 'A' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                    color: topic.grade === 'A' ? '#34d399' : '#60a5fa',
                    border: `1px solid ${topic.grade === 'A' ? '#10b981' : '#3b82f6'}55`,
                    letterSpacing: '0.4px'
                  }}>
                    GRAU {topic.grade}
                  </span>
                </div>

                <div style={{ fontSize: '0.74rem', opacity: 0.7, fontStyle: 'italic' }}>
                  {topic.gradeLabel}
                </div>

                {/* Practical Clinical Summary */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.22)',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  fontSize: '0.8rem',
                  lineHeight: 1.45,
                  opacity: 0.95
                }}>
                  <strong style={{ color: 'var(--acc, #3b82f6)' }}>Por que prescrevemos este valor?</strong>
                  <div style={{ marginTop: '2px' }}>{topic.summary}</div>
                </div>

                {/* Mechanism */}
                <div style={{ fontSize: '0.78rem', lineHeight: 1.45, opacity: 0.85 }}>
                  <strong style={{ color: '#fbbf24' }}>⚙️ Mecanismo Fisiológico:</strong> {topic.mechanism}
                </div>

                {/* Peer-Reviewed Papers */}
                <div style={{ marginTop: '4px' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '700', opacity: 0.75, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Artigos & Meta-Análises de Referência:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {topic.papers.map((p, i) => (
                      <div
                        key={i}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: '8px',
                          padding: '8px 10px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px'
                        }}
                      >
                        <div style={{ fontSize: '0.78rem', fontWeight: '600', color: '#93c5fd', lineHeight: 1.35 }}>
                          {p.title}
                        </div>
                        <div style={{ fontSize: '0.68rem', opacity: 0.7 }}>
                          {p.authors} · <em>{p.journal}</em> ({p.year})
                        </div>
                        {p.conclusion && (
                          <div style={{ fontSize: '0.72rem', fontStyle: 'italic', opacity: 0.85 }}>
                            "{p.conclusion}"
                          </div>
                        )}
                        <a
                          href={`https://pubmed.ncbi.nlm.nih.gov/${p.pmid}/`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            alignSelf: 'flex-start',
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            color: 'var(--acc, #3b82f6)',
                            textDecoration: 'none',
                            marginTop: '2px'
                          }}
                        >
                          Ver no PubMed ↗ (PMID: {p.pmid})
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
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
          fontSize: '0.74rem',
          opacity: 0.8
        }}>
          <span>NCBI PubMed & CitedHealth Grounded</span>
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
export default ScientificEvidenceModal;
