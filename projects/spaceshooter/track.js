export class Track {
    constructor(canvas) {
        this.canvas = canvas;

        this.outer = { x: 100, y: 100, w: 600, h: 400 };
        this.inner = { x: 300, y: 200, w: 200, h: 200 };

        this.portalLeft = { x: 100, y: 250, w: 10, h: 100 };
        this.portalRight = { x: 690, y: 250, w: 10, h: 100 };

        // SMALLER SPEED PAD
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

        // Portals
        ctx.fillStyle = "purple";
        ctx.fillRect(this.portalLeft.x, this.portalLeft.y, this.portalLeft.w, this.portalLeft.h);
        ctx.fillRect(this.portalRight.x, this.portalRight.y, this.portalRight.w, this.portalRight.h);

        // Speed Pad
        ctx.fillStyle = "lime";
        ctx.fillRect(this.speedPad.x, this.speedPad.y, this.speedPad.w, this.speedPad.h);

        // Arrow Indicator
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(this.speedPad.x + 20, this.speedPad.y + 8);
        ctx.lineTo(this.speedPad.x + 20, this.speedPad.y + 22);
        ctx.lineTo(this.speedPad.x + 40, this.speedPad.y + 15);
        ctx.closePath();
        ctx.fill();
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

    // Proper momentum reflection
    handleWallCollision(player) {
        if (this.isWall(player.x, player.y)) {

            // Determine normal
            let nx = 0;
            let ny = 0;

            if (player.x <= this.outer.x || player.x >= this.outer.x + this.outer.w)
                nx = -1;
            if (player.y <= this.outer.y || player.y >= this.outer.y + this.outer.h)
                ny = -1;

            if (
                player.x >= this.inner.x &&
                player.x <= this.inner.x + this.inner.w
            ) nx = 1;

            if (
                player.y >= this.inner.y &&
                player.y <= this.inner.y + this.inner.h
            ) ny = 1;

            const dot = player.vx * nx + player.vy * ny;

            player.vx -= 2 * dot * nx;
            player.vy -= 2 * dot * ny;

            player.vx *= 0.9;
            player.vy *= 0.9;
        }
    }

    handleMissileWallBounce(missile) {
        if (this.isWall(missile.x, missile.y)) {
            missile.vx *= -1;
            missile.vy *= -1;
        }
    }

    // Ships do NOT teleport
    handlePortal(obj) {

        const isMissile = obj.radius === 4;

        if (!isMissile) return;

        if (
            obj.x < this.portalLeft.x + this.portalLeft.w &&
            obj.y > this.portalLeft.y &&
            obj.y < this.portalLeft.y + this.portalLeft.h
        ) {
            obj.x = this.portalRight.x - 20;
        }

        if (
            obj.x > this.portalRight.x &&
            obj.y > this.portalRight.y &&
            obj.y < this.portalRight.y + this.portalRight.h
        ) {
            obj.x = this.portalLeft.x + 20;
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
