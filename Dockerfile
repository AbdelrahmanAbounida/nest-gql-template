FROM node:14.17.0-alpine3.13

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN npm run build

EXPOSE 5000

CMD ["node","dist/index.js"] 
# /main