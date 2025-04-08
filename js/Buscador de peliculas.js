const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMjhjYTU0NDM0M2VmNjY1ZDExZTVhNWYwMzY0YmVlZSIsIm5iZiI6MTc0MzQ5NDc2NS44NTksInN1YiI6IjY3ZWI5ZTZkMDNiYWJkY2VkMjdhYWQzOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vGTtoyn8yN_uXRMJYTYsVg6g6JHmYtILNOjL5oxgsDU";
const API_URL = "https://api.themoviedb.org/3/search/movie";

window.addEventListener("DOMContentLoaded", () => {
  const buscador = document.getElementById("buscador");
  const botonBuscar = document.getElementById("boton-buscar");
  const contenedor = document.getElementById("main-content");

  // Redirigir al inicio cuando el usuario presiona el botón de retroceso
  window.addEventListener("popstate", () => {
    if (window.location.pathname !== "/index.html") { // Verifica que no estemos en el inicio
      window.location.href = "index.html";  // Redirige al inicio
    }
  });

  // Si es la primera vez que se busca algo, añadimos un estado al historial
  async function ejecutarBusqueda() {
    const query = buscador.value.trim();

    if (!query) {
      alert("Por favor escribe algo para buscar.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}?query=${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json;charset=utf-8"
        }
      });

      const data = await response.json();
      mostrarPeliculas(data.results, contenedor);

      // Al realizar la búsqueda, añadir un estado al historial
      history.pushState({ search: query }, '', `?search=${query}`);

    } catch (error) {
      console.error("Error al buscar películas:", error);
    }
  }

  // Clic en el botón de búsqueda
  botonBuscar.addEventListener("click", ejecutarBusqueda);

  // Presionar Enter en el input también realiza la búsqueda
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
      <h3>${peli.title}</h3>
      <p>Fecha de estreno: ${peli.release_date || "Desconocida"}</p>
      ${peli.poster_path ? `<img src="https://image.tmdb.org/t/p/w200${peli.poster_path}" alt="${peli.title}"/>` : ""}
      <p>${peli.overview || "Sin descripción disponible."}</p>
      <hr/>
    `;
    contenedor.appendChild(div);
  });
}
