
servers = [
    {
        "name": "pulsar-uv",
        "title": 'Pulsar + uvloop + httptools',
        "command": "python http/pulsar_server.py -w 0 --io uv"
    },
    {
        "name": "pulsar-vanilla",
        "title": 'Pulsar vanilla',
        "command": "python http/pulsar_server.py -w 0"
    },
    {
        "name": "aiohttp",
        "title": 'aiohttp + uvloop',
        "command": "python http/aiohttp_server.py"
    },
    {
        "name": "node",
        "title": "Node/express HTTP web server",
        "command": "node http/node_server.py"
    },
    {
        "name": "sanic",
        "title": 'sanic + uvloop',
        "command": "python http/sanic_server.py"
    },
    {
        "name": "tornado",
        "title": "Twisted HTTP web server",
        "command": "python http/twisted_server.py"
    },
    {
        "name": "twisted",
        "title": "Tornado HTTP web server",
        "command": "python http/tornado_server.py"
    },
    {
        "name": "gunicorn+meinheld+flask",
        "title": "Gunicorn + Mainheld WSGI + flask",
        "command": "gunicorn --workers=1 --worker-class=meinheld.gmeinheld.MeinheldWorker -b :7000 gunicorn_flask_server:app"
    }
]
