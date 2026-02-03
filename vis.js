// Data set: array of food objects i've made and their ratings (x, y position on the quadrant)
const marks = [
  {
    x: 380,
    y: 30,
    dish: "chicken noodle soup",
    cusine: "Western",
    color: "orange",
    radius: 5,
  },
  {
    x: 500,
    y: 400,
    dish: "taiwanese beef noodle soup",
    cusine: "Taiwanese",
    color: "red",
    radius: 5,
  },
  {
    x: 180,
    y: 160,
    dish: "mexican fried rice",
    cusine: "Mexican",
    color: "green",
    radius: 5,
  },
  {
    x: 250,
    y: 100,
    dish: "Japanese curry",
    cusine: "Japanese",
    color: "blue",
    radius: 5,
  },
  {
    x: 450,
    y: 20,
    dish: "Steak",
    cusine: "Western",
    color: "orange",
    radius: 5,
  },
];

// Category objects to label the quadrant axis
const categories = [
  { x: 0, y: 240, text: "meh" },
  { x: 500, y: 240, text: "delicious" },
  { x: 250, y: -10, text: "easy to make" },
  { x: 250, y: 520, text: "difficult to make" },
];

// Create svg container
const svg = document.getElementById("quadrant-container");
const svg2 = document.getElementById("kuromi-container");

const svgNS = "http://www.w3.org/2000/svg";

// Function for creating a quadrant chart
function createQuadrant(svg, width, height) {
  // x-axis line
  const xAxis = document.createElementNS(svgNS, "line");
  xAxis.setAttribute("x1", 0);
  xAxis.setAttribute("y1", height / 2);
  xAxis.setAttribute("x2", width);
  xAxis.setAttribute("y2", height / 2);
  xAxis.setAttribute("stroke", "black");
  xAxis.setAttribute("stroke-width", 2);
  svg.appendChild(xAxis);

  // y-axis line
  const yAxis = document.createElementNS(svgNS, "line");
  yAxis.setAttribute("x1", width / 2);
  yAxis.setAttribute("y1", 0);
  yAxis.setAttribute("x2", width / 2);
  yAxis.setAttribute("y2", height);
  yAxis.setAttribute("stroke", "black");
  yAxis.setAttribute("stroke-width", 2);
  svg.appendChild(yAxis);
}

// Function for labeling the quadrants
function createCategory(svg, x, y, text) {
  const label = document.createElementNS(svgNS, "text");
  label.setAttribute("x", x);
  label.setAttribute("y", y);
  label.setAttribute("text-anchor", "middle");
  label.setAttribute("font-family", "inter");
  label.textContent = text;
  svg.appendChild(label);
}

// Function for creating circle markings on quadrant
function createMark(svg, x, y, dish, cusine, color, radius) {
  const svgNS = "http://www.w3.org/2000/svg";

  // Create circle
  const circle = document.createElementNS(svgNS, "circle");
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y);
  circle.setAttribute("r", radius);
  circle.setAttribute("fill", color);

  svg.appendChild(circle);

  // Create label
  const label = document.createElementNS(svgNS, "text");
  label.setAttribute("x", x);
  label.setAttribute("y", y + 15);
  label.setAttribute("text-anchor", "middle");
  label.setAttribute("font-family", "inter");
  label.setAttribute("font-size", "0.6rem");
  label.textContent = dish;
  svg.appendChild(label);
}

// Function to create text
function createText(svg, x, y, t) {
  const text = document.createElementNS(svgNS, "text");
  text.setAttribute("x", x);
  text.setAttribute("y", y);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("font-family", "inter");
  text.setAttribute("font-size", "1rem");
  text.textContent = t;
  svg.appendChild(text);
}

// Function to create rectangle
function createRect(svg, x, y, width, height, color) {
  const rect = document.createElementNS(svgNS, "rect");
  rect.setAttribute("x", x);
  rect.setAttribute("y", y);
  rect.setAttribute("width", width);
  rect.setAttribute("height", height);
  rect.setAttribute("fill", color);

  svg.appendChild(rect);
}

