import os.path
import platform
import warnings

import docker
from docker.errors import DockerException, APIError, NotFound


def docker_client():
    try:
        return docker.from_env(version='auto')
    except DockerException as exc:
        raise DockerException(
            'Could not connect to docker: %s' % exc
        ) from None


def docker_remove(container, cli=None):
    try:
        if isinstance(container, str):
            assert cli, "docker client required"
            container = cli.containers.get(container)
        try:
            container.stop()
        except APIError:
            try:
                container.kill()
            except APIError:
                pass
        container.remove()
    except NotFound:
        pass


def platform_info():
    machine = platform.machine()
    processor = platform.processor()
    system = platform.system()

    cpuinfo_f = '/proc/cpuinfo'

    if processor in {machine, 'unknown'} and os.path.exists(cpuinfo_f):
        with open(cpuinfo_f, 'rt') as f:
            for line in f:
                if line.startswith('model name'):
                    _, _, p = line.partition(':')
                    processor = p.strip()
                    break

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

    return {
        'cpu': processor,
        'arch': machine,
        'system': '{} {}'.format(system, platform.release()),
        'distribution': distribution
    }
