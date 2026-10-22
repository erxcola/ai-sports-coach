// src/frontend/src/components/coach/BeginnerGlossaryModal.jsx
// Guia Didatico para Leigos: explicacao simples e com exemplos reais dos termos do treino e dieta.

import React from 'react';
import { Section, Row, Button } from '../ui.jsx';
import Icon from '../Icon.jsx';

export function BeginnerGlossaryModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="mobility-modal-backdrop" onClick={onClose}>
      <div className="mobility-modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 540 }}>
        {/* Header */}
        <div className="mobility-header">
          <div>
            <h3 className="mobility-title">📖 Guia para Iniciantes</h3>
            <div className="mobility-subtitle">
              Entenda todos os termos do seu treino e alimentação sem complicação
            </div>
          </div>
          <button className="mobility-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Content */}
        <div style={{ padding: '16px', maxHeight: '70vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* RIR */}
          <div className="glossary-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 18 }}>🎯</span>
              <strong style={{ fontSize: 15, color: 'var(--acc)' }}>O que é RIR (Repetições em Reserva)?</strong>
            </div>
            <p style={{ margin: '0 0 6px', fontSize: 13, color: 'var(--label)', lineHeight: 1.45 }}>
              É quantas repetições você ainda aguentaria fazer antes da barra travar ou você não conseguir mais levantar o peso.
            </p>
            <div style={{ fontSize: 12, background: 'var(--surface-2)', padding: '8px 10px', borderRadius: 8, color: 'var(--label-2)' }}>
              💡 <strong>Exemplo:</strong> Se a ficha diz <strong>RIR 2</strong>, faça o exercício até sentir que conseguiria fazer no máximo mais 2 repetições se sua vida dependesse disso, e pare. Não vá até a falha total em toda série para proteger suas articulações e crescer com segurança!
            </div>
          </div>

          {/* Reps */}
          <div className="glossary-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 18 }}>🔄</span>
              <strong style={{ fontSize: 15, color: 'var(--blue)' }}>O que são Repetições (Reps)?</strong>
            </div>
            <p style={{ margin: '0 0 6px', fontSize: 13, color: 'var(--label)', lineHeight: 1.45 }}>
              É cada movimento completo de ida e volta do exercício.
            </p>
            <div style={{ fontSize: 12, background: 'var(--surface-2)', padding: '8px 10px', borderRadius: 8, color: 'var(--label-2)' }}>
              💡 <strong>Exemplo:</strong> No agachamento, descer até o fundo e levantar uma vez = <strong>1 repetição</strong>. Se a faixa for de 8 a 12 reps, tente fazer pelo menos 8 bem feitas.
            </div>
          </div>

          {/* Séries */}
          <div className="glossary-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 18 }}>📦</span>
              <strong style={{ fontSize: 15, color: 'var(--orange)' }}>O que são Séries (Sets)?</strong>
            </div>
            <p style={{ margin: '0 0 6px', fontSize: 13, color: 'var(--label)', lineHeight: 1.45 }}>
              É o bloco de repetições que você faz seguido de um intervalo de descanso.
            </p>
            <div style={{ fontSize: 12, background: 'var(--surface-2)', padding: '8px 10px', borderRadius: 8, color: 'var(--label-2)' }}>
              💡 <strong>Exemplo:</strong> <strong>3 séries de 10 reps</strong> significa: fazer 10 repetições, descansar 90 segundos, fazer mais 10, descansar de novo, e fazer as últimas 10.
            </div>
          </div>

          {/* Descanso */}
          <div className="glossary-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 18 }}>⏱️</span>
              <strong style={{ fontSize: 15, color: 'var(--pink)' }}>Por que o Tempo de Descanso importa?</strong>
            </div>
            <p style={{ margin: '0 0 6px', fontSize: 13, color: 'var(--label)', lineHeight: 1.45 }}>
              É o tempo que suas fibras musculares e o coração precisam para recuperar o fôlego e a energia (ATP) para a próxima série render com peso ideal.
            </p>
          </div>

          {/* Sobrecarga Dupla */}
          <div className="glossary-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 18 }}>📈</span>
              <strong style={{ fontSize: 15, color: 'var(--acc)' }}>O que é Sobrecarga Dupla (Segredo da Hipertrofia)?</strong>
            </div>
            <p style={{ margin: '0 0 6px', fontSize: 13, color: 'var(--label)', lineHeight: 1.45 }}>
              Primeiro você tenta fazer mais repetições com o mesmo peso. Só quando conseguir atingir o teto (ex: 12 repetições perfeitas) é que você coloca mais peso na semana seguinte!
            </p>
          </div>

          {/* Zona 2 */}
          <div className="glossary-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 18 }}>🫀</span>
              <strong style={{ fontSize: 15, color: 'var(--pink)' }}>O que é Zona 2 no Cardio (FatMax)?</strong>
            </div>
            <p style={{ margin: '0 0 6px', fontSize: 13, color: 'var(--label)', lineHeight: 1.45 }}>
              É o ritmo em que você está suando e com o coração acelerado, mas ainda consegue falar uma frase completa sem perder totalmente o ar.
            </p>
            <div style={{ fontSize: 12, background: 'var(--surface-2)', padding: '8px 10px', borderRadius: 8, color: 'var(--label-2)' }}>
              🔥 É a zona exata onde seu corpo oxida a <strong>maior quantidade de gordura corporal</strong> sem desgastar seus músculos nem cansar suas pernas para o treino de força.
            </div>
          </div>

          {/* Macronutrientes */}
          <div className="glossary-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 18 }}>🥗</span>
              <strong style={{ fontSize: 15, color: 'var(--green)' }}>Macronutrientes (Proteína, Carboidrato e Gordura)</strong>
            </div>
            <p style={{ margin: '0 0 6px', fontSize: 13, color: 'var(--label)', lineHeight: 1.45 }}>
              • <strong>Proteínas (P):</strong> O tijolo que constrói e preserva seus músculos (frango, ovos, carne, peixe, whey).<br />
              • <strong>Carboidratos (C):</strong> A gasolina que te dá força e disposição para treinar pesado (arroz, batata, aveia, frutas, pão).<br />
              • <strong>Gorduras Boas (G):</strong> O óleo que lubrifica suas articulações e regula seus hormônios (azeite, castanhas, gema de ovo, abacate).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 16px', borderTop: 'var(--hair) solid var(--sep-op)' }}>
          <Button variant="primary" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
            Entendi Tudo! 👍
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BeginnerGlossaryModal;
