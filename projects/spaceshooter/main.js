import { Game } from "./game.js";
import { WIDTH, HEIGHT } from "./constants.js";
import { unlockAudio } from "./sound.js";

const canvas = document.getElementById("gameCanvas");
canvas.width = WIDTH;
canvas.height = HEIGHT;

const ctx = canvas.getContext("2d");
const keys = {};

const game = new Game(ctx, keys);

let countdown = 180; // 3 seconds at 60fps
let gameStarted = false;

window.addEventListener("keydown", e => {
  unlockAudio(); // unlock on first interaction
  keys[e.code] = true;
});

window.addEventListener("keyup", e => {
  keys[e.code] = false;
});

function loop() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  if (!gameStarted) {
    countdown--;

    const seconds = Math.ceil(countdown / 60);

    ctx.fillStyle = "white";
    ctx.font = "48px monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      seconds > 0 ? seconds : "GO!",
      WIDTH / 2,
      HEIGHT / 2
    );

    if (countdown <= -60) {
      gameStarted = true;
    }

  } else {
    game.update();
    game.draw();
  }

  requestAnimationFrame(loop);
}

loop();
