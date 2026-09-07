
/* =========================
   ELEMENTS
========================= */

const intro = document.getElementById("intro");
const game = document.getElementById("game");
const win = document.getElementById("win");

const startButton = document.getElementById("startButton");
const againButton = document.getElementById("againButton");

const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");

const scoreElement = document.getElementById("score");

const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");

const confettiContainer =
    document.getElementById("confetti-container");


/* =========================
   GAME VARIABLES
========================= */

let score = 0;

let playerX = 50;

let gameRunning = false;

let spawnInterval = null;

let animationFrame = null;


/* =========================
   SCREEN SWITCHING
========================= */

function showScreen(screen) {

    intro.classList.remove("active");
    game.classList.remove("active");
    win.classList.remove("active");

    screen.classList.add("active");
}


/* =========================
   START GAME
========================= */

function startGame() {

    score = 0;

    playerX = 50;

    gameRunning = true;

    scoreElement.textContent = score;

    showScreen(game);

    movePlayer();

    clearGameArea();

    clearInterval(spawnInterval);

    spawnInterval = setInterval(() => {

        if (gameRunning) {
            createCake();
        }

    }, 700);
}


/* =========================
   CLEAR GAME
========================= */

function clearGameArea() {

    const cakes =
        gameArea.querySelectorAll(".falling-cake");

    cakes.forEach(cake => cake.remove());
}


/* =========================
   CREATE CAKE
========================= */

function createCake() {

    if (!gameRunning) return;

    const cake = document.createElement("div");

    cake.className = "falling-cake";

    cake.textContent = "🎂";

    const areaWidth = gameArea.clientWidth;

    const cakeSize = 45;

    const randomX =
        Math.random() *
        Math.max(0, areaWidth - cakeSize);

    cake.style.left = `${randomX}px`;

    const duration =
        2.2 + Math.random() * 1.1;

    cake.style.animationDuration =
        `${duration}s`;

    gameArea.appendChild(cake);

    checkCakeCollision(cake);

    setTimeout(() => {

        if (cake.parentElement) {
            cake.remove();
        }

    }, (duration + 0.2) * 1000);
}


/* =========================
   COLLISION
========================= */

function checkCakeCollision(cake) {

    function check() {

        if (!gameRunning) return;

        if (!cake.isConnected) return;

        const cakeRect =
            cake.getBoundingClientRect();

        const playerRect =
            player.getBoundingClientRect();

        const collision =
            cakeRect.left < playerRect.right &&
            cakeRect.right > playerRect.left &&
            cakeRect.top < playerRect.bottom &&
            cakeRect.bottom > playerRect.top;

        if (collision) {

            catchCake(cake);

            return;
        }

        animationFrame =
            requestAnimationFrame(check);
    }

    check();
}


/* =========================
   CATCH CAKE
========================= */

function catchCake(cake) {

    if (!cake.isConnected) return;

    cake.remove();

    score++;

    scoreElement.textContent = score;

    createSmallPop();

    if (score >= 10) {

        finishGame();

    }
}


/* =========================
   SMALL POP EFFECT
========================= */

function createSmallPop() {

    const pop = document.createElement("div");

    pop.textContent = "✨";

    pop.style.position = "fixed";

    pop.style.left =
        `${50 + (Math.random() * 20 - 10)}%`;

    pop.style.top = "50%";

    pop.style.fontSize = "30px";

    pop.style.pointerEvents = "none";

    pop.style.zIndex = "50";

    pop.style.animation =
        "popEffect .5s ease forwards";

    document.body.appendChild(pop);

    setTimeout(() => {
        pop.remove();
    }, 500);
}


/* Add pop animation */

const popStyle =
document.createElement("style");

popStyle.textContent = `
@keyframes popEffect {

    0% {
        opacity: 1;
        transform: scale(.5);
    }

    100% {
        opacity: 0;
        transform: scale(1.8) translateY(-30px);
    }

}
`;

document.head.appendChild(popStyle);


/* =========================
   PLAYER
========================= */

function movePlayer() {

    player.style.left = `${playerX}%`;
}


/* =========================
   MOVE LEFT
========================= */

function moveLeft() {

    if (!gameRunning) return;

    playerX -= 7;

    if (playerX < 7) {
        playerX = 7;
    }

    movePlayer();
}


/* =========================
   MOVE RIGHT
========================= */

function moveRight() {

    if (!gameRunning) return;

    playerX += 7;

    if (playerX > 93) {
        playerX = 93;
    }

    movePlayer();
}


/* =========================
   KEYBOARD
========================= */

document.addEventListener("keydown", event => {

    if (!gameRunning) return;

    if (
        event.key === "ArrowLeft" ||
        event.key.toLowerCase() === "a"
    ) {

        moveLeft();

    }

    if (
        event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d"
    ) {

        moveRight();

    }

});


/* =========================
   MOBILE BUTTONS
========================= */

leftButton.addEventListener(
    "pointerdown",
    event => {

        event.preventDefault();

        moveLeft();

    }
);


rightButton.addEventListener(
    "pointerdown",
    event => {

        event.preventDefault();

        moveRight();

    }
);


/* =========================
   TOUCH / DRAG CONTROL
========================= */

let dragging = false;


/* Start dragging */

gameArea.addEventListener(
    "pointerdown",
    event => {

        if (!gameRunning) return;

        dragging = true;

        movePlayerToPointer(event);

    }
);


/* Move */

gameArea.addEventListener(
    "pointermove",
    event => {

        if (!dragging) return;

        movePlayerToPointer(event);

    }
);


/* Stop */

gameArea.addEventListener(
    "pointerup",
    () => {

        dragging = false;

    }
);

gameArea.addEventListener(
    "pointercancel",
    () => {

        dragging = false;

    }
);

gameArea.addEventListener(
    "pointerleave",
    () => {

        dragging = false;

    }
);


/* Move player to finger */

function movePlayerToPointer(event) {

    const rect =
        gameArea.getBoundingClientRect();

    let x =
        event.clientX - rect.left;

    x =
        (x / rect.width) * 100;

    if (x < 7) {
        x = 7;
    }

    if (x > 93) {
        x = 93;
    }

    playerX = x;

    movePlayer();
}


/* =========================
   FINISH GAME
========================= */

function finishGame() {

    gameRunning = false;

    clearInterval(spawnInterval);

    cancelAnimationFrame(animationFrame);

    clearGameArea();

    setTimeout(() => {

        showScreen(win);

        createConfetti();

    }, 350);
}


/* =========================
   CONFETTI
========================= */

function createConfetti() {

    confettiContainer.innerHTML = "";

    const pieces = 100;

    for (let i = 0; i < pieces; i++) {

        const confetti =
            document.createElement("div");

        confetti.className = "confetti";

        confetti.style.left =
            `${Math.random() * 100}%`;

        confetti.style.animationDuration =
            `${2 + Math.random() * 3}s`;

        confetti.style.animationDelay =
            `${Math.random() * 1.5}s`;

        const shapes = [
            "●",
            "■",
            "◆",
            "★"
        ];

        confetti.textContent =
            shapes[
                Math.floor(
                    Math.random() * shapes.length
                )
            ];

        confetti.style.fontSize =
            `${8 + Math.random() * 10}px`;

        confettiContainer.appendChild(confetti);
    }
}


/* =========================
   BUTTONS
========================= */

startButton.addEventListener(
    "click",
    startGame
);


againButton.addEventListener(
    "click",
    startGame
);

