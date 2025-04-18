FROM node:20-alpine3.20 AS base

RUN mkdir -p /usr/src/app
ENV DIR /usr/src/app
WORKDIR $DIR

FROM base AS build

RUN apk update && add --no-cache dumb-init

COPY package*.json $DIR

RUN npm install
RUN npm ci

COPY . .

RUN npm prune --production

# Para Produccion
# FROM build AS production

# ENV USER node

# COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
# COPY --from=build $DIR/node_modules $DIR/node_modules

# ENV NODE_ENV=production
# EXPOSE $PORT
# USER $USER
# CMD ["dumb-init","node", "index.js"]

# Para Desarrollo "docker-compose up app-dev postgres-admin --build"
FROM base AS development

ENV NODE_ENV=development

RUN npm install nodemon -g

COPY package*.json $DIR

RUN npm install

# En ociaciones da error por la linea de copy
# COPY . .

EXPOSE $PORT

# RUN npm run migrations:run

RUN mkdir -p ./scripts

COPY ./scripts/*.sh ./scripts

RUN chmod +x ./scripts/entrypoint.sh  # if required
ENTRYPOINT ["./scripts/entrypoint.sh"]
CMD ["npm", "run", "start:dev"]
# CMD ["npm", "run",  "migrations:run", "&&", "start:dev"]
