//  https://rapidapi.com/api-sports/api/api-nba
//  https://rapidapi.com/developer/dashboard

let key = '10f0d3c959mshe5fca1f0098b852p17d5bajsncdeef06aead7';			//  rapid API

/**
 *  The 'Get NBA Teams' button was pushed
 *      request the list of teams in the conference selected
 *
 *      This is the start of the process. From here you can click on the
 *      team logo and get their list of games and player roster
 */
function getNBATeams() {
    //  the user has entered a conference into the entry field -- east, west, utah, sacromento
    let conference = document.getElementById('conference').value;

    fetch(`https://api-nba-v1.p.rapidapi.com/teams/confName/${conference}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": key,
            "x-rapidapi-host": "api-nba-v1.p.rapidapi.com"
        }
    })
        .then(response => response.json())
        .then(teams => showNBATeams(teams.api.teams))       //  this function will list all teams in the conference
        .catch(err => console.error(err));
}

/**
 *  Create the HTML to show the team logo and name
 *  clicking on the logo will trigger a request to show the players and the games
 *
 *  I added an event listener on the image to call the GetGameAndRoster function
 */
function showNBATeams(teams) {
    let teamList = document.getElementById('teamList');
    let html = `<div class="row">`;
    for (let team of teams) {
        if (team.logo.length === 0) team.logo = '/images/NBA-Logo.jpg';
        html += `<div class="w3-col m4 l2 bball-card" style="border-style: solid">
				<img src='${team.logo}' alt="" onclick='getGamesAndRoster(${team.teamId})'>
			    <h6>${team.fullName}</h6>
        </div>`;
    }
    teamList.innerHTML = html +'</div>';
}

/**
 *      Using the teamId call the two methods that will
 *      request the team roster AND list of games for that team
 */
function getGamesAndRoster(teamId) {
    getNBATeamRoster(teamId);
    getNBAGameStats(teamId);
    openTab(document.getElementById('rosterBtn'), 'rosterTab')
}

/**
 *      API request to get the team roster
 */
function getNBATeamRoster(teamId) {
    fetch("https://api-nba-v1.p.rapidapi.com/players/teamId/" + teamId, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": key,
            "x-rapidapi-host": "api-nba-v1.p.rapidapi.com"
        }
    })
        .then(response => response.json())
        .then(roster => showNBATeamRoster(roster.api.players))
        .catch(err => console.error(err));
}

/**
 * 
 *      Roster
 *
 *      Player data is added to a <TR> tag
 *          there are a few other fields like weight and height
 *          the leagues I confess I do not understand. Who knew there was a utah, vegas and sacramento league?
 *
 *          An event is added to the player name. Click on the name to get the players list of games
 */
let row = 0;
function showNBATeamRoster(players) {
    let teamTable = document.getElementById('rosterRows');
    let html = ``;
    for (let player of players) {
        let playerId;
        if      (player.leagues.standard   !== undefined)    playerId = player.leagues.standard;
        else if (player.leagues.utah       !== undefined)    playerId = player.leagues.utah;
        else if (player.leagues.vegas      !== undefined)    playerId = player.leagues.vegas;
        else if (player.leagues.sacramento !== undefined)  playerId = player.leagues.sacramento;
        else                                              playerId = {pos: 'none', jersey: JSON.stringify(player.leagues)};
        row++;
        html += `
        <tr class="w3-theme-${row%2===1?'l2':'l3'}">
			<td onclick="getNBAPlayerStats(${player.playerId}, '${player.firstName} ${player.lastName}')"><a>${player.firstName} ${player.lastName}<a/></td>
			<td>${player.collegeName}</td>
			<td>${player.dateOfBirth}</td>
			<td>${playerId.pos}</td>
			<td>${playerId.jersey}</td>
        </tr>`;
    }
    teamTable.innerHTML = html + '</table>';
}

/**
 * 
 *  GameStats
 * 
 *      get a list of all games played for a team
 *
 *
 */
function getNBAGameStats(teamId) {
    fetch(`https://api-nba-v1.p.rapidapi.com/games/teamId/${teamId}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": key,
            "x-rapidapi-host": "api-nba-v1.p.rapidapi.com"
        }
    })
        .then(response => response.json()) //  wait for the response and convert it to JSON
        .then(stats => showTeamGameStats(stats.api.games))
        .catch(err => console.error(err));
}

