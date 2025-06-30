const restartBtn = document.getElementById("restartBtn");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;

const floorTop = 330;
const floorBottom = 470;

const worldWidth = 3000;

let playerLives = 3;
let gameOver = false;
let victory = false;
let fimDoMapa = false;
let cameraX = 0;
let alimentosColetados = 0;



const keys = {
    a: false,
    d: false,
    w: false,
    s: false,
    space: false,
};

const player = {
    x: 100,
    y: floorBottom - 90,
    width: 50,
    height: 90,
    color: "blue",
    speed: 3,
    isAttacking: false,
    attackCooldown: false,
    isFlashing: false
};

const enemy = {
    width: 40,
    height: 80,
    x: width - 100,
    y: floorBottom - 45,
    color: "red",
    speed: 0.7,
    isAlive: true,
    isAttacking: false,
    attackCooldown: false,
    isFlashing: false
};

const elementosDeCenario = [
    { x: 400, y: floorBottom - 60, width: 30, height: 60, color: "#654321" }, // poste
    { x: 900, y: floorBottom - 30, width: 60, height: 30, color: "#555" },    // caixa
    { x: 1600, y: floorBottom - 80, width: 40, height: 80, color: "green" },  // árvore
    { x: 2200, y: floorBottom - 40, width: 50, height: 40, color: "#999" },   // banco
];

const alimentos = [
    { x: 500, y: floorBottom - 30, width: 20, height: 20, color: "lime", coletado: false },
    { x: 800, y: floorBottom - 30, width: 20, height: 20, color: "lime", coletado: false },
    { x: 1300, y: floorBottom - 30, width: 20, height: 20, color: "lime", coletado: false },
    { x: 1900, y: floorBottom - 30, width: 20, height: 20, color: "lime", coletado: false },
    { x: 2400, y: floorBottom - 30, width: 20, height: 20, color: "lime", coletado: false },
];



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

function colidem(r1, r2) {
    return (
        r1.x < r2.x + r2.width &&
        r1.x + r1.width > r2.x &&
        r1.y < r2.y + r2.height &&
        r1.y + r1.height > r2.y
    );
}

function update() {
    if (gameOver) return;

    // Movimento player
    if (keys.a) player.x -= player.speed;
    if (keys.d) player.x += player.speed;
    if (keys.w) player.y -= player.speed;
    if (keys.s) player.y += player.speed;

    if (player.x < 0) player.x = 100;
    if (player.x + player.width > worldWidth) {
        player.x = worldWidth - player.width;
    }


    const minY = floorTop - player.height;
    const maxY = floorBottom - player.height;
    if (player.y < minY) player.y = minY;
    if (player.y > maxY) player.y = maxY;

    // Verifica fim do mapa
    if (player.x + player.width >= worldWidth - 20 && !fimDoMapa && !gameOver && !victory) {
        fimDoMapa = true;
    }

    // Colisão com objetos do cenário (bloqueia passagem)
    for (const obj of elementosDeCenario) {
        if (colidem(player, obj)) {
            // simples: empurra de volta
            if (player.x + player.width > obj.x && player.x < obj.x) {
                player.x = obj.x - player.width;
            } else if (player.x < obj.x + obj.width && player.x > obj.x) {
                player.x = obj.x + obj.width;
            }

            if (player.y + player.height > obj.y && player.y < obj.y) {
                player.y = obj.y - player.height;
            } else if (player.y < obj.y + obj.height && player.y > obj.y) {
                player.y = obj.y + obj.height;
            }
        }
    }


    // Ataque player
    if (keys.space && !player.attackCooldown) {
        player.isAttacking = true;
        player.attackCooldown = true;

        // Ataque tem duração
        setTimeout(() => {
            player.isAttacking = false;
        }, 200);

        // Colisão com inimigo
        if (
            enemy.isAlive &&
            colidem(
                { x: player.x + player.width, y: player.y + 20, width: 30, height: 30 },
                enemy
            )
        ) {
            enemy.isAlive = false;
            enemy.isFlashing = true;
            setTimeout(() => (enemy.isFlashing = false), 150);

            victory = true;
        }

        // Cooldown para novo ataque
        setTimeout(() => {
            player.attackCooldown = false;
        }, 600);
    }

    // Movimento e ataque do inimigo
    if (enemy.isAlive) {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;

        if (Math.abs(dx) > 1) enemy.x += dx > 0 ? enemy.speed : -enemy.speed;
        if (Math.abs(dy) > 1) enemy.y += dy > 0 ? enemy.speed : -enemy.speed;

        const minEnemyY = floorTop - enemy.height;
        const maxEnemyY = floorBottom - enemy.height;
        if (enemy.y < minEnemyY) enemy.y = minEnemyY;
        if (enemy.y > maxEnemyY) enemy.y = maxEnemyY;

        // Ataque inimigo se encostar
        if (
            colidem(enemy, player) &&
            !enemy.attackCooldown
        ) {
            playerLives--;
            player.isFlashing = true;
            setTimeout(() => (player.isFlashing = false), 150);

            if (playerLives <= 0) {
                gameOver = true;
            }

            enemy.attackCooldown = true;
            setTimeout(() => {
                enemy.attackCooldown = false;
            }, 1000);
        }
    }

    // Câmera segue o player (centraliza com suavidade)
    cameraX = Math.max(0, Math.min(player.x - width / 2 + player.width / 2, worldWidth - width));

    // Limita a câmera nos extremos do mundo
    if (cameraX < 0) cameraX = 0;
    if (cameraX > worldWidth - width) cameraX = worldWidth - width;

    // Coleta de alimentos saudáveis
    for (const a of alimentos) {
        if (!a.coletado && colidem(player, a)) {
            a.coletado = true;
            alimentosColetados++;
        }
    }

}

