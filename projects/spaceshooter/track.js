import { WIDTH, HEIGHT } from "./constants.js";
import { playSound } from "./sound.js";

export class Track {
  constructor() {
    // Centered properly
    this.outerMargin = 60;

    this.inner = {
      x: WIDTH / 2 - 300,
      y: HEIGHT / 2 - 150,
      w: 600,
      h: 300
    };

    // Checkpoints (left and right)
    this.checkLeft = {
      x: this.inner.x - 20,
      y: HEIGHT / 2 - 100,
      w: 20,
      h: 200
    };

    this.checkRight = {
      x: this.inner.x + this.inner.w,
      y: HEIGHT / 2 - 100,
      w: 20,
      h: 200
    };

    // Full lap line
    this.lapLine = {
      x: WIDTH / 2 - 10,
      y: this.inner.y + this.inner.h,
      w: 20,
      h: this.outerMargin
    };

    this.speedPad = {
      x: WIDTH / 2 - 100,
      y: this.inner.y - 30,
      w: 200,
      h: 20
    };

    this.portalLeft = {
      x: this.inner.x - 20,
      y: HEIGHT / 2 - 40,
      w: 20,
      h: 80
    };

    this.portalRight = {
      x: this.inner.x + this.inner.w,
      y: HEIGHT / 2 - 40,
      w: 20,
      h: 80
    };
  }

  draw(ctx) {
    ctx.strokeStyle = "white";

    // Outer boundary
    ctx.strokeRect(
      this.outerMargin,
      this.outerMargin,
      WIDTH - this.outerMargin * 2,
      HEIGHT - this.outerMargin * 2
    );

    // Inner wall
    ctx.strokeRect(
      this.inner.x,
      this.inner.y,
      this.inner.w,
      this.inner.h
    );

    // Lap line
    ctx.fillStyle = "white";
    ctx.fillRect(
      this.lapLine.x,
      this.lapLine.y,
      this.lapLine.w,
      this.lapLine.h
    );

    // Speed pad
    ctx.fillStyle = "lime";
    ctx.fillRect(
      this.speedPad.x,
      this.speedPad.y,
      this.speedPad.w,
      this.speedPad.h
    );

    // Portals
    ctx.fillStyle = "cyan";
    ctx.fillRect(
      this.portalLeft.x,
      this.portalLeft.y,
      this.portalLeft.w,
      this.portalLeft.h
    );

    ctx.fillRect(
      this.portalRight.x,
      this.portalRight.y,
      this.portalRight.w,
      this.portalRight.h
    );
  }

  handleBounce(obj) {
    const r = obj.radius;

    // Outer bounds
    if (obj.x - r < this.outerMargin) {
      obj.x = this.outerMargin + r;
      obj.vx = Math.abs(obj.vx);
    }
    if (obj.x + r > WIDTH - this.outerMargin) {
      obj.x = WIDTH - this.outerMargin - r;
      obj.vx = -Math.abs(obj.vx);
    }
    if (obj.y - r < this.outerMargin) {
      obj.y = this.outerMargin + r;
      obj.vy = Math.abs(obj.vy);
    }
    if (obj.y + r > HEIGHT - this.outerMargin) {
      obj.y = HEIGHT - this.outerMargin - r;
      obj.vy = -Math.abs(obj.vy);
    }

    // Inner wall bounce (reflect correctly)
    if (
      obj.x > this.inner.x - r &&
      obj.x < this.inner.x + this.inner.w + r &&
      obj.y > this.inner.y - r &&
      obj.y < this.inner.y + this.inner.h + r
    ) {
      const left = obj.x - this.inner.x;
      const right = this.inner.x + this.inner.w - obj.x;
      const top = obj.y - this.inner.y;
      const bottom = this.inner.y + this.inner.h - obj.y;

      const min = Math.min(left, right, top, bottom);

      if (min === left) {
        obj.x = this.inner.x - r;
        obj.vx = -Math.abs(obj.vx);
      }
      if (min === right) {
        obj.x = this.inner.x + this.inner.w + r;
        obj.vx = Math.abs(obj.vx);
      }
      if (min === top) {
        obj.y = this.inner.y - r;
        obj.vy = -Math.abs(obj.vy);
      }
      if (min === bottom) {
        obj.y = this.inner.y + this.inner.h + r;
        obj.vy = Math.abs(obj.vy);
      }
    }
  }

  tryPortal(missile) {
    if (!missile.isMissile) return;

    if (this.inRect(missile, this.portalLeft)) {
      missile.x = this.portalRight.x + this.portalRight.w + 10;
    }

    if (this.inRect(missile, this.portalRight)) {
      missile.x = this.portalLeft.x - 10;
    }
  }

  applySpeedPads(player) {
    if (this.inRect(player, this.speedPad)) {
      player.vy -= 1.5;
      playSound("spaceshooter/sfx/boost.wav");
    }
  }

  checkLap(player) {
    if (this.inRect(player, this.checkLeft)) {
      player.hitLeft = true;
    }

    if (this.inRect(player, this.checkRight)) {
      player.hitRight = true;
    }

    if (
      this.inRect(player, this.lapLine) &&
      player.hitLeft &&
      player.hitRight
    ) {
      player.laps++;
      player.hitLeft = false;
      player.hitRight = false;
    }
  }

  inRect(obj, rect) {
    return (
      obj.x > rect.x &&
      obj.x < rect.x + rect.w &&
      obj.y > rect.y &&
      obj.y < rect.y + rect.h
    );
  }
}
