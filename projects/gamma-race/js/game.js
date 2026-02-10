import { WIDTH, HEIGHT, PLAYER_RADIUS } from "./constants.js";
import { Missile } from "./missile.js";

export class Game {
  constructor(ctx, input, players) {
    this.ctx = ctx;
    this.input = input;
    this.players = players;
    this.missiles = [];
    this.lastShot = new Map();
  }

  update(delta) {
    for (const p of this.players) {
      p.update(this.input, delta);

      // wrap screen
      p.x = (p.x + WIDTH) % WIDTH;
      p.y = (p.y + HEIGHT) % HEIGHT;

      // shooting
      if (this.input.isDown(p.controls.fire)) {
        const now = Date.now();
        if (!this.lastShot.get(p) || now - this.lastShot.get(p) > 400) {
          this.missiles.push(
            new Missile(p.x, p.y, p.angle, p)
          );
          this.lastShot.set(p, now);
        }
      }
    }

    for (const m of this.missiles) {
      m.update();

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

    for (const p of this.players) p.draw(this.ctx);
    for (const m of this.missiles) m.draw(this.ctx);
  }
}
