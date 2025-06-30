const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;

const floorTop = 330;
const floorBottom = 470;

const keys = {
    a: false,
    d: false,
    w: false,
    s: false,
    space: false,
};

// Jogador
const player = {
    x: 100,
    y: floorBottom - 90,
    width: 50,
    height: 90,
    color: "blue",
    speed: 3,
    isAttacking: false,
    attackCooldown: false,
};

const enemy = {
    width: 40,
    height: 45,
    x: width - 100,
    y: floorBottom - 45,
    color: "red",
    speed: 1.2,
    isAttacking: false,
    attackCooldown: false,
};


let playerLives = 3;

document.addEventListener("keydown", (e) => {
    if (e.key === "a" || e.key === "ArrowLeft") keys.a = true;
    if (e.key === "d" || e.key === "ArrowRight") keys.d = true;
    if (e.key === "w" || e.key === "ArrowUp") keys.w = true;
    if (e.key === "s" || e.key === "ArrowDown") keys.s = true;
    if (e.key === " ") keys.space = true;
});

document.addEventListener("keyup", (e) => {
    if (e.key === "a" || e.key === "ArrowLeft") keys.a = false;
    if (e.key === "d" || e.key === "ArrowRight") keys.d = false;
    if (e.key === "w" || e.key === "ArrowUp") keys.w = false;
    if (e.key === "s" || e.key === "ArrowDown") keys.s = false;
    if (e.key === " ") keys.space = false;
});

function update() {
    // Movimento
    if (keys.a) player.x -= player.speed;
    if (keys.d) player.x += player.speed;
    if (keys.w) player.y -= player.speed;
    if (keys.s) player.y += player.speed;

    // Limites horizontais
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > width) player.x = width - player.width;

    // ⚠️ Limites verticais corrigidos:
    const minY = floorTop - player.height;
    const maxY = floorBottom - player.height; // pés podem encostar no fundo

    if (player.y < minY) player.y = minY;
    if (player.y > maxY) player.y = maxY;

    // Ataque
    if (keys.space && !player.attackCooldown) {
        player.isAttacking = true;
        player.attackCooldown = true;

        setTimeout(() => {
            player.isAttacking = false;
        }, 200);

        setTimeout(() => {
            player.attackCooldown = false;
        }, 600);
    }

    // Movimento de perseguição
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;

    if (Math.abs(dx) > 1) enemy.x += dx > 0 ? enemy.speed : -enemy.speed;
    if (Math.abs(dy) > 1) enemy.y += dy > 0 ? enemy.speed : -enemy.speed;

    // Limites verticais do inimigo
    const minEnemyY = floorTop - enemy.height;
    const maxEnemyY = floorBottom - enemy.height;
    if (enemy.y < minEnemyY) enemy.y = minEnemyY;
    if (enemy.y > maxEnemyY) enemy.y = maxEnemyY;

    if (colidem(player, enemy) && !enemy.attackCooldown) {
        playerLives--;
        enemy.attackCooldown = true;
        console.log("💥 O inimigo te atingiu!");

        setTimeout(() => {
            enemy.attackCooldown = false;
        }, 1000);
    }


}

function draw() {
    ctx.clearRect(0, 0, width, height);

    // Fundo (parede)
    ctx.fillStyle = "#d0d0d0";
    ctx.fillRect(0, 0, width, floorTop);

    // Chão com perspectiva (trapézio)
    ctx.fillStyle = "#888";
    ctx.beginPath();
    ctx.moveTo(0, floorTop);
    ctx.lineTo(width, floorTop);
    ctx.lineTo(width, floorBottom);
    ctx.lineTo(0, floorBottom);
    ctx.closePath();
    ctx.fill();

    // Linhas horizontais no chão
    ctx.strokeStyle = "#aaa";
    for (let i = 0; i < 5; i++) {
        let y = floorTop + ((floorBottom - floorTop) / 5) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    // Jogador
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Inimigo
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);


    // Ataque
    if (player.isAttacking) {
        ctx.fillStyle = "yellow";
        ctx.fillRect(player.x + player.width, player.y + 20, 30, 30);
    }

    // HUD - vidas
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("❤️ Vidas: " + playerLives, 20, 30);
}

function colidem(r1, r2) {
    return (
        r1.x < r2.x + r2.width &&
        r1.x + r1.width > r2.x &&
        Math.abs(r1.y - r2.y) < 30 // tolerância para profundidade
    );
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Início automático do jogo
gameLoop();
