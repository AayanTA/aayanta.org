import { Game } from "./game.js";

window.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const game = new Game(canvas, ctx);

    function loop() {
        game.update();
        game.draw();
        requestAnimationFrame(loop);
    }

    loop();
});
