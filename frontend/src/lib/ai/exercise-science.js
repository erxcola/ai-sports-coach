// frontend/src/lib/ai/exercise-science.js
// Base de conhecimento biomecânica e científica do exercício
// Fontes: PubMed (Schoenfeld, Israetel, Zourdos, Refalo, Maeo, Kassiano), wger, ExerciseBank

export const VOLUME_LANDMARKS = {
  peito: {
    nome: 'Peito / Peitoral Maior',
    mev: '8-10 séries/sem',
    mav: '12-18 séries/sem',
    mrv: '22+ séries/sem',
    frequenciaIdeal: '2-3x por semana',
    tempoRecuperacao: '48-72h',
    recomendacao: 'Focar na porção esternal e clavicular. Priorizar exercícios com grande amplitude na fase excêntrica onde ocorre hipertrofia mediada por estiramento.',
    evidencia: 'Schoenfeld et al. (2019) - Dose-response relationship between weekly resistance training volume and increase in muscle mass.'
  },
  costas: {
    nome: 'Dorsais & Trapézio / Costas',
    mev: '10-12 séries/sem',
    mav: '14-22 séries/sem',
    mrv: '25+ séries/sem',
    frequenciaIdeal: '2-3x por semana',
    tempoRecuperacao: '48-72h',
    recomendacao: 'Dividir o volume entre puxadas verticais (largura do grande dorsal) e remadas horizontais (espessura, romboides e trapézio médio/inferior). Permitir protração escapular na fase excêntrica.',
    evidencia: 'Maeo et al. (2021) - Greater Hamstrings and Back Muscle Hypertrophy but Similar Damage with Longer Muscle Lengths.'
  },
  quadriceps: {
    nome: 'Quadríceps',
    mev: '8-10 séries/sem',
    mav: '12-18 séries/sem',
    mrv: '20+ séries/sem',
    frequenciaIdeal: '1.5-2.5x por semana',
    tempoRecuperacao: '72-96h',
    recomendacao: 'O quadríceps responde fortemente ao estiramento sob carga máxima na flexão profunda de joelho (>90°). Agachamentos e Leg Press profundos superam amplitudes parciais.',
    evidencia: 'Pedrosa et al. (2022) - Partial range of motion training at long muscle lengths induces greater muscle hypertrophy than full or short lengths.'
  },
  isquiotibiais: {
    nome: 'Isquiotibiais (Posterior de Coxa)',
    mev: '6-8 séries/sem',
    mav: '10-16 séries/sem',
    mrv: '20+ séries/sem',
    frequenciaIdeal: '2x por semana',
    tempoRecuperacao: '48-72h',
    recomendacao: 'Combinar flexão de joelho (mesa/cadeira flexora) com extensão de quadril (RDL / Stiff). A cadeira flexora sentada gera maior hipertrofia que a mesa deitada devido ao pré-estiramento dos isquiotibiais com o quadril flexionado a 90°.',
    evidencia: 'Maeo et al. (2021) - Greater Hamstrings Muscle Hypertrophy but Similar Damage After Training at Long versus Short Muscle Lengths (Med Sci Sports Exerc).'
  },
  deltoides: {
    nome: 'Ombros / Deltoides (Lateral e Posterior)',
    mev: '8-10 séries/sem',
    mav: '16-24 séries/sem',
    mrv: '26+ séries/sem',
    frequenciaIdeal: '2-4x por semana',
    tempoRecuperacao: '24-48h',
    recomendacao: 'Porções lateral e posterior toleram alta frequência e volume semanal. Realizar elevações laterais no plano escapular (30° anterior ao plano frontal) para proteger o manguito rotador.',
    evidencia: 'Campos et al. (2020) - Muscular adaptations in response to high vs moderate frequency resistance training.'
  },
  triceps: {
    nome: 'Tríceps Braquial',
    mev: '6-8 séries/sem',
    mav: '10-14 séries/sem',
    mrv: '18+ séries/sem',
    frequenciaIdeal: '2-3x por semana',
    tempoRecuperacao: '48h',
    recomendacao: 'A cabeça longa do tríceps cruza a articulação do ombro e é maximamente estirada em posições acima da cabeça (Tríceps Francês / Overhead Cable Extension).',
    evidencia: 'Maeo et al. (2022) - Triceps brachii hypertrophy is substantially greater after elbow extension training performed in the overhead versus neutral arm position.'
  },
  biceps: {
    nome: 'Bíceps Braquial',
    mev: '6-8 séries/sem',
    mav: '10-16 séries/sem',
    mrv: '20+ séries/sem',
    frequenciaIdeal: '2-3x por semana',
    tempoRecuperacao: '48h',
    recomendacao: 'A rosca inclinada no banco (45-60°) coloca a cabeça longa sob estiramento passivo máximo na origem escapular, promovendo hipertrofia mediada por estiramento superior à rosca scott.',
    evidencia: 'Schoenfeld et al. (2020) - Effects of Range of Motion on Muscle Development During Resistance Training: A Systematic Review.'
  },
  panturrilhas: {
    nome: 'Panturrilhas (Gastrocnêmio & Sóleo)',
    mev: '8-10 séries/sem',
    mav: '12-20 séries/sem',
    mrv: '24+ séries/sem',
    frequenciaIdeal: '3-4x por semana',
    tempoRecuperacao: '24-48h',
    recomendacao: 'O gastrocnêmio é biarticular e exige joelhos estendidos (panturrilha em pé ou no leg press). O sóleo é monoarticular e trabalha isolado na flexão sentada. Pausar 1-2s na posição esticada elimina a restituição elástica do tendão de Aquiles.',
    evidencia: 'Kassiano et al. (2023) - Greater Gastrocnemius Muscle Hypertrophy After Partial Range of Motion Training Performed at Long Muscle Lengths.'
  }
};

