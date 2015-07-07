define(['jquery','page','datejs'],function($){

    $(function(){

        var pageCount = 0,
            pageIndex = 0,
            pageSize = 10,
            ind = 0;

        $.get('/v1/server?',function(data){
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
            $.get('/v1/server?&limit=10&offset='+(10*index)+'',function(data){
                var $pannes = $('.zc_tpannel'),
                    html = '',
                    log_length = data.Result ? data.Result.length : 0;
                pageCount = data.Sum;
                if(data  && log_length !== 0){
                    for(var i = 0; i < log_length; i++){
                        html += '<ul class="zc_fp">';
                        html += '<li class="zc_fpli zc_fpli01"><span class="zc_fp1 zc_fp01"><em>'+data.Result[i].AssetNumber+'</em></span><span>'+data.Result[i].Sn+'</span><span>'+data.Result[i].Name+'</span></li>';
                        html += '<li class="zc_fpli zc_fpli02"><span>'+data.Result[i].Brand+'</span><span>'+data.Result[i].Model+'</span></li>';
                        html += '<li class="zc_fpli zc_fpli03"><span>'+data.Result[i].CpuNum+'</span><span>'+data.Result[i].CoreNum+'</span><span>'+data.Result[i].Memory+'</span><span>'+data.Result[i].Disk+'</span><span>'+data.Result[i].Raid+'</span></li>';
                        html += '<li class="zc_fpli zc_fpli04"><span>'+data.Result[i].MroomId.Name+'</span><span>'+data.Result[i].MareaId.Name+'</span><span>'+data.Result[i].RackId.Name+'</span><span>内网ip</span><span>外网ip</span><span>管理网ip</span></li>';
                        html += '<li class="zc_fpli zc_fpli05"><span>'+Date.parse(data.Result[i].BuyTime).toString('M/d/yyyy HH:mm')+'</span><span>'+Date.parse(data.Result[i].CreateTime).toString('M/d/yyyy HH:mm')+'</span><span>'+Date.parse(data.Result[i].UpdateTime).toString('M/d/yyyy HH:mm')+'</span><span>'+Date.parse(data.Result[i].ExpirationDate).toString('M/d/yyyy HH:mm')+'</span></li>';
                        html += '<li class="zc_fpli zc_fpli06"><span>'+data.Result[i].DepartmentId.Name+'</span><span>'+data.Result[i].BusinessId.Name+'</span><span>'+data.Result[i].ServiceTypeId.ServiceName+'</span><span>'+data.Result[i].Admin+'</span><span>'+data.Result[i].User+'</span><span>'+data.Result[i].Status+'</span><span>'+data.Result[i].Notes+'</span></li>';
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
            $('.zc_fp>li:nth-child(6n+'+(ind+1)+')').show();
        });


    });

});
