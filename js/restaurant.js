    let theKey = keys.keyRapidAPI;
    open = false;
    document.getElementById('search').addEventListener('click', search);
    document.getElementById('next').addEventListener('click', next);
    document.getElementById('prev').addEventListener('click', prev);
    let term     = document.querySelector('#searchTerm');
    let results  = document.querySelector('#resultList');
    //  498ed225bamshcd02cf5559e10edp179d21jsn59b140b93ec5
    const options = {
	    method: 'GET',
	    headers: {
            'x-rapidapi-key': '498ed225bamshcd02cf5559e10edp179d21jsn59b140b93ec5',
            'x-rapidapi-key':   `${theKey}`,
        }
    };
    document.getElementById("details").addEventListener("click", closeModal);
    function closeModal() {
        document.getElementById('details').style.display='none';
        open = false;
    }

let page = 0;
function next() { search(++page); }
function prev() { search(--page); }

function search(offset=0) {

    offset = offset < 0 ? 0 : offset;
    restaurant = term.value;
    let url = `https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/searchLocation?query=${restaurant}`;
    console.log(url);
    fetch(url, options)
    .then(resp => resp.json())          //  wait for the response and convert it to JSON
    .then(loc => {

        url = `https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/searchRestaurants?locationId=${loc.data.propertyId}`;
        fetch(url, options)
        .then(resp => resp.json())          //  wait for the response and convert it to JSON
        .then(restaurants => {


// documentId: "loc;56073;g56073"
// latitude: 32.64891
// localizedAdditionalNames: {longOnlyHierarchy: "Texas, United States, North America"}
// locationId: 56073
// locationV2: {placeType: "CITY", hierarchy: Object, names: {longOnlyHierarchyTypeaheadV2: "Texas, United States"}, vacationRentalsRoute: {url: "/VacationRentals-g56073-Reviews-Kennedale_Texas-Vacation_Rentals.html"}}
// longitude: -97.22477
// locData.propertyId: 56073
// streetAddress: {street1: null}
// thumbnail: {photoSizeDynamic: {maxWidth: 4320, maxHeight: 3240, urlTemplate: "https://dynamic-media-cdn.tripadvisor.com/media/ph…/87/sonora-city-park.jpg?w={width}&h={height}&s=1"}}


        let row = 0;
        results.innerHTML = '';
        restaurants.data.data.forEach(h => {
            row++;
            let arHtml = `
                <div class="w3-col m4 l3 disney-card w3-theme-d${row}" id=${h.id}>
                    <h4>${h.title}</h4>
                    <img src=${h.image} onclick=details(${h.id}) height='120px' alt="">
                </div>`;
            results.innerHTML += arHtml;
        });
    });
    });
}

function details(id) {
    const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${id}/information`;

    fetch(url, options)
    .then(resp => resp.json())
    .then(r => {
        if (!open)
            document.getElementById('details').style.display='block';
        open = true;
        // document.getElementById('image').src = r.image;
        document.getElementById('recipeName').innerHTML = r.title;
        instructions = r.instructions
        .replaceAll("<ol>","")
        .replaceAll("</ol>","")
        .replaceAll("<li>","<div class='step'>")
        .replaceAll("</li>","</div>")

        //  <img src=https://img.spoonacular.com/ingredients_100x100/${i.image} height='30px' width='30px' alt="">
        document.getElementById('instructions').innerHTML = instructions;
        li = r.extendedIngredients.map(i => `<li>${i.original}</li>`);
        li.push(`<li>Serves: ${r.servings}</li>`);
        document.getElementById('ingredients').innerHTML = li.join("");
        document.getElementById('cr').innerText = r.creditsText;
        document.getElementById('source').href = r.sourceUrl;
        document.getElementById('spoon').href = r.spoonacularSourceUrl;
        document.getElementById('summary').innerHTML = r.summary;
        // document.getElementById('image').src = r.image;
        });
    }

function setKey() { theKey = getKey(); }
