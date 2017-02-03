#!/bin/bash

docker run --rm --name bench-runner pulsar/benchmark python3 bench.py $0
