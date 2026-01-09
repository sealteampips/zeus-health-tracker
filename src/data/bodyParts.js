// All calibratable body parts for the 3D model
export const bodyParts = [
  { id: 'front-left-paw', label: 'Front Left Paw', category: 'legs' },
  { id: 'front-right-paw', label: 'Front Right Paw', category: 'legs' },
  { id: 'back-left-leg', label: 'Back Left Leg', category: 'legs' },
  { id: 'back-right-leg', label: 'Back Right Leg', category: 'legs' },
  { id: 'left-eye', label: 'Left Eye', category: 'head' },
  { id: 'right-eye', label: 'Right Eye', category: 'head' },
  { id: 'left-ear', label: 'Left Ear', category: 'head' },
  { id: 'right-ear', label: 'Right Ear', category: 'head' },
  { id: 'mouth-gum', label: 'Mouth/Gum', category: 'head' },
  { id: 'head-top', label: 'Head (top)', category: 'head' },
  { id: 'nose', label: 'Nose', category: 'head' },
  { id: 'chest', label: 'Chest', category: 'body' },
  { id: 'back-spine', label: 'Back/Spine', category: 'body' },
  { id: 'tail', label: 'Tail Area', category: 'body' },
  { id: 'abdomen', label: 'Abdomen', category: 'body' },
];

// Default positions calibrated for Zeus 3D model
export const defaultPositions = {
  'front-left-paw': [0.26, -0.67, 0.17],
  'front-right-paw': [-0.22, -0.67, 0.18],
  'back-left-leg': [0.25, -0.48, -0.28],
  'back-right-leg': [-0.22, -0.45, -0.28],
  'left-eye': [0.12, 0.08, 0.32],
  'right-eye': [-0.10, 0.08, 0.32],
  'left-ear': [0.22, 0.30, 0.05],
  'right-ear': [-0.20, 0.30, 0.05],
  'mouth-gum': [0.0, -0.12, 0.38],
  'head-top': [0.0, 0.32, 0.12],
  'nose': [0.0, -0.02, 0.42],
  'chest': [0.0, -0.35, 0.22],
  'back-spine': [0.0, -0.15, -0.18],
  'tail': [0.0, -0.32, -0.38],
  'abdomen': [0.0, -0.52, 0.0],
};

// Get body part by ID
export const getBodyPartById = (id) => bodyParts.find(bp => bp.id === id);

// Group body parts by category
export const getBodyPartsByCategory = () => {
  return bodyParts.reduce((acc, part) => {
    if (!acc[part.category]) acc[part.category] = [];
    acc[part.category].push(part);
    return acc;
  }, {});
};
