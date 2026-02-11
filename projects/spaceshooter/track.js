// track.js

export const TRACK = {
  outerMargin: 40,
  innerMargin: 180
};

export let checkpoints = [];
export let startLines = [];
export let speedPads = [];
export let portals = [];

export function initTrack(canvas) {
  const w = canvas.width;
  const h = canvas.height;

  const outer = {
    x: TRACK.outerMargin,
    y: TRACK.outerMargin,
    w: w - TRACK.outerMargin * 2,
    h: h - TRACK.outerMargin * 2
  };

  const inner = {
    x: TRACK.innerMargin,
    y: TRACK.innerMargin,
    w: w - TRACK.innerMargin * 2,
    h: h - TRACK.innerMargin * 2
  };

  // CLOCKWISE CHECKPOINTS
  checkpoints = [
    { x: w / 2, y: outer.y + 5 },               // top
    { x: outer.x + outer.w - 5, y: h / 2 },     // right
    { x: w / 2, y: outer.y + outer.h - 5 },     // bottom
    { x: outer.x + 5, y: h / 2 }                // left
  ];

  // START LINES (2 slightly offset)
  startLines = [
    { x: outer.x + 100, y: outer.y, w: 4, h: 120 },
    { x: outer.x + 130, y: outer.y, w: 4, h: 120 }
  ];

  // SPEED PADS (fixed direction)
  speedPads = [
    { x: w / 2 - 40, y: outer.y + 20, w: 80, h: 20, dir: { x: 1, y: 0 } }
  ];

  portals = [
    { x: outer.x + 10, y: h / 2 - 40, w: 20, h: 80, side: "left" },
    { x: outer.x + outer.w - 30, y: h / 2 - 40, w: 20, h: 80, side: "right" }
  ];

  return { outer, inner };
}

export function drawTrack(ctx, outer, inner) {
  ctx.strokeStyle = "#00ff88";
  ctx.lineWidth = 3;

  ctx.strokeRect(outer.x, outer.y, outer.w, outer.h);
  ctx.strokeRect(inner.x, inner.y, inner.w, inner.h);

  // draw checkpoints
  ctx.fillStyle = "rgba(0,255,100,0.4)";
  checkpoints.forEach(c => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, 8, 0, Math.PI * 2);
    ctx.fill();
  });

  // draw start lines
  ctx.fillStyle = "#ffffff";
  startLines.forEach(s => {
    ctx.fillRect(s.x, s.y, s.w, s.h);
  });

  // draw speed pads
  ctx.fillStyle = "#00ffff";
  speedPads.forEach(p => {
    ctx.fillRect(p.x, p.y, p.w, p.h);
  });

  // draw portals
  ctx.fillStyle = "#ff00ff";
  portals.forEach(p => {
    ctx.fillRect(p.x, p.y, p.w, p.h);
  });
}

export function handleMissilePortals(missile) {
  portals.forEach(p => {
    if (
      missile.x > p.x &&
      missile.x < p.x + p.w &&
      missile.y > p.y &&
      missile.y < p.y + p.h
    ) {
      const other = portals.find(o => o !== p);
      missile.x = other.x + other.w / 2;
      missile.y = other.y + other.h / 2;
    }
  });
}

export function applySpeedPads(player) {
  speedPads.forEach(p => {
    if (
      player.x > p.x &&
      player.x < p.x + p.w &&
      player.y > p.y &&
      player.y < p.y + p.h
    ) {
      player.vx += p.dir.x * 4;
      player.vy += p.dir.y * 4;
    }
  });
}

export function updateLap(player) {
  const target = checkpoints[player.checkpointIndex];

  const dx = player.x - target.x;
  const dy = player.y - target.y;

  if (Math.sqrt(dx * dx + dy * dy) < 20) {
    player.checkpointIndex++;
  }

  if (player.checkpointIndex >= checkpoints.length) {
    // must cross start line
    const line = startLines[player.id];

    if (
      player.x > line.x &&
      player.x < line.x + line.w &&
      player.y > line.y &&
      player.y < line.y + line.h
    ) {
      player.laps++;
      player.checkpointIndex = 0;
    }
  }
}
