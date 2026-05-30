#!/usr/bin/env bash
# Simple helper to serve the repo root on port 8000
PORT=8000
DIR=$(pwd)

echo "Serving $DIR on http://localhost:$PORT"
python3 -m http.server $PORT
