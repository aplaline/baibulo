#!/bin/bash

if [ "$1" == "" ]; then
  echo "No version specified - using 'next'"
  VERSION=next
else
  VERSION=$1
fi

../bin/baibulo-version-manager set --context hello --version $VERSION
