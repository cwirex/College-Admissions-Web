#!/bin/bash
# Skrypt uruchamiający kompiler kodu TS do JS i uruchamiający program
# Wymaga `tsc` oraz `node`

echo -n "Running compiler..."
tsc -p ./tsconfig.json && echo " OK"
cd ./out
node ./main.js
