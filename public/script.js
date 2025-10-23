const chatTabButton = document.getElementById("chatTabButton"); 
const chatbox = document.getElementById("chatbox"); 
const searchY = document.getElementById('searchY'); 
const searchM = document.getElementById('searchM'); 
const searchD = document.getElementById('searchD'); 
const searchS = document.getElementById('searchS'); 
const recordSearch = document.getElementById("recordSearch"); 
const recordButton = document.getElementById("recordButton");


const modeIcon = document.getElementById('modeIcon'); // Load and apply mode on page load 
const volumeIcon = document.getElementById('volumeIcon');
const mode = window.localStorage.getItem('mode'); 
if (localStorage.getItem('volume') === null) {
    // First time using volume
    localStorage.setItem('volume', 'false'); // or your default value
}
let volume = localStorage.getItem('volume');

if (mode === 'darkMode') { 
	document.documentElement.classList.remove("lightMode"); 
	document.documentElement.classList.add("darkMode"); 
	modeIcon.src = "images/sun_icon.webp";
	volumeIcon.src = volume === 'true' ? "images/volume_active_dark.webp" : "images/volume_unactive_dark.webp";
} else { 
	document.documentElement.classList.remove("darkMode"); 	document.documentElement.classList.add("lightMode"); 
	modeIcon.src = "images/moon_icon.webp";
	volumeIcon.src = volume === 'true' ? "images/volume_active_light.webp" : "images/volume_unactive_light.webp";
} // Toggle mode on button click 

function toggleVolume() {
	volume = volume === 'true' ? 'false' : 'true';
	window.localStorage.setItem('volume', volume); 
	if (document.documentElement.classList.contains("darkMode")) {
		volumeIcon.src = volume === 'true' ? "images/volume_active_dark.webp" : "images/volume_unactive_dark.webp";
	}
	else {
		volumeIcon.src = volume === 'true'? "images/volume_active_light.webp" : "images/volume_unactive_light.webp";
	}
}


function lazyHowl(src, variation = true) {
	let sound; // undefined at first
	return function playSound() {

		if (volume === 'false') return;

		if (!sound) {
			// Create Howl only on the first user gesture
			sound = new Howl({ 
				src: [src],
				loop: false,
				volume: 0.5,
			});
		}
		sound.rate(variation ? Math.random() * (1.1 - 0.9) + 0.9 : 1);
		sound.play();
	};
}

const playPop = lazyHowl('sounds/pop_sound.mp3');
const playClick = lazyHowl('sounds/click_sound.mp3');
const playSparkle = lazyHowl('sounds/sparkle_sound.mp3', false);

function toggleBackground(oldBg, newBg) { // Function to change background versions
	if (!oldBg || !newBg)
		return; 
	oldBg.classList.add("unactive"); 
	newBg.classList.remove("unactive"); 

	CleanupManager.setTimeout(() => { // Smooth fade into
		oldBg.style.opacity = 0; 
		newBg.style.opacity = 1; 
	}, 100); 
}

function toggleMode() { 
	const sockPinIcons = document.querySelectorAll(".sockPinIcon"); 
	if (document.documentElement.classList.contains("darkMode")) { // Switch to light mode
		document.documentElement.classList.remove("darkMode"); 
		document.documentElement.classList.add("lightMode"); 
		window.localStorage.setItem('mode', 'lightMode'); 
		modeIcon.src = "images/moon_icon.webp"; 

		volumeIcon.onerror = function () {
				this.onerror = null;
				this.src = "images/not_found.webp";
			};
			// fade out
			volumeIcon.style.transition = "opacity 0.3s ease"; 
			volumeIcon.style.opacity = 0;
			CleanupManager.setTimeout(() => { 
				volumeIcon.src = volume === 'true'? "images/volume_active_light.webp" : "images/volume_unactive_light.webp";
				// fade back in after new src is applied
				volumeIcon.onload = () => {
					volumeIcon.style.opacity = 1;
				};
			}, 100); 
		sockPinIcons.forEach(icon => { 
			icon.style.opacity = 0; // fade out 
			// use the manager instead of setTimeout 
			CleanupManager.setTimeout(() => { 
				if (icon.src.includes("pin_active_dark")) { 
					icon.src = "images/pin_active_light.webp"; 
				} else if (icon.src.includes("pin_unactive_dark")) { 
					icon.src = "images/pin_unactive_light.webp"; 
				} 
				icon.style.opacity = 1; // fade in 
			}, 100); // match transition duration 
		}); 
		const darkBackgroundM = document.getElementById('stat-pattern-dark'); // Main page
		const lightBackgroundM = document.getElementById('stat-pattern-light'); 
		const lightBackgroundR = document.getElementById("sock-pattern-light"); // Record page
		const darkBackgroundR = document.getElementById("sock-pattern-dark"); 
		if (lightBackgroundM && darkBackgroundM) { 
			toggleBackground(darkBackgroundM, lightBackgroundM);

			const logoImg = document.getElementById("logoImg"); // Logo has two versions as well
			logoImg.onerror = function () {
				this.onerror = null;
				this.src = "images/not_found.webp";
			};

			// fade out
			logoImg.style.transition = "opacity 0.3s ease"; // adjust timing if you like
			logoImg.style.opacity = 0;

			CleanupManager.setTimeout(() => { 

				logoImg.src = "images/logo-light.svg";

				// fade back in after new src is applied
				logoImg.onload = () => {
					logoImg.style.opacity = 1;
				};

			}, 100); 
		} 
		else if (lightBackgroundR && darkBackgroundR) {
			toggleBackground(darkBackgroundR, lightBackgroundR); // Switch from dark to light
		}
	} 
	else { // Switch to dark mode 
		updateChartTheme();
		document.documentElement.classList.remove("lightMode"); 
		document.documentElement.classList.add("darkMode");
		window.localStorage.setItem('mode', 'darkMode'); 
		modeIcon.src = "images/sun_icon.webp"; 

		volumeIcon.onerror = function () {
			this.onerror = null;
			this.src = "images/not_found.webp";
		};
		// fade out
		volumeIcon.style.transition = "opacity 0.3s ease"; 
		volumeIcon.style.opacity = 0;
		CleanupManager.setTimeout(() => { 
			volumeIcon.src = volume === 'true' ? "images/volume_active_dark.webp" : "images/volume_unactive_dark.webp";
			// fade back in after new src is applied
			volumeIcon.onload = () => {
				volumeIcon.style.opacity = 1;
			};
		}, 100); 

		sockPinIcons.forEach(icon => { 
			icon.style.opacity = 0; // fade out 
			CleanupManager.setTimeout(() => { 
				if (icon.src.includes("pin_active_light")) { 
					icon.src = "images/pin_active_dark.webp"; 
				} else if (icon.src.includes("pin_unactive_light")) { 
					icon.src = "images/pin_unactive_dark.webp"; 
				} 
				icon.style.opacity = 1; // fade in 
			}, 100); 
		});
		// check if exists first 
		const lightBackgroundM = document.getElementById("stat-pattern-light"); // Main page
		const darkBackgroundM = document.getElementById("stat-pattern-dark"); 
		const lightBackgroundR = document.getElementById("sock-pattern-light"); // Record page
		const darkBackgroundR = document.getElementById("sock-pattern-dark"); 
		if (lightBackgroundM && darkBackgroundM) { 
			toggleBackground(lightBackgroundM, darkBackgroundM);

			const logoImg = document.getElementById("logoImg");
			logoImg.onerror = function () {
				this.onerror = null;
				this.src = "images/not_found.webp";
			};

			// fade out
			logoImg.style.transition = "opacity 0.3s ease"; // adjust timing if you like
			logoImg.style.opacity = 0;

			CleanupManager.setTimeout(() => { 

				logoImg.src = "images/logo-dark.svg";

				// fade back in after new src is applied
				logoImg.onload = () => {
					logoImg.style.opacity = 1;
				};

			}, 100); 
		} 
		else if (lightBackgroundR && darkBackgroundR) {
			toggleBackground(lightBackgroundR, darkBackgroundR); // Light to dark
		}
	} 
	updateChartTheme(); // Charts get updated colours as well
	playSparkle();
} 


