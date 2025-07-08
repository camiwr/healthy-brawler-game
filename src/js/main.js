// main.js
import { setupControls } from "./engine/controls.js";
import { gameLoop } from "./engine/gameLoop.js";
import { player } from "./entities/player.js";
import { inimigos } from "./entities/enemy.js";
import { alimentos } from "./entities/items.js";
import { elementosDeCenario } from "./world/objects.js";
import { chave } from "./entities/key.js";
import { fase1 } from "./fases/fase1.js";
import { fase2 } from "./fases/fase2.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const fases = {
  "1": fase1,
  "2": fase2
};

// Ativa os controles do jogador
setupControls();

// Função global chamada ao clicar em uma fase
window.iniciarFase = function (faseId) {
  const fase = fases[faseId];

  if (!fase) return alert("Fase não encontrada!");

  document.getElementById("restartBtn").style.display = "none";

  // Reinicia variáveis principais
  player.x = 100;
  player.y = 470 - player.height;
  player.lives = 5;
  player.isAttacking = false;
  player.attackCooldown = false;
  player.isFlashing = false;
  player.alimentosColetados = 0;

  inimigos.forEach(e => {
    e.isAlive = true;
    e.attackCooldown = false;
    e.isFlashing = false;
  });

  alimentos.forEach(a => (a.coletado = false));

  chave.x = null;
  chave.y = null;
  chave.coletada = false;
  chave.visivel = false;

  // Mostra o canvas e inicia o jogo
  canvas.style.display = "block";
 gameLoop({
    ctx,
    player,
    objetos: fase.objetos,
    alimentos: fase.alimentos,
    inimigos: fase.inimigos,
    chave: fase.chave
  });
};
