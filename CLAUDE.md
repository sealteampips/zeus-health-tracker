# Zeus Health Tracker

A 3D interactive health tracking application for Zeus, a French Bulldog. Built with React, Three.js, and Tailwind CSS.

## Project Overview

This is a Progressive Web App (PWA) that visualizes Zeus's health conditions on an interactive 3D model. Users can click on hotspots to view medical details, track medications, and review vet visit history.

### Purpose
- Centralize Zeus's medical information in one visual interface
- Track active health issues with 3D body mapping
- Manage medication schedules
- Review vet visit history

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for R3F (OrbitControls, Billboard, Html, etc.)
- **Three.js** - 3D graphics library
- **Tailwind CSS** - Utility-first CSS framework
- **PWA** - Service worker for offline support, installable to homescreen

## Current Features

### 3D Model Viewer
- Interactive 3D model of Zeus (French Bulldog)
- Orbit controls: rotate, zoom, pan (touch-enabled for mobile)
- Hotspots positioned on body parts linked to medical issues
- Hotspot occlusion (hides hotspots on back side of model)
- Status-based filtering: Active Only, Active + Monitoring, Show All
- Subtle pulse animation for active issues only

### Hotspot Calibration System
- Slider-based positioning (X, Y, Z axes)
- Real-time preview with cyan hotspot
- Save Position / Reset to Default buttons
- Calibration lock with confirmation dialog
- Positions persist to localStorage (overrides hardcoded defaults)

### Medical Data
- Health issues with status (active/monitoring/resolved)
- Medication schedule with dosage, frequency, and refill dates
- Vet visit history with notes and related issues
- Detail panel for viewing full issue information

### Mobile Support
- Responsive dark theme UI
- Touch controls for 3D navigation
- PWA installable to homescreen (iOS and Android)
- Optimized spacing and sizing for mobile screens

## File Structure

```
zeus-health-tracker/
├── public/
│   ├── models/
│   │   └── zeus.glb           # 3D model of Zeus
│   ├── icons/                  # PWA icons (placeholder)
│   ├── manifest.json           # PWA manifest
│   └── sw.js                   # Service worker
├── src/
│   ├── components/
│   │   ├── BodyPartCalibrator.jsx  # Calibration UI with sliders
│   │   ├── DetailPanel.jsx         # Issue detail view
│   │   ├── Hotspot.jsx             # 3D hotspot component
│   │   ├── MedicalHistory.jsx      # Vet visits list
│   │   ├── MedicationSchedule.jsx  # Medications list
│   │   └── ModelViewer.jsx         # 3D canvas and controls
│   ├── data/
│   │   ├── bodyParts.js        # Body part definitions + calibrated positions
│   │   └── zeusData.js         # Medical issues, medications, vet visits
│   ├── hooks/
│   │   └── useBodyPartCalibration.js  # Calibration state management
│   ├── App.jsx                 # Main application component
│   ├── index.css               # Global styles + Tailwind
│   └── main.jsx                # React entry point
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── CLAUDE.md                   # This file
```

## How to Run Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server runs at `http://localhost:5173` (or next available port).

## How to Deploy

This project auto-deploys to Vercel when pushed to GitHub:

1. Push changes to `main` branch
2. Vercel automatically builds and deploys
3. Live at your Vercel URL

For manual deployment:
```bash
npm run build
# Deploy the `dist` folder to any static host
```

## Calibration System

### How It Works
1. Click "Calibrate" button to enter calibration mode
2. Select a body part from the dropdown
3. Use X/Y/Z sliders to position the cyan preview hotspot
4. Click "Save Position" to store the calibration
5. Click "Lock" when done to prevent accidental changes

### Storage
- Calibrations are stored in `localStorage` under key `zeus-body-part-calibrations`
- Lock state is stored under key `zeus-calibration-locked`
- localStorage values override the hardcoded defaults in `bodyParts.js`

### Current Hardcoded Positions
These are the default positions baked into `src/data/bodyParts.js`:

```javascript
export const defaultPositions = {
  'front-left-paw': [0.26, -0.67, 0.17],
  'front-right-paw': [-0.25, -0.62, 0.16],
  'back-left-leg': [0.22, -0.3, -0.75],
  'back-right-leg': [-0.23, -0.3, -0.77],
  'left-eye': [0.16, 0.2, 0.86],
  'right-eye': [-0.16, 0.2, 0.86],
  'left-ear': [0.2, 0.3, 0.58],
  'right-ear': [-0.2, 0.3, 0.58],
  'mouth-gum': [0, -0.06, 0.9],
  'head-top': [0, 0.4, 0.78],
  'nose': [0, 0.15, 0.92],
  'chest': [0, -0.35, 0.31],
  'back-spine': [0, 0.18, -0.1],
  'tail': [0, 0.23, -0.78],
  'abdomen': [0, -0.41, -0.24],
};
```

## Zeus's Medical Conditions

### Active Issues
1. **Acute Leg Injury - Back Right** (moderate)
   - Non-weight-bearing, swelling, abnormal lymph node
   - Treatment: Rimadyl 25mg every 12 hours

2. **Interdigital Wound - Front Left Paw** (moderate)
   - Open wound between toes, 5+ weeks
   - Treatment: Clavamox 250mg every 12 hours

3. **Chronic Corneal Ulcer - Left Eye** (moderate)
   - Recurring ulcer with permanent scarring
   - Treatment: Oculenis BioHAnce Gel every 8 hours

4. **Chronic Allergies - Suspected Dust Mites** (mild)
   - Systemic condition (no 3D hotspot)
   - Treatment: Apoquel daily, Cytopoint injections as needed

### Monitoring
- **Gum Growth - Likely Epulis** (low severity)
  - Benign gum tumor, will remove if anesthesia needed for other procedure

### Resolved
- **Bacterial Pyoderma - Head** - Treated with DOUXO S3 PYO shampoo

## Known Issues

1. **PWA Icons**: Placeholder icons need to be replaced with actual app icons (192x192 and 512x512 PNG)
2. **3D Model**: Uses a custom Zeus model (`zeus.glb`). Falls back to placeholder geometry if not found.
3. **Hot Reload Warning**: STATUS_FILTERS export causes HMR invalidation warnings (cosmetic only)

## Future Improvements (Phase 2)

### Backend Integration
- **Supabase** for data persistence
- User authentication
- Multi-pet support
- Shared family access

### Features
- Add/edit medical issues through UI
- Medication reminders/notifications
- Photo attachments for vet visits
- Weight tracking over time
- Export medical records as PDF
- Calendar integration for appointments

### Technical
- Replace placeholder PWA icons with proper app icons
- Add unit tests
- Implement proper error boundaries
- Add loading states and skeleton UI

## Development Notes

### Adding a New Body Part
1. Add entry to `bodyParts` array in `src/data/bodyParts.js`
2. Add default position to `defaultPositions` object
3. Use calibration mode to fine-tune the position
4. Update `defaultPositions` with calibrated values for deployment

### Adding a New Medical Issue
1. Add entry to `medicalIssues` array in `src/data/zeusData.js`
2. Set `bodyPartId` to link to a body part (or `null` for systemic)
3. Hotspot will automatically appear if `bodyPartId` matches a body part

### Styling
- Uses Tailwind CSS with custom dark theme colors
- Custom colors defined in `tailwind.config.js`: `dark-bg`, `dark-card`, `dark-border`
- Custom slider and dropdown styles in `src/index.css`