// Record table fetch logic 
function getSockDataRecord() { 
	const year = searchY.value.trim(); 
	const month = searchM.value.trim(); 
	let day = searchD.value.trim(); 
	let sock = searchS.value.trim(); 
	let weekday = ''; 
	if (/^\d+$/.test(day)) {  // User can describe day via numbers or letters
		day = day.padStart(2, '0'); 
	} else if (day) { 
		weekday = day; 
		day = ''; 
	} 

	const params = new URLSearchParams(); 
	if (year) params.append('year', year); 
	if (month) params.append('month', month); 
	if (day) params.append('day', day); 
	if (weekday) params.append('weekday', weekday); 
	if (sock) params.append('sock', sock); 

	const url = `/list${params.toString() ? '?' + params.toString() : ''}`; 
	fetch(url) 
		.then(response => response.json()) 
		.then(data => { 
			const tbody = document.querySelector('#sock-table tbody'); 
			if (!tbody) return; 
			tbody.innerHTML = ''; 
			const results = document.getElementById('results'); 
			if (data.length === 0) { // If nothing is returned
				const row = document.createElement('tr'); 
				row.innerHTML = `<td colspan="3" style="text-align:center;">No results found</td>`; 
				tbody.appendChild(row); 
				results.innerText = `Showing 0 Results`; 
				return; 
			} 
			results.innerText = `Showing ${data.length} Result${data.length === 1 ? '' : 's'}`; // Display number of results
			if (data.length > 999) { // Max result value
				results.innerText = `Showing +999 Results`; 
			} 
			let filteredData = data.filter(record => record.sock.toLowerCase() === 'no socks'); 
			if (filteredData.length === data.length && filteredData.length > 0) { // Special output for weird people
				const row = document.createElement('tr'); 
				row.innerHTML = `<td colspan="3" style="text-align:center;">What are you looking for?</td>`; 
				tbody.appendChild(row); 
				results.innerText += `. weirdo`; 
			} 
			filteredData = data.filter(record => record.formatted_date.toLowerCase().includes('april 20')); 
			if (filteredData.length === data.length && filteredData.length > 0) { 
				const row = document.createElement('tr'); 
				row.innerHTML =  `<td colspan="3" style="text-align:center;">Nice</td>`; // nice
				tbody.appendChild(row); 
			} 
			data.forEach(record => { // New row for each entry
				const row = document.createElement('tr'); 
				row.innerHTML = `<td>${record.sock}</td> 
					<td>${record.formatted_date}</td> 
					<td>${record.day}</td>`; 
				tbody.appendChild(row); 
			}); 
			data = null; 
			filteredData = null; 
			selectedSock = null; 
		}) 
		.catch(err => console.error('Fetch error:', err)); 
} 

function formatDate(date = new Date()) { // Different formats of dates can mess with the queries
	const year = date.toLocaleString('default', {year: 'numeric'}); 
	const month = date.toLocaleString('default', { month: '2-digit', }); 
	const day = date.toLocaleString('default', {day: '2-digit'}); 
	return [year, month, day].join('-'); 
} 

async function fetchFeaturedSock() { 
	const date = formatDate(new Date()); 
	const params = new URLSearchParams({ date }); 
	const response = await fetch(`/main/featured-sock/get?${params.toString()}`);
	const data = await response.json(); 
	if (!data || data.length === 0) { // If it hasn't been made yet
		await fetch(`/main/featured-sock/set?${params.toString()}`); // Make a featured sock
		return fetchFeaturedSock(); // retry after setting 
	} else { 
		const record = data[0]; // only one record 
		return buildSockBoxHTML(record, ''); // return the created div 
	} 
} 

