import {
  PLAYER_RADIUS,
  ACCELERATION,
  ROTATION_SPEED,
  MAX_SPEED,
  FRICTION
} from "./constants.js";

export class Player {
  constructor(x, y, color, controls) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0;
    this.color = color;
    this.controls = controls;

    this.score = 0;
    this.stunnedUntil = 0;
  }

  update(input, delta) {
    if (Date.now() < this.stunnedUntil) return;

    if (input.isDown(this.controls.left)) {
      this.angle -= ROTATION_SPEED;
    }
    if (input.isDown(this.controls.right)) {
      this.angle += ROTATION_SPEED;
    }
    if (input.isDown(this.controls.thrust)) {
      this.vx += Math.cos(this.angle) * ACCELERATION;
      this.vy += Math.sin(this.angle) * ACCELERATION;
    }

    this.vx *= FRICTION;
    this.vy *= FRICTION;

    const speed = Math.hypot(this.vx, this.vy);
    if (speed > MAX_SPEED) {
      this.vx = (this.vx / speed) * MAX_SPEED;
      this.vy = (this.vy / speed) * MAX_SPEED;
    }

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(-10, -8);
    ctx.lineTo(-6, 0);
    ctx.lineTo(-10, 8);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }

  stun() {
    this.stunnedUntil = Date.now() + 1200;
    this.vx = 0;
    this.vy = 0;
  }
}
