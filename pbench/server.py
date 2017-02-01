import time
import subprocess
import socket
import logging


LOGGER = logging.getLogger('pulsar.bench')


def start_and_wait_for_server(server_cmd, address, container, timeout=60):
    kill_server(container)

    server = subprocess.Popen(server_cmd, universal_newlines=True,
                              stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    print(server.communicate())

    start = time.monotonic()

    if address.startswith('file:'):
        family = socket.AF_UNIX
        addr = address[5:]
    else:
        family = socket.AF_INET
        addr = address.split(':')
        addr[1] = int(addr[1])
        addr = tuple(addr)

    while time.monotonic() - start < timeout:
        LOGGER.info('Trying to connect to server at address %s', address)
        sock = socket.socket(family, socket.SOCK_STREAM)
        sock.settimeout(time.monotonic() - start)
        try:
            sock.connect(addr)
            sock.sendall(b'GET / HTTP/1.0\r\n\r\n')
            if sock.recv(4):
                print('Server is up and running.')
            else:
                raise IOError('socket read')
        except IOError:
            if server.returncode is not None:
                LOGGER.error('Could not start server\n'
                             '----------------------\n'
                             '\n\n'.join(server.communicate()))
                return
            time.sleep(2)
        else:
            sock.shutdown(socket.SHUT_RDWR)
            sock.close()
            return server

    kill_server(container)

    LOGGER.error('Could not start server\n'
                 '----------------------\n'
                 '\n\n'.join(server.communicate()))


def kill_server(container):
    if server_is_running(container):
        print('Shutting down server...')
        subprocess.check_output(['docker', 'stop', container])

    if server_container_exists(container):
        print('Removing server container...')
        subprocess.check_output(['docker', 'rm', container])


def server_container_exists(container):
    ret = subprocess.call(['docker', 'inspect', '--type=container',
                           container],
                          stdout=subprocess.DEVNULL,
                          stderr=subprocess.DEVNULL)
    return ret == 0


def server_is_running(container):
    try:
        ret = subprocess.check_output(
                ['docker', 'inspect', '--type=container',
                 '--format="{{ .State.Running }}"', container],
                stderr=subprocess.DEVNULL,
                universal_newlines=True)

    except subprocess.CalledProcessError:
        return False

    else:
        return ret == 'true\n'
