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
        // Here's where you'll want to use Math.js for advanced functions and variables.
        // For a basic start, we use eval().
        const result = eval(currentExpression); 
        display.textContent = result;
        currentExpression = String(result);
    } catch (e) {
        display.textContent = 'Error';
        currentExpression = '';
    }
}
