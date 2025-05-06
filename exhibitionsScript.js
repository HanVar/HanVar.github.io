// exhibitionsScript.js

const exhibitionsContainer = document.getElementById('exhibitionsContainer');
let allExhibitions = []; // Store globally for filtering

// Format date or show fallback
function formatDate(date) {
  return date ? new Date(date).toLocaleDateString() : 'Date unavailable';
}

// Filter by status: all, past, current, future
function filterExhibitions(status) {
  const today = new Date();

  return allExhibitions.filter(ex => {
    const start = new Date(ex.aic_start_at);
    const end = new Date(ex.aic_end_at);
    if (status === 'future') return start > today;
    if (status === 'current') return start <= today && end >= today;
    if (status === 'past') return end < today;
    return true; // 'all'
  });
}

// Fetch from API
async function fetchExhibitions() {
  const url = 'https://api.artic.edu/api/v1/exhibitions?limit=100&fields=id,title,aic_start_at,aic_end_at,short_description,image_url';
  const options = {
    method: 'GET'
  };
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    allExhibitions = data.data.sort((a, b) => new Date(b.aic_start_at) - new Date(a.aic_start_at)); // Sort newest first
    displayExhibitions(filterExhibitions('all')); // Show all by default
  } catch (error) {
    console.error('Error fetching exhibitions:', error);
    exhibitionsContainer.innerHTML = `<p class="text-danger">Failed to load exhibitions.</p>`;
  }
}

// Display a list of exhibition cards
function displayExhibitions(exhibitions) {
  if (!exhibitions.length) {
    exhibitionsContainer.innerHTML = `<p class="text-muted">No exhibitions found.</p>`;
    return;
  }

  exhibitionsContainer.innerHTML = exhibitions.map(ex => {
    const imgUrl = ex.image_url || 'https://via.placeholder.com/300x200?text=No+Image';

    return `
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100 shadow-sm">
          <img src="${imgUrl}" class="card-img-top" alt="${ex.title}">
          <div class="card-body">
            <h5 class="card-title">
              ${ex.title}
            </h5>
            <p><strong>From:</strong> ${formatDate(ex.aic_start_at)}</p>
            <p><strong>To:</strong> ${formatDate(ex.aic_end_at)}</p>
            <p class="card-text">${ex.short_description || 'No description available.'}</p>
          </div>
        </div>
      </div>`;
  }).join('');
}

// Filter buttons for Exhibitions
function handleFilter(status) {
  const filtered = filterExhibitions(status);
  displayExhibitions(filtered);
}

// Run on page load
fetchExhibitions();
