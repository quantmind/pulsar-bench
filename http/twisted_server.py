import sys
import ujson

if 'bsd' in sys.platform or sys.platform.startswith('darwin'):
    from twisted.internet import kqreactor
    kqreactor.install()
elif sys.platform in ['win32']:
    from twisted.internet.iocpreactor import reactor as iocpreactor
    iocpreactor.install()
elif sys.platform.startswith('linux'):
    from twisted.internet import epollreactor
    epollreactor.install()
else:
    from twisted.internet import default as defaultreactor
    defaultreactor.install()

from twisted.web.server import Site
from twisted.web.resource import Resource
from twisted.internet import reactor


class TestResource(Resource):

    def __init__(self, name=None):
        super().__init__()
        self.name = name
        self.isLeaf = name is not None

    def render_GET(self, request):
        body = ujson.dumps({'test': True}).encode('utf8')
        request.setHeader(b'Content-Type', b'application/json; charset=utf-8')
        return body

    def getChild(self, name, request):
        return TestResource(name=name.decode('utf-8'))


root = TestResource()
site = Site(root)


if __name__ == '__main__':
    reactor.listenTCP(7000, site, interface='0.0.0.0')
    reactor.run()
