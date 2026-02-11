export class Missile {
  constructor(x, y, angle, owner) {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * 6;
    this.vy = Math.sin(angle) * 6;
    this.radius = 4;
    this.life = 120;
    this.owner = owner;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
  }

  draw(ctx) {
    ctx.fillStyle = "#ffff00";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
