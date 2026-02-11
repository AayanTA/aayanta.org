import { Player } from "./player.js";
import { Missile } from "./missile.js";
import { Track } from "./track.js";
import { WIDTH, HEIGHT, MAX_LAPS } from "./constants.js";
import { playSound } from "./sound.js";


export class Game {
  constructor(ctx, keys) {
    this.ctx = ctx;
    this.keys = keys;

    this.track = new Track();

    this.players = [
      new Player(150, HEIGHT / 2, "cyan", {
        left: "KeyA",
        right: "KeyD",
        thrust: "KeyW"
      }),
      new Player(WIDTH - 150, HEIGHT / 2, "red", {
        left: "ArrowLeft",
        right: "ArrowRight",
        thrust: "ArrowUp"
      })
    ];

    this.missiles = [];
  }

  fire(player) {
    if (player.stun > 0) return;
    playSound("sfx/shoot.wav");
    this.missiles.push(
      new Missile(
        player.x + Math.cos(player.angle) * 16,
        player.y + Math.sin(player.angle) * 16,
        player.angle,
        player
      )
    );
  }

  update() {
    this.players.forEach(p => {
      p.update(this.keys);

      this.track.handleBounce(p);
      this.track.tryPortal(p);
      this.track.checkLap(p);
    });

    this.missiles.forEach(m => {
      m.update(this.track);

      this.players.forEach(p => {
        if (p !== m.owner) {
          const dx = p.x - m.x;
          const dy = p.y - m.y;

          if (Math.hypot(dx, dy) < p.radius) {
            playSound("sfx/hit.wav");
            p.stun = 60;
            m.life = 0;
          }
        }
      });
    });

    this.missiles = this.missiles.filter(m => m.life > 0);

    this.track.applySpeedPads(p);

  }

  draw() {
    const ctx = this.ctx;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    this.track.draw(ctx);

    this.players.forEach(p => p.draw(ctx));
    this.missiles.forEach(m => m.draw(ctx));

    ctx.fillStyle = "white";
    ctx.fillText(
      `P1: ${this.players[0].laps}`,
      60,
      25
    );
    ctx.fillText(
      `P2: ${this.players[1].laps}`,
      WIDTH - 100,
      25
    );
  }
}
