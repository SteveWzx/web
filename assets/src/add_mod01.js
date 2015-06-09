define(['jquery','tab'],function($){

    $(function(){
        $('.tab_box01').tab({
            type: 'click',
            triggerClass:'zc_inrtabon',
            tab:'.zc_inrtab>a',
            panelClass:'panel'
        });
    });


});
