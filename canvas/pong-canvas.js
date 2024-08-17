/**
 * @fileoverview Pong game
 */

const canvasPongDiv = document.querySelector("div[pong]");
// TODO: remove debug
canvasPongDiv.style.display = "none"

const pongCanvas = canvasPongDiv.querySelector("canvas#pongCanvas");
const pongCtx = pongCanvas.getContext("2d");

/*
    Scale the canvas for smaller screens
 */
pongCanvas.height = 140 * scale;
pongCanvas.width = 420 * scale;

let pongSettings = {
    borderWidth: 5,
    ball: {
        x: pongCanvas.width / 2,
        y: pongCanvas.height / 2,
        dx: 2,
        dy: -2,
        radius: 10 * scale,
        speed: 2
    },
    paddle: {
        width: 8 * scale,
        height: 40 * scale,
        speed: 2
    },
    player: {
        x: 6,
        y: pongCanvas.height / 2 - 50,
        score: 0
    },
    computer: {
        x: pongCanvas.width - (8 + 6),
        y: pongCanvas.height / 2 - 50,
        score: 0
    }
}


canvasPongDiv.addEventListener("mousemove", (ev) => {
    const rect = pongCanvas.getBoundingClientRect();
    const mouseY = ev.clientY - rect.top;
    pongSettings.player.y = mouseY - pongSettings.paddle.height / 2;
});

const minHeight = pongSettings.borderWidth + 1
const maxHeight = (pongCanvas.height - pongSettings.borderWidth) - (pongSettings.paddle.height + 1);
let score = {
    player: 0,
    computer: 0
}

// Border
pongCtx.fillStyle = "white"
pongCtx.fillRect(0, 0, pongCanvas.width, pongCanvas.height);
function updateCanvasPong() {
    pongCtx.fillStyle = "#000097";
    pongCtx.fillRect(5, 5, pongCanvas.width - 10, pongCanvas.height - 10);
    
    // Draw the background
    // dotted middle line
    pongCtx.strokeStyle = "white";
    pongCtx.beginPath();
    pongCtx.lineWidth = 5;
    pongCtx.setLineDash([6, 6]);
    pongCtx.moveTo(pongCanvas.width / 2, 0);
    pongCtx.lineTo(pongCanvas.width / 2, pongCanvas.height);
    pongCtx.stroke();
    pongCtx.closePath();
    pongCtx.setLineDash([]);

    // Draw the ball
    pongCtx.fillStyle = "white";
    pongCtx.beginPath();
    pongCtx.arc(pongSettings.ball.x, pongSettings.ball.y, pongSettings.ball.radius, 0, Math.PI * 2);
    pongCtx.fill();
    pongCtx.closePath();

    // Draw the scores
    pongCtx.font = "30px monospace";
    pongCtx.fillText(pongSettings.player.score, pongCanvas.width / 2 - 30, 30);
    pongCtx.fillText(pongSettings.computer.score, pongCanvas.width / 2 + 12, 30);


    // Draw the players
    pongCtx.fillStyle = "white";
    pongCtx.fillRect(
        pongSettings.player.x,
        Math.max(
            minHeight,
            Math.min(
                pongSettings.player.y,
                maxHeight
            )
        ),
        pongSettings.paddle.width,
        pongSettings.paddle.height
    );
    pongCtx.fillRect(pongSettings.computer.x,
        Math.max(
            minHeight,
            Math.min(
                pongSettings.computer.y,
                maxHeight
            )
        ),
        pongSettings.paddle.width,
        pongSettings.paddle.height
    );
}

addCanvasRenderer(updateCanvasPong);

