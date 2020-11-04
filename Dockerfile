FROM node:latest

RUN mkdir ./project

WORKDIR ./project

COPY . .

RUN mv /usr/local/lib/node_modules /usr/local/lib/node_modules.tmp && mv /usr/local/lib/node_modules.tmp /usr/local/lib/node_modules && npm i -g npm@^7

RUN npm install

EXPOSE 3000

CMD ["node", "app.js"]