function buildSockBoxHTML(record, type) { // Used for sock boxes on main page
	const sock = `${record.Sock}`.replace(/[\/' ]/g, ''); 
	/*
	const sockStat = document.createElement('div'); 
	sockStat.classList.add('sockStat'); 
	sockStat.classList.add('draggable');
	sockStat.setAttribute('id', `${type + sock}Stat`); 
	sockStat.setAttribute('draggable', true); 
	sockStat.innerHTML = buildSockStatHTML(record, sock, type); 
	sockStat.style.backgroundColor = '#' + record.Colour; 
	document.getElementById('modalContainer').appendChild(sockStat);
	sockStat.querySelector('.sockDesc').style.color = getContrast('#' + record.Colour); 
	dragElement(document.getElementById(`${type + sock}Stat`));
	*/
	const sockBox = document.createElement('div'); 
	sockBox.classList.add('sockBox');
	sockBox.setAttribute('id', `${sock}Box`); 
	sockBox.onclick = () => showSock(record, `${record.Sock}`, type); 
  sockBox.textContent = ['No Socks', 'N/A', 'Shrocks'].includes(record.Sock)
    ? record.Sock
    : `${record.Sock} Socks`;
	/*
	fetchPopularMonths(record.Sock, type + sock); 
	fetchPopularDays(record.Sock, type + sock); 
	switch(type) { 
		case 'top': document.getElementById(`${type + sock}Worn`).innerHTML = `Worn ${record.wear_count} time${record.wear_count != 1 ? 's' : ''} in 100 days`; break; 
		case 'sotm': document.getElementById(`${type + sock}Worn`).innerHTML = `Worn ${record.wear_count} time${record.wear_count != 1 ? 's' : ''} in 30 days`; break; 
	}
		*/
	return(sockBox); 
} 

function buildSockStatHTML(record, sock, type) { // Builds the sock modals
	const pinType = (window.localStorage.getItem('mode') === 'darkMode') 
		? "images/pin_unactive_dark.webp" 
		: "images/pin_unactive_light.webp" ; // Pins have a few different styles
	const headerContent = ['No Socks', 'N/A', 'Shrocks'].includes(record.Sock) 
		? `<h4>${record.Sock}</h4>`
		: `<h4>${record.Sock} Socks</h4>`; // Some socks don't need ' Socks' printed at the end
	const firstSeenContent = (type === '') // top sock and sotm don't display 'First Seen'
		? `<span class='boldText'>First seen:</span><br> ${record.first_worn}<br>` 
		: ``; 
		// Build the html
	return `
		<div class='sockStatHeader' id='${type + sock}StatHeader'> 
			<div class='sockStatTitle' id='${type + sock}StatTitle'> ${headerContent} </div> 
			<button class='sockStatPin' id='${type + sock}StatPin'>[ <img class='sockPinIcon' id='${type + sock}PinIcon' src="${pinType}">]</button> 
			<button class='sockStatClose' id='${type + sock}StatClose'>[X]</button> 
		</div> 
		<div class='sockData' id='${type + sock}Data'> 
			<div class='sockImg'> 
				<img id='${type + sock}Img' src="images/socks/${sock}_pic.webp" alt="Sock" loading="lazy" onerror="this.onerror=null; this.src='images/not_found.webp';"> 
			</div> 
			<div class='sockText' id='${type + sock}Text'> 
				<p> 
					<span id='${type + sock}Worn'>Worn ${record.wear_count} time${record.wear_count != 1 ? 's' : ''}</span><br> 
					${firstSeenContent} 
					<span class='boldText'>Last seen:</span><br> ${record.last_worn}<br> 
					<span id='${type + sock}Month'></span><br> 
					<span id='${type + sock}Day'></span> 
				</p> 
		  </div> 
		  <div class='sockDesc'> 
        <p id='${type + sock}Desc'>
          "${record.Description}"
          ${record.Alive === 0 ? '<br>🪦' : ''} 
          ${type === 'top' ? '<br>🏆' : ''} 
          ${type === 'sotm' ? '<br>🏅' : ''} 
        </p> 
      </div>
	  </div> 
  `; 
} 




const searchType = document.getElementById('searchType');

async function getSockDataSocks() { 
	const modalContainer = document.getElementById('modalContainer'); ; 
	const order = searchType.value.trim();  // Name, Popular, Recent, or Newest
	const param = new URLSearchParams(); 
	if (['Name', 'Popular', 'Recent', 'Newest'].includes(order)) { 
		param.append(order, '1'); 
	} 
	const url = `/socktype${param.toString() ? '?' + param.toString() : ''}`; 
	fetch(url) 
		.then(response => response.json()) 
		.then(data => { // Returns socktype data in order
			if (!data || data.length === 0) return; 
			const boxContainer = document.getElementById('boxContainer'); 
			boxContainer.innerHTML = ``; 
			let i = order === "Newest" ? data.length + 1 : 0; // If newest, start at the top and go down, otherwise go up
			data.forEach(record => { 
				i += order === "Newest" ? -1 : 1; 
				// Sanitize sock ID 
				let sock = `${record.Sock}`.replace(/[\/' ]/g, ''); 
				// Create clickable sock box 
				const sockBox = document.createElement('div'); 
				sockBox.classList.add('sockBox'); 
				sockBox.setAttribute('id', `${sock}Box`); 
				sockBox.onclick = () => showSock(record, `${record.Sock}`); 

				const sockLabel = document.createElement('div'); // Name sock boxes
				sockLabel.classList.add('sockLabel'); 
				sockLabel.textContent = ['No Socks', 'N/A', 'Shrocks'].includes(record.Sock) 
					? `${record.Sock}`
					: `${record.Sock} Socks`; // Some socks don't require ' Socks' at the end
				
				const sockScore = document.createElement('div'); // Sock index depends on order
				sockScore.classList.add('sockScore'); 
				sockScore.setAttribute('id', `${sock}Score`);
				sockScore.textContent = i; 

				// Append everything together
				sockBox.appendChild(sockLabel); 
				sockBox.appendChild(sockScore); 
				boxContainer.appendChild(sockBox); 
				/*
				if (!document.getElementById(`${sock}Stat`)) { // Make a new sock modal if it doesn't exist yet
					const sockStat = document.createElement('div'); 
					sockStat.classList.add('sockStat'); 
					sockStat.classList.add('draggable');
					sockStat.setAttribute('id', `${sock}Stat`); 
					sockStat.setAttribute('draggable', true); // Allows for dragging
					sockStat.innerHTML = buildSockStatHTML(record, sock, ''); // Send to builder function
					sockStat.style.backgroundColor = '#' + record.Colour; // individual background colour
					modalContainer.appendChild(sockStat); 

					document.getElementById(`${sock}Desc`).style.color = getContrast('#' + record.Colour); // Change description text colour
					dragElement(document.getElementById(`${sock}Stat`)); // Make draggable 

					// Fetch additional data 
					fetchPopularMonths(record.Sock, sock); 
					fetchPopularDays(record.Sock, sock); 
				}
					*/
			}); 
		}) 
	.catch(err => console.error('Fetch error:', err)); 
}


 
function bringToFront(elmnt) { 
	const allModals = document.querySelectorAll('.sockStat'); 
	let maxZ = 4; // Base z-index 
	allModals.forEach(modal => { 
		const z = parseInt(window.getComputedStyle(modal).zIndex) || 0; 
		if (z > maxZ) maxZ = z; // Find largest z
	}); 
	elmnt.style.zIndex = maxZ + 1; // Gives current modal highest z-index
} 

function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let dragHandle = document.getElementById(elmnt.id + "Header") || elmnt;

    // If the same handle already has a listener, remove it before re-adding
    dragHandle.onpointerdown = null;

    // Only the drag handle disables gestures
    dragHandle.style.touchAction = "none";

    dragHandle.onpointerdown = dragMouseDown;


    function dragMouseDown(e) {
        // If the user clicked an interactive element, skip dragging
        if (
            e.target.closest("button, a, input, textarea, select, label")
        ) {
            return;
        }

        e.preventDefault();
        bringToFront(elmnt);

        // Capture pointer for smooth drag
        dragHandle.setPointerCapture(e.pointerId);

        pos3 = e.clientX;
        pos4 = e.clientY;

        dragHandle.addEventListener("pointermove", elementDrag);
        dragHandle.addEventListener("pointerup", closeDragElement);
    }

    function elementDrag(e) {
        e.preventDefault();

        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        let headerHeight, headerWidth;
        let newTop, newLeft;

        if (elmnt.style.position === "fixed") {
            headerHeight = dragHandle.offsetHeight;
            headerWidth = dragHandle.offsetWidth;

            const rect = elmnt.getBoundingClientRect();
            newTop = rect.top - pos2;
            newLeft = rect.left - pos1;

            newTop = Math.max(0, Math.min(newTop, window.innerHeight - headerHeight));
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - 10 - headerWidth));
        } else {
            headerHeight = elmnt.offsetHeight;
            headerWidth = elmnt.offsetWidth;

            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

            newTop = elmnt.offsetTop - pos2;
            newLeft = elmnt.offsetLeft - pos1;

            const pageHeight = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight
            );
			const pageWidth = Math.max(
				document.body.scrollWidth,
				document.documentElement.scrollWidth
			) - 10;

            newTop = Math.max(scrollTop, Math.min(newTop, pageHeight - elmnt.offsetHeight));
            newLeft = Math.max(scrollLeft, Math.min(newLeft, pageWidth - elmnt.offsetWidth));
        }

        elmnt.style.top = newTop + "px";
        elmnt.style.left = newLeft + "px";
    }

    function closeDragElement(e) {
        if (dragHandle.hasPointerCapture(e.pointerId)) {
            dragHandle.releasePointerCapture(e.pointerId);
        }
        dragHandle.removeEventListener("pointermove", elementDrag);
        dragHandle.removeEventListener("pointerup", closeDragElement);
    }
}






