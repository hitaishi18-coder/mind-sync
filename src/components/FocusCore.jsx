import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float, Stars } from "@react-three/drei";

function CoreMesh({ score }) {
  const meshRef = useRef();
  
  // Logic: 
  // High Score (>80) = Blue, Stable (Flow)
  // Low Score (<40) = Red, Distorted (Stress)
  // Mid Score = Purple (Normal)
  
  const isStressed = score < 40;
  const isFlow = score > 80;
  
  const color = isStressed ? "#ef4444" : isFlow ? "#3b82f6" : "#a855f7"; 
  const distort = isStressed ? 0.6 : 0.3; 
  const speed = isStressed ? 3 : 1.5; 

  useFrame((state) => {
    if (meshRef.current) {
        meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
        meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Sphere args={[1, 64, 64]} ref={meshRef} scale={1.8}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={distort}
        speed={speed}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
}

export default function FocusCore({ score }) {
  return (
    <div className="w-full h-[300px] rounded-xl overflow-hidden bg-black/95 relative border border-gray-800 shadow-2xl">
      <div className="absolute top-4 left-4 z-10">
         <div className="text-xs font-mono text-blue-400 tracking-widest mb-1">NEURO-CORE v1.0</div>
         <div className={`h-1 w-12 rounded-full ${score > 50 ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`}></div>
      </div>
      
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} color="blue" intensity={0.5} />
        
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
          <CoreMesh score={score} />
        </Float>
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
      
      <div className="absolute bottom-4 right-4 z-10 text-right">
        <p className="text-3xl font-bold text-white tracking-tighter drop-shadow-lg">{score}%</p>
        <p className={`text-xs font-mono font-medium ${score > 80 ? 'text-blue-400' : score < 40 ? 'text-red-400' : 'text-purple-400'}`}>
            {score > 80 ? "SYSTEM: FLOW STATE" : score < 40 ? "SYSTEM: UNSTABLE" : "SYSTEM: STABLE"}
        </p>
      </div>
    </div>
  );
}