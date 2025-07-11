const mainMenu = document.getElementById("mainMenu");
const instructionsScreen = document.getElementById("instructionsScreen");
const stageScreen = document.getElementById("stageScreen");
const gameCanvas = document.getElementById("gameCanvas");

const startBtn = document.getElementById("startBtn");
const toStagesBtn = document.getElementById("toStagesBtn");

startBtn.onclick = () => {
  mainMenu.style.display = "none";
  instructionsScreen.style.display = "block";
};

toStagesBtn.onclick = () => {
  instructionsScreen.style.display = "none";
  stageScreen.style.display = "block";
};

document.querySelectorAll(".stageBtn").forEach(btn => {
  btn.onclick = () => {
    const stage = btn.dataset.stage;
    stageScreen.style.display = "none";
    gameCanvas.style.display = "block";
    startStage(stage);
  };
});
