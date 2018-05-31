FROM node:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
RUN npm install pm2 -g
COPY . /usr/src/app
RUN npm run build
EXPOSE 3000
CMD [ "pm2-runtime", "dist/index.js" ]