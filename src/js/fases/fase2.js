export const fase2 = {
  objetos: [
    { x: 500, y: 470 - 60, width: 50, height: 60, color: "#996633" }, // caixa grande
    { x: 1100, y: 470 - 40, width: 30, height: 40, color: "#777" },
    { x: 1700, y: 470 - 70, width: 40, height: 70, color: "#008000" }, // árvore alta
    { x: 2000, y: 470 - 50, width: 70, height: 50, color: "#333" }
  ],

  alimentos: [
    { x: 600, y: 440, width: 20, height: 20, color: "orange", coletado: false },
    { x: 950, y: 440, width: 20, height: 20, color: "orange", coletado: false },
    { x: 1400, y: 440, width: 20, height: 20, color: "orange", coletado: false },
    { x: 2100, y: 440, width: 20, height: 20, color: "orange", coletado: false },
    { x: 2700, y: 440, width: 20, height: 20, color: "orange", coletado: false }
  ],

  inimigos: [
    {
      x: 1000, y: 470 - 45, width: 40, height: 80,
      color: "pink", speed: 0.4, isAlive: true,
      isFlashing: false, attackCooldown: false, isFinal: false
    },
    {
      x: 1800, y: 470 - 45, width: 40, height: 80,
      color: "pink", speed: 0.5, isAlive: true,
      isFlashing: false, attackCooldown: false, isFinal: false
    },
    {
      x: 2750, y: 470 - 45, width: 40, height: 80,
      color: "black", speed: 0.7, isAlive: true,
      isFlashing: false, attackCooldown: false, isFinal: true
    }
  ],

  chave: {
    x: null,
    y: null,
    width: 20,
    height: 20,
    color: "blue",
    visivel: false,
    coletada: false
  }
};