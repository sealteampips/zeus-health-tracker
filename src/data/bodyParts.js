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

// Default positions for placeholder model (fallback if not calibrated)
export const defaultPositions = {
  'front-left-paw': [-0.15, -0.38, 0.2],
  'front-right-paw': [0.15, -0.38, 0.2],
  'back-left-leg': [-0.15, -0.3, -0.2],
  'back-right-leg': [0.15, -0.3, -0.2],
  'left-eye': [-0.08, 0.22, 0.48],
  'right-eye': [0.08, 0.22, 0.48],
  'left-ear': [-0.12, 0.38, 0.28],
  'right-ear': [0.12, 0.38, 0.28],
  'mouth-gum': [0, 0.12, 0.52],
  'head-top': [0, 0.4, 0.3],
  'nose': [0, 0.15, 0.58],
  'chest': [0, -0.05, 0.25],
  'back-spine': [0, 0.1, -0.1],
  'tail': [0, 0.08, -0.45],
  'abdomen': [0, -0.15, 0],
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
