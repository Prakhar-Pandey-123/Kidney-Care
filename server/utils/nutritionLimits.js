// CKD stage-based nutrition limits
export const getNutritionLimits = (ckdStage, weight, activityLevel) => {
  const limits = {
    protein: { value: 0, unit: 'g' },
    potassium: { value: 0, unit: 'mg' },
    phosphorus: { value: 0, unit: 'mg' },
    sodium: { value: 2000, unit: 'mg' } // Same for all stages
  };

  // Protein limits (g/kg body weight)
  switch (ckdStage) {
    case 1:
    case 2:
      limits.protein.value = weight * 0.9; // 0.8-1.0 g/kg
      break;
    case 3:
      limits.protein.value = weight * 0.8;
      break;
    case 4:
    case 5:
      limits.protein.value = weight * 0.7; // 0.6-0.8 g/kg
      break;
  }

  // Potassium limits
  switch (ckdStage) {
    case 1:
    case 2:
      limits.potassium.value = 4700;
      break;
    case 3:
      limits.potassium.value = 3000;
      break;
    case 4:
    case 5:
      limits.potassium.value = 2000;
      break;
  }

  // Phosphorus limits
  switch (ckdStage) {
    case 1:
    case 2:
      limits.phosphorus.value = 1000;
      break;
    case 3:
      limits.phosphorus.value = 800;
      break;
    case 4:
    case 5:
      limits.phosphorus.value = 600;
      break;
  }

  return limits;
};

// Get alert status for a nutrient
export const getNutrientStatus = (intake, limit) => {
  const percentage = (intake / limit) * 100;
  
  if (percentage >= 100) {
    return { status: 'high', color: 'red', message: 'Above daily limit' };
  } else if (percentage >= 80) {
    return { status: 'warning', color: 'yellow', message: 'Getting close to limit' };
  } else if (percentage < 50) {
    return { status: 'low', color: 'yellow', message: 'Below recommended amount' };
  } else {
    return { status: 'safe', color: 'green', message: 'In safe range' };
  }
};


