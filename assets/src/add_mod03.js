define(['jquery','src/add_mod00'],function($,mod){

    $(function(){

        mod.getMod('.panel2');

        $('.n_sub').on('click',function(){
            var $num = $.trim($('.n_num').val()),
                $sn = $.trim($('.n_sn').val()),
                $name = $.trim($('.n_name').val()),
                $brand = $.trim($('.n_brand').val()),
                $model = $.trim($('.n_model').val()),
                $admin = $.trim($('.n_admin').val()),
                $user = $.trim($('.n_user').val()),
                $note = $.trim($('.n_note').val()),
                $mid = parseInt($('.panel2 .smid').val()),
                $aid = parseInt($('.panel2 .said').val()),
                $rid = parseInt($('.panel2 .srid').val()),
                $time1 = $.trim($('.panel2 .datepicker1').val()),
                $time2 = $.trim($('.panel2 .datepicker2').val()),
                $time3 = $.trim($('.panel2 .datepicker3').val()),
                $time4 = $.trim($('.panel2 .datepicker4').val()),
                $status = parseInt($('.panel2 input[name=status]:checked').val()),
                $ip0 = $('.panel2 input[name=ip0]'),
                $ip1 = $('.panel2 input[name=ip1]'),
                $ip2 = $('.panel2 input[name=ip2]'),
                arr0 = [],
                arr1 = [],
                arr2 = [];

            $ip0.each(function(index,ele){
                if($(ele).prop('checked')){
                    arr0.push(parseInt($(ele).val()));
                }
            });

            $ip1.each(function(index,ele){
                if($(ele).prop('checked')){
                    arr1.push(parseInt($(ele).val()));
                }
            });

            $ip2.each(function(index,ele){
                if($(ele).prop('checked')){
                    arr2.push(parseInt($(ele).val()));
                }
            });

            if($num === '' || $sn === '' || $name === '' || $brand === '' || $model === '' || arr0 === '' || arr1 === '' || arr2 === '' || $time1 === '' || $time2 === '' || $time3 === '' || $time4 === '' || $admin === '' || $user === '' || $note === '' || isNaN($mid) || isNaN($aid) || isNaN($rid) || isNaN($status)){
                alert('输入有误，输入字段不能为空！');
            }else{
                var json = {
                    'AssetNumber': $num,
                    'Sn': $sn,
                    'Name': $name,
                    'Brand': $brand,
                    'Model': $model,
                    'MroomId': $mid,
                    'MareaId': $aid,
                    'RackId': $rid,
                    'InnerIp': arr0.join(),
                    'OuterIp': arr1.join(),
                    'ManageIp': arr2.join(),
                    'BuyTime': $time1,
                    'CreateTime': $time2,
                    'UpdateTime': $time3,
                    'ExpirationDate': $time4,
                    'Admin': $admin,
                    'User': $user,
                    'Status': $status,
                    'Notes': $note
                };

                var str = JSON.stringify(json);

                $.post('/v1/net_device',str,function(data){
                    if(data.Code){
                        alert('添加成功!');
                    }
                });

            }

        });

    });


});
