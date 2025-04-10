const apiKey = "d28ca544343ef665d11e5a5f0364beee";
const baseUrl = "https://api.themoviedb.org/3";
const imageBaseUrl = "https://image.tmdb.org/t/p/w500";

const generos = {
    fantasia: 14,
    terror: 27,
    comedia: 35
};

const peliculasUsadas = new Set();

async function cargarPeliculas(generoNombre, containerId) {
    const generoId = generos[generoNombre];

    try {
        const response = await fetch(`${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=${generoId}&language=es-ES&sort_by=popularity.desc`);
        const data = await response.json();
        const contenedor = document.getElementById(containerId);
        contenedor.innerHTML = "";

        const peliculasFiltradas = data.results.filter(p => !peliculasUsadas.has(p.id)).slice(0, 10);
        peliculasFiltradas.forEach(p => peliculasUsadas.add(p.id));

        for (const pelicula of peliculasFiltradas) {
            const idiomaOriginal = pelicula.original_language;
            let descripcion = pelicula.overview || "Descripción no disponible.";

            if (idiomaOriginal !== 'es' || !pelicula.overview) {
                descripcion = await obtenerTraduccion(pelicula);
            }
            crearPelicula(pelicula, descripcion, contenedor);
        }
    } catch (error) {
        console.error("Error cargando películas:", error);
    }
}

async function obtenerTraduccion(pelicula) {
    try {
        const response = await fetch(`${baseUrl}/movie/${pelicula.id}/translations?api_key=${apiKey}`);
        const translations = await response.json();
        const translation = translations.translations.find(t => t.iso_639_1 === 'es');

        if (translation && translation.data.overview) {
            return translation.data.overview;
        } else if (pelicula.overview) {
            return pelicula.overview;
        } else {
            return "Descripción no disponible.";
        }
    } catch (error) {
        console.error("Error obteniendo traducción:", error);
        return pelicula.overview || "Descripción no disponible.";
    }
}

function crearPelicula(pelicula, descripcion, contenedor) {
    const div = document.createElement("div");
    div.classList.add("pelicula");

    const imageUrl = `${imageBaseUrl}${pelicula.backdrop_path}`;
    div.style.backgroundImage = `url('${imageUrl}')`;

    const uniqueId = `toggle-${pelicula.id}-${Math.random().toString(36).substr(2, 9)}`;

    div.innerHTML = `
        <input type="checkbox" class="toggle-details" id="${uniqueId}">
        <label for="${uniqueId}" class="pelicula-label"></label>
        <div class="contenido">
            <h3 class="titulo">${pelicula.title}</h3>
            <div class="valoracion">
                <i class="fa-solid fa-star"></i>
                <span class="puntuacion">${pelicula.vote_average.toFixed(1)}</span>
            </div>
        </div>
        <p class="descripcion">${descripcion}</p>
        <button class="btn-princ" onclick="verTrailer(${pelicula.id})">Ver trailer</button>
    `;

    // Comportamiento exclusivo para móvil
    div.querySelector('.toggle-details').addEventListener('change', function () {
        if (window.innerWidth <= 768 && this.checked) {
            document.querySelectorAll('.toggle-details').forEach(input => {
                if (input !== this) input.checked = false;
            });
        }
    });

    contenedor.appendChild(div);
}

function verTrailer(movieId) {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=es-ES`)
        .then(response => response.json())
        .then(data => {
            let trailers = data.results.filter(video =>
                video.type === "Trailer" && video.site === "YouTube"
            );

            if (trailers.length === 0) {
                return fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`)
                    .then(response => response.json());
            }

            return { results: trailers };
        })
        .then(data => {
            const trailers = data.results.filter(video =>
                video.type === "Trailer" && video.site === "YouTube"
            );

            const trailerOficial = trailers.find(video =>
                /official|tráiler/i.test(video.name)
            ) || trailers[0];

            if (trailerOficial) {
                const youtubeUrl = `https://www.youtube.com/watch?v=${trailerOficial.key}`;
                window.open(youtubeUrl, "_blank");
            } else {
                alert("No se encontró un tráiler disponible.");
            }
        })
        .catch(error => {
            console.error("Error obteniendo el tráiler:", error);
            alert("Ocurrió un error al intentar cargar el tráiler.");
        });
}

function setupCarouselArrows() {
    const arrows = document.querySelectorAll('.carousel-arrow');
    arrows.forEach(arrow => {
        arrow.addEventListener('click', () => {
            const containerId = arrow.getAttribute('data-container');
            const container = document.getElementById(containerId);
            const scrollAmount = container.querySelector('.pelicula').offsetWidth + 40; // Calcula el ancho de una película con el espacio extra

            if (arrow.classList.contains('left')) {
                container.scrollLeft -= scrollAmount;
            } else {
                container.scrollLeft += scrollAmount;
            }
        });
    });
}

window.onload = () => {
    cargarPeliculas("fantasia", "fantasia-container");
    cargarPeliculas("terror", "terror-container");
    cargarPeliculas("comedia", "comedia-container");
    setupCarouselArrows();
};





