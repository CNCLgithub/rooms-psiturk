#!/bin/bash

# Download links
CONTLINK="library://mebelledonne/default/psiturk-apline:1.0.0"
# Path to put data
DATAPATH="psiturk/static/"
DATALINK="https://yale.box.com/shared/static/eyu6jgppz6ek4a3vz63t9t1ipqit2q3m.gz"


usage="$(basename "$0") [targets...] -- setup an environmental components of project
supported targets:
    cont : either pull the singularity container or build from scratch
    data : pull data
"

[ $# -eq 0 ] || [[ "${@}" =~ "help" ]] && echo "$usage"

# container setup
[[ "${@}" =~ "cont" ]] || echo "Not touching container"
[[ "${@}" =~ "cont" ]] && echo "pulling container" && \
    singularity pull "psiturk.sif" "$CONTLINK"

# datasets
[[ "${@}" =~ "data" ]] || [[ "${@}" =~ "data" ]] || echo "Not touching data"
[[ "${@}" =~ "data" ]] && echo "pulling data" && \
    wget "$DATALINK" -O "data.tar.gz" && \
    tar -xvzf "data.tar.gz" -C "$DATAPATH" && \
    rm "data.tar.gz"
