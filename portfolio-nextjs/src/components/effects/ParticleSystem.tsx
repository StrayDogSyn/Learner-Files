'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';

// Extend the JSX namespace to include Three.js elements
extend({ Points: THREE.Points });

interface ParticleConfig {
  count: number;
  size: [number, number];
  speed: number;
  color: string;
  opacity: [number, number];
  interactive: boolean;
  physics: {
    gravity: number;
    friction: number;
    attraction: number;
  };
}

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  size: number;
  opacity: number;
  life: number;
}

const ParticleField: React.FC<{ config: ParticleConfig }> = ({ config }) => {
  const meshRef = useRef<THREE.Points | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  
  // Initialize particles
  useEffect(() => {
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < config.count; i++) {
      newParticles.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * config.speed,
          (Math.random() - 0.5) * config.speed,
          (Math.random() - 0.5) * config.speed
        ),
        size: config.size[0] + Math.random() * (config.size[1] - config.size[0]),
        opacity: config.opacity[0] + Math.random() * (config.opacity[1] - config.opacity[0]),
        life: Math.random()
      });
    }
    
    setParticles(newParticles);
  }, [config]);
  
  // Mouse interaction
  useEffect(() => {
    if (!config.interactive) return;
    
    const handleMouseMove = (event: MouseEvent) => {
      setMouse({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [config.interactive]);
  
  // Animation loop
  useFrame((state, delta) => {
    if (!meshRef.current || particles.length === 0) return;
    
    const positions = new Float32Array(particles.length * 3);
    const sizes = new Float32Array(particles.length);
    const opacities = new Float32Array(particles.length);
    
    particles.forEach((particle, i) => {
      // Apply physics
      particle.velocity.y -= config.physics.gravity * delta;
      particle.velocity.multiplyScalar(config.physics.friction);
      
      // Mouse attraction
      if (config.interactive) {
        const mouseVector = new THREE.Vector3(mouse.x * 10, mouse.y * 10, 0);
        const distance = particle.position.distanceTo(mouseVector);
        const attraction = config.physics.attraction / (distance + 1);
        
        particle.velocity.add(
          mouseVector.sub(particle.position).normalize().multiplyScalar(attraction * delta)
        );
      }
      
      // Update position
      particle.position.add(particle.velocity.clone().multiplyScalar(delta));
      
      // Boundary wrapping
      if (particle.position.x > 10) particle.position.x = -10;
      if (particle.position.x < -10) particle.position.x = 10;
      if (particle.position.y > 10) particle.position.y = -10;
      if (particle.position.y < -10) particle.position.y = 10;
      
      // Update arrays
      positions[i * 3] = particle.position.x;
      positions[i * 3 + 1] = particle.position.y;
      positions[i * 3 + 2] = particle.position.z;
      sizes[i] = particle.size;
      opacities[i] = particle.opacity;
    });
    
    if (meshRef.current.geometry) {
      meshRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      meshRef.current.geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      meshRef.current.geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
    }
  });
  
  const vertexShader = `
    attribute float size;
    attribute float opacity;
    varying float vOpacity;
    
    void main() {
      vOpacity = opacity;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;
  
  const fragmentShader = `
    uniform vec3 color;
    varying float vOpacity;
    
    void main() {
      float distance = length(gl_PointCoord - vec2(0.5));
      if (distance > 0.5) discard;
      
      float alpha = 1.0 - (distance * 2.0);
      gl_FragColor = vec4(color, alpha * vOpacity);
    }
  `;
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particles.length * 3);
    const sizes = new Float32Array(particles.length);
    const opacities = new Float32Array(particles.length);
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
    
    return geo;
  }, [particles.length]);
  
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        color: { value: new THREE.Color(config.color) }
      },
      transparent: true,
      blending: THREE.AdditiveBlending
    });
  }, [config.color, vertexShader, fragmentShader]);
  
  // Temporarily disabled due to TypeScript issues with @react-three/fiber
  // TODO: Fix Three.js JSX element typing
  return null;
  
  // return (
  //   <points ref={meshRef} geometry={geometry} material={material} />
  // );
};

export const ParticleSystem: React.FC<{ config: ParticleConfig }> = ({ config }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
        <ParticleField config={config} />
      </Canvas>
    </div>
  );
};