function draw() {
    ctx.clearRect(0, 0, width, height);

    // ==== CENÁRIO QUE SE MOVE ====
    ctx.save();
    ctx.translate(-cameraX, 0);

    // Fundo e chão
    ctx.fillStyle = "#B4C5E4";
    ctx.fillRect(0, 0, worldWidth, floorTop);

    ctx.fillStyle = "#ABC4AB";
    ctx.beginPath();
    ctx.moveTo(0, floorTop);
    ctx.lineTo(worldWidth, floorTop);
    ctx.lineTo(worldWidth, floorBottom);
    ctx.lineTo(0, floorBottom);
    ctx.closePath();
    ctx.fill();

    // Linhas horizontais no chão
    ctx.strokeStyle = "#3C3744";
    for (let i = 0; i < 5; i++) {
        let y = floorTop + ((floorBottom - floorTop) / 5) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(worldWidth, y);
        ctx.stroke();
    }

    // Elementos do cenário
    for (const el of elementosDeCenario) {
        ctx.fillStyle = el.color;
        ctx.fillRect(el.x, el.y, el.width, el.height);
    }

    // Alimentos saudáveis
    for (const a of alimentos) {
        if (!a.coletado) {
            ctx.fillStyle = a.color;
            ctx.fillRect(a.x, a.y, a.width, a.height);
        }
    }

    // Inimigo
    if (enemy.isAlive) {
        ctx.fillStyle = enemy.isFlashing ? "#fff" : enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }

    // Jogador
    ctx.fillStyle = player.isFlashing ? "#fff" : player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    if (player.isAttacking) {
        ctx.fillStyle = "yellow";
        ctx.fillRect(player.x + player.width, player.y + 20, 30, 30);
    }

    ctx.restore(); // ==== FIM DA CÂMERA ====

    // ==== HUD E MENSAGENS FIXAS NA TELA ====

    // Vidas
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("❤️ Vidas: " + playerLives, 20, 30);

    // Alimentos coletados
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`🍏 Alimentos: ${alimentosColetados}`, width - 180, 30);


    // Mensagens
    if (gameOver) {
        ctx.fillStyle = "black";
        ctx.font = "48px Arial";
        ctx.fillText("GAME OVER", width / 2 - 150, height / 2);
    }

    if (victory) {
        ctx.fillStyle = "green";
        ctx.font = "36px Arial";
        ctx.fillText("🎉 Parabéns! Você venceu a fase!", width / 2 - 250, height / 2);
    }

    if (fimDoMapa) {
        ctx.fillStyle = "blue";
        ctx.font = "36px Arial";
        ctx.fillText("🌟 Você chegou ao fim do mapa!", width / 2 - 250, height / 2 + 50);
    }
}


function gameLoop() {
    update();
    draw();
    if (!gameOver && !victory && !fimDoMapa) requestAnimationFrame(gameLoop);
}

restartBtn.onclick = () => {
    // Reset estado
    player.x = 100;
    player.y = floorBottom - 90;
    playerLives = 3;
    player.isAttacking = false;
    player.attackCooldown = false;
    player.isFlashing = false;

    enemy.x = width - 100;
    enemy.y = floorBottom - 45;
    enemy.isAlive = true;
    enemy.isFlashing = false;
    enemy.attackCooldown = false;

    gameOver = false;
    victory = false;

    restartBtn.style.display = "none";
    gameLoop();
};


gameLoop();
