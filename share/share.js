//分享到新浪网
function ShareToSina(title, pageurl, source) {
    window.open('http://v.t.sina.com.cn/share/share.php?title=' + encodeURIComponent(title) + '&url=' + encodeURIComponent(pageurl) + '&source=' + encodeURIComponent(source), '_blank');
}
//分享到MSN
function ShareToMSN(title, pageurl, source) {
    window.open('http://profile.live.com/badge/?title=' + encodeURIComponent(title) + '&url=' + encodeURIComponent(pageurl) + '&source=' + encodeURIComponent(source), '_blank');
}
//分享到腾讯微博
function ShareToTencent(title, pageurl, source) {
    window.open('http://v.t.qq.com/share/share.php?title=' + encodeURIComponent(title) + '&url=' + encodeURIComponent(pageurl) + '&source=' + encodeURIComponent(source), '_blank');
}
//分享到开心网
function ShareToKaixin(title, pageurl, source) {
    window.open('http://www.kaixin001.com/repaste/share.php?rtitle=' + encodeURIComponent(title) + '&rurl=' + encodeURIComponent(pageurl) + '&rcontent=' + encodeURIComponent(source), '_blank');
}
//分享到人人网
function ShareToRenren(title, pageurl, source) {
    window.open('http://share.renren.com/share/buttonshare.do?title=' + encodeURIComponent(title) + '&link=' + encodeURIComponent(pageurl) + '&source=' + encodeURIComponent(source), '_blank');
}
//分享到网易
function ShareTo163(title, pageurl, source) {
    window.open('http://t.163.com/article/user/checkLogin.do?link=' + encodeURIComponent(title) + '&source=' + encodeURIComponent(source) + '&info=' + encodeURIComponent(title) + encodeURIComponent(pageurl), '_blank');
}
//分享到搜狐微博
function ShareToSohu(title, pageurl, source) {
    window.open('http://t.sohu.com/third/post.jsp?&url=' + escape(pageurl) + '&title=' + escape(title) + '&rcontent=' + escape(source), '_blank');
}
//分享到百度空间
function ShareToBaiduSpace(title, pageurl, source) {
    window.open('http://apps.hi.baidu.com/share/?title=' + encodeURIComponent(title) + '&url=' + encodeURIComponent(pageurl) + '&source=' + encodeURIComponent(source), '_blank');
}
//分享到百度i贴吧
function ShareToBaiduTieba(title, pageurl, source) {
    window.open('http://tieba.baidu.com/i/sys/share?title=' + encodeURIComponent(title) + '&link=' + encodeURIComponent(pageurl) + '&source=' + encodeURIComponent(source), '_blank');
}
//分享到豆瓣网
function ShareToDouban(title, pageurl, source) {
    window.open('http://www.douban.com/recommend/?title=' + encodeURIComponent(title) + '&url=' + encodeURIComponent(pageurl) + '&source=' + encodeURIComponent(source), '_blank');
}
//分享到QQ空间
function ShareToQzone(title, pageurl, source) {
    window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + encodeURIComponent(pageurl), '_blank');
}
//分享到飞信空间
function ShareToFetion(title, pageurl, source) {
    window.open('http://space.fetion.com.cn/api/share?title=' + encodeURIComponent(title) + '&url=' + encodeURIComponent(pageurl) + '&source=' + encodeURIComponent(source), '_blank');
}
//分享到天涯社区
function ShareToTianya(title, pageurl, source) {
    window.open('http://co.tianya.cn/third/export/thirdLoginDiv.jsp?app_id=jiathis&ccTitle=' + encodeURIComponent(title) + '&ccUrl=' + encodeURIComponent(pageurl), '_blank');
}
//分享到51.com
function ShareTo51Com(title, pageurl, source) {
    window.open('http://passport.51.com/passport.5p?strTitle=' + encodeURIComponent(title) + '&gourl=' + encodeURIComponent(pageurl), '_blank');
}

//寄给朋友
function SendToFriend(title, pageurl, source) {
    window.open('http://support-cn.samsung.com/cn/p275/microsite/gnb/type-email/footer_Email.htm?title=' + encodeURIComponent(title) + '&url=' + encodeURIComponent(pageurl), '_blank', 'width=394,height=474,top=120,left=420');
}
//复制网址
function ClickCopyButton(pageurl) {
    window.clipboardData.setData("Text", pageurl); 
    alert("恭喜你，你已经成功将地址复制到剪贴板，请转发给你身边的好友吧！");
}


var s;
function showMessage() {
    window.clearTimeout(s);
    $("#div_share").show();
}

function hiddenMessage() {
    s = window.setTimeout("$('#div_share').hide();", 500);
}


function setPng24(obj) {
    obj.width = obj.height = 1;
    obj.className = obj.className.replace(/\bpng24\b/i, '');
    obj.style.filter =
		"progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + obj.src + "',sizingMethod='image');"
    obj.src = '';
    return '';
}

