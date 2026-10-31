/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCcw, ZoomIn, ZoomOut, Eye, Layers, ChevronDown, ChevronUp } from 'lucide-react';

interface OrganelleInfo {
  id: string;
  name: string;
  category: string;
  color: string;
  functionSummary: string;
  biochemistry: string;
  agriculturalContext: string;
  position: [number, number, number];
}

const ORGANELLES: OrganelleInfo[] = [
  {
    id: 'nucleus',
    name: 'Nucleus & Nucleolus',
    category: 'Information & Genetic Storage',
    color: '#8b5cf6',
    functionSummary: 'Encloses genomic DNA chromatin and coordinates RNA transcription and ribosome synthesis.',
    biochemistry: 'Surrounded by a double-layered nuclear envelope perforated with nuclear pores regulating macromolecular traffic.',
    agriculturalContext: 'Key genetic site for breeding high-yield, drought-resistant cassava and bean cultivars in Rwandan agriculture.',
    position: [0.8, 0.4, 0.5]
  },
  {
    id: 'chloroplast',
    name: 'Chloroplasts (Plastids)',
    category: 'Photosynthesis & Solar Capture',
    color: '#10b981',
    functionSummary: 'Transforms photon light energy, carbon dioxide, and water into chemical glucose sugars via photosynthesis.',
    biochemistry: 'Contains double outer membranes enclosing stroma fluid and stacked thylakoid discs (grana) embedded with chlorophyll pigments.',
    agriculturalContext: 'Directly dictates photosynthetic solar conversion efficiency and biomass accumulation across African staple crops.',
    position: [-1.2, 0.6, -0.6]
  },
  {
    id: 'vacuole',
    name: 'Large Central Vacuole',
    category: 'Turgor Pressure & Hydrostatic Storage',
    color: '#06b6d4',
    functionSummary: 'Maintains internal hydrostatic turgor pressure against the cell wall, providing structural rigidity and storing mineral ions.',
    biochemistry: 'Bounded by a selectively permeable tonoplast membrane; stores organic acids, enzymes, and water reserves.',
    agriculturalContext: 'Critical for drought tolerance in arid soils; loss of vacuolar water leads to visible plant wilting (plasmolysis).',
    position: [-0.3, -0.2, 0.4]
  },
  {
    id: 'cell_wall',
    name: 'Cellulose Cell Wall',
    category: 'Structural Armor & Osmotic Protection',
    color: '#84cc16',
    functionSummary: 'Rigid outer layer that prevents osmotic lysis and confers skeletal tensile strength to plant stems and foliage.',
    biochemistry: 'Composed of crystalline cellulose microfibrils woven with hemicellulose and calcium pectate middle lamella.',
    agriculturalContext: 'Provides resistance against insect pests and fungal pathogens, and forms dietary fiber in sorghum and maize crops.',
    position: [0, 0, 0]
  },
  {
    id: 'mitochondria',
    name: 'Mitochondria (Powerhouse)',
    category: 'Aerobic Cellular Respiration & ATP',
    color: '#f97316',
    functionSummary: 'Generates cellular ATP energy currency through the Krebs citric acid cycle and oxidative phosphorylation.',
    biochemistry: 'Characterized by deeply folded inner mitochondrial cristae membranes maximizing electron transport surface area.',
    agriculturalContext: 'Fuels active nutrient and potassium uptake from volcanic volcanic soils in Rwanda\'s Northern Province.',
    position: [1.2, -0.6, -0.7]
  },
  {
    id: 'golgi',
    name: 'Golgi Apparatus (Dictyosomes)',
    category: 'Molecular Packaging & Secretion',
    color: '#ec4899',
    functionSummary: 'Modifies, sorts, and packages synthesized glycoproteins and cell wall polysaccharides into transport vesicles.',
    biochemistry: 'Stack of flattened, curved membrane-bound cisternae with distinct cis (entry) and trans (exit) maturation faces.',
    agriculturalContext: 'Synthesizes pectin and cellulose precursor materials required for rapid seedling elongation.',
    position: [0.3, 1.1, -0.4]
  }
];

