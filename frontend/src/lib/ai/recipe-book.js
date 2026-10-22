// src/frontend/src/lib/ai/recipe-book.js
// Livro de Receitas Fit & Sugestões de Substituição para o Plano Nutricional
// Cada receita possui calorias e macronutrientes calibrados para encaixe perfeito nas refeições.

export const RECIPE_BOOK = [
  // ================= CAFÉ DA MANHÃ / LANCHES =================
  {
    id: 'panqueca-whey-aveia',
    name: 'Panqueca Doce de Aveia, Banana & Whey',
    category: 'breakfast_snack',
    calories: 420,
    protein: 36,
    carbs: 48,
    fat: 8,
    prepTime: '8 min',
    tags: ['Doce', 'Rápida', 'Hiperproteica'],
    ingredients: [
      '1 banana média amassada (80g)',
      '30g de farelo ou farinha de aveia',
      '1 scoop (30g) de Whey Protein (Baunilha ou Chocolate)',
      '1 ovo inteiro + 2 claras',
      '1 colher de café de canela em pó'
    ],
    instructions: 'Misture todos os ingredientes até obter uma massa homogênea. Despeje em frigideira antiaderente untada em fogo baixo. Vire ao dourar (aprox. 2 min por lado).'
  },
  {
    id: 'crepioca-frango-requeijao',
    name: 'Crepioca Crocante de Frango & Requeijão Light',
    category: 'breakfast_snack',
    calories: 440,
    protein: 42,
    carbs: 38,
    fat: 10,
    prepTime: '10 min',
    tags: ['Salgada', 'Sem Glúten', 'Crocante'],
    ingredients: [
      '2 ovos inteiros',
      '30g de goma de tapioca hidratada',
      '120g de peito de frango desfiado e temperado',
      '30g (1 colher de sopa cheia) de requeijão light',
      'Orégano e sal a gosto'
    ],
    instructions: 'Bata os ovos com a tapioca e o sal. Despeje na frigideira bem quente. Quando a massa firmar, recheie com o frango e requeijão, dobre ao meio e deixe tostar os dois lados.'
  },
  {
    id: 'bowl-iogurte-whey-frutas',
    name: 'Bowl Cremoso de Iogurte Grego, Whey & Frutas Vermelhas',
    category: 'breakfast_snack',
    calories: 380,
    protein: 40,
    carbs: 42,
    fat: 6,
    prepTime: '3 min',
    tags: ['Refrescante', 'Sem Fogão', 'Anti-inflamatório'],
    ingredients: [
      '170g de iogurte natural desnatado ou grego zero',
      '1 scoop (30g) de Whey Protein de Baunilha ou Morango',
      '100g de morangos ou amoras frescas picadas',
      '20g de granola sem açúcar ou aveia em flocos finos',
      '1 colher de sopa de sementes de chia'
    ],
    instructions: 'Misture o iogurte com o Whey até formar um creme denso e aveludado. Cubra com as frutas vermelhas, chia e a granola crocante.'
  },
  {
    id: 'mingau-aveia-cacau-pasta',
    name: 'Mingau Anabólico de Aveia, Cacau 100% & Amendoim',
    category: 'breakfast_snack',
    calories: 490,
    protein: 38,
    carbs: 54,
    fat: 14,
    prepTime: '5 min',
    tags: ['Pré-treino', 'Conforto', 'Energia Duradoura'],
    ingredients: [
      '40g de aveia em flocos',
      '150ml de leite desnatado ou leite de amêndoas',
      '1 colher de sopa (10g) de cacau em pó 100%',
      '1 scoop (30g) de Whey Protein sabor Chocolate',
      '15g de pasta de amendoim integral'
    ],
    instructions: 'Cozinhe a aveia, o leite e o cacau no micro-ondas por 2 minutos (ou na panela). Desligue o fogo, adicione o Whey misturando bem para não talhar e finalize com a pasta de amendoim.'
  },
  {
    id: 'omelete-cottage-torrada',
    name: 'Omelete Proteica com Queijo Cottage & Pão 100% Integral',
    category: 'breakfast_snack',
    calories: 410,
    protein: 37,
    carbs: 32,
    fat: 12,
    prepTime: '7 min',
    tags: ['Salgada', 'Tradicional', 'Rica em Cálcio'],
    ingredients: [
      '2 ovos inteiros + 2 claras',
      '60g de queijo cottage ou ricota fresca',
      '2 fatias de pão 100% integral (50g)',
      'Tomate picado e orégano'
    ],
    instructions: 'Bata os ovos com tomate e orégano e prepare a omelete na frigideira. Recheie com o queijo cottage. Aqueça as fatias de pão na torradeira.'
  },

  // ================= ALMOÇO / JANTAR =================
  {
    id: 'strogonoff-fit-airfryer',
    name: 'Strogonoff Fit Cremoso com Batata Rústica na Airfryer',
    category: 'main_meal',
    calories: 590,
    protein: 52,
    carbs: 62,
    fat: 12,
    prepTime: '20 min',
    tags: ['Almoço de Domingo', 'Cremoso', 'Alta Saciedade'],
    ingredients: [
      '180g de peito de frango em cubos',
      '200g de batata inglesa ou batata-doce cortada em gomos',
      '80g de creme de ricota light ou requeijão light',
      '2 colheres de sopa de molho de tomate caseiro e mostarda dijon',
      'Champignon laminado a gosto'
    ],
    instructions: 'Asse as batatas na Airfryer a 200°C por 18 min até dourarem. Em uma panela, doure o frango com cebola e alho, adicione o molho de tomate, mostarda, champignon e finalize desligando o fogo e incorporando o creme de ricota.'
  },
  {
    id: 'burger-patinho-brioche',
    name: 'Hambúrguer Artesanal Fit de Patinho & Molho Especial',
    category: 'main_meal',
    calories: 610,
    protein: 54,
    carbs: 56,
    fat: 16,
    prepTime: '15 min',
    tags: ['Cheat Meal Limpo', 'Sabor Máximo', 'Zero Culpa'],
    ingredients: [
      '200g de patinho bovino moído (moldado em hambúrguer)',
      '1 pão de hambúrguer tipo brioche artesanal (60g)',
      '1 fatia de queijo muçarela ou cheddar light (20g)',
      'Molho especial: 30g iogurte grego + 1 colher de chá de mostarda e páprica defumada',
      'Folhas de rúcula, tomate e cebola roxa'
    ],
    instructions: 'Grelhe o hambúrguer de patinho em frigideira quente (aprox. 3 min por lado), derreta o queijo por cima. Toste levemente o pão, passe o molho especial de iogurte e monte com os vegetais.'
  },
  {
    id: 'macarrao-bolonhesa-rustico',
    name: 'Penne Proteico ao Molho Bolonhesa Rústico & Parmesão',
    category: 'main_meal',
    calories: 620,
    protein: 48,
    carbs: 72,
    fat: 14,
    prepTime: '18 min',
    tags: ['Massa', 'Energia para Treino', 'Comfort Food'],
    ingredients: [
      '80g (pesado cru) de macarrão penne integral ou grano duro',
      '170g de patinho ou acém moído magro',
      '120g de molho de tomate pelado italiano com manjericão',
      '15g de queijo parmesão ralado na hora'
    ],
    instructions: 'Cozinhe a massa al dente. Em paralelo, refogue a carne moída com alho, cebola e temperos a gosto. Adicione o molho de tomate e cozinhe por 10 min. Misture à massa e finalize com o parmesão.'
  },
  {
    id: 'risoto-frango-curry',
    name: 'Risoto Fit Cremoso de Frango, Arroz Branco & Açafrão',
    category: 'main_meal',
    calories: 580,
    protein: 50,
    carbs: 68,
    fat: 11,
    prepTime: '15 min',
    tags: ['Cremoso', 'Fácil Digestão', 'Anti-inflamatório'],
    ingredients: [
      '180g de peito de frango grelhado e desfiado',
      '200g de arroz branco cozido (bem quentinho)',
      '50g de queijo cottage ou requeijão light',
      '1 colher de café de cúrcuma/açafrão da terra e curry',
      'Cheiro verde picado fresco'
    ],
    instructions: 'Em uma panela, junte o frango desfiado, o arroz cozido, açafrão e umas 3 colheres de água morna. Mexa em fogo baixo. Adicione o queijo cottage e mexa vigorosamente até ficar aveludado como um risoto.'
  },
  {
    id: 'wrap-mignon-suino-salada',
    name: 'Wrap Proteico de Mignon Suíno / Frango com Salada Crocante',
    category: 'main_meal',
    calories: 520,
    protein: 46,
    carbs: 50,
    fat: 13,
    prepTime: '12 min',
    tags: ['Prático', 'Refrescante', 'Para Levar'],
    ingredients: [
      '2 discos de pão tipo Rap10 integral (80g)',
      '170g de filé mignon suíno ou frango em tiras grelhado',
      '40g de guacamole ou pasta de ricota',
      'Alface americana ralada, cenoura ralada e tomate cereja'
    ],
    instructions: 'Aqueça rapidamente as massas de wrap. Espalhe a pasta de ricota/guacamole, acomode as tiras de carne grelhadas e adicione a salada fresca. Enrole bem firme.'
  },
  {
    id: 'prato-executivo-fit',
    name: 'Prato Feito Tradicional: Frango, Arroz, Feijão & Salada',
    category: 'main_meal',
    calories: 610,
    protein: 52,
    carbs: 70,
    fat: 11,
    prepTime: '15 min',
    tags: ['Tradicional Brasileiro', 'Micro e Macronutrientes'],
    ingredients: [
      '160g de filé de frango grelhado no azeite',
      '160g de arroz branco ou integral cozido',
      '100g de feijão carioca ou preto em grãos',
      'Prato cheio de salada verde e legumes (brócolis, cenoura, tomate) à vontade'
    ],
    instructions: 'O clássico padrão ouro brasileiro: frango temperado grelhado, acompanhado de arroz soltinho, feijão temperado com louro e salada farta.'
  }
];

