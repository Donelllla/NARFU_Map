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

async function addContainer(targetId, address) {
    const targetContainer = document.getElementById(targetId);
    if (targetContainer) {
        const { hours, phones } = await getBusinessInfo(address);//{ hours: "пн-пт 9:00-18:00", phones: "Ошибка получения номера телефона" }; 
        const campusHTML = `
            <div class="container">
                <div>
                  <div class="container-title">Корпус 1</div>
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
            </div>
            <div class="divider"></div>
        `;

        targetContainer.innerHTML += campusHTML;

        // Обновить обработчики событий для новых элементов
        updateRouteHandlers(map);
        updatePhoneHandlers();
    }
}