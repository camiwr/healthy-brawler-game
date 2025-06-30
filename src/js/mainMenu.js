const mainMenu = document.getElementById("mainMenu");
const instructionsScreen = document.getElementById("instructionsScreen");
const fasesScreen = document.getElementById("fasesScreen");
const gameCanvas = document.getElementById("gameCanvas");

const startBtn = document.getElementById("startBtn");
const toFasesBtn = document.getElementById("toFasesBtn");

startBtn.onclick = () => {
  mainMenu.style.display = "none";
  instructionsScreen.style.display = "block";
};

toFasesBtn.onclick = () => {
  instructionsScreen.style.display = "none";
  fasesScreen.style.display = "block";
};

document.querySelectorAll(".faseBtn").forEach(btn => {
  btn.onclick = () => {
    const fase = btn.dataset.fase;
    fasesScreen.style.display = "none";
    gameCanvas.style.display = "block";
    iniciarFase(fase); // essa função está no game.js
  };
});
