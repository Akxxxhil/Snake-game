const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const leaderboardList = document.getElementById("leaderboardList");
let snake = [];
let direction = "RIGHT";
let food = {};
let score = 0;
let interval;

const cellSize = 20;
const canvasSize = 400;
const rows = canvasSize / cellSize;
const cols = canvasSize / cellSize;

function startGame() {
    snake = [{ x: 10, y: 10 }];
    direction = "RIGHT";
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    createFood();
    if (interval) clearInterval(interval);
    interval = setInterval(gameLoop, 100);
}

function createFood() {
    food = {
        x: Math.floor(Math.random() * cols) * cellSize,
        y: Math.floor(Math.random() * rows) * cellSize
    };
}

function drawCell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, cellSize, cellSize);
}

function gameLoop() {
    let head = { ...snake[0] };

    switch (direction) {
        case "UP":
            head.y -= cellSize;
            break;
        case "DOWN":
            head.y += cellSize;
            break;
        case "LEFT":
            head.x -= cellSize;
            break;
        case "RIGHT":
            head.x += cellSize;
            break;
    }

    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize || snake.some(cell => cell.x === head.x && cell.y === head.y)) {
        endGame();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = `Score: ${score}`;
        createFood();
    } else {
        snake.pop();
    }

    ctx.clearRect(0, 0, canvasSize, canvasSize);
    drawCell(food.x, food.y, "red");
    snake.forEach(cell => drawCell(cell.x, cell.y, "green"));
}

function endGame() {
    clearInterval(interval);
    let name = prompt("Game Over! Enter your name:");
    if (name) {
        updateLeaderboard(name, score);
    }
}

function updateLeaderboard(name, score) {
    let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
    scores.push({ name, score });
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem("leaderboard", JSON.stringify(scores));
    displayLeaderboard();
}

function displayLeaderboard() {
    let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboardList.innerHTML = "";
    scores.slice(0, 5).forEach(entry => {
        let li = document.createElement("li");
        li.textContent = `${entry.name}: ${entry.score}`;
        leaderboardList.appendChild(li);
    });
}

window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            if (direction !== "DOWN") direction = "UP";
            break;
        case "ArrowDown":
            if (direction !== "UP") direction = "DOWN";
            break;
        case "ArrowLeft":
            if (direction !== "RIGHT") direction = "LEFT";
            break;
        case "ArrowRight":
            if (direction !== "LEFT") direction = "RIGHT";
            break;
    }
});

startGame();
displayLeaderboard();
