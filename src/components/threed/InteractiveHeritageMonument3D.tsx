import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RotateCw, Eye, Sparkles, Compass, ShieldCheck, Info, HelpCircle } from 'lucide-react';
import {
  Monument3DType,
  MaterialCreator,
  FALLBACK_IMAGES,
  checkWebGLSupport,
  populateMonumentGeometry,
} from './monumentGeometries';

export type { Monument3DType };

interface InteractiveHeritageMonument3DProps {
  monumentType: Monument3DType;
  monumentName: string;
  cityName?: string;
  heightClass?: string;
  onExploreDetails?: () => void;
  autoRotateDefault?: boolean;
}

export const InteractiveHeritageMonument3D: React.FC<InteractiveHeritageMonument3DProps> = ({
  monumentType,
  monumentName,
  cityName,
  heightClass = 'h-72 sm:h-96',
  onExploreDetails,
  autoRotateDefault = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(autoRotateDefault);
  const [wireframe, setWireframe] = useState(false);
  const [webGLFailed, setWebGLFailed] = useState(!checkWebGLSupport());
  const [showHonestyNotice, setShowHonestyNotice] = useState(false);
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const groupRef = useRef<THREE.Group | null>(null);

  const toggleRotation = useCallback(() => setIsRotating((prev) => !prev), []);
  const toggleWireframe = useCallback(() => setWireframe((prev) => !prev), []);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount || webGLFailed) return;

    const width = currentMount.clientWidth || 500;
    const height = currentMount.clientHeight || 350;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfaf8f5);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3.5, 12);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      currentMount.appendChild(renderer.domElement);
    } catch {
      setWebGLFailed(true);
      return;
    }

    // Context loss safety
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebGLFailed(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);

    // Warm Indian lighting
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.1);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffedd5, 1.6);
    sunLight.position.set(8, 16, 10);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const skyFill = new THREE.DirectionalLight(0xe0f2fe, 0.7);
    skyFill.position.set(-8, 6, -8);
    scene.add(skyFill);

    const gridHelper = new THREE.GridHelper(20, 20, 0xd6d3d1, 0xe7e5e4);
    gridHelper.position.y = -2.01;
    scene.add(gridHelper);

    // Monument Model Group
    const modelGroup = new THREE.Group();
    groupRef.current = modelGroup;
    materialsRef.current = [];

    const createMat: MaterialCreator = (color: number, roughness = 0.35, metalness = 0.1) => {
      const mat = new THREE.MeshStandardMaterial({ color, roughness, metalness, wireframe });
      materialsRef.current.push(mat);
      return mat;
    };

    populateMonumentGeometry(monumentType, modelGroup, createMat);
    scene.add(modelGroup);

    // Interaction controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let reqId: number;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      prevMouseX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      prevMouseY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !modelGroup) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      modelGroup.rotation.y += deltaX * 0.008;
      modelGroup.rotation.x = Math.max(-0.4, Math.min(0.6, modelGroup.rotation.x + deltaY * 0.005));
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    currentMount.addEventListener('mousedown', onPointerDown);
    currentMount.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchend', onPointerUp);

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (isRotating && !isDragging && modelGroup) {
        modelGroup.rotation.y += 0.004;
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      currentMount.removeEventListener('mousedown', onPointerDown);
      currentMount.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchend', onPointerUp);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      if (reqId) cancelAnimationFrame(reqId);
      if (renderer && currentMount && renderer.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, [monumentType, isRotating, webGLFailed]);

  useEffect(() => {
    materialsRef.current.forEach((m) => {
      m.wireframe = wireframe;
    });
  }, [wireframe]);

  return (
    <div
      className="relative rounded-3xl overflow-hidden bg-[#FAF8F5] border border-[#EFE8DF] shadow-md focus-within:ring-2 focus-within:ring-amber-600"
      role="region"
      aria-label={`3D Architectural Visualization of ${monumentName}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'k') {
          e.preventDefault();
          toggleRotation();
        } else if (e.key === 'w' || e.key === 'W') {
          e.preventDefault();
          toggleWireframe();
        } else if (e.key === 'ArrowLeft' && groupRef.current) {
          groupRef.current.rotation.y -= 0.1;
        } else if (e.key === 'ArrowRight' && groupRef.current) {
          groupRef.current.rotation.y += 0.1;
        }
      }}
    >
      {/* Header & Honesty Disclosure */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
        <span className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#EFE8DF] text-xs font-bold text-slate-900 shadow-sm flex items-center gap-1.5 min-h-[36px]">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
          <span>{monumentName}</span>
          {cityName && <span className="text-slate-600 font-normal">({cityName})</span>}
        </span>

        <button
          onClick={() => setShowHonestyNotice((prev) => !prev)}
          className="px-2.5 py-1.5 rounded-full bg-amber-50/90 hover:bg-amber-100 border border-amber-300 text-[11px] font-semibold text-amber-900 flex items-center gap-1 transition shadow-sm min-h-[36px]"
          title="About this 3D representation"
          aria-expanded={showHonestyNotice}
          aria-label="3D Model Provenance Notice"
        >
          <Info className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
          <span className="hidden sm:inline">Procedural Geometry</span>
        </button>
      </div>

      {showHonestyNotice && (
        <div className="absolute top-16 left-4 right-4 z-20 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-amber-300 text-xs text-slate-800 shadow-lg animate-fadeIn space-y-1">
          <div className="font-bold text-amber-950 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-amber-700" />
            <span>Architectural Honesty Disclosure (Blueprint Section XI)</span>
          </div>
          <p className="text-slate-700 leading-relaxed text-[11px]">
            This interactive 3D model is a <strong>procedural architectural volume</strong> constructed with Three.js WebGL based on public architectural records. It represents structural proportions (plinth, domes, minarets, spires) for educational exploration. It is <strong>not</strong> an official ASI LiDAR photogrammetry scan.
          </p>
        </div>
      )}

      {!webGLFailed && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <button
            onClick={toggleRotation}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm min-h-[44px] min-w-[44px] ${
              isRotating
                ? 'bg-amber-800 text-white border-amber-800 focus:ring-2 focus:ring-amber-500'
                : 'bg-white text-slate-800 border-[#EFE8DF] hover:bg-slate-50 focus:ring-2 focus:ring-amber-700'
            }`}
            aria-label={isRotating ? 'Pause 3D rotation' : 'Resume 3D rotation'}
          >
            <RotateCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} aria-hidden="true" />
            <span className="hidden sm:inline">{isRotating ? 'Rotating' : 'Paused'}</span>
          </button>

          <button
            onClick={toggleWireframe}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm min-h-[44px] min-w-[44px] ${
              wireframe
                ? 'bg-amber-100 text-amber-950 border-amber-400 focus:ring-2 focus:ring-amber-600'
                : 'bg-white text-slate-800 border-[#EFE8DF] hover:bg-slate-50 focus:ring-2 focus:ring-amber-700'
            }`}
            aria-label={wireframe ? 'Switch to solid shaded mode' : 'Switch to wireframe polygon mode'}
          >
            <Eye className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">{wireframe ? 'Solid' : 'Wireframe'}</span>
          </button>
        </div>
      )}

      {/* 3D WebGL Canvas or High-res Photograph Fallback */}
      {webGLFailed ? (
        <div className={`w-full ${heightClass} relative overflow-hidden bg-slate-900`}>
          <img
            src={FALLBACK_IMAGES[monumentType] || FALLBACK_IMAGES['taj-mahal']}
            alt={`Architectural photograph of ${monumentName}`}
            className="w-full h-full object-cover opacity-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent flex items-end p-6">
            <div className="text-white space-y-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-medium border border-white/30">
                <Compass className="w-3 h-3 text-amber-400" aria-hidden="true" />
                Archival Architectural Perspective
              </span>
              <p className="text-xs text-slate-200">
                WebGL unavailable on this device. Displaying high-definition heritage photograph view.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div
          ref={mountRef}
          className={`w-full ${heightClass} cursor-grab active:cursor-grabbing select-none focus:outline-none`}
          aria-hidden="true"
        />
      )}

      {/* Bottom Info & Accessible Hint */}
      <div className="p-3.5 bg-white border-t border-[#EFE8DF] flex flex-wrap items-center justify-between gap-2 text-xs text-slate-700">
        <span className="flex items-center gap-1.5 text-slate-700">
          <Compass className="w-4 h-4 text-amber-700 flex-shrink-0" aria-hidden="true" />
          {webGLFailed ? (
            <span>Architectural reference photograph from national heritage archive</span>
          ) : (
            <>
              <span className="hidden md:inline">Click & drag to rotate 360° freely. Keys: Space (pause), W (wireframe), Arrows (turn).</span>
              <span className="md:hidden">Drag or touch to rotate 3D view freely.</span>
            </>
          )}
        </span>

        {onExploreDetails && (
          <button
            onClick={onExploreDetails}
            className="px-3.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold transition flex items-center gap-1.5 text-xs min-h-[44px]"
            aria-label={`Explore official architectural details for ${monumentName}`}
          >
            <span>Explore Details</span>
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
};
