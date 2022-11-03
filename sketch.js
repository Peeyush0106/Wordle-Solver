var currentRow = 1;
var currentNo = 1;
var appropriateWords = data["solutions"];
// var guesses = ["value", "state", "state", "state", "skate"]
var currentGuess = 0;
createTable();
currentRow--;
typeWord(data.solutions[Math.floor(Math.random() * data.solutions.length + 1)], 1);
// typeWord(guesses[currentGuess], 1);
const ansWord = getCurrentWordSol();
var end = false;
var responses = {
    rows: {
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
        6: ""
    }
};

var conclusions, unconfirmedLetters, removes;

window.onload = function () {
    if (document.body.getElementsByTagName("canvas")[0]) {
        document.body.getElementsByTagName("canvas")[0].style.width = window.innerWidth + 1000;
        document.body.getElementsByTagName("canvas")[0].style.height = window.innerHeight;
    }
};

window.onresize = function () {
    if (document.body.getElementsByTagName("canvas")[0]) {
        document.body.getElementsByTagName("canvas")[0].style.width = window.innerWidth + 1000;
        document.body.getElementsByTagName("canvas")[0].style.height = window.innerHeight;
    }
}

setInterval(function () {
    if (!end && document.getElementById("word-box-" + currentNo)) {
        document.getElementById("word-box-" + currentNo).focus();
    }
}, 10);

function getCurrentWordSol() {
    return (
        // "skate"
        data.solutions[Math.floor(Math.random() * data.solutions.length + 1)]
    );
}

async function typeWord(word, startNo) {
    conclusions = ["", "", "", "", ""];
    unconfirmedLetters = [];
    removes = [];
    currentRow++;
    var waitingTime = 30;
    for (var i = 0; i < 5; i++) {
        await new Promise(r => setTimeout(r, waitingTime));
        document.getElementById("word-box-" + (startNo + i)).innerText = word.slice(i, (i + 1));
    }
    await new Promise(r => setTimeout(r, 100))
    submitWord(word, 1);
}

async function guessWord(word, no) {
    responses.rows[no] = word;

    appropriateWords.splice(appropriateWords.indexOf(word), 1);

    for (var i = 0; i < conclusions.length; i++) {
        var conclusion = conclusions[i].toUpperCase();
        if (conclusion != "") {
            for (var j = 0; j < appropriateWords.length; j++) {
                var appropriateWord = appropriateWords[j].toUpperCase();
                var state = appropriateWord.slice(i - 1, i) === conclusion;

                if (!state) {
                    appropriateWords.splice(j, 1);
                    j--;
                }
            }
        }
    }

    for (var i = 0; i < removes.length; i++) {
        for (var j = 0; j < appropriateWords.length; j++) {
            var remove = removes[i].toUpperCase();
            var appropriateWord = appropriateWords[j].toUpperCase();

            if (appropriateWord.split('').some(function (w) { return w === remove })) {
                appropriateWords.splice(j, 1);
                j--;
            }
        }
    }

    for (var i = 0; i < unconfirmedLetters.length; i++) {
        var unConfletter = unconfirmedLetters[i].letter.toUpperCase();
        for (var j = 0; j < appropriateWords.length; j++) {
            var appropriateWord = appropriateWords[j].toUpperCase();

            var state = !appropriateWord.includes(unConfletter);

            if (state) {
                appropriateWords.splice(j, 1);
                j--;
            }
        }
    }

    for (var i = 0; i < unconfirmedLetters.length; i++) {
        var unConfLetter = unconfirmedLetters[i]["letter"].toUpperCase();
        var unConfNo = unconfirmedLetters[i]["no"];
        for (var j = 0; j < appropriateWords.length; j++) {
            var appropriateWord = appropriateWords[j].toUpperCase();
            var state = appropriateWord.slice(unConfNo - 1, unConfNo) === unConfLetter;

            if (state) {
                appropriateWords.splice(j, 1);
                j--;
            }
        }
    }

    currentNo += 5;

    var nextWord = data.solutions.length > 1 ? data.solutions[Math.floor(Math.random() * data.solutions.length)] : data.solutions[0];
    currentGuess += 1;
    // typeWord(guesses[currentGuess], currentNo);
    typeWord(nextWord, currentNo);
}

function submitWord(word, no) {
    var returnData = checkWordExistance(currentRow);
    if (currentNo !== 30) {
        if (returnData == true) {
            giveWordHints(word, no);
        }
    }
    else {
        endGame();
        alert("The word is: " + ansWord);
    }
};

function createTable() {
    var idNo = 1;
    for (var i = 0; i < 6; i++) {
        var tr = document.createElement("tr");
        document.getElementById("inpt-table-head").appendChild(tr);
        for (var j = 0; j < 5; j++) {
            var th = document.createElement("th");
            var input = document.createElement("textarea");
            input.id = "word-box-" + idNo;
            input.number = idNo;
            input.disabled = true;
            input.cols = 2;
            input.rows = 1;
            input.className = "word-box"
            input.maxLength = 1;
            input.style.resize = "none";
            input.onkeypress = function (e) {
                e.preventDefault();
                var nextBtnNo = 1 + this.number;
                if (e.code.slice(0, 3) == "Key") {
                    document.getElementById("word-box-" + currentNo).value = e.key;
                    if (nextBtnNo <= 30) {
                        if (nextBtnNo !== 1 + (5 * currentRow)) {
                            currentNo++;
                        }
                    }
                }
            }
            th.appendChild(input);
            tr.appendChild(th);
            idNo++;
        }
    }
}

