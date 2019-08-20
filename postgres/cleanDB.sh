#!/bin/env bash 

docker rm -f -v  $(docker ps -aqf "name=pg-docker")

sudo rm -rf  /home/chreri/docker/volumes/postgres

docker build -t custom_postgres .
docker run --rm --name pg-docker -e POSTGRES_DB=shopping -e POSTGRES_PASSWORD=docker -d -p 5432:5432 -v /home/chreri/docker/volumes/postgres:/var/lib/postgresql/data custom_postgres

