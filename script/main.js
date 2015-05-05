require.config({
    baseUrl: './',
    paths: {
        'jquery': 'jquery-1.8.3'
    }
});

require(['jquery'],function($){
    console.log("我是requirejs外部引用的脚本ready外运行");

});

require(['jquery'],function($){
    $(function(){
        console.log("我是requirejs外部引用的脚本ready内运行");
    });
});


