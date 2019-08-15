#!/bin/env bash
APP_FOLDER="src/app"
DESTINATION_FOLDER="internal/app/shopper"
ORIGINAL_PATH=$(pwd)
SCRIPT_LOCATION=$(dirname $0)
echo "Script at: \"${SCRIPT_LOCATION}\""

cd "${SCRIPT_LOCATION}"

# MAKE SURE

# - NO OLDER GENERATED CODE
if [ -d .generated_code ]; then
  echo "Folder with generated code exists removing"
  rm -rf .generated_code # Never use variables to specify path for rm -rf
fi

# - THERE IS A SCHEMA
SCHEMA_RELATIVE_PATH="${DESTINATION_FOLDER}/schema.graphql"
if [ ! -f ${SCHEMA_RELATIVE_PATH} ]; then
  echo "Can not find schema where we expected ["${SCHEMA_RELATIVE_PATH}"]"
  exit 1
fi

# - WE ARE IN THE CORRECT FOLDER
BACKEND_FOLDER="backend"
if [ $(basename $(pwd)) != "${BACKEND_FOLDER}" ] ; then
  echo "Standing in folder $(basename $(pwd)) not ${BACKEND_FOLDER}"
  exit 1
fi

# - NO LOCAL CHANGES EXCEPT FOR SCHEMA FILE
OUTPUT_DIFF=$(git diff --name-only ./${DESTINATION_FOLDER}/ | grep -v $(basename ${SCHEMA_RELATIVE_PATH}))
if [ x"${OUTPUT_DIFF}" != x"" ] ; then
  echo "There are uncommited changes to files other than $(basename ${SCHEMA_RELATIVE_PATH})"
  echo
  echo "Here is a list of the modified files"
  echo ${OUTPUT_DIFF}
  echo
  exit 1
fi

# - THERE ARE MODIFICATIONS TO SCHEMA
if [ x$(git diff --name-only ${SCHEMA_RELATIVE_PATH}) == x"" ] ; then
  echo "No need to run script without any changes to ${SCHEMA_RELATIVE_PATH}"
  #exit 1
fi

set -e
# CREATE TMP WORK FOLDER
TMP=`mktemp -d`
echo $(basename ${TMP})
mkdir -p ${TMP}/${APP_FOLDER}

# COPY SCHEMA TO WORK FOLDER
cp ${SCHEMA_RELATIVE_PATH} ${TMP}/${APP_FOLDER}/
cd ${TMP}/${APP_FOLDER}

export GO111MODULE=on

go mod init github.com/christer79/shopper

# SET GO PATH AND RUN INIT SCCRIPT
export GOPATH=${TMP}
go get github.com/99designs/gqlgen
go run github.com/99designs/gqlgen init

# BACK TO SERVER CODE FOLDER
cd -

chmod a+rwx -R ${TMP}
# SAVE GENERATED CODE
rm -rf .generated_code
mkdir -p  .generated_code/${APP_FOLDER}
mv ${TMP}/${APP_FOLDER}/* .generated_code/${APP_FOLDER}

# REMOVE WORK FOLDER
rm -rf /tmp/"$(basename ${TMP})" # Always have a safe prefix on path used for rm -rf in script


# WE EXPECT ONLY generated.go to change
cp .generated_code/${APP_FOLDER}/generated.go ${DESTINATION_FOLDER}/
cp .generated_code/${APP_FOLDER}/models_gen.go ${DESTINATION_FOLDER}/

# GO BACK TO WHERE WE STARTED
cd ${ORIGINAL_PATH}

set +e

echo
echo
echo
echo "#### diff of resolver methods in \"<\" old and \">\" new code"
echo "     diff <(cat ${SCRIPT_LOCATION}/${DESTINATION_FOLDER}/resolver.go | grep \"(ctx context.Context\" ) <(cat ${SCRIPT_LOCATION}/.generated_code/${APP_FOLDER}/resolver.go | grep \"(ctx context.Context\")
"
echo
echo
diff <(cat ${SCRIPT_LOCATION}/${DESTINATION_FOLDER}/resolver.go | grep "(ctx context.Context" ) <(cat ${SCRIPT_LOCATION}/.generated_code/${APP_FOLDER}/resolver.go | grep "(ctx context.Context")
echo
echo
echo "Opening meld"
echo "    meld ${SCRIPT_LOCATION}/${DESTINATION_FOLDER}/resolver.go ${SCRIPT_LOCATION}/.generated_code/${APP_FOLDER}/resolver.go"
echo
meld ${SCRIPT_LOCATION}/${DESTINATION_FOLDER}/resolver.go ${SCRIPT_LOCATION}/.generated_code/${APP_FOLDER}/resolver.go
