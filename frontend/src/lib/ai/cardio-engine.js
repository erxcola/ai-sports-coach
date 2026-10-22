/**
 * Cardio Engine - Prescrição Clínica de Treinamento Cardiovascular e Aeróbio
 * Integração com protocolos ISSN, ACSM e salvaguardas ortopédicas.
 */

export const CARDIO_MODALITIES = {
  INCLINE_TREADMILL: {
    id: 'incline_treadmill',
    name: 'Caminhada Inclinada na Esteira',
    category: 'liss',
    impact: 'low',
    axialLoad: 'low',
    kneeShear: 'low',
    defaultIncline: '8-12%',
    defaultSpeed: '4.5-5.5 km/h',
    metValue: 6.5,
    description: 'Padrão ouro para oxidação lipídica e preservação de massa muscular. Baixo impacto articular.'
  },
  STATIONARY_BIKE: {
    id: 'stationary_bike',
    name: 'Bicicleta Ergométrica (Vertical)',
    category: 'liss',
    impact: 'zero',
    axialLoad: 'low',
    kneeShear: 'medium',
    defaultSpeed: '70-90 RPM',
    metValue: 6.8,
    description: 'Zero impacto articular. Ideal para condicionamento com segurança em coluna.'
  },
  RECUMBENT_BIKE: {
    id: 'recumbent_bike',
    name: 'Bicicleta Ergométrica Horizontal',
    category: 'liss',
    impact: 'zero',
    axialLoad: 'zero',
    kneeShear: 'low',
    defaultSpeed: '65-80 RPM',
    metValue: 5.5,
    description: 'Suporte lombar total. Recomendado clinicamente para quem tem hérnia de disco ou dores lombares.'
  },
  ELLIPTICAL: {
    id: 'elliptical',
    name: 'Elíptico / Transport',
    category: 'liss',
    impact: 'zero',
    axialLoad: 'low',
    kneeShear: 'low',
    defaultSpeed: '60-70 RPM',
    metValue: 7.0,
    description: 'Movimento em circuito fechado, poupando tendões patelares e meniscos.'
  },
  ROWING_MACHINE: {
    id: 'rowing_machine',
    name: 'Remo Ergométrico (Concept2)',
    category: 'hiit_mict',
    impact: 'zero',
    axialLoad: 'high',
    kneeShear: 'medium',
    defaultSpeed: '22-28 s/m',
    metValue: 8.5,
    description: 'Recrutamento de 85% da musculatura corporal. Atenção à postura lombar.'
  },
  STAIRMASTER: {
    id: 'stairmaster',
    name: 'Simulador de Escada',
    category: 'mict',
    impact: 'low',
    axialLoad: 'medium',
    kneeShear: 'high',
    defaultSpeed: 'Nível 5-8',
    metValue: 9.0,
    description: 'Alta densidade calórica e foco em cadeia posterior e glúteos.'
  },
  RUNNING: {
    id: 'running',
    name: 'Corrida Contínua / Na Rua ou Esteira',
    category: 'mict_hiit',
    impact: 'high',
    axialLoad: 'high',
    kneeShear: 'high',
    defaultSpeed: '9.0-12.0 km/h',
    metValue: 10.0,
    description: 'Excelente capacidade cardiorrespiratória. Requer articulações e peso saudáveis.'
  },
  HIIT_SPRINTS: {
    id: 'hiit_sprints',
    name: 'HIIT em Bike ou Esteira (Tiro + Recuperação)',
    category: 'hiit',
    impact: 'low_to_medium',
    axialLoad: 'low',
    kneeShear: 'medium',
    protocol: '30s tiro (90% FC) x 60s recuperação ativa x 8 a 12 voltas',
    metValue: 11.5,
    description: 'Estímulo de EPOC elevado, alta eficiência temporal e biogênese mitocondrial.'
  },
  SWIMMING: {
    id: 'swimming',
    name: 'Natação (Crawl / Livre)',
    category: 'liss_mict',
    impact: 'zero',
    axialLoad: 'zero',
    kneeShear: 'zero',
    defaultSpeed: 'Ritmo constante',
    metValue: 8.0,
    description: 'Impacto nulo sobre articulações com alta demanda ventilatória.'
  },
  JUMP_ROPE: {
    id: 'jump_rope',
    name: 'Pular Corda',
    category: 'hiit',
    impact: 'high',
    axialLoad: 'high',
    kneeShear: 'high',
    protocol: '1 min salto contínuo x 30s descanso x 10 rounds',
    metValue: 10.5,
    description: 'Condicionamento de alta intensidade com sobrecarga em tendões de Aquiles e panturrilhas.'
  }
};

