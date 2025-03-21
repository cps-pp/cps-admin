#!/usr/bin/env bash

SERVER="singha-root"

DEPLOY_PATH="/root"
SOURCE_FOLDER_NAME="build"
DEPLOY_SOURCE_FOLDER_NAME="/var/www/xmt-official"
FILE_NAME="spa.tar.gz"

mv .env .env.bk
cp .env.production .env
yarn
yarn build
rm -rf $FILE_NAME
sleep 2
tar -zcvf $FILE_NAME $SOURCE_FOLDER_NAME
echo "=================================="
echo "Upload source..."
scp $FILE_NAME $SERVER:$DEPLOY_PATH
echo "=================================="
echo "Deploying..."
mv .env.bk .env

SCRIPT1="mkdir -p $DEPLOY_SOURCE_FOLDER_NAME && tar -xzvf $FILE_NAME"
SCRIPT2="rm -rf $DEPLOY_SOURCE_FOLDER_NAME/!\(uploads\)"
SCRIPT3="rsync -a $SOURCE_FOLDER_NAME/* $DEPLOY_SOURCE_FOLDER_NAME/"
SCRIPT4="rm -rf $SOURCE_FOLDER_NAME"
SCRIPT5="rm $FILE_NAME"
ssh $SERVER "$SCRIPT1 && $SCRIPT2 && $SCRIPT3 && $SCRIPT4 && $SCRIPT5"

echo "=================================="
rm -rf $FILE_NAME
rm -rf $SOURCE_FOLDER_NAME
echo "Done"