export const PlantCell3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedOrganelle, setSelectedOrganelle] = useState<OrganelleInfo>(ORGANELLES[0]);
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [isHudCollapsed, setIsHudCollapsed] = useState<boolean>(false);

  // References to Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const organelleMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 2.5, 5));

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Software WebGL Guard (Per Three.js skill)
    const isSoftwareGl = (() => {
      const probeCanvas = document.createElement('canvas');
      const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth;
    const height = container.clientHeight || 420;

    // 2. Scene & Renderer Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0b1120'); // Deep navy background
    scene.fog = new THREE.FogExp2('#0b1120', 0.08);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 5.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 3. Studio Lighting Rig
    const ambient = new THREE.HemisphereLight('#bae6fd', '#0f172a', 1.0);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight('#ffffff', 1.6);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight('#2dd4bf', 0.6);
    fillLight.position.set(-6, -2, -4);
    scene.add(fillLight);

    // Ground contact shadow disc
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x030712,
      transparent: true,
      opacity: 0.5,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.8;
    scene.add(shadowMesh);

    // 4. Procedural 3D Plant Cell Assembly (Composite Group)
    const cellRoot = new THREE.Group();
    scene.add(cellRoot);

    // A. Outer Cell Wall (Hexagonal / Beveled Cutaway Enclosure)
    const wallGroup = new THREE.Group();
    const wallGeo = new THREE.BoxGeometry(4.2, 2.8, 3.2, 2, 2, 2);
    const wallMat = new THREE.MeshStandardMaterial({
      color: '#4d7c0f',
      roughness: 0.6,
      metalness: 0.1,
      transparent: true,
      opacity: 0.35,
      wireframe: false
    });
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    wallGroup.add(wallMesh);

    // Cell wall rim wireframe accent
    const edges = new THREE.EdgesGeometry(wallGeo);
    const lineMat = new THREE.LineBasicMaterial({ color: '#84cc16', linewidth: 2 });
    const wallWire = new THREE.LineSegments(edges, lineMat);
    wallGroup.add(wallWire);
    cellRoot.add(wallGroup);
    organelleMeshesRef.current.set('cell_wall', wallGroup);

    // B. Large Central Vacuole (Cyan translucent vesicle)
    const vacuoleGroup = new THREE.Group();
    vacuoleGroup.position.set(-0.3, -0.2, 0.4);
    const vacGeo = new THREE.SphereGeometry(1.15, 32, 24);
    vacGeo.scale(1.2, 0.9, 1.0);
    const vacMat = new THREE.MeshPhysicalMaterial({
      color: '#06b6d4',
      roughness: 0.1,
      metalness: 0.05,
      transmission: isSoftwareGl ? 0 : 0.8,
      transparent: true,
      opacity: isSoftwareGl ? 0.45 : 0.7,
      ior: 1.33
    });
    const vacMesh = new THREE.Mesh(vacGeo, vacMat);
    vacuoleGroup.add(vacMesh);
    cellRoot.add(vacuoleGroup);
    organelleMeshesRef.current.set('vacuole', vacuoleGroup);

    // C. Nucleus & Nucleolus
    const nucGroup = new THREE.Group();
    nucGroup.position.set(0.8, 0.4, 0.5);
    const nucGeo = new THREE.SphereGeometry(0.65, 32, 24);
    const nucMat = new THREE.MeshStandardMaterial({
      color: '#7c3aed',
      roughness: 0.4,
      metalness: 0.2
    });
    const nucMesh = new THREE.Mesh(nucGeo, nucMat);
    nucGroup.add(nucMesh);

    // Inner nucleolus
    const innerNucGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const innerNucMat = new THREE.MeshStandardMaterial({
      color: '#4c1d95',
      roughness: 0.3
    });
    const innerNucMesh = new THREE.Mesh(innerNucGeo, innerNucMat);
    innerNucMesh.position.set(0.1, 0.1, 0.1);
    nucGroup.add(innerNucMesh);
    cellRoot.add(nucGroup);
    organelleMeshesRef.current.set('nucleus', nucGroup);

    // D. Chloroplasts (Multiple green capsules with internal thylakoids)
    const chloroGroup = new THREE.Group();
    const chloroCoords: [number, number, number, number][] = [
      [-1.2, 0.6, -0.6, 0.4],
      [-1.3, -0.7, -0.5, -0.3],
      [1.1, 0.8, -0.5, 0.7],
      [-0.4, 0.9, 0.8, -0.5]
    ];
    chloroCoords.forEach(([cx, cy, cz, rot]) => {
      const singleCp = new THREE.Group();
      singleCp.position.set(cx, cy, cz);
      singleCp.rotation.z = rot;

      const cpGeo = new THREE.CapsuleGeometry(0.22, 0.45, 12, 16);
      const cpMat = new THREE.MeshStandardMaterial({
        color: '#059669',
        roughness: 0.35,
        metalness: 0.1
      });
      const cpMesh = new THREE.Mesh(cpGeo, cpMat);
      singleCp.add(cpMesh);

      // Thylakoid grana discs inside
      for (let d = -0.15; d <= 0.15; d += 0.1) {
        const discGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.03, 12);
        const discMat = new THREE.MeshStandardMaterial({ color: '#15803d' });
        const discMesh = new THREE.Mesh(discGeo, discMat);
        discMesh.position.y = d;
        singleCp.add(discMesh);
      }
      chloroGroup.add(singleCp);
    });
    cellRoot.add(chloroGroup);
    organelleMeshesRef.current.set('chloroplast', chloroGroup);

    // E. Mitochondria (Folded cristae sausage)
    const mitoGroup = new THREE.Group();
    const mitoCoords: [number, number, number][] = [
      [1.2, -0.6, -0.7],
      [0.2, -0.9, -0.8]
    ];
    mitoCoords.forEach(([mx, my, mz]) => {
      const singleMito = new THREE.Group();
      singleMito.position.set(mx, my, mz);
      const mitoGeo = new THREE.CapsuleGeometry(0.18, 0.35, 12, 16);
      const mitoMat = new THREE.MeshStandardMaterial({
        color: '#ea580c',
        roughness: 0.4
      });
      const mitoMesh = new THREE.Mesh(mitoGeo, mitoMat);
      singleMito.add(mitoMesh);
      mitoGroup.add(singleMito);
    });
    cellRoot.add(mitoGroup);
    organelleMeshesRef.current.set('mitochondria', mitoGroup);

    // F. Golgi Apparatus (Stacked curved cisternae)
    const golgiGroup = new THREE.Group();
    golgiGroup.position.set(0.3, 1.0, -0.4);
    for (let g = 0; g < 4; g++) {
      const arcGeo = new THREE.TorusGeometry(0.35 + g * 0.08, 0.04, 8, 18, Math.PI * 0.7);
      const arcMat = new THREE.MeshStandardMaterial({
        color: '#db2777',
        roughness: 0.3
      });
      const arcMesh = new THREE.Mesh(arcGeo, arcMat);
      arcMesh.rotation.x = Math.PI / 2 + g * 0.08;
      arcMesh.position.y = g * 0.08;
      golgiGroup.add(arcMesh);
    }
    cellRoot.add(golgiGroup);
    organelleMeshesRef.current.set('golgi', golgiGroup);

    // 5. Mouse Drag & Orbit Interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onPointerDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      cellRoot.rotation.y += dx * 0.008;
      cellRoot.rotation.x += dy * 0.008;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    // 6. Animation Loop with Spring/Damping
    let frameId = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      const delta = clock.getDelta();

      // Gentle continuous cell floating rotation if not dragging
      if (!isDragging) {
        cellRoot.rotation.y += delta * 0.15;
      }

      // Smooth camera interpolation towards target focus
      camera.position.lerp(targetCamPosRef.current, 0.05);
      camera.lookAt(0, 0, 0);

      // Render
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      domElement.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (domElement.parentElement) {
        domElement.parentElement.removeChild(domElement);
      }
    };
  }, []);

  // Update target camera or exploded separations
  const handleSelectOrganelle = (org: OrganelleInfo) => {
    setSelectedOrganelle(org);
    if (org.id === 'nucleus') {
      targetCamPosRef.current.set(1.4, 1.2, 2.5);
    } else if (org.id === 'chloroplast') {
      targetCamPosRef.current.set(-2.0, 1.4, 2.0);
    } else if (org.id === 'vacuole') {
      targetCamPosRef.current.set(-0.6, 0.2, 3.2);
    } else if (org.id === 'mitochondria') {
      targetCamPosRef.current.set(2.2, -0.6, 2.0);
    } else {
      targetCamPosRef.current.set(0, 2.5, 5.2);
    }
  };

  const handleToggleExplode = () => {
    const nextExplode = !isExploded;
    setIsExploded(nextExplode);
    const meshes = organelleMeshesRef.current;

    meshes.forEach((group, id) => {
      if (id === 'cell_wall') {
        group.scale.set(nextExplode ? 1.4 : 1, nextExplode ? 1.4 : 1, nextExplode ? 1.4 : 1);
      } else if (id === 'chloroplast') {
        group.position.x = nextExplode ? -1.8 : 0;
      } else if (id === 'nucleus') {
        group.position.x = nextExplode ? 1.4 : 0;
      } else if (id === 'mitochondria') {
        group.position.z = nextExplode ? -1.6 : 0;
      }
    });
  };

  const handleResetCamera = () => {
    targetCamPosRef.current.set(0, 2.5, 5.2);
  };

  return (
    <div className="space-y-4">
      {/* 3D WebGL Viewport Container with Zero Viewport Occlusion Discipline */}
      <div className="relative w-full h-[540px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-lg">
        {/* WebGL Canvas Mount */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Minimal Spec Badge (Top-Left) */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60 text-xs text-slate-300">
            <span className="font-semibold text-teal-400">Eukaryotic Plant Cell</span>
            <span className="text-slate-500 mx-1.5">·</span>
            <span>3D Spatial WebGL Model</span>
          </div>
        </div>

        {/* Quick Viewport Utilities (Top-Right) */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-lg border border-slate-700/60">
          <button
            onClick={handleResetCamera}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Reset 3D camera"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleToggleExplode}
            className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 ${
              isExploded ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isExploded ? 'Exploded: ON' : 'Explode View'}</span>
          </button>
        </div>

        {/* Unified Bottom Control Dock (Consolidated per Three.js Directive Section 5) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[94%] max-w-4xl z-20">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl shadow-xl overflow-hidden transition-all duration-200">
            {/* Dock Header & Collapse Toggle */}
            <div className="px-4 py-2 border-b border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedOrganelle.color }} />
                <span className="font-semibold text-white">{selectedOrganelle.name}</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400">{selectedOrganelle.category}</span>
              </div>
              <button
                onClick={() => setIsHudCollapsed(!isHudCollapsed)}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
              >
                <span>{isHudCollapsed ? 'Expand Details' : 'Minimize'}</span>
                {isHudCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Dock Body */}
            {!isHudCollapsed && (
              <div className="p-3 space-y-3">
                {/* Horizontal Organelle Swatch Bar */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {ORGANELLES.map(org => {
                    const active = selectedOrganelle.id === org.id;
                    return (
                      <button
                        key={org.id}
                        onClick={() => handleSelectOrganelle(org)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                          active
                            ? 'bg-white text-slate-950 font-semibold shadow-sm'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: org.color }} />
                        <span>{org.name.split('(')[0].trim()}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Educational Information Strip */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1 border-t border-slate-800">
                  <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/60">
                    <span className="text-[10px] text-teal-400 font-semibold uppercase block mb-1">
                      Primary Biological Function
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {selectedOrganelle.functionSummary}
                    </p>
                  </div>
                  <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/60">
                    <span className="text-[10px] text-amber-400 font-semibold uppercase block mb-1">
                      Biochemical Ultrastructure
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {selectedOrganelle.biochemistry}
                    </p>
                  </div>
                  <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/60">
                    <span className="text-[10px] text-emerald-400 font-semibold uppercase block mb-1">
                      Rwanda Curriculum & Agriculture
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {selectedOrganelle.agriculturalContext}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
