export const walls = [
  // Outer walls
  { x: 0, y: 0, w: 1000, h: 20 },
  { x: 0, y: 580, w: 1000, h: 20 },
  { x: 0, y: 0, w: 20, h: 600 },
  { x: 980, y: 0, w: 20, h: 600 },

  // Inner circuit
  { x: 250, y: 140, w: 500, h: 10 },
  { x: 250, y: 450, w: 500, h: 10 },
  { x: 240, y: 150, w: 10, h: 300 },
  { x: 750, y: 150, w: 10, h: 300 }
];

export const portals = [
  { x: 235, y: 250, w: 10, h: 100, targetX: 765 },
  { x: 755, y: 250, w: 10, h: 100, targetX: 235 }
];

export const finishLines = {
  p1: { x: 495, y: 450, w: 10, h: 130 },
  p2: { x: 495, y: 20, w: 10, h: 130 }
};
