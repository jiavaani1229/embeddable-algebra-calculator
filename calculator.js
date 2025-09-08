let currentExpression = '';
const display = document.getElementById('display');
let isResultDisplayed = false; // New variable to track if a result is on the screen

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
    // If a result is currently displayed and the user types a number,
    // we clear the expression to start a new calculation.
    if (isResultDisplayed && /[0-9]/.test(value)) {
        currentExpression = '';
        isResultDisplayed = false;
    } else if (isResultDisplayed && /[-+*/^]/.test(value)) {
        // If an operator is pressed after a result, we just continue the calculation.
        isResultDisplayed = false;
    }
    
    // Clear the initial '0' if it's there
    if (display.textContent === '0' && value !== '.') {
        currentExpression = '';
    }
    
    currentExpression += value;
    
    display.textContent = formatForDisplay(currentExpression);
}

function clearDisplay() {
    currentExpression = '';
    display.textContent = '0';
    isResultDisplayed = false; // Reset the flag
}

function calculateResult() {
    try {
        const expression = currentExpression.trim();

        // Prevent evaluation of an empty string
        if (expression === '') {
            return;
        }

        const hasVariables = /[a-zA-Z]/.test(expression);
        let result;
        
        if (hasVariables) {
            const parsedExpression = math.parse(expression);
            result = math.simplify(parsedExpression).toString();
        } else {
            result = math.evaluate(expression);
        }
        
        display.textContent = formatForDisplay(String(result));
        currentExpression = String(result);
        isResultDisplayed = true; // Set the flag after a successful calculation

    } catch (e) {
        display.textContent = 'Error';
        currentExpression = '';
        isResultDisplayed = false;
    }
}
