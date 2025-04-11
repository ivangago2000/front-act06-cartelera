const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMjhjYTU0NDM0M2VmNjY1ZDExZTVhNWYwMzY0YmVlZSIsIm5iZiI6MTc0MzQ5NDc2NS44NTksInN1YiI6IjY3ZWI5ZTZkMDNiYWJkY2VkMjdhYWQzOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vGTtoyn8yN_uXRMJYTYsVg6g6JHmYtILNOjL5oxgsDU";
const API_URL = "https://api.themoviedb.org/3/search/movie";

window.addEventListener("DOMContentLoaded", () => {
  const buscador = document.getElementById("buscador");
  const botonBuscar = document.getElementById("boton-buscar");
  const contenedor = document.getElementById("main-content");

  async function ejecutarBusqueda() {
    const query = buscador.value.trim();

    if (!query) {
      alert("Por favor escribe algo para buscar.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}?query=${encodeURIComponent(query)}&language=es-ES`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json;charset=utf-8"
        }
      });

      const data = await response.json();
      mostrarPeliculas(data.results, contenedor);
      history.pushState({ search: query }, '', `?search=${query}`);
    } catch (error) {
      console.error("Error al buscar películas:", error);
      alert("Error al realizar la búsqueda.");
    }
  }

  botonBuscar.addEventListener("click", ejecutarBusqueda);
  buscador.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      ejecutarBusqueda();
    }
  });
});

function mostrarPeliculas(peliculas, contenedor) {
  contenedor.innerHTML = "";

  if (!peliculas || peliculas.length === 0) {
    contenedor.innerHTML = "<p>No se encontraron resultados.</p>";
    return;
  }

  peliculas.forEach(peli => {
    const div = document.createElement("div");
    div.className = "pelicula";
    div.innerHTML = `
      <div class="pelicula-content">
        <div class="pelicula-imagen">
          ${peli.poster_path ? `<img src="https://image.tmdb.org/t/p/w300${peli.poster_path}" alt="${peli.title}"/>` : ""}
        </div>
        <div class="pelicula-info">
          <h3>${peli.title}</h3>
          <p><strong>Fecha de estreno:</strong> ${peli.release_date || "Desconocida"}</p>
          <p>${peli.overview || "Sin descripción disponible."}</p>
          <button class="btn-princ" onclick="mostrarTrailer(${peli.id})">
            Ver trailer
          </button>
        </div>
      </div>
    `;
    contenedor.appendChild(div);
  });
}

async function mostrarTrailer(movieId) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?language=es-US`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TOKEN}`
      }
    });
    const data = await response.json();

    const trailer = data.results.find(video => video.type === "Trailer" && video.site === "YouTube");

    if (trailer) {
      const youtubeUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
      window.open(youtubeUrl, "_blank");
    } else {
      alert("Trailer no disponible.");
    }

  } catch (err) {
    console.error("Error al obtener el trailer:", err);
    alert("No se pudo cargar el trailer.");
  }
}
