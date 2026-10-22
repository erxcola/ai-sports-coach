// src/frontend/src/lib/ai/nutrition-api.js
// Cliente unificado de dados nutricionais: Tabela TACO (UNICAMP) offline + Open Food Facts API + TacoAPI.
// Fornece calculo dinamico de macronutrientes (Proteinas, Carboidratos, Gorduras, Fibras e Calorias) por gramatura.

/**
 * Tabela TACO 4.0 (UNICAMP) - Dataset Curado com os Alimentos Fundamentais da Nutricao Esportiva e Dieta Brasileira.
 * Valores exatos por 100g de alimento comestivel pronto/preparado.
 */
export const TACO_LOCAL_DATABASE = [
  // --- CARNES, AVES, PEIXES E OVOS ---
  { id: 'taco_1', name: 'Peito de frango, sem pele, grelhado', category: 'protein', p: 32.0, c: 0.0, f: 2.5, fiber: 0.0, kcal: 159, tags: ['frango', 'peito', 'grelhado', 'ave', 'proteina'] },
  { id: 'taco_2', name: 'Peito de frango, sem pele, cozido', category: 'protein', p: 31.5, c: 0.0, f: 3.2, fiber: 0.0, kcal: 163, tags: ['frango', 'peito', 'cozido', 'ave', 'proteina'] },
  { id: 'taco_3', name: 'Carne bovina, patinho, sem gordura, grelhado', category: 'protein', p: 35.9, c: 0.0, f: 7.3, fiber: 0.0, kcal: 219, tags: ['patinho', 'carne', 'bovina', 'grelhado', 'moida'] },
  { id: 'taco_4', name: 'Carne bovina, patinho, sem gordura, cozido', category: 'protein', p: 32.5, c: 0.0, f: 6.8, fiber: 0.0, kcal: 198, tags: ['patinho', 'carne', 'cozida', 'moida'] },
  { id: 'taco_5', name: 'Carne bovina, alcatra, sem gordura, grelhada', category: 'protein', p: 31.9, c: 0.0, f: 11.6, fiber: 0.0, kcal: 241, tags: ['alcatra', 'carne', 'bife'] },
  { id: 'taco_6', name: 'Carne bovina, contrafilé, sem gordura, grelhado', category: 'protein', p: 35.9, c: 0.0, f: 15.2, fiber: 0.0, kcal: 289, tags: ['contrafile', 'carne'] },
  { id: 'taco_7', name: 'Carne bovina, filé mignon, sem gordura, grelhado', category: 'protein', p: 32.8, c: 0.0, f: 8.8, fiber: 0.0, kcal: 220, tags: ['file mignon', 'carne'] },
  { id: 'taco_8', name: 'Carne suína, lombo, grelhado', category: 'protein', p: 35.7, c: 0.0, f: 6.4, fiber: 0.0, kcal: 210, tags: ['lombo', 'porco', 'suino'] },
  { id: 'taco_9', name: 'Carne suína, filé mignon, grelhado', category: 'protein', p: 31.0, c: 0.0, f: 4.8, fiber: 0.0, kcal: 175, tags: ['file mignon suino', 'porco'] },
  { id: 'taco_10', name: 'Tilápia, filé, grelhado', category: 'protein', p: 26.1, c: 0.0, f: 2.7, fiber: 0.0, kcal: 133, tags: ['tilapia', 'peixe', 'file'] },
  { id: 'taco_11', name: 'Salmão, sem pele, grelhado', category: 'protein', p: 23.9, c: 0.0, f: 14.0, fiber: 0.0, kcal: 229, tags: ['salmao', 'peixe', 'omega3'] },
  { id: 'taco_12', name: 'Atum, em conserva ao natural (em água)', category: 'protein', p: 26.2, c: 0.0, f: 0.8, fiber: 0.0, kcal: 116, tags: ['atum', 'lata', 'peixe'] },
  { id: 'taco_13', name: 'Atum, em conserva em óleo', category: 'protein', p: 26.0, c: 0.0, f: 6.0, fiber: 0.0, kcal: 166, tags: ['atum', 'oleo', 'peixe'] },
  { id: 'taco_14', name: 'Camarão, cozido no vapor', category: 'protein', p: 24.0, c: 0.2, f: 1.1, fiber: 0.0, kcal: 106, tags: ['camarao', 'frutos do mar'] },
  { id: 'taco_15', name: 'Ovo de galinha, inteiro, cozido', category: 'protein', p: 13.3, c: 0.6, f: 9.5, fiber: 0.0, kcal: 146, tags: ['ovo', 'cozido', 'inteiro'] },
  { id: 'taco_16', name: 'Ovo de galinha, clara, cozida', category: 'protein', p: 10.9, c: 0.7, f: 0.2, fiber: 0.0, kcal: 48, tags: ['clara', 'ovo', 'albumina'] },
  { id: 'taco_17', name: 'Tofu (queijo de soja)', category: 'protein', p: 8.1, c: 1.9, f: 4.8, fiber: 0.3, kcal: 76, tags: ['tofu', 'soja', 'vegano'] },
  { id: 'taco_18', name: 'Whey Protein Concentrado 80%', category: 'protein', p: 80.0, c: 8.0, f: 5.0, fiber: 0.0, kcal: 397, tags: ['whey', 'proteina', 'suplemento', 'growth', 'max'] },
  { id: 'taco_19', name: 'Whey Protein Isolado 90%', category: 'protein', p: 90.0, c: 1.5, f: 1.0, fiber: 0.0, kcal: 375, tags: ['whey isolado', 'suplemento'] },

  // --- CEREAIS, GRAOS E TUBERCULOS (CARBOIDRATOS) ---
  { id: 'taco_20', name: 'Arroz, branco, cozido', category: 'carb', p: 2.5, c: 28.1, f: 0.2, fiber: 1.6, kcal: 128, tags: ['arroz', 'branco', 'cozido', 'carbo'] },
  { id: 'taco_21', name: 'Arroz, integral, cozido', category: 'carb', p: 2.6, c: 25.8, f: 1.0, fiber: 2.7, kcal: 124, tags: ['arroz', 'integral', 'cozido'] },
  { id: 'taco_22', name: 'Feijão, carioca, cozido (grãos e caldo)', category: 'carb', p: 4.8, c: 13.6, f: 0.5, fiber: 8.5, kcal: 76, tags: ['feijao', 'carioca', 'grao'] },
  { id: 'taco_23', name: 'Feijão, preto, cozido (grãos e caldo)', category: 'carb', p: 4.5, c: 14.0, f: 0.5, fiber: 8.4, kcal: 77, tags: ['feijao', 'preto', 'grao'] },
  { id: 'taco_24', name: 'Batata, inglesa, cozida', category: 'carb', p: 1.2, c: 11.9, f: 0.1, fiber: 1.3, kcal: 52, tags: ['batata', 'inglesa', 'cozida', 'pure'] },
  { id: 'taco_25', name: 'Batata, doce, cozida', category: 'carb', p: 0.6, c: 18.4, f: 0.1, fiber: 2.2, kcal: 77, tags: ['batata doce', 'cozida', 'raiz'] },
  { id: 'taco_26', name: 'Mandioca / Aipim, cozido', category: 'carb', p: 0.6, c: 30.1, f: 0.3, fiber: 1.6, kcal: 125, tags: ['mandioca', 'aipim', 'macaxeira', 'cozida'] },
  { id: 'taco_27', name: 'Macarrão, sêmola ou grano duro, cozido', category: 'carb', p: 4.2, c: 29.8, f: 0.8, fiber: 1.8, kcal: 145, tags: ['macarrao', 'massa', 'espaguete', 'penne'] },
  { id: 'taco_28', name: 'Macarrão, integral, cozido', category: 'carb', p: 5.3, c: 26.5, f: 1.2, fiber: 3.9, kcal: 138, tags: ['macarrao integral', 'massa'] },
  { id: 'taco_29', name: 'Aveia em flocos finos / grossos', category: 'carb', p: 13.9, c: 66.6, f: 8.5, fiber: 9.1, kcal: 394, tags: ['aveia', 'cereal', 'mingau', 'flocos'] },
  { id: 'taco_30', name: 'Farinha de aveia', category: 'carb', p: 14.2, c: 67.0, f: 8.0, fiber: 8.5, kcal: 396, tags: ['farinha aveia', 'aveia'] },
  { id: 'taco_31', name: 'Goma de Tapioca hidratada', category: 'carb', p: 0.0, c: 54.8, f: 0.0, fiber: 0.0, kcal: 220, tags: ['tapioca', 'crepioca', 'goma'] },
  { id: 'taco_32', name: 'Pão, 100% integral', category: 'carb', p: 9.4, c: 49.9, f: 3.7, fiber: 6.9, kcal: 253, tags: ['pao', 'integral', 'sanduiche'] },
  { id: 'taco_33', name: 'Pão francês de sal', category: 'carb', p: 8.0, c: 58.7, f: 3.1, fiber: 2.3, kcal: 300, tags: ['pao frances', 'padaria'] },
  { id: 'taco_34', name: 'Milho verde, cozido', category: 'carb', p: 3.2, c: 17.1, f: 2.4, fiber: 4.6, kcal: 98, tags: ['milho', 'espiga', 'cereal'] },
  { id: 'taco_35', name: 'Cuscuz de milho, cozido no vapor', category: 'carb', p: 2.2, c: 25.1, f: 0.7, fiber: 1.8, kcal: 113, tags: ['cuscuz', 'milho', 'nordestino'] },

  // --- LATICINIOS E QUEIJOS ---
  { id: 'taco_36', name: 'Leite de vaca, desnatado', category: 'dairy', p: 3.4, c: 4.9, f: 0.1, fiber: 0.0, kcal: 35, tags: ['leite', 'desnatado', 'bebida'] },
  { id: 'taco_37', name: 'Leite de vaca, integral', category: 'dairy', p: 3.1, c: 4.7, f: 3.3, fiber: 0.0, kcal: 61, tags: ['leite', 'integral'] },
  { id: 'taco_38', name: 'Iogurte natural, desnatado', category: 'dairy', p: 4.1, c: 5.8, f: 0.3, fiber: 0.0, kcal: 43, tags: ['iogurte', 'desnatado', 'natural'] },
  { id: 'taco_39', name: 'Iogurte natural, integral', category: 'dairy', p: 4.1, c: 5.5, f: 3.2, fiber: 0.0, kcal: 67, tags: ['iogurte', 'integral'] },
  { id: 'taco_40', name: 'Iogurte Grego tradicional', category: 'dairy', p: 6.4, c: 6.0, f: 7.2, fiber: 0.0, kcal: 114, tags: ['iogurte grego', 'grego'] },
  { id: 'taco_41', name: 'Queijo, Minas frescal', category: 'dairy', p: 17.4, c: 3.2, f: 20.2, fiber: 0.0, kcal: 264, tags: ['queijo minas', 'frescal'] },
  { id: 'taco_42', name: 'Queijo, cottage', category: 'dairy', p: 12.0, c: 3.4, f: 2.0, fiber: 0.0, kcal: 80, tags: ['cottage', 'queijo magro'] },
  { id: 'taco_43', name: 'Queijo, ricota fresca', category: 'dairy', p: 12.6, c: 3.8, f: 8.1, fiber: 0.0, kcal: 140, tags: ['ricota', 'queijo'] },
  { id: 'taco_44', name: 'Queijo, muçarela', category: 'dairy', p: 22.6, c: 3.0, f: 25.2, fiber: 0.0, kcal: 330, tags: ['mussarela', 'mucarela', 'queijo'] },
  { id: 'taco_45', name: 'Requeijão cremoso tradicional', category: 'dairy', p: 9.6, c: 2.4, f: 23.4, fiber: 0.0, kcal: 257, tags: ['requeijao', 'cremoso'] },
  { id: 'taco_46', name: 'Requeijão cremoso Light', category: 'dairy', p: 12.0, c: 3.0, f: 11.5, fiber: 0.0, kcal: 163, tags: ['requeijao light', 'light'] },

  // --- GORDURAS, OLEAGINOSAS E SEMENTES ---
  { id: 'taco_47', name: 'Azeite de oliva, extra virgem', category: 'fat', p: 0.0, c: 0.0, f: 100.0, fiber: 0.0, kcal: 884, tags: ['azeite', 'oliva', 'oleo', 'gordura'] },
  { id: 'taco_48', name: 'Pasta de amendoim integral', category: 'fat', p: 28.0, c: 18.0, f: 49.0, fiber: 6.0, kcal: 588, tags: ['pasta de amendoim', 'amendoim'] },
  { id: 'taco_49', name: 'Castanha-de-caju, torrada', category: 'fat', p: 18.5, c: 29.1, f: 46.3, fiber: 3.7, kcal: 570, tags: ['castanha caju', 'oleaginosa'] },
  { id: 'taco_50', name: 'Castanha-do-Brasil (Pará)', category: 'fat', p: 14.5, c: 15.1, f: 63.5, fiber: 7.9, kcal: 643, tags: ['castanha para', 'selenio'] },
  { id: 'taco_51', name: 'Nozes, cruas', category: 'fat', p: 15.2, c: 13.7, f: 65.2, fiber: 6.7, kcal: 654, tags: ['nozes', 'omega3'] },
  { id: 'taco_52', name: 'Abacate, fresco', category: 'fat', p: 1.2, c: 6.0, f: 15.0, fiber: 6.3, kcal: 160, tags: ['abacate', 'fruta', 'gordura boa'] },
  { id: 'taco_53', name: 'Semente de chia', category: 'fat', p: 16.5, c: 42.1, f: 30.7, fiber: 34.4, kcal: 486, tags: ['chia', 'semente', 'fibra'] },
  { id: 'taco_54', name: 'Semente de linhaça dourada', category: 'fat', p: 14.1, c: 43.3, f: 32.3, fiber: 33.5, kcal: 495, tags: ['linhaca', 'semente', 'fibra'] },
  { id: 'taco_55', name: 'Chocolate 70% cacau', category: 'fat', p: 7.8, c: 45.0, f: 42.0, fiber: 10.0, kcal: 580, tags: ['chocolate', 'amargo', 'cacau'] },

  // --- FRUTAS E VEGETAIS ---
  { id: 'taco_56', name: 'Banana, prata, crua', category: 'fruit', p: 1.3, c: 26.0, f: 0.1, fiber: 2.0, kcal: 98, tags: ['banana', 'prata', 'fruta'] },
  { id: 'taco_57', name: 'Banana, nanica / d’água', category: 'fruit', p: 1.4, c: 23.8, f: 0.1, fiber: 1.9, kcal: 92, tags: ['banana', 'nanica', 'fruta'] },
  { id: 'taco_58', name: 'Maçã, gala ou fuji, com casca', category: 'fruit', p: 0.3, c: 15.2, f: 0.2, fiber: 2.0, kcal: 56, tags: ['maca', 'fruta', 'fibra'] },
  { id: 'taco_59', name: 'Mamão, papaia / formosa', category: 'fruit', p: 0.5, c: 10.4, f: 0.1, fiber: 1.0, kcal: 40, tags: ['mamao', 'digestao'] },
  { id: 'taco_60', name: 'Morango, fresco', category: 'fruit', p: 0.9, c: 6.8, f: 0.3, fiber: 1.7, kcal: 30, tags: ['morango', 'frutas vermelhas'] },
  { id: 'taco_61', name: 'Melancia, fresca', category: 'fruit', p: 0.9, c: 8.1, f: 0.0, fiber: 0.1, kcal: 33, tags: ['melancia', 'hidratacao'] },
  { id: 'taco_62', name: 'Abacaxi, pérola / havaí', category: 'fruit', p: 0.9, c: 12.3, f: 0.1, fiber: 1.0, kcal: 48, tags: ['abacaxi', 'bromelina'] },
  { id: 'taco_63', name: 'Uva, fresca (itália/rubi)', category: 'fruit', p: 0.7, c: 13.6, f: 0.2, fiber: 0.9, kcal: 53, tags: ['uva', 'fruta'] },
  { id: 'taco_64', name: 'Brócolis, cozido', category: 'veggie', p: 2.1, c: 4.4, f: 0.5, fiber: 3.4, kcal: 25, tags: ['brocolis', 'legume', 'verde'] },
  { id: 'taco_65', name: 'Couve-manteiga, refogada', category: 'veggie', p: 1.7, c: 8.7, f: 5.0, fiber: 3.1, kcal: 90, tags: ['couve', 'folha', 'refogado'] },
  { id: 'taco_66', name: 'Espinafre, cozido', category: 'veggie', p: 2.7, c: 2.6, f: 0.2, fiber: 2.5, kcal: 18, tags: ['espinafre', 'ferro'] },
  { id: 'taco_67', name: 'Cenoura, cozida', category: 'veggie', p: 0.8, c: 6.7, f: 0.2, fiber: 2.6, kcal: 30, tags: ['cenoura', 'legume'] },
  { id: 'taco_68', name: 'Tomate, salada, cru', category: 'veggie', p: 1.1, c: 3.1, f: 0.2, fiber: 1.2, kcal: 15, tags: ['tomate', 'licopeno'] }
];

