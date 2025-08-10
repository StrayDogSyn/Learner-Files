import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import { Text, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Vector3, Euler, Color } from 'three';
import { motion } from 'framer-motion';
import { DiceGroupResult, DiceResult } from '../../types/knucklebones';

interface DicePhysics3DProps {
  isRolling: boolean;
  onRollComplete: (results: DiceGroupResult[]) => void;
  diceCount: number;
  className?: string;
  theme?: 'glass' | 'neon' | 'classic';
  enablePhysics?: boolean;
  rollForce?: number;
}

interface DiceProps {
  position: [number, number, number];
  rotation: [number, number, number];
  onSettle: (value: number, id: string) => void;
  id: string;
  theme: 'glass' | 'neon' | 'classic';
  rollForce: number;
}

const DiceGeometry: React.FC<DiceProps> = ({ position, rotation, onSettle, id, theme, rollForce }) => {
  const meshRef = useRef<any>();
  const rigidBodyRef = useRef<any>();
  
  const [isSettled, setIsSettled] = useState(false);
  const [finalValue, setFinalValue] = useState<number>(1);
  const velocityRef = useRef<Vector3>(new Vector3());
  const angularVelocityRef = useRef<Vector3>(new Vector3());
  const settleTimeoutRef = useRef<NodeJS.Timeout>();

  // Apply initial roll force
  useEffect(() => {
    if (rigidBodyRef.current) {
      const force = rollForce;
      const randomForce = {
        x: (Math.random() - 0.5) * force,
        y: Math.random() * force * 0.5 + force * 0.5,
        z: (Math.random() - 0.5) * force
      };
      const randomTorque = {
        x: (Math.random() - 0.5) * force * 2,
        y: (Math.random() - 0.5) * force * 2,
        z: (Math.random() - 0.5) * force * 2
      };
      
      rigidBodyRef.current.applyImpulse(randomForce, true);
      rigidBodyRef.current.applyTorqueImpulse(randomTorque, true);
    }
  }, [rollForce]);

  // Monitor velocity to detect when dice settles
  useFrame(() => {
    if (meshRef.current && !isSettled) {
      const velocity = velocityRef.current;
      const angularVelocity = angularVelocityRef.current;
      
      // Check if dice has settled (low velocity)
      const isStill = velocity.length() < 0.1 && angularVelocity.length() < 0.1;
      
      if (isStill) {
        if (settleTimeoutRef.current) {
          clearTimeout(settleTimeoutRef.current);
        }
        
        settleTimeoutRef.current = setTimeout(() => {
          if (!isSettled) {
            const value = calculateDiceValue(meshRef.current.rotation);
            setFinalValue(value);
            setIsSettled(true);
            onSettle(value, id);
          }
        }, 500); // Wait 500ms to ensure it's really settled
      } else {
        if (settleTimeoutRef.current) {
          clearTimeout(settleTimeoutRef.current);
          settleTimeoutRef.current = undefined;
        }
      }
    }
  });

  // Subscribe to physics updates
  useEffect(() => {
    if (rigidBodyRef.current) {
      // Simplified velocity tracking for demo purposes
      const interval = setInterval(() => {
        if (rigidBodyRef.current && meshRef.current) {
          // Get current velocity from rigid body
          const linvel = rigidBodyRef.current.linvel();
          const angvel = rigidBodyRef.current.angvel();
          
          velocityRef.current.set(linvel.x, linvel.y, linvel.z);
          angularVelocityRef.current.set(angvel.x, angvel.y, angvel.z);
        }
      }, 16); // ~60fps
      
      return () => clearInterval(interval);
    }
  }, []);

  const calculateDiceValue = (rotation: Euler): number => {
    // Calculate which face is pointing up based on rotation
    const { x, y, z } = rotation;
    
    // Normalize rotations to determine top face
    const faces = [
      { normal: [0, 1, 0], value: 1 },   // Top
      { normal: [0, -1, 0], value: 6 },  // Bottom
      { normal: [1, 0, 0], value: 3 },   // Right
      { normal: [-1, 0, 0], value: 4 },  // Left
      { normal: [0, 0, 1], value: 2 },   // Front
      { normal: [0, 0, -1], value: 5 }   // Back
    ];
    
    // Find which face normal is closest to pointing up (0, 1, 0)
    let closestFace = faces[0];
    let maxDot = -1;
    
    faces.forEach(face => {
      // Apply rotation to face normal
      const rotatedNormal = new Vector3(face.normal[0], face.normal[1], face.normal[2]);
      rotatedNormal.applyEuler(new Euler(x, y, z));
      
      // Calculate dot product with up vector
      const dot = rotatedNormal.dot(new Vector3(0, 1, 0));
      
      if (dot > maxDot) {
        maxDot = dot;
        closestFace = face;
      }
    });
    
    return closestFace.value;
  };

  const getDiceColor = () => {
    switch (theme) {
      case 'glass':
        return new Color(0.9, 0.95, 1.0);
      case 'neon':
        return new Color(0.0, 1.0, 0.8);
      case 'classic':
        return new Color(1.0, 1.0, 1.0);
      default:
        return new Color(1.0, 1.0, 1.0);
    }
  };

  const getEmissiveColor = () => {
    switch (theme) {
      case 'glass':
        return new Color(0.1, 0.2, 0.3);
      case 'neon':
        return new Color(0.0, 0.5, 0.4);
      case 'classic':
        return new Color(0.0, 0.0, 0.0);
      default:
        return new Color(0.0, 0.0, 0.0);
    }
  };

  return (
    <RigidBody 
      ref={rigidBodyRef} 
      colliders="cuboid"
      position={position}
      rotation={rotation}
      mass={1}
      restitution={0.6}
      friction={0.4}
    >
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial
          color={getDiceColor()}
          emissive={getEmissiveColor()}
          transparent={theme === 'glass'}
          opacity={theme === 'glass' ? 0.8 : 1.0}
          roughness={theme === 'glass' ? 0.1 : 0.3}
          metalness={theme === 'neon' ? 0.8 : 0.1}
          transmission={theme === 'glass' ? 0.9 : 0.0}
          thickness={theme === 'glass' ? 0.5 : 0.0}
        />
        
        {/* Dice dots/numbers */}
        {[1, 2, 3, 4, 5, 6].map((face, index) => (
          <DiceFace key={face} face={face} index={index} theme={theme} />
        ))}
        
        {/* Show final value when settled */}
        {isSettled && (
          <Text
            position={[0, 1.5, 0]}
            fontSize={0.5}
            color={theme === 'neon' ? '#00ffcc' : '#ffffff'}
            anchorX="center"
            anchorY="middle"
          >
            {finalValue}
          </Text>
        )}
      </mesh>
    </RigidBody>
  );
};

