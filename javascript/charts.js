const submitBtn = document.getElementById("submit-input-data-btn");
const canvas1 = document.getElementById("chart-container1");
const canvas2 = document.getElementById("chart-container2");

const ctx1 = canvas1.getContext("2d");
const ctx2 = canvas2.getContext("2d");

let roundedMaxValue;
let roundedMaxValue1;

function drawAxesAndLabels(ctx1, chartWidth, chartHeight, ltAlt) {
  const xAxisY = chartHeight - 50;
  const yAxisX = 50;

  ctx1.strokeStyle = "white";
  ctx1.lineWidth = 2;
  ctx1.clearRect(0, 0, chartWidth, chartHeight);
  if (Array.isArray(ltAlt)) {
    ctx1.beginPath();
    ctx1.moveTo(yAxisX, xAxisY);
    ctx1.lineTo(chartWidth - 50, xAxisY);
    ctx1.stroke();
    ctx1.font = "20px Gruppo";
    ctx1.fillStyle = "white";
    ctx1.beginPath();
    ctx1.moveTo(yAxisX, 50);
    ctx1.lineTo(yAxisX, chartHeight - 50);
    ctx1.stroke();

    const rValues = ltAlt.map((term) => term.boundaries[2]);
    const maxR = Math.max(...rValues);

    for (let i = 0; i <= maxR; i += maxR / 4) {
      const x = yAxisX + (i / maxR) * (chartWidth - 100);
      ctx1.moveTo(x, xAxisY);
      ctx1.lineTo(x, xAxisY - 5);
      ctx1.stroke();
      ctx1.fillText(i, x - 10, xAxisY + 15);
    }

    for (let i = 0; i <= 1; i += 0.5) {
      const y = chartHeight - 50 - i * (chartHeight - 100);
      ctx1.moveTo(yAxisX - 5, y);
      ctx1.lineTo(yAxisX, y);
      ctx1.stroke();
      ctx1.fillText(i.toFixed(1), yAxisX - 40, y + 5);
    }
  }
  ctx1.font = "20px Gruppo";
  ctx1.fillStyle = "white";
  if (roundedMaxValue > 0) {
    ctx2.beginPath();
    ctx2.moveTo(yAxisX, xAxisY);
    ctx2.lineTo(chartWidth - 50, xAxisY);
    ctx2.stroke();

    ctx2.beginPath();
    ctx2.moveTo(yAxisX, 50);
    ctx2.lineTo(yAxisX, chartHeight - 50);
    ctx2.stroke();

    for (let i = 0; i <= roundedMaxValue; i += roundedMaxValue / 4) {
      const x = yAxisX + (i / roundedMaxValue) * (chartWidth - 100);
      ctx2.moveTo(x, xAxisY);
      ctx2.lineTo(x, xAxisY - 5);
      ctx2.stroke();
      const label = (i / roundedMaxValue).toFixed(2);
      ctx2.fillText(label, x - 10, xAxisY + 15);
    }

    for (let i = 0; i <= 1; i += 0.5) {
      const y = chartHeight - 50 - i * (chartHeight - 100);
      ctx2.moveTo(yAxisX - 5, y);
      ctx2.lineTo(yAxisX, y);
      ctx2.stroke();
      ctx2.fillText(i.toFixed(1), yAxisX - 40, y + 5);
    }
  }
}
function drawLines(ctx1, chartWidth, chartHeight, ltAlt) {
  const xAxisY = chartHeight - 50;
  const yAxisX = 50;

  ctx1.strokeStyle = "white";
  ctx1.lineWidth = 2;

  ltAlt.forEach((term) => {
    const x1 =
      yAxisX + (term.boundaries[0] / roundedMaxValue) * (chartWidth - 100);
    const x2 =
      yAxisX + (term.boundaries[1] / roundedMaxValue) * (chartWidth - 100);
    const x3 =
      yAxisX + (term.boundaries[2] / roundedMaxValue) * (chartWidth - 100);

    ctx1.beginPath();
    ctx1.moveTo(x1, xAxisY);
    ctx1.lineTo(x2, 50);
    ctx1.lineTo(x3, xAxisY);
    ctx1.stroke();

    ctx1.beginPath();
    ctx1.arc(x1, xAxisY, 4, 0, Math.PI * 2);
    ctx1.fillStyle = "#ff0000";
    ctx1.fill();
    ctx1.closePath();

    ctx1.beginPath();
    ctx1.arc(x2, 50, 4, 0, Math.PI * 2);
    ctx1.fillStyle = "#ff0000";
    ctx1.fill();
    ctx1.closePath();

    ctx1.beginPath();
    ctx1.arc(x3, xAxisY, 4, 0, Math.PI * 2);
    ctx1.fillStyle = "#ff0000";
    ctx1.fill();
    ctx1.closePath();
  });
}