export class CardioEngine {
  /**
   * Calcula zonas cardíacas alvo pela fórmula de Tanaka (mais precisa que 220 - idade)
   * Tanaka: FCmax = 208 - (0.7 * idade)
   */
  static calculateHeartRateZones(age = 28, restingHeartRate = 65) {
    const maxHR = Math.round(208 - (0.7 * age));
    const hrr = maxHR - restingHeartRate; // Heart Rate Reserve (Karvonen)

    return {
      maxHR,
      restingHeartRate,
      zone1: {
        name: 'Zona 1 - Recuperação Ativa',
        pctRange: '50-60%',
        bpmRange: [Math.round(restingHeartRate + hrr * 0.50), Math.round(restingHeartRate + hrr * 0.60)],
        focus: 'Regeneração ativa, aquecimento e desaquecimento.',
        fuel: 'Ácidos graxos livres'
      },
      zone2: {
        name: 'Zona 2 - Oxidação Lipídica & Base Aeróbia',
        pctRange: '60-70%',
        bpmRange: [Math.round(restingHeartRate + hrr * 0.60), Math.round(restingHeartRate + hrr * 0.70)],
        focus: 'Hipertrofia de mitocôndrias, queima de gordura e capacidade aeróbia pura sem catabolismo.',
        fuel: 'Predominantemente gordura corporal (FatMax)'
      },
      zone3: {
        name: 'Zona 3 - Aeróbio / Ritmo (Tempo)',
        pctRange: '70-80%',
        bpmRange: [Math.round(restingHeartRate + hrr * 0.70), Math.round(restingHeartRate + hrr * 0.80)],
        focus: 'Resistência muscular e capacidade cardiovascular moderada.',
        fuel: 'Mistura equilibrada de glicose e gordura'
      },
      zone4: {
        name: 'Zona 4 - Limiar Anaeróbio (Threshold)',
        pctRange: '80-90%',
        bpmRange: [Math.round(restingHeartRate + hrr * 0.80), Math.round(restingHeartRate + hrr * 0.90)],
        focus: 'Tolerância ao lactato e capacidade anaeróbia prolongada.',
        fuel: 'Predominantemente glicogênio muscular'
      },
      zone5: {
        name: 'Zona 5 - Potência Máxima & VO2 Max',
        pctRange: '90-100%',
        bpmRange: [Math.round(restingHeartRate + hrr * 0.90), maxHR],
        focus: 'Sprints curtos, HIIT extremo e aumento agudo do VO2 Max.',
        fuel: 'Glicólise anaeróbia estrita'
      }
    };
  }

