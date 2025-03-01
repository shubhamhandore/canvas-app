const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const tools = document.querySelectorAll(".tool");
const colorPicker = document.getElementById("color-picker");
const fillColorPicker = document.getElementById("fill-color-picker");
const sizeSlider = document.getElementById("size-slider");
const clearButton = document.getElementById("clear");
const cropButton = document.getElementById("crop");
const saveJpgButton = document.getElementById("save-jpg");
const savePngButton = document.getElementById("save-png");
const savePdfButton = document.getElementById("save-pdf");

let isDrawing = false;
let currentTool = "pencil";
let currentColor = "#000000";
let fillColor = "#ffffff";
let currentSize = 5;
let startX, startY;

// Set canvas size
canvas.width = window.innerWidth * 0.9;
canvas.height = 600;

// Event Listeners
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

colorPicker.addEventListener("change", (e) => (currentColor = e.target.value));
fillColorPicker.addEventListener("change", (e) => (fillColor = e.target.value));
sizeSlider.addEventListener("change", (e) => (currentSize = e.target.value));

tools.forEach((tool) => {
  tool.addEventListener("click", () => {
    tools.forEach((t) => t.classList.remove("active"));
    tool.classList.add("active");
    currentTool = tool.id;
  });
});

clearButton.addEventListener("click", clearCanvas);
cropButton.addEventListener("click", cropCanvas);
saveJpgButton.addEventListener("click", () => saveCanvas("jpg"));
savePngButton.addEventListener("click", () => saveCanvas("png"));
savePdfButton.addEventListener("click", () => saveCanvas("pdf"));

// Functions
function startDrawing(e) {
  isDrawing = true;
  startX = e.offsetX;
  startY = e.offsetY;
  if (
    currentTool === "pencil" ||
    currentTool === "brush" ||
    currentTool === "eraser"
  ) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
  }
}

function draw(e) {
  if (!isDrawing) return;
  ctx.strokeStyle = currentColor;
  ctx.fillStyle = fillColor;
  ctx.lineWidth = currentSize;
  ctx.lineCap = "round";

  if (
    currentTool === "pencil" ||
    currentTool === "brush" ||
    currentTool === "eraser"
  ) {
    ctx.globalCompositeOperation =
      currentTool === "eraser" ? "destination-out" : "source-over";
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  } else if (currentTool === "rectangle") {
    drawRectangle(e);
  } else if (currentTool === "circle") {
    drawCircle(e);
  } else if (currentTool === "triangle") {
    drawTriangle(e);
  } else if (currentTool === "line") {
    drawLine(e);
  } else if (currentTool === "arrow") {
    drawArrow(e);
  } else if (currentTool === "hexagon") {
    drawHexagon(e);
  } else if (currentTool === "pentagon") {
    drawPentagon(e);
  }
}

function stopDrawing() {
  isDrawing = false;
  ctx.beginPath();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function cropCanvas() {
  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");
  croppedCanvas.width = canvas.width;
  croppedCanvas.height = canvas.height;
  croppedCtx.drawImage(canvas, 0, 0);
  canvas.width = canvas.width;
  canvas.height = canvas.height;
  ctx.drawImage(croppedCanvas, 0, 0);
}

function saveCanvas(format) {
  const link = document.createElement("a");
  link.download = `canvas.${format}`;
  link.href = canvas.toDataURL(`image/${format}`);
  link.click();
}

// Shape Functions
function drawRectangle(e) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeRect(startX, startY, e.offsetX - startX, e.offsetY - startY);
  ctx.fillRect(startX, startY, e.offsetX - startX, e.offsetY - startY);
}

function drawCircle(e) {
  const radius = Math.sqrt(
    Math.pow(e.offsetX - startX, 2) + Math.pow(e.offsetY - startY, 2)
  );
  ctx.beginPath();
  ctx.arc(startX, startY, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fill();
}

function drawTriangle(e) {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(startX * 2 - e.offsetX, e.offsetY);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}

function drawLine(e) {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
}

function drawArrow(e) {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
}

function drawHexagon(e) {
  const sides = 6;
  const radius = Math.sqrt(
    Math.pow(e.offsetX - startX, 2) + Math.pow(e.offsetY - startY, 2)
  );
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides;
    ctx.lineTo(
      startX + radius * Math.cos(angle),
      startY + radius * Math.sin(angle)
    );
  }
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}

function drawPentagon(e) {
  const sides = 5;
  const radius = Math.sqrt(
    Math.pow(e.offsetX - startX, 2) + Math.pow(e.offsetY - startY, 2)
  );
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides;
    ctx.lineTo(
      startX + radius * Math.cos(angle),
      startY + radius * Math.sin(angle)
    );
  }
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}
