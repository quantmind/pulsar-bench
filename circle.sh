#!/bin/bash

docker run -v /var/run/docker.sock:/var/run/docker.sock --net host quantmind/pulsar-bench python3 bench.py $1
