FROM node:latest

RUN mkdir -p /usr/src/app

RUN npm install nodemon -g

WORKDIR /usr/src/app

COPY ./app /usr/src/app

RUN npm install

EXPOSE 3001

CMD ["npm","run","dev"]