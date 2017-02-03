# Pulsar benchmarking

[![CircleCI](https://circleci.com/gh/quantmind/pulsar-bench.svg?style=svg)](https://circleci.com/gh/quantmind/pulsar-bench)
[![devDependency Status](https://david-dm.org/quantmind/pulsar-bench/dev-status.svg)](https://david-dm.org/quantmind/pulsar-bench#info=devDependencies)


Benchmarking HTTP servers. **Under development**.

Ideas and some code from https://github.com/MagicStack/vmbench MIT License


# Installation

Install the following:

* Docker
* Python 3

Build the docker image containing the servers being tested by running:
```
./build.sh.
```
On a Mac make sure you execute:
```
eval "$(docker-machine env default)"
```
on your shell (note to self).
The benchmarks can then be ran with ./run_benchmarks. Use ./run_benchmarks --help for various options, including selective benchmark running.
