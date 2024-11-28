/**
 * @fileoverview Arkanoid game
 */

class Brick {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.destroyed = false;
    }

    draw(ctx) {
        if (!this.destroyed) {
            ctx.fillStyle = "white";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    checkCollision(ball) {
        if (
            !this.destroyed &&
            ball.x > this.x &&
            ball.x < this.x + this.width &&
            ball.y > this.y &&
            ball.y < this.y + this.height
        ) {
            this.destroyed = true;
            return true; // Indicate collision occurred
        }
        return false;
    }
}

(() => {
    const arkaDiv = document.querySelector("div[arkanoid]");
    const canvas = arkaDiv.querySelector("canvas#arkanoidCanvas");
    const ctx = canvas.getContext("2d");

    canvas.height = 140 * scale;
    canvas.width = 420 * scale;

    const settings = {
        borderWidth: 5,
        playing: false,
        ball: {
            x: canvas.width / 2,
            y: canvas.height / 2 + 20,
            dx: 0,
            dy: 1.8,
            radius: 6 * scale,
        },
        paddle: {
            width: 60 * scale,
            height: 10 * scale,
            speed: 5 * scale,
            x: canvas.width / 2 - (80 * scale) / 2,
            y: canvas.height - 20 * scale,
        },
        bricks: [],
        brickConfig: {
            rows: 4,
            cols: 11,
            width: 30 * scale,
            height: 6 * scale,
            padding: 4 * scale,
            offsetTop: 20 * scale,
            offsetLeft: 20 * scale,
        },
        score: 0,
    };

    function createBricks() {
        settings.bricks = [];
        for (let row = 0; row < settings.brickConfig.rows; row++) {
            for (let col = 0; col < settings.brickConfig.cols; col++) {
                const x =
                    settings.brickConfig.offsetLeft +
                    col * (settings.brickConfig.width + settings.brickConfig.padding);
                const y =
                    settings.brickConfig.offsetTop +
                    row * (settings.brickConfig.height + settings.brickConfig.padding);
                settings.bricks.push(new Brick(x, y, settings.brickConfig.width, settings.brickConfig.height));
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background
        ctx.fillStyle = "#2c2c2c";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw ball
        const {x, y, radius} = settings.ball;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        // Draw paddle
        const {x: paddleX, y: paddleY, width, height} = settings.paddle;
        ctx.fillStyle = "white";
        ctx.fillRect(paddleX, paddleY, width, height);

        // Draw bricks
        settings.bricks.forEach((brick) => brick.draw(ctx));

        // Draw score
        ctx.fillStyle = "white";
        ctx.font = `${16 * scale}px Arial`;
        ctx.fillText(settings.score, 10, 18);
    }

    function moveBall() {
        const {ball, paddle} = settings;

        ball.x += ball.dx;
        ball.y += ball.dy;

        // Ball collision with walls
        if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
            ball.dx = -ball.dx;
        }
        if (ball.y - ball.radius < 0) {
            ball.dy = -ball.dy;
        }

        // Ball collision with paddle
        if (
            ball.x > paddle.x &&
            ball.x < paddle.x + paddle.width &&
            ball.y + ball.radius > paddle.y
        ) {
            ball.dy = -Math.abs(ball.dy);
            const angle = ((ball.x - (paddle.x + paddle.width / 2)) / paddle.width) * 130;
            ball.dx = Math.sin(angle * (Math.PI / 180)) * 2.5 * scale;
        }

        // Ball out of bounds
        if (ball.y + ball.radius > canvas.height) {
            settings.playing = false;
            resetGame();
        }

        // Ball collision with bricks
        settings.bricks.forEach((brick) => {
            if (brick.checkCollision(ball)) {
                ball.dy = -ball.dy;
                settings.score += 10;
            }
        });
    }

    function movePaddle(event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;

        settings.paddle.x = Math.max(
            Math.min(mouseX - settings.paddle.width / 2, canvas.width - settings.paddle.width),
            0
        );

        if (!settings.playing) {
            settings.playing = true;
        }
    }

    function resetGame() {
        settings.ball.x = canvas.width / 2;
        settings.ball.y = canvas.height / 2 + 20;
        settings.ball.dx = 0;
        settings.ball.dy = 1.8;
        settings.paddle.x = canvas.width / 2 - settings.paddle.width / 2;
        createBricks();
    }

    function gameLoop() {
        draw();
        if (settings.playing) {
            moveBall();
        }
        // requestAnimationFrame(gameLoop);
    }

    arkaDiv.addEventListener("mousemove", movePaddle);
    createBricks();
    addCanvasRenderer(gameLoop)
})();