#!/usr/bin/env fish

# Generates builds of stories

set -l TWEE 'tweego'
set -l OUTDIR 'build/'

set -l NAME 'Life_of_the_Party'
set -l PROOF_FORMATS 'illume' 'poof' 'dotgraph'


mkdir -p $OUTDIR

$TWEE ./src/ -o $OUTDIR/$NAME.html --head head.html --log-files $argv

for f in $PROOF_FORMATS
    $TWEE ./src/ -f $f -o $OUTDIR/$f-$NAME.html $argv
end