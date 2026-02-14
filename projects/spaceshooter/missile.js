export class Missile {
    constructor(x, y, angle, parentVx, parentVy) {
        this.x = x;
        this.y = y;

        const speed = 7;

        this.vx = Math.cos(angle) * speed + parentVx;
        this.vy = Math.sin(angle) * speed + parentVy;

        this.dead = false;
        this.radius = 4;
    }

    update(track) {
        this.x += this.vx;
        this.y += this.vy;

        track.handleMissileWallBounce(this);
        track.handlePortal(this);   // missiles DO teleport
    }

    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}
