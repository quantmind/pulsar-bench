# Run with: gunicorn --workers=1 --worker-class=meinheld.gmeinheld.MeinheldWorker -b :8000 gunicorn_flask_server:app
from flask import Flask
import ujson


app = Flask(__name__)

@app.route('/')
def index():
    return ujson.dumps({'test': True})
