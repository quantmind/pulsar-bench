#!/usr/bin/env python3
import argparse
import json
import os
import subprocess
import sys


LUA_SCRIPT = os.path.join(os.path.dirname(__file__), 'wrk.lua')


def abort(msg):
    print(msg, file=sys.stdout)
    sys.exit(1)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--msize', default=1000, type=int,
                        help='message size in bytes')
    parser.add_argument('--duration', '-T', default=30, type=int,
                        help='duration of test in seconds')
    parser.add_argument('--concurrency', default=3, type=int,
                        help='request concurrency')
    parser.add_argument('--addr', default='127.0.0.1:7000', type=str,
                        help='server address')
    parser.add_argument('--output-format', default='text', type=str,
                        help='output format', choices=['text', 'json'])
    args = parser.parse_args()

    unix = False
    if args.addr.startswith('file:'):
        abort('Unix sockets are not supported')

    wrk = ['wrk', '--latency', '--duration={}s'.format(args.duration),
           '--connections={}'.format(args.concurrency),
           '--script={}'.format(LUA_SCRIPT),
           'http://{}/{}'.format(args.addr, args.msize)]

    wrk_run = subprocess.Popen(wrk, universal_newlines=True,
                               stdout=subprocess.PIPE,
                               stderr=subprocess.PIPE)
    out, data_json = wrk_run.communicate()

    if args.output_format == 'json':
        print(data_json)
    else:
        data = json.loads(data_json)

        data['latency_percentiles'] = '; '.join(
            '{}% under {}ms'.format(*v) for v in data['latency_percentiles'])

        output = '''\
{messages} {size}KiB messages in {duration} seconds
Latency: min {latency_min}ms; max {latency_max}ms; mean {latency_mean}ms; \
std: {latency_std}ms ({latency_cv}%)
Latency distribution: {latency_percentiles}
Requests/sec: {rps}
Transfer/sec: {transfer}MiB
'''.format(duration=args.duration, size=round(args.msize / 1024, 2), **data)

        print(output)
