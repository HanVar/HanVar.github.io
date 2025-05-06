//artworkScript.js

const url = 'https://api.artic.edu/api/v1/artworks?limit=100';
const options = {
  method: 'GET'
};

async function getRandomArtworks() {
  const container = document.getElementById('artworkContainer');
  container.innerHTML = '<p class="text-center">Loading...</p>';

  try {
    const response = await fetch(url,options);
    const data = await response.json();
    const artworks = data.data;

    // Only artworks with images
    const artworksWithImages = artworks.filter(art => art.image_id);
    const random15 = artworksWithImages
      .sort(() => 0.5 - Math.random())
      .slice(0, 15);

    displayArtworks(random15);
  } catch (error) {
    console.error('Error fetching random artworks:', error);
    container.innerHTML = `<p class="text-danger">Could not load artworks.</p>`;
  }
}

async function searchArtworks(event) {
  event.preventDefault();
  const title = document.getElementById('titleInput').value.trim().toLowerCase();
  const artist = document.getElementById('artistInput').value.trim().toLowerCase();

  if (!title && !artist) {
    getRandomArtworks();
    return false;
  }

  const container = document.getElementById('artworkContainer');
  container.innerHTML = '<p class="text-center">Searching...</p>';

  try {
    const searchQuery = title || artist || 'painting';
    const url = `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(searchQuery)}&fields=id,title,image_id,artist_title&limit=100`;
    const options = {
      method: 'GET'
    };
    const response = await fetch(url, options);
    const data = await response.json();
    let results = data.data.filter(a => a.image_id);

    if (title) {
      results = results.filter(a => a.title && a.title.toLowerCase().includes(title));
    }

    if (artist) {
      results = results.filter(a => a.artist_title && a.artist_title.toLowerCase().includes(artist));
    }

    displayArtworks(results.slice(0, 15));
  } catch (error) {
    console.error('Error searching artworks:', error);
    container.innerHTML = `<p class="text-danger">Could not complete search.</p>`;
  }

  return false; // Prevent form submission
}

function displayArtworks(artworks) {
  const container = document.getElementById('artworkContainer');
  container.innerHTML = '';

  if (artworks.length === 0) {
    container.innerHTML = '<p class="text-center">No artworks found.</p>';
    return;
  }

  let html = '';

  artworks.forEach(art => {
    const imgUrl = `https://www.artic.edu/iiif/2/${art.image_id}/full/843,/0/default.jpg`;
    html += `
      <div class="col">
        <div class="card h-100 shadow-sm">
          <a href="artwork-details.html?id=${art.id}" class="text-decoration-none text-dark">
            <img src="${imgUrl}" class="card-img-top" alt="Artwork Image">
            <div class="card-body">
              <h5 class="card-title">${art.title || "Unknown Title"}</h5>
              <p class="card-text">${art.artist_title || "Unknown Artist"}</p>
            </div>
          </a>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function refreshAndFetchRandom() {
  document.getElementById('titleInput').value = '';
  document.getElementById('artistInput').value = '';
  getRandomArtworks();
}

// Load 15 random artworks on page load
window.onload = getRandomArtworks;