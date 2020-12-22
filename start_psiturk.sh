#!/bin/bash

PSICONT="psiturk.sif"
CMD="$@"


usage="$(basename "$0") CMD -- pass a command to a psiturk server
supported targets:
    on : run psiturk
    stop : stop psiturk
    restart
    status
    help
"

# print help
[ $# -eq 0 ]  && echo "$usage" && exit 0

singularity exec "$PSICONT" bash -c "cd psiturk && psiturk server ${CMD}"
