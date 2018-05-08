FROM node:8-alpine
MAINTAINER Abdullah Ahsan <ahsan.abdulah@gmail.com>

RUN mkdir -p /opt/logistics/
COPY . /opt/logistics/
WORKDIR /opt/logistics/

RUN npm install
RUN npm install -g mocha

EXPOSE 3000

CMD ["npm", "test"]
