# SHOPPER

## BACKEND

Generated with golang gqlgen script from schema.

### Set up local database

    docker run --rm --name pg-docker -e POSTGRES_PASSWORD=docker -d -p 5432:5432 -v $HOME/docker/volumes/postgres:/var/lib/postgresql/data postgres

    psql -h localhost -U postgres -d shopping

### Start local backend

    export DATABASE_URL="host=localhost port=5432 user=postgres password=docker dbname=shopping sslmode=disable"
    export PORT="3500"

    go run cmd/main.go

## FRONTEND

Generated with create-react-app

export REACT_APP_MOMENTS_GRAPHQL_HTTP_URL="http://localhost:3500/graphql"
export REACT_APP_MOMENTS_GRAPHQL_WEBSOCKET_URL="ws://localhost:3500/graphql"

## Postgres db

### Dump postgres db

    docker exec <container id> pg_dump -U postgres shopping

### Clear database

    docker exec dfced77d0ee0 psql -U postgres -c "DROP DATABASE shopping"
    docker exec dfced77d0ee0 psql -U postgres -c "CREATE DATABASE shopping"

### Reload db from file

    docker cp ../v1_dump.sql dfced77d0ee0:/
    docker exec dfced77d0ee0 psql -U postgres shopping -f /v1_dump.sql

## Docker

## Playground

    mutation CREATELIST {
      createList(input: { id: "kmdsl", name: "dsknakjdn" }) {
        name
        id
        sections { name, id, position }
        items { id, name }
      }
    }


    query GETLISTS {
      lists {
        id
      }
    }


    mutation DELETELIST {
      deleteList(id: "kmdsl") {
        id
      }
    }

    query GETLIST {
      list(id: "_bkwxcimkj") {
        name
        id
        sections { name, id, position }
          items { id, name }
        }
      }
