import {
  DiceGroupResult,
  GameSession,
  Player,
  MLPrediction,
  PatternAnalysis,
  DicePattern,
  ProbabilityDistribution
} from '../types/knucklebones';

// Simple neural network implementation for pattern recognition
class SimpleNeuralNetwork {
  private weights: number[][];
  private biases: number[][];
  private learningRate: number;
  private inputSize: number;
  private hiddenSize: number;
  private outputSize: number;

  constructor(inputSize: number, hiddenSize: number, outputSize: number, learningRate: number = 0.01) {
    this.inputSize = inputSize;
    this.hiddenSize = hiddenSize;
    this.outputSize = outputSize;
    this.learningRate = learningRate;
    
    // Initialize weights and biases randomly
    this.weights = [
      this.randomMatrix(inputSize, hiddenSize),
      this.randomMatrix(hiddenSize, outputSize)
    ];
    this.biases = [
      this.randomArray(hiddenSize),
      this.randomArray(outputSize)
    ];
  }

  private randomMatrix(rows: number, cols: number): number[] {
    return Array(rows * cols).fill(0).map(() => (Math.random() - 0.5) * 2);
  }

  private randomArray(size: number): number[] {
    return Array(size).fill(0).map(() => (Math.random() - 0.5) * 2);
  }

  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }

  private sigmoidDerivative(x: number): number {
    return x * (1 - x);
  }

  private matrixMultiply(a: number[], b: number[], aRows: number, aCols: number, bCols: number): number[] {
    const result = new Array(aRows * bCols).fill(0);
    for (let i = 0; i < aRows; i++) {
      for (let j = 0; j < bCols; j++) {
        for (let k = 0; k < aCols; k++) {
          result[i * bCols + j] += a[i * aCols + k] * b[k * bCols + j];
        }
      }
    }
    return result;
  }

  predict(input: number[]): number[] {
    // Forward pass
    let current = [...input];
    
    // Hidden layer
    const hidden = this.matrixMultiply(current, this.weights[0], 1, this.inputSize, this.hiddenSize);
    for (let i = 0; i < this.hiddenSize; i++) {
      hidden[i] = this.sigmoid(hidden[i] + this.biases[0][i]);
    }
    
    // Output layer
    const output = this.matrixMultiply(hidden, this.weights[1], 1, this.hiddenSize, this.outputSize);
    for (let i = 0; i < this.outputSize; i++) {
      output[i] = this.sigmoid(output[i] + this.biases[1][i]);
    }
    
    return output;
  }

  train(inputs: number[][], targets: number[][], epochs: number): void {
    for (let epoch = 0; epoch < epochs; epoch++) {
      for (let i = 0; i < inputs.length; i++) {
        this.trainSingle(inputs[i], targets[i]);
      }
    }
  }

  private trainSingle(input: number[], target: number[]): void {
    // Forward pass
    const hidden = this.matrixMultiply(input, this.weights[0], 1, this.inputSize, this.hiddenSize);
    for (let i = 0; i < this.hiddenSize; i++) {
      hidden[i] = this.sigmoid(hidden[i] + this.biases[0][i]);
    }
    
    const output = this.matrixMultiply(hidden, this.weights[1], 1, this.hiddenSize, this.outputSize);
    for (let i = 0; i < this.outputSize; i++) {
      output[i] = this.sigmoid(output[i] + this.biases[1][i]);
    }
    
    // Backward pass
    const outputError = output.map((o, i) => target[i] - o);
    const outputDelta = outputError.map((e, i) => e * this.sigmoidDerivative(output[i]));
    
    const hiddenError = new Array(this.hiddenSize).fill(0);
    for (let i = 0; i < this.hiddenSize; i++) {
      for (let j = 0; j < this.outputSize; j++) {
        hiddenError[i] += outputDelta[j] * this.weights[1][i * this.outputSize + j];
      }
    }
    const hiddenDelta = hiddenError.map((e, i) => e * this.sigmoidDerivative(hidden[i]));
    
    // Update weights and biases
    for (let i = 0; i < this.hiddenSize; i++) {
      for (let j = 0; j < this.outputSize; j++) {
        this.weights[1][i * this.outputSize + j] += this.learningRate * outputDelta[j] * hidden[i];
      }
      this.biases[1][i] += this.learningRate * outputDelta[i];
    }
    
    for (let i = 0; i < this.inputSize; i++) {
      for (let j = 0; j < this.hiddenSize; j++) {
        this.weights[0][i * this.hiddenSize + j] += this.learningRate * hiddenDelta[j] * input[i];
      }
    }
    
    for (let i = 0; i < this.hiddenSize; i++) {
      this.biases[0][i] += this.learningRate * hiddenDelta[i];
    }
  }

  // Public getters and setters for model persistence
  getWeights(): number[][] {
    return this.weights;
  }

  setWeights(weights: number[][]): void {
    this.weights = weights;
  }

  getBiases(): number[][] {
    return this.biases;
  }

  setBiases(biases: number[][]): void {
    this.biases = biases;
  }
}

