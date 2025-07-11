import { setupControls } from "./engine/controls.js";
import { gameLoop } from "./engine/gameLoop.js";
import { player } from "./entities/player.js";
import { enemies } from "./entities/enemy.js";
import { items } from "./entities/items.js";
import { sceneObjects } from "./world/objects.js";
import { keyItem } from "./entities/key.js";
import { stage1 } from "./stages/stage1.js";
import { stage2 } from "./stages/stage2.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const stages = {
  "1": stage1,
  "2": stage2
};

// Setup controls
setupControls();

document.addEventListener("DOMContentLoaded", () => {
  const resultScreen = document.getElementById("resultScreen");
  const btnRestart = document.getElementById("btnRestart");
  const btnStages = document.getElementById("btnStages");
  const btnNext = document.getElementById("btnNext");

  btnRestart.onclick = () => {
    resultScreen.style.display = "none";
    document.getElementById("gameCanvas").style.display = "block";
    window.startStage(window.currentStage);
  };

  btnStages.onclick = () => {
    resultScreen.style.display = "none";
    document.getElementById("stageScreen").style.display = "block";
    document.getElementById("gameCanvas").style.display = "none";
  };

  btnNext.onclick = () => {
    const next = String(parseInt(window.currentStage) + 1);
    resultScreen.style.display = "none";
    window.startStage(next);
  };
});

window.startStage = function (stageId) {
  const stage = stages[stageId];
  if (!stage) return alert("Stage not found!");

  window.currentStage = stageId;
  document.getElementById("btnRestart").style.display = "none";

  // Reset state
  player.x = 100;
  player.y = 470 - player.height;
  player.lives = 5;
  player.isAttacking = false;
  player.attackCooldown = false;
  player.isFlashing = false;
  player.collectedItems = 0;

  enemies.forEach(e => {
    e.isAlive = true;
    e.attackCooldown = false;
    e.isFlashing = false;
  });

  items.forEach(i => (i.collected = false));

  keyItem.x = null;
  keyItem.y = null;
  keyItem.collected = false;
  keyItem.visible = false;

  // Start game
  canvas.style.display = "block";
  gameLoop({
    ctx,
    player,
    objects: stage.objects,
    items: stage.items,
    enemies: stage.enemies,
    keyItem: stage.keyItem
  });
};
