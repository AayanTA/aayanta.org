import { Player } from "./player.js";
import { Track } from "./track.js";

export class Game {

    constructor(canvas, ctx) {

        this.canvas = canvas;
        this.ctx = ctx;

        this.track = new Track();

        this.players = [
            new Player(180, 300, "cyan", {
                up: "KeyW",
                left: "KeyA",
                right: "KeyD",
                shoot: "ShiftLeft",
                drift: "KeyS"
            }),
            new Player(180, 340, "orange", {
                up: "ArrowUp",
                left: "ArrowLeft",
                right: "ArrowRight",
                shoot: "ShiftRight",
                drift: "ArrowDown"
            })
        ];

        this.missiles = [];

        this.frame = 0;
        this.gameTime = 0;

        this.maxLaps = 3;
        this.winner = null;

        this.keys = {};

        window.addEventListener("keydown", e => this.keys[e.code] = true);
        window.addEventListener("keyup", e => this.keys[e.code] = false);
    }

    update() {

        this.frame++;
        this.gameTime = this.frame / 60;

        for (const player of this.players) {

            player.lapTime += 1/60;
            player.update(this.keys, this.track);

            if (this.keys[player.controls.shoot]) {
                const m = player.tryShoot();
                if (m) this.missiles.push(m);
            }

            if (player.completedLap) {

                player.completedLap = false;

                if (!player.bestLap || player.lapTime < player.bestLap) {
                    player.bestLap = player.lapTime;
                }

                player.lastLap = player.lapTime;
                player.lapTime = 0;
            }

            if (player.score >= this.maxLaps) {
                this.winner = player;
            }
        }

        for (const m of this.missiles) {
            m.update(this.track, this.players);
        }

        this.missiles = this.missiles.filter(m => !m.dead);
    }

    draw() {

        this.track.draw(this.ctx);

        for (const p of this.players) p.draw(this.ctx);
        for (const m of this.missiles) m.draw(this.ctx);

        this.ctx.fillStyle = "white";
        this.ctx.font = "16px Arial";

        this.ctx.fillText(`Time: ${this.gameTime.toFixed(1)}s`, 20, 20);

        this.players.forEach((p,i) => {
            this.ctx.fillText(
                `P${i+1} Laps:${p.score} Lap:${p.lapTime.toFixed(1)} Best:${p.bestLap ? p.bestLap.toFixed(1) : "-"}`,
                20,
                45 + i*20
            );
        });
    }
}
