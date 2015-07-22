define(['jquery'],function($){

    $(function(){

        $('.h_sub').on('click',function(){
            var $num = $.trim($('.h_num').val()),
                $sn = $.trim($('.h_sn').val()),
                $name = $.trim($('.h_name').val()),
                $type = $.trim($('.h_type').val()),
                $sum = $.trim($('.h_sum').val()),
                $color = $.trim($('.h_color').val()),
                $length = $.trim($('.h_length').val()),
                $have = $.trim($('.h_have').val()),
                $note = $.trim($('.h_note').val()),
                $time1 = $.trim($('.datepicker5').val()),
                $time2 = $.trim($('.datepicker6').val());

            if($sn === '' || $name === '' || $type === '' || $color === '' || $length === '' || $have === '' || $note === '' || $time1 === '' || $time2 === '' || $num === '' || $sum === ''){
                alert('输入有误，输入字段不能为空！');
            }else{
                var json = {
                    'Sn': $sn,
                    'Name': $name,
                    'Type': $type,
                    'Sum': parseInt($num),
                    'StoreSum': parseInt($sum),
                    'Color': $color,
                    'Length': $length,
                    'Reserved': $have,
                    'BuyTime': $time1,
                    'CreateTime': $time2,
                    'Notes': $note
                };

                var str = JSON.stringify(json);

                $.post('/v1/supplies',str,function(data){
                    if(data.Code){
                        alert('添加成功!');
                    }
                });

            }

        });

    });


});
