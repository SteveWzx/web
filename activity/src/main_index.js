require.config({
    baseUrl: '../',
    paths: {
        'jquery': 'lib/jquery-1.8.3',
        'tab': 'lib/utils/jquery.tab'
    }
});

require(['src/index_mod01']);
require(['jquery','src/index_calendar'],function($,calendar){
    $('#idCalendar').calendar();
});