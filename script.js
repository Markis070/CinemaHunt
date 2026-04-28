// =======================
// FAVORITES SYSTEM (CLEAN)
// =======================

const favoritesList = document.getElementById("favorites-list");
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// 🔁 rebuild favorites UI (single source of truth)
function renderFavorites() {
    favoritesList.innerHTML = "";

    favorites.forEach(movie => {
        const card = document.createElement("div");
        card.classList.add("fav-card");

        card.innerHTML =`
            <img src="${movie.poster}" width="80">
            <h4>${movie.title}</h4>
            <button class="remove-fav-btn" data-id="${movie.id}">Remove</button>
        `;

        // 🎬 CLICK → OPEN MODAL
        card.addEventListener("click", (e) => {
            if (e.target.closest(".remove-fav-btn")) return;

            getMovieDetails(movie.id);
        });

        favoritesList.appendChild(card);
    });
    // 🔥 Add remove functionality
    const removeButtons = document.querySelectorAll(".remove-fav-btn");

    removeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.dataset.id;

            favorites = favorites.filter(movie => movie.id !== id);
            localStorage.setItem("favorites", JSON.stringify(favorites));

            renderFavorites(); // re-render
        });
    });
}

// Run on load
renderFavorites();

// =======================
// FAVORITE BUTTON LOGIC
// =======================

// =======================
// MODAL SYSTEM
// =======================

const modal = document.getElementById("movie-modal");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const closeModal = document.getElementById("close-modal");

function setupModal() {
    const cards = document.querySelectorAll(".movie-card");

    cards.forEach(card => {
        card.addEventListener("click", () => {
            const title = card.querySelector("h3").textContent;

            modalTitle.textContent = title;
            modalDescription.textContent = "More details coming soon...";

            modal.style.display = "flex";
        });
    });
}

// Close modal
closeModal.onclick = () => {
    modal.style.display = "none";
};

window.onclick = (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
};

// =======================
// SEARCH (API)
// =======================

const searchInput = document.getElementById("search-input");
const loading = document.getElementById("loading");

searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();

    if (query.length > 2) {
        searchMovies(query);
    }
});

async function searchMovies(query) {
    const apiKey = "1caa87d3";

    // 🔄️ SHOW loading
    loading.style.display = "block";

    const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`);
    const data = await response.json();

    // ❌ HIDE loading
    loading.style.display = "none";

    if (data.Search) {
        displayMovies(data.Search);
    } else {
        document.getElementById("movies").innerHTML = "<h2>No results found</h2>";
    }
}

async function getTrendingMovies() {
    const apiKey = "1caa87d3";

    const response = await fetch(`https://www.omdbapi.com/?s=popular&apikey=${apiKey}`);
    const data = await response.json();

    if (data.Search) {
        displayTrending(data.Search);
    }
}

function displayTrending(movies) {
    const trendingSection = document.getElementById("trending-movies");

    trendingSection.innerHTML = "";

    movies.forEach(movie => {
        const card = document.createElement("div");
        card.classList.add("movie-card");

        card.innerHTML = `
            <h3>${movie.Title}</h3>
            <button class="add-fav-btn"
                data-id="${movie.imdbID}"
                data-title="${movie.Title}"
                data-poster="${movie.Poster}"
                <span class="heart-icon">🤍</span> Add to Favorites
                </button>
                <img src="${movie.Poster !== "N/A" ? movie.Poster : ""}" />
        `;

        trendingSection.appendChild(card);

        card.addEventListener("click", (e) => {
            if (e.target.closest(".add-fav-btn")) return;
            getMovieDetails(movie.imdbID);
        });
    });
}

async function getCategoryMovies(category, elementId) {
    const apiKey = "1caa87d3";

    const response = await fetch(`https://www.omdbapi.com/?s=${category}&apikey${apiKey}`);
    const data = await response.json();

    if (data.Search) {
        displayCategory(data.Search, elementId);
    }
}

function displayCategory(movies, elementId) {
    const container = document.getElementById(elementId);

    container.innerHTML = "";

    movies.forEach(movie => {
        const card = document.createElement("div");
        card.classList.add("movie-card");

        card.innerHTML = `
            <h3>${movie.Title}</h3>
            <button class="add-fav-btn"
                data-id="${movie.imdbID}"
                data-title="${movie.Title}"
                data-poster="${movie.Poster}"
                <span class="heart-icon">🤍</span> Add to Favorites
            </button>
            <img src="${movie.Poster !== "N/A" ? movie.Poster : ""}" />
        `;

        container.appendChild(card);

        card.addEventListener("click", (e) => {
            if (e.target.closest(".add-fav-btn")) return;
            getMovieDetails(movie.imdbID);
        });
    });
}

async function getMovieDetails(imdbID) {
    const apiKey = "1caa87d3";

    const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apiKey=${apiKey}`);
    const data = await response.json();

    //Fill modal with REAL data
    modalTitle.textContent = data.Title;
    modalDescription.innerHTML = `
        <strong>Year:</strong> ${data.Year}<br>
        <strong>Genre:</strong> ${data.Genre}<br><br>
        ${data.Plot}
    `;

    modal.style.display = "flex";
}

// =======================
// DISPLAY API MOVIES
// =======================

function displayMovies(movies) {
    const moviesSection = document.getElementById("movies");

    moviesSection.innerHTML = "<h2>Results</h2>";

    movies.forEach(async (movie) => {
        const details = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=1caa87d3`);
        const fullData = await details.json();

        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");

        movieCard.innerHTML = `
            <h3>${movie.Title}</h3>

            <button class="add-fav-btn"
                data-id="${movie.imdbID}"
                data-title="${movie.Title}"
                data-poster="${movie.Poster}">
                <span class="heart-icon">🤍</span> Add to Favorites
            </button>

            <img src="${movie.Poster !== "N/A" ? movie.Poster : ""}" />

            <p>⭐ ${fullData.imdbRating !== "N/A" ? fullData.imdbRating : "No rating"}</p>
            <p>Click to learn more...</p>
        `;

        moviesSection.appendChild(movieCard);

        movieCard.addEventListener("click", (e) => {
            if (e.target.closest(".add-fav-btn")) return;
            getMovieDetails(movie.imdbID);
        });
    });
}

searchMovies("home");

document.addEventListener("click", (e) => {
    const button = e.target.closest(".add-fav-btn");
    if (!button) return;

    e.stopPropagation();

    const id = button.dataset.id;
    const title = button.dataset.title;
    const poster = button.dataset.poster;

    if (!id || !title) return;

    const exists = favorites.some(movie => movie.id === id);

    if (exists) {
        // REMOVE
        favorites = favorites.filter(movie => movie.id !== id);

        button.classList.remove("added");
        button.innerHTML = '<span class="heart-icon">🤍</span> Add to Favorites';
    } else {
        // ADD
        favorites.push({ id, title, poster });

        button.classList.add("added");
        button.innerHTML = '<span class="heart-icon">❤️</span> Added!';
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();
});

getTrendingMovies();

getCategoryMovies("action", "action-movies");
getCategoryMovies("comedy", "comedy-movies");
getCategoryMovies("horror", "horror-movies");