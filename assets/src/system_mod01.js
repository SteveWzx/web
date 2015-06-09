define(['jquery','tab','artdialog'],function($){

    $(function(){
        $('.tab_box01').tab({
            type: 'click',
            triggerClass:'zc_liston',
            tab:'.zc_list>li',
            panelClass:'panel'
        });

        $('.zc_btn02').on('click',function(){
            $('.ant-popover').dialog({
                close: '.ant-popover-close',
                cancel: '.ant-btn-main-blue',
                confirm: '.ant-btn-main-gray',
                animate: true
            });
        });
    });

});
