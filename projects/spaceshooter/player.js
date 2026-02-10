export class Player {
  constructor(x, y, angle, color, controls) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.color = color;
    this.controls = controls;

    this.vx = 0;
    this.vy = 0;

    this.radius = 14;
    this.accel = 0.25;
    this.turnSpeed = 0.06;
    this.drag = 0.985;

    this.lap = 0;
    this.stun = 0;
    this.portalCooldown = 0;

    this.particles = [];
  }

  update(keys) {
    if (this.stun > 0) {
      this.stun--;
      return;
    }

    if (keys[this.controls.left]) this.angle -= this.turnSpeed;
    if (keys[this.controls.right]) this.angle += this.turnSpeed;

    if (keys[this.controls.up]) {
      this.vx += Math.cos(this.angle) * this.accel;
      this.vy += Math.sin(this.angle) * this.accel;

      this.spawnParticle();
    }

    this.vx *= this.drag;
    this.vy *= this.drag;

    this.x += this.vx;
    this.y += this.vy;

    if (this.portalCooldown > 0) this.portalCooldown--;

    this.updateParticles();
  }

  spawnParticle() {
    this.particles.push({
      x: this.x - Math.cos(this.angle) * 16,
      y: this.y - Math.sin(this.angle) * 16,
      life: 20
    });
  }

  updateParticles() {
    this.particles.forEach(p => p.life--);
    this.particles = this.particles.filter(p => p.life > 0);
  }

  draw(ctx) {
    ctx.fillStyle = this.color;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    ctx.beginPath();
    ctx.moveTo(18, 0);
    ctx.lineTo(-14, 10);
    ctx.lineTo(-8, 0);
    ctx.lineTo(-14, -10);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    ctx.fillStyle = this.color;
    this.particles.forEach(p => {
      ctx.globalAlpha = p.life / 20;
      ctx.fillRect(p.x, p.y, 3, 3);
    });
    ctx.globalAlpha = 1;
  }
}
