const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const numOfRuns = document.getElementById("numOfRuns");
const runTraining = document.getElementById("runTraining");
const outcomeOfTrains = document.getElementById("outcomeOfTrains");
const humanInput = document.getElementById("humanInput");
const robotOutput = document.getElementById("robotOutput");
const submitQuestion = document.getElementById("submitQuestion");
let layers = 4;
let nodesPerLayer = [10, 15, 15, 367]
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
    let testSentence = textToNumbers(trainingSentences[count].sentence);
    let testTargets = Array(wordObjects.length, 0);
    testTargets[textToNumbers(trainingSentences[count].correctWord)] = 1;
    let sums = [];
    let listBeforeOutcome = [];
    let layerInp = [...testSentence];
    let preActivatedSums = [];
    oldWeights = structuredClone(weights);
    oldBiases = structuredClone(biases);
    weights = [];
    biases = [];
    for (let init = 0; init < layers; init++) {
        weights.push([]);
        biases.push([]);
        preActivatedSums([]);
        for (let init2 = 0; init2 < nodesPerLayer[init]; init2++) {
            weights[init].push([]);
            biases[init].push([]);
            preActivatedSums[init].push([]);
        }
    }
    for (let layer = 1; layer < layers; layer++) {
        let totalSums = [];
        for (let node = 0; node < nodesPerLayer[layer]; node++) {
            let totalSum = 0;
            for (let prevLayerOne = 0; prevLayerOne < layerInp.length; prevLayerOne++) {
                if (count === 0) {
                    let w = Math.random();
                    weights[layer][node].push(w);
                    totalSum += w * layerInp[prevLayerOne];
                } else {
                    let w = oldWeights[layer][node][prevLayerOne];
                    weights[layer][node].push(w);
                    totalSum += w * layerInp[prevLayerOne];
                }
            }        
            if (count === 0) {
                let b = Math.random();
                biases[layer][node] = b;
                totalSum += b;
                let outputForRelu = relu(totalSum)
                totalSums.push(outputForRelu)
            } else {
                let b = oldBiases[layer][node];
                biases[layer][node] = b;
                totalSum += b;
                let outputForRelu = relu(totalSum)
                totalSums.push(outputForRelu)
            }
            preActivatedSums[layer][node] = totalSum;
        }
        layerInp = [];
        layerInp.push(...totalSums)
    };
    calcNewWgtsNBias(weights, biases, testSentence, testTargets, layerInp, preActivatedSums);
}

const randomWeights = Array.from({ length: getWordObjects().length }, () => Math.random());
const randomBiases = Array.from({ length: getWordObjects().length }, () => Math.random());
weights = [...randomWeights];
biases = [...randomBiases];

function relu(x) {
    return Math.max(0, x)
}

function calcNewWgtsNBias(weightList, biasList, sentence, targets, listBeforeOutcome, preActivatedSums) {
    let highestOutcome = 0;
    let highestIndex = 0;
    let errors = [];
    for (let i = 0; i < listBeforeOutcome.length; i++) {
        if (listBeforeOutcome[i] > highestOutcome) {
            highestOutcome = listBeforeOutcome[i];
            highestIndex = i;
        }
        let error = targets[i] - listBeforeOutcome[i];
        errors.push(error);
    }

}

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

getTrainingSentences()

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