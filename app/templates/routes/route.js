/**
 * @route路由处理模块l
 * @author  stylehuan
 * @create  2015-05-28 21:13
 */
var Mock = require("mockjs");
var url = require("url");

module.exports = function (app) {
    //default
    app.use("/", function(req, res){
        res.end("Hello World")
    });

    //Get
    app.use("/domain", function (req, res) {
        var data = Mock.mock({
            'list|1-10': [{
                'id|+1': 1
            }]
        });
        res.end(JSON.stringify(data, null, 4));
    });
};
 