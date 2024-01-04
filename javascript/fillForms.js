// FILLING IN INPUT FIELDS WITH VALUES OF THE PREPARED DATA SET
document.addEventListener("DOMContentLoaded", () => {
  fillForms();
});
function fillForms() {
  fillSection("alternatives", alternativesData);
  fillSection("criteria", criteriaData);
  fillSection("experts", expertsData);
  fillSection("lt-for-alt", ltAltData);
  fillSection("lt-for-crt", ltCrtData);
  fillSection("lt-for-alt-num", ltNumAltandCrtData);
  fillSection("lt-for-crt-num", ltNumAltandCrtData);
}

function fillSection(section, data) {
  const formsContainer = document.getElementById(section + "-forms");

  const numFieldsValueInput = document.getElementById(section);
if (numFieldsValueInput) {
  const numFieldsValue = numFieldsValueInput.value;

  for (let i = 0; i < numFieldsValue; i++) {
    let input = formsContainer.querySelector(
      'input[name="' + section + (i + 1) + '"]'
    );

    if (input) {
      input.value = data[i % data.length];
    }

    for (let j = 0; j < 3; j++) {
      let numberInput = formsContainer.querySelector(
        'input[name="' + section + "-num" + (i + 1) + "-input" + (j + 1) + '"]'
      );

      if (numberInput) {
        numberInput.value = ltNumAltandCrtData[i * 3 + j];
      }
    }
  }
}
}
