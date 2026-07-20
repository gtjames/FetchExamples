const API_HOST = 'deezerdevs-deezer.p.rapidapi.com';
let theKey = keys.keyRapidAPI;
let searchBtn = document.getElementById('searchBtn');
searchBtn.addEventListener('click', search);

const options = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': theKey,
    'x-rapidapi-host': API_HOST,
    'Content-Type': 'application/json'
  }
};

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

async function search() {

    const artist = document.getElementById("artist").value.trim();

    if (artist === "") {
        return;
    }

    const url = `https://${API_HOST}/search?q=${encodeURIComponent(artist)}`;

    const albumList = document.getElementById("albumList");
    albumList.innerHTML = "<p>Searching...</p>";

    try {

        const response = await fetch(url, options);
        const data = await response.json();

        albumList.innerHTML = "";

        if (data.data.length === 0) {
            albumList.innerHTML = "<p>No albums found.</p>";
            return;
        }

        const uniqueAlbums = new Map();

        data.data.forEach(song => {
            uniqueAlbums.set(song.album.id, song);
        });

        uniqueAlbums.forEach(song => {
            //----------------------------------------------------
            // Container for this album
            //----------------------------------------------------
            const albumDiv = document.createElement("div");
            albumDiv.classList.add("album");

            //----------------------------------------------------
            // Album image
            //----------------------------------------------------
            const img = document.createElement("img");
            img.src = song.album.cover_medium;
            img.alt = song.album.title;

            //----------------------------------------------------
            // Album title (clickable)
            //----------------------------------------------------
            const title = document.createElement("p");
            title.textContent = song.album.title;
            title.classList.add("albumTitle");
            title.addEventListener("click", () => {
                //------------------------------------------------
                // Fill in the master panel
                //------------------------------------------------
                document.getElementById("albumImage").src = song.album.cover_xl || song.album.cover_medium;
                document.getElementById("albumTitle").textContent = song.album.title;
                document.getElementById("artistName").textContent = song.artist.name;
                albumDetails(song.album.id);
            });

            //----------------------------------------------------
            // Artist
            //----------------------------------------------------
            const artist = document.createElement("p");
            artist.textContent = song.artist.name;

            //----------------------------------------------------
            // Build the card
            //----------------------------------------------------
            albumDiv.appendChild(img);
            albumDiv.appendChild(title);
            albumDiv.appendChild(artist);
            albumList.appendChild(albumDiv);
        });
    }
    catch (err) {
        albumList.innerHTML =
            `<p style="color:red">${err.message}</p>`;
    }
}
//------------------------------------------------------------
// Show the tracks for an album
//------------------------------------------------------------
async function albumDetails(albumId) {

    const albumInfo  = document.getElementById("albumInfo");
    const trackPanel = document.getElementById("trackPanel");
    const trackList  = document.getElementById("trackList");

    // Hide the album information
    albumInfo.classList.add("hidden");

    // Show the track list
    trackPanel.classList.remove("hidden");

    trackList.innerHTML = "<p>Loading tracks...</p>";

    const url = `https://deezerdevs-deezer.p.rapidapi.com/album/${albumId}`;

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        trackList.innerHTML = "";

        let trackNum = 1;
        data.tracks.data.forEach(track => {
            const p = document.createElement("p");
            p.innerHTML =
                `<strong>${trackNum++}.</strong>
                 ${track.title}
                 <audio controls src="${track.preview}"></audio>
                 <span style="float:right">${formatTime(track.duration)}</span>`;
            trackList.appendChild(p);
        });
    }
    catch (err) {
        trackList.innerHTML =
            `<p style="color:red">${err.message}</p>`;
    }
}

//------------------------------------------------------------
// Restore the album details
//------------------------------------------------------------
function showAlbumInfo() {
    document.getElementById("trackPanel").classList.add("hidden");
    document.getElementById("albumInfo").classList.remove("hidden");
}

//------------------------------------------------------------
// Format seconds as m:ss
//------------------------------------------------------------
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = String(seconds % 60).padStart(2, "0");
    return `${minutes}:${secs}`;
}

//------------------------------------------------------------
// Wire up the Back button
//------------------------------------------------------------
document.getElementById("backBtn").addEventListener("click", showAlbumInfo);

document.getElementById("artist").addEventListener("keydown", e => {
    if (e.key === "Enter") {
        search();
    }
});