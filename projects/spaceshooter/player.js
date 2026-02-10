import {
  ACCELERATION,
  ROTATION_SPEED,
  FRICTION,
  MAX_SPEED,
  PLAYER_RADIUS,
  STUN_TIME
} from "./constants.js";

export class Player {
  constructor(x, y, color, controls) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.angle = -Math.PI / 2;
    this.color = color;
    this.controls = controls;

    this.score = 0;
    this.stunTimer = 0;
  }

  update(keys) {
    if (this.stunTimer > 0) {
      this.stunTimer--;
      return;
    }

    if (keys[this.controls.left]) this.angle -= ROTATION_SPEED;
    if (keys[this.controls.right]) this.angle += ROTATION_SPEED;

    if (keys[this.controls.thrust]) {
      this.vx += Math.cos(this.angle) * ACCELERATION;
      this.vy += Math.sin(this.angle) * ACCELERATION;
    }

    const speed = Math.hypot(this.vx, this.vy);
    if (speed > MAX_SPEED) {
      this.vx *= MAX_SPEED / speed;
      this.vy *= MAX_SPEED / speed;
    }

    this.vx *= FRICTION;
    this.vy *= FRICTION;

    this.x += this.vx;
    this.y += this.vy;
  }

  stun() {
    this.stunTimer = STUN_TIME;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(-10, 8);
    ctx.lineTo(-10, -8);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}
