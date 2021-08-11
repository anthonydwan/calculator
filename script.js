// case 1:
//4 + 4 = = = 
// > 8 + 4 =
// lognum logoperator resetcurrNum lognum calculate

// case 2:
// 4 + 4 + 5 =
// > 8 + 5 = 
// lognum logoperator resetcurrNum lognum calculate


// case 3:
// 3 = + 3 

// case 4:
// 3 = 3 + 3

// operations are inspired by the window's calculator 

const numbers = document.querySelectorAll(".numberButton")
const operatorButtons = document.querySelectorAll(".operatorButton")
const displayNumbers = document.querySelector("#displayNumbers")
const displayCalculation = document.querySelector("#displayCalculation")
const equalButton = document.querySelector("#equalButton")
const percentButton = document.querySelector("#percentButton")
const acButton = document.querySelector("#acButton")

let twoNumMemory = []
let currNumber = "0"
let currOperator = null


function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        pass //DIV 0 ERROR TODO
    } else {
        return a / b;
    }
}

function operate(a, b, operator) {
    switch (operator) {
        case "add":
            return add(a, b);
        case "minus":
            return subtract(a, b)
        case "multiply":
            return multiply(a, b)
        case "divide":
            return divide(a, b)
    }
}

function addNumber() {
    const number = this.textContent
    if (currNumber === "0" && number != ".") {
        currNumber = number
    } else {
        currNumber = currNumber + number
    }
    displayNumbers.textContent = currNumber
}

function logNumber() {
    if (currNumber != "") {
        if (currNumber.includes(".")) {
            var loggedNum = parseFloat(currNumber)
        } else {
            var loggedNum = parseInt(currNumber)
        }
        twoNumMemory.push(loggedNum);
    }
}

function displayCalc(mode = "current") {
    switch (currOperator) {
        case "multiply":
            var displayOperator = "\u00D7"
            break;
        case "divide":
            var displayOperator = "\u00F7"
            break;
        case "add":
            var displayOperator = "+"
            break;
        case "minus":
            var displayOperator = "-"
            break;
    }
    if (mode === "current") {
        displayCalculation.textContent = `${twoNumMemory[0]} ${displayOperator}`
    } else if (mode === "complete") {
        if (twoNumMemory.length === 2) {
            displayCalculation.textContent = `${twoNumMemory[0]} ${displayOperator} ${twoNumMemory[1]} =`
        } else if (twoNumMemory.length === 1) {
            displayCalculation.textContent = `${twoNumMemory[0]} =`
        }
    };
};

function logOperator() {
    if (["add", "minus", "multiply", "divide"].includes(this.id)) {
        currOperator = this.id
    };
    displayCalc();
    currNumber = ""
};

function calculate(mode = "operator") {
    if (twoNumMemory.length === 2) {
        const a = twoNumMemory[0]
        const b = twoNumMemory[1]
        const newTotal = operate(a, b, currOperator)
        displayNumbers.textContent = newTotal
        twoNumMemory.length = 0
        twoNumMemory.push(newTotal)
        if (mode === "equal") {
            currNumber = `${b}`
        };
    } else if (twoNumMemory.length === 1 && mode === "equal") {
        currNumber = "0"
        twoNumMemory.length = 0
    }
};

function calcAndDisplay() {
    if (twoNumMemory.length === 2) {
        calculate();
        displayCalc();
    };
};


function reset() {
    currNumber = "0";
    currOperator = null;
    twoNumMemory = [];
    displayNumbers.textContent = "0"
    displayCalculation.textContent = ""
};

for (operatorB of operatorButtons) {
    operatorB.addEventListener("click", () => {
        logNumber();
        calculate();
    })
    operatorB.addEventListener("click", logOperator)
    operatorB.addEventListener("click", calcAndDisplay)
};

equalButton.addEventListener("click", () => {
    logNumber();
    displayCalc(mode = "complete");
    calculate(mode = "equal");
});

function percent() {
    if (twoNumMemory.length === 1) {

    } else if (twoNumMemory.length === 2) {

    }
};

for (number of numbers) {
    number.addEventListener("click", addNumber)
}

acButton.addEventListener("click", reset)
