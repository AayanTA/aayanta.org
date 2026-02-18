import { Game } from "./game.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let state = "menu";
let game = null;

window.addEventListener("keydown", e => {

    if (state === "menu" && e.code === "Space") {
        game = new Game(canvas, ctx);
        state = "playing";
    }

    if (state === "end" && e.code === "Space") {
        state = "menu";
        game = null;
    }
});

function loop() {

    requestAnimationFrame(loop);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (state === "menu") {

        ctx.fillStyle = "white";
        ctx.font = "48px Arial";
        ctx.fillText("SPACE RACERS", 230, 250);

        ctx.font = "20px Arial";
        ctx.fillText("Press SPACE to Start", 300, 300);
    }

    else if (state === "playing" && game) {

        game.update();
        game.draw();

        if (game.winner) {
            state = "end";
        }
    }

    else if (state === "end" && game) {

        ctx.fillStyle = "white";
        ctx.font = "48px Arial";
        ctx.fillText(`${game.winner.color.toUpperCase()} WINS`, 240, 250);

        ctx.font = "20px Arial";
        ctx.fillText("Press SPACE for Menu", 280, 300);
    }
}

loop();
