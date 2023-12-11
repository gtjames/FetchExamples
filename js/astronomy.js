import {getLocation, locationRetrieved, lat, lon} from './utils.js';

document.getElementById('getMoon').addEventListener('click', getMoon);
document.getElementById('getConstellation').addEventListener('click', getConstellation);
let sky  = document.getElementById('sky');
let date = document.getElementById('date');
let constellation = document.getElementById('constellation');

let myLat, myLon;
function myLocation(lat, lon) {
    myLat = lat;
    myLon = lon;
}
getLocation(myLocation);

function getMoon() {
    let when = date.value;
    const data = {
        "style":{
            "moonStyle":"shaded",
            "backgroundStyle":"stars",
            "backgroundColor":"#000000",
            "headingColor":"#c3d117",
            "textColor":"#e63b7a"
        },
        "observer":{
            "latitude":     myLat,
            "longitude":    myLon,
            "date":         when
        },
        "view":{
            "type":"landscape-simple",
            "parameters":{}
        }
    };

    const url = "https://api.astronomyapi.com/api/v2/studio/moon-phase";
    const authorizationHeader = 'Basic OGExYTlkY2ItODgzNy00NTZjLWI4ZmYtOTc5NjZlZTYyOTE4OmE2YTgyZmYzZDgzNDdmNDQwYmRhYWEzNTA5MzZkM2QwMGVlODUxMmZkMjY4YTdmYjEwNzU0ODA5N2EyZTYxNDhiNWVkYmMzNjYzNWY4YmQzOTlhNjJkMDA2ZDBlM2YyNzg2MzlhZTNlODgyZWQyNmZkZDczYzRmZGVkNzVjMTQ0NzA2ZWMyM2MyMmE3NDkzYWEyYTAzMDE4Y2I0YzBhNzBiMzA3MzJkMDc0ZWY5YTQ0OGE3NjZmZGEzYWE5ODVkYTAyNmU0ZjhmOWUyYzAwM2Y3MTgxMTY0YzIzOTYyODU1';
        
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authorizationHeader,
        },
        body: JSON.stringify(data),
        })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        sky.src = result.data.imageUrl;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function getConstellation() {
    let when = date.value;
    var value = constellation.value;

    const data = {
        style: 'navy',
        observer: {
          latitude: lat,
          longitude: lon,
          date: when,
        },
        view: {
          type: 'constellation',
          parameters: { constellation: value, },
        },
      };
      
      const url = 'https://api.astronomyapi.com/api/v2/studio/star-chart';
      const authorizationHeader = 'Basic OGExYTlkY2ItODgzNy00NTZjLWI4ZmYtOTc5NjZlZTYyOTE4OmE2YTgyZmYzZDgzNDdmNDQwYmRhYWEzNTA5MzZkM2QwMGVlODUxMmZkMjY4YTdmYjEwNzU0ODA5N2EyZTYxNDhiNWVkYmMzNjYzNWY4YmQzOTlhNjJkMDA2ZDBlM2YyNzg2MzlhZTNlODgyZWQyNmZkZDczYzRmZGVkNzVjMTQ0NzA2ZWMyM2MyMmE3NDkzYWEyYTAzMDE4Y2I0YzBhNzBiMzA3MzJkMDc0ZWY5YTQ0OGE3NjZmZGEzYWE5ODVkYTAyNmU0ZjhmOWUyYzAwM2Y3MTgxMTY0YzIzOTYyODU1';
      
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authorizationHeader,
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(result => {
          console.log(result);
          sky.src = result.data.imageUrl;
        })
        .catch(error => {
          console.error('Error:', error);
        });      
}