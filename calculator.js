let currentExpression = '';
const display = document.getElementById('display');

// No need for a scope object with default values if we are doing symbolic manipulation
// The math.js library can handle undefined variables in symbolic mode.

const superscriptMap = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
};

function formatForDisplay(expression) {
    return expression.replace(/\^(\d+)/g, (match, p1) => {
        let formattedExponent = '';
        for (let i = 0; i < p1.length; i++) {
            const digit = p1[i];
            formattedExponent += superscriptMap[digit] || digit;
        }
        return formattedExponent;
    });
}

function addToDisplay(value) {
    if (display.textContent === '0' && value !== '.') {
        currentExpression = '';
    }
    
    currentExpression += value;
    
    display.textContent = formatForDisplay(currentExpression);
}

function clearDisplay() {
    currentExpression = '';
    display.textContent = '0';
}

function calculateResult() {
    try {
        const expression = currentExpression.trim();

        // Check if the expression contains any letters (variables)
        const hasVariables = /[a-zA-Z]/.test(expression);

        let result;
        if (hasVariables) {
            // For symbolic expressions, we use the math.js parser to create a symbolic node.
            // Then, we simplify it. This is what Symbolab does.
            const parsedExpression = math.parse(expression);
            result = math.simplify(parsedExpression).toString();
        } else {
            // For purely numerical expressions, we use evaluate()
            result = math.evaluate(expression);
        }
        
        display.textContent = formatForDisplay(String(result));
        currentExpression = String(result);

    } catch (e) {
        // If there's any error, such as a syntax error, show "Error"
        display.textContent = 'Error';
        currentExpression = '';
    }
}
