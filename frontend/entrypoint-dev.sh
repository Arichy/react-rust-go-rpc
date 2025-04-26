#!/bin/sh
cd /app/frontend
rm -rf node_modules
yarn install
yarn gen-proto
yarn dev --host
