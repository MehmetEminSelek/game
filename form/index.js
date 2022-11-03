var form = [];

var snakeURL = "http://127.0.0.1:5502/snake/index.html"
var cardURL = "http://127.0.0.1:5502/card/index.html"

function toCard() {
    location.href = cardURL;
    form = saveForm(form);
}

function toSnake() {
    location.href = snakeURL;
    form = saveForm(form);
}

document.querySelector("#submitButton").addEventListener("click", function () {
    if (gameName() == "Snake") {
        toSnake();
    } else if (gameName() == "Card") {
        toCard();
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