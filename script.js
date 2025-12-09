const API_URL = 'http://localhost:3000/movies';

const movieListDiv = document.getElementById('movie-list');
const searchInput = document.getElementById('search-input');
const form = document.getElementById('add-movie-form');

let allMovies = [];

function renderMovies(list) {
  movieListDiv.innerHTML = '';
  if (list.length === 0) {
    movieListDiv.innerHTML = '<p>No movies found.</p>';
    return;
  }

  list.forEach(movie => {
    const div = document.createElement('div');
    div.innerHTML = `
      <p><strong>${movie.title}</strong> (${movie.year}) - ${movie.genre}</p>
      <button onclick="editMovie(${movie.id}, '${movie.title}', ${movie.year}, '${movie.genre}')">Edit</button>
      <button onclick="deleteMovie(${movie.id})">Delete</button>
    `;
    movieListDiv.appendChild(div);
  });
}

function fetchMovies() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      allMovies = data;
      renderMovies(allMovies);
    });
}

fetchMovies();

searchInput.addEventListener('input', () => {
  const s = searchInput.value.toLowerCase();
  const filtered = allMovies.filter(m =>
    m.title.toLowerCase().includes(s) ||
    m.genre.toLowerCase().includes(s)
  );
  renderMovies(filtered);
});

form.addEventListener('submit', e => {
  e.preventDefault();

  const newMovie = {
    title: document.getElementById('title').value,
    genre: document.getElementById('genre').value,
    year: parseInt(document.getElementById('year').value)
  };

  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newMovie)
  })
    .then(res => res.json())
    .then(() => {
      form.reset();
      fetchMovies();
    });
});

function editMovie(id, t, y, g) {
  const title = prompt('New Title:', t);
  const year = prompt('New Year:', y);
  const genre = prompt('New Genre:', g);

  if (!title || !year || !genre) return;

  const updated = {
    id,
    title,
    year: parseInt(year),
    genre
  };

  fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updated)
  })
    .then(res => res.json())
    .then(() => fetchMovies());
}

function deleteMovie(id) {
  fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    .then(() => fetchMovies());
}
