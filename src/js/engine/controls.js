export const keys = {
  a: false,
  d: false,
  w: false,
  s: false,
  space: false,
};

export function setupControls() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "a" || e.key === "ArrowLeft") keys.a = true;
    if (e.key === "d" || e.key === "ArrowRight") keys.d = true;
    if (e.key === "w" || e.key === "ArrowUp") keys.w = true;
    if (e.key === "s" || e.key === "ArrowDown") keys.s = true;
    if (e.key === " ") keys.space = true;
  });

  document.addEventListener("keyup", (e) => {
    if (e.key === "a" || e.key === "ArrowLeft") keys.a = false;
    if (e.key === "d" || e.key === "ArrowRight") keys.d = false;
    if (e.key === "w" || e.key === "ArrowUp") keys.w = false;
    if (e.key === "s" || e.key === "ArrowDown") keys.s = false;
    if (e.key === " ") keys.space = false;
  });
}
