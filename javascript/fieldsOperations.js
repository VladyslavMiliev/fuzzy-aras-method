// ADDING AND REMOVING INPUT FIELDS FOR PARAMETERS
function addFields(section) {
  let numFields = document.getElementById(section).value;
  let formsContainer = document.getElementById(section + "-forms");

  formsContainer.innerHTML = "";

  for (let i = 0; i < numFields; i++) {
    let input = document.createElement("input");
    input.type = "text";
    input.name = section + (i + 1);
    input.placeholder =
      section.charAt(0).toUpperCase() + section.slice(1) + " " + (i + 1);

    formsContainer.appendChild(input);

    if (section === "lt-for-alt" || section === "lt-for-crt") {
      for (let j = 0; j < 3; j++) {
        let numberInput = document.createElement("input");
        numberInput.type = "number";
        numberInput.name = section + "-num" + (i + 1) + "-input" + (j + 1);
        numberInput.placeholder = "Num " + (j + 1);

        numberInput.style.width = "70px";

        formsContainer.appendChild(numberInput);
      }
    }
  }
}

function removeFields(section) {
  let formsContainer = document.getElementById(section + "-forms");

  formsContainer.innerHTML = "";
}
