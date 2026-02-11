import { Game } from "./game.js";

window.addEventListener("DOMContentLoaded", () => {

  const canvas = document.getElementById("game");

  if (!canvas) {
    console.error("Canvas not found.");
    return;
  }

  const ctx = canvas.getContext("2d");

  const keys = {};

  window.addEventListener("keydown", e => {
    keys[e.code] = true;
  });

  window.addEventListener("keyup", e => {
    keys[e.code] = false;
  });

  const game = new Game(ctx, keys, canvas);

  function loop() {
    game.update();
    game.draw();
    requestAnimationFrame(loop);
  }

  loop();
});
