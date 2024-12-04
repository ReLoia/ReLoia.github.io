/**
 * @fileoverview Arkanoid game
 */

class Brick {
    constructor(x, y, width, height, color, value) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color || "white";
        this.value = value;
        this.destroyed = false;
    }

    draw(ctx) {
        if (!this.destroyed) {
            ctx.fillStyle = this.color;
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
            return this.value; // Indicate collision occurred
        }
        return 0;
    }
}

let arkanoid = {};

(() => {
    const arkaDiv = document.querySelector("div[arkanoid]");
    const canvas = arkaDiv.querySelector("canvas#arkanoidCanvas");
    const ctx = canvas.getContext("2d");

    canvas.height = 140 * scale;
    canvas.width = 420 * scale;

    arkanoid.settings = {
        borderWidth: 5,
        playing: false,
        ball: {
            x: canvas.width / 2,
            y: canvas.height / 2 + 20,
            dx: 0,
            dy: 2,
            radius: 6 * scale,
        },
        paddle: {
            width: 60 * scale,
            height: 10 * scale,
            speed: 5 * scale,
            x: canvas.width / 2 - (80 * scale) / 2,
            y: canvas.height - 20,
        },
        bricks: [],
        aliveBricks: 0,
        brickConfig: {
            rows: 2,
            cols: 11,
            width: 30 * scale,
            height: 6,
            padding: 4 * scale,
            offsetTop: 25,
            offsetLeft: 20 * scale,
        },
        score: Number(localStorage.getItem("arkanoidScore")) || 0,
    };

    function createBricks() {
        arkanoid.settings.bricks = [];
        for (let row = 0; row < Math.min(Math.max(arkanoid.settings.brickConfig.rows, 1), 5); row++) {
            for (let col = 0; col < arkanoid.settings.brickConfig.cols; col++) {
                const x =
                    arkanoid.settings.brickConfig.offsetLeft +
                    col * (arkanoid.settings.brickConfig.width + arkanoid.settings.brickConfig.padding);
                const y =
                    arkanoid.settings.brickConfig.offsetTop +
                    row * (arkanoid.settings.brickConfig.height + arkanoid.settings.brickConfig.padding);

                const level = Math.abs(row-arkanoid.settings.brickConfig.rows+1);
                arkanoid.settings.bricks.push(new Brick(x, y, arkanoid.settings.brickConfig.width, arkanoid.settings.brickConfig.height, ["white", "yellow", "orange", "red"][level], 10**level));
            }
        }
        arkanoid.settings.aliveBricks = arkanoid.settings.brickConfig.rows*arkanoid.settings.brickConfig.cols;
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background
        ctx.fillStyle = "#2c2c2c";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw ball
        const {x, y, radius} = arkanoid.settings.ball;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        // Draw paddle
        const {x: paddleX, y: paddleY, width, height} = arkanoid.settings.paddle;
        ctx.fillStyle = "white";
        ctx.fillRect(paddleX, paddleY, width, height);

        // Draw bricks
        arkanoid.settings.bricks.forEach((brick) => brick.draw(ctx));

        // Draw score
        ctx.fillStyle = "white";
        ctx.font = `${16 * scale}px Arial`;
        ctx.fillText(""+Math.floor(arkanoid.settings.score), 10, 18);
    }

    function moveBall() {
        const {ball, paddle} = arkanoid.settings;

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
            arkanoid.settings.playing = false;
            arkanoid.settings.score *= 0.999;
            arkanoid.settings.brickConfig.rows -= 1;
            resetGame();
        }

        // Ball collision with bricks
        arkanoid.settings.bricks.forEach((brick) => {
            const value = brick.checkCollision(ball);
            if (value) {
                arkanoid.settings.aliveBricks--;
                ball.dy = -ball.dy;
                arkanoid.settings.score += value;
            }
        });

        if (arkanoid.settings.aliveBricks === 0) {
            arkanoid.settings.brickConfig.rows += 1;
            resetGame();
        }
    }

    function movePaddle(event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;

        arkanoid.settings.paddle.x = Math.max(
            Math.min(mouseX - arkanoid.settings.paddle.width / 2, canvas.width - arkanoid.settings.paddle.width),
            0
        );

        if (!arkanoid.settings.playing) {
            arkanoid.settings.playing = true;
            pong.settings.playing = false;
        }
    }

    function resetGame() {
        arkanoid.settings.ball.x = canvas.width / 2;
        arkanoid.settings.ball.y = canvas.height / 2 + 20;
        arkanoid.settings.ball.dx = 0;
        arkanoid.settings.ball.dy = 1.8;
        arkanoid.settings.paddle.x = canvas.width / 2 - arkanoid.settings.paddle.width / 2;
        localStorage.setItem("arkanoidScore", arkanoid.settings.score);
        createBricks();
    }

    function gameLoop() {
        draw();
        if (!arkanoid.settings.playing) {
            ctx.font = "14px monospace";
            const text = "Move your mouse to start";

            ctx.fillText(text, canvas.width / 2 - ctx.measureText(text).width / 2, canvas.height - 30);
        } else {
            moveBall();
        }
    }

    arkaDiv.addEventListener("mousemove", movePaddle);
    createBricks();
    addCanvasRenderer(gameLoop);
})();