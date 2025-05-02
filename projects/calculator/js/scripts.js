class Calculator {
  constructor() {
    this.state = {
      runningTotal: 0,
      buffer: '0',
      previousOperator: null,
      needsReset: false
    };

    this.screen = document.querySelector('.screen');
    this.init();
  }

  init() {
    document.querySelector('.calc-buttons')
      .addEventListener('click', (event) => this.handleClick(event));
  }

  handleClick(event) {
    const value = event.target.innerText;
    if (!value) return;

    if (this.isNumber(value)) {
      this.handleNumber(value);
    } else {
      this.handleSymbol(value);
    }
    
    this.render();
  }

  isNumber(value) {
    return !isNaN(parseInt(value));
  }

  handleNumber(value) {
    const { buffer, needsReset } = this.state;

    if (buffer === '0' || needsReset) {
      this.state.buffer = value;
      this.state.needsReset = false;
    } else {
      this.state.buffer += value;
    }
  }

  handleSymbol(value) {
    switch (value) {
      case 'C':
        this.reset();
        break;
      case '=':
        this.calculate();
        break;
      case '←':
        this.backspace();
        break;
      case '+':
      case '-':
      case '×':
      case '÷':
        this.handleOperator(value);
        break;
    }
  }

  reset() {
    this.state = {
      runningTotal: 0,
      buffer: '0',
      previousOperator: null,
      needsReset: false
    };
  }

  backspace() {
    const { buffer } = this.state;
    if (buffer.length === 1) {
      this.state.buffer = '0';
    } else {
      this.state.buffer = buffer.slice(0, -1);
    }
  }

  handleOperator(operator) {
    const { buffer, runningTotal, previousOperator } = this.state;
    const currentValue = parseFloat(buffer);

    if (runningTotal === 0) {
      this.state.runningTotal = currentValue;
    } else if (previousOperator) {
      const result = this.executeOperation(runningTotal, currentValue, previousOperator);
      this.state.runningTotal = result;
      this.state.buffer = String(result);
    }

    this.state.needsReset = true;
    this.state.previousOperator = operator;
  }

  calculate() {
    const { buffer, runningTotal, previousOperator } = this.state;
    
    if (!previousOperator) return;

    const currentValue = parseFloat(buffer);
    const result = this.executeOperation(runningTotal, currentValue, previousOperator);
    
    this.state.runningTotal = 0;
    this.state.buffer = String(result);
    this.state.previousOperator = null;
    this.state.needsReset = true;
  }

  executeOperation(a, b, operator) {
    switch (operator) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 'Error';
      default: return b;
    }
  }

  render() {
    this.screen.innerText = this.state.buffer;
  }
}

// Initialize calculator
new Calculator();