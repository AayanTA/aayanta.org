export class Track {
    constructor(canvas) {
        this.canvas = canvas;

        this.outer = { x: 100, y: 100, w: 600, h: 400 };
        this.inner = { x: 300, y: 200, w: 200, h: 200 };

        this.speedPad = {
            x: 370,
            y: 120,
            w: 60,
            h: 30,
            boostX: 4,
            boostY: 0
        };

        this.checkpoints = [
            { x: 650, y: 300 },
            { x: 400, y: 450 },
            { x: 150, y: 300 },
            { x: 400, y: 150 }
        ];
    }

    draw(ctx) {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 4;

        ctx.strokeRect(this.outer.x, this.outer.y, this.outer.w, this.outer.h);
        ctx.strokeRect(this.inner.x, this.inner.y, this.inner.w, this.inner.h);

        ctx.fillStyle = "lime";
        ctx.fillRect(this.speedPad.x, this.speedPad.y, this.speedPad.w, this.speedPad.h);

        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(this.speedPad.x + 20, this.speedPad.y + 8);
        ctx.lineTo(this.speedPad.x + 20, this.speedPad.y + 22);
        ctx.lineTo(this.speedPad.x + 40, this.speedPad.y + 15);
        ctx.closePath();
        ctx.fill();
    }

    isInsideOuter(x, y) {
        return (
            x > this.outer.x &&
            x < this.outer.x + this.outer.w &&
            y > this.outer.y &&
            y < this.outer.y + this.outer.h
        );
    }

    isInsideInner(x, y) {
        return (
            x > this.inner.x &&
            x < this.inner.x + this.inner.w &&
            y > this.inner.y &&
            y < this.inner.y + this.inner.h
        );
    }

    handleWallCollision(player) {

        // Outer walls
        if (player.x - player.radius < this.outer.x) {
            player.x = this.outer.x + player.radius;
            player.vx = Math.abs(player.vx) * 0.8;
        }

        if (player.x + player.radius > this.outer.x + this.outer.w) {
            player.x = this.outer.x + this.outer.w - player.radius;
            player.vx = -Math.abs(player.vx) * 0.8;
        }

        if (player.y - player.radius < this.outer.y) {
            player.y = this.outer.y + player.radius;
            player.vy = Math.abs(player.vy) * 0.8;
        }

        if (player.y + player.radius > this.outer.y + this.outer.h) {
            player.y = this.outer.y + this.outer.h - player.radius;
            player.vy = -Math.abs(player.vy) * 0.8;
        }

        // Inner obstacle
        if (this.isInsideInner(player.x, player.y)) {

            const leftDist = Math.abs(player.x - this.inner.x);
            const rightDist = Math.abs(player.x - (this.inner.x + this.inner.w));
            const topDist = Math.abs(player.y - this.inner.y);
            const bottomDist = Math.abs(player.y - (this.inner.y + this.inner.h));

            const min = Math.min(leftDist, rightDist, topDist, bottomDist);

            if (min === leftDist) {
                player.x = this.inner.x - player.radius;
                player.vx = -Math.abs(player.vx) * 0.8;
            } else if (min === rightDist) {
                player.x = this.inner.x + this.inner.w + player.radius;
                player.vx = Math.abs(player.vx) * 0.8;
            } else if (min === topDist) {
                player.y = this.inner.y - player.radius;
                player.vy = -Math.abs(player.vy) * 0.8;
            } else {
                player.y = this.inner.y + this.inner.h + player.radius;
                player.vy = Math.abs(player.vy) * 0.8;
            }
        }
    }

    handleMissileWallBounce(missile) {

        if (missile.x - missile.radius < this.outer.x ||
            missile.x + missile.radius > this.outer.x + this.outer.w) {
            missile.vx *= -1;
        }

        if (missile.y - missile.radius < this.outer.y ||
            missile.y + missile.radius > this.outer.y + this.outer.h) {
            missile.vy *= -1;
        }

        if (this.isInsideInner(missile.x, missile.y)) {
            missile.vx *= -1;
            missile.vy *= -1;
        }
    }

    handleSpeedPad(player) {
        if (
            player.x > this.speedPad.x &&
            player.x < this.speedPad.x + this.speedPad.w &&
            player.y > this.speedPad.y &&
            player.y < this.speedPad.y + this.speedPad.h
        ) {
            player.vx += this.speedPad.boostX;
            player.vy += this.speedPad.boostY;
        }
    }

    updateLap(player) {
        const cp = this.checkpoints[player.checkpointIndex];
        const dx = player.x - cp.x;
        const dy = player.y - cp.y;

        if (Math.hypot(dx, dy) < 40) {
            player.checkpointIndex++;
            if (player.checkpointIndex >= this.checkpoints.length) {
                player.checkpointIndex = 0;
                player.score++;
            }
        }
    }
}
