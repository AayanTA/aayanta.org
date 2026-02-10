import { Player } from "./player.js";
import { Missile } from "./missile.js";
import { Track } from "./track.js";
import { MAX_LAPS } from "./constants.js";

export class Game {
  constructor(ctx, keys) {
    this.ctx = ctx;
    this.keys = keys;

    this.track = new Track();
    this.missiles = [];

    this.players = [
      new Player(120, 120, 0, "#00ffcc", {
        up: "w",
        left: "a",
        right: "d"
      }),
      new Player(120, 200, 0, "#ff5577", {
        up: "ArrowUp",
        left: "ArrowLeft",
        right: "ArrowRight"
      })
    ];
  }

  fire(player) {
    if (player.stun > 0) return;
    this.missiles.push(new Missile(player));
  }

  update() {
    this.players.forEach(p => {
      p.update(this.keys);
      this.handleTrackCollision(p);
      this.handlePortal(p);
      this.handleLap(p);
    });

    this.updateMissiles();
  }

  reflectVelocity(p, normalX, normalY) {
    const dot = p.vx * normalX + p.vy * normalY;
    p.vx -= 2 * dot * normalX;
    p.vy -= 2 * dot * normalY;
  }

  handleTrackCollision(p) {
    const o = this.track.outer;
    const i = this.track.inner;
    const r = p.radius;

    if (p.x - r < o.x) {
      p.x = o.x + r;
      this.reflectVelocity(p, 1, 0);
    }

    if (p.x + r > o.x + o.w) {
      p.x = o.x + o.w - r;
      this.reflectVelocity(p, -1, 0);
    }

    if (p.y - r < o.y) {
      p.y = o.y + r;
      this.reflectVelocity(p, 0, 1);
    }

    if (p.y + r > o.y + o.h) {
      p.y = o.y + o.h - r;
      this.reflectVelocity(p, 0, -1);
    }

    if (this.track.rectContains(i, p.x, p.y, r)) {
      if (p.x < i.x + i.w / 2) {
        p.x = i.x - r;
        this.reflectVelocity(p, -1, 0);
      } else {
        p.x = i.x + i.w + r;
        this.reflectVelocity(p, 1, 0);
      }
    }
  }

  handlePortal(p) {
    if (p.portalCooldown > 0) return;

    if (this.track.rectContains(this.track.portalLeft, p.x, p.y, p.radius)) {
      p.x = this.track.portalRight.x + this.track.portalRight.w + 4;
      p.portalCooldown = 40;
    }

    if (this.track.rectContains(this.track.portalRight, p.x, p.y, p.radius)) {
      p.x = this.track.portalLeft.x - 4;
      p.portalCooldown = 40;
    }
  }

  handleLap(p) {
    if (p.prevX < this.track.lapLineX && p.x >= this.track.lapLineX) {
      p.lap++;
    }
    p.prevX = p.x;
  }

  updateMissiles() {
    this.missiles.forEach(m => {
      m.update();

      this.players.forEach(p => {
        if (p === m.owner) return;

        const dx = p.x - m.x;
        const dy = p.y - m.y;

        if (Math.hypot(dx, dy) < p.radius + m.radius) {
          p.stun = 60;
          m.life = 0;
        }
      });

      this.handleMissileWalls(m);
    });

    this.missiles = this.missiles.filter(m => m.life > 0);
  }

  handleMissileWalls(m) {
    const o = this.track.outer;
    const r = m.radius;

    if (m.x - r < o.x || m.x + r > o.x + o.w) m.vx *= -1;
    if (m.y - r < o.y || m.y + r > o.y + o.h) m.vy *= -1;
  }

  draw() {
    const ctx = this.ctx;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 1000, 600);

    this.track.draw(ctx);

    this.players.forEach(p => p.draw(ctx));
    this.missiles.forEach(m => m.draw(ctx));

    ctx.fillStyle = "white";
    ctx.font = "16px monospace";

    ctx.fillText(`P1 Lap: ${this.players[0].lap}`, 20, 20);
    ctx.fillText(`P2 Lap: ${this.players[1].lap}`, 20, 40);
  }
}
