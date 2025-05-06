// // finalScript.js

// const url = 'https://api.artic.edu/api/v1/artworks?limit=100';
// const options = {
//   method: 'GET'
// };

// async function getArtworks() {
//   try {
//     const response = await fetch(url, options);
//     const data = await response.json(); 
//     const artworks = data.data;

//     // Filter those with images
//     const artworksWithImages = artworks.filter(art => art.image_id);
//     const randomIndex = Math.floor(Math.random() * artworksWithImages.length);
//     const selectedArt = artworksWithImages[randomIndex];

//     const imageUrl = `https://www.artic.edu/iiif/2/${selectedArt.image_id}/full/843,/0/default.jpg`;

//     document.getElementById('featured-artworks').innerHTML = `
//         <div class="col-md-6 col-lg-4 mx-auto">
//             <div class="card h-100 shadow-sm">
//             <a href="artwork-details.html?id=${selectedArt.id}" class="text-decoration-none text-dark">
//                 <img src="${imageUrl}" class="card-img-top img-fluid" alt="${selectedArt.title} by ${selectedArt.artist_title || 'Unknown Artist'}">
//                 <div class="card-body">
//                 <h5 class="card-title">${selectedArt.title || "Unknown Title"}</h5>
//                 <p class="card-text">${selectedArt.artist_title || "Unknown Artist"}</p>
//                 </div>
//             </a>
//             </div>
//         </div>
// `;
//   } catch (error) {
//     console.error('Error fetching artworks:', error);
//     document.getElementById('featured-artworks').innerHTML = `<p class="text-danger">Could not load featured artwork.</p>`;
//   }
// }

// getArtworks(); // Call it on page load

async function getArtworks() {
  try {
    const response = await fetch('https://api.artic.edu/api/v1/artworks?limit=100');
    const data = await response.json(); 
    const artworks = data.data.filter(art => art.image_id);
    
    // Get 3 random artworks
    const selected = [];
    while (selected.length < 3) {
      const random = artworks[Math.floor(Math.random() * artworks.length)];
      if (!selected.includes(random)) selected.push(random);
    }

    const carouselItems = selected.map((art, index) => {
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
              <p>${art.artist_title || 'Unknown Artist'}</p>
            </div>
          </a>
        </div>

      `;
    }).join('');

    document.getElementById('carouselItems').innerHTML = carouselItems;

  } catch (error) {
    console.error('Error fetching artworks:', error);
    document.getElementById('carouselItems').innerHTML = `<div class="text-danger">Failed to load artworks.</div>`;
  }
}

getArtworks();
