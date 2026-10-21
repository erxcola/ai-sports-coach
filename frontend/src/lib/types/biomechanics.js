/**
 * Tipos biomecânicos para AI Sports Nutritionist & Biomechanical Personal Trainer
 * ES Module compatível com openGym (Vite/React)
 */

export const OrthopedicCondition = {
  // Coluna vertebral
  SCOLIOSIS: 'scoliosis',
  KYPHOSIS: 'kyphosis',
  LORDOSIS: 'lordosis',

  // Joelho
  KNEE_CHONDROMALACIA: 'knee_chondromalacia',
  PATELLAR_TENDINITIS: 'patellar_tendinitis',
  MENISCUS_PATHOLOGY: 'meniscus_pathology',
  ACL_INSTABILITY: 'acl_instability',

  // Ombro
  SHOULDER_IMPINGEMENT: 'shoulder_impingement',
  ROTATOR_CUFF_TENDINITIS: 'rotator_cuff_tendinitis',
  GLENO_HUMERAL_ARTHRITIS: 'glenohumeral_arthritis',
  AC_JOINT_OSTEOARTHRITIS: 'ac_joint_osteoarthritis',

  // Cotovelo
  MEDIAL_EPICONDYLITIS: 'medial_epicondylitis',
  LATERAL_EPICONDYLITIS: 'lateral_epicondylitis',

  // Tornozelo/Pé
  ACHILLES_TENDINITIS: 'achilles_tendinitis',
  PLANTAR_FASCIITIS: 'plantar_fasciitis',
  ANKLE_INSTABILITY: 'ankle_instability',

  // Punho
  CARPAL_TUNNEL: 'carpal_tunnel',

  // Condições gerais
  POSTURAL_IMBALANCE: 'postural_imbalance',
  FATIGUE_SYNDROME: 'fatigue_syndrome'
};

/**
 * Perfil de estresse articular para cada exercício
 */
export const JointStressProfile = {
  axialCompression: { none: 0, low: 1, moderate: 2, high: 3, extreme: 4 },
  shearStressKnee: { none: 0, low: 1, moderate: 2, high: 3, extreme: 4 },
  shoulderRotation: { neutral: 0, internal_extreme: 1, external_extreme: 2 },
  spinalLoading: { none: 0, low: 1, moderate: 2, high: 3 }
};

/**
 * Mecânicas contraindicadas por condição ortopédica
 */
