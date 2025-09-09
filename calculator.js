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

function calculateResult() {
    try {
        const expression = currentExpression.trim();

        if (expression === '') {
            return;
        }

        let result;
        const equalsIndex = expression.indexOf('=');

        if (equalsIndex !== -1) {
            // This is an equation. We'll use symbolic math to solve it.
            const leftSide = expression.substring(0, equalsIndex);
            const rightSide = expression.substring(equalsIndex + 1);

            // Create a function that represents the equation's root: f(x) = 0
            const equationFunction = math.parse(`${leftSide} - (${rightSide})`);

            // Use the findRoot function to solve for x
            const solution = math.findRoot(
                x => equationFunction.evaluate({ x: x }),
                0 // Start looking for the solution near x = 0
            );

            result = `x = ${math.round(solution, 4)}`; // Round to 4 decimal places
        
        } else {
            // This is a standard expression without an equals sign.
            // First, try a numerical evaluation.
            try {
                result = math.evaluate(expression);
            } catch (numericalError) {
                // If that fails, try a symbolic simplification.
                const parsedExpression = math.parse(expression);
                const simplifiedExpression = math.simplify(parsedExpression);
                result = simplifiedExpression.toString();
            }
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
