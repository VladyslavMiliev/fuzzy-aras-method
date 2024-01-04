let tableData1 = [];
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

function createExpertEvaluationTable(
  alternatives,
  criteria,
  expert,
  ltForCriteria
) {
  tableData = {
    expert,
    values: [],
  };
  const table = document.createElement("table");
  table.classList.add("expert-evaluation-table");

  const headerRow = table.insertRow(0);
  const expertHeaderCell = headerRow.insertCell(0);
  expertHeaderCell.textContent = expert;
  expertHeaderCell.classList.add("expert-name-cell");
  for (let i = 0; i < criteria.length; i++) {
    const criteriaHeaderCell = headerRow.insertCell(i + 1);
    criteriaHeaderCell.textContent = criteria[i];
  }

  for (let i = 0; i < alternatives.length; i++) {
    const row = table.insertRow(i + 1);
    const rowData = { alternative: alternatives[i], values: [] };

    const alternativeCell = row.insertCell(0);
    alternativeCell.textContent = alternatives[i];

    for (let j = 0; j < criteria.length; j++) {
      const criteriaCell = row.insertCell(j + 1);
      const dropdown = createDropdown(ltForCriteria);

      const randomIndex = Math.floor(Math.random() * ltForCriteria.length);
      dropdown.selectedIndex = randomIndex;

      dropdown.addEventListener("change", function () {
        const selectedValue = ltForCriteria[this.selectedIndex].shortName;
        rowData.values[j] = { criteria: criteria[j], value: selectedValue };
        tableData.values[i] = rowData;
      });

      criteriaCell.appendChild(dropdown);

      rowData.values.push({
        criteria: criteria[j],
        value: ltForCriteria[randomIndex].shortName,
      });
    }

    tableData.values.push(rowData);
  }
  table.classList.add("table-styling");

  const wrapper = document.getElementById("expertevaluationsTable");
  wrapper.appendChild(table);

  return tableData;
}

function createExpertEvaluationTables() {
  const alternativesData = findDataByPrefix(inputData, "Alternatives:");
  const criteriaData = findDataByPrefix(inputData, "Criteria:");
  const expertsData = findDataByPrefix(inputData, "Experts:");
  const ltForAlternativesData = findDataByPrefix(
    inputData,
    "LT for Alternatives:"
  );
  const ltForCriteriaData = findDataByPrefix(inputData, "LT for Criteria:");

  const alternativeNames = alternativesData[1];
  const criteriaNames = criteriaData[1];
  const expertNames = expertsData[1];

  for (let i = 0; i < expertNames.length; i++) {
    createExpertEvaluationTable(
      alternativeNames,
      criteriaNames,
      expertNames[i],
      ltForAlternativesData[1],
      ltForCriteriaData[1],
      i
    );
  }
}

function aggregateValues() {
  const expertTables = document.querySelectorAll(".expert-evaluation-table");
  const aggregatedMatrix = [];
  const ltForAltData = findDataByPrefix(inputData, "LT for Alternatives:");
  const alternativeData = {
    values: [],
    ltForAltData: ltForAltData[1],
  };
  expertTables.forEach((table) => {
    const expertName = table.rows[0].cells[0].textContent;

    for (let i = 1; i < table.rows.length; i++) {
      const alternative = table.rows[i].cells[0].textContent;
      const values = [];

      for (let j = 1; j < table.rows[i].cells.length; j++) {
        const criteria = table.rows[0].cells[j].textContent;
        const selectedValue =
          table.rows[i].cells[j].querySelector("select").value;

        values.push({ criteria, value: selectedValue });
      }

      const existingRow = aggregatedMatrix.find(
        (row) => row.alternative === alternative
      );

      if (existingRow) {
        existingRow.values.push({ expert: expertName, values });
      } else {
        aggregatedMatrix.push({
          alternative,
          values: [{ expert: expertName, values }],
        });
      }
    }
  });

  createEvaluationTables(aggregatedMatrix, alternativeData);
  return alternativeData;
}

