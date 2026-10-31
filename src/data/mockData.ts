/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Experiment,
  StudentProfile,
  Classroom,
  Assignment,
  StudentProgressRecord,
  VRDevice,
  OfflinePackage
} from '../types';

export const EXPERIMENTS_DATA: Experiment[] = [
  {
    id: 'physics-ohms-law',
    title: "Ohm's Law & Circuit Analysis",
    subject: 'physics',
    gradeLevel: 'Senior 4 (S4)',
    difficulty: 'foundational',
    estimatedMinutes: 20,
    curriculumRef: 'REB Physics S4 Unit 5: Current Electricity & Circuits',
    summary: 'Investigate the linear relationship between voltage, electric current, and resistance in a closed DC circuit.',
    learningObjectives: [
      "Verify the mathematical relationship V = I · R across varied resistance values",
      'Identify and connect circuit components (battery, resistor, switch, ammeter, voltmeter)',
      'Plot voltage versus current data points to determine resistance from the slope',
      'Explain how internal heat dissipation influences conductor resistivity'
    ],
    equipmentList: [
      'Variable DC Power Supply (0–24V)',
      'Precision Ceramic Resistor (10Ω–500Ω)',
      'Digital / Analog DC Ammeter (A)',
      'Digital DC Voltmeter (V)',
      'Single-Pole Single-Throw (SPST) Knife Switch',
      'Copper Connecting Leads with Alligator Clips'
    ],
    instructions: [
      'Assemble the circuit by connecting the DC power supply, resistor, ammeter, and switch in series.',
      'Connect the voltmeter in parallel across the resistor terminals.',
      'Close the circuit switch to allow electric current flow.',
      'Adjust the DC voltage incrementally and observe how the electric current responds on the ammeter.',
      'Record at least 4 coordinate pairs (Voltage vs Current) in the observation table.',
      'Analyze the resulting linear slope (V/I) to determine if it matches the theoretical resistance value.'
    ],
    questions: [
      {
        id: 'ohm-q1',
        question: 'According to Ohm\'s Law, what happens to the current in a circuit if the resistance is doubled while the voltage remains constant?',
        options: [
          'The current doubles',
          'The current is halved',
          'The current remains unchanged',
          'The current quadruples'
        ],
        correctIndex: 1,
        explanation: 'Because I = V / R, current is inversely proportional to resistance. Doubling R halves the current I.'
      },
      {
        id: 'ohm-q2',
        question: 'How should an ammeter and a voltmeter be connected with respect to the component being measured?',
        options: [
          'Both in series',
          'Both in parallel',
          'Ammeter in series, voltmeter in parallel',
          'Ammeter in parallel, voltmeter in series'
        ],
        correctIndex: 2,
        explanation: 'An ammeter has very low resistance and must be connected in series to measure total current; a voltmeter has very high resistance and is connected in parallel to measure potential difference.'
      },
      {
        id: 'ohm-q3',
        question: 'If a 12V potential difference produces a current of 0.25A across a resistor, what is the resistance value?',
        options: [
          '3 Ω',
          '48 Ω',
          '24 Ω',
          '36 Ω'
        ],
        correctIndex: 1,
        explanation: 'Using Ohm\'s Law: R = V / I = 12V / 0.25A = 48 Ω.'
      }
    ],
    xpReward: 150,
    featured: true
  },
  {
    id: 'physics-projectile',
    title: 'Kinematics & Projectile Motion',
    subject: 'physics',
    gradeLevel: 'Senior 4 (S4)',
    difficulty: 'intermediate',
    estimatedMinutes: 25,
    curriculumRef: 'REB Physics S4 Unit 2: Two-Dimensional Kinematics',
    summary: 'Analyze two-dimensional parabolic trajectory, flight time, maximum apex height, and horizontal range under gravity.',
    learningObjectives: [
      'Decompose initial velocity into independent horizontal (vx) and vertical (vy) vectors',
      'Demonstrate that 45° maximizes horizontal range on level ground in the absence of air resistance',
      'Calculate time of flight and maximum height using kinematic equations of motion',
      'Compare gravitational trajectories across Earth, the Moon, and Mars'
    ],
    equipmentList: [
      'Pneumatic Projectile Launcher with Angle Protractor (0°–90°)',
      'Optical Velocity Sensor Gate',
      'Digital Range Distance Sensor (0–120m)',
      'Digital Flight Time Chronometer (ms)',
      'Planetary Gravitational Field Controller (Earth/Moon/Mars)'
    ],
    instructions: [
      'Select a launch angle between 10° and 85° using the angle dial.',
      'Set the initial muzzle velocity (5 m/s to 50 m/s).',
      'Launch the projectile and observe the parabolic flight curve.',
      'Record flight time, maximum vertical height, and total landing distance.',
      'Compare the range of complementary angles (such as 30° and 60°) with identical initial velocity.'
    ],
    questions: [
      {
        id: 'proj-q1',
        question: 'At the exact peak of a projectile\'s trajectory, what is its vertical velocity component (vy)?',
        options: [
          'Zero m/s',
          'Equal to the initial velocity',
          'Equal to the acceleration of gravity',
          'At its maximum value'
        ],
        correctIndex: 0,
        explanation: 'At the apex of parabolic flight, the vertical velocity momentarily ceases (vy = 0) before gravity accelerates the object downwards.'
      },
      {
        id: 'proj-q2',
        question: 'Assuming negligible air resistance on level ground, which launch angle achieves maximum horizontal range?',
        options: [
          '30°',
          '45°',
          '60°',
          '90°'
        ],
        correctIndex: 1,
        explanation: 'Range R = (v₀² sin 2θ) / g. The term sin(2θ) reaches its maximum value of 1 when 2θ = 90°, meaning θ = 45°.'
      },
      {
        id: 'proj-q3',
        question: 'How does launching on the Moon (g = 1.62 m/s²) affect horizontal range compared to Earth (g = 9.8 m/s²)?',
        options: [
          'Range decreases significantly',
          'Range remains unchanged',
          'Range increases approximately sixfold',
          'The projectile fails to return to the surface'
        ],
        correctIndex: 2,
        explanation: 'Since R is inversely proportional to g (R ∝ 1/g), the lower lunar gravity allows a much longer flight time and approximately 6 times greater range.'
      }
    ],
    xpReward: 160,
    featured: true
  },
  {
    id: 'chemistry-titration',
    title: 'Acid-Base Titration (HCl & NaOH)',
    subject: 'chemistry',
    gradeLevel: 'Senior 5 (S5)',
    difficulty: 'intermediate',
    estimatedMinutes: 25,
    curriculumRef: 'REB Chemistry S5 Unit 6: Volumetric Analysis & Equilibria',
    summary: 'Standardize a strong acid solution by titrating against standardized sodium hydroxide using phenolphthalein indicator.',
    learningObjectives: [
      'Master volumetric techniques with burette stopcock control and meniscus reading',
      'Recognize the distinct equivalence point marked by a persistent pale pink color transition',
      'Plot a volumetric titration curve (pH versus volume of NaOH added)',
      'Calculate the exact molarity of unknown acid using MaVa = MbVb stoichiometry'
    ],
    equipmentList: [
      '50.0 mL Precision Glass Burette (0.1 mL graduations)',
      '250 mL Pyrex Conical Erlenmeyer Flask',
      '25.0 mL Volumetric Pipette & Filler Bulb',
      '0.100 M Standard Sodium Hydroxide (NaOH) titrant',
      '0.100 M Hydrochloric Acid (HCl) sample',
      'Phenolphthalein Indicator Solution & Dropper',
      'Digital pH Sensor Probe with Real-time Readout'
    ],
    instructions: [
      'Fill the burette with 0.100 M NaOH solution to the 0.0 mL mark.',
      'Pipette 25.0 mL of hydrochloric acid into the conical flask.',
      'Add 2–3 drops of phenolphthalein indicator; observe that the acidic solution remains crystal clear.',
      'Carefully release NaOH titrant drop by drop while swirling the flask.',
      'Slow down addition near the expected endpoint (around 24.5 mL).',
      'Stop at the first appearance of a permanent faint pink tint lasting over 30 seconds, and log the volume.'
    ],
    questions: [
      {
        id: 'titr-q1',
        question: 'What color does phenolphthalein turn when transitioning from an acidic medium to an alkaline medium?',
        options: [
          'Yellow to blue',
          'Colorless to pink/magenta',
          'Red to green',
          'Orange to yellow'
        ],
        correctIndex: 1,
        explanation: 'Phenolphthalein is completely colorless below pH 8.2 and turns distinct pink/magenta in alkaline conditions (pH 8.2–10.0).'
      },
      {
        id: 'titr-q2',
        question: 'At the stoichiometric equivalence point of titrating 25.0 mL of 0.10 M HCl with 0.10 M NaOH, what is the expected pH at 25°C?',
        options: [
          'pH 3.0',
          'pH 7.0',
          'pH 10.0',
          'pH 14.0'
        ],
        correctIndex: 1,
        explanation: 'A strong acid (HCl) titrated with a strong base (NaOH) produces neutral salt (NaCl) and water, resulting in pH 7.0 at equivalence.'
      },
      {
        id: 'titr-q3',
        question: 'If 25.0 mL of 0.10 M HCl requires exactly 25.0 mL of NaOH to reach neutralization, what is the concentration of the NaOH?',
        options: [
          '0.05 M',
          '0.10 M',
          '0.20 M',
          '0.25 M'
        ],
        correctIndex: 1,
        explanation: 'From M₁V₁ = M₂V₂: (0.10 M)(25.0 mL) = M₂(25.0 mL) → M₂ = 0.10 M.'
      }
    ],
    xpReward: 175,
    featured: true
  },
  {
    id: 'chemistry-reactions',
    title: 'Chemical Reactions & Precipitations',
    subject: 'chemistry',
    gradeLevel: 'Senior 4 (S4)',
    difficulty: 'foundational',
    estimatedMinutes: 20,
    curriculumRef: 'REB Chemistry S4 Unit 4: Types of Chemical Reactions',
    summary: 'Explore displacement, precipitation, and gas-evolution reactions while tracking thermal energy changes and balanced equations.',
    learningObjectives: [
      'Differentiate between single replacement, double replacement precipitation, and gas evolution',
      'Predict reaction feasibility using the metal activity series (Fe vs Cu)',
      'Write balanced ionic and net ionic equations for aqueous reactions',
      'Record observable qualitative cues: color shifts, bubbling effervescence, and thermal changes'
    ],
    equipmentList: [
      'Borosilicate Reaction Test Tubes & Safety Rack',
      'Iron (Fe) Nail & Zinc (Zn) Granules',
      'Copper(II) Sulfate Solution (0.5 M CuSO₄, vivid blue)',
      'Hydrochloric Acid Solution (1.0 M HCl)',
      'Silver Nitrate (0.1 M AgNO₃) & Sodium Chloride (0.1 M NaCl)',
      'Digital Infrared Reaction Thermometer (°C)',
      'Laboratory Wooden Splint & Gas Testing Chamber'
    ],
    instructions: [
      'Select a reaction system from the bench (Displacement, Acid-Metal Gas Evolution, or Precipitation).',
      'Add the primary reactant solution into the test tube.',
      'Introduce the secondary chemical reagent and observe immediate physical changes.',
      'Check the live temperature monitor for exothermic or endothermic thermal exchange.',
      'Examine the balanced chemical equation and identify the newly synthesized products.'
    ],
    questions: [
      {
        id: 'rxn-q1',
        question: 'When an iron nail is immersed in blue copper(II) sulfate solution, why does copper deposit on the nail?',
        options: [
          'Iron is less reactive than copper',
          'Iron is more reactive than copper and displaces it from solution',
          'Copper sulfate evaporates leaving pure copper',
          'Iron oxidizes into copper atoms'
        ],
        correctIndex: 1,
        explanation: 'Iron ranks higher than copper in the electrochemical activity series: Fe + CuSO₄ → FeSO₄ + Cu.'
      },
      {
        id: 'rxn-q2',
        question: 'Which gas is released during the vigorous reaction between zinc granules and hydrochloric acid?',
        options: [
          'Carbon dioxide (CO₂)',
          'Oxygen (O₂)',
          'Hydrogen (H₂)',
          'Chlorine (Cl₂)'
        ],
        correctIndex: 2,
        explanation: 'Zn(s) + 2HCl(aq) → ZnCl₂(aq) + H₂(g). Hydrogen gas causes effervescent bubbles and burns with a squeaky "pop" sound.'
      },
      {
        id: 'rxn-q3',
        question: 'What is the white precipitate formed when mixing clear silver nitrate (AgNO₃) and sodium chloride (NaCl)?',
        options: [
          'Sodium nitrate (NaNO₃)',
          'Silver chloride (AgCl)',
          'Silver oxide (Ag₂O)',
          'Sodium chloride crystal (NaCl)'
        ],
        correctIndex: 1,
        explanation: 'Ag⁺(aq) + Cl⁻(aq) → AgCl(s). Silver chloride has extremely low solubility in water and precipitates out as a dense white solid.'
      }
    ],
    xpReward: 140,
    featured: true
  },
  {
    id: 'biology-microscope',
    title: 'Virtual Optical Microscope',
    subject: 'biology',
    gradeLevel: 'Senior 3 (S3) & S4',
    difficulty: 'foundational',
    estimatedMinutes: 20,
    curriculumRef: 'REB Biology S4 Unit 1: Cell Structure & Microscopy',
    summary: 'Operate a high-magnification compound light microscope to explore plant and animal histology at cellular resolution.',
    learningObjectives: [
      'Master optical alignment: coarse focus, fine focus, condenser iris, and mechanical stage translation',
      'Examine structural differences between plant cells (cell wall, large vacuole) and animal cells',
      'Calculate total optical magnification (Eyepiece 10x × Objective 4x/10x/40x/100x)',
      'Identify chloroplasts, cell walls, nuclei, and plasma membranes on stained specimens'
    ],
    equipmentList: [
      'Binocular Compound Light Microscope with 4-Nosepiece Turret',
      '10x Wide-Field Eyepieces with Micrometer Reticle',
      '4x, 10x, 40x, and 100x (Oil Immersion) Achromatic Objectives',
      'Prepared Glass Slide: Allium cepa (Onion epidermal peel stained with Iodine)',
      'Prepared Glass Slide: Human cheek squamous epithelial cells (Methylene blue)',
      'Prepared Glass Slide: Living Elodea aquatic leaf (active cytoplasmic streaming)',
      'Substage Abbe Condenser with Iris Diaphragm & Variable LED Illuminator'
    ],
    instructions: [
      'Mount a glass specimen slide onto the mechanical stage clip.',
      'Select initial scanning objective (4x or 10x).',
      'Rotate the coarse focus knob until the cellular specimen layer enters the depth of field.',
      'Adjust the fine focus knob to achieve crisp, high-contrast organelle boundary resolution.',
      'Translate stage coordinates (X and Y) to explore different regions of the tissue.',
      'Switch to high-power 40x magnification and inspect individual nuclei and chloroplasts.'
    ],
    questions: [
      {
        id: 'mic-q1',
        question: 'What is the total magnification when using a 10x eyepiece with a 40x high-power objective lens?',
        options: [
          '50x',
          '400x',
          '4000x',
          '40x'
        ],
        correctIndex: 1,
        explanation: 'Total magnification = Eyepiece power × Objective power = 10 × 40 = 400x.'
      },
      {
        id: 'mic-q2',
        question: 'Which prominent organelle is present in onion epidermal cells but absent in human cheek epithelial cells?',
        options: [
          'Nucleus',
          'Mitochondria',
          'Rigid Cellulose Cell Wall',
          'Ribosomes'
        ],
        correctIndex: 2,
        explanation: 'Plant cells possess a rigid outer cellulose cell wall that maintains turgor pressure and structural integrity, which animal cells lack.'
      },
      {
        id: 'mic-q3',
        question: 'Why should you always start focusing with the lowest power objective lens first?',
        options: [
          'It has the brightest light',
          'It provides the widest field of view and safest working distance to avoid crushing the glass slide',
          'It requires less electricity',
          'Higher power lenses only work with colored specimens'
        ],
        correctIndex: 1,
        explanation: 'Lower power objectives have a broader field of view to locate the specimen quickly and maintain large physical clearance between glass and lens.'
      }
    ],
    xpReward: 150,
    featured: true
  },
  {
    id: 'biology-plant-cell',
    title: '3D Interactive Plant Cell Explorer',
    subject: 'biology',
    gradeLevel: 'Senior 4 (S4)',
    difficulty: 'intermediate',
    estimatedMinutes: 25,
    curriculumRef: 'REB Biology S4 Unit 1: Ultrastructure of Eukaryotic Cells',
    summary: 'Navigate an interactive 3D WebGL plant cell. Dissect and explore internal organelles, membranes, and biochemical functions.',
    learningObjectives: [
      'Locate and identify major plant organelles in full 3D spatial context',
      'Examine the structure and photosynthetic role of Chloroplasts (thylakoid grana & stroma)',
      'Explain the turgor pressure regulation performed by the Large Central Vacuole',
      'Relate organelle structure to plant resilience in African agricultural crops (e.g. cassava, beans, maize)'
    ],
    equipmentList: [
      'WebGL 3D Molecular & Cellular Visualization Engine',
      'Orbital Spatial 3D Camera with 360° Free Rotation & Zoom',
      'Organelle Dissection / Exploded Radial View Control',
      'Organelle Cytoplasmic Cross-Section Cutter',
      'Interactive Biochemical Function Inspector'
    ],
    instructions: [
      'Use your mouse or touch controls to rotate the 3D plant cell and inspect outer morphology.',
      'Select individual organelles from the anatomy panel or click directly on 3D structures.',
      'Toggle Exploded Mode to view organelle separation and interior spatial arrangements.',
      'Review the physiological function, ATP/energy involvement, and curriculum notes for each component.'
    ],
    questions: [
      {
        id: 'cell-q1',
        question: 'Which organelle is the primary site of photosynthesis where light energy is converted into chemical glucose?',
        options: [
          'Mitochondria',
          'Chloroplast',
          'Golgi Apparatus',
          'Lysosome'
        ],
        correctIndex: 1,
        explanation: 'Chloroplasts contain green chlorophyll pigments in thylakoid membranes that capture photon energy to fix carbon into sugars.'
      },
      {
        id: 'cell-q2',
        question: 'What happens to a plant cell when its large central vacuole loses water due to prolonged drought?',
        options: [
          'The cell bursts immediately',
          'Turgor pressure drops and the plant wilts (plasmolysis)',
          'Chloroplasts begin dividing faster',
          'The cell wall dissolves'
        ],
        correctIndex: 1,
        explanation: 'The large central vacuole maintains turgor pressure against the cell wall. When it loses water, internal pressure drops, causing visible wilting.'
      },
      {
        id: 'cell-q3',
        question: 'Why are mitochondria often called the "powerhouse of the cell"?',
        options: [
          'They manufacture cellulose for the cell wall',
          'They generate cellular ATP through aerobic cellular respiration',
          'They absorb carbon dioxide from the air',
          'They store excess genetic DNA'
        ],
        correctIndex: 1,
        explanation: 'Mitochondria break down glucose molecules via the citric acid cycle and oxidative phosphorylation to produce ATP energy.'
      }
    ],
    xpReward: 160,
    featured: true
  },
  // Additional catalog experiments for the complete /experiments library
  {
    id: 'physics-optics-snell',
    title: "Light Refraction & Snell's Law",
    subject: 'physics',
    gradeLevel: 'Senior 3 (S3)',
    difficulty: 'foundational',
    estimatedMinutes: 20,
    curriculumRef: 'REB Physics S3 Unit 9: Geometric Optics',
    summary: 'Investigate how light beams bend when transitioning between air, water, and glass media to calculate index of refraction.',
    learningObjectives: [
      'Calculate refractive index using n₁ sin(θ₁) = n₂ sin(θ₂)',
      'Determine critical angle for total internal reflection in optical fibers',
      'Observe wavelength dispersion through a triangular glass prism'
    ],
    equipmentList: ['Semiconductor Laser Ray Box', 'Acrylic Semicircular Block', 'Circular 360° Protractor Table', 'Dense Flint Glass Prism'],
    instructions: ['Direct laser beam at varying incident angles', 'Record angle of refraction', 'Calculate sin(θ1)/sin(θ2)'],
    questions: [],
    xpReward: 120
  },
  {
    id: 'chemistry-electrolysis',
    title: 'Electrolysis of Water & Faraday Laws',
    subject: 'chemistry',
    gradeLevel: 'Senior 5 (S5)',
    difficulty: 'advanced',
    estimatedMinutes: 30,
    curriculumRef: 'REB Chemistry S5 Unit 8: Electrochemistry & Electrolytic Cells',
    summary: 'Decompose water into stoichiometric 2:1 volumes of hydrogen and oxygen gas using platinum electrodes.',
    learningObjectives: [
      'Verify the 2:1 gas volumetric ratio between H₂ and O₂',
      'Explain oxidation at the anode and reduction at the cathode',
      'Calculate Faraday constant and electron charge transfer'
    ],
    equipmentList: ['Hofmann Voltameter with Stopcocks', 'Direct Current Power Supply (12V)', 'Platinum Plate Electrodes', 'Dilute Sulfuric Acid Electrolyte'],
    instructions: ['Fill voltameter with electrolyte', 'Apply 12V potential difference', 'Observe gas collection tubes'],
    questions: [],
    xpReward: 180
  },
  {
    id: 'biology-photosynthesis',
    title: 'Photosynthesis Rate & Light Intensity',
    subject: 'biology',
    gradeLevel: 'Senior 4 (S4)',
    difficulty: 'intermediate',
    estimatedMinutes: 20,
    curriculumRef: 'REB Biology S4 Unit 5: Plant Nutrition & Bioenergetics',
    summary: 'Count oxygen bubble emissions from underwater Cabomba pondweed under variable light distance and sodium bicarbonate concentration.',
    learningObjectives: [
      'Demonstrate that photosynthetic rate is directly proportional to light intensity up to saturation',
      'Identify carbon dioxide concentration as a secondary limiting factor',
      'Relate inverse-square law of light to photosynthetic yield'
    ],
    equipmentList: ['Submerged Pondweed Sprig (Elodea/Cabomba)', 'Graduated Inverted Test Tube', '100W Adjustable Halogen Lamp', '1% NaHCO₃ Solution'],
    instructions: ['Position lamp at distances from 10cm to 60cm', 'Count oxygen bubble release per minute', 'Plot distance vs bubble rate'],
    questions: [],
    xpReward: 140
  }
];

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  id: 'stu-rw-01',
  name: 'Keza Amina',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
  gradeLevel: 'Senior 4 PCB (Physics-Chemistry-Biology)',
  school: 'Lycée de Kigali (Kigali, Rwanda)',
  streakDays: 6,
  totalXp: 980,
  completedExperimentIds: ['physics-ohms-law', 'chemistry-titration'],
  achievements: [
    {
      id: 'ach-1',
      title: 'Circuit Master',
      description: 'Successfully verified Ohm\'s Law with 100% precision slope',
      subject: 'physics',
      unlockedAt: '2 days ago',
      icon: 'Zap'
    },
    {
      id: 'ach-2',
      title: 'Precision Titrator',
      description: 'Reached exact stoichiometric neutralization within 0.1 mL of equivalence',
      subject: 'chemistry',
      unlockedAt: 'Yesterday',
      icon: 'FlaskConical'
    },
    {
      id: 'ach-3',
      title: 'Scientific Streak',
      description: 'Maintained 5 consecutive days of laboratory experimentation',
      subject: 'general',
      unlockedAt: '3 days ago',
      icon: 'Flame'
    },
    {
      id: 'ach-4',
      title: 'Zero Spill Award',
      description: 'Completed 5 practical lab investigations with zero safety infractions',
      subject: 'general',
      unlockedAt: '1 week ago',
      icon: 'ShieldCheck'
    }
  ]
};

