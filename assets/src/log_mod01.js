define(['jquery','datejs','datepicker','page'],function($){

    $(function(){
        $('#datepicker1').DatePicker();
        $('#datepicker2').DatePicker();

        var pageCount = 0,
            nData1 = '',
            nData2 = '',
            pageIndex = 0,
            pageSize = 10,
            $btn_query = $('.zc_btnsee');

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
            $.get('/v1/log?query=start:'+$.trim(nData1)+',end:'+$.trim(nData2)+'&limit=10&offset='+(10*index)+'',function(data){
                var $log_list = $('.zc_loglist'),
                    $log_p = $('.zc_logp'),
                    html = '',
                    log_length = data.Result ? data.Result.length : 0;
                pageCount = data.Sum;
                if(data  && log_length !== 0){
                    $log_p.hide();
                    $log_list.show();
                    for(var i = 0; i < log_length; i++){
                        html += '<li><span class="zc_ddsp">'+Date.parse(data.Result[i].CreateTime).toString('M/d/yyyy HH:mm')+'</span><em>|</em><span class="zc_ddsp">'+data.Result[i].User+'</span><em>|</em><span class="zc_ddsp">'+data.Result[i].Action+'</span><em>|</em><span class="zc_ddsp">'+data.Result[i].Detail+'</span></li>';
                    }
                    $log_list.html(html);
                }else{
                    $log_p.show();
                }
            });
        };

        var PageCallback = function (index, jq) {
            getPage(index);
            return false;
        };

        $btn_query.on('click',function(){
            var $oData1 = $('#datepicker1'),
                $oData2 = $('#datepicker2');
            nData1 = $oData1.val();
            nData2 = $oData2.val();
            if($.trim(nData1) === '' || $.trim(nData2) === ''){
                alert('起始时间或终止时间不能为空！');
            }else if(Date.parse(nData1).getTime() >= Date.parse(nData2).getTime()){
                alert('起始时间不能大于终止时间！');
            }else{
                getPage(pageIndex);
                var timer = setTimeout(function(){
                    if(pageCount !== 0){
                        initPagination();
                        clearTimeout(timer);
                        return;
                    }
                    setTimeout(arguments.callee, 100);
                }, 100);
            }
            return false;
        });

    });

});
