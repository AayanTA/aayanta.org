import { Game } from "./game.js";

function init() {
    const canvas = document.getElementById("gameCanvas");

    if (!canvas) {
        console.error("Canvas not found. Check your HTML id.");
        return;
    }

    const ctx = canvas.getContext("2d");
    const game = new Game(canvas, ctx);

    function loop() {
        game.update();
        game.draw();
        requestAnimationFrame(loop);
    }

    loop();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
