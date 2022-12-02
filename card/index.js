const cards = document.querySelectorAll(".card"),
    timeTag = document.querySelector(".time b"),
    flipsTag = document.querySelector(".flips b"),
    refreshBtn = document.getElementById("refresh");
const nextBtn = document.getElementById("next");
const gameContainer = document.getElementById("gameContainer");
const wrapper = document.getElementById("wrapper");
const dot = document.getElementById("dot");
const cardBoard = document.getElementById("cards");
const shownCards = cardBoard.querySelectorAll("li");
var moment = false;



let maxTime = 35;
let timeLeft = maxTime;
let flips = 0;
let matchedCard = 0;
let disableDeck = false;
let isPlaying = false;
let cardOne, cardTwo, timer;
let lifeCount = 3;
var subjectName;
var experimentNo = 21;

const base_url = "https://wafer-backend.com:443";
//const base_url = "http://127.0.0.1:443";

connect();
waiting();
refreshBtn.style.display = "none";

function connect() {
    var socket = new SockJS(base_url + '/engine');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        stompClient.subscribe('/engine-listen', function (message) {
        });
    });
}

function sendValues(sender, code) {
    stompClient.send("/engine", {}, JSON.stringify({ 'sender': sender, "message": code, "testSubjectName": subjectName, "experimentNo": experimentNo }));
}

function toggleBackgroundColor(moment) {
    switch (moment) {
        case true:
            dot.style.backgroundColor = "#fff"
            break;
        case false:
            dot.style.backgroundColor = "#292929";
            break;
    }
}

async function waiting() {
    wrapper.style.display = "none";
    gameContainer.style.display = "none";
    await new Promise(r =>
        //TODO change to 120000
        setTimeout(r, 120000));
    gameContainer.style.display = "inline-block";
}

function initTimer() {
    moment = false;

    if (timeLeft <= 0) {
        toggleBackgroundColor(moment);
        shownCards.forEach(card => {
            card.style.display = "none";
        });
        lifeCount--;
        sendValues("engine", "stop");
        checkLife();
        document.getElementById("hit").style.display = "block";
        document.getElementById("hit").innerHTML = "HIT THE RIPROVE TO RESTART";
        experimentNo++;
        return clearInterval(timer);
    }
    timeLeft--;
    timeTag.innerText = timeLeft;
}

async function flipCard({ target: clickedCard }) {
    moment = true;
    document.getElementById("hit").style.display = "none";
    toggleBackgroundColor(moment);
    if (!isPlaying) {
        isPlaying = true;
        await sendValues("engine", "start");
        timer = setInterval(initTimer, 1000);
    }
    if (clickedCard !== cardOne && !disableDeck && timeLeft > 0) {
        flips++;
        flipsTag.innerText = flips;
        clickedCard.classList.add("flip");
        if (!cardOne) {
            return cardOne = clickedCard;
        }
        cardTwo = clickedCard;
        disableDeck = true;
        let cardOneImg = cardOne.querySelector(".back-view img").src,
            cardTwoImg = cardTwo.querySelector(".back-view img").src;
        matchCards(cardOneImg, cardTwoImg);
    }
}

async function matchCards(img1, img2) {
    if (img1 === img2) {
        matchedCard++;
        await sendValues("data", "success + " + matchedCard + "");
        if (matchedCard == 6 && timeLeft > 0) {
            moment = false;
            await sendValues("data", "finished + " + (maxTime - timeLeft) + "SEC");
            shownCards.forEach(card => {
                card.style.display = "none";
            });
            lifeCount--;
            sendValues("engine", "stop");
            await checkLife();
            toggleBackgroundColor(moment);
            document.getElementById("refresh").style.display = "block";
            experimentNo++;
            return clearInterval(timer);
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        return disableDeck = false;
    }
    else if (img1 !== img2) {
        await sendValues("data", "failed + " + flips / 2 + "");
    }

    setTimeout(() => {
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
    }, 400);

    setTimeout(() => {
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        cardOne = cardTwo = "";
        disableDeck = false;
    }, 1200);
}

function startGame() {
    counter(3);
    subjectName = textBox.value;
}

function shuffleCard() {
    refreshBtn.style.display = "none";
    timeLeft = maxTime;
    flips = matchedCard = 0;
    cardOne = cardTwo = "";
    clearInterval(timer);
    timeTag.innerText = timeLeft;
    flipsTag.innerText = flips;
    disableDeck = isPlaying = false;

    let arr = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6];
    arr.sort(() => Math.random() > 0.5 ? 1 : -1);

    cards.forEach((card, index) => {
        card.classList.remove("flip");
        let imgTag = card.querySelector(".back-view img");
        setTimeout(() => {
            imgTag.src = `/card/images/img-${arr[index]}.png`;
        }, 500);
        card.addEventListener("click", flipCard);
    });

}
nextBtn.addEventListener("click", function () {
    sendValues("engine", "save");
    location.href = "https://wafer-game.com/form/index.html"
});

async function checkLife() {
    refreshBtn.style.display = "none";
    if (lifeCount == 0) {
        refreshBtn.style.display = "none";
        await new Promise(r =>
            setTimeout(r, 2000));
        document.getElementById("next").style.display = "block";
    }
    else {
        refreshBtn.style.display = "none";
        await new Promise(r =>
            setTimeout(r, 2000));
        refreshBtn.style.display = "inline-block";
    }
}

refreshBtn.addEventListener("click", function () {
    shownCards.forEach(card => {
        card.style.display = "inline-block";
    });
    document.getElementById("hit").style.display = "none";
    if (lifeCount == 0) {
        refreshBtn.style.display = "none";
        document.getElementById("next").style.display = "block";
    }
    else if (lifeCount != 0) {
        shuffleCard();
    }
});

cards.forEach(card => {
    card.addEventListener("click", flipCard);
});

function counter(value) {
    gameContainer.style.display = "none";
    wrapper.style.display = "none";
    const counter = document.getElementById('counter');
    counter.style.display = "block";

    const intervalID = setInterval(() => {
        const nextValue = --value;

        if (nextValue === 0) {

            wrapper.style.display = "block";
            shuffleCard();
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
