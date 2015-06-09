define(['jquery'],function($){

    $(function(){
        var selects = $('.ant-select'),
            curPanel = selects.find('.ant-selected-text'),
            sItem = selects.find('.ant-select-item');

        curPanel.click(function(){
            var em = $(this).find('em');
            sItem.show().find('li').click(function(){
                em.html($(this).text());
                sItem.hide();
            });
        });
        $(document).click(function(e){
            var target = $(e.target);
            if($.isEmptyObject(target.closest('.ant-selected-text')[0])){
                sItem.hide();
            }
        });

        var $dl = $('.zc_aoutl').find('dl');
        $dl.on('click','dt',function(){
            var $pdl = $(this).parent(),
                $pdd = $(this).find('dd');
            if($pdl.hasClass('zc_dldown')){
                $pdl.removeClass('zc_dldown').addClass('zc_dlup');
                $pdd.hide();
            }else if($pdl.hasClass('zc_dlup')){
                $pdl.removeClass('zc_dlup').addClass('zc_dldown');
                $pdd.show();
            }
        });

    });

});