export const SCIENTIFIC_PRINCIPLES = [
  {
    titulo: 'Hipertrofia Mediada por Estiramento (Stretch-Mediated)',
    subtitulo: 'Tensão Mecânica sob Comprimento Fascicular Alongado',
    descricao: 'Estudos pioneiros (Pedrosa 2022, Maeo 2021/2022, Kassiano 2023) demonstram que treinar com grande amplitude enfatizando a posição alongada estimula a titina e mecanotransdução intracelular superior, gerando até 40-70% mais hipertrofia comparado a repetições parciais no encurtamento.',
    aplicacao: 'Controle a fase excêntrica (2-3 segundos), atinja o estiramento completo do músculo-alvo e pause por 0.5s no ponto de maior tensão antes de iniciar a fase concêntrica.',
    referencia: 'PMID: 35884389 (Pedrosa et al., 2022); PMID: 33009373 (Maeo et al., 2021)'
  },
  {
    titulo: 'Proximidade da Falha: RIR (Repetições em Reserva) & RPE',
    subtitulo: 'Recrutamento de Unidades Motoras de Alto Limiar',
    descricao: 'Meta-análises (Refalo et al., 2023; Vieira et al., 2021) mostram que treinar entre 1 e 3 RIR (Repetições em Reserva) produz ganhos idênticos à falha absoluta (0 RIR), com 50% menos fadiga sistêmica do sistema nervoso central e recuperação até 24h mais rápida.',
    aplicacao: 'Mantenha séries de trabalho compostas (Agachamento, Supino, Terra) em 1-2 RIR. Em exercícios isoladores em máquinas (Extensora, Elevação Lateral), pode-se levar a última série a 0 RIR ou falha momentânea.',
    referencia: 'PMID: 36334237 (Refalo et al., Sports Med 2023); PMID: 27174923 (Zourdos et al., 2016)'
  },
  {
    titulo: 'Intervalo de Descanso entre Séries',
    subtitulo: 'Ressíntese de ATP-CP e Desempenho de Carga',
    descricao: 'Schoenfeld et al. (2016) demonstraram que intervalos longos (2-3 minutos) promovem significativamente maior hipertrofia muscular e ganho de força do que intervalos curtos (<1 minuto), por permitirem sustentar o volume total de carga e o recrutamento de fibras do tipo II.',
    aplicacao: 'Exercícios compostos pesados: 2.5 a 3.5 minutos de descanso. Exercícios isoladores e acessórios: 1.5 a 2 minutos.',
    referencia: 'PMID: 26605807 (Schoenfeld et al., J Strength Cond Res 2016)'
  },
  {
    titulo: 'Progressão de Sobrecarga e Volume Semanal',
    subtitulo: 'Dose-Resposta de Volume Efetivo (MEV vs MAV)',
    descricao: 'O músculo hipertrofia em resposta ao acúmulo de séries efetivas (séries levadas a RIR ≤ 3). A faixa ótima para 95% dos praticantes situa-se entre 12 e 20 séries semanais por grupo muscular, divididas em 2 a 3 sessões semanais para manter as taxas de síntese proteica (MPS) elevadas.',
    aplicacao: 'Comece a mesociclo próximo ao MEV (8-10 séries) e progrida gradativamente semana a semana adicionando 1-2 séries até atingir o MAV/MRV antes de fazer uma semana de deload.',
    referencia: 'PMID: 27433992 (Schoenfeld et al., 2016); Israetel et al. (RP Volume Landmarks)'
  }
];

