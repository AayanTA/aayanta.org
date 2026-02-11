import { Game } from "./game.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const keys = {};

window.addEventListener("keydown", e => {
  keys[e.code] = true;
});

window.addEventListener("keyup", e => {
  keys[e.code] = false;
});

// PASS CANVAS INTO GAME
const game = new Game(ctx, keys, canvas);

function loop() {
  game.update();
  game.draw();
  requestAnimationFrame(loop);
}

loop();
