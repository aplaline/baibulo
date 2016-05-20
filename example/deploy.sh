#!/bin/bash

if [ "$1" == "" ]; then
  echo "No version specified - using 'next'"
  VERSION=next
else
  VERSION=$1
fi

cd hello
../../bin/baibulo deploy --version $VERSION