function createAggregatedMatrixTable(aggregatedMatrix) {
  const tableContainer = document.getElementById(
    "aggregatedMatrixTableContainer"
  );
  tableContainer.innerHTML = "";

  const table = document.createElement("table");
  table.classList.add("aggregated-matrix-table", "table-styling");

  const headerRow = table.insertRow(0);
  headerRow.insertCell(0).textContent = "Alternative / Criterion";

  const uniqueCriteria = [
    ...new Set(
      aggregatedMatrix.flatMap((row) =>
        row.values.flatMap((v) => v.values.map((c) => c.criteria))
      )
    ),
  ];

  uniqueCriteria.forEach((criteria) => {
    headerRow.insertCell(-1).textContent = criteria;
  });

  aggregatedMatrix.forEach((row) => {
    const dataRow = table.insertRow(-1);
    dataRow.insertCell(0).textContent = row.alternative;

    uniqueCriteria.forEach((criteria, index) => {
      const criteriaValues = row.values.flatMap((v) =>
        v.values.filter((c) => c.criteria === criteria)
      );
      const linguisticTerms = criteriaValues.map((value) => value.value);

      dataRow.insertCell(index + 1).textContent = linguisticTerms.join(" - ");
    });
  });

  tableContainer.appendChild(table);
}

function createAggregatedBoundaryTable(aggregatedMatrix, inputData) {
  const boundaryTableContainer = document.getElementById(
    "aggregatedBoundaryTable"
  );
  const criteriaData = findDataByPrefix(inputData, "Criteria:");
  const ltForalternativeData = findDataByPrefix(
    inputData,
    "LT for Alternatives:"
  );

  const table = document.createElement("table");
  table.classList.add("table-styling");

  const headerRow = table.insertRow(0);
  headerRow.insertCell(0).textContent = "Alternatives / Criteria";

  for (let i = 0; i < criteriaData[1].length; i++) {
    headerRow.insertCell(i + 1).textContent = criteriaData[1][i];
  }

  tableData1 = [];
  aggregatedMatrix.forEach((row, rowIndex) => {
    const rowData = {
      alternative: row.alternative,
      values: [],
    };
    const dataRow = table.insertRow(rowIndex + 1);
    dataRow.insertCell(0).textContent = row.alternative;

    for (let j = 0; j < criteriaData[1].length; j++) {
      const boundaryCell = dataRow.insertCell(j + 1);
      const terms = row.values.map((v) =>
        findTermByShortName(v.values[j].value, ltForalternativeData[1])
      );

      const boundaries = terms.map((term) =>
        term ? term.boundaries.join(" - ") : "Term not found"
      );
      rowData.values.push({
        criterion: criteriaData[1][j],
        boundaries: boundaries,
      });
      boundaryCell.textContent = boundaries.join(" / ");
    }

    tableData1.push(rowData);
  });

  boundaryTableContainer.innerHTML = "";
  boundaryTableContainer.appendChild(table);

  return tableData1;
}

function findDataByPrefix(dataArray, prefix) {
  const matchingData = dataArray.find(
    (item) => typeof item === "string" && item.startsWith(prefix)
  );

  const data = dataArray
    .slice(dataArray.indexOf(matchingData) + 1)
    .find((item) => Array.isArray(item));

  return [matchingData, data];
}

function createEvaluationTables(aggregatedMatrix, alternativeData) {
  createAggregatedMatrixTable(aggregatedMatrix);
  createAggregatedBoundaryTable(aggregatedMatrix, inputData, alternativeData);
}

function findTermByShortName(shortName, terms) {
  return terms.find((term) => term.shortName === shortName);
}

let fuzzyMatrixAlt = [];

function calculateSpecificRootMean(alternatives) {
  alternatives.forEach((alternative) => {
    const leftNumbers = [];
    const middleNumbers = [];
    const rightNumbers = [];
    const leftMin = [];
    const rightMax = [];
    alternative.values.forEach((value) => {
      const boundaries = value.boundaries.map((item) =>
        item.split(" - ").map(parseFloat)
      );
      const allNumbers = [].concat(...boundaries);

      leftMin.push(Math.min(...allNumbers));
      rightMax.push(Math.max(...allNumbers));

      leftNumbers.push(boundaries.map((bound) => bound[0]));
      middleNumbers.push(boundaries.map((bound) => bound[1]));
      rightNumbers.push(boundaries.map((bound) => bound[2]));
    });

    const leftProduct = leftNumbers.map((nums) =>
      nums.reduce((acc, num) => acc * num, 1)
    );

    const leftResult = leftProduct.map((product) =>
      Math.pow(product, 1 / leftNumbers[0].length)
    );

    const middleProduct = middleNumbers.map((nums) =>
      nums.reduce((acc, num) => acc * num, 1)
    );
    const middleResult = middleProduct.map((product) =>
      Math.pow(product, 1 / middleNumbers[0].length)
    );

    const rightProduct = rightNumbers.map((nums) =>
      nums.reduce((acc, num) => acc * num, 1)
    );
    const rightResult = rightProduct.map((product) =>
      Math.pow(product, 1 / rightNumbers[0].length)
    );

    const result = {
      minLeft: leftMin,
      left: leftResult,
      middle: middleResult,
      right: rightResult,
      maxRight: rightMax,
    };
    fuzzyMatrixAlt.push(result);
  });

  displayFuzzyMatrixForAlternatives(fuzzyMatrixAlt);

  return fuzzyMatrixAlt;
}

