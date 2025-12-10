// Base API URL
const API_URL = "http://localhost:3000/movies";

const movieListDiv = document.getElementById("movie-list");
const searchInput = document.getElementById("search-input");
const form = document.getElementById("add-movie-form");

let allMovies = []; // store all movies

// Render movies on screen (creates elements and uses addEventListener)
function renderMovies(moviesToDisplay) {
  movieListDiv.innerHTML = "";

  if (moviesToDisplay.length === 0) {
    movieListDiv.innerHTML = "<p>No movies found.</p>";
    return;
  }

  moviesToDisplay.forEach((movie) => {
    // container
    const movieElement = document.createElement("div");
    movieElement.classList.add("movie-item");

    // text
    const info = document.createElement("p");
    info.innerHTML = `<strong>${escapeHtml(movie.title)}</strong> (${
      movie.year
    }) - ${escapeHtml(movie.genre)}`;

    // buttons container
    const btnWrap = document.createElement("div");

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => {
      editMoviePrompt(movie.id, movie.title, movie.year, movie.genre);
    });

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      // optional confirm before delete
      if (confirm(`Delete "${movie.title}"?`)) {
        deleteMovie(movie.id);
      }
    });

    // style: keep original order (edit then delete)
    btnWrap.appendChild(editBtn);
    btnWrap.appendChild(deleteBtn);

    movieElement.appendChild(info);
    movieElement.appendChild(btnWrap);

    movieListDiv.appendChild(movieElement);
  });
}

// simple HTML escape to avoid injection or broken text
function escapeHtml(str) {
  if (typeof str !== "string") return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Fetch movies (GET)
function fetchMovies() {
  fetch(API_URL)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then((movies) => {
      allMovies = Array.isArray(movies) ? movies : [];
      renderMovies(allMovies);
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      movieListDiv.innerHTML =
        '<p style="color:salmon">Could not load movies. Check console and ensure JSON Server is running.</p>';
    });
}

fetchMovies(); // load movies on start

// Search movies
searchInput.addEventListener("input", () => {
  const term = searchInput.value.trim().toLowerCase();

  if (term === "") {
    renderMovies(allMovies);
    return;
  }

  const filtered = allMovies.filter(
    (movie) =>
      (movie.title && movie.title.toLowerCase().includes(term)) ||
      (movie.genre && movie.genre.toLowerCase().includes(term))
  );

  renderMovies(filtered);
});

// Add new movie (POST)
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const titleEl = document.getElementById("title");
  const genreEl = document.getElementById("genre");
  const yearEl = document.getElementById("year");

  const newMovie = {
    title: titleEl.value.trim(),
    genre: genreEl.value.trim(),
    year: parseInt(yearEl.value, 10),
  };

  // basic validation
  if (!newMovie.title || !newMovie.year || Number.isNaN(newMovie.year)) {
    alert("Please provide a valid title and year.");
    return;
  }

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newMovie),
  })
    .then((res) => {
      if (!res.ok) throw new Error(`POST failed: ${res.status}`);
      return res.json();
    })
    .then(() => {
      form.reset();
      fetchMovies();
    })
    .catch((err) => {
      console.error("POST error:", err);
      alert("Failed to add movie. Check console.");
    });
});

// Edit movie prompt
function editMoviePrompt(id, currentTitle, currentYear, currentGenre) {
  // Use prompt but pre-fill and trim results; could be replaced with modal for nicer UI
  const newTitle = prompt("Enter new title:", currentTitle);
  if (newTitle === null) return; // user cancelled
  const newYearRaw = prompt("Enter new year:", currentYear);
  if (newYearRaw === null) return;
  const newGenre = prompt("Enter new genre:", currentGenre);
  if (newGenre === null) return;

  const newYear = parseInt(newYearRaw, 10);
  if (!newTitle.trim() || Number.isNaN(newYear)) {
    alert("Invalid input. Title required and year must be a number.");
    return;
  }

  const updated = {
    id: id,
    title: newTitle.trim(),
    year: newYear,
    genre: newGenre.trim(),
  };

  updateMovie(id, updated);
}

// Update movie (PUT)
function updateMovie(movieId, updatedMovie) {
  fetch(`${API_URL}/${movieId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedMovie),
  })
    .then((res) => {
      if (!res.ok) throw new Error(`PUT failed: ${res.status}`);
      return res.json();
    })
    .then(() => fetchMovies())
    .catch((err) => {
      console.error("PUT error:", err);
      alert("Failed to update movie. Check console.");
    });
}

// Delete movie (DELETE)
function deleteMovie(movieId) {
  fetch(`${API_URL}/${movieId}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (!res.ok) throw new Error(`DELETE failed: ${res.status}`);
      return res;
    })
    .then(() => fetchMovies())
    .catch((err) => {
      console.error("DELETE error:", err);
      alert("Failed to delete movie. Check console.");
    });
}