function lineGraph(ctx1, ctx2, ltAlt) {
  const chartWidth = 400;
  const chartHeight = 300;

  canvas1.width = chartWidth;
  canvas1.height = chartHeight;
  canvas2.width = chartWidth;
  canvas2.height = chartHeight;

  ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

  drawAxesAndLabels(ctx1, chartWidth, chartHeight, ltAlt);
  drawAxesAndLabels(ctx2, chartWidth, chartHeight);

  drawLines(ctx1, chartWidth, chartHeight, ltAlt);
  drawLines(ctx2, chartWidth, chartHeight, ltAlt);
}

// ---------------------------------------------------

const canvas3 = document.getElementById("chart-container3");
const canvas4 = document.getElementById("chart-container4");
const ctx3 = canvas3.getContext("2d");
const ctx4 = canvas4.getContext("2d");
function drawAxesAndLabels1(ctx3, chartWidth1, chartHeight1, ltCrt) {
  const xAxisY1 = chartHeight1 - 50;
  const yAxisX1 = 50;

  ctx3.strokeStyle = "white";
  ctx3.lineWidth = 2;
  ctx3.clearRect(0, 0, chartWidth1, chartHeight1);
  if (Array.isArray(ltCrt)) {
    ctx3.beginPath();
    ctx3.moveTo(yAxisX1, xAxisY1);
    ctx3.lineTo(chartWidth1 - 50, xAxisY1);
    ctx3.stroke();
    ctx3.font = "20px Gruppo";
    ctx3.fillStyle = "white";
    ctx3.beginPath();
    ctx3.moveTo(yAxisX1, 50);
    ctx3.lineTo(yAxisX1, chartHeight1 - 50);
    ctx3.stroke();

    const rValues1 = ltCrt.map((term) => term.boundaries[2]);
    const maxR1 = Math.max(...rValues1);

    for (let j = 0; j <= maxR1; j += maxR1 / 4) {
      const x1 = yAxisX1 + (j / maxR1) * (chartWidth1 - 100);
      ctx3.moveTo(x1, xAxisY1);
      ctx3.lineTo(x1, xAxisY1 - 5);
      ctx3.stroke();
      ctx3.fillText(j, x1 - 10, xAxisY1 + 15);
    }

    for (let j = 0; j <= 1; j += 0.5) {
      const y1 = chartHeight1 - 50 - j * (chartHeight1 - 100);
      ctx3.moveTo(yAxisX1 - 5, y1);
      ctx3.lineTo(yAxisX1, y1);
      ctx3.stroke();
      ctx3.fillText(j.toFixed(1), yAxisX1 - 40, y1 + 5);
    }
  }
  ctx3.font = "20px Gruppo";
  ctx3.fillStyle = "white";
  if (roundedMaxValue1 > 0) {
    ctx4.beginPath();
    ctx4.moveTo(yAxisX1, xAxisY1);
    ctx4.lineTo(chartWidth1 - 50, xAxisY1);
    ctx4.stroke();

    ctx4.beginPath();
    ctx4.moveTo(yAxisX1, 50);
    ctx4.lineTo(yAxisX1, chartHeight1 - 50);
    ctx4.stroke();

    for (let j = 0; j <= roundedMaxValue1; j += roundedMaxValue1 / 4) {
      const x1 = yAxisX1 + (j / roundedMaxValue1) * (chartWidth1 - 100);
      ctx4.moveTo(x1, xAxisY1);
      ctx4.lineTo(x1, xAxisY1 - 5);
      ctx4.stroke();
      const label = (j / roundedMaxValue1).toFixed(2);
      ctx4.fillText(label, x1 - 10, xAxisY1 + 15);
    }

    for (let j = 0; j <= 1; j += 0.5) {
      const y1 = chartHeight1 - 50 - j * (chartHeight1 - 100);
      ctx4.moveTo(yAxisX1 - 5, y1);
      ctx4.lineTo(yAxisX1, y1);
      ctx4.stroke();
      ctx4.fillText(j.toFixed(1), yAxisX1 - 40, y1 + 5);
    }
  }
}
function drawlines1(ctx3, chartWidth1, chartHeight1, ltCrt) {
  const xAxisY1 = chartHeight1 - 50;
  const yAxisX1 = 50;

  ctx3.strokeStyle = "white";
  ctx3.lineWidth = 2;

  ltCrt.forEach((term) => {
    const x11 =
      yAxisX1 + (term.boundaries[0] / roundedMaxValue1) * (chartWidth1 - 100);
    const x21 =
      yAxisX1 + (term.boundaries[1] / roundedMaxValue1) * (chartWidth1 - 100);
    const x31 =
      yAxisX1 + (term.boundaries[2] / roundedMaxValue1) * (chartWidth1 - 100);

    ctx3.beginPath();
    ctx3.moveTo(x11, xAxisY1);
    ctx3.lineTo(x21, 50);
    ctx3.lineTo(x31, xAxisY1);
    ctx3.stroke();

    ctx3.beginPath();
    ctx3.arc(x11, xAxisY1, 4, 0, Math.PI * 2);
    ctx3.fillStyle = "#ff0000";
    ctx3.fill();
    ctx3.closePath();

    ctx3.beginPath();
    ctx3.arc(x21, 50, 4, 0, Math.PI * 2);
    ctx3.fillStyle = "#ff0000";
    ctx3.fill();
    ctx3.closePath();

    ctx3.beginPath();
    ctx3.arc(x31, xAxisY1, 4, 0, Math.PI * 2);
    ctx3.fillStyle = "#ff0000";
    ctx3.fill();
    ctx3.closePath();
  });
}

