/**
 * @fileoverview Pong game
 */

let pong = {};

(() => {

    const pongDiv = document.querySelector("div[pong]");

    const canvas = pongDiv.querySelector("canvas#pongCanvas");
    const ctx = canvas.getContext("2d");

    /*
        Scale the canvas for smaller screens
     */
    canvas.height = 140 * scale;
    canvas.width = 420 * scale;

    pong.settings = {
        borderWidth: 5,
        playing: false,
        ball: {
            x: canvas.width / 2,
            y: canvas.height / 2,
            dx: 2.3,
            dy: -1.3,
            radius: 8 * scale,
        },
        paddle: {
            width: 8 * scale,
            height: 30 * scale,
            speed: 2
        },
        player: {
            x: 6,
            y: canvas.height / 2 - (30 * scale / 2),
            score: 0
        },
        computer: {
            x: canvas.width - ((8 * scale) + 6),
            y: canvas.height / 2 - (30 * scale / 2),
            score: 0
        }
    }


    pongDiv.addEventListener("mousemove", (ev) => {
        const rect = canvas.getBoundingClientRect();
        const mouseY = ev.clientY - rect.top;
        pong.settings.player.y = mouseY - pong.settings.paddle.height / 2;

        if (!pong.settings.playing) {
            pong.settings.playing = true;
            arkanoid.settings.playing = false;

        }

    });

    const pongMinHeight = pong.settings.borderWidth + 1
    const pongMaxHeight = (canvas.height - pong.settings.borderWidth) - (pong.settings.paddle.height + 1);

// Border
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    function updateCanvasPong() {
        ctx.fillStyle = "#000097";
        ctx.fillRect(5, 5, canvas.width - 10, canvas.height - 10);

        // Draw the middle line
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.setLineDash([6, 6]);
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        ctx.closePath();
        ctx.setLineDash([]);

        // Draw the ball
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(pong.settings.ball.x, pong.settings.ball.y, pong.settings.ball.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        // Draw the scores
        ctx.font = "30px monospace";
        ctx.fillText(pong.settings.player.score, canvas.width / 2 - 30, 30);
        ctx.fillText(pong.settings.computer.score, canvas.width / 2 + 12, 30);

        // Draw the players
        ctx.fillStyle = "white";
        ctx.fillRect(
            pong.settings.player.x,
            Math.max(
                pongMinHeight,
                Math.min(
                    pong.settings.player.y,
                    pongMaxHeight
                )
            ),
            pong.settings.paddle.width,
            pong.settings.paddle.height
        );
        ctx.fillRect(pong.settings.computer.x,
            Math.max(
                pongMinHeight,
                Math.min(
                    pong.settings.computer.y,
                    pongMaxHeight
                )
            ),
            pong.settings.paddle.width,
            pong.settings.paddle.height
        );

        if (!pong.settings.playing) {
            ctx.font = "14px monospace";
            const text = "Move your mouse to start";

            ctx.fillText(text, canvas.width / 2 - ctx.measureText(text).width / 2, canvas.height - 10);
        } else {
            movePongBall();
            moveAI();
        }
    }

    function resetBall() {
        pong.settings.ball.x = canvas.width / 2;
        const randHeight = Math.random() * canvas.height;
        pong.settings.ball.y = Math.max(pong.settings.borderWidth + pong.settings.ball.radius, Math.min(randHeight, canvas.height - pong.settings.borderWidth - pong.settings.ball.radius));
        pong.settings.ball.dx = Math.sign(pong.settings.ball.dx) * 2.3;
        pong.settings.ball.dy = Math.sign(pong.settings.ball.dy) * 1.3;

    }

    function movePongBall() {
        pong.settings.ball.x += pong.settings.ball.dx;
        pong.settings.ball.y += pong.settings.ball.dy;

        if (pong.settings.ball.y + pong.settings.ball.radius > canvas.height || pong.settings.ball.y - pong.settings.ball.radius < 0) {
            pong.settings.ball.dy = -pong.settings.ball.dy;
        }

        if (pong.settings.ball.x + pong.settings.ball.radius > canvas.width) {
            pong.settings.player.score++;
            pong.settings.playing = false;
            resetBall();
        }

        if (pong.settings.ball.x - pong.settings.ball.radius < 0) {
            pong.settings.computer.score++;
            pong.settings.playing = false;
            resetBall();
        }

        const player = pong.settings.player;
        const computer = pong.settings.computer;
        const ball = pong.settings.ball;

        const ballTop = ball.y - ball.radius;
        const ballBottom = ball.y + ball.radius;

        if ((ball.x - ball.radius) < (player.x + pong.settings.paddle.width) && ballTop < (player.y + pong.settings.paddle.height) && ballBottom > player.y) {
            ball.dx = Math.abs(ball.dx);
            pong.settings.ball.dx += 0.3 * Math.sign(pong.settings.ball.dx);
            pong.settings.ball.dy += 0.3 * Math.sign(pong.settings.ball.dy);
        }

        if ((ball.x + ball.radius) > computer.x && ballTop < (computer.y + pong.settings.paddle.height) && ballBottom > computer.y) {
            ball.dx = -Math.abs(ball.dx);
            pong.settings.ball.dx += 0.3 * Math.sign(pong.settings.ball.dx);
            pong.settings.ball.dy += 0.3 * Math.sign(pong.settings.ball.dy);
        }
    }

    function moveAI() {
        const computer = pong.settings.computer;
        const ball = pong.settings.ball;

        if (Math.random() > 0.9 || ball.x < canvas.width / 2) {
            return;
        }

        const computerCenter = computer.y + pong.settings.paddle.height / 2;
        if (ball.y < computerCenter) {
            computer.y -= pong.settings.paddle.speed;
        } else {
            computer.y += pong.settings.paddle.speed;
        }
    }

    addCanvasRenderer(updateCanvasPong);
})();
