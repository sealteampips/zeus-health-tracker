// Zeus's Medical Profile
export const petProfile = {
  name: "Zeus",
  breed: "French Bulldog",
  birthDate: "2020-11-15", // Turning 6 late 2026
  weight: 32, // lbs
  sex: "Male, intact",
  color: "Brindle",
  veterinarian: {
    name: "Banfield Pet Hospital",
    clinic: "Banfield Pet Hospital",
    phone: "(952) 941-5570",
    address: "Edina, MN"
  }
};

// Medical Issues - now linked to body parts via bodyPartId
export const medicalIssues = [
  {
    id: "back-right-leg-injury",
    title: "Acute Leg Injury - Back Right",
    bodyPartId: "back-right-leg", // Links to calibrated body part
    status: "active",
    severity: "moderate",
    dateIdentified: "2026-01-08",
    lastUpdated: "2026-01-08",
    description: "Non-weight-bearing injury with swelling and warmth. Abnormal lymph node detected during examination.",
    symptoms: ["Non-weight-bearing", "Swelling", "Warmth to touch", "Abnormal lymph node"],
    treatment: "Rimadyl 25mg every 12 hours with food for pain and inflammation",
    notes: "Monitor closely for improvement. Follow-up scheduled for January 15, 2026.",
    vetVisits: ["2026-01-08"]
  },
  {
    id: "front-left-paw-wound",
    title: "Interdigital Wound - Front Left Paw",
    bodyPartId: "front-left-paw",
    status: "active",
    severity: "moderate",
    dateIdentified: "2025-12-01",
    lastUpdated: "2026-01-08",
    description: "Open wound between toes that has persisted for 5+ weeks without healing. Started antibiotic treatment.",
    symptoms: ["Open wound between toes", "Slow healing", "Licking at paw"],
    treatment: "Clavamox 250mg every 12 hours for 7 days",
    notes: "Common issue in French Bulldogs. Keep area clean and dry. Prevent licking with e-collar if needed.",
    vetVisits: ["2025-12-01", "2026-01-08"]
  },
  {
    id: "left-eye-ulcer",
    title: "Chronic Corneal Ulcer - Left Eye",
    bodyPartId: "left-eye",
    status: "active",
    severity: "moderate",
    dateIdentified: "2024-06-15",
    lastUpdated: "2026-01-08",
    description: "Chronic recurring corneal ulcer with permanent scarring. Requires ongoing management to prevent flare-ups.",
    symptoms: ["Eye discharge", "Squinting", "Cloudiness", "Permanent corneal scarring"],
    treatment: "Oculenis BioHAnce Gel every 8 hours in left eye",
    notes: "French Bulldogs are prone to eye issues due to prominent eyes. Avoid trauma to the eye. Watch for increased squinting or discharge.",
    vetVisits: ["2024-06-15", "2024-09-20", "2025-03-10", "2025-08-15"]
  },
  {
    id: "chronic-allergies",
    title: "Chronic Allergies - Suspected Dust Mites",
    bodyPartId: null, // Systemic condition - no hotspot on 3D model
    status: "active",
    severity: "mild",
    dateIdentified: "2023-04-10",
    lastUpdated: "2026-01-08",
    description: "Ongoing environmental allergies, suspected dust mite sensitivity. Managed with daily medication and periodic injections.",
    symptoms: ["Itching", "Skin irritation", "Occasional hot spots", "Ear inflammation"],
    treatment: "Apoquel daily, Cytopoint injections as needed, Omega-3 fatty acid supplementation",
    notes: "Allergies are well-controlled with current regimen. Cytopoint injections every 4-8 weeks as needed. Keep bedding clean.",
    vetVisits: ["2023-04-10", "2023-08-15", "2024-02-20", "2024-07-10", "2025-01-15", "2025-06-20"]
  },
  {
    id: "mouth-growth",
    title: "Gum Growth - Likely Epulis",
    bodyPartId: "mouth-gum",
    status: "monitoring",
    severity: "low",
    dateIdentified: "2025-09-15",
    lastUpdated: "2025-09-15",
    description: "Pinkish mass on gum, likely an epulis (benign gum tumor common in dogs). Not causing discomfort.",
    symptoms: ["Visible pinkish mass on gum"],
    treatment: "No active treatment - monitoring only",
    notes: "Plan to remove if Zeus needs to go under anesthesia for another procedure. Not urgent. Monitor for changes in size.",
    vetVisits: ["2025-09-15"]
  },
  {
    id: "head-bumps-pyoderma",
    title: "Bacterial Pyoderma - Head",
    bodyPartId: "head-top",
    status: "resolved",
    severity: "none",
    dateIdentified: "2025-12-15",
    resolvedDate: "2026-01-05",
    lastUpdated: "2026-01-05",
    description: "Bacterial skin infection causing bumps on head. Successfully treated with medicated shampoo.",
    symptoms: ["Bumps on head", "Redness", "Mild irritation"],
    treatment: "DOUXO S3 PYO shampoo treatment",
    notes: "Resolved after treatment course. May recur - watch for similar bumps.",
    vetVisits: ["2025-12-15"]
  }
];

