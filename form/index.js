var form = [];

var snakeURL = "http://161.35.209.66/snake/index.html"
var cardURL = "http://161.35.209.66/card/index.html"
var endURL = "http://161.35.209.66/index.html"

if (document.referrer == "http://164.92.186.163/") {
    document.getElementById("selectGame").style.display = "none";
}

if (document.referrer == "http://161.35.209.66/card/index.html") {
    document.getElementById("selectGame").style.display = "none";
}

function toCard() {
    location.href = cardURL;
    form = saveForm(form);
}


function toSnake() {
    location.href = snakeURL;
    form = saveForm(form);
}

function toEnd() {
    location.href = endURL;
    form = saveForm(form);
}

var gameName = document.getElementById("gameName").value;



document.querySelector("#submitButton").addEventListener("click", function () {
    // if (document.getElementById("gameName").value == "Snake") {
    //     toSnake();
    // }
    // else if (document.getElementById("gameName").value == "Card") {
    //     toCard();
    // }
    // else if(document.getElementById("gameName").value == "End") {
    //     toEnd();
    // }
    // else {
    //     toSnake();
    // }

    if (document.getElementById('card').checked == true) {    
        toEnd();
    } else if (document.getElementById('snake').checked == true) {
        toCard();
    }
    else {
        toSnake();
    }
});

function saveForm(form) {
    let A1 = document.getElementById("A1").value
    let A2 = document.getElementById("A2").value
    let A3 = document.getElementById("A3").value

    form = {
        "Answer1": A1,
        "Answer2": A2,
        "Answer3": A3
    }
    return form;
}