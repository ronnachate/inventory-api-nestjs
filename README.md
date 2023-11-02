## Description

POS Rest api with Nest and TypeORM, including Jwt authentication with password.js

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


## Set up dev env on docker with docker-compose

```bash
# pull docker image or start instant
$ docker-compose up
```

## Database migrate

```bash
# apply migration in /migrations directory to DB
$ npm run migration:run
```

## OpenAPI documentation

* request to /api