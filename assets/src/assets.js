require.config({
    baseUrl: '../',
    paths: {
        'jquery': 'lib/jquery-1.8.3',
        'tab': 'lib/utils/jquery.tab'
    }

});

require(['jquery'],function($){
    $(function(){
        console.log($.fn.jquery)
    });
});

