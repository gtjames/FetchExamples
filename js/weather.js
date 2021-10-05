/**
 *      Initialization
 *          add listener to the button
 */
document.getElementById('getWeather').addEventListener('click', getWeather);

/**
 *          Get the current weather forecast either of the city or the Lat Long location
 */
function getWeather() {
    let weatherList = document.getElementById('weatherList');        //  all weather reports go here
    let city        = document.getElementById('city');               //  City input field
    //  let allDays     = document.getElementById('allDays').checked;    //  show all days of the forecast

    if (city.value.length === 0) {
        weatherList.innerHTML = 'Please Enter the City name';
        return;
    }
    let key = 'a099a51a6362902523bbf6495a0818aa'
    //  let's build the API based on the data from the form. 
    //      If city is entered use forecast data
    let url =`https://api.openweathermap.org/data/2.5/forecast?appid=${key}&q=${city.value}&units=imperial`;

    console.log(url);
    //  this is all there is to it
    //      make the request
    fetch(url)
        .then(resp => resp.json())          //  wait for the response and convert it to JSON
        .then(weather => {                  //  with the resulting JSON data do something

            //  If the city was entered extract weather based on the API
            //  extract the interesting data from the JSON object and show it to the user
            //  We will build the HTML to be inserted later.
            //  The variable innerHTML will hold our work in progress
            let innerHTML = "";

            //  City API (forecast)
            let color = 0;
            for (let day of weather.list) {
                color++;
                //  let's build a nice card for each day of the weather data
                //  this is a GREAT opportunity to Reactify this code. But for now I will keep it simple
                innerHTML +=`
                <div class="w3-container w3-border-bottom w3-border-black w3-quarter w3-${(color%2)>0 ? 'theme-l2':'theme-d2'}">
                    <h4>Date: ${niceDate(day.dt, 0)} ${niceTime(day.dt, 0)}</h4>
                    <p>Forecast:<br> <img src='http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png' alt="" height="70%"> ${day.weather[0].description}</p>
                    <p>Wind at ${day.wind.speed} mph out of the ${windDirection(day.wind.deg)}</p>
                    <p>Sunrise: ${niceTime(weather.city.sunrise, 0)} / Sunset: ${niceTime(weather.city.sunset, 0)}</p>
                    <p>Temp: ${day.main.temp}</p>
                </div>`;
            }
            //  and finally take the finished URL and stuff it into the web page
            weatherList.innerHTML = innerHTML;
            city.value = weather.city.name;
        });
}

//  Strip out just the HH:MM:SS AM/PM from the date
function niceTime(dateTime, offset) {
    let day = new Date((dateTime + offset) * 1000).toLocaleString();
    let hour = day.indexOf(' ') + 1;
    let time = day.substring(hour);
    time = time.substring(0, time.lastIndexOf(':')) + time.substring(time.length-3)
    return time;
}

function niceDate(date, offset) {
    let day = new Date((date + offset) * 1000 );
    day = day.toLocaleString();
    return day.substring(0, day.indexOf(','));
}

function windDirection(degrees) {
    let direction = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"];

    degrees = Math.round(degrees + 11.25) % 360;
    let index = Math.floor(degrees / 22.5);
    return direction[index];
}