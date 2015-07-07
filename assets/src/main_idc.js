require.config({
    baseUrl: '../',
    paths: {
        'jquery': 'lib/jquery-1.8.3',
        'artdialog': 'lib/utils/jquery.artdialog',
        'drag': 'lib/utils/jquery.drag',
        "artpl": "lib/utils/template",
        "ajaxover": "lib/utils/jquery.ajaxOverride"
    }
});

require(['src/idc_mod01']);