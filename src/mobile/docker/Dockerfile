### Base build
FROM node AS base

WORKDIR /usr/src/app

COPY package.json yarn.lock app.json babel.config.js ./

RUN yarn install
RUN yarn add expo-cli

COPY App.js ./
COPY assets/ ./

CMD ["yarn", "web"]
