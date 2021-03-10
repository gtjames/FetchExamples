//  https://rapidapi.com/api-sports/api/api-baseball

let key = '10f0d3c959mshe5fca1f0098b852p17d5bajsncdeef06aead7';			//  rapid API

function getMLBTeams() {
    let season = document.getElementById('season').value;
    let league = document.getElementById('league').value;

    fetch(`https://api-baseball.p.rapidapi.com/teams?league=${league}&season=${season}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": key,
            "x-rapidapi-host": "api-baseball.p.rapidapi.com"
        }
    })
        .then(response => response.json()) //  wait for the response and convert it to JSON
        .then(teams => showTeams(teams.response, league, season))
        .catch(err => console.error(err));
}

function showTeams(teams, league, season) {
    let teamTable = document.getElementById('teams');

    let html = `<div class="row">`;

    for (let team of teams) {
        if (team.logo.length == 0) team.logo = '/images/NBA-Logo.jpg';
        html += `
			<div class="col-xs-5 col-sm-3 col-md-2">
				<img src='${team.logo}' height=50px width=50px onclick='getStats(${team.id},${league},${season})'>
				<br>
			    ${team.name}
			</div>`;
    }
    teamTable.innerHTML = html +'</div>';
}

function getStats(id, league, season) {
    fetch(`https://api-baseball.p.rapidapi.com/teams/statistics?league=${league}&season=${season}&team=${id}`, {
        "method": "GET",
            "headers": {
            "x-rapidapi-key": key,
            "x-rapidapi-host": "api-baseball.p.rapidapi.com"
        }
    })
        .then(response => response.json()) //  wait for the response and convert it to JSON
        .then(stats => showStats(stats))
        .catch(err => console.error(err));
}

/*
 *      show the home, away and total stats for the selected team
 *
 */
function showStats(teamStats) {
    let teamTable = document.getElementById('team');
    let games = teamStats.response.games;
    let goals = teamStats.response.goals;

    html = `<tr><th>${teamStats.parameters.season} Season</th><th>Games Played</th><th>Wins</th><th>Percent Wins</th><th>Loses</th><th>Percent Loses</th><th>Points For</th><th>Points Against</th>`;
    html += `
		<tr><td>Home:</td><td>${games.played.home}</td><td>${games.wins.home.total}</td><td>${(games.wins.home.percentage*100).toFixed(0)}%</td><td>${games.loses.home.total}</td><td>${(games.loses.home.percentage*100).toFixed(0)}%</td><td>${goals.for.average.home}</td><td>${goals.against.average.home}</td><td>The ${teamStats.response.team.name}                 <img src=${teamStats.response.team.logo}    width=100px height=70px></td></tr>
		<tr><td>Away:</td><td>${games.played.away}</td><td>${games.wins.away.total}</td><td>${(games.wins.away.percentage*100).toFixed(0)}%</td><td>${games.loses.away.total}</td><td>${(games.loses.away.percentage*100).toFixed(0)}%</td><td>${goals.for.average.away}</td><td>${goals.against.average.away}</td><td>play in the ${teamStats.response.league.name}       <img src=${teamStats.response.league.logo}  width=100px height=70px></td></tr>
		<tr><td>All: </td><td>${games.played.all} </td><td>${games.wins.all.total} </td><td>${(games.wins.all.percentage *100).toFixed(0)}%</td><td>${games.loses.all.total} </td><td>${(games.loses.all.percentage *100).toFixed(0)}%</td><td>${goals.for.average.all} </td><td>${goals.against.average.all} </td><td>which is in the ${teamStats.response.country.name}  <img src=${teamStats.response.country.flag} width=100px height=70px></td></tr>`;
    teamTable.innerHTML = html;
}