export const INITIAL_CLASSROOMS: Classroom[] = [
  {
    id: 'cls-1',
    name: 'Senior 4-A Science (PCB)',
    grade: 'Senior 4',
    subject: 'physics',
    studentCount: 36,
    averageScore: 88.5,
    completionRate: 92
  },
  {
    id: 'cls-2',
    name: 'Senior 4-B Science (MCB)',
    grade: 'Senior 4',
    subject: 'chemistry',
    studentCount: 34,
    averageScore: 84.2,
    completionRate: 85
  },
  {
    id: 'cls-3',
    name: 'Senior 3 General Science',
    grade: 'Senior 3',
    subject: 'biology',
    studentCount: 42,
    averageScore: 79.8,
    completionRate: 78
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    title: 'Lab 04: Projectile Trajectory & Velocity Decomposition',
    classroomId: 'cls-1',
    experimentId: 'physics-projectile',
    dueDate: '2026-11-04',
    status: 'active',
    instructions: 'Test 30°, 45°, and 60° launch angles. Record apex height and verify range calculations.',
    assignedCount: 36,
    completedCount: 28
  },
  {
    id: 'asg-2',
    title: 'Lab 05: Ultrastructure of Eukaryotic Plant Cell in 3D',
    classroomId: 'cls-1',
    experimentId: 'biology-plant-cell',
    dueDate: '2026-11-07',
    status: 'active',
    instructions: 'Inspect chloroplast thylakoids and central vacuole turgor mechanism. Complete quiz.',
    assignedCount: 36,
    completedCount: 19
  },
  {
    id: 'asg-3',
    title: 'Lab 02: Standardization of HCl by NaOH Titration',
    classroomId: 'cls-2',
    experimentId: 'chemistry-titration',
    dueDate: '2026-10-28',
    status: 'completed',
    instructions: 'Perform volumetric titration with phenolphthalein indicator. Record equivalence point.',
    assignedCount: 34,
    completedCount: 34
  }
];

