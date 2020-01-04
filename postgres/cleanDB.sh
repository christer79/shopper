#!/bin/env bash 

podman rm -f -v  $(podman ps -aqf "name=pg-docker")

sudo rm -rf  /home/chreri/docker/volumes/postgres
mkdir -p /home/chreri/docker/volumes/postgres
podman build -t custom_postgres .
podman run --rm --name pg-docker -e POSTGRES_DB=shopping -e POSTGRES_PASSWORD=docker -d -p 5432:5432 -v /home/chreri/docker/volumes/postgres:/var/lib/postgresql/data custom_postgres

