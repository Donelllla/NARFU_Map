let map;

ymaps.ready(init);

function init() {
    map = new ymaps.Map("map-container", {
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

    loadContent();
}

function updateRouteHandlers(map) {
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
            console.log('Ошибка геокодирования: ' + error.message)
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

async function getBusinessInfo(address) {
    const apiKey = 'de20e663-23ba-4758-9355-6797283c6051';
    const url = `https://search-maps.yandex.ru/v1/?text=${encodeURIComponent(address)}&type=biz&lang=ru_RU&apikey=${apiKey}`;

    console.log(url);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const data = await response.json();
        if (data.features && data.features.length > 0) {
            let hours = "Время работы не найдено";
            let phones = "Номер телефона не найден";
        
            for (let feature of data.features) {
                const companyMetaData = feature.properties.CompanyMetaData;
                const currentHours = companyMetaData.Hours ? companyMetaData.Hours.text : null;
                const currentPhones = companyMetaData.Phones ? companyMetaData.Phones.map(phone => phone.formatted).join('<br> ') : null;
        
                if (currentHours && currentPhones) {
                    hours = currentHours;
                    phones = currentPhones;
                    break; // Найдены и часы работы, и номер телефона, выходим из цикла
                } else if (currentHours) {
                    hours = currentHours; // Только часы работы найдены
                } else if (currentPhones) {
                    phones = currentPhones; // Только номер телефона найден
                }
            }
        
            return { hours, phones };
        } else {
            return { hours: "Время работы не найдено", phones: "Номер телефона не найден" };
        }
    } catch (error) {
        console.error("Ошибка получения информации об организации:", error);
        return { hours: "Ошибка получения времени работы", phones: "Ошибка получения номера телефона" };
    }
}

async function addContainer(targetId, address, title, info) {
    const targetContainer = document.getElementById(targetId);
    if (targetContainer) {
        const { hours, phones } = { hours: "пн-пт 9:00-18:00", phones: "88005553535" }; //await getBusinessInfo(address); 
        const campusHTML = `
            <div class="container">
                <div>
                  <div class="container-title">${title}</div>
                  <div class="working-hours">Время работы:<br>${hours}</div>
                  <div class="address">${address}</div>
                  <div class="otherItems">
                    <div class="route"><span class="route-text">Маршрут</span></div>
                    <div class="phone"></div>
                    <div class="info"><span class="info-text">i</span></div>
                    <div class="favorite"></div>
                  </div>
                </div>
                <div class="icon-hat"></div>
                <div class="phone-info hidden">${phones}</div>
                <div class="info-msg hidden">${info}</div>
            </div>
            <div class="divider"></div>
        `;

        targetContainer.innerHTML += campusHTML;
    }
}