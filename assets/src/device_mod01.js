define(['jquery','tab'],function($){

    $(function(){
        var selects = $('.ant-search-bar-dropcon'),
            span = selects.find('.ant-search-bar-dropin'),
            sicon = selects.find('.ant-search-bar-dropicon'),
            sItem = selects.find('.ant-search-bar-droplist');

        var cfn = function() {
            sItem.show().find('li').click(function(){
                span.html($(this).text());
                sItem.hide();
            });
        };

        span.click(cfn);
        sicon.click(cfn);

        $(document).click(function(e){
            var target = $(e.target);
            if($.isEmptyObject(target.closest('.ant-search-bar-dropcon')[0])){
                sItem.hide();
            }
        });

        $('.tab_box01').tab({
            type: 'click',
            triggerClass:'zc_inrtabon',
            tab:'.zc_inrtabs>a',
            panelClass:'panel'
        });
    });

});
