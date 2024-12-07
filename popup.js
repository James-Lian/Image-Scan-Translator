var selectionBox
var detectLang
var translateLang

var imageInputBox
var imageDisplay
var imageDisplayBox

var leftTextBox
var rightTextBox

window.addEventListener('load', () => {
    selectionBox = document.getElementById("selection");
    detectLang = document.getElementById('detected-lang');
    translateLang = document.getElementById('translated-lang');
    language_button(translateLang);
    
    imageInputBox = document.getElementById("imageInput");
    imageDisplay = document.getElementById('display');
    imageDisplayBox = document.getElementById('display-box');

    leftTextBox = document.getElementById("left");
    rightTextBox = document.getElementById("right");
})

var showTranslation = false;

function language_button(elem) {
    const x = (elem.getBoundingClientRect().left + elem.getBoundingClientRect().right) / 2;
    const y = (elem.getBoundingClientRect().top + elem.getBoundingClientRect().bottom) / 2;
    
    if (elem == detectLang) {
        elem.style.color = "white";
        translateLang.style.color = "black";
        showTranslation = false;
    } else {
        elem.style.color = "white";
        detectLang.style.color = "black";
        showTranslation = true;
    }
    
    selectionBox.innerHTML = elem.innerHTML
    selectionBox.style.left = x + 'px';
    selectionBox.style.top = y + 'px';
}

async function openFileDialogue() {
    return new Promise((resolve) => {
        imageInputBox.addEventListener('change', function handler(event) {
            resolve(event.target.files[0]);
            imageInputBox.removeEventListener('change',handler);
        });
        imageInputBox.click()
    })
}

function detectTextLanguage(text) {
    chrome.i18n.detectLanguage(text, (result) => {
        if (chrome.runtime.lastError) {
            console.error('Error detecting language:', chrome.runtime.lastError);
            return;
        }

        console.log('Detected language(s):', result);
        result.languages.forEach((lang) => {
            console.log(`Language: ${lang.language}, Confidence: ${lang.percentage}%`);
        });
    });
}


async function promptUserUpload() {
    let selectedFile = await openFileDialogue();
    if (selectedFile) {
        let objectURL = URL.createObjectURL(selectedFile);
        imageDisplay.src = objectURL;
        imageDisplayBox.style.display = "inline-block"

        console.log('happened1')
        const worker = await Tesseract.createWorker('eng');

        console.log('happened2')

        const { data: { text } } = await worker.recognize(imageDisplay);
        console.log(text);

        detectTextLanguage(text)
    }
}

function clearImages() {
    imageDisplay.src = ""
    imageDisplayBox.style.display = "none"

    leftTextBox.innerHTML = "---"
    rightTextBox.innerHTML = "---"
}