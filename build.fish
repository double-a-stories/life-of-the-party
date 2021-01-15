#!/usr/bin/env fish

set -l TWEE 'tweego/tweego'
set -l OUTDIR 'build/'

set -l DIRS 'a-warm-place-to-stay' 'life-of-the-party'

# execute with -w [source] flag to watch a directory
argparse -i 'i/input=' -- $argv


mkdir -p $OUTDIR

if test $_flag_i;
    $TWEE $_flag_i -o $OUTDIR/$_flag_i.html $argv
else
  for dir in $DIRS
    $TWEE $dir -o $OUTDIR/$dir.html
  end
end