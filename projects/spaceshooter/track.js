// track.js

export const TRACK = {
  outerMargin: 40,
  innerMargin: 180
};

export let outerRect;
export let innerRect;

export let portals = [];
export let speedPads = [];
export let checkpoints = [];
export let startLines = [];

export function initTrack(canvas) {
  const w = canvas.width;
  const h = canvas.height;

  outerRect = {
    x: TRACK.outerMargin,
    y: TRACK.outerMargin,
    w: w - TRACK.outerMargin * 2,
    h: h - TRACK.outerMargin * 2
  };

  innerRect = {
    x: TRACK.innerMargin,
    y: TRACK.innerMargin,
    w: w - TRACK.innerMargin * 2,
    h: h - TRACK.innerMargin * 2
  };

  portals = [
    { x: outerRect.x + 5, y: h / 2 - 40, w: 20, h: 80, side: "left" },
    { x: outerRect.x + outerRect.w - 25, y: h / 2 - 40, w: 20, h: 80, side: "right" }
  ];

  speedPads = [
    { x: w / 2 - 50, y: outerRect.y + 10, w: 100, h: 20, dir: { x: 1, y: 0 } }
  ];

  checkpoints = [
    { x: w / 2, y: outerRect.y + 10 },
    { x: outerRect.x + outerRect.w - 10, y: h / 2 },
    { x: w / 2, y: outerRect.y + outerRect.h - 10 },
    { x: outerRect.x + 10, y: h / 2 }
  ];

  startLines = [
    { x: outerRect.x + 120, y: outerRect.y, w: 6, h: 120 },
    { x: outerRect.x + 150, y: outerRect.y, w: 6, h: 120 }
  ];
}

export function drawTrack(ctx) {
  ctx.strokeStyle = "#00ff88";
  ctx.lineWidth = 3;

  ctx.strokeRect(outerRect.x, outerRect.y, outerRect.w, outerRect.h);
  ctx.strokeRect(innerRect.x, innerRect.y, innerRect.w, innerRect.h);

  ctx.fillStyle = "#ffffff";
  startLines.forEach(s => ctx.fillRect(s.x, s.y, s.w, s.h));

  ctx.fillStyle = "#00ffff";
  speedPads.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));

  ctx.fillStyle = "#ff00ff";
  portals.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));
}

export function handleWallCollision(entity) {

  const r = entity.radius;

  // Outer walls
  if (entity.x - r < outerRect.x) {
    entity.x = outerRect.x + r;
    entity.vx *= -0.6;
  }
  if (entity.x + r > outerRect.x + outerRect.w) {
    entity.x = outerRect.x + outerRect.w - r;
    entity.vx *= -0.6;
  }
  if (entity.y - r < outerRect.y) {
    entity.y = outerRect.y + r;
    entity.vy *= -0.6;
  }
  if (entity.y + r > outerRect.y + outerRect.h) {
    entity.y = outerRect.y + outerRect.h - r;
    entity.vy *= -0.6;
  }

  // Inner walls
  if (
    entity.x > innerRect.x - r &&
    entity.x < innerRect.x + innerRect.w + r &&
    entity.y > innerRect.y - r &&
    entity.y < innerRect.y + innerRect.h + r
  ) {
    if (entity.x < innerRect.x) {
      entity.x = innerRect.x - r;
      entity.vx *= -0.6;
    } else if (entity.x > innerRect.x + innerRect.w) {
      entity.x = innerRect.x + innerRect.w + r;
      entity.vx *= -0.6;
    }

    if (entity.y < innerRect.y) {
      entity.y = innerRect.y - r;
      entity.vy *= -0.6;
    } else if (entity.y > innerRect.y + innerRect.h) {
      entity.y = innerRect.y + innerRect.h + r;
      entity.vy *= -0.6;
    }
  }
}
