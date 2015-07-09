define(['jquery'],function($){

    $(function(){

        $('.a_sub').on('click',function(){
            var $num = $.trim($('.a_num').val()),
                $sn = $.trim($('.a_sn').val()),
                $name = $.trim($('.a_name').val()),
                $bh = $.trim($('.a_bh').val()),
                $note = $.trim($('.a_note').val()),
                $time1 = $.trim($('.datepicker7').val()),
                $time2 = $.trim($('.datepicker8').val());

            if($sn === '' || $name === '' || $bh === '' || $time1 === '' || $time2 === '' || $num === '' || $note === ''){
                alert('输入有误，输入字段不能为空！');
            }else{
                var json = {
                    'Sn': $sn,
                    'Name': $name,
                    'ParentAssetNumber': $bh,
                    'AssetNumber': $num,
                    'BuyTime': $time1,
                    'CreateTime': $time2,
                    'Notes': $note
                };

                var str = JSON.stringify(json);

                $.post('/v1/accessory',str,function(data){
                    if(data.Code){
                        alert('添加成功!');
                    }
                });

            }

        });

    });


});
