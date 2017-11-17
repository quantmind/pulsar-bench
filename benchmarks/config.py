
servers = [
    {
        "name": "pulsar-uv",
        "title": 'Pulsar + uvloop + httptools',
        "command": "python benchmarks/servers/pulsar_server.py -w 0 --io uv"
    },
    {
        "name": "pulsar-vanilla",
        "title": 'Pulsar vanilla',
        "command": "python benchmarks/servers/pulsar_server.py -w 0"
    },
    {
        "name": "aiohttp",
        "title": 'aiohttp + uvloop',
        "command": "python benchmarks/servers/aiohttp_server.py"
    },
    {
        "name": "node",
        "title": "Node/express HTTP web server",
        "command": "node benchmarks/servers/node_server.js"
    },
    {
        "name": "sanic",
        "title": 'sanic + uvloop',
        "command": "python benchmarks/servers/sanic_server.py"
    },
    {
        "name": "tornado",
        "title": "Tornado HTTP web server",
        "command": "python benchmarks/servers/tornado_server.py"
    },
    {
        "name": "twisted",
        "title": "Twisted HTTP web server",
        "command": "python benchmarks/servers/twisted_server.py"
    },
    {
        "name": "gunicorn+meinheld+flask",
        "title": "Gunicorn + Mainheld WSGI + flask",
        "command": "gunicorn --workers=1 --worker-class=meinheld.gmeinheld.MeinheldWorker -b :7000 benchmarks.servers.gunicorn_flask_server:app"
    }
]