function displayFuzzyMatrixForAlternatives(fuzzyMatrixAlt) {
  const fuzzyTableContainer1 = document.getElementById("fuzzyAltTable");
  const fuzzyMatrixAltCopy = [];
  fuzzyMatrixAlt.forEach((fuzzyMatrix, index) => {
    const table = document.createElement("table");

    const headerRow = table.insertRow();
    const criteriaHeaderCell = headerRow.insertCell(0);
    criteriaHeaderCell.textContent = "Criteria / Values";

    const categories = [
      "Min",
      "Left Boundary",
      "Middle Boundary",
      "Right Boundary",
      "Max",
    ];
    categories.forEach((category) => {
      const cell = headerRow.insertCell();
      cell.textContent = category;
    });

    fuzzyMatrix.left.forEach((value, j) => {
      const row = table.insertRow();
      const criteriaCell = row.insertCell(0);
      criteriaCell.textContent = criteriaData[j];

      const resultValues = [
        fuzzyMatrix.minLeft[j],
        fuzzyMatrix.left[j].toFixed(3),
        fuzzyMatrix.middle[j].toFixed(3),
        fuzzyMatrix.right[j].toFixed(3),
        fuzzyMatrix.maxRight[j],
      ];
      resultValues.forEach((value) => {
        const cell = row.insertCell();
        cell.textContent = value;
      });
    });
    fuzzyMatrixAltCopy.push(fuzzyMatrix);
    table.classList.add("table-styling");
    fuzzyTableContainer1.appendChild(table);
  });
  return fuzzyMatrixAltCopy;
}

function extractAllCriterionValues(fuzzyMatrixAlt) {
  const allCriterionValues = [];

  const numberOfCriteria = fuzzyMatrixAlt[0].left.length;

  for (
    let criterionIndex = 0;
    criterionIndex < numberOfCriteria;
    criterionIndex++
  ) {
    const criterionValues = [];

    fuzzyMatrixAlt.forEach((fuzzyMatrix) => {
      const values = [
        fuzzyMatrix.minLeft[criterionIndex],
        fuzzyMatrix.left[criterionIndex].toFixed(3),
        fuzzyMatrix.middle[criterionIndex].toFixed(3),
        fuzzyMatrix.right[criterionIndex].toFixed(3),
        fuzzyMatrix.maxRight[criterionIndex],
      ];

      criterionValues.push(values);
    });

    allCriterionValues.push(criterionValues);
  }

  return allCriterionValues;
}

function findMaxValues(allCriterionValues) {
  const numCriteria = allCriterionValues.length;
  const numRows = numCriteria > 0 ? allCriterionValues[0].length : 0;

  const result = [];

  for (let criterionIndex = 0; criterionIndex < numCriteria; criterionIndex++) {
    const currentCriterion = allCriterionValues[criterionIndex];

    const maxValues = currentCriterion[0].map(() => Number.NEGATIVE_INFINITY);

    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
      const currentRow = currentCriterion[rowIndex];

      for (let col = 0; col < currentRow.length; col++) {
        const currentValue = currentRow[col];

        if (currentValue !== undefined && currentValue !== null) {
          const value = parseFloat(currentValue);
          if (!isNaN(value)) {
            maxValues[col] = Math.max(maxValues[col], value);
          }
        }
      }
    }

    result.push(maxValues);
  }

  return result;
}

function displayMaxValuesTable(maxValues) {
  const container = document.getElementById("optimalCrtTable");
  container.innerHTML = "";

  const table = document.createElement("table");

  const headerRow = table.insertRow();
  const criteriaHeaderCell = headerRow.insertCell(0);
  criteriaHeaderCell.textContent = "Criteria / Values";
  const categories = [
    "Min",
    "Left Boundary",
    "Middle Boundary",
    "Right Boundary",
    "Max",
  ];
  categories.forEach((category) => {
    const cell = headerRow.insertCell();
    cell.textContent = category;
  });

  maxValues.forEach((maxCriterionValues, index) => {
    const row = table.insertRow();
    const criteriaCell = row.insertCell(0);
    criteriaCell.textContent = criteriaData[index];

    maxCriterionValues.forEach((maxValue) => {
      const cell = row.insertCell();
      cell.textContent = maxValue.toFixed(3);
    });
  });

  table.classList.add("table-styling");
  container.appendChild(table);
}

