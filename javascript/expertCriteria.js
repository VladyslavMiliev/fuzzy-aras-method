function createExpertCriteriaEvaluation() {
  const expertCriteriaTableContainer = document.getElementById(
    "expertCriteriaTable"
  );

  const criteriaData = findDataByPrefix(inputData, "Criteria:");
  const expertsData = findDataByPrefix(inputData, "Experts:");
  const ltForCrtData = findDataByPrefix(inputData, "LT for Criteria:");

  const criteraData = {
    values: [],
    ltForCrtData: ltForCrtData[1],
  };
  const table = document.createElement("table");

  const headerRow = table.insertRow(0);
  const expertHeaderCell = headerRow.insertCell(0);
  expertHeaderCell.textContent = "Experts / Criteria";

  for (let i = 0; i < criteriaData[1].length; i++) {
    const criteriaHeaderCell = headerRow.insertCell(i + 1);
    criteriaHeaderCell.textContent = criteriaData[1][i];
  }

  for (let i = 0; i < expertsData[1].length; i++) {
    const row = table.insertRow(i + 1);

    const rowData = { expert: expertsData[1][i], values: [] };

    const expertCell = row.insertCell(0);
    expertCell.textContent = expertsData[1][i];

    for (let j = 0; j < criteriaData[1].length; j++) {
      const criteriaCell = row.insertCell(j + 1);
      const dropdown = createDropdown(ltForCrtData[1]);

      dropdown.selectedIndex = Math.floor(
        Math.random() * ltForCrtData[1].length
      );

      dropdown.addEventListener("change", function () {
        const selectedValue = ltForCrtData[1][this.selectedIndex].shortName;
        rowData.values[j] = {
          criteria: criteriaData[1][j],
          value: selectedValue,
        };
        criteraData.values[i] = rowData;
      });

      criteriaCell.appendChild(dropdown);

      rowData.values.push({
        criteria: criteriaData[1][j],
        value: ltForCrtData[1][dropdown.selectedIndex].shortName,
      });
    }

    criteraData.values.push(rowData);
  }

  table.classList.add("table-styling");
  expertCriteriaTableContainer.innerHTML = "";
  expertCriteriaTableContainer.appendChild(table);

  return criteraData;
}

function findDataByPrefix(dataArray, prefix) {
  const matchingData = dataArray.find(
    (item) => typeof item === "string" && item.startsWith(prefix)
  );

  if (matchingData) {
    const data = dataArray
      .slice(dataArray.indexOf(matchingData) + 1)
      .find((item) => Array.isArray(item));
    return [matchingData, data || []];
  } else {
    return ["", []];
  }
}

function createDropdown(options) {
  const dropdown = document.createElement("select");

  for (const option of options) {
    const optionElement = document.createElement("option");
    optionElement.value = option.shortName;
    optionElement.text = option.shortName;
    dropdown.add(optionElement);
  }

  return dropdown;
}

function createBoundaryTable() {
  const boundaryTableContainer = document.getElementById("boundaryTable");
  const criteriaData = findDataByPrefix(inputData, "Criteria:");
  const ltForCrtData = findDataByPrefix(inputData, "LT for Criteria:");
  const expertsData = findDataByPrefix(inputData, "Experts:");
  const criteraData = createExpertCriteriaEvaluation();

  const table = document.createElement("table");

  const headerRow = table.insertRow(0);
  const expertHeaderCell = headerRow.insertCell(0);
  expertHeaderCell.textContent = "Experts / Criteria";

  for (let i = 0; i < criteriaData[1].length; i++) {
    const criteriaHeaderCell = headerRow.insertCell(i + 1);
    criteriaHeaderCell.textContent = criteriaData[1][i];
  }

  for (let i = 0; i < expertsData[1].length; i++) {
    const row = table.insertRow(i + 1);

    const expertCell = row.insertCell(0);
    expertCell.textContent = expertsData[1][i];

    for (let j = 0; j < criteriaData[1].length; j++) {
      const boundaryCell = row.insertCell(j + 1);
      const term = findTermByShortName(
        criteraData.values[i].values[j].value,
        ltForCrtData[1]
      );

      if (term) {
        const boundaries = term.boundaries;
        boundaryCell.textContent = boundaries.join(" - ");
      } else {
        boundaryCell.textContent = "Term not found";
      }
    }
  }

  table.classList.add("table-styling");
  boundaryTableContainer.innerHTML = "";
  boundaryTableContainer.appendChild(table);
}

