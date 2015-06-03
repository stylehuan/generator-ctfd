var gulp = require('gulp');
var load = require('gulp-load-plugins')({
    rename: {
        "gulp-webpack-build": "webpack",
        'gulp-import-css': 'importCss',
        "gulp-if": "gulpif",
        "gulp-rev-all": "revAll",
        "gulp-rev-css-url": "override",
        "gulp-rev-replace": "revAllRep",
        "gulp-imagemin": "imgmin",
        'gulp-minify-css': 'minifyCss',
        "gulp-file-include": "include",
        "gulp-gather-mainjs": "gatherJs"
    }
});
//var browserSync = require("browser-sync");
//var reload = browserSync.reload;
var path = require("path");
var app = require("./app");


/*==基础配置==================================================*/
var config = require("./build");
var BUILD = path.join(__dirname, "./build");
var dirSrc = path.join(__dirname, "./src");

//webpack配置
var webPack = {
    fileName: load.webpack.config.CONFIG_FILENAME,
    config: {
        useMemoryFs: true,
        progress: true
    },
    options: {
        debug: true,
//        devtool: '#source-map',
        watchDelay: 200
    }
};
/*==任务配置==================================================*/
//清理
gulp.task("clean", function () {
    return gulp.src([BUILD, "other", "pub"], {read: false})
        .pipe(load.clean({force: true}));
});

//处理css
gulp.task("style", function () {
    return gulp.src([dirSrc + "/asset/css/**/*.less", dirSrc + "/asset/css/**/*.css"])
        .pipe(load.importCss())
        .pipe(load.less({
            paths: [path.join(__dirname, "src")]
        }))
        .pipe(load.minifyCss())
        .pipe(gulp.dest(BUILD + "/css"))
});

//js语法校验
gulp.task("check:js", function () {
    return gulp.src([dirSrc + "/asset/**/*.js"])
        .pipe(load.jshint('.jshintrc'))
        .pipe(load.jshint.reporter('default'));
});


//js入口搜集
gulp.task("entry:js", function () {
    return gulp.src(path.join(dirSrc, "page/**/*.html"))
        .pipe(load.gatherJs())
        .pipe(gulp.dest("other/entry_js.json"));
});

//js模块化合并
gulp.task("comb:js", ["entry:js"], function () {
    return gulp.src(path.join(webPack.fileName))
        .pipe(load.webpack.configure(webPack.config))
        .pipe(load.webpack.overrides(webPack.options))
        .pipe(load.webpack.compile())
        .pipe(load.webpack.format({
            version: false,
            timings: true
        }))
        .pipe(load.webpack.failAfter({
            errors: true,
            warnings: true
        }))
        .pipe(gulp.dest(BUILD));
});

//替换入口js的临时路径
gulp.task("build:view", ["comb:js"], function () {
    var assets = load.useref.assets({
        searchPath: ["src", "build"]
    });
    var manifest = gulp.src("./other/combo_js.json");

    var wiredep = require('wiredep').stream;
    return gulp.src([dirSrc + "/page/**/*.html", "!" + dirSrc + "/page/include/**"])
        .pipe(load.include({
            prefix: config.devIncludePrefix || "@"
        }))
        .pipe(load.revAllRep({manifest: manifest}))
        //插入bower components
        .pipe(wiredep({
            dependencies: true,
            devDependencies: true,
            ignorePath: /^(\.\.\/)*\.\./
//            exclude: [/jquery/]
        }))
        .pipe(load.replace(/\/asset/g, ""))
        .pipe(load.replace(/less/g, "css"))
        .pipe(assets)
        .pipe(gulp.dest(BUILD))
        .pipe(assets.restore())
        .pipe(load.useref())
        .pipe(load.gulpif('*.html', gulp.dest(BUILD + "/view")));
});

//处理image
gulp.task("image", function () {
    return gulp.src(dirSrc + "/asset/images/**/*")
        .pipe(load.cache(load.imgmin({ optimizationLevel: 5, progressive: true, interlaced: true })))
        .pipe(gulp.dest(BUILD + "/images"))
});

gulp.task("revAll", function () {
    var revAll = new load.revAll({
        fileNameManifest: config.manifest,
        dontRenameFile: [/\/chuck\/.+/g],
        transformFilename: function (file, hash) {
            var ext = path.extname(file.path);
            return path.basename(file.path, ext) + "_" + hash.substr(0, 5) + ext;
        }
    });
    return gulp.src([BUILD + "/**", "!" + BUILD + "/view/**"])
        .pipe(load.gulpif("*.js", load.uglify()))
        .pipe(revAll.revision())
        .pipe(gulp.dest('pub'))
        .pipe(revAll.manifestFile())
        .pipe(gulp.dest('other'))
});

gulp.task("replace:pub", ["revAll"], function () {
    var manifest = gulp.src("other/" + config.manifest);
    return gulp.src(BUILD + "/view/**")
        .pipe(load.revAllRep({
            manifest: manifest,
            prefix: config.pubPrefix
        }))
        .pipe(gulp.dest("pub"));
});

//监控
gulp.task("watch", function(){
    gulp.watch("src/asset/css/**", ['style']);
    gulp.watch("src/asset/image/**", ['image']);
    gulp.watch(["src/asset/js/**", "src/page/**"], ['build:view']);
});


/*==发布任务==================================================*/
//本地构建
gulp.task("build", ["clean"], function () {
    gulp.start("build:view", "style", "image");
});

//本地调试
gulp.task("debug", ["build"], function () {
    gulp.start("server");
});

//发布正式
gulp.task("pub", function () {
    gulp.start("replace:pub");
});

gulp.task("server", function () {
    app();
    gulp.start("watch");
});

gulp.task("default", function () {
    gulp.start("debug");
});