function displayNormalizedMaxValuesTable(maxValues) {
  const container = document.getElementById("normOptimalCrtTable");
  container.innerHTML = "";

  const table = document.createElement("table");

  const headerRow = table.insertRow();
  const criteriaHeaderCell = headerRow.insertCell(0);
  criteriaHeaderCell.textContent = "Criteria / Values";
  const categories = [
    "Min",
    "Left Boundary",
    "Middle Boundary",
    "Right Boundary",
    "Max",
  ];
  categories.forEach((category) => {
    const cell = headerRow.insertCell();
    cell.textContent = category;
  });

  const maxColumnSum = maxValues.reduce(
    (sum, criterion) => sum + criterion[4],
    0
  );

  const normalizedValuesArray = [];

  maxValues.forEach((maxCriterionValues, index) => {
    const row = table.insertRow();
    const criteriaCell = row.insertCell(0);
    criteriaCell.textContent = criteriaData[index];

    const normalizedValuesForCriterion = [];

    maxCriterionValues.forEach((maxValue, columnIndex) => {
      const cell = row.insertCell();
      const normalizedValue = (maxValue / maxColumnSum).toFixed(3);
      cell.textContent = normalizedValue;

      normalizedValuesForCriterion.push(normalizedValue);
    });

    normalizedValuesArray.push(normalizedValuesForCriterion);
  });

  table.classList.add("table-styling");
  container.appendChild(table);
  return normalizedValuesArray;
}

function displayNormalizedFuzzyMatrixForAlternatives(fuzzyMatrixAlt) {
  const fuzzyTableContainer2 = document.getElementById("normFuzzyAltTable");
  const resultValuesArray = [];
  fuzzyMatrixAlt.forEach((fuzzyMatrix, index) => {
    const table = document.createElement("table");

    const headerRow = table.insertRow();
    const criteriaHeaderCell = headerRow.insertCell(0);
    criteriaHeaderCell.textContent = "Criteria / Values";

    const categories = [
      "Min",
      "Left Boundary",
      "Middle Boundary",
      "Right Boundary",
      "Max",
    ];
    categories.forEach((category) => {
      const cell = headerRow.insertCell();
      cell.textContent = category;
    });

    const maxSum = fuzzyMatrix.maxRight.reduce((acc, val) => acc + val, 0);

    fuzzyMatrix.left.forEach((value, j) => {
      const row = table.insertRow();
      const criteriaCell = row.insertCell(0);
      criteriaCell.textContent = criteriaData[j];

      const resultValues = [
        (fuzzyMatrix.minLeft[j] / maxSum).toFixed(3),
        (fuzzyMatrix.left[j] / maxSum).toFixed(3),
        (fuzzyMatrix.middle[j] / maxSum).toFixed(3),
        (fuzzyMatrix.right[j] / maxSum).toFixed(3),
        (fuzzyMatrix.maxRight[j] / maxSum).toFixed(3),
      ];
      resultValuesArray.push(resultValues);

      resultValues.forEach((value) => {
        const cell = row.insertCell();
        cell.textContent = value;
      });
    });

    table.classList.add("table-styling");
    fuzzyTableContainer2.appendChild(table);
  });
  return resultValuesArray;
}

function multiplyArrays(fuzzyMatrix, normalizedValue) {
  const finalValues = [];

  for (let i = 0; i < fuzzyMatrix.length; i++) {
    const fuzzyRow = fuzzyMatrix[i];
    const normalizedRow = normalizedValue[i];

    const fuzzyValues = Object.values(fuzzyRow);
    const normalizedValues = Object.values(normalizedRow);

    const rowResult = [];

    for (let j = 0; j < fuzzyValues.length; j++) {
      const fuzzyValue = parseFloat(fuzzyValues[j]) || 0;
      const normalizedValue = parseFloat(normalizedValues[j]) || 0;

      const result = fuzzyValue * normalizedValue;

      rowResult.push(result);
    }

    finalValues.push(rowResult);
  }

  displayResultTable(finalValues);
  return finalValues;
}

