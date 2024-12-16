    let theKey = keys.keyRapidAPI;

    document.getElementById('search').addEventListener('click', search);
    let tableBody = document.getElementById('resultList');
    let gameBodoy = document.getElementById('tblBody');

    const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key':   `${theKey}`,
        'x-rapidapi-host': 'hockey-highlights-api.p.rapidapi.com'
        }
    };
    
    document.getElementById("details").addEventListener("click", closeModal);
    function closeModal() {
        document.getElementById('details').style.display='none';
    }

function search() {
    const url = 'https://hockey-highlights-api.p.rapidapi.com/teams?limit=100&offset=0';
    fetch(url, options)
    .then(resp => resp.json())          //  wait for the response and convert it to JSON
    .then(teams => {
        let row = 0;
        tableBody.innerHTML = '';
        teams.data.forEach(h => {
            row++;
            let arHtml =
            `<div class="flip-card w3-col m4 l3">
                <div class="flip-card-inner">
                    <div class="flip-card-front w3-theme-${row%10>5?"l":"d"}${(row%5)+1}" id=${h.id} class="drillDown">
                        <img src=${h.logo} height='120px' alt="">
                    </div>
                    <div id=${h.id} onclick=details(this) class="flip-card-back w3-theme-${row%10>5?"d":"l"}${(row%5)+1}">
                        ${h.name}
                        <img src=${h.logo} height='120px' alt="">
                    </div>
                </div>
            </div>`
            tableBody.innerHTML += arHtml;
        });
        let listOfTeams = document.getElementsByClassName('drillDown');
        Array.from(listOfTeams)
            .forEach((team) => team.addEventListener('click', (e) => details()));
    });
}

function details(event) {
    id = event.id; 
    const url = `https://hockey-highlights-api.p.rapidapi.com/last-five-games?teamId=${id}`;

    fetch(url, options)
    .then(resp => resp.json())          //  wait for the response and convert it to JSON
    .then(teams => {
        document.getElementById('details').style.display='block';
        let games = '';
        let row = 0;
        teams.map(g => {
            games += `
            <tr  class="w3-theme-${++row%2===1?'l2':'l3'}" >
            <td><img src=${g.homeTeam.logo} style="width:60px; height:60px;"></td>
            <td><img src=${g.awayTeam.logo} style="width:60px; height:60px;"></td>
            <td>${g.date.substring(0,10)}</td>
            <td>${g.state.score.firstPeriod}</td>
            <td>${g.state.score.secondPeriod}</td>
            <td>${g.state.score.thirdPeriod}</td>
            <td>${g.state.score.overTime}</td>
            <td>${g.state.score.penalties}</td>
            <td>${g.state.score.current}</td></tr>`
            });
            gameBodoy.innerHTML = games;
        });
}

function setKey() { theKey = getKey(); }