// Function to create circle
function createCircle(svg2, x, y, radius, color) {
  const circle = document.createElementNS(svgNS, "circle");
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y);
  circle.setAttribute("r", radius);
  circle.setAttribute("fill", color);
  svg2.appendChild(circle);
}

// Function to create triangle
function createTriangle(svg2, x1, y1, x2, y2, x3, y3, color) {
  const triangle = document.createElementNS(svgNS, "polygon");

  // Set the three points and color
  triangle.setAttribute("points", `${x1},${y1} ${x2},${y2} ${x3},${y3}`);
  triangle.setAttribute("fill", color);
  svg2.appendChild(triangle); // add to container
}

// ------------ Quadrant chart -------------
createQuadrant(svg, 500, 500);

// Add quadrant categories to container
categories.forEach((category) => {
  createCategory(svg, category.x, category.y, category.text);
});

// Add markings to container
// Arrow function: for each dot in the dots array, called createCircle function and pass its properties
marks.forEach((mark) => {
  createMark(
    svg,
    mark.x,
    mark.y,
    mark.dish,
    mark.cusine,
    mark.color,
    mark.radius,
  );
});

createRect(svg, 600, 0, 20, 20, "red");
createRect(svg, 600, 40, 20, 20, "blue");
createRect(svg, 600, 80, 20, 20, "orange");
createRect(svg, 600, 120, 20, 20, "green");
createText(svg, 670, 20, "= Taiwanese");
createText(svg, 670, 60, "= Japanese");
createText(svg, 670, 100, "= Western");
createText(svg, 670, 140, "= Mexican");

// ------------ End of quadrant chart -------------

// ------------ Kuromi SVG art -------------
const w2 = svg2.clientWidth || svg2.getAttribute("width");
const h2 = svg2.clientHeight || svg2.getAttribute("height");

// Head
createCircle(svg2, w2 / 2, h2 / 2, 100, "#4b4947"); // Takes 5 arguements: svg, x,y,radius, color
createCircle(svg2, w2 / 2, h2 / 2 + 90, 100, "white");
createTriangle(
  svg2,
  w2 / 2,
  h2 / 2 + 20,
  w2 / 2 - 40,
  h2 / 2 - 10,
  w2 / 2 + 40,
  h2 / 2 - 10,
  "#4b4947",
);

// Skull
createCircle(svg2, w2 / 2, h2 / 2 - 40, 30, "#f5b4d1");
createRect(svg2, w2 / 2 - 20, h2 / 2 - 20, 10, 15, "#f5b4d1");
createRect(svg2, w2 / 2 - 5, h2 / 2 - 20, 10, 15, "#f5b4d1");
createRect(svg2, w2 / 2 + 10, h2 / 2 - 20, 10, 15, "#f5b4d1");
createCircle(svg2, w2 / 2 - 15, h2 / 2 - 30, 8, "#4b4947");
createCircle(svg2, w2 / 2 + 15, h2 / 2 - 30, 8, "#4b4947");

// Eyes
createCircle(svg2, w2 / 2 - 45, h2 / 2 + 30, 15, "black");
createCircle(svg2, w2 / 2 + 45, h2 / 2 + 30, 15, "black");

// Mouth
createCircle(svg2, w2 / 2, h2 / 2 + 55, 20, "black");
createCircle(svg2, w2 / 2, h2 / 2 + 50, 22, "white");

// Left ear
createTriangle(
  svg2,
  w2 / 2 - 200,
  h2 / 2,
  w2 / 2 - 86,
  h2 / 2 - 40,
  w2 / 2 - 86,
  h2 / 2 + 20,
  "#4b4947",
);
createCircle(svg2, w2 / 2 - 200, h2 / 2, 10, "#4b4947");

// Right
createTriangle(
  svg2,
  w2 / 2 + 200,
  h2 / 2,
  w2 / 2 + 86,
  h2 / 2 - 40,
  w2 / 2 + 86,
  h2 / 2 + 20,
  "#4b4947",
);
createCircle(svg2, w2 / 2 + 200, h2 / 2, 10, "#4b4947");
