FROM node:16-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --verbose
COPY . .
EXPOSE 3030

CMD [ "node", "index.js" ]