class MLService {
  private patternNetwork: SimpleNeuralNetwork;
  private predictionNetwork: SimpleNeuralNetwork;
  private gameHistory: GameSession[] = [];
  private patterns: DicePattern[] = [];
  private isTraining: boolean = false;
  private modelAccuracy: number = 0;

  constructor() {
    // Pattern recognition network (input: dice sequence, output: pattern type)
    this.patternNetwork = new SimpleNeuralNetwork(12, 24, 8); // 12 dice values -> 8 pattern types
    
    // Prediction network (input: game state, output: next move probability)
    this.predictionNetwork = new SimpleNeuralNetwork(18, 36, 6); // 18 state features -> 6 possible moves
    
    this.loadStoredData();
  }

  // Pattern Recognition
  analyzePatterns(gameHistory: GameSession[]): PatternAnalysis {
    const patterns = this.extractPatterns(gameHistory);
    const frequencies = this.calculatePatternFrequencies(patterns);
    const trends = this.identifyTrends(patterns);
    const detectedAnomalies = this.detectAnomalies(patterns);
    
    // Convert DicePattern anomalies to Anomaly objects
    const anomalies = detectedAnomalies.map(pattern => ({
      type: 'unusual_pattern' as const,
      description: `Unusual ${pattern.type} pattern detected with probability ${pattern.probability.toFixed(3)}`,
      severity: (pattern.probability < 0.05 || pattern.probability > 0.95) ? 'high' as const : 'medium' as const,
      timestamp: pattern.timestamp || new Date(),
      data: pattern
    }));
    
    return {
      patterns,
      frequencies,
      trends,
      anomalies,
      confidence: this.calculateConfidence(patterns),
      timestamp: new Date()
    };
  }

  private extractPatterns(sessions: GameSession[]): DicePattern[] {
    const patterns: DicePattern[] = [];
    
    sessions.forEach(session => {
      session.rounds.forEach(round => {
        round.playerActions.forEach(action => {
          if (action.diceGroups) {
            const pattern = this.identifyDicePattern(action.diceGroups);
            if (pattern) {
              patterns.push({
                id: pattern.id || Date.now().toString(),
                type: pattern.type || 'unknown',
                values: pattern.values || [],
                probability: pattern.probability || 0,
                playerId: action.playerId,
                sessionId: session.id,
                roundNumber: round.roundNumber,
                timestamp: action.timestamp
              });
            }
          }
        });
      });
    });
    
    return patterns;
  }

  private identifyDicePattern(diceGroups: DiceGroupResult[]): Partial<DicePattern> | null {
    const values = diceGroups.flatMap(group => group.group.results);
    const input = this.normalizeDiceValues(values);
    
    const prediction = this.patternNetwork.predict(input);
    const patternType = this.getPatternType(prediction);
    
    if (patternType === 'unknown') return null;
    
    return {
      id: Date.now().toString(),
      type: patternType,
      values,
      probability: Math.max(...prediction)
    };
  }

  private normalizeDiceValues(values: number[]): number[] {
    // Normalize dice values to 0-1 range and pad/truncate to fixed size
    const normalized = values.map(v => (v - 1) / 5); // 1-6 -> 0-1
    const padded = new Array(12).fill(0);
    
    for (let i = 0; i < Math.min(values.length, 12); i++) {
      padded[i] = normalized[i];
    }
    
    return padded;
  }

