#!/bin/bash
pattern=$@

function finish {
  docker compose down
}

# Start containers
docker compose up -d

docker compose exec node node index.js

if [ $? -eq 0 ]; then
  finish
else
  finish
  exit 1
fi

