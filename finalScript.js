// finalScript.js

const url = 'https://api.artic.edu/api/v1/artworks?limit=100';
const options = {
  method: 'GET'
};

async function getArtworks() {
  try {
    const response = await fetch(url, options);
    const data = await response.json(); 
    const artworks = data.data;

    // Filter those with images
    const artworksWithImages = artworks.filter(art => art.image_id);
    const randomIndex = Math.floor(Math.random() * artworksWithImages.length);
    const selectedArt = artworksWithImages[randomIndex];

    const imageUrl = `https://www.artic.edu/iiif/2/${selectedArt.image_id}/full/843,/0/default.jpg`;

    // Inject into the page


    document.getElementById('featured-artworks').innerHTML = `
        <div class="col-md-6 col-lg-4 mx-auto">
            <div class="card h-100 shadow-sm">
            <a href="artwork-details.html?id=${selectedArt.id}" class="text-decoration-none text-dark">
                <img src="${imageUrl}" class="card-img-top img-fluid" alt="${selectedArt.title} by ${selectedArt.artist_title || 'Unknown Artist'}">
                <div class="card-body">
                <h5 class="card-title">${selectedArt.title}</h5>
                <p class="card-text">${selectedArt.artist_title || "Unknown Artist"}</p>
                </div>
            </a>
            </div>
        </div>
`;

  } catch (error) {
    console.error('Error fetching artworks:', error);
    document.getElementById('featured-artworks').innerHTML = `<p class="text-danger">Could not load featured artwork.</p>`;
  }
}

getArtworks(); // Call it on page load