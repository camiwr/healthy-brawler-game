const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;

const floorTop = 330;
const floorBottom = 470;

let gameOver = false;

const keys = {
  a: false,
  d: false,
  w: false,
  s: false,
  space: false,
};

const player = {
  x: 100,
  y: floorBottom - 90,
  width: 50,
  height: 90,
  color: "blue",
  speed: 3,
  isAttacking: false,
  attackCooldown: false,
  isFlashing: false
};

let playerLives = 3;

const enemy = {
  width: 40,
  height: 80,
  x: width - 100,
  y: floorBottom - 45,
  color: "red",
  speed: 1.2,
  isAlive: true,
  isAttacking: false,
  attackCooldown: false,
  isFlashing: false
};

document.addEventListener("keydown", (e) => {
  if (e.key === "a" || e.key === "ArrowLeft") keys.a = true;
  if (e.key === "d" || e.key === "ArrowRight") keys.d = true;
  if (e.key === "w" || e.key === "ArrowUp") keys.w = true;
  if (e.key === "s" || e.key === "ArrowDown") keys.s = true;
  if (e.key === " ") keys.space = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "a" || e.key === "ArrowLeft") keys.a = false;
  if (e.key === "d" || e.key === "ArrowRight") keys.d = false;
  if (e.key === "w" || e.key === "ArrowUp") keys.w = false;
  if (e.key === "s" || e.key === "ArrowDown") keys.s = false;
  if (e.key === " ") keys.space = false;
});

function colidem(r1, r2) {
  return (
    r1.x < r2.x + r2.width &&
    r1.x + r1.width > r2.x &&
    Math.abs(r1.y - r2.y) < 30
  );
}

function update() {
  if (gameOver) return;

  // Movimento player
  if (keys.a) player.x -= player.speed;
  if (keys.d) player.x += player.speed;
  if (keys.w) player.y -= player.speed;
  if (keys.s) player.y += player.speed;

  if (player.x < 0) player.x = 0;
  if (player.x + player.width > width) player.x = width - player.width;

  const minY = floorTop - player.height;
  const maxY = floorBottom - player.height;
  if (player.y < minY) player.y = minY;
  if (player.y > maxY) player.y = maxY;

  // Ataque player
  if (keys.space && !player.attackCooldown) {
    player.isAttacking = true;
    player.attackCooldown = true;

    // Ataque tem duração
    setTimeout(() => {
      player.isAttacking = false;
    }, 200);

    // Colisão com inimigo
    if (
      enemy.isAlive &&
      colidem(
        { x: player.x + player.width, y: player.y + 20, width: 30, height: 30 },
        enemy
      )
    ) {
      enemy.isAlive = false;
      enemy.isFlashing = true;
      setTimeout(() => (enemy.isFlashing = false), 150);
    }

    // Cooldown para novo ataque
    setTimeout(() => {
      player.attackCooldown = false;
    }, 600);
  }

  // Movimento e ataque do inimigo
  if (enemy.isAlive) {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;

    if (Math.abs(dx) > 1) enemy.x += dx > 0 ? enemy.speed : -enemy.speed;
    if (Math.abs(dy) > 1) enemy.y += dy > 0 ? enemy.speed : -enemy.speed;

    const minEnemyY = floorTop - enemy.height;
    const maxEnemyY = floorBottom - enemy.height;
    if (enemy.y < minEnemyY) enemy.y = minEnemyY;
    if (enemy.y > maxEnemyY) enemy.y = maxEnemyY;

    // Ataque inimigo se encostar
    if (
      colidem(enemy, player) &&
      !enemy.attackCooldown
    ) {
      playerLives--;
      player.isFlashing = true;
      setTimeout(() => (player.isFlashing = false), 150);

      if (playerLives <= 0) {
        gameOver = true;
      }

      enemy.attackCooldown = true;
      setTimeout(() => {
        enemy.attackCooldown = false;
      }, 1000);
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, width, height);

  // Fundo e chão
  ctx.fillStyle = "#d0d0d0";
  ctx.fillRect(0, 0, width, floorTop);

  ctx.fillStyle = "#888";
  ctx.beginPath();
  ctx.moveTo(0, floorTop);
  ctx.lineTo(width, floorTop);
  ctx.lineTo(width, floorBottom);
  ctx.lineTo(0, floorBottom);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "#aaa";
  for (let i = 0; i < 5; i++) {
    let y = floorTop + ((floorBottom - floorTop) / 5) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Player
  ctx.fillStyle = player.isFlashing ? "#fff" : player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  if (player.isAttacking) {
    ctx.fillStyle = "yellow";
    ctx.fillRect(player.x + player.width, player.y + 20, 30, 30);
  }

  // Enemy
  if (enemy.isAlive) {
    ctx.fillStyle = enemy.isFlashing ? "#fff" : enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  }

  // HUD
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("❤️ Vidas: " + playerLives, 20, 30);

  // Game Over
  if (gameOver) {
    ctx.fillStyle = "black";
    ctx.font = "48px Arial";
    ctx.fillText("GAME OVER", width / 2 - 150, height / 2);
  }
}

function gameLoop() {
  update();
  draw();
  if (!gameOver) requestAnimationFrame(gameLoop);
}

gameLoop();
