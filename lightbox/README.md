# 目录

* [任务描述与要求](#任务描述与要求)
    * [描述](#描述)
    * [要求](#要求)
    * [RIA相关学习材料](#相关学习材料)
* [开发文档](#开发文档)
    * [项目结构](#项目结构)
    * [文件说明](#文件说明)
    * [开发环境配置](#开发环境配置)
    * [开发详细过程](#开发详细过程)
        * [界面开发](#界面开发)
        * [业务逻辑](#业务逻辑)
        * [界面上的控制](#界面上的控制)

# 任务描述与要求

这个仓库用于完成 [RIA扬帆班任务一：图片网站](https://github.com/baidu-ife/ife/blob/master/2015_summer/task/ria_yangfan_01.md)

同时用于完成任务2 [RIA扬帆班任务二：图片复杂编辑](https://github.com/baidu-ife/ife/blob/master/2015_summer/task/ria_yangfan_02.md)

## 描述

实现一个个人图片展示网站，包括展现及后台管理。

基于任务一，实现对于图片的复杂编辑功能。

[任务一、二的设计图](design.md)

## 要求

任务一：

* 团队协作完成
* 支持在管理端拖拽图片来改变图片的分类，以及图片在展示页面的排列顺序
* 支持在管理端通过拖拽分类来改变分类在展示页面的排序
* 支持在管理端上传图片，上传功能可以使用第三方组件，比如[WebUploader](http://github.com/fex-team/webuploader/)
* 除了jQuery及WebUploader，不允许使用其他框架类库
* 不需要登陆注册等功能
* 如果需要使用Server端，不限制语言，Server端框架使用不限制

任务二：

* 团队协作完成
* 进一步完善任务一的功能细节及用户体验
* 提供图片的裁剪功能
* 基于Canvas或者WebGL实现对于图片的各种滤镜功能

## 相关学习材料

* [what is a single page application (Wikipedia)](https://en.wikipedia.org/wiki/Single-page_application)
* [Single page apps in depth](http://singlepageappbook.com/index.html)
* [Important Considerations When Building Single Page Web Apps](http://code.tutsplus.com/tutorials/important-considerations-when-building-single-page-web-apps--net-29356)
* [JavaScript Single Page Application Frameworks](http://stackoverflow.com/questions/14336450/javascript-spa-frameworks-single-page-application)
* [Developing Single Page Apps with Backbone.js](https://singlepagebook.supportbee.com/)
* [AngularJS Tutorial - Building a Web App in 5 minutes](https://www.airpair.com/angularjs/building-angularjs-app-tutorial)
* [Building single page apps using web components](https://www.polymer-project.org/0.5/articles/spa.html)

# 开发文档

* 这里记录开发过程的所有说明、架构、技术选择、工具选择、合作方式等。
* 开发前一定要**先写开发文档**。特别是多人合作的项目。
* 有什么新的进展在这里更新。

## 项目结构

采用Gulp前端工程化，主要实现自动编译Sass，压缩JS和CSS。

    PicSite
    │
    ├─dist # 工程化后导出的文件目录
    │  ├─css # 压缩后的CSS文件
    │  └─js # 压缩后的JS文件
    │
    ├─node_modules # 开发时通过npm安装的各种包
    │
    ├─src # 源文件
    │   ├─css # 将Sass编译后的CSS文件
    │   ├─js # JS文件
    │   └─sass # 未编译的Sass文件
    │ 
    ├─.gitignore # git忽略文件
    ├─ design.md # 设计图（包含很图片）
    ├─ gulpfile.js # gulp文件，实现自动化编译和压缩静态文件
    ├─ index.html # 首页
    ├─ LICENSE # 许可证
    ├─ package.json # 依赖包信息
    └─ README.md # 说明及开发文档

## 文件说明

我们只需要操作 `index.html`, `manage.html`, `src\sass`, `src\js` 这4个文件或目录。

* index.html
    
    首页。用于图片展示页。

* manage.html

    管理页面。用于后台管理。

* Sass 编译及 CSS 压缩

    1. 在 src/sass 下写 scss
    2. 经过 gulp 编译，写入 src/css 目录
    3. 再经过 gulp 压缩，写入 dist/css 目录
    4. index.html 和 manage.html 外联 dist/css。

    **注意**：2、3 为执行 `gulp` 后的自动过程。
    
* JavaScript 校验及压缩

    1. 在 src/js 下写 JavaScript 代码
    2. 经过 gulp 编译和压缩，写入 dist/js 目录
    3. index.html 和 manage.html 外联 dist/js

    **注**：2 为执行 `gulp` 后的自动过程。


## 开发环境配置

1. 安装nodeJS环境。
    
    [node官网](https://nodejs.org/)一键安装。安装成功后。命令行输入：

        node -v
        v0.12.7

    得到版本号，即安装成功。

    这里推荐 **cmder** 代替原有的 Windows cmd。cmder官网：https://github.com/bliker/cmder

2. 将项目clone到本地，进入工程目录执行：

        npm install

    这行命令的意思是自动安装 `package.json` 文件中的开发依赖 `devDependencies`。
    
    * 目前这个项目依赖
        * "gulp": "^3.9.0",
        * "gulp-jshint": "^1.11.0",
        * "gulp-minify-css": "^1.2.0",
        * "gulp-ruby-sass": "^1.0.5",
        * "gulp-uglify": "^1.2.0"
    
    这一环节因为长城防火墙问题，可能会异常缓慢，极有可能失败，请耐心等待或者使用[**npm 淘宝镜像**](http://npm.taobao.org/)。

    安装成功后，会有类似如下显示：

        λ npm install
        npm WARN package.json Dependency 'gulp' exists in both dependencies and devDependencies, using 'gulp@^3.9.0' from dependencies
        gulp-minify-css@1.2.0 node_modules\gulp-minify-css
        ├── object-assign@3.0.0
        ├── readable-stream@2.0.2 (process-nextick-args@1.0.2, inherits@2.0.1, isarray@0.0.1, util-deprecate@1.0.1, string_decoder@0.10.31, core-util-is@1.0.1)
        ├── vinyl-bufferstream@1.0.1 (bufferstreams@1.0.1)
        ├── vinyl-sourcemaps-apply@0.1.4 (source-map@0.1.43)
        ├── gulp-util@3.0.6 (array-differ@1.0.0, array-uniq@1.0.2, lodash._reinterpolate@3.0.0, lodash._reevaluate@3.0.0, beeper@1.1.0, lodash._reescape@3.0.0, replace-ext@0.0.1, minimist@1.1.2, through2@2.0.0, vinyl@0.5.0, chalk@1.1.0, lodash.template@3.6.2, multipipe@0.1.2, dateformat@1.0.11)
        └── clean-css@3.3.7 (commander@2.8.1, source-map@0.4.4)

        gulp-ruby-sass@1.0.5 node_modules\gulp-ruby-sass
        ├── slash@1.0.0
        ├── dargs@2.1.0
        ├── object-assign@2.1.1
        ├── win-spawn@2.0.0
        ├── convert-source-map@1.1.1
        ├── each-async@1.1.1 (set-immediate-shim@1.0.1, onetime@1.0.0)
        ├── vinyl@0.4.6 (clone-stats@0.0.1, clone@0.2.0)
        ├── mkdirp@0.5.1 (minimist@0.0.8)
        ├── glob@4.5.3 (inherits@2.0.1, inflight@1.0.4, once@1.3.2, minimatch@2.0.10)
        ├── rimraf@2.4.2 (glob@5.0.14)
        ├── gulp-util@3.0.6 (array-differ@1.0.0, array-uniq@1.0.2, lodash._reevaluate@3.0.0, lodash._reinterpolate@3.0.0, lodash._reescape@3.0.0, beeper@1.1.0, object-assign@3.0.0, replace-ext@0.0.1, minimist@1.1.2, vinyl@0.5.0, chalk@1.1.0, lodash.template@3.6.2, through2@2.0.0, multipipe@0.1.2, dateformat@1.0.11)
        └── vinyl-fs@1.0.0 (merge-stream@0.1.8, graceful-fs@3.0.8, strip-bom@1.0.0, through2@0.6.5, duplexify@3.4.2, glob-stream@4.1.1, glob-watcher@0.0.8)

        gulp@3.9.0 node_modules\gulp
        ├── pretty-hrtime@1.0.0
        ├── interpret@0.6.5
        ├── deprecated@0.0.1
        ├── archy@1.0.0
        ├── minimist@1.1.2
        ├── tildify@1.1.0 (os-homedir@1.0.1)
        ├── v8flags@2.0.10 (user-home@1.1.1)
        ├── chalk@1.1.0 (escape-string-regexp@1.0.3, supports-color@2.0.0, ansi-styles@2.1.0, strip-ansi@3.0.0, has-ansi@2.0.0)
        ├── semver@4.3.6
        ├── orchestrator@0.3.7 (stream-consume@0.1.0, sequencify@0.0.7, end-of-stream@0.1.5)
        ├── gulp-util@3.0.6 (array-differ@1.0.0, array-uniq@1.0.2, lodash._reevaluate@3.0.0, lodash._reescape@3.0.0, beeper@1.1.0, object-assign@3.0.0, lodash._reinterpolate@3.0.0, replace-ext@0.0.1, vinyl@0.5.0, lodash.template@3.6.2, through2@2.0.0, multipipe@0.1.2, dateformat@1.0.11)
        ├── liftoff@2.1.0 (extend@2.0.1, rechoir@0.6.2, flagged-respawn@0.3.1, resolve@1.1.6, findup-sync@0.2.1)
        └── vinyl-fs@0.3.13 (graceful-fs@3.0.8, strip-bom@1.0.0, defaults@1.0.2, vinyl@0.4.6, mkdirp@0.5.1, through2@0.6.5, glob-stream@3.1.18, glob-watcher@0.0.6)

        gulp-uglify@1.2.0 node_modules\gulp-uglify
        ├── deap@1.0.0
        ├── through2@0.6.5 (xtend@4.0.0, readable-stream@1.0.33)
        ├── vinyl-sourcemaps-apply@0.1.4 (source-map@0.1.43)
        ├── gulp-util@3.0.6 (array-differ@1.0.0, array-uniq@1.0.2, beeper@1.1.0, lodash._reevaluate@3.0.0, lodash._reinterpolate@3.0.0, lodash._reescape@3.0.0, object-assign@3.0.0, replace-ext@0.0.1, minimist@1.1.2, vinyl@0.5.0, lodash.template@3.6.2, chalk@1.1.0, through2@2.0.0, multipipe@0.1.2, dateformat@1.0.11)
        └── uglify-js@2.4.19 (uglify-to-browserify@1.0.2, async@0.2.10, source-map@0.1.34, yargs@3.5.4)

        gulp-jshint@1.11.2 node_modules\gulp-jshint
        ├── through2@0.6.5 (xtend@4.0.0, readable-stream@1.0.33)
        ├── minimatch@2.0.10 (brace-expansion@1.1.0)
        ├── gulp-util@3.0.6 (array-differ@1.0.0, array-uniq@1.0.2, lodash._reevaluate@3.0.0, lodash._reinterpolate@3.0.0, beeper@1.1.0, lodash._reescape@3.0.0, object-assign@3.0.0, replace-ext@0.0.1, minimist@1.1.2, vinyl@0.5.0, chalk@1.1.0, lodash.template@3.6.2, through2@2.0.0, multipipe@0.1.2, dateformat@1.0.11)
        ├── rcloader@0.1.2 (rcfinder@0.1.8, lodash@2.4.2)
        ├── lodash@3.10.0
        └── jshint@2.8.0 (strip-json-comments@1.0.2, exit@0.1.2, console-browserify@1.1.0, shelljs@0.3.0, cli@0.6.6, htmlparser2@3.8.3, lodash@3.7.0)

    并且在工程目录下会出现 node_modules 文件夹，里面为刚刚安装的所有模块。

    至此环境搭建基本完成。

3. 关于Gulp

    我们使用 Gulp 构建项目，实现自动编译 Sass、压缩 CSS、校验 JavaScript、压缩 JavaScript。

    关于 Gulp 的入门学习，可参考 [nimojs](https://github.com/nimojs) 写的 [Gulp 入门指南 Gulp-book](https://github.com/nimojs/gulp-book)。

    我们配好环境后，在命令行中输入 `gulp` 如下：

        E:\GitWorkSpace\PicSite (master)
        λ gulp
        [17:09:01] Using gulpfile E:\GitWorkSpace\PicSite\gulpfile.js
        [17:09:01] Starting 'sass'...
        [17:09:01] Starting 'watchSassBuild'...
        [17:09:01] Finished 'watchSassBuild' after 25 ms
        [17:09:01] Starting 'minify-css'...
        [17:09:01] Starting 'js'...
        [17:09:01] Starting 'watchCssJavaScript'...
        [17:09:01] Finished 'watchCssJavaScript' after 8.35 ms
        [17:09:01] Finished 'minify-css' after 89 ms
        [17:09:01] Finished 'js' after 70 ms
        [17:09:01] Starting 'acj'...
        [17:09:01] Finished 'acj' after 11 μs
        [17:09:03] Finished 'sass' after 2 s
        [17:09:03] Starting 'asb'...
        [17:09:03] Finished 'asb' after 12 μs
        [17:09:03] Starting 'default'...
        [17:09:03] Finished 'default' after 10 μs

    出现上述状态，即 Gulp 环境、gulpfile.js 和 package.json 运行都正常。用 `Ctrl`+`C` 终止 Gulp 执行。

    **注意：**

    如果在执行 gulp 的时候，在 scss 中有中文的时候报错。类似如下：

        [22:42:23] error src/sass/lightbox.scss (Line 12: Invalid GBK character "\xE4")

    可以参考这里解决。[Ruby环境SCSS编译中文出现Syntax error: Invalid GBK character错误解决方法](http://www.webdevs.cn/article/59.html)

    找到Ruby的安装目录，里面也有sass模块，如这个路径：

        C:\Ruby21-x64\lib\ruby\gems\2.1.0\gems\sass-3.4.8\lib\sass

    在该路文件里面 engine.rb，添加一行代码：

        require ...
        require 'sass/supports'

        Encoding.default_external = Encoding.find('utf-8')
        
    放在所有的require XXXX 之后即可。

## 开发详细过程

### 界面开发

主要是 index.html, manage.html 的开发。只开发 HTML 和 CSS(Scss) 的开发。

### 图片存储

确定图片的存储形式和存储结构。

DAO.js 的开发。完成图片的增删查改开发操作。

### 业务逻辑

service.js 的开发。

### 界面上的控制

controller.js 的开发。