// Medications
export const medications = [
  {
    id: "apoquel",
    name: "Apoquel",
    dosage: "16mg",
    frequency: "Once daily",
    time: "08:00",
    forCondition: "chronic-allergies",
    startDate: "2023-04-10",
    prescribedBy: "Banfield Pet Hospital",
    refillDate: "2026-02-15",
    notes: "Give with food. Ongoing allergy management.",
    active: true
  },
  {
    id: "rimadyl",
    name: "Rimadyl (Carprofen)",
    dosage: "25mg",
    frequency: "Every 12 hours",
    time: "08:00",
    forCondition: "back-right-leg-injury",
    startDate: "2026-01-08",
    prescribedBy: "Banfield Pet Hospital",
    notes: "Give with food. For pain and inflammation. Monitor for GI upset.",
    active: true
  },
  {
    id: "clavamox",
    name: "Clavamox",
    dosage: "250mg",
    frequency: "Every 12 hours",
    time: "08:00",
    forCondition: "front-left-paw-wound",
    startDate: "2026-01-08",
    endDate: "2026-01-15",
    prescribedBy: "Banfield Pet Hospital",
    notes: "7-day course. Give with food to prevent stomach upset. Complete full course.",
    active: true
  },
  {
    id: "oculenis",
    name: "Oculenis BioHAnce Gel",
    dosage: "1 drop",
    frequency: "Every 8 hours",
    time: "08:00",
    forCondition: "left-eye-ulcer",
    startDate: "2024-06-15",
    prescribedBy: "Banfield Pet Hospital",
    refillDate: "2026-02-01",
    notes: "Apply to left eye. Promotes corneal healing.",
    active: true
  },
  {
    id: "omega3",
    name: "Nordic Naturals Omega-3",
    dosage: "1 pump",
    frequency: "Once daily",
    time: "08:00",
    forCondition: "chronic-allergies",
    startDate: "2023-04-10",
    prescribedBy: "Banfield Pet Hospital",
    refillDate: "2026-03-01",
    notes: "Add to food. Supports skin and coat health.",
    active: true
  },
  {
    id: "cytopoint",
    name: "Cytopoint Injection",
    dosage: "As prescribed by weight",
    frequency: "Every 4-8 weeks as needed",
    time: null,
    forCondition: "chronic-allergies",
    startDate: "2023-06-01",
    prescribedBy: "Banfield Pet Hospital",
    notes: "Administered at vet clinic. Schedule when allergy symptoms increase.",
    active: true
  }
];