function findTermByShortName(shortName, terms) {
  return terms.find((term) => term.shortName === shortName);
}
let fuzzyMatrix = [];

function calculateFuzzyMatrixAndDisplay(criteraData) {
  const experts = criteraData.values;
  const criteriaCount = criteraData.values[0].values.length;
  const expertsCount = experts.length;

  const boundaryTable = document.getElementById("boundaryTable");
  const boundaryRows = boundaryTable.getElementsByTagName("tr");

  for (let i = 0; i < criteriaCount; i++) {
    const leftBounds = [];
    const middleBounds = [];
    const rightBounds = [];

    for (let j = 0; j < expertsCount; j++) {
      const boundaryCell =
        boundaryRows[j + 1].getElementsByTagName("td")[i + 1];
      const boundaryText = boundaryCell.textContent;

      const boundaries = boundaryText.split(" - ").map(parseFloat);

      leftBounds.push(boundaries[0]);
      middleBounds.push(boundaries[1]);
      rightBounds.push(boundaries[2]);
    }

    const leftBoundProduct = leftBounds.reduce((acc, val) => acc * val, 1);
    const leftBound = Math.pow(leftBoundProduct, 1 / expertsCount);

    const middleBoundProduct = middleBounds.reduce((acc, val) => acc * val, 1);
    const middleBound = Math.pow(middleBoundProduct, 1 / expertsCount);

    const rightBoundProduct = rightBounds.reduce((acc, val) => acc * val, 1);
    const rightBound = Math.pow(rightBoundProduct, 1 / expertsCount);

    const minLeftBound = Math.min(...leftBounds);
    const maxRightBound = Math.max(...rightBounds);

    const fuzzyNumber = {
      minLeft: minLeftBound,
      left: leftBound,
      middle: middleBound,
      right: rightBound,
      maxRight: maxRightBound,
    };

    fuzzyMatrix.push(fuzzyNumber);
  }

  displayFuzzyMatrix(fuzzyMatrix);
}

function displayFuzzyMatrix(fuzzyMatrix) {
  const fuzzyTableContainer = document.getElementById("fuzzyCrtTable");

  const table = document.createElement("table");

  const headerRow = table.insertRow();
  const criteriaHeaderCell = headerRow.insertCell(0);
  criteriaHeaderCell.textContent = "Criteria / Values";
  const minLeftBoundaryHeaderCell = headerRow.insertCell(1);
  minLeftBoundaryHeaderCell.textContent = "Min";
  const leftBoundaryHeaderCell = headerRow.insertCell(2);
  leftBoundaryHeaderCell.textContent = "Left Boundary";

  const middleBoundaryHeaderCell = headerRow.insertCell(3);
  middleBoundaryHeaderCell.textContent = "Middle Boundary";

  const rightBoundaryHeaderCell = headerRow.insertCell(4);
  rightBoundaryHeaderCell.textContent = "Right Boundary";
  const maxRightBoundaryHeaderCell = headerRow.insertCell(5);
  maxRightBoundaryHeaderCell.textContent = "Max";
  for (let i = 0; i < fuzzyMatrix.length; i++) {
    const row = table.insertRow();
    const criteriaCell = row.insertCell(0);
    criteriaCell.textContent = criteriaData[i];

    const minCell = row.insertCell(1);
    minCell.textContent = fuzzyMatrix[i].minLeft;

    const leftBoundaryCell = row.insertCell(2);
    leftBoundaryCell.textContent = fuzzyMatrix[i].left.toFixed(3);

    const middleBoundaryCell = row.insertCell(3);
    middleBoundaryCell.textContent = fuzzyMatrix[i].middle.toFixed(3);

    const rightBoundaryCell = row.insertCell(4);
    rightBoundaryCell.textContent = fuzzyMatrix[i].right.toFixed(3);

    const maxCell = row.insertCell(5);
    maxCell.textContent = fuzzyMatrix[i].maxRight;
  }

  table.classList.add("table-styling");
  fuzzyTableContainer.innerHTML = "";
  fuzzyTableContainer.appendChild(table);
}

function createNfillTables() {
  const criteraData = createExpertCriteriaEvaluation();
  createBoundaryTable();
  calculateFuzzyMatrixAndDisplay(criteraData, criteraData.ltForCrtData);
}
