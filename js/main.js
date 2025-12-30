// main.js — bulletproof startup

window.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");

    if (!canvas) {
        throw new Error("Canvas element with id 'gameCanvas' not found.");
    }

    if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error("Element 'gameCanvas' is not a <canvas>.");
    }

    const game = new Game(canvas);
    game.loop();

    console.log("Game started successfully.");
});
