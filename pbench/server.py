import time
import socket
import logging


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
                print('Server is up and running.')
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
