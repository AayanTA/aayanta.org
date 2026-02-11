export class Track {
    constructor(canvas) {
        this.canvas = canvas;

        this.outer = { x: 100, y: 100, w: 600, h: 400 };
        this.inner = { x: 250, y: 200, w: 300, h: 200 };

        this.portalLeft = { x: 100, y: 250, w: 10, h: 100 };
        this.portalRight = { x: 690, y: 250, w: 10, h: 100 };

        this.speedPad = { x: 370, y: 150, w: 60, h: 30, angle: 0 };

        this.checkpoints = [
            { x: 700, y: 300 },
            { x: 400, y: 500 },
            { x: 100, y: 300 },
            { x: 400, y: 100 }
        ];
    }

    draw(ctx) {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 4;

        ctx.strokeRect(this.outer.x, this.outer.y, this.outer.w, this.outer.h);
        ctx.strokeRect(this.inner.x, this.inner.y, this.inner.w, this.inner.h);

        ctx.fillStyle = "purple";
        ctx.fillRect(this.portalLeft.x, this.portalLeft.y, this.portalLeft.w, this.portalLeft.h);
        ctx.fillRect(this.portalRight.x, this.portalRight.y, this.portalRight.w, this.portalRight.h);

        ctx.fillStyle = "lime";
        ctx.fillRect(this.speedPad.x, this.speedPad.y, this.speedPad.w, this.speedPad.h);

        // start/finish line
        ctx.fillStyle = "white";
        ctx.fillRect(690, 250, 5, 100);
    }

    handleWallCollision(obj) {
        if (this.isWall(obj.x, obj.y)) {
            obj.x -= Math.cos(obj.angle) * obj.speed;
            obj.y -= Math.sin(obj.angle) * obj.speed;
            obj.speed *= -0.5;
        }
    }

    isWall(x, y) {
        const inOuter =
            x > this.outer.x &&
            x < this.outer.x + this.outer.w &&
            y > this.outer.y &&
            y < this.outer.y + this.outer.h;

        const inInner =
            x > this.inner.x &&
            x < this.inner.x + this.inner.w &&
            y > this.inner.y &&
            y < this.inner.y + this.inner.h;

        return !inOuter || inInner;
    }

    handlePortal(obj) {
        if (
            obj.x < this.portalLeft.x + this.portalLeft.w &&
            obj.y > this.portalLeft.y &&
            obj.y < this.portalLeft.y + this.portalLeft.h
        ) {
            obj.x = this.portalRight.x - 15;
        }

        if (
            obj.x > this.portalRight.x &&
            obj.y > this.portalRight.y &&
            obj.y < this.portalRight.y + this.portalRight.h
        ) {
            obj.x = this.portalLeft.x + 15;
        }
    }

    handleSpeedPad(player) {
        if (
            player.x > this.speedPad.x &&
            player.x < this.speedPad.x + this.speedPad.w &&
            player.y > this.speedPad.y &&
            player.y < this.speedPad.y + this.speedPad.h
        ) {
            // boost RIGHT only (fixed direction)
            player.speed = 8;
            player.angle = 0;
        }
    }

    updateLap(player) {
        const cp = this.checkpoints[player.checkpointIndex];
        const dx = player.x - cp.x;
        const dy = player.y - cp.y;

        if (Math.hypot(dx, dy) < 30) {
            player.checkpointIndex++;

            if (player.checkpointIndex >= this.checkpoints.length) {
                player.checkpointIndex = 0;
                player.score++;
            }
        }
    }
}
