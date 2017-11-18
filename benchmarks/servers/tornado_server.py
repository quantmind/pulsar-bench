import ujson
from tornado import ioloop, web


class MainHandler(web.RequestHandler):

    def get(self):
        self.set_header('Content-Type', 'application/json; charset="utf-8"')
        self.write(ujson.dumps({'test': True}))


class PayloadHandler(web.RequestHandler):

    def get(self, size):
        self.set_header('Content-Type', 'text/plain')
        self.write('d'*int(size))


app = web.Application([
    (r'/', MainHandler),
    (r'/payload/(?P<size>[^\/]+)', PayloadHandler)
],  debug=False,
    compress_response=False,
    static_hash_cache=True
)


if __name__ == '__main__':
    app.listen(7000)
    ioloop.IOLoop.current().start()
