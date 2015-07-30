define(['jquery','tab','datepicker'],function($){

    $(function(){

        $('.datepicker').DatePicker();

        $('.tab_box01').tab({
            type: 'click',
            triggerClass:'zc_inrtabon',
            tab:'.zc_inrtab>a',
            panelClass:'panel'
        });

    });

});