export const CONTRAINDICATED_MECHANICS = {
  [OrthopedicCondition.SCOLIOSIS]: {
    prohibitedMechanics: {
      axialCompression: 'high',
      shearStressKnee: 'none',
      shoulderRotation: 'neutral',
      spinalLoading: 'high'
    },
    severity: 'severe',
    prohibitedMovements: [
      'Heavy axial compression (>1x bodyweight)',
      'Overhead barbell presses',
      'Standing good mornings',
      'Heavy back squats'
    ],
    prohibitedPositions: [
      'Excessive thoracic kyphosis',
      'Anterior pelvic tilt > 15°',
      'Leg length discrepancy > 2cm'
    ],
    specificRestrictions: [
      'Maintain neutral pelvic alignment',
      'Avoid axial compression >1x bodyweight',
      'Prioritize unilateral over bilateral work',
      'Emphasize core anti-rotation/anti-lateral flexion'
    ],
    safeAlternatives: [
      { id: 'seal_row', name: 'Seal Row', primaryMover: 'latissimus', biomechanicallyEquivalent: true, confidence: 0.9 },
      { id: 'incline_db_press', name: 'Incline Dumbbell Press', primaryMover: 'pectoralis_major', biomechanicallyEquivalent: true, confidence: 0.8 },
      { id: 'rdl', name: 'Romanian Deadlift', primaryMover: 'glutes_hamstrings', biomechanicallyEquivalent: true, confidence: 0.7 },
      { id: 'split_squat', name: 'Bulgarian Split Squat', primaryMover: 'quadriceps', biomechanicallyEquivalent: true, confidence: 0.8 }
    ]
  },

  [OrthopedicCondition.KNEE_CHONDROMALACIA]: {
    prohibitedMechanics: {
      axialCompression: 'none',
      shearStressKnee: 'high',
      shoulderRotation: 'neutral',
      spinalLoading: 'none'
    },
    severity: 'moderate',
    prohibitedMovements: [
      'Heavy terminal open-chain leg extensions',
      'Deep walking lunges with excessive forward tibial translation',
      'Deep squats with knee angle < 90°'
    ],
    prohibitedPositions: [
      'Knee flexion < 90° in acute phase',
      'Excessive anterior knee translation',
      'Valgus collapse during squat'
    ],
    specificRestrictions: [
      'Maintain knee flexion > 90°',
      'Use box squats with vertical tibia',
      'Implement hip-dominant movements',
      'Monitor eccentric loading carefully'
    ],
    safeAlternatives: [
      { id: 'box_squat', name: 'Box Squat', primaryMover: 'quadriceps', biomechanicallyEquivalent: true, confidence: 0.8 },
      { id: 'goblet_squat', name: 'Goblet Squat', primaryMover: 'quadriceps', biomechanicallyEquivalent: true, confidence: 0.7 },
      { id: 'leg_press', name: 'Leg Press (partial)', primaryMover: 'quadriceps', biomechanicallyEquivalent: true, confidence: 0.8 },
      { id: 'spanish_squat', name: 'Spanish Squat (isometric)', primaryMover: 'quadriceps', biomechanicallyEquivalent: true, confidence: 0.9 }
    ]
  },

  [OrthopedicCondition.PATELLAR_TENDINITIS]: {
    prohibitedMechanics: {
      axialCompression: 'none',
      shearStressKnee: 'high',
      shoulderRotation: 'neutral',
      spinalLoading: 'none'
    },
    severity: 'moderate',
    prohibitedMovements: [
      'Heavy terminal knee extension',
      'Deep plyometrics',
      'Jumping/landing with high patellofemoral force'
    ],
    prohibitedPositions: [
      'Full knee extension under load',
      'Knee angle < 60° with heavy load'
    ],
    specificRestrictions: [
      'Isometric loading: 45s holds at mid-range for pain modulation',
      'Eccentric-concentric: 3s down, 2s pause, 1s up',
      'Box squats with vertical tibia',
      'Hip-dominant: RDLs, hip thrusts'
    ],
    safeAlternatives: [
      { id: 'box_squat', name: 'Box Squat', primaryMover: 'quadriceps', biomechanicallyEquivalent: true, confidence: 0.85 },
      { id: 'spanish_squat', name: 'Spanish Squat (belt-resisted isometric)', primaryMover: 'quadriceps', biomechanicallyEquivalent: true, confidence: 0.95 },
      { id: 'rdl', name: 'Romanian Deadlift', primaryMover: 'glutes_hamstrings', biomechanicallyEquivalent: false, confidence: 0.8 },
      { id: 'hip_thrust', name: 'Hip Thrust', primaryMover: 'glutes', biomechanicallyEquivalent: false, confidence: 0.7 }
    ]
  },

  [OrthopedicCondition.SHOULDER_IMPINGEMENT]: {
    prohibitedMechanics: {
      axialCompression: 'none',
      shearStressKnee: 'none',
      shoulderRotation: 'internal_extreme',
      spinalLoading: 'none'
    },
    severity: 'moderate',
    prohibitedMovements: [
      'Behind-the-neck presses',
      'Upright rows',
      'Flared bench press (> 45° elbow flare)',
      'Full overhead pressing in internal rotation'
    ],
    prohibitedPositions: [
      'Full internal rotation under load',
      'Excessive scapular elevation (shrugging)',
      'Elbow flare > 45° in pressing'
    ],
    specificRestrictions: [
      'Maintain 30-45° scapular plane',
      'Use neutral grips (hammer/neutral)',
      'Chest-supported variations',
      'Floor press instead of bench',
      'Control eccentric loading (3s down)'
    ],
    safeAlternatives: [
      { id: 'floor_press', name: 'Floor Press', primaryMover: 'pectoralis_major', biomechanicallyEquivalent: true, confidence: 0.85 },
      { id: 'neutral_db_press', name: 'Neutral Grip DB Press', primaryMover: 'pectoralis_major', biomechanicallyEquivalent: true, confidence: 0.9 },
      { id: 'cable_fly', name: 'Cable Fly', primaryMover: 'pectoralis_major', biomechanicallyEquivalent: true, confidence: 0.8 },
      { id: 'landmine_press', name: 'Landmine Press', primaryMover: 'anterior_deltoid', biomechanicallyEquivalent: true, confidence: 0.85 }
    ]
  },

  [OrthopedicCondition.ROTATOR_CUFF_TENDINITIS]: {
    prohibitedMechanics: {
      axialCompression: 'none',
      shearStressKnee: 'none',
      shoulderRotation: 'internal_extreme',
      spinalLoading: 'none'
    },
    severity: 'moderate',
    prohibitedMovements: [
      'Overhead pressing (any)',
      'Bench press with flared elbows',
      'Dips (triceps/chest)',
      'Pull-ups/chin-ups (wide grip)'
    ],
    prohibitedPositions: [
      'Shoulder abduction > 90° under load',
      'Internal rotation at end range'
    ],
    specificRestrictions: [
      'Isometric external rotation for pain modulation',
      'Scapular stabilization exercises',
      'Closed-chain exercises (push-up plus)',
      'Eccentric external rotation'
    ],
    safeAlternatives: [
      { id: 'pushup_plus', name: 'Push-up Plus', primaryMover: 'serratus_anterior', biomechanicallyEquivalent: false, confidence: 0.8 },
      { id: 'face_pull', name: 'Face Pull', primaryMover: 'rear_deltoid', biomechanicallyEquivalent: false, confidence: 0.9 },
      { id: 'external_rotation', name: 'External Rotation (cable/band)', primaryMover: 'infraspinatus', biomechanicallyEquivalent: false, confidence: 0.95 },
      { id: 'scapular_pushup', name: 'Scapular Push-up', primaryMover: 'serratus_anterior', biomechanicallyEquivalent: false, confidence: 0.85 }
    ]
  }
};

