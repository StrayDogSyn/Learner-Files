import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

interface GameStateConfig {
  enableAutoSave: boolean;
  autoSaveInterval: number; // milliseconds
  enableVersioning: boolean;
  maxVersions: number;
  enableCompression: boolean;
  enableEncryption: boolean;
}

interface GameStateVersion {
  id: string;
  timestamp: Date;
  data: any;
  checksum?: string;
  version: number;
}

interface GameStateMetadata {
  gameId: string;
  lastSaved: Date;
  lastLoaded: Date;
  saveCount: number;
  currentVersion: number;
  totalVersions: number;
}

const defaultConfig: GameStateConfig = {
  enableAutoSave: true,
  autoSaveInterval: 30000, // 30 seconds
  enableVersioning: false,
  maxVersions: 5,
  enableCompression: false,
  enableEncryption: false
};

export const useGameState = <T = any>(
  gameId: string,
  enabled: boolean = true,
  config: Partial<GameStateConfig> = {}
) => {
  const finalConfig = { ...defaultConfig, ...config };
  const [gameState, setGameState] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [lastLoaded, setLastLoaded] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);
  const pendingSave = useRef<boolean>(false);
  const gameStore = useGameStore();

  // Generate storage key
  const getStorageKey = useCallback((suffix: string = '') => {
    return `gameState_${gameId}${suffix ? `_${suffix}` : ''}`;
  }, [gameId]);

  // Generate checksum for data integrity
  const generateChecksum = useCallback((data: any): string => {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }, []);

  // Compress data (simple base64 encoding for now)
  const compressData = useCallback((data: any): string => {
    if (!finalConfig.enableCompression) {
      return JSON.stringify(data);
    }
    
    try {
      const jsonStr = JSON.stringify(data);
      return btoa(jsonStr);
    } catch (error) {
      console.warn('Failed to compress data, using uncompressed:', error);
      return JSON.stringify(data);
    }
  }, [finalConfig.enableCompression]);

  // Decompress data
  const decompressData = useCallback((compressedData: string): any => {
    if (!finalConfig.enableCompression) {
      return JSON.parse(compressedData);
    }
    
    try {
      const jsonStr = atob(compressedData);
      return JSON.parse(jsonStr);
    } catch (error) {
      console.warn('Failed to decompress data, trying as uncompressed:', error);
      return JSON.parse(compressedData);
    }
  }, [finalConfig.enableCompression]);

  // Simple encryption (XOR with key - not secure, just obfuscation)
  const encryptData = useCallback((data: string): string => {
    if (!finalConfig.enableEncryption) {
      return data;
    }
    
    const key = gameId;
    let encrypted = '';
    for (let i = 0; i < data.length; i++) {
      encrypted += String.fromCharCode(
        data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return btoa(encrypted);
  }, [gameId, finalConfig.enableEncryption]);

  // Simple decryption
  const decryptData = useCallback((encryptedData: string): string => {
    if (!finalConfig.enableEncryption) {
      return encryptedData;
    }
    
    try {
      const key = gameId;
      const encrypted = atob(encryptedData);
      let decrypted = '';
      for (let i = 0; i < encrypted.length; i++) {
        decrypted += String.fromCharCode(
          encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
      }
      return decrypted;
    } catch (error) {
      console.warn('Failed to decrypt data, trying as unencrypted:', error);
      return encryptedData;
    }
  }, [gameId, finalConfig.enableEncryption]);

  // Load game state
  const loadGameState = useCallback(async (versionId?: string): Promise<T | null> => {
    if (!enabled) return null;
    
    setIsLoading(true);
    setLoadError(null);
    
    try {
      let storageKey = getStorageKey();
      
      // If loading specific version
      if (versionId && finalConfig.enableVersioning) {
        storageKey = getStorageKey(`version_${versionId}`);
      }
      
      const savedData = localStorage.getItem(storageKey);
      if (!savedData) {
        setIsLoading(false);
        return null;
      }
      
      // Decrypt and decompress
      const decryptedData = decryptData(savedData);
      const decompressedData = decompressData(decryptedData);
      
      // Verify checksum if available
      if (decompressedData.checksum) {
        const calculatedChecksum = generateChecksum(decompressedData.data);
        if (calculatedChecksum !== decompressedData.checksum) {
          throw new Error('Data integrity check failed');
        }
      }
      
      const loadedState = decompressedData.data || decompressedData;
      setGameState(loadedState);
      setLastLoaded(new Date());
      
      // Update metadata
      const metadata = getMetadata();
      saveMetadata({
        ...metadata,
        lastLoaded: new Date()
      });
      
      // Store updated - no action needed
      
      setIsLoading(false);
      return loadedState;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load game state';
      setLoadError(errorMessage);
      setIsLoading(false);
      console.error('Failed to load game state:', error);
      return null;
    }
  }, [enabled, gameId, getStorageKey, finalConfig.enableVersioning, decryptData, decompressData, generateChecksum]);

  // Save game state
  const saveGameState = useCallback(async (state: T, createVersion: boolean = false): Promise<boolean> => {
    if (!enabled || !state) return false;
    
    setIsSaving(true);
    setSaveError(null);
    
    try {
      const checksum = generateChecksum(state);
      const dataToSave = {
        data: state,
        checksum,
        timestamp: new Date().toISOString(),
        version: finalConfig.enableVersioning ? Date.now() : 1
      };
      
      // Compress and encrypt
      const compressedData = compressData(dataToSave);
      const encryptedData = encryptData(compressedData);
      
      // Save main state
      const mainKey = getStorageKey();
      localStorage.setItem(mainKey, encryptedData);
      
      // Save version if enabled
      if (finalConfig.enableVersioning && createVersion) {
        const versionKey = getStorageKey(`version_${dataToSave.version}`);
        localStorage.setItem(versionKey, encryptedData);
        
        // Clean up old versions
        cleanupOldVersions();
      }
      
      setGameState(state);
      setLastSaved(new Date());
      
      // Update metadata
      const metadata = getMetadata();
      saveMetadata({
        ...metadata,
        lastSaved: new Date(),
        saveCount: metadata.saveCount + 1,
        currentVersion: dataToSave.version
      });
      
      // Store updated - no action needed
      
      setIsSaving(false);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save game state';
      setSaveError(errorMessage);
      setIsSaving(false);
      console.error('Failed to save game state:', error);
      return false;
    }
  }, [enabled, generateChecksum, finalConfig.enableVersioning, compressData, encryptData, getStorageKey, gameId]);

  // Auto-save functionality
  const scheduleAutoSave = useCallback(() => {
    if (!finalConfig.enableAutoSave || !gameState) return;
    
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }
    
    autoSaveTimer.current = setTimeout(() => {
      if (pendingSave.current && gameState) {
        saveGameState(gameState);
        pendingSave.current = false;
      }
    }, finalConfig.autoSaveInterval);
  }, [finalConfig.enableAutoSave, finalConfig.autoSaveInterval, gameState, saveGameState]);

  // Update game state with auto-save
  const updateState = useCallback((newState: T | ((prevState: T | null) => T)) => {
    const updatedState = typeof newState === 'function' 
      ? (newState as (prevState: T | null) => T)(gameState)
      : newState;
    
    setGameState(updatedState);
    
    if (finalConfig.enableAutoSave) {
      pendingSave.current = true;
      scheduleAutoSave();
    }
  }, [gameState, finalConfig.enableAutoSave, scheduleAutoSave]);

  // Get metadata
  const getMetadata = useCallback((): GameStateMetadata => {
    try {
      const metadataKey = getStorageKey('metadata');
      const savedMetadata = localStorage.getItem(metadataKey);
      
      if (savedMetadata) {
        return JSON.parse(savedMetadata);
      }
    } catch (error) {
      console.warn('Failed to load metadata:', error);
    }
    
    return {
      gameId,
      lastSaved: new Date(),
      lastLoaded: new Date(),
      saveCount: 0,
      currentVersion: 1,
      totalVersions: 0
    };
  }, [gameId, getStorageKey]);

  // Save metadata
  const saveMetadata = useCallback((metadata: GameStateMetadata) => {
    try {
      const metadataKey = getStorageKey('metadata');
      localStorage.setItem(metadataKey, JSON.stringify(metadata));
    } catch (error) {
      console.warn('Failed to save metadata:', error);
    }
  }, [getStorageKey]);

  // Get available versions
  const getAvailableVersions = useCallback((): GameStateVersion[] => {
    if (!finalConfig.enableVersioning) return [];
    
    const versions: GameStateVersion[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(getStorageKey('version_'))) {
        try {
          const versionId = key.replace(getStorageKey('version_'), '');
          const data = localStorage.getItem(key);
          
          if (data) {
            const decryptedData = decryptData(data);
            const decompressedData = decompressData(decryptedData);
            
            versions.push({
              id: versionId,
              timestamp: new Date(decompressedData.timestamp),
              data: decompressedData.data,
              checksum: decompressedData.checksum,
              version: decompressedData.version
            });
          }
        } catch (error) {
          console.warn('Failed to parse version:', key, error);
        }
      }
    }
    
    return versions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [finalConfig.enableVersioning, getStorageKey, decryptData, decompressData]);

  // Clean up old versions
  const cleanupOldVersions = useCallback(() => {
    if (!finalConfig.enableVersioning) return;
    
    const versions = getAvailableVersions();
    
    if (versions.length > finalConfig.maxVersions) {
      const versionsToDelete = versions.slice(finalConfig.maxVersions);
      
      versionsToDelete.forEach(version => {
        const versionKey = getStorageKey(`version_${version.id}`);
        localStorage.removeItem(versionKey);
      });
    }
  }, [finalConfig.enableVersioning, finalConfig.maxVersions, getAvailableVersions, getStorageKey]);

  // Delete game state
  const deleteGameState = useCallback((includeVersions: boolean = false) => {
    try {
      // Delete main state
      const mainKey = getStorageKey();
      localStorage.removeItem(mainKey);
      
      // Delete metadata
      const metadataKey = getStorageKey('metadata');
      localStorage.removeItem(metadataKey);
      
      // Delete versions if requested
      if (includeVersions && finalConfig.enableVersioning) {
        const versions = getAvailableVersions();
        versions.forEach(version => {
          const versionKey = getStorageKey(`version_${version.id}`);
          localStorage.removeItem(versionKey);
        });
      }
      
      setGameState(null);
      setLastSaved(null);
      setLastLoaded(null);
      
      return true;
    } catch (error) {
      console.error('Failed to delete game state:', error);
      return false;
    }
  }, [getStorageKey, finalConfig.enableVersioning, getAvailableVersions]);

  // Export game state
  const exportGameState = useCallback((includeVersions: boolean = false) => {
    try {
      const exportData: any = {
        gameId,
        currentState: gameState,
        metadata: getMetadata(),
        exportedAt: new Date().toISOString()
      };
      
      if (includeVersions && finalConfig.enableVersioning) {
        exportData.versions = getAvailableVersions();
      }
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${gameId}_save_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Failed to export game state:', error);
      return false;
    }
  }, [gameId, gameState, getMetadata, finalConfig.enableVersioning, getAvailableVersions]);

  // Import game state
  const importGameState = useCallback((file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const importData = JSON.parse(e.target?.result as string);
          
          if (importData.gameId !== gameId) {
            console.warn('Game ID mismatch in import file');
          }
          
          if (importData.currentState) {
            const success = await saveGameState(importData.currentState, true);
            resolve(success);
          } else {
            resolve(false);
          }
        } catch (error) {
          console.error('Failed to import game state:', error);
          resolve(false);
        }
      };
      
      reader.onerror = () => {
        console.error('Failed to read import file');
        resolve(false);
      };
      
      reader.readAsText(file);
    });
  }, [gameId, saveGameState]);

  // Load state on mount
  useEffect(() => {
    if (enabled) {
      loadGameState();
    }
  }, [enabled, loadGameState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
      
      // Final save if there's pending data
      if (pendingSave.current && gameState && enabled) {
        saveGameState(gameState);
      }
    };
  }, [gameState, enabled, saveGameState]);

  return {
    // State
    gameState,
    isLoading,
    isSaving,
    lastSaved,
    lastLoaded,
    saveError,
    loadError,
    
    // Actions
    updateState,
    saveGameState,
    loadGameState,
    deleteGameState,
    
    // Versioning
    getAvailableVersions,
    cleanupOldVersions,
    
    // Import/Export
    exportGameState,
    importGameState,
    
    // Metadata
    getMetadata,
    
    // Config
    config: finalConfig,
    enabled
  };
};

export type { GameStateConfig, GameStateVersion, GameStateMetadata };