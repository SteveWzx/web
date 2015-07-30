(function(d){d.extend({isIE6:function(){return !-[1]&&!window.XMLHttpRequest},cookie:function(g,l,j){var e={expires:1,domain:document.domain,path:"/"},f=d.extend(e,j),h=document.cookie.split("; "),m="",i=new Date();if(!arguments.length){return}fn={setCookie:function(n,o){i.setTime(i.getTime()+(f.expires*24*60*60*1000));m=encodeURIComponent(n)+"="+encodeURIComponent(o)+";expires="+i.toUTCString()+";domain="+f.domain+";path="+f.path;document.cookie=m},getCookie:function(n){d.each(h,function(o,p){if(decodeURIComponent(p.split("=")[0])===n){m=decodeURIComponent(p.split("=")[1])}});return m},removeCookie:function(n){this.setCookie(n,1,f.expires=-1)}};if(!/undefined/.test(typeof l)){if(/string|number/.test(typeof l)){fn.setCookie(g,l)}else{if(d.isPlainObject(l)){d.each(l,function(n,o){if(/expires/.test(n)&&o===-1){fn.removeCookie(g)}})}else{return}}}else{return fn.getCookie(g)}}});var b=["DOMMouseScroll","mousewheel"];if(d.event.fixHooks){for(var a=b.length;a;){d.event.fixHooks[b[--a]]=d.event.mouseHooks}}d.event.special.mousewheel={setup:function(){if(this.addEventListener){for(var e=b.length;e;){this.addEventListener(b[--e],c,false)}}else{this.onmousewheel=c}},teardown:function(){if(this.removeEventListener){for(var e=b.length;e;){this.removeEventListener(b[--e],c,false)}}else{this.onmousewheel=null}}};function c(j){var h=j||window.event,g=[].slice.call(arguments,1),l=0,i=true,f=0,e=0;j=d.event.fix(h);j.type="mousewheel";if(h.wheelDelta){l=h.wheelDelta/120}if(h.detail){l=-h.detail/3}e=l;if(h.axis!==undefined&&h.axis===h.HORIZONTAL_AXIS){e=0;f=-1*l}if(h.wheelDeltaY!==undefined){e=h.wheelDeltaY/120}if(h.wheelDeltaX!==undefined){f=-1*h.wheelDeltaX/120}g.unshift(j,l,f,e);return(d.event.dispatch||d.event.handle).apply(this,g)}d.fn.extend({mousewheel:function(e){return e?this.bind("mousewheel",e):this.trigger("mousewheel")},unmousewheel:function(e){return this.unbind("mousewheel",e)},actual:function(e,p){if(!this[e]){throw'$.actual => The jQuery method "'+e+'" you called does not exist'}var i={absolute:false,clone:false,includeMargin:false};var m=d.extend(i,p);var h=this.eq(0);var l,n;if(m.clone===true){l=function(){var q="position: absolute !important; top: -1000 !important; ";h=h.clone().attr("style",q).appendTo("body")};n=function(){h.remove()}}else{var j=[];var g="";var f;l=function(){f=h.parents().addBack().filter(":hidden");g+="visibility: hidden !important; display: block !important; ";if(m.absolute===true){g+="position: absolute !important; "}f.each(function(){var q=d(this);var r=q.attr("style");j.push(r);q.attr("style",r?r+";"+g:g)})};n=function(){f.each(function(q){var s=d(this);var r=j[q];if(r===undefined){s.removeAttr("style")}else{s.attr("style",r)}})}}l();var o=/(outer)/.test(e)?h[e](m.includeMargin):h[e]();n();return o},tab:function(h){var e={type:"mouseover",triggerClass:"current",tab:"ul:first > li",panelClass:"panel",defaultPanel:0,async:{state:false,url:"a.php",type:"get",dataType:"json",data:[],error:function(){},success:function(j,i){}},slideTab:{trigger:".factor",sliding:false,vertical:false,speed:300},opacity:false,delay:200,operate:function(){}},g=null,f=d.extend(true,e,h);f.delay=f.type==="click"?0:f.delay;g=function(n){var m=n.length,l=0,j={};for(;l<m;l++){j[n[l].split("=")[0]]=n[l].split("=")[1]}return j};return this.each(function(s,n){var r=d(n).find(f.tab),q=d(n).find("."+f.panelClass),j,l="left",t="width",o={},m=null,p=null,i=null;j=f.opacity===true?600:0;f.slideTab.sliding===true?(f.slideTab.vertical===true?(l="top",t="height",d(f.slideTab.trigger).height(r.eq(f.defaultPanel).actual("outerHeight"))):d(f.slideTab.trigger).width(r.eq(f.defaultPanel).actual("outerWidth"))):0;m=function(u){o[l]=r.eq(u).position()[l];o[t]=t==="width"?r.eq(u).actual("outerWidth"):r.eq(u).actual("outerHeight");return o};p=function(y){var w=f.async.data,v=w[y],x="",u={};r.eq(f.defaultPanel).attr("data-j-tab",1);r.eq(y).addClass(f.triggerClass).siblings().removeClass(f.triggerClass);d(n).find(f.slideTab.trigger).animate(m(y),f.slideTab.speed);if(f.async.state===true&&r.eq(y).attr("data-j-tab")!=="1"&&v!==0){x=f.async.url.split(",").length===1?f.async.url.split(",")[0]:f.async.url.split(",")[y];u=v.indexOf("&")>-1?g(v.split("&")):g(v.split());d.ajax({url:x,type:f.async.type,data:u,dataType:f.async.dataType,error:function(){f.async.error(q.eq(y))},success:function(z){r.eq(y).attr("data-j-tab",1);f.async.success(q.eq(y),z)}})}q.eq(y).fadeIn(j).siblings("."+f.panelClass).hide();f.operate(y)};p(f.defaultPanel);r.bind(f.type,function(){var u=d(this).index();clearTimeout(i);i=setTimeout(function(){p(u)},f.delay)});r.mouseout(function(){clearTimeout(i);i=null})})},slide:function(h){var e={animate:false,opacity:false,vertical:false,prevButton:".prev_button",nextButton:".next_button",trigger:false,triggerClass:"current",type:"mouseover",dataAttr:"title",dataPanel:".text",auto:true,speed:300,time:3000},g=d.extend(e,h),f=200;f=g.type==="click"?0:f;return this.each(function(B,r){var x=d(r).find("ul:first"),t=d(r).find("ul:first > li"),A=d(r).find("ul:last > li"),y=d(r).find("img"),i=k=t.length,q=null,m=null,s=t.eq(0).height(),v="top",w={},z={},n=1,l=0,p=0,j=0;if(g.trigger===true){var u=d(r).find("ul:last");t.each(function(o){if(!o){u.append(d("<li>").text(1).addClass(g.triggerClass))}else{u.append(d("<li>"+(o+1)+"</li>"))}});A=u.children()}if(g.opacity===true){g.animate=false;t.each(function(o,C){d(C).css({position:"absolute",left:0,top:0,zIndex:k--});if(o){d(C).css("opacity",0);w.opacity=0;z.opacity=1}})}if(g.animate===true){t.first().clone().addClass("first-clone").appendTo(x).end().end().last().clone().addClass("last-clone").prependTo(x);if(g.vertical===false){v="left";s=t.eq(0).width();x.css("width",(i+2)*s).css(v,-s)}else{x.css("height",(i+2)*s).css(v,-s)}}if(!d.isEmptyObject(d(g.prevButton).get(0))&&!d.isEmptyObject(d(g.nextButton).get(0))){d(document).on({click:function(o){var C=d(o.target);m.clearTimer();if(C.closest(g.prevButton).length>0&&n){n=0;m.moveTo(--l)}else{if(C.closest(g.nextButton).length>0&&n){n=0;m.moveTo(++l)}}},mouseout:function(){m.start()}},g.prevButton+","+g.nextButton)}m={moveTo:function(o){l=o;if(g.animate===true){j=-(l+1)*s;o=(l===i?0:(l<0?i-1:o));this.anim()}else{if(g.opacity===true){o=l>i-1?0:l;this.setOpacity()}else{o=l=(l>i-1?0:(l<0?i-1:o));j=-o*s;x.css(v,j);n=1}}A.eq(o).addClass(g.triggerClass).siblings().removeClass(g.triggerClass);d(g.dataPanel).html(y.eq(o).attr(g.dataAttr))},anim:function(){var o={};o[v]=j;x.animate(o,g.speed,function(){n=1;if(l===i){l=0;x.css(v,-s)}else{if(l<0){l=i-1;x.css(v,-i*s)}}})},setOpacity:function(){var o=p;if(l>=i){l=0}else{if(l<0){l=i-1}}p=l;if(o!==p){t.eq(o).css({zIndex:1}).animate(w,g.speed,function(){n=1});t.eq(p).css({position:"absolute",zIndex:i}).animate(z,g.speed)}},auto:function(){var o=this;this.clearTimer();q=setInterval(function(){l===(g.animate===true?i:i-1)?l=0:l++;o.moveTo(l)},g.time)},start:function(){this.clearTimer();if(g.auto===true){this.auto()}},clearTimer:function(){clearTimeout(q);clearInterval(q);q=null}};A.bind(g.type,function(){var o=d(this).index();m.clearTimer();q=setTimeout(function(){m.moveTo(o)},f)});A.mouseout(function(){m.start()});t.bind({mouseover:function(){m.clearTimer()},mouseout:function(){m.start()}});m.start()})},loopScroll:function(g){var e={amount:1,speed:300,time:3000,prevButton:".roll_lbtn",nextButton:".roll_rbtn",operate:function(){},vertical:false,auto:true},f=d.extend(e,g);return this.each(function(u,o){var v=d(o).find("ul:first"),x=d(o).find("li"),j=x.length,t=f.vertical===true?"height":"width",p=0,s=1,y=1,q,n,m,h,w,l,r,i;d(o).css(t,9999);if(f.vertical===true){h=x.eq(0).outerHeight(true)*j;l="top";w=d(o).parent().height()}else{h=x.eq(0).outerWidth(true)*j;l="left";w=d(o).parent().width()}m=parseInt(h/j)*f.amount;n=parseInt(h/m);if(h<=w){return}v.clone(true).insertAfter(v);r={clearTimer:function(){clearInterval(i);i=null},moveTo:function(z){if(z>n){p=z=1;d(o).css(l,0)}else{if(z<0){p=z=n-1;d(o).css(l,-m*n)}}q=-m*z;this.anim()},anim:function(){var z={};z[l]=q;d(o).animate(z,f.speed,function(){s=y=1;f.operate(p,n)})},auto:function(){var z=this;i=setInterval(function(){z.moveTo(++p)},f.time)},start:function(){this.clearTimer();if(f.auto===true){this.auto()}}};d(o).bind({mouseover:function(){r.clearTimer()},mouseout:function(){r.start()}});d(document).on({click:function(z){var A=d(z.target);if(A.closest(f.prevButton).length>0){if(s){s=0;r.moveTo(--p)}}else{if(A.closest(f.nextButton).length>0){if(y){y=0;r.moveTo(++p)}}}r.clearTimer()},mouseover:function(){r.clearTimer()},mouseout:function(){r.start()}},f.prevButton+","+f.nextButton);r.start()})},textScroll:function(h){var f={panel:"li:first",time:3000,speed:600,vertical:true},g=d.extend(f,h),j=d.isIE6();if(j){try{document.execCommand("BackgroundImageCache",false,true)}catch(i){}}return this.each(function(q,o){var e=null,s=d(o).find(g.panel),r=s.outerHeight(),l=s.outerWidth(),m=s.siblings().andSelf().length,p,n={};if(g.vertical===true){if(r*m<=d(o).outerHeight()){return false}else{p="marginTop";n[p]=-s.outerHeight()}}else{if(l*m<=d(o).outerWidth()){return false}else{p="marginLeft";n[p]=-s.outerWidth()}}d(o).hover(function(){clearInterval(e)},function(){e=setInterval(function(){var t=d(o).find(g.panel);t.animate(n,g.speed,function(){t.css(p,0).appendTo(s.parent())})},g.time)}).trigger("mouseleave")})},smartShow:function(g){var e={url:"a.php",panel:".smart-item",param:"key",dataWrap:"li",dataType:"json",wrapClass:"current",success:function(){},operate:function(){}},f=d.extend(e,g);return this.each(function(q,m){var j=d(f.panel),p={},r,n=null,l=null,i=false,h=navigator.userAgent.indexOf("Chrome"),o=-1;d(m).attr("data-smart",true);d(f.panel).attr("data-smartpanel",true);n=function(s){d.ajax({type:"get",url:f.url,data:f.param+"="+s,dataType:f.dataType,success:function(u){if(u){f.success(u);i=true;o=-1;var t=d(f.panel).children();if(t.length){t.bind({mouseover:function(){o=d(this).index();d(this).addClass(f.wrapClass).siblings().removeClass(f.wrapClass)},click:function(){d(m).val(d(this).html().replace(/<[^>]+>/g,""));d(f.panel).hide();i=false;f.operate(o,d(this).html())}})}}}})};l=function(s){(r!=s&&s!="")?n(s):0};d(m).bind({keydown:function(){r=d(m).val()},keyup:function(v){var u=j.find(f.dataWrap),x=v.keyCode,w=d.trim(d(m).val()),s={},t=u.length;s={moveTo:function(y){if(y<0){o=y=t-1}if(y>t-1){o=y=0}u.eq(y).addClass(f.wrapClass).siblings().removeClass(f.wrapClass);d(m).val(u.eq(y).html().replace(/<[^>]+>/g,""))}};if(x===38){if(!i){return}s.moveTo(--o);return false}else{if(x===40){if(!i){return}s.moveTo(++o);return false}else{if(x===13){i=false;l(w);f.operate(o,u.eq(o).html().replace(/<[^>]+>/g,""));return false}}}if(w==""){d(f.panel).html("").hide();i=false}l(w)},focus:function(){var s=d.trim(d(m).val());l(s)}});if(h){d(m).bind("input",function(){var s=d.trim(d(m).val());l(s)})}d(document).bind("click",function(s){var t=d(s.target);if(t.attr("data-smart")!="true"&&t.parent().attr("data-smartpanel")!="true"){d(f.panel).hide();i=false;o=-1}})})},toPlace:function(f,j){var e={top:100,bottom:100,animate:false,speed:0},h=d.extend(e,j),g=d(window).height(),i=d(document).height();return this.each(function(l,n){var o=h.animate===true?"slow":0,m={back:function(){var p;p=f==="top"?0:i;d("body, html").animate({scrollTop:p},h.speed)},roll:function(p){d(window).bind("scroll",function(){var r=d(this).scrollTop(),q=r+g;if(p==="top"){if(r>h.top){d(n).fadeIn(o)}else{if(r<50){d(n).fadeOut(o)}}}else{if(i-q>h.bottom){d(n).fadeIn(o)}else{if(i-q<50){d(n).fadeOut(o)}}}})}};d(n).bind("click",function(){m.back()});if(f==="top"){m.roll(f)}else{if(f==="bottom"){m.roll(f)}}})},dialog:function(f){var i={title:"�Ի���",content:"hello world !",container:".dialog-bd",close:".dialog-close",confirm:".dialog-confirm",cancel:".dialog-cancel",opacity:0.1,operate:function(){},animate:false,mask:true},r=d.extend(i,f);this.find(r.container).html(r.content);var s=d(document).height(),o=this.height(),g=this.width(),n=d(document).scrollTop()+d(window).height()/2-o/2,h=d(document).width()/2-g/2,l={position:"absolute",top:0,left:0,width:"100%",height:s,backgroundColor:"#000",opacity:0,filter:"alpha(opacity="+r.opacity*100+")",zIndex:100000000},e={display:"block",position:"absolute",top:n-30,left:h,overflow:"hidden",zIndex:100000001},m=null,p=this,j="tinkerMask"+(+new Date()),q=d('<div id="'+j+'">');m={showMask:function(){q.appendTo(d("body")).css(l)},anim:function(u,t){q.animate({opacity:t},500);p.animate({top:u,opacity:1},400,"linear")},showDialog:function(){p.css(e);if(r.animate===true){if(r.mask===true){this.showMask();this.anim(n,r.opacity)}else{this.anim(n)}}else{if(r.mask===true){l.opacity=r.opacity;this.showMask();p.css("top",n)}else{p.css("top",n)}}},closeDialog:function(u){var t=function(){if(u){r.operate(j)}};if(r.animate===true){p.animate({top:e.top,opacity:0},600,function(){p.css({display:"none"});t()});d("#"+j).animate({opacity:0},200,function(){d("#"+j).remove()})}else{p.hide();d("#"+j).remove();t()}}};m.showDialog();this.drag({operate:function(t){e.top=t.top-30}});this.bind("click",function(u){var w=d(u.target),v=w.hasClass(r.close.slice(1))||r.close.slice(1)===w.attr("id")||w.hasClass(r.cancel.slice(1))||r.cancel.slice(1)===w.attr("id"),t=w.hasClass(r.confirm.slice(1))||r.confirm.slice(1)===w.attr("id");if(v){m.closeDialog();p.unbind("click")}else{if(t){m.closeDialog(r.operate);p.unbind("click")}}})},drag:function(g){var e={parent:true,operate:undefined},f=d.extend(e,g);return this.each(function(p,j){var s=d(j).height(),l=d(j).width(),o=d(j).offsetParent(),i,n={top:0,left:0},h,r,q,m;d(j).css({position:"absolute"});if(o.css("position").toLowerCase()==="relative"||o.css("position").toLowerCase()==="absolute"){h=o.width();r=o.height()}else{h=d(window).width();r=d(document).height()}q=h-l-2;m=r-s-2;i=f.parent===true?d(j).children().eq(0):d(j);i.bind("mousedown",function(w){var v=f.parent===true?d(this).parent():d(this),y=v.position().left,x=v.position().top,z=w.pageX-y,u=w.pageY-x,t=0;if(v.get(0).setCapture){v.get(0).setCapture()}d(document).bind({mousemove:function(A){var C=A.pageX-z,B=A.pageY-u;t=1;if(C<0){C=0}if(C>=q){C=q}if(B<0){B=0}if(B>=m){B=m}n.left=C;n.top=B;d(j).css({top:B,left:C})},mouseup:function(){if(d(j).get(0).releaseCapture){d(j).get(0).releaseCapture()}d(this).unbind("mousemove mouseup");if(typeof f.operate=="function"&&t){f.operate({top:n.top,left:n.left})}}});return false})})},monitor:function(h,g){var e={dirWrap:".catalog",listWrap:"li",triggerClass:"current",opacity:false,disTop:{minTop:0,maxTop:9999},topDiff:0,speed:400,animate:true},f=d.extend(true,e,g);f.speed=f.animate===true?f.speed:0;return this.each(function(t,o){var q=d(o).find(h),m=d(f.dirWrap).find(f.listWrap),s=[],i=0,j=0,l=1,p=null,r=null,n=null;d.each(q,function(u,w){var v=Math.ceil(d(w).offset().top)-f.topDiff;s[u]=v;m.eq(u).data("dataTop",v)});i=s.length;j=f.opacity===true?400:0;r=function(v){var u=parseInt(v.data("dataTop"));d("body, html").animate({scrollTop:u},f.speed,function(){l=1})};n=function(){var u=p,v=0,w=d(window).scrollTop();if(w>=s[i-1]){p=m.eq(i-1)}else{for(;v<i-1;v++){if(w>=s[v]&&w<s[v+1]){p=m.eq(v);break}}}if(w<f.disTop.minTop||w>f.disTop.maxTop){d(f.dirWrap).hide()}else{d(f.dirWrap).fadeIn(j)}if(u!==p){if(u){u.removeClass(f.triggerClass)}p.addClass(f.triggerClass)}};d(f.dirWrap).bind("click",function(v){var u=d(v.target).closest(f.listWrap);if(l&&!d.isEmptyObject(u.get(0))){l=0;r(u)}});d(window).bind("scroll",n)})},scrollBar:function(g){var e={content:".conBox",bar:".bar",prevButton:".prebtn",nextButton:".nextbtn",vertical:true},f=d.extend(e,g);return this.each(function(y,o){var p=d(o).find(f.content),s=d(o).find(f.bar),m=d(o).find(f.prevButton),i=d(o).find(f.nextButton),w=s.offsetParent(),r=p.offsetParent(),x=p.width()-r.width(),v=p.height()-r.height(),n,h,l="left",t="width",q,j,u=null;if(f.vertical===true){n=v;l="top";t="height",q=r.height()/p.height();j=Math.max(20,w.height()*q)}else{n=x;q=r.width()/p.width();j=Math.max(20,w.width()*q)}if(q>=1){w.parent().hide();return false}s.css(t,j);if(f.vertical===true){h=w.height()-s.height()}else{h=w.width()-s.width()}u={scrollPos:function(C){var A,z={},B={};if(C<0){C=0}if(C>=h){C=h}z[l]=C;s.css(z);q=C/h;A=-q*n;B[l]=A;p.css(B)}};s.bind("mousedown",function(A){var C=d(this).position().left,B=d(this).position().top,D=A.clientX-C,z=A.clientY-B;if(d(this).get(0).setCapture){d(this).get(0).setCapture()}d(document).bind({mousemove:function(F){var H=F.clientX-D,G=F.clientY-z,E;E=f.vertical===true?G:H;u.scrollPos(E)},mouseup:function(){if(s.get(0).releaseCapture){s.get(0).releaseCapture()}d(this).unbind("mousemove mouseup")}});return false});m.click(function(){var z=s.position()[l];u.scrollPos(z-10)});i.click(function(){var z=s.position()[l];u.scrollPos(z+10)});d(o).mousewheel(function(z,B){var A=s.position()[l];B>0?u.scrollPos(A-10):u.scrollPos(A+10);z.preventDefault()})})},photoAlbum:function(g){var e={photoPanel:".photo-origin",dataPanel:".photo-info",prevButton:[".curPrevBtn",".prevBtn"],nextButton:[".curNextBtn",".nextBtn"],vertical:false,holdPage:false,mouseWheel:false,animate:{opacity:false,speed:400},dataAttr:"data-origin",numPanel:".number",totalPanel:".total",triggerClass:"current",pages:{pagePanel:".photo-page",numTag:"a",triggerClass:"current-page"},operate:function(){}},f=d.extend(true,e,g);return this.each(function(G,v){var y=d(v).find("ul:first"),h=y.find("li"),m=y.parent(),o=h.length,D=d(f.photoPanel).parent().width(),z=d(f.photoPanel).parent().height(),w=0,r=0,q=0,F=0,u=0,i=0,B=0,t=1,l="",A="left",j=[],E=null,p=null,C=null,n=null,s=null;q=B=f.holdPage===true?(isNaN(location.hash.slice(3))||d.trim(location.hash.slice(3))===""?0:parseInt(location.hash.slice(3))):0;C=function(x){f.animate.opacity===true?d(x).css("opacity",0):0};p=function(x){f.holdPage===true?location.href=location.href.replace(location.hash,"#p="+x):0;C(j[x]);E=d.parseJSON(h.eq(x).attr(f.dataAttr));d(f.photoPanel).children("img").remove().end().prepend(j[x]).children("img").animate({opacity:1},f.animate.speed);d(f.dataPanel).html(E.data)};if(f.vertical===true){A="top";r=h.eq(0).outerHeight(true);w=m.height();y.height(o*r)}else{r=h.eq(0).outerWidth(true);w=m.width();y.width(o*r)}i=Math.ceil(w/r);u=i-3;d.each(h,function(H,J){var x=new Image(),I=null;I=d.parseJSON(d(J).attr(f.dataAttr));x.src=I.src;if(x.complete){if(x.width>D){x.width=D}if(x.height>z){x.height=z}}else{x.onload=function(){if(x.width>D){x.width=D}if(x.height>z){x.height=z}x.onload=null}}C(x);j[H]=x});p(B);h.eq(0).addClass(f.triggerClass);d(f.totalPanel).html(o);if(f.pages.numTag==="a"){d.each(h,function(H,x){l+='<a href="javascript:;">'+(H+1)+"</a>"})}else{d.each(h,function(H,x){l+="<"+f.pages.numTag+">"+(H+1)+"</"+f.pages.numTag+">"})}d(f.pages.pagePanel).append(l).find(f.pages.numTag).bind("click",function(){var x=d(this).index();s.moveTo(q=x)}).eq(0).addClass(f.pages.triggerClass);n=d(f.pages.pagePanel).find(f.pages.numTag);s={moveTo:function(H){var x=r*o;f.operate(q,o);if(q>=o||q<0){t=1;q=q>=o-1?o-1:0;return false}p(H);d(f.numPanel).html(H+1);h.eq(H).addClass(f.triggerClass).siblings().removeClass(f.triggerClass);n.eq(H).addClass(f.pages.triggerClass).siblings().removeClass(f.pages.triggerClass);if(H<=Math.ceil(i/2)||x<=w){F=0}else{if(H===o-1){F=-(H-(u+2))*r}else{if(H===o-2){F=-(H-(u+1))*r}else{F=-(H-u)*r}}}this.anim(F)},anim:function(H){var x={};x[A]=H;y.animate(x,300,function(){t=1})}};s.moveTo(B);h.bind("click",function(){var x=d(this).index();if(t){t=0;s.moveTo(q=x)}});d.each(d.merge(f.prevButton,f.nextButton),function(x,H){if(x===0||x===1){d(H).bind("click",function(){if(t){t=0;s.moveTo(--q)}})}else{d(H).bind("click",function(){if(t){t=0;s.moveTo(++q)}})}if(f.mouseWheel===true){d(H).parent().mousewheel(function(I,J){if(t){t=0;J>0?s.moveTo(--q):s.moveTo(++q);I.preventDefault()}})}})})},picZoom:function(g){var e={smallPanel:".small-panel",largePanel:".large-panel",thumbPanel:".thumb-panel",dataAttr:"data-url",triggerClass:"current",ratio:0.5,prevButton:{enable:".prev-btn",disable:".un-prev-btn"},nextButton:{enable:".next-btn",disable:".un-next-btn"},glassStyle:{position:"absolute",opacity:0.5,filter:"alpha(opacity=50)",cursor:"move",background:"#ffff77"}},f=d.extend(true,e,g);return this.each(function(H,x){var w=d(x).find(f.smallPanel),q=d(x).find(f.largePanel),h=d(x).find(f.thumbPanel),B=h.find("li"),t=w.find("img"),j=q.find("img"),G=d('<div class="glass-panel"></div>'),D=t.outerWidth(),E=t.outerHeight(),i=j.outerWidth(),l=j.outerHeight(),C=D*f.ratio,n=E*f.ratio,A=D-C,z=E-n,o=t.offset().left,y=t.offset().top,r=h.width(),p=B.eq(0).outerWidth(),u=null,m=B.length,F=Math.floor(r/p),s=0,v=1;j.css({position:"absolute",top:0,left:0}).parent().css({width:i*f.ratio,height:l*f.ratio});G.css(f.glassStyle).css({width:C,height:n});if(p*m<=r){d(f.prevButton.disable+","+f.nextButton.disable).show();d(f.prevButton.enable+","+f.nextButton.enable).hide()}else{d(f.prevButton.enable).hide();d(f.prevButton.disable).show();B.parent().width(p*m)}u={setUrl:function(K){var J=B.eq(K),I=J.attr(f.dataAttr);J.addClass(f.triggerClass).siblings().removeClass(f.triggerClass);t.attr("src",I.split("|")[0]);j.attr("src",I.split("|")[1])},moveTo:function(I){if(I>m-F){s=m-F;v=1;return false}else{if(I<0){s=0;v=1;return false}}this.anim()},anim:function(){var I={};I.left=-p*s;B.parent().animate(I,300,function(){v=1;if(s===m-F){d(f.nextButton.enable+","+f.prevButton.disable).hide();d(f.nextButton.disable+","+f.prevButton.enable).show()}if(s>0&&s<m-F){d(f.nextButton.disable+","+f.prevButton.disable).hide();d(f.nextButton.enable+","+f.prevButton.enable).show()}if(s===0){d(f.nextButton.disable+","+f.prevButton.enable).hide();d(f.nextButton.enable+","+f.prevButton.disable).show()}})}};u.setUrl(0);B.bind("mouseover",function(){var I=d(this).index();u.setUrl(I)});h.on({click:function(I){var J=d(I.target);if(J.closest(f.prevButton.enable).length>0&&v){v=0;u.moveTo(--s)}else{if(J.closest(f.nextButton.enable).length>0&&v){v=0;u.moveTo(++s)}}}},f.prevButton.enable+","+f.nextButton.enable);w.bind({mouseenter:function(){d(this).append(G);q.show()},mouseleave:function(){d(this).find(".glass-panel").remove();q.hide()},mousemove:function(L){var K=L.pageX-o-C/2,J=L.pageY-y-n/2,I=0,M=0;if(K<0){K=0}else{if(K>A){K=A}}if(J<0){J=0}else{if(J>z){J=z}}I=K/D;M=J/E;G.css({left:K,top:J});j.css({left:-I*i,top:-M*l})}})})},checkValue:function(g){var e={defaultValue:[],focusCss:{},blurCss:{}},f;f=d.extend(true,e,g);return this.each(function(i,j){var h=f.defaultValue.length?d.trim(f.defaultValue[i]):d.trim(d(this).val());d(j).attr("data-j-vid",0);d(j).bind({keyup:function(){d(this).attr("data-j-vid",1)},focus:function(){var l=d.trim(d(this).val());if(l===h&&d(this).attr("data-j-vid")==="0"){d(this).val("")}if(!d.isEmptyObject(f.focusCss)){d(j).css(f.focusCss)}},blur:function(){var l=d.trim(d(this).val());if(l===""){d(this).val(h).attr("data-j-vid",0)}if(!d.isEmptyObject(f.blurCss)){d(j).css(f.blurCss)}}})})}})})(jQuery);
