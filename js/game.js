const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const floorHeight = 100;
const gravity = 0.5;

const keys = {
    a: false,
    d: false,
    w: false
};

// Player base
const player = {
    x: 100,
    y: 0,
    width: 50,
    height: 90,
    velocityX: 0,
    velocityY: 0,
    speed: 5,
    jumpForce: -12,
    onGround: false,
    color: "blue",
    isAttacking: false,
    attackCooldown: false,
    attackBox: {
        offsetX: 50,
        width: 40,
        height: 40
    }
};

const enemy = {
    x: 700,
    y: canvasHeight - floorHeight - 90,
    width: 50,
    height: 90,
    color: "red",
    isAlive: true
};


// Movimentação do teclado
document.addEventListener("keydown", (e) => {
    if (e.key === "a" || e.key === "ArrowLeft") keys.a = true;
    if (e.key === "d" || e.key === "ArrowRight") keys.d = true;
    if ((e.key === "w" || e.key === "ArrowUp") && player.onGround) {
        player.velocityY = player.jumpForce;
        player.onGround = false;
    }
    if (e.key === " ") {
        if (!player.attackCooldown) {
            player.isAttacking = true;
            player.attackCooldown = true;

            setTimeout(() => {
                player.isAttacking = false;
            }, 200); // tempo do ataque visível

            setTimeout(() => {
                player.attackCooldown = false;
            }, 500); // tempo para atacar de novo
        }
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === "a" || e.key === "ArrowLeft") keys.a = false;
    if (e.key === "d" || e.key === "ArrowRight") keys.d = false;
});

function update() {
    // Gravidade
    player.velocityY += gravity;

    // Movimento lateral
    player.velocityX = 0;
    if (keys.a) player.velocityX = -player.speed;
    if (keys.d) player.velocityX = player.speed;

    // Atualiza posição
    player.x += player.velocityX;
    player.y += player.velocityY;

    // Colisão com chão
    if (player.y + player.height >= canvasHeight - floorHeight) {
        player.y = canvasHeight - floorHeight - player.height;
        player.velocityY = 0;
        player.onGround = true;
    } else {
        player.onGround = false;
    }

    // Limites da tela
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvasWidth) player.x = canvasWidth - player.width;

    if (player.isAttacking && enemy.isAlive) {
        const attackBox = {
            x: player.x + (player.attackBox.offsetX * (player.velocityX >= 0 ? 1 : -1)),
            y: player.y + 20,
            width: player.attackBox.width,
            height: player.attackBox.height
        };

        if (retangulosColidem(attackBox, enemy)) {
            enemy.isAlive = false;
            console.log("Inimigo atingido!");
        }
    }

}

function draw() {
    // Fundo
    ctx.fillStyle = "#a0e3f0";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Chão
    ctx.fillStyle = "#654321";
    ctx.fillRect(0, canvasHeight - floorHeight, canvasWidth, floorHeight);

    // Jogador
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Inimigo
    if (enemy.isAlive) {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }

    // Ataque
    if (player.isAttacking) {
        ctx.fillStyle = "yellow";
        const atkX = player.x + (player.attackBox.offsetX * (player.velocityX >= 0 ? 1 : -1));
        ctx.fillRect(atkX, player.y + 20, player.attackBox.width, player.attackBox.height);
    }

}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function retangulosColidem(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

gameLoop();