/*
function dragElement(elmnt) { // Dragging function
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let dragHandle = document.getElementById(elmnt.id + "Header");

    if (dragHandle) {
        dragHandle.onmousedown = dragMouseDown;
    } else {
        elmnt.onmousedown = dragMouseDown;
        dragHandle = elmnt;
    }

    function dragMouseDown(e) { // Begin dragging
        e = e || window.event;
        e.preventDefault();
        bringToFront(elmnt); // Send to front

        pos3 = e.clientX;
        pos4 = e.clientY;

        document.onmouseup = closeDragElement; // Done dragging
        document.onmousemove = elementDrag; // While dragging
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();

        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        let headerHeight, headerWidth;

        let newTop, newLeft;

        if (elmnt.style.position === "fixed") { // Different bounds depending on position type
			headerHeight = dragHandle.offsetHeight;
			headerWidth = dragHandle.offsetWidth;
            // Fixed viewport coords
            const rect = elmnt.getBoundingClientRect();
            newTop = rect.top - pos2;
            newLeft = rect.left - pos1;

            // Clamp to viewport
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - headerHeight));
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - headerWidth));
        } else {
			headerHeight = elmnt.offsetHeight;
			headerWidth = elmnt.offsetWidth;
            // Absolute document coords
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

            newTop = elmnt.offsetTop - pos2;
            newLeft = elmnt.offsetLeft - pos1;

			const pageHeight = Math.max(
				document.body.scrollHeight,
				document.documentElement.scrollHeight
			);

            // Clamp to visible document area
            newTop = Math.max(scrollTop, Math.min(newTop, pageHeight - elmnt.offsetHeight)); // this works i think DONT TOUCH
            newLeft = Math.max(scrollLeft, Math.min(newLeft, scrollLeft + window.innerWidth - headerWidth));
        }

        elmnt.style.top = newTop + "px";
        elmnt.style.left = newLeft + "px";
    }

    function closeDragElement() { // Stop dragging
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
	*/

