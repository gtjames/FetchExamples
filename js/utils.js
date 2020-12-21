export let locationRetrieved = false;
export let lat, lon;
let message;

//  Make sure your pop ups are turned on at least for this URL
export function getLocation(msgId) {
    message = document.getElementById(msgId)

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        message.innerHTML = "Geolocation is not supported by this browser.";
    }
}

//  save the current location.
//  put a message on the screen that the location has been retrieved
export function showPosition(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    message.innerText = "location retrieved";
    locationRetrieved = true;
}

//  convert degrees into english directions
//  North is 11.25 degrees on both sides of 0/360 degrees.
//  We add 11.25 to push all directions 11.25 degrees clockwise
//  Then we mod the degrees with 360 to force all results between 0 and 359
//  finally we can divide by 22.5 because we have 16 (360 / 16 equals 22.5) different wind directions
export function windDirection(degrees) {
    let direction = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"];

    degrees = Math.round(degrees + 11.25) % 360;
    let index = Math.floor(degrees / 22.5);
    return direction[index];
}

//  strip out just the MM/DD/YYY from the date
//  convert from UNIX date time and take the time zone offset into consideration
export function niceDate(date, offset) {
    let day = new Date(date * 1000 + offset);
    day = day.toLocaleString();
    return day.substring(0, 9);
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