require.config({
    baseUrl: '../',
    paths: {
        'jquery': 'lib/jquery-1.8.3',
        'datepicker': 'lib/utils/jquery.datepicker',
        'tab': 'lib/utils/jquery.tab'
    }
});

require(['src/add_mod01','src/add_mod02','src/add_mod03','src/add_mod04','src/add_mod05']);
