#!/bin/bash

docker run --rm -v /var/run/docker.sock:/var/run/docker.sock --network host --name bench-runner quantmind/pulsar-bench python3 bench.py $1
