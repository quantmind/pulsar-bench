
servers = [
    {
        "name": "pulsar-uv",
        "title": 'Pulsar + uvloop + httptools',
        "command": "python3 http/pulsar_server.py -w 0 --io uv"
    },
    {
        "name": "pulsar-vanilla",
        "title": 'Pulsar vanilla',
        "command": "python3 pulsar_server -w 0"
    },
    {
        "name": "aiohttp",
        "title": 'aiohttp + uvloop',
        "command": "python3 aiohttp_server"
    },
    {
        "name": "twisted",
        "title": "Twisted HTTP web server",
        "command": "python3 twisted_server"
    },
    {
        "name": "gunicorn+meinheld+flask",
        "title": "Gunicorn + Mainheld WSGI + flask",
        "command": "gunicorn --workers=1 --worker-class=meinheld.gmeinheld.MeinheldWorker -b :7000 gunicorn_flask_server:app"
    }
]
