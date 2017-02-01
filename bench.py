import re
import os
import argparse
import logging

from config import servers
from pbench import start_and_wait_for_server


LOGGER = logging.getLogger('pulsar.bench')


def parser():
    parser = argparse.ArgumentParser()
    parser.add_argument('--duration', '-D', default=30, type=int,
                        help='duration of each benchmark in seconds')
    parser.add_argument('--name', type=str, default='pulsarbench',
                        help='docker container name')
    parser.add_argument('--host', type=str, default='127.0.0.1',
                        help='docker host')
    parser.add_argument('--benchmarks', type=str,
                        help='comma-separated list of benchmarks to run ' +
                             '(regular expressions are supported)')
    parser.add_argument('--concurrency-levels', type=int, default=[10],
                        nargs='+',
                        help='a list of concurrency levels to use')
    parser.add_argument('--payload-size-levels', type=int, nargs='+',
                        default=[1024, 10240, 102400],
                        help='comma-separated list of message size levels ' +
                             'to use (in bytes)')
    parser.add_argument('--save-json', '-J', type=str,
                        help='path to save benchmark results in JSON format')
    return parser


def server_command(container, command):
    _dir = os.path.dirname(__file__)
    _cache = os.path.abspath(os.path.join(_dir, '.cache'))
    _socket = os.path.abspath(os.path.join(_dir, 'sockets'))
    return [
        'docker', 'run', '--rm', '-p', '7000:7000',
        # '-e', 'UID={}'.format(os.geteuid()),
        # '-e', 'GID={}'.format(os.getegid()),
        # '-v', '{_cache}:/var/lib/cache'.format(_cache=_cache),
        # '-v', '{_socket}:/tmp/sockets'.format(_socket=_socket),
        '--name', container, 'pulsar/benchmark', command
    ]


def main():
    args = parser().parse_args()
    if args.benchmarks:
        benchmarks_to_run = [re.compile(b) for b in args.benchmarks.split(',')]
    else:
        benchmarks_to_run = [re.compile(re.escape(b['name']))
                             for b in servers]

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
                    '--msize={}'.format(msgsize),
                    '--concurrency={}'.format(concurrency)
                ]
            })

    warmup_concurrency = max(args.concurrency_levels)
    warmup = ['--msize=1024', '--duration=10',
              '--concurrency={}'.format(warmup_concurrency)]
    address = '%s:7000' % args.host

    for benchmark in servers:
        if not any(b.match(benchmark['name']) for b in benchmarks_to_run):
            continue

        LOGGER.info(benchmark['title'])
        LOGGER.info('=' * len(benchmark['title']))
        LOGGER.info('')

        LOGGER.info('Starting server...')
        server_cmd = server_command(container_name, benchmark['command'])
        LOGGER.info('  ' + ' '.join(server_cmd))
        start_and_wait_for_server(server_cmd, address, container_name)


if __name__ == '__main__':
    logging.basicConfig(level='INFO', format='%(message)s')
    main()
