/**
 *      Initialization
 *          add listener to the button
 */
document.getElementById('getSongs').addEventListener('click', getSongsByTitle);
document.getElementById('getArtist').addEventListener('click', getArtist);

let albumList = document.getElementById('albumList');
let artistList = document.getElementById('artistList');
albumList.addEventListener('click', getSongInfo);

const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': keyRapidAPI,
        'X-RapidAPI-Host': 'geniuslyrics-api.p.rapidapi.com'
    }
};

/**
 *      Search for songs by title
 *          List songs matching this title
 *          HTML will have the artist name and image. Image has the id of the artist
 *              song title a and image. Image id is songID
 *              clicking on the song image will call getSongInfo
 *              the surrounding div has an id of card+songID
 */
function getSongsByTitle() {
    let albumList = document.querySelector('#albumList');
    let song = document.querySelector('#songTitle').value;
    console.log(`getSongsByTitle ${song}`);

    const url = `https://geniuslyrics-api.p.rapidapi.com/search_songs?song=${song}`;
    fetch(url, options)
    .then(resp => resp.json())          //  wait for the response and convert it to JSON
    .then(songs => {                  //  with the resulting JSON data do something
        let innerHTML = "";

        let color = 0;
        for (let song of songs.hits) {
            color++;
            //  let's build a nice card for each day of the weather data
            //  this is a GREAT opportunity to Reactify this code. But for now I will keep it simple
            innerHTML +=`
            <div class="grid-item w3-theme-${(color%2)>0 ? 'l2':'d2'}" id=card${song.songID}>
                <p><img src='${song.artist.artistImageUrls}' id=${song.artist.artistID} alt="" height="80px"></p>
                <h4>${song.artist.artistName}</h4>
                <h5>${song.songTitle}</h5>
                <p><img src='${song.songImageURL}' id=${song.songID} alt="" height="120px"></p>
            </div>`;
        }
        //  and finally take the finished URL and stuff it into the web page
        albumList.innerHTML = innerHTML;
        for (let song of songs.hits) {
            // document.getElementById(album.artist.artistID).addEventListener('click', )
            document.getElementById(song.songID).addEventListener('click', getSongInfo)
        }
    });
}
/**
 *      getArtist
 *          Search for artist by name
 *          HTML    artist name and description and image. Image has id of artist
 *                  List has names of songs which have the ID of the song
 * 
*/
function getArtist() {
    let albumList = document.querySelector('#albumList');
    let artist = document.querySelector('#artistName').value;
    console.log(`getArtist ${artist}`);
    const url = `https://geniuslyrics-api.p.rapidapi.com/search_artist?artist=${artist}`;

    fetch(url, options)
    .then(resp => resp.json())          //  wait for the response and convert it to JSON
    .then(artist => {                  //  with the resulting JSON data do something
        let innerHTML = "";
        let color = 0;
        innerHTML += `<div class="grid-item w3-theme-${(color%2)>0 ? 'l2':'d2'}"
        <p>${artist.artistName}</p>
        <p>${artist.description}</p>
        <p><img src='${artist.artistImage}' alt="" height="120px" id=${artist.artistID}></p>
        <ul>`
        for (let song of artist.popular) {
            color++;
            //  let's build a nice card for each day of the weather data
            //  this is a GREAT opportunity to Reactify this code. But for now I will keep it simple
            innerHTML += `
            <li id=${song.songID}>${song.song}</li>`
        }
        innerHTML += `</ul></div>`;
        artistList.innerHTML = innerHTML;
        for (let song of artist.popular) {
            document.getElementById(song.songID).addEventListener('click', searchSong)
        }
        });
}

/**
 *  Dead API!!!
 * @param {} evt 
 */
function searchSong(evt) {
    const url = `https://geniuslyrics-api.p.rapidapi.com/search_songs?song=${evt.target.id}`;
    console.log(`searchSong ${evt.target.id}`);

fetch(url, options)
.then(resp => resp.json())          //  wait for the response and convert it to JSON
.then(albums => {     
    console.log(albums)
});             //  with the resulting JSON data do something
}

function getSongInfo(evt) {
    console.log(`getSongInfo ${evt.target.id}`);
    const url = `https://geniuslyrics-api.p.rapidapi.com/get_song?song_id=${evt.target.id}`;

    fetch(url, options)
        .then(resp => resp.json())          //  wait for the response and convert it to JSON
        .then(info => {     
            let card = document.getElementById('card'+evt.target.id);
            let innerHTML = `<p id=${info.album.albumID}>${info.songTitle} can be heard on the ${info.artist.artistName}'s 
            album ${info.album.albumName} ${info.songDescription}
            it can also be found on the following streaming services</p>`;
            innerHTML += `<a href='${info.songMedia['spotify']}'>Spotify</a>
            <a href='${info.songMedia['apple-music']}'>Apple Music</a>
            <a href='${info.songMedia['youtube']}'>Youtube</a>`
            card.innerHTML = innerHTML;
            document.getElementById(info.album.albumID).addEventListener('click', getSongsByAlbum);
            console.log(`Album ID ${info.album.albumID}`);
    });             //  with the resulting JSON data do something
}
/*
artist: {artistName: "Eagles", artistID: 561, 
artistImageUrls: "https://images.genius.com/5e55ed49f9cdab54b012a4a6f89accf8.1000x1000x1.png"}
songID: "1060"
songImageURL: "https://images.genius.com/6c7e025561819a4af1476af223c1a7f8.600x600x1.jpg"
*/

//  this event is under maintenance
function getLyrics(evt) {
    console.log(`getLyrics ${evt.target.id}`);
    const url = `https://geniuslyrics-api.p.rapidapi.com/get_lyrics?song_id=${evt.target.id}`
fetch(url, options)
.then(resp => resp.json())          //  wait for the response and convert it to JSON
.then(lyrics => {
    console.log(lyrics);
});             //  with the resulting JSON data do something
}

function getSongsByAlbum(evt) {
    console.log(`getSongsByAlbum ${evt.target.id}`);
    const url = `https://geniuslyrics-api.p.rapidapi.com/get_songs_by_album?album_id=${evt.target.id}`

    fetch(url, options)
        .then(resp => resp.json())          //  wait for the response and convert it to JSON
        .then(album => {     
            evt.target.innerHTML = '<ul>' + album.tracks.map(s => `<li>${s.songTitle}</li>`).join("\n") + '</ul>';
        });             //  with the resulting JSON data do something
}

let songEvent = {}
songEvent.target = {}
songEvent.target.id = 393811;
let albEvent = {}
albEvent.target = {}
albEvent.target.id = 11879;
getSongsByAlbum(albEvent)
getSongInfo(songEvent)
// Song 393811
// Album   11879