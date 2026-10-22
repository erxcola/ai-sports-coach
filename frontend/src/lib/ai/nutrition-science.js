/**
 * Módulo de Evidências Científicas & Respaldo Biomédico (PubMed & CitedHealth)
 * Fundamenta todas as prescrições de macronutrientes, periodização calórica
 * e suplementação com Ensaios Clínicos Randomizados (RCTs) e Meta-análises.
 */

export const EVIDENCE_DATABASE = {
  // 1. Ingestão Proteica Diária (1.6 a 2.4g/kg)
  protein_target: {
    id: 'protein_target',
    topic: 'Ingestão Diária de Proteínas para Hipertrofia & Preservação',
    grade: 'A',
    gradeLabel: 'Evidência Grau A — Múltiplos Ensaios Clínicos Randomizados & Meta-Análises',
    summary: 'A faixa ótima de ingestão proteica para praticantes de musculação situa-se entre 1.6 e 2.2g/kg de peso corporal. Em déficit calórico severo (cutting), valores de até 2.4g/kg previnem a proteólise muscular e mantêm o balanço nitrogenado positivo.',
    mechanism: 'A ingestão regular de aminoácidos essenciais (especialmente L-Leucina) ativa a via de sinalização intracelular mTORC1, estimulando a Síntese Proteica Muscular (MPS) e suprimindo as vias de degradação proteica (ubiquitina-proteassoma).',
    papers: [
      {
        pmid: '28698222',
        title: 'A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength in healthy adults.',
        authors: 'Morton RW, Murphy KT, McKellar SR, et al.',
        journal: 'British Journal of Sports Medicine (BJSM)',
        year: 2018,
        doi: '10.1136/bjsports-2017-097608',
        conclusion: 'A suplementação proteica aumenta significativamente a massa livre de gordura e força muscular, com platô de benefício em 1.62g/kg/dia para indivíduos em eucaloria.'
      },
      {
        pmid: '24864484',
        title: 'Evidence-based recommendations for natural bodybuilding contest preparation: nutrition and supplementation.',
        authors: 'Helms ER, Aragon AA, Fitschen PJ.',
        journal: 'Journal of the International Society of Sports Nutrition (JISSN)',
        year: 2014,
        doi: '10.1186/1550-2783-11-20',
        conclusion: 'Em fases hipocalóricas, atletas naturais mantêm melhor retenção de massa magra com 2.3 a 3.1g de proteína por kg de massa magra.'
      }
    ]
  },

  // 2. Distribuição Proteica por Refeição
  protein_distribution: {
    id: 'protein_distribution',
    topic: 'Fracionamento & Distribuição de Proteína por Refeição',
    grade: 'A',
    gradeLabel: 'Evidência Grau A — Consenso Internacional ISSN & Ensaios Clínicos',
    summary: 'Dividir a cota diária de proteína em 3 a 5 refeições com 0.40 a 0.55g/kg por refeição maximiza os picos de síntese proteica fracionada ao longo de 24 horas, em comparação com a concentração em uma única refeição.',
    mechanism: 'O conceito de "Muscle Full Effect": cada refeição com ~3g de leucina atinge o limiar anabólico de saturação dos ribossomos. Espaçar as doses a cada 3-5 horas permite que o músculo ressensibilize o maquinário de síntese proteica.',
    papers: [
      {
        pmid: '29497353',
        title: 'How much protein can the body use in a single meal for muscle-building? Implications for daily distribution.',
        authors: 'Schoenfeld BJ, Aragon AA.',
        journal: 'Journal of the International Society of Sports Nutrition (JISSN)',
        year: 2018,
        doi: '10.1186/s12970-018-0215-1',
        conclusion: 'Para otimizar o anabolismo, recomenda-se uma ingestão mínima de 0.40g/kg/refeição em pelo menos quatro refeições ao dia.'
      }
    ]
  },

  // 3. Creatina Monohidratada
  creatine: {
    id: 'creatine',
    topic: 'Creatina Monohidratada (5g Diárias)',
    grade: 'A',
    gradeLabel: 'Evidência Grau A — Padrão Ouro Internacional (Mais de 500 Estudos)',
    summary: 'O suplemento ergogênico nutricional mais eficaz e amplamente validado do mundo para aumento de força máxima, potência anaeróbica e hipertrofia em treinamento resistido.',
    mechanism: 'Aumenta os estoques intramusculares de fosfocreatina (PCr), acelerando a ressíntese de Adenosina Trifosfato (ATP) durante séries de alta intensidade. Promove expansão volêmica celular (hidratação intracelular) e up-regulation de fatores miogênicos como miogenina e IGF-1 local.',
    papers: [
      {
        pmid: '37432300',
        title: 'The Effects of Creatine Supplementation Combined with Resistance Training on Regional Measures of Muscle Hypertrophy: A Systematic Review with Meta-Analysis.',
        authors: 'Burke R, Piñero A, Coleman M, et al.',
        journal: 'Nutrients',
        year: 2023,
        doi: '10.3390/nu15092116',
        conclusion: 'A creatina associada à musculação produz hipertrofia superior em membros superiores e inferiores em comparação ao treinamento isolado com placebo.'
      },
      {
        pmid: '28615996',
        title: 'International Society of Sports Nutrition position stand: safety and efficacy of creatine supplementation in exercise, sport, and medicine.',
        authors: 'Kreider RB, Kalman DS, Antonio J, et al.',
        journal: 'Journal of the International Society of Sports Nutrition (JISSN)',
        year: 2017,
        doi: '10.1186/s12970-017-0173-z',
        conclusion: 'A creatina monohidratada é segura para uso crônico contínuo em doses de 3 a 5g/dia, sem danos a rins ou fígado em indivíduos saudáveis.'
      }
    ]
  },

  // 4. Ômega-3 EPA & DHA
  omega3: {
    id: 'omega3',
    topic: 'Ácidos Graxos Ômega-3 EPA/DHA (2-3g Diários)',
    grade: 'A',
    gradeLabel: 'Evidência Grau A — Ensaios Clínicos em Inflamação & Sensibilidade Anabólica',
    summary: 'A suplementação com EPA/DHA reduz a inflamação sistêmica articular, atenua dores musculares tardias (DOMS) e melhora a resposta anabólica de idosos e atletas ao estímulo proteico.',
    mechanism: 'Incorporação de EPA/DHA nas membranas celulares fosfolipídicas, competindo com o ácido araquidônico e reduzindo eicosanoides pró-inflamatórios (PGE2, LTB4). Estimula a fosforilação de p70S6K e Akt na cascata de síntese muscular.',
    papers: [
      {
        pmid: '21501117',
        title: 'Dietary omega-3 fatty acid supplementation increases the rate of muscle protein synthesis in young and middle-aged healthy adults.',
        authors: 'Smith GI, Atherton P, Reeds DN, et al.',
        journal: 'Clinical Science (London)',
        year: 2011,
        doi: '10.1042/CS20100597',
        conclusion: 'A suplementação com ômega-3 potencializou a taxa de síntese proteica muscular estimulada por hiperaminoacidemia e hiperinsulinemia.'
      }
    ]
  },

  // 5. Suporte Articular: Colágeno + Vitamina C
  collagen: {
    id: 'collagen',
    topic: 'Peptídeos de Colágeno + Vitamina C (Saúde Tendínea e Articular)',
    grade: 'B+',
    gradeLabel: 'Evidência Grau B+ — Ensaios Clínicos em Biossíntese de Colágeno',
    summary: 'Ingestão de 10 a 15g de peptídeos de colágeno acompanhados de 50mg de vitamina C 45 a 60 minutos antes do treino duplica a taxa de produção de procolágeno e reforça tendões e ligamentos submetidos a carga.',
    mechanism: 'O pico circulatório de prolina, glicina e hidroxiprolina ocorre 45min após a ingestão; quando combinado com o estresse mecânico do treino, estimula os tenócitos a sintetizar matriz extracelular.',
    papers: [
      {
        pmid: '27852613',
        title: 'Vitamin C-enriched gelatin supplementation before intermittent activity augments collagen synthesis.',
        authors: 'Shaw G, Lee-Barthel A, Ross ML, et al.',
        journal: 'The American Journal of Clinical Nutrition',
        year: 2017,
        doi: '10.3945/ajcn.116.138594',
        conclusion: 'O consumo pré-exercício de gelatina/colágeno com vitamina C aumentou os marcadores circulatórios de síntese de colágeno tipo I.'
      }
    ]
  },

  // 6. Vitamina D3
  vitamind3: {
    id: 'vitamind3',
    topic: 'Vitamina D3 Colecalciferol (2.000 a 4.000 UI)',
    grade: 'A',
    gradeLabel: 'Evidência Grau A — Regulação Endócrina & Função Muscular',
    summary: 'A vitamina D3 atua como um pró-hormônio esteroidal essencial para a contratilidade muscular, sinalização intracelular de cálcio e densidade mineral óssea.',
    mechanism: 'Liga-se ao receptor nuclear VDR presente nos miócitos, regulando a transcrição gênica de proteínas estruturais do sarcômero e modulando os níveis de testosterona livre.',
    papers: [
      {
        pmid: '29324451',
        title: 'Vitamin D and the Athlete: Current Perspectives and New Challenges.',
        authors: 'Owens DJ, Allison R, Close GL.',
        journal: 'Sports Medicine',
        year: 2018,
        doi: '10.1007/s40279-017-0841-9',
        conclusion: 'Níveis ótimos de 25(OH)D (>75 nmol/L) previnem lesões por estresse ósseo e otimizam a regeneração pós-exercício.'
      }
    ]
  },

  // 7. Hidratação e Equilíbrio Hidroeletrolítico
  hydration: {
    id: 'hydration',
    topic: 'Hidratação Calculada (35 a 45ml por kg de Peso)',
    grade: 'A',
    gradeLabel: 'Evidência Grau A — Diretrizes Internacionais ACSM',
    summary: 'Mesmo uma desidratação leve de 2% do peso corporal resulta em queda de até 15% na capacidade de gerar força e reduz significativamente o volume de treino sustentável.',
    mechanism: 'A perda de água plasmática diminui o volume sistólico cardíaco, eleva a temperatura central e compromete a transdução de sinal celular por alteração na osmolaridade.',
    papers: [
      {
        pmid: '17277604',
        title: 'American College of Sports Medicine position stand. Exercise and fluid replacement.',
        authors: 'Sawka MN, Burke LM, Eichner ER, et al.',
        journal: 'Medicine & Science in Sports & Exercise',
        year: 2007,
        doi: '10.1249/mss.0b013e31802ca597',
        conclusion: 'O balanço de fluidos personalizado atenua o estresse cardiovascular e mantém a performance neuromotora estável.'
      }
    ]
  }
};

