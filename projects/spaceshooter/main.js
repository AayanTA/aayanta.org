import { Game } from "./game.js";
import { WIDTH, HEIGHT } from "./constants.js";

const canvas = document.getElementById("gameCanvas");
canvas.width = WIDTH;
canvas.height = HEIGHT;

const ctx = canvas.getContext("2d");
const keys = {};

const game = new Game(ctx, keys);

window.addEventListener("keydown", e => {
  keys[e.key] = true;
  if (e.key === "Control") game.fire(game.players[0]);
  if (e.key === "Enter") game.fire(game.players[1]);
});

window.addEventListener("keyup", e => {
  keys[e.key] = false;
});

function loop() {
  game.update();
  game.draw();
  requestAnimationFrame(loop);
}

loop();