/**
 *      Show game stats
 *      Home and Visitors teams and scores and where the game was played
 *
 *      the next step for this app is to put the years each in their own tab
 */
function showTeamGameStats(games) {
    for (let year = 2015; year <= 2022; year++ ) {
        let gamesForTheYear = games.filter(g => +g.seasonYear === year);
        gamesByYear(gamesForTheYear, 'G' + year);
    }
}

function gamesByYear(games, tab) {
    let teamTable = document.getElementById(tab + 'Rows');
    let html = ``;
    for (let game of games) {
        row++;
        html = `<tr class="w3-theme-${row%2>0?'l2':'l3'}">
		        <td>${game.arena} </td><td>${game.city}</td><td>${game.gameDuration} </td>
		        <td>${game.hTeam.fullName}</td><td>${game.hTeam.score.points}</td><td  onclick='getGamesAndRoster(${game.hTeam.teamId})'><img src='${game.hTeam.logo}' alt="" width=100px height=100px></td>
		        <td>${game.vTeam.fullName}</td><td>${game.vTeam.score.points}</td><td  onclick='getGamesAndRoster(${game.vTeam.teamId})'><img src='${game.vTeam.logo}' alt="" width=100px height=100px></td>
            </tr>`;
        teamTable.innerHTML += html;
    }
}

/**
 * 
 *  PlayerStats 
 * 
 *      get a list of all games played for this player
 *
 *
 */
function getNBAPlayerStats(playerId, playerName) {
    fetch("https://api-nba-v1.p.rapidapi.com/statistics/players/playerId/" + playerId, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": key,
            "x-rapidapi-host": "api-nba-v1.p.rapidapi.com"
        }
    })
        .then(response => response.json()) //  wait for the response and convert it to JSON
        .then(playerStats => showNBAPlayerStats(playerStats.api.statistics, playerName))
        .catch(err => console.error(err));
}

/**
 *      The player stats have a LOT of numbers
 *      which is ok since that is what this app is all about
 *      with some additional effort the team they played for and team logo could be displayed
 *      but who wants to do that?
 */
function showNBAPlayerStats(playerStats, playerName) {
    let stats = document.getElementById('playerRows');
    document.getElementById('player').innerText = `Games Stats for: ${playerName}`;

    openTab(document.getElementById('playerBtn'), 'playerTab')

    let html = ``;
    for (let stats of playerStats) {
        if (stats.points === "") continue;      //  skip games not played
        row++;
        html += `
        <tr class="w3-theme-${row%2>0?'l2':'l3'}">
            <td>${stats.points}</td>   <td>${stats.min}</td>     <td>${stats.fgm}</td>  <td>${stats.fga}</td>  <td>${stats.fgp}</td>
            <td>${stats.ftm}</td>      <td>${stats.fta}</td>     <td>${stats.ftp}</td>  <td>${stats.tpm}</td>  <td>${stats.tpa}</td>
            <td>${stats.tpp}</td>      <td>${stats.offReb}</td>  <td>${stats.defReb}</td>  <td>${stats.totReb}</td>  <td>${stats.assists}</td>
            <td>${stats.pFouls}</td>   <td>${stats.steals}</td>  <td>${stats.turnovers}</td>  <td>${stats.blocks}</td>  <td>${stats.plusMinus}</td>
        </tr>`;
    }
    stats.innerHTML = html;
}

/**
 *  OpenTab
 *        Disable all tabContent windows and show the select tab panel
 *
 */
function openTab(target, tabName) {
    var i, tabcontent, tablinks;
    //  hide all tabcontent divs
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    //  inactivate (remove the active class) from all tab buttons
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        // tablinks[i].className = tablinks[i].className.replace(" active", "");
        tablinks[i].classList.remove("active");
    }

    //  make the desired tab content visible
    document.getElementById(tabName).style.display = "block";

    //  make the tab button display as the active tab
    target.className += " active";
}
