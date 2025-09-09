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

function solveEquation() {
    try {
        const expression = currentExpression.trim();
        const equalsIndex = expression.indexOf('=');

        if (equalsIndex === -1) {
            display.textContent = 'No equation to solve';
            isResultDisplayed = true;
            return;
        }

        const leftSide = expression.substring(0, equalsIndex);
        const rightSide = expression.substring(equalsIndex + 1);

        // This is a simple but effective way to handle simple linear equations.
        // It uses math.js to evaluate the left and right sides.
        const leftNode = math.parse(leftSide);
        const rightNode = math.parse(rightSide);
        
        // Find the variable to solve for (assuming it's 'x')
        const variable = 'x'; 
        
        const solved = math.lusolve([[leftNode.evaluate({[variable]: 1})], [leftNode.evaluate({[variable]: 0})]], [[rightNode.evaluate()], [rightNode.evaluate()]]);
        
        // The result is in a matrix, we extract the first element.
        const result = solved.get([0, 0]);

        display.textContent = `x = ${math.round(result, 4)}`;
        currentExpression = `x=${result}`;
        isResultDisplayed = true;

    } catch (e) {
        display.textContent = 'Error';
        currentExpression = '';
        isResultDisplayed = false;
    }
}

function calculateResult() {
    try {
        const expression = currentExpression.trim();
        if (expression === '') {
            return;
        }
        
        let result;
        
        try {
            // First, try numerical evaluation.
            result = math.evaluate(expression);
        } catch (numericalError) {
            // If that fails, try symbolic simplification.
            const parsedExpression = math.parse(expression);
            const simplifiedExpression = math.simplify(parsedExpression);
            result = simplifiedExpression.toString();
        }

        display.textContent = formatForDisplay(String(result));
        currentExpression = String(result);
        isResultDisplayed = true;

    } catch (e) {
        display.textContent = 'Error';
        currentExpression = '';
        isResultDisplayed = false;
    }
}
