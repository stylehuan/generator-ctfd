var yeoman = require("yeoman-generator");
var yeomanBase = yeoman.generators.Base;
var path = require("path");
var util = require("util");

function consoleColor(str, num) {
    if (!num) {
        num = '32';
    }
    return "\033[" + num + "m" + str + "\033[0m"
}

function green(str) {
    return consoleColor(str, 32);
}

function yellow(str) {
    return consoleColor(str, 33);
}

function red(str) {
    return consoleColor(str, 31);
}

function blue(str) {
    return consoleColor(str, 34);
}

function CTFDGenerator(args, options, config) {
    yeomanBase.apply(this, arguments);
    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

    this.on('error', function (msg) {
        this.log(red(msg))
    });

    //完成后回调
    this.on('end', function () {
        var cb = this.async();
        var that = this;
        this.prompt([
            {
                name: 'npm_install',
                message: 'Install node_modules for gulp now?',
                default: 'N/y',
                warning: ''
            }
        ], function (props) {
            that.npm_install = (/^y/i).test(props.npm_install);
            if (that.npm_install) {
                this.npmInstall('', {}, function (err) {
                    if (err) {
                        return console.log('\n' + yellow('error"\n'));
                    }
                    console.log(green('\n\nnpm was installed successful. \n\n'));
                });
            } else {
                console.log(yellow('\n\nplease run "npm install"\n'));
                console.log(green('\ndone!\n'));
            }
        }.bind(this));
    }.bind(this));
};
util.inherits(CTFDGenerator, yeomanBase);


CTFDGenerator.prototype.init = function () {
    var done = this.async();

    //获取根目录文件名
    var folderName = path.basename(process.cwd());

    //规范文件名  my-product  || my  product || my_product   to    MyProduct
    //TODO 新增并验证
    var formatName = function (name) {
        return name.replace(/\b(\w)|(-\w)/, function (n) {
            return n.toUpperCase().replace("-", "");
        })
    };

    //提问配置
    var prompts = [
        {
            name: 'projectName',
            message: 'Name of Project?(项目名称)',
            default: folderName,//默认是根目录文件名
            warning: ''
        },
        {
            name: 'projectDesc',
            message: 'Description of Project?(项目描述)',
            default: folderName,
            warning: ''
        },
        {
            name: 'author',
            message: 'Author Name(开发者)',
            default: "",
            warning: ''
        },
        {
            name: 'email',
            message: 'Author Email:(email)',
            default: "",
            warning: ''
        },
        {
            name: 'version',
            message: 'Version(版本)',
            default: '0.0.1',
            warning: ''
        },
        {
            name: "isManage",
            message: "Whether you need to version control?(代码控制)",
            default: "Y/N",
            warning: ''
        }
    ];

    this.prompt(prompts, function (props) {
        var self = this;
        this.packageName = props.projectName;
        this.projectName = formatName(this.packageName);
        this.packageDesc = props.projectDesc;
        this.author = props.author;
        this.email = props.email;
        this.version = props.version;

        this.isManage = (/^y/i).test(props.isManage);

        if (this.isManage) {
            this.prompt([
                {
                    type: "list",
                    name: "repositoryType",
                    message: "git|svn?",
                    choices: [
                        "git",
                        "svn"
                    ],
                    warning: ''
                },
                {
                    name: "repositoryUrl",
                    message: "add repositoryUrl",
                    default: "",
                    warning: ""
                }
            ], function (props) {
                if (props) {
                    self.repositoryType = props.repositoryType.toLowerCase();
                    self.repositoryUrl = props.repositoryUrl;
                }
                done();
            }.bind(this))
        } else {
            done();
        }
    }.bind(this));
};

CTFDGenerator.prototype.createGulpFile = function () {
    this.copy("gulpfile.js", "gulpfile.js");
};

CTFDGenerator.prototype.createPkg = function () {
    this.template("_package.json", "package.json");
};

CTFDGenerator.prototype.cteateManage = function () {
    if (this.isManage) {
        if (this.repositoryType == "svn") {
            this.template('_svnShell.bat', 'svnShell.bat');
        } else {
            this.copy('_gitignore', '.gitignore');
        }
    }
};

CTFDGenerator.prototype.createJshintrc = function () {
    this.copy("_jshintrc", "jshintrc");
};

CTFDGenerator.prototype.createHtmlhintrc = function () {
    this.copy("_htmlhintrc", "htmlhintrc");
};

CTFDGenerator.prototype.createBowerrc= function () {
    this.copy("_bowerrc", ".bowerrc");
};

CTFDGenerator.prototype.cteateApp = function app() {
    this.directory('src');
    this.directory('routes');
    this.mkdir("test");
    this.mkdir("src/mod");
    this.mkdir("src/asset/css");
    this.mkdir("src/asset/images");
    this.mkdir("src/asset/js");
    this.mkdir("src/page/include");
    this.mkdir("doc");

    this.template('README.md');
    this.copy("routes/route.js", "routes/route.js");
    this.copy("page/index.html", "src/page/index.html");
    this.copy("h.png", "src/asset/images/h.png");
    this.copy("index.less", "src/asset/css/index.less");
    this.copy("js/a.js", "src/asset/js/a.js");
    this.copy("js/b.js", "src/asset/js/b.js");
    this.copy("js/index.js", "src/asset/js/index.js");
    this.template("page/header.html", "src/page/include/header.html");
    this.template("page/footer.html", "src/page/include/footer.html");
    this.copy("app.js", "app.js");
    this.copy("build.js", "build.js");
    this.copy("webpack.config.js", "webpack.config.js");
};

module.exports = CTFDGenerator;