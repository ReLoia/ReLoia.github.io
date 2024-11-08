/**
 * @fileoverview Pong game
 */

const canvasPongDiv = document.querySelector("div[pong]");

const pongCanvas = canvasPongDiv.querySelector("canvas#pongCanvas");
const pongCtx = pongCanvas.getContext("2d");

/*
    Scale the canvas for smaller screens
 */
pongCanvas.height = 140 * scale;
pongCanvas.width = 420 * scale;

let pongSettings = {
    borderWidth: 5,
    playing: false,
    ball: {
        x: pongCanvas.width / 2,
        y: pongCanvas.height / 2,
        dx: 2.3,
        dy: -1.3,
        radius: 10 * scale,
    },
    paddle: {
        width: 8 * scale,
        height: 30 * scale,
        speed: 2
    },
    player: {
        x: 6,
        y: pongCanvas.height / 2 - (30 * scale / 2),
        score: 0
    },
    computer: {
        x: pongCanvas.width - ((8 * scale) + 6),
        y: pongCanvas.height / 2 - (30 * scale / 2),
        score: 0
    }
}


canvasPongDiv.addEventListener("mousemove", (ev) => {
    const rect = pongCanvas.getBoundingClientRect();
    const mouseY = ev.clientY - rect.top;
    pongSettings.player.y = mouseY - pongSettings.paddle.height / 2;

    if (!pongSettings.playing)
        pongSettings.playing = true;

});

const minHeight = pongSettings.borderWidth + 1
const maxHeight = (pongCanvas.height - pongSettings.borderWidth) - (pongSettings.paddle.height + 1);

// Border
pongCtx.fillStyle = "white"
pongCtx.fillRect(0, 0, pongCanvas.width, pongCanvas.height);

function updateCanvasPong() {
    pongCtx.fillStyle = "#000097";
    pongCtx.fillRect(5, 5, pongCanvas.width - 10, pongCanvas.height - 10);

    // Draw the background
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

    if (!pongSettings.playing) {
        pongCtx.font = "14px monospace";
        const text = "Move your mouse to start";

        pongCtx.fillText(text, pongCanvas.width / 2 - pongCtx.measureText(text).width / 2, pongCanvas.height - 10);
    } else {
        moveBall();
        moveAI();
    }
}

function resetBall() {
    pongSettings.ball.x = pongCanvas.width / 2;
    const randHeight = Math.random() * pongCanvas.height;
    pongSettings.ball.y = Math.max(pongSettings.borderWidth + pongSettings.ball.radius, Math.min(randHeight, pongCanvas.height - pongSettings.borderWidth - pongSettings.ball.radius));
    pongSettings.ball.dx = Math.sign(pongSettings.ball.dx) * 2.3;
    pongSettings.ball.dy = Math.sign(pongSettings.ball.dy) * 1.3;

}

function moveBall() {
    pongSettings.ball.x += pongSettings.ball.dx;
    pongSettings.ball.y += pongSettings.ball.dy;

    if (pongSettings.ball.y + pongSettings.ball.radius > pongCanvas.height || pongSettings.ball.y - pongSettings.ball.radius < 0) {
        pongSettings.ball.dy = -pongSettings.ball.dy;
    }

    if (pongSettings.ball.x + pongSettings.ball.radius > pongCanvas.width) {
        pongSettings.player.score++;
        pongSettings.playing = false;
        resetBall();
    }

    if (pongSettings.ball.x - pongSettings.ball.radius < 0) {
        pongSettings.computer.score++;
        pongSettings.playing = false;
        resetBall();
    }

    const player = pongSettings.player;
    const computer = pongSettings.computer;
    const ball = pongSettings.ball;

    const ballTop = ball.y - ball.radius;
    const ballBottom = ball.y + ball.radius;

    if ((ball.x - ball.radius) < (player.x + pongSettings.paddle.width) && ballTop < (player.y + pongSettings.paddle.height) && ballBottom > player.y) {
        ball.dx = Math.abs(ball.dx);
        pongSettings.ball.dx += 0.3 * Math.sign(pongSettings.ball.dx);
        pongSettings.ball.dy += 0.3 * Math.sign(pongSettings.ball.dy);
    }

    if ((ball.x + ball.radius) > computer.x && ballTop < (computer.y + pongSettings.paddle.height) && ballBottom > computer.y) {
        ball.dx = -Math.abs(ball.dx);
        pongSettings.ball.dx += 0.3 * Math.sign(pongSettings.ball.dx);
        pongSettings.ball.dy += 0.3 * Math.sign(pongSettings.ball.dy);
    }
}

function moveAI() {
    const computer = pongSettings.computer;
    const ball = pongSettings.ball;

    if (Math.random() > 0.9 || ball.x < pongCanvas.width / 2) {
        return;
    }

    const computerCenter = computer.y + pongSettings.paddle.height / 2;
    if (ball.y < computerCenter) {
        computer.y -= pongSettings.paddle.speed;
    } else {
        computer.y += pongSettings.paddle.speed;
    }
}

addCanvasRenderer(updateCanvasPong);
