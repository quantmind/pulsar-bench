import re
import os
import argparse

from config import servers


def parser():
    parser = argparse.ArgumentParser()
    parser.add_argument('--duration', '-D', default=30, type=int,
                        help='duration of each benchmark in seconds')
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
    parser.add_argument('--save-html', '-H', type=str,
                        help='path to save benchmark results in HTML format')
    return parser


def server_base():
    _dir = os.path.dirname(__file__)
    _cache = os.path.abspath(os.path.join(_dir, '.cache'))
    _socket = os.path.abspath(os.path.join(_dir, 'sockets'))
    return [
        'docker', 'run', '--rm', '-t', '-p', '7000:7000',
        '-e', 'UID={}'.format(os.geteuid()),
        '-e', 'GID={}'.format(os.getegid()),
        '-v', '{_cache}:/var/lib/cache'.format(_cache=_cache),
        '-v', '{_socket}:/tmp/sockets'.format(_socket=_socket),
        '--name', 'pulsarbench', 'pulsar/benchmark'
    ]


def main():
    args = parser().parse_args()
    if args.benchmarks:
        benchmarks_to_run = [re.compile(b) for b in args.benchmarks.split(',')]
    else:
        benchmarks_to_run = [re.compile(re.escape(b['name']))
                             for b in servers]

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

    for benchmark in servers:
        if not any(b.match(benchmark['name']) for b in benchmarks_to_run):
            continue

        print(benchmark['title'])
        print('=' * len(benchmark['title']))
        print()

        print('Starting server...')
        server_cmd = server_base + benchmark['server']
        print('  ' + ' '.join(server_cmd))
        start_and_wait_for_server(server_cmd, benchmark['server_address'])
        print()


if __name__ == '__main__':
    main()
