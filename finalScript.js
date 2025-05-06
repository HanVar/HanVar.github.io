// finalScript.js

async function getMonetArtworks() {
  try {
    const response = await fetch("https://api.artic.edu/api/v1/artworks/search?q=claude%20monet&limit=5&fields=id,title,image_id,artist_display");
    const data = await response.json(); 
    
    const selected = data.data.map((art, index) => {
      const imageUrl = `https://www.artic.edu/iiif/2/${art.image_id}/full/843,/0/default.jpg`;
      return `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
          <a href="artwork-details.html?id=${art.id}" class="text-decoration-none">
            <div class="d-flex justify-content-center align-items-center bg-light bg-opacity-50" style="height: 500px; overflow: hidden;">
              <img src="${imageUrl}" 
                   alt="${art.title}" 
                   style="height: 100%; width: auto; object-fit: contain;">
            </div>
            <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 p-2">
              <h5>${art.title || 'Untitled'}</h5>
              <p>${art.artist_display || 'Unknown Artist'}</p>
            </div>
          </a>
        </div>
      `;
    }).join('');

    document.getElementById('carouselItems').innerHTML = selected;

  } catch (error) {
    console.error('Error fetching Monet artworks:', error);
    document.getElementById('carouselItems').innerHTML = `<div class="text-danger">Failed to load artworks.</div>`;
  }
}

// Call the function to load Monet artworks
getMonetArtworks();

