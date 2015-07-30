/*
 * @xyxy commmon jquery plugin, based in jquery-1.8.3
 * @powered by fangweng
 * @author zhanghaitao
 * http://www.cnblogs.com/tinkbell/
*/
(function($){

    $.extend({
    
        isIE6: function(){
            return !-[1,] && !window.XMLHttpRequest;
        },
        cookie: function(name, value, opts){
        
            var defaultOptions = {
                    expires : 1,
                    domain  : document.domain,
                    path    : '/'
                },
                options = $.extend(defaultOptions, opts),
                cookieArr = document.cookie.split('; '),
                cookieValue = '',
                oDate = new Date();

            if(!arguments.length){
                return;
            }
            
            fn = {
                setCookie: function(name, value){
                    oDate.setTime(oDate.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                    cookieValue = encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';expires=' + oDate.toUTCString() + ';domain=' + options.domain + ';path=' + options.path;
                    document.cookie = cookieValue;
                },
                getCookie: function(name){
                    $.each(cookieArr, function(key, value){
                        if(decodeURIComponent(value.split('=')[0]) === name){
                            cookieValue = decodeURIComponent(value.split('=')[1]);
                        }
                    });
                    return cookieValue;
                },
                removeCookie: function(name){
                    this.setCookie(name, 1, options.expires = -1);
                }
            };
            if(!/undefined/.test(typeof value)){
                if(/string|number/.test(typeof value)){
                    fn.setCookie(name, value);
                }
                else if($.isPlainObject(value)){
                    $.each(value, function(key, value){
                        if(/expires/.test(key) && value === -1){
                            fn.removeCookie(name);
                        }
                    });
                }
                else{
                    return;
                }
            }
            else{
                return fn.getCookie(name);
            }
        }
    });
    
    //统一鼠标滚轮事件, $('node').mousewheel(function(event, delta, deltaX, deltaY){})
    var types = ['DOMMouseScroll', 'mousewheel'];
    if($.event.fixHooks){
        for( var i = types.length; i;){
            $.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
        }
    }
    $.event.special.mousewheel = {
        setup: function(){
            if(this.addEventListener){
                for( var i = types.length; i;){
                    this.addEventListener( types[--i], handler, false);
                }
            } else {
                this.onmousewheel = handler;
            }
        },
     
        teardown: function(){
            if (this.removeEventListener){
                for (var i = types.length; i;){
                    this.removeEventListener( types[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
        }
    };
    function handler(event) {
        var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';
     
        if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta / 120; }
        if ( orgEvent.detail     ) { delta = -orgEvent.detail / 3; }
     
        deltaY = delta;
    
        if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaY = 0;
            deltaX = -1 * delta;
        }
     
        if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY / 120; }
        if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1 * orgEvent.wheelDeltaX / 120; }

        args.unshift(event, delta, deltaX, deltaY);
     
        return ($.event.dispatch || $.event.handle).apply(this, args);
    }
    
	$.fn.extend({
    
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },
        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        },
		tab: function(opts){
        
			var defaultOptions = {
                    type            : 'mouseover', //事件类型
                    triggerClass    : 'current', //选项卡的默认class
                    tab             : 'ul:first > li',
                    panelClass      : 'panel',
                    defaultPanel    : 0, //显示指定索引值的面板, 默认为0
                    asyn            : {state: false, url: 'a.php', type: 'get', dataType: 'json', data: [], error: function(){}, success: function(jQ, data){}},
                    slideTab        : {trigger: '.factor', sliding: false, vertical: false, speed: 300},
                    opacity         : false,
                    delay           : 200, //在mouseover下的延迟时间, 单位毫秒
                    operate         : function(){} //切换结束时要执行的回调函数
                },
                toJson = null,
                options = $.extend(true, defaultOptions, opts);
            
			options.delay = options.type === 'click' ? 0 : options.delay;
            toJson = function(array){
                var length = array.length,
                    i = 0,
                    json = {};
                
                for(; i < length; i++){
                    
                    json[array[i].split('=')[0]] = array[i].split('=')[1];
                }
                return json;
            };
            
			return this.each(function(key, obj){
               var tabs = $(obj).find(options.tab),
                   items = $(obj).find('.' + options.panelClass),
                   time,
                   distance = 0,
                   dir = 'left',
                   data = {},
                   animFn = null,
                   switchFn = null,
                   timer = null;
 
                time = options.opacity === true ? 600 : 0;
                options.slideTab.sliding === true ? (options.slideTab.vertical === true ? 
                (distance = tabs.eq(0).outerHeight(), dir = 'top'): distance = tabs.eq(0).outerWidth()) : 0;
                
                animFn = function(n){
                    data[dir] = distance * n;
                    return data;
                };
                
                switchFn = function(n){
                
                    var dataArr = options.asyn.data,
                        dataStr = dataArr[n],
                        dataUrl = '',
                        dataObj = {};

                    tabs.eq(options.defaultPanel).attr('data-j-tab', 1);
                    tabs.eq(n).addClass(options.triggerClass).siblings().removeClass(options.triggerClass);
                    $(obj).find(options.slideTab.trigger).animate(animFn(n), options.slideTab.speed);
                  
                    if(options.asyn.state === true && tabs.eq(n).attr('data-j-tab') !== '1' && dataStr !== 0){
                        
                        dataUrl = options.asyn.url.split(',').length === 1 ? options.asyn.url.split(',')[0] : options.asyn.url.split(',')[n];
                        dataObj = dataStr.indexOf('&') > -1 ? toJson(dataStr.split('&')) : toJson(dataStr.split());
                        
                        $.ajax({
                            
                            url         : dataUrl,
                            type        : options.asyn.type,
                            data        : dataObj,
                            dataType    : options.asyn.dataType,
                            error       : function(){
                                options.asyn.error(items.eq(n));
                            },
                            success     : function(data){
                                tabs.eq(n).attr('data-j-tab', 1);
                                options.asyn.success(items.eq(n), data);
                            }
                        
                        });
                    }
                    
                    items.eq(n).fadeIn(time).siblings('.' + options.panelClass).hide();
                    options.operate(n);
                };
                
                switchFn(options.defaultPanel);
               
                tabs.bind(options.type, function(){
                    var index = $(this).index();
                    clearTimeout(timer);
                    timer = setTimeout(function(){
                        switchFn(index);
                    } , options.delay);
                });
                
                tabs.mouseout(function(){
                    clearTimeout(timer);
                    timer = null;
                });
            
            });
		},
		_slide: function(opts){ //针对部分广告焦点图, 作向后兼容性处理
        
            var defaultOptions = {
                    animate 		: false, //是否具有动画, 默认false
                    vertical		: false, //是否可以垂直播放, 默认false
                    leftButton		: '.left_button', //是否支持按钮, class或者id
                    rightButton		: '.right_button', //是否支持按钮, class或者id
                    trigger			: false, //是否自动生成手动切换的小图标, 默认false
                    triggerClass	: 'current', //手动切换的小图标class
                    type			: 'mouseover', //鼠标事件
                    dataAttr        : 'title', //放标题的属性名
                    dataPanel       : '.text', //放标题的容器选择器名字
                    auto            : true, //是否自动播放, 默认自动
                    speed           : 300,
                    time			: 3000 //图片切换的间隔时间
                },
                options = $.extend(defaultOptions, opts),
                delay = 200;
            
            delay = options.type === 'click' ? 0 : delay;

            return this.each(function(key, obj){
            
                var moveObj = $(obj).find('ul:first'),
                    slideItem = $(obj).find('ul:first > li'),
                    triggerItem = $(obj).find('ul:last > li'),
                    picItem = $(obj).find('img'),
                    length = slideItem.length,
                    timer = null,
                    fn = null,
                    size = slideItem.eq(0).height(),
                    dir = 'top',
                    mark = 1,
                    index = 0,
                    distance = 0;
                
                if(options.trigger === true){
                    var o = $(obj).find('ul:last');
                    slideItem.each(function(i){
                        if(!i){
                            o.append($('<li>').text(1).addClass(options.triggerClass));
                        }
                        else{
                            o.append($('<li>'+ (i + 1) +'</li>'));
                        }
                    });
                    
                    triggerItem = o.children();
                }
                
                if(options.leftButton && options.rightButton){
                    $(document).on({
                        click: function(event){
                            var target = $(event.target);
                            fn.clearTimer();
                            if(target.closest(options.leftButton).length > 0 && mark){
                                mark = 0;
                                index === 0 ? fn.moveTo(index = length - 1) : fn.moveTo(--index);
                            }
                            else if(target.closest(options.rightButton).length > 0 && mark){
                                mark = 0;
                                index === length - 1 ? fn.moveTo(index = 0) : fn.moveTo(++index);
                            }
                        },
                        mouseout: function(){
                            fn.auto();
                        }
                    }, options.leftButton + ',' + options.rightButton);
                }
                
                fn = {
                    moveTo: function(w){
                        index = w;
                        distance = - w * size;
                        triggerItem.eq(w).addClass(options.triggerClass).siblings().removeClass(options.triggerClass);
                        $(options.dataPanel).html(picItem.eq(w).attr(options.dataAttr));
                        if(options.animate === true){
                            this.anim();
                        }
                        else{
                            moveObj.css(dir, distance);
                        }
                    },
                    anim: function(){
                        var data = {};
                        data[dir] = distance;
                        moveObj.animate(data, options.speed, function(){ mark = 1; });
                    },
                    auto: function(){
                        var self = this;
                        this.clearTimer();
                        timer = setInterval(function(){
                            index === length - 1 ? index = 0 : index++;
                            self.moveTo(index);
                        }, options.time);
                    },
                    start: function(){
                        this.clearTimer();
                        if(options.auto === true){
                            this.auto();
                        }
                    },
                    clearTimer: function(){
                        clearTimeout(timer);
                        clearInterval(timer);
                        timer = null;
                    }
                
                };
                
                triggerItem.bind(options.type, function(){
                    var index = $(this).index();
                    fn.clearTimer();
                    timer = setTimeout(function(){
                        fn.moveTo(index);
                    }, delay);
                    
                });
               
                triggerItem.mouseout(function(){
                    fn.start();
                });
                
                slideItem.bind({
                    mouseover: function(){
                        fn.clearTimer();
                    },
                    mouseout: function(){
                        fn.start();
                    }
                });
                
                if(options.animate === true){
                   if(options.vertical !== true){
                      dir = 'left';
                      size = slideItem.eq(0).width();
                      moveObj.css('width', length * size);
                   }
                }
                
                fn.start();

            });
        }, 
         slide: function(opts){
        
            var defaultOptions = {
                    animate 		: false, //是否具有动画, 默认false
					opacity			: false, //是否具有透明度变化, 此项和animate只能存其一, 默认false
                    vertical		: false, //是否可以垂直播放, 默认false
                    leftButton		: '.left_button', //是否支持按钮, class或者id
                    rightButton		: '.right_button', //是否支持按钮, class或者id
                    trigger			: false, //是否自动生成手动切换的小图标, 默认false
					loop			: false, //是否打开循环模式, 默认false
                    triggerClass	: 'current', //手动切换的小图标class
                    type			: 'mouseover', //鼠标事件
                    dataAttr        : 'title', //放标题的属性名
                    dataPanel       : '.text', //放标题的容器选择器名字
                    auto            : true, //是否自动播放, 默认自动
                    speed           : 300,
                    time			: 3000 //图片切换的间隔时间
                },
                options = $.extend(defaultOptions, opts),
                delay = 200;
            
            delay = options.type === 'click' ? 0 : delay;
			
			if(options.loop === false){
				return this._slide(options);
			}
            return this.each(function(key, obj){
            
                var moveObj = $(obj).find('ul:first'),
                    slideItem = $(obj).find('ul:first > li'),
                    triggerItem = $(obj).find('ul:last > li'),
                    picItem = $(obj).find('img'),
                    length = k = slideItem.length,
                    timer = null,
                    fn = null,
                    size = slideItem.eq(0).height(),
                    dir = 'top',
					current = {},
					reset = {},
                    mark = 1,
                    index = 0,
					curIndex = 0,
                    distance = 0;
                
                if(options.trigger === true){
                    var o = $(obj).find('ul:last');
                    slideItem.each(function(i){
                        if(!i){
                            o.append($('<li>').text(1).addClass(options.triggerClass));
                        }
                        else{
                            o.append($('<li>'+ (i + 1) +'</li>'));
                        }
                    });
                    
                    triggerItem = o.children();
                }
				
				if(options.opacity === true){
					options.animate = false; //打开透明度变化时, 运动失去效果
					slideItem.each(function(key, obj){
						$(obj).css({position: 'absolute', zIndex: k--});
						if(key){
							$(obj).css('opacity', 0);
							current['opacity'] = 0;
							reset['opacity'] = 1;
						}
					});
				}
				
                if(options.animate === true){
					slideItem.first().clone().addClass('first-clone').appendTo(moveObj)
					.end().end().last().clone().addClass('last-clone').prependTo(moveObj);
					
                   if(options.vertical === false){
                      dir = 'left';
                      size = slideItem.eq(0).width();
                      moveObj.css('width', (length + 2 ) * size).css(dir, - size);
                   }else{
					  moveObj.css('height', (length + 2 ) * size).css(dir, - size);
				   }
                }
				
                if(options.leftButton && options.rightButton){
                    $(document).on({
                        click: function(event){
                            var target = $(event.target);
                            fn.clearTimer();
                            if(target.closest(options.leftButton).length > 0 && mark){
                                mark = 0;
                                fn.moveTo(--index);
                            }
                            else if(target.closest(options.rightButton).length > 0 && mark){
                                mark = 0;
                                fn.moveTo(++index);
                            }
                        },
                        mouseout: function(){
                            fn.start();
                        }
                    }, options.leftButton + ',' + options.rightButton);
                }
                
                fn = {
                    moveTo: function(w){
						index = w;
						if(options.animate === true){
							distance = - (index + 1) * size;
							w = (index === length ? 0 : (index < 0 ? length - 1 : w ));
							this.anim();
							
						}else if(options.opacity === true){
							w = index > length - 1 ? 0 : index;
							this.setOpacity();
							
						}else{
							w = index = (index > length - 1 ? 0 : (index < 0 ? length - 1 : w ));
							distance = - w * size;
							moveObj.css(dir, distance);
							mark = 1;
						}
						
						triggerItem.eq(w).addClass(options.triggerClass).siblings().removeClass(options.triggerClass);
						$(options.dataPanel).html(picItem.eq(w).attr(options.dataAttr));
                    },
                    anim: function(){
                        var data = {};
                        data[dir] = distance;
                        moveObj.animate(data, options.speed, function(){ 
							mark = 1;
							if(index === length){
								index = 0;
								moveObj.css(dir, - size);
							}else if(index < 0){
								index = length - 1;
								moveObj.css(dir, - length * size);
							}
						});
                    },
					setOpacity: function(){
						var temp = curIndex;
                        if(index >= length){
                            index = 0;
                        }else if(index < 0){
							index = length - 1;
						}
						curIndex = index;
                        if(temp !== curIndex){
                            slideItem.eq(temp).css({zIndex: 1}).animate(current, options.speed, function(){
                                mark = 1;
                            });
                            slideItem.eq(curIndex).css({position:'absolute', zIndex: length}).animate(reset, options.speed);
                        }
					},
                    auto: function(){
                        var self = this;
                        this.clearTimer();
                        timer = setInterval(function(){
                            index === (options.animate === true ? length : length - 1) ? index = 0 : index++;
                            self.moveTo(index);
                        }, options.time);
                    },
                    start: function(){
                        this.clearTimer();
                        if(options.auto === true){
                            this.auto();
                        }
                    },
                    clearTimer: function(){
                        clearTimeout(timer);
                        clearInterval(timer);
                        timer = null;
                    }
                
                };
                
                triggerItem.bind(options.type, function(){
                    var index = $(this).index();
                    fn.clearTimer();
                    timer = setTimeout(function(){
                        fn.moveTo(index);
                    }, delay);
                    
                });
               
                triggerItem.mouseout(function(){
                    fn.start();
                });
                
                slideItem.bind({
                    mouseover: function(){
                        fn.clearTimer();
                    },
                    mouseout: function(){
                        fn.start();
                    }
                });
				
                fn.start();

            });
        },
        loopScroll: function(opts){
        
            var defaultOptions = {
                    amount          : 1, //每次的滚动个数, 默认是1
                    speed           : 300, //滚动速度常数, 默认是200
                    time            : 3000, //每次滚动间隔时间, 默认为3秒
                    leftButton      : '.roll_lbtn', //向左滚动按钮, id或者class
                    rightButton     : '.roll_rbtn', //向右滚动按钮, id或者class
                    operate         :  function(){},
                    vertical        : false, //是否垂直滚动, 默认不垂直滚动
                    auto            : true //是否自动滚动
                },
                options = $.extend(defaultOptions, opts);
           
            return this.each(function(key, obj){
                var scrollBox = $(obj).find('ul:first'),
                    item = $(obj).find('li'),
                    length = item.length,
                    pro = options.vertical === true ? 'height' : 'width',
                    index = 0,
                    prevAllow = 1,
                    nextAllow = 1,
                    target,
                    maxIndex ,
                    variation,
                    listSize,
                    wrapSize,
                    dir,
                    fn,
                    timer;
                 
                $(obj).css(pro, 9999);
                
                if(options.vertical === true){
                    listSize = scrollBox.innerHeight();
                    dir = 'top';
                    wrapSize = $(obj).parent().height();
                }
                else{
                    listSize = scrollBox.innerWidth();
                    dir = 'left';
                    wrapSize = $(obj).parent().width();
                }
                
                variation = parseInt(listSize / length) * options.amount;

                maxIndex  = parseInt(listSize / variation);
                
                if(listSize <= wrapSize){
					return;
				}
                
                scrollBox.clone(true).insertAfter(scrollBox);
                
                fn = {
                    clearTimer: function(){
                        clearInterval(timer);
                        timer = null;
                    },
                    moveTo: function(n){
                        if(n > maxIndex){
                            index = n = 1;
                            $(obj).css(dir, 0);
                        }
                        else if(n < 0){
                            index = n = maxIndex - 1;
                            $(obj).css(dir, - variation * maxIndex);
                        }
                        
                        target = - variation * n;
                        this.anim();
                    },
                    anim: function(){
                        var data = {};
                        data[dir] = target;
                        $(obj).animate(data, options.speed, function(){
                            prevAllow = nextAllow = 1;
                            options.operate(index, maxIndex);
                        });
                    },
                    auto: function(){
                        var self = this;
                        timer = setInterval(function(){
                            self.moveTo(++index);
                        }, options.time);
                    },
                    start: function(){
                        this.clearTimer();
                        if(options.auto === true){
                            this.auto();
                        }
                    }
                };
                
                $(obj).bind({
                    mouseover: function(){
                        fn.clearTimer();
                    },
                    mouseout: function(){
                        fn.start();
                    }
                });
                
                $(document).on({
                    click: function(event){
                        var target = $(event.target);
                        if(target.closest(options.leftButton).length > 0){
                            if(prevAllow){
                                prevAllow = 0;
                                fn.moveTo(--index);
                            }
                        }
                        else if(target.closest(options.rightButton).length > 0){
                            if(nextAllow){
                                nextAllow = 0;
                                fn.moveTo(++index);
                            }
                        }
                        
                        fn.clearTimer();
                    },
                    mouseover: function(){
                        fn.clearTimer();
                    },
                    mouseout: function(){
                        fn.start();
                    }
                }, options.leftButton + ',' + options.rightButton);
                
                fn.start();

            });

        },
        textScroll: function(opts){
        
            var defaultOptions = {
                    panel       : 'li:first',
                    time        : 3000,
                    speed       : 600,
                    vertical    : true
            },
            options = $.extend(defaultOptions, opts),
            isIE6 = $.isIE6();
            
            if(isIE6){
                try {
                    document.execCommand('BackgroundImageCache', false, true);
                }
                catch(e){}
            }
            
            return this.each(function(key, obj){
                
                var timer = null,
                    oNode = $(obj).find(options.panel),
                    height = oNode.outerHeight(),
                    width = oNode.outerWidth(),
                    length = oNode.siblings().andSelf().length,
                    pos,
                    data = {};
                    
                 if(options.vertical === true){
                    if(height * length <= $(obj).outerHeight()){
                        return false;
                    }
                    else{
                        pos = 'marginTop';
                        data[pos] = -oNode.outerHeight();
                    }
                 }
                 else{
                    if(width * length <= $(obj).outerWidth()){
                        return false;
                    }
                    else{
                        pos = 'marginLeft';
                        data[pos] = -oNode.outerWidth();
                    }
                 }
                 
                 $(obj).hover(function(){
                    clearInterval(timer);
                }, function(){
                        timer = setInterval(function(){
                            var node = $(obj).find(options.panel);
                            node.animate(data, options.speed, function(){
                                node.css(pos, 0).appendTo(oNode.parent());
                            });
                    }, options.time);
                    
                }).trigger('mouseleave');
            
            });
        },
         smartShow: function(opts){
            
            var defaultOptions = {
                    url         : 'a.php',
                    panel       : '.smart-item',
                    param       : 'key',
                    dataWrap    : 'li',
                    dataType    : 'json',
                    wrapClass   : 'current',
                    success     : function(){},
                    operate     : function(){}
                },
                options = $.extend(defaultOptions, opts);
            
            return this.each(function(key, obj){
                
                var node = $(options.panel),
                    fn = {},
                    temp,
                    getData = null,
					showList = null,
                    autoShow = false,
					isChrome = navigator.userAgent.indexOf('Chrome'),
                    index = -1;
                
                $(obj).attr('data-smart', true);
                $(options.panel).attr('data-smartpanel', true);
                getData = function(value){
                    $.ajax({
                        type: 'get',
                        url : options.url,
                        data: options.param + '=' + value,
                        dataType: options.dataType,
                        success: function(data){
                            if(data){
                                options.success(data);
                                autoShow = true;
                                index = -1;
                                var nodes = $(options.panel).children();
                                if(nodes.length){
                                    nodes.bind({
                                        mouseover: function(){
                                            index = $(this).index();
                                            $(this).addClass(options.wrapClass).siblings().removeClass(options.wrapClass);
                                        },
                                        click: function(){
                                           $(obj).val($(this).html().replace(/<[^>]+>/g, ''));
                                           $(options.panel).hide();
                                           autoShow = false;
                                           options.operate(index, $(this).html());
                                        }
                                    });
                                }
                            }
                        }
                    });
                };
				
                showList = function(val){
					(temp != val && val != '') ? getData(val) : 0;
				};
				
                $(obj).bind({
                    keydown: function(){
                        temp = $(obj).val();
                    },
                    keyup: function(event){
                    
                        var item = node.find(options.dataWrap),
                            keyCode = event.keyCode,
                            value = $.trim($(obj).val()),
                            fn = {},
                            length = item.length;
                            
                        fn = {
                            moveTo: function(k){
                                if(k < 0){
                                    index = k = length - 1;
                                }
                                if(k > length - 1){
                                    index = k = 0;
                                }
                                
                                item.eq(k).addClass(options.wrapClass).siblings().removeClass(options.wrapClass);
                                $(obj).val(item.eq(k).html().replace(/<[^>]+>/g, ''));
                            }
                            
                        };
                        
                        if(keyCode === 38){
                            if(!autoShow){
                                return;
                            }
                            fn.moveTo(--index);
                            return false;
                        }
                        else if(keyCode === 40){
                            if(!autoShow){
                                return;
                            }
                            fn.moveTo(++index);
                            return false;
                        }
                        else if(keyCode === 13){
                            //$(options.panel).hide();
                            autoShow = false;
							showList(value);
                            options.operate(index, item.eq(index).html().replace(/<[^>]+>/g, ''));
                            return false;
                        }
                        if(value == ''){
                            $(options.panel).html('').hide();
                            autoShow = false;
                        }
						showList(value);
                    },
                    focus: function(){
                        var value = $.trim($(obj).val());
                        showList(value);
                    }
                });
				
                if(isChrome){
					$(obj).bind('input', function(){
						var value = $.trim($(obj).val());
                        showList(value);
					});
				}
				
                $(document).bind('click', function(event){
                    var target = $(event.target);
                    if(target.attr('data-smart') != 'true' && target.parent().attr('data-smartpanel') != 'true'){
                        $(options.panel).hide();
                        autoShow = false;
                        index = -1;
                    }
                });
                
            });
            
        },
        toPlace: function(place, opts){
        
            var defaultOptions = {
                    top     : 100,
                    bottom  : 100,
                    animate : false,
                    speed   : 0
                },
                options = $.extend(defaultOptions, opts),
                clientHeight = $(window).height(),
                scrollHeight = $(document).height();
            
            return this.each(function(key, obj){
                 
                  var param = options.animate === true ? 'slow' : 0,
                      fn = {
                        back: function(){
                            var data;
                            data = place === 'top' ? 0 : scrollHeight;
                            $('body, html').animate({scrollTop: data}, options.speed);
                        },
                        roll: function(place){
                            $(window).bind('scroll', function(){
                                var top = $(this).scrollTop(),
                                    height = top + clientHeight;
                                    
                                if(place === 'top'){
                                    if(top > options.top){
                                        $(obj).fadeIn(param);
                                    }
                                    else if(top < 50){
                                        $(obj).fadeOut(param);
                                    }
                                }
                                else{
                                    if(scrollHeight - height > options.bottom){
                                        $(obj).fadeIn(param);
                                    }
                                    else if(scrollHeight - height < 50){
                                        $(obj).fadeOut(param);
                                    }
                                }
                            });
                        }
                    };

                $(obj).bind('click', function(){
                    fn.back();
                });
                
                if(place === 'top'){
                    fn.roll(place);
                }
                else if(place === 'bottom'){
                    fn.roll(place);
                }
            
            });

        },
        loopSlide: function(opts){
        
            var defaultOptions = {
                    vertical		: false, //是否可以垂直播放, 默认false
                    opacity         : false, //是否透明度变化
                    trigger			: false, //是否自动生成手动切换的小图标, 默认false
                    leftButton      : '.left_button', //左方向按钮的class或者id
                    rightButton     : '.right_button', //右方向按钮的class或者id
                    triggerClass	: 'current', //手动切换的小图标class
                    type			: 'mouseover', //鼠标事件
                    dataAttr        : 'title', //放标题的属性名
                    dataPanel       : '.text', //放标题的容器选择器名字
                    auto            : true, //是否自动播放, 默认自动
                    speed           : 400,
                    time			: 3000, //图片切换的间隔时间
					operate         : function(){}
                },
                options = $.extend(defaultOptions, opts),
                delay = 200;
                
                delay = options.type === 'click' ? 0 : delay;
            
            return this.each(function(key, obj){
                var slideItem = $(obj).children().eq(0).children(),
                    one = slideItem.eq(0),
                    triggerItem = $(obj).children().eq(1).children(),
                    picItem = $(obj).find('img'),
                    length = slideItem.length,
                    timer = null,
                    data = {},
                    reset = {},
                    fn = null,
                    dir = 'left',
                    mark = 1,
                    curIndex = 0,
                    index = 0,
                    distance = 0;
                    
                if(options.trigger === true){
                    var o = $(obj).find('ul:last');
                    slideItem.each(function(i){
                        if(!i){
                            o.append($('<li>').text(1).addClass(options.triggerClass));
                        }
                        else{
                            o.append($('<li>'+ (i + 1) +'</li>'));
                        }
                    });
                    
                    triggerItem = o.children();
                }
                
                if(options.vertical === true){
                    distance = one.height();
                    dir = 'top';
                }
                else{
                    distance = one.width();
                }
                
                if(options.leftButton && options.rightButton){
                    $(document).on({
                        click: function(event){
                            var target = $(event.target);
                            fn.clearTimer();
                            
                            if(target.closest(options.leftButton).length > 0 && mark){
                                mark = 0;
                                index === 0 ? fn.moveTo(index = length - 1) : fn.moveTo(--index);
                            }
                            else if(target.closest(options.rightButton).length > 0 && mark){
                                mark = 0;
                                index === length - 1 ? fn.moveTo(index = 0) : fn.moveTo(++index);
                            }
                        },
                        mouseout: function(){
                            fn.auto();
                        }
                    }, options.leftButton + ',' + options.rightButton);
                }

                slideItem.each(function(key, obj){
                    if(key){
                        if(options.opacity !== true){
                            $(obj).css('position', 'absolute').css(dir, distance);
                            data[dir] = - distance;
                            reset[dir] = 0;
                        }
                        else{
                            $(obj).css('opacity', 0);
                            data['opacity'] = 0;
                            reset['opacity'] = 1;
                        }
                    }
                    
                });
                
                fn = {
                    clearTimer: function(){
                        clearTimeout(timer);
                        clearInterval(timer);
                        timer = null;
                    },
                    moveTo: function(w){
                        index = w;
                        triggerItem.eq(w).addClass(options.triggerClass).siblings().removeClass(options.triggerClass);
                        $(options.dataPanel).html(picItem.eq(w).attr(options.dataAttr));
                        this.anim();
                    },
                    anim: function(){
                        var temp = curIndex;
                        if(index >= length - 1){
                            curIndex = length - 1;
                        }else{
                            curIndex = index;
                        }
                        if(temp !== curIndex){
                            slideItem.eq(temp).css({zIndex: 1}).animate(data, options.speed, function(){
                                mark = 1;
                                if(options.opacity !== true){
                                    slideItem.eq(temp).css(dir, distance);
                                }
                            });
                            slideItem.eq(curIndex).css({position:'absolute', zIndex: 2}).animate(reset, options.speed, function(){
								options.operate(curIndex, length);
							});
                        }
                    },
                    start: function(){
                         fn.clearTimer();
                        if(options.auto === true){
                            this.auto();
                        }
                    },
                    auto: function(){
                        var self = this;
                        this.clearTimer();
                        timer = setInterval(function(){
                            index >= length - 1 ? index = 0 : index++;
                            self.moveTo(index);
                        }, options.time);
                    }
                    
                };
                
                triggerItem.bind(options.type, function(){
                    var index = $(this).index();
                    fn.clearTimer();
                    timer = setTimeout(function(){
                        fn.moveTo(index);
                    }, delay)
                });
                
                triggerItem.mouseout(function(){
                    fn.start();
                });
                
                slideItem.bind({
                    mouseover: function(){
                        fn.clearTimer();
                    },
                    mouseout: function(){
                        fn.start();
                    }
                });
                
                fn.start();
            
            });

        },
        dialog: function(opts){
        
            var defaultOptions = {
                    title           : '对话框', //对话框标题
                    content         : 'hello world !', //对话框内容
                    container       : '.dialog-bd', //对话框内容容器的class或者id
                    close           : '.dialog-close', //对话框关闭按钮的class或者id
                    confirm         : '.dialog-confirm', //对话框确认按钮的class或者id
                    cancel          : '.dialog-cancel', //对话框取消按钮的class或者id
                    opacity         : 0.1,
                    operate         : function(){}, //点击确定按钮触发的操作
                    animate         : false, //是否支持动画, 默认无动画
                    mask            : true //是否打开遮罩层, 默认打开
                },
                options = $.extend(defaultOptions, opts);

            this.find(options.container).html(options.content);
                
            var docHeight = $(document).height(),
                height = this.height(),
                width = this.width(),
                top = $(document).scrollTop() + $(window).height() / 2 - height / 2,
                left = $(document).width() / 2 - width / 2,
                maskCss = {
                  position          : 'absolute',
                  top               : 0,
                  left              : 0,
                  width             : '100%',
                  height            : docHeight,
                  backgroundColor   : '#000',
                  opacity           : 0,
                  filter            : 'alpha(opacity=' + options.opacity * 100 + ')',
                  zIndex            : 100000000
                },
                popCss = {
                  display           : 'block',
                  position          : 'absolute',
                  top               : top - 30,
                  left              : left,
                  overflow          : 'hidden',
                  zIndex            : 100000001
                },
                fn = null,
                self = this,
                maskId = 'tinkerMask' + (+ new Date()),
                mask = $('<div id="' + maskId + '">');
                    
                fn = {
                    showMask: function(){
                        mask.appendTo($('body')).css(maskCss);
                    },
                    anim: function(top, opacity){
                        mask.animate({opacity: opacity}, 500);
                        self.animate({top: top, opacity: 1}, 400, 'linear');
                    },
                    showDialog: function(){
                        self.css(popCss);
                        if(options.animate === true){
                            if(options.mask === true){
                                this.showMask();
                                this.anim(top, options.opacity);
                            }
                            else{
                                this.anim(top);
                            }
                        }
                        else{
                           if(options.mask === true){
                                maskCss.opacity = options.opacity;
                                this.showMask();
                                self.css('top', top);
                            }
                            else{
                                self.css('top', top);
                            } 
                        }
                    },
                    closeDialog: function(callback){
                        var callFn = function(){
                                if(callback){
                                    options.operate(maskId);
                                }
                            };
                        
                        if(options.animate === true){
                            self.animate({top: popCss.top, opacity: 0}, 600, function(){
                                self.css({display: 'none'});
                                callFn();
                            });
                            $('#' + maskId).animate({opacity: 0}, 200, function(){
                                $('#' + maskId).remove();
                            });
                        }
                        else{
                            self.hide();
                            $('#' + maskId).remove();
                            callFn();
                        }
                        
                    }

                };
                
                fn.showDialog();
                this.drag({
                    operate: function(pos){
                        popCss.top = pos.top - 30;
                    }
                });
                
                this.bind('click', function(event){
                    var target = $(event.target),
                        closeCond = target.hasClass(options.close.slice(1)) || 
                                     options.close.slice(1) === target.attr('id') || 
                                     target.hasClass(options.cancel.slice(1)) || 
                                     options.cancel.slice(1) === target.attr('id'),
                                     
                        confirmCond = target.hasClass(options.confirm.slice(1)) || 
                                      options.confirm.slice(1) === target.attr('id');
                                     
                    if(closeCond){
                        fn.closeDialog();
                        self.unbind('click');
                    }
                    else if(confirmCond){
                        fn.closeDialog(options.operate);
                        self.unbind('click');
                    }
                });

        },
        drag: function(opts){
            
            var defaultOptions = {
                parent      :   true,
                operate     :   undefined
            },
            options = $.extend(defaultOptions, opts);
            
            return this.each(function(key, obj){
            
                var selfHeight = $(obj).height(),
                    selfWidth = $(obj).width(),
                    parent = $(obj).offsetParent(),
                    node,
                    pos = {
                        top: 0,
                        left: 0
                    },
                    width,
                    height,
					diffWidth,
					diffHeight;
                    
                $(obj).css({position: 'absolute'}); 
                
                if(parent.css('position').toLowerCase() === 'relative' || parent.css('position').toLowerCase() === 'absolute'){
                    width = parent.width();
                    height = parent.height();
                }
                else{
                    width = $(window).width();
                    height = $(document).height();
                }
                
                diffWidth = width - selfWidth - 2;
                diffHeight = height - selfHeight - 2;
                
                node = options.parent === true ? $(obj).children().eq(0) : $(obj);
                
                node.bind('mousedown', function(event){
                
                    var node = options.parent === true ? $(this).parent() : $(this),
                        left = node.position().left,
                        top = node.position().top,
                        tempLeft = event.pageX - left,
                        tempTop = event.pageY - top,
                        flag = 0;

                    if(node.get(0).setCapture){
                        node.get(0).setCapture();
                    }
                    
                    $(document).bind({
                         mousemove: function(event){
                            var left = event.pageX - tempLeft,
                                top = event.pageY - tempTop;
                                
                            flag = 1;
                            
                            if(left < 0){
                                left = 0;
                            }
                            if(left >= diffWidth){
                                left = diffWidth;
                            }
                            if(top < 0){
                                top = 0;
                            }
                            if(top >= diffHeight){
                                top = diffHeight;
                            }
                            
                            pos.left = left;
                            pos.top = top;
                            $(obj).css({top: top, left: left});
                            
                        },
                        mouseup: function(){
                         if($(obj).get(0).releaseCapture){
                              $(obj).get(0).releaseCapture();
                           }
                            $(this).unbind('mousemove mouseup');
                            
                            if(typeof options.operate == 'function' && flag){
                                options.operate({top: pos.top, left: pos.left});
                            }
                            
                        }
                    
                    });
                    return false;
                 });
            
           });
        },
        monitor: function(target, opts){
            
           var defaultOptions = {
                
                dirWrap         : '.catalog', //目录列表父级
                listWrap        : 'li', //目录列表项
                triggerClass    : 'current', //当前目录的样式
                opacity         : false, //快速导航目录显示时,是否具有透明度效果
                disTop          : {minTop: 0, maxTop: 9999}, //距离顶部多少距离时, 隐藏快速导航目录
                topDiff         : 0, //快速导航目录项的最高父级的高度。此项仅对目录导航横向布局时有效  
                speed           : 400, //滚动条的速度
                animate         : true //是否具有动画滚动
            
            },
            options = $.extend(true, defaultOptions, opts);
            options.speed = options.animate === true ? options.speed : 0;
            
            return this.each(function(key, obj){
                
                var targetNode = $(obj).find(target),
                    listNode = $(options.dirWrap).find(options.listWrap),
                    tempArr = [],
                    length = 0,
                    time = 0,
					mark = 1,
                    current = null,
                    toPos = null,
                    rolling = null;
                
                $.each(targetNode, function(key, obj){
                
                    var top = Math.ceil($(obj).offset().top) - options.topDiff;
                    tempArr[key] = top;
                    listNode.eq(key).data('dataTop', top);
                    
                });
                
                length = tempArr.length;
                time = options.opacity === true ? 400 : 0;
                
                toPos = function(obj){
                    var data = parseInt(obj.data('dataTop'));
                    $('body, html').animate({scrollTop: data}, options.speed, function(){
						mark = 1;
					});
                };
                
                rolling = function(){
                
                    var temp = current, //保存上一次的节点
                        i = 0,
                        top = $(window).scrollTop();
                        
                    if(top >= tempArr[length - 1]){
                
                        current = listNode.eq(length - 1);
                        
                    }else{
                        for(; i < length - 1; i++){
                    
                            if(top >= tempArr[i] && top < tempArr[i + 1]){
                                current = listNode.eq(i); //保存当前找到的节点
                                break;
                            }
                        }
                    }
                    
                    if(top < options.disTop.minTop || top > options.disTop.maxTop){
                        
                        $(options.dirWrap).hide();
                        
                    }else{
                        
                        $(options.dirWrap).fadeIn(time);
                    }
                    
                    if(temp !== current){
                        if(temp){
                            temp.removeClass(options.triggerClass);
                        }
                        current.addClass(options.triggerClass);
                    }
                };
                
                $(options.dirWrap).bind('click', function(e){
                    var target = $(e.target).closest(options.listWrap);
                    if(mark && !$.isEmptyObject(target.get(0))){
						mark = 0;
						toPos(target);
					}
                });
                
                $(window).bind('scroll', rolling);
            
            });
            
        },
        scrollBar: function(opts){
            
            var defaultOptions = {
                content     :   '.conBox',
                bar         :   '.bar',
                preButton   :   '.prebtn',
                nextButton  :   '.nextbtn',
                vertical    :   true
            
            },
            options = $.extend(defaultOptions, opts);
            
            return this.each(function(key, obj){
                
                var conBox = $(obj).find(options.content),
                    bar = $(obj).find(options.bar),
                    preBtn = $(obj).find(options.preButton),
                    nextBtn = $(obj).find(options.nextButton),
                    
                    barParent = bar.offsetParent(),
                    conParent = conBox.offsetParent(),
                    
                    conDiffWidth = conBox.width() - conParent.width(),
                    conDiffHeight = conBox.height() - conParent.height(),
                    conDiff,
                    barDiff,
                    dir = 'left',
                    dist = 'width',
                    rate,
                    val,
                    fn = null;
                 
                 if(options.vertical === true){
                    conDiff = conDiffHeight;
                    dir = 'top';
                    dist = 'height',
                    rate = conParent.height() / conBox.height();
                    val = Math.max(20, barParent.height() * rate);
                 }
                 else{
                    conDiff = conDiffWidth;
                    rate = conParent.width() / conBox.width();
                    val = Math.max(20, barParent.width() * rate);
                 }

                 if(rate >= 1){
                    barParent.parent().hide();
                    return false;
                 }
                 
                 bar.css(dist, val);
                 
                 if(options.vertical === true){
                    barDiff = barParent.height() - bar.height();
                 }
                 else{
                    barDiff = barParent.width() - bar.width();
                 }
                 
                 fn = {
                    scrollPos: function(pos){
                        var value,
                            barCss = {},
                            conCss = {};
                           
                        if(pos < 0){
                            pos = 0;
                        }
                        if(pos >= barDiff){
                            pos = barDiff;
                        }
                        
                        barCss[dir] = pos;
                        bar.css(barCss);
                        
                        rate = pos / barDiff;
                        value = -rate * conDiff;
                        conCss[dir] = value;
                        conBox.css(conCss);
                    }
                 };
          
                bar.bind('mousedown', function(event){
                
                    var left = $(this).position().left,
                        top = $(this).position().top,
                        tempLeft = event.clientX - left,
                        tempTop = event.clientY - top;

                    if($(this).get(0).setCapture){
                        $(this).get(0).setCapture();
                    }
                    
                    $(document).bind({
                         mousemove: function(event){
                            var left = event.clientX - tempLeft,
                                top = event.clientY - tempTop,
                                result;
                                
                            result = options.vertical === true ? top : left;
                            fn.scrollPos(result);
                            
                        },
                        mouseup: function(){
                         if(bar.get(0).releaseCapture){
                              bar.get(0).releaseCapture();
                           }
                            $(this).unbind('mousemove mouseup');
                        }
                    
                    });
                    return false;
                 });
                 
                 preBtn.click(function(){
                    var value = bar.position()[dir];
                    fn.scrollPos(value - 10);
                 });
                 
                 nextBtn.click(function(){
                    var value = bar.position()[dir];
                    fn.scrollPos(value + 10);
                 });
                 
                 $(obj).mousewheel(function(event, delta){
                    var value = bar.position()[dir];
                    delta > 0 ? fn.scrollPos(value - 10) : fn.scrollPos(value + 10);
                    event.preventDefault();
                 });
            });
            
        },
        photoAlbum: function(opts){
            
            var defaultOptions = {

                photoPanel      : '.photo-origin',
                dataPanel       : '.photo-info',
                preButton       : ['.curPrevBtn', '.prevBtn'],
                nextButton      : ['.curNextBtn', '.nextBtn'],
                vertical        : false,
                holdPage        : false,
				mouseWheel		: false,
                animate         : {opacity: false, speed: 400},
                dataAttr        : 'data-origin',
                numPanel        : '.number',
                totalPanel      : '.total',
                triggerClass    : 'current',
                pages           : {
                    pagePanel       : '.photo-page',
                    numTag          : 'a',
                    triggerClass    : 'current-page'
                },
                operate         : function(){}
            },
            options = $.extend(true, defaultOptions, opts);
            
            return this.each(function(key, obj){
            
                var thumbList = $(obj).find('ul:first'),
                    thumbs = thumbList.find('li'),
                    thumbWrap = thumbList.parent(),
                    length = thumbs.length,
                    maxWidth = $(options.photoPanel).parent().width(),
                    maxHeight = $(options.photoPanel).parent().height(),
                    size = 0,
                    thumbSize = 0,
                    index = 0,
                    target = 0,
                    x = 0,
                    visNum = 0,
                    hashNum = 0,
                    mask = 1,//设置滚动速度标志
                    tp = '',
                    direc = 'left',
                    imgArray = [],
                    json = null,
                    setData = null,
                    setOpacity = null,
                    pageItem = null,
                    fn = null;
                    
                index = hashNum = options.holdPage === true ? (isNaN(location.hash.slice(3)) || $.trim(location.hash.slice(3)) === '' ? 0 : parseInt(location.hash.slice(3))) : 0;
                
                setOpacity = function(obj){
                    options.animate.opacity === true ? $(obj).css('opacity', 0) : 0;
                };
                
                setData = function(n){
                    location.href = location.hash === '' ? '#p=' + n : location.href.replace(location.hash, '#p=' + n);
                    setOpacity(imgArray[n]);
                    json = $.parseJSON(thumbs.eq(n).attr(options.dataAttr));
                    $(options.photoPanel).children('img').remove().end().prepend(imgArray[n]).children('img').animate({opacity: 1}, options.animate.speed);
                    $(options.dataPanel).html(json.data);
                };
                
                if(options.vertical === true){
                    direc = 'top';
                    thumbSize = thumbs.eq(0).outerHeight(true);
                    size = thumbWrap.height();
                    thumbList.height(length * thumbSize);
                    
                }else{
                    thumbSize = thumbs.eq(0).outerWidth(true);
                    size = thumbWrap.width();
                    thumbList.width(length * thumbSize);
                }
                
                visNum = Math.ceil(size / thumbSize);
                x = visNum - 3; //滚动方程
                
                $.each(thumbs, function(i, o){
                    var img = new Image(),
                        data = null;
                        
                    data = $.parseJSON($(o).attr(options.dataAttr));
                    img.src = data.src;
                    if(img.complete){
                        if(img.width > maxWidth){
                            img.width = maxWidth;
                        }
                        if(img.height > maxHeight){
                            img.height = maxHeight;
                        }
                    }else{
                        img.onload = function(){
                            if(img.width > maxWidth){
                                img.width = maxWidth;
                            }
                            if(img.height > maxHeight){
                                img.height = maxHeight;
                            }
                            img.onload = null;
                        }
                    }
                    
                    setOpacity(img);
                    imgArray[i] = img;
                });

                setData(hashNum);
                
                thumbs.eq(0).addClass(options.triggerClass);
                $(options.totalPanel).html(length);

                if(options.pages.numTag === 'a'){
                    $.each(thumbs, function(k, v){
                        tp += '<a href="javascript:;">' + (k + 1) + '</a>';
                    });
                }else{
                    $.each(thumbs, function(k, v){
                        tp += '<' + options.pages.numTag + '>' + (k + 1) + '</' + options.pages.numTag + '>';
                    });
                }
                
                $(options.pages.pagePanel).append(tp).find(options.pages.numTag).bind('click', function(){
                    var i = $(this).index();
                    fn.moveTo(index = i);
                }).eq(0).addClass(options.pages.triggerClass);
                
                pageItem = $(options.pages.pagePanel).find(options.pages.numTag);
                
                fn = {
                    
                    moveTo: function(n){
                        var wrapSize = thumbSize * length;
						options.operate(index, length); //每滚动一次图片要执行的回调函数
                        if(index >= length || index < 0){
                            mask = 1;
                            index = index >= length - 1 ? length - 1 : 0;
                            return false;
                        }
                        
                        setData(n);
                        
                        $(options.numPanel).html(n + 1);
                        thumbs.eq(n).addClass(options.triggerClass).siblings().removeClass(options.triggerClass);
                        pageItem.eq(n).addClass(options.pages.triggerClass).siblings().removeClass(options.pages.triggerClass);

                        if(n <= Math.ceil(visNum / 2) || wrapSize <= size){
                            target = 0;
                        }
                        else if(n === length - 1){
                            target = -(n - (x + 2)) * thumbSize;
                        }
                        else if(n === length - 2){
                            target = -(n - (x + 1)) * thumbSize;
                        }
                        else{
                            target = -(n - x) * thumbSize;
                        }
						
                        this.anim(target);
                    },
                    anim: function(dist){
                        var data = {};
                        data[direc] = dist;
                        thumbList.animate(data, 300, function(){
                            mask = 1;
                        });
                    }
                };
                
                fn.moveTo(hashNum);
                
                thumbs.bind('click', function(){
                    var k = $(this).index();
                    if(mask){
                        mask = 0;
                        fn.moveTo(index = k);
                    }
                });
                $.each($.merge(options.preButton, options.nextButton), function(i, item){
                    
                    if(i === 0 || i === 1){
                        $(item).bind('click', function(){
                            if(mask){
                                mask = 0;
                                fn.moveTo(--index);
                            }
                            
                        });
                    }else{
                        $(item).bind('click', function(){
                            if(mask){
                                mask = 0;
                                fn.moveTo(++index);
                            }
                        });
                        
                    }
					//滚轮查看图片
					if(options.mouseWheel === true){
						$(item).parent().mousewheel(function(event, delta){
							if(mask){
								mask = 0;
								delta > 0 ? fn.moveTo(--index) : fn.moveTo(++index);
								event.preventDefault();
							}
						});
					}
                });
            });
        },
        checkValue: function(opts){
        
            var defaultOptions = {
                defaultValue    :  [],
                focusCss        :  {},
                blurCss         :  {}
            }, options;
            
            options = $.extend(true, defaultOptions, opts);
            
            return this.each(function(key, obj){
                var defaultValue = options.defaultValue.length ? $.trim(options.defaultValue[key]) : $.trim($(this).val());
                 
                $(obj).attr('data-j-vid', 0); //打上判断标记
                $(obj).bind({
                    keyup: function(){
                        $(this).attr('data-j-vid', 1);
                    },
                    focus: function(){
                        var value = $.trim($(this).val());
                        if(value === defaultValue && $(this).attr('data-j-vid') === '0'){
                            $(this).val('');
                        }
                        if(!$.isEmptyObject(options.focusCss)){
                            $(obj).css(options.focusCss);
                        }
                    },
                    blur: function(){
                        var value = $.trim($(this).val());
                        if(value === ''){
                            $(this).val(defaultValue).attr('data-j-vid', 0); //重置判断标记
                        }
                        if(!$.isEmptyObject(options.blurCss)){
                            $(obj).css(options.blurCss);
                        }
                    }
                });
            });
        }
	});
})(jQuery);