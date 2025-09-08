let currentExpression = '';
const display = document.getElementById('display');

// This scope object will hold our variables and their default values.
// We'll reset it to its default state each time a calculation is made.
let scope = {
  x: 0,
  y: 0
};

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
        // Use a regular expression to find any variables in the expression.
        const variableMatch = currentExpression.match(/[a-zA-Z]/g);

        // If variables are found, update their values in the scope.
        // For this simple calculator, we'll assume any new variable
        // is meant to be set with a value from the user's input.
        // A more advanced approach would involve parsing equations,
        // but this will handle simple cases like "x=5"
        const equalsIndex = currentExpression.indexOf('=');
        if (equalsIndex !== -1) {
            const assignment = currentExpression.substring(0, equalsIndex).trim();
            const value = currentExpression.substring(equalsIndex + 1).trim();
            scope[assignment] = math.evaluate(value, scope);
            display.textContent = `${assignment} = ${scope[assignment]}`;
            currentExpression = '';
            return;
        }

        // Pass the scope to math.evaluate()
        const result = math.evaluate(currentExpression, scope);
        display.textContent = result;
        currentExpression = String(result);
    } catch (e) {
        display.textContent = 'Error';
        currentExpression = '';
    }
}
