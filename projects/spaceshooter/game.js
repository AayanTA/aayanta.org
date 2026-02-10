import { Player } from "./player.js";
import { Missile } from "./missile.js";
import { WIDTH, HEIGHT, PLAYER_RADIUS } from "./constants.js";
import { walls, portals, finishLines } from "./track.js";

function rectCircle(rect, cx, cy, r) {
  const x = Math.max(rect.x, Math.min(cx, rect.x + rect.w));
  const y = Math.max(rect.y, Math.min(cy, rect.y + rect.h));
  return (cx - x) ** 2 + (cy - y) ** 2 < r ** 2;
}

export class Game {
  constructor(ctx, keys) {
    this.ctx = ctx;
    this.keys = keys;

    this.players = [
      new Player(200, 300, "lime", {
        left: "a",
        right: "d",
        thrust: "w",
        fire: "Control"
      }),
      new Player(800, 300, "cyan", {
        left: "ArrowLeft",
        right: "ArrowRight",
        thrust: "ArrowUp",
        fire: "Enter"
      })
    ];

    this.missiles = [];
    this.lapLock = new Map();
    this.players.forEach(p => this.lapLock.set(p, false));
  }

  update() {
    for (const p of this.players) {
      p.update(this.keys);

      for (const wall of walls) {
        if (rectCircle(wall, p.x, p.y, PLAYER_RADIUS)) {
          p.x -= p.vx;
          p.y -= p.vy;
          p.vx *= -0.5;
          p.vy *= -0.5;
        }
      }

      for (const portal of portals) {
        if (rectCircle(portal, p.x, p.y, PLAYER_RADIUS)) {
          p.x = portal.targetX;
        }
      }

      const line = p === this.players[0] ? finishLines.p1 : finishLines.p2;
      if (rectCircle(line, p.x, p.y, PLAYER_RADIUS)) {
        if (!this.lapLock.get(p)) {
          p.score++;
          this.lapLock.set(p, true);
        }
      } else {
        this.lapLock.set(p, false);
      }
    }

    for (const m of this.missiles) {
      m.update();

      for (const portal of portals) {
        if (rectCircle(portal, m.x, m.y, 4)) {
          m.x = portal.targetX;
        }
      }

      for (const p of this.players) {
        if (p !== m.owner && Math.hypot(p.x - m.x, p.y - m.y) < PLAYER_RADIUS) {
          p.stun();
          m.active = false;
        }
      }
    }

    this.missiles = this.missiles.filter(m => m.active);
  }

  draw() {
    this.ctx.clearRect(0, 0, WIDTH, HEIGHT);

    this.ctx.fillStyle = "white";
    for (const w of walls) this.ctx.fillRect(w.x, w.y, w.w, w.h);

    this.ctx.fillStyle = "purple";
    for (const p of portals) this.ctx.fillRect(p.x, p.y, p.w, p.h);

    for (const m of this.missiles) m.draw(this.ctx);
    for (const p of this.players) p.draw(this.ctx);

    this.ctx.fillStyle = "white";
    this.ctx.font = "20px monospace";
    this.ctx.fillText(`P1: ${this.players[0].score}`, 30, 30);
    this.ctx.fillText(`P2: ${this.players[1].score}`, 880, 30);
  }

  fire(player) {
    this.missiles.push(
      new Missile(player.x, player.y, player.angle, player)
    );
  }
}
