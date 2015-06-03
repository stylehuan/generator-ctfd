var path = require('path');
var webpack = require('webpack');
var fs = require("fs");
var config = require("./build");
var entryList = {};
var entryJson = {};


//设置入口文件
var setWpEneryList = function () {
    var data = fs.readFileSync("other/entry_js.json");

    if (data) {
        entryJson = JSON.parse(data);
        for (var k in entryJson) {
            entryList[k] = path.join(__dirname, "./src", entryJson[k]);
        }
    }
};

//写入配置文件
var writeMapJson = function () {
    this.plugin("done", function (stats) {
        var assets = stats.toJson()["assetsByChunkName"];
        var build = {};
        for (var k in entryJson) {
            for (var bk in assets) {
                if (k == bk) {
                    // TODO: config.webPackPath做边界处理
                    build[entryJson[k]] = "/js/" + assets[bk];
                }
            }
        }
        fs.writeFileSync("other/combo_js.json", JSON.stringify(build));
    });
};
setWpEneryList();

var appRoot = path.join(__dirname, 'src/page');
var appModRoot = path.join(__dirname, 'app/components');
var bowerRoot = path.join(__dirname, 'bower_components');

// definePlugin 接收字符串插入到代码当中, 所以你需要的话可以写上 JS 的字符串
var definePlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
    __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false'))
});

//提取公共模块，生成独立的文件，方便多页面浏览器cache
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');

// 配置
var webpackConfig = {
    entry: entryList,
    output: {
        path: path.resolve("./", "js"),
        filename: '[name].js',// 模版基于自身 entry 的 key
        chunkFilename: "./chuck/[name]-[hash].js",//独立的js命名格式
        sourcePrefix: ""//每行开头设置的字符。默认是 \t;
//        publicPath: path.join(config.pubPath, "js/")
    },
    resolve: {
        root: [appRoot, appModRoot , bowerRoot],
        alias: {
            "dialog": path.join(__dirname, "src/asset/", "js/dialog")
        },
        extensions: ['', '.js', '.coffee', '.html', '.css', '.scss']//后缀自动补全
    },
    plugins: [definePlugin, writeMapJson]         //, writeMapJson
};
module.exports = webpackConfig;