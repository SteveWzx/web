// JavaScript Document
var ecfg={ img:'http://imgs.jzb.com/',url:'http://my.jzb.com/',reguid:'0',homeurl:'http://home.jzb.com/',regurl:'http://reg.jzb.com/',vipurl:'http://jzb.com/vip/',bbsurl:'http://jzb.com/bbs/',indexurl:'http://jzb.com/' };

document.writeln("<div id='eduuTopNav' class='topnavI'>");
document.writeln("    <div class='wrapperUser'>");
document.writeln("        <div class='currentCity'>");
//document.writeln("        <a href='#' target='_blank'><span>家长帮-</span><strong>北京站</strong></a>");
document.writeln("        </div>");
document.writeln("        <div class='topNavL'>");
document.writeln("        	<ul>");
document.writeln("                <li class='noPa' style='_width:73px;'>");
document.writeln("                   <dl class='tarBox topCity'>");
document.writeln("                        <dt class='cityTitle'><a target='_blank' href='"+ecfg.indexurl+"?cookie=no'><nobr>[切换城市]</nobr></a></dt>");
document.writeln("                        <dd>");
document.writeln("                            <div class='area_cont'><dl><dt>全国地区：</dt><dd><a href='javascript::void();' onclick='gotourl(\"qg\");'>全国</a></dd></dl><dl><dt>华北地区：</dt><dd><a href='javascript::void();' onclick='gotourl(\"bj\");'>北京</a><a href='javascript::void();' onclick='gotourl(\"tj\");'>天津</a><a href='javascript::void();' onclick='gotourl(\"sjz\");'>石家庄</a><a href='javascript::void();' onclick='gotourl(\"ty\");'>太原</a></dd></dl><dl><dt>华东地区：</dt><dd><a href='javascript::void();' onclick='gotourl(\"sh\");'>上海</a><a href='javascript::void();' onclick='gotourl(\"nj\");'>南京</a><a href='javascript::void();' onclick='gotourl(\"su\");'>苏州</a><a href='javascript::void();' onclick='gotourl(\"hf\");'>合肥</a><a href='javascript::void();' onclick='gotourl(\"hz\");'>杭州</a><a href='javascript::void();' onclick='gotourl(\"nb\");'>宁波</a><a href='javascript::void();' onclick='gotourl(\"fz\");'>福州</a><a href='javascript::void();' onclick='gotourl(\"jn\");'>济南</a><a href='javascript::void();' onclick='gotourl(\"qd\");'>青岛</a><a href='javascript::void();' onclick='gotourl(\"wx\");'>无锡</a><a href='javascript::void();' onclick='gotourl(\"cz\");'>常州</a></dd></dl><dl><dt>华南地区：</dt><dd><a href='javascript::void();' onclick='gotourl(\"sz\");'>深圳</a><a href='javascript::void();' onclick='gotourl(\"gz\");'>广州</a></dd></dl><dl><dt>华中地区：</dt><dd><a href='javascript::void();' onclick='gotourl(\"zz\");'>郑州</a><a href='javascript::void();' onclick='gotourl(\"wh\");'>武汉</a><a href='javascript::void();' onclick='gotourl(\"cs\");'>长沙</a></dd></dl><dl><dt>东北地区：</dt><dd><a href='javascript::void();' onclick='gotourl(\"sy\");'>沈阳</a><a href='javascript::void();' onclick='gotourl(\"dl\");'>大连</a><a href='javascript::void();' onclick='gotourl(\"cc\");'>长春</a></dd></dl><dl><dt>西南地区：</dt><dd><a href='javascript::void();' onclick='gotourl(\"cq\");'>重庆</a><a href='javascript::void();' onclick='gotourl(\"cd\");'>成都</a></dd></dl><dl><dt>西北地区：</dt><dd><a href='javascript::void();' onclick='gotourl(\"xa\");'>西安</a></dd></dl></div>");
document.writeln("                        </dd>");
document.writeln("                    </dl>");
document.writeln("                </li>");
document.writeln("                <li class='cur'><a href='"+ecfg.bbsurl+"'><nobr>社区</nobr></a></li>");
document.writeln("                <li style='display:none;'><a href='#'><nobr>资讯</nobr></a></li>");
document.writeln("                <li><a href='"+ecfg.indexurl+"app/'><nobr>手机版</nobr></a></li>");
document.writeln("                <li class='noPa' style='_width:73px;'>");
document.writeln("                   <dl class='tarBox coach' xd='navOn'>");
document.writeln("                        <dt><nobr>辅导报班</nobr><i></i></dt>");
document.writeln("                        <dd>");
document.writeln("                        	<a href='http://www.speiyou.com/' target='_blank'><s class='w15'></s><nobr>学而思培优</nobr></a><a href='http://www.jiajiaoban.com/' target='_blank'><s class='w16'></s><nobr>智康1对1</nobr></a><a href='http://www.xueersi.com/' target='_blank'><s class='w17'></s><nobr>学而思网校</nobr></a><a href='http://www.mobby.cn/' target='_blank'><s class='w18'></s><nobr>摩比思维馆</nobr></a>");
document.writeln("                        </dd>");
document.writeln("                    </dl>");
document.writeln("                </li>");
document.writeln("                <li class='noPa' style='_width:73px;'>");
document.writeln("                   <dl class='tarBox otherWebsite' xd='navOn'>");
document.writeln("                        <dt><nobr>旗下网站</nobr><i></i></dt>");
document.writeln("                        <dd>");
document.writeln("                        	<a href='http://www.yuer.com/'><s class='w1'></s><nobr>育儿网</nobr></a><a href='http://www.youjiao.com/'><s class='w2'></s><nobr>幼教网</nobr></a><a href='http://www.aoshu.com/'><s class='w3'></s><nobr>奥数网</nobr></a><a href='http://www.zhongkao.com/'><s class='w4'></s><nobr>中考网</nobr></a><a href='http://www.gaokao.com/'><s class='w5'></s><nobr>高考网</nobr></a><a href='http://www.liuxue.com/'><s class='w6'></s><nobr>留学网</nobr></a><a href='http://www.zuowen.com/'><s class='w7'></s><nobr>作文网</nobr></a><a href='http://www.yingyu.com/'><s class='w8'></s><nobr>英语网</nobr></a><a href='http://v.eduuu.com/'><s class='w9'></s><nobr>视频</nobr></a>");
document.writeln("                        </dd>");
document.writeln("                    </dl>");
document.writeln("                </li>");
document.writeln("                <li class='navSrh' style='display:none;'><form method=get action='http://s.eduu.com/qs' target='_blank'><input type='hidden' id='eduTG' name='tg' value='0' /><input name='wd' id='eduuwd' type=text size='20' class='topInput' onfocus=\"this.value='';this.style.color='#000000';\" onblur=\"if(!this.value){this.value='请输入您要查询的关键字';this.style.color='#BBBBBB';}\" value='请输入您要查询的关键字' /><input name='' type='image' src='http://img.eduuu.com/website/public_images/topmenu/nav_btn_srh.gif' onclick='if(document.getElementById(\"eduuwd\").value==\"请输入您要查询的关键字\"){ document.getElementById(\"eduuwd\").value=\"\"}'/></form></li><li class='extra'></li>");
document.writeln("            </ul>");
document.writeln("        </div>");
document.writeln("        <div class='topNavR' id='eduuLogin'>");
document.writeln("            <ul>");
document.writeln("                <!--未登录状态显示-->");
document.writeln("                <li class='pa'><a href='"+ecfg.regurl+"register/'>注册</a></li>");
document.writeln("                <li class='pa'><span class='topLogin' style='display:none;'><a href='"+ecfg.regurl+"login/' class='lg'>登录</a></span>");
document.writeln("                     <dl class='tarBox New_logbox' xd='navOn'>");
document.writeln("                          <dt style=' _width:24px;'>登录<i></i></dt>");
document.writeln("                          <dd class='New_topLogin'>");
document.writeln("                              <p id='tiplogin'>家长帮通行证用户可直接登录</p>");
document.writeln("                              <p><input type='text' autocomplete=\"off\" class='topUserName onIput' value='邮箱/用户名'></p>");
document.writeln("                              <p><input type='text' id='showpassword' class='topPassWord onIput' value='请输入密码'><input type='password' id='password' class='topPassWord' style='display:none'></p>");
document.writeln("                              <p>");
document.writeln("                                  <label class='left'><input type='checkbox' id='islogin' value='1'>自动登录</label>");
document.writeln("                                  <span class='right'><a href='"+ecfg.regurl+"getpwd' target='_blank'>忘记密码？</a></span>");
document.writeln("                              </p>");
document.writeln("                              <p><a class='topMenuBtn' onclick='subLogin()'>登录</a></p>");
document.writeln("                          </dd>");
document.writeln("                     </dl>");
document.writeln("                </li>");
document.writeln("                <li class='pa'>");
document.writeln("                    <a class='top_q_Login' href='#' onclick=\"javascript:apiLogin(4,'"+ecfg.regurl+"');_gaq.push(['_trackEvent' ,'login', 'qq', 'step-1']);\">QQ登录</a>");
document.writeln("                    <a class='top_w_Login' href='#' onclick=\"javascript:apiLogin(1,'"+ecfg.regurl+"');_gaq.push(['_trackEvent' ,'login', 'sina', 'step-1']);\">微博登录</a>");
document.writeln("                </li>");
document.writeln("            </ul>");
document.writeln("        </div>");
document.writeln("        <div class='topNavR' style='display:none;'>");
document.writeln("        	<ul>");
document.writeln("                <li id='netMessage' class='noPa message_New' style='_width:69px;'><a href='"+ecfg.bbsurl+"space.php?mod=msg'><em>0</em>站内信</a></li>");
document.writeln("                <li id='usrMessage' class='message_New' style='_width:87px;'><a href='"+ecfg.bbsurl+"space.php?mod=notice'><em>0</em><nobr>消息</nobr></a></li>");
document.writeln("                <li class='noPa top_Pr' style='_width:100px;'>");
document.writeln("                <!--VIP推广提示 开始-->");
//document.writeln("                    <a class='top_News' href='javascript:;' onclick=\"tipNewyear();\">家长帮为您准备了新年贺卡，<strong>点击领取</strong></a>");
document.writeln("                    <dl class='tarBox user' xd='userOn' id='m006'>");
document.writeln("                        <dt id='tarUname'><i></i></dt>");
document.writeln("                        <dd>");
document.writeln("                          <div class='userInfo' id='eduuUser'>");
document.writeln("                              <img src='http://atth.jzb.com/avatar/avatar_small.jpg' width='50' height='50' alt='用户名' class='' />");
document.writeln("                              <div class='user_Nam'>");
document.writeln("                                  <p class='bm5'><a class='userNam' href='http://home.jzb.com/' class='level'>小牛妈妈521</a><a href='http://jzb.com/vip/' target='_blank'><span id='vipicon' class='' title='家长帮VIP'></span></a><a href='http://jzb.com/vip/uvip' target='_blank'><span id='uzvip' class='' title='优钻'></span></a></p><!--等级增加时变换class='levelIcon1-22'-->");
document.writeln("                                  <p class='n_gzfs'><a class='rm10 follnum' href='#'><span id='follnum'>121345</span>关注</a><a class='fansnum' href='#'><span id='fansnum'>9999999</span>粉丝</a></p>");
document.writeln("                              </div>");
document.writeln("                          </div>");
document.writeln("                        	<div class='userItem'>");
document.writeln("                                <p><a href='http://my.jzb.com/' class='enterHome profileHome'>个人主页</a></p>");
document.writeln("                                <p><a href='"+ecfg.bbsurl+"space.php?mod=profile' target='_blank' class='mytz'>个人资料</a></p>");
document.writeln("                                <p><a href='"+ecfg.bbsurl+"space.php?mod=email' class='safe_Icon'>账户安全</a></p>");
document.writeln("                                <p class='vipShow' style='display:none;'><a href='http://jzb.com/vip/member/' target='_blank' class='enterVip'>VIP中心</a></p>");
document.writeln("                                <p><a class='topClose' href='http://reg."+(document.domain.indexOf('jzb.cn')>=0 ? 'jzb.cn' : 'jzb.com')+"/logout'>退出</a></p>");
document.writeln("                            </div>");
document.writeln("<iframe width=\"260\" frameborder=\"0\" scrolling=\"no\" height=\"400\" style=\"position:absolute; left:0; top:28px; z-index:-1; filter:alpha(opacity=0); background:transparent;\"></iframe>");
document.writeln("                        </dd>");
document.writeln("                    </dl>");
document.writeln("                </li>");
document.writeln("            </ul>");
document.writeln("        </div>");
document.writeln("    </div>");
document.writeln("<input type='hidden' id='stugradebbs' value=''></div>");
/*
document.writeln("<div class='mask_Div'></div>");
document.writeln("<div class='greeting_Cad'>");
document.writeln("    <a class='gc_close' href='javascript:;'></a>");
document.writeln("    <div class='gc_cont'>");
document.writeln("        <h2>亲爱的<span class='userLogName yellow_fs'>家长帮用户</span></h2>");
document.writeln("        <p>家长帮论坛给您拜年啦，马年送福！</p>");
document.writeln("    </div>");
document.writeln("</div>");
document.writeln("<div class='show_greeting'><a class='show_greeting_close' href='javascript:;'></a></div>");
*/

