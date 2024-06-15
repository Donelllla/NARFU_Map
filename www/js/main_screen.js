document.addEventListener('DOMContentLoaded', function() {
    const navContainer = document.getElementById('navigation-container');
    const extraContent = document.querySelector('.extra-content');
    const windowHeight = window.innerHeight;

    // Ограничиваем движение контейнера в пределах экрана
    const maxHeight= windowHeight;
    const minHeight = windowHeight * 0.14;
    
    let startTouchY = 0;
    let startHeight = 0;
    let isDragging = false;

    navContainer.addEventListener('touchstart', function(event) {
        startTouchY = event.touches[0].clientY;
        startHeight = navContainer.offsetHeight;
        isDragging = true;
    });

    navContainer.addEventListener('touchmove', function(event) {
        if (isDragging) {
            const currentTouchY = event.touches[0].clientY;
            const deltaY = startTouchY - currentTouchY;

            // Рассчитываем новую высоту панели
            let newHeight = startHeight + deltaY;

            // Ограничиваем высоту панели
            newHeight = Math.max(minHeight, Math.min(newHeight, maxHeight));

            // Устанавливаем новую высоту панели
            navContainer.style.height = `${newHeight}px`;
        }
    });

    navContainer.addEventListener('touchend', function() {
        isDragging = false;

        // Определяем середину экрана
        const midPoint = windowHeight / 2;

        // Текущая высота и bottom контейнера
        const currentHeight = navContainer.offsetHeight;

        // Если контейнер находится выше середины, перемещаем его вверх
        if (currentHeight > midPoint) {
            navContainer.style.height = `${maxHeight}px`; 
            extraContent.classList.remove('hidden'); // Показываем дополнительные элементы
        } else {
            navContainer.style.height = `${minHeight}px`;
            extraContent.classList.add('hidden'); // Скрываем дополнительные элементы
        }
    });
});