function checkWordExistance(row) {
    var startBoxNo = (5 * row) - 4;
    var word = "";
    var cancel = false;
    if (row === 0) {
        cancel = true;
        return "less-data";
    }
    for (var i = startBoxNo; i < startBoxNo + 5; i++) {
        if (document.getElementById("word-box-" + i).value == "") {
            cancel = true;
            return "less-data";
        }
        else {
            word += document.getElementById("word-box-" + i).value.toLowerCase();
        }
    }
    if (!cancel) {
        var wordExists = false;
        for (var i = 0; i < data.herrings.length; i++) {
            if (word.toUpperCase() === data.herrings[i].toUpperCase()) {
                wordExists = true;
                break;
            }
        }
        for (var i = 0; i < data.solutions.length; i++) {
            if (word.toUpperCase() === data.solutions[i].toUpperCase()) {
                wordExists = true;
                break;
            }
        }
        return wordExists;
    }
}

async function giveWordHints(word, no) {
    var startBoxNo = (5 * currentRow) - 4;
    var noOfCorrectLetters = 0;
    var guess = "";
    for (var i = startBoxNo; i < startBoxNo + 5; i++) {
        guess += document.getElementById("word-box-" + i).value.toLowerCase();
    }
    var ansWordChars = ansWord.split("");
    var guessChars = guess.split("");
    for (let i = 0; i < guessChars.length; i++) {
        let guessLetter = guessChars[i];
        let solutionLetter = ansWordChars[i];
        if (guessLetter === solutionLetter) {
            document.getElementById("word-box-" + (startBoxNo + i)).style.backgroundColor = "green";
            document.getElementById("word-box-" + (startBoxNo + i)).style.color = "white";

            conclusions[i + 1] = guessLetter;

            noOfCorrectLetters++;

            ansWordChars[i] = "";
            guessChars[i] = "";
        }
    }
    
    for (let i = 0; i < guessChars.length; i++) {
        let guessLetter = guessChars[i];
        if (guessLetter === "") {
            continue;
        }

        for (let j = 0; j < ansWordChars.length; j++) {
            let solutionLetter = ansWordChars[j];
            if (solutionLetter === "") {
                continue;
            }

            if (solutionLetter === guessLetter) {
                document.getElementById("word-box-" + (startBoxNo + i)).style.backgroundColor = "yellow";
                document.getElementById("word-box-" + (startBoxNo + i)).style.color = "black";

                unconfirmedLetters.push({
                    no: (startBoxNo + i) - (currentRow - 1) * 5,
                    letter: guessLetter
                });
                ansWordChars[j] = "";
                guessChars[i] = "";
            }
        }
    }

    for (let i = 0; i < guessChars.length; i++) {
        let guessLetter = guessChars[i];

        if (guessLetter === "") {
            continue;
        }
        document.getElementById("word-box-" + (startBoxNo + i)).style.backgroundColor = "gray";
        document.getElementById("word-box-" + (startBoxNo + i)).style.color = "white";

        for (let j = 0; j < conclusions.length; j++) {
            var confirmedLetter = conclusions[j];
            if (confirmedLetter === "") {
                continue;
            }
            if (guessLetter === confirmedLetter) {
                guessLetter = "";
            }
        }

        if (guessLetter === "") {
            continue;
        }

        for (let j = 0; j < unconfirmedLetters.length; j++) {
            var unConfirmedLetter = unconfirmedLetters[j].letter;
            if (unConfirmedLetter === "") {
                continue;
            }
            if (guessLetter === unConfirmedLetter) {
                guessLetter = "";
            }
        }

        if (guessLetter === "") {
            continue;
        }

        removes.push(guessLetter);

    }
    setTimeout(function () {
        if (noOfCorrectLetters === 5) {
            startConfetti();
            setTimeout(function () {
                stopConfetti();
            }, 3000);
            endGame();
        }
        else {
            guessWord(word, no);
        }
    }, 3000);
}
function endGame() {
    end = true;
    var idNo = 1;
    for (var i = 0; i < 6; i++) {
        var tr = document.createElement("tr");
        document.getElementById("inpt-table-head").appendChild(tr);
        for (var j = 0; j < 5; j++) {
            document.getElementById("word-box-" + idNo).style.display = "none";
            var th = document.createElement("th");
            var input = document.createElement("textarea");
            input.id = "word-box-dis-" + idNo;
            input.number = idNo;
            input.disabled = true;
            input.cols = 2;
            input.rows = 1;
            input.value = document.getElementById("word-box-" + idNo).value
            input.style.backgroundColor = document.getElementById("word-box-" + idNo).style.backgroundColor;
            input.style.color = document.getElementById("word-box-" + idNo).style.color;
            input.className = "word-box"
            input.maxLength = 1;
            input.style.resize = "none";
            th.appendChild(input);
            tr.appendChild(th);
            idNo++;
        }
    }
}

function sleep(milliseconds) {
    let timeStart = new Date().getTime();
    while (true) {
        let elapsedTime = new Date().getTime() - timeStart;
        if (elapsedTime > milliseconds) {
            break;
        }
    }
}