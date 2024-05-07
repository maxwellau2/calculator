const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn-number");
function infixToPostfix(expression) {
    // Define precedence of operators
    const precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
        '%': 2, // Modulo has the same precedence as multiplication and division
        '^': 3 // Exponentiation has highest precedence
    };

    // Function to check if a character is an operator
    function isOperator(char) {
        return precedence.hasOwnProperty(char);
    }

    // Function to compare precedence of operators
    function comparePrecedence(op1, op2) {
        return precedence[op1] - precedence[op2];
    }

    let outputQueue = [];
    let operatorStack = [];

    // Split the expression into tokens
    const tokens = expression.match(/\d+(\.\d+)?|\+|\-|\*|\/|\%|\^|\(|\)/g);

    // Process each token
    tokens.forEach(token => {
        if (/^\d+(\.\d+)?$/.test(token)) {
            // If the token is a number (with optional decimal), add it to the output queue
            outputQueue.push(token);
        } else if (token === '(') {
            // If the token is a left parenthesis, push it onto the operator stack
            operatorStack.push(token);
        } else if (token === ')') {
            // If the token is a right parenthesis, pop operators from the stack until a left parenthesis is encountered
            while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
                outputQueue.push(operatorStack.pop());
            }
            // Discard the left parenthesis
            operatorStack.pop();
        } else {
            // If the token is an operator
            while (operatorStack.length > 0 && isOperator(operatorStack[operatorStack.length - 1]) && comparePrecedence(operatorStack[operatorStack.length - 1], token) >= 0) {
                // Pop operators from the stack with greater or equal precedence and add them to the output queue
                outputQueue.push(operatorStack.pop());
            }
            // Push the token onto the operator stack
            operatorStack.push(token);
        }
    });

    // Pop any remaining operators from the stack and add them to the output queue
    while (operatorStack.length > 0) {
        outputQueue.push(operatorStack.pop());
    }

    // Join the output queue to form the postfix expression
    return outputQueue.join(' ');
}

function evaluatePostfix(postfixExpression) {
    // Function to check if a character is an operator
    function isOperator(char) {
        return ['+', '-', '*', '/', '%', '^'].includes(char);
    }

    // Function to perform arithmetic operation
    function performOperation(operator, operand1, operand2) {
        switch (operator) {
            case '+':
                return operand1 + operand2;
            case '-':
                return operand1 - operand2;
            case '*':
                return operand1 * operand2;
            case '/':
                if (operand2 === 0) {
                    throw new Error("Division by zero");
                }
                return operand1 / operand2;
            case '%':
                return operand1 % operand2;
            case '^':
                return Math.pow(operand1, operand2);
        }
    }

    let stack = [];

    // Split the postfix expression into tokens
    const tokens = postfixExpression.split(' ');

    // Process each token
    tokens.forEach(token => {
        if (!isOperator(token)) {
            // If the token is a number, push it onto the stack
            stack.push(parseFloat(token));
        } else {
            // If the token is an operator, pop two operands from the stack, perform the operation, and push the result back onto the stack
            const operand2 = stack.pop();
            const operand1 = stack.pop();
            const result = performOperation(token, operand1, operand2);
            stack.push(result);
        }
    });

    // The final result is on the top of the stack
    return stack.pop();
}

function operate(){
    // result = display.innerHTML.split("+")
    // console.log(result)
    text = display.innerHTML;
    postfix = infixToPostfix(text)
    result = evaluatePostfix(postfix);
    // for (let i=0; i<text.length; i++){
    //     console.log(text[i])
    // }
    return result;
}

console.log(buttons)
buttons.forEach((button)=>{
    button.addEventListener("click", (e)=>{
        text = e.target.innerHTML;
        if (text === "="){
            display.innerHTML = operate()
            return;
        }
        if (text === "clr"){
            display.innerHTML = ""; //clear
            return
        }
        display.innerHTML += text;
    })
    // console.log(button.innerHTML)
})
