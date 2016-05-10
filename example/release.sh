#!/bin/bash

if [ "$1" == "" ]; then
  echo "No version specified"
  exit;
fi

../bin/content-version-manager --context hello --version $1
