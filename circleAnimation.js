import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let svg;

const width = 800;
const height = 600;
const duration = 800;
const clickFrameCount = 5;
const maxCircles = 10;

const ballRadius = 22;
const innerRadius = 10;

const colors = [
  "#e63946",
  "#1d3557",
  "#457b9d",
  "#2a9d8f",
  "#f4a261",
  "#e76f51",
  "#ffb703",
  "#8338ec",
  "#3a86ff",
  "#ff006e",
];

function randomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function randomLabel() {
  return Math.floor(Math.random() * 15) + 1;
}

async function prepareVis() {
  svg = d3
    .select("#runApp")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", "#00B12D")
    .on("click", handleCanvasClick);
}

function createBall(x, y, fillColor, labelText) {
  const ball = svg
    .append("g")
    .attr("class", "ball")
    .attr("transform", `translate(${x}, ${y})`)
    .style("cursor", "pointer")
    .on("click", function (event) {
      event.stopPropagation(); // stops the click from triggering the canvas click handler
      playAnimation(d3.select(this));
    });

  // outer ball
  ball
    .append("circle")
    .attr("r", ballRadius)
    .attr("fill", fillColor)
    .attr("stroke", "Black")
    .attr("stroke-width", 2);

  // inner white circle
  ball
    .append("circle")
    .attr("r", innerRadius)
    .attr("fill", "white")
    .attr("stroke-width", 1);

  // ball number
  ball
    .append("text")
    .text(labelText)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("font-size", 12)
    .attr("font-weight", "bold")
    .attr("font-family", "roboto mono")
    .attr("fill", "black")
    .style("user-select", "none")
    .style("pointer-events", "none");

  return ball;
}

async function drawVis() {
  createBall(55, 25, "black", "8"); // initial black 8-ball
}

function handleCanvasClick(event) {
  const [x, y] = d3.pointer(event);

  const balls = svg.selectAll("g.ball");

  // if more than 10 balls, remove the last ball
  if (balls.size() >= maxCircles) {
    balls.filter((d, i) => i === 0).remove();
  }

  const newBall = createBall(x, y, randomColor(), randomLabel());

  // create ball (starting state)
  newBall.attr("transform", `translate(${x}, ${y}) scale(0)`);

  // animate the ball
  newBall
    .transition()
    .duration(200)
    .attr("transform", `translate(${x}, ${y}) scale(1)`);
}

// Animate function to randomly animate any clicked balls
async function playAnimation(selectedBall) {
  let index = 0;

  const interval = setInterval(() => {
    const randomX = Math.random() * width;
    const randomY = Math.random() * height;
    const randomScale = Math.random() * 0.8 + 0.8; // 0.8 to 1.6

    selectedBall
      .transition()
      .duration(duration)
      .attr(
        "transform",
        `translate(${randomX}, ${randomY}) scale(${randomScale})`,
      );

    index++;
    if (index >= clickFrameCount) {
      clearInterval(interval);
    }
  }, duration);
}

async function runApp() {
  await prepareVis();
  await drawVis();
}

runApp();
