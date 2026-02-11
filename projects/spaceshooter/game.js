import { Player } from "./player.js";
import { Missile } from "./missile.js";
import { Track } from "./track.js";
import { WIDTH, HEIGHT } from "./constants.js";
import { playSound } from "./sound.js";
import { handleMissilePortals } from "./track.js";
import { updateLap, applySpeedPads } from "./track.js";

export class Game {
  constructor(ctx, keys) {
    this.ctx = ctx;
    this.keys = keys;

    this.track = new Track();

    this.players = [
      new Player(150, HEIGHT / 2, "cyan", {
        left: "KeyA",
        right: "KeyD",
        thrust: "KeyW",
        fire: "ShiftLeft"
      }),
      new Player(WIDTH - 150, HEIGHT / 2, "red", {
        left: "ArrowLeft",
        right: "ArrowRight",
        thrust: "ArrowUp",
        fire: "ShiftRight"
      })
    ];

    this.missiles = [];
  }

  fire(player) {
    if (player.stun > 0) return;
    if (player.fireCooldown > 0) return;

    this.missiles.push(
      new Missile(
        player.x + Math.cos(player.angle) * 16,
        player.y + Math.sin(player.angle) * 16,
        player.angle,
        player
      )
    );

    player.fireCooldown = 20; // ~0.33 seconds
    playSound("spaceshooter/sfx/shoot.wav");
  }

  update() {
    this.players.forEach(p => {

      if (!p.fireCooldown) p.fireCooldown = 0;
      if (p.fireCooldown > 0) p.fireCooldown--;

      p.update(this.keys);

      if (this.keys[p.controls.fire]) {
        this.fire(p);
      }

      this.track.handleBounce(p);
      this.track.tryPortal(p);
      this.track.checkLap(p);
      this.track.applySpeedPads(p);
    });

    players.forEach(p => {
      applySpeedPads(p);
      updateLap(p);
    });

    players.forEach(p => {
      if (p.laps >= 10) {
        gameState = "gameover";
        winner = p.id;
      }
    });

    this.missiles.forEach(m => {
      m.update(this.track);
      handleMissilePortals(missile);

      this.players.forEach(p => {
        if (p !== m.owner) {
          const dx = p.x - m.x;
          const dy = p.y - m.y;

          if (Math.hypot(dx, dy) < p.radius) {
            p.stun = 60;
            m.life = 0;
            playSound("spaceshooter/sfx/hit.wav");
          }
        }
      });
    });

    this.missiles = this.missiles.filter(m => m.life > 0);
  }

  draw() {
    const ctx = this.ctx;

    this.track.draw(ctx);

    this.players.forEach(p => p.draw(ctx));
    this.missiles.forEach(m => m.draw(ctx));

    ctx.fillStyle = "white";
    ctx.font = "16px monospace";
    ctx.textAlign = "left";

    ctx.fillText(`P1: ${this.players[0].laps}`, 60, 25);
    ctx.fillText(`P2: ${this.players[1].laps}`, WIDTH - 120, 25);

    if (gameState === "gameover") {
      ctx.fillStyle = "#00ff88";
      ctx.font = "40px monospace";
      ctx.fillText(
        `PLAYER ${winner + 1} WINS`,
        canvas.width / 2 - 180,
        canvas.height / 2
      );
    }
  }
}
