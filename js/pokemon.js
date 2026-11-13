let searchBtn = document.getElementById('searchBtn');
searchBtn.addEventListener('click', search);
const albumInfo  = document.getElementById("albumInfo");
const albumImage = document.getElementById("albumImage");
const artist     = document.getElementById("artist");
const artistName = document.querySelector("#artistName");

const trackPanel = document.getElementById("trackPanel");
const trackList  = document.getElementById("trackList");

const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");
const info = document.querySelector("#info");

const albumList = document.getElementById('albumList')

let page = 1;

prevButton.addEventListener("click", () => {
	if (page > 1) {
		page--;
		document.querySelector("#page-number").textContent = page;
		loadPokemon();
	}
});
nextButton.addEventListener("click", () => {
	page++;
	document.querySelector("#page-number").textContent = page;
	loadPokemon();
});

function showList(results) {
    results.forEach(({ name }) => {
    const item = document.createElement("li");
    item.textContent = name.charAt(0).toUpperCase() + name.slice(1);
    item.addEventListener("click", () => {
        search(name);
    });
    albumList.appendChild(item);
    });
}

function loadPokemon() {
	showAlbumInfo();

	albumList.textContent = "Loading Pokémon…";
	albumList.innerHTML = "";

    const cached = localStorage.getItem(`pokemon_page_${page}`);
    if (cached) {
        info.textContent = "From Memory Cache";
        showList(JSON.parse(cached));
        return;
    }

	fetch(`https://pokeapi.co/api/v2/pokemon?offset=${(page - 1) * 50}&limit=50`)
		.then((response) => response.json())
		.then(({ results }) => {
            localStorage.setItem(`pokemon_page_${page}`, JSON.stringify(results));
            info.textContent = "From API";
            showList(results);
		})
		.catch((e) => {
			console.error("Error loading Pokémon:", e);
			info.textContent = "Unable to load Pokémon. Please try again later.";
		});
}

function showDetails(data) {
	info.innerHTML = "";
	albumInfo.innerHTML = "";

	if (data.length === 0) {
		info.innerHTML = "<p>No albums found.</p>";
		return;
	}

	const spriteImages = Object.entries(data.sprites)
		.filter(([, url]) => typeof url === "string")
		.map(([sprite, url]) => `<img src="${url}" alt="${data.name} ${sprite.replace(/_/g, " ")}">`)
		.join("");

	const criesAudio = Object.entries(data.cries || {})
		.filter(([, url]) => typeof url === "string")
		.map(([label, url]) => `<button type="button" class="cry-button" data-cry="${url}">▶ ${label} cry</button>`)
		.join(" ");

	const characterDetails = `
		<h2>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h2>
		<div class="pokemon-sprites">${spriteImages}</div>
		<div class="pokemon-cries">${criesAudio}</div>
		<p>Height: ${data.height}</p>
		<p>Weight: ${data.weight}</p>
		<p>Types: ${data.types.map(typeInfo => typeInfo.type.name).join(", ")}</p>
		<p>Moves: ${data.moves.map(moveInfo => moveInfo.move.name).join(", ")}</p>
		<p>Abilities: ${data.abilities.map(abilityInfo => abilityInfo.ability.name).join(", ")}</p>
		<a href="#" id="description-link">Retrieve description</a>
		<p class="pokemon-description"></p>`;

	const detailsContainer = document.createElement("div");
	detailsContainer.innerHTML = characterDetails;
	detailsContainer.querySelectorAll(".cry-button").forEach((button) => {
		button.addEventListener("click", () => {
			new Audio(button.dataset.cry).play();
		});
	});
	detailsContainer.querySelector("#description-link").addEventListener("click", (event) => {
		event.preventDefault();
		getCharacterDescription(data);
	});

	// document.getElementById("albumImage").src = data.sprites.front_default;
	// document.getElementById("artistName").textContent = `ID: ${data.name}`;
	albumInfo.appendChild(detailsContainer);
}

async function search(name) {
    if (name === "") {
        return;
    }

    info.innerHTML = "<p>Searching...</p>";

	const cached = localStorage.getItem(`pokemon_${name}`);
    if (cached) {
        info.textContent = `From Memory Cache: ${name}`;
        showDetails(JSON.parse(cached));
        return;
    }

	fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
		.then((response) => response.json())
		.then((data) => {
	        info.textContent = `${data.name} From API`;
            localStorage.setItem(`pokemon_${name}`, JSON.stringify(data));
			showDetails(data);
		})
		.catch(() => {
			alert("Unable to load Pokémon details. Please try again later.");
        });
}

function getCharacterDescription(data) {
	const description = document.querySelector("#pokemon-description");
	info.textContent = "Loading description…";
	fetch(data.species.url)
		.then((response) => response.json())
		.then((species) => {
			const entry = species.flavor_text_entries.find((item) => item.language.name === "en");
			trackList.textContent = entry
				? entry.flavor_text.replace(/[\n\f]/g, " ")
				: "No English description is available.";
		})
		.catch(() => description.textContent = "Unable to load the description. Please try again later.");
}

//------------------------------------------------------------
// Restore the album details
//------------------------------------------------------------
function hideAlbumInfo() {
    albumInfo.classList.add("hidden");
    trackPanel.classList.remove("hidden");
}

function showAlbumInfo() {
    albumInfo.classList.remove("hidden");
    trackPanel.classList.add("hidden");
}


//------------------------------------------------------------
// Wire up the Back button
//------------------------------------------------------------
document.getElementById("backBtn").addEventListener("click", showAlbumInfo);
document.getElementById("frontBtn").addEventListener("click", hideAlbumInfo);

document.getElementById("artist").addEventListener("keydown", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        const name = artist.value.trim();
        search(name);
    }
});

loadPokemon();
