define(['jquery'],function($){

    var Calendar = function(el,opts){
        this.Container = $(el)[0];
        this.options = $.extend({},Calendar.DEFAULTS,opts);

        this.init();
    };
    Calendar.DEFAULTS = {
        data:           {},
        Year:           new Date().getFullYear(),//显示年
        Month:          new Date().getMonth() + 1,//显示月
        onFinish:       function(){}//日历画完后触发
    };
    Calendar.prototype = {
        init: function() {
            this.Days = [];
            this.salonDays = [];

            this.data = this.options.data;
            this.Year = this.options.Year;
            this.Month = this.options.Month;
            this.onFinish = this.options.onFinish;

            if($.isEmptyObject(this.data)){
                this.GetSalonDays(this.Year, this.Month);
            }else{
                this.Draw();
            }

        },
        PreMonth: function() {
            //先取得上一个月的日期对象
            var d = new Date(this.Year, this.Month - 2, 1);
            //再设置属性
            this.Year = d.getFullYear();
            this.Month = d.getMonth() + 1;
            this.GetSalonDays(this.Year, this.Month);
        },
        NextMonth: function() {
            var d = new Date(this.Year, this.Month, 1);
            this.Year = d.getFullYear();
            this.Month = d.getMonth() + 1;
            this.GetSalonDays(this.Year, this.Month);
        },
        Draw: function() {
            //用来保存日期列表
            var arr = [];
            //用当月第一天在一周中的日期值作为当月离第一天的天数
            for(var i = 1, firstDay = new Date(this.Year, this.Month - 1, 1).getDay(); i <= firstDay; i++){ arr.push("&nbsp;"); }
            //用当月最后一天在一个月中的日期值作为当月的天数
            for(var i = 1, monthDay = new Date(this.Year, this.Month, 0).getDate(); i <= monthDay; i++){ arr.push(i); }

            var frag = document.createDocumentFragment();

            this.Days = [];

            while(arr.length > 0){
                //每个星期插入一个tr
                var row = document.createElement("tr");
                //每个星期有7天
                for(var i = 1; i <= 7; i++){
                    var cell = document.createElement("td");
                    cell.innerHTML = "&nbsp;";

                    if(arr.length > 0){
                        var d = arr.shift();
                        cell.innerHTML = d;
                        if(d > 0){
                            this.Days[d] = cell;
                            //判断是否今日
                            if(this.IsSame(new Date(this.Year, this.Month - 1, d), new Date(), !!0)){
                                cell.className = "onToday";
                            }
                            //判断是否选择日期
                            var dat = this.SelectDay();
                            for(var j=0; !!dat[j]; j++){
                                if(new Date(dat[j]) && this.IsSame(new Date(this.Year, this.Month - 1, d), new Date(dat[j]), !0)){
                                    cell.className = "onSelect";
                                }
                            }
                        }
                    }
                    row.appendChild(cell);
                }
                frag.appendChild(row);
            }
            //先清空内容再插入(ie的table不能用innerHTML)
            while(this.Container.hasChildNodes()){ this.Container.removeChild(this.Container.firstChild); }
            this.Container.appendChild(frag);

            this.event();
        },
        IsSame: function(d1, d2, bl) {
            return bl ? d1.getFullYear() == d2.getFullYear() && d1.getDate() == d2.getDate() :
            d1.getFullYear() == d2.getFullYear() && d1.getMonth() == d2.getMonth() && d1.getDate() == d2.getDate();
        },
        SelectDay: function(){
            var arr = [];
            for(var pro in this.data){
                arr.push(new Date().setDate(this.data[pro]))
            }
            return arr;
        },
        GetSalonDays: function(year, month) {
            var self = this;
            $.ajax({
                type: "GET",
                url: "../src/data.json",
                //data: {'year':year, 'month':month},
                dataType:"json",
                success: function(data){
                    self.data = $.parseJSON(data.salonDays);
                    self.Draw();
                }
            });
        },
        event: function(){
            var self = this;
            $(".hd_cal_year")[0].innerHTML = this.Year;
            $(".hd_cal_month")[0].innerHTML = this.Month;
            $(".hd_cal_pre")[0].onclick = function(){self.PreMonth();};
            $(".hd_cal_next")[0].onclick = function(){self.NextMonth();};
            $("#idCalendar")[0].onmouseover = function(e){
                var eve = e || window.event;
                var ebj = eve.srcElement || eve.target;
                var day = ebj.innerHTML;
                var num = ebj.cellIndex;
                var arr = ["日","一","二","三","四","五","六"];
                var wek = (num+"").replace(/\d/, function(o){return arr[o]});
                if(/\d+/.test(day) && self.data != null && self.data.contains(day)){
                    $(".hd_info").show();
                    $(".hd_info_til")[0].innerHTML = "【" +  self.Year + "年" + self.Month + "月" + day + "日，星期" + wek + "】" ;
                    self.getSalons(self.Year, self.Month, day);
                }
            };
            $(".hd_info").mouseout(function(){
                $(this).hide();
            });
            $(".hd_info").mouseover(function(){
                $(this).show();
            });
            $('.hd_info_close').on('click',function(){
                $(".hd_info").hide();
            });

        },
        getSalons: function(year, month, day){
            var timer = null;
            var ajaxGetSalons = function(year, month, day){
                $.get('../src/salon.json',
                    //{'year':year, 'month':month, 'day':day},
                    function(data){
                        var str = "";
                        $('.hd_info_list').empty();
                        if(data.length > 0) {
                            $.each(data, function(index, ele){
                                str += '<li><a href="'+ele.url+'" target="_blank">'+(index+1)+'、'+ele.title+'</a></li>';
                            });
                        }
                        $('.hd_info_list').html(str);
                });
            };
            if(timer != null){
                clearTimeout(timer);
            }
            timer = setTimeout(function(){
                ajaxGetSalons(year, month, day);
            },500);

        }
    };
    Array.prototype.contains = function(obj) {
        var i = this.length;
        while (i--) {
            if (this[i] == obj) {
                return true;
            }
        }
        return false;
    };
    //注册成jquery插件
    $.fn.extend({
        calendar:function(opts){
            return this.each(function(){
                new Calendar(this,opts);
            });
        }
    });
    return {
        calendar:Calendar
    }


});
