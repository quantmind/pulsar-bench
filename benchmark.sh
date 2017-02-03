#!/bin/bash

docker run --rm --name bench-runner quantmind/pulsar-bench python3 bench.py $0
