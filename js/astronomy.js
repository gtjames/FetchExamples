import {getLocation, locationRetrieved, lat, lon} from './utils.js';

document.getElementById('getMoon').addEventListener('click', getMoon);
document.getElementById('getConstellation').addEventListener('click', getConstellation);
let sky    = document.getElementById('sky');
let date   = document.getElementById('date');
let latLon = document.getElementById('latLon');
let constellation = document.getElementById('constellation');

let myLat, myLon;
var popup;

function myLocation(lat, lon) {
    myLat = lat;
    myLon = lon;
    latLon.innerText = `Lat: ${myLat}, Lon: ${myLon}`;
    var map = L.map('map').setView([myLat, myLon], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 14,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    popup = L.popup();
    map.on('click', onMapClick);

    function onMapClick(e) {
        myLon = e.latlng.lng;
        myLat = e.latlng.lat;
        latLon.innerText = `Lat: ${myLat}, Lon: ${myLon}`;
        popup.setLatLng(e.latlng).setContent(e.latlng.toString()).openOn(map);
    }
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
    makeRequest(url, data);
}


function getConstellation() {
    let when = date.value;
    var value = constellation.value;

    const data = {
        style: 'navy',
        observer: {
          latitude: myLat,
          longitude: myLon,
          date: when,
        },
        view: {
          type: 'constellation',
          parameters: { constellation: value, },
        },
      };
      
    //   view: {
    //     type: "area",
    //     parameters: {
    //       position: {
    //         equatorial: {
    //           rightAscension: rightAscensionVar,
    //           declination: declinationVar
    //         }
    //       },
    //       zoom: 3
    //     },
    //   },
    // },
    //  68b058c7-2298-4a20-8dbf-d6a120dd1494
    //  a6a82ff3d8347f440bdaaa350936d3d00ee8512fd268a7fb107548097a2e6148b5edbc36635f8bd399a62d006d0e3f278639ae3e882ed26fdd73c4fded75c144f6781a4024ea3660cb04bd2358195e18f497b4cebbfa65b5f41f8ccf9bafcec185cf00a20d8be90fe3b9fb45154573c8
    //  a6a82ff3d8347f440bdaaa350936d3d00ee8512fd268a7fb107548097a2e6148b5edbc36635f8bd399a62d006d0e3f278639ae3e882ed26fdd73c4fded75c144f6781a4024ea3660cb04bd2358195e18f497b4cebbfa65b5f41f8ccf9bafcec185cf00a20d8be90fe3b9fb45154573c8


    const url = 'https://api.astronomyapi.com/api/v2/studio/star-chart';
    makeRequest(url, data);
}

function makeRequest(url, data) {
//  localhost
//  5db7ff05-5af8-4b59-b94e-a8e9a07b7085
//  a6a82ff3d8347f440bdaaa350936d3d00ee8512fd268a7fb107548097a2e6148b5edbc36635f8bd399a62d006d0e3f278639ae3e882ed26fdd73c4fded75c144dc7d5188bd0e8b4890aacb36f2d22db2273001dd06175ffadbfd93b8fb6f36b6b9e3f4825ac91c5758df8e3180e0474e

//  gtjames.../astronomy.html
//      68b058c7-2298-4a20-8dbf-d6a120dd1494
//      a6a82ff3d8347f440bdaaa350936d3d00ee8512fd268a7fb107548097a2e6148b5edbc36635f8bd399a62d006d0e3f278639ae3e882ed26fdd73c4fded75c144f6781a4024ea3660cb04bd2358195e18f497b4cebbfa65b5f41f8ccf9bafcec185cf00a20d8be90fe3b9fb45154573c8

//  gtjames.../FetchExamples
//      8a1a9dcb-8837-456c-b8ff-97966ee62918
//      OGExYTlkY2ItODgzNy00NTZjLWI4ZmYtOTc5NjZlZTYyOTE4OmE2YTgyZmYzZDgzNDdmNDQwYmRhYWEzNTA5MzZkM2QwMGVlODUxMmZkMjY4YTdmYjEwNzU0ODA5N2EyZTYxNDhiNWVkYmMzNjYzNWY4YmQzOTlhNjJkMDA2ZDBlM2YyNzg2MzlhZTNlODgyZWQyNmZkZDczYzRmZGVkNzVjMTQ0NzA2ZWMyM2MyMmE3NDkzYWEyYTAzMDE4Y2I0YzBhNzBiMzA3MzJkMDc0ZWY5YTQ0OGE3NjZmZGEzYWE5ODVkYTAyNmU0ZjhmOWUyYzAwM2Y3MTgxMTY0YzIzOTYyODU1

    const authString = btoa(`68b058c7-2298-4a20-8dbf-d6a120dd1494:a6a82ff3d8347f440bdaaa350936d3d00ee8512fd268a7fb107548097a2e6148b5edbc36635f8bd399a62d006d0e3f278639ae3e882ed26fdd73c4fded75c144f6781a4024ea3660cb04bd2358195e18f497b4cebbfa65b5f41f8ccf9bafcec185cf00a20d8be90fe3b9fb45154573c8`);
//  const authorizationHeader = 'Basic OGExYTlkY2ItODgzNy00NTZjLWI4ZmYtOTc5NjZlZTYyOTE4OmE2YTgyZmYzZDgzNDdmNDQwYmRhYWEzNTA5MzZkM2QwMGVlODUxMmZkMjY4YTdmYjEwNzU0ODA5N2EyZTYxNDhiNWVkYmMzNjYzNWY4YmQzOTlhNjJkMDA2ZDBlM2YyNzg2MzlhZTNlODgyZWQyNmZkZDczYzRmZGVkNzVjMTQ0NzA2ZWMyM2MyMmE3NDkzYWEyYTAzMDE4Y2I0YzBhNzBiMzA3MzJkMDc0ZWY5YTQ0OGE3NjZmZGEzYWE5ODVkYTAyNmU0ZjhmOWUyYzAwM2Y3MTgxMTY0YzIzOTYyODU1';
    const authorizationHeader = 'Basic ' + authString;
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