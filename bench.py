import re
import json
import argparse
import logging
from datetime import datetime

from config import servers
from pbench import wait_for_server, wrk, format_wrk_result, platform_info
from pbench.containers import docker_client, docker_remove


DOCKER_IMAGE = 'quantmind/pulsar-bench'
LOGGER = logging.getLogger('pulsar.bench')
WARMUP_DURATION = 10


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
    return parser


def main(args=None):
    args = parser().parse_args(args)
    if args.info:
        print(json.dumps(platform_info(), indent=4))
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
        LOGGER.info('=' * len(benchmark['title']))
        LOGGER.info('')

        LOGGER.info('Starting server...')
        docker_remove(container_name, cli)
        container = cli.containers.run(
            DOCKER_IMAGE,
            name=container_name,
            command=benchmark['command'],
            ports={'7000/tcp': 7000},
            detach=True
        )

        if not wait_for_server(address):
            docker_remove(container)
            LOGGER.error('Could not start server')
            continue

        LOGGER.info('Warming up server...')
        LOGGER.info('wrk %s', ' '.join(warmup))
        LOGGER.info(format_wrk_result(wrk(warmup), WARMUP_DURATION))

        duration = args.duration

        benchmark_data = {
            'name': benchmark['name'],
            'variations': []
        }

        benchmarks_data.append(benchmark_data)

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
                benchmark_data['variations'].append(result)
        finally:
            docker_remove(container)

    if args.save_json:
        info = cli.containers.run(
            DOCKER_IMAGE,
            name=container_name,
            command='python3 bench.py --info',
        )
        benchmarks_data = {
            'date': datetime.now().isoformat(),
            'duration': args.duration,
            'platform': json.loads(info),
            'concurrency_levels': args.concurrency_levels,
            'payload_size_levels': args.payload_size_levels,
            'benchmarks': benchmarks_data,
        }

        with open(args.save_json, 'w') as f:
            json.dump(benchmarks_data, f)


if __name__ == '__main__':
    logging.basicConfig(level='INFO', format='%(message)s')
    main()
