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

    console.log("success");
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
            return  n.toUpperCase().replace("-","");
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
        }
    ];

    /*
     * projectName：驼峰名称,比如 ProjectName
     * packageName：原目录名称，比如 project-name
     **/
    this.prompt(prompts, function (props) {
        this.packageName = props.projectName;// project-name
        this.projectName = formatName(this.packageName); //ProjectName
        this.packageDesc = props.projectDesc;
        this.author = props.author;
        this.email = props.email;
        this.version = props.version;

        done();
    }.bind(this));
};

CtfdGenerator.prototype.createGulpFile = function(){
      this.copy("gulpfile.js");
};

CtfdGenerator.prototype.createPkg=function(){
    this.templatePath("_package.json", "package.json");
};

CtfdGenerator.prototype.cteateGit=function(){
    this.copy('_gitignore', '.gitignore');
};

CtfdGenerator.prototype.cteateApp = function app() {
    this.mkdir('doc');
    this.mkdir('build');
};

