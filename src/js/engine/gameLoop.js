import { keys } from "./controls.js";
import { colidem } from "./collision.js";
import { updateCamera } from "./camera.js";
import { drawBackground } from "../world/background.js";

const worldWidth = 3000;
const floorTop = 240;
const floorBottom = 580;

let gameOver = false;
let victory = false;
let reachedExit = false;

export function gameLoop({ ctx, player, enemies, items, objects, keyItem }) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  function showResult(title, message, showNext = false) {
    const resultScreen = document.getElementById("resultScreen");
    const resultTitle = document.getElementById("resultTitle");
    const resultMessage = document.getElementById("resultMessage");
    const btnNext = document.getElementById("btnNext");

    resultTitle.textContent = title;
    resultMessage.textContent = message;
    resultScreen.style.display = "flex";
    document.getElementById("gameCanvas").style.display = "none";
    btnNext.style.display = showNext ? "inline-block" : "none";
  }


  function update() {
    if (gameOver || victory || reachedExit) return;

    // Player movement
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

    // Collision with objects
    for (const obj of objects) {
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

    // Collect items
    for (const item of items) {
      if (!item.collected && colidem(player, item)) {
        item.collected = true;
        player.collectedItems++;
      }
    }

    // Collect key
    if (keyItem.visible && !keyItem.collected && colidem(player, keyItem)) {
      keyItem.collected = true;
    }

    // Player attack
    if (keys.space && !player.attackCooldown) {
      player.isAttacking = true;
      player.attackCooldown = true;

      setTimeout(() => (player.isAttacking = false), 200);
      setTimeout(() => (player.attackCooldown = false), 600);

      for (const enemy of enemies) {
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

          if (enemy.isFinal) {
            keyItem.x = enemy.x + enemy.width / 2 - keyItem.width / 2;
            keyItem.y = enemy.y + enemy.height;
            keyItem.visible = true;
          }
        }
      }
    }

    // Enemy movement and attack
    for (const enemy of enemies) {
      if (!enemy.isAlive) continue;

      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;

      if (Math.abs(dx) > 1) enemy.x += dx > 0 ? enemy.speed : -enemy.speed;
      if (Math.abs(dy) > 1) enemy.y += dy > 0 ? enemy.speed : -enemy.speed;

      const minY = floorTop - enemy.height;
      const maxY = floorBottom - enemy.height;
      if (enemy.y < minY) enemy.y = minY;
      if (enemy.y > maxY) enemy.y = maxY;

      for (const obj of objects) {
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

    const atEnd = player.x + player.width >= worldWidth - 20;

    if (atEnd && keyItem.collected && !victory && !gameOver) {
      victory = true;
    }

    if (atEnd && !keyItem.collected && !reachedExit && !gameOver && !victory) {
      reachedExit = true;
    }
  }

  function draw() {
    const cameraX = updateCamera(player.x, width, worldWidth);
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(-cameraX, 0);

    drawBackground(ctx, cameraX, worldWidth, floorTop, floorBottom);

    for (const obj of objects) {
      ctx.fillStyle = obj.color;
      ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    }

    for (const item of items) {
      if (!item.collected) {
        ctx.fillStyle = item.color;
        ctx.fillRect(item.x, item.y, item.width, item.height);
      }
    }

    if (keyItem.visible && !keyItem.collected) {
      ctx.fillStyle = keyItem.color;
      ctx.fillRect(keyItem.x, keyItem.y, keyItem.width, keyItem.height);
    }

    for (const enemy of enemies) {
      if (enemy.isAlive) {
        ctx.fillStyle = enemy.isFlashing ? "#fff" : enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      }
    }

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
    ctx.fillText("❤️ Lives: " + player.lives, 20, 30);
    ctx.fillText("🍏 Items: " + player.collectedItems, width - 200, 30);

    if (reachedExit && !keyItem.collected) {
      showResult("🚪 Locked Door", "You need the key to complete the stage!");
    }

    if (gameOver) {
      showResult("💀 Game Over", "You were defeated by junk food.");
    }

    if (victory) {
      showResult("🏆 Victory!", "You collected the key and completed the stage!", true);
    }
  }

  function loop() {
    update();
    draw();
    if (!gameOver && !victory && !reachedExit) requestAnimationFrame(loop);
  }

  loop();
}