  /**
   * Filtra e recomenda as modalidades ideais de cardio respeitando lesões e limitações ortopédicas
   */
  static filterSafeModalities(conditions = []) {
    const condLower = conditions.map(c => String(c).toLowerCase());
    const hasKneeIssue = condLower.some(c => 
      c.includes('knee') || c.includes('joelho') || c.includes('patelar') || c.includes('menisco') || c.includes('condromal')
    );
    const hasBackIssue = condLower.some(c => 
      c.includes('back') || c.includes('coluna') || c.includes('hernia') || c.includes('lombar') || c.includes('escoliose')
    );
    const hasFootIssue = condLower.some(c => 
      c.includes('fascite') || c.includes('tornozelo') || c.includes('aquiles')
    );

    const safeModalities = [];
    const avoidedModalities = [];

    for (const [key, mod] of Object.entries(CARDIO_MODALITIES)) {
      let safe = true;
      let reason = '';

      if (hasKneeIssue && (mod.impact === 'high' || mod.kneeShear === 'high')) {
        safe = false;
        reason = 'Alto estresse de cisalhamento ou impacto no joelho/patela';
      } else if (hasBackIssue && (mod.axialLoad === 'high' || (mod.id === 'rowing_machine' && mod.axialLoad === 'high'))) {
        safe = false;
        reason = 'Sobrecarga axial ou flexão repetida na coluna lombar';
      } else if (hasFootIssue && mod.impact === 'high') {
        safe = false;
        reason = 'Impacto repetitivo contraindicado para fáscia plantar/tornozelo';
      }

      if (safe) {
        safeModalities.push(mod);
      } else {
        avoidedModalities.push({ ...mod, reason });
      }
    }

    return { safeModalities, avoidedModalities };
  }

