// const canvas = document.getElementById("gameCanvas");
// const ctx = canvas.getContext("2d");

// const canvasWidth = canvas.width;
// const canvasHeight = canvas.height;

// const floorHeight = 100;
// const gravity = 0.5;

// const keys = {
//     a: false,
//     d: false,
//     w: false
// };

// // Player base
// const player = {
//     x: 100,
//     y: 0,
//     width: 50,
//     height: 90,
//     velocityX: 0,
//     velocityY: 0,
//     speed: 5,
//     jumpForce: -12,
//     onGround: false,
//     color: "blue",
//     isAttacking: false,
//     attackCooldown: false,
//     attackBox: {
//         offsetX: 50,
//         width: 40,
//         height: 40
//     }
// };

// const enemy = {
//     x: 700,
//     y: canvasHeight - floorHeight - 90,
//     width: 50,
//     height: 90,
//     color: "red",
//     velocityX: -2,
//     patrolLeft: 600,
//     patrolRight: 900,
//     isAlive: true,
//     isAttacking: false,
//     attackCooldown: false,
//     attackBox: {
//         offsetX: -40,
//         width: 40,
//         height: 40
//     }
// };



// // Movimentação do teclado
// document.addEventListener("keydown", (e) => {
//     if (e.key === "a" || e.key === "ArrowLeft") keys.a = true;
//     if (e.key === "d" || e.key === "ArrowRight") keys.d = true;
//     if ((e.key === "w" || e.key === "ArrowUp") && player.onGround) {
//         player.velocityY = player.jumpForce;
//         player.onGround = false;
//     }
//     if (e.key === " ") {
//         if (!player.attackCooldown) {
//             player.isAttacking = true;
//             player.attackCooldown = true;

//             setTimeout(() => {
//                 player.isAttacking = false;
//             }, 200); // tempo do ataque visível

//             setTimeout(() => {
//                 player.attackCooldown = false;
//             }, 500); // tempo para atacar de novo
//         }
//     }
// });

// document.addEventListener("keyup", (e) => {
//     if (e.key === "a" || e.key === "ArrowLeft") keys.a = false;
//     if (e.key === "d" || e.key === "ArrowRight") keys.d = false;
// });

// function update() {
//     // Gravidade
//     player.velocityY += gravity;

//     // Movimento lateral
//     player.velocityX = 0;
//     if (keys.a) player.velocityX = -player.speed;
//     if (keys.d) player.velocityX = player.speed;

//     // Atualiza posição
//     player.x += player.velocityX;
//     player.y += player.velocityY;

//     // Colisão com chão
//     if (player.y + player.height >= canvasHeight - floorHeight) {
//         player.y = canvasHeight - floorHeight - player.height;
//         player.velocityY = 0;
//         player.onGround = true;
//     } else {
//         player.onGround = false;
//     }

//     // Limites da tela
//     if (player.x < 0) player.x = 0;
//     if (player.x + player.width > canvasWidth) player.x = canvasWidth - player.width;

//     if (player.isAttacking && enemy.isAlive) {
//         const attackBox = {
//             x: player.x + (player.attackBox.offsetX * (player.velocityX >= 0 ? 1 : -1)),
//             y: player.y + 20,
//             width: player.attackBox.width,
//             height: player.attackBox.height
//         };

//         if (retangulosColidem(attackBox, enemy)) {
//             enemy.isAlive = false;
//             console.log("Inimigo atingido!");
//         }
//     }
//     if (enemy.isAlive) {
//         // Persegue o jogador
//         const distanciaX = player.x - enemy.x;

//         if (Math.abs(distanciaX) > 1) {
//             enemy.velocityX = distanciaX > 0 ? 1.5 : -1.5;
//             enemy.x += enemy.velocityX;
//         }

//         // Ataque quando estiver próximo
//         const distancia = Math.abs(enemy.x - player.x);

//         if (distancia < 60 && !enemy.attackCooldown) {
//             enemy.isAttacking = true;
//             enemy.attackCooldown = true;

//             // Caixa de ataque
//             const attackBox = {
//                 x: enemy.x + (enemy.attackBox.offsetX * (enemy.velocityX >= 0 ? 1 : -1)),
//                 y: enemy.y + 20,
//                 width: enemy.attackBox.width,
//                 height: enemy.attackBox.height
//             };

//             if (retangulosColidem(attackBox, player)) {
//                 playerHit();
//             }

//             setTimeout(() => {
//                 enemy.isAttacking = false;
//             }, 200);

//             setTimeout(() => {
//                 enemy.attackCooldown = false;
//             }, 1000);
//         }
//     }

