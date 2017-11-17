import time

import sanic
from sanic.response import json, text

from pulsar.apps.data import create_store
from pulsar.utils.lib import http_date

app = sanic.Sanic("test")
SERVER_NAME = 'Sanic/%s' % sanic.__version__
redis = create_store('redis://127.0.0.1:6379/15').client()


@app.route("/")
async def test(request):
    response = json({"test": True})
    response.headers['Server'] = SERVER_NAME
    response.headers['Date'] = http_date(int(time.time()))
    return response


@app.route("/payload/<size:int>")
async def payload(request, size):
    response = text('d' * size)
    response.headers['Server'] = SERVER_NAME
    response.headers['Date'] = http_date(int(time.time()))
    return response


@app.route("/ping-redis")
async def ping_redis(request):
    await redis.ping()
    response = json({"test": True})
    response.headers['Server'] = SERVER_NAME
    response.headers['Date'] = http_date(int(time.time()))
    return response


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=7000)
