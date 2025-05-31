FROM node:16

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

CMD ["npx", "vite", "--host", "0.0.0.0", "--port", "3000"]