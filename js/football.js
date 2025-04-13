    let theKey = keys.keyRapidAPI;
    let card = document.getElementById('card');
	let leagues = document.getElementById('leagues');
	let countries = document.getElementById('countries');
	let country   = document.getElementById('country');
    let dropdownList = document.querySelector(".dropdown-list");
	leagues.addEventListener('click', getLeagueData);
    let leagueData, teamData, selectedCountry;

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': `${theKey}`,
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
        }
    };

document.querySelector(".dropdown-btn").addEventListener("click", toggelDropDown);
async function toggelDropDown() {
    // Toggle visibility
    if (dropdownList.style.display === "block") {
        dropdownList.style.display = "none";
    } else {
        dropdownList.style.display = "block";
    }
}
  
getCountries();
async function getCountries() {
        const url = 'https://api-football-v1.p.rapidapi.com/v3/countries';
    
        try {
            const response = await fetch(url, options);
            const result = await response.json();
            countryData = result.response;
            countries.innerHTML = "";
            for (let x of countryData) {
                countries.innerHTML += `<li id=${x.code}><img src="${x.flag}" alt="${x.name}">${x.name}</li>`;
            }

            // Close dropdown when selecting an item
            document.querySelectorAll(".dropdown-list li").forEach(item => {
                item.addEventListener("click", () => {
                    toggelDropDown();
                    country.innerText = item.innerText;
                    selectedCountry = item.id;
                    leagueData = null;
                });
            });
        } catch (error) {
            console.error(error);
        }
    }

let row = 0;
function buildLeagueCard(data) {
    row++;
    return `
        <div class="w3-col m4 l3 w3-theme-${row%10>5?"l":"d"}${(row%5)+1} disney-card">
            <h2>${data.league.name}</h2>
            <br>
            <img id=${data.league.id} src="${data.league.logo}" onclick="teamsInLeague(${data.league.id})" alt="">
        </div>`;
}

async function getLeagueData() {
    const url = `https://api-football-v1.p.rapidapi.com/v3/leagues?code=${selectedCountry}`;

    try {
        if (! leagueData) {
            const response = await fetch(url, options);
            const result = await response.json();
            leagueData = result.response;
        }
        card.innerHTML = "";
        for (let x of leagueData) {
            card.innerHTML += buildLeagueCard(x);
        }
    } catch (error) {
        console.error(error);
    }
}

async function teamsInLeague(id) {
    const url = `https://api-football-v1.p.rapidapi.com/v3/teams?league=${id}&season=2024`;

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        if (result.status=="failed") {
            card.innerHTML += `${result.message}`;
            return;
        }
        card.innerHTML = "";
        console.log(result.response);
        for (let x of result.response) {
            card.innerHTML += buildTeamCard(x);
        }
    } catch (error) {
        console.error(error);
    }
}

function buildTeamCard(data) {
    row++;
    return `
        <div class="w3-col m4 l3 w3-theme-${row%10>5?"l":"d"}${(row%5)+1} disney-card" style="background-color:${data.qualColor}">
            <h2>${data.team.name}</h4>
            <br>
            <img id=${data.team.id} src="${data.team.logo}" onclick="playersInTeam(${data.team.id})" alt="">
            <h3 id=${data.venue.id}>Venue</h3>
            <img id=${data.venue.id} src="${data.venue.image}" alt="">
            <ul>
            <li>${data.venue.name}</li>
            <li>${data.venue.city}</li>
            <li>${data.venue.capacity}</li>
            </ul>
        </div>`;
}

async function playersInTeam(id){
    const url = `https://api-football-v1.p.rapidapi.com/v3/players?team=${id}&season=2024`;

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        card.innerHTML = "";
        for (let x of result.response) {
            card.innerHTML += buildPlayerCard(x);
        }
    } catch (error) {
        console.error(error);
    }
}

function buildPlayerCard(data) {
    row++;
    return `
        <div class="w3-col m4 l3 w3-theme-${row%10>5?"l":"d"}${(row%5)+1} disney-card">
            <h2>${data.player.name}</h2>
            <img id=${data.player.id} src="${data.player.photo}" alt="">
            <h6>Appearences: ${data.statistics[0].games.appearences}</h6>
            <h6>Lineups:     ${data.statistics[0].games.lineups}</h6>
            <h6>Minutes:     ${data.statistics[0].games.minutes}</h6>
            <br>
        </div>`;
}

function setKey() { theKey = getKey(); }