/**
 * Retorna receitas compatíveis para substituição de acordo com a categoria da refeição.
 */
export function getRecipesForMeal(mealType = 'main_meal') {
  if (mealType === 'breakfast' || mealType === 'snack') {
    return RECIPE_BOOK.filter(r => r.category === 'breakfast_snack');
  }
  return RECIPE_BOOK.filter(r => r.category === 'main_meal');
}

/**
 * Gera distribuição modular de refeições e horários com base no número escolhido (3 a 6).
 */
export function generateModularDietSchedule(mealCount = 4, totalCalories = 2200, macros = { protein: 160, carbs: 220, fats: 65 }) {
  const p = macros.protein;
  const c = macros.carbs;
  const f = macros.fats;

  switch (mealCount) {
    case 3:
      return [
        {
          id: 'meal-1',
          name: 'Café da Manhã & Pré-Treino',
          time: '08:00',
          calories: Math.round(totalCalories * 0.32),
          protein: Math.round(p * 0.30),
          carbs: Math.round(c * 0.35),
          fat: Math.round(f * 0.30),
          category: 'breakfast',
          defaultFood: '3 ovos mexidos + 2 fatias de pão integral (50g) + 1 fruta (maçã ou banana) + 200ml café puro',
          currentRecipe: RECIPE_BOOK.find(r => r.id === 'crepioca-frango-requeijao')
        },
        {
          id: 'meal-2',
          name: 'Almoço Reforçado',
          time: '13:00',
          calories: Math.round(totalCalories * 0.40),
          protein: Math.round(p * 0.42),
          carbs: Math.round(c * 0.40),
          fat: Math.round(f * 0.40),
          category: 'main_meal',
          defaultFood: '180g Filé de frango grelhado + 220g Arroz branco + 120g Feijão + Salada verde com 1 colher de sopa de azeite',
          currentRecipe: RECIPE_BOOK.find(r => r.id === 'prato-executivo-fit')
        },
        {
          id: 'meal-3',
          name: 'Jantar Restaurador',
          time: '19:30',
          calories: Math.round(totalCalories * 0.28),
          protein: Math.round(p * 0.28),
          carbs: Math.round(c * 0.25),
          fat: Math.round(f * 0.30),
          category: 'main_meal',
          defaultFood: '160g Patinho moído + 180g Mandioca ou Batata na Airfryer + Legumes salteados',
          currentRecipe: RECIPE_BOOK.find(r => r.id === 'strogonoff-fit-airfryer')
        }
      ];

    case 5:
      return [
        {
          id: 'meal-1',
          name: 'Café da Manhã',
          time: '07:30',
          calories: Math.round(totalCalories * 0.20),
          protein: Math.round(p * 0.20),
          carbs: Math.round(c * 0.22),
          fat: Math.round(f * 0.18),
          category: 'breakfast',
          defaultFood: '2 ovos inteiros mexidos + 1 fatia de pão integral + 1 banana média',
          currentRecipe: RECIPE_BOOK.find(r => r.id === 'panqueca-whey-aveia')
        },
        {
          id: 'meal-2',
          name: 'Almoço Anabólico',
          time: '12:00',
          calories: Math.round(totalCalories * 0.28),
          protein: Math.round(p * 0.28),
          carbs: Math.round(c * 0.28),
          fat: Math.round(f * 0.26),
          category: 'main_meal',
          defaultFood: '160g Peito de frango + 180g Arroz + 100g Feijão + Salada farta',
          currentRecipe: RECIPE_BOOK.find(r => r.id === 'prato-executivo-fit')
        },
        {
          id: 'meal-3',
          name: 'Lanche da Tarde (Pré-Treino)',
          time: '15:30',
          calories: Math.round(totalCalories * 0.18),
          protein: Math.round(p * 0.18),
          carbs: Math.round(c * 0.22),
          fat: Math.round(f * 0.14),
          category: 'snack',
          defaultFood: '1 pote de iogurte natural + 1 scoop de Whey (30g) + 30g de aveia em flocos',
          currentRecipe: RECIPE_BOOK.find(r => r.id === 'bowl-iogurte-whey-frutas')
        },
        {
          id: 'meal-4',
          name: 'Jantar',
          time: '19:30',
          calories: Math.round(totalCalories * 0.24),
          protein: Math.round(p * 0.24),
          carbs: Math.round(c * 0.22),
          fat: Math.round(f * 0.26),
          category: 'main_meal',
          defaultFood: '150g Carne moída magra + 180g Batata cozida ou Purê + Brócolis no vapor',
          currentRecipe: RECIPE_BOOK.find(r => r.id === 'macarrao-bolonhesa-rustico')
        },
        {
          id: 'meal-5',
          name: 'Ceia / Recuperação Noturna',
          time: '22:30',
          calories: Math.round(totalCalories * 0.10),
          protein: Math.round(p * 0.10),
          carbs: Math.round(c * 0.06),
          fat: Math.round(f * 0.16),
          category: 'snack',
          defaultFood: '150g Iogurte grego zero ou 2 ovos cozidos + 1 colher de chá de sementes de abóbora',
          currentRecipe: RECIPE_BOOK.find(r => r.id === 'mingau-aveia-cacau-pasta')
        }
      ];

    case 6:
      return [
        {
          id: 'meal-1',
          name: 'Café da Manhã',
          time: '07:00',
          calories: Math.round(totalCalories * 0.16),
          protein: Math.round(p * 0.16),
          carbs: Math.round(c * 0.18),
          fat: Math.round(f * 0.15),
          category: 'breakfast',
          defaultFood: '2 ovos mexidos + 1 fatia de pão 100% integral + 1 fruta',
          currentRecipe: RECIPE_BOOK.find(r => r.id === 'panqueca-whey-aveia')
        },
        {
          id: 'meal-2',
          name: 'Colação / Lanche Manhã',
          time: '10:00',
          calories: Math.round(totalCalories * 0.12),
          protein: Math.round(p * 0.14),
          carbs: Math.round(c * 0.12),
          fat: Math.round(f * 0.12),
          category: 'snack',
          defaultFood: '1 dose de Whey Protein (30g) batido com água ou leite vegetal + 1 maçã',
          currentRecipe: RECIPE_BOOK.find(r => r.id === 'bowl-iogurte-whey-frutas')
        },
        {
          id: 'meal-3',
          name: 'Almoço',
          time: '12:30',
          calories: Math.round(totalCalories * 0.25),
          protein: Math.round(p * 0.25),
          carbs: Math.round(c * 0.26),
          fat: Math.round(f * 0.25),
          category: 'main_meal',
          defaultFood: '160g Peito de frango + 160g Arroz branco + 80g Feijão + Salada',
          currentRecipe: RECIPE_BOOK.find(r => r.id === 'prato-executivo-fit')
        },
        {
          id: 'meal-4',
          name: 'Lanche Tarde / Pré-Treino',
          time: '16:00',
          calories: Math.round(totalCalories * 0.15),
          protein: Math.round(p * 0.15),
          carbs: Math.round(c * 0.18),
          fat: Math.round(f * 0.12),
          category: 'snack',
          defaultFood: 'Crepioca de 1 ovo com 25g de tapioca recheada com 80g de frango',
          currentRecipe: RECIPE_BOOK.find(r => r.id === 'crepioca-frango-requeijao')
        },
        {
          id: 'meal-5',
          name: 'Jantar Pós-Treino',
          time: '19:30',
          calories: Math.round(totalCalories * 0.22),
          protein: Math.round(p * 0.22),
          carbs: Math.round(c * 0.22),
          fat: Math.round(f * 0.22),
          category: 'main_meal',
          defaultFood: '160g Carne moída magra ou Filé de Tilápia + 180g Batata rústica + Salada',
          currentRecipe: RECIPE_BOOK.find(r => r.id === 'strogonoff-fit-airfryer')
        },
        {
          id: 'meal-6',
          name: 'Ceia',
          time: '22:30',
          calories: Math.round(totalCalories * 0.10),
          protein: Math.round(p * 0.08),
          carbs: Math.round(c * 0.04),
          fat: Math.round(f * 0.14),
          category: 'snack',
          defaultFood: '1 pote de iogurte grego ou 30g de albumina/caseína + 1 colher de pasta de amendoim',
          currentRecipe: RECIPE_BOOK.find(r => r.id === 'mingau-aveia-cacau-pasta')
        }
      ];

    case 4:
    default:
      return [
        {
          id: 'meal-1',
          name: 'Café da Manhã',
          time: '07:30',
          calories: Math.round(totalCalories * 0.24),
          protein: Math.round(p * 0.24),
          carbs: Math.round(c * 0.26),
          fat: Math.round(f * 0.22),
          category: 'breakfast',
          defaultFood: '3 ovos mexidos + 2 fatias de pão 100% integral + 1 banana com canela',
          currentRecipe: RECIPE_BOOK.find(r => r.id === 'panqueca-whey-aveia')
        },
        {
          id: 'meal-2',
          name: 'Almoço Completo',
          time: '12:30',
          calories: Math.round(totalCalories * 0.34),
          protein: Math.round(p * 0.34),
          carbs: Math.round(c * 0.34),
          fat: Math.round(f * 0.32),
          category: 'main_meal',
          defaultFood: '180g Peito de Frango grelhado + 180g Arroz + 100g Feijão + Salada farta com azeite',
          currentRecipe: RECIPE_BOOK.find(r => r.id === 'prato-executivo-fit')
        },
        {
          id: 'meal-3',
          name: 'Lanche da Tarde (Pré-Treino)',
          time: '16:30',
          calories: Math.round(totalCalories * 0.18),
          protein: Math.round(p * 0.18),
          carbs: Math.round(c * 0.22),
          fat: Math.round(f * 0.16),
          category: 'snack',
          defaultFood: 'Bowl com 160g de Iogurte Grego ou Natural + 1 scoop de Whey + 30g de aveia em flocos',
          currentRecipe: RECIPE_BOOK.find(r => r.id === 'bowl-iogurte-whey-frutas')
        },
        {
          id: 'meal-4',
          name: 'Jantar',
          time: '20:00',
          calories: Math.round(totalCalories * 0.24),
          protein: Math.round(p * 0.24),
          carbs: Math.round(c * 0.18),
          fat: Math.round(f * 0.30),
          category: 'main_meal',
          defaultFood: '160g Patinho moído ou Filé Mignon suíno + 180g Batata doce assada + Legumes',
          currentRecipe: RECIPE_BOOK.find(r => r.id === 'strogonoff-fit-airfryer')
        }
      ];
  }
}