export const INITIAL_STUDENT_PROGRESS: StudentProgressRecord[] = [
  {
    id: 'rec-1',
    studentId: 'stu-rw-01',
    studentName: 'Keza Amina',
    experimentId: 'physics-ohms-law',
    experimentTitle: "Ohm's Law & Circuit Analysis",
    subject: 'physics',
    completedAt: '2026-10-29',
    score: 100,
    observations: 'Voltage increased from 4V to 20V across 40Ω resistor. Current increased proportionally from 0.10A to 0.50A. Slope confirms exact 40Ω resistance.',
    teacherFeedback: 'Outstanding precision in plotting and calculating the inverse slope. Well done Keza.'
  },
  {
    id: 'rec-2',
    studentId: 'stu-rw-02',
    studentName: 'Ganza Patrick',
    experimentId: 'physics-ohms-law',
    experimentTitle: "Ohm's Law & Circuit Analysis",
    subject: 'physics',
    completedAt: '2026-10-29',
    score: 92,
    observations: 'Verified V=IR. Noticed slight needle oscillation at higher voltages due to thermal increase.',
    teacherFeedback: 'Very observant remark regarding temperature coefficient of resistance.'
  },
  {
    id: 'rec-3',
    studentId: 'stu-rw-03',
    studentName: 'Uwase Diane',
    experimentId: 'chemistry-titration',
    experimentTitle: 'Acid-Base Titration (HCl & NaOH)',
    subject: 'chemistry',
    completedAt: '2026-10-30',
    score: 95,
    observations: 'Equivalence point achieved at exactly 25.1 mL of NaOH. Color changed from clear to light magenta.',
    teacherFeedback: 'Excellent stopcock control. Your endpoint pink was subtle and precise.'
  },
  {
    id: 'rec-4',
    studentId: 'stu-rw-04',
    studentName: 'Manzi David',
    experimentId: 'biology-plant-cell',
    experimentTitle: '3D Interactive Plant Cell Explorer',
    subject: 'biology',
    completedAt: '2026-10-30',
    score: 88,
    observations: 'Explored chloroplast thylakoid membranes. Exploded mode helped visualize vacuole scale relative to cytoplasm.',
    teacherFeedback: 'Good comprehension of organelle geometry.'
  }
];

