import { Player } from "./player.js";
import { Track } from "./track.js";

export class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        this.track = new Track(canvas);

        this.players = [
            new Player(150, 300, "cyan", {
                up: "KeyW",
                left: "KeyA",
                right: "KeyD",
                shoot: "ShiftLeft",
                drift: "KeyS"
            }),
            new Player(650, 300, "orange", {
                up: "ArrowUp",
                left: "ArrowLeft",
                right: "ArrowRight",
                shoot: "ShiftRight",
                drift: "ArrowDown"
            })
        ];

        this.missiles = [];
        this.keys = {};

        this.frameCount = 0;
        this.gameTime = 0;

        window.addEventListener("keydown", e => this.keys[e.code] = true);
        window.addEventListener("keyup", e => this.keys[e.code] = false);
    }

    update() {

        this.frameCount++;
        this.gameTime = this.frameCount / 60;

        this.players.forEach(player => {

            player.lapTime += 1 / 60;
            player.update(this.keys, this.track);

            if (this.keys[player.controls.shoot]) {
                const missile = player.tryShoot();
                if (missile) this.missiles.push(missile);
            }

            if (player.completedLap) {
                player.completedLap = false;
                player.lastLapTime = player.lapTime;
                player.lapTime = 0;
            }
        });

        this.missiles.forEach(m =>
            m.update(this.track, this.players)
        );

        this.missiles = this.missiles.filter(m => !m.dead);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.track.draw(this.ctx);

        this.players.forEach(p => p.draw(this.ctx));
        this.missiles.forEach(m => m.draw(this.ctx));

        this.ctx.fillStyle = "white";
        this.ctx.font = "16px Arial";

        this.ctx.fillText(`Game Time: ${this.gameTime.toFixed(1)}s`, 20, 20);

        this.players.forEach((p, i) => {
            this.ctx.fillText(
                `P${i+1}: ${p.score} | Lap: ${p.lapTime.toFixed(1)}s`,
                20,
                45 + i * 20
            );
        });
    }
}
