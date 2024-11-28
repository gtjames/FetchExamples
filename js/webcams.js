let theKey = keys.keyWebcams;
let card     = document.getElementById('card');
let country  = document.getElementById('country');
let category = document.getElementById('category');
let api      = document.getElementById('api');
document.getElementById('search').addEventListener('click', getWebcams);

let row = 0;

function buildWebcamCard(w) {
    row++;
    return `
        <div id=${w.webcamId} class="w3-col m4 l3 w3-theme-${row%10>5?"l":"d"}${(row%5)+1} disney-card">
            <a href="${w.player.live}">${w.title}</a>
            <hr>
            <a href="${w.player.day}">Today</a>
            <a href="${w.player.month}">Last Month</a>
            <a href="${w.player.year}">Last Year</a>
            <a href="${w.player.lifetime}">All</a>
            <a href="${w.urls.detail}">Detail</a>
            <br>
            <p>${w.categories.reduce((all, c) => all + ", " + c.name, "").substring(2)}</p>
            <p>{${w.location.latitude}, ${w.location.longitude}}</p>
            <img src="${w.images.current.preview}" style="width:300px;" alt="">
        </div>`;
}
    // <img src="${w.images.daylight.preview}" alt="">

async function getWebcams() {
    let countries  = Array.from(country.options ).filter(m => m.selected).map(m => m.value).join(",");
    let categories = Array.from(category.options).filter(m => m.selected).map(m => m.value).join(",");

    countries  = "countries="  + countries;
    categories = "categories=" + categories;

    const url = `https://api.windy.com/webcams/api/v3/webcams?${categories}&${countries}&limit=10&offset=0&categoryOperation=or&include=categories,images,location,player,urls`;
    const options = {
        method: 'GET',
        headers: {  'accept': 'application/json', 
                    'x-windy-api-key': theKey, }
    };

    try {
        api.innerText = url;
        const response = await fetch(url, options);
        const result = await response.json();
        let html = result.webcams.map(w => buildWebcamCard(w));
        card.innerHTML = html.join('\n');
    } catch (error) {
        console.error(error);
    }
}
function setKey() { theKey = getKey(); }
