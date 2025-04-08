document.addEventListener('DOMContentLoaded', () => {
    const container = document.body; // Usamos el body como contenedor para delegar eventos

    // Alterna la clase 'active' en la tarjeta seleccionada
    container.addEventListener('click', (event) => {
        const card = event.target.closest('.card-trending'); // Verifica si el clic fue en una tarjeta
        if (card && !event.target.classList.contains('btn-princ')) { 
            // Evita que el clic en el botón afecte a la tarjeta
            card.classList.toggle('active');
        }
    });

    // Evita que el clic en el botón cierre la tarjeta
    container.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-princ')) {
            event.stopPropagation(); // Detiene la propagación del evento
            console.log('Botón clickeado');
        }
    });
});