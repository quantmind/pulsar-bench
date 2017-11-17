<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>{{ title }}</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css" media="all" rel="stylesheet" />
    <link href="visual.css?version={{ version }}" media="all" rel="stylesheet" />
    <script src="es6-promise.auto.min.js" type="application/javascript"></script>
    <script src="fetch.js" type="application/javascript"></script>
    <script src="require.js?version={{ version }}" type="application/javascript"></script>
</head>
<body>
    <nav class="navbar navbar-light bg-light">
        <a class="navbar-brand" href="">Pulsar Benchmarks</a>
        <a class="nav-link" href="https://github.com/quantmind/pulsar-benchmarks"><i class="ion-social-github"></i></a>
    </nav>
    <dashboard schema="config.json" class="container-fluid">
        <div class="row">
            <div class="col-sm-12">
                <visual schema="main"></visual>
            </div>
        </div>
    </div>
    <script type="application/javascript">
        {{#unless min}}
        window.development = true;
        {{/unless}}
        d3.require.local('site', "visual{{ min }}.js?version={{ version }}");
        d3.require('site').then(function (site) {
            site.start();
        });
    </script>
</body>
</html>
