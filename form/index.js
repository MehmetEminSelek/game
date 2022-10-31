var form = [];

function next(){
    location.href = "http://127.0.0.1:5502/index.html"
}

function game(){
    counter();
}

document.querySelector("#submitButton").addEventListener("click", function(){
    saveForm(form);
    console.log(form);
    next();
});

function saveForm(form){
    let A1 = document.getElementById("A1").value
    let A2 = document.getElementById("A2").value
    let A3 = document.getElementById("A3").value
    let A4 = document.getElementById("A4").value

    form = {
        "Answer1": A1,
        "Answer2": A2,
        "Answer3": A3,
        "Answer4": A4
    }
    return form;  
}