/*
function ifshow(){
    var ifpop=0;
    var strCookie=document.cookie;
    var arrCookie=strCookie.split("; ");
    for(var i=0;i<arrCookie.length;i++){ 
        var arr=arrCookie[i].split("="); 
        if("ifpop"==arr[0]){ 
            ifpop=arr[1]; 
            break; 
        } 
    }
    return ifpop;
}
var ifpop=ifshow();
if(ifpop==1) $(".show_greeting").hide();
*/

(function($){
    var city_arr = {sh:'上海',nj:'南京',su:'苏州',hz:'杭州',jn:'济南',qd:'青岛',nb:'宁波',fz:'福州',hf:'合肥',wx:'无锡',cz:'常州',bj:'北京',tj:'天津',ty:'太原',sjz:'石家庄',gz:'广州',sz:'深圳',wh:'武汉',zz:'郑州',cs:'长沙',cd:'成都',cq:'重庆',xa:'西安',sy:'沈阳',dl:'大连',cc:'长春',qg:'全国'};
    
    var _area = getCookie('edx_34b9__f_area');
    if(_area){
        var data = _area;
        $(".currentCity").html("<a href='"+ecfg.indexurl+"bbs/"+data+"/' target='_blank'><span>家长帮-</span><strong>"+city_arr[data]+"站</strong></a>");
    }else{
        $.getJSON("http://applib.eduu.com/newapp/getarea?callback=?",function(data){ 
            if(data){
                $(".currentCity").html("<a href='"+ecfg.indexurl+"bbs/"+data[1]+"/' target='_blank'><span>家长帮-</span><strong>"+city_arr[data[1]]+"站</strong></a>");
                cookiedomain=document.domain.substr(document.domain.indexOf("."));
                setCookie('edx_34b9__f_area',data[1],2592000,'/',cookiedomain);    
            }
        });
    }    

    $(".topUserName").focus(function(){
        if($(this).val()=="邮箱/用户名"){
            $(this).val('').removeClass('onIput');
        }
    });
    $(".topUserName").blur(function(){
        if($(this).val()==""){
            $(this).val('邮箱/用户名').addClass('onIput');
        }
    });
    $(".topPassWord").focus(function(){
        if($(this).val()=="请输入密码"){
            $("#showpassword").hide();
            $("#password").show().focus();
        }
    });
    $(".topPassWord").blur(function(){
        if($(this).val()==""){
            $("#showpassword").show();
            $("#password").hide();
        }
    });
    //贺卡部分
    /*
    $('.top_News').click(function(){
        showGre(this);
    });
    $('.gc_close').click(function(){
        $('.greeting_Cad').hide();
        $('.show_greeting').show();
        $('.mask_Div').css('display','none');
    });
    $('.show_greeting').click(function(){
        showGre(this);
        _gaq.push(['_trackEvent', 'vip', 'newyearcard','right']);
    });
    $('.show_greeting_close').click(function(){
        var date=new Date(); 
        date.setTime(date.getTime()+24*3600*1000);
        document.cookie="ifpop=1;expires="+date.toGMTString();
        $(this).parent().hide();
        return false;
    })*/
})(jQuery);

