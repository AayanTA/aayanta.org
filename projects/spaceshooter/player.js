export class Player {
  constructor(x, y, color, controls) {
    this.x = x;
    this.y = y;
    this.angle = 0;

    this.vx = 0;
    this.vy = 0;

    this.prevX = x;
    this.prevY = y;


    this.color = color;
    this.controls = controls;

    this.radius = 12;

    this.laps = 0;
    this.stun = 0;

    this.portalCooldown = 0;

    this.particles = [];
  }

  update(keys) {
    if (this.portalCooldown > 0) this.portalCooldown--;

    if (this.stun > 0) {
      this.stun--;
      return;
    }

    const TURN = 0.07;
    const THRUST = 0.22;
    const FRICTION = 0.985;

    if (keys[this.controls.left]) this.angle -= TURN;
    if (keys[this.controls.right]) this.angle += TURN;

    if (keys[this.controls.thrust]) {
      this.vx += Math.cos(this.angle) * THRUST;
      this.vy += Math.sin(this.angle) * THRUST;

      this.spawnParticle();
    }

    this.vx *= FRICTION;
    this.vy *= FRICTION;

    this.x += this.vx;
    this.y += this.vy;

    this.prevX = this.x;
    this.prevY = this.y;


    this.updateParticles();
  }

  spawnParticle() {
    this.particles.push({
      x: this.x - Math.cos(this.angle) * 14,
      y: this.y - Math.sin(this.angle) * 14,
      vx: -Math.cos(this.angle) * 1.5 + (Math.random() - 0.5),
      vy: -Math.sin(this.angle) * 1.5 + (Math.random() - 0.5),
      life: 20
    });
  }

  updateParticles() {
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
    });

    this.particles = this.particles.filter(p => p.life > 0);
  }

  draw(ctx) {
    this.particles.forEach(p => {
      ctx.globalAlpha = p.life / 20;
      ctx.fillStyle = "orange";
      ctx.fillRect(p.x, p.y, 2, 2);
      ctx.globalAlpha = 1;
    });

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(16, 0);
    ctx.lineTo(-10, 8);
    ctx.lineTo(-6, 0);
    ctx.lineTo(-10, -8);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}
