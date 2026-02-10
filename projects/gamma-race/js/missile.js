import { MISSILE_SPEED, MISSILE_RADIUS } from "./constants.js";

export class Missile {
  constructor(x, y, angle, owner) {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * MISSILE_SPEED;
    this.vy = Math.sin(angle) * MISSILE_SPEED;
    this.owner = owner;
    this.active = true;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx) {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(this.x, this.y, MISSILE_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  }
}
