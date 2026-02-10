import { WIDTH, HEIGHT, PLAYER_RADIUS, SCORE_TO_WIN } from "./constants.js";
import { Missile } from "./missile.js";
import { walls, finishLines, portals } from "./track.js";

function rectCircleCollide(rect, cx, cy, r) {
  const closestX = Math.max(rect.x, Math.min(cx, rect.x + rect.w));
  const closestY = Math.max(rect.y, Math.min(cy, rect.y + rect.h));
  const dx = cx - closestX;
  const dy = cy - closestY;
  return dx * dx + dy * dy < r * r;
}

export class Game {
  constructor(ctx, input, players) {
    this.ctx = ctx;
    this.input = input;
    this.players = players;
    this.missiles = [];
    this.lastShot = new Map();
    this.lapFlags = new Map();
    for (const p of players) {
      this.lapFlags.set(p, false);
    }
  }

  update(delta) {
    for (const p of this.players) {
      p.update(this.input, delta);

      // wall collision
      for (const wall of walls) {
        if (rectCircleCollide(wall, p.x, p.y, PLAYER_RADIUS)) {
          p.x -= p.vx;
          p.y -= p.vy;
          p.vx *= -0.5;
          p.vy *= -0.5;
        }
      }

      // portal teleportation
      for (const portal of portals) {
        if (rectCircleCollide(portal, p.x, p.y, PLAYER_RADIUS)) {
          p.x = portal.targetX;
        }
      }

      // lap detection
      const line = p === this.players[0] ? finishLines.p1 : finishLines.p2;
      if (rectCircleCollide(line, p.x, p.y, PLAYER_RADIUS)) {
        if (!this.lapFlags.get(p)) {
          p.score++;
          this.lapFlags.set(p, true);
        }
      } else {
        this.lapFlags.set(p, false);
      }

      // shooting
      if (this.input.isDown(p.controls.fire)) {
        const now = Date.now();
        if (!this.lastShot.get(p) || now - this.lastShot.get(p) > 400) {
          this.missiles.push(new Missile(p.x, p.y, p.angle, p));
          this.lastShot.set(p, now);
        }
      }
    }

    for (const m of this.missiles) {
      m.update();

      // portal teleportation for missiles
      for (const portal of portals) {
        if (rectCircleCollide(portal, m.x, m.y, 4)) {
          m.x = portal.targetX;
        }
      }

      // missile collision with players
      for (const p of this.players) {
        if (p !== m.owner) {
          const dx = p.x - m.x;
          const dy = p.y - m.y;
          if (Math.hypot(dx, dy) < PLAYER_RADIUS) {
            p.stun();
            m.active = false;
          }
        }
      }
    }

    this.missiles = this.missiles.filter(m => m.active);
  }

  draw() {
    this.ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw walls
    this.ctx.fillStyle = "white";
    for (const wall of walls) {
      this.ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
    }

    // Draw portals
    this.ctx.fillStyle = "purple";
    for (const p of portals) {
      this.ctx.fillRect(p.x, p.y, p.w, p.h);
    }

    // Draw players and missiles
    for (const p of this.players) p.draw(this.ctx);
    for (const m of this.missiles) m.draw(this.ctx);

    // Draw UI
    this.ctx.fillStyle = "white";
    this.ctx.font = "20px Arial";
    this.ctx.fillText(`Player 1: ${this.players[0].score}`, 40, 40);
    this.ctx.fillText(`Player 2: ${this.players[1].score}`, 820, 40);

    // Check win condition
    for (const p of this.players) {
      if (p.score >= SCORE_TO_WIN) {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
        this.ctx.fillStyle = "white";
        this.ctx.font = "bold 48px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText(`${p.color.toUpperCase()} WINS!`, WIDTH / 2, HEIGHT / 2);
        this.ctx.textAlign = "left";
        return;
      }
    }
  }
}