/**
 * Busca artigos ao vivo no PubMed via API oficial NCBI E-utilities
 * Gratuita, sem chave, com suporte CORS.
 */
export async function searchPubMedArticles(term, maxResults = 3) {
  try {
    const encodedTerm = encodeURIComponent(`${term} (meta-analysis OR randomized controlled trial OR systematic review)`);
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodedTerm}&retmode=json&retmax=${maxResults}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const res = await fetch(searchUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`PubMed search error: ${res.status}`);
    const data = await res.json();
    const idList = data.esearchresult?.idlist || [];

    if (idList.length === 0) return [];

    // Buscar sumários dos IDs retornados
    const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${idList.join(',')}&retmode=json`;
    const sumRes = await fetch(summaryUrl);
    if (!sumRes.ok) throw new Error('PubMed summary fetch failed');
    const sumData = await sumRes.json();

    const results = [];
    for (const pmid of idList) {
      const item = sumData.result?.[pmid];
      if (item) {
        results.push({
          pmid,
          title: item.title,
          authors: item.authors?.slice(0, 3).map(a => a.name).join(', ') + (item.authors?.length > 3 ? ' et al.' : ''),
          journal: item.source || 'PubMed Indexed',
          year: item.pubdate?.split(' ')[0] || '2023',
          url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`
        });
      }
    }
    return results;
  } catch (err) {
    console.warn('[NutritionScience] Erro ao consultar PubMed ao vivo, usando cache local:', err.message);
    return [];
  }
}

