// stage1.js
export const stage1 = {
  objects: [
    { x: 400, y: 470 - 60, width: 30, height: 60, color: "#654321" },
    { x: 900, y: 470 - 30, width: 60, height: 30, color: "#555" },
    { x: 1600, y: 470 - 80, width: 40, height: 80, color: "green" },
    { x: 2200, y: 470 - 40, width: 50, height: 40, color: "#999" }
  ],

  items: [
    { x: 500, y: 440, width: 20, height: 20, color: "lime", collected: false },
    { x: 800, y: 440, width: 20, height: 20, color: "lime", collected: false },
    { x: 1300, y: 440, width: 20, height: 20, color: "lime", collected: false },
    { x: 1900, y: 440, width: 20, height: 20, color: "lime", collected: false },
    { x: 2400, y: 440, width: 20, height: 20, color: "lime", collected: false }
  ],

  enemies: [
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

  keyItem: {
    x: null,
    y: null,
    width: 20,
    height: 20,
    color: "gold",
    visible: false,
    collected: false
  }
};
