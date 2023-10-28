FROM node:20

RUN mkdir -p /home/app
WORKDIR /home/app

COPY . .
# COPY package*.json ./

RUN npm install
RUN npm i -g nodemon

EXPOSE 3000

CMD ["npm", "run", "dev"]

