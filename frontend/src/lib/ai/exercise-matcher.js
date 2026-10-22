// src/frontend/src/lib/ai/exercise-matcher.js
// Localizador de exercicios do catalogo openGym para reproducao de video/animacao e instrucoes.

import { CATALOGUE } from '../exercises.js';

// Mapeamento rapido de termos comuns em portugues para IDs do catalogo openGym
const COMMON_PT_EXERCISE_MAP = [
  { match: ['supino reto com barra', 'supino reto barra', 'bench press'], id: '0025' }, // Barbell Bench Press
  { match: ['supino inclinado', 'supino com halteres inclinado', 'incline dumbbell'], id: '0314' }, // Incline Dumbbell Press
  { match: ['supino reto com halteres', 'supino halter', 'dumbbell bench press'], id: '0289' }, // Dumbbell Bench Press
  { match: ['crucifixo', 'crucifixo reto', 'dumbbell fly'], id: '0308' }, // Dumbbell Fly
  { match: ['crucifixo maquina', 'peck deck', 'voador', 'butterfly'], id: '0076' }, // Machine Fly / Peck Deck
  { match: ['desenvolvimento com halteres', 'desenvolvimento halter', 'shoulder press'], id: '0426' }, // Dumbbell Shoulder Press
  { match: ['desenvolvimento barra', 'overhead press', 'militar'], id: '0070' }, // Barbell Military Press
  { match: ['elevacao lateral', 'lateral raise'], id: '0334' }, // Dumbbell Lateral Raise
  { match: ['triceps corda', 'triceps pulley', 'triceps cabo'], id: '0241' }, // Cable Triceps Pushdown
  { match: ['triceps testa', 'skull crusher'], id: '0098' }, // Barbell Skullcrusher
  { match: ['triceps banco', 'mergulho no banco', 'bench dip'], id: '0109' }, // Bench Dip
  { match: ['puxada frontal', 'puxada aberta', 'lat pulldown'], id: '0150' }, // Cable Lat Pulldown
  { match: ['remada curvada barra', 'remada curvada', 'bent over row'], id: '0027' }, // Barbell Bent Over Row
  { match: ['remada baixa', 'remada sentada cabo', 'seated cable row'], id: '0861' }, // Seated Cable Row
  { match: ['remada serrote', 'remada unilateral', 'one arm dumbbell row'], id: '0292' }, // Dumbbell Row
  { match: ['rosca direta barra', 'rosca direta', 'biceps curl'], id: '0031' }, // Barbell Curl
  { match: ['rosca alternada', 'rosca halter', 'alternate dumbbell curl'], id: '0285' }, // Dumbbell Curl
  { match: ['rosca martelo', 'hammer curl'], id: '0313' }, // Hammer Curl
  { match: ['crucifixo inverso', 'rear delt fly', 'voador invertido'], id: '0379' }, // Reverse Fly
  { match: ['agachamento livre', 'agachamento barra', 'barbell squat', 'squat'], id: '0043' }, // Barbell Full Squat
  { match: ['leg press', 'leg press 45'], id: '0739' }, // Sled 45 Leg Press
  { match: ['extensora', 'cadeira extensora', 'leg extension'], id: '0585' }, // Leg Extension
  { match: ['flexora', 'mesa flexora', 'leg curl', 'lying leg curl'], id: '0599' }, // Lying Leg Curl
  { match: ['stiff', 'rdl', 'deadlift romeno', 'romanian deadlift'], id: '0085' }, // Romanian Deadlift
  { match: ['levantamento terra', 'deadlift'], id: '0032' }, // Barbell Deadlift
  { match: ['passada', 'avanco', 'walking lunge', 'lunge'], id: '0336' }, // Dumbbell Lunge
  { match: ['elevacao pelvica', 'hip thrust'], id: '1061' }, // Barbell Hip Thrust
  { match: ['panturrilha em pe', 'standing calf raise'], id: '0088' }, // Standing Calf Raise
  { match: ['panturrilha sentado', 'seated calf raise'], id: '0419' }, // Seated Calf Raise
  { match: ['abdominal crunch', 'crunch', 'abdominal'], id: '0274' }, // Abdominal Crunch
  { match: ['prancha', 'plank'], id: '0468' } // Plank
];

/**
 * Encontra o exercicio mais adequado no catalogo do openGym a partir de um nome digitado ou prescrito.
 */
export function findCatalogueExercise(name) {
  if (!name || typeof name !== 'string') return null;
  const clean = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  // 1. Busca exata ou por termo no mapa rapido
  for (const item of COMMON_PT_EXERCISE_MAP) {
    if (item.match.some(m => clean.includes(m.normalize('NFD').replace(/[\u0300-\u036f]/g, '')))) {
      const found = CATALOGUE.find(c => c.id === item.id);
      if (found) return found;
    }
  }

  // 2. Busca no catalogo geral por palavras-chave
  const words = clean.split(/\s+/).filter(w => w.length > 2);
  let bestMatch = null;
  let maxScore = 0;

  for (const ex of CATALOGUE) {
    const exName = (ex.n || '').toLowerCase();
    let score = 0;
    for (const w of words) {
      if (exName.includes(w)) score += 2;
    }
    if (ex.gif) score += 1; // Prioriza exercicios com gif/video

    if (score > maxScore) {
      maxScore = score;
      bestMatch = ex;
    }
  }

  return maxScore >= 2 ? bestMatch : CATALOGUE[0];
}
