#!/usr/bin/env bash

TWEE="tweego/tweego"
OUTDIR=build/

mkdir -p build
$TWEE a-warm-place-to-stay -o $OUTDIR/"A Warm Place to Stay.html"
$TWEE life-of-the-party -o $OUTDIR/"Life of the Party.html"
