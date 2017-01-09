# Run with python3 simple_server.py -w 0 --io uv
from pulsar.apps.wsgi import WSGIServer, WsgiHandler, LazyWsgi, Router, route
from pulsar.utils.system import json
from pulsar.apps.data import create_store


class SimpleRoute(Router):

    def get(self, request):
        response = request.response
        response.headers['content-type'] = 'application/json'
        response.content = json.dumps({"test": True})
        return response

    @route('payload/<int(min=1,max=8388608):size>')
    def get(self, request):
        response = request.response
        size = request.urlargs['size']
        response.headers['content-type'] = 'application/json'
        response.content = json.dumps({'size': size, 'data': 'd' * size})
        return response

    @route('ping-redis')
    async def ping(self, request):
        result = await self.root.redis.ping()
        response = request.response
        response.headers['content-type'] = 'application/json'
        response.content = json.dumps({"redis-ping": result})
        return response

    @property
    def redis(self):
        if not hasattr(self, '_redis'):
            self._redis = create_store('redis://127.0.0.1:6379/15').client()
        return self._redis


class Site(LazyWsgi):

    def setup(self, environ):
        return WsgiHandler(middleware=[SimpleRoute('/')])


def server(**params):
    params['callable'] = Site()
    return WSGIServer(**params)


if __name__ == '__main__':
    import sys
    argv = sys.argv[1:]
    if 'profile' in argv:
        from pulsar.utils import profiler
        argv.remove('profile')
        with profiler.Profiler():
            server(bind=':7000', log_level=['warning'], argv=argv).start()
    else:
        server(bind=':7000', log_level=['warning'], argv=argv).start()