function showSock(record, sock, type) { // Displays sock modal
	sock = sock.replace(/[\/' ]/g, '');
	let cleanSock = sock;
    if (typeof type !== 'undefined') { // For special modals (Top Sock, Sotm)
        sock = type + sock;
    }

	// Update modal content dynamically
	const modalContainer = document.getElementById('modalContainer');
	let sockStat = modalContainer.firstElementChild;
	const exist = modalContainer.contains(document.getElementById(sock + 'Stat'));
	if (!exist) { // create one if needed issue here
		if (sockStat) {
			modalContainer.removeChild(sockStat); // get rid of oldest modal
		}
		else { // only if there aren't any modals
			sockStat = document.createElement('div');
			sockStat.classList.add('sockStat', 'draggable');
			sockStat.id = 'sockStat';
			sockStat.setAttribute('draggable', true);
		}
		modalContainer.appendChild(sockStat);
		sockStat.id = `${sock}Stat`
		sockStat.innerHTML = buildSockStatHTML(record, cleanSock, (typeof type !== 'undefined') ? type : '');
		sockStat.style.backgroundColor = '#' + record.Colour;
		if (sockStat.style.display === 'none') {
			sockStat.style.position = 'fixed';
		}

		const desc = sockStat.querySelector(`#${sock}Desc`);
		if (desc) desc.style.color = getContrast('#' + record.Colour);


		// Fetch additional data for charts, etc.
		fetchPopularMonths(record.Sock, sock);
		fetchPopularDays(record.Sock, sock);
		switch(type) { 
			case 'top': document.getElementById(`${sock}Worn`).innerHTML = `Worn ${record.wear_count} time${record.wear_count != 1 ? 's' : ''} in 100 days`; break; 
			case 'sotm': document.getElementById(`${sock}Worn`).innerHTML = `Worn ${record.wear_count} time${record.wear_count != 1 ? 's' : ''} in 30 days`; break; 
		}

		dragElement(sockStat);
	}
	else if (exist && document.getElementById(sock + 'Stat').style.display === 'none') {
		sockStat = document.getElementById(sock + 'Stat');
		modalContainer.removeChild(sockStat);
		modalContainer.appendChild(sockStat);
	}

	// After creation

	const selectedSock = document.getElementById(sock + 'Stat');
    const selectedClose = document.getElementById(sock + 'StatClose');
    const selectedPin = document.getElementById(sock + 'StatPin');
    const pinIcon = document.getElementById(sock + 'PinIcon');

    // Show the modal
	if (selectedSock.style.position === 'absolute' && (exist || selectedSock.style.display === 'flex')) {
		pinIcon.classList.add("pinned");
		if (window.localStorage.getItem('mode') === 'darkMode') { // Light and dark mode icons
			pinIcon.src = "images/pin_active_dark.webp";
		} else {
			pinIcon.src = "images/pin_active_light.webp";
		}
	}
	else {
		selectedSock.style.position = 'fixed';
	}
	bringToFront(selectedSock);
	playPop();
    if (selectedSock.style.display !== 'flex') {
        selectedSock.style.display = 'flex';
        const randOffset = () => Math.floor(Math.random() * 41) - 20; // Give slightly random position
        const offsetY = randOffset();
        const offsetX = randOffset();

        const elemWidth = selectedSock.offsetWidth;
		const elemHeight = selectedSock.offsetHeight;

		if (selectedSock.style.position === 'absolute') {
			const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

			selectedSock.style.top = (scrollTop + window.innerHeight / 2 - elemHeight / 2 + offsetY) + 'px';
			selectedSock.style.left = (scrollLeft + window.innerWidth / 2 - elemWidth / 2 + offsetX) + 'px';
		} else {
			selectedSock.style.position = 'fixed';
			selectedSock.style.top = `calc(50% - ${elemHeight / 2}px + ${offsetY}px)`;
			selectedSock.style.left = `calc(50% - ${elemWidth / 2}px + ${offsetX}px)`;
		}

		selectedSock.style.animation = "zoomIn 0.2s forwards";

    }
	else {
		selectedSock.style.animation = 'none';
		selectedSock.offsetHeight;
		selectedSock.style.animation = 'pop 0.2s forwards'; 
	}

    // Pin toggle
    selectedPin.onclick = () => {
        const isPinned = pinIcon.classList.contains("pinned");
        const rect = selectedSock.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        if (isPinned) {
            // Switch to unpinned (fixed, viewport coords)
            if (window.localStorage.getItem('mode') === 'darkMode') { // Light and dark mode icons
                pinIcon.src = "images/pin_unactive_dark.webp";
            } else {
                pinIcon.src = "images/pin_unactive_light.webp";
            }

            selectedSock.style.top = rect.top + "px";
            selectedSock.style.left = rect.left + "px";
            selectedSock.style.position = "fixed";
        } else {
            // Switch to pinned (absolute, document coords)
            if (window.localStorage.getItem('mode') === 'darkMode') { // Light and dark mode icons
                pinIcon.src = "images/pin_active_dark.webp";
            } else {
                pinIcon.src = "images/pin_active_light.webp";
            }

            selectedSock.style.top = (rect.top + scrollTop) + "px";
            selectedSock.style.left = (rect.left + scrollLeft) + "px";

			const pageWidth = Math.max(
			document.body.scrollWidth,
			document.documentElement.scrollWidth
			);
			const pageHeight = Math.max( 
			document.body.scrollHeight,
			document.documentElement.scrollHeight
			); // Max bounds are smaller for absolute mode, prevents modal from being dragged underneath page

			const sockBottom = selectedSock.offsetTop + selectedSock.offsetHeight;
			const sockRight = selectedSock.offsetLeft + selectedSock.offsetWidth;

			if (sockBottom > pageHeight) {
				// Push it up so it fits inside the viewport
				selectedSock.style.top = (pageHeight - selectedSock.offsetHeight) + "px";
			}
			if (sockRight > pageWidth) {
				selectedSock.style.left = (pageWidth - selectedSock.offsetWidth) + "px";
			}
            selectedSock.style.position = 'absolute';
        }

        pinIcon.classList.toggle("pinned"); // Set mode
		playClick();
    };

    // Close button
    selectedClose.onclick = () => {
        selectedClose.classList.add('clicked'); // Keeps close icon scale small until fully closed
        CleanupManager.setTimeout(() => {
            selectedSock.style.animation = "zoomOut 0.2s forwards";
            CleanupManager.setTimeout(() => {
                selectedSock.style.display = 'none';
                selectedClose.classList.remove('clicked');
				modalContainer.removeChild(selectedSock);
				modalContainer.prepend(selectedSock);
            }, 200);
        }, 100);
		playClick();
    };
}


function getContrast(hexcolor) { // Used for sock stat modal description text colour
	var r = parseInt(hexcolor.substr(1,2),16) / 255; 
	var g = parseInt(hexcolor.substr(3,2),16) / 255; 
	var b = parseInt(hexcolor.substr(5,2),16) / 255; 
	[r,g,b] = [r,g,b].map(c => (c <= 0.03928) 
		? c/12.92 
		: Math.pow((c+0.055)/1.055, 2.4)); 
	var luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b; 
	var contrastWhite = (1.05) / (luminance + 0.05); 
	var contrastBlack = (luminance + 0.05) / 0.05; 
	return (contrastWhite > contrastBlack) 
		? 'white' 
		: 'black'; // Text colour depends on background colour
} 

function fetchPopularMonths(sockName, idPrefix) { // Function for sock modal months
	const params = new URLSearchParams({ sock: sockName }); 
	fetch(`/socktype/month?${params.toString()}`) 
		.then(response => response.json()) 
		.then(data => { 
			if (!data || data.length === 0) return; 
			const monthSpan = document.getElementById(`${idPrefix}Month`); 
			const monthsList = data.map(record => record.month).join(', '); // Multiple months can be displayed
			monthSpan.innerHTML = `<span class='boldText'>Popular Month${data.length > 1 ? 's' : ''}:<br></span>${monthsList}`; 
		}); 
} 

function fetchPopularDays(sockName, idPrefix) { // Function for sock modal days
	const params = new URLSearchParams({ sock: sockName }); 
	fetch(`/socktype/day?${params.toString()}`) 
		.then(response => response.json()) 
		.then(data => { 
			if (!data || data.length === 0) return; 
			const daySpan = document.getElementById(`${idPrefix}Day`); 
			const daysList = data.map(record => record.Day.substring(0, 3)).join(', '); // Multiple days can be displayed
			daySpan.innerHTML = `<span class='boldText'>Popular Day${data.length > 1 ? 's' : ''}:<br></span> ${daysList}`; 
		}); 
} 

function animateValue(obj, start, end, duration) { // Animation for big numbers on main page
	let startTimestamp = null; 
	const step = (timestamp) => { // Increases total number of days and socks
		if (!startTimestamp) startTimestamp = timestamp; 
		const progress = Math.min((timestamp - startTimestamp) / duration, 1); 
		obj.innerHTML = Math.floor(progress * (end - start) + start); 
		if (progress < 1) { 
			window.requestAnimationFrame(step); 
		} 
	}; 
	window.requestAnimationFrame(step); 
} 

async function loadSplashText() { // Random splash text for main page
	try {
		const response = await fetch("splash.json"); // fetch the file
		if (!response.ok) throw new Error("Failed to load splash.json");

		const data = await response.json(); // parse as JSON
		const splashMessages = data.splashes;

		const randomIndex = Math.floor(Math.random() * splashMessages.length); // Pick a random message
		const message = splashMessages[randomIndex];

		document.getElementById("splashText").textContent = message; // Put it on the page
	} catch (error) {
		console.error("Error loading splash text:", error);
	}
}

async function getSockDataTopScore() { 
	const bigItems = document.getElementById('bigItemsContainer'); // Logo, Big Numbers, Sock Modal Tab, Splash Text
	try { 
		const response = await fetch('/main/big-numbers'); // Fetch total socks and days 
		const data = await response.json(); 
		if (!data || data.length === 0) return; 
		const totalSocks = data[0].total_socks; 
		const totalDays = data[0].total_days; 
		let logo = '';
		if (mode === 'darkMode') { // Light and dark mode versions
			logo = "images/logo-dark.svg";
		}
		else {
			logo = "images/logo-light.svg";
		}
		// Entirety of bigItems built here
		bigItems.innerHTML = `
			<div id="logoContainer"><img height='150' width='420' id='logoImg' src="${logo}" alt="Logo" loading="lazy" onerror="this.onerror=null; this.src='images/not_found.webp';"></div>
			<h2 id="bigNumbers"><br><span id="totalSockNum">${totalSocks}</span> Socks<br><br><br><span id="totalDayNum">${totalDays}</span> Days Recorded</h2> 
			<div id="tabContainer"> 
				<div class="tab"> 
					<button class="active" data-tab="top">Top Sock</button> 
					<button data-tab="sotm">Sock of the Month</button> 
					<button data-tab="featured">Featured Sock</button> 
				</div> 
				<div class="tab-body"> 
					<div id="top" class="tabcontent active"></div> 
					<div id="sotm" class="tabcontent"></div> 
					<div id="featured" class="tabcontent"></div> 
				</div> 
			</div>
			<div id="splashText"></div>
		`; 
		loadSplashText(); // Could be moved outside catch
		animateValue(document.getElementById('totalSockNum'), 0, totalSocks, totalSocks * 50); // Animate big numbers
		animateValue(document.getElementById('totalDayNum'), 0, totalDays, totalDays * 5); 
	} catch (error) { // Not the best solution. If bigNumbers fails, the rest break as well
		console.error('Error fetching big numbers:', error); 
	} 

	let maxBoxes = window.innerWidth <= 768 ? 2: 3;
	// Fetch Top Sock 
	try { 
		const response = await fetch('/main/top-sock'); 
		const data = await response.json(); 
		if (!data || data.length === 0) return; 
		data.forEach(record => { 
			const topSock = buildSockBoxHTML(record, 'top'); // New sock box with special tag 'top'
			document.getElementById('top').appendChild(topSock); // Add to page
		}); 
		if (data.length > maxBoxes) { // Alignment depends on number of vaules
			document.getElementById('top').style.justifyContent = 'start'; 
		} else { 
			document.getElementById('top').style.justifyContent = 'center'; 
		} 
	} catch (error) { 
		console.error('Error fetching top sock:', error); 
	} 

	// Fetch Sock of the Month 
	try { 
		const response = await fetch('/main/sotm'); 
		const data = await response.json(); 
		if (!data || data.length === 0) return; 
		data.forEach(record => { 
			const sotm = buildSockBoxHTML(record, 'sotm'); // New sock box with special tag 'sotm'
			document.getElementById('sotm').appendChild(sotm); // Add to page
		}); 
		if (data.length > maxBoxes) { // Alignment depends on number of values
			document.getElementById('sotm').style.justifyContent = 'start'; 
		} else { 
			document.getElementById('sotm').style.justifyContent = 'center'; 
		} 
	} catch (error) { 
		console.error('Error fetching sock of the month:', error); 
	} 
	// Fetch Featured Sock 
	(async () => { 
		try { 
			const featuredSockDiv = await fetchFeaturedSock(); // Special function required for featured sock
			document.getElementById('featured').appendChild(featuredSockDiv); 
		} catch (error) { 
			console.error('Error fetching featured sock:', error); 
		} 
	})(); 

	// Tab switching logic 
	document.querySelectorAll('.tab button').forEach(button => { button.onclick = (event) => { 
		// Toggle button active class 
		document.querySelectorAll('.tab button').forEach(btn => btn.classList.remove('active')); 
		button.classList.add('active'); 
		// Toggle tab content visibility 
		document.querySelectorAll('.tabcontent').forEach(pane => pane.classList.remove('active')); 
		const target = button.getAttribute('data-tab'); 
		document.getElementById(target).classList.add('active'); 
		playClick();
	}; }); 
} 

// Chart data fetch logic 
async function getSockDataCharts() { 
	try { 
		const response = await fetch('/main/chart'); 
		const data = await response.json(); 
		if (!data || data.length === 0) return; 
		const sockLabels = data.map(sock => sock.sock); 
		const wearCounts = data.map(sock => sock.wear_count); 
		const percentage = data.map(sock => sock.percentage); 
		const colours = data.map(sock => '#' + sock.colour); 
		createPieChart(sockLabels, percentage, colours); // Similar data for both charts
		createBarGraph(sockLabels, wearCounts, colours); // One uses percentage, other uses total wear count
	} catch (error) { 
		console.error('Error fetching sock data:', error); 
	} 
} 

const checkboxContainer = document.getElementById('sockCheckboxes'); 

async function getSockDataDate() { 
	try { 
		const response = await fetch('/main/date-chart'); // Big fetch
		const data = await response.json(); 
		if (!data || data.length === 0) return; 
		const months = [...new Set(data.map(row => row.YearMonth))].sort((a, b) => new Date('01-' + a) - new Date('01-' + b) ); 
		const socks = [...new Set(data.map(row => row.sock))]; 
		const wearMap = data.reduce((acc, { sock, YearMonth, CumulativeWorn }) => { 
			if (!acc[sock]) acc[sock] = {}; 
			acc[sock][YearMonth] = Number(CumulativeWorn); 
			return acc; 
		}, {}); 
		socks.forEach(sock => { // Build checkbox for each sock
			const label = document.createElement('label'); 
			label.classList.add('sockLabel');
			const checkbox = document.createElement('input'); 
			checkbox.type = 'checkbox'; 
			checkbox.classList.add('sockCheckbox');
			checkbox.name = 'Sock'; 
			checkbox.value = sock; 
			checkbox.checked = true; // initially show all 
			checkbox.onchange = (event) => { setLineChart(months, wearMap, data); playClick(); }; // If changed, line chart updates
			label.appendChild(checkbox); 
			label.append(' ' + sock); 
			checkboxContainer.appendChild(label); 
		}); 
		var checkboxes = checkboxContainer.querySelectorAll("input[type='checkbox']"); 
		document.getElementById('selectAll').onchange = (event) => { 
			checkboxes.forEach(checkbox => {  // Changes all checkboxes to selectAll value
				checkbox.checked = document.getElementById('selectAll').checked; 
			}); 
			playClick();
			setLineChart(months, wearMap, data); // update chart after select/deselect all 
		}; 

		setLineChart(months, wearMap, data); // Initial chart 
	} catch (error) { 
		console.error('Error fetching sock data:', error); 
	} 
} 

let lineChartInstance; // Keep reference to update chart later 

function setLineChart(months, wearMap, data) { 
	const checkboxes = document.querySelectorAll('#sockCheckboxes input[type="checkbox"]'); 
	const selectedSocks = Array.from(checkboxes) .filter(cb => cb.checked && cb.id !== 'selectAll') .map(cb => cb.value); 
	const datasets = selectedSocks.map(sock => { 
	const sockMonths = wearMap[sock] || {}; 
	const colour = data.find(d => d.sock === sock)?.colour || '000000'; 
	return { label: sock, data: months.map(month => sockMonths[month] || 0), fill: false, borderColor: `#${colour}`, tension: 0.2, }; }); 
  	// Rebuild chart if it exists 
	const ctx = document.getElementById('lineChart').getContext('2d');

	if (lineChartInstance) {
		// Update existing chart’s data
		lineChartInstance.data.labels = months;
		lineChartInstance.data.datasets = datasets;
		lineChartInstance.update(); // Animate transition
		return; // Exit early — no need to rebuild
	}

	document.fonts.ready.then(() => { 
		Chart.defaults.font.family = 'MapleMono'; 
		Chart.defaults.font.size = 13; // optional
		Chart.defaults.font.weight = 'normal'; // optional 
		const rootStyles = getComputedStyle(document.documentElement);
		const textColour = rootStyles.getPropertyValue('--chart-text-colour').trim();
		Chart.defaults.color = textColour;
		const gridColour = rootStyles.getPropertyValue('--grid-colour').trim();
		Chart.defaults.borderColor = gridColour;

		lineChartInstance = new Chart(ctx, { 
			type: 'line', 
			data: { 
				labels: months, // months 
				datasets: datasets // each sock = line 
			}, 
			options: { 
				responsive: true, 
				maintainAspectRatio: false, 
				plugins: { 
					title: { 
						display: true, 
						text: 'Sock Wear Over Time' 
					}, 
					legend: { 
						display: false,
						position: 'left',
      					align: 'start'    // aligns legend items vertically from the top
					}, 
					tooltip: { 
						mode: 'nearest', // Ensures it picks the closest point 
						intersect: false, // Allows hovering without exact point intersection 
						position: 'nearest', // Uses the point nearest to cursor, not average 
						yAlign: 'bottom', // Tooltip appears below point (optional) 
						xAlign: 'center' // Tooltip centers horizontally (optional) 
					} 
				}, 
				scales: { 
					x: { 
						title: { 
							display: true, 
							text: 'Month' 
						}, 
						ticks: {
							autoSkip: false,
							maxRotation: 30, // maximum tilt angle
							minRotation: 30,
						}
					}, 
					y: { 
						beginAtZero: true, 
						title: { 
							display: true, 
							text: 'Wear Count' 
						}
					}, 
				} 
			} 
		}); 
	}); 
}


function createPieChart(labels, data, colours) { 
	const canvas = document.getElementById('pieChart'); 
	if (!canvas) return; 
	document.fonts.ready.then(() => { 
		Chart.defaults.font.family = 'MapleMono'; 
		Chart.defaults.font.size = 13; // optional 
		Chart.defaults.font.weight = 'normal'; // optional 
		const rootStyles = getComputedStyle(document.documentElement);
		const textColour = rootStyles.getPropertyValue('--chart-text-colour').trim();
		Chart.defaults.color = textColour;
		const ctx = canvas.getContext('2d'); 
		new Chart(ctx, { 
			type: 'pie', 
			data: { 
				labels, 
				datasets: [{ 
					data, 
					backgroundColor: colours, 
					borderWidth: 1 
				}] 
			}, 
			options: { 
				responsive: true, 
				plugins: { 
					tooltip: { 
						callbacks: { 
							label: function(context) { 
								const label = context.label || ''; 
								const value = context.parsed || 0; 
								return `${value}%`; 
							} 
						} 
					}
				}
			} 
		}); 
	}); 
} 

let barChart; // keep reference so we can destroy/rebuild

function createBarGraph(labels, data, colours) {
  const canvas = document.getElementById('barGraph');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  document.fonts.ready.then(() => {
    Chart.defaults.font.family = 'MapleMono';
    Chart.defaults.font.size = 13;
    Chart.defaults.color = getComputedStyle(document.documentElement)
      .getPropertyValue('--chart-text-colour')
      .trim();
    Chart.defaults.borderColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--grid-colour')
      .trim();

    const isMobile = window.innerWidth <= 768;

    if (barChart) barChart.destroy(); // prevent duplicates
    barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: colours,
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: isMobile ? 'y' : 'x', // swap based on screen
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Sock Wear Frequency' }
        },
        scales: {
          x: { beginAtZero: true },
          y: { beginAtZero: true }
        }
      }
    });
  });
}

