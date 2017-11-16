# Pulsar benchmarking

Benchmark [pulsar][] and other HTTP servers.

[![CircleCI](https://circleci.com/gh/quantmind/pulsar-bench.svg?style=svg)](https://circleci.com/gh/quantmind/pulsar-bench)

**Docker repository**: [quantmind/pulsar-bench](https://hub.docker.com/r/quantmind/pulsar-bench/)

**Github source**: [quantmind/pulsar-bench](https://github.com/quantmind/pulsar-bench)

# Installation

To run benchmarks you can use Docker or python/virtualenv.
The easiest way is to execute
```
make bench
```
This will download the latest image from dockerhub and run the benchmarks.

# Benchmark without docker image

During development it can be useful to benchmark live code, without the docker image.
In this case, create a python virtual environment and install requirements. Run a server
```bash
python http/pulsar_server.py -w 0 -io uv
```
and benchmark
```
wrk http://127.0.0.1:7000/payload/1024 --concurrency=10 --duration=30
```
