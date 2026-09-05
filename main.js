const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const numOfRuns = document.getElementById("numOfRuns");
const runTraining = document.getElementById("runTraining");
const outcomeOfTrains = document.getElementById("outcomeOfTrains");
const humanInput = document.getElementById("humanInput");
const robotOutput = document.getElementById("robotOutput");
const submitQuestion = document.getElementById("submitQuestion");
let weights = [];
let oldWeights = [];
let biases = [];
let oldBiases = [];
let wordObjects = [];
let trainingSentences = [];
let learningRate = .01;


numOfRuns.oninput = function() {
    if (Number(numOfRuns.value) === 0) {
        outcomeOfTrains.innerText = "Train 0 out of 0";
        return
    }
    outcomeOfTrains.innerText = "Train 0 out of " + numOfRuns.value;
}

runTraining.onclick = async function() {
    for (let i = 0; i <= Number(numOfRuns.value); i++) {
        await sleep(50)
        await trainOneEpoch(i)
        outcomeOfTrains.innerText = "Train " + i + " out of " + Number(numOfRuns.value)
    }
    outcomeOfTrains.innerText = "Training Complete " + Number(numOfRuns.value) + "/" + Number(numOfRuns.value);
}

submitQuestion.onclick = function () {
    textToNumbers(humanInput.value)
}

window.textToNumbers = function(input) {
    let inputWords = input.replaceAll(/[?!&/`]/g, "").split(/[.,;\s-]/).filter(Boolean).map(word => word.toLowerCase());
    let ids = inputWords.map(word =>
        wordObjects.find(obj => obj.word === word).id
    );
    console.log(ids)
}

async function trainOneEpoch(count) {
    let sums = [];
    oldWeights = [...weights];
    oldBiases = [...biases];
    
}

const randomWeights = Array.from({ length: getWordObjects().length }, () => Math.random());
const randomBiases = Array.from({ length: getWordObjects().length }, () => Math.random());
weights = [...randomWeights];
biases = [...randomBiases];



function getWordObjects() {
    for (let i = 0; i < phrases.length; i++) {
        let wordListPerPhrase = phrases[i].replaceAll(/[?!&/`]/g, "").split(/[.,;\s-]/);
        for (let x = 0; x < wordListPerPhrase.length; x++) {
            let word = wordListPerPhrase[x].toLowerCase();
            if (!wordObjects.some(obj => obj.word === word) && word != "") wordObjects.push({
                word: word,
                id: wordObjects.length + 1,
            });
        }
    }
    return wordObjects
}

getWordObjects();

function getTrainingSentences() {
    for (let i = 0; i < phrases.length; i++) {
        let wordListPerPhrase = phrases[i].replaceAll(/[?!&/`]/g, "").split(/[.,;\s-]/);
        let wordListSaved = [...wordListPerPhrase];
        let occurencePicked = 0;
        wordListPerPhrase.shift();
        occurencePicked = Math.floor(Math.random() * wordListPerPhrase.length)
        let randomPick = wordListPerPhrase[occurencePicked];
        while (wordListPerPhrase[occurencePicked] == "") {
            occurencePicked = Math.floor(Math.random() * wordListPerPhrase.length)
            randomPick = wordListPerPhrase[occurencePicked];
        }
        wordListPerPhrase[occurencePicked] = "missingWord";
        wordListPerPhrase.unshift(wordListSaved[0])
        let constructedSentence = wordListPerPhrase.join(" ");

        trainingSentences.push({
            sentence: constructedSentence,
            correctWord: randomPick,
        })
    }
}

console.log(getTrainingSentences())

function testFunc() {
    let text = "How was your day today?"
    let wordListPerPhrase = text.replaceAll(/[?!&/`]/g, "").split(/[.,;\s-]/);
    wordListPerPhrase.shift();
    let randomPick = wordListPerPhrase[Math.floor(Math.random() * wordListPerPhrase.length)].toLowerCase();

    trainingSentences.push({
        sentence: text.replace(randomPick, "missingWord"),
        correctWord: randomPick,
    })

    console.log(trainingSentences)
}

testFunc()

//console.log(getWordObjects());

/*
Feed it a bunch of sentences and correct it if not, adjust weights and biases for each word if
they are wrong or not.
*/