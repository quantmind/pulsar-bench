These are the results of benchmarking several HTTP web servers running on python 3.6 as well as node js.
Benchmarked servers run inside a Docker container with an outside load-generating tool [wrk][]
that measures request throughput and latency.

All servers run on a single process and the benchmark command is
```
wrk http://127.0.0.1:7000/payload/<size> -t 2 -c 50 -d 30
```
All benchmarks have a warmup period of 10 seconds before the actual benchmark starts.


[wrk]: https://github.com/wg/wrk
