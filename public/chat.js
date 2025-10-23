const content = document.getElementById('chatContent'); 
const chatInput = document.getElementById('chatInput'); 
const sendButton = document.getElementById('sendButton'); 

// Socks data 
let socksList; 
fetch('/sockName') 
  .then(response => response.json()) 
  .then(data => { 
    if (!data || data.length === 0) return; 
    socksList = data.map(record => record.sock).join('\n'); 
    //console.log(socksList); 
  }) 
  .catch(error => console.error('Fetch error:', error)); 

// State 
let isLoading = false; 
let currentAnswerId = 0; 

// Event listeners 
sendButton.addEventListener('click', handleSendMessage); 
chatInput.addEventListener('keypress', e => { 
  if (e.key === 'Enter') {
    e.preventDefault();
    handleSendMessage(); 
  }
}); 

function handleSendMessage() { 
  const question = chatInput.value.trim(); 
  if (!question || isLoading) return; 
  sendButton.classList.add('send-button-nonactive'); 
  chatInput.value = ''; 
  addQuestion(question);
  addLoadingAnswer(question); 
} 

function addQuestion(text) { 
  const section = document.createElement('section'); 
  section.className = 'question-section'; 
  section.textContent = text; 
  content.appendChild(section); 
} 

function addLoadingAnswer(question) {
	isLoading = true;
	currentAnswerId++;

	const section = document.createElement('section');
	section.className = 'answer-section';
	section.id = `answer-${currentAnswerId}`;
	section.innerHTML = getLoadingSvg();
	content.appendChild(section);
	scrollToBottom(); 
	fetchAnswer(question, currentAnswerId);

}

function fetchAnswer(question, answerId) {
  fetch('/api/chat', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, socksList })
  })
  .then(res => {
    if (!res.ok) throw new Error("Server error");
    return res.json();
  })
  .then(data => {
    const reply = data?.reply || "Hmm... something went wrong.";
    updateAnswer(answerId, reply);
  })
  .catch(() => {
    updateAnswer(answerId, "Oops! Something went wrong. Please try again!");
  })
  .finally(() => {
    isLoading = false;
    sendButton.classList.remove('send-button-nonactive');
    scrollToBottom();
	animateSocko();
  });
}

function updateAnswer(answerId, text) { 
  const section = document.getElementById(`answer-${answerId}`); 
  if (section) section.textContent = text; 
  saveChat();
} 

function scrollToBottom() { 
  content.scrollTo({ top: content.scrollHeight, behavior: 'smooth' }); 
} 

function getLoadingSvg() {
  return `<span class="loader"></span>`;
}
const socko = document.getElementById("sockoImg");

function animateSocko() {
    let frames = 2 * (Math.floor(Math.random() * 5) + 4); // number of flips
    let v = 1;
    let i = 0;

    let interval = setInterval(() => {
        v = (v === 1 ? 2 : 1);
        socko.src = `images/socko_${v}.webp`; // add .png/.jpg if needed
        i++;
        if (v === 2)
          playPop();
        if (i >= frames) {
            clearInterval(interval); // stop when done
        }
    }, 150); // 200ms per frame
}


// --- Save & Restore raw HTML ---
function saveChat() {
  sessionStorage.setItem("chatContent", content.innerHTML);
  sessionStorage.setItem("answerId", currentAnswerId);
}

// Restore chat on page load
window.addEventListener("DOMContentLoaded", () => {

  const saved = sessionStorage.getItem("chatContent");
  if (saved) {
    content.innerHTML = saved;
	currentAnswerId = sessionStorage.getItem("answerId");
	scrollToBottom();
  }
  socko.src = `images/socko_1.webp`;
  socko.onclick = () => { 
  playPop();
	socko.src = `images/socko_2.webp`;
    let timeout = setTimeout(() => {
        socko.src = `images/socko_1.webp`; 
		clearTimeout(timeout);
    }, 400); // 200ms per frame
  }
});
