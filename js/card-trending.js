document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card-trending');
    const buttons = document.querySelectorAll('.btn-princ');

    // Alterna la clase 'active' en la tarjeta seleccionada
    cards.forEach(card => {
        card.addEventListener('click', () => {           
            card.classList.toggle('active');
        });
    });

    // Evita que el clic en el botón cierre la tarjeta
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation(); // Detiene la propagación del evento al contenedor padre
            console.log('Botón clickeado');
        });
    });
});