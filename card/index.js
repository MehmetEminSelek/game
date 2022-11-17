const cards = document.querySelectorAll(".card"),
    timeTag = document.querySelector(".time b"),
    flipsTag = document.querySelector(".flips b"),
    refreshBtn = document.querySelector(".details button");

let maxTime = 5;
let timeLeft = maxTime;
let flips = 0;
let matchedCard = 0;
let disableDeck = false;
let isPlaying = false;
let cardOne, cardTwo, timer;
let lifeCount = 3;
var subjectName;
var experimentNo = 1;

const base_url = "https://wafer-backend.com:443";
//const base_url = "http://192.168.1.107:8000";



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


connect();

document.getElementById("refresh").style.display = "none";

function initTimer() {
    if (timeLeft <= 0) {
        document.getElementById("refresh").style.display = "block";
        sendValues("engine", "stop");
        return clearInterval(timer);
    }
    timeLeft--;
    timeTag.innerText = timeLeft;
}

function flipCard({ target: clickedCard }) {
    if (!isPlaying) {
        isPlaying = true;
        sendValues("engine", "start");
        timer = setInterval(initTimer, 1000);
    }
    if (clickedCard !== cardOne && !disableDeck && timeLeft > 0) {
        flips++;
        sendValues("data", "flips");
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

function matchCards(img1, img2) {
    if (img1 === img2) {
        matchedCard++;
        sendValues("data", "success");
        if (matchedCard == 6 && timeLeft > 0) {
            sendValues("engine", "stop");
            experimentNo++;
            return clearInterval(timer);
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        return disableDeck = false;
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



function shuffleCard() {
    sendValues("engine", "start");
    document.getElementById("refresh").style.display = "none";
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


refreshBtn.addEventListener("click", function () {
    lifeCount--;
    console.log(lifeCount);
    // if (lifeCount == 1) {
    //     document.getElementById("refresh").innerHTML = "Next";
    // }
    if (lifeCount == 0) {
        refreshBtn.textContent = "Next";
        refreshBtn.addEventListener("click", function () {
            sendValues("engine", "save");
            location.href = "https://wafer-game.com/form/index.html"
        });
    }
    else if (lifeCount != 0) {
        shuffleCard();
    }

});

cards.forEach(card => {
    card.addEventListener("click", flipCard);
});

var timeoutHandle;
function countdown(minutes, seconds) {
    function tick() {
        var counter = document.getElementById("timer");
        counter.innerHTML =
            minutes.toString() + ":" + (seconds < 10 ? "0" : "") + String(seconds);
        seconds--;
        if (seconds >= 0) {
            timeoutHandle = setTimeout(tick, 1000);
        } else {
            if (minutes >= 1) {

                setTimeout(function () {
                    countdown(minutes - 1, 59);
                }, 1000);
            }
        }
        if (minutes == 0 && seconds == 0) {
            firstClick = false;
            finish = Date.now();
            bestScore = Math.floor(Math.abs(finish - start) / 1000)
            scoreText.textContent = bestScore + ' seconds';
            wrapper.style.display = "none";
            gameboardContainer.style.display = "inline";
            startContainer.style.display = "none";
            resetContainer.style.display = "grid";
            gridHeader.innerHTML = "ScoreBoard";
        }
    }
    tick();
}
