let ltAlt;
let ltCrt;
let inputData = [];
// SAVING INPUT DATA
function saveInputData() {
  const alternativesData = getInputFormData("alternatives");
  const criteriaData = getInputFormData("criteria");
  const expertsData = getInputFormData("experts");
  const ltForAltData = getInputFormDataWithBoundaries("lt-for-alt");
  const ltForCrtData = getInputFormDataWithBoundaries("lt-for-crt");

  inputData.push("Alternatives:", alternativesData);
  inputData.push("Criteria:", criteriaData);
  inputData.push("Experts:", expertsData);
  inputData.push("LT for Alternatives:", ltForAltData);
  inputData.push("LT for Criteria:", ltForCrtData);

  ltAlt = ltForAltData;
  ltCrt = ltForCrtData;
}

function getInputFormData(section) {
  const formsContainer = document.getElementById(`${section}-forms`);
  const numFieldsValue = document.getElementById(section).value;
  const formData = [];

  for (let i = 0; i < numFieldsValue; i++) {
    const input = formsContainer.querySelector(
      `input[name="${section}${i + 1}"]`
    );
    if (input) {
      formData.push(input.value);
    }
  }

  return formData;
}

function getInputFormDataWithBoundaries(section) {
  const formsContainer = document.getElementById(`${section}-forms`);
  const numFieldsValue = document.getElementById(section).value;
  const formData = [];

  for (let i = 0; i < numFieldsValue; i++) {
    const input = formsContainer.querySelector(
      `input[name="${section}${i + 1}"]`
    );
    const boundaries = [];

    for (let j = 1; j <= 3; j++) {
      const numberInput = formsContainer.querySelector(
        `input[name="${section}-num${i + 1}-input${j}"]`
      );
      if (numberInput) {
        boundaries.push(parseFloat(numberInput.value));
      }
    }

    if (input) {
      const shortName = generateShortName(input.value);

      formData.push({
        term: input.value,
        shortName: shortName,
        boundaries: boundaries,
      });
    }
  }

  return formData;
}

function generateShortName(term) {
  const words = term.split(" ");
  const shortName = words.map((word) => word[0].toUpperCase()).join("");

  return shortName;
}
