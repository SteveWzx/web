require.config({
    baseUrl: '../',
    paths: {
        'jquery': 'lib/jquery-1.8.3',
        'datejs': 'lib/utils/date-zh-CN',
        'page': 'lib/utils/jquery.pagination',
        "artpl": "lib/utils/template"
    }
});

require(['src/device_mod01']);