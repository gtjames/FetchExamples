    const API_HOST = 'deezerdevs-deezer.p.rapidapi.com';
    let theKey = keys.keyRapidAPI;
    let searchBtn = document.getElementById('searchBtn');
    searchBtn.addEventListener('click', search);

    function formatDuration(seconds) {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s.toString().padStart(2, '0')}`;
    }

    async function search() {
      const query = document.getElementById('query').value.trim();
      if (!query) return;

      const status = document.getElementById('status');
      const results = document.getElementById('results');

      status.textContent = 'Loading…';
      results.innerHTML = '';

      const url = `https://${API_HOST}/search?q=${encodeURIComponent(query)}`;
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': theKey,
          'x-rapidapi-host': API_HOST,
          'Content-Type': 'application/json'
        }
      };

      try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (!data.data || data.data.length === 0) {
          status.textContent = 'No results found.';
          return;
        }

        status.textContent = `Found ${data.data.length} tracks for "${query}"`;

        data.data.forEach(track => {
          const card = document.createElement('div');
          card.className = 'card';
          card.innerHTML = `
            <img src="${track.album.cover_medium}" alt="${track.album.title}" loading="lazy" />
            <div class="card-body">
              <h3 title="${track.title}">${track.title}</h3>
              <p title="${track.artist.name}">🎤 ${track.artist.name}</p>
              <p title="${track.album.title}">💿 ${track.album.title}</p>
              <div class="duration">⏱ ${formatDuration(track.duration)}</div>
              ${track.preview ? `<audio controls src="${track.preview}"></audio>` : '<p style="color:#555;font-size:0.75rem;margin-top:0.4rem;">No preview available</p>'}
            </div>
          `;
          results.appendChild(card);
        });

      } catch (error) {
        status.textContent = `Error: ${error.message}`;
        console.error(error);
      }
    }

    // Auto-search on load
    // search();

    // Allow Enter key to trigger search
    document.getElementById('query').addEventListener('keydown', e => {
      if (e.key === 'Enter') search();
    });
