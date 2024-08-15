/**
 * @fileoverview Pong game
 */


const canvasPongDiv = document.querySelector("div[pong]");
// TODO: rmeove debug
canvasPongDiv.style.display = "none"
const pongCanvas = canvasPongDiv.querySelector("canvas#pongCanvas");
const pongCtx = pongCanvas.getContext("2d");

/*
    Scale the canvas for smaller screens
 */
pongCanvas.height = 140 * scale;
pongCanvas.width = 420 * scale;

let pongSettings = {
    ball: {
        x: pongCanvas.width / 2,
        y: pongCanvas.height / 2,
        dx: 2,
        dy: -2,
        radius: 10,
        speed: 2
    },
    paddle: {
        width: 10 * scale,
        height: 40 * scale,
        speed: 2
    },
    player: {
        x: 0,
        y: pongCanvas.height / 2 - 50,
        score: 0
    },
    computer: {
        x: pongCanvas.width - 10,
        y: pongCanvas.height / 2 - 50,
        score: 0
    }
}


canvasPongDiv.addEventListener("mousemove", (ev) => {
    const rect = pongCanvas.getBoundingClientRect();
    const mouseY = ev.clientY - rect.top;
    pongSettings.player.y = mouseY - pongSettings.paddle.height / 2;
});

function updateCanvasPong() {
    pongCtx.clearRect(0, 0, pongCanvas.width, pongCanvas.height);
    pongCtx.fillStyle = "black";
    pongCtx.beginPath();
    pongCtx.arc(pongSettings.ball.x, pongSettings.ball.y, pongSettings.ball.radius, 0, Math.PI * 2);
    pongCtx.fill();
    pongCtx.closePath();

    pongCtx.fillStyle = "black";
    pongCtx.fillRect(
        pongSettings.player.x,
        Math.max(
            0,
            Math.min(
                pongSettings.player.y,
                pongCanvas.height - pongSettings.paddle.height
            )
        ),
        pongSettings.paddle.width,
        pongSettings.paddle.height
    );
    pongCtx.fillRect(pongSettings.computer.x,
        Math.max(
            0,
            Math.min(
                pongSettings.computer.y,
                pongCanvas.height - pongSettings.paddle.height
            )
        ),
        pongSettings.paddle.width,
        pongSettings.paddle.height
    );
}

addCanvasRenderer(updateCanvasPong);

