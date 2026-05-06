FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir -p uploads/events uploads/selfies uploads/qr
EXPOSE 5001
CMD ["node", "server.js"]
