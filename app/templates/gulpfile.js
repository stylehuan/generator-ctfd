var gulp = require('gulp');
var fs = require("fs");
var path = require("path");

var importCss = require("gulp-import-css"); //查找样式文件中的import，引入并合并
var minifyCSS = require('gulp-minify-css');//css压缩
var uglify = require('gulp-uglify');//丑化js
var rename = require("gulp-rename"); //重命名
var clean = require("gulp-clean");
var rev = require("gulp-rev");//将文件名加一个hash值，解决缓存问题
var del = require('del');//删除目录或文件
var concat = require('gulp-concat'); //文件合并
var amdOptimize = require("amd-optimize"); //amd加载器合并
var md5 = require("gulp-md5");//生成md5
var useref = require('gulp-useref');//注释替换
var filter = require('gulp-filter');
var exec = require('child_process').exec;
var my = require("./sourceMaps");


var config = {
    sourcePath: "src",//静态资源源路径
    baseBuild: "build",
    buildView: "build/view",//构建View
    buildBeautify: "beautify",//构建后未压缩版
    buildAssets: "build/assets",//构建的静态资源目录
    temp: "temp", //临时目录
    sourceMapName: "sourceMaps", //配置文件名称
    sourceMapPath: ".",//配置文件生成的目录
    commitPath:"F:/work/SaiquddzDoc/"
};

var delHandler = function (path, cd) {
    cd = cd || function () {
    };
    del([path], function (err, deletedFiles) {
        console.log('Files deleted:', deletedFiles.join(', '));
        cd();
    });
};

//删除
gulp.task("del", function () {
    return gulp.src(config.baseBuild, {read: false})
        .pipe(clean({force: true}));
});

//生成base
gulp.task("base", function () {
    return gulp.src(config.sourcePath + "/js/common.js")
        .pipe(concat("base.js"))
        .pipe(gulp.dest(config.temp));
});

//处理AMD
gulp.task("amd", function () {
    return gulp.src(config.sourcePath + "/**/*.js")
        .pipe(amdOptimize(config.sourcePath + "/js/index", {
            findNestedDependencies: true,
            configFile: config.sourcePath + "/js/requireConf.js"
        }))
        .pipe(concat("index.js"))
        .pipe(gulp.dest(config.temp));
});

//生成commonjs
gulp.task("common", ["base", "amd"], function () {
    var stream = gulp.src(config.temp + "/*.js")
        .pipe(concat("common.js"))
        .pipe(gulp.dest(config.buildAssets + "/js"));//生成未压缩版
    delHandler(config.temp);
    return stream;
});

//处理css
gulp.task("css", function () {
    return gulp.src(config.sourcePath + "/css/*.css")
        .pipe(gulp.dest(config.buildAssets + "/css"))
});

//map
gulp.task("createMaps", ["common","css"], function () {
    var jsFilter = filter('**/*.js');
    var cssFilter = filter('**/*.css');
    return gulp.src(config.buildAssets + "/**")
        .pipe(jsFilter)
        .pipe(uglify({mangle: true, compress: true}))
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe(minifyCSS({keepBreaks: true}))
        .pipe(cssFilter.restore())
        .pipe(rev())//生成md5
        .pipe(gulp.dest(config.buildAssets))
        .pipe(rev.manifest({
            path: config.sourceMapName + ".json"
        }))
        .pipe(gulp.dest(config.sourceMapPath));
});

//处理view , 替换静态资源
gulp.task('html', ["createMaps"], function () {
    return gulp.src("view/**/*.html")
        .pipe(useref())
        .pipe(my({
//            path: __dirname+ "/"+ config.sourceMapName + ".json"
            path: path.join(__dirname, config.sourceMapName + ".json")
        }))
        .pipe(gulp.dest(config.buildView));
});

//拷贝到项目svn目录
gulp.task("copy", function () {
    return gulp.src(config.baseBuild + "/**")
        .pipe(gulp.dest(config.commitPath));
});

//提交svn
gulp.task("commit",["copy"], function () {
    exec("svnShell.bat", function (err, stdout, stderr) {
        if (err !== null) {
            console.log('exec error: ' + err);
        }
    });
});

gulp.task("default", ["del"], function () {
    gulp.start("html");
});