ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map("map-container", {
        center: [64.544304, 40.538735], // Центр карты (Архангельск)
        zoom: 13, // Уровень масштабирования карты
        controls: [] // Пустой массив, чтобы убрать все стандартные элементы управления
    });

    // Обработчик клика на кнопку увеличения
    document.querySelector('.plus-button').addEventListener('click', function() {
        myMap.setZoom(myMap.getZoom() + 1, { duration: 300 }); // Увеличение масштаба с анимацией
    });

    // Обработчик клика на кнопку уменьшения
    document.querySelector('.minus-button').addEventListener('click', function() {
        myMap.setZoom(myMap.getZoom() - 1, { duration: 300 }); // Уменьшение масштаба с анимацией
    });

    // Создаем элемент управления поиска
    var searchControl = new ymaps.control.SearchControl({
        options: {
            provider: 'yandex#search',
            size: 'medium' // large видно за строкой писка
        }
    });

    // Добавляем скрытый элемент управления поиска на карту
    myMap.controls.add(searchControl, { float: 'none' });

    // Функция для обновления позиции элемента управления поиска
    function updateSearchControlPosition() {
        var searchBox = document.querySelector('.search-box');
        var searchBoxRect = searchBox.getBoundingClientRect();
        var mapContainerRect = document.querySelector('.map-container').getBoundingClientRect();

        var top = searchBoxRect.bottom - mapContainerRect.top - 35;
        var left = searchBoxRect.left - mapContainerRect.left;

        searchControl.options.set('position', {
            top: top,
            left: left
        });
    }

    // Обновляем позицию элемента управления поиска при загрузке и при изменении размера окна
    updateSearchControlPosition();
    window.addEventListener('resize', updateSearchControlPosition);

    // Привязываем элемент управления к вашему input
    var searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            var request = searchInput.value;
            searchControl.search(request);
        }
    });

    // Добавляем элемент управления на карту
    // myMap.controls.add(searchControl, { position: { top: 15, left: auto} });
}
