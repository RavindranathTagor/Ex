const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score-value');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');
const startScreen = document.getElementById('start-screen'); // Reference to the start screen
const startButton = document.getElementById('start-button'); // Reference to the start button

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Game variables
let score = 0;
let gameOver = false;

// Fish class for player, enemies, and food
class Fish {
    constructor(x, y, size, speed, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.size, this.y - this.size / 2);
        ctx.lineTo(this.x - this.size, this.y + this.size / 2);
        ctx.closePath();
        ctx.fill();
    }

    move() {
        this.x += this.speed;
        if (this.x > canvas.width + this.size) {
            this.x = -this.size;
            this.y = Math.random() * canvas.height;
        }
    }
}

// Create player, enemies, and food arrays
const player = new Fish(100, canvas.height / 2, 20, 0, '#00FF00');
const enemies = [];
const food = [];

// Control variables
const keys = {};
const playerSpeed = 5;

// Spawn enemies and food
function spawnEnemies() {
    if (enemies.length < 5) {
        const size = Math.random() * 10 + 25;
        const enemy = new Fish(
            -size,
            Math.random() * canvas.height,
            size,
            Math.random() * 2 + 1,
            '#FF0000'
        );
        enemies.push(enemy);
    }
}

function spawnFood() {
    if (food.length < 10) {
        const size = Math.random() * 5 + 5;
        const foodItem = new Fish(
            -size,
            Math.random() * canvas.height,
            size,
            Math.random() * 1 + 0.5,
            '#FFFF00'
        );
        food.push(foodItem);
    }
}

// Collision detection function
function checkCollision(fish1, fish2) {
    const dx = fish1.x - fish2.x;
    const dy = fish1.y - fish2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (fish1.size + fish2.size) / 2;
}

// Game loop
function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update player position based on keyboard input
    if (keys.ArrowLeft || keys.a) player.x -= playerSpeed;
    if (keys.ArrowRight || keys.d) player.x += playerSpeed;
    if (keys.ArrowUp || keys.w) player.y -= playerSpeed;
    if (keys.ArrowDown || keys.s) player.y += playerSpeed;

    // Keep player within canvas bounds
    player.x = Math.max(player.size, Math.min(canvas.width - player.size, player.x));
    player.y = Math.max(player.size, Math.min(canvas.height - player.size, player.y));

    player.draw();

    // Move enemies and check for collisions
    enemies.forEach((enemy, index) => {
        enemy.draw();
        enemy.move();
        if (checkCollision(player, enemy) && enemy.size > player.size) {
            gameOver = true;
            showGameOver();
        }
    });

    // Move food and check for collection
    food.forEach((foodItem, index) => {
        foodItem.draw();
        foodItem.move();
        if (checkCollision(player, foodItem)) {
            food.splice(index, 1);
            player.size += 1; // Increase player size
            score += 10; // Increase score
            scoreElement.textContent = score; // Update score display
        }
    });

    spawnEnemies();
    spawnFood();

    requestAnimationFrame(gameLoop);
}

// Show game over screen
function showGameOver() {
    gameOverElement.classList.remove('hidden');
    finalScoreElement.textContent = score;
}

// Add keyboard event listeners
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Restart the game
restartButton.addEventListener('click', () => {
    resetGame();
});

// Start the game
startButton.addEventListener('click', () => {
    startScreen.classList.add('hidden'); // Hide the start screen
    resetGame(); // Reset the game to initial state and start
});

// Function to reset the game
function resetGame() {
    score = 0;
    scoreElement.textContent = score;
    player.size = 20;
    player.x = 100;
    player.y = canvas.height / 2;
    enemies.length = 0;
    food.length = 0;
    gameOver = false;
    gameOverElement.classList.add('hidden');
    gameLoop();
}

// Start the game loop
// gameLoop(); // No need to call it here; it will start when the player clicks the start button.
