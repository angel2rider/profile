import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, Center, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

export function GateSceneContent({ isTransitioning }: { isTransitioning: boolean }) {
  const textRef = useRef<THREE.Group>(null);
  const starsRef = useRef<THREE.Group>(null);
  const targetRotation = useRef(new THREE.Vector2(0, 0));
  const currentRotation = useRef(new THREE.Vector2(0, 0));

  useFrame((state, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y -= delta * 0.05;
      starsRef.current.rotation.x -= delta * 0.02;
    }

    if (!isTransitioning) {
      const { pointer } = state;
      targetRotation.current.x = (pointer.y * Math.PI) / 8;
      targetRotation.current.y = (pointer.x * Math.PI) / 8;

      currentRotation.current.x = THREE.MathUtils.damp(currentRotation.current.x, targetRotation.current.x, 4, delta);
      currentRotation.current.y = THREE.MathUtils.damp(currentRotation.current.y, targetRotation.current.y, 4, delta);

      if (textRef.current) {
        textRef.current.rotation.x = -currentRotation.current.x;
        textRef.current.rotation.y = currentRotation.current.y;
      }
    } else {
      // Small suck-in effect
      state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, 8, 4, delta);
      const camera = state.camera as THREE.PerspectiveCamera;
      camera.fov = THREE.MathUtils.damp(camera.fov, 80, 4, delta);
      camera.updateProjectionMatrix();
      
      if (textRef.current) {
        // Slight stretch on Z axis
        textRef.current.scale.z = THREE.MathUtils.damp(textRef.current.scale.z, 3, 4, delta);
      }
      if (starsRef.current) {
        starsRef.current.position.z = THREE.MathUtils.damp(starsRef.current.position.z, 5, 4, delta);
      }
    }
  });

  return (
    <>
      <group ref={starsRef}>
        <Stars radius={50} depth={50} count={7000} factor={4} saturation={0} fade speed={2} />
      </group>
      <group ref={textRef}>
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <Center>
            <Text3D
              font="https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json"
              size={2}
              height={0.4}
              curveSegments={12}
              bevelEnabled
              bevelThickness={0.03}
              bevelSize={0.03}
              bevelOffset={0}
              bevelSegments={5}
            >
              TheGT
              <meshStandardMaterial 
                color="#ffffff" 
                emissive="#ffffff" 
                emissiveIntensity={0.5} 
                roughness={0.1} 
                metalness={0.8} 
              />
            </Text3D>
          </Center>
        </Float>
      </group>
    </>
  );
}

export default function GateSceneCanvas({ isTransitioning }: { isTransitioning: boolean }) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <React.Suspense fallback={null}>
        <GateSceneContent isTransitioning={isTransitioning} />
      </React.Suspense>
    </Canvas>
  );
}
