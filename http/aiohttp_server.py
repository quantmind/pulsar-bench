# Run with python3 simple_server.py
from aiohttp import web
import asyncio
import uvloop
import ujson as json

from pulsar.apps.data import create_store


loop = uvloop.new_event_loop()
asyncio.set_event_loop(loop)
redis = create_store('redis://127.0.0.1:6379/15').client()


async def handle(request):
    return web.Response(
        body=json.dumps({"test": True}).encode('utf-8'),
        content_type='application/json'
    )


async def ping_redis(request):
    result = await redis.ping()
    return web.Response(
        body=json.dumps({"ping-redis": result}).encode('utf-8'),
        content_type='application/json'
    )


def app():
    app = web.Application(loop=loop)
    app.router.add_route('GET', '/', handle)
    app.router.add_route('GET', '/ping-redis', ping_redis)
    return app


if __name__ == '__main__':
    web.run_app(app(), port=7000, access_log=None)