const DiceFace: React.FC<{ face: number; index: number; theme: string }> = ({ face, index, theme }) => {
  const positions = {
    1: [[0, 0, 0.51]], // Front face
    2: [[-0.3, 0.3, 0.51], [0.3, -0.3, 0.51]], // Front face
    3: [[-0.3, 0.3, 0.51], [0, 0, 0.51], [0.3, -0.3, 0.51]], // Front face
    4: [[-0.3, 0.3, 0.51], [0.3, 0.3, 0.51], [-0.3, -0.3, 0.51], [0.3, -0.3, 0.51]], // Front face
    5: [[-0.3, 0.3, 0.51], [0.3, 0.3, 0.51], [0, 0, 0.51], [-0.3, -0.3, 0.51], [0.3, -0.3, 0.51]], // Front face
    6: [[-0.3, 0.3, 0.51], [0.3, 0.3, 0.51], [-0.3, 0, 0.51], [0.3, 0, 0.51], [-0.3, -0.3, 0.51], [0.3, -0.3, 0.51]] // Front face
  };

  const faceRotations = [
    [0, 0, 0],           // Front (1)
    [0, Math.PI, 0],     // Back (6)
    [0, Math.PI/2, 0],   // Right (3)
    [0, -Math.PI/2, 0],  // Left (4)
    [-Math.PI/2, 0, 0],  // Top (2)
    [Math.PI/2, 0, 0]    // Bottom (5)
  ];

  const dotColor = theme === 'neon' ? '#00ffcc' : theme === 'glass' ? '#1a1a2e' : '#000000';

  return (
    <group rotation={[faceRotations[index][0], faceRotations[index][1], faceRotations[index][2]]}>
      {positions[face as keyof typeof positions].map((pos, dotIndex) => (
        <mesh key={dotIndex} position={[pos[0], pos[1], pos[2]]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color={dotColor} />
        </mesh>
      ))}
    </group>
  );
};

const DiceTable: React.FC = () => {
  return (
    <RigidBody 
      type="fixed" 
      colliders="cuboid"
      position={[0, -2, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      friction={0.7}
      restitution={0.3}
    >
      <mesh receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshPhysicalMaterial
          color="#1a1a2e"
          roughness={0.8}
          metalness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>
    </RigidBody>
  );
};

const DiceScene: React.FC<{
  diceCount: number;
  onRollComplete: (results: DiceGroupResult[]) => void;
  theme: 'glass' | 'neon' | 'classic';
  rollForce: number;
}> = ({ diceCount, onRollComplete, theme, rollForce }) => {
  const [settledDice, setSettledDice] = useState<Map<string, number>>(new Map());
  const { camera } = useThree();

  useEffect(() => {
    // Position camera for optimal viewing
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  const handleDiceSettle = useCallback((value: number, id: string) => {
    setSettledDice(prev => {
      const newMap = new Map(prev);
      newMap.set(id, value);
      
      // Check if all dice have settled
      if (newMap.size === diceCount) {
        const results: DiceResult[] = Array.from(newMap.entries()).map(([id, value]) => ({
          id,
          value,
          isSelected: false,
          isHeld: false
        }));
        
        const diceGroup: DiceGroupResult = {
          group: {
            type: 6,
            count: results.length,
            results: results.map(r => r.value),
            id: Date.now().toString()
          },
          timestamp: new Date(),
          playerId: 'player1',
          total: results.reduce((sum, r) => sum + r.value, 0)
        };
        
        setTimeout(() => {
          onRollComplete([diceGroup]);
        }, 1000); // Delay to show final values
      }
      
      return newMap;
    });
  }, [diceCount, onRollComplete, theme]);

  const generateDicePositions = (count: number): Array<[number, number, number]> => {
    const positions: Array<[number, number, number]> = [];
    const spacing = 1.5;
    const rows = Math.ceil(Math.sqrt(count));
    const cols = Math.ceil(count / rows);
    
    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      
      const x = (col - (cols - 1) / 2) * spacing;
      const z = (row - (rows - 1) / 2) * spacing;
      const y = 3 + Math.random() * 2; // Random height for more natural roll
      
      positions.push([x, y, z]);
    }
    
    return positions;
  };

  const generateDiceRotations = (count: number): Array<[number, number, number]> => {
    return Array(count).fill(0).map(() => [
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    ]);
  };

  const dicePositions = generateDicePositions(diceCount);
  const diceRotations = generateDiceRotations(diceCount);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 5, 0]} intensity={0.5} color={theme === 'neon' ? '#00ffcc' : '#ffffff'} />
      
      <DiceTable />
      
      {Array(diceCount).fill(0).map((_, index) => (
        <DiceGeometry
          key={`dice-${index}`}
          id={`dice-${index}`}
          position={dicePositions[index]}
          rotation={diceRotations[index]}
          onSettle={handleDiceSettle}
          theme={theme}
          rollForce={rollForce}
        />
      ))}
      
      <Environment preset="warehouse" />
      <ContactShadows
        position={[0, -1.99, 0]}
        opacity={0.5}
        scale={20}
        blur={2}
        far={2}
      />
      
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minDistance={3}
        maxDistance={15}
      />
    </>
  );
};

const DicePhysics3D: React.FC<DicePhysics3DProps> = ({
  isRolling,
  onRollComplete,
  diceCount = 2,
  className = '',
  theme = 'glass',
  enablePhysics = true,
  rollForce = 10
}) => {
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    if (isRolling) {
      setShowCanvas(true);
      setIsSceneReady(false);
      
      // Small delay to ensure canvas is mounted
      setTimeout(() => {
        setIsSceneReady(true);
      }, 100);
    }
  }, [isRolling]);

  const handleRollComplete = useCallback((results: DiceGroupResult[]) => {
    onRollComplete(results);
    
    // Hide canvas after showing results
    setTimeout(() => {
      setShowCanvas(false);
      setIsSceneReady(false);
    }, 2000);
  }, [onRollComplete]);

  if (!enablePhysics || !showCanvas) {
    return null;
  }

  return (
    <motion.div
      className={`fixed inset-0 z-50 bg-black/80 backdrop-blur-sm ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-full h-full">
        <Canvas
          shadows
          camera={{ position: [5, 5, 5], fov: 60 }}
          className="w-full h-full"
        >
          <Physics gravity={[0, -20, 0]} debug={false}>
            {isSceneReady && (
              <DiceScene
                diceCount={diceCount}
                onRollComplete={handleRollComplete}
                theme={theme}
                rollForce={rollForce}
              />
            )}
          </Physics>
        </Canvas>
        
        {/* UI Overlay */}
        <div className="absolute top-4 left-4 text-white">
          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-2">Rolling Dice...</h3>
            <p className="text-sm opacity-80">Physics simulation in progress</p>
            <div className="mt-2 flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-xs">3D Physics Active</span>
            </div>
          </motion.div>
        </div>
        
        {/* Controls */}
        <div className="absolute bottom-4 right-4 text-white">
          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-xs opacity-80 mb-1">Controls:</p>
            <p className="text-xs">🖱️ Drag to rotate view</p>
            <p className="text-xs">🔍 Scroll to zoom</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default DicePhysics3D;

// Hook for managing 3D dice rolls
export const useDicePhysics3D = () => {
  const [isRolling, setIsRolling] = useState(false);
  const [results, setResults] = useState<DiceGroupResult[]>([]);
  const [settings, setSettings] = useState({
    theme: 'glass' as const,
    enablePhysics: true,
    rollForce: 10,
    diceCount: 2
  });

  const rollDice = useCallback((count: number = 2) => {
    setSettings(prev => ({ ...prev, diceCount: count }));
    setIsRolling(true);
    setResults([]);
  }, []);

  const handleRollComplete = useCallback((newResults: DiceGroupResult[]) => {
    setResults(newResults);
    setIsRolling(false);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<typeof settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return {
    isRolling,
    results,
    settings,
    rollDice,
    handleRollComplete,
    updateSettings
  };
};