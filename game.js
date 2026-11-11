const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// UI Elements
const startMenu = document.getElementById('startMenu');
const gameOverMenu = document.getElementById('gameOverMenu');
const hud = document.getElementById('hud');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const healthBar = document.getElementById('health-bar');
const finalScoreEl = document.getElementById('finalScore');

// Game State
let canvasWidth, canvasHeight;
let animationId;
let gameActive = false;
let score = 0;
let level = 1;
let health = 100;
let frames = 0;

// Resize Canvas
function resize() {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
}
window.addEventListener('resize', resize);
resize();

// Input Tracking
const mouse = { x: 50, y: canvasHeight / 2 };
window.addEventListener('mousemove', (e) => {
    mouse.y = e.clientY;
});
window.addEventListener('mousedown', () => {
    if (gameActive) player.shoot();
});

// --- GAME CLASSES ---

class Player {
    constructor() {
        this.x = 80;
        this.y = canvasHeight / 2;
        this.width = 40;
        this.height = 120;
        this.color = '#00d2ff';
        this.cooldown = 0;
    }

    draw() {
        // Smooth follow mouse
        this.y += (mouse.y - this.y) * 0.1;

        ctx.save();
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;

        // Draw Axon Terminal shape
        ctx.beginPath();
        ctx.roundRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height, [20, 10, 10, 20]);
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.draw();
        if (this.cooldown > 0) this.cooldown--;
    }

    shoot() {
        if (this.cooldown === 0) {
            projectiles.push(new Projectile(this.x + this.width / 2, this.y));
            this.cooldown = 15; // Fire rate limit
        }
    }
}

class Projectile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 6;
        this.velocity = { x: 12 + (level * 0.5), y: (Math.random() - 0.5) * 1 };
        this.color = '#fff';
    }

    draw() {
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00d2ff';
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.draw();
    }
}

class Target {
    constructor() {
        this.radius = 25;
        this.x = canvasWidth - 100;
        this.y = Math.random() * (canvasHeight - 100) + 50;
        this.color = '#39ff14';
        this.speed = (Math.random() * 2 + 1) * (Math.random() > 0.5 ? 1 : -1);
    }

    draw() {
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Inner core
        ctx.fillStyle = 'rgba(57, 255, 20, 0.2)';
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.y += this.speed;
        // Bounce off edges
        if (this.y + this.radius > canvasHeight || this.y - this.radius < 0) {
            this.speed = -this.speed;
        }
        this.draw();
    }
}

class Obstacle {
    constructor() {
        this.radius = Math.random() * 15 + 15;
        this.x = canvasWidth / 2 + (Math.random() * 300 - 150);
        this.y = Math.random() > 0.5 ? 0 - this.radius : canvasHeight + this.radius;
        this.color = '#ff003c';
        this.velocity = {
            x: Math.random() * 2 - 1,
            y: (Math.random() * 3 + 2 + level * 0.5) * (this.y < 0 ? 1 : -1)
        };
    }

    draw() {
        ctx.save();
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;

        // Spiky shape
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            const spikeDist = i % 2 === 0 ? this.radius : this.radius * 0.6;
            const px = this.x + Math.cos(angle) * spikeDist;
            const py = this.y + Math.sin(angle) * spikeDist;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.draw();
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 3 + 1;
        this.color = color;
        this.velocity = {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 8
        };
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.02;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
        this.draw();
    }
}

// --- GAME ENGINE ---

let player;
let projectiles = [];
let targets = [];
let obstacles = [];
let particles = [];

function init() {
    player = new Player();
    projectiles = [];
    targets = [];
    obstacles = [];
    particles = [];
    score = 0;
    level = 1;
    health = 100;
    frames = 0;

    updateHUD();

    // Initial spawns
    for (let i = 0; i < 3; i++) targets.push(new Target());
}

function createExplosion(x, y, color) {
    for (let i = 0; i < 15; i++) {
        particles.push(new Particle(x, y, color));
    }
}

