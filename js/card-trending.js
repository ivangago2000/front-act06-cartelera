document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card-trending');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Alterna la clase 'active' en la tarjeta seleccionada
            card.classList.toggle('active');
        });
    });
});