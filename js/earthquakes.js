import {getLocation, locationRetrieved, lat, lon} from './utils.js';

let card = document.getElementById('card');
let term = document.getElementById('quakeSearch');
document.getElementById('search').addEventListener('click', quakesWithinRadius);

const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '498ed225bamshcd02cf5559e10edp179d21jsn59b140b93ec5',
        'X-RapidAPI-Host': 'everyearthquake.p.rapidapi.com'
    }
};

let row = 0;
getLocation(earthquakesNearMe);

function earthquakesNearMe() {
    const url = `https://everyearthquake.p.rapidapi.com/latestEarthquakeNearMe?latitude=${lat}&longitude=${lon}`;
    
    try {
        fetch(url, options)
            .then(resp => resp.json())
            .then(result => render(result.data) );
    } catch (error) {
        console.error(error);
    }
}

function quakesWithinRadius() {
    // let pos = JSON.parse(term.value);
    // lat = pos.lat;
    // lon = pos.lon;
    closeByQuakes(lat, lon, term.value)
}


function closeByQuakes(long, lat, radius) {
    const url = `https://everyearthquake.p.rapidapi.com/earthquakes?start=1&count=100&type=earthquake&latitude=${lat}&longitude=${long}&radius=${radius}&units=miles&magnitude=3&intensity=1`;
    try {
        fetch(url, options)
            .then(resp => resp.json())
            .then(result => render(result.data) );
    } catch (error) {
        console.error(error);
    }
}

function render(result) {
    card.innerHTML = "";
    result.forEach(story => {
            let storyHTML = buildCard(story);
            card.innerHTML += storyHTML
        }); 
}

function buildCard(story) {
    row++;
    return `
        <div class="w3-col m4 l3 w3-theme-${row%10>5?"l":"d"}${(row%5)+1} disney-card">
            <a href="${story.url}">${story.title}</a>
            <br>
            ${story.date}
        </div>`;
}
