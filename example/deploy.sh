#!/bin/bash

if [ "$1" == "" ]; then
  echo "No version specified - using 'next'"
  VERSION=next
else
  VERSION=$1
fi

npx baibulo-deploy deploy --url http://localhost:3000 --version $VERSION --dir hello
