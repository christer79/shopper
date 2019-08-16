#!/bin/bash

function execute {
  echo "**** EXECUTE COMMAND $1"
  ACCESS="docker exec ${CONTAINER_ID} psql -U postgres shopping  -c "
  #ACCESS="heroku pg:psql DATABASE_URL -c "
  $ACCESS "$1"
}

#Add a column goal_amount to the items.

TABLE_NAMES=$(execute "select tablename FROM pg_catalog.pg_tables WHERE schemaname='public';")

echo ${TABLE_NAMES}
for TABLE_NAME in $TABLE_NAMES ; do
  if [[ ${TABLE_NAME} == *_items ]] ; then
    echo "--- LISTS_TABLE: "${TABLE_NAME}" ---"
    ALTER="ALTER TABLE ${TABLE_NAME} ADD goal FLOAT8 DEFAULT 0;"
    execute "${ALTER}"
  fi
done

ALTER="INSERT INTO version(nr) VALUES(3)"
execute "${ALTER}"