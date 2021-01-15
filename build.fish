#!/usr/bin/env fish

# Generates builds of stories

set -l TWEE 'tweego/tweego'
set -l OUTDIR 'build/'

set -l DIRS 'a-warm-place-to-stay' 'life-of-the-party'

set -l PROOF_FORMATS 'illume' 'poof' 'dotgraph'

# execute with -w [source] flag to watch a directory
argparse -i 'i/input=' -- $argv


mkdir -p $OUTDIR
mkdir -p $OUTDIR/proof

if test $_flag_i;
    $TWEE $_flag_i -o $OUTDIR/$_flag_i.html $argv
else
  for dir in $DIRS
    $TWEE $dir -o $OUTDIR/$dir.html
    for f in $PROOF_FORMATS
      $TWEE -f $f $dir -o $OUTDIR/proof/$dir-$f.html
    end
  end
end

