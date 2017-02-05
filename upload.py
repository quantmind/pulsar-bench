import argparse
import subprocess
import logging
import json


LOGGER = logging.getLogger('pulsar.bench')


def parser():
    parser = argparse.ArgumentParser()
    parser.add_argument('filename', type=str, nargs=1,
                        help='benchmark file')
    parser.add_argument('--path', '-p', type=str, nargs=1,
                        help='S3 path in the form bucket/base_key')
    return parser


def upload():
    args = parser().parse_args()
    path = args.path[0]
    bits = [p for p in path.split('/') if p]
    assert bits
    bucket = bits[0]
    path = '/'.join(bits[1:])

    filename = args.filename[0]
    with open(filename, 'r') as fp:
        datestr = json.load(fp)['date']

    exit_code = 0
    for target in ('benchmark_latest.json', 'benchmark_%s.json' % datestr):
        key = '%s/%s' % (path, target) if path else target
        cmd = ['aws', 's3api', 'put-object', '--body', filename,
               '--bucket', bucket, '--key', key]
        LOGGER.info('Upload to bucket: %s key: %s', bucket, key)
        result = subprocess.Popen(cmd, stdout=subprocess.PIPE,
                                  stderr=subprocess.PIPE)
        if result.returncode:
            exit_code = 1
            LOGGER.error(result.communicate()[1].decode('utf-8'))

    return exit_code


if __name__ == '__main__':
    logging.basicConfig(level='INFO', format='%(message)s')
    exit(upload())