function lineGraph1(ctx3, ctx4, ltCrt) {
  const chartWidth1 = 400;
  const chartHeight1 = 300;

  canvas3.width = chartWidth1;
  canvas3.height = chartHeight1;
  canvas4.width = chartWidth1;
  canvas4.height = chartHeight1;

  ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
  ctx4.clearRect(0, 0, canvas4.width, canvas4.height);

  drawAxesAndLabels1(ctx3, chartWidth1, chartHeight1, ltCrt);
  drawAxesAndLabels1(ctx4, chartWidth1, chartHeight1);

  drawlines1(ctx3, chartWidth1, chartHeight1, ltCrt);
  drawlines1(ctx4, chartWidth1, chartHeight1, ltCrt);
}

submitBtn.addEventListener("click", () => {
  let maxValue = Math.max(...ltAlt.map((term) => term.boundaries[2]));
  let maxValue1 = Math.max(...ltCrt.map((term) => term.boundaries[2]));
  roundedMaxValue = Math.ceil(maxValue, maxValue1);
  roundedMaxValue1 = Math.ceil(maxValue1);

  lineGraph(ctx1, ctx2, ltAlt);

  lineGraph1(ctx3, ctx4, ltCrt);
  document.getElementById(
    "create-expert-criteria-evaluation-btn"
  ).style.display = "inline-block";
  

  document.getElementById("chart-container1").style.display = "inline-block";
  document.getElementById("chart-container2").style.display = "inline-block";
  document.getElementById("chart-container3").style.display = "inline-block";
  document.getElementById("chart-container4").style.display = "inline-block";
});