// re-create on window resize
window.addEventListener('resize', () => {
	initChatTab(); // set chatbox

	document.querySelectorAll(".draggable").forEach(elmnt => { // set sock modals
		const style = getComputedStyle(elmnt);

		if (style.position === "fixed") {
			const rect = elmnt.getBoundingClientRect();
			let newLeft = Math.max(0, Math.min(rect.left, window.innerWidth - rect.width));
			let newTop = Math.max(0, Math.min(rect.top, window.innerHeight - rect.height));
			elmnt.style.left = newLeft + "px";
			elmnt.style.top = newTop + "px";
		} else if (style.position === "absolute") {
			const parent = elmnt.offsetParent || document.body; // element's containing block

			// Current position relative to parent
			let left = elmnt.offsetLeft;
			let top = elmnt.offsetTop;

			// Clamp within parent
			left = Math.min(left, parent.clientWidth - elmnt.offsetWidth);
			left = Math.max(left, 0);

			top = Math.min(top, parent.clientHeight - elmnt.offsetHeight);
			top = Math.max(top, 0);

			elmnt.style.left = left + "px";
			elmnt.style.top = top + "px";
		}
	});

	const isMobile = window.innerWidth <= 768;
	if (!barChart) return; // set bar chart
	const currentAxis = barChart.config.options.indexAxis;
	const newAxis = isMobile ? 'y' : 'x';
	if (currentAxis !== newAxis) {
	createBarGraph(
		barChart.data.labels,
		barChart.data.datasets[0].data,
		barChart.data.datasets[0].backgroundColor
	);
	}
});



