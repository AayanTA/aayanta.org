import { Player } from "./player.js";
import { Missile } from "./missile.js";
import { Track } from "./track.js";

export class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        this.track = new Track(canvas);

        this.players = [
            new Player(200, 300, "cyan", {
                up: "KeyW",
                left: "KeyA",
                right: "KeyD",
                shoot: "ShiftLeft"
            }),
            new Player(600, 300, "orange", {
                up: "ArrowUp",
                left: "ArrowLeft",
                right: "ArrowRight",
                shoot: "ShiftRight"
            })
        ];

        this.missiles = [];
        this.keys = {};
        this.gameOver = false;

        window.addEventListener("keydown", e => this.keys[e.code] = true);
        window.addEventListener("keyup", e => this.keys[e.code] = false);
    }

    update() {
        if (this.gameOver) return;

        this.players.forEach(player => {
            player.update(this.keys, this.track);

            if (this.keys[player.controls.shoot]) {
                const missile = player.tryShoot();
                if (missile) this.missiles.push(missile);
            }

            if (player.score >= 10) {
                this.gameOver = true;
            }
        });

        this.missiles.forEach(m => m.update(this.track));
        this.missiles = this.missiles.filter(m => !m.dead);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.track.draw(this.ctx);

        this.players.forEach(p => p.draw(this.ctx));
        this.missiles.forEach(m => m.draw(this.ctx));

        this.players.forEach((p, i) => {
            this.ctx.fillStyle = "white";
            this.ctx.font = "20px Arial";
            this.ctx.fillText(`P${i+1}: ${p.score}`, 20, 30 + i * 25);
        });

        if (this.gameOver) {
            this.ctx.fillStyle = "white";
            this.ctx.font = "50px Arial";
            this.ctx.fillText("GAME OVER", 250, 300);
        }
    }
}