// }

// function draw() {
//     // Fundo
//     ctx.fillStyle = "#a0e3f0";
//     ctx.fillRect(0, 0, canvasWidth, canvasHeight);

//     // Chão
//     ctx.fillStyle = "#654321";
//     ctx.fillRect(0, canvasHeight - floorHeight, canvasWidth, floorHeight);

//     // Jogador
//     ctx.fillStyle = player.color;
//     ctx.fillRect(player.x, player.y, player.width, player.height);

//     // Inimigo
//     if (enemy.isAlive) {
//         ctx.fillStyle = enemy.color;
//         ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
//     }

//     // Ataque
//     if (player.isAttacking) {
//         ctx.fillStyle = "yellow";
//         const atkX = player.x + (player.attackBox.offsetX * (player.velocityX >= 0 ? 1 : -1));
//         ctx.fillRect(atkX, player.y + 20, player.attackBox.width, player.attackBox.height);
//     }

//     if (enemy.isAttacking) {
//         ctx.fillStyle = "orange";
//         const atkX = enemy.x + (enemy.attackBox.offsetX * (enemy.velocityX >= 0 ? 1 : -1));
//         ctx.fillRect(atkX, enemy.y + 20, enemy.attackBox.width, enemy.attackBox.height);
//     }

//     ctx.fillStyle = "black";
//     ctx.font = "20px Arial";
//     ctx.fillText("❤️ Vidas: " + playerLives, 20, 30);
// }

// let playerLives = 3;

// function playerHit() {
//     if (playerLives > 0) {
//         playerLives--;
//         console.log("😵 Jogador atingido! Vidas restantes:", playerLives);
//     }
//     if (playerLives === 0) {
//         console.log("💀 Game Over!");
//     }
// }


// function gameLoop() {
//     update();
//     draw();
//     requestAnimationFrame(gameLoop);
// }

// function retangulosColidem(rect1, rect2) {
//     return (
//         rect1.x < rect2.x + rect2.width &&
//         rect1.x + rect1.width > rect2.x &&
//         rect1.y < rect2.y + rect2.height &&
//         rect1.y + rect1.height > rect2.y
//     );
// }

// gameLoop();
 
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;

// Área do "chão com perspectiva"
const floorTop = 330;
const floorBottom = 470;

// Teclas pressionadas
const keys = {
  a: false,
  d: false,
  w: false,
  s: false,
  space: false,
};

// Jogador
const player = {
  x: 100,
  y: floorBottom - 90, // Começa com os pés no chão
  width: 50,
  height: 90,
  color: "blue",
  speed: 3,
  isAttacking: false,
  attackCooldown: false,
};

let playerLives = 3;

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

function update() {
  // Movimento
  if (keys.a) player.x -= player.speed;
  if (keys.d) player.x += player.speed;
  if (keys.w) player.y -= player.speed;
  if (keys.s) player.y += player.speed;

  // Limites horizontais
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > width) player.x = width - player.width;

  // ⚠️ Limites verticais corrigidos:
  const minY = floorTop - player.height;
  const maxY = floorBottom - player.height; // pés podem encostar no fundo

  if (player.y < minY) player.y = minY;
  if (player.y > maxY) player.y = maxY;

  // Ataque
  if (keys.space && !player.attackCooldown) {
    player.isAttacking = true;
    player.attackCooldown = true;

    setTimeout(() => {
      player.isAttacking = false;
    }, 200);

    setTimeout(() => {
      player.attackCooldown = false;
    }, 600);
  }
}

function draw() {
  ctx.clearRect(0, 0, width, height);

  // Fundo (parede)
  ctx.fillStyle = "#d0d0d0";
  ctx.fillRect(0, 0, width, floorTop);

  // Chão com perspectiva (trapézio)
  ctx.fillStyle = "#888";
  ctx.beginPath();
  ctx.moveTo(0, floorTop);
  ctx.lineTo(width, floorTop);
  ctx.lineTo(width, floorBottom);
  ctx.lineTo(0, floorBottom);
  ctx.closePath();
  ctx.fill();

  // Linhas horizontais no chão
  ctx.strokeStyle = "#aaa";
  for (let i = 0; i < 5; i++) {
    let y = floorTop + ((floorBottom - floorTop) / 5) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Jogador
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Ataque
  if (player.isAttacking) {
    ctx.fillStyle = "yellow";
    ctx.fillRect(player.x + player.width, player.y + 20, 30, 30);
  }

  // HUD - vidas
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("❤️ Vidas: " + playerLives, 20, 30);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Início automático do jogo
gameLoop();
