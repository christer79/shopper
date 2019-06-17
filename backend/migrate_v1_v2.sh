#!/bin/bash


function execute {
  echo "**** EXECUTE COMMAND $1"
  ACCESS="docker exec f69e8f0aaaed psql -U postgres shopping  -c "
  ACCESS="heroku pg:psql DATABASE_URL -c "
  $ACCESS "$1"
}

TABLE_NAMES=$(execute "select tablename FROM pg_catalog.pg_tables WHERE schemaname='public';")


echo ${TABLE_NAMES}
for TABLE_NAME in $TABLE_NAMES ; do
  if [[ ${TABLE_NAME} == *_suggestions ]] ; then
    nr=$(echo ${TABLE_NAME} | tr -cd '_' | wc -c)
    if [[ ${nr} -le 2 ]] ; then
      echo "--- SUGGESTION_TABLE: "${TABLE_NAME}" ---"
      NEW_TABLE_NAME=${TABLE_NAME/_suggestion/_shopping_suggestion}
      ALTER="ALTER TABLE ${TABLE_NAME} RENAME TO ${NEW_TABLE_NAME}"
      execute "${ALTER}"
    fi
  fi
  if [[ ${TABLE_NAME} == lists ]] ; then
    echo "--- LISTS_TABLE: "${TABLE_NAME}" ---"
    ALTER="ALTER TABLE lists ADD list_type VARCHAR(50) DEFAULT 'shopping';"
    execute "${ALTER}"
  fi
done
ALTER="CREATE TABLE version(id SERIAL PRIMARY KEY, nr INTEGER NOT NULL);"
execute "${ALTER}"
ALTER="INSERT INTO version(nr) VALUES(2)"
execute "${ALTER}"
