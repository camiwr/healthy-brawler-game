const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const floorHeight = 100;
const gravity = 0.5;

// Player base
const player = {
  x: 100,
  y: 0,
  width: 50,
  height: 90,
  velocityX: 0,
  velocityY: 0,
  onGround: false,
  color: "blue",
};

function update() {
  // Gravidade
  player.velocityY += gravity;

  // Movimento vertical
  player.y += player.velocityY;

  // Verifica chão
  if (player.y + player.height >= canvasHeight - floorHeight) {
    player.y = canvasHeight - floorHeight - player.height;
    player.velocityY = 0;
    player.onGround = true;
  } else {
    player.onGround = false;
  }
}

function draw() {
  // Fundo
  ctx.fillStyle = "#a0e3f0"; // azul céu
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