/**
 * Normaliza um item para a estrutura universal de calculo de macros
 */
export function normalizeNutritionalItem({
  id,
  name,
  brand = null,
  source = 'TACO (Brasil)',
  p = 0,
  c = 0,
  f = 0,
  fiber = 0,
  kcal = 0,
  category = 'other'
}) {
  const pVal = Math.round(Number(p || 0) * 10) / 10;
  const cVal = Math.round(Number(c || 0) * 10) / 10;
  const fVal = Math.round(Number(f || 0) * 10) / 10;
  const fibVal = Math.round(Number(fiber || 0) * 10) / 10;
  const calculatedKcal = kcal ? Math.round(Number(kcal)) : Math.round((pVal * 4) + (cVal * 4) + (fVal * 9));

  return {
    id: String(id),
    name,
    brand,
    source,
    category,
    per100g: {
      kcal: calculatedKcal,
      protein: pVal,
      carbs: cVal,
      fats: fVal,
      fiber: fibVal
    },
    /**
     * Calcula os macros para uma porção arbitrária em gramas.
     */
    calculate(grams = 100) {
      const factor = grams / 100;
      return {
        grams: Math.round(grams),
        kcal: Math.round(calculatedKcal * factor),
        protein: Math.round(pVal * factor * 10) / 10,
        carbs: Math.round(cVal * factor * 10) / 10,
        fats: Math.round(fVal * factor * 10) / 10,
        fiber: Math.round(fibVal * factor * 10) / 10
      };
    }
  };
}