function updateHUD() {
    scoreEl.innerText = score;
    levelEl.innerText = level;
    healthBar.style.width = `${Math.max(0, health)}%`;

    if (health < 30) {
        healthBar.style.backgroundColor = 'var(--neon-red)';
        healthBar.style.boxShadow = '0 0 10px var(--neon-red)';
    } else {
        healthBar.style.backgroundColor = 'var(--neon-blue)';
        healthBar.style.boxShadow = '0 0 10px var(--neon-blue)';
    }
}

function spawnEntities() {
    // Level scaling
    level = Math.floor(score / 500) + 1;

    // Spawn Obstacles (Neurotoxins)
    if (frames % Math.max(20, 90 - (level * 10)) === 0) {
        obstacles.push(new Obstacle());
    }

    // Maintain Receptors
    if (targets.length < 3 + Math.floor(level / 2)) {
        if (Math.random() < 0.05) targets.push(new Target());
    }
}

function distance(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
}

function animate() {
    if (!gameActive) return;
    animationId = requestAnimationFrame(animate);

    // Trail effect background clear
    ctx.fillStyle = 'rgba(5, 5, 8, 0.3)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw Post-Synaptic Neuron outline on the right
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.roundRect(canvasWidth - 80, 0, 100, canvasHeight, [50, 0, 0, 50]);
    ctx.fill();

    player.update();
    spawnEntities();

    // Particles
    for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
        } else {
            particles[i].update();
        }
    }

    // Obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].update();
        // Remove if off screen
        if (obstacles[i].y > canvasHeight + 100 || obstacles[i].y < -100) {
            obstacles.splice(i, 1);
        }
    }

    // Targets
    for (let i = targets.length - 1; i >= 0; i--) {
        targets[i].update();
    }

    // Projectiles & Collisions
    for (let i = projectiles.length - 1; i >= 0; i--) {
        projectiles[i].update();
        let projectileRemoved = false;

        // Off screen
        if (projectiles[i].x > canvasWidth) {
            projectiles.splice(i, 1);
            health -= 2; // Miss penalty
            updateHUD();
            continue;
        }

        // Hit Obstacle?
        for (let j = obstacles.length - 1; j >= 0; j--) {
            if (distance(projectiles[i].x, projectiles[i].y, obstacles[j].x, obstacles[j].y) < projectiles[i].radius + obstacles[j].radius) {
                createExplosion(projectiles[i].x, projectiles[i].y, '#ff003c');
                projectiles.splice(i, 1);
                projectileRemoved = true;
                health -= 10; // Toxin hit penalty
                updateHUD();
                break;
            }
        }

        if (projectileRemoved) continue;

        // Hit Target?
        for (let j = targets.length - 1; j >= 0; j--) {
            if (distance(projectiles[i].x, projectiles[i].y, targets[j].x, targets[j].y) < projectiles[i].radius + targets[j].radius) {
                createExplosion(targets[j].x, targets[j].y, '#39ff14');
                score += 50;
                health = Math.min(100, health + 2); // Heal slightly
                updateHUD();

                projectiles.splice(i, 1);
                targets.splice(j, 1); // Destroy target
                break;
            }
        }
    }

    // Game Over Check
    if (health <= 0) {
        gameActive = false;
        cancelAnimationFrame(animationId);
        finalScoreEl.innerText = score;
        hud.classList.add('hidden');
        gameOverMenu.classList.remove('hidden');
    }

    frames++;
}

// --- BUTTON LISTENERS ---
document.getElementById('startBtn').addEventListener('click', () => {
    startMenu.classList.add('hidden');
    hud.classList.remove('hidden');
    init();
    gameActive = true;
    animate();
});

document.getElementById('restartBtn').addEventListener('click', () => {
    gameOverMenu.classList.add('hidden');
    hud.classList.remove('hidden');
    init();
    gameActive = true;
    animate();
});
