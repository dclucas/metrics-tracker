FROM node:6.0

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm install --dev

COPY . /usr/src/app

EXPOSE 2426

CMD npm start
