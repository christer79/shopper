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


    query GetLists {
      lists {
        name, id
      }
    }
