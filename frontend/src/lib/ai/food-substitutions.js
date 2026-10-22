// src/frontend/src/lib/ai/food-substitutions.js
// Tabela de Equivalencia Nutricional para Substituicao Individual de Alimentos.
// Permite que o usuario troque qualquer item que tenha enjoado por porcoes equivalentes em calorias e macronutrientes.

export const FOOD_SUBSTITUTIONS = {
  protein: {
    categoryName: 'Proteínas (Fontes Magras)',
    items: [
      { name: 'Peito de Frango grelhado', portion: '150g', p: 46, c: 0, f: 4, kcal: 230 },
      { name: 'Patinho bovino moído/grelhado', portion: '150g', p: 45, c: 0, f: 8, kcal: 260 },
      { name: 'Filé de Tilápia / Peixe branco grelhado', portion: '170g', p: 44, c: 0, f: 3, kcal: 210 },
      { name: 'Filé Mignon Suíno magro grelhado', portion: '150g', p: 44, c: 0, f: 6, kcal: 235 },
      { name: 'Ovos inteiros (2 un) + Claras (3 un)', portion: '5 un', p: 32, c: 2, f: 10, kcal: 230 },
      { name: 'Atum sólido ao natural em lata', portion: '150g', p: 40, c: 0, f: 1, kcal: 180 },
      { name: 'Camarão limpo grelhado', portion: '180g', p: 43, c: 0, f: 2, kcal: 195 },
      { name: 'Whey Protein Concentrado 80%', portion: '45g (1.5 scoop)', p: 36, c: 4, f: 2, kcal: 180 },
      { name: 'Tofu firme grelhado (Vegano)', portion: '200g', p: 34, c: 6, f: 16, kcal: 300 }
    ]
  },
  carb: {
    categoryName: 'Carboidratos (Fontes Complexas)',
    items: [
      { name: 'Arroz branco ou integral cozido', portion: '180g', p: 4, c: 50, f: 1, kcal: 235 },
      { name: 'Batata inglesa cozida ou Airfryer', portion: '240g', p: 4, c: 48, f: 0, kcal: 215 },
      { name: 'Batata doce cozida ou assada', portion: '180g', p: 3, c: 50, f: 0, kcal: 220 },
      { name: 'Mandioca / Aipim cozido', portion: '150g', p: 2, c: 57, f: 0.5, kcal: 240 },
      { name: 'Macarrão cozido (integral ou sêmola)', portion: '160g', p: 7, c: 48, f: 1.5, kcal: 245 },
      { name: 'Pão 100% Integral de forma', portion: '3 fatias (75g)', p: 8, c: 40, f: 2.5, kcal: 215 },
      { name: 'Aveia em flocos finos', portion: '60g', p: 8, c: 40, f: 5, kcal: 235 },
      { name: 'Massa de Tapioca hidratada', portion: '70g', p: 0, c: 40, f: 0, kcal: 160 },
      { name: 'Banana prata / caturra', portion: '2 unidades (160g)', p: 2, c: 42, f: 0.5, kcal: 175 }
    ]
  },
  fat: {
    categoryName: 'Gorduras Boas & Anti-inflamatórias',
    items: [
      { name: 'Azeite de Oliva Extra Virgem', portion: '1 colher de sopa (10ml)', p: 0, c: 0, f: 10, kcal: 90 },
      { name: 'Pasta de Amendoim Integral', portion: '1 colher de sopa (15g)', p: 4, c: 3, f: 8, kcal: 95 },
      { name: 'Castanha-do-Pará / Caju picadas', portion: '15g (aprox. 4 un)', p: 3, c: 3, f: 10, kcal: 95 },
      { name: 'Abacate fresco amassado', portion: '60g (2 colheres)', p: 1, c: 4, f: 9, kcal: 95 },
      { name: 'Sementes de Chia ou Linhaça dourada', portion: '20g', p: 4, c: 8, f: 7, kcal: 100 },
      { name: 'Chocolate 70% ou 85% cacau', portion: '15g (1 quadrado)', p: 1, c: 5, f: 8, kcal: 90 }
    ]
  }
};
