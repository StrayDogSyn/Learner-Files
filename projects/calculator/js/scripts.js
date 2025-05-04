class Calculator {
  constructor() {
    this.state = {
      runningTotal: 0,
      buffer: "0",
      previousOperator: null,
      needsReset: false,
      lastOperation: "",
      memory: 0,
    };
    this.screen = document.querySelector(".screen");
    this.init();
  }

  init() {
    document.querySelector(".calc-buttons")
      .addEventListener("click", this.handleClick.bind(this));
      
    // Add keyboard support
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    
    // Initial render
    this.render();
  }
  
  handleKeyDown(event) {
    const key = event.key;
    
    // Prevent default behavior for calculator keys
    if (
      ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-", "*", "/", "=", "Enter", "Escape", "Backspace", "c", "C"].includes(key)
    ) {
      event.preventDefault();
    }
    
    // Map keyboard keys to calculator buttons
    if (this.isNumber(key)) {
      this.handleNumber(key);
    } else if (key === "+" || key === "-") {
      this.handleSymbol(key);
    } else if (key === "*") {
      this.handleSymbol("×");
    } else if (key === "/") {
      this.handleSymbol("÷");
    } else if (key === "=" || key === "Enter") {
      this.handleSymbol("=");
    } else if (key === "Escape" || key.toLowerCase() === "c") {
      this.handleSymbol("C");
    } else if (key === "Backspace") {
      this.handleSymbol("←");
    }
    
    this.render();
  }

  isNumber(value) {
    return !isNaN(value) && value !== " ";
  }

  handleClick(event) {
    if (!event.target.classList.contains("calc-button")) return;
    
    const value = event.target.innerText;
    
    // Add button press animation
    event.target.classList.add("pulse");
    setTimeout(() => {
      event.target.classList.remove("pulse");
    }, 150);
    
    this.isNumber(value) ? this.handleNumber(value) : this.handleSymbol(value);
    this.render();
  }

  handleNumber(value) {
    // Prevent extremely long numbers
    if (this.state.buffer.length >= 12 && !this.state.needsReset) {
      return;
    }
    
    if (this.state.buffer === "0" || this.state.needsReset) {
      this.state.buffer = value;
      this.state.needsReset = false;
    } else {
      this.state.buffer += value;
    }
  }

  handleSymbol(symbol) {
    switch (symbol) {
      case "C":
        this.reset();
        break;
      case "←":
        this.backspace();
        break;
      case "=":
        this.calculate();
        break;
      default:
        this.handleOperator(symbol);
    }
  }

  reset() {
    this.state = {
      runningTotal: 0,
      buffer: "0",
      previousOperator: null,
      needsReset: false,
      lastOperation: "",
      memory: this.state.memory // Preserve memory across reset
    };
  }

  backspace() {
    if (this.state.buffer.length === 1) {
      this.state.buffer = "0";
    } else {
      this.state.buffer = this.state.buffer.slice(0, -1);
    }
  }

  handleOperator(operator) {
    const value = parseFloat(this.state.buffer);
    
    // Store the operation for display purposes
    this.state.lastOperation = `${this.state.runningTotal} ${operator} ${value}`;

    if (this.state.runningTotal === 0) {
      this.state.runningTotal = value;
    } else {
      this.state.runningTotal = this.executeOperation(
        this.state.runningTotal,
        value,
        this.state.previousOperator
      );
    }

    this.state.previousOperator = operator;
    this.state.buffer = this.formatNumber(this.state.runningTotal.toString());
    this.state.needsReset = true;
  }

  calculate() {
    if (!this.state.previousOperator) return;

    const value = parseFloat(this.state.buffer);
    
    // Update the last operation for display
    this.state.lastOperation = `${this.state.runningTotal} ${this.state.previousOperator} ${value} =`;
    
    this.state.runningTotal = this.executeOperation(
      this.state.runningTotal,
      value,
      this.state.previousOperator
    );
    
    this.state.buffer = this.formatNumber(this.state.runningTotal.toString());
    this.state.previousOperator = null;
  }

  executeOperation(a, b, operator) {
    switch (operator) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": 
        if (b === 0) {
          return "Error";
        }
        return a / b;
      default: return b;
    }
  }
  
  formatNumber(number) {
    // Handle error cases
    if (number === "Error") return number;
    
    // Check if number is too large
    if (parseFloat(number) > 1e12) {
      return parseFloat(number).toExponential(2);
    }
    
    // Format to avoid floating point errors
    const parsed = parseFloat(number);
    
    // Handle decimals (max 8 decimal places)
    if (number.includes('.')) {
      const parts = number.split('.');
      if (parts[1].length > 8) {
        return parsed.toFixed(8).replace(/\.?0+$/, '');
      }
    }
    
    return number;
  }

  render() {
    // Handle display for errors
    if (this.state.buffer === "Error") {
      this.screen.innerText = "Error";
      return;
    }
    
    // Format large numbers with commas
    const displayValue = this.formatNumber(this.state.buffer);
    this.screen.innerText = displayValue;
  }
}

// Initialize calculator
document.addEventListener('DOMContentLoaded', function() {
  new Calculator();
  
  // Add class to enable animations after load
  document.querySelectorAll('.fade-in').forEach(el => {
    el.classList.add('visible');
  });
});