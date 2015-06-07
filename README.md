# 前端项目工程化生成器
 
 [![Build Status](https://travis-ci.org/stylehuan/generator-ctfd.png)](https://travis-ci.org/stylehuan/generator-ctfd
 
 根据`yeoman-generator`编写的项目构建工具的生成器，可以快速的搭建前端一系列解决方案。

##特点
 - 基础的css、img、js的检测、压缩、合并。
 - 自动编译`Less`
 - 内置`webpack`,兼容`AMD` or `CMD`开发方式，无需引入`requirejs` or `seajs`库。自动的模块打包方式，完全没有`requirejs`的`rjs`配置的烦恼。[http://yeoman.io/authoring/](详见说明)
 - 本地server服务，方便数据mock. 详见说明
 - 本地静态文件的`SSI include`支持  详见说明
 - 使用`bower`进行js的依赖管理
 - 自动静态文件时间戳处理
 -  发布时支持静态文件添加`cdn`域前缀。
 
##入门
 - 全局安装 `npm install generator-ctfd -g`; 
 - 确保已经安装了`yo`, 在项目目录文件下运行：`npm install yo ctfd` 将出现相应的项目ask，如下图;

 - 上面完成后，运行`gulp build`,完毕后运行`gulp server`;
 
## API


## TODO
- 完善单元测试
- 细节处理，修改部分bug,完善相关文档

###参考资料
[http://yeoman.io/authoring/](http://yeoman.io/authoring/)
[http://www.jscon.co/coding/frontend/yeoman_generator.html](http://www.jscon.co/coding/frontend/yeoman_generator.html)
[http://smm.zoomquiet.io/data/20130910155524/index.html](http://smm.zoomquiet.io/data/20130910155524/index.html)
[http://smm.zoomquiet.io/data/20130910155513/index.html](http://smm.zoomquiet.io/data/20130910155513/index.html)
[http://yeoman.github.io/generator/](http://yeoman.github.io/generator/)
[https://github.com/SBoudrias/Inquirer.js](https://github.com/SBoudrias/Inquirer.js)