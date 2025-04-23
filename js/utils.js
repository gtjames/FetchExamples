import {random} from './random.js';

export let locationRetrieved = false;
export let lat, lon, _seed = -1;

//https://maps.churchofjesuschrist.org/wards/226491
//  Make sure your pop ups are turned on at least for this URL
export function getLocation(whatsNext) {
    if(locationRetrieved) {
        whatsNext(lat, lon);
    }
    else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            console.log(pos);
            getPosition(whatsNext, pos)
        })
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

//  save the current location.
//  put a message on the screen that the location has been retrieved
export function getPosition(whatsNext, position) {
    locationRetrieved = true;
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    whatsNext(lat, lon);
}

//  convert degrees into english directions
//  North is 11.25 degrees on both sides of 0/360 degrees.
//  We add 11.25 to push all directions 11.25 degrees clockwise
//  Then we mod the degrees with 360 to force all results between 0 and 359
//  finally we can divide by 22.5 because we have 16 (360 / 16 equals 22.5) different wind directions
export function windDirection(degrees, long) {
    let direction;
    if (long)
        direction =["North",  "North by North East", "North East",  "East by North East",
            "East",    "East by South East", "South East", "South by South East",
            "South",  "South by South West", "South West",  "West by South West",
            "West",    "West by North West", "North West", "North by North West",
            "North"];
    else
        direction = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"];

    degrees = Math.round(degrees + 11.25) % 360;
    let index = Math.floor(degrees / 22.5);
    return direction[index];
}

//  strip out just the MM/DD/YYY from the date
//  convert from UNIX date time and take the time zone offset into consideration
export function niceDate(date, offset) {
    let day = new Date((date + offset) * 1000 );
    day = day.toLocaleString();
    return day.substring(0, day.indexOf(','));
}

//  Strip out just the HH:MM:SS AM/PM from the date
export function niceTime(dateTime, offset) {
    let day = new Date(dateTime * 1000 + offset).toLocaleString();
    let hour = day.indexOf(' ') + 1;
    let time = day.substring(hour);
    time = time.substring(0, time.lastIndexOf(':')) + time.substring(time.length-3)
    return time;
}

//  Convert Kelvin to Fahrenheit
export function KtoF(temp) {
    temp -= 273;
    temp = temp * 9 / 5 + 32;
    return temp.toFixed(0);
}

var acc = document.querySelectorAll(".accordion");
acc.forEach( a => {
    a.addEventListener("click", (e) => {
      /* Toggle between adding and removing the "active" class,
      to highlight the button that controls the panel */
      e.currentTarget.classList.toggle("active");
  
      /* Toggle between hiding and showing the active panel */
      var panel = e.currentTarget.nextElementSibling;
      panel.style.display = (panel.style.display === "block") ? "none" : "block";
    });
});

export function getSeed() { return _seed; }
export function setSeed(baseSeed) { _seed = baseSeed; return _seed; }

export function getRandomInt(max) {
    return Math.floor(getRandom(max));
}
export function getRandom(max) {
    if (_seed === -1)
        return Math.random() * max;
    else
        return getNextRandom() * max;
}

export function getNextRandom() {
    let start = Math.floor(_seed*200000);
    let rnd = random.substring(start, start + 6);
    rnd = +("."+rnd);
    return setSeed( rnd );
}

export function getBinRand() {
    let number = 0;
    let start = -6, end = 9;
    let x = getRandom(1);
    if (x < .1)        start = 0;
    else if (x > 0.9)  end = -1;
    while (number ===  0) {
        for (let i = start; i <= end; i++) {
            number += getRandom(1) < 0.33 ? Math.pow(2, i) : 0;
        }
    }
    return number * (getRandom(1) < 0.1 ? -1 : 1);
}
