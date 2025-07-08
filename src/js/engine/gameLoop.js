import { keys } from "./controls.js";
import { colidem } from "./collision.js";
import { updateCamera } from "./camera.js";

const worldWidth = 3000;
const floorTop = 330;
const floorBottom = 470;

let gameOver = false;
let victory = false;
let fimDoMapa = false;

export function gameLoop({ ctx, player, inimigos, alimentos, objetos }) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  function update() {
    if (gameOver || victory || fimDoMapa) return;

    // Movimento do jogador
    if (keys.a) player.x -= player.speed;
    if (keys.d) player.x += player.speed;
    if (keys.w) player.y -= player.speed;
    if (keys.s) player.y += player.speed;

    const minY = floorTop - player.height;
    const maxY = floorBottom - player.height;
    if (player.y < minY) player.y = minY;
    if (player.y > maxY) player.y = maxY;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > worldWidth) player.x = worldWidth - player.width;

    // Colisão com objetos fixos
    for (const obj of objetos) {
      if (colidem(player, obj)) {
        const dx = (player.x + player.width / 2) - (obj.x + obj.width / 2);
        const dy = (player.y + player.height / 2) - (obj.y + obj.height / 2);
        const widthSum = (player.width + obj.width) / 2;
        const heightSum = (player.height + obj.height) / 2;
        const crossWidth = widthSum - Math.abs(dx);
        const crossHeight = heightSum - Math.abs(dy);

        if (crossWidth > 0 && crossHeight > 0) {
          if (crossWidth < crossHeight) {
            dx > 0 ? player.x += crossWidth : player.x -= crossWidth;
          } else {
            dy > 0 ? player.y += crossHeight : player.y -= crossHeight;
          }
        }
      }
    }

    // Coleta de alimentos
    for (const a of alimentos) {
      if (!a.coletado && colidem(player, a)) {
        a.coletado = true;
        player.alimentosColetados++;
      }
    }

    // Ataque do jogador
    if (keys.space && !player.attackCooldown) {
      player.isAttacking = true;
      player.attackCooldown = true;

      setTimeout(() => (player.isAttacking = false), 200);
      setTimeout(() => (player.attackCooldown = false), 600);

      for (const enemy of inimigos) {
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
      }
    }

    // Movimento e ataque dos inimigos
    for (const enemy of inimigos) {
      if (!enemy.isAlive) continue;

      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;

      if (Math.abs(dx) > 1) enemy.x += dx > 0 ? enemy.speed : -enemy.speed;
      if (Math.abs(dy) > 1) enemy.y += dy > 0 ? enemy.speed : -enemy.speed;

      const minY = floorTop - enemy.height;
      const maxY = floorBottom - enemy.height;
      if (enemy.y < minY) enemy.y = minY;
      if (enemy.y > maxY) enemy.y = maxY;

      for (const obj of objetos) {
        if (colidem(enemy, obj)) {
          const dx = (enemy.x + enemy.width / 2) - (obj.x + obj.width / 2);
          const dy = (enemy.y + enemy.height / 2) - (obj.y + obj.height / 2);
          const widthSum = (enemy.width + obj.width) / 2;
          const heightSum = (enemy.height + obj.height) / 2;
          const crossWidth = widthSum - Math.abs(dx);
          const crossHeight = heightSum - Math.abs(dy);

          if (crossWidth > 0 && crossHeight > 0) {
            if (crossWidth < crossHeight) {
              dx > 0 ? enemy.x += crossWidth : enemy.x -= crossWidth;
            } else {
              dy > 0 ? enemy.y += crossHeight : enemy.y -= crossHeight;
            }
          }
        }
      }

      if (!enemy.attackCooldown && colidem(enemy, player)) {
        player.lives--;
        player.isFlashing = true;
        setTimeout(() => (player.isFlashing = false), 150);

        if (player.lives <= 0) gameOver = true;

        enemy.attackCooldown = true;
        setTimeout(() => (enemy.attackCooldown = false), 1000);
      }
    }

    // Verifica vitória (todos os inimigos derrotados)
    if (inimigos.every(e => !e.isAlive)) {
      victory = true;
    }

    // Verifica fim do mapa
    if (player.x + player.width >= worldWidth - 20 && !fimDoMapa && !gameOver && !victory) {
      fimDoMapa = true;
    }
  }

  function draw() {
    const cameraX = updateCamera(player.x, width, worldWidth);
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(-cameraX, 0);

    // chão
    ctx.fillStyle = "#abc4ab";
    ctx.fillRect(0, floorTop, worldWidth, floorBottom - floorTop);

    // objetos fixos
    for (const obj of objetos) {
      ctx.fillStyle = obj.color;
      ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    }

    // alimentos
    for (const a of alimentos) {
      if (!a.coletado) {
        ctx.fillStyle = a.color;
        ctx.fillRect(a.x, a.y, a.width, a.height);
      }
    }

    // inimigos
    for (const enemy of inimigos) {
      if (enemy.isAlive) {
        ctx.fillStyle = enemy.isFlashing ? "#fff" : enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      }
    }

    // player
    ctx.fillStyle = player.isFlashing ? "#fff" : player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    if (player.isAttacking) {
      ctx.fillStyle = "yellow";
      ctx.fillRect(player.x + player.width, player.y + 20, 30, 30);
    }

    ctx.restore();

    // HUD
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("❤️ Vidas: " + player.lives, 20, 30);
    ctx.fillText("🍏 Alimentos: " + player.alimentosColetados, width - 200, 30);

    if (gameOver) {
      ctx.fillStyle = "black";
      ctx.font = "48px Arial";
      ctx.fillText("GAME OVER", width / 2 - 150, height / 2);
    }

    if (victory) {
      ctx.fillStyle = "green";
      ctx.font = "36px Arial";
      ctx.fillText("🎉 Parabéns! Você venceu a fase!", width / 2 - 250, height / 2);
    }

    if (fimDoMapa) {
      ctx.fillStyle = "blue";
      ctx.font = "36px Arial";
      ctx.fillText("🌟 Você chegou ao fim do mapa!", width / 2 - 250, height / 2 + 50);
    }
  }

  function loop() {
    update();
    draw();
    if (!gameOver && !victory && !fimDoMapa) requestAnimationFrame(loop);
  }

  loop();
}
