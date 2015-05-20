;(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($) {

    $.fn.extend({

        slide: function(opts){

            var defaultOptions = {
                    animate 		: false, //是否具有动画, 默认false
                    opacity			: false, //是否具有透明度变化, 此项和animate只能存其一, 默认false
                    vertical		: false, //是否可以垂直播放, 默认false
                    prevButton		: '.prev_button', //向前查看的按钮, class或者id
                    nextButton		: '.next_button', //向后查看的按钮, class或者id
                    trigger			: false, //是否自动生成手动切换的小图标, 默认false
                    triggerClass	: 'current', //手动切换的小图标class
                    type			: 'mouseover', //鼠标事件
                    dataAttr        : 'title', //放标题的属性名
                    dataPanel       : '.text', //放标题的容器选择器名字
                    auto            : true, //是否自动播放, 默认自动
                    speed           : 300,  //动画速度
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
                        }else{
                            o.append($('<li>'+ (i + 1) +'</li>'));
                        }
                    });

                    triggerItem = o.children();
                }

                if(options.opacity === true){
                    options.animate = false; //打开透明度变化时, 运动失去效果
                    slideItem.each(function(key, obj){
                        $(obj).css({position: 'absolute', left: 0, top: 0, zIndex: k--});
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

                if(!$.isEmptyObject($(options.prevButton).get(0)) && !$.isEmptyObject($(options.nextButton).get(0))){
                    $(document).on({
                        click: function(event){
                            var target = $(event.target);
                            fn.clearTimer();
                            if(target.closest(options.prevButton).length > 0 && mark){
                                mark = 0;
                                fn.moveTo(--index);
                            }
                            else if(target.closest(options.nextButton).length > 0 && mark){
                                mark = 0;
                                fn.moveTo(++index);
                            }
                        },
                        mouseout: function(){
                            fn.start();
                        }
                    }, options.prevButton + ',' + options.nextButton);
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
        }

    });

}));
