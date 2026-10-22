/**
 * Motor de cálculo de nutrição clínica - ISSN Standards
 * ES Module para openGym
 */

export class NutritionCalculator {
  constructor() {}

  /**
   * Calcula plano nutricional completo baseado em dados do usuário
   * @param {Object} params - Parâmetros do usuário
   * @returns {Object} Plano nutricional completo
   */
  calculateNutritionPlan(params) {
    const {
      userId,
      goal = 'hypertrophy',
      activityLevel = 'moderately_active',
      dietaryRestrictions = [],
      bodyWeight = 70,
      bodyFatPercentage = 20,
      age = 30,
      sex = 'male',
      height = 175,
      mealsPerDay: userMealsPerDay,
      firstMealTime = '08:00'
    } = params;

    // 1. Calcular LBM (Lean Body Mass)
    const bodyFatMass = bodyWeight * (bodyFatPercentage / 100);
    const leanBodyMass = bodyWeight - bodyFatMass;

    // 2. Calcular BMR via Katch-McArdle
    const bmr = 370 + (21.6 * leanBodyMass);

    // 3. Fator de atividade
    const activityFactors = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extra_active: 1.9
    };
    const activityFactor = activityFactors[activityLevel] || 1.55;

    // 4. TDEE
    const tdee = Math.round(bmr * activityFactor);

    // 5. Ajuste calórico baseado no objetivo
    const caloricAdjustments = {
      hypertrophy: 300,    // +300 kcal surplus
      recomp: 0,           // Maintenance
      fat_loss: -400,      // -400 kcal deficit
      strength: 200        // Slight surplus for strength
    };
    const adjustment = caloricAdjustments[goal] || 0;
    const targetCalories = tdee + adjustment;

    // 6. Macronutrientes baseados em ISSN
    // Protein: 1.6-2.4g/kg LBM
    const proteinPerKgLBM = goal === 'fat_loss' ? 2.3 : goal === 'hypertrophy' ? 2.0 : 1.8;
    const proteinGrams = Math.round(proteinPerKgLBM * leanBodyMass);

    // Fat: 0.7-1.2g/kg body weight
    const fatPerKgBW = goal === 'hypertrophy' ? 1.0 : 0.9;
    const fatGrams = Math.round(fatPerKgBW * bodyWeight);

    // Carbs: rest of calories
    const proteinCals = proteinGrams * 4;
    const fatCals = fatGrams * 9;
    const carbCals = targetCalories - proteinCals - fatCals;
    const carbGrams = Math.max(0, Math.round(carbCals / 4));

    // 7. Distribuição por refeição (3-6 refeições conforme preferência do usuário)
    const mealsPerDay = userMealsPerDay || (goal === 'hypertrophy' ? 5 : goal === 'fat_loss' ? 4 : 4);
    const proteinPerMeal = Math.round(proteinGrams / mealsPerDay);
    const leucineTrigger = Math.round(0.4 * leanBodyMass / 1000 * 1000); // ~0.4g/kg per meal

    // Cálculo modular de horários das refeições a partir de firstMealTime
    const [startH, startM] = (firstMealTime || '08:00').split(':').map(Number);
    const intervalHours = (14 / Math.max(1, mealsPerDay - 1)); // Espaço de ~14h de vigília
    const mealSchedules = Array.from({ length: mealsPerDay }, (_, i) => {
      const totalMinutes = (startH * 60 + (startM || 0)) + Math.round(i * intervalHours * 60);
      const h = Math.floor((totalMinutes % 1440) / 60);
      const m = Math.floor((totalMinutes % 60) / 5) * 5; // Arredonda para múltiplos de 5 min
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    });

    // 8. Micronutrientes e suporte articular
    const jointSupport = this.getJointSupportProtocol(goal, dietaryRestrictions);
    const hydration = this.calculateHydration(bodyWeight, activityLevel);

