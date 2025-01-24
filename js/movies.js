let theKey = keys.keyRapidAPI;
let search = document.getElementById('search');
search.addEventListener('click', movieSearch);

function show(movies) {
    let tableBody = document.getElementById('moviesList');
    //  the map function will take out attributes and merge into
    //  an array representing a TR element
    //  the final join will take these strings in the array and create one BIG string
    //  which we will put into the tableBody
    let movieList = movies.results.map(b => ({
        id:             b.id,
        title:          b.primaryTitle      ?? "Title",
        description:    b.description       ?? "asdfas" ,
        image:          b.primaryImage      ?? "/images/missingImage.jpg",
        links:          b.externalLinks     ?? ["asdfasdf"],
        runtime:        b.runtimeMinutes    ?? ".,.,.",
        releaseDate:    b.releaseDate       ?? "<><><><>",
        genres:         b.genres ? b.genres.reduce( (all, c) => `${all} ${c}`,"") : ["ddd"]
    }));

    movieList.forEach((b,idx) => {
        txt = `<tr class="w3-theme-${idx%2>0?'l2':'l3'}">
            <td><img id=${b.id} src=${b.image} height='120px' alt="" onclick=movieDetails('${b.id}')></td>
            <td><a href=${b.links[0]}>${b.title}</a></td>
            <td>${b.description}</td>
            <td>${b.runtime}</td>
            <td>${b.releaseDate}</td>
            <td class='${b.genres}'>${b.genres}</td>
        </tr>`
        tableBody.innerHTML += txt;
    }
    );
    // "budget": null,
    // "grossWorldwide": null,
    // let txt = arHtml.join("\n")
}

function movieSearch() {
	let searchText = document.getElementById('searchTerm').value;

	const url = `https://imdb236.p.rapidapi.com/imdb/search?originalTitle=${searchText}&type=movie&rows=25&sortField=id&sortOrder=ASC`;
	const options = {
		method: 'GET',
		headers: {
			'x-rapidapi-key': theKey,
			'x-rapidapi-host': 'imdb236.p.rapidapi.com'
		}
	};
	
	fetch(url, options)
	.then(response => response.json())
	.then(response => show(response))
	.catch(err => console.error(err));
}

function movieDetails(movieId) {
	const url = `https://imdb236.p.rapidapi.com/imdb/${movieId}`;
	const options = {
		method: 'GET',
		headers: {
			'x-rapidapi-key': theKey,
			'x-rapidapi-host': 'imdb236.p.rapidapi.com'
		}
	};
	
	fetch(url, options)
	.then(response => response.json())
	.then(response => showMovieDetails(response))
	.catch(err => console.error(err));
}

function showMovieDetails() {
    cast. 
    {id: "nm0958643", url: "https://www.imdb.com/name/nm0958643/", fullName: "René A. Zumbühl", job: "editor", characters: []}
    directors: 
    writers:
    {id: "nm0958643", url: "https://www.imdb.com/name/nm0958643/", fullName: "René A. Zumbühl"}
    url: "https://www.imdb.com/title/tt1483809/"
}

function actorDetails(actorId) {
	const url = `https://imdb236.p.rapidapi.com/imdb/${movieId}/cast`;
	const options = {
		method: 'GET',
		headers: {
			'x-rapidapi-key': theKey,
			'x-rapidapi-host': 'imdb236.p.rapidapi.com'
		}
	};
	
	fetch(url, options)
	.then(response => response.json())
	.then(response => show(response))
	.catch(err => console.error(err));
}

function actorDetails(actorId) {
	const url = 'https://imdb236.p.rapidapi.com/imdb/top250-movies';
	const options = {
		method: 'GET',
		headers: {
			'x-rapidapi-key': theKey,
			'x-rapidapi-host': 'imdb236.p.rapidapi.com'
		}
	};
	
	fetch(url, options)
	.then(response => response.json())
	.then(response => show(response))
	.catch(err => console.error(err));
}

function setKey() { theKey = getKey(); }
