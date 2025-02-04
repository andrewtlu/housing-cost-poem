#!/bin/bash

# run this script every time you need to work on our dataset via:
# $ source ./activate.sh

if [ ! -d "./venv/" ]; then
    echo "Installing dependencies..."
    python3 -m venv ./venv/
    source ./venv/bin/activate
    pip install -r requirements.txt
fi

echo "Activating environment..."
source ./venv/bin/activate
echo "Current python location:" "$(which python3)"
