# Этап 1: Сборка приложения
FROM node:20 AS build

WORKDIR /app

# Копируем файлы с зависимостями и устанавливаем их
COPY package*.json ./
RUN yarn install --ignore-engines

# Копируем весь код и создаем приложение
COPY . .
RUN yarn build

# Этап 2: Настройка Nginx для обслуживания статики
FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
# Копируем собранные файлы из предыдущего этапа в папку Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Открываем порт 80 для обслуживания HTTP-запросов
EXPOSE 80

# Запускаем Nginx в фоновом режиме
CMD ["nginx", "-g", "daemon off;"]