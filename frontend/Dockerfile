FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build production version
RUN npm run build

# Install static server
RUN npm install -g serve

EXPOSE 10000

CMD ["serve", "-s", "dist", "-l", "10000"]