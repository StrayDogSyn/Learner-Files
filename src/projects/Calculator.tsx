import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../css/modern.css';
import './Calculator.css';

interface CalculatorState {
  runningTotal: number;
  buffer: string;
  previousOperator: string | null;
  needsReset: boolean;
  lastOperation: string;
  memory: number;
}

const Calculator: React.FC = () => {
  const [state, setState] = useState<CalculatorState>({
    runningTotal: 0,
    buffer: "0",
    previousOperator: null,
    needsReset: false,
    lastOperation: "",
    memory: 0,
  });

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
      default: return b;
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
      memory: prevState.memory
    }));
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
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="calculator-page">
      <div className="container-modern py-4">
        <header className="text-center mb-5 fade-in calculator-main-header">
          <h1 className="display-4 text-white fw-bold mb-3">
            <i className="fa fa-calculator me-2"></i>
            Calculator
          </h1>
          <p className="lead text-white">A sleek, functional calculator built with React &amp; TypeScript</p>
        </header>

        <section className="section-modern">
          <div className="card box-shadow fade-in">
            <div className="card-body p-4">
              <div className="wrapper">
                <section className={`screen ${state.buffer === "Error" ? 'error' : ''}`}>
                  {formatNumber(state.buffer)}
                </section>
                
                <section className="calc-buttons" onClick={handleClick}>
                  <div className="calc-button-row">
                    <button className="calc-button double" data-key="Esc" tabIndex={1} aria-label="Clear calculator" title="Clear (Escape)">C</button>
                    <button className="calc-button" data-key="←" tabIndex={2} aria-label="Backspace" title="Backspace (Delete)">&larr;</button>
                    <button className="calc-button function" data-key="/" tabIndex={3} aria-label="Divide" title="Divide (/ or Numpad /)">&divide;</button>
                  </div>
                  <div className="calc-button-row">
                    <button className="calc-button" data-key="7" tabIndex={4} aria-label="Seven" title="Seven (7 or Numpad 7)">7</button>
                    <button className="calc-button" data-key="8" tabIndex={5} aria-label="Eight" title="Eight (8 or Numpad 8)">8</button>
                    <button className="calc-button" data-key="9" tabIndex={6} aria-label="Nine" title="Nine (9 or Numpad 9)">9</button>
                    <button className="calc-button function" data-key="*" tabIndex={7} aria-label="Multiply" title="Multiply (* or Numpad *)">&times;</button>
                  </div>
                  <div className="calc-button-row">
                    <button className="calc-button" data-key="4" tabIndex={8} aria-label="Four" title="Four (4 or Numpad 4)">4</button>
                    <button className="calc-button" data-key="5" tabIndex={9} aria-label="Five" title="Five (5 or Numpad 5)">5</button>
                    <button className="calc-button" data-key="6" tabIndex={10} aria-label="Six" title="Six (6 or Numpad 6)">6</button>
                    <button className="calc-button function" data-key="-" tabIndex={11} aria-label="Subtract" title="Subtract (- or Numpad -)">-</button>
                  </div>
                  <div className="calc-button-row">
                    <button className="calc-button" data-key="1" tabIndex={12} aria-label="One" title="One (1 or Numpad 1)">1</button>
                    <button className="calc-button" data-key="2" tabIndex={13} aria-label="Two" title="Two (2 or Numpad 2)">2</button>
                    <button className="calc-button" data-key="3" tabIndex={14} aria-label="Three" title="Three (3 or Numpad 3)">3</button>
                    <button className="calc-button function" data-key="+" tabIndex={15} aria-label="Add" title="Add (+ or Numpad +)">&plus;</button>
                  </div>
                  <div className="calc-button-row">
                    <button className="calc-button triple" data-key="0" tabIndex={16} aria-label="Zero" title="Zero (0 or Numpad 0)">0</button>
                    <button className="calc-button function" data-key="=" tabIndex={17} aria-label="Equals" title="Calculate (= or Enter)">&equals;</button>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>

        <section className="section-modern mt-5">
          <div className="card box-shadow fade-in">
            <div className="card-body">
              <h2 className="mb-4">About This Project</h2>
              <p>This calculator was built following modern web development practices, including:</p>
              <ul>
                <li>React with TypeScript for type safety</li>
                <li>React hooks for state management</li>
                <li>CSS styling with flexbox for layout</li>
                <li>Responsive design that works on all screen sizes</li>
                <li><strong>Full keyboard support including numpad functionality</strong></li>
              </ul>
              
              <h3 className="mt-4 mb-3">Keyboard Controls</h3>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <h5>Numbers &amp; Operations</h5>
                  <ul className="list-unstyled">
                    <li><kbd>0-9</kbd> or <kbd>Numpad 0-9</kbd> - Number input</li>
                    <li><kbd>+</kbd> or <kbd>Numpad +</kbd> - Addition</li>
                    <li><kbd>-</kbd> or <kbd>Numpad -</kbd> - Subtraction</li>
                    <li><kbd>*</kbd> or <kbd>Numpad *</kbd> - Multiplication</li>
                    <li><kbd>/</kbd> or <kbd>Numpad /</kbd> - Division</li>
                  </ul>
                </div>
                <div className="col-md-6 mb-3">
                  <h5>Special Functions</h5>
                  <ul className="list-unstyled">
                    <li><kbd>=</kbd> or <kbd>Enter</kbd> or <kbd>Numpad Enter</kbd> - Calculate</li>
                    <li><kbd>Escape</kbd> or <kbd>C</kbd> - Clear</li>
                    <li><kbd>Backspace</kbd> or <kbd>Delete</kbd> - Remove last digit</li>
                    <li><kbd>.</kbd> or <kbd>Numpad .</kbd> - Decimal point</li>
                  </ul>
                </div>
              </div>
              
              <div className="alert alert-info mt-3">
                <i className="fa fa-lightbulb me-2"></i>
                <strong>Pro Tip:</strong> Try dividing by zero for a special surprise effect! 💥
              </div>
              
              <div className="text-center mt-4">
                <Link to="/projects" className="btn btn-outline-success">
                  <i className="fa fa-code me-2"></i>View All Projects
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Calculator;