var form = [];

var snakeURL = "https://wafer-game.com/snake/index.html"
var cardURL = "https://wafer-game.com/card/index.html"
var endURL = "https://wafer-game.com/index.html"
var lastSurveyUrl = "https://wafer-game.com/form/lastSurvey.html";

if (document.referrer == "https://wafer-experiment.com/") {
    document.getElementById("selectGame").style.display = "none";
}

if (document.referrer == "https://wafer-game.com/card/index.html") {
    document.getElementById("selectGame").style.display = "none";
}

function toCard() {
    location.href = cardURL;
    
}


function toSnake() {
    location.href = snakeURL;
    
}

function toEnd() {
    location.href = endURL;
    
}

function toLastSurvey() {
    location.href = lastSurveyUrl;
    
}






document.querySelector("#submitButton").addEventListener("click", function () {

    if (document.getElementById('card').checked == true) {
        toLastSurvey();
    } else if (document.getElementById('snake').checked == true) {
        toCard();
    }
    else {
        toSnake();
    }
});
