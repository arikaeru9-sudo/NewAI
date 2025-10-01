let neurons = [];
let connections = [];
let step = 0;

function initNetwork() {
  neurons = [];
  connections = [];
  for (let i = 0; i < 20; i++) {
    neurons.push({
      id: i,
      x: Math.random() * 800,
      y: Math.random() * 600,
      potential: Math.random(),
      threshold: 0.6,
      fired: false,
      fireCount: 0
    });
  }
  for (let i = 0; i < neurons.length; i++) {
    for (let j = 0; j < neurons.length; j++) {
      if (i !== j && Math.random() < 0.2) {
        connections.push({ from: i, to: j, weight: Math.random() });
      }
    }
  }
  saveNetwork();
  drawNetwork();
}

function simulateStep() {
  step++;
  document.getElementById("step").textContent = step;
  let activeCount = 0;
  neurons.forEach(n => {
    n.fired = n.potential >= n.threshold;
    if (n.fired) {
      n.fireCount++;
      activeCount++;
    }
  });
  connections.forEach(conn => {
    let fromNeuron = neurons[conn.from];
    let toNeuron = neurons[conn.to];
    if (fromNeuron.fired) {
      toNeuron.potential += conn.weight * fromNeuron.potential;
    }
  });
  neurons.forEach(n => {
    n.potential *= 0.9;
  });
  document.getElementById("activeCount").textContent = activeCount;
  saveNetwork();
  drawNetwork();
}

function drawNetwork() {
  const canvas = document.getElementById("networkCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  connections.forEach(conn => {
    let from = neurons[conn.from];
    let to = neurons[conn.to];
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  });
  neurons.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = n.fired ? "red" : "blue";
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.stroke();
  });
}

function saveNetwork() {
  localStorage.setItem("neurons", JSON.stringify(neurons));
  localStorage.setItem("connections", JSON.stringify(connections));
  localStorage.setItem("step", step);
}

function loadNetwork() {
  const savedNeurons = localStorage.getItem("neurons");
  const savedConnections = localStorage.getItem("connections");
  const savedStep = localStorage.getItem("step");
  if (savedNeurons && savedConnections && savedStep) {
    neurons = JSON.parse(savedNeurons);
    connections = JSON.parse(savedConnections);
    step = parseInt(savedStep);
    document.getElementById("step").textContent = step;
    drawNetwork();
  } else {
    initNetwork();
  }
}

function resetNetwork() {
  localStorage.clear();
  step = 0;
  document.getElementById("step").textContent = step;
  initNetwork();
}

window.onload = loadNetwork;
