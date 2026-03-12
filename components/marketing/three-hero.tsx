"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial, GradientTexture } from "@react-three/drei";
import * as THREE from "three";

function AnimatedShape({ color1, color2, position, speed, distort }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.cos(t / 4) / 8;
    meshRef.current.rotation.y = Math.sin(t / 4) / 8;
    meshRef.current.position.y = position[1] + Math.sin(t * speed) * 0.2;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[1, 64, 64]} position={position}>
        <MeshDistortMaterial
          distort={distort}
          speed={speed}
          roughness={0}
          metalness={0.1}
        >
          <GradientTexture
            stops={[0, 1]}
            colors={[color1, color2]}
            size={1024}
          />
        </MeshDistortMaterial>
      </Sphere>
    </Float>
  );
}

export function ThreeHero() {
  return (
    <div className="absolute inset-0 -z-10 bg-background overflow-hidden">
      <div className="absolute inset-0 opacity-40 dark:opacity-20 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          
          <AnimatedShape 
            position={[-2, 1, 0]} 
            color1="#3b82f6" 
            color2="#1d4ed8" 
            speed={1.5} 
            distort={0.4} 
          />
          <AnimatedShape 
            position={[2, -1, -1]} 
            color1="#6366f1" 
            color2="#4338ca" 
            speed={1.2} 
            distort={0.5} 
          />
          <AnimatedShape 
            position={[0, 0, -2]} 
            color1="#1e40af" 
            color2="#1e3a8a" 
            speed={1} 
            distort={0.3} 
          />
        </Canvas>
      </div>
      
      {/* Premium Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_100%)] opacity-70 pointer-events-none" />
    </div>
  );
}
