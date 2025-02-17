let theKey = keys.keyRapidAPI;
let theMDBKey = keys.keyMDB;
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

const MDBoptions = {
	method: 'GET',
	headers: `Authorization: Bearer ${theMDBKey}`
}

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
            <td onclick=getActor('${b.id}')>${characters}</td>
        </tr>`
        tableBody.innerHTML += txt;
    })
}

function getActor(actorID) {

    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${theMDBKey}`
        }
    };
      
	const url = `https://api.themoviedb.org/3/find/${actorID}?external_source=imdb_id`

	fetch(url, options)
	.then(response => response.json())
	.then(response => actorDetails(response))
	.catch(err => console.error(err));
}
//  --url 'https://api.themoviedb.org/3/search/movie?query=Jack+Reacher'

function actorDetails(details) {
    tableBody.innerHTML = "";
    details.person_results.forEach((a,idx1) => {
        txt = `<tr class="w3-theme-${idx1%2>0?'l2':'l3'}">
                <td>${a.name}</td>
                <td><img src=https://image.tmdb.org/t/p/w500/${a.profile_path} height='120px' )></td>
            </tr>`
            tableBody.innerHTML += txt;
        a.known_for.forEach((b,idx) => {
            genres = b.genre_ids ? b.genre_ids.reduce( (all, c) => `${all} ${allGenres[c]}`,"") : ["ddd"]

            txt = `<tr class="w3-theme-${idx%2>0?'l2':'l3'}">
                <td></td>
                <td><img src=https://image.tmdb.org/t/p/w500/${b.backdrop_path} height='120px' )></td>
                <td><img src=https://image.tmdb.org/t/p/w500/${b.poster_path} height='120px' )></td>
                <td>${b.title}</td>
                <td>${b.release_date}</td>
                <td>${b.overview}</td>
                <td>${genres}</td>
            </tr>`
            tableBody.innerHTML += txt;
        })
    })
}

allGenres = {
    "12"     :"Adventure", "14" :"Fantasy", "16" :"Animation", "18" :"Drama", "27" :"Horror", "28" :"Action", 
    "35"     :"Comedy", "36" :"History", "37" :"Western", "53" :"Thriller", "80" :"Crime", "878" :"Science Fiction", 
    "9648"   :"Mystery", "99" :"Documentary", "10402" :"Music", "10749" :"Romance", "10751" :"Family", "10752" :"War", 
    "10759"  :"Action & Adventure", "10762" :"Kids", "10763" :"News", "10764" :"Reality", "10765" :"Sci-Fi & Fantasy", 
    "10766"  :"Soap", "10767" :"Talk", "10768" :"War & Politics", "10770" :"TV Movie", 
}

 function top250() {
	const url = 'https://imdb236.p.rapidapi.com/imdb/top250-movies';

	fetch(url, options)
	.then(response => response.json())
	.then(response => movies(response))
	.catch(err => console.error(err));
}

function setKey() { theKey = getKey(); }
