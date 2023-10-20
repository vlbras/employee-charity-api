# Employee charity API

## Installation

```bash
$ yarn install
```

## Database setup

```bash
# set up .env
$ cp .env.example .env

# run db
$ docker-compose up -d

# run migrations
$ yarn migration:run

# import dump
$ yarn run import dump.txt
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```
