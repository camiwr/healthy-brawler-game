import { setupControls } from "./engine/controls.js";
import { gameLoop } from "./engine/gameLoop.js";
import { player } from "./entities/player.js";
import { inimigos } from "./entities/enemy.js";
import { alimentos } from "./entities/items.js";
import { elementosDeCenario } from "./world/objects.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

setupControls();
gameLoop({ ctx, player, inimigos, alimentos, objetos: elementosDeCenario });