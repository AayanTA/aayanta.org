export class Missile {
  constructor(player) {
    this.x = player.x;
    this.y = player.y;
    this.vx = Math.cos(player.angle) * 6 + player.vx;
    this.vy = Math.sin(player.angle) * 6 + player.vy;
    this.life = 180;
    this.radius = 4;
    this.owner = player;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
  }

  draw(ctx) {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
