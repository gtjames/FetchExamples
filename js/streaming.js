const apiKey = "498ed225bamshcd02cf5559e10edp179d21jsn59b140b93ec5";

const headers = {
    "x-rapidapi-key": apiKey,
    "x-rapidapi-host": "streaming-availability.p.rapidapi.com",
    "Content-Type": "application/json"
};

const resultsDiv = document.getElementById("results");
const detailsDiv = document.getElementById("details");

document
    .getElementById("searchButton")
    .addEventListener("click", searchMovies);

async function searchMovies() {

    const title = document
        .getElementById("movieTitle")
        .value
        .trim();

    if (title === "")
        return;

    resultsDiv.innerHTML = "Searching...";
    detailsDiv.innerHTML = "";

    const url =
`https://streaming-availability.p.rapidapi.com/shows/search/title?title=${title}&series_granularity=show&show_type=movie&output_language=en&country=US`;

    try {

        const response = await fetch(url,{
            method:"GET",
            headers
        });

        const data = await response.json();
		console.log(data[0]);
        displayResults(data);

    }
    catch(error){
        console.error(error);
        resultsDiv.innerHTML = "Error contacting API.";
    }
}

function displayResults(data){

    resultsDiv.innerHTML = "";

    if (!data || data.length === 0){
        resultsDiv.innerHTML = "No movies found.";
        return;
    }

    data.forEach(movie=>{
        const div = document.createElement("div");
        div.className = "movie";

		//	what if movie.streamingOptions is undefined?  Then we will get an error.  So let's check for that first
		if (!movie.streamingOptions || !movie.streamingOptions.us) {
			div.innerHTML = `<strong>${movie.title}</strong>
			 (${movie.releaseYear})<br>
			 <em>No streaming options available</em>`;
			resultsDiv.appendChild(div);
		} else {
			logos = new Set();
			movie.streamingOptions.us.forEach(service => {
				// create a set of logos for each service, so we don't have duplicates
				if (!logos.has(service.service.imageSet.lightThemeImage)) {
					logos.add(service.service.imageSet.lightThemeImage);
				}
			});
			img = "";
			logos.forEach(logo => {
				img += `<img src="${logo}" class="poster">`;
			});
			div.innerHTML = `<strong>${movie.title}</strong>
			 (${movie.releaseYear})<br>${img}`;
			resultsDiv.appendChild(div);
		};
		div.addEventListener("click", () => {
		    document.querySelectorAll(".movie").forEach(m =>
	    	    m.classList.remove("selected"));
		    div.classList.add("selected");
		    getMovie(movie.id);
		});

        resultsDiv.appendChild(div);

    });

}

async function getMovie(id){

    const url =
`https://streaming-availability.p.rapidapi.com/shows/${id}?series_granularity=episode&output_language=en`;

    detailsDiv.innerHTML = "Loading...";

    try{

        const response = await fetch(url,{
            method:"GET",
            headers
        });

        const movie = await response.json();
        displayMovie(movie);

    }
    catch(error){
        console.error(error);
    }

}

function displayMovie(movie){
    detailsDiv.innerHTML = `
		<h2>${movie.title}</h2>
		${movie.imageSet?.verticalPoster?.w360
			? `<img src="${movie.imageSet.verticalPoster.w360}">` : ""}
	    <p><strong>Year:</strong> ${movie.releaseYear}</p>
        <p><strong>Rating:</strong> ${movie.rating}</p>
        <p><strong>Runtime:</strong> ${movie.runtime} minutes</p>
        <p>${movie.overview}</p>`;
}