document.addEventListener('DOMContentLoaded', function () {
    const politicaLink = document.getElementById('politica-link');
    const mainContent = document.getElementById('main-content');
    const paginaInicio = ''; // Contenido vacío para la página de inicio

    // Guarda el estado inicial en el historial
    history.replaceState({ page: "inicio" }, "", location.pathname);

    if (politicaLink) {
        politicaLink.addEventListener('click', function (event) {
            event.preventDefault(); // Evita que el enlace recargue la página

            // Agregar una nueva entrada en el historial del navegador
            history.pushState({ page: "politica" }, "", "#politica");

            // Cargar el contenido de la política de seguridad
            fetch('Politica de Seguridad.html') // Asegúrate de que la ruta sea correcta
                .then(response => response.text())
                .then(data => {
                    mainContent.innerHTML = data; // Inserta el contenido dinámicamente
                })
                .catch(error => console.error('Error al cargar el contenido:', error));
        });
    }

    // Manejar el botón de retroceso del navegador
    window.addEventListener('popstate', function (event) {
        if (event.state && event.state.page === "inicio") {
            mainContent.innerHTML = paginaInicio; // Restaurar la página de inicio sin recargar
        }
    });
});
