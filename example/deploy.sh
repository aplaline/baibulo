#!/bin/bash

if [ "$1" == "" ]; then
  echo "No version specified"
  exit;
fi

../bin/content-uploader --version $1 --dir hello
