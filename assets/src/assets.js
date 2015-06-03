require.config({
    baseUrl: '../',
    paths: {
        'jquery': 'lib/jquery-1.8.3'
    }

});

require(['jquery'],function($){
    $(function(){
        console.log($.fn.jquery)
    });
});

