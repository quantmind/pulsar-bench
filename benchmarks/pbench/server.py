import time
import socket
import logging
import platform
import warnings
import sys
from collections import OrderedDict
from multiprocessing import cpu_count

from .cpuinfo import get_processor_name

try:
    import httptools
except ImportError:
    httptools = False

try:
    import uvloop
except ImportError:
    uvloop = False

from pulsar.api import HAS_C_EXTENSIONS

LOGGER = logging.getLogger('pulsar.bench')


def wait_for_server(address, timeout=60):
    start = time.monotonic()
    addr = address.split(':')
    addr[1] = int(addr[1])
    addr = tuple(addr)

    while time.monotonic() - start < timeout:
        LOGGER.info('Trying to connect to server at address %s', address)
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(max(start + timeout - time.monotonic(), 1))
        try:
            sock.connect(addr)
            sock.sendall(b'GET / HTTP/1.0\r\n\r\n')
            if sock.recv(4):
                LOGGER.info('Server is up and running.')
            else:
                raise IOError('socket read')
        except IOError:
            time.sleep(1)
        else:
            try:
                sock.shutdown(socket.SHUT_RDWR)
                sock.close()
            except IOError:
                pass
            return True


def platform_info():
    machine = platform.machine()
    processor = platform.processor()
    system = platform.system()
    processor = get_processor_name()

    if 'Linux' in system:

        with warnings.catch_warnings():
            # see issue #1322 for more information
            warnings.filterwarnings(
                'ignore',
                'dist\(\) and linux_distribution\(\) '
                'functions are deprecated .*',
                PendingDeprecationWarning,
            )
            distname, distversion, distid = platform.dist('')

        distribution = '{} {}'.format(distname, distversion).strip()

    else:
        distribution = None

    info = OrderedDict()
    if processor:
        info['processor'] = processor
    info.update({
        'cpus': cpu_count(),
        'arch': machine,
        'system': '{} {}'.format(system, platform.release()),
        'distribution': distribution,
        'python': '.'.join((str(v) for v in sys.version_info[:3])),
        'pulsar c extensions': HAS_C_EXTENSIONS,
        'httptools': bool(httptools),
        'uvloop': bool(uvloop)
    })
    return info
