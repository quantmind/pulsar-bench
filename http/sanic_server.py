import time

import sanic
from sanic.response import json

from pulsar.utils.httpurl import http_date
from pulsar.apps.data import create_store

app = sanic.Sanic("test")
SERVER_NAME = 'Sanic/%s' % sanic.__version__
redis = create_store('redis://127.0.0.1:6379/15').client()


@app.route("/")
async def test(request):
    response = json({"test": True})
    response.headers['Server'] = SERVER_NAME
    response.headers['Date'] = http_date(int(time.time()))
    return response


@app.route("/ping-redis")
async def test(request):
    await redis.ping()
    response = json({"test": True})
    response.headers['Server'] = SERVER_NAME
    response.headers['Date'] = http_date(int(time.time()))
    return response


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=7000)
