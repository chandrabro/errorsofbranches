let errorsData = [];

// Load errors.json
fetch('errors.json')
  .then(response => response.json())
  .then(data => {
    errorsData = data;

    // Initialize Fuse.js
    window.fuse = new Fuse(errorsData, {
      keys: ['title', 'keywords'],
      threshold: 0.4,   // 0 = exact match, 1 = matches anything
      includeScore: true
    });
  })
  .catch(err => console.error("Failed to load error data:", err));

document.getElementById('searchBtn').addEventListener('click', searchError);

function searchError() {
  const query = document.getElementById('searchInput').value.trim();
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  if (!query) {
    resultsDiv.innerHTML = "<p>Please enter an error code or description.</p>";
    return;
  }

  // Use Fuse.js to search
  const matches = window.fuse.search(query).map(result => result.item);

  if (matches.length === 0) {
    resultsDiv.innerHTML = "<p>No matching error found.</p>";
    return;
  }

  matches.forEach(err => {
    const div = document.createElement('div');
    div.innerHTML = `<div id="errorTitle">${err.title}</div>
                     <div id="errorSolution">${err.solution}</div>`;
    resultsDiv.appendChild(div);
  });
}
