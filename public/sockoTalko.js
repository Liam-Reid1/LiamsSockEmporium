const socko = document.getElementById("sockoImg");
const talkoText = document.getElementById("talkoText");
let talkoFinished = true;


let socksList; 
fetch('/sockName') 
  .then(response => response.json()) 
  .then(data => { 
    if (!data || data.length === 0) return; 
    socksList = data.map(record => record.sock); 
  }) 
  .catch(error => console.error('Fetch error:', error)); 


socko.addEventListener('click', () => {
    if (talkoFinished) {
        playText();
    }
})

function speechSupported() {
    return (
        'speechSynthesis' in window &&
        typeof SpeechSynthesisUtterance !== 'undefined'
    );
}
function waitForVoices() {
    return new Promise(resolve => {
        let voices = speechSynthesis.getVoices();
        if (voices.length) {
            resolve(voices);
        } else {
            speechSynthesis.onvoiceschanged = () => {
                resolve(speechSynthesis.getVoices());
            };
        }
    });
}


async function playText() {
    if (!talkoFinished) return;

    if (!speechSupported()) {
        console.log('Speech synthesis not supported');
        return;
    }

    const text = await loadSockoText();
    if (!text) {
        console.log('Failed to talk');
        return;
    }

    talkoText.innerText = "\n=> " + text + "\n";
    talkoText.scrollTo(0, talkoText.scrollHeight);

    if (volume !== 'true') return;
    if (window.innerWidth <= 768) return;

    await waitForVoices();

    talkoFinished = false;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 2;

    utterance.onend = () => {
        socko.src = `images/socko_1.webp`;
        talkoFinished = true;
    };

    utterance.onerror = (e) => {
        console.error('Speech error:', e);
        talkoFinished = true;
    };

    socko.src = `images/socko_2.webp`;
    speechSynthesis.speak(utterance);
}


async function loadSockoText() {
	try {
		const response = await fetch("dialogue.json"); // fetch the file
		if (!response.ok) throw new Error("Failed to load dialogue.json");

		const data = await response.json(); // parse as JSON
		const sockoMessages = data.sockoTalko;

		const randomIndex = Math.floor(Math.random() * sockoMessages.length); // Pick a random message
		let message = sockoMessages[randomIndex];
        if (message.includes('*sock*')) {
            let sock = socksList[Math.floor(Math.random() * socksList.length)];
            message = message.replaceAll('*sock*', ['No Socks', 'N/A', 'Shrocks'].some(substring => sock.includes(substring)) ? sock : sock + ' socks');
            if (message.includes('*another-sock*')) {
                sock = socksList[Math.floor(Math.random() * socksList.length)];
                message = message.replaceAll('*another-sock*', ['No Socks', 'N/A', 'Shrocks'].some(substring => sock.includes(substring)) ? sock : sock + ' socks');
            }
        }
        return(message);
	} catch (error) {
		console.error("Error loading text:", error);
	}
}
