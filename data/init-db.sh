#!/bin/bash

rm -f books.db
bun run src/index.ts &
PID=$!
sleep 2
kill $PID