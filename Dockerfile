FROM node:20-alpine3.17 AS base

RUN mkdir -p /usr/src/app
ENV DIR /usr/src/app
WORKDIR $DIR

FROM base AS build

RUN apk update && add --no-cache dumb-init

COPY package*.json $DIR

RUN npm ci

COPY . .

RUN npm prune --production

FROM build AS prod

ENV USER node

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=build $DIR/node_modules $DIR/node_modules

ENV NODE_ENV=production
EXPOSE $PORT
USER $USER
CMD ["dumb-init","node", "index.js"]

FROM base AS dev

ENV NODE_ENV=development

RUN npm install nodemon -g

COPY package*.json $DIR

RUN npm install

COPY . .

EXPOSE $PORT
CMD ["npm", "run", "start:dev"]
