define(['jquery','page','datejs'],function($){

    $(function(){

        var pageCount = 0,
            pageIndex = 0,
            pageSize = 10,
            ind = 0;

        $.get('/v1/accessory?',function(data){
            var $sum = $('.zc_snavon em'),
                log_length = data.Result ? data.Result.length : 0,
                pageCount = data.Sum;
            $sum.empty();
            if(data  && log_length !== 0){
                $sum.html(pageCount);
            }
        });

        var initPagination = function() {
            $("#Pagination").pagination(pageCount, {
                callback: PageCallback,
                prev_text: '上一页',
                next_text: '下一页',
                items_per_page: pageSize,
                current_page: pageIndex,
                num_display_entries: 3,
                num_edge_entries: 1
            });
        };

        var getPage = function(index) {
            $.get('/v1/accessory?&limit=10&offset='+(10*index)+'',function(data){
                var $pannes = $('.zc_tpannel'),
                    html = '',
                    log_length = data.Result ? data.Result.length : 0;
                pageCount = data.Sum;
                if(data  && log_length !== 0){
                    for(var i = 0; i < log_length; i++){
                        html += '<ul class="zc_fp">';
                        html += '<li class="zc_fpli zc_fpli01"><span class="zc_fpsp">'+data.Result[i].AssetNumber+'</span><span  class="zc_fpsp">'+data.Result[i].Sn+'</span><span  class="zc_fpsp">'+data.Result[i].Name+'</span></li>';
                        html += '<li class="zc_fpli zc_fpli02"><span class="zc_fpsp">'+Date.parse(data.Result[i].CreateTime).toString('M/d/yyyy HH:mm')+'</span><span class="zc_fpsp">'+Date.parse(data.Result[i].UpdateTime).toString('M/d/yyyy HH:mm')+'</span></li>';
                        html += '<li class="zc_fpli zc_fpli02"><span class="zc_fpsp">'+data.Result[i].ParentAssetNumber+'</span><span class="zc_fpsp">'+data.Result[i].Notes+'</span></li>';
                        html += '</ul>';
                    }
                    $pannes.html(html);
                }
            });
        };

        var PageCallback = function (index, jq) {
            getPage(index);
            $tnav.eq(0).addClass('zc_inrtabon').siblings().removeClass('zc_inrtabon');
            $tdiv.eq(0).show().siblings().hide();
            return false;
        };

        getPage(pageIndex);
        var timer = setTimeout(function(){
            if(pageCount !== 0){
                initPagination();
                clearTimeout(timer);
                return;
            }
            setTimeout(arguments.callee, 100);
        }, 100);

        var $tnav = $('.zc_inrtabs>a'),
            $tdiv = $('.zc_type>p');

        $tnav.on('click',function(){
            ind = $(this).index();
            $(this).addClass('zc_inrtabon').siblings().removeClass('zc_inrtabon');
            $tdiv.eq(ind).show().siblings().hide();
            $('.zc_fp>li').hide();
            $('.zc_fp>li:nth-child(3n+'+(ind+1)+')').show();
        });

        var $loading = $('<div class="loading"></div>').insertBefore('.zc_tpannel');

        $(document).ajaxStart(function() {
            $loading.show();
            $('.zc_tpannel').empty();
        }).ajaxStop(function() {
            $loading.hide();
        });

    });

});
