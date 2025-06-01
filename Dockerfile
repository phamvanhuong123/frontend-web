FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy the rest of the code (not strictly necessary with volumes, but good practice)
COPY . .

# Expose the port
EXPOSE 3000

# CMD will be overridden by docker-compose command
CMD ["npm", "run", "start"]