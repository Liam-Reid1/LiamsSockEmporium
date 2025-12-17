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

async function playText() {
    if (talkoFinished) {
        let text = await loadSockoText();
        if (text) {
            if (volume === 'true' && speechSupported()) {
                talkoFinished = false;
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 1;
                utterance.pitch = 2;
                speechSynthesis.speak(utterance);
                socko.src = `images/socko_2.webp`;
                utterance.onend = (event) => {
                    socko.src = `images/socko_1.webp`;
                    talkoFinished = true;
                };
            }
            talkoText.innerText = "\n=> " + text + "\n";
            talkoText.scrollTo(0, talkoText.scrollHeight);
        }
        else {
            console.log('Failed to talk');
        }
    }
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