export const EXERCISE_BIOMECHANICS_DATABASE = {
  // Peito
  'supino': {
    padrao: 'Empurrar Horizontal',
    musculos: ['Peitoral Maior (Esternal & Clavicular)', 'Deltoide Anterior', 'Tríceps Braquial'],
    estiramento: 'Máximo no contato com a caixa torácica. O peitoral sofre tensão passiva e ativa simultânea.',
    cues: [
      'Retraia e deprima as escápulas antes de retirar a barra do suporte.',
      'Mantenha os cotovelos em um ângulo de ~45° a 60° em relação ao tronco (evite 90° para proteger o labrum glenoidal).',
      'Desça a barra na linha inferior do esterno em uma trajetória levemente curvada ("J" invertido).',
      'Pés firmemente plantados no chão para gerar tração no arco lombar estável (leg drive).'
    ],
    riscoLesao: 'Cotovelos excessivamente abertos a 90° comprimem o tendão do supraespinhoso no acrômio.',
    pmid: '20543741'
  },
  'supino inclinado': {
    padrao: 'Empurrar Inclinado (~30°)',
    musculos: ['Peitoral Maior (Feixe Clavicular)', 'Deltoide Anterior', 'Tríceps Braquial'],
    estiramento: 'Elevado na porção clavicular. A inclinação ótima é de 30° a 45° (acima de 45° transfere carga para o deltoide).',
    cues: [
      'Ajuste o banco em inclinação de 30° a 45° (bancos mais baixos recrutam mais o peito superior sem fadigar o ombro).',
      'Desça os halteres ou barra em direção à clavícula com controle da fase excêntrica.',
      'Sinta o peitoral superior esticar na base antes de empurrar convergindo no topo.'
    ],
    riscoLesao: 'Bancos em 60° aumentam o estresse na articulação acromioclavicular.',
    pmid: '32912443'
  },
  'crucifixo': {
    padrao: 'Adução Horizontal de Braço',
    musculos: ['Peitoral Maior', 'Deltoide Anterior'],
    estiramento: 'Extremo. Posição aberta causa o maior comprimento de fascículo do peitoral.',
    cues: [
      'Mantenha uma leve flexão fixa nos cotovelos durante todo o movimento.',
      'Pare a descida quando os cotovelos alinharem com o tronco para evitar hiperextensão articular.',
      'No cabo, cruze ligeiramente as mãos no final para recrutar a contração máxima encurtada.'
    ],
    riscoLesao: 'Descida excessiva com halteres pesados sobrecarrega o ligamento glenoumeral anterior.',
    pmid: '35884389'
  },

  // Costas
  'puxada frontal': {
    padrao: 'Puxar Vertical',
    musculos: ['Grande Dorsal', 'Redondo Maior', 'Bíceps Braquial', 'Braquiorradial'],
    estiramento: 'Máximo no topo: permitir elevação e rotação superior da escápula para esticar o grande dorsal.',
    cues: [
      'Inicie o movimento deprimindo as escápulas antes de dobrar os braços ("cotovelos no bolso").',
      'Puxe a barra em direção à parte superior do esterno, mantendo o tronco levemente inclinado para trás (10-15°).',
      'Evite puxar atrás do pescoço — a puxada frontal ativa o mesmo volume com risco articular zero.'
    ],
    riscoLesao: 'Puxada nuca causa rotação externa extrema combinada com abdução, gerando impacto subacromial.',
    pmid: '19855327'
  },
  'remada curvada': {
    padrao: 'Puxar Horizontal',
    musculos: ['Grande Dorsal', 'Trapézio Médio/Inferior', 'Romboides', 'Eretores da Espinha'],
    estiramento: 'Completo na fase baixa ao permitir protração controlada das escápulas.',
    cues: [
      'Fixe o quadril em flexão ("hinge") com a coluna em posição neutra e joelhos semi-flexionados.',
      'Puxe a barra em direção ao umbigo para enfatizar dorsais, ou em direção ao esterno para focar no trapézio/romboides.',
      'Conduza o movimento com os cotovelos, não com as mãos.'
    ],
    riscoLesao: 'Flexão lombar (costas arredondadas) com cargas pesadas aumenta a força de cisalhamento nos discos L4-L5.',
    pmid: '24225032'
  },

  // Pernas
  'agachamento': {
    padrao: 'Dominante de Joelho (Squat)',
    musculos: ['Quadríceps', 'Glúteo Máximo', 'Adutor Magno', 'Eretores da Espinha'],
    estiramento: 'Máximo para o quadríceps e glúteo na quebra da paralela (>90° de flexão de joelho).',
    cues: [
      'Posicione os pés na largura dos ombros com pontas apontadas levemente para fora (15-30°).',
      'Inicie flexionando joelhos e quadris simultaneamente mantendo a pressão no meio do pé.',
      'Mantenha os joelhos alinhados com a direção da ponta dos pés (evite valgo dinâmico).',
      'Desça pelo menos até as coxas ficarem paralelas ao chão para maximizar a hipertrofia do quadríceps.'
    ],
    riscoLesao: 'Valgo dinâmico (joelhos colapsando para dentro) sobrecarrega o ligamento cruzado anterior (LCA).',
    pmid: '35884389'
  },
  'leg press': {
    padrao: 'Dominante de Joelho em Cadeia Cinética Fechada',
    musculos: ['Quadríceps', 'Glúteo Máximo'],
    estiramento: 'Excelente para quadríceps sem sobrecarga axial na coluna vertebral.',
    cues: [
      'Mantenha a pelve e lombar totalmente coladas no encosto durante toda a descida.',
      'Não permita retroversão pélvica ("butt wink") na parte mais baixa.',
      'Não trave os joelhos em hiperextensão no topo da subida.'
    ],
    riscoLesao: 'Deixar a lombar descolar do banco transfere centenas de quilos de pressão para as vértebras lombares.',
    pmid: '30550389'
  },
  'cadeira extensora': {
    padrao: 'Extensão de Joelho Isolada',
    musculos: ['Reto Femoral', 'Vasto Lateral', 'Vasto Medial', 'Vasto Intermédio'],
    estiramento: 'Enfatiza a hipertrofia do reto femoral no ponto de contração pico e vastos no ponto de estiramento.',
    cues: [
      'Ajuste o eixo da máquina para coincidir perfeitamente com a linha da articulação do joelho.',
      'Segure firmemente as alavancas laterais para impedir que o quadril levante do assento.',
      'Pause 1 segundo no topo com contração máxima e controle a descida por 2-3 segundos.'
    ],
    riscoLesao: 'Velocidade balística no fundo gera impacto excessivo na cartilagem patelofemoral.',
    pmid: '32032223'
  },
  'cadeira flexora': {
    padrao: 'Flexão de Joelho em Quadril Fletido',
    musculos: ['Isquiotibiais (Bíceps Femoral, Semitendíneo, Semimembranoso)'],
    estiramento: 'SUPERIOR à mesa deitada: a flexão do quadril a 90° pré-estira a inserção proximal dos isquiotibiais.',
    cues: [
      'Incline o tronco levemente para frente para aumentar ainda mais o estiramento proximal.',
      'Segure os apoios e puxe os calcanhares em direção à coxa com cadência controlada.',
      'Resista à subida até o joelho ficar quase estendido, sentindo os isquiotibiais arderem no estiramento.'
    ],
    riscoLesao: 'Deixar a carga cair bruscamente pode distender o tendão do bíceps femoral.',
    pmid: '33009373'
  },
  'stiff': {
    padrao: 'Dominante de Quadril (Hip Hinge)',
    musculos: ['Isquiotibiais', 'Glúteo Máximo', 'Eretores da Espinha'],
    estiramento: 'Extremo nos isquiotibiais na fase excêntrica em flexão de quadril com joelhos quase retos.',
    cues: [
      'Pense em empurrar o quadril para trás contra uma parede invisível.',
      'Mantenha os joelhos semi-flexionados em ângulo fixo (não agache no movimento).',
      'A barra ou halteres devem descer colados nas pernas para minimizar o braço de momento sobre a lombar.',
      'Pare a descida assim que os quadris pararem de recuar (geralmente abaixo dos joelhos).'
    ],
    riscoLesao: 'Arredondar a coluna toracolombar em vez de fazer a flexão articular no quadril.',
    pmid: '32568756'
  },

  // Ombros e Braços
  'elevacao lateral': {
    padrao: 'Abdução de Braço no Plano Escapular',
    musculos: ['Deltoide Lateral'],
    estiramento: 'Elevado com cabos cruzados por trás do corpo ou usando halteres inclinados.',
    cues: [
      'Eleve os braços cerca de 30° à frente da linha do corpo (no plano da escápula).',
      'Mantenha os polegares levemente apontados para baixo ou neutros, sem rotacionar excessivamente.',
      'Pare na altura dos ombros (~90°) — passar disso transfere a tensão para o trapézio superior.',
      'Nos cabos, a polia posicionada na altura do joelho oferece a curva de resistência ideal.'
    ],
    riscoLesao: 'Fazer em rotação interna excessiva (dedos muito apontados para baixo) gera impacto no acrômio.',
    pmid: '24944181'
  },
  'rosca direta': {
    padrao: 'Flexão de Cotovelo em Supinação',
    musculos: ['Bíceps Braquial', 'Braquial', 'Braquiorradial'],
    estiramento: 'Completo na extensão do cotovelo. Barra W reduz o estresse nos punhos.',
    cues: [
      'Fixe os cotovelos ao lado do corpo — não os projete para frente no início da subida.',
      'Supine os punhos (gire a palma da mão para cima) para ativar o pico do bíceps.',
      'Desça estendendo completamente os cotovelos antes de iniciar a próxima repetição.'
    ],
    riscoLesao: 'Balançar o tronco para trás (roubo lombar) reduz a tensão mecânica no bíceps.',
    pmid: '23797686'
  },
  'triceps corda': {
    padrao: 'Extensão de Cotovelo em Pronação/Neutro',
    musculos: ['Tríceps Braquial (Cabeça Lateral e Medial)'],
    estiramento: 'Moderado. Para a cabeça longa, prefira variações acima da cabeça (overhead).',
    cues: [
      'Mantenha os ombros travados e cotovelos fixos ao lado das costelas.',
      'Abra as pontas da corda para os lados no final da descida para contração total.',
      'Retorne até formar um ângulo de 90° nos cotovelos sem mover a parte superior do braço.'
    ],
    riscoLesao: 'Balanço do tronco e cotovelos abrindo desalinhados com o cabo.',
    pmid: '34483758'
  }
};

