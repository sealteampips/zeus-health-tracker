import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Center, PerspectiveCamera, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import Hotspot from './Hotspot';
import { statusColors } from '../data/zeusData';
import { bodyParts } from '../data/bodyParts';

function DogModel({ onModelLoaded }) {
  const { scene } = useGLTF('/models/zeus.glb');

  useEffect(() => {
    if (scene && onModelLoaded) {
      onModelLoaded(true);
    }
  }, [scene, onModelLoaded]);

  return (
    <Center>
      <primitive object={scene} scale={1} />
    </Center>
  );
}

function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-dark-bg/80">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading 3D Model...</p>
      </div>
    </div>
  );
}

function PlaceholderDog() {
  return (
    <group>
      {/* Simple dog silhouette placeholder */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.25, 0.6, 8, 16]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.2, 0.35]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>
      {/* Snout */}
      <mesh position={[0, 0.15, 0.5]}>
        <boxGeometry args={[0.15, 0.1, 0.15]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
      {/* Ears */}
      <mesh position={[-0.12, 0.35, 0.3]}>
        <coneGeometry args={[0.06, 0.12, 8]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>
      <mesh position={[0.12, 0.35, 0.3]}>
        <coneGeometry args={[0.06, 0.12, 8]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.15, -0.25, 0.2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>
      <mesh position={[0.15, -0.25, 0.2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>
      <mesh position={[-0.15, -0.25, -0.2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>
      <mesh position={[0.15, -0.25, -0.2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>
      {/* Tail */}
      <mesh position={[0, 0.1, -0.45]} rotation={[0.5, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.02, 0.15, 8]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>
    </group>
  );
}

// Preview hotspot shown during calibration - bright cyan/white
function PreviewHotspot({ position }) {
  const baseSize = 0.064; // 20% smaller
  const ringInner = 0.08;
  const ringOuter = 0.096;

  return (
    <group position={position}>
      {/* Outer glow */}
      <mesh renderOrder={10}>
        <sphereGeometry args={[baseSize * 2, 16, 16]} />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.3}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>

      {/* Main sphere - bright cyan */}
      <mesh renderOrder={11}>
        <sphereGeometry args={[baseSize, 16, 16]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={1.5}
          transparent
          opacity={1}
          depthTest={false}
        />
      </mesh>

      {/* White outline ring */}
      <Billboard>
        <mesh renderOrder={12}>
          <ringGeometry args={[ringOuter, ringOuter + 0.024, 32]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.9}
            side={THREE.DoubleSide}
            depthTest={false}
          />
        </mesh>
      </Billboard>

      {/* Cyan inner ring */}
      <Billboard>
        <mesh renderOrder={13}>
          <ringGeometry args={[ringInner, ringOuter, 32]} />
          <meshBasicMaterial
            color="#00ffff"
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
            depthTest={false}
          />
        </mesh>
      </Billboard>
    </group>
  );
}

// Error Boundary Class Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.log('3D Model Error:', error);
    if (this.props.onError) {
      this.props.onError();
    }
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

// Status filter options
export const STATUS_FILTERS = {
  ACTIVE_ONLY: 'active',
  ACTIVE_MONITORING: 'active+monitoring',
  SHOW_ALL: 'all'
};

export default function ModelViewer({
  showHotspots,
  onSelectIssue,
  selectedIssue,
  issues = [],
  calibrationMode = false,
  selectedBodyPart = null,
  previewPosition = null,
  getPosition,
  statusFilter = STATUS_FILTERS.ACTIVE_ONLY
}) {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelError, setModelError] = useState(false);

  // Filter issues based on statusFilter and only show those with bodyPartId
  const visibleIssues = issues.filter(issue => {
    // Must have a bodyPartId to show as hotspot
    if (!issue.bodyPartId) return false;

    switch (statusFilter) {
      case STATUS_FILTERS.ACTIVE_ONLY:
        return issue.status === 'active';
      case STATUS_FILTERS.ACTIVE_MONITORING:
        return issue.status === 'active' || issue.status === 'monitoring';
      case STATUS_FILTERS.SHOW_ALL:
        return true;
      default:
        return issue.status === 'active';
    }
  });

  // Get hotspot position from calibration hook
  const getHotspotPosition = (issue) => {
    if (getPosition && issue.bodyPartId) {
      return getPosition(issue.bodyPartId);
    }
    // Fallback for legacy data
    return issue.position || [0, 0, 0];
  };

  // 3/4 front-left camera position
  const cameraPosition = [2, 0.8, 2.5];

  // Get legend items based on filter
  const getLegendItems = () => {
    const items = [{ color: 'bg-red-500', label: 'Active' }];
    if (statusFilter === STATUS_FILTERS.ACTIVE_MONITORING || statusFilter === STATUS_FILTERS.SHOW_ALL) {
      items.push({ color: 'bg-yellow-500', label: 'Monitoring' });
    }
    if (statusFilter === STATUS_FILTERS.SHOW_ALL) {
      items.push({ color: 'bg-green-500', label: 'Resolved' });
    }
    return items;
  };

  return (
    <div className={`relative w-full h-full min-h-[350px] bg-dark-card rounded-xl overflow-hidden border ${calibrationMode ? 'border-purple-500' : 'border-dark-border'} touch-none`}>
      <Canvas shadows>
        {/* Camera positioned for 3/4 front-left view */}
        <PerspectiveCamera makeDefault position={cameraPosition} fov={45} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <directionalLight position={[-5, 3, -5]} intensity={0.4} />
        <pointLight position={[0, 2, 2]} intensity={0.3} />

        <Suspense fallback={null}>
          {!modelError ? (
            <ErrorBoundary onError={() => setModelError(true)}>
              <DogModel onModelLoaded={setModelLoaded} />
            </ErrorBoundary>
          ) : (
            <PlaceholderDog />
          )}
        </Suspense>

        {/* Preview hotspot during calibration */}
        {calibrationMode && selectedBodyPart && previewPosition && (
          <PreviewHotspot position={previewPosition} />
        )}

        {/* Render hotspots - only when not in calibration mode */}
        {!calibrationMode && showHotspots && (modelLoaded || modelError) && visibleIssues.map((issue) => (
          <Hotspot
            key={issue.id}
            issue={issue}
            position={getHotspotPosition(issue)}
            color={statusColors[issue.status]}
            onClick={() => onSelectIssue(issue)}
            isSelected={selectedIssue?.id === issue.id}
          />
        ))}

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1.5}
          maxDistance={6}
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 1.5}
          target={[0, 0, 0]}
          touches={{
            ONE: 1, // ROTATE
            TWO: 2  // DOLLY_PAN
          }}
        />
        <Environment preset="studio" />
      </Canvas>

      {!modelLoaded && !modelError && <LoadingSpinner />}

      {modelError && !calibrationMode && (
        <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-yellow-500/20 text-yellow-400 px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm">
          Placeholder model. Add zeus.glb to public/models/
        </div>
      )}

      {/* Calibration mode indicator */}
      {calibrationMode && (
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-purple-500/20 text-purple-300 px-3 py-2 rounded-lg border border-purple-500/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
            <span className="text-sm font-medium">Calibration Mode</span>
          </div>
          {selectedBodyPart && (
            <p className="text-xs text-purple-400 mt-1">
              Adjust sliders to position: {bodyParts.find(p => p.id === selectedBodyPart)?.label}
            </p>
          )}
          {!selectedBodyPart && (
            <p className="text-xs text-gray-400 mt-1">
              Select a body part to begin
            </p>
          )}
        </div>
      )}

      {/* Legend - only when not calibrating */}
      {!calibrationMode && (
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-dark-bg/90 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-dark-border">
          <p className="text-xs text-gray-400 mb-1 sm:mb-2 font-medium">Status</p>
          <div className="space-y-1">
            {getLegendItems().map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${item.color}`}></div>
                <span className="text-xs text-gray-300">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls hint - hide on mobile and when calibrating */}
      {!calibrationMode && (
        <div className="hidden sm:block absolute bottom-4 right-4 text-xs text-gray-500">
          Drag to rotate • Scroll to zoom • Shift+drag to pan
        </div>
      )}

      {/* Calibration hint */}
      {calibrationMode && (
        <div className="hidden sm:block absolute bottom-4 right-4 text-xs text-purple-400">
          Rotate the model to verify hotspot position from all angles
        </div>
      )}
    </div>
  );
}
