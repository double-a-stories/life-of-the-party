#!/usr/bin/env bash

TWEE="node twee3/src/index.js"

FORMAT="snowman-2.0.2"

mkdir -p build
$TWEE build a-warm-place-to-stay/warm.twee build/a-warm-place-to-stay.html $FORMAT
$TWEE build life-of-the-party/life.twee build/life-of-the-party.html $FORMAT
