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
        const result = math.evaluate(currentExpression);
        display.textContent = result;
        currentExpression = String(result);
    } catch (e) {
        display.textContent = 'Error';
        currentExpression = '';
    }
}
