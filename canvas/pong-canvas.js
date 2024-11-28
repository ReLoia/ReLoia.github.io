/**
 * @fileoverview Pong game
 */

(() => {

    const pongDiv = document.querySelector("div[pong]");

    const canvas = pongDiv.querySelector("canvas#pongCanvas");
    const ctx = canvas.getContext("2d");

    /*
        Scale the canvas for smaller screens
     */
    canvas.height = 140 * scale;
    canvas.width = 420 * scale;

    const settings = {
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
        settings.player.y = mouseY - settings.paddle.height / 2;

        if (!settings.playing) {
            settings.playing = true;
            // arkanoidSettings.playing = false;

        }

    });

    const pongMinHeight = settings.borderWidth + 1
    const pongMaxHeight = (canvas.height - settings.borderWidth) - (settings.paddle.height + 1);

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
        ctx.arc(settings.ball.x, settings.ball.y, settings.ball.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        // Draw the scores
        ctx.font = "30px monospace";
        ctx.fillText(settings.player.score, canvas.width / 2 - 30, 30);
        ctx.fillText(settings.computer.score, canvas.width / 2 + 12, 30);

        // Draw the players
        ctx.fillStyle = "white";
        ctx.fillRect(
            settings.player.x,
            Math.max(
                pongMinHeight,
                Math.min(
                    settings.player.y,
                    pongMaxHeight
                )
            ),
            settings.paddle.width,
            settings.paddle.height
        );
        ctx.fillRect(settings.computer.x,
            Math.max(
                pongMinHeight,
                Math.min(
                    settings.computer.y,
                    pongMaxHeight
                )
            ),
            settings.paddle.width,
            settings.paddle.height
        );

        if (!settings.playing) {
            ctx.font = "14px monospace";
            const text = "Move your mouse to start";

            ctx.fillText(text, canvas.width / 2 - ctx.measureText(text).width / 2, canvas.height - 10);
        } else {
            movePongBall();
            moveAI();
        }
    }

    function resetBall() {
        settings.ball.x = canvas.width / 2;
        const randHeight = Math.random() * canvas.height;
        settings.ball.y = Math.max(settings.borderWidth + settings.ball.radius, Math.min(randHeight, canvas.height - settings.borderWidth - settings.ball.radius));
        settings.ball.dx = Math.sign(settings.ball.dx) * 2.3;
        settings.ball.dy = Math.sign(settings.ball.dy) * 1.3;

    }

    function movePongBall() {
        settings.ball.x += settings.ball.dx;
        settings.ball.y += settings.ball.dy;

        if (settings.ball.y + settings.ball.radius > canvas.height || settings.ball.y - settings.ball.radius < 0) {
            settings.ball.dy = -settings.ball.dy;
        }

        if (settings.ball.x + settings.ball.radius > canvas.width) {
            settings.player.score++;
            settings.playing = false;
            resetBall();
        }

        if (settings.ball.x - settings.ball.radius < 0) {
            settings.computer.score++;
            settings.playing = false;
            resetBall();
        }

        const player = settings.player;
        const computer = settings.computer;
        const ball = settings.ball;

        const ballTop = ball.y - ball.radius;
        const ballBottom = ball.y + ball.radius;

        if ((ball.x - ball.radius) < (player.x + settings.paddle.width) && ballTop < (player.y + settings.paddle.height) && ballBottom > player.y) {
            ball.dx = Math.abs(ball.dx);
            settings.ball.dx += 0.3 * Math.sign(settings.ball.dx);
            settings.ball.dy += 0.3 * Math.sign(settings.ball.dy);
        }

        if ((ball.x + ball.radius) > computer.x && ballTop < (computer.y + settings.paddle.height) && ballBottom > computer.y) {
            ball.dx = -Math.abs(ball.dx);
            settings.ball.dx += 0.3 * Math.sign(settings.ball.dx);
            settings.ball.dy += 0.3 * Math.sign(settings.ball.dy);
        }
    }

    function moveAI() {
        const computer = settings.computer;
        const ball = settings.ball;

        if (Math.random() > 0.9 || ball.x < canvas.width / 2) {
            return;
        }

        const computerCenter = computer.y + settings.paddle.height / 2;
        if (ball.y < computerCenter) {
            computer.y -= settings.paddle.speed;
        } else {
            computer.y += settings.paddle.speed;
        }
    }

    addCanvasRenderer(updateCanvasPong);
})();