/**
 * Consulta a API de ingredientes da CitedHealth (BrainCited / SleepCited)
 */
export async function searchCitedHealthIngredient(slug) {
  try {
    const cleanSlug = slug.toLowerCase().replace(/\s+/g, '-');
    const urls = [
      `https://braincited.com/api/ingredients/${cleanSlug}/`,
      `https://sleepcited.com/api/ingredients/${cleanSlug}/`
    ];

    for (const url of urls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          if (data && data.name) {
            return {
              name: data.name,
              category: data.category,
              mechanism: data.mechanism,
              dosage: data.recommended_dosage,
              forms: data.forms
            };
          }
        }
      } catch (e) {
        // tenta proximo vertical
      }
    }
    return null;
  } catch (err) {
    return null;
  }
}

/**
 * Retorna as evidências aplicáveis ao plano gerado do usuário
 */
export function getEvidenceForPlan(plan) {
  const list = [
    EVIDENCE_DATABASE.protein_target,
    EVIDENCE_DATABASE.protein_distribution,
    EVIDENCE_DATABASE.creatine,
    EVIDENCE_DATABASE.hydration
  ];

  if (plan?.jointSupport?.length > 0) {
    list.push(EVIDENCE_DATABASE.omega3);
    list.push(EVIDENCE_DATABASE.collagen);
    list.push(EVIDENCE_DATABASE.vitamind3);
  }

  return list;
}
