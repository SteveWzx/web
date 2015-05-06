require.config({
    baseUrl: "../",
    paths: {
        "jquery": ["http://libs.baidu.com/jquery/1.8.3/jquery.min","lib/jquery-1.8.3"]
    }
});
require(['jquery','src/test4','src/test1'],function($,test4,test1){

    console.log('main-before:a'+test1.a);
    test1.a = 30;
    console.log('main-after:a'+test1.a);

});

