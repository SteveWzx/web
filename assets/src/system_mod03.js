define(['jquery','tab','artdialog'],function($){

    $(function(){

        $('.tab_box02').tab({
            type: 'click',
            triggerClass:'zc_liston',
            tab:'.zc_list>li',
            panelClass:'pbox'
        });

        $('.tab_box03').tab({
            type: 'click',
            triggerClass:'zc_liston',
            tab:'.zc_list2>li',
            panelClass:'panel'
        });

        $('.tab_box04').tab({
            type: 'click',
            triggerClass:'zc_inrtabon',
            tab:'.zc_inrtab>a',
            panelClass:'panel'
        });

        $('.zc_btn03').on('click',function(){
            $('.ant-popover').dialog({
                close: '.ant-popover-close',
                cancel: '.ant-btn-main-blue',
                confirm: '.ant-btn-main-gray',
                animate: true
            });
        });
    });

});
