ymaps.ready(init);

function init() {
    var map = new ymaps.Map("map-container", {
        center: [64.544304, 40.538735], // Центр карты (Архангельск)
        zoom: 13, // Уровень масштабирования карты
        controls: [] // Пустой массив, чтобы убрать все стандартные элементы управления
    });

    // Обработчик клика на кнопку увеличения
    document.querySelector('.plus-button').addEventListener('click', function() {
        map.setZoom(map.getZoom() + 1, { duration: 300 }); // Увеличение масштаба с анимацией
    });

    // Обработчик клика на кнопку уменьшения
    document.querySelector('.minus-button').addEventListener('click', function() {
        map.setZoom(map.getZoom() - 1, { duration: 300 }); // Уменьшение масштаба с анимацией
    });


    // Создаем элемент управления поиска
    var searchControl = new ymaps.control.SearchControl({
        options: {
            provider: 'yandex#search',
            size: 'medium' // large видно за строкой писка
        }
    });

    // Добавляем скрытый элемент управления поиска на карту
    map.controls.add(searchControl, { float: 'none' });

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

    // Найти все элементы с классом 'search-input'
    var searchInputs = document.querySelectorAll('.search-input');
    // Добавить обработчик события для каждого элемента
    searchInputs.forEach(function(searchInput) {
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                var request = searchInput.value;
                searchControl.search(request);
            }
        });
    });


    // Обработчик клика на элемент с классом 'route'
    document.querySelectorAll('.route').forEach(function(routeElement) {
        routeElement.addEventListener('click', function() {
            var address = this.closest('.container').querySelector('.address').textContent;
            showRoute(map, address);
        });
    });
}

function showRoute(map, address) {
    // Проверка доступности геолокации
    if (!ymaps.geolocation) {
        alert('Геолокация не поддерживается вашим браузером');
        return;
    }

    // Получить текущее местоположение пользователя
    ymaps.geolocation.get({
        provider: 'browser',
        mapStateAutoApply: true
    }).then(function(result) {
        var userCoords = result.geoObjects.position;

        // Найти координаты по адресу
        ymaps.geocode(address).then(function(res) {
            var targetCoords = res.geoObjects.get(0).geometry.getCoordinates();

            // Построить маршрут
            var multiRoute = new ymaps.multiRouter.MultiRoute({
                referencePoints: [
                    userCoords,
                    targetCoords
                ],
                params: {
                    routingMode: 'pedestrian' // или 'auto' для автомобильного маршрута
                }
            }, {
                boundsAutoApply: true
            });

            // Очистить карту и добавить новый маршрут
            map.geoObjects.removeAll();
            map.geoObjects.add(multiRoute);
        }).catch(function(error) {
            alert('Ошибка геокодирования: ' + error.message);
        });
    }).catch(function(error) {
        // Обработка ошибок получения геолокации
        if (error instanceof ymaps.error.GeoObjectError) {
            alert('Не удалось определить местоположение');
        } else if (error instanceof ymaps.error.GeoObjectNotFoundError) {
            alert('Местоположение пользователя не найдено');
        } else {
            alert('Ошибка получения геолокации: ' + error.message);
        }
    });
}
