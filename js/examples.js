import {getLocation, KtoF, lat, locationRetrieved, lon, niceDate, niceTime, windDirection} from './utils.js';

/**
 *      Initialization
 *          add listeners to the buttons
 *          trigger the request to get the current location
 */
    document.getElementById('getMovies' ).addEventListener('click', getMovies);
    document.getElementById('getWeather').addEventListener('click', getWeather);
    document.getElementById('getNasa'   ).addEventListener('click', getNasa);

    getLocation('weatherList');

/**
 *      Enter a movie title in the search box and press the button
 *          Search IMDB for similar titles
 *          Returned data will be title, description, and movie poster
 *          Users can click on the title to see the IMDB entry
 *          or click on the image to get details on that movie (a second API request)
 */
function getMovies() {
    let movieList  = document.getElementById('movieList');          //  where we will put our list of matching movies
    let movieTitle = document.getElementById('movie');              //  movie title entry field
    let json       = document.getElementById('json').checked;       //  show JSON or not

    //  no movie? no search
    if (movieTitle.value.length === 0) {
        movieList.innerText = "Enter a Movie to search for";
        return;
    }    

    //  add movie to the search API
    let url = `https://imdb-api.com/en/API/SearchMovie/k_lLeNEBFq/${movieTitle.value}`;
    console.log(url);

    //  make the request
    fetch(url)
        .then(response => response.json())
        .then(movies => {
            
            if (json) {                                     //  if JSON is checked show only the JSON data
                document.body.innerText = JSON.stringify(movies);
                return;
            }

            //  extract the interesting data from the JSON object and show it to the user
            //  We will build the HTML to be inserted
            //  The variable innerHTML will hold our work in progress
            let innerHTML = "";

            //  there is a little bit of data with this API not much.
            //  if you want more details click on the movie image
            for (let movie of movies.results) {
                //  let's build a nice card for each movie
                //  this is a GREAT opportunity to Reactify this code. But for now I will keep it simple
                //        movie id will be used for the listener
                innerHTML +=
                    `<div class="grid-item">
                        <a href="https://www.imdb.com/title/${movie.id}">
                            <h4>${movie.title}</h4>
                        </a>
                        <h4>Description: ${movie.description}</h4>
                        <img src='${movie.image}' height="200px" id="${movie.id}" alt="">
                    </div>`;
            }

            //  and finally take the finished HTML and stuff it into the web page
            movieList.innerHTML = innerHTML;

            //  we can't add the event listener until now because the elements do not exist until
            //  AFTER the innerHTML takes effect and creates the individual elements for each movie
            for (let movie of movies.results) {
                //  NOW we can add a click event listener for the image which will show us the movie details
                document.getElementById(movie.id).addEventListener('click', movieDetails);
            }
        });
}

//  The user can get more movie details by clicking on the movie poster to get to this code
/**
 *      Movie was clicked now show the details
 *          add link to the actor's image to take the user to the IMDB actor details page
 */
function movieDetails() {
    let movieList = document.getElementById('movieList');           //  this is where we will put our movie details
    let json      = document.getElementById('json').checked;        //  show JSON or not

    //  the id of the image is the IMDB ID we want details on
    let url = `https://imdb-api.com/en/API/Title/k_qa7p2g6c/${this.id}`; //  search for movies with this ID
    console.log(url);

    //  using the movie details API get additional data about the movie
    fetch(url)
        .then(response => response.json())
        .then(movie => {

            if (json) {                                     //  if JSON checked show only the JSON data
                document.body.innerText = JSON.stringify(movie);
                return;
            }

            //  extract the interesting data from the JSON object and show it to the user
            //  We will build the HTML to be inserted later.
            //  The variable innerHTML will hold our work in progress
            let innerHTML = "";

            //  there is a LOT of data with this API. We will only do something with the array of actors data
            //  this is a GREAT opportunity to Reactify this code. But for now I will keep it simple
            innerHTML +=
                `<div class="grid-item">
                    <h4>Description: ${movie.title}</h4>
                    <h4>Relesase Date: ${movie.releaseDate}</h4>
                    <h4>Plot: ${movie.plot}</h4>
                    <img src='${movie.image}' height="200px" alt="">
                <ul>`;

            //  show the actor's name, picture, the character they playe and add a link to IMDB for the actor
            for (let actor of movie.actorList) {
                innerHTML +=
                    `<li>
                        <a href="https://www.imdb.com/name/${actor.id}">
                            <img src="${actor.image}" height="120px" alt="">
                        </a>
                        Name: ${actor.name} as ${actor.asCharacter}
                    </li>`;
            }
            innerHTML += "</ul></div>";
            //  and finally take the finished URL and stuff it into the web page
            movieList.innerHTML = innerHTML;
        });
}

