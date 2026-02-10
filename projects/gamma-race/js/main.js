import { WIDTH, HEIGHT } from "./constants.js";
import { Input } from "./input.js";
import { Player } from "./player.js";
import { Game } from "./game.js";

const canvas = document.querySelector("canvas");
canvas.width = WIDTH;
canvas.height = HEIGHT;

const ctx = canvas.getContext("2d");

const input = new Input();

const player1 = new Player(200, 300, "cyan", {
  left: "KeyA",
  right: "KeyD",
  thrust: "KeyW",
  fire: "ShiftLeft"
});

const player2 = new Player(800, 300, "orange", {
  left: "ArrowLeft",
  right: "ArrowRight",
  thrust: "ArrowUp",
  fire: "ShiftRight"
});

const game = new Game(ctx, input, [player1, player2]);

let last = performance.now();

function loop(now) {
  const delta = now - last;
  last = now;

  game.update(delta);
  game.draw();

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
