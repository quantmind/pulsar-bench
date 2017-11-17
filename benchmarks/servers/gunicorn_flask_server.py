from flask import Flask

import ujson


app = Flask(__name__)


@app.route('/')
def index():
    return ujson.dumps({'test': True})


@app.route('/payload/<int:size>')
def payload(size):
    return 'd'*size
