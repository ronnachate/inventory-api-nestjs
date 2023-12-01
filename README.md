## Description

Restourant POS Rest api with Nest and TypeORM, including Jwt authentication with password.js

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

## api authentication, basic jwt
* post /api/auth/signin
```json
{
  "username": "string",
  "password": "string"
}
```
* post /api/auth/refresh-token
```json
{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlcyI6WyJVc2VyIiwiQWRtaW4iXSwiaWF0IjoxNjk4OTg5MjMzLCJleHAiOjE2OTkwNzU2MzN9.Y9D7W9N82OnXLwoQ7eBGrf64Lh9nczhaG5iE9b-Y_eA"
}
```
* response
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsInVzZXJuYW1lIjoic3RyaW5nIiwicm9sZXMiOlsiVXNlciJdLCJpYXQiOjE2OTg5OTkzNjcsImV4cCI6MTY5OTAwMjk2N30.NRyf9qb9QlbkR0ewgnOMRbK9skviCLEwwQPmAwFEcGg",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsInVzZXJuYW1lIjoic3RyaW5nIiwicm9sZXMiOlsiVXNlciJdLCJpYXQiOjE2OTg5OTkzNjcsImV4cCI6MTY5OTA4NTc2N30.nfXdLfm5CigsU8iACVctPJK7khW9c4MFrII2OUfuAQg"
}
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