import { Missile } from "./missile.js";

export class Player {
    constructor(x, y, color, controls) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.controls = controls;

        this.angle = 0;

        this.vx = 0;
        this.vy = 0;

        this.radius = 12;

        this.score = 0;
        this.checkpointIndex = 0;

        this.shootCooldown = 0;
        this.stunTimer = 0;

        this.particles = [];

        this.thrustPower = 0.25;
        this.maxSpeed = 6;
    }

    update(keys, track) {

        if (this.stunTimer > 0) {
            this.stunTimer--;
        } else {
            if (keys[this.controls.left]) this.angle -= 0.05;
            if (keys[this.controls.right]) this.angle += 0.05;

            if (keys[this.controls.up]) {
                this.vx += Math.cos(this.angle) * this.thrustPower;
                this.vy += Math.sin(this.angle) * this.thrustPower;
            }
        }

        // Friction
        this.vx *= 0.99;
        this.vy *= 0.99;

        // Clamp speed
        const speed = Math.hypot(this.vx, this.vy);
        if (speed > this.maxSpeed) {
            const scale = this.maxSpeed / speed;
            this.vx *= scale;
            this.vy *= scale;
        }

        this.x += this.vx;
        this.y += this.vy;

        track.handleWallCollision(this);
        track.handleSpeedPad(this);
        track.updateLap(this);

        if (this.shootCooldown > 0) this.shootCooldown--;
    }

    tryShoot() {
        if (this.shootCooldown > 0 || this.stunTimer > 0) return null;

        this.shootCooldown = 20;

        return new Missile(
            this.x,
            this.y,
            this.angle,
            this.vx,
            this.vy
        );
    }

    stun() {
        this.stunTimer = 60; // 1 second stun
        this.vx *= 0.4;
        this.vy *= 0.4;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.fillStyle = this.stunTimer > 0 ? "gray" : this.color;

        ctx.beginPath();
        ctx.moveTo(15, 0);
        ctx.lineTo(-10, 8);
        ctx.lineTo(-10, -8);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}
