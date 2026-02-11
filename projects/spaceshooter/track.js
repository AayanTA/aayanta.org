import { TRACK_OUTER, TRACK_INNER, PORTAL_SIZE } from "./constants.js";

export class Track {
  constructor() {
    this.outer = TRACK_OUTER;
    this.inner = TRACK_INNER;

    this.leftPortal = {
      x: this.outer.x,
      y: this.outer.y + this.outer.h / 2 - PORTAL_SIZE / 2
    };

    this.rightPortal = {
      x: this.outer.x + this.outer.w,
      y: this.leftPortal.y
    };

    this.lapLine = {
      x: this.outer.x + 5,
      y: this.outer.y + this.outer.h / 2,
      w: 30,
      h: 6
    };

    this.speedPads = [
    { x: this.outer.x + 200, y: this.outer.y + 30, w: 60, h: 10 },
    { x: this.outer.x + this.outer.w - 260, y: this.outer.y + this.outer.h - 40, w: 60, h: 10 }
    ];

  }

  draw(ctx) {
    ctx.strokeStyle = "#4cff4c";
    ctx.lineWidth = 2;

    ctx.strokeRect(
      this.outer.x,
      this.outer.y,
      this.outer.w,
      this.outer.h
    );

    ctx.strokeRect(
      this.inner.x,
      this.inner.y,
      this.inner.w,
      this.inner.h
    );

    // portals
    ctx.fillStyle = "purple";
    ctx.fillRect(this.leftPortal.x - 6, this.leftPortal.y, 6, PORTAL_SIZE);
    ctx.fillRect(this.rightPortal.x, this.rightPortal.y, 6, PORTAL_SIZE);

    // lap line
    ctx.fillStyle = "white";
    ctx.fillRect(
      this.lapLine.x,
      this.lapLine.y,
      this.lapLine.w,
      this.lapLine.h
    );

    // speed pads
    ctx.fillStyle = "#00ff66";
    this.speedPads.forEach(p =>
      ctx.fillRect(p.x, p.y, p.w, p.h)
    );

  }

  insideOuter(x, y, r) {
    return (
      x - r > this.outer.x &&
      x + r < this.outer.x + this.outer.w &&
      y - r > this.outer.y &&
      y + r < this.outer.y + this.outer.h
    );
  }

  insideInner(x, y, r) {
    return (
      x + r > this.inner.x &&
      x - r < this.inner.x + this.inner.w &&
      y + r > this.inner.y &&
      y - r < this.inner.y + this.inner.h
    );
  }

  handleBounce(obj) {
    if (!this.insideOuter(obj.x, obj.y, obj.radius)) {
      if (obj.x < this.outer.x || obj.x > this.outer.x + this.outer.w)
        obj.vx *= -0.7;
      if (obj.y < this.outer.y || obj.y > this.outer.y + this.outer.h)
        obj.vy *= -0.7;
    }

    if (this.insideInner(obj.x, obj.y, obj.radius)) {
      if (
        obj.x > this.inner.x &&
        obj.x < this.inner.x + this.inner.w
      )
        obj.vy *= -0.7;

      if (
        obj.y > this.inner.y &&
        obj.y < this.inner.y + this.inner.h
      )
        obj.vx *= -0.7;
    }
  }

  tryPortal(player) {
    if (player.portalCooldown > 0) return;

    const p = player;

    if (
      p.x < this.leftPortal.x &&
      p.y > this.leftPortal.y &&
      p.y < this.leftPortal.y + PORTAL_SIZE
    ) {
      p.x = this.rightPortal.x - 20;
      p.portalCooldown = 40;
    }

    if (
      p.x > this.rightPortal.x &&
      p.y > this.rightPortal.y &&
      p.y < this.rightPortal.y + PORTAL_SIZE
    ) {
      p.x = this.leftPortal.x + 20;
      p.portalCooldown = 40;
    }
  }

    checkLap(player) {
      const crossed =
        player.prevX < this.lapLine.x &&
        player.x > this.lapLine.x;

      if (crossed && Math.abs(player.vx) > 0.5) {
        player.laps++;
      }
    }


  applySpeedPads(player) {
    if (!player.speedCooldown) player.speedCooldown = 0;
    if (player.speedCooldown > 0) {
        player.speedCooldown--;
        return;
    }

    this.speedPads.forEach(p => {
        if (
          player.x > p.x &&
          player.x < p.x + p.w &&
          player.y > p.y &&
          player.y < p.y + p.h
        ) {
          playSound("sfx/boost.wav");
          player.vx += Math.cos(player.angle) * 1.8;
          player.vy += Math.sin(player.angle) * 1.8;
          player.speedCooldown = 30;
        }
    });
    }

}
