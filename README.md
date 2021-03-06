# Pulsar benchmarking

Benchmark [pulsar][] and other HTTP asynchronous servers.

[![CircleCI](https://circleci.com/gh/quantmind/pulsar-bench.svg?style=svg)](https://circleci.com/gh/quantmind/pulsar-bench)

**Docker repository**: [quantmind/pulsar-bench](https://hub.docker.com/r/quantmind/pulsar-bench/)

**Github source**: [quantmind/pulsar-bench](https://github.com/quantmind/pulsar-bench)

# Getting Started

To run benchmarks you need docker installed. Subsequently execute:
```
./benchmark.sh -h
```
This will download the latest image from docker-hub and display information
about the possible benchmarks to execute.

To run a benchmark for a given server
```
./benchmark.sh pulsar
```

System and benchmarks information
```
./benchmark.sh --info
```

Run and save to results folder (important)
```
./benchmark.sh -J results/benchmarks.json
```
It is important to save to the ``results`` folder because it is mapped
to the local drive so you can retrieve the results.

To build a new image
```
make build
```

# Benchmark outside Docker

To run benchmarks outside docker, follow these instructions:
```
virtualenv venv
source venb/bin/activate
pip install -r dev/requirements/ci.txt
pip install -r dev/requirements/servers.txt
```
Then start one of the servers, for example
```
python benchmarks/servers/aiohttp_server.py
```
and execute ``wrk`` benchmarks
```
wrk http://127.0.0.1:7000/payload/1024 -c 10 -d 30
```
[pulsar]: https://github.com/quantmind/pulsar
