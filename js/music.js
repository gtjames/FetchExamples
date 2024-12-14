import {niceDate, niceTime} from './utils.js';

let theKey = keys.keyRapidAPI;
let search = document.getElementById('search');
    search.addEventListener('click', shoppingSearch);

    function shoppingSearch() {
        let searchText = document.getElementById('itemSearch').value;

        const url = 'https://billboard-api2.p.rapidapi.com/hot-100?date=2019-05-11&range=1-10';
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': theKey,
                'x-rapidapi-host': 'billboard-api2.p.rapidapi.com'
            }
        };
        
        fetch(url, options)
        .then(response => response.json())
        .then(response => show(response))
        .catch(err => console.error(err));
}

function show(products) {
    document.body.innerText = JSON.stringify(products);
}
function setKey() { theKey = getKey(); }
