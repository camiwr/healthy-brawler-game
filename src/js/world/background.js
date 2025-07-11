const bgImage = new Image();
bgImage.src = "src/assets/img/candy.jpg";

export function drawBackground(ctx, cameraX, worldWidth, floorTop, floorBottom) {
  if (!bgImage.complete) return;

  const bgWidth = bgImage.width;
  const scale = floorBottom / bgImage.height;
  const repeatCount = Math.ceil(worldWidth / (bgWidth * scale));

  for (let i = 0; i < repeatCount; i++) {
    const x = i * bgWidth * scale - cameraX * 0.2;
    ctx.drawImage(bgImage, x, 0, bgWidth * scale, bgImage.height * scale);
  }
}
