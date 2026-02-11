export function playSound(src) {
  const s = new Audio(src);
  s.volume = 0.4;
  s.play();
}
