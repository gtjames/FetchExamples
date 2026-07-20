let theKey = keys.keyRapidAPI;
let theMDBKey = keys.keyRapidAPI2;
let page = 0;
let search = document.getElementById('search');
document.getElementById('top250').addEventListener('click', top250);
document.getElementById('popular').addEventListener('click', popular);
document.getElementById('upcoming').addEventListener('click', upcoming);

search.addEventListener('click', movieSearch);

const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': theMDBKey,
		'x-rapidapi-host': 'imdb236.p.rapidapi.com',
		'Content-Type': 'application/json'
	}
};

let tableBody = document.getElementById('moviesList');

function movieSearch() {
	let searchText = document.getElementById('searchTerm').value;

    const url = `https://imdb236.p.rapidapi.com/api/imdb/search?originalTitle=${searchText}&type=movie&rows=10&sortOrder=ASC&sortField=id`;

	fetch(url, options)
	.then(response => response.json())
	.then(moviesList => movies(moviesList.results))
	.catch(err => console.error(err));
}

function movies(movies) {
	tableBody.innerHTML = "";

    movies.forEach((movie, index) => {
        // Validate that movie is an object before accessing properties
        if (movie && typeof movie === "object") {
            // console.log(`#${index + 1}: ${(movie.interests??[]).join(", ")}`);
            // console.log(`${JSON.stringify(movie)}`);
        } else {
            console.warn(`Invalid movie at index ${index}`);
        }
    });

    let movieList = movies.map(b => ({
        id:             b.id,
		rating:			b.contentRating     ?? "",
        title:          b.primaryTitle      ?? "",
		budget:			b.budget            ?? "",
		url:			b.url,
		gross: 			b.grossWorldwide    ?? "",
        title:          b.originalTitle     ?? "Title",
        description:    b.description       ?? "desc" ,
        image:          b.primaryImage      ?? "/images/missingImage.jpg",
        links:         (b.externalLinks ?? []).reduce( (all, c) => `${all} <a href="${c}">Link</a>`,"") ?? "",
        runtime:        b.runtimeMinutes    ?? "Runtime Missing",
        releaseDate:    b.startYear         ?? "",
        // assign empty string if the array is null otherwise reduce the array to a string with spaces between the items
        interests:     (b.interests  ?? []).reduce( (all, c) => `${all} ${c}`, ""),
        thumbnails:    (b.thumbnails ?? []).reduce( (all, c) => `${all} <img src="${c.url}" height="100">`,"") ?? "",
        genres:        (b.genres     ?? []).reduce( (all, c) => `${all}, ${c}`,"") ?? "",
    }));

// trailer:null

movieList.forEach((b,idx) => {
        txt = `<tr class="w3-theme-${idx%2>0?'l2':'l3'}">
            <td><img id=${b.id} src=${b.image} height='120px' alt="" onclick=movieDetails('${b.id}')><br>${b.title}</td>
            <td>${b.links}</td>
            <td>${b.description}</td>
            <td>${b.budget} / ${b.gross}</td>
            <td>${b.runtime}</td>
            <td>${b.releaseDate}</td>
            <td><a href="${b.url}" target="_blank">IMDB</a></td>
            <td class='${b.interests}'>${b.interests}</td>
        </tr>`
        tableBody.innerHTML += txt;
    }
    );
}

function movieDetails(movieId) {
    const url = `https://imdb236.p.rapidapi.com/api/imdb/${movieId}`;
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
            <td>${b.fullName}</td>
            <td><a href=${b.url}>${b.job}</a></td>
            <td onclick=getActor('${b.id}')>${characters}</td>
        </tr>`
        tableBody.innerHTML += txt;
    })
}

function getActor(actorID) {
	const url = `https://imdb236.p.rapidapi.com/api/imdb/name/${actorID}`;

	fetch(url, options)
	.then(response => response.json())
	.then(response => actorDetails(response))
	.catch(err => console.error(err));
}
idx1 = 0;
function actorDetails(details) {
// primaryProfessions(3) ['actor', 'producer', 'director']
url:"https://www.imdb.com/name/nm0000380/"
idx1++;
    tableBody.innerHTML = "";
    txt = `<tr class="w3-theme-${idx1%2>0?'l2':'l3'}">
            <td>${details.name}</td>
            <td><img src=${details.primaryImage} height='120px' )></td>
        </tr>`
    tableBody.innerHTML += txt;
    txt = `<tr class="w3-theme-${idx1%2>0?'l2':'l3'}">
            <td>${details.biography}</td>
        </tr>`
    tableBody.innerHTML += txt;
    txt = `<tr class="w3-theme-${idx1%2>0?'l2':'l3'}">
            <td></td>
            <td><img src=${details.thumbnails[0]} height='120px' )></td>
        </tr>`
    tableBody.innerHTML += txt;
}

allGenres = {
    "12"     :"Adventure", "14" :"Fantasy", "16" :"Animation", "18" :"Drama", "27" :"Horror", "28" :"Action",
    "35"     :"Comedy", "36" :"History", "37" :"Western", "53" :"Thriller", "80" :"Crime", "878" :"Science Fiction",
    "9648"   :"Mystery", "99" :"Documentary", "10402" :"Music", "10749" :"Romance", "10751" :"Family", "10752" :"War",
    "10759"  :"Action & Adventure", "10762" :"Kids", "10763" :"News", "10764" :"Reality", "10765" :"Sci-Fi & Fantasy",
    "10766"  :"Soap", "10767" :"Talk", "10768" :"War & Politics", "10770" :"TV Movie",
}

function upcoming() {
    const url = 'https://imdb236.p.rapidapi.com/api/imdb/upcoming-releases?countryCode=US&type=MOVIE';

    fetch(url, options)
    .then(response => response.json())
    .then(response => movies(response.flatMap(item => item.titles)))
    .catch(err => console.error(err));
}

function popular() {
    const url = 'https://imdb236.p.rapidapi.com/api/imdb/most-popular-movies';

    fetch(url, options)
    .then(response => response.json())
    .then(response => movies(response))
    .catch(err => console.error(err));
}

function top250() {
    const url = 'https://imdb236.p.rapidapi.com/api/imdb/top250-movies';

	fetch(url, options)
	.then(response => response.json())
	.then(response => movies(response))
	.catch(err => console.error(err));
}

function setKey() { theKey = getKey(); }
