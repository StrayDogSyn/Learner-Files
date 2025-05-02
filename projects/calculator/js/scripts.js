class Calculator {
  constructor() {
    this.state = {
      runningTotal: 0,
      buffer: "0",
      previousOperator: null,
      needsReset: false
    };
    this.screen = document.querySelector(".screen");
    this.init();
  }

  init() {
    document.querySelector(".calc-buttons")
      .addEventListener("click", this.handleClick.bind(this));
  }

  isNumber(value) {
    return !isNaN(value) && value !== " ";
  }

  handleClick(event) {
    if (!event.target.classList.contains("calc-button")) return;
    
    const value = event.target.innerText;
    this.isNumber(value) ? this.handleNumber(value) : this.handleSymbol(value);
    this.render();
  }

  handleNumber(value) {
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
      needsReset: false
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
    this.state.buffer = this.state.runningTotal.toString();
    this.state.needsReset = true;
  }

  calculate() {
    if (!this.state.previousOperator) return;

    const value = parseFloat(this.state.buffer);
    this.state.runningTotal = this.executeOperation(
      this.state.runningTotal,
      value,
      this.state.previousOperator
    );
    this.state.buffer = this.state.runningTotal.toString();
    this.state.previousOperator = null;
  }

  executeOperation(a, b, operator) {
    switch (operator) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b !== 0 ? a / b : "Error";
      default: return b;
    }
  }

  render() {
    this.screen.innerText = this.state.buffer;
  }
}

// Initialize calculator
new Calculator();