FROM node

WORKDIR /usr/src/app

COPY package.json yarn.lock  ./

RUN yarn add expo-cli
RUN yarn install

COPY app.json babel.config.js webpack.config.js jsconfig.json .eslintrc.json ./
COPY assets/ ./assets/

CMD ["yarn", "web"]
