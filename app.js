var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
app.use(cors());
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());

require("./server/config").configure(app);
var server = http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
