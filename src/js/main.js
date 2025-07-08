// main.js
import { setupControls } from "./engine/controls.js";
import { gameLoop } from "./engine/gameLoop.js";
import { player } from "./entities/player.js";
import { inimigos } from "./entities/enemy.js";
import { alimentos } from "./entities/items.js";
import { elementosDeCenario } from "./world/objects.js";
import { chave } from "./entities/key.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Ativa os controles do jogador
setupControls();

// Função global chamada ao clicar em uma fase
window.iniciarFase = function (faseSelecionada) {
  console.log(`Iniciando Fase ${faseSelecionada}...`);

  // Esconde botão reiniciar se estiver visível
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
  gameLoop({ ctx, player, inimigos, alimentos, objetos: elementosDeCenario, chave });
};
