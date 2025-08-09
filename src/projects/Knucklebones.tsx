import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './Knucklebones.css';
import { PerformanceOverlay } from '../components/portfolio/PerformanceOverlay';
import { CaseStudyCard } from '../components/portfolio/CaseStudyCard';
import { FeedbackCollector } from '../components/portfolio/FeedbackCollector';
import { TechnicalChallenge } from '../components/portfolio/TechnicalChallenge';
import { usePerformanceMetrics } from '../hooks/usePerformanceMetrics';
import { getProjectMetrics } from '../data/projectMetrics';
import { getArchitectureById } from '../data/architectureDiagrams';

interface DiceGroup {
  type: number;
  count: number;
}

interface DiceGroupResult {
  type: number;
  count: number;
  results: number[];
  total: number;
}

interface SavedPool {
  name: string;
  dicePool: DiceGroup[];
  timestamp: string;
}

interface RollRecord {
  summary: string;
  total: number;
  results: number[];
  timestamp: string;
}

interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'danger';
}

const Knucklebones: React.FC = () => {
  const [selectedDiceType, setSelectedDiceType] = useState<number>(4);
  const [selectedDiceCount, setSelectedDiceCount] = useState<number>(1);
  const [dicePool, setDicePool] = useState<DiceGroup[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => 
    localStorage.getItem('kbDarkMode') === 'true'
  );
  const [isDiceSoundEnabled, setIsDiceSoundEnabled] = useState<boolean>(() => 
    localStorage.getItem('kbDiceSound') !== 'false'
  );
  const [rollHistory, setRollHistory] = useState<RollRecord[]>(() => 
    JSON.parse(localStorage.getItem('kbRollHistory') || '[]')
  );
  const [rollResults, setRollResults] = useState<DiceGroupResult[][]>([]);
  const [rollStats, setRollStats] = useState({
    total: 0,
    average: 0,
    highest: 0,
    lowest: 0
  });
  const [showSavedPools, setShowSavedPools] = useState<boolean>(false);
  const [showRollHistory, setShowRollHistory] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  
  // Performance tracking
  const { metrics, startTracking, stopTracking } = usePerformanceMetrics({
    trackingInterval: 1000,
    enableMemoryTracking: true,
    enableUserInteractionTracking: true
  });
  
  // Project data
  const projectData = getProjectMetrics('knucklebones');
  const architectureData = getArchitectureById('knucklebones');

  // Dice rolling functions
  const rollDice = useCallback((sides: number): number => {
    return Math.floor(Math.random() * sides) + 1;
  }, []);

  const roll3 = useCallback(() => rollDice(3), [rollDice]);
  const roll4 = useCallback(() => rollDice(4), [rollDice]);
  const roll6 = useCallback(() => rollDice(6), [rollDice]);
  const roll8 = useCallback(() => rollDice(8), [rollDice]);
  const roll10 = useCallback(() => rollDice(10), [rollDice]);
  const roll12 = useCallback(() => rollDice(12), [rollDice]);
  const roll20 = useCallback(() => rollDice(20), [rollDice]);
  const roll100 = useCallback(() => rollDice(100), [rollDice]);

  const getRollFunction = useCallback((type: number) => {
    switch (type) {
      case 3: return roll3;
      case 4: return roll4;
      case 6: return roll6;
      case 8: return roll8;
      case 10: return roll10;
      case 12: return roll12;
      case 20: return roll20;
      case 100: return roll100;
      default: return roll6;
    }
  }, [roll3, roll4, roll6, roll8, roll10, roll12, roll20, roll100]);

  useEffect(() => {
    startTracking();
    return () => stopTracking();
  }, [startTracking, stopTracking]);
  
  // Apply dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    return () => {
      document.body.classList.remove('dark-mode');
    };
  }, [isDarkMode]);

  // Toast notification system
  const showNotification = useCallback((message: string, type: ToastNotification['type'] = 'info') => {
    const id = Date.now().toString();
    const newToast: ToastNotification = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  }, []);

  // Add dice to pool
  const addDiceToPool = useCallback((diceType: number, diceCount: number, clearFirst = false) => {
    setDicePool(prev => {
      let newPool = clearFirst ? [] : [...prev];
      
      const existingIndex = newPool.findIndex(dice => dice.type === diceType);
      
      if (existingIndex !== -1) {
        newPool[existingIndex].count += diceCount;
      } else {
        newPool.push({ type: diceType, count: diceCount });
      }
      
      return newPool;
    });
  }, []);

  // Remove dice from pool
  const removeDiceFromPool = useCallback((index: number) => {
    setDicePool(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Play dice sound
  const playDiceSound = useCallback(() => {
    if (!isDiceSoundEnabled) return;
    
    const audio = new Audio('https://cdn.freesound.org/previews/220/220156_4100837-lq.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => {
      console.log("Couldn't play dice sound: ", e);
    });
  }, [isDiceSoundEnabled]);

  // Roll dice groups
  const rollDiceGroups = useCallback((diceGroups: DiceGroup[]) => {
    playDiceSound();
    
    const allResults: number[] = [];
    
    const diceGroupResults: DiceGroupResult[] = diceGroups.map(group => {
      const { type, count } = group;
      const results: number[] = [];
      const rollFunction = getRollFunction(type);
      
      for (let i = 0; i < count; i++) {
        const roll = rollFunction();
        results.push(roll);
        allResults.push(roll);
      }
      
      return {
        type,
        count,
        results,
        total: results.reduce((sum, val) => sum + val, 0)
      };
    });
    
    // Update results
    setRollResults(prev => [diceGroupResults, ...prev.slice(0, 9)]);
    
    // Update statistics
    if (allResults.length > 0) {
      const total = allResults.reduce((sum, val) => sum + val, 0);
      const average = total / allResults.length;
      const highest = Math.max(...allResults);
      const lowest = Math.min(...allResults);
      
      setRollStats({ total, average, highest, lowest });
    }
    
    // Add to roll history
    const rollSummary = diceGroupResults.map(group => `${group.count}d${group.type}`).join(' + ');
    const total = allResults.reduce((sum, val) => sum + val, 0);
    
    const newRecord: RollRecord = {
      summary: rollSummary,
      total,
      results: allResults,
      timestamp: new Date().toISOString()
    };
    
    setRollHistory(prev => {
      const newHistory = [newRecord, ...prev.slice(0, 99)];
      localStorage.setItem('kbRollHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  }, [playDiceSound, getRollFunction]);

  // Handle roll button click
  const handleRoll = useCallback(() => {
    if (dicePool.length === 0) {
      rollDiceGroups([{ type: selectedDiceType, count: selectedDiceCount }]);
    } else {
      rollDiceGroups(dicePool);
    }
  }, [dicePool, selectedDiceType, selectedDiceCount, rollDiceGroups]);

  // Quick combinations
  const handleQuickCombination = useCallback((combination: string) => {
    let newPool: DiceGroup[] = [];
    
    switch (combination) {
      case 'attack':
        newPool = [{ type: 20, count: 1 }];
        break;
      case 'damage-s':
        newPool = [{ type: 6, count: 1 }];
        break;
      case 'damage-m':
        newPool = [{ type: 8, count: 2 }];
        break;
      case 'damage-l':
        newPool = [{ type: 10, count: 3 }];
        break;
      case 'ability':
        newPool = [{ type: 6, count: 4 }];
        break;
    }
    
    setDicePool(newPool);
    rollDiceGroups(newPool);
  }, [rollDiceGroups]);

  // Save current dice pool
  const saveCurrentPool = useCallback(() => {
    if (dicePool.length === 0) {
      showNotification('No dice in your pool to save', 'warning');
      return;
    }
    
    const poolName = prompt('Enter a name for this dice pool:');
    if (!poolName) return;
    
    const savedPools: SavedPool[] = JSON.parse(localStorage.getItem('kbSavedPools') || '[]');
    
    savedPools.push({
      name: poolName,
      dicePool: dicePool,
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem('kbSavedPools', JSON.stringify(savedPools));
    showNotification(`Dice pool "${poolName}" saved successfully`, 'success');
  }, [dicePool, showNotification]);

  // Load saved pool
  const loadSavedPool = useCallback((pool: SavedPool) => {
    setDicePool([...pool.dicePool]);
    setShowSavedPools(false);
    showNotification(`Loaded dice pool: "${pool.name}"`, 'success');
  }, [showNotification]);

  // Delete saved pool
  const deleteSavedPool = useCallback((index: number) => {
    const savedPools: SavedPool[] = JSON.parse(localStorage.getItem('kbSavedPools') || '[]');
    const poolName = savedPools[index].name;
    
    if (confirm(`Delete saved pool "${poolName}"?`)) {
      savedPools.splice(index, 1);
      localStorage.setItem('kbSavedPools', JSON.stringify(savedPools));
      showNotification(`Deleted dice pool: "${poolName}"`, 'info');
    }
  }, [showNotification]);

  // Clear results
  const clearResults = useCallback(() => {
    setRollResults([]);
    setRollStats({ total: 0, average: 0, highest: 0, lowest: 0 });
  }, []);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('kbDarkMode', newDarkMode.toString());
    showNotification(`${newDarkMode ? 'Dark' : 'Light'} mode enabled`, 'info');
  }, [isDarkMode, showNotification]);

  // Toggle dice sound
  const toggleDiceSound = useCallback(() => {
    const newSoundEnabled = !isDiceSoundEnabled;
    setIsDiceSoundEnabled(newSoundEnabled);
    localStorage.setItem('kbDiceSound', newSoundEnabled.toString());
    showNotification(`Dice sounds ${newSoundEnabled ? 'enabled' : 'disabled'}`, 'info');
  }, [isDiceSoundEnabled, showNotification]);

  // Clear saved data
  const clearSavedData = useCallback(() => {
    if (confirm('Are you sure you want to clear all saved data? This action cannot be undone.')) {
      localStorage.removeItem('kbSavedPools');
      localStorage.removeItem('kbRollHistory');
      setRollHistory([]);
      showNotification('All saved data has been cleared', 'success');
    }
  }, [showNotification]);

  // Get dice icon class
  const getDiceIconClass = useCallback((dieType: number): string => {
    switch (dieType) {
      case 3: return 'fa-dice-three';
      case 4: return 'fa-dice-d4';
      case 6: return 'fa-dice-d6';
      case 8: return 'fa-dice-d8';
      case 10: return 'fa-dice-d10';
      case 12: return 'fa-dice-d12';
      case 20: return 'fa-dice-d20';
      case 100: return 'fa-percentage';
      default: return 'fa-dice';
    }
  }, []);

  const savedPools: SavedPool[] = JSON.parse(localStorage.getItem('kbSavedPools') || '[]');

  return (
    <div className="knucklebones-container">
      <PerformanceOverlay metrics={metrics} />
      <FeedbackCollector projectName="Knucklebones" />
      
      {/* Case Study Card */}
      {projectData && (
        <div className="container-fluid mt-4 mb-4">
          <CaseStudyCard 
            project={projectData}
            className="mb-4"
          />
        </div>
      )}
      
      {/* Technical Challenge Component */}
      {architectureData && (
        <div className="container-fluid mb-4">
          <TechnicalChallenge 
            architecture={architectureData}
            className="mb-4"
          />
        </div>
      )}
      
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark background">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <i className="fas fa-dice me-2"></i>
            Knucklebones Dice Simulator
          </Link>
          
          <div className="navbar-nav ms-auto">
            <div className="dropdown">
              <button 
                className="btn btn-outline-light dropdown-toggle" 
                type="button" 
                data-bs-toggle="dropdown"
              >
                <i className="fas fa-cog me-2"></i>
                Game Options
              </button>
              <ul className="dropdown-menu dropdown-menu-end background">
                <li>
                  <button className="dropdown-item" onClick={saveCurrentPool}>
                    <i className="fas fa-save me-2"></i>
                    Save Current Pool
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => setShowSavedPools(true)}>
                    <i className="fas fa-folder-open me-2"></i>
                    Load Saved Pools
                  </button>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item" onClick={toggleDarkMode}>
                    <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} me-2`}></i>
                    Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={toggleDiceSound}>
                    <i className={`fas ${isDiceSoundEnabled ? 'fa-volume-up' : 'fa-volume-mute'} me-2`}></i>
                    Toggle Dice Sound
                  </button>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item" onClick={() => setShowRollHistory(true)}>
                    <i className="fas fa-history me-2"></i>
                    Show Roll History
                  </button>
                </li>
                <li>
                  <button className="dropdown-item text-danger" onClick={clearSavedData}>
                    <i className="fas fa-trash me-2"></i>
                    Clear Saved Data
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <div className="container-fluid mt-4">
        <div className="row">
          {/* Left Panel - Dice Controls */}
          <div className="col-lg-8">
            <div className="card background box-shadow">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-dice me-2"></i>
                  Dice Selection
                </h5>
              </div>
              <div className="card-body">
                {/* Dice Type Selection */}
                <div className="modern-dice-controls">
                  <h6>Select Dice Type:</h6>
                  <div className="dice-type-container">
                    {[3, 4, 6, 8, 10, 12, 20, 100].map(type => (
                      <button
                        key={type}
                        className={`dice-type-btn ${selectedDiceType === type ? 'active' : ''}`}
                        onClick={() => setSelectedDiceType(type)}
                      >
                        <i className={`fas ${getDiceIconClass(type)}`}></i>
                        <span>d{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dice Count */}
                <div className="modern-dice-controls mt-3">
                  <h6>Number of Dice:</h6>
                  <div className="d-flex align-items-center gap-3">
                    <input
                      type="range"
                      className="form-range flex-grow-1"
                      min="1"
                      max="20"
                      value={selectedDiceCount}
                      onChange={(e) => setSelectedDiceCount(parseInt(e.target.value))}
                    />
                    <div className="dice-count-display">{selectedDiceCount}</div>
                  </div>
                  <div className="dice-preview mt-2">
                    Rolling: {selectedDiceCount}d{selectedDiceType}
                  </div>
                </div>

                {/* Add to Pool Button */}
                <div className="mt-3">
                  <button 
                    className="btn btn-primary"
                    onClick={() => addDiceToPool(selectedDiceType, selectedDiceCount)}
                  >
                    <i className="fas fa-plus me-2"></i>
                    Add to Pool
                  </button>
                </div>

                {/* Selected Dice Pool */}
                <div className="mt-4">
                  <h6>Selected Dice Pool:</h6>
                  <div className="selected-dice-pool">
                    {dicePool.length === 0 ? (
                      <p className="text-center text-muted mb-0">Add dice to your pool using the buttons above</p>
                    ) : (
                      dicePool.map((dice, index) => (
                        <div key={index} className="dice-pool-item">
                          <i className={`dice-pool-icon fas ${getDiceIconClass(dice.type)}`}></i>
                          <span className="dice-pool-count">{dice.count}</span>
                          <span>d{dice.type}</span>
                          <button 
                            className="remove-dice"
                            onClick={() => removeDiceFromPool(index)}
                            title="Remove these dice"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Quick Combinations */}
                <div className="mt-4">
                  <h6>Quick Combinations:</h6>
                  <div className="combinations-container">
                    <button 
                      className="combination-btn"
                      onClick={() => handleQuickCombination('attack')}
                    >
                      Attack (1d20)
                    </button>
                    <button 
                      className="combination-btn"
                      onClick={() => handleQuickCombination('damage-s')}
                    >
                      Small Damage (1d6)
                    </button>
                    <button 
                      className="combination-btn"
                      onClick={() => handleQuickCombination('damage-m')}
                    >
                      Medium Damage (2d8)
                    </button>
                    <button 
                      className="combination-btn"
                      onClick={() => handleQuickCombination('damage-l')}
                    >
                      Large Damage (3d10)
                    </button>
                    <button 
                      className="combination-btn"
                      onClick={() => handleQuickCombination('ability')}
                    >
                      Ability Check (4d6)
                    </button>
                  </div>
                </div>

                {/* Roll Button */}
                <div className="text-center mt-4">
                  <button className="btn btn-success btn-lg me-3" onClick={handleRoll}>
                    <i className="fas fa-dice me-2"></i>
                    Roll Dice
                  </button>
                  <button className="btn btn-secondary" onClick={clearResults}>
                    <i className="fas fa-trash me-2"></i>
                    Clear Results
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="col-lg-4">
            <div className="card background box-shadow">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-chart-bar me-2"></i>
                  Roll Results
                </h5>
              </div>
              <div className="card-body">
                {/* Statistics */}
                <div className="roll-stats">
                  <div className="row text-center">
                    <div className="col-6">
                      <div className="stat-item">
                        <div className="stat-value" id="rollTotal">{rollStats.total}</div>
                        <div className="stat-label">Total</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="stat-item">
                        <div className="stat-value" id="rollAverage">{rollStats.average.toFixed(1)}</div>
                        <div className="stat-label">Average</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="stat-item">
                        <div className="stat-value" id="rollHighest">{rollStats.highest}</div>
                        <div className="stat-label">Highest</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="stat-item">
                        <div className="stat-value" id="rollLowest">{rollStats.lowest}</div>
                        <div className="stat-label">Lowest</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results Container */}
                <div className="roll-results-container mt-3">
                  {rollResults.length === 0 ? (
                    <div className="empty-results-message text-center py-5">
                      <i className="fas fa-dice fa-3x mb-3"></i>
                      <p>Your dice results will appear here</p>
                    </div>
                  ) : (
                    rollResults.map((result, index) => {
                      const grandTotal = result.reduce((sum, group) => sum + group.total, 0);
                      const rollSummary = result.map(group => `${group.count}d${group.type}`).join(' + ');
                      
                      return (
                        <div key={index} className="multi-roll-result">
                          <div className="multi-roll-header">
                            <strong>{rollSummary}</strong>
                            <span>Total: {grandTotal}</span>
                          </div>
                          <div className="multi-roll-body">
                            {result.map((group, groupIndex) => {
                              const displaySuffix = group.type === 100 ? '%' : '';
                              
                              return (
                                <div key={groupIndex} className="dice-group">
                                  <div className="dice-group-header">
                                    <i className={`dice-group-icon fas ${getDiceIconClass(group.type)}`}></i>
                                    <strong>{group.count}d{group.type}</strong>
                                    <span className="ms-auto">Group Total: {group.total}</span>
                                  </div>
                                  <div className="roll-dice-values">
                                    {group.results.map((result, resultIndex) => (
                                      <div key={resultIndex} className="dice-value dice-pop">
                                        {result}{displaySuffix}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Pools Modal */}
      {showSavedPools && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-folder-open me-2"></i>
                  Saved Dice Pools
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowSavedPools(false)}
                ></button>
              </div>
              <div className="modal-body">
                {savedPools.length === 0 ? (
                  <p className="text-center text-muted">No saved dice pools found</p>
                ) : (
                  <div className="list-group saved-pools-list">
                    {savedPools.map((pool, index) => (
                      <button 
                        key={index}
                        type="button" 
                        className="list-group-item list-group-item-action"
                        onClick={() => loadSavedPool(pool)}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-1">{pool.name}</h6>
                            <p className="mb-1 small text-muted">
                              {pool.dicePool.map(d => `${d.count}d${d.type}`).join(' + ')}
                            </p>
                          </div>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSavedPool(index);
                            }}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowSavedPools(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Roll History Modal */}
      {showRollHistory && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-history me-2"></i>
                  Roll History
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowRollHistory(false)}
                ></button>
              </div>
              <div className="modal-body">
                {rollHistory.length === 0 ? (
                  <p className="text-center text-muted">No roll history available</p>
                ) : (
                  <div className="list-group roll-history-list">
                    {rollHistory.slice(0, 50).map((record, index) => (
                      <div key={index} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-1">{record.summary} = <strong>{record.total}</strong></h6>
                          <small className="text-muted">{new Date(record.timestamp).toLocaleString()}</small>
                        </div>
                        <p className="mb-1">
                          Results: {record.results.join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                {rollHistory.length > 50 && (
                  <div className="text-center mt-3 text-muted">Showing most recent 50 rolls</div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all roll history? This action cannot be undone.')) {
                      setRollHistory([]);
                      localStorage.removeItem('kbRollHistory');
                      setShowRollHistory(false);
                      showNotification('Roll history cleared', 'success');
                    }
                  }}
                >
                  Clear History
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowRollHistory(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1050 }}>
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`toast align-items-center text-white bg-${toast.type} border-0 show`}
            role="alert"
          >
            <div className="d-flex">
              <div className="toast-body">{toast.message}</div>
              <button 
                type="button" 
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              ></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Knucklebones;