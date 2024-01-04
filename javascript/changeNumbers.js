// CHANGING NUMBERS OF INPUT FIELDS
function changeNumber(inputId, operation) {
  const inputElement = document.getElementById(inputId);
  let currentValue = parseInt(inputElement.value);

  if (operation === "decrease" && currentValue > inputElement.min) {
    inputElement.value = currentValue - 1;
  } else if (operation === "increase" && currentValue < inputElement.max) {
    inputElement.value = currentValue + 1;
  }
}
