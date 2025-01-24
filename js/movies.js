let theKey = keys.keyRapidAPI;
let search = document.getElementById('search');
document.getElementById('top250').addEventListener('click', top250);
search.addEventListener('click', movieSearch);

const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': theKey,
		'x-rapidapi-host': 'imdb236.p.rapidapi.com'
	}
};

let tableBody = document.getElementById('moviesList');

function movieSearch() {
	let searchText = document.getElementById('searchTerm').value;

	const url = `https://imdb236.p.rapidapi.com/imdb/search?originalTitle=${searchText}&type=movie&rows=25&sortField=id&sortOrder=ASC`;
	
	fetch(url, options)
	.then(response => response.json())
	.then(moviesList => movies(moviesList.results))
	.catch(err => console.error(err));
}

function movies(movies) {
	tableBody.innerHTML = "";

	let movieList = movies.map(b => ({
        id:             b.id,
		rating:			b.contentRating,
		budget:			b.budget,
		gross: 			b.grossWorldwide,
        title:          b.primaryTitle      ?? "Title",
        description:    b.description       ?? "desc" ,
        image:          b.primaryImage      ?? "/images/missingImage.jpg",
        links:          b.externalLinks     ?? ["links"],
        runtime:        b.runtimeMinutes    ?? "Run Time",
        releaseDate:    b.releaseDate       ?? "Release Date",
        interests:      b.interests 		? b.interests.reduce( (all, c) => `${all} ${c}`,"") : ["interests"],
        genres:         b.genres 			? b.genres.reduce   ( (all, c) => `${all} ${c}`,"") : ["genre"]
    }));

    movieList.forEach((b,idx) => {
        txt = `<tr class="w3-theme-${idx%2>0?'l2':'l3'}">
            <td><img id=${b.id} src=${b.image} height='120px' alt="" onclick=movieDetails('${b.id}')></td>
            <td><a href=${b.links[0]}>${b.title} (${b.rating})</a></td>
            <td>${b.description}</td>
            <td>${b.budget} / ${b.gross}</td>
            <td>${b.runtime}</td>
            <td>${b.releaseDate}</td>
            <td class='${b.interests}'>${b.interests}</td>
        </tr>`
        tableBody.innerHTML += txt;
    }
    );
}

function movieDetails(movieId) {
	const url = `https://imdb236.p.rapidapi.com/imdb/${movieId}`;
	
	fetch(url, options)
	.then(response => response.json())
	.then(response => showMovieDetails(response))
	.catch(err => console.error(err));
}

function showMovieDetails(movieDetails) {
	tableBody.innerHTML = "";
    movieDetails.cast.forEach((b,idx) => {
		characters = b.characters ? b.characters.reduce( (all, c) => `${all} ${c}`,"") : ["ddd"]
        txt = `<tr class="w3-theme-${idx%2>0?'l2':'l3'}">
            <td><a href=${b.url}>${b.fullName}</a></td>
            <td>${b.job}</td>
            <td>${characters}</td>
        </tr>`
        tableBody.innerHTML += txt;
    }
    );
    // directors: 
    // writers:
    // {id: "nm0958643", url: "https://www.imdb.com/name/nm0958643/", fullName: "René A. Zumbühl"}
}

function top250() {
	const url = 'https://imdb236.p.rapidapi.com/imdb/top250-movies';

	fetch(url, options)
	.then(response => response.json())
	.then(response => movies(response))
	.catch(err => console.error(err));
}

function setKey() { theKey = getKey(); }
