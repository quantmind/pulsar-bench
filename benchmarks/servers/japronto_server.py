from japronto import Application


def home(request):
    return request.Response(json={'test': True})


app = Application()


app.router.add_route('/', home)


if __name__ == '__main__':
    app.run()
