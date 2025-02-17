    let theKey = keys.keyRapidAPI;
    open = false;
    document.getElementById('search').addEventListener('click', search);
    document.getElementById('next').addEventListener('click', next);
    document.getElementById('prev').addEventListener('click', prev);
    let term     = document.querySelector('#searchTerm');
    let results  = document.querySelector('#resultList');

    const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key':   `${theKey}`,
        'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
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
    //      &includeIngredients=cheese%2Cnuts&excludeIngredients=eggs
    ingredient = term.value;
    const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?query=${ingredient}&instructionsRequired=true&fillIngredients=false&addRecipeInformation=false&addRecipeInstructions=false&addRecipeNutrition=false&offset=${offset*20}&number=20`;
    fetch(url, options)
    .then(resp => resp.json())          //  wait for the response and convert it to JSON
    .then(recipes => {
        let row = 0;
        results.innerHTML = '';
        recipes.results.forEach(h => {
            row++;
            let arHtml = `
                <div class="w3-col m4 l3 disney-card w3-theme-d${row}" id=${h.id}>
                    <h4>${h.title}</h4>
                    <img src=${h.image} onclick=details(${h.id}) height='120px' alt="">
                </div>`;
            results.innerHTML += arHtml;
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
