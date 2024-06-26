# Предварительные условия

Прежде чем начать работу с проектом, убедитесь, что у вас установлены следующие инструменты:

- Node.js и npm (устанавливаются с официального сайта Node.js)
- Monaca CLI (устанавливается с помощью npm: `npm install -g monaca`)

## Установка

1. **Клонирование репозитория:**

   ```sh
   git clone https://github.com/Donelllla/NARFU_Map
   cd NARFU_Map
   ```

2. **Установка зависимостей:**

   ```sh
   npm install
   ```

## Запуск проекта

Для запуска проекта выполните следующие шаги:

1. **Запуск локального сервера Monaca:**
   ```sh
   monaca preview
   ```
2. **Откройте браузер и перейдите по URL: localhost:8080**

## Troubleshooting

1. **Ошибка при запуске локального сервера**
   
   Если при запуске локального сервера выдаёт ошибку
   ```bash
   spawn EINVAL
   ```
   Поставте болие старую версию Node.js (У меня заработало на v15.14.0)
   
2. **Если возникла другая ошибка**

   Хз загуглите или свяжитесь со мной
