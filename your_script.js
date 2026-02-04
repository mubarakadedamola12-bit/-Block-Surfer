// Initial setup for the game
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Game variables
let player;
let obstacles = [];
let score = 0;
let gameRunning = true;

// Player class
class Player {
    constructor() {
        this.x = 50; // initial x position
        this.y = canvas.height - 70; // initial y position
        this.width = 50;
        this.height = 70;
        this.jumping = false;
        this.speed = 5;
    }

    draw() {
        context.fillStyle = 'blue';
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    jump() {
        if (!this.jumping) {
            this.jumping = true;
            setTimeout(() => {
                this.jumping = false;
                this.y = canvas.height - 70; // reset y after jump
            }, 500); // jump lasts for half a second
            this.y -= 100; // jump height
        }
    }

    move(direction) {
        if (direction === 'left' && this.x > 0) {
            this.x -= this.speed;
        } else if (direction === 'right' && this.x < canvas.width - this.width) {
            this.x += this.speed;
        }
    }
}

// Obstacle class
class Obstacle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
    }

    draw() {
        context.fillStyle = 'red';
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += 5; // fall speed
    }
}

// Game loop
function update() {
    if (gameRunning) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        player.draw();
        score++;
        document.getElementById('score').innerText = `Score: ${score}`;

        obstacles.forEach((obstacle, index) => {
            obstacle.update();
            obstacle.draw();

            // Collision detection
            if (player.x < obstacle.x + obstacle.width &&
                player.x + player.width > obstacle.x &&
                player.y < obstacle.y + obstacle.height &&
                player.y + player.height > obstacle.y) {
                gameRunning = false;
                alert('Game Over! Your score was ' + score);
            }

            // Remove offscreen obstacles
            if (obstacle.y > canvas.height) {
                obstacles.splice(index, 1);
            }
        });

        // Add new obstacle
        if (Math.random() < 0.02) { // 2% chance to spawn an obstacle
            const obstacleX = Math.random() * (canvas.width - 40);
            obstacles.push(new Obstacle(obstacleX, 0));
        }

        requestAnimationFrame(update);
    }
}

// Initialize game
function startGame() {
    player = new Player();
    update();
}

// Control the player
window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        player.move('left');
    } else if (event.key === 'ArrowRight') {
        player.move('right');
    } else if (event.key === 'Space') {
        player.jump();
    }
});

// Start the game
startGame();
