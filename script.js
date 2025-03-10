class Calculator {
    // Initialize the calculator with display elements and clear the state
    constructor(previousOperandTextElement, currentOperandTextElement) {
      this.previousOperandTextElement = previousOperandTextElement
      this.currentOperandTextElement = currentOperandTextElement
      this.clear()
      this.history = []     // Initialize history for storing calculations
    }
  
    clear() {
      // Reset the current and previous operands and the operation
      this.currentOperand = ''
      this.previousOperand = ''
      this.operation = undefined
    }
  
    delete() {
      // Remove the last character from the current operand
      this.currentOperand = this.currentOperand.toString().slice(0, -1)
    }
  
    appendNumber(number) {
      // Append a number to the current operand, avoiding multiple decimals
      if (number === '.' && this.currentOperand.includes('.')) return
      this.currentOperand = this.currentOperand.toString() + number.toString()
    }
  
    chooseOperation(operation) {
      // Set the operation and prepare for the next operand
      if (this.currentOperand === '') return
      if (this.previousOperand !== '') {
        this.compute()
      }
      this.operation = operation
      this.previousOperand = this.currentOperand
      this.currentOperand = ''
    }

    addToHistory(calculation) {
      // Add a calculation to the history and update the display
      this.history.push(calculation)
      this.updateHistoryDisplay()
    }

    updateHistoryDisplay() {
      // Update the history display with the last 5 calculations
      const historyList = document.getElementById('history-list')
      historyList.innerHTML = ''
      this.history.slice(-5).forEach(calc => {
        const li = document.createElement('li')
        li.innerText = calc
        historyList.appendChild(li)
      })
    }
  
  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '*':
        computation = prev * current;
        break;
      case '÷':
        computation = current === 0 ? 'Error' : prev / current;
        break;
      case '^':
        computation = Math.pow(prev, current);
        break;
      case '√':
        computation = prev < 0 ? 'Error' : Math.sqrt(prev);
        break;
      case '%':
        computation = prev % current;
        break;
      default:
        return;
    }

    // Round the result to 13 decimal places unconditionally
    if (computation !== 'Error') {
      computation = parseFloat(computation.toFixed(13));
    }

    this.currentOperand = computation;
    if (computation !== 'Error') {
      this.addToHistory(`${prev} ${this.operation} ${current} = ${computation}`);
    }

    this.operation = undefined;
    this.previousOperand = '';
  }

  
    getDisplayNumber(number) {
      // Format the number for display, handling decimals and commas
      const stringNumber = number.toString()
      const integerDigits = parseFloat(stringNumber.split('.')[0])
      const decimalDigits = stringNumber.split('.')[1]
      let integerDisplay
      if (isNaN(integerDigits)) {
        integerDisplay = ''
      } else {
        integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
      }
      if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`
      } else {
        return integerDisplay
      }
    }
  
    updateDisplay() {
      // Update the calculator display with the current and previous operands
      this.currentOperandTextElement.innerText =
        this.getDisplayNumber(this.currentOperand)
      if (this.operation != null) {
        this.previousOperandTextElement.innerText =
          `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
      } else {
        this.previousOperandTextElement.innerText = ''
      }
    }
  }
  
  // Select all necessary DOM elements
  const numberButtons = document.querySelectorAll('[data-number]')
  const operationButtons = document.querySelectorAll('[data-operation]')
  const equalsButton = document.querySelector('[data-equals]')
  const deleteButton = document.querySelector('[data-delete]')
  const allClearButton = document.querySelector('[data-all-clear]')
  const previousOperandTextElement = document.querySelector('[data-previous-operand]')
  const currentOperandTextElement = document.querySelector('[data-current-operand]')
  const clearButton = document.querySelector('#clear-history')

  // Create a new Calculator instance
  const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

  // Add event listeners to number buttons
  numberButtons.forEach(button => {
    button.addEventListener('click', () => {
      calculator.appendNumber(button.innerText)
      calculator.updateDisplay()
    })
  })

  // Add event listener to clear-history button
  clearButton.addEventListener('click', () => {
    calculator.history = []
    calculator.updateHistoryDisplay()
  })
  
  // Add event listeners to operation buttons
  operationButtons.forEach(button => {
    button.addEventListener('click', () => {
      calculator.chooseOperation(button.innerText)
      calculator.updateDisplay()
    })
  })
  
  // Add event listener to equals button
  equalsButton.addEventListener('click', button => {
    calculator.compute()
    calculator.updateDisplay()
  })
  
  // Add event listener to all-clear button
  allClearButton.addEventListener('click', button => {
    calculator.clear()
    calculator.updateDisplay()
  })
  
  // Add event listener to delete button
  deleteButton.addEventListener('click', button => {
    calculator.delete()
    calculator.updateDisplay()
  })

  // Add event listener to keyboard inputs
document.addEventListener('keydown', (event) => {
  if (!isNaN(event.key) || event.key === '.') {
    calculator.appendNumber(event.key);
    calculator.updateDisplay();
  } else if (['+', '-', '*', '/'].includes(event.key)) {
    calculator.chooseOperation(event.key === '/' ? '÷' : event.key);
    calculator.updateDisplay();
  } else if (event.key === 'Enter') {
    calculator.compute();
    calculator.updateDisplay();
  } else if (event.key === 'Backspace') {
    calculator.delete();
    calculator.updateDisplay();
  } else if (event.key === 'Escape') {
    calculator.clear();
    calculator.updateDisplay();
  }
});