/**
 * Encontra a biomecânica mais relevante com base no nome do exercício e músculo
 */
export function getExerciseBiomechanics(exerciseName = '', targetMuscle = '') {
  const norm = (exerciseName || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  for (const [key, profile] of Object.entries(EXERCISE_BIOMECHANICS_DATABASE)) {
    const keyNorm = key.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (norm.includes(keyNorm)) {
      return {
        matchedKey: key,
        ...profile
      };
    }
  }

  // Fallback baseado no músculo principal
  const muscleKey = (targetMuscle || '').toLowerCase();
  let volumeKey = 'peito';
  if (muscleKey.includes('costas') || muscleKey.includes('dorsal') || muscleKey.includes('lat')) volumeKey = 'costas';
  else if (muscleKey.includes('quad') || muscleKey.includes('perna')) volumeKey = 'quadriceps';
  else if (muscleKey.includes('isquio') || muscleKey.includes('posterior') || muscleKey.includes('hamstring')) volumeKey = 'isquiotibiais';
  else if (muscleKey.includes('ombro') || muscleKey.includes('deltoide')) volumeKey = 'deltoides';
  else if (muscleKey.includes('triceps')) volumeKey = 'triceps';
  else if (muscleKey.includes('biceps')) volumeKey = 'biceps';
  else if (muscleKey.includes('panturrilha') || muscleKey.includes('pant')) volumeKey = 'panturrilhas';

  return {
    matchedKey: 'genérico',
    padrao: 'Movimento Composto / Acessório',
    musculos: [targetMuscle || 'Músculo Específico'],
    estiramento: 'Priorize sempre a amplitude máxima confortável para maximizar a hipertrofia mediada por estiramento.',
    cues: [
      'Controle rigorosamente a fase excêntrica da repetição (2 a 3 segundos).',
      'Pause brevemente na posição de alongamento antes de iniciar a contração.',
      'Mantenha a respiração intra-abdominal (manobra de Valsalva controlada) para estabilidade articular.'
    ],
    riscoLesao: 'Movimentos balísticos rápidos reduzem a tensão nas fibras e aumentam a sobrecarga nos tendões.',
    pmid: '35884389'
  };
}

export function getVolumeLandmarks(muscleGroup = '') {
  const norm = (muscleGroup || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const [key, data] of Object.entries(VOLUME_LANDMARKS)) {
    if (norm.includes(key) || norm.includes(data.nome.toLowerCase())) {
      return data;
    }
  }
  return VOLUME_LANDMARKS.peito;
}
