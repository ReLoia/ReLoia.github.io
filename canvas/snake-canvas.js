/**
 * @fileoverview Snake game
 */

let snakeGame = {};

(() => {
    const snakeDiv = document.querySelector("div[snake]");

    const canvas = snakeDiv.querySelector("canvas#snakeCanvas");
    const ctx = canvas.getContext("2d");

    canvas.height = 140 * scale;
    canvas.width = 420 * scale;
    
    const gridSize = 10;

    snakeGame.settings = {
        snake: [getRandomGridPosition()],
        food: { x: 8 * gridSize, y: 10 * gridSize },
        dx: 1,
        dy: 0,
        score: 0,
        gameOver: true,
        speed: 150,
    };

    let gameLoop;

    function updateCanvasSnake() {
        ctx.fillStyle = "#0a0505";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawSnake();
        drawFood();

        if (!snakeGame.settings.gameOver) {
            moveSnake();
            checkCollision();
        }

        if (snakeGame.settings.gameOver) {
            clearInterval(gameLoop);

            const restartText = "press any arrow key to start";
            ctx.font = "12px monospace";
            ctx.fillStyle = "white";
            ctx.fillText(restartText, canvas.width / 2 - ctx.measureText(restartText).width / 2, canvas.height - 30);

            return;
        }

        ctx.font = `${16 * scale}px monospace`;
        ctx.fillStyle = "white";
        ctx.fillText(snakeGame.settings.score, 10, 18);
    }

    function drawSnake() {
        ctx.fillStyle = "green";
        snakeGame.settings.snake.forEach(segment => {
            ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
            ctx.strokeStyle = "black";
            ctx.strokeRect(segment.x, segment.y, gridSize, gridSize);
        });
    }

    function drawFood() {
        ctx.fillStyle = "red";
        ctx.fillRect(snakeGame.settings.food.x, snakeGame.settings.food.y, gridSize, gridSize);
        ctx.strokeStyle = "black";
        ctx.strokeRect(snakeGame.settings.food.x, snakeGame.settings.food.y, gridSize, gridSize);
    }

    function moveSnake() {
        const head = { ...snakeGame.settings.snake[0] };
        head.x += snakeGame.settings.dx * gridSize;
        head.y += snakeGame.settings.dy * gridSize;

        snakeGame.settings.snake.unshift(head);

        if (head.x === snakeGame.settings.food.x && head.y === snakeGame.settings.food.y) {
            snakeGame.settings.score++;
            generateFood();
        } else {
            snakeGame.settings.snake.pop();
        }
        
    }

    function checkCollision() {
        const head = snakeGame.settings.snake[0];
        
        if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
            snakeGame.settings.gameOver = true;
            return;
        }

        for (let i = 1; i < snakeGame.settings.snake.length; i++) {
            if (head.x === snakeGame.settings.snake[i].x && head.y === snakeGame.settings.snake[i].y) {
                snakeGame.settings.gameOver = true;
                return;
            }
        }
    }

    function getRandomGridPosition() {
        return {
            x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
            y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize,
        };
    }

    function generateFood() {
        snakeGame.settings.food = getRandomGridPosition();

        if (snakeGame.settings.snake.some(segment => segment.x === snakeGame.settings.food.x && segment.y === snakeGame.settings.food.y)) {
            generateFood();
        }
    }

    document.addEventListener("keydown", (event) => {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key))
            event.preventDefault();
        
        if (snakeGame.settings.gameOver) {
            resetGame();
            return;
        }

        if (event.code === "ArrowLeft" && snakeGame.settings.dx !== 1) {
            snakeGame.settings.dx = -1;
            snakeGame.settings.dy = 0;
        } else if (event.code === "ArrowUp" && snakeGame.settings.dy !== 1) {
            snakeGame.settings.dx = 0;
            snakeGame.settings.dy = -1;
        } else if (event.code === "ArrowRight" && snakeGame.settings.dx !== -1) {
            snakeGame.settings.dx = 1;
            snakeGame.settings.dy = 0;
        } else if (event.code === "ArrowDown" && snakeGame.settings.dy !== -1) {
            snakeGame.settings.dx = 0;
            snakeGame.settings.dy = 1;
        }
    });

    function resetGame() {
        snakeGame.settings.snake = [getRandomGridPosition()];
        snakeGame.settings.dx = 1;
        snakeGame.settings.dy = 0;
        snakeGame.settings.score = 0;
        snakeGame.settings.gameOver = false;
        generateFood();
        gameLoop = setInterval(updateCanvasSnake, snakeGame.settings.speed);
    }

    generateFood();
    gameLoop = setInterval(updateCanvasSnake, snakeGame.settings.speed);
})();