var form = [];
var surveyName = "";
const httpMethodPost = 'POST';
const postHeaders = {
    'Accept': '*/*',
    'Content-Type': 'application/json'
};
const base_url = "https://wafer-backend.com:443";
//const base_url = "http://localhost:443";
var snakeURL = "https://wafer-game.com//snake/index.html"
var cardURL = "https://wafer-game.com//card/index.html"
var endURL = "https://wafer-game.com//index.html"
var lastSurveyUrl = "https://wafer-game.com//form/lastSurvey.html";
var surveyUrl = "https://wafer-game.com//form/index.html";
var questionAnswer = "";

if (document.referrer == "https://wafer-experiment.com/") {
    document.getElementById("selectGame").style.display = "none";
}

function toCard() {
    location.href = cardURL;

}

function toSnake() {
    location.href = snakeURL;

}

function toEnd() {
    download();
}

function survey() {
    location.href = surveyUrl;
}

function toLastSurvey() {
    location.href = lastSurveyUrl;

}

async function download() {
    var questionNames = [];
    var answers = [];
    var formData = {};
    if (subjectID == "") {
        swal("Inserisci il numero identificativo!", subjectID, "error");
        return;
    }


    for (let i = 1; i < 16; i++) {

        var groupName = "input[name=group" + i + "]:checked";
        var questionField = document.getElementById("group" + i + "");
        var questionName = questionField.getElementsByTagName("a");
        var questionObjectName = questionName[0].innerHTML;
        try {
            var questionAnswer = document.querySelector(groupName).value;
        } catch (error) {
            swal("Si prega di rispondere a tutte le domande!", questionObjectName, "error");
            throw error
        }
        questionNames.push("q" + i);
        answers.push(questionAnswer);
    }

    formData = { "code": subjectID };

    if (formData.length != 0) {
        document.getElementById('submitButton').style.display = "none";
        document.getElementById('board').style.display = "none";
        document.getElementById('loading').style.display = "inline-block";
        await fetch(base_url + '/survey/qsave', {
            method: httpMethodPost,
            headers: postHeaders,
            body: JSON.stringify(formData)
        }).catch(err => console.log(err))
            .finally(() => {
                document.getElementById('loading').style.display = "none";
                location.href = endURL;
            });
    }
}

async function sendToServer() {
    var questionNames = [];
    var answers = [];
    var formData = {};
    var subjectID = document.getElementById("textBox").value;
    if (subjectID == "") {
        swal("Inserisci il numero identificativo!", subjectID, "error");
        return;
    }
    if (document.getElementById('card').checked == true) {
        surveyName = "card";
    } else if (document.getElementById('snake').checked == true) {
        surveyName = "snake";
    }

    for (let i = 1; i < 21; i++) {

        var groupName = "input[name=group" + i + "]:checked";
        var questionField = document.getElementById("group" + i + "");
        var questionName = questionField.getElementsByTagName("a");
        var questionObjectName = questionName[0].innerHTML;
        try {
            var questionAnswer = document.querySelector(groupName).value;
        } catch (error) {
            swal("Si prega di rispondere a tutte le domande!", questionObjectName, "error");
            return;
        }
        console.log(questionAnswer);


        questionNames.push(questionObjectName.toLowerCase());
        answers.push(questionAnswer);

    }
    if (surveyName == "") {
        surveyName = "firstSurvey";
    }
    formData = {
        "code": subjectID,
        "testNo": surveyName
    };
    for (let index = 0; index < questionNames.length; index++) {

        formData[questionNames[index]] = answers[index];
    }


    if (formData.length != 0) {
        document.getElementById('submitButton').style.display = "none";
        document.getElementById('board').style.display = "none";
        document.getElementById('loading').style.display = "inline-block";
        await fetch(base_url + '/survey/save', {
            method: httpMethodPost,
            headers: postHeaders,
            body: JSON.stringify(formData)
        }).catch(err => console.log(err))
            .finally(() => {
                document.getElementById('loading').style.display = "none";
                if (document.getElementById('card').checked == true) {
                    toLastSurvey();
                } else if (document.getElementById('snake').checked == true) {
                    toCard();
                }
                else {
                    toSnake();
                }

            });
    }
}


document.querySelector("#submitButton").addEventListener("click", function () {
    sendToServer();

});
