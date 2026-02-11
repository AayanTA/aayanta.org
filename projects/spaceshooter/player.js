import { Missile } from "./missile.js";

export class Player {
    constructor(x, y, color, controls) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.controls = controls;

        this.angle = 0;
        this.speed = 0;
        this.radius = 12;

        this.score = 0;
        this.checkpointIndex = 0;

        this.shootCooldown = 0;
        this.particles = [];
    }

    update(keys, track) {
        if (keys[this.controls.left]) this.angle -= 0.05;
        if (keys[this.controls.right]) this.angle += 0.05;

        if (keys[this.controls.up]) {
            this.speed += 0.2;
            this.spawnParticle();
        }

        this.speed *= 0.99;

        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        track.handleWallCollision(this);
        track.handlePortal(this);
        track.handleSpeedPad(this);
        track.updateLap(this);

        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
        });

        this.particles = this.particles.filter(p => p.life > 0);

        if (this.shootCooldown > 0) this.shootCooldown--;
    }

    tryShoot() {
        if (this.shootCooldown > 0) return null;

        this.shootCooldown = 20;

        return new Missile(this.x, this.y, this.angle);
    }

    spawnParticle() {
        this.particles.push({
            x: this.x,
            y: this.y,
            vx: -Math.cos(this.angle) * 2 + (Math.random() - 0.5),
            vy: -Math.sin(this.angle) * 2 + (Math.random() - 0.5),
            life: 20
        });
    }

    draw(ctx) {
        this.particles.forEach(p => {
            ctx.fillStyle = "yellow";
            ctx.fillRect(p.x, p.y, 2, 2);
        });

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
