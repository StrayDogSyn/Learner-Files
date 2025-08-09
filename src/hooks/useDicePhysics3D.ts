import { useState, useCallback, useRef } from 'react';

interface DicePhysics3DSettings {
  gravity: number;
  restitution: number;
  friction: number;
  angularDamping: number;
  linearDamping: number;
  diceSize: number;
  tableHeight: number;
  cameraPosition: [number, number, number];
  lightIntensity: number;
  shadowQuality: 'low' | 'medium' | 'high';
  particleEffects: boolean;
  soundEffects: boolean;
  animationSpeed: number;
}

interface DiceRollResult {
  id: string;
  value: number;
  position: [number, number, number];
  rotation: [number, number, number];
  timestamp: number;
  rollDuration: number;
}

interface UseDicePhysics3DReturn {
  isEnabled: boolean;
  settings: DicePhysics3DSettings;
  isRolling: boolean;
  lastRollResults: DiceRollResult[];
  rollDice: (count: number, diceType: number) => Promise<DiceRollResult[]>;
  updateSettings: (newSettings: Partial<DicePhysics3DSettings>) => void;
  toggleEnabled: () => void;
  resetScene: () => void;
  captureScreenshot: () => string | null;
}

export const useDicePhysics3D = (): UseDicePhysics3DReturn => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [lastRollResults, setLastRollResults] = useState<DiceRollResult[]>([]);
  const rollIdRef = useRef<number>(0);

  const [settings, setSettings] = useState<DicePhysics3DSettings>({
    gravity: -9.81,
    restitution: 0.6,
    friction: 0.4,
    angularDamping: 0.1,
    linearDamping: 0.05,
    diceSize: 1,
    tableHeight: 0,
    cameraPosition: [0, 8, 12],
    lightIntensity: 1.2,
    shadowQuality: 'medium',
    particleEffects: true,
    soundEffects: true,
    animationSpeed: 1.0
  });

  const rollDice = useCallback(async (count: number, diceType: number): Promise<DiceRollResult[]> => {
    if (isRolling || !isEnabled) {
      return [];
    }

    setIsRolling(true);
    const rollStartTime = Date.now();
    
    try {
      // Simulate physics calculation time
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const results: DiceRollResult[] = [];
      
      for (let i = 0; i < count; i++) {
        const rollId = `roll_${rollIdRef.current++}_${i}`;
        const value = Math.floor(Math.random() * diceType) + 1;
        
        // Generate realistic final positions
        const position: [number, number, number] = [
          (Math.random() - 0.5) * 8, // X: -4 to 4
          settings.diceSize / 2, // Y: resting on table
          (Math.random() - 0.5) * 6  // Z: -3 to 3
        ];
        
        // Generate final rotation based on dice value
        const rotation: [number, number, number] = [
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        ];
        
        results.push({
          id: rollId,
          value,
          position,
          rotation,
          timestamp: Date.now(),
          rollDuration: Date.now() - rollStartTime
        });
      }
      
      setLastRollResults(results);
      return results;
      
    } catch (error) {
      console.error('Error during 3D dice roll:', error);
      return [];
    } finally {
      setIsRolling(false);
    }
  }, [isRolling, isEnabled, settings.diceSize]);

  const updateSettings = useCallback((newSettings: Partial<DicePhysics3DSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const toggleEnabled = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  const resetScene = useCallback(() => {
    setLastRollResults([]);
    setIsRolling(false);
  }, []);

  const captureScreenshot = useCallback((): string | null => {
    if (!isEnabled) {
      return null;
    }
    
    try {
      // In a real implementation, this would capture the Three.js canvas
      // For now, we'll return a placeholder
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Create a simple placeholder image
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, 800, 600);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('3D Dice Physics Screenshot', 400, 300);
        
        return canvas.toDataURL('image/png');
      }
    } catch (error) {
      console.error('Error capturing screenshot:', error);
    }
    
    return null;
  }, [isEnabled]);

  return {
    isEnabled,
    settings,
    isRolling,
    lastRollResults,
    rollDice,
    updateSettings,
    toggleEnabled,
    resetScene,
    captureScreenshot
  };
};

export default useDicePhysics3D;