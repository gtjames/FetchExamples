import {niceDate, niceTime, windDirection, KtoF} from './utils.js';

/**
 *      Initialization
 *          add listener to the button
 */
document.getElementById('getWeather').addEventListener('click', getCityThenWeather);
let weatherList = document.getElementById('weatherList');        //  all weather reports go here
let city        = document.getElementById('city');               //  City input field
let sunrise     = document.getElementById('sunrise');            //  City input field
let sunset      = document.getElementById('sunset');             //  City input field
//  let allDays     = document.getElementById('allDays').checked;    //  show all days of the forecast

function getCityThenWeather() {
    if (city.value.length === 0) {
        weatherList.innerHTML = 'Please Enter the City name';
        return;
    }

    let url = `https://api.openweathermap.org/geo/1.0/direct?appid=${keyOpenWX}&q=${city.value}`;

    fetch(url)
        .then(response => response.json())  //  wait for the response and convert it to JSON
        .then(city => {                  //  with the resulting JSON data do something
            getWeather(city[0].lon, city[0].lat)
        });
}


/**
 *          Get the current weather forecast either of the city or the Lat Long location
 */
function getWeather(lon, lat) {
    //  let's build the API based on the data from the form. 
    //      If city is entered use forecast data
    let url =`https://api.openweathermap.org/data/3.0/onecall?appid=${keyOpenWX}`;
    url += `&lat=${lat}&lon=${lon}&exclude=minutely,hourly`

    console.log(url);
    //  this is all there is to it
    //      make the request
    fetch(url)
        .then(resp => resp.json())          //  wait for the response and convert it to JSON
        .then(weather => {                  //  with the resulting JSON data do something
            sunset.innerText  = `Sunset:  ${niceTime(weather.current.sunset, 0)}`;
            sunrise.innerText = `Sunrise: ${niceTime(weather.current.sunrise, 0)}`;

            //  If the city was entered extract weather based on the API
            //  extract the interesting data from the JSON object and show it to the user
            //  We will build the HTML to be inserted later.
            //  The variable innerHTML will hold our work in progress
            let innerHTML = "";
            //  City API (forecast)
            let color = 0;
            for (let day of weather.daily) {
                color++;
                //  let's build a nice card for each day of the weather data
                //  this is a GREAT opportunity to Reactify this code. But for now I will keep it simple
                innerHTML +=`
                <div class="grid-item w3-theme-${(color%2)>0 ? 'l2':'d2'}">
                    <h4>Date: ${niceDate(day.dt, 0)} ${niceTime(day.dt, 0)}</h4>
                    <p>Temp: ${KtoF(day.temp.day)}</p>
                    <p>Wind at ${day.wind_speed.toFixed(0)} mph out of the ${windDirection(day.wind_deg, false)}</p>
                    <p>Probability of Precip: ${Math.round(day.pop*100)}%</p>
                    <p>Forecast: ${day.summary} <img src='http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png' alt="" height="20%"></p>
                </div>`;
            }
            //  and finally take the finished URL and stuff it into the web page
            weatherList.innerHTML = innerHTML;
        });
}