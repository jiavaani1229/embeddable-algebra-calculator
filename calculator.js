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

function deleteLast() {
    // Check if the current expression is not empty or is not '0'
    if (currentExpression.length > 0 && currentExpression !== '0') {
        currentExpression = currentExpression.slice(0, -1);
        if (currentExpression.length === 0) {
            display.textContent = '0';
        } else {
            display.textContent = formatForDisplay(currentExpression);
        }
    }
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
        
        result = math.evaluate(expression);
        
        display.textContent = formatForDisplay(String(result));
        currentExpression = String(result);
        isResultDisplayed = true;
    
    } catch (e) {
        try {
            const parsedExpression = math.parse(currentExpression);
            const simplifiedExpression = math.simplify(parsedExpression);
            const result = simplifiedExpression.toString();
            
            display.textContent = formatForDisplay(result);
            currentExpression = result;
            isResultDisplayed = true;

        } catch (symbolicError) {
            display.textContent = 'Error';
            currentExpression = '';
            isResultDisplayed = false;
        }
    }
}
