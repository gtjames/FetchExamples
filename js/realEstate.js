//  https://rapidapi.com/apidojo/api/realtor

let key = '10f0d3c959mshe5fca1f0098b852p17d5bajsncdeef06aead7';			//  rapid API

function getHomes() {
    let city     = document.getElementById('city').value;
    let state    = document.getElementById('state').value;
    let sqFtMin  = document.getElementById('sqFtMin').value;
    let sqFtMax  = document.getElementById('sqFtMax').value;
    let baths    = document.getElementById('baths').value;
    let radius   = document.getElementById('radius').value;
    let zip      = document.getElementById('zip').value;
    let beds     = document.getElementById('beds').value;
    let priceMin = document.getElementById('priceMin').value;
    let priceMax = document.getElementById('priceMax').value;
    let limit    = document.getElementById('limit').value;
    let page     = document.getElementById('page').value;

    let url = `https://realtor.p.rapidapi.com/properties/v2/list-for-sale?sort=relevance&prop_type=single_family&limit=${limit}&offset=${page*limit}`;
    url += city.length      > 0 ? `&city=${city}`            : '';
    url += state.length     > 0 ? `&state_code=${state}`     : '';
    url += sqFtMin.length   > 0 ? `&sqft_min=${sqFtMin}`     : '';
    url += sqFtMax.length   > 0 ? `&sqft_max=${sqFtMax}`     : '';
    url += priceMin.length  > 0 ? `&price_min=${priceMin}`   : '';
    url += priceMax.length  > 0 ? `&price_max=${priceMax}` : '';
    url += zip.length       > 0 ? `&postal_code=${zip}` : '';
    url += baths.length     > 0 ? `&baths_min=${baths}`      : '';
    url += radius.length    > 0 ? `&radius=${radius}`        : '';
    url += beds.length      > 0 ? `&radius=${beds}`          : '';

    fetch(url, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": key,
            "x-rapidapi-host": "realtor.p.rapidapi.com"
        }
    })
        .then(response => response.json())
        .then(homes => showHomes(homes.properties))
        .catch(err => console.error(err));
}

// listing_id: "2926707502"
// id: "14527566"
function showHomes(homes) {
    let homeTable = document.getElementById('homeList');
    let html = ``;
    for (let home of homes) {
        if (home.thumbnail == undefined) home.thumbnail = '';
        if (home.agents[0].photo == undefined) home.agents[0].photo = {href: ''};
        if (home.virtual_tour == undefined) home.virtual_tour = {href: ''};

        let price = Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 0}).format(home.price);

        html += `<tr>
		       <td>${price}</td>               <td>${home.building_size.size}</td> <td>${home.address.city}</td>
               <td>${home.address.line}</td>   <td>${home.baths_full}</td>         <td>${home.beds}</td>
               <td><img src='${home.agents[0].photo.href}' width=100px height=100px><br>${home.agents[0].name}</>
		       <td><a href="${home.rdc_web_url}"       target="_blank">${home.property_id}</a></td>
		       <td><a href="${home.virtual_tour.href}" target="_blank"><img src="${home.thumbnail}" width=200px height=100px> </a></td>
            </tr>`;
    }
    homeTable.innerHTML = html;
}

//  not used currently
function getPropertyById() {
    fetch("https://realtor.p.rapidapi.com/properties/v2/detail?property_id=O3599084026", {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": key,
            "x-rapidapi-host": "realtor.p.rapidapi.com"
        }
    })
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
}
