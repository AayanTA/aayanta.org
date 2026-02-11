export class Missile {
  constructor(x, y, angle, owner) {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * 6;
    this.vy = Math.sin(angle) * 6;

    this.isMissile = true;

    this.radius = 3;
    this.owner = owner;
    this.life = 200;
  }

  update(track) {
    this.x += this.vx;
    this.y += this.vy;

    track.handleBounce(this);

    this.life--;
  }

  draw(ctx) {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
