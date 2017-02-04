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
