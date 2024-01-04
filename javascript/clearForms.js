function clearForms() {
    clearSection("alternatives");
    clearSection("criteria");
    clearSection("experts");
    clearSection("lt-for-alt");
    clearSection("lt-for-crt");
    clearSection("lt-for-alt-num");
    clearSection("lt-for-crt-num");
  }
  
  function clearSection(section) {
    let formsContainer = document.getElementById(section + "-forms");
    let numFieldsValueInput = document.getElementById(section);
    let numFieldsValue = numFieldsValueInput.value;
  
    for (let i = 0; i < numFieldsValue; i++) {
      let input = formsContainer.querySelector(
        'input[name="' + section + (i + 1) + '"]'
      );
  
      if (input) {
        input.value = "";
      }
  
      for (let j = 0; j < 3; j++) {
        let numberInput = formsContainer.querySelector(
          'input[name="' + section + "-num" + (i + 1) + "-input" + (j + 1) + '"]'
        );
  
        if (numberInput) {
          numberInput.value = "";
        }
      }
    }
  }
  