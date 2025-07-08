export function updateCamera(playerX, canvasWidth, worldWidth) {
  return Math.max(0, Math.min(playerX - canvasWidth / 2, worldWidth - canvasWidth));
}