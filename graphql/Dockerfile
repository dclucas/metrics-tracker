FROM node:8.2.1-alpine

RUN npm install -g yarn

RUN mkdir app
WORKDIR app

COPY package.json ./package.json
RUN yarn

COPY . ./
CMD yarn mon