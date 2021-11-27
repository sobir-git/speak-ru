#!/bin/bash
set -e
set -o xtrace
# Any subsequent(*) commands which fail will cause the shell script to exit immediately

# make sure we're in the right director :)
INITDIR="/c/Users/sobir/PycharmProjects/speak-russian-svelte"
if [ "$PWD" != "$INITDIR" ]; then
  echo YOU MUST EXECUTE THIS SCRIPT FROM "$INITDIR"
  exit 1
fi

COPY_TEXTS=false
DEPLOY="../tmp123deploy"
TMP_TEXTS="$TMP/texts_tmp$RANDOM/"
APP_NAME=speak-ru
cwd=$(pwd)

print_usage() {
  printf "Usage: ..."
}

while getopts 'td:' flag; do
  case "${flag}" in
  d) DEPLOY="${OPTARG}" ;;
  t) COPY_TEXTS='true' ;;
  *)
    print_usage
    exit 1
    ;;
  esac
done

cd $DEPLOY
DEPLOY=$(pwd)
echo TMP_TEXTS: $TMP_TEXTS
echo cwd: $cwd
echo DEPLOY: $DEPLOY
echo COPY_TEXTS: $COPY_TEXTS

# move texts folder to a temporary location
echo checking if directory "$DEPLOY/texts" exists
[ -d "$DEPLOY/texts" ] && echo texts directory exists
[ -d "$DEPLOY/texts" ] && mv $DEPLOY/texts $TMP_TEXTS

# clean directory
cd $DEPLOY
[-d .git ] && git rm -rf . && git clean -fxd

# npm build for production
cd $cwd/client
npm run build

# copying files
cd $cwd

# note:: make sure you list all the necessary files here
rm -rf backend/__pycache__
dest=$DEPLOY/backend/
mkdir -p $dest && cp -r backend/*.py $dest
cp -r Procfile requirements.txt .gitignore $DEPLOY/
mkdir -p $DEPLOY/client/public
cp -r client/public/ $DEPLOY/client

if $COPY_TEXTS; then
  rm -rf $TMP_TEXTS >/dev/null
  echo copying $cwd/texts to $DEPLOY/texts
  cp -r $cwd/texts $DEPLOY/texts
else
  mv $TMP_TEXTS $DEPLOY/texts
fi

cd $DEPLOY
# git init .
heroku git:remote -a $APP_NAME
# heroku config:set FLASK_APP=backend/server.py
git add .
git commit -m "autocommit"
git push heroku
# heroku logs --tail