(function($){
    $.fn.hoverDelay = function(options){
        var defaults = {
            hoverDuring: 200,
            outDuring: 200,
            hoverEvent: function(){
            },
            outEvent: function(){
            }
        };
        var sets = $.extend(defaults,options || {});
        var hoverTimer, outTimer;
        return $(this).each(function(){
            var el = this;
            $(this).hover(function(){
                clearTimeout(outTimer);
                hoverTimer = setTimeout(function(){
                    sets.hoverEvent.apply(el);
                }, sets.hoverDuring);
            },function(){
                clearTimeout(hoverTimer);
                outTimer = setTimeout(function(){
                    sets.outEvent.apply(el);
                }, sets.outDuring);
            });
        });
    }
    //通用显示菜单
    $(".tarBox").each(function(){
        $(this).hoverDelay({
            hoverDuring: 400,
            outDuring: 400,
            hoverEvent: function(){
                var B=$(this).attr('xd');
                if(B) $(this).addClass(B);
                $(this).parent().siblings().children().removeClass(B);
            },
            outEvent: function(){
                var B=$(this).attr('xd');
                if(B) $(this).removeClass(B);
            }
        });
    })
})(jQuery);

function API_loging(O){
    //验证登陆
    if (O.login!='1') {
        var chk=document.cookie.indexOf('userKey=');
        if(chk>=0){
			 cookiedomain=document.domain.substr(document.domain.indexOf("."));
             setcookie('userKey','',-1,'/',cookiedomain);
             location.reload(true);
        }
		return false;
	}

    $('#eduuLogin').hide().next().show();//登录切换
    jQuery(function($){
        $('.logoReg').hide();$('.loginInAd').show();//LOGO下广告切换
    });

    $('#tarUname').append(O.uname2);
    $('.userLogName').html(O.uname);
    $('#eduuUser').find('img').attr('src',O.upic).attr('alt',O.uname);
    $('#eduuUser').find('p:eq(0) > a:eq(0)').text(O.uname).attr('href',ecfg.bbsurl+'space-'+O.uid+'.html');
    $('.profileHome').attr('href',ecfg.bbsurl+'space-'+O.uid+'.html');
    
    if(O.msg>0) jQuery('#netMessage em').html(O.msg>99 ? '<nobr>99+</nobr>' : O.msg).addClass('hasMes');
    if(O.ntcsys>0) jQuery('#usrMessage em').text(O.ntcsys>0 ? O.ntcsys : '').addClass('hasMes');
    /*if(O.msgsum>0) $('#eduuMsg > dt > em').text(O.msgsum>99 ? '99+' : O.msgsum).addClass('hasMes');
    if(O.msg>0) $('#eduuMsg > dd em:eq(0)').text(O.msg>0 ? '+'+O.msg : '').addClass('hasOrg');
    if(O.ntcrqt>0) $('#eduuMsg > dd em:eq(1)').text(O.ntcrqt>0 ? '+'+O.ntcrqt : '').addClass('hasOrg');
    if(O.ntcfns>0) $('#eduuMsg > dd em:eq(2)').text(O.ntcfns>0 ? '+'+O.ntcfns : '').addClass('hasOrg');
    if(O.ntcsys>0) $('#eduuMsg > dd em:eq(3)').text(O.ntcsys>0 ? '+'+O.ntcsys : '').addClass('hasOrg');*/
    $("#fansnum").html(O.fansnum);//粉丝数
    $("#follnum").html(O.follnum);//关注数
    $(".fansnum").attr("href",ecfg.homeurl+'space-'+O.uid+"-fans.html");
    $(".follnum").attr("href",ecfg.homeurl+'space-'+O.uid+"-follow.html");

    //切换小升初助手的链接地址
    $(".xsc").attr("href",ecfg.url+"xiaoshengchu/");

    //验证是否家长帮会员
    if(O.isvip>0){
        $(".vipShow").show();
        $('#tarUname').addClass('red');
        $('#eduuUser').find('p:eq(0) > a:eq(0)').addClass('red');
        $("#vipicon").addClass("level_Icon level_vip0"+O.vipgrade);
    }
    if(O.uvip=='1'){
        $("#uvipicon").addClass("level_Icon diamond_Yes");
    }
    
    //新年贺卡
    /*
    if(O.ifnewtip==1){
        $(".top_News").hide();
    }else{
        $(".show_greeting").hide();
    }*/

    //学生年级
    $("#stugradebbs").val(O.stugrade);
}
//API登录 延时
function apiLogin(A,B){
    //暂时去掉登录延时了
    window.location.href=B+'apilogin/goApi?type='+A;
    return false;
    /*
     $("body").append("<div class=\"shadowDiv\"></div><div class=\"tzTip\">页面跳转中<span id=\"dtime\">3</span>...</div>");
     window.setInterval('goApi("'+A+'","'+B+'")', 1000);
     var _height = $(document).height();
     $('.shadowDiv').height(_height);*/
}
//登录提交
function subLogin(){
    var uname=$.trim($(".topUserName").val());
    var passwd=$.trim($("#password").val());
    var islogin=$("#islogin").attr("checked")==true ? 1 : 0;
    var logtype=0;
    var urow=uname.split("");
    for(var i=0; i<uname.length;i++){
        if(urow[i] == '@'){
            logtype=2;break;
        }
    }
    if(uname=="邮箱/用户名" || uname==""){
        $("#tiplogin").html("<font color='red'>请输入邮箱/用户名</font>");
        return false;
    }
    if(passwd==""){
        $("#tiplogin").html("<font color='red'>请输入密码</font>");
        return false;
    }
    //getJSON实现跨域
    $.getJSON(ecfg.regurl+"login/loginpost?uname="+encodeURIComponent(uname)+"&passwd="+passwd+"&logtype="+logtype+"&islogin="+islogin+"&callback=?", function(data){
        data=eval('('+data+')');
        if(data.status==1){
			cookiedomain=document.domain.substr(document.domain.indexOf("."));
			setcookie('userKey',data.userKey,2592000,'/',cookiedomain);
            location.reload(true);
        }
        $("#tiplogin").html("<font color='red'>"+data.msg+"</font>");
        return false;
    });
}
//cookie
function setcookie(cookieName, cookieValue, seconds, path, domain, secure) {
	var expires = new Date();
	if(cookieValue == '' || seconds < 0) {
		cookieValue = '';
		seconds = -2592000;
	}
	expires.setTime(expires.getTime() + seconds * 1000);
	domain = !domain ? cookiedomain : domain;
	path = !path ? cookiepath : path;
	document.cookie = escape(cookieName) + '=' + escape(cookieValue)
		+ (expires ? '; expires=' + expires.toGMTString() : '')
		+ (path ? '; path=' + path : '/')
		+ (domain ? '; domain=' + domain : '')
		+ (secure ? '; secure' : '');
}
function setCookie(cookieName, cookieValue, seconds, path, domain, secure) {
        var expires = new Date();
        expires.setTime(expires.getTime() + seconds);
        document.cookie = escape(cookieName) + '=' + escape(cookieValue)
            + (expires ? '; expires=' + expires.toGMTString() : '')
            + (path ? '; path=' + path : '/')
            + (domain ? '; domain=' + domain : '')
            + (secure ? '; secure' : '');
    }
function getCookie(name) {
    var start = document.cookie.indexOf(name);
    var end = document.cookie.indexOf(";",start);
    return start==-1 ? null : unescape(document.cookie.substring(start+name.length+1,(end>start ? end : document.cookie.length)));
}
//url跳转
function gotourl(area){
        var url = ecfg.indexurl+area;
        cookiedomain=document.domain.substr(document.domain.indexOf("."));
        setcookie('edx_34b9__f_area', area, 2592000000, '/', cookiedomain);
        window.location.href=url;
    }
//登录检测地址 c=编码&a=api函数(默认为API_loging)
//document.write(unescape("%3Cscript src='"+ecfg.regurl+"js/login.js?r="+Math.random()+"' type='text/javascript'%3E%3C/script%3E"));
$.ajax({
        url: ecfg.regurl+"js/login.js",
        dataType: 'jsonp'
    }).done(API_loging);