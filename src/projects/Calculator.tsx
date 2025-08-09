import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { evaluate, sin, cos, tan, asin, acos, atan, log, log10, exp, sqrt, pow, factorial, pi, e } from 'mathjs';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import '../css/modern.css';
import './Calculator.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
import { PerformanceOverlay } from '../components/portfolio/PerformanceOverlay';
import { CaseStudyCard } from '../components/portfolio/CaseStudyCard';
import { FeedbackCollector } from '../components/portfolio/FeedbackCollector';
import { TechnicalChallenge } from '../components/portfolio/TechnicalChallenge';
import { usePerformanceMetrics } from '../hooks/usePerformanceMetrics';
import { getProjectMetrics } from '../data/projectMetrics';
import { getArchitectureById } from '../data/architectureDiagrams';

type CalculatorMode = 'basic' | 'scientific' | 'programming' | 'matrix' | 'statistics' | 'graphing' | 'units' | 'solver';

interface CalculatorState {
  runningTotal: number;
  buffer: string;
  previousOperator: string | null;
  needsReset: boolean;
  lastOperation: string;
  memory: number[];
  mode: CalculatorMode;
  angleUnit: 'deg' | 'rad';
  history: string[];
  variables: { [key: string]: number };
  customFunctions: { [key: string]: string };
  isInverse: boolean;
  isHyperbolic: boolean;
  // Graphing properties
  graphFunction: string;
  graphXMin: number;
  graphXMax: number;
  graphYMin: number;
  graphYMax: number;
  graphData: {x: number, y: number}[];
  // Unit conversion properties
  unitCategory: 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'time' | 'speed' | 'energy';
  fromUnit: string;
  toUnit: string;
  conversionValue: string;
  conversionResult: string;
}

