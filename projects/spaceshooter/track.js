export class Track {
    constructor(canvas) {
        this.canvas = canvas;

        this.outer = { x: 100, y: 100, w: 600, h: 400 };
        this.inner = { x: 300, y: 200, w: 200, h: 200 };

        // Start line (LEFT vertical)
        this.startLineX = 120;

        // Checkpoint 1 (RIGHT horizontal strip)
        this.cp1 = { x: 650, y: 100, w: 10, h: 400 };

        // Checkpoint 2 (BOTTOM vertical strip)
        this.cp2 = { x: 100, y: 450, w: 600, h: 10 };

        this.speedPad = {
            x: 370,
            y: 120,
            w: 60,
            h: 30,
            boostX: 4,
            boostY: 0
        };
    }

    draw(ctx) {

        ctx.strokeStyle = "white";
        ctx.lineWidth = 4;

        ctx.strokeRect(this.outer.x, this.outer.y, this.outer.w, this.outer.h);
        ctx.strokeRect(this.inner.x, this.inner.y, this.inner.w, this.inner.h);

        // Start line
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.startLineX, 100, 6, 400);

        // Checkpoints
        ctx.fillStyle = "rgba(255,0,0,0.3)";
        ctx.fillRect(this.cp1.x, this.cp1.y, this.cp1.w, this.cp1.h);

        ctx.fillStyle = "rgba(0,0,255,0.3)";
        ctx.fillRect(this.cp2.x, this.cp2.y, this.cp2.w, this.cp2.h);

        ctx.fillStyle = "lime";
        ctx.fillRect(this.speedPad.x, this.speedPad.y, this.speedPad.w, this.speedPad.h);
    }

    handleWallCollision(player) {

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

        // Proper inner resolution
        if (
            player.x > this.inner.x &&
            player.x < this.inner.x + this.inner.w &&
            player.y > this.inner.y &&
            player.y < this.inner.y + this.inner.h
        ) {
            const centerX = this.inner.x + this.inner.w/2;
            const centerY = this.inner.y + this.inner.h/2;

            const dx = player.x - centerX;
            const dy = player.y - centerY;

            if (Math.abs(dx) > Math.abs(dy)) {
                player.x = dx > 0
                    ? this.inner.x + this.inner.w + player.radius
                    : this.inner.x - player.radius;
                player.vx *= -0.8;
            } else {
                player.y = dy > 0
                    ? this.inner.y + this.inner.h + player.radius
                    : this.inner.y - player.radius;
                player.vy *= -0.8;
            }
        }
    }

    getWallNormal(x, y, r) {
        if (x - r < this.outer.x) return { x: 1, y: 0 };
        if (x + r > this.outer.x + this.outer.w) return { x: -1, y: 0 };
        if (y - r < this.outer.y) return { x: 0, y: 1 };
        if (y + r > this.outer.y + this.outer.h) return { x: 0, y: -1 };
        return null;
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

        // CP1
        if (
            player.x > this.cp1.x &&
            player.x < this.cp1.x + this.cp1.w
        ) {
            if (player.lapState === 0) player.lapState = 1;
        }

        // CP2
        if (
            player.y > this.cp2.y &&
            player.y < this.cp2.y + this.cp2.h
        ) {
            if (player.lapState === 1) player.lapState = 2;
        }

        // Start line
        if (
            player.x < this.startLineX + 6 &&
            player.lapState === 2
        ) {
            player.score++;
            player.completedLap = true;
            player.lapState = 0;
        }
    }
}
