define(['jquery','artpl','src/idc_temp','artdialog','ajaxover'],function($, template, temp){

    $(function(){

        var mid = 0,
            aid = 0,
            pid = 0,
            $btnm = $('.zc_btnm'),
            $btnm_sub = $('.sub_mroom');

        var mroomGet = function(mid) {
            $.get('/v1/mroom?query=Id:'+mid,function(data){
                var log_length = data.Result ? data.Result.length : 0;
                var $mroom = $('.zc_intop');
                $mroom.empty();
                if(data  && log_length !== 0){
                    var render = template.compile(temp.source2),
                        div = render(data);
                    $mroom.html(div);
                }
            });
        };

        var tilGet = function() {
            var $div = $('.zc_bom_til');
            $div.empty();
            var render = template.compile(temp.source3),
                div = render();
            $div.html(div);
        };

        var rackGet = function(aid) {
            $.get('/v1/rack?query=MroomAreaId:'+aid,function(data){
                var log_length = data.Result ? data.Result.length : 0;
                var $rack = $('.zc_bom_r');
                $rack.empty();
                if(data  && log_length !== 0){
                    var render = template.compile(temp.source5),
                        div = render(data);
                    $rack.html(div);
                }
            });
        };

        var areaGet = function(mid) {
            $.get('/v1/marea?query=MroomId:'+mid,function(data){
                var log_length = data.Result ? data.Result.length : 0;
                var $ul = $('.zc_list2');
                $ul.empty();
                if(data  && log_length !== 0){
                    var render2 = template.compile(temp.source4),
                        ul2 = render2(data);
                    $ul.append(ul2);

                    var $li2 = $('.zc_list2 li');

                    $li2.each(function(i, ele){
                        if($(ele).hasClass('zc_liston')){
                            aid = parseInt($(ele).data('id'));
                        }
                    });
                }
                if(aid){
                    rackGet(aid);
                }
            });
        };

        var ipGet = function(mid, pid) {
            $.get('/v1/ip?query=MroomId:'+mid+',Type:'+pid,function(data){
                var log_length = data.Result ? data.Result.length : 0;
                var $ul = $('.zc_lp');
                $ul.empty();
                if(data  && log_length !== 0){
                    var render = template.compile(temp.source7),
                        li = render(data);
                    $ul.append(li);
                }
            });
        };

        var tpGet = function(mid) {
            var $div = $('.zc_til04');
            $div.empty();
            var render = template.compile(temp.source6),
                div = render();
            $div.html(div);

            var $alist = $('.zc_inrtab a');

            $alist.each(function(i, ele){
                if($(ele).hasClass('zc_inrtabon')){
                    pid = parseInt($(ele).data('type'));
                }
            });
            ipGet(mid, pid);
        };

        $.get('/v1/mroom',function(data){
            var log_length = data.Result ? data.Result.length : 0;
            if(data  && log_length !== 0){
                var render = template.compile(temp.source1),
                    ul = render(data);
                var $div = $('.zc_outleft');
                $div.append(ul);

                var $li = $('.zc_list li');

                $li.each(function(i, ele){
                    if($(ele).hasClass('zc_liston')){
                        mid = parseInt($(ele).data('id'));
                    }
                });
            }
            if(mid){
                mroomGet(mid);
                tilGet();
                areaGet(mid);
                tpGet(mid);
            }
        });

        $(document).on('click','.zc_list li',function(){
            $(this).addClass('zc_liston').siblings().removeClass('zc_liston');
            mid = parseInt($(this).data('id'));
            aid = 0;
            var $rack = $('.zc_bom_r');
            $rack.empty();

            if(mid){
                mroomGet(mid);
                tilGet();
                areaGet(mid);
                tpGet(mid);
            }
        });

        $(document).on('click','.zc_list2 li',function(){
            $(this).addClass('zc_liston').siblings().removeClass('zc_liston');
            aid = parseInt($(this).data('id'));

            if(aid){
                rackGet(aid);
            }
        });

        $(document).on('click','.zc_inrtab a',function(){
            $(this).addClass('zc_inrtabon').siblings().removeClass('zc_inrtabon');
            pid = parseInt($(this).data('type'));
            ipGet(mid, pid);
        });

        $btnm.on('click',function(){
            $('.pop_mroom').dialog({
                close: '.ant-popover-close',
                cancel: '.ant-btn-main-blue',
                confirm: '.ant-btn-main-gray',
                animate: true
            });
        });

        $btnm_sub.on('click',function(){
            var $mname = $.trim($('#mname').val()),
                $maddr = $.trim($('#maddr').val()),
                $mperson = $.trim($('#mperson').val()),
                $mphone = $.trim($('#mphone').val()),
                $misp = $.trim($('#misp').val());
            if($mname !== '' && $maddr !== '' && $mperson !== '' && $mphone !== '' && $misp !== ''){
                var json = {
                    'Name': $mname,
                    'Addr': $maddr,
                    'Contacts': $mperson,
                    'Mobile': $mphone,
                    'Isp': $misp
                };
                var str = JSON.stringify(json);
                $.post('/v1/mroom',str,function(data){
                    if(data.Code){
                        alert('添加成功!');
                    }
                });
            }else{
                alert('输入字段不能为空！');
            }
        });

        $(document).on('click','.btn_edit',function(){
            var $mname = $.trim($('#beiz').val()),
                $maddr = $.trim($('#dz').val()),
                $mperson = $.trim($('#lxr').val()),
                $mphone = $.trim($('#phone').val()),
                $misp = $.trim($('#tgs').val());
            if($mname !== '' && $maddr !== '' && $mperson !== '' && $mphone !== '' && $misp !== ''){
                var json = {
                    'Name': $mname,
                    'Addr': $maddr,
                    'Contacts': $mperson,
                    'Mobile': $mphone,
                    'Isp': $misp
                };
                var str = JSON.stringify(json);
                $.put('/v1/mroom/'+mid,str,function(data){
                    if(data.Code){
                        alert('修改成功!');
                    }else{
                        alert(data.Error);
                    }
                });
            }else{
                alert('输入字段不能为空！');
            }
        });

        $(document).on('click','.btn_area',function(){
            $('.pop_marea').dialog({
                close: '.ant-popover-close',
                cancel: '.ant-btn-main-blue',
                confirm: '.ant-btn-main-gray',
                animate: true
            });
        });

        $('.sub_marea').on('click',function(){
            var $name = $.trim($('.marea_name').val());
            if($name === ''){
                alert('区域名称不能为空！');
            }else{
                var json = {
                    'Name': $name,
                    'MroomId': mid
                };
                var str = JSON.stringify(json);
                $.post('/v1/marea',str,function(data){
                    if(data.Code){
                        alert('添加成功!');
                    }
                });
            }
        });

        $(document).on('click','.btn_rack',function(){
            $('.pop_rack').dialog({
                close: '.ant-popover-close',
                cancel: '.ant-btn-main-blue',
                confirm: '.ant-btn-main-gray',
                animate: true
            });
        });

        $('.sub_rack').on('click',function(){
            var $name = $.trim($('.rack_name').val()),
                $uv = $.trim($('.rack_uv').val()),
                $num = $.trim($('.rack_num').val());
            if($name === '' || $uv === '' || $num === ''){
                alert('输入字段不能为空！');
            }else{
                var json = {
                    'Name': $name,
                    'Unit': parseInt($uv),
                    'ComputeNum': parseInt($num),
                    'MroomAreaId': aid
                };
                var str = JSON.stringify(json);
                $.post('/v1/rack',str,function(data){
                    if(data.Code){
                        alert('添加成功!');
                    }
                });
            }
        });

        $(document).on('click','.btn_ip',function(){
            $('.pop_ip').dialog({
                close: '.ant-popover-close',
                cancel: '.ant-btn-main-blue',
                confirm: '.ant-btn-main-gray',
                animate: true
            });
        });

        $('.sub_ip').on('click',function(){
            var $ip = $.trim($('.ip_addr').val()),
                $ym = $.trim($('.ip_ym').val()),
                $status = $.trim($('.ip_status').val());
            if($ip === '' || $ym === '' || $status === ''){
                alert('输入字段不能为空！');
            }else{
                var json = {
                    'IpAddr': $ip,
                    'Mask': $ym,
                    'Status': parseInt($status),
                    'MroomId': mid,
                    'Type': pid
                };
                var str = JSON.stringify(json);
                $.post('/v1/ip',str,function(data){
                    if(data.Code){
                        alert('添加成功!');
                    }
                });
            }
        });

    });

});
