import { WIDTH, HEIGHT, TRACK } from "./constants.js";

export class Track {
  constructor() {
    this.outer = {
      x: TRACK.outerMargin,
      y: TRACK.outerMargin,
      w: WIDTH - TRACK.outerMargin * 2,
      h: HEIGHT - TRACK.outerMargin * 2
    };

    this.inner = {
      x: TRACK.innerMargin,
      y: TRACK.innerMargin,
      w: WIDTH - TRACK.innerMargin * 2,
      h: HEIGHT - TRACK.innerMargin * 2
    };

    this.portalLeft = {
      x: this.outer.x,
      y: HEIGHT / 2 - 40,
      w: 12,
      h: 80
    };

    this.portalRight = {
      x: this.outer.x + this.outer.w - 12,
      y: HEIGHT / 2 - 40,
      w: 12,
      h: 80
    };

    this.lapLineX = this.outer.x + 40;
  }

  draw(ctx) {
    ctx.strokeStyle = "#00ff88";
    ctx.lineWidth = TRACK.wallThickness;

    ctx.strokeRect(this.outer.x, this.outer.y, this.outer.w, this.outer.h);
    ctx.strokeRect(this.inner.x, this.inner.y, this.inner.w, this.inner.h);

    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(this.lapLineX, this.outer.y);
    ctx.lineTo(this.lapLineX, this.outer.y + 40);
    ctx.stroke();

    ctx.fillStyle = "purple";
    ctx.fillRect(this.portalLeft.x, this.portalLeft.y, this.portalLeft.w, this.portalLeft.h);
    ctx.fillRect(this.portalRight.x, this.portalRight.y, this.portalRight.w, this.portalRight.h);
  }

  rectContains(rect, x, y, r = 0) {
    return (
      x + r > rect.x &&
      x - r < rect.x + rect.w &&
      y + r > rect.y &&
      y - r < rect.y + rect.h
    );
  }
}
