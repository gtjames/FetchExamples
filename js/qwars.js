
let fiveLetters, hiddenWord, unused = [], lock = [], close = [];
let match = ['_','_','_','_','_'];
lock = ['_','_','_','_','_'];
let userName, gameKey;

let competition = document.getElementById('competition');
let userAttempts = document.getElementById('userAttempts');
let guess = document.getElementById('guess');
let foundYou = document.getElementById('foundYou');
let error = document.getElementById('error');
let tryThis = document.getElementById('tryThis');

window.addEventListener("load", function () {
	// document.body.style.backgroundColor = getColorCode();

	fetch('https://raw.githubusercontent.com/gtjames/csv/master/Dictionaries/five.txt')
		.then(resp => resp.text())
		.then(words => initializeGame(words) )
});

document.getElementById('newUser').addEventListener('click', newUser);
document.getElementById('eliminate').addEventListener('click', eliminate);

function newUser() {
	userName = document.getElementById("userName").value;
	gameKey = document.getElementById("gameKey").value;
	createGame(userName, gameKey)
}

function eliminate() {
	let letter, attempt = '';
	for (let i = 0; i < 5; i++) {
		letter = document.getElementById(i+"").value;
		if ( letter >= 'A' && letter <= 'Z') {
			lock[i] = letter.toLowerCase();
			match[i] = 'e';
			setActive(letter.toLowerCase(), 'e');
			attempt += letter;
		}
		if ( letter >= 'a' && letter <= 'z')    {
			close.push(letter);
			if (match[i] !== 'c') match[i] = 'c';
			attempt += letter;
			setActive(letter, match[i]);
		}
		if (letter[0] === '!') {
			attempt += letter.charAt(1);
			setActive(letter.charAt(1), '_');
			unused.push(letter.charAt(1));
		}
	}
	findPossibles(attempt.toLowerCase(), unused, lock, match);
	userAttempts.innerHTML += postAttempt(match, attempt)
	makeAMove(match, attempt);
}

function postAttempt(match, attempt) {
	let td ='';
	for (let h = 0; h < 5; h++) {
		td += `<td class="${match[h]}">${attempt[h]}</td>`
	}
	return `<tr>${td}</tr>`;
}

function createGame(userName, gameKey) {
	fetch("https://slcrbpag33.execute-api.us-west-1.amazonaws.com/prod", {
		method: 'POST',
		body: JSON.stringify({ "userName" : userName, "gameKey" : gameKey,})
	})
		.then(resp => resp.json())
		.then((data) => output(data))
		.catch(err => console.log('Fetch Error :', err) );
}

let timerId= setInterval(()=>{ getOtherMoves() }, 5000);

function getOtherMoves() {
	fetch(`https://slcrbpag33.execute-api.us-west-1.amazonaws.com/prod/players`,
		{
			method: "POST",
			body: JSON.stringify({"gameKey": gameKey})
		})
		.then(resp => resp.json())
		.then(games => {
			let allPlayers = games.filter(f => f.gameKey === gameKey);
			competition.innerHTML = '';
			allPlayers.forEach(player => {
				let card = `<div class="w3-col m4 l3 disney-card w3-theme-d1">
                                <table><legend>${player.userName}</legend>`;
				player.moves.forEach(m => {
					let match = m[0] + m[2] + m[4] + m[6] + m[8];
					card += postAttempt(match, "_____");
				})
				competition.innerHTML += `${card}</div>`;
			})
		})
		.catch(err => console.log('Fetch Error :', err) );
}

function makeAMove(match, attempt) {
	let move = '';
	for(let i = 0; i < 5; i++) {
		move += match[i] + attempt[i];
	}
	fetch("https://slcrbpag33.execute-api.us-west-1.amazonaws.com/prod", {
		method: 'PUT',
		body: JSON.stringify({ "userName" : userName, "gameKey" : gameKey, "move": move })
	})
		.then(resp => resp.json())
		.then((data) => output(data))
		.catch(err => console.log('Fetch Error :', err) );
}

function output (data) {
	console.log(data);
}

function initializeGame(words) {
	fiveLetters = words.split('\n');
	hiddenWord = selectRandomWord();
	foundYou.innerHTML = `${hiddenWord}<br>`;
}

function selectRandomWord() {
	let index = Math.floor(Math.random() * fiveLetters.length);
	return fiveLetters[index];
}

function search() {
	let attempt = guess.value;
	let match = ['_','_','_','_','_'];

	error.innerText = '';
	if ( fiveLetters.find(w => w === attempt) !== attempt) {
		error.innerText = `${attempt}: is not a valid word`;
		return;
	}

	for (let g = 0; g < 5; g++) {
		let found = false;
		for (let h = 0; h < 5; h++) {
			if (hiddenWord[h] === attempt[g]) {
				found = true;
				if (match[g] === 'e') break;
				match[g] = (h === g) ? 'e' : 'c';
				setActive(attempt[g], match[g]);
				if (match[g] === 'e') lock[g] = attempt[g];
				if (match[g] === 'c') close.push(attempt[g]);
			}
		}
		if (!found) {
			setActive(attempt[g], '_');
			unused.push(attempt[g]);
		}
	}

	findPossibles(attempt, unused, lock, match);

	let td ='';
	for (let h = 0; h < 5; h++) {
		td += `<td class="${match[h]}">${attempt[h]}</td>`
	}
	userAttempts.innerHTML += `<tr>${td}</tr>`;
	// document.body.style.backgroundColor = getColorCode();
}

function findPossibles(attempt, unused, lock, match) {

	let possibles = fiveLetters;
	//  eliminate all words that contain an unused letter
	possibles = possibles.filter(w => {
		for (let un of unused) {
			if (w.indexOf(un) >= 0)
				return false;           //  contains an unused letter
		}
		return true;                    //  free of all unused letters
	});

	//  find the words that match position and letter
	possibles = possibles.filter(w => {
		for (let i = 0; i < 5; i++) {
			if ((match[i] === 'e' && lock[i] !== w.charAt(i)))
				return false;           //  this word doesn't have a matching letter in a required position
		}
		return true;                    //  all required letters are accounted for
	});

	//  find words that have all of the possible letters
	possibles = possibles.filter(w => {
		for (let c of close) {
			if (w.indexOf(c) === -1)
				return false;           //  does not contain a close letter
		}
		return true;                    //  contains all close letters
	});

	let text = '';
	for (let w of possibles) {
		text += `<li>${w}</li>`;
	}
	tryThis.innerHTML = text;
	foundYou.innerHTML += `Possibles ${possibles.length}<br>`;
}

function getColorCode() {
	let makeColorCode = '0123456789ABCDEF';
	let code = '#';
	for (let count = 0; count < 6; count++) {
		code =code+ makeColorCode[Math.floor(Math.random() * 16)];
	}
	return code;
}

function setActive(letter, status) {
	// use querySelectorAll to get all of the type li elements
	const allTypes = document.querySelectorAll("div.row > button");
	allTypes.forEach((item) => {
		// check to see if this is the one to make active
		if (item.dataset.key === letter) {
			item.classList.add(status);
		}
	});
}
