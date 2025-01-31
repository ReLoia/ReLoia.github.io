/**
 * @fileoverview Snake game
 */

let snake = {};

(() => {
    const snakeDiv = document.querySelector("div[snake]");

    const canvas = snakeDiv.querySelector("canvas#snakeCanvas");
    const ctx = canvas.getContext("2d");

    canvas.height = 140 * scale;
    canvas.width = 420 * scale;
    
    const gridSize = 10;

    snake.settings = {
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

        if (!snake.settings.gameOver) {
            moveSnake();
            checkCollision();
        }

        if (snake.settings.gameOver) {
            clearInterval(gameLoop);

            const restartText = "press any arrow key to start";
            ctx.font = "12px monospace";
            ctx.fillStyle = "white";
            ctx.fillText(restartText, canvas.width / 2 - ctx.measureText(restartText).width / 2, canvas.height - 30);

            return;
        }

        ctx.font = `${16 * scale}px monospace`;
        ctx.fillStyle = "white";
        ctx.fillText(snake.settings.score, 10, 18);
    }

    function drawSnake() {
        ctx.fillStyle = "green";
        snake.settings.snake.forEach(segment => {
            ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
            ctx.strokeStyle = "black";
            ctx.strokeRect(segment.x, segment.y, gridSize, gridSize);
        });
    }

    function drawFood() {
        ctx.fillStyle = "red";
        ctx.fillRect(snake.settings.food.x, snake.settings.food.y, gridSize, gridSize);
        ctx.strokeStyle = "black";
        ctx.strokeRect(snake.settings.food.x, snake.settings.food.y, gridSize, gridSize);
    }

    function moveSnake() {
        const head = { ...snake.settings.snake[0] };
        head.x += snake.settings.dx * gridSize;
        head.y += snake.settings.dy * gridSize;

        snake.settings.snake.unshift(head);

        if (head.x === snake.settings.food.x && head.y === snake.settings.food.y) {
            snake.settings.score++;
            generateFood();
        } else {
            snake.settings.snake.pop();
        }
        
    }

    function checkCollision() {
        const head = snake.settings.snake[0];
        
        if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
            snake.settings.gameOver = true;
            return;
        }

        for (let i = 1; i < snake.settings.snake.length; i++) {
            if (head.x === snake.settings.snake[i].x && head.y === snake.settings.snake[i].y) {
                snake.settings.gameOver = true;
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
        snake.settings.food = getRandomGridPosition();

        if (snake.settings.snake.some(segment => segment.x === snake.settings.food.x && segment.y === snake.settings.food.y)) {
            generateFood();
        }
    }

    document.addEventListener("keydown", (event) => {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key))
            event.preventDefault();
        
        if (snake.settings.gameOver) {
            resetGame();
            return;
        }

        if (event.code === "ArrowLeft" && snake.settings.dx !== 1) {
            snake.settings.dx = -1;
            snake.settings.dy = 0;
        } else if (event.code === "ArrowUp" && snake.settings.dy !== 1) {
            snake.settings.dx = 0;
            snake.settings.dy = -1;
        } else if (event.code === "ArrowRight" && snake.settings.dx !== -1) {
            snake.settings.dx = 1;
            snake.settings.dy = 0;
        } else if (event.code === "ArrowDown" && snake.settings.dy !== -1) {
            snake.settings.dx = 0;
            snake.settings.dy = 1;
        }
    });

    function resetGame() {
        snake.settings.snake = [getRandomGridPosition()];
        snake.settings.dx = 1;
        snake.settings.dy = 0;
        snake.settings.score = 0;
        snake.settings.gameOver = false;
        generateFood();
        gameLoop = setInterval(updateCanvasSnake, snake.settings.speed);
    }

    generateFood();
    gameLoop = setInterval(updateCanvasSnake, snake.settings.speed);
})();