FROM node:6.10-alpine

RUN npm install -g yarn

RUN mkdir app
WORKDIR app

COPY package.json ./package.json
RUN yarn

COPY . ./
CMD npm start