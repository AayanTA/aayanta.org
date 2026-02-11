import { Player } from "./player.js";
import { Missile } from "./missile.js";
import { WIDTH, HEIGHT } from "./constants.js";
import { playSound } from "./sound.js";

import {
  initTrack,
  drawTrack,
  handleWallCollision,
  handleMissilePortals,
  applySpeedPads,
  updateLap
} from "./track.js";


export class Game {
  constructor(ctx, keys, canvas) {
    this.ctx = ctx;
    this.keys = keys;
    this.canvas = canvas;
    initTrack(canvas);

    const trackData = initTrack(canvas);
    this.outer = trackData.outer;
    this.inner = trackData.inner;

    this.gameState = "countdown";
    this.winner = null;
    this.countdown = 180; // 3 seconds at 60fps

    this.players = [
      new Player(150, HEIGHT / 2, "cyan", {
        left: "KeyA",
        right: "KeyD",
        thrust: "KeyW",
        fire: "ShiftLeft"
      }, 0),
      new Player(WIDTH - 150, HEIGHT / 2, "red", {
        left: "ArrowLeft",
        right: "ArrowRight",
        thrust: "ArrowUp",
        fire: "ShiftRight"
      }, 1)
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

    player.fireCooldown = 20;
    playSound("spaceshooter/sfx/shoot.wav");
  }

  update() {
    if (this.gameState === "countdown") {
      this.countdown--;
      if (this.countdown <= 0) {
        this.gameState = "playing";
      }
      return;
    }

    if (this.gameState !== "playing") return;
    
    this.players.forEach(p => {

      if (!p.fireCooldown) p.fireCooldown = 0;
      if (p.fireCooldown > 0) p.fireCooldown--;

      p.update(this.keys);

      if (this.keys[p.controls.fire]) {
        this.fire(p);
      }

      handleWallCollision(p);
      applySpeedPads(p);
      updateLap(p);

      if (p.laps >= 10) {
        this.gameState = "gameover";
        this.winner = p.id;
      }
    });

    this.missiles.forEach(m => {
      m.update(this.outer, this.inner);
      handleWallCollision(m);
      handleMissilePortals(m);

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

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    drawTrack(ctx, this.outer, this.inner);

    this.players.forEach(p => p.draw(ctx));
    this.missiles.forEach(m => m.draw(ctx));

    ctx.fillStyle = "white";
    ctx.font = "16px monospace";
    ctx.textAlign = "left";

    ctx.fillText(`P1: ${this.players[0].laps}`, 60, 25);
    ctx.fillText(`P2: ${this.players[1].laps}`, WIDTH - 120, 25);

    if (this.gameState === "countdown") {
      ctx.fillStyle = "#00ff88";
      ctx.font = "60px monospace";
      ctx.textAlign = "center";

      const number = Math.ceil(this.countdown / 60);
      ctx.fillText(number, this.canvas.width / 2, this.canvas.height / 2);
    }

    if (this.gameState === "gameover") {
      ctx.fillStyle = "#00ff88";
      ctx.font = "40px monospace";
      ctx.textAlign = "center";

      ctx.fillText(
        `PLAYER ${this.winner + 1} WINS`,
        this.canvas.width / 2,
        this.canvas.height / 2
      );
    }
  }
}
