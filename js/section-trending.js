document.addEventListener('DOMContentLoaded', () => {
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMjhjYTU0NDM0M2VmNjY1ZDExZTVhNWYwMzY0YmVlZSIsIm5iZiI6MTc0MzQ5NDc2NS44NTksInN1YiI6IjY3ZWI5ZTZkMDNiYWJkY2VkMjdhYWQzOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vGTtoyn8yN_uXRMJYTYsVg6g6JHmYtILNOjL5oxgsDU'
        }
      };
    
    // Selecciona el contenedor donde se agregarán las tarjetas
    const sectionCardsTrending = document.querySelector('.section-cards-trending');
      
    // Realiza la solicitud a la API de TMDB
    // Llama a la API y genera las tarjetas
    fetch('https://api.themoviedb.org/3/trending/movie/day?language=es-US', options)
        .then(res => res.json())
        .then(data => {
            console.log(data); // Verifica la respuesta de la API
            const movies = data.results;
            console.log(movies); // Asegúrate de que contiene las películas

            // Asegúrate de que `movies` contiene datos
            if (!movies || movies.length === 0) {
            console.error('No se encontraron películas.');
            return;
            }
    
            // Itera sobre las películas y crea las tarjetas
            movies.slice(0, 3).forEach((movie, index) => {
            const card = document.createElement('article');
            card.classList.add('card-trending');
            card.setAttribute('aria-label', `cartel de la película ${movie.title}`);
    
            // Establece la imagen de fondo usando la URL del póster de la API
            const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            card.style.backgroundImage = `url('${posterUrl}')`;

            // Genera el contenido de la tarjeta usando tu estructura semántica
            card.innerHTML = `
                    <p class="numero-trending">#${index + 1}</p>
                    <img class="img-trending-oculta" src="https://im.ziffdavisinternational.com/ign_es/screenshot/default/avatar_6fyc.jpg" alt="cartel de la película ${movie.title}">
                    <section class="titulo-valoracion-trending">
                        <h2 class="titulo-trending">${movie.title}</h2>
                        <section class="valoracion-trending">
                            <i class="fa-solid fa-star"></i>
                            <p>${movie.vote_average.toFixed(1)}</p>
                        </section>
                    </section>
                    <p class="description-trending">${movie.overview}</p>
                    <button class="btn-princ" data-movie-id="${movie.id}">Ver trailer</button>`;
                
                // Agrega la tarjeta al contenedor
                sectionCardsTrending.appendChild(card);
            });

            // Escucha los clics en el contenedor de las tarjetas
            sectionCardsTrending.addEventListener('click', (event) => {
            // Verifica si el clic ocurrió en un botón "Ver trailer"
            if (event.target.classList.contains('btn-princ')) {
                const movieId = event.target.getAttribute('data-movie-id'); // Obtén el ID de la película
                fetchTrailer(movieId); // Llama a la función para obtener el tráiler
            }
        });
    })
      .catch(err => console.error(err));

    // Función para obtener y mostrar el tráiler
    function fetchTrailer(movieId) {
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`, options)
            .then(res => res.json())
            .then(data => {
                // Busca un video de tipo "Trailer" alojado en YouTube
                const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
                if (trailer) {
                    const trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
                    window.open(trailerUrl, '_blank'); // Abre el tráiler en una nueva pestaña
                } else {
                    alert('No se encontró un tráiler para esta película.');
                }
            })
            .catch(err => console.error('Error al obtener el tráiler:', err));
    }

    

});

