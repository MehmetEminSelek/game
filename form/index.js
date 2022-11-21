var form = [];
var surveyName = "";
const httpMethodPost = 'POST';
const postHeaders = {
    'Accept': '*/*',
    'Content-Type': 'application/json'
};
const base_url = "https://wafer-backend.com:443";
//const base_url = "http://localhost:443";
var snakeURL = "http://127.0.0.1:5502/snake/index.html"
var cardURL = "http://127.0.0.1:5502/card/index.html"
var endURL = "http://127.0.0.1:5502/index.html"
var lastSurveyUrl = "http://127.0.0.1:5502/form/lastSurvey.html";
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
    location.href = endURL;
    
}

function toLastSurvey() {
    location.href = lastSurveyUrl;
    
}



function download () {
    var questionNames = [];
    var answers = [];
    var formData = {};
    var subjectID = document.getElementById("textBox").value;
    
     for (let i = 1; i < 15; i++) {
        console.log(i);

        var groupName = "input[name=group" + i + "]:checked";
        var questionField = document.getElementById("group" + i + "");
        var questionName = questionField.getElementsByTagName("a");
        var questionObjectName = questionName[0].innerHTML;
        var questionAnswer = document.querySelector(groupName).value;
  
        questionNames.push(questionObjectName.toLowerCase());
        answers.push(questionAnswer);
        
    }
    formData = { "code" : subjectID};
    for (let index = 0; index < questionNames.length; index++) {
       
        formData[questionNames[index]] = answers[index];
    }
    var CsvString = "";
    answers.forEach(function (rowArray) {
        
        CsvString += rowArray +";" +  "\r\n";
        
    });
    
    CsvString = "data:application/csv;charset=utf-8," + encodeURIComponent(CsvString);
    var x = document.createElement("A");
    x.setAttribute("href", CsvString );
    x.setAttribute("download",subjectID+ "lastSurvey.csv");
    document.body.appendChild(x);
    x.click();
    
       
}

async function sendToServer() {
    var questionNames = [];
    var answers = [];
    var formData = {};
    var subjectID = document.getElementById("textBox").value;
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
        var questionAnswer = document.querySelector(groupName).value;
  
        questionNames.push(questionObjectName.toLowerCase());
        answers.push(questionAnswer);
        
    }
    if (surveyName == ""){
        surveyName = "firstSurvey";
    }
    formData = { "code" : subjectID,
                "testNo" : surveyName
                    };
    for (let index = 0; index < questionNames.length; index++) {
       
        formData[questionNames[index]] = answers[index];
    }
       
    
    if (formData.length != 0) {
        document.getElementById('board').style.display = "none";
        document.getElementById('loading').style.display = "inline-block";     
        await fetch(base_url + '/survey/save', {
            method: httpMethodPost,
            headers: postHeaders,
            body: JSON.stringify(formData)
        }).catch(err => console.log(err))
            .finally(() => {
                document.getElementById('loading').style.display = "none";
            });
    }
}




document.querySelector("#submitButton").addEventListener("click", function () {
    sendToServer();

    if (document.getElementById('card').checked == true) {
        toLastSurvey();
    } else if (document.getElementById('snake').checked == true) {
        toCard();
    }
    else {
        toSnake();
    }
});