// Vet Visits History
export const vetVisits = [
  {
    id: "visit-2026-01-08",
    date: "2026-01-08",
    type: "Sick Visit",
    reason: "Leg injury and paw wound evaluation",
    doctor: "Banfield Veterinary Team",
    clinic: "Banfield Pet Hospital, Edina, MN",
    notes: "Zeus presented with non-weight-bearing on back right leg with swelling and warmth. Abnormal lymph node detected. Also evaluated persistent interdigital wound on front left paw. Started Rimadyl for leg and Clavamox for paw infection.",
    weight: 32,
    cost: 200,
    relatedIssues: ["back-right-leg-injury", "front-left-paw-wound"],
    nextAppointment: "2026-01-15"
  },
  {
    id: "visit-2025-12-15",
    date: "2025-12-15",
    type: "Sick Visit",
    reason: "Head bumps evaluation",
    doctor: "Banfield Veterinary Team",
    clinic: "Banfield Pet Hospital, Edina, MN",
    notes: "Diagnosed with bacterial pyoderma causing bumps on head. Prescribed DOUXO S3 PYO shampoo treatment.",
    weight: 32,
    cost: 85,
    relatedIssues: ["head-bumps-pyoderma"]
  },
  {
    id: "visit-2025-12-01",
    date: "2025-12-01",
    type: "Sick Visit",
    reason: "Paw wound initial evaluation",
    doctor: "Banfield Veterinary Team",
    clinic: "Banfield Pet Hospital, Edina, MN",
    notes: "Initial evaluation of interdigital wound between toes on front left paw. Recommended monitoring and keeping area clean.",
    weight: 31.5,
    cost: 75,
    relatedIssues: ["front-left-paw-wound"]
  },
  {
    id: "visit-2025-09-15",
    date: "2025-09-15",
    type: "Wellness",
    reason: "Routine wellness exam",
    doctor: "Banfield Veterinary Team",
    clinic: "Banfield Pet Hospital, Edina, MN",
    notes: "Routine wellness exam. Discovered pinkish mass on gum, likely epulis. Recommended monitoring, removal if anesthesia needed for other procedure.",
    weight: 31,
    cost: 0,
    relatedIssues: ["mouth-growth"],
    vaccinations: ["DHPP", "Bordetella"]
  },
  {
    id: "visit-2025-08-15",
    date: "2025-08-15",
    type: "Follow-up",
    reason: "Eye ulcer follow-up",
    doctor: "Banfield Veterinary Team",
    clinic: "Banfield Pet Hospital, Edina, MN",
    notes: "Corneal ulcer stable. Permanent scarring present but not affecting vision significantly. Continue Oculenis gel.",
    weight: 31,
    cost: 65,
    relatedIssues: ["left-eye-ulcer"]
  },
  {
    id: "visit-2025-06-20",
    date: "2025-06-20",
    type: "Follow-up",
    reason: "Allergy management check",
    doctor: "Banfield Veterinary Team",
    clinic: "Banfield Pet Hospital, Edina, MN",
    notes: "Allergies well-controlled with Apoquel. Administered Cytopoint injection for summer allergy season.",
    weight: 31,
    cost: 180,
    relatedIssues: ["chronic-allergies"]
  },
  {
    id: "visit-2025-03-10",
    date: "2025-03-10",
    type: "Sick Visit",
    reason: "Eye ulcer flare-up",
    doctor: "Banfield Veterinary Team",
    clinic: "Banfield Pet Hospital, Edina, MN",
    notes: "Corneal ulcer recurrence in left eye. Increased Oculenis gel frequency. Ulcer healing well with treatment.",
    weight: 30.5,
    cost: 125,
    relatedIssues: ["left-eye-ulcer"]
  },
  {
    id: "visit-2025-01-15",
    date: "2025-01-15",
    type: "Wellness",
    reason: "Annual wellness exam",
    doctor: "Banfield Veterinary Team",
    clinic: "Banfield Pet Hospital, Edina, MN",
    notes: "Annual wellness exam. Overall good health. Allergies stable. Weight appropriate. Continue current medications.",
    weight: 30,
    cost: 0,
    relatedIssues: ["chronic-allergies"],
    vaccinations: ["Rabies"]
  },
  {
    id: "visit-2024-07-10",
    date: "2024-07-10",
    type: "Follow-up",
    reason: "Allergy check and Cytopoint",
    doctor: "Banfield Veterinary Team",
    clinic: "Banfield Pet Hospital, Edina, MN",
    notes: "Summer allergy flare-up. Administered Cytopoint injection. Skin improving.",
    weight: 30,
    cost: 175,
    relatedIssues: ["chronic-allergies"]
  },
  {
    id: "visit-2024-06-15",
    date: "2024-06-15",
    type: "Sick Visit",
    reason: "Eye injury - corneal ulcer diagnosed",
    doctor: "Banfield Veterinary Team",
    clinic: "Banfield Pet Hospital, Edina, MN",
    notes: "Initial diagnosis of corneal ulcer in left eye. Started Oculenis BioHAnce gel treatment. Possible trauma-related injury.",
    weight: 29.5,
    cost: 195,
    relatedIssues: ["left-eye-ulcer"]
  }
];

// Helper functions
export const getActiveIssues = () => medicalIssues.filter(issue => issue.status === 'active');
export const getMonitoringIssues = () => medicalIssues.filter(issue => issue.status === 'monitoring');
export const getResolvedIssues = () => medicalIssues.filter(issue => issue.status === 'resolved');
export const getVisibleIssues = (showResolved = false) => {
  return medicalIssues.filter(issue =>
    issue.status === 'active' ||
    issue.status === 'monitoring' ||
    (showResolved && issue.status === 'resolved')
  );
};
export const getActiveMedications = () => medications.filter(med => med.active);
export const getIssueById = (id) => medicalIssues.find(issue => issue.id === id);
export const getMedicationsForIssue = (issueId) => medications.filter(med => med.forCondition === issueId);
export const getVisitsForIssue = (issueId) => vetVisits.filter(visit => visit.relatedIssues?.includes(issueId));

// Status color mapping
export const statusColors = {
  active: '#ef4444',      // red
  monitoring: '#eab308',   // yellow
  resolved: '#22c55e'      // green
};

export const severityColors = {
  none: '#22c55e',
  low: '#84cc16',
  mild: '#eab308',
  moderate: '#f97316',
  severe: '#ef4444'
};
