document.getElementById("save").addEventListener('click', findMovies)
let rows  = document.getElementById("rows");
let cards = document.getElementById('cards');

document.getElementById("id01").addEventListener("click", closeModal);
function closeModal() {
    document.getElementById('id01').style.display='none';
  }

let row = 0;

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': keyRapidAPI,
		'X-RapidAPI-Host': 'imdb-top-100-movies.p.rapidapi.com'
	}
};

function requestData(url, func, opt) {
	fetch(url, opt)
	.then(response => response.json())
	.then(result => func(result))
	.catch (error => {
		console.error(error);
	});
}
function findMovies() {
	cards.innerText = '';
	rows.innerText  = '';
	let card = document.getElementsByName('style')[0].checked;
	requestData('https://imdb-top-100-movies.p.rapidapi.com/', card ? movieCards : listMovies, options);
}

function listMovies(movies) {
	movies.forEach(m => {
		row++;                  //  use the row # to let us alternate the colors of the row
		let tr = `
		<tr id=${m.imdbid} onclick=details(this) class="w3-theme-l${(row%5)+1}">
		<td>${m.rank} - <a href=${m.imdb_link}>${m.title}</a></td>
		<td><img src="${m.image}" alt="" style="width:80px; height:120px;"></td>
		<td>${m.description}</td>
		<td>${m.genre}</td>
		</tr>`;
		rows.innerHTML += tr;
	});
}

function movieCards(movies) {
	movies.forEach(movie => {
		row++;
		let movieHTML = `
		<div class="flip-card w3-col m4 l3">
			<div class="flip-card-inner">
				<div class="flip-card-front w3-theme-${row%10>5?"l":"d"}${(row%5)+1}">
					<img src="${movie.image}" alt="" style="width:140px;height:210px;">
				</div>
				<div id=${movie.imdbid} onclick=details(this) class="flip-card-back w3-theme-${row%10>5?"d":"l"}${(row%5)+1}">
					<a href="${movie.imdb_link}">${movie.rank} - ${movie.title}</a>
					<br>
					<p>${movie.genre}</p>
					${movie.description}
				</div>
			</div>
		</div>`;

		cards.innerHTML += movieHTML
	}); 
}

function details(e) {
	let id = e.id;
	console.log(id);
	//http://www.omdbapi.com
	//requestData('https://imdb-top-100-movies.p.rapidapi.com/top32', movieDetails);
	requestData(`https://www.omdbapi.com/?i=${id}&apikey=2c791b47`, movieDetails, {});
}

function movieDetails(movie) {
    document.getElementById('id01').style.display='block';
    let rows = document.querySelector('#id01 #rows');
    let title = document.getElementById('title');
	title.innerText = movie.Title
	rows.innerHTML = `
	<tr><td colspan="2"><img src="${movie.Poster}" alt="" style="width:100px;height:150px;"></td></tr>
	<tr><td>Actors</td><td>${movie.Actors}</td></tr>
	<tr><td>Plot</td><td>${movie.Plot}</td></tr>
	<tr><td>Awards</td><td>${movie.Awards}</td></tr>
	<tr><td>BoxOffice</td><td>${movie.BoxOffice}</td></tr>
	<tr><td>Rated</td><td>${movie.Rated}</td></tr>
	<tr><td>Released</td><td>${movie.Released}</td></tr>
	<tr><td>Runtime</td><td>${movie.Runtime}</td></tr>
	<tr><td>Writer</td><td>${movie.Writer}</td></tr>
`;
}