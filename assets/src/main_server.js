require.config({
    baseUrl: '../',
    paths: {
        'jquery': 'lib/jquery-1.8.3',
        'datejs': 'lib/utils/date-zh-CN',
        'page': 'lib/utils/jquery.pagination'
    }
});

require(['src/server_mod01']);