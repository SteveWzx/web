define(['jquery','tab','artdialog'],function($){

    $('.zc_btn01').on('click',function(){
        $('.ant-popover').dialog({
            close: '.ant-popover-close',
            cancel: '.ant-btn-main-blue',
            confirm: '.ant-btn-main-gray',
            animate: true
        });
    });

});
