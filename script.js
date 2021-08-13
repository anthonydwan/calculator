// case 1:
//4 + 4 = = = 
// > 8 + 4 =
// lognum logoperator resetcurrNum lognum calculate

// 4 = = = = =


// case 2:
// 4 + 4 + 5 =
// > 8 + 5 = 
// lognum logoperator resetcurrNum lognum calculate


// case 3:
// 3 = + 3 = + 
// > 3 = 3 + 3
// lastAction true, currNum = 3, prevNum logNum


// case 4:
// 3 = 3 + 3
// > 3 = 3 + 3
// lastAction true, currNum = 3, addNum resets currNum lastAction 

// case 5: 
// 3 = = 
// > 3 = 3 = 3
// lastAction true currNum = 3

// case 6:
// 3 + =
// > 3 + 3 = 6

// case 7:
// 3 + +
// 3 + -


// operations are inspired by the window's calculator 
// including most of its quirks 

const numbers = document.querySelectorAll(".numberButton")
const operatorButtons = document.querySelectorAll(".operatorButton")
const displayNumbers = document.querySelector("#displayNumbers")
const displayCalculation = document.querySelector("#displayCalculation")
const allButtons = document.querySelectorAll("button")
const equalButton = document.querySelector("#equalButton")
const percentButton = document.querySelector("#percentButton")
const negateButton = document.querySelector("#negateButton")
const acButton = document.querySelector("#acButton")
const cancelButton = document.querySelector("#cancelButton")
let lastAction = "addNumber";
let error = false;
let operated = false
let errorType = "div0"


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
    };
};

function operate(a, b, operator) {
    switch (operator) {
        case "add":
            return add(a, b);
        case "minus":
            return subtract(a, b)
        case "multiply":
            return multiply(a, b)
        case "divide":
            if (b === 0) {
                error = true;
                errorType ="div0"
                break;
            } else {
                return divide(a, b)
            }
    };
};

function addNumber() {
    if (!error) {
        const number = this.textContent
        if (!(currNumber.includes(".") && number === ".")) {
            if (lastAction !== "addNumber"
                && typeof this.textContent === 'undefined'
                && twoNumMemory.length === 1) {
                // where 3 = + and the plus sign replaces equal
            } else if (lastAction !== "addNumber" && typeof this.textContent != 'undefined') {
                currNumber = number;
                if (lastAction === "equal") {
                    // where > 3 > = > 2 and two replaces three
                    twoNumMemory.length = 0
                };
            } else if (currNumber === "0") {
                // just to prevent adding a lot of 0s on the display
                currNumber = number;
            } else {
                if(currNumber.length <= 11){
                    currNumber = currNumber + number
                }
            };
            displayNumbers.textContent = currNumber
            lastAction = "addNumber"
        }
    };
}

function cancel() {
    if (!error) {
        if (currNumber.length === 1 ||
            (currNumber.length === 2 && currNumber[0] === "-")) {
            currNumber = "0";
        } else {
            currNumber = currNumber.slice(0, currNumber.length - 1)
        };
        displayNumbers.textContent = currNumber
        lastAction = "addNumber"
    }
}


function logNumber(mode = "operator") {
    if (!error) {
        if (lastAction === "operator"
            && mode === "equal"
            && twoNumMemory.length === 1) {
            twoNumMemory.push(twoNumMemory[0])
        } else if (!(lastAction != "addNumber" && mode === "operator") &&
            !(lastAction === "equal" && mode === "equal" && !operated)
        ) {
            if (currNumber.includes(".")) {
                if (currNumber === ".") {
                    var loggedNum = 0
                } else {
                    var loggedNum = parseFloat(currNumber)
                }
            } else {
                var loggedNum = parseInt(currNumber)
            }
            twoNumMemory.push(loggedNum);
        };
    };
}


function displayCalc(mode = "operator") {
    if (!error) {
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
        if (mode === "operator") {
            displayCalculation.textContent = `${twoNumMemory[0]} ${displayOperator}`
        } else if (mode === "equal") {
            if (twoNumMemory.length === 2) {
                displayCalculation.textContent = `${twoNumMemory[0]} ${displayOperator} ${twoNumMemory[1]} =`
            } else if (twoNumMemory.length === 1) {
                displayCalculation.textContent = `${twoNumMemory[0]} =`
            }
        };
    };
}


function logOperator() {
    if (["add", "minus", "multiply", "divide"].includes(this.id)) {
        currOperator = this.id
        operated = true
    };
    displayCalc();
    lastAction = "operator";
};

function calculate(mode = "operator") {
    if (twoNumMemory.length === 2) {
        const a = twoNumMemory[0]
        const b = twoNumMemory[1]
        let newTotal = operate(a, b, currOperator)
        if(newTotal > 10e13 || newTotal < -10e13){
            error=true
            errorType="overflow"
        }
        if (!error && countDecimals(newTotal) > 0) {
            newTotal = parseFloat(newTotal.toFixed(Math.min(4, countDecimals(newTotal))))
        }
        twoNumMemory.length = 0
        if (!error) {
            displayNumbers.textContent = newTotal
            twoNumMemory.push(newTotal)
            currNumber = newTotal
            if (mode === "equal") {
                currNumber = `${b}`
                lastAction = "equal"
            }
        };
    } else if (twoNumMemory.length === 1 && mode === "equal") {
        lastAction = "equal"
        // twoNumMemory.length = 0
    };
};

function calcAndDisplay() {
    if (twoNumMemory.length === 2 && !error) {
        calculate();
        displayCalc();
    };
};

function reset() {
    currNumber = "0";
    currOperator = null;
    twoNumMemory = [];
    displayNumbers.textContent = "0";
    displayCalculation.textContent = "";
    lastAction = "addNumber";
    operated = false;
};

function checkError() {
    if (error) {
        if(errorType ==="div0"){
            displayNumbers.textContent = "DIV 0 ERR";
        } else if(errorType === "overflow"){
            displayNumbers.textContent = "OVERFLOW"
        }

        for (button of allButtons) {
            button.classList.add("errorLight")
            button.classList.remove("normalButtons")
        acButton.classList.add("resetIndicator")
        }
    };
};

function errorReset() {
    if (error){
        error = false;
        reset()
        for (button of allButtons) {
            button.classList.remove("errorLight")
            button.classList.add("normalButtons")
        acButton.classList.remove("resetIndicator")
        }
    }
}

function errorACReset() { }

function countDecimals(value) {
    if (Math.floor(value) === value) return 0;
    return value.toString().split(".")[1].length || 0;
};

function negate() {
    if (!error) {
        if (currNumber != "0") {
            if (currNumber[0] === "-") {
                currNumber = currNumber.slice(1, currNumber.length)
            } else {
                currNumber = "-" + currNumber
            }
        }
        displayNumbers.textContent = currNumber
    }
}

// applying all the functions 
for (button of allButtons){
    button.classList.add("normalButtons")
}

acButton.addEventListener("click", errorReset)

for (operatorB of operatorButtons) {
    operatorB.addEventListener("click", () => {
        logNumber(mode = "operator");
        calculate(mode = "operator");
    })
    operatorB.addEventListener("click", logOperator)
    operatorB.addEventListener("click", calcAndDisplay)
    operatorB.addEventListener("click", checkError)
};

equalButton.addEventListener("click", () => {
    logNumber(mode = "equal");
    displayCalc(mode = "equal");
    calculate(mode = "equal");
    checkError();
});

for (number of numbers) {
    number.addEventListener("click", addNumber)
};

acButton.addEventListener("click", reset)

negateButton.addEventListener("click", negate)

cancelButton.addEventListener('click',cancel)
