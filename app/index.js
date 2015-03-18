var yeoman = require("yeoman-generator");
var yeomanBase = yeoman.generators.Base;
var path = require("path");
var util = require("util");

var CtfdGenerator = module.exports = function CrfdGenerator(args, options, config) {
    yeomanBase.apply(this, arguments);
    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

    this.on('error', function () {
    });
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
util.inherits(CtfdGenerator, yeomanBase);


CtfdGenerator.prototype.init = function () {
    var done = this.async();

    //获取根目录
    var folderName = path.basename(process.cwd());

    //规范文件名  my-projiect  || my  projiect   to    MyProject
    var formatName = function (name) {
        return name.replace(/\b(\w)|(-\w)/, function (n) {
            return  n.toUpperCase().replace("-", "");
        })
    };

    //提问配置
    var prompts = [
        {
            name: 'projectName',
            message: 'Name of Project?',
            default: folderName,
            warning: ''
        },
        {
            name: 'projectDesc',
            message: 'Description of Project?',
            default: folderName,
            warning: ''
        },
        {
            name: 'author',
            message: 'Author Name:',
            default: "",
            warning: ''
        },
        {
            name: 'email',
            message: 'Author Email:',
            default: "",
            warning: ''
        },
        {
            name: 'version',
            message: 'Version:',
            default: '0.0.1',
            warning: ''
        },
        {
            name: "isManage",
            message: "Whether you need to version control? ",
            default: "Y/n",
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
        }
        else {
            done();
        }

    }.bind(this));
};

CtfdGenerator.prototype.createGulpFile = function () {
    this.copy("gulpfile.js");
};

CtfdGenerator.prototype.createPkg = function () {
    this.template("_package.json", "package.json");
};

CtfdGenerator.prototype.cteateManage = function () {
    if (this.isManage) {
        if (this.repositoryType == "svn") {
            this.template('_svnShell.bat', 'svnShell.bat');
        } else {
            this.copy('_gitignore', '.gitignore');
        }
    }
};

CtfdGenerator.prototype.createJshintrc = function () {
    this.copy("_jshintrc", "jshintrc");
};

CtfdGenerator.prototype.createHtmlhintrc = function () {
    this.copy("_htmlhintrc", "htmlhintrc");
};


CtfdGenerator.prototype.cteateApp = function app() {
    this.mkdir("test");
    this.mkdir("view");
    this.mkdir("src");
    this.mkdir("doc");

    this.template('README.md');
    this.template("index.html", "view/index.html");
    this.directory("routes", "routes");
    this.copy("app.js", "app.js");
};

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
