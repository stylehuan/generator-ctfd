/**
 * @fileoverview  #note
 * @author  #name
 * @date  1/26/2015
 */
var express = require('express');
var router = express.Router();
var routes = require('./routes/routes');
var path = require('path');
var ejs = require('ejs');
var favicon = require('serve-favicon');
var exec = require('child_process').exec;
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'view'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
//app.use(favicon(path.join(__dirname, 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'src')));


routes(app);

app.listen(app.get('port'), function () {
    var port = app.get('port');
    console.log("this web site listening on port:" + port);
    exec("start " + "http://localhost:" + port, function (err, stdout, stderr) {
        if (err !== null) {
            console.log('exec error: ' + err);
        }
    });
});