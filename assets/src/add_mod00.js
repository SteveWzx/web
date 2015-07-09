define(['jquery'],function($){

    var mid = 0,
        aid = 0,
        rid = 0;

    var fnGet = function(panel) {

        var ipGet = function(mid,num) {
            $.get('/v1/ip?query=MroomId:'+mid+',Type:'+num,function(data){
                var log_length = data.Result ? data.Result.length : 0;
                var $ul = $(panel+' .zc_ulip'+num),
                    html = '';
                $ul.empty();
                if(data  && log_length !== 0){
                    for(var i = 0; i<log_length; i++){
                        html += '<li class="zc_liip"><input type="checkbox" name="ip'+num+'" value="'+data.Result[i].Id+'"> <span>'+data.Result[i].IpAddr+'</span></li>';
                    }
                    $ul.html(html);
                }
            });
        };

        var rackGet = function(aid) {
            $.get('/v1/rack?query=MroomAreaId:'+aid,function(data){
                var log_length = data.Result ? data.Result.length : 0;
                if(data  && log_length !== 0){
                    var selects = $(panel+' .s_rack'),
                        curPanel = selects.find('.ant-selected-text'),
                        rackval = selects.find('input'),
                        sItem = selects.find('.ant-select-item');

                    curPanel.click(function(){
                        sItem.empty();
                        var em = $(this).find('em'),
                            html = '';
                        html += '<ul class="ant-select-list">';
                        for(var i = 0; i < log_length; i++){
                            html += '<li data-id="'+data.Result[i].Id+'"><a href="javascript:;">'+data.Result[i].Name+'</a></li>';
                        }
                        html += '</ul>';
                        sItem.html(html);
                        sItem.show().find('li').click(function(){
                            rid = parseInt($(this).data('id'));
                            em.html($(this).text());
                            rackval.val(rid);
                            sItem.hide();
                        });
                    });

                    $(document).click(function(e){
                        var target = $(e.target);
                        if($.isEmptyObject(target.closest('.ant-selected-text')[0])){
                            sItem.hide();
                        }
                    });
                }else{
                    var selects = $(panel+' .s_rack'),
                        curPanel = selects.find('.ant-selected-text'),
                        rackval = selects.find('input'),
                        rem = selects.find('.ant-selected-text').find('em'),
                        sItem = selects.find('.ant-select-item');

                    rem.html('机柜名称');
                    rackval.val('');
                    rid = 0;
                    curPanel.click(function() {
                        sItem.empty();
                    });

                }
            });
        };

        var areaGet = function(mid) {
            $.get('/v1/marea?query=MroomId:'+mid,function(data){
                var log_length = data.Result ? data.Result.length : 0;
                if(data  && log_length !== 0){
                    var selects = $(panel+' .s_area'),
                        curPanel = selects.find('.ant-selected-text'),
                        areaval = selects.find('input'),
                        sItem = selects.find('.ant-select-item');

                    curPanel.click(function(){
                        sItem.empty();

                        var em = $(this).find('em'),
                            html = '';
                        html += '<ul class="ant-select-list">';
                        for(var i = 0; i < log_length; i++){
                            html += '<li data-id="'+data.Result[i].Id+'"><a href="javascript:;">'+data.Result[i].Name+'</a></li>';
                        }
                        html += '</ul>';
                        sItem.html(html);
                        sItem.show().find('li').click(function(){
                            aid = parseInt($(this).data('id'));
                            em.html($(this).text());
                            areaval.val(aid);
                            sItem.hide();
                            rackGet(aid);
                        });
                    });

                    $(document).click(function(e){
                        var target = $(e.target);
                        if($.isEmptyObject(target.closest('.ant-selected-text')[0])){
                            sItem.hide();
                        }
                    });
                }else{
                    var selects = $(panel+' .s_area'),
                        curPanel = selects.find('.ant-selected-text'),
                        areaval = selects.find('input'),
                        rem = selects.find('.ant-selected-text').find('em'),
                        sItem = selects.find('.ant-select-item');

                    rem.html('区域名称');
                    areaval.val('');
                    aid = 0;
                    curPanel.click(function() {
                        sItem.empty();
                    });

                    var selects2 = $(panel+' .s_rack'),
                        curPanel2 = selects2.find('.ant-selected-text'),
                        rackval = selects2.find('input'),
                        rem2 = selects2.find('.ant-selected-text').find('em'),
                        sItem2 = selects2.find('.ant-select-item');

                    rem2.html('机柜名称');
                    rackval.val('');
                    rid = 0;
                    curPanel2.click(function() {
                        sItem2.empty();
                    });

                }
            });
        };

        $.get('/v1/mroom',function(data){
            var log_length = data.Result ? data.Result.length : 0;
            if(data  && log_length !== 0){
                var selects = $(panel+' .s_room'),
                    curPanel = selects.find('.ant-selected-text'),
                    roomval = selects.find('input'),
                    sItem = selects.find('.ant-select-item');

                curPanel.click(function(){
                    sItem.empty();
                    var em = $(this).find('em'),
                        html = '';
                    html += '<ul class="ant-select-list">';
                    for(var i = 0; i < log_length; i++){
                        html += '<li data-id="'+data.Result[i].Id+'"><a href="javascript:;">'+data.Result[i].Name+'</a></li>';
                    }
                    html += '</ul>';
                    sItem.html(html);
                    sItem.show().find('li').click(function(){
                        mid = parseInt($(this).data('id'));
                        em.html($(this).text());
                        roomval.val(mid);
                        sItem.hide();

                        areaGet(mid);
                        ipGet(mid,0);
                        ipGet(mid,1);
                        ipGet(mid,2);
                    });
                });

                $(document).click(function(e){
                    var target = $(e.target);
                    if($.isEmptyObject(target.closest('.ant-selected-text')[0])){
                        sItem.hide();
                    }
                });
            }
        });

    };

    return {
        getMod : fnGet
    }

});