  private getPatternType(prediction: number[]): string {
    const types = ['sequential', 'pairs', 'triples', 'mixed', 'high_risk', 'conservative', 'random', 'unknown'];
    const maxIndex = prediction.indexOf(Math.max(...prediction));
    return prediction[maxIndex] > 0.6 ? types[maxIndex] : 'unknown';
  }

  private calculatePatternFrequencies(patterns: DicePattern[]): Record<string, number> {
    const frequencies: Record<string, number> = {};
    
    patterns.forEach(pattern => {
      frequencies[pattern.type] = (frequencies[pattern.type] || 0) + 1;
    });
    
    return frequencies;
  }

  private identifyTrends(patterns: DicePattern[]): any[] {
    // Filter patterns with valid timestamps
    const validPatterns = patterns.filter(p => p.timestamp);
    if (validPatterns.length < 2) return [];
    
    // Analyze patterns over time to identify trends
    const timeWindows = this.groupPatternsByTimeWindow(validPatterns, 3600000); // 1 hour windows
    const trends = [];
    
    for (let i = 1; i < timeWindows.length; i++) {
      const current = timeWindows[i];
      const previous = timeWindows[i - 1];
      
      const trend = this.comparePatternsWindows(current, previous);
      if (trend.significance > 0.3) {
        trends.push(trend);
      }
    }
    
    return trends;
  }

  private groupPatternsByTimeWindow(patterns: DicePattern[], windowMs: number): DicePattern[][] {
    const windows: DicePattern[][] = [];
    const sortedPatterns = patterns.sort((a, b) => a.timestamp!.getTime() - b.timestamp!.getTime());
    
    if (sortedPatterns.length === 0) return windows;
    
    let currentWindow: DicePattern[] = [];
    let windowStart = sortedPatterns[0].timestamp!.getTime();
    
    sortedPatterns.forEach(pattern => {
      if (pattern.timestamp!.getTime() - windowStart > windowMs) {
        if (currentWindow.length > 0) {
          windows.push(currentWindow);
        }
        currentWindow = [pattern];
        windowStart = pattern.timestamp!.getTime();
      } else {
        currentWindow.push(pattern);
      }
    });
    
    if (currentWindow.length > 0) {
      windows.push(currentWindow);
    }
    
    return windows;
  }

  private comparePatternsWindows(current: DicePattern[], previous: DicePattern[]): any {
    const currentFreq = this.calculatePatternFrequencies(current);
    const previousFreq = this.calculatePatternFrequencies(previous);
    
    let totalChange = 0;
    const changes: Record<string, number> = {};
    
    Object.keys({ ...currentFreq, ...previousFreq }).forEach(type => {
      const currentCount = currentFreq[type] || 0;
      const previousCount = previousFreq[type] || 0;
      const change = currentCount - previousCount;
      
      changes[type] = change;
      totalChange += Math.abs(change);
    });
    
    return {
      changes,
      significance: totalChange / Math.max(current.length, previous.length, 1),
      direction: totalChange > 0 ? 'increasing' : 'decreasing'
    };
  }

  private detectAnomalies(patterns: DicePattern[]): DicePattern[] {
    // Detect patterns that deviate significantly from normal behavior
    const anomalies: DicePattern[] = [];
    const frequencies = this.calculatePatternFrequencies(patterns);
    const total = patterns.length;
    
    patterns.forEach(pattern => {
      const expectedFreq = frequencies[pattern.type] / total;
      const actualProb = pattern.probability;
      
      // Flag as anomaly if probability deviates significantly from expected
      if (Math.abs(actualProb - expectedFreq) > 0.3) {
        anomalies.push(pattern);
      }
    });
    
    return anomalies;
  }

  private calculateConfidence(patterns: DicePattern[]): number {
    if (patterns.length === 0) return 0;
    
    const avgProbability = patterns.reduce((sum, p) => sum + p.probability, 0) / patterns.length;
    const sampleSize = Math.min(patterns.length / 100, 1); // Confidence increases with sample size
    
    return avgProbability * sampleSize;
  }

