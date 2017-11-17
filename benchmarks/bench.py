import re
import os
import json
import argparse
import logging
from datetime import datetime

from benchmarks.pbench import (
    wait_for_server, wrk, format_wrk_result, platform_info
)
from benchmarks.pbench.containers import docker_client, docker_remove


DOCKER_IMAGE = os.environ.get('DOCKER_IMAGE', 'quantmind/pulsar-bench')
BENCHMARK_PATH = os.environ.get('BENCHMARK_PATH', '')
BENCHMARK_PATH_DOCKER = os.environ.get('BENCHMARK_PATH_DOCKER', '')
LOGGER = logging.getLogger('pulsar.bench')
SERVER_CONFIG = os.path.join(os.path.dirname(__file__), 'config.json')
WARMUP_DURATION = 10


if not BENCHMARK_PATH or not BENCHMARK_PATH_DOCKER:
    LOGGER.warning(
        'BENCHMARK_PATH or BENCHMARK_PATH_DOCKER environment paths not set.'
        'Are you using the benchmark.sh script to launch benchmarks?'
    )


def parser():
    parser = argparse.ArgumentParser()
    parser.add_argument('benchmarks', type=str, nargs='*',
                        help='comma-separated list of benchmarks to run ' +
                             '(regular expressions are supported)')
    parser.add_argument('--duration', '-D', default=30, type=int,
                        help='duration of each benchmark in seconds (30)')
    parser.add_argument('--name', type=str, default='pulsarbench',
                        help='docker container name (pulsarbench)')
    parser.add_argument('--host', type=str, default='127.0.0.1',
                        help='docker host (127.0.0.1)')
    parser.add_argument('--concurrency-levels', type=int, default=[10],
                        nargs='+',
                        help='a list of concurrency levels to use [10]')
    parser.add_argument('--payload-size-levels', type=int, nargs='+',
                        default=[1024, 65536, 262144, 1048576],
                        help=('comma-separated list of message size levels '
                              'to use in bytes '
                              '([1024, 65536, 262144, 1048576])'))
    parser.add_argument('--save-json', '-J', type=str,
                        help='path to save benchmark results in JSON format')
    parser.add_argument('--info', action='store_true', default=False,
                        help='show platform info')
    parser.add_argument('--serve', action='store_true', default=False,
                        help='run a web server rather than benchmark')
    return parser


def main(args=None):
    with open(SERVER_CONFIG) as fp:
        servers = json.load(fp)

    args = parser().parse_args(args)
    info = platform_info()
    if args.info:
        info['docker image'] = DOCKER_IMAGE
        info['benchmarks'] = servers
        print(json.dumps(info, indent=4))
        return

    if args.benchmarks:
        benchmarks_to_run = [re.compile(b) for b in args.benchmarks]
    else:
        benchmarks_to_run = [re.compile(re.escape(b['name']))
                             for b in servers]

    cli = docker_client()

    address = '%s:7000' % args.host
    container_name = args.name
    benchmarks_data = []
    variations = []

    for concurrency in sorted(args.concurrency_levels):
        for msgsize in sorted(args.payload_size_levels):
            variations.append({
                'title': '{}kb messages, concurrency {}'.format(
                    round(msgsize / 1024, 1), concurrency
                ),
                'concurrency': concurrency,
                'payload_size': msgsize,
                'args': [
                    'http://%s/payload/%s' % (address, msgsize),
                    '--concurrency={}'.format(concurrency)
                ]
            })

    warmup_concurrency = max(args.concurrency_levels)
    warmup = [
        'http://%s/payload/262144' % address,
        '--duration={}'.format(WARMUP_DURATION),
        '--concurrency={}'.format(warmup_concurrency)
    ]

    for benchmark in servers:
        if not any(b.match(benchmark['name']) for b in benchmarks_to_run):
            continue

        LOGGER.info(benchmark['title'])
        LOGGER.info('=' * (2 + len(benchmark['title'])))
        LOGGER.info('')

        LOGGER.info('Starting server...')
        docker_remove(container_name, cli)
        container = cli.containers.run(
            DOCKER_IMAGE,
            name=container_name,
            command=benchmark['command'],
            ports={'7000/tcp': 7000},
            volumes={BENCHMARK_PATH: BENCHMARK_PATH_DOCKER},
            detach=True
        )

        if not wait_for_server(address):
            docker_remove(container)
            LOGGER.error('Could not start server')
            continue

        if args.serve:
            break

        LOGGER.info('Warming up server...')
        LOGGER.info('wrk %s', ' '.join(warmup))
        LOGGER.info(format_wrk_result(wrk(warmup), WARMUP_DURATION))

        duration = args.duration
        name = benchmark['name']

        try:
            for variation in variations:
                title = 'BENCHMARK: {}'.format(variation['title'])
                LOGGER.info(title)
                LOGGER.info('-' * len(title))
                vargs = variation['args'][:]
                vargs.append('--duration={}'.format(duration))
                LOGGER.info('wrk %s', ' '.join(vargs))
                result = wrk(vargs)
                LOGGER.info(format_wrk_result(result, duration))
                data = dict(
                    server=name,
                    concurrency=variation['concurrency'],
                    payload_size=variation['payload_size']
                )
                data.update(result)
                benchmarks_data.append(data)
        finally:
            docker_remove(container)

    if args.save_json and not args.serve:
        LOGGER.info('Save benchmark data into %s', args.save_json)
        datestr = datetime.utcnow().isoformat().split('.')[0]
        info.update(
            date=datestr,
            duration=args.duration,
            concurrency_levels=args.concurrency_levels,
            payload_size_levels=args.payload_size_levels
        )
        info['benchmarks'] = benchmarks_data

        with open(args.save_json, 'w') as f:
            f.write(json.dumps(info, indent=4))

        docker_remove('pulsar-bench-info', cli)


if __name__ == '__main__':
    logging.basicConfig(level='INFO', format='%(message)s')
    main()
