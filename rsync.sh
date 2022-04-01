#!/usr/bin/env bash

DIR="$(dirname "${BASH_SOURCE[0]}")"
DIR="$(realpath "${DIR}")"
BASEDIR="$(dirname "${DIR}")"
HOST="$1"
rsync -auv -e "ssh -i ~/cncl-aws.pem" "${DIR}" "ubuntu@${HOST}":~/rsync
rsync -auv -e "ssh -i ~/cncl-aws.pem" "ubuntu@${HOST}":~/rsync/rooms-psiturk "${DIR}"
