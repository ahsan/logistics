# Logistics
NodeJS sample project that implements basic shipping logistics.

# Description

## App Structure
The application is mainly structured around the API endpoints. A brief description of the directories is given below:

 | Directory | Function                                                                                                                                                           |
|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Root      | Contains the bootstrap file for the project (app.js),  package.json, docker-compose.yml, licensing and other files.                                                                    |
| api       | Contains the server code for handling requests made on the different endpoints. Each endpoint has its own separate model, routes, middleware and controller files. |
| config    | Contains files that deal with project wide configuration.                                                                                                          |
| logs      | Contains the server logs.                                                                                                                                          |
| mongo     | This directory gets mounted to the mongodb docker container. All the persistent db data lives here. It also contains the Dockerfile for the docker container.      |
| tests     | Contains all the unit tests.                                                                                                                                       |
| utils     | Contains project wide utility functions.                                                                                                                           |

## Containerization
The application is containerized using Docker. The container orchestration is done by docker-compose.

## Database
The database is switched for unit tests. The name for the production and testing databases can be set inside the .env file. By default, the database name for production is "logistics_prod" and for testing is "logistics_test".

## Logging
In this project logging is done using Winston.js. The different logging levels can be set inside the .env file by modifying the `LOG_LEVEL` variable. It can take the following values:
```
-1      // No logging
error
warn
info
verbose
debug
silly
```

# Running the Application

## Through docker-compose
The recommended way to bring up the application is through docker compose.

1. Install [Docker](https://docs.docker.com/install/).
2. Install [docker-compose](https://docs.docker.com/compose/install/).
3. In the project root folder, run the following command to bring up the app containers:
```
docker-compose up --build mongodb api_server
```
## Manually
The application can also be hosted on bare-metal if you want. In order to run it manually, follow these steps:
1. Ensure that a mongodb instance is up and running.
2. Populate the .env file with the ip address and port of MongoDB instance. Change the values of the following variables:
```
MONGO_IP=<IP of the database>
MONGO_PORT=<port of the database>
```
3. Bootstrap the application by running `app.js`.
```
node app.js
```


# Running the Unit Tests

## Through docker-compose
Unit tests can be run by issuing the following command:


```
docker-compose up --build --abort-on-container-exit --exit-code-from unit_test mongodb unit_test
```

## Manually
1. Ensure that a MognoDB instance is running and its IP address and port are set in the .env file.
2. Initiate unit testing by issuing this command:
```
npm test
```


The unit tests for the /company endpoint are incomplete.