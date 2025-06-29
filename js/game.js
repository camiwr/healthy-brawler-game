const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const floorHeight = 100;
const gravity = 0.5;

const keys = {
  a: false,
  d: false,
  w: false
};

// Player base
const player = {
  x: 100,
  y: 0,
  width: 50,
  height: 90,
  velocityX: 0,
  velocityY: 0,
  speed: 5,
  jumpForce: -12,
  onGround: false,
  color: "blue",
};

// Movimentação do teclado
document.addEventListener("keydown", (e) => {
  if (e.key === "a" || e.key === "ArrowLeft") keys.a = true;
  if (e.key === "d" || e.key === "ArrowRight") keys.d = true;
  if ((e.key === "w" || e.key === "ArrowUp") && player.onGround) {
    player.velocityY = player.jumpForce;
    player.onGround = false;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "a" || e.key === "ArrowLeft") keys.a = false;
  if (e.key === "d" || e.key === "ArrowRight") keys.d = false;
});

function update() {
  // Gravidade
  player.velocityY += gravity;

  // Movimento lateral
  player.velocityX = 0;
  if (keys.a) player.velocityX = -player.speed;
  if (keys.d) player.velocityX = player.speed;

  // Atualiza posição
  player.x += player.velocityX;
  player.y += player.velocityY;

  // Colisão com chão
  if (player.y + player.height >= canvasHeight - floorHeight) {
    player.y = canvasHeight - floorHeight - player.height;
    player.velocityY = 0;
    player.onGround = true;
  } else {
    player.onGround = false;
  }

  // Limites da tela
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvasWidth) player.x = canvasWidth - player.width;
}

function draw() {
  // Fundo
  ctx.fillStyle = "#a0e3f0";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Chão
  ctx.fillStyle = "#654321";
  ctx.fillRect(0, canvasHeight - floorHeight, canvasWidth, floorHeight);

  // Jogador
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
