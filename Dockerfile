FROM node:20

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g nodemon

COPY package*.json package-lock.json ./
RUN npm install

COPY . ./

# RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

