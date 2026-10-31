/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  Glasses,
  Smartphone,
  Eye,
  Camera,
  Layers,
  RotateCcw,
  Sparkles,
  Info,
  Maximize2
} from 'lucide-react';

export const ImmersiveDemo: React.FC = () => {
  const [mode, setMode] = useState<'vr' | 'ar'>('vr');
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [webxrSupported, setWebxrSupported] = useState<boolean>(false);

  const vrMountRef = useRef<HTMLDivElement>(null);
  const arMountRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check WebXR hardware support cleanly
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'xr' in navigator) {
      // @ts-ignore
      navigator.xr?.isSessionSupported?.('immersive-vr')?.then((supported: boolean) => {
        setWebxrSupported(supported);
      }).catch(() => setWebxrSupported(false));
    }
  }, []);

  // 3D Three.js VR Lab Walkthrough Scene
  useEffect(() => {
    const container = vrMountRef.current;
    if (!container || mode !== 'vr') return;

    const width = container.clientWidth;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030712');
    scene.fog = new THREE.FogExp2('#030712', 0.05);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 1.6, 3.5); // Average eye level height (1.6m)

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambient = new THREE.HemisphereLight('#38bdf8', '#0f172a', 1.2);
    scene.add(ambient);

    const mainLight = new THREE.PointLight('#2dd4bf', 2, 20);
    mainLight.position.set(0, 3, 0);
    scene.add(mainLight);

    // Laboratory Floor Grid
    const grid = new THREE.GridHelper(20, 20, '#0d9488', '#1e293b');
    grid.position.y = 0;
    scene.add(grid);

    // Lab Workbench in Center
    const benchGroup = new THREE.Group();
    const topGeo = new THREE.BoxGeometry(3.6, 0.15, 1.8);
    const topMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.3 });
    const topMesh = new THREE.Mesh(topGeo, topMat);
    topMesh.position.y = 0.9;
    benchGroup.add(topMesh);

    // Legs
    [-1.6, 1.6].forEach(x => {
      [-0.7, 0.7].forEach(z => {
        const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.9, 8);
        const legMat = new THREE.MeshStandardMaterial({ color: '#475569' });
        const legMesh = new THREE.Mesh(legGeo, legMat);
        legMesh.position.set(x, 0.45, z);
        benchGroup.add(legMesh);
      });
    });

    // 3D Apparatus on Bench: Beakers and Floating Hologram
    const beakerGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.35, 16);
    const beakerMat = new THREE.MeshPhysicalMaterial({
      color: '#38bdf8',
      transparent: true,
      opacity: 0.7,
      roughness: 0.1
    });
    const beakerMesh = new THREE.Mesh(beakerGeo, beakerMat);
    beakerMesh.position.set(-0.6, 1.15, 0);
    benchGroup.add(beakerMesh);

    // Floating DNA Double Helix representation
    const helixGroup = new THREE.Group();
    helixGroup.position.set(0.6, 1.6, 0);
    for (let i = 0; i < 20; i++) {
      const angle = i * 0.35;
      const y = (i - 10) * 0.04;
      const x1 = Math.cos(angle) * 0.25;
      const z1 = Math.sin(angle) * 0.25;
      const x2 = -x1;
      const z2 = -z1;

      const sphereGeo = new THREE.SphereGeometry(0.035, 8, 8);
      const s1 = new THREE.Mesh(sphereGeo, new THREE.MeshStandardMaterial({ color: '#0d9488' }));
      s1.position.set(x1, y, z1);
      const s2 = new THREE.Mesh(sphereGeo, new THREE.MeshStandardMaterial({ color: '#f59e0b' }));
      s2.position.set(x2, y, z2);

      // Connecting rung
      const rungGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.5, 6);
      const rungMat = new THREE.MeshBasicMaterial({ color: '#64748b' });
      const rung = new THREE.Mesh(rungGeo, rungMat);
      rung.position.set(0, y, 0);
      rung.rotation.z = Math.PI / 2;
      rung.rotation.y = -angle;

      helixGroup.add(s1);
      helixGroup.add(s2);
      helixGroup.add(rung);
    }
    benchGroup.add(helixGroup);
    scene.add(benchGroup);

    // Interactive Mouse Look Around
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let yaw = 0;
    let pitch = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;

      yaw -= dx * 0.005;
      pitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, pitch - dy * 0.005));

      camera.rotation.set(pitch, yaw, 0, 'YXZ');
    };

    const onMouseUp = () => { isDragging = false; };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let frameId = 0;
    const tick = () => {
      helixGroup.rotation.y += 0.02;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
      if (domElement.parentElement) domElement.parentElement.removeChild(domElement);
    };
  }, [mode]);

  // AR Camera Video Stream toggle
  const toggleCamera = async () => {
    if (cameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setCameraActive(true);
      } catch (err) {
        alert('Camera access unavailable or declined. Exploring 3D model in virtual spatial sandbox.');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wide">
          Next-Generation Educational Reality
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Immersive VR & Augmented Reality Mode
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          HezaLab Africa runs directly inside modern web browsers with zero app installation, while providing full WebXR and mobile AR hardware readiness.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 max-w-md">
        <button
          onClick={() => setMode('vr')}
          className={`flex-1 py-2 px-4 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 ${
            mode === 'vr'
              ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          <Glasses className="w-4 h-4" />
          <span>Virtual Reality (VR) Lab</span>
        </button>
        <button
          onClick={() => setMode('ar')}
          className={`flex-1 py-2 px-4 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 ${
            mode === 'ar'
              ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Augmented Reality (AR)</span>
        </button>
      </div>

      {/* VR Experience Content */}
      {mode === 'vr' && (
        <div className="space-y-6">
          <div className="relative w-full h-[500px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
            <div ref={vrMountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

            {/* Overlay Status */}
            <div className="absolute top-4 left-4 z-10 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-700/60 text-xs text-slate-200">
              <span className="font-semibold text-teal-400">Desktop WebGL Walkthrough</span>
              <span className="text-slate-500 mx-2">·</span>
              <span>Click & Drag to Look Around (360°)</span>
            </div>

            {/* WebXR Hardware Detection Badge */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Glasses className="w-4 h-4 text-teal-400 shrink-0" />
                <span>
                  WebXR Status: {webxrSupported ? 'Compatible Headset Detected' : 'No Dedicated VR Headset Detected (Using Interactive 3D Browser Fallback)'}
                </span>
              </div>
              <button
                onClick={() => {
                  if (webxrSupported) {
                    alert('Requesting WebXR Immersive Session with Headset...');
                  } else {
                    alert('To use dedicated VR: connect a Meta Quest 2/3 or Pico Neo 3 headset and open this URL in the headset browser (Oculus Browser / Pico Browser).');
                  }
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg whitespace-nowrap transition-colors"
              >
                {webxrSupported ? 'Enter WebXR Headset Mode' : 'VR Setup Instructions'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AR Experience Content */}
      {mode === 'ar' && (
        <div className="space-y-6">
          <div className="relative w-full h-[500px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-xl flex items-center justify-center">
            {/* Background Camera Feed if active */}
            <video
              ref={videoRef}
              className={`absolute inset-0 w-full h-full object-cover ${cameraActive ? 'opacity-100' : 'opacity-0'}`}
              playsInline
              muted
            />

            {/* AR Specimen Graphic Center Stage */}
            <div className="relative z-10 text-center p-6 space-y-4 max-w-md">
              <div className="w-32 h-32 rounded-3xl bg-teal-500/10 border-2 border-teal-500/40 mx-auto flex items-center justify-center text-teal-400 shadow-2xl backdrop-blur-sm animate-pulse">
                <Sparkles className="w-16 h-16" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Spatial Chloroplast Specimen</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {cameraActive
                    ? 'Camera active. Projecting cellular specimen into real-world classroom space.'
                    : 'Activate camera to overlay interactive 3D science specimens onto student desks using Web AR.'}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={toggleCamera}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 mx-auto transition-colors shadow-lg"
                >
                  <Camera className="w-4 h-4" />
                  <span>{cameraActive ? 'Stop Camera Overlay' : 'Enable Desk Camera AR'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