  /**
   * Gera a prescrição completa de cardio de acordo com o objetivo clínico e nutricional
   */
  static prescribeCardio(profile = {}) {
    const {
      goal = 'hypertrophy',
      age = 28,
      bodyWeight = 75,
      restingHeartRate = 65,
      orthopedicConditions = [],
      trainingDaysPerWeek = 4,
      preference = 'incline_treadmill'
    } = profile;

    const hrZones = this.calculateHeartRateZones(age, restingHeartRate);
    const { safeModalities, avoidedModalities } = this.filterSafeModalities(orthopedicConditions);

    // Seleciona modalidade prioritária segura
    let primaryModal = safeModalities.find(m => m.id === preference) || 
                       safeModalities.find(m => m.id === 'incline_treadmill') || 
                       safeModalities.find(m => m.id === 'stationary_bike') || 
                       safeModalities[0] || 
                       CARDIO_MODALITIES.STATIONARY_BIKE;

    let secondaryModal = safeModalities.find(m => m.id !== primaryModal.id) || CARDIO_MODALITIES.ELLIPTICAL;

    const prescription = {
      goal,
      primaryModality: primaryModal,
      secondaryModality: secondaryModal,
      hrZones,
      safeModalities,
      avoidedModalities,
      neatStepsTarget: 10000,
      weeklyFrequency: 3,
      sessionDurationMin: 30,
      preferredTiming: 'post_workout', // 'post_workout' | 'fasted_morning' | 'separate_time'
      targetZone: hrZones.zone2,
      calorieBurnPerSessionEst: 0,
      weeklyCalorieDeficitEst: 0,
      protocolType: 'LISS_ZONE_2',
      routineDetails: [],
      clinicalGuidelines: []
    };

    if (goal === 'fat_loss') {
      // Cutting / Emagrecimento: Maximização de oxidação lipídica com proteção de massa magra
      prescription.protocolType = 'LISS_ZONE_2_FAT_OXIDATION';
      prescription.weeklyFrequency = Math.min(5, Math.max(4, trainingDaysPerWeek));
      prescription.sessionDurationMin = 35;
      prescription.neatStepsTarget = 11000;
      prescription.targetZone = hrZones.zone2;
      prescription.preferredTiming = 'post_workout_or_fasted';
      prescription.clinicalGuidelines = [
        'Priorize Zona 2 (60-70% da FCmáx): maximiza oxidação de gordura sem elevar cortisol nem canibalizar massa magra.',
        'Evite cardio de alta intensidade imediatamente antes do treino de pernas para não comprometer a progressão de cargas.',
        'Mantenha a meta de NEAT (passos diários) em 10.000–12.000 passos para sustentar o gasto metabólico basal.',
        'Hidratação: ingira 300-500ml de água antes da sessão de cardio.'
      ];
    } else if (goal === 'hypertrophy') {
      // Bulking / Hipertrofia: Manutenção cardiovascular e sensibilidade à insulina sem interferência
      prescription.protocolType = 'CARDIO_HEALTH_INSULIN_SENSITIVITY';
      prescription.weeklyFrequency = 3;
      prescription.sessionDurationMin = 20;
      prescription.neatStepsTarget = 8000;
      prescription.targetZone = hrZones.zone2;
      prescription.preferredTiming = 'post_workout';
      prescription.clinicalGuidelines = [
        'Cardio moderado estimula a biogênese mitocondrial e sensibilidade à insulina, direcionando os carboidratos para os músculos e não para adipócitos.',
        'Limite sessões a 20-25 minutos em Zona 2 para não induzir a via de sinalização AMPK que compete com a via mTOR de hipertrofia.',
        'Faça preferencialmente pós-treino ou em dias de descanso.',
        'Reabasteça com carboidratos complexos e proteínas após a sessão.'
      ];
    } else if (goal === 'recomposition') {
      // Recomposição: Combinação de Zona 2 e 1 estímulo HIIT leve
      prescription.protocolType = 'HYBRID_ZONE2_HIIT';
      prescription.weeklyFrequency = 4;
      prescription.sessionDurationMin = 25;
      prescription.neatStepsTarget = 9500;
      prescription.targetZone = hrZones.zone2;
      prescription.preferredTiming = 'separate_time';
      prescription.clinicalGuidelines = [
        'Realize 3 sessões de Zona 2 (25-30 min) e 1 sessão curta de HIIT em bike/esteira (15 min) em dia sem treino de perna.',
        'Estimula tanto o consumo de oxigênio pós-exercício (EPOC) quanto a oxidação direta de substratos.',
        'Monitore a fadiga central e use o RIR da musculação como guia de recuperação.'
      ];
    } else {
      // Condicionamento / Performance atlética
      prescription.protocolType = 'AEROBIC_POWER_VO2MAX';
      prescription.weeklyFrequency = 4;
      prescription.sessionDurationMin = 30;
      prescription.neatStepsTarget = 10000;
      prescription.targetZone = hrZones.zone3;
      prescription.preferredTiming = 'dedicated_days';
      prescription.clinicalGuidelines = [
        'Alternância entre Zona 2 de base e treinos intervalados em Zona 4/5 para expansão do VO2 Max.',
        'Monitore a frequência cardíaca com o relógio para manter as faixas ideais.'
      ];
    }

    // Estima gasto calórico por sessão (fórmula MET: kcal = MET * peso_kg * tempo_horas)
    const hours = prescription.sessionDurationMin / 60;
    const met = primaryModal.metValue || 6.5;
    prescription.calorieBurnPerSessionEst = Math.round(met * bodyWeight * hours);
    prescription.weeklyCalorieDeficitEst = prescription.calorieBurnPerSessionEst * prescription.weeklyFrequency;

    // Constrói rotinas estruturadas por dia
    for (let day = 1; day <= prescription.weeklyFrequency; day++) {
      prescription.routineDetails.push({
        dayNumber: day,
        title: `Cardio Sessão ${day} - ${primaryModal.name}`,
        modality: primaryModal.id,
        modalityName: primaryModal.name,
        durationMinutes: prescription.sessionDurationMin,
        targetZoneName: prescription.targetZone.name,
        targetBpmRange: prescription.targetZone.bpmRange,
        speedOrPace: primaryModal.defaultSpeed || 'Ritmo sustentável',
        incline: primaryModal.defaultIncline || '0%',
        estimatedCalories: prescription.calorieBurnPerSessionEst,
        notes: `Mantenha os batimentos entre ${prescription.targetZone.bpmRange[0]} e ${prescription.targetZone.bpmRange[1]} BPM.`
      });
    }

    return prescription;
  }
}

export default CardioEngine;