function displayResultTable(finalValues) {
  const container = document.getElementById("multipTableContainer");

  container.innerHTML = "";

  const table = document.createElement("table");

  const headerRow = table.insertRow();
  const criteriaHeaderCell = headerRow.insertCell(0);
  criteriaHeaderCell.textContent = "Criteria / Values";

  const categories = [
    "Min",
    "Left Boundary",
    "Middle Boundary",
    "Right Boundary",
    "Max",
  ];
  categories.forEach((category) => {
    const cell = headerRow.insertCell();
    cell.textContent = category;
  });

  finalValues.forEach((resultRow, index) => {
    const row = table.insertRow();
    const criteriaCell = row.insertCell(0);
    criteriaCell.textContent = criteriaData[index];

    resultRow.forEach((resultValue) => {
      const cell = row.insertCell();
      cell.textContent = resultValue.toFixed(3);
    });
  });

  table.classList.add("table-styling");
  container.appendChild(table);
}

function multiplyFuzzyMatrixWithResultValues(fuzzyMatrix, resultValues) {
  const multiplyArrays = (arr1, arr2) =>
    arr1.map((val, i) => parseFloat(val) * arr2[i]);

  const multipliedValues = [];
  for (let i = 0; i < resultValues.length; i += 5) {
    const groupResultValues = resultValues.slice(i, i + 5);
    const multipliedGroup = fuzzyMatrix.map((matrixEntry) =>
      multiplyArrays(Object.values(matrixEntry), groupResultValues[0])
    );
    multipliedValues.push(multipliedGroup);
  }
  displayAltTables(multipliedValues);
  return multipliedValues;
}

function displayAltTables(finalValues) {
  const container3 = document.getElementById("multipAltTableContainer");

  let allFinalValues = [];

  container3.innerHTML = "";

  finalValues.forEach((resultArray, arrayIndex) => {
    const table = document.createElement("table");
    const headerRow = table.insertRow();
    const criteriaHeaderCell = headerRow.insertCell(0);
    criteriaHeaderCell.textContent = "Criteria / Values";

    const categories = [
      "Min",
      "Left Boundary",
      "Middle Boundary",
      "Right Boundary",
      "Max",
    ];
    categories.forEach((category) => {
      const cell = headerRow.insertCell();
      cell.textContent = category;
    });

    resultArray.forEach((resultRow, index) => {
      const row = table.insertRow();
      const criteriaCell = row.insertCell(0);
      criteriaCell.textContent = criteriaData[index];

      resultRow.forEach((resultValue) => {
        const cell = row.insertCell();
        cell.textContent = resultValue.toFixed(3);

        allFinalValues.push(resultValue.toFixed(3));
      });
    });

    table.classList.add("table-styling");
    container3.appendChild(table);
  });

  console.log(allFinalValues);
}

function sumValues(finalValues) {
  const numRows = finalValues.length;
  const numCols = finalValues[0].length;
  const sumResult = Array.from({ length: numCols }, () => 0);

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      sumResult[j] += finalValues[i][j];
    }
  }

  return sumResult;
}

function displaySumTable(resultSum) {
  const container = document.getElementById("sumTableContainerForCrt");
  container.innerHTML = "";

  const table = document.createElement("table");

  const headerRow = table.insertRow();

  const categories = [
    "Min",
    "Left Boundary",
    "Middle Boundary",
    "Right Boundary",
    "Max",
  ];
  categories.forEach((category) => {
    const cell = headerRow.insertCell();
    cell.textContent = category;
  });

  const dataRow = table.insertRow();
  resultSum.forEach((sum) => {
    const cell = dataRow.insertCell();
    cell.textContent = sum.toFixed(3);
  });

  table.classList.add("table-styling");

  container.appendChild(table);
}

const createBtn = document.getElementById(
  "create-expert-criteria-evaluation-btn"
);
createBtn.addEventListener("click", () => {
  document.getElementById("create-expert-evaluations-btn").style.display =
    "block";
});
const createTablesBtn = document.getElementById(
  "create-expert-evaluations-btn"
);

createTablesBtn.addEventListener("click", () => {
  createExpertEvaluationTables();
  aggregateValues();
  calculateSpecificRootMean(tableData1);
  const allCriterionValues = extractAllCriterionValues(fuzzyMatrixAlt);
  const maxValues = findMaxValues(allCriterionValues);
  displayMaxValuesTable(maxValues);
  const normalizedValue = displayNormalizedMaxValuesTable(maxValues);
  const resultValues =
    displayNormalizedFuzzyMatrixForAlternatives(fuzzyMatrixAlt);
  multiplyArrays(fuzzyMatrix, normalizedValue);
  const multipliedValues = multiplyFuzzyMatrixWithResultValues(
    fuzzyMatrix,
    resultValues
  );
  const finalValues = multiplyArrays(fuzzyMatrix, normalizedValue);
  const resultSum = sumValues(finalValues);
  displaySumTable(resultSum);
});