  // Predictive Modeling
  predictNextMove(gameState: any, playerHistory: any[]): MLPrediction {
    const features = this.extractGameStateFeatures(gameState, playerHistory);
    const prediction = this.predictionNetwork.predict(features);
    
    const moves = [
      { action: 'aggressive_roll', probability: prediction[0] },
      { action: 'conservative_roll', probability: prediction[1] },
      { action: 'strategic_block', probability: prediction[2] },
      { action: 'risk_taking', probability: prediction[3] },
      { action: 'defensive_play', probability: prediction[4] },
      { action: 'random_play', probability: prediction[5] }
    ];
    
    moves.sort((a, b) => b.probability - a.probability);
    
    return {
      predictedOutcome: moves[0].probability,
      confidence: moves[0].probability,
      factors: [],
      recommendations: [moves[0].action],
      recommendedAction: moves[0].action,
      alternatives: moves.slice(1, 3),
      reasoning: this.generateReasoning(moves[0], features),
      timestamp: new Date()
    };
  }

  private extractGameStateFeatures(gameState: any, playerHistory: any[]): number[] {
    const features = new Array(18).fill(0);
    
    // Current game state features (0-8)
    features[0] = gameState.currentRound / 10; // Normalized round number
    features[1] = gameState.playerScore / 100; // Normalized score
    features[2] = gameState.opponentScore / 100;
    features[3] = gameState.remainingDice / 6;
    features[4] = gameState.turnTimeRemaining / 30; // Normalized time
    features[5] = gameState.riskLevel || 0.5;
    features[6] = gameState.boardAdvantage || 0;
    features[7] = gameState.streakCount / 5;
    features[8] = gameState.pressureLevel || 0.5;
    
    // Player history features (9-17)
    if (playerHistory.length > 0) {
      const recentMoves = playerHistory.slice(-10);
      features[9] = recentMoves.filter(m => m.type === 'aggressive').length / 10;
      features[10] = recentMoves.filter(m => m.type === 'conservative').length / 10;
      features[11] = recentMoves.filter(m => m.success).length / recentMoves.length;
      features[12] = recentMoves.reduce((sum, m) => sum + (m.riskLevel || 0), 0) / recentMoves.length;
      features[13] = recentMoves.reduce((sum, m) => sum + (m.timeToDecide || 0), 0) / recentMoves.length / 30;
      features[14] = playerHistory.length / 100; // Experience level
      features[15] = this.calculatePlayerConsistency(playerHistory);
      features[16] = this.calculatePlayerAdaptability(playerHistory);
      features[17] = this.calculatePlayerPressureResponse(playerHistory);
    }
    
    return features;
  }

  private calculatePlayerConsistency(history: any[]): number {
    if (history.length < 5) return 0.5;
    
    const strategies = history.map(h => h.strategy || 'unknown');
    const uniqueStrategies = new Set(strategies).size;
    
    return 1 - (uniqueStrategies / strategies.length);
  }

  private calculatePlayerAdaptability(history: any[]): number {
    if (history.length < 10) return 0.5;
    
    const recentStrategy = history.slice(-5).map(h => h.strategy);
    const olderStrategy = history.slice(-10, -5).map(h => h.strategy);
    
    const recentUnique = new Set(recentStrategy).size;
    const olderUnique = new Set(olderStrategy).size;
    
    return Math.abs(recentUnique - olderUnique) / 5;
  }

  private calculatePlayerPressureResponse(history: any[]): number {
    const pressureMoves = history.filter(h => h.pressureLevel > 0.7);
    if (pressureMoves.length === 0) return 0.5;
    
    const successRate = pressureMoves.filter(m => m.success).length / pressureMoves.length;
    return successRate;
  }

  private generateReasoning(bestMove: any, features: number[]): string {
    const reasons = [];
    
    if (features[1] < features[2]) {
      reasons.push('Player is behind in score');
    }
    
    if (features[4] < 0.3) {
      reasons.push('Time pressure detected');
    }
    
    if (features[5] > 0.7) {
      reasons.push('High risk situation');
    }
    
    if (features[9] > 0.6) {
      reasons.push('Player tends toward aggressive play');
    }
    
    if (features[15] > 0.8) {
      reasons.push('Player shows consistent strategy');
    }
    
    return reasons.length > 0 ? reasons.join(', ') : 'Based on current game state analysis';
  }

