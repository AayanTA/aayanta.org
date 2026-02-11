let audioUnlocked = false;

export function unlockAudio() {
  if (audioUnlocked) return;

  const dummy = new Audio();
  dummy.play().catch(() => {});
  audioUnlocked = true;
}

export function playSound(src) {
  if (!audioUnlocked) return;

  const s = new Audio(src);
  s.volume = 0.4;
  s.play().catch(() => {});
}
