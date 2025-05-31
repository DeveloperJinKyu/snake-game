const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const grid = 20;
let snake, apple, score, gameOver, missionClear, started, lastTime;
const speed = 100; // ms per frame
let directionQueue = [];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function initGame() {
  snake = { x: 160, y: 160, dx: grid, dy: 0, cells: [], maxCells: 1, lastDir: 'ArrowRight' };
  apple = { x: getRandomInt(0, 20) * grid, y: getRandomInt(0, 20) * grid };
  score = 0;
  gameOver = false;
  missionClear = false;
  started = false;
  lastTime = 0;
  directionQueue = [];
  document.getElementById('restart-btn').style.display = 'none';
  document.getElementById('start-btn').style.display = 'block';
}

function startGame() {
  if (started) return;
  started = true;
  missionClear = false;
  gameOver = false;
  document.getElementById('start-btn').style.display = 'none';
  document.getElementById('restart-btn').style.display = 'none';
  snake = { x: 160, y: 160, dx: grid, dy: 0, cells: [], maxCells: 1, lastDir: 'ArrowRight' };
  apple = { x: getRandomInt(0, 20) * grid, y: getRandomInt(0, 20) * grid };
  score = 0;
  lastTime = 0;
  directionQueue = [];
  window.requestAnimationFrame(gameLoop);
}

function restartGame() {
  started = true;
  missionClear = false;
  gameOver = false;
  document.getElementById('restart-btn').style.display = 'none';
  snake = { x: 160, y: 160, dx: grid, dy: 0, cells: [], maxCells: 1, lastDir: 'ArrowRight' };
  apple = { x: getRandomInt(0, 20) * grid, y: getRandomInt(0, 20) * grid };
  score = 0;
  lastTime = 0;
  directionQueue = [];
  window.requestAnimationFrame(gameLoop);
}

function showMessage(msg, color = '#0f0') {
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color;
  ctx.font = '32px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(msg, canvas.width/2, canvas.height/2);
}

function gameLoop(timestamp) {
  if (!started) {
    showMessage('게임을 시작하려면 버튼을 누르세요', '#0f0');
    return;
  }
  if (gameOver) {
    showMessage('GAME OVER', '#f00');
    document.getElementById('restart-btn').style.display = 'block';
    return;
  }
  if (missionClear) {
    showMessage('MISSION CLEAR!', '#0f0');
    document.getElementById('restart-btn').style.display = 'block';
    return;
  }
  if (!lastTime) lastTime = timestamp;
  const delta = timestamp - lastTime;
  if (delta < speed) {
    window.requestAnimationFrame(gameLoop);
    return;
  }
  lastTime = timestamp;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 방향 전환 처리
  if (directionQueue.length > 0) {
    const dir = directionQueue.shift();
    if (dir === 'ArrowLeft' && snake.lastDir !== 'ArrowRight') {
      snake.dx = -grid; snake.dy = 0; snake.lastDir = 'ArrowLeft';
    } else if (dir === 'ArrowUp' && snake.lastDir !== 'ArrowDown') {
      snake.dy = -grid; snake.dx = 0; snake.lastDir = 'ArrowUp';
    } else if (dir === 'ArrowRight' && snake.lastDir !== 'ArrowLeft') {
      snake.dx = grid; snake.dy = 0; snake.lastDir = 'ArrowRight';
    } else if (dir === 'ArrowDown' && snake.lastDir !== 'ArrowUp') {
      snake.dy = grid; snake.dx = 0; snake.lastDir = 'ArrowDown';
    }
  }

  snake.x += snake.dx;
  snake.y += snake.dy;

  if (snake.x < 0) snake.x = canvas.width - grid;
  else if (snake.x >= canvas.width) snake.x = 0;
  if (snake.y < 0) snake.y = canvas.height - grid;
  else if (snake.y >= canvas.height) snake.y = 0;

  snake.cells.unshift({ x: snake.x, y: snake.y });
  if (snake.cells.length > snake.maxCells) snake.cells.pop();

  ctx.fillStyle = '#0f0';
  snake.cells.forEach((cell, i) => {
    ctx.fillRect(cell.x, cell.y, grid - 2, grid - 2);
    for (let j = i + 1; j < snake.cells.length; j++) {
      if (cell.x === snake.cells[j].x && cell.y === snake.cells[j].y) {
        gameOver = true;
        document.getElementById('restart-btn').style.display = 'block';
        showMessage('GAME OVER', '#f00');
        return;
      }
    }
  });

  ctx.fillStyle = '#f00';
  ctx.fillRect(apple.x, apple.y, grid - 2, grid - 2);

  if (snake.x === apple.x && snake.y === apple.y) {
    snake.maxCells++;
    score++;
    apple.x = getRandomInt(0, 20) * grid;
    apple.y = getRandomInt(0, 20) * grid;
    if (score === 10) {
      missionClear = true;
      document.getElementById('restart-btn').style.display = 'block';
      showMessage('MISSION CLEAR!', '#0f0');
      return;
    }
  }

  ctx.fillStyle = '#fff';
  ctx.font = '16px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Score: ' + score, 10, 395);

  window.requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', function(e) {
  if (!started || gameOver || missionClear) return;
  if (["ArrowLeft","ArrowUp","ArrowRight","ArrowDown"].includes(e.key)) {
    directionQueue.push(e.key);
  }
});

function mobileInput(dir) {
  if (!started || gameOver || missionClear) return;
  directionQueue.push(dir);
}

initGame();
window.startGame = startGame;
window.restartGame = restartGame;
window.mobileInput = mobileInput;
