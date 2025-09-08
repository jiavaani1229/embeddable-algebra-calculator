let currentExpression = '';
const display = document.getElementById('display');
let isResultDisplayed = false;

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
    if (isResultDisplayed && /[0-9x-z.e]/.test(value)) {
        currentExpression = '';
        isResultDisplayed = false;
    } else if (isResultDisplayed && /[-+*/^]/.test(value)) {
        isResultDisplayed = false;
    }

    if (display.textContent === '0' && value !== '.') {
        currentExpression = '';
    }
    
    currentExpression += value;
    
    display.textContent = formatForDisplay(currentExpression);
}

function clearDisplay() {
    currentExpression = '';
    display.textContent = '0';
    isResultDisplayed = false;
}

function calculateResult() {
    try {
        const expression = currentExpression.trim();

        if (expression === '') {
            return;
        }

        let result;
        
        // First, try to evaluate the expression numerically.
        // This will work for any expression with only numbers and operators.
        result = math.evaluate(expression);
        
        display.textContent = formatForDisplay(String(result));
        currentExpression = String(result);
        isResultDisplayed = true;
    
    } catch (e) {
        // If the numerical evaluation fails (e.g., because there's a variable),
        // we then try to simplify it symbolically.
        try {
            const parsedExpression = math.parse(currentExpression);
            const simplifiedExpression = math.simplify(parsedExpression);
            const result = simplifiedExpression.toString();
            
            display.textContent = formatForDisplay(result);
            currentExpression = result;
            isResultDisplayed = true;

        } catch (symbolicError) {
            // If both fail, it's an invalid expression.
            display.textContent = 'Error';
            currentExpression = '';
            isResultDisplayed = false;
        }
    }
}
