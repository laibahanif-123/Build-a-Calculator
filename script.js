
        const display = document.getElementById('display');
        let currentInput = '0'; 
        let operator = null;
        let firstOperand = null;
        let waitingForSecondOperand = false; 
        /**
         * Updates the display with the given value.
         * @param {string} value - The value to display.
         */
        function updateDisplay(value) {
            display.textContent = value;
        }

        /**
         * Appends a value (number or decimal) to the current input.
         * @param {string} value - The number or decimal point to append.
         */
        function appendValue(value) {
            if (waitingForSecondOperand) {
                currentInput = value;
                waitingForSecondOperand = false;
            } else {
           
                if (value === '.' && currentInput.includes('.')) {
                    return;
                }
                
                if (currentInput === '0' && value !== '.') {
                    currentInput = value;
                } else {
                    currentInput += value;
                }
            }
            updateDisplay(currentInput);
        }

        /**
         * Clears the display and resets all calculator states.
         */
        function clearDisplay() {
            currentInput = '0';
            operator = null;
            firstOperand = null;
            waitingForSecondOperand = false;
            updateDisplay(currentInput);
        }

        /**
         * Handles operator input (+, -, *, /).
         * @param {string} nextOperator - The operator that was pressed.
         */
        function handleOperator(nextOperator) {
            const inputValue = parseFloat(currentInput);

            if (operator && waitingForSecondOperand) {
                operator = nextOperator;
                return;
            }

            if (firstOperand === null) {
                firstOperand = inputValue;
            } else if (operator) {
                const result = performCalculation[operator](firstOperand, inputValue);
                currentInput = String(result);
                firstOperand = result;
            }

            waitingForSecondOperand = true;
            operator = nextOperator;
            updateDisplay(currentInput); 
        }

        // Object to hold calculation functions for each operator
        const performCalculation = {
            '/': (first, second) => first / second,
            '*': (first, second) => first * second,
            '+': (first, second) => first + second,
            '-': (first, second) => first - second,
            '=': (first, second) => second 
        };

       
        function calculateResult() {
            if (operator === null || waitingForSecondOperand) {
                return; 
            }

            const inputValue = parseFloat(currentInput);
            let result;

            if (firstOperand !== null) {
                result = performCalculation[operator](firstOperand, inputValue);
            } else {
                result = inputValue;
            }

            currentInput = String(result);
            firstOperand = null; 
            operator = null; r
            waitingForSecondOperand = false; 
            updateDisplay(currentInput);
        }

    
        document.addEventListener('keydown', (event) => {
            const key = event.key;

            if (key >= '0' && key <= '9' || key === '.') {
                appendValue(key);
            } else if (key === '+' || key === '-' || key === '*' || key === '/') {
                handleOperator(key);
            } else if (key === 'Enter' || key === '=') {
                event.preventDefault();
                calculateResult();
            } else if (key === 'Escape' || key === 'Delete') { 
                clearDisplay();
            } else if (key === 'Backspace') {
               
                currentInput = currentInput.slice(0, -1);
                if (currentInput === '') {
                    currentInput = '0';
                }
                updateDisplay(currentInput);
            }
        });

       
        updateDisplay(currentInput);

        // Attach event listeners to buttons
        document.querySelectorAll('.button').forEach(button => {
            if (button.classList.contains('clear')) {
                button.onclick = clearDisplay;
            } else if (button.classList.contains('equals')) {
                button.onclick = calculateResult;
            } else if (button.classList.contains('operator')) {
                button.onclick = () => handleOperator(button.textContent);
            } else {
                button.onclick = () => appendValue(button.textContent);
            }
        });
