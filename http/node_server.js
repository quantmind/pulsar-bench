var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.json({ Test: true });
});

app.get('/payload/:size', function (req, res) {
    var size = +req.params.size;
    res.json({ size: size, data: new Array(size+1).join('d')});
});

app.listen(7000, function () {
  console.log('Example app listening on port 7000!')
});
