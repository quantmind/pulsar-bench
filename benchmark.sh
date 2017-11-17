#!/bin/bash

docker run --rm \
    -v /var/run/docker.sock:/home/benchmarking/docker.sock \
    -v $PWD/results:/home/benchmarking/results \
    -v $PWD/benchmarks:/home/benchmarking/benchmarks \
    -e BENCHMARK_PATH=$PWD/benchmarks \
    -e BENCHMARK_PATH_DOCKER=/home/benchmarking/benchmarks \
    -e DOCKER_HOST=unix:///home/benchmarking/docker.sock \
    --net host \
    --name bench-runner \
    quantmind/pulsar-bench \
    python -m benchmarks.bench "$@"
