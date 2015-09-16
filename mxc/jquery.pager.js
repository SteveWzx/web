/**
 * weiweiqin
 * jquery分页插件
 * pagecount 总条数
 * pagenumber 当前页数
 * isShowGo 是否显示跳转标签
 */    
(function($) {     
        $.fn.pager = function(options) {  
            //var opts = $.extend({}, $.fn.pager.defaults, options);    
            return this.each(function() {         
                $(this).empty().append(renderpager(parseInt(options.pagenumber), parseInt(options.pagecount), options.buttonClickCallback,options.isShowGo));                         
            });  
        };     
          
        function renderpager(pagenumber, pagecount, buttonClickCallback,isShowGo) {   
            var $pager = $('<ul class="pagination"></ul>');         
            var startPoint = 1;   
            var endPoint = 5;  
            var thpoint="<li class=''><a href='#'>...</a></li>";  
            if (pagenumber > 2) {  
                startPoint = pagenumber - 2;  
                endPoint = pagenumber + 2;  
            }  
            if (endPoint > pagecount) {  
                startPoint = pagecount - 4;  
                endPoint = pagecount;  
                thpoint = "";  
            }  
            if (startPoint < 1) {  
                startPoint = 1;  
            }          
            for (var page = startPoint; page <= endPoint; page++) {  
                var currentButton = $('<li><a href="#">' + (page) + '</a></li>');  
                page == pagenumber ? currentButton.addClass('active') : currentButton.click(function() {  
                    buttonClickCallback($(this).children().html());  
                    $(this).addClass("active");
                });  
                currentButton.appendTo($pager);  
            }         
            $pager.append(thpoint).append(renderButton('下一页', pagenumber, pagecount, buttonClickCallback));  
            //是否显示跳转页面
            if(isShowGo){
	            var strgoto = $("<li class=''><input type='' value='"+pagenumber+"' maxlength='6' id='gotoval' style='width:30px;height:16px;'/></li>");
	            $pager.append(strgoto);  
	            $pager.append(changepage('go',pagecount,buttonClickCallback));  
            }
            return $pager;  
    }      
    function changepage(buttonLabel,pagecount,buttonClickCallback){  
        var $btngoto = $('<li><a href="#">'+ buttonLabel+'</a></li>');  
        $btngoto.click(function() {  
            var gotoval = $('#gotoval').val();  
            var patrn = /^[1-9]([0-9]{1,20})$/;
            if (!patrn.test(gotoval)){  
                alert("请输入非零的正整数！");  
                return false;  
            }  
            var intval = parseInt(gotoval);  
            if(intval > pagecount){  
                alert("您输入的页面超过总页数 "+pagecount);  
                return ;  
            }  
            buttonClickCallback(intval);  
        });  
        return $btngoto;  
    }  
      
    function renderButton(buttonLabel, pagenumber, pagecount, buttonClickCallback) {   
        var $Button = $('<li class="next"><a href="#">' + buttonLabel + '</a></li>');     
        var destPage = 1;         
        switch (buttonLabel) {  
            case "首页":  
                destPage = 1;  
                break;  
            case "上一页":     
                destPage = pagenumber - 1;  
                break;  
            case "下一页":  
                destPage = pagenumber + 1;            
            break;  
            case "末页":  
                destPage = pagecount;          
            break;       
        }              
        if (buttonLabel == "首页" || buttonLabel == "上一页") {       
            pagenumber <= 1 ? $Button.addClass('disabled') : $Button.click(function() { buttonClickCallback(destPage); });       
        }         
        else {       
            pagenumber >= pagecount ? $Button.addClass('disabled') : $Button.click(function() { buttonClickCallback(destPage); });   
        }       
        return $Button;    
     }      
      
     $.fn.pager.defaults = {     
         pagenumber: 1,       
         pagecount: 1};  
     })(jQuery);  