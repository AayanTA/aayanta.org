import { WIDTH, HEIGHT } from "./constants.js";

export class Player {
  constructor(x, y, color, controls) {
    this.x = x;
    this.y = y;

    this.vx = 0;
    this.vy = 0;

    this.angle = 0;
    this.radius = 12;

    this.color = color;
    this.controls = controls;

    this.laps = 0;
    this.checkpointIndex = 0;

    this.stun = 0;
    this.fireCooldown = 0;

    this.particles = [];   // ✅ FIXED
  }

  update(keys) {

    if (this.stun > 0) {
      this.stun--;
      return;
    }

    // Rotation
    if (keys[this.controls.left]) this.angle -= 0.06;
    if (keys[this.controls.right]) this.angle += 0.06;

    // Thrust
    if (keys[this.controls.thrust]) {
      this.vx += Math.cos(this.angle) * 0.25;
      this.vy += Math.sin(this.angle) * 0.25;

      // Add thrust particles
      this.particles.push({
        x: this.x - Math.cos(this.angle) * 14,
        y: this.y - Math.sin(this.angle) * 14,
        life: 20
      });
    }

    // Friction
    this.vx *= 0.99;
    this.vy *= 0.99;

    this.x += this.vx;
    this.y += this.vy;

    // Keep particles updated
    this.particles.forEach(p => p.life--);
    this.particles = this.particles.filter(p => p.life > 0);
  }

  draw(ctx) {

    // Draw particles
    ctx.fillStyle = this.color;
    this.particles.forEach(p => {
      ctx.globalAlpha = p.life / 20;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Draw ship
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(-10, -8);
    ctx.lineTo(-6, 0);
    ctx.lineTo(-10, 8);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }
}
