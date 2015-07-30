define(['jquery','artpl','src/service_temp','artdialog'],function($, template, temp){

    $(function(){

        $('.zc_btn01').on('click',function(){
            $('.ant-popover').dialog({
                close: '.ant-popover-close',
                cancel: '.ant-btn-main-blue',
                confirm: '.ant-btn-main-gray',
                animate: true
            });
        });

        var $btn_service = $('.btn_service');
        $btn_service.on('click',function(){
            var $name = $.trim($('.service_name').val()),
                $short = $.trim($('.service_short').val());
            if($name !== '' && $short !== ''){
                var json = {
                    'ServiceName': $name,
                    'Short': $short
                };
                var str = JSON.stringify(json);
                $.post('/v1/service_type',str,function(data){
                    if(data.Code){
                        alert('添加成功!');
                    }
                });
            }else{
                alert('输入字段不能为空！');
            }
        });

        $.get('/v1/service_type',function(data){
            var render = template.compile(temp.source1),
                li = render(data);
            var $ul = $('.zc_sul');
            $ul.append(li);
        });
    });

});
