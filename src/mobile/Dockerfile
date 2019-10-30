### Base build
FROM node AS base

RUN mkdir -p usr/src/app
WORKDIR usr/src/app

COPY meinbundestag-mobile/package.json ./
COPY meinbundestag-mobile/yarn.lock ./

RUN yarn

COPY meinbundestag-mobile/app.json ./
COPY meinbundestag-mobile/App.js ./


### Test build
FROM base AS test
COPY meinbundestag-mobile/scripts/ ./scripts/
CMD ["yarn", "test"]