    return {
      caloricTarget: targetCalories,
      strategy: adjustment > 0 ? 'SURPLUS' : adjustment < 0 ? 'DEFICIT' : 'RECOMP',
      macronutrients: {
        protein: proteinGrams,
        carbohydrates: carbGrams,
        fats: fatGrams,
        fiber: Math.round(14 * targetCalories / 1000) // 14g per 1000 kcal
      },
      perMealDistribution: {
        mealsPerDay,
        mealSchedules,
        proteinPerMeal,
        leucineTargetPerMeal: leucineTrigger,
        carbDistribution: this.distributeCarbs(carbGrams, mealsPerDay, goal),
        fatDistribution: this.distributeFats(fatGrams, mealsPerDay)
      },
      hydration,
      jointSupport,
      micronutrients: this.getMicronutrientTargets(sex, age, goal),
      timing: {
        preWorkout: 'Carbs 30-60g + Protein 20-30g (1-2h before)',
        postWorkout: 'Protein 30-40g + Carbs 40-60g (within 2h)',
        preSleep: 'Casein 30-40g or Greek yogurt (30-60min before bed)'
      }
    };
  }

  getJointSupportProtocol(goal, restrictions) {
    const base = [
      'Omega-3 EPA/DHA: 2-3g daily (combined)',
      'Vitamin D3: 2000-4000 IU daily (test levels)',
      'Vitamin K2: 100-200mcg daily (MK-7 form)',
      'Magnesium glycinate: 400mg daily',
      'Creatine monohydrate: 5g daily'
    ];

    const tendonSupport = [
      'Vitamin C: 500-1000mg daily',
      'Collagen peptides: 15g + 50mg Vit C (45min pre-workout)',
      'Glycine: 3-5g daily'
    ];

    const inflammationControl = [
      'Curcumin (Meriva/BCM-95): 500-1000mg daily',
      'Boswellia serrata: 300-500mg daily'
    ];

    const support = [...base];

    if (goal === 'hypertrophy' || goal === 'strength') {
      support.push(...tendonSupport);
    }

    if (['fat_loss', 'recomp'].includes(goal)) {
      support.push(...inflammationControl);
    }

    // Ajustar para restrições dietéticas
    if (restrictions.includes('vegetarian') || restrictions.includes('vegan')) {
      support.push('B12: 1000mcg methylcobalamin daily');
      support.push('Iron: check ferritin, supplement if < 50ng/mL');
      support.push('Zinc: 15-30mg daily (zinc picolinate)');
      support.push('Omega-3 algae oil: 500-1000mg DHA/EPA daily');
    }

    if (restrictions.includes('gluten_free')) {
      support.push('Ensure adequate fiber from gluten-free sources');
    }

    return support;
  }

  calculateHydration(bodyWeight, activityLevel) {
    const baseMl = bodyWeight * 35; // 35ml/kg
    const activityAdd = {
      sedentary: 0,
      lightly_active: 300,
      moderately_active: 500,
      very_active: 800,
      extra_active: 1200
    };
    const total = baseMl + (activityAdd[activityLevel] || 500);
    return `${Math.round(total / 1000 * 10) / 10}L daily (${Math.round(total)}ml)`;
  }

  distributeCarbs(totalCarbs, meals, goal) {
    const distribution = [];
    const periWorkoutCarbs = goal === 'hypertrophy' ? 0.5 : 0.4;
    const workoutMealIndex = Math.floor(meals / 2); // Middle meal as peri-workout

    for (let i = 0; i < meals; i++) {
      if (i === workoutMealIndex) {
        distribution.push(Math.round(totalCarbs * periWorkoutCarbs));
      } else {
        distribution.push(Math.round(totalCarbs * (1 - periWorkoutCarbs) / (meals - 1)));
      }
    }
    return distribution;
  }

  distributeFats(totalFats, meals) {
    const perMeal = Math.round(totalFats / meals);
    return Array(meals).fill(perMeal);
  }

  getMicronutrientTargets(sex, age, goal) {
    const base = {
      vitaminD: 2000, // IU
      vitaminK2: 150, // mcg
      magnesium: 400, // mg
      zinc: sex === 'male' ? 15 : 12, // mg
      selenium: 55, // mcg
      iodine: 150, // mcg
      vitaminB12: 2.4, // mcg
      folate: 400, // mcg
      calcium: 1000, // mg
      iron: sex === 'male' ? 8 : 18, // mg
      potassium: 4700, // mg
      sodium: 2300 // mg
    };

    // Ajustes por objetivo
    if (goal === 'hypertrophy' || goal === 'strength') {
      base.vitaminD = 4000;
      base.magnesium = 500;
      base.zinc = sex === 'male' ? 25 : 20;
    }

    if (age > 50) {
      base.vitaminD = 4000;
      base.calcium = 1200;
      base.vitaminB12 = 500; // mcg (higher for absorption)
    }

    return base;
  }

  detectDietaryRestrictions(profile) {
    const restrictions = [];
    if (profile.goals?.includes?.('vegetarian')) restrictions.push('vegetarian');
    if (profile.goals?.includes?.('vegan')) restrictions.push('vegan');
    if (profile.goals?.includes?.('gluten_free')) restrictions.push('gluten_free');
    if (profile.goals?.includes?.('dairy_free')) restrictions.push('dairy_free');
    return restrictions;
  }
}

export function createNutritionCalculator() {
  return new NutritionCalculator();
}