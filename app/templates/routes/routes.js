var index = require("./index");

module.exports = function (app){
    //首页
    app.use("/", index)
};

 