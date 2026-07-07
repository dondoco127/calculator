const displayText = document.getElementById("displayText");

let currentValue = "0";
let previousValue = null;
let selectedOperator = null;
let shouldResetDisplay = false;

function updateDisplay() {
  displayText.textContent = formatDisplayValue(currentValue);
}

function formatDisplayValue(value) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return "Error";
  }

  if (value.length > 10) {
    return Number(value).toPrecision(8);
  }

  return value;
}

function inputNumber(number) {
  if (number === "." && currentValue.includes(".") && !shouldResetDisplay) {
    return;
  }

  if (shouldResetDisplay) {
    currentValue = number === "." ? "0." : number;
    shouldResetDisplay = false;
    updateDisplay();
    return;
  }

  if (currentValue === "0" && number !== ".") {
    currentValue = number;
  } else {
    currentValue += number;
  }

  updateDisplay();
}

function chooseOperator(operator) {
  if (selectedOperator !== null && !shouldResetDisplay) {
    calculate();
  }

  previousValue = currentValue;
  selectedOperator = operator;
  shouldResetDisplay = true;
}

function calculate() {
  if (selectedOperator === null || previousValue === null) {
    return;
  }

  const prev = Number(previousValue);
  const current = Number(currentValue);
  let result;

  switch (selectedOperator) {
    case "+":
      result = prev + current;
      break;
    case "-":
      result = prev - current;
      break;
    case "*":
      result = prev * current;
      break;
    case "/":
      if (current === 0) {
        currentValue = "Error";
        previousValue = null;
        selectedOperator = null;
        shouldResetDisplay = true;
        updateDisplay();
        return;
      }
      result = prev / current;
      break;
    default:
      return;
  }

  currentValue = String(roundResult(result));
  previousValue = null;
  selectedOperator = null;
  shouldResetDisplay = true;
  updateDisplay();
}

function roundResult(number) {
  return Math.round(number * 100000000) / 100000000;
}

function clearCalculator() {
  currentValue = "0";
  previousValue = null;
  selectedOperator = null;
  shouldResetDisplay = false;
  updateDisplay();
}

function toggleSign() {
  if (currentValue === "0" || currentValue === "Error") {
    return;
  }

  currentValue = String(Number(currentValue) * -1);
  updateDisplay();
}

function percent() {
  if (currentValue === "Error") {
    return;
  }

  currentValue = String(Number(currentValue) / 100);
  updateDisplay();
}

document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", () => {
    const number = button.dataset.number;
    const operator = button.dataset.operator;
    const action = button.dataset.action;

    if (number !== undefined) {
      inputNumber(number);
      return;
    }

    if (operator !== undefined) {
      chooseOperator(operator);
      return;
    }

    if (action === "equal") {
      calculate();
      return;
    }

    if (action === "clear") {
      clearCalculator();
      return;
    }

    if (action === "toggle-sign") {
      toggleSign();
      return;
    }

    if (action === "percent") {
      percent();
    }
  });
});

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (!Number.isNaN(Number(key))) {
    inputNumber(key);
    return;
  }

  if (key === ".") {
    inputNumber(".");
    return;
  }

  if (["+", "-", "*", "/"].includes(key)) {
    chooseOperator(key);
    return;
  }

  if (key === "Enter" || key === "=") {
    calculate();
    return;
  }

  if (key === "Escape") {
    clearCalculator();
    return;
  }

  if (key === "%") {
    percent();
    return;
  }

  if (key === "Backspace") {
    if (currentValue.length <= 1 || currentValue === "Error") {
      currentValue = "0";
    } else {
      currentValue = currentValue.slice(0, -1);
    }
    updateDisplay();
  }
});

updateDisplay();