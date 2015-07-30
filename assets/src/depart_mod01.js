define(['jquery','artpl','src/depart_temp','artdialog'],function($, template, temp){

    $(function(){

        var sid = 0;

        var departGet = function(sid) {
            $.get('/v1/business?query=DepartId:'+sid,function(data){
                var render = template.compile(temp.source2),
                    li = render(data);
                var $ul = $('.zc_dul');
                $ul.append(li);
            });
        };

        $.get('/v1/department',function(data){
            var render = template.compile(temp.source1),
                ul = render(data);
            var $div = $('.zc_outleft');
            $div.html(ul);

            var $li = $('.zc_list li');

            $li.each(function(i, ele){
                if($(ele).hasClass('zc_liston')){
                    sid = parseInt($(ele).data('id'));
                }
            });

            departGet(sid);

        });

        $('.zc_btn02').on('click',function(){
            $('.ant-popover').dialog({
                close: '.ant-popover-close',
                cancel: '.ant-btn-main-blue',
                confirm: '.ant-btn-main-gray',
                animate: true
            });
        });

        $(document).on('click','.zc_list li',function(){
            var $ul = $('.zc_dul');
            $(this).addClass('zc_liston').siblings().removeClass('zc_liston');
            sid = parseInt($(this).data('id'));
            $ul.empty();
            departGet(sid);
        });

        var $btn_depart = $('.btn_depart');
        $btn_depart.on('click',function(){
            var $name = $.trim($('.depart_name').val());
            if($name === ''){
                alert('业务名称不能为空！');
            } else if(sid === 0){
                alert('当前部门为空！');
            } else{
                var json = {
                    'Name': $name,
                    'DepartId': sid
                };
                var str = JSON.stringify(json);
                $.post('/v1/business',str,function(data){
                    if(data.Code){
                        alert('添加成功!');
                    }
                });
            }
        });

    });

});