/**
 * Mapping de exercícios openGym para perfis biomecânicos
 * Baseado no EXDB do openGym
 */
export const EXERCISE_BIOMECHANICS = {
  // Squats
  '0001': { // Barbell Back Squat
    axial_compression: 'high',
    shear_stress_knee: 'high',
    shoulder_rotation: 'neutral',
    spinal_loading: 'high',
    knee_angle: 90,
    hip_angle: 70
  },
  '0002': { // Front Squat
    axial_compression: 'high',
    shear_stress_knee: 'high',
    shoulder_rotation: 'external_extreme',
    spinal_loading: 'high',
    knee_angle: 90,
    hip_angle: 70
  },
  '0003': { // Goblet Squat
    axial_compression: 'moderate',
    shear_stress_knee: 'moderate',
    shoulder_rotation: 'neutral',
    spinal_loading: 'moderate',
    knee_angle: 90,
    hip_angle: 70
  },
  '0004': { // Box Squat
    axial_compression: 'moderate',
    shear_stress_knee: 'low',
    shoulder_rotation: 'neutral',
    spinal_loading: 'moderate',
    knee_angle: 90,
    hip_angle: 70
  },
  '0005': { // Bulgarian Split Squat
    axial_compression: 'moderate',
    shear_stress_knee: 'moderate',
    shoulder_rotation: 'neutral',
    spinal_loading: 'low',
    knee_angle: 90,
    hip_angle: 70
  },

  // Hinge
  '0010': { // Conventional Deadlift
    axial_compression: 'high',
    shear_stress_knee: 'low',
    shoulder_rotation: 'neutral',
    spinal_loading: 'high',
    knee_angle: 30,
    hip_angle: 90
  },
  '0011': { // Romanian Deadlift
    axial_compression: 'moderate',
    shear_stress_knee: 'low',
    shoulder_rotation: 'neutral',
    spinal_loading: 'moderate',
    knee_angle: 20,
    hip_angle: 90
  },
  '0012': { // Hip Thrust
    axial_compression: 'none',
    shear_stress_knee: 'none',
    shoulder_rotation: 'neutral',
    spinal_loading: 'low',
    knee_angle: 90,
    hip_angle: 90
  },

  // Push - Horizontal
  '0020': { // Barbell Bench Press
    axial_compression: 'none',
    shear_stress_knee: 'none',
    shoulder_rotation: 'internal_extreme',
    spinal_loading: 'moderate',
    knee_angle: 0,
    hip_angle: 40
  },
  '0021': { // Dumbbell Bench Press
    axial_compression: 'none',
    shear_stress_knee: 'none',
    shoulder_rotation: 'internal',
    spinal_loading: 'low',
    knee_angle: 0,
    hip_angle: 40
  },
  '0022': { // Incline Dumbbell Press
    axial_compression: 'none',
    shear_stress_knee: 'none',
    shoulder_rotation: 'internal',
    spinal_loading: 'low',
    knee_angle: 0,
    hip_angle: 40
  },
  '0023': { // Floor Press
    axial_compression: 'none',
    shear_stress_knee: 'none',
    shoulder_rotation: 'neutral',
    spinal_loading: 'low',
    knee_angle: 0,
    hip_angle: 40
  },
  '0024': { // Push-up
    axial_compression: 'none',
    shear_stress_knee: 'none',
    shoulder_rotation: 'neutral',
    spinal_loading: 'low',
    knee_angle: 0,
    hip_angle: 0
  },

  // Push - Vertical
  '0030': { // Overhead Barbell Press
    axial_compression: 'low',
    shear_stress_knee: 'none',
    shoulder_rotation: 'internal_extreme',
    spinal_loading: 'high',
    knee_angle: 0,
    hip_angle: 0
  },
  '0031': { // Overhead Dumbbell Press
    axial_compression: 'low',
    shear_stress_knee: 'none',
    shoulder_rotation: 'internal',
    spinal_loading: 'moderate',
    knee_angle: 0,
    hip_angle: 0
  },
  '0032': { // Landmine Press
    axial_compression: 'low',
    shear_stress_knee: 'none',
    shoulder_rotation: 'neutral',
    spinal_loading: 'moderate',
    knee_angle: 0,
    hip_angle: 0
  },
  '0033': { // Pike Push-up
    axial_compression: 'none',
    shear_stress_knee: 'none',
    shoulder_rotation: 'internal',
    spinal_loading: 'low',
    knee_angle: 0,
    hip_angle: 45
  },

  // Pull - Horizontal
  '0040': { // Barbell Row
    axial_compression: 'moderate',
    shear_stress_knee: 'none',
    shoulder_rotation: 'neutral',
    spinal_loading: 'moderate',
    knee_angle: 20,
    hip_angle: 60
  },
  '0041': { // Dumbbell Row (single arm)
    axial_compression: 'low',
    shear_stress_knee: 'none',
    shoulder_rotation: 'neutral',
    spinal_loading: 'low',
    knee_angle: 20,
    hip_angle: 60
  },
  '0042': { // Seal Row
    axial_compression: 'none',
    shear_stress_knee: 'none',
    shoulder_rotation: 'neutral',
    spinal_loading: 'none',
    knee_angle: 0,
    hip_angle: 0
  },
  '0043': { // Cable Row
    axial_compression: 'none',
    shear_stress_knee: 'none',
    shoulder_rotation: 'neutral',
    spinal_loading: 'low',
    knee_angle: 20,
    hip_angle: 60
  },

  // Pull - Vertical
  '0050': { // Pull-up
    axial_compression: 'none',
    shear_stress_knee: 'none',
    shoulder_rotation: 'internal',
    spinal_loading: 'low',
    knee_angle: 0,
    hip_angle: 0
  },
  '0051': { // Chin-up
    axial_compression: 'none',
    shear_stress_knee: 'none',
    shoulder_rotation: 'external',
    spinal_loading: 'low',
    knee_angle: 0,
    hip_angle: 0
  },
  '0052': { // Lat Pulldown
    axial_compression: 'none',
    shear_stress_knee: 'none',
    shoulder_rotation: 'neutral',
    spinal_loading: 'low',
    knee_angle: 0,
    hip_angle: 0
  },

  // Leg accessories
  '0060': { // Leg Press
    axial_compression: 'high',
    shear_stress_knee: 'high',
    shoulder_rotation: 'neutral',
    spinal_loading: 'moderate',
    knee_angle: 90,
    hip_angle: 45
  },
  '0061': { // Leg Extension
    axial_compression: 'none',
    shear_stress_knee: 'extreme',
    shoulder_rotation: 'neutral',
    spinal_loading: 'low',
    knee_angle: 0,
    hip_angle: 90
  },
  '0062': { // Leg Curl
    axial_compression: 'none',
    shear_stress_knee: 'low',
    shoulder_rotation: 'neutral',
    spinal_loading: 'low',
    knee_angle: 90,
    hip_angle: 0
  },
  '0063': { // Calf Raise
    axial_compression: 'moderate',
    shear_stress_knee: 'none',
    shoulder_rotation: 'neutral',
    spinal_loading: 'low',
    knee_angle: 0,
    hip_angle: 0
  },

  // Shoulder accessories
  '0070': { // Lateral Raise
    axial_compression: 'none',
    shear_stress_knee: 'none',
    shoulder_rotation: 'internal',
    spinal_loading: 'none',
    knee_angle: 0,
    hip_angle: 0
  },
  '0071': { // Face Pull
    axial_compression: 'none',
    shear_stress_knee: 'none',
    shoulder_rotation: 'external',
    spinal_loading: 'none',
    knee_angle: 0,
    hip_angle: 0
  },
  '0072': { // Rear Delt Fly
    axial_compression: 'none',
    shear_stress_knee: 'none',
    shoulder_rotation: 'neutral',
    spinal_loading: 'none',
    knee_angle: 0,
    hip_angle: 45
  },

  // Arms
  '0080': { // Bicep Curl
    axial_compression: 'none',
    shear_stress_knee: 'none',
    shoulder_rotation: 'neutral',
    spinal_loading: 'none',
    knee_angle: 0,
    hip_angle: 0
  },
  '0081': { // Tricep Extension
    axial_compression: 'none',
    shear_stress_knee: 'none',
    shoulder_rotation: 'internal',
    spinal_loading: 'none',
    knee_angle: 0,
    hip_angle: 0
  },

  // Core
  '0090': { // Plank
    axial_compression: 'none',
    shear_stress_knee: 'none',
    shoulder_rotation: 'neutral',
    spinal_loading: 'low',
    knee_angle: 0,
    hip_angle: 0
  },
  '0091': { // Dead Bug
    axial_compression: 'none',
    shear_stress_knee: 'none',
    shoulder_rotation: 'neutral',
    spinal_loading: 'none',
    knee_angle: 90,
    hip_angle: 90
  }
};

/**
 * Lista de todas as condições ortopédicas
 */
export const ALL_ORTHOPEDIC_CONDITIONS = Object.values(OrthopedicCondition);