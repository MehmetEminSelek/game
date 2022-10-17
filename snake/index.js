// Counter'ın try againde tekrar çalışması sırasında ki hata
// oyun sayısının tutulup prediction'a start komutuyla beraber gönderilmesi gerekiyor
// isimin tutulup prediction'a start komutuyla beraber gönderilmesi gerekiyor

var pictures = [];
const gameBoard = document.querySelector("#gameBoard");
const centerBoard = document.getElementById("centerBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const gameboardContainer = document.querySelector("#gameboardContainer");
const startContainer = document.querySelector("#startContainer");
const resetContainer = document.querySelector("#resetContainer");
const loading = document.querySelector("#loading");
const resetBtn = document.querySelector("#resetBtn");
const startSnakeBtn = document.querySelector("#startSnakeBtn");
const startCardBtn = document.querySelector("#startCardBtn");
const wrapper = document.querySelector(".wrapper");
const dataBtn = document.querySelector("#dataBtn");
const submitBtn = document.querySelector("#submitBtn");
const textBox = document.querySelector("#textBox").value;
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "#D8D8D8";
const snakeColorHead = "black";
const snakeColorLight = "#0d5415";
const snakeColorDark = "#08300d";
const snakeBorder = "black";
const foodColor = "#ecb428";
const unitSize = 25;
const predictions = [];
const timeArray = [];
let gazerArray = [];
var base_url = "http://localhost:3000";
var local_url = "http://192.168.1.106:3000";
let running = false;
let xVelocity = 15;
let yVelocity = 0;
let foodX;
let foodY;
var eaten = [];
let score = 0;
let xprediction = 0;
let yprediction = 0;
let snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 }
];
var experimentNo = 1;

connect();

function connect() {
    var socket = new SockJS(base_url + '/engine');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        stompClient.subscribe('/engine-listen', function (message) {
        });
    });
}


function sendValues(code) {
    stompClient.send("/engine", {}, JSON.stringify({ 'sender': "engine", "message": code, "testSubjectName": textBox, "experimentNo": experimentNo }));
}

function counter() {
    sendValues("start");
    startContainer.style.display = "none";
    const counter = document.getElementById('counter');
    counter.style.display = "block";
    let value = 2;

    const intervalID = setInterval(() => {
        const nextValue = --value;
        if (nextValue == 0) {
            counter.innerHTML = "GO!";
        }
        if (nextValue === -1) {
            gameStart();
            clearInterval(intervalID);

            return;
        }

        requestAnimationFrame(() => {
            counter.textContent = nextValue;
            counter.classList.remove('big');
            requestAnimationFrame(() => {
                counter.classList.add('big');
            });
        });

    }, 1000)

}


window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", () => {
    counter();
});
startSnakeBtn.addEventListener("click", () => {
    counter();
});

startCardBtn.addEventListener("click", () => {

    gameboardContainer.style.display = "none";
    startContainer.style.display = "none";
    resetContainer.style.display = "none";
    wrapper.style.display = "flex";
});


function drawGame() {
    gameboardContainer.style.display = "none";
    startContainer.style.display = "none";
    resetContainer.style.display = "none";
    gameBoard.style.display = "block";
}

function gameStart() {
    running = true;
    scoreText.textContent = score;
    createFood();
    drawGame();
    drawFood();
    capture();
    nextTick();
};

function nextTick() {
    if (running) {
        setTimeout(() => {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 75);
    }
    else {
        displayGameOver();
    }
};

function clearBoard() {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
};

function createFood() {
    function randomFood(min, max) {
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameWidth - unitSize);
};

function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);


};
function moveSnake() {
    const head = {
        x: snake[0].x + xVelocity,
        y: snake[0].y + yVelocity
    };

    snake.unshift(head);
    //if food is eaten
    if (snake[0].x == foodX && snake[0].y == foodY) {
        score += 1;
        scoreText.textContent = score;
        eaten[0] = 1;
        capture();
        createFood();
    }
    else {
        snake.pop();
    }
};

function drawSnake() {
    var count = 2;
    snake.forEach(snakePart => {
        if (count % 2 == 0) {
            ctx.fillStyle = snakeColorDark;
        }
        else {
            ctx.fillStyle = snakeColorLight;
        }
        if (count == 2) {
            ctx.fillStyle = snakeColorHead;
        }
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        count++;
    })
};

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingRight = (xVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);

    switch (true) {
        case ((keyPressed == 65 || keyPressed == LEFT) && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case ((keyPressed == 87 || keyPressed == UP) && !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case ((keyPressed == 68 || keyPressed == RIGHT) && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case ((keyPressed == 83 || keyPressed == DOWN) && !goingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }
};


function checkGameOver() {
    switch (true) {
        case (snake[0].x < 0):
            running = false;
            break;
        case (snake[0].x >= gameWidth):
            running = false;
            break;
        case (snake[0].y < 0):
            running = false;
            break;
        case (snake[0].y >= gameHeight):
            running = false;
            break;
    }
    for (let i = 1; i < snake.length; i += 1) {
        if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
            running = false;
        }
    }
};

function displayGameOver() {
    sendValues("stop");
    document.getElementById("counter").style.display = "none";
    running = false;
    gameBoard.style.display = "none";
    gameboardContainer.style.display = "inline";
    startContainer.style.display = "none";
    resetContainer.style.display = "grid";
};

function resetGame() {
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        { x: unitSize * 4, y: 0 },
        { x: unitSize * 3, y: 0 },
        { x: unitSize * 2, y: 0 },
        { x: unitSize, y: 0 },
        { x: 0, y: 0 }
    ];
    gameStart();
};

var canvasPromise = html2canvas(document.body, {
    allowTaint: true,
    useCORS: true
});

function capture() {
    setInterval(async function () {
        await canvasPromise.then((canvas) => {
            var base64image = canvas.toDataURL("image/png");
            base64image.crossOrigin = "anonymous"
            pictures.push(base64image);
            eaten[0] = 0;
        });
    }, 1000);
}

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);
        milliseconds = parseInt(timer % 1000, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        console.log(minutes + ":" + seconds + ":" + milliseconds);

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
}