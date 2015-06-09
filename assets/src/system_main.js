require.config({
    baseUrl: '../',
    paths: {
        'jquery': 'lib/jquery-1.8.3',
        'tab': 'lib/utils/jquery.tab',
        'artdialog': 'lib/utils/jquery.artdialog',
        'drag': 'lib/utils/jquery.drag'
    }
});

require(['src/system_mod01']);
require(['src/system_mod02']);
require(['src/system_mod03']);