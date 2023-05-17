import {getLocation, locationRetrieved, lat, lon} from './utils.js';

let card = document.getElementById('card');
let term = document.getElementById('newsSearch');
document.getElementById('search').addEventListener('click', earthquakesNearMeInput);

let row = 0;
getLocation(earthquakesNearMe);

function earthquakesNearMeInput() {
    let pos = JSON.parse(term.value);
    lat = pos.lat;
    lon = pos.lon;
    earthquakesNearMe()
}

function earthquakesNearMe() {
    const url = `https://everyearthquake.p.rapidapi.com/latestEarthquakeNearMe?latitude=${lat}&longitude=${lon}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '498ed225bamshcd02cf5559e10edp179d21jsn59b140b93ec5',
            'X-RapidAPI-Host': 'everyearthquake.p.rapidapi.com'
        }
    };
    
    try {
        fetch(url, options)
            .then(resp => resp.json())
            .then(result => render(lat, lon, result.data) );
    } catch (error) {
        console.error(error);
    }
}

function render(lat, long, result) {

    result.forEach(story => {
            let storyHTML = buildNewsCard(story);
            card.innerHTML += storyHTML
        }); 
}

function buildNewsCard(story) {
    row++;
    return `
        <div class="w3-col m4 l3 w3-theme-${row%10>5?"l":"d"}${(row%5)+1} disney-card">
            <a href="${story.url}">${story.title}</a>
            <br>
            ${story.date}
        </div>`;
}

function recentQuakes(long, lat, radius, render) {
    const url = `https://everyearthquake.p.rapidapi.com/earthquakes?start=1&count=100&type=earthquake&latitude=${lat}&longitude=${long}&radius=${radius}&units=miles&magnitude=3&intensity=1`;
    const options = {
	    method: 'GET',
	    headers: {
	    	'X-RapidAPI-Key': '498ed225bamshcd02cf5559e10edp179d21jsn59b140b93ec5',
	    	'X-RapidAPI-Host': 'everyearthquake.p.rapidapi.com'
	    }
    };

    try {
        fetch(url, options)
            .then(resp => resp.json())
            .then(result => render(result) );
    } catch (error) {
        console.error(error);
    }
}