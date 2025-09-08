let currentExpression = '';
const display = document.getElementById('display');

let scope = {
    x: 0,
    y: 0
};

// A mapping for converting numbers to their superscript Unicode characters
const superscriptMap = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
};

// This function takes the standard expression and formats it for the display
function formatForDisplay(expression) {
    // A regular expression to find any number (one or more digits) that follows a caret (^)
    return expression.replace(/\^(\d+)/g, (match, p1) => {
        // p1 contains the number(s) after the caret
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
    
    // Format the current expression and then update the display
    display.textContent = formatForDisplay(currentExpression);
}

function clearDisplay() {
    currentExpression = '';
    display.textContent = '0';
}

function calculateResult() {
    try {
        let result;
        const expression = currentExpression.trim();

        const equalsIndex = expression.indexOf('=');
        if (equalsIndex !== -1) {
            const assignment = expression.substring(0, equalsIndex).trim();
            const value = expression.substring(equalsIndex + 1).trim();
            scope[assignment] = math.evaluate(value, scope);
            display.textContent = `${assignment} = ${scope[assignment]}`;
            currentExpression = '';
            return;
        }

        if (expression.includes('/')) {
            const simplifiedNode = math.rationalize(expression, scope, true);
            
            if (simplifiedNode.denominator.isConstantNode && simplifiedNode.denominator.value === 1) {
                result = simplifiedNode.numerator.toString();
            } else {
                result = simplifiedNode.expression.toString();
            }
        } else {
            result = math.evaluate(expression, scope);
        }

        display.textContent = formatForDisplay(String(result));
        currentExpression = String(result);

    } catch (e) {
        display.textContent = 'Error';
        currentExpression = '';
    }
}
