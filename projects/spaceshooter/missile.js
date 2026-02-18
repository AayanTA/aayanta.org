export class Missile {
    constructor(x, y, angle, parentVx, parentVy) {
        this.x = x;
        this.y = y;

        const speed = 7;

        this.vx = Math.cos(angle) * speed + parentVx;
        this.vy = Math.sin(angle) * speed + parentVy;

        this.radius = 4;
        this.life = 300;
        this.dead = false;
    }

    update(track, players) {
        if (this.dead) return;

        this.x += this.vx;
        this.y += this.vy;

        const normal = track.getWallNormal(this.x, this.y, this.radius);

        if (normal) {
            const dot = this.vx * normal.x + this.vy * normal.y;

            this.vx -= 2 * dot * normal.x;
            this.vy -= 2 * dot * normal.y;
        }

        players.forEach(player => {
            const dx = this.x - player.x;
            const dy = this.y - player.y;
            if (Math.hypot(dx, dy) < player.radius + this.radius) {
                player.stun();
                this.dead = true;
            }
        });

        this.life--;
        if (this.life <= 0) this.dead = true;
    }

    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}
