import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, Billboard } from '@react-three/drei';
import * as THREE from 'three';

export default function Hotspot({ issue, position, color, onClick, isSelected }) {
  const groupRef = useRef();
  const meshRef = useRef();
  const outerRingRef = useRef();
  const glowRef = useRef();
  const [hovered, setHovered] = useState(false);
  const visibleRef = useRef(true);
  const pulseRef = useRef(0);
  const { camera } = useThree();

  useFrame((state, delta) => {
    // Check if hotspot is on the visible side of the model (occlusion check)
    const hotspotPos = new THREE.Vector3(...position);
    const hotspotFromCenter = hotspotPos.clone().normalize();
    const cameraFromCenter = camera.position.clone().normalize();
    const dotProduct = hotspotFromCenter.dot(cameraFromCenter);

    // Show hotspot if it's on the same side as the camera
    const shouldBeVisible = dotProduct > -0.2;
    visibleRef.current = shouldBeVisible;

    // Update group visibility directly (avoids React state re-renders)
    if (groupRef.current) {
      groupRef.current.visible = shouldBeVisible;
    }

    if (meshRef.current && shouldBeVisible) {
      // Subtle pulsing animation for active issues only
      if (issue.status === 'active') {
        pulseRef.current += delta * 2; // Slower, more subtle
        const scale = 1 + Math.sin(pulseRef.current) * 0.15; // Reduced from 0.3 to 0.15
        meshRef.current.scale.setScalar(scale);

        // Subtle glow pulse
        if (glowRef.current) {
          const glowScale = 1.3 + Math.sin(pulseRef.current) * 0.2;
          glowRef.current.scale.setScalar(glowScale);
          glowRef.current.material.opacity = 0.2 + Math.sin(pulseRef.current) * 0.1;
        }
      }

      // Hover/selected effect
      if (hovered || isSelected) {
        meshRef.current.scale.setScalar(1.3);
      } else if (issue.status !== 'active') {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  // Size reduced by 20%
  const baseSize = 0.048; // Was 0.06
  const ringInner = 0.064; // Was 0.08
  const ringOuter = 0.08; // Was 0.1

  return (
    <group ref={groupRef} position={position}>
      {/* White outline ring for contrast */}
      <Billboard>
        <mesh renderOrder={1}>
          <ringGeometry args={[ringOuter, ringOuter + 0.016, 32]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Billboard>

      {/* Glow effect for active issues only */}
      {issue.status === 'active' && (
        <mesh ref={glowRef} renderOrder={2}>
          <sphereGeometry args={[baseSize * 1.8, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.25}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Main hotspot sphere */}
      <mesh
        ref={meshRef}
        renderOrder={3}
        onClick={(e) => {
          e.stopPropagation();
          onClick(issue);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[baseSize, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered || isSelected ? 1.0 : 0.6}
          transparent
          opacity={1}
        />
      </mesh>

      {/* Colored outer ring for emphasis */}
      <Billboard>
        <mesh ref={outerRingRef} renderOrder={4}>
          <ringGeometry args={[ringInner, ringOuter, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={hovered || isSelected ? 0.9 : 0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Billboard>

      {/* Tooltip on hover */}
      {hovered && (
        <Html
          position={[0, 0.12, 0]}
          center
          style={{
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
          zIndexRange={[100, 0]}
        >
          <div className="bg-dark-bg/95 backdrop-blur-sm text-white px-3 py-2 rounded-lg shadow-xl border border-dark-border transform -translate-y-2">
            <p className="font-medium text-sm">{issue.title}</p>
            <p className="text-xs text-gray-400 capitalize">{issue.status}</p>
          </div>
        </Html>
      )}
    </group>
  );
}
