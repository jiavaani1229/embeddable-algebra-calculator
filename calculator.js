let currentExpression = '';
const display = document.getElementById('display');

// This scope object will hold our variables and their default values.
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
        let result;
        const expression = currentExpression.trim();

        // Check for variable assignment first
        const equalsIndex = expression.indexOf('=');
        if (equalsIndex !== -1) {
            const assignment = expression.substring(0, equalsIndex).trim();
            const value = expression.substring(equalsIndex + 1).trim();
            scope[assignment] = math.evaluate(value, scope);
            display.textContent = `${assignment} = ${scope[assignment]}`;
            currentExpression = '';
            return;
        }

        // Check if the expression contains a division or other symbolic operation
        if (expression.includes('/')) {
            // Use math.rationalize() for symbolic polynomial division
            // We pass the scope to handle any defined variables
            const simplifiedNode = math.rationalize(expression, scope, true);
            
            // Check if the result is a simplified polynomial (denominator is 1 or a constant)
            if (simplifiedNode.denominator.isConstantNode && simplifiedNode.denominator.value === 1) {
                // If the denominator is 1, it's a clean polynomial result.
                result = simplifiedNode.numerator.toString();
            } else {
                // Otherwise, it's still a fraction or a complex expression, so display it as is.
                result = simplifiedNode.expression.toString();
            }
        } else {
            // For all other expressions, use the standard evaluate()
            result = math.evaluate(expression, scope);
        }

        display.textContent = result;
        currentExpression = String(result);

    } catch (e) {
        display.textContent = 'Error';
        currentExpression = '';
    }
}
