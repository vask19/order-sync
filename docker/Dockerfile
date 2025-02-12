FROM node:18-slim
WORKDIR /app
COPY package.json package.json
RUN npm install
COPY .. .
CMD ["node", "server.js"]