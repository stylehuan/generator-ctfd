var path = require('path');
var http = require("http");
var connect = require("connect");
var serveStatic = require("serve-static");
var exec = require('child_process').exec;
var config = require("./build");
var app = connect();
var route = require("./routes/route");

app.use(serveStatic(path.join(__dirname, "build"), {'index': ['index.html']}));

route(app);

module.exports = function () {
    //禁止80端口
    var port = (config.port && config.port != "80") ? config.port : 3000, url;
    app.listen(port, function () {
        url = "http://" + config.hostName + ":" + port + '/';
        exec("start " + url, function (err, stdout, stderr) {
            if (err) {
                console.log('exec error: ' + err);
            } else {
                console.log("Running at " + url);
            }
        });
    });
};