/**
 *          Get the current weather forecast either of the city or the Lat Long location
 */
function getWeather() {
    let weatherList = document.getElementById('weatherList');               //  all weather reports go here
    let city        = document.getElementById('city');                      //  city
    let cityEntered = document.getElementById('city').value.length > 0;     //  was the City entered?
    let latitude    = document.getElementById('lat');                       //  Latitude
    let longitude   = document.getElementById('lon');                       //  Longitude
    let allDays     = document.getElementById('allDays').checked;           //  show all days of the forecast
    let json        = document.getElementById('json').checked;              //  show JSON or not

    if (!locationRetrieved) {
        weatherList.innerText = "Be patient, location not yet retrieved";
        return;
    }

    //  let's build the API based on the data from the form.
    //      If city is entered use forecast data
    //      otherwise use the onecall API
    let url =`https://api.openweathermap.org/data/2.5/`;
    if (cityEntered > 0) {
        url += `forecast?q=${city.value}`;
    } else if (latitude.value.length > 0 && longitude.value.length > 0) {
        url += `onecall?lat=${latitude.value}&lon=${longitude.value}&exclude=minutely,hourly`;
    } else {
        url += `onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly`;
    }
    url += `&appid=a099a51a6362902523bbf6495a0818aa`;

    console.log(url);
    //  this is all there is to it
    //      make the request
    fetch(url)
        .then(response => response.json())  //  wait for the response and convert it to JSON
        .then(weather => {                  //  with the resulting JSON data do something

            if (json) {                     //  if JSON is checked show only the JSON data
                document.body.innerText = JSON.stringify(weather);
                return;
            }

            //  If the city was entered extract weather based on that API else use the LatLon API result format
            let wx =  (cityEntered) ? cityToWeather(weather, allDays) : latLonToWeather(weather);

            //  extract the interesting data from the JSON object and show it to the user
            //  We will build the HTML to be inserted later.
            //  The variable innerHTML will hold our work in progress
            let innerHTML = "";

            //  We have converted the Lon Lat API (onecall) and City API (forecast) requests to the same format
            for (let day of wx.daily) {
                //  let's build a nice card for each day of the weather data
                //  this is a GREAT opportunity to Reactify this code. But for now I will keep it simple
                innerHTML +=
                    `<div class="grid-item">
                        <h2>Date: ${day.date}</h2>
                        <h4>Temp: Low ${day.min}&deg; / High: ${day.max}&deg;</h4>
                        <p>Forecast: <img src='http://openweathermap.org/img/wn/${day.icon}@2x.png' alt=""> ${day.description}</p>
                        <p>Chance of rain at ${day.pop}%</p>
                        <p>Wind at ${day.wind_speed} mph out of the ${day.windDirection}</p>
                        <p>Sunrise: ${day.sunrise} / Sunset: ${day.sunset}</p>
                    </div>`;
            }
            //  and finally take the finished URL and stuff it into the web page
            weatherList.innerHTML = innerHTML;
            city.value = wx.city;
            latitude.value = wx.lat;
            longitude.value = wx.lon;
        });
}

/**
 *      Depending on the API used the data returned by Open Weather is in a different format
 *          one format is used for requesting weather by city another of requesting by Longitude and Latitude
 *      I want to use the same code to display the weather report. This module will standardize
 *          the data coming from the City API request
 * 
 * @param data  -   city API weather format
 * @param all   -   show ALL weather forecasts
 */