function updateChartTheme() {
  const textColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--chart-text-colour')
    .trim();

  const gridColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--grid-colour')
    .trim(); // <-- define a CSS var for your grid color

  // update global defaults for NEW charts
  Chart.defaults.color = textColor;

  // update EXISTING charts
  Object.values(Chart.instances).forEach(chart => {
    if (chart.options.scales) {
      Object.keys(chart.options.scales).forEach(axis => {
        if (chart.options.scales[axis].ticks) {
          chart.options.scales[axis].ticks.color = textColor;
        }
        if (chart.options.scales[axis].title) {
          chart.options.scales[axis].title.color = textColor;
        }
        if (chart.options.scales[axis].grid) {
          chart.options.scales[axis].grid.color = gridColor;
          chart.options.scales[axis].grid.borderColor = gridColor;
        }
      });
    }

    // legend + title as well
    if (chart.options.plugins?.legend?.labels) {
      chart.options.plugins.legend.labels.color = textColor;
    }
    if (chart.options.plugins?.title) {
      chart.options.plugins.title.color = textColor;
    }


    chart.update();
  });
}





const topButton = document.getElementById("topButton"); 
let isTopButtonVisible = false; 

function scrollFunction() { 
	if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) { // Appear once scrolled far enough
		if (!isTopButtonVisible) { 
			isTopButtonVisible = true; 
			topButton.style.display = "block"; 
			topButton.style.animation = "zoomIn 0.2s forwards"; 
		} 
	} else {
		if (isTopButtonVisible) { // Disappear
			isTopButtonVisible = false; 
			topButton.style.animation = "zoomOut 0.2s forwards"; 
			CleanupManager.setTimeout(() => { 
				topButton.style.display = "none"; 
			}, 200); 
		} 
	} 
} 

// When the user clicks on the button, scroll to the top of the document 
function topFunction() { 
	document.body.scrollTo({ 
		left: 0, 
		top: 0, 
		behavior: 'smooth' 
	}); 
	document.documentElement.scrollTo({ 
		left: 0, 
		top: 0, 
		behavior: 'smooth' 
	}); 
	playClick();
} 

function isMobile() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

if (isMobile()) {
    console.log("Touch device detected (likely mobile)");
} else {
    console.log("Non-touch device detected");
}


// Initialization based on current page 
document.addEventListener('DOMContentLoaded', () => { 
	initCharts(); 
	initSockBox(); 
	initScrollTitle(); 
	initRecordSearch(); 
	initChatTab(); 
	initRecordInputs(); 
}); 

/* ----------------------------- Charts + Background Handling ------------------------------ */ 

function initCharts() { 
	const pie = document.getElementById('pieChart'); 
	const bar = document.getElementById('barGraph'); 
	const line = document.getElementById('lineChart'); 
	if (!(pie && bar && line)) return; 
	getSockDataCharts(); 
	getSockDataDate(); 
	getSockDataTopScore(); 

	const darkBackgroundM = document.getElementById('stat-pattern-dark'); 
	const lightBackgroundM = document.getElementById('stat-pattern-light'); 
	if (!darkBackgroundM || !lightBackgroundM) return; 
	const isDark = (mode === 'darkMode'); 
	darkBackgroundM.classList.toggle("unactive", !isDark); 
	lightBackgroundM.classList.toggle("unactive", isDark); 
	darkBackgroundM.style.opacity = isDark ? 1 : 0; 
	lightBackgroundM.style.opacity = isDark ? 0 : 1; 
} 

