let isLocked = false; // Переменная для отслеживания состояния блокировки

function showContainer(containerId, titleText) {

    isLocked = false;
    // Скрыть все контейнеры
    const containers = document.querySelectorAll('.nav-items-container');
    containers.forEach(container => {
        container.classList.add('hidden');
    });

    // Показать нужный контейнер
    const targetContainer = document.getElementById(containerId);
    if (targetContainer) {
        targetContainer.classList.remove('hidden');
    }

    // Обновить текст заголовка
    const title = document.querySelector('.title');
    title.innerHTML = titleText;
}

function updatePhoneHandlers() {
    document.querySelectorAll('.phone').forEach(function(phoneElement) {
        phoneElement.addEventListener('click', function() {
            var phoneInfo = this.closest('.container').querySelector('.phone-info');
            phoneInfo.classList.toggle('hidden');

            var phoneRect = this.getBoundingClientRect();
            var infoRect = phoneInfo.getBoundingClientRect();

            // Установка позиции над кнопкой телефона
            phoneInfo.style.top = (phoneRect.top - infoRect.height - 30) + 'px';
            // phoneInfo.style.left = (phoneRect.left + (phoneRect.width / 2) - (infoRect.width / 2)) + 'px';
            });
    });
}

function updateIndfoHandlers() {
    document.querySelectorAll('.info').forEach(function(phoneElement) {
        phoneElement.addEventListener('click', function() {
            var phoneInfo = this.closest('.container').querySelector('.info-msg');
            phoneInfo.classList.toggle('hidden');

            var phoneRect = this.getBoundingClientRect();
            var infoRect = phoneInfo.getBoundingClientRect();

            // Установка позиции над кнопкой телефона
            phoneInfo.style.top = (phoneRect.top - infoRect.height - 30) + 'px';
            // phoneInfo.style.left = (phoneRect.left + (phoneRect.width / 2) - (infoRect.width / 2)) + 'px';
            });
    });
}

document.addEventListener('DOMContentLoaded', function() {

    function updateContainerLock(container) {
        const navigationContainer = document.getElementById('navigation-container');
        if (container.scrollTop > 0) {
            isLocked = true;
        } else {
            isLocked = false;
        }
    }

    function setContainerEventListeners(containerId) { // Добавляет EventListeners для scroll и touch
        const container = document.getElementById(containerId);
        if (container) {
            container.addEventListener('scroll', () => {
                updateContainerLock(container);
            });
            container.addEventListener('touchstart', (event) => {
                updateContainerLock(container); // Обновляем состояние блокировки при касании
            });
        }
    }

    function animateHeight(element, startHeight, targetHeight) {
        let currentHeight = startHeight;
        function step() {
            currentHeight += (targetHeight - currentHeight) * 0.2; // Плавное изменение высоты
            element.style.height = `${currentHeight}px`;

            if (Math.abs(currentHeight - targetHeight) > 1) {
                animationFrameId = requestAnimationFrame(step);
            } else {
                cancelAnimationFrame(animationFrameId);
            }
        }
        animationFrameId = requestAnimationFrame(step);
    }

    const navContainer = document.getElementById('navigation-container');
    const extraContent = document.querySelector('.extra-content');
    const windowHeight = window.innerHeight;

    // Ограничиваем движение контейнера в пределах экрана
    const maxHeight = windowHeight;
    const minHeight = windowHeight * 0.14;

    let startTouchY = 0;
    let startHeight = 0;
    let isDragging = false;

    let animationFrameId = null; // Идентификатор для requestAnimationFrame

    navContainer.addEventListener('touchstart', function(event) {
        if (!isLocked) {
            startTouchY = event.touches[0].clientY;
            startHeight = navContainer.offsetHeight;
            isDragging = true;
        }
    });

    navContainer.addEventListener('touchmove', function(event) {
        if (isDragging) {
            const currentTouchY = event.touches[0].clientY;
            const deltaY = startTouchY - currentTouchY;

            // Рассчитываем новую высоту панели
            let newHeight = startHeight + deltaY;

            // Ограничиваем высоту панели
            newHeight = Math.max(minHeight, Math.min(newHeight, maxHeight));

            // Отложенное применение новой высоты с использованием requestAnimationFrame
            cancelAnimationFrame(animationFrameId); // Отменяем предыдущий запрос кадра анимации
            animationFrameId = requestAnimationFrame(function() {
                navContainer.style.height = `${newHeight}px`;
            });
        }
    });

    navContainer.addEventListener('touchend', function() {
        isDragging = false;

        // Определяем середину экрана
        const midPoint = windowHeight / 2;

        // Текущая высота и bottom контейнера
        const currentHeight = navContainer.offsetHeight;

        // Анимируем изменение высоты с учетом середины экрана
        let targetHeight = 0;
        if (currentHeight > midPoint) {
            targetHeight = maxHeight; 
            extraContent.classList.remove('hidden'); // Показываем дополнительные элементы
        } else {
            targetHeight = minHeight;
            extraContent.classList.add('hidden'); // Скрываем дополнительные элементы
        }
        animateHeight(navContainer, currentHeight, targetHeight);
    });

    setContainerEventListeners('campuses-container');
    setContainerEventListeners('sport-complexes-container');
    setContainerEventListeners('dorms-container');
    setContainerEventListeners('nav-container');
});