function cityToWeather(data, all) {
    let wx = {};
    wx.daily = data.list.filter((w,i) =>  all || i % 4 === 0).map(d => ({
        date:           niceDate(d.dt, data.city.timezone) + ' ' + niceTime(d.dt, data.city.timezone),
        min:            KtoF(d.main.temp_min),
        max:            KtoF(d.main.temp_max),
        sunrise:        niceTime(data.city.sunrise, data.city.timezone),
        sunset:         niceTime(data.city.sunset, data.city.timezone),
        icon:           d.weather[0].icon,
        description:    d.weather[0].description,
        wind_speed:     d.wind.speed.toFixed(0),
        windDirection:  windDirection(d.wind.deg),
        pop:            (d.pop * 100).toFixed(0),
        feels_like:     KtoF(d.main.feels_like),
        dewPoint:       0,
        humidity:       d.main.humidity,
    }));
    wx.city = data.city.name;
    wx.lat  = data.city.coord.lat;
    wx.lon  = data.city.coord.lon;
    return wx;
}

/**
 *      Depending on the API used the data returned by Open Weather is in a different format
 *          one format is used for requesting weather by city another of requesting by Longitude and Latitude
 *      I want to use the same code to display the weather report. This module will standardize
 *          the data coming from the Longitude / Latitude API request
 * 
 * @param data  -   city API weather format
 */
function latLonToWeather(data) {
    let wx = {};
    wx.daily = data.daily.map(d => ({
        date:           niceDate(d.dt,data.timezone_offset),
        min:            KtoF(d.temp.min),
        max:            KtoF(d.temp.max),
        sunrise:        niceTime(d.sunrise, data.timezone_offset),
        sunset:         niceTime(d.sunset, data.timezone_offset),
        icon:           d.weather[0].icon,
        description:    d.weather[0].description,
        wind_speed:     d.wind_speed.toFixed(0),
        windDirection:  windDirection(d.wind_deg),
        pop:            (d.pop * 100).toFixed(0),
        feels_like:     KtoF(d.feels_like.day),
        dewPoint:       d.dew_point,
        humidity:       d.humidity,
    }));
    wx.city = "";
    wx.lat  = data.lat;
    wx.lon  = data.lon;
    return wx;
}

/**
 *          Simple URL to get the NASA Astronomy Picture of the day.
 * 
 *          Here we see again the basic pattern of creating a request URL which returns JSON data
*/
function getNasa() {
    let url = 'https://api.nasa.gov/planetary/apod?api_key=Aw0TZ7aE7e6WJnh4t7plOXEk1xdbCg45NMqfUX42';

    let queryDate = document.getElementById('queryDate');           //  Date of the Picture to show
    let date      = document.getElementById('date');                //  Date of the Picture
    let title     = document.getElementById('title');               //  Picture Title
    let explanation = document.getElementById('explanation');       //  Explanation
    let media     = document.getElementById('media');               //  show image or video
    let json      = document.getElementById('json').checked;        //  show JSON or not

    //  if the user entered a date we will append that to the APOD API
    if (queryDate.value.length > 0) {
        url += '&date=' + queryDate.value;
    }
    console.log(url);

    //  this is all there is to it
    //      make the request
    fetch(url)
        .then(response => response.json())  //  wait for the response and convert it to JSON
        .then(apod => {                     //  with the resulting JSON data do something

            if (json) {                     //  if JSON is checked show only the JSON data
                document.body.innerText = JSON.stringify(apod);
                return;
            }

            //  sometimes we get an image other times we get a video
            if (apod.media_type === 'image') {
                media.innerHTML = `<img src="${apod.hdurl}" height="300px" alt="">`;
            }
            else {
                media.innerHTML = `<iframe width="960" height="540" src="${apod.url}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>`;
            }
            //  extract the interesting data from the JSON object and show it to the user
            date.innerText = apod.date;
            explanation.innerText = apod.explanation;
            title.innerText = apod.title;
        });
}