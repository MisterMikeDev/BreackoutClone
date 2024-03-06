/**
 * Juego Breakout en JavaScript
 */

const canvas = document.querySelector("canvas");
const score = document.querySelector("#score");
const ctx = canvas.getContext("2d");

canvas.width = 448;
canvas.height = 400;

// Variables del juego
let counter = 0;

// Pelota
const ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    radius: 10,
    dx: 3,
    dy: -3,
    color: "white"
};

// Paddle
const paddleWidth = 100;
const paddleHeight = 10;
let paddleX = (canvas.width - paddleWidth) / 2;

// Bricks
let brickCount = 7;
const brickWidth = 50;
const brickHeight = 25;

// Keys
let rightPressed = false;
let leftPressed = false;

// Funciones

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

let bricks = [];

for (let i = 0; i < brickCount; i++) {
    bricks[i] = [];
    for (let j = 0; j < brickCount; j++) {
        let brickX = i * (brickWidth + 10) + 20;
        let brickY = j * (brickHeight + 10) + 20;
        bricks[i][j] = { x: brickX, y: brickY };
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = j % 2 === 0 ? "purple" : "violet";
        ctx.fill();
        ctx.closePath();
    }
}

function drawBricks() {
    for (let i = 0; i < brickCount; i++) {
        for (let j = 0; j < brickCount; j++) {
            if (bricks[i][j].x > 0) {
                ctx.beginPath();
                ctx.rect(
                    bricks[i][j].x,
                    bricks[i][j].y,
                    brickWidth,
                    brickHeight
                );
                ctx.fillStyle = j % 2 === 0 ? "purple" : "violet";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "Red";
    ctx.fill();
    ctx.closePath();
}

// Colisiones y movimiento

function ballMovement() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Colisiones con las paredes
    if (
        ball.x + ball.dx > canvas.width - ball.radius ||
        ball.x + ball.dx < ball.radius
    ) {
        ball.dx = -ball.dx;
    }

    if (ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > canvas.height - ball.radius * 1.8) {
        if (ball.x > paddleX && ball.x < paddleX + paddleWidth) {
            ball.dy = -ball.dy;
        } else {
            setTimeout(() => {
                document.location.reload();
            }, 1000);
        }
    }
}

function paddleMovement() {
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
}

function initEvents() {
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);

    function keyDownHandler(event) {
        if (event.key === "ArrowRight") {
            rightPressed = true;
        } else if (event.key === "ArrowLeft") {
            leftPressed = true;
        }
    }

    function keyUpHandler(event) {
        if (event.key === "ArrowRight") {
            rightPressed = false;
        } else if (event.key === "ArrowLeft") {
            leftPressed = false;
        }
    }
}

function collisionDetection() {
    // check if the ball hits a brick
    for (let i = 0; i < brickCount; i++) {
        for (let j = 0; j < brickCount; j++) {
            let brick = bricks[i][j];
            if (
                ball.x > brick.x + 15 &&
                ball.x < brick.x + brickWidth * 1.35 &&
                ball.y > brick.y + 15 &&
                ball.y < brick.y + brickHeight * 1.35
            ) {
                ball.dy = -ball.dy;

                // remove the brick from the bricks array
                bricks[i][j] = { x: 0, y: 0 };

                // remove the brick from the canvas
                ctx.clearRect(brick.x, brick.y, brickWidth, brickHeight);

                counter++;
            }
        }
    }
}

function setScore() {
    score.innerHTML = `Score: ${counter}`;
}

function draw() {
    // Limpiar el canvas
    clearCanvas();

    // Dibujar elementos
    drawBall();
    drawPaddle();
    drawBricks();
    // Colisiones y movimiento
    collisionDetection();
    ballMovement();

    paddleMovement();

    setScore();

    if (counter === brickCount * brickCount) {
        alert("YOU WIN, CONGRATULATIONS!");
        document.location.reload();
    }

    window.requestAnimationFrame(draw);
}

// Iniciar el juego
setScore();
draw();
initEvents();
