#!/bin/bash

if [ "$1" == "" ]; then
  echo "No version specified - using 'next'"
  VERSION=next
else
  VERSION=$1
fi

../bin/baibulo set-version --context hello --version $VERSION