export const INITIAL_VR_DEVICES: VRDevice[] = [
  {
    id: 'vr-01',
    name: 'Headset Alpha-1',
    type: 'Meta Quest 2',
    serial: 'HZL-VR-2026-001',
    batteryPct: 94,
    status: 'available',
    room: 'Physics Lab Hall B'
  },
  {
    id: 'vr-02',
    name: 'Headset Alpha-2',
    type: 'Meta Quest 2',
    serial: 'HZL-VR-2026-002',
    batteryPct: 88,
    status: 'in-use',
    room: 'Physics Lab Hall B',
    assignedStudent: 'Keza Amina'
  },
  {
    id: 'vr-03',
    name: 'Headset Beta-1',
    type: 'Pico Neo 3',
    serial: 'HZL-VR-2026-015',
    batteryPct: 45,
    status: 'in-use',
    room: 'Chemistry Lab Hall A',
    assignedStudent: 'Ganza Patrick'
  },
  {
    id: 'vr-04',
    name: 'Headset Beta-2',
    type: 'Pico Neo 3',
    serial: 'HZL-VR-2026-016',
    batteryPct: 100,
    status: 'charging',
    room: 'Charging Station 1'
  },
  {
    id: 'vr-05',
    name: 'Station PC-08',
    type: 'Computer Workstation',
    serial: 'HZL-WS-2026-08',
    batteryPct: 100,
    status: 'available',
    room: 'Computer Lab 2'
  },
  {
    id: 'vr-06',
    name: 'AR Tablet Unit 3',
    type: 'Google Cardboard / Mobile AR',
    serial: 'HZL-AR-2026-03',
    batteryPct: 76,
    status: 'available',
    room: 'Biology Lab Hall C'
  }
];

export const INITIAL_OFFLINE_PACKAGES: OfflinePackage[] = [
  {
    id: 'pack-phys',
    title: 'Physics Core Simulator (Ohm, Projectiles, Optics)',
    subject: 'physics',
    sizeMb: 14.2,
    isDownloaded: true,
    experimentsCount: 3,
    lastUpdated: '2026-10-25'
  },
  {
    id: 'pack-chem',
    title: 'Chemistry Laboratory Pack (Titration, Reactions, Acids)',
    subject: 'chemistry',
    sizeMb: 18.6,
    isDownloaded: true,
    experimentsCount: 3,
    lastUpdated: '2026-10-24'
  },
  {
    id: 'pack-bio',
    title: 'Biology 3D Cytology & Virtual Microscope Models',
    subject: 'biology',
    sizeMb: 24.8,
    isDownloaded: false,
    experimentsCount: 3,
    lastUpdated: '2026-10-28'
  }
];
