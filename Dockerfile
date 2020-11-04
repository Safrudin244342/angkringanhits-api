FROM node:latest

COPY . .

RUN npm install -g npm@7.0.8

RUN npm install

EXPOSE 3000

CMD ["node", "app.js"]
