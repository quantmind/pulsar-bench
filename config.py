
servers = [
    {
        "name": "pulsar",
        "title": 'Pulsar + uvloop + httptools',
        "command": "python pulsar_server -w 0 --io uv"
    },
    {
        "name": "pulsar",
        "title": 'Pulsar vanilla',
        "command": "python pulsar_server -w 0 --http-py-parser"
    },
    {
        "name": "aiohttp",
        "title": 'aiohttp + uvloop',
        "command": "python aiohttp_server"
    },
    {
        "name": "twisted",
        "title": "Twisted HTTP web server",
        "command": "python twisted_server"
    },
    {
        "name": "gunicorn+meinheld+flask",
        "title": "Gunicorn + Mainheld WSGI + flask",
        "command": "gunicorn --workers=1 --worker-class=meinheld.gmeinheld.MeinheldWorker -b :7000 gunicorn_flask_server:app"
    }
]
