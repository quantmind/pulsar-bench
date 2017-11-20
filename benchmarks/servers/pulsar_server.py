# Run with python3 simple_server.py -w 0 --io uv
from pulsar.apps.wsgi import WSGIServer, Router, route
from pulsar.utils.system import json
from pulsar.apps.data import create_store


class SimpleRoute(Router):

    def get(self, request):
        response = request.response
        response.headers['content-type'] = 'application/json'
        response.set_content(json.dumps({"test": True}))
        return response

    @route('payload/<int(min=1,max=8388608):size>')
    def payload(self, request):
        response = request.response
        size = request.urlargs['size']
        response.set_content('d' * size)
        return response

    @route('ping-redis')
    async def ping(self, request):
        result = await self.root.redis.ping()
        response = request.response
        response.headers['content-type'] = 'application/json'
        response.set_content(json.dumps({"redis-ping": result}))
        return response

    @property
    def redis(self):
        if not hasattr(self, '_redis'):
            self._redis = create_store('redis://127.0.0.1:6379/15').client()
        return self._redis


class WsgiSite:
    _router = None

    def __call__(self, environ, start_response):
        if self._router is None:
            self._router = SimpleRoute('/')
        response = self._router(environ, start_response)
        response.start(environ, start_response)
        return response


if __name__ == '__main__':
    import sys
    argv = sys.argv[1:]
    params = dict(
        bind=':7000',
        log_handler='console_simple',
        log_level=['warning'],
        callable=WsgiSite(),
        argv=argv
    )
    if 'profile' in argv:
        from pulsar.utils import profiler
        argv.remove('profile')
        with profiler.Profiler():
            WSGIServer(**params).start()
    elif 'trace' in argv:
        import tracemalloc
        argv.remove('trace')
        tracemalloc.start()
        try:
            WSGIServer(**params).start()
        except SystemExit:
            snapshot = tracemalloc.take_snapshot()
            top_stats = snapshot.statistics('lineno')
            print("[ Top 100 ]")
            for stat in top_stats[:100]:
                print(stat)
    else:
        WSGIServer(**params).start()