/* ----------------------------- Sock Box Data ------------------------------ */ 

function initSockBox() { 
	if (document.getElementById('boxContainer')) { 
		getSockDataSocks(); 
	} 
} 

/* ----------------------------- Scroll Title Toggle ------------------------------ */ 

function initScrollTitle() { 
	const scrollTitle = document.getElementById('scrollTitle'); 
	if (!scrollTitle) return; 
	let showingTrueName = false; 
	scrollTitle.onclick = () => { 
		scrollTitle.innerHTML = showingTrueName 
			?  `<h1>Sock Data</h1>`
			: `<h1>La Scroll</h1>`;
		showingTrueName = !showingTrueName; 
		// Restart animation 
		scrollTitle.style.animation = 'none'; 
		scrollTitle.offsetHeight; // force reflow 
		scrollTitle.style.animation = 'pop 0.2s forwards'; 
		playPop();
	}; 

	const darkBackgroundR = document.getElementById('sock-pattern-dark'); 
	const lightBackgroundR = document.getElementById('sock-pattern-light'); 
	if (!darkBackgroundR || !lightBackgroundR) return; 
	const isDark = (mode === 'darkMode'); 
	darkBackgroundR.classList.toggle("unactive", !isDark); 
	lightBackgroundR.classList.toggle("unactive", isDark); 
	darkBackgroundR.style.opacity = isDark ? 1 : 0; 
	lightBackgroundR.style.opacity = isDark ? 0 : 1; 
} 

/* ----------------------------- Record Search Toggle ------------------------------ */ 

function initRecordSearch() { 
	let recordOpen = window.localStorage.getItem('recordSearch'); 
	const recordSearch = document.getElementById('recordSearch'); 
	if (typeof recordOpen === 'undefined') {
		recordOpen = 'false';
	}
	if (!recordSearch) return; 
	let isVisible;
	recordSearch.style.animation = 'none';
	if (recordOpen == 'true') {
		isVisible = true;
		recordSearch.style.animation = "recordSearchShow 0.4s forwards"; 
		recordSearch.style.boxShadow = 'rgba(0, 0, 0, 0.2) 4px 4px'; 
	}
	else {
		isVisible = false;
		recordSearch.style.transform = 'translateX(-175px)'
		recordSearch.style.boxShadow = 'none';
	}
	window.onscroll = scrollFunction; 
	recordButton.onclick = () => { 
		if (!isVisible) { 
			recordOpen = 'true';
			recordSearch.style.animation = "recordSearchShow 0.4s forwards"; 
			recordSearch.style.boxShadow = 'rgba(0, 0, 0, 0.2) 4px 4px'; 
		} else { 
			recordOpen = 'false';
			recordSearch.style.animation = "recordSearchHide 0.4s forwards"; 
			recordSearch.style.boxShadow = 'none'; 
		} isVisible = !isVisible; 
		window.localStorage.setItem('recordSearch', recordOpen); 
		playPop();
	}; 
} 

/* ----------------------------- Chat Tab Toggle ------------------------------ */ 

function initChatTab() { 
	let chatOpen = window.localStorage.getItem('chatTab'); 
	const mainContainer = document.getElementById('chartContainer');
	const sockContainer = document.getElementById('boxContainer');
	const sockButton = document.getElementById('searchType');
	const recordContainer = document.getElementById('scroll');
	if (typeof chatOpen === 'undefined') {
		chatOpen = 'false';
	}
	const chatTabButton = document.getElementById('chatTabButton'); 
	if (!chatTabButton) return; 
	if (window.innerWidth <= 768)
		chatOpen = 'false';
	if (chatOpen == 'true') {
		chatTabButton.innerText =  "Close Me";
		chatbox.style.right = "0";
		if (mainContainer) {
			mainContainer.style.marginLeft = '1%';
		}
		else if (sockContainer) {
			sockContainer.style.marginLeft = '12%';
			sockButton.style.left = '0.5%';
		}
		else if (recordContainer) {
			recordContainer.style.marginLeft = '20%';
		}
		
	}
	else {
		chatTabButton.innerText =  "Open Me";
		chatbox.style.right = "calc(-20% - 10px)";
		if (mainContainer) {
			mainContainer.style.marginLeft = '12%';
		}
		else if (sockContainer) {
			sockContainer.style.marginLeft = '17%';
			sockButton.style.left = '3%';
		}
		else if (recordContainer) {
			recordContainer.style.marginLeft = '24%';
		}
	}
	chatTabButton.onclick = () => { 
		if(chatOpen == 'true') {
			chatOpen = 'false';
			chatbox.style.animation = "chatboxHide 0.6s forwards"; 
			chatTabButton.innerText =  "Open Me";
			chatbox.style.right = "calc(-20% - 7px)";
			if (mainContainer) {
				mainContainer.style.marginLeft = '12%';
			}
			else if (sockContainer) {
				sockContainer.style.marginLeft = '17%';
				sockButton.style.left = '3%';
			}
			else if (recordContainer) {
				recordContainer.style.marginLeft = '24%';
			}
		}
		else {
			chatOpen = 'true';
			chatbox.style.animation = "chatboxShow 0.6s forwards"; 
			chatTabButton.innerText =  "Close Me";
			chatbox.style.right = "0";
			if (mainContainer) {
				mainContainer.style.marginLeft = '1%';
			}
			else if (sockContainer) {
				sockContainer.style.marginLeft = '12%';
				sockButton.style.left = '0.5%';
			}
			else if (recordContainer) {
				recordContainer.style.marginLeft = '20%';
			}
		}
		window.localStorage.setItem('chatTab', chatOpen); 
		playPop();
	}; 
} 

/* ----------------------------- Record Inputs Handling ------------------------------ */ 

function initRecordInputs() { // Can probably just combine this
	if (!(searchY && searchM && searchD && searchS)) return; 
	getSockDataRecord(); 
	[searchY, searchM, searchD, searchS].forEach(input => { input.oninput = getSockDataRecord; }); 
} 

// --- GLOBAL CLEANUP MANAGER --- 

const CleanupManager = { 
	timeouts: [], 
	intervals: [], 
	listeners: [], 

	setTimeout(fn, delay) { 
		const id = window.setTimeout(() => { 
			this.timeouts = this.timeouts.filter(tid => tid !== id); 
			fn(); 
		}, delay); 
		this.timeouts.push(id); 
		return id; 
	}, 

	setInterval(fn, delay) { 
		const id = window.setInterval(fn, delay); 
		this.intervals.push(id); 
		return id; 
	}, 

	addListener(target, event, handler, options) { 
		target.addEventListener(event, handler, options); 
		this.listeners.push({ target, event, handler, options }); 
	}, 

	clearAll() { 
		this.timeouts.forEach(id => clearTimeout(id)); 
		this.intervals.forEach(id => clearInterval(id)); 
		this.listeners.forEach(({ target, event, handler, options }) => { 
			target.removeEventListener(event, handler, options); 
		}); 

		this.timeouts = []; 
		this.intervals = []; 
		this.listeners = []; 
	} 
}; 

window.addEventListener("beforeunload", () => { CleanupManager.clearAll(); });