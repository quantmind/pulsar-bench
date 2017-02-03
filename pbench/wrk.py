#!/usr/bin/env python3
"""Python utility for benchmarking HTTP servers via wrk
https://github.com/wg/wrk
"""
import argparse
import os
import subprocess
import json
import textwrap


LUA_SCRIPT = os.path.join(os.path.dirname(__file__), 'wrk.lua')


def options(args=None):
    parser = argparse.ArgumentParser(
        'Benchmark servers with WRK benchmarking tool'
    )
    parser.add_argument('--threads', '-t', default=10, type=int,
                        help='Number of threads to use')
    parser.add_argument('--duration', '-T', default=30, type=int,
                        help='duration of test in seconds')
    parser.add_argument('--concurrency', '-c', default=10, type=int,
                        help='request concurrency')
    parser.add_argument('url', nargs='?',
                        default='http://127.0.0.1:7000',
                        type=str, help='url')
    return parser.parse_args(args)


def wrk(args=None):
    args = options(args)

    cmd = ['wrk',
           '--latency',
           '--threads={}'.format(args.threads),
           '--duration={}'.format(args.duration),
           '--connections={}'.format(args.concurrency),
           '--script={}'.format(LUA_SCRIPT),
           args.url]

    result = subprocess.Popen(
        cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE
    )
    out, msg = result.communicate()

    if result.returncode:
        raise RuntimeError('wrk failure: %s' % msg.strip().decode('utf-8'))

    return json.loads(msg.decode('utf-8'))


def format_wrk_result(result, duration):
    result = result.copy()
    result['duration'] = duration
    result['latency_percentiles'] = '; '.join(
        '{}% under {}ms'.format(*v)
        for v in result['latency_percentiles']
    )
    return textwrap.dedent(
        '''{messages} messages in {duration} seconds
        Latency_min: {latency_min}ms
        Latency_max: {latency_max}ms
        Latency_mean: {latency_mean}ms;
        Latency_std: {latency_std}ms ({latency_cv}%)
        Latency distribution: {latency_percentiles}
        Requests/sec: {rps}
        Transfer/sec: {transfer}MiB''').format(**result)


if __name__ == '__main__':
    print(json.dumps(wrk(), indent=4))
