# SHOPPER

## BACKEND

Generated with golang gqlgen script from schema.

### Set up local database

In folder "postgres"

Cleanup:

    sudo rm -rf  /home/chreri/docker/volumes/postgres

Build:

    docker build -t custom_postgres.

Start:

    docker run --rm --name pg-docker -e POSTGRES_DB=shopping -e POSTGRES_PASSWORD=docker -d -p 5432:5432 -v \$HOME/docker/volumes/postgres:/var/lib/postgresql/data custom_postgres

Inspect:

    psql -h localhost -U postgres -d shopping

### Start local backend

Start in folder backend:

    ./run.sh

## FRONTEND

Generated with create-react-app

Start in folder frontend:

    ./run.sh

## Postgres db

### Dump postgres db

    docker exec ${CONTAINER_ID} pg_dump -U postgres shopping

### Clear database

    docker exec ${CONTAINER_ID} psql -U postgres -c "DROP DATABASE shopping"
    docker exec ${CONTAINER_ID} psql -U postgres -c "CREATE DATABASE shopping"

### Reload db from file

    docker cp ../v2_dump.sql ${CONTAINER_ID}:/
    docker exec ${CONTAINER_ID} psql -U postgres shopping -f /v2_dump.sql

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