  // Training and Learning
  async trainModels(gameHistory: GameSession[]): Promise<void> {
    if (this.isTraining) return;
    
    this.isTraining = true;
    this.gameHistory = [...gameHistory];
    
    try {
      // Train pattern recognition
      const patternData = this.preparePatternTrainingData(gameHistory);
      if (patternData.inputs.length > 0) {
        this.patternNetwork.train(patternData.inputs, patternData.outputs, 100);
      }
      
      // Train prediction model
      const predictionData = this.preparePredictionTrainingData(gameHistory);
      if (predictionData.inputs.length > 0) {
        this.predictionNetwork.train(predictionData.inputs, predictionData.outputs, 100);
      }
      
      // Update model accuracy
      this.modelAccuracy = await this.evaluateModelAccuracy(gameHistory);
      
      // Store trained models
      this.saveModels();
      
    } finally {
      this.isTraining = false;
    }
  }

  private preparePatternTrainingData(sessions: GameSession[]): { inputs: number[][], outputs: number[][] } {
    const inputs: number[][] = [];
    const outputs: number[][] = [];
    
    sessions.forEach(session => {
      session.rounds.forEach(round => {
        round.playerActions.forEach(action => {
          if (action.diceGroups && action.outcome) {
            const input = this.normalizeDiceValues(
              action.diceGroups.flatMap(g => g.group.results)
            );
            const output = this.encodePatternOutput(action.outcome?.patternType || 'unknown');
            
            inputs.push(input);
            outputs.push(output);
          }
        });
      });
    });
    
    return { inputs, outputs };
  }

  private preparePredictionTrainingData(sessions: GameSession[]): { inputs: number[][], outputs: number[][] } {
    const inputs: number[][] = [];
    const outputs: number[][] = [];
    
    sessions.forEach(session => {
      for (let i = 0; i < session.rounds.length - 1; i++) {
        const currentRound = session.rounds[i];
        const nextRound = session.rounds[i + 1];
        
        currentRound.playerActions.forEach((action, actionIndex) => {
          if (actionIndex < currentRound.playerActions.length - 1) {
            const gameState = this.reconstructGameState(session, i, actionIndex);
            const playerHistory = this.getPlayerHistory(session, action.playerId, i);
            const input = this.extractGameStateFeatures(gameState, playerHistory);
            
            const nextAction = currentRound.playerActions[actionIndex + 1];
            const output = this.encodeActionOutput(nextAction.actionType);
            
            inputs.push(input);
            outputs.push(output);
          }
        });
      }
    });
    
    return { inputs, outputs };
  }

  private encodePatternOutput(patternType: string): number[] {
    const types = ['sequential', 'pairs', 'triples', 'mixed', 'high_risk', 'conservative', 'random', 'unknown'];
    const output = new Array(8).fill(0);
    const index = types.indexOf(patternType);
    if (index >= 0) output[index] = 1;
    return output;
  }

  private encodeActionOutput(actionType: string): number[] {
    const actions = ['aggressive_roll', 'conservative_roll', 'strategic_block', 'risk_taking', 'defensive_play', 'random_play'];
    const output = new Array(6).fill(0);
    const index = actions.indexOf(actionType);
    if (index >= 0) output[index] = 1;
    return output;
  }

  private reconstructGameState(session: GameSession, roundIndex: number, actionIndex: number): any {
    // Reconstruct game state at specific point in time
    return {
      currentRound: roundIndex + 1,
      playerScore: session.rounds[roundIndex].scores[session.players[0].id] || 0,
      opponentScore: session.rounds[roundIndex].scores[session.players[1]?.id] || 0,
      remainingDice: 6, // Simplified
      turnTimeRemaining: 30, // Simplified
      riskLevel: 0.5, // Simplified
      boardAdvantage: 0, // Simplified
      streakCount: 0, // Simplified
      pressureLevel: 0.5 // Simplified
    };
  }

  private getPlayerHistory(session: GameSession, playerId: string, beforeRound: number): any[] {
    const history: any[] = [];
    
    for (let i = 0; i < beforeRound; i++) {
      const round = session.rounds[i];
      const playerActions = round.playerActions.filter(a => a.playerId === playerId);
      
      playerActions.forEach(action => {
        history.push({
          type: action.actionType,
          success: action.outcome?.success || false,
          riskLevel: action.riskLevel || 0.5,
          timeToDecide: action.timeToDecide || 15,
          strategy: action.strategy || 'unknown',
          pressureLevel: action.pressureLevel || 0.5
        });
      });
    }
    
    return history;
  }

