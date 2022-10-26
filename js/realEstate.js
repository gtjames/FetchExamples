//  https://rapidapi.com/apidojo/api/realtor

let key = 'e233e8491amsh3f84c68f6a9ba43p14709ejsn95a2400504a3';			//  rapid API

let search = document.getElementById('search');
search.addEventListener('click', getHomes);

function getHomes() {
    let city     = document.getElementById('city').value;
    let sqFtMin  = document.getElementById('sqFtMin').value;
    let sqFtMax  = document.getElementById('sqFtMax').value;
    let baths    = document.getElementById('baths').value;
    let beds     = document.getElementById('beds').value;
    let priceMin = document.getElementById('priceMin').value;
    let priceMax = document.getElementById('priceMax').value;
    let page     = document.getElementById('page').value;

    let url = `https://realtor16.p.rapidapi.com/forsale?`;
    url += city.length      > 0 ? `&location=${city}`           : '';
    url += sqFtMin.length   > 0 ? `&sqft-min=${sqFtMin}`        : '';
    url += sqFtMax.length   > 0 ? `&sqft-max=${sqFtMax}`        : '';
    url += priceMin.length  > 0 ? `&list_price-min=${priceMin}` : '';
    url += priceMax.length  > 0 ? `&list_price-max=${priceMax}` : '';
    url += baths.length     > 0 ? `&baths_min=${baths}`         : '';
    url += beds.length      > 0 ? `&beds_min=${beds}`           : '';
    console.log(url);
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': key,
            'X-RapidAPI-Host': 'realtor16.p.rapidapi.com'
        }
    };
    
    fetch(url, options)
        .then(response => response.json())
        .then(homes => showHomes(homes))
        .catch(err => console.error(err));
}

// listing_id: "2926707502"
// id: "14527566"
function showHomes(homes) {
    let homeTable = document.getElementById('homeList');
    if (homes.message !== null) {
        homeTable.innerHTML = 'out of requests for the month';
        return;
    }
    let html = ``;
    for (let home of homes.home_search.results) {
        if (home.primary_photo === null) home.primary_photo = {'href': ''};

        let price = Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 0}).format(home.list_price);

        html += `<tr onclick='getPropertyById(${home.property_id})'>
            <td>${price}</td>
            <td>${home.description.sqft}</td>
            <td>${home.location.address.city}</td>
            <td>${home.location.address.line}</td>   
            <td>${home.description.baths_full}</td>
            <td>${home.description.beds}</td>
            <td>${home.branding[0].name}</td>        
            <td>${home.property_id}</td>
            <td><img src="${home.primary_photo.href}" width=200px height=100px alt=""></td>
        </tr>`;
    }
    homeTable.innerHTML = html;
}

function getPropertyById(property_id) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '498ed225bamshcd02cf5559e10edp179d21jsn59b140b93ec5',
            'X-RapidAPI-Host': 'realtor16.p.rapidapi.com'
        }
    };
    
    fetch(`https://realtor16.p.rapidapi.com/property?property_id=${property_id}`, options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));}
