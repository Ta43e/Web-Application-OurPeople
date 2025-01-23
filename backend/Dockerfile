# Используем официальный Node.js образ
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./


# Устанавливаем зависимости
RUN npm install

# Копируем все остальные файлы
COPY . .

# Компилируем TypeScript
RUN npm run build

# Открываем порт для приложения
EXPOSE 4000

# Указываем команду запуска
CMD ["npm", "start"]
