export const fase1 = {
  objetos: [
    { x: 400, y: 470 - 60, width: 30, height: 60, color: "#654321" },
    { x: 900, y: 470 - 30, width: 60, height: 30, color: "#555" },
    { x: 1600, y: 470 - 80, width: 40, height: 80, color: "green" },
    { x: 2200, y: 470 - 40, width: 50, height: 40, color: "#999" }
  ],

  alimentos: [
    { x: 500, y: 440, width: 20, height: 20, color: "lime", coletado: false },
    { x: 800, y: 440, width: 20, height: 20, color: "lime", coletado: false },
    { x: 1300, y: 440, width: 20, height: 20, color: "lime", coletado: false },
    { x: 1900, y: 440, width: 20, height: 20, color: "lime", coletado: false },
    { x: 2400, y: 440, width: 20, height: 20, color: "lime", coletado: false }
  ],

  inimigos: [
    {
      x: 900, y: 470 - 45, width: 40, height: 80,
      color: "red", speed: 0.7, isAlive: true,
      isFlashing: false, attackCooldown: false, isFinal: false
    },
    {
      x: 1600, y: 470 - 45, width: 40, height: 80,
      color: "red", speed: 0.7, isAlive: true,
      isFlashing: false, attackCooldown: false, isFinal: false
    },
    {
      x: 2600, y: 470 - 45, width: 40, height: 80,
      color: "darkred", speed: 0.7, isAlive: true,
      isFlashing: false, attackCooldown: false, isFinal: true
    }
  ],

  chave: {
    x: null,
    y: null,
    width: 20,
    height: 20,
    color: "gold",
    visivel: false,
    coletada: false
  }
};