  private async evaluateModelAccuracy(sessions: GameSession[]): Promise<number> {
    // Simple accuracy evaluation
    let correct = 0;
    let total = 0;
    
    sessions.slice(-10).forEach(session => {
      session.rounds.forEach(round => {
        round.playerActions.forEach(action => {
          if (action.diceGroups && action.outcome) {
            const input = this.normalizeDiceValues(
              action.diceGroups.flatMap(g => g.group.results)
            );
            const prediction = this.patternNetwork.predict(input);
            const predictedType = this.getPatternType(prediction);
            
            if (predictedType === action.outcome.patternType) {
              correct++;
            }
            total++;
          }
        });
      });
    });
    
    return total > 0 ? correct / total : 0;
  }

  // Data persistence
  private saveModels(): void {
    try {
      const modelData = {
        patternWeights: this.patternNetwork.getWeights(),
        patternBiases: this.patternNetwork.getBiases(),
        predictionWeights: this.predictionNetwork.getWeights(),
        predictionBiases: this.predictionNetwork.getBiases(),
        accuracy: this.modelAccuracy,
        lastTrained: new Date().toISOString()
      };
      
      localStorage.setItem('knucklebones_ml_models', JSON.stringify(modelData));
    } catch (error) {
      console.error('Failed to save ML models:', error);
    }
  }

  private loadStoredData(): void {
    try {
      const stored = localStorage.getItem('knucklebones_ml_models');
      if (stored) {
        const modelData = JSON.parse(stored);
        
        if (modelData.patternWeights) {
          this.patternNetwork.setWeights(modelData.patternWeights);
          this.patternNetwork.setBiases(modelData.patternBiases);
        }
        
        if (modelData.predictionWeights) {
          this.predictionNetwork.setWeights(modelData.predictionWeights);
          this.predictionNetwork.setBiases(modelData.predictionBiases);
        }
        
        this.modelAccuracy = modelData.accuracy || 0;
      }
    } catch (error) {
      console.error('Failed to load stored ML models:', error);
    }
  }

  // Public getters
  getModelAccuracy(): number {
    return this.modelAccuracy;
  }

  isModelTraining(): boolean {
    return this.isTraining;
  }

  getTrainingDataSize(): number {
    return this.gameHistory.length;
  }

  // Probability calculations
  calculateWinProbability(gameState: any, playerHistory: any[]): ProbabilityDistribution {
    const features = this.extractGameStateFeatures(gameState, playerHistory);
    const prediction = this.predictionNetwork.predict(features);
    
    // Convert prediction to win probability
    const aggressiveWeight = prediction[0] + prediction[3]; // aggressive + risk_taking
    const conservativeWeight = prediction[1] + prediction[4]; // conservative + defensive
    const strategicWeight = prediction[2]; // strategic_block
    
    const totalWeight = aggressiveWeight + conservativeWeight + strategicWeight;
    
    return {
      win: Math.min(0.95, Math.max(0.05, (aggressiveWeight + strategicWeight) / totalWeight)),
      lose: Math.min(0.95, Math.max(0.05, conservativeWeight / totalWeight)),
      draw: Math.min(0.9, Math.max(0.0, 1 - ((aggressiveWeight + strategicWeight + conservativeWeight) / totalWeight))),
      confidence: Math.max(...prediction)
    };
  }
}

// Singleton instance
const mlService = new MLService();
export default mlService;

// Hook for React components
export const useMLService = () => {
  return {
    service: mlService,
    analyzePatterns: mlService.analyzePatterns.bind(mlService),
    predictNextMove: mlService.predictNextMove.bind(mlService),
    trainModels: mlService.trainModels.bind(mlService),
    calculateWinProbability: mlService.calculateWinProbability.bind(mlService),
    getModelAccuracy: mlService.getModelAccuracy.bind(mlService),
    isModelTraining: mlService.isModelTraining.bind(mlService),
    getTrainingDataSize: mlService.getTrainingDataSize.bind(mlService)
  };
};