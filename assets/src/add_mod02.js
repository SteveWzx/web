define(['jquery','src/add_mod00'],function($,mod){

    $(function(){

        var did = 0,
            bid = 0,
            sid = 0;

        mod.getMod('.panel1');

        $.get('/v1/department',function(data){
            var log_length = data.Result ? data.Result.length : 0;
            if(data  && log_length !== 0){
                var selects = $('.s_depart'),
                    curPanel = selects.find('.ant-selected-text'),
                    departval = selects.find('input'),
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
                        did = parseInt($(this).data('id'));
                        em.html($(this).text());
                        departval.val(did);
                        sItem.hide();
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

        $.get('/v1/business',function(data){
            var log_length = data.Result ? data.Result.length : 0;
            if(data  && log_length !== 0){
                var selects = $('.s_business'),
                    curPanel = selects.find('.ant-selected-text'),
                    businesstval = selects.find('input'),
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
                        bid = parseInt($(this).data('id'));
                        em.html($(this).text());
                        businesstval.val(bid);
                        sItem.hide();
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

        $.get('/v1/service_type',function(data){
            var log_length = data.Result ? data.Result.length : 0;
            if(data  && log_length !== 0){
                var selects = $('.s_service'),
                    curPanel = selects.find('.ant-selected-text'),
                    serviceval = selects.find('input'),
                    sItem = selects.find('.ant-select-item');

                curPanel.click(function(){
                    sItem.empty();
                    var em = $(this).find('em'),
                        html = '';
                    html += '<ul class="ant-select-list">';
                    for(var i = 0; i < log_length; i++){
                        html += '<li data-id="'+data.Result[i].Id+'"><a href="javascript:;">'+data.Result[i].ServiceName+'</a></li>';
                    }
                    html += '</ul>';
                    sItem.html(html);
                    sItem.show().find('li').click(function(){
                        sid = parseInt($(this).data('id'));
                        em.html($(this).text());
                        serviceval.val(sid);
                        sItem.hide();
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

        $('.s_sub').on('click',function(){
            var $num = $.trim($('.s_num').val()),
                $sn = $.trim($('.s_sn').val()),
                $name = $.trim($('.s_name').val()),
                $brand = $.trim($('.s_brand').val()),
                $model = $.trim($('.s_model').val()),
                $cpu = $.trim($('.s_cpu').val()),
                $core = $.trim($('.s_core').val()),
                $memory = $.trim($('.s_memory').val()),
                $disk = $.trim($('.s_disk').val()),
                $raid = $.trim($('.s_raid').val()),
                $admin = $.trim($('.s_admin').val()),
                $user = $.trim($('.s_user').val()),
                $note = $.trim($('.s_note').val()),
                $mid = parseInt($('.panel1 .smid').val()),
                $aid = parseInt($('.panel1 .said').val()),
                $rid = parseInt($('.panel1 .srid').val()),
                $did = parseInt($('.sdid').val()),
                $bid = parseInt($('.sbid').val()),
                $sid = parseInt($('.ssid').val()),
                $time1 = $.trim($('.panel1 .datepicker1').val()),
                $time2 = $.trim($('.panel1 .datepicker2').val()),
                $time3 = $.trim($('.panel1 .datepicker3').val()),
                $time4 = $.trim($('.panel1 .datepicker4').val()),
                $status = parseInt($('.panel1 input[name=status]:checked').val()),
                $ip0 = $('.panel1 input[name=ip0]'),
                $ip1 = $('.panel1 input[name=ip1]'),
                $ip2 = $('.panel1 input[name=ip2]'),
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

            if($num === '' || $sn === '' || $name === '' || $brand === '' || $model === '' || $cpu === '' || $core === '' || $memory === '' || $disk === '' || $raid === '' || arr0 === '' || arr1 === '' || arr2 === '' || $time1 === '' || $time2 === '' || $time3 === '' || $time4 === '' || $admin === '' || $user === '' || $note === '' || isNaN($mid) || isNaN($aid) || isNaN($rid) || isNaN($did) || isNaN($bid) || isNaN($sid) || isNaN($status)){
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
                    'CpuNum': $cpu,
                    'CoreNum': $core,
                    'Memory': $memory,
                    'Disk': $disk,
                    'Raid': $raid,
                    'InnerIp': arr0.join(),
                    'OuterIp': arr1.join(),
                    'ManageIp': arr2.join(),
                    'DepartmentId': $did,
                    'BusinessId': $bid,
                    'ServiceTypeId': $sid,
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

                $.post('/v1/server',str,function(data){
                    if(data.Code){
                        alert('添加成功!');
                    }
                });

            }

        });

    });


});
