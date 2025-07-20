const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
let gameRunning = true;
let score = 0;
let lives = 3;

// Frog data
const frog = {
  x: 280,
  y: 360,
  width: 40,
  height: 40,
  speed: 40
};

// Lanes and cars
const lanes = [
  { y: 280, speed: 2, direction: 1, color: '#FF6B6B' },
  { y: 240, speed: 3, direction: -1, color: '#4ECDC4' },
  { y: 200, speed: 2.5, direction: 1, color: '#45B7D1' },
  { y: 160, speed: 3.5, direction: -1, color: '#FFA07A' },
  { y: 120, speed: 2, direction: 1, color: '#98D8C8' },
  { y: 80, speed: 4, direction: -1, color: '#F7DC6F' }
];

let cars = [];
function initCars() {
  cars = [];
  lanes.forEach((lane, i) => {
    const count = Math.floor(Math.random() * 3) + 2;
    for (let j = 0; j < count; j++) {
      cars.push({
        x: lane.direction === 1 ? -100 - j * 150 : canvas.width + j * 150,
        y: lane.y,
        width: 60,
        height: 30,
        speed: lane.speed,
        direction: lane.direction,
        color: lane.color,
        lane: i
      });
    }
  });
}

function drawFrog() {
  ctx.fillStyle = '#32CD32';
  ctx.fillRect(frog.x, frog.y, frog.width, frog.height);
  ctx.fillStyle = '#000';
  ctx.fillRect(frog.x + 8, frog.y + 5, 8, 8);
  ctx.fillRect(frog.x + 24, frog.y + 5, 8, 8);
  ctx.fillStyle = '#FF69B4';
  ctx.fillRect(frog.x + 15, frog.y + 25, 10, 3);
}

function drawCars() {
  cars.forEach(car => {
    ctx.fillStyle = car.color;
    ctx.fillRect(car.x, car.y, car.width, car.height);
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(car.x + 10, car.y + 5, car.width - 20, car.height - 15);
    ctx.fillStyle = '#000';
    ctx.fillRect(car.x + 5, car.y + 25, 10, 8);
    ctx.fillRect(car.x + car.width - 15, car.y + 25, 10, 8);
  });
}

function drawRoad() {
  ctx.fillStyle = '#228B22';
  ctx.fillRect(0, 0, canvas.width, 40);
  ctx.fillRect(0, 320, canvas.width, 80);
  ctx.fillStyle = '#555';
  ctx.fillRect(0, 40, canvas.width, 280);

  ctx.fillStyle = '#FFF';
  for (let i = 0; i < 6; i++) ctx.fillRect(0, 85 + i * 40, canvas.width, 2);

  ctx.fillStyle = '#FFD700';
  for (let i = 0; i < 6; i++) {
    const y = 100 + i * 40;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.fillRect(x, y, 20, 2);
    }
  }
}

function updateCars() {
  cars.forEach(car => {
    car.x += car.speed * car.direction;
    if (car.direction === 1 && car.x > canvas.width + 100)
      car.x = -100 - Math.random() * 200;
    else if (car.direction === -1 && car.x < -160)
      car.x = canvas.width + Math.random() * 200;
  });
}

function checkCollisions() {
  cars.forEach(car => {
    if (frog.x < car.x + car.width &&
        frog.x + frog.width > car.x &&
        frog.y < car.y + car.height &&
        frog.y + frog.height > car.y) {
      lives--;
      if (lives <= 0) gameOver();
      else resetFrog();
    }
  });
}

function checkWin() {
  if (frog.y <= 40) {
    score += 100;
    resetFrog();
    cars.forEach(car => car.speed += 0.1);
  }
}

function resetFrog() {
  frog.x = 280;
  frog.y = 360;
}

function gameOver() {
  gameRunning = false;
  document.getElementById('finalScore').textContent = score;
  document.getElementById('gameOverDiv').style.display = 'block';
}

function restartGame() {
  gameRunning = true;
  score = 0;
  lives = 3;
  resetFrog();
  initCars();
  document.getElementById('gameOverDiv').style.display = 'none';
  gameLoop();
}

function moveFrog(direction) {
  if (!gameRunning) return;
  switch (direction) {
    case 'up': if (frog.y > 0) frog.y -= frog.speed; break;
    case 'down': if (frog.y < canvas.height - frog.height) frog.y += frog.speed; break;
    case 'left': if (frog.x > 0) frog.x -= frog.speed; break;
    case 'right': if (frog.x < canvas.width - frog.width) frog.x += frog.speed; break;
  }
}

// Keyboard input
document.addEventListener('keydown', e => {
  const key = e.key.toLowerCase();
  if (key === 'arrowup' || key === 'w') moveFrog('up');
  if (key === 'arrowdown' || key === 's') moveFrog('down');
  if (key === 'arrowleft' || key === 'a') moveFrog('left');
  if (key === 'arrowright' || key === 'd') moveFrog('right');
});

// Swipe gestures
let startX, startY;
canvas.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
}, false);

canvas.addEventListener("touchend", e => {
  const dx = e.changedTouches[0].clientX - startX;
  const dy = e.changedTouches[0].clientY - startY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30) moveFrog('right');
    else if (dx < -30) moveFrog('left');
  } else {
    if (dy > 30) moveFrog('down');
    else if (dy < -30) moveFrog('up');
  }
}, false);

// Main loop
function gameLoop() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRoad();
  updateCars();
  drawCars();
  drawFrog();
  checkCollisions();
  checkWin();
  document.getElementById('score').textContent = score;
  document.getElementById('lives').textContent = lives;
  requestAnimationFrame(gameLoop);
}

// Start game
initCars();
gameLoop();
