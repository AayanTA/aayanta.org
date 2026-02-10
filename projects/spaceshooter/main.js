import { Game } from "./game.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const keys = {};
const game = new Game(ctx, keys);

window.addEventListener("keydown", e => {
  keys[e.key] = true;

  if (e.code === "ShiftLeft") game.fire(game.players[0]);
  if (e.code === "ShiftRight") game.fire(game.players[1]);
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
