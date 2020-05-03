#!/bin/bash
set -euf -o pipefail

docker run \
  --rm \
  --interactive \
  --tty \
  --env NODE_ENV=local \
  --env-file ./local/.env \
  --publish 8080:8080 \
  --name freakbot \
  freakbot

