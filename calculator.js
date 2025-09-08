let currentExpression = '';
const display = document.getElementById('display');

function addToDisplay(value) {
    if (display.textContent === '0' && value !== '.') {
        display.textContent = '';
    }
    currentExpression += value;
    display.textContent = currentExpression;
}

function clearDisplay() {
    currentExpression = '';
    display.textContent = '0';
}

function calculateResult() {
    try {
        // Here we use the math.evaluate() function to handle the full expression.
        // It can parse and calculate complex strings, including variables and functions.
        // Math.js already has `pi` and `e` defined, so we don't need to do anything special for them.
        const result = math.evaluate(currentExpression);
        display.textContent = result;
        currentExpression = String(result);
    } catch (e) {
        // If there's an error in the expression (e.g., syntax error), show an error message.
        display.textContent = 'Error';
        currentExpression = '';
    }
}
