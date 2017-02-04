import logging

import docker
from docker.errors import DockerException, APIError, NotFound


LOGGER = logging.getLogger('pulsar.bench')


def docker_client():
    try:
        return docker.from_env(version='auto')
    except DockerException as exc:
        raise DockerException(
            'Could not connect to docker: %s' % exc
        ) from None


def docker_remove(container, cli=None):
    """Safely remove a container if possible.

    Never throws
    """
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
        try:
            container.remove()
        except APIError as e:
            LOGGER.error('Cannot remove container %s: %s', container.name, e)
    except NotFound:
        pass
