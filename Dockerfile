FROM node:8-alpine
MAINTAINER Abdullah Ahsan <ahsan.abdulah@gmail.com>

RUN mkdir -p /opt/logistics/
COPY . /opt/logistics/
# COPY .env /opt/logistics/.env
WORKDIR /opt/logistics/

RUN npm install
RUN npm install -g pm2

EXPOSE 3000

CMD ["pm2", "start", "./app.js", "--no-daemon"]