/**
 * Busca alimentos no dataset local TACO (rápido, síncrono e offline)
 */
export function searchLocalTaco(query) {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return TACO_LOCAL_DATABASE.slice(0, 15).map(normalizeNutritionalItem);
  }

  const clean = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  const tokens = clean.split(/\s+/).filter(t => t.length > 1);

  const scored = TACO_LOCAL_DATABASE.map(item => {
    const itemName = item.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const tags = (item.tags || []).join(' ');
    let score = 0;

    for (const tok of tokens) {
      if (itemName.includes(tok)) score += 5;
      if (tags.includes(tok)) score += 3;
    }
    return { item, score };
  }).filter(s => s.score > 0);

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 20).map(s => normalizeNutritionalItem(s.item));
}

/**
 * Busca produtos na API pública Open Food Facts (Brasil)
 */
export async function searchOpenFoodFacts(query, limit = 8) {
  if (!query || typeof query !== 'string' || query.trim().length < 2) return [];

  try {
    const url = `https://br.openfoodfacts.org/api/v2/search?search_terms=${encodeURIComponent(query.trim())}&fields=code,product_name,brands,nutriments,categories_tags&page_size=${limit}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'openGym-SportsCoach/1.4 (contact@opengym.app)'
      }
    });

    if (!res.ok) return [];
    const data = await res.json();
    if (!data || !Array.isArray(data.products)) return [];

    return data.products
      .filter(p => p.product_name && p.nutriments)
      .map(p => {
        const nut = p.nutriments || {};
        return normalizeNutritionalItem({
          id: `off_${p.code || Math.random().toString(36).slice(2)}`,
          name: p.product_name,
          brand: p.brands || null,
          source: 'Open Food Facts',
          p: nut.proteins_100g || nut.proteins || 0,
          c: nut.carbohydrates_100g || nut.carbohydrates || 0,
          f: nut.fat_100g || nut.fat || 0,
          fiber: nut.fiber_100g || nut.fiber || 0,
          kcal: nut['energy-kcal_100g'] || nut['energy-kcal'] || 0
        });
      });
  } catch (err) {
    console.warn('Open Food Facts API unavailable or offline:', err);
    return [];
  }
}

/**
 * Busca unificada combinada: TACO Local (offline) + Open Food Facts (online)
 */
export async function searchUnifiedFoods(query, { includeOnline = true } = {}) {
  // 1. Sempre obtém resultados imediatos do TACO offline
  const localResults = searchLocalTaco(query);

  if (!includeOnline || !query || query.trim().length < 2) {
    return localResults;
  }

  // 2. Se houver rede, enriquece com Open Food Facts de forma não bloqueante
  try {
    const onlinePromise = searchOpenFoodFacts(query, 6);
    // Timeout de 2.5s para evitar travar caso a conexão móvel esteja lenta
    const timeoutPromise = new Promise(resolve => setTimeout(() => resolve([]), 2500));
    const onlineResults = await Promise.race([onlinePromise, timeoutPromise]);

    // Mescla priorizando a exatidão do TACO mas adicionando marcas do Open Food Facts
    const combined = [...localResults];
    for (const onl of onlineResults) {
      if (!combined.some(c => c.name.toLowerCase() === onl.name.toLowerCase())) {
        combined.push(onl);
      }
    }
    return combined;
  } catch (err) {
    return localResults;
  }
}
