let errors = [];
let dataLoaded = false;

// Load errors.json
fetch("./errors.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("errors.json not found");
    }
    return response.json();
  })
  .then(data => {
    errors = data;
    dataLoaded = true;
    console.log("Errors loaded:", errors.length);
  })
  .catch(error => {
    console.error("Failed to load errors.json:", error);
  });

const searchInput = document.getElementById("searchInput");
const suggestionsBox = document.getElementById("suggestions");
const resultBox = document.getElementById("result");

// 🔍 AUTOCOMPLETE
searchInput.addEventListener("input", () => {
  if (!dataLoaded) return;

  const query = searchInput.value.toLowerCase();
  suggestionsBox.innerHTML = "";

  if (query.length < 2) return;

  const matches = errors.filter(err =>
    err.title.toLowerCase().includes(query) ||
    err.keywords.some(k => k.toLowerCase().includes(query))
  );

  matches.slice(0, 5).forEach(match => {
    const div = document.createElement("div");
    div.className = "suggestion-item";
    div.textContent = match.title;

    div.onclick = () => {
      searchInput.value = match.title;
      suggestionsBox.innerHTML = "";
      showResult(match);
    };

    suggestionsBox.appendChild(div);
  });
});

// 🔎 SEARCH BUTTON
function searchError() {
  if (!dataLoaded) {
    resultBox.innerHTML = "<b>Loading data… please try again.</b>";
    return;
  }

  const query = searchInput.value.toLowerCase().trim();
  suggestionsBox.innerHTML = "";

  const found = errors.find(err =>
    err.title.toLowerCase().includes(query) ||
    err.keywords.some(k => k.toLowerCase().includes(query))
  );

  if (found) {
    showResult(found);
  } else {
    resultBox.innerHTML = "<b>No solution found.</b>";
  }
}

// 📋 SHOW RESULT
function showResult(error) {
  resultBox.innerHTML = `
    <h3>${error.title}</h3>
    <p>${error.solution}</p>
  `;
}