const Calculator: React.FC = () => {
  const [state, setState] = useState<CalculatorState>({
    runningTotal: 0,
    buffer: "0",
    previousOperator: null,
    needsReset: false,
    lastOperation: "",
    memory: [0, 0, 0, 0, 0], // 5 memory slots
    mode: 'basic',
    angleUnit: 'deg',
    history: [],
    variables: {},
    customFunctions: {},
    isInverse: false,
    isHyperbolic: false,
    // Graphing defaults
    graphFunction: 'x',
    graphXMin: -10,
    graphXMax: 10,
    graphYMin: -10,
    graphYMax: 10,
    graphData: [],
    // Unit conversion defaults
    unitCategory: 'length',
    fromUnit: 'meter',
    toUnit: 'foot',
    conversionValue: '1',
    conversionResult: '3.28084',
  });

  // Performance tracking
  const { metrics, startTracking, stopTracking } = usePerformanceMetrics({
    trackingInterval: 1000,
    enableMemoryTracking: true,
    enableUserInteractionTracking: true
  });
  
  // Project data
  const projectData = getProjectMetrics('calculator');
  const architectureData = getArchitectureById('calculator');

  const isNumber = (value: string): boolean => {
    return !isNaN(Number(value)) && value !== " ";
  };

  const isNumpadNumber = (key: string): boolean => {
    return key.startsWith("Numpad") && !isNaN(Number(key.slice(-1)));
  };

  const getNumberFromKey = (key: string): string => {
    if (key.startsWith("Numpad")) {
      return key.slice(-1);
    }
    return key;
  };

  const formatNumber = (number: string): string => {
    if (number === "Error") return number;
    
    if (parseFloat(number) > 1e12) {
      return parseFloat(number).toExponential(2);
    }
    
    const parsed = parseFloat(number);
    
    if (number.includes('.')) {
      const parts = number.split('.');
      if (parts[1].length > 8) {
        return parsed.toFixed(8).replace(/\.?0+$/, '');
      }
    }
    
    return number;
  };

  const executeOperation = (a: number, b: number, operator: string): number | string => {
    switch (operator) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": 
        if (b === 0) {
          triggerExplosion();
          return "Error";
        }
        return a / b;
      case "^": return Number(pow(a, b));
      case "mod": return a % b;
      case "log": return log(a, b); // log base b of a
      default: return b;
    }
  };

  const executeScientificFunction = (func: string, value: number): number | string => {
    try {
      const angleValue = state.angleUnit === 'deg' ? (value * Math.PI / 180) : value;
      const invAngleValue = state.angleUnit === 'deg' ? (value * 180 / Math.PI) : value;
      
      switch (func) {
        // Trigonometric functions
        case 'sin': return state.isInverse ? Number(asin(value)) : Number(sin(angleValue));
        case 'cos': return state.isInverse ? Number(acos(value)) : Number(cos(angleValue));
        case 'tan': return state.isInverse ? Number(atan(value)) : Number(tan(angleValue));
        
        // Hyperbolic functions
        case 'sinh': return state.isInverse ? Math.asinh(value) : Math.sinh(value);
        case 'cosh': return state.isInverse ? Math.acosh(value) : Math.cosh(value);
        case 'tanh': return state.isInverse ? Math.atanh(value) : Math.tanh(value);
        
        // Logarithmic functions
        case 'ln': return state.isInverse ? Number(exp(value)) : Number(log(value));
        case 'log': return state.isInverse ? Number(pow(10, value)) : Number(log10(value));
        case 'log2': return state.isInverse ? Number(pow(2, value)) : Math.log2(value);
        
        // Power and root functions
        case 'sqrt': return state.isInverse ? Number(pow(value, 2)) : Number(sqrt(value));
        case 'cbrt': return state.isInverse ? Number(pow(value, 3)) : Math.cbrt(value);
        case 'square': return Number(pow(value, 2));
        case 'cube': return Number(pow(value, 3));
        case 'reciprocal': return 1 / value;
        
        // Factorial and gamma
        case 'factorial': return Number(factorial(Math.floor(value)));
        case 'gamma': return Number(factorial(value - 1));
        
        // Other functions
        case 'abs': return Math.abs(value);
        case 'sign': return Math.sign(value);
        case 'floor': return Math.floor(value);
        case 'ceil': return Math.ceil(value);
        case 'round': return Math.round(value);
        
        default: return value;
      }
    } catch (error) {
      return "Error";
    }
  };

  const handleNumber = (value: string) => {
    setState(prevState => {
      if (prevState.buffer.length >= 12 && !prevState.needsReset) {
        return prevState;
      }
      
      if (prevState.buffer === "0" || prevState.needsReset) {
        return {
          ...prevState,
          buffer: value,
          needsReset: false
        };
      } else {
        return {
          ...prevState,
          buffer: prevState.buffer + value
        };
      }
    });
  };

  const reset = () => {
    setState(prevState => ({
      runningTotal: 0,
      buffer: "0",
      previousOperator: null,
      needsReset: false,
      lastOperation: "",
      memory: prevState.memory,
      mode: prevState.mode,
      angleUnit: prevState.angleUnit,
      history: prevState.history,
      variables: prevState.variables,
      customFunctions: prevState.customFunctions,
      isInverse: false,
      isHyperbolic: false,
    }));
  };

  const handleConstant = (constant: string) => {
    let value: number;
    switch (constant) {
      case 'π': value = pi; break;
      case 'e': value = e; break;
      case 'φ': value = (1 + Math.sqrt(5)) / 2; break; // Golden ratio
      case 'γ': value = 0.5772156649015329; break; // Euler-Mascheroni constant
      default: return;
    }
    
    setState(prevState => ({
      ...prevState,
      buffer: formatNumber(value.toString()),
      needsReset: false
    }));
  };

  const handleMemoryOperation = (operation: string, slot: number = 0) => {
    const currentValue = parseFloat(state.buffer);
    
    setState(prevState => {
      const newMemory = [...prevState.memory];
      
      switch (operation) {
        case 'MS': // Memory Store
          newMemory[slot] = currentValue;
          break;
        case 'MR': // Memory Recall
          return {
            ...prevState,
            buffer: formatNumber(newMemory[slot].toString()),
            needsReset: false
          };
        case 'M+': // Memory Add
          newMemory[slot] += currentValue;
          break;
        case 'M-': // Memory Subtract
          newMemory[slot] -= currentValue;
          break;
        case 'MC': // Memory Clear
          newMemory[slot] = 0;
          break;
      }
      
      return {
        ...prevState,
        memory: newMemory
      };
    });
  };

  const switchMode = (newMode: CalculatorMode) => {
    setState(prevState => ({
      ...prevState,
      mode: newMode,
      isInverse: false,
      isHyperbolic: false
    }));
  };

  const toggleAngleUnit = () => {
    setState(prevState => ({
      ...prevState,
      angleUnit: prevState.angleUnit === 'deg' ? 'rad' : 'deg'
    }));
  };

  const toggleInverse = () => {
    setState(prevState => ({
      ...prevState,
      isInverse: !prevState.isInverse
    }));
  };

  const toggleHyperbolic = () => {
    setState(prevState => ({
      ...prevState,
      isHyperbolic: !prevState.isHyperbolic
    }));
  };

  const addToHistory = (operation: string) => {
    setState(prevState => ({
      ...prevState,
      history: [operation, ...prevState.history.slice(0, 49)] // Keep last 50 operations
    }));
  };

  // Graphing functions
  const plotFunction = (functionStr: string) => {
    try {
      const points: {x: number, y: number}[] = [];
      const step = (state.graphXMax - state.graphXMin) / 200; // 200 points for smooth curve
      
      for (let x = state.graphXMin; x <= state.graphXMax; x += step) {
        try {
          // Replace 'x' with actual value and evaluate
          const expression = functionStr.replace(/x/g, x.toString());
          const y = Number(evaluate(expression));
          
          if (isFinite(y) && y >= state.graphYMin && y <= state.graphYMax) {
            points.push({ x, y });
          }
        } catch {
          // Skip invalid points
        }
      }
      
      setState(prev => ({
        ...prev,
        graphData: points,
        graphFunction: functionStr
      }));
    } catch (error) {
      console.error('Error plotting function:', error);
    }
  };

  const updateGraphRange = (xMin: number, xMax: number, yMin: number, yMax: number) => {
    setState(prev => ({
      ...prev,
      graphXMin: xMin,
      graphXMax: xMax,
      graphYMin: yMin,
      graphYMax: yMax
    }));
    // Re-plot with new range
    if (state.graphFunction) {
      plotFunction(state.graphFunction);
    }
  };

  const backspace = () => {
    setState(prevState => ({
      ...prevState,
      buffer: prevState.buffer.length === 1 ? "0" : prevState.buffer.slice(0, -1)
    }));
  };

  const handleOperator = (operator: string) => {
    setState(prevState => {
      const value = parseFloat(prevState.buffer);
      const lastOperation = `${prevState.runningTotal} ${operator} ${value}`;
      
      let newRunningTotal;
      if (prevState.runningTotal === 0) {
        newRunningTotal = value;
      } else {
        const result = executeOperation(
          prevState.runningTotal,
          value,
          prevState.previousOperator || ""
        );
        newRunningTotal = typeof result === 'number' ? result : 0;
      }

      return {
        ...prevState,
        lastOperation,
        runningTotal: newRunningTotal,
        previousOperator: operator,
        buffer: formatNumber(newRunningTotal.toString()),
        needsReset: true
      };
    });
  };

  const calculate = () => {
    setState(prevState => {
      if (!prevState.previousOperator) return prevState;

      const value = parseFloat(prevState.buffer);
      const lastOperation = `${prevState.runningTotal} ${prevState.previousOperator} ${value} =`;
      
      const result = executeOperation(
        prevState.runningTotal,
        value,
        prevState.previousOperator
      );
      
      const newBuffer = typeof result === 'string' ? result : formatNumber(result.toString());
      
      return {
        ...prevState,
        lastOperation,
        runningTotal: typeof result === 'number' ? result : 0,
        buffer: newBuffer,
        previousOperator: null
      };
    });
  };

  const handleDecimal = () => {
    setState(prevState => {
      if (!prevState.buffer.includes('.') && prevState.buffer !== "Error") {
        return {
          ...prevState,
          buffer: prevState.buffer + '.'
        };
      }
      return prevState;
    });
  };

  const handleSymbol = (symbol: string) => {
    const currentValue = parseFloat(state.buffer);
    
    switch (symbol) {
      case "C":
        reset();
        break;
      case "←":
        backspace();
        break;
      case "=":
        calculate();
        break;
      
      // Scientific functions
      case "sin":
      case "cos":
      case "tan":
      case "sinh":
      case "cosh":
      case "tanh":
      case "ln":
      case "log":
      case "log2":
      case "sqrt":
      case "cbrt":
      case "square":
      case "cube":
      case "reciprocal":
      case "factorial":
      case "gamma":
      case "abs":
      case "sign":
      case "floor":
      case "ceil":
      case "round":
        const result = executeScientificFunction(symbol, currentValue);
        setState(prevState => ({
          ...prevState,
          buffer: typeof result === 'string' ? result : formatNumber(result.toString()),
          lastOperation: `${symbol}(${currentValue})`,
          needsReset: true
        }));
        addToHistory(`${symbol}(${currentValue}) = ${result}`);
        break;
      
      // Constants
      case "π":
      case "e":
      case "φ":
      case "γ":
        handleConstant(symbol);
        break;
      
      // Memory operations
      case "MS":
      case "MR":
      case "M+":
      case "M-":
      case "MC":
        handleMemoryOperation(symbol);
        break;
      
      // Mode toggles
      case "INV":
        toggleInverse();
        break;
      case "HYP":
        toggleHyperbolic();
        break;
      case "DEG/RAD":
        toggleAngleUnit();
        break;
      
      // Advanced expression evaluation
      case "EVAL":
        try {
          const evalResult = evaluate(state.buffer);
          setState(prevState => ({
            ...prevState,
            buffer: formatNumber(evalResult.toString()),
            lastOperation: `eval(${state.buffer})`,
            needsReset: true
          }));
          addToHistory(`eval(${state.buffer}) = ${evalResult}`);
        } catch (error) {
          setState(prevState => ({
            ...prevState,
            buffer: "Error",
            needsReset: true
          }));
        }
        break;
      
      default:
        handleOperator(symbol);
    }
  };

  const addKeyPressEffect = (key: string) => {
    const buttons = document.querySelectorAll('.calc-button');
    buttons.forEach(button => {
      const buttonText = (button as HTMLElement).textContent?.trim();
      let shouldHighlight = false;
      
      if (isNumber(key) || isNumpadNumber(key)) {
        const number = getNumberFromKey(key);
        shouldHighlight = buttonText === number && !button.classList.contains('function');
      } else if ((key === "+" || key === "NumpadAdd") && buttonText === "+") {
        shouldHighlight = true;
      } else if ((key === "-" || key === "NumpadSubtract") && buttonText === "-") {
        shouldHighlight = true;
      } else if ((key === "*" || key === "NumpadMultiply") && buttonText === "×") {
        shouldHighlight = true;
      } else if ((key === "/" || key === "NumpadDivide") && buttonText === "÷") {
        shouldHighlight = true;
      } else if ((key === "=" || key === "Enter" || key === "NumpadEnter") && buttonText === "=") {
        shouldHighlight = true;
      } else if ((key === "Escape" || key.toLowerCase() === "c" || key === "Clear") && buttonText === "C") {
        shouldHighlight = true;
      } else if ((key === "Backspace" || key === "Delete") && buttonText === "←") {
        shouldHighlight = true;
      }
      
      if (shouldHighlight) {
        button.classList.add('key-pressed');
        setTimeout(() => {
          button.classList.remove('key-pressed');
        }, 150);
      }
    });
  };

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key;
    
    const calculatorKeys = [
      "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", 
      "+", "-", "*", "/", "=", "Enter", "Escape", "Backspace", "c", "C", ".",
      "NumpadEnter", "NumpadAdd", "NumpadSubtract", "NumpadMultiply", "NumpadDivide",
      "Numpad0", "Numpad1", "Numpad2", "Numpad3", "Numpad4", 
      "Numpad5", "Numpad6", "Numpad7", "Numpad8", "Numpad9",
      "NumpadDecimal", "Delete", "Clear"
    ];
    
    if (calculatorKeys.includes(key)) {
      event.preventDefault();
    }
    
    addKeyPressEffect(key);
    
    if (isNumber(key) || isNumpadNumber(key)) {
      const number = getNumberFromKey(key);
      handleNumber(number);
    } else if (key === "+" || key === "NumpadAdd") {
      handleSymbol("+");
    } else if (key === "-" || key === "NumpadSubtract") {
      handleSymbol("-");
    } else if (key === "*" || key === "NumpadMultiply") {
      handleSymbol("×");
    } else if (key === "/" || key === "NumpadDivide") {
      handleSymbol("÷");
    } else if (key === "=" || key === "Enter" || key === "NumpadEnter") {
      handleSymbol("=");
    } else if (key === "Escape" || key.toLowerCase() === "c" || key === "Clear") {
      handleSymbol("C");
    } else if (key === "Backspace" || key === "Delete") {
      handleSymbol("←");
    } else if (key === "." || key === "NumpadDecimal") {
      handleDecimal();
    }
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const target = event.target as HTMLButtonElement;
    if (!target.classList.contains("calc-button")) return;
    
    const value = target.innerText;
    
    target.classList.add("pulse");
    setTimeout(() => {
      target.classList.remove("pulse");
    }, 150);
    
    isNumber(value) ? handleNumber(value) : handleSymbol(value);
  };

  const triggerExplosion = () => {
    showWarningMessage();
    
    setTimeout(() => {
      const explosionOverlay = document.createElement('div');
      explosionOverlay.className = 'explosion-overlay';
      document.body.appendChild(explosionOverlay);
      
      const calculator = document.querySelector('.wrapper');
      if (calculator) {
        const rect = calculator.getBoundingClientRect();
        createScreenFlash();
        createPixelatedFragments(rect);
        shakeScreen();
        playExplosionSound();
        
        setTimeout(() => {
          reset();
          explosionOverlay.remove();
        }, 3000);
      }
    }, 1000);
  };

  const showWarningMessage = () => {
    const warning = document.createElement('div');
    warning.className = 'explosion-warning';
    warning.innerHTML = `
      <div class="warning-content">
        <i class="fa fa-exclamation-triangle"></i>
        <h2>CRITICAL ERROR</h2>
        <p>Division by zero detected!</p>
        <p>Initiating emergency protocols...</p>
        <div class="warning-countdown">
          <span id="countdown">3</span>
        </div>
      </div>
    `;
    document.body.appendChild(warning);
    
    let count = 3;
    const countdownEl = warning.querySelector('#countdown') as HTMLElement;
    const countdown = setInterval(() => {
      count--;
      if (count > 0) {
        countdownEl.textContent = count.toString();
        countdownEl.style.transform = 'scale(1.5)';
        setTimeout(() => {
          countdownEl.style.transform = 'scale(1)';
        }, 100);
      } else {
        clearInterval(countdown);
        warning.remove();
      }
    }, 300);
  };

  const createScreenFlash = () => {
    const flash = document.createElement('div');
    flash.className = 'explosion-flash';
    document.body.appendChild(flash);
    
    setTimeout(() => {
      flash.remove();
    }, 200);
  };

  const createPixelatedFragments = (calculatorRect: DOMRect) => {
    const fragmentCount = 40;
    const calculator = document.querySelector('.wrapper') as HTMLElement;
    
    calculator.classList.add('exploding');
    
    setTimeout(() => {
      calculator.classList.remove('exploding');
    }, 300);
    
    for (let i = 0; i < fragmentCount; i++) {
      const fragment = document.createElement('div');
      
      const fragmentType = Math.random();
      if (fragmentType < 0.7) {
        fragment.className = 'pixel-fragment';
      } else if (fragmentType < 0.9) {
        fragment.className = 'spark-fragment';
      } else {
        fragment.className = 'smoke-fragment';
      }
      
      let size: number, colors: string[];
      if (fragment.className === 'spark-fragment') {
        size = Math.random() * 8 + 4;
        colors = ['#ffff00', '#ffaa00', '#ff6600', '#ff4444'];
      } else if (fragment.className === 'smoke-fragment') {
        size = Math.random() * 30 + 20;
        colors = ['#666', '#888', '#aaa', '#999'];
      } else {
        size = Math.random() * 20 + 10;
        colors = ['#ff4444', '#ff8800', '#ffaa00', '#fff', '#ff6666'];
      }
      
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      fragment.style.width = size + 'px';
      fragment.style.height = size + 'px';
      fragment.style.backgroundColor = color;
      
      if (fragment.className === 'spark-fragment') {
        fragment.style.boxShadow = `0 0 ${size}px ${color}`;
        fragment.style.borderRadius = '50%';
      } else if (fragment.className === 'smoke-fragment') {
        fragment.style.borderRadius = '50%';
        fragment.style.opacity = '0.6';
      } else {
        fragment.style.boxShadow = `0 0 ${size/2}px ${color}`;
      }
      
      const centerX = calculatorRect.left + calculatorRect.width / 2;
      const centerY = calculatorRect.top + calculatorRect.height / 2;
      
      fragment.style.left = centerX + 'px';
      fragment.style.top = centerY + 'px';
      
      document.body.appendChild(fragment);
      
      animateFragment(fragment, centerX, centerY);
    }
  };

  const animateFragment = (fragment: HTMLElement, startX: number, startY: number) => {
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 300 + 100;
    const gravity = 980;
    const bounce = 0.7;
    const friction = 0.98;
    
    const isSpark = fragment.classList.contains('spark-fragment');
    const isSmoke = fragment.classList.contains('smoke-fragment');
    
    let x = startX;
    let y = startY;
    let vx = Math.cos(angle) * velocity * (isSpark ? 1.5 : isSmoke ? 0.5 : 1);
    let vy = Math.sin(angle) * velocity * (isSpark ? 1.5 : isSmoke ? 0.3 : 1);
    let rotation = 0;
    let rotationSpeed = (Math.random() - 0.5) * (isSpark ? 30 : isSmoke ? 5 : 20);
    
    const startTime = Date.now();
    const duration = isSpark ? 2 : isSmoke ? 4 : 3;
    
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = (currentTime - startTime) / 1000;
      const deltaTime = 0.016;
      
      if (isSmoke) {
        vy -= gravity * deltaTime * 0.1;
        vx *= 0.995;
      } else {
        vy += gravity * deltaTime;
      }
      
      x += vx * deltaTime;
      y += vy * deltaTime;
      rotation += rotationSpeed;
      
      if (!isSmoke) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        if (x <= 0 || x >= windowWidth) {
          vx *= -bounce;
          x = Math.max(0, Math.min(windowWidth, x));
        }
        
        if (y >= windowHeight) {
          vy *= -bounce;
          y = windowHeight;
          vx *= friction;
          rotationSpeed *= friction;
        }
      }
      
      fragment.style.transform = `translate(${x - startX}px, ${y - startY}px) rotate(${rotation}deg)`;
      
      let opacity: number;
      if (isSpark) {
        opacity = Math.max(0, 1 - elapsed / 2);
      } else if (isSmoke) {
        opacity = Math.max(0, 0.6 - elapsed / 4);
      } else {
        opacity = Math.max(0, 1 - elapsed / 3);
      }
      
      fragment.style.opacity = opacity.toString();
      
      if (isSmoke) {
        const scale = 1 + elapsed * 0.5;
        fragment.style.transform += ` scale(${scale})`;
      }
      
      if (elapsed < duration && opacity > 0) {
        requestAnimationFrame(animate);
      } else {
        fragment.remove();
      }
    };
    
    requestAnimationFrame(animate);
  };

  const shakeScreen = () => {
    document.body.classList.add('screen-shake');
    setTimeout(() => {
      document.body.classList.remove('screen-shake');
    }, 1000);
  };

  const playExplosionSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const duration = 0.5;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(60, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1, audioContext.currentTime + duration);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.log('Audio not available');
    }
  };

  useEffect(() => {
    startTracking();
    return () => stopTracking();
  }, [startTracking, stopTracking]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="calculator-page">
      <PerformanceOverlay metrics={metrics} />
      <FeedbackCollector projectName="Calculator" />
      
      <div className="container-modern py-4">
        <header className="text-center mb-5 fade-in calculator-main-header">
          <h1 className="display-4 text-white fw-bold mb-3">
            <i className="fa fa-calculator me-2"></i>
            Calculator
          </h1>
          <p className="lead text-white">A sleek, functional calculator built with React &amp; TypeScript</p>
        </header>
        
        {/* Case Study Card */}
        {projectData && (
          <CaseStudyCard 
            project={projectData}
            className="mb-5"
          />
        )}
        
        {/* Technical Challenge Component */}
        {architectureData && (
          <TechnicalChallenge 
            architecture={architectureData}
            className="mb-5"
          />
        )}

        <section className="section-modern">
          <div className="card box-shadow fade-in">
            <div className="card-body p-4">
              {/* Mode Selector */}
              <div className="mode-selector mb-4">
                <div className="btn-group" role="group">
                  {(['basic', 'scientific', 'programming', 'matrix', 'statistics', 'graphing', 'units', 'solver'] as CalculatorMode[]).map(mode => (
                    <button
                      key={mode}
                      className={`btn ${state.mode === mode ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
                      onClick={() => switchMode(mode)}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="wrapper">
                {/* Enhanced Display */}
                <section className="calculator-display">
                  <div className="display-info">
                    <span className="mode-indicator">{state.mode.toUpperCase()}</span>
                    <span className="angle-unit">{state.angleUnit.toUpperCase()}</span>
                    {state.isInverse && <span className="inv-indicator">INV</span>}
                    {state.isHyperbolic && <span className="hyp-indicator">HYP</span>}
                  </div>
                  <div className="operation-history">
                    {state.lastOperation}
                  </div>
                  <section className={`screen ${state.buffer === "Error" ? 'error' : ''}`}>
                    {formatNumber(state.buffer)}
                  </section>
                </section>
                
                {/* Memory Display */}
                {state.memory.some(m => m !== 0) && (
                  <div className="memory-display">
                    <small>Memory: {state.memory.map((m, i) => `M${i+1}:${m.toFixed(2)}`).join(' | ')}</small>
                  </div>
                )}

                {/* Calculator Buttons */}
                <section className="calc-buttons" onClick={handleClick}>
                  {state.mode === 'basic' && (
                    <>
                      <div className="calc-button-row">
                        <button className="calc-button double" data-key="C">C</button>
                        <button className="calc-button" data-key="←">&larr;</button>
                        <button className="calc-button function" data-key="÷">&divide;</button>
                      </div>
                      <div className="calc-button-row">
                        <button className="calc-button" data-key="7">7</button>
                        <button className="calc-button" data-key="8">8</button>
                        <button className="calc-button" data-key="9">9</button>
                        <button className="calc-button function" data-key="×">&times;</button>
                      </div>
                      <div className="calc-button-row">
                        <button className="calc-button" data-key="4">4</button>
                        <button className="calc-button" data-key="5">5</button>
                        <button className="calc-button" data-key="6">6</button>
                        <button className="calc-button function" data-key="-">-</button>
                      </div>
                      <div className="calc-button-row">
                        <button className="calc-button" data-key="1">1</button>
                        <button className="calc-button" data-key="2">2</button>
                        <button className="calc-button" data-key="3">3</button>
                        <button className="calc-button function" data-key="+">&plus;</button>
                      </div>
                      <div className="calc-button-row">
                        <button className="calc-button double" data-key="0">0</button>
                        <button className="calc-button" data-key=".">.</button>
                        <button className="calc-button function" data-key="=">&equals;</button>
                      </div>
                    </>
                  )}

                  {state.mode === 'scientific' && (
                    <>
                      {/* Scientific Calculator Layout */}
                      <div className="calc-button-row">
                        <button className={`calc-button function ${state.isInverse ? 'active' : ''}`} data-key="INV">INV</button>
                        <button className={`calc-button function ${state.isHyperbolic ? 'active' : ''}`} data-key="HYP">HYP</button>
                        <button className="calc-button function" data-key="DEG/RAD">{state.angleUnit}</button>
                        <button className="calc-button" data-key="C">C</button>
                        <button className="calc-button" data-key="←">&larr;</button>
                      </div>
                      
                      <div className="calc-button-row">
                        <button className="calc-button function" data-key="sin">{state.isInverse ? 'asin' : 'sin'}</button>
                        <button className="calc-button function" data-key="cos">{state.isInverse ? 'acos' : 'cos'}</button>
                        <button className="calc-button function" data-key="tan">{state.isInverse ? 'atan' : 'tan'}</button>
                        <button className="calc-button function" data-key="ln">{state.isInverse ? 'e^x' : 'ln'}</button>
                        <button className="calc-button function" data-key="log">{state.isInverse ? '10^x' : 'log'}</button>
                      </div>
                      
                      <div className="calc-button-row">
                        <button className="calc-button function" data-key="sinh">{state.isInverse ? 'asinh' : 'sinh'}</button>
                        <button className="calc-button function" data-key="cosh">{state.isInverse ? 'acosh' : 'cosh'}</button>
                        <button className="calc-button function" data-key="tanh">{state.isInverse ? 'atanh' : 'tanh'}</button>
                        <button className="calc-button function" data-key="sqrt">{state.isInverse ? 'x²' : '√'}</button>
                        <button className="calc-button function" data-key="cbrt">{state.isInverse ? 'x³' : '∛'}</button>
                      </div>
                      
                      <div className="calc-button-row">
                        <button className="calc-button function" data-key="π">π</button>
                        <button className="calc-button function" data-key="e">e</button>
                        <button className="calc-button function" data-key="factorial">x!</button>
                        <button className="calc-button function" data-key="^">x^y</button>
                        <button className="calc-button function" data-key="reciprocal">1/x</button>
                      </div>
                      
                      <div className="calc-button-row">
                        <button className="calc-button" data-key="7">7</button>
                        <button className="calc-button" data-key="8">8</button>
                        <button className="calc-button" data-key="9">9</button>
                        <button className="calc-button function" data-key="÷">&divide;</button>
                        <button className="calc-button function" data-key="mod">mod</button>
                      </div>
                      
                      <div className="calc-button-row">
                        <button className="calc-button" data-key="4">4</button>
                        <button className="calc-button" data-key="5">5</button>
                        <button className="calc-button" data-key="6">6</button>
                        <button className="calc-button function" data-key="×">&times;</button>
                        <button className="calc-button function" data-key="abs">|x|</button>
                      </div>
                      
                      <div className="calc-button-row">
                        <button className="calc-button" data-key="1">1</button>
                        <button className="calc-button" data-key="2">2</button>
                        <button className="calc-button" data-key="3">3</button>
                        <button className="calc-button function" data-key="-">-</button>
                        <button className="calc-button function" data-key="round">rnd</button>
                      </div>
                      
                      <div className="calc-button-row">
                        <button className="calc-button double" data-key="0">0</button>
                        <button className="calc-button" data-key=".">.</button>
                        <button className="calc-button function" data-key="+">&plus;</button>
                        <button className="calc-button function" data-key="=">&equals;</button>
                      </div>
                      
                      {/* Memory Row */}
                      <div className="calc-button-row">
                        <button className="calc-button memory" data-key="MS">MS</button>
                        <button className="calc-button memory" data-key="MR">MR</button>
                        <button className="calc-button memory" data-key="M+">M+</button>
                        <button className="calc-button memory" data-key="M-">M-</button>
                        <button className="calc-button memory" data-key="MC">MC</button>
                      </div>
                    </>
                  )}

                  {state.mode === 'graphing' && (
                    <div className="graphing-mode">
                      <div className="graph-controls">
                        <div className="function-input">
                          <label>Function: f(x) = </label>
                          <input 
                            type="text" 
                            value={state.graphFunction}
                            onChange={(e) => setState(prev => ({ ...prev, graphFunction: e.target.value }))}
                            placeholder="Enter function (e.g., x^2, sin(x), log(x))"
                            className="form-control"
                          />
                          <button 
                            className="btn btn-primary" 
                            onClick={() => plotFunction(state.graphFunction)}
                          >
                            Plot
                          </button>
                        </div>
                        
                        <div className="range-controls">
                          <div className="range-group">
                            <label>X Range:</label>
                            <input 
                              type="number" 
                              value={state.graphXMin}
                              onChange={(e) => setState(prev => ({ ...prev, graphXMin: Number(e.target.value) }))}
                              className="form-control range-input"
                            />
                            <span>to</span>
                            <input 
                              type="number" 
                              value={state.graphXMax}
                              onChange={(e) => setState(prev => ({ ...prev, graphXMax: Number(e.target.value) }))}
                              className="form-control range-input"
                            />
                          </div>
                          
                          <div className="range-group">
                            <label>Y Range:</label>
                            <input 
                              type="number" 
                              value={state.graphYMin}
                              onChange={(e) => setState(prev => ({ ...prev, graphYMin: Number(e.target.value) }))}
                              className="form-control range-input"
                            />
                            <span>to</span>
                            <input 
                              type="number" 
                              value={state.graphYMax}
                              onChange={(e) => setState(prev => ({ ...prev, graphYMax: Number(e.target.value) }))}
                              className="form-control range-input"
                            />
                          </div>
                          
                          <button 
                            className="btn btn-secondary" 
                            onClick={() => updateGraphRange(state.graphXMin, state.graphXMax, state.graphYMin, state.graphYMax)}
                          >
                            Update Range
                          </button>
                        </div>
                      </div>
                      
                      <div className="graph-container">
                        {state.graphData.length > 0 ? (
                          <Line
                            data={{
                              datasets: [{
                                label: `f(x) = ${state.graphFunction}`,
                                data: state.graphData,
                                borderColor: 'rgb(75, 192, 192)',
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderWidth: 2,
                                pointRadius: 0,
                                tension: 0.1
                              }]
                            }}
                            options={{
                              responsive: true,
                              plugins: {
                                title: {
                                  display: true,
                                  text: `Graph of f(x) = ${state.graphFunction}`
                                },
                                legend: {
                                  display: true
                                }
                              },
                              scales: {
                                x: {
                                  type: 'linear',
                                  position: 'bottom',
                                  min: state.graphXMin,
                                  max: state.graphXMax,
                                  title: {
                                    display: true,
                                    text: 'x'
                                  }
                                },
                                y: {
                                  min: state.graphYMin,
                                  max: state.graphYMax,
                                  title: {
                                    display: true,
                                    text: 'f(x)'
                                  }
                                }
                              }
                            }}
                          />
                        ) : (
                          <div className="no-graph">
                            <p>Enter a function and click "Plot" to see the graph</p>
                            <div className="example-functions">
                              <h5>Example functions:</h5>
                              <button className="btn btn-outline-primary btn-sm" onClick={() => { setState(prev => ({ ...prev, graphFunction: 'x^2' })); plotFunction('x^2'); }}>x²</button>
                              <button className="btn btn-outline-primary btn-sm" onClick={() => { setState(prev => ({ ...prev, graphFunction: 'sin(x)' })); plotFunction('sin(x)'); }}>sin(x)</button>
                              <button className="btn btn-outline-primary btn-sm" onClick={() => { setState(prev => ({ ...prev, graphFunction: 'cos(x)' })); plotFunction('cos(x)'); }}>cos(x)</button>
                              <button className="btn btn-outline-primary btn-sm" onClick={() => { setState(prev => ({ ...prev, graphFunction: 'log(x)' })); plotFunction('log(x)'); }}>log(x)</button>
                              <button className="btn btn-outline-primary btn-sm" onClick={() => { setState(prev => ({ ...prev, graphFunction: 'x^3 - 2*x + 1' })); plotFunction('x^3 - 2*x + 1'); }}>x³ - 2x + 1</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Other modes will be implemented in subsequent updates */}
                  {state.mode !== 'basic' && state.mode !== 'scientific' && state.mode !== 'graphing' && (
                    <div className="coming-soon">
                      <h4>{state.mode.charAt(0).toUpperCase() + state.mode.slice(1)} Mode</h4>
                      <p>Advanced {state.mode} calculator features coming soon!</p>
                      <button className="btn btn-primary" onClick={() => switchMode('scientific')}>
                        Switch to Scientific Mode
                      </button>
                    </div>
                  )}
                </section>

                {/* History Panel */}
                {state.history.length > 0 && (
                  <div className="history-panel">
                    <h6>Recent Calculations</h6>
                    <div className="history-list">
                      {state.history.slice(0, 5).map((item, index) => (
                        <div key={index} className="history-item">
                          <small>{item}</small>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="section-modern mt-5">
          <div className="card box-shadow fade-in">
            <div className="card-body">
              <h2 className="mb-4">Advanced Scientific Calculator</h2>
              <p>This flagship calculator demonstrates enterprise-level mathematical capabilities with multiple specialized modes:</p>
              
              <div className="row">
                <div className="col-md-6 mb-4">
                  <h4 className="text-primary">🔬 Scientific Mode</h4>
                  <ul className="list-unstyled">
                    <li>✓ Trigonometric functions (sin, cos, tan)</li>
                    <li>✓ Hyperbolic functions (sinh, cosh, tanh)</li>
                    <li>✓ Logarithmic functions (ln, log, log₂)</li>
                    <li>✓ Power & root operations (√, ∛, x², x³)</li>
                    <li>✓ Mathematical constants (π, e, φ, γ)</li>
                    <li>✓ Factorial & gamma functions</li>
                    <li>✓ Inverse & angle unit switching</li>
                  </ul>
                </div>
                
                <div className="col-md-6 mb-4">
                  <h4 className="text-success">💾 Memory System</h4>
                  <ul className="list-unstyled">
                    <li>✓ 5 independent memory slots</li>
                    <li>✓ Memory store, recall, add, subtract</li>
                    <li>✓ Persistent memory across calculations</li>
                    <li>✓ Visual memory status display</li>
                  </ul>
                  
                  <h4 className="text-warning mt-3">📊 Advanced Features</h4>
                  <ul className="list-unstyled">
                    <li>✓ Calculation history tracking</li>
                    <li>✓ Expression evaluation</li>
                    <li>✓ Multiple calculator modes</li>
                    <li>✓ Responsive glassmorphic design</li>
                  </ul>
                </div>
              </div>
              
              <h3 className="mt-4 mb-3">Calculator Modes</h3>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <div className="feature-card p-3 border rounded">
                    <h5 className="text-primary">🧮 Basic</h5>
                    <p>Standard arithmetic operations with clean interface</p>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="feature-card p-3 border rounded">
                    <h5 className="text-success">🔬 Scientific</h5>
                    <p>Advanced mathematical functions and constants</p>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="feature-card p-3 border rounded">
                    <h5 className="text-info">💻 Programming</h5>
                    <p>Binary, hex, octal operations (Coming Soon)</p>
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-4 mb-3">
                  <div className="feature-card p-3 border rounded">
                    <h5 className="text-warning">🔢 Matrix</h5>
                    <p>Linear algebra operations (Coming Soon)</p>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="feature-card p-3 border rounded">
                    <h5 className="text-danger">📈 Statistics</h5>
                    <p>Statistical analysis functions (Coming Soon)</p>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="feature-card p-3 border rounded">
                    <h5 className="text-secondary">📊 Graphing</h5>
                    <p>Function plotting capabilities (Coming Soon)</p>
                  </div>
                </div>
              </div>
              
              <h3 className="mt-4 mb-3">Technical Implementation</h3>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <h5>🏗️ Architecture</h5>
                  <ul className="list-unstyled">
                    <li>• React 18 with TypeScript</li>
                    <li>• Advanced state management with hooks</li>
                    <li>• Math.js for precise calculations</li>
                    <li>• Modular component architecture</li>
                    <li>• Performance monitoring integration</li>
                  </ul>
                </div>
                <div className="col-md-6 mb-3">
                  <h5>🎨 Design Features</h5>
                  <ul className="list-unstyled">
                    <li>• Glassmorphic UI with backdrop blur</li>
                    <li>• Responsive design for all devices</li>
                    <li>• Smooth animations and transitions</li>
                    <li>• Accessibility-focused interactions</li>
                    <li>• Dark theme optimized</li>
                  </ul>
                </div>
              </div>
              
              <div className="alert alert-primary mt-4">
                <i className="fa fa-rocket me-2"></i>
                <strong>Enterprise Ready:</strong> This calculator demonstrates advanced React patterns, 
                complex state management, mathematical computation algorithms, and modern UI/UX principles 
                suitable for enterprise-level applications.
              </div>
              
              <div className="alert alert-info mt-3">
                <i className="fa fa-lightbulb me-2"></i>
                <strong>Pro Tip:</strong> Try the scientific mode for advanced functions, or divide by zero for a special surprise effect! 💥
              </div>
              
              <div className="text-center mt-4">
                <Link to="/projects" className="btn btn-outline-success me-3">
                  <i className="fa fa-code me-2"></i>View All Projects
                </Link>
                <button className="btn btn-primary" onClick={() => switchMode('scientific')}>
                  <i className="fa fa-calculator me-2"></i>Try Scientific Mode
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Calculator;