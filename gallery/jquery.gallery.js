/*!
 * jQuery Gallery
 *
 */

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
}(function ($) {

    $.fn.extend({

        photoAlbum: function(opts){

            var defaultOptions = {

                    photoPanel      : '.photo-origin',
                    dataPanel       : '.photo-info',
                    prevButton      : ['.curPrevBtn', '.prevBtn'],
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
                    mark = 1,//设置滚动速度标志
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
                            mark = 1;
                            index = index >= length - 1 ? length - 1 : 0;
                            return false;
                        }

                        setData(n);

                        $(options.numPanel).html(n + 1);
                        thumbs.eq(n).addClass(options.triggerClass).siblings().removeClass(options.triggerClass);
                        pageItem.eq(n).addClass(options.pages.triggerClass).siblings().removeClass(options.pages.triggerClass);

                        if(n <= Math.ceil(visNum / 2) || wrapSize <= size){
                            target = 0;
                        }else if(n === length - 1){
                            target = -(n - (x + 2)) * thumbSize;
                        }else if(n === length - 2){
                            target = -(n - (x + 1)) * thumbSize;
                        }else{
                            target = -(n - x) * thumbSize;
                        }

                        this.anim(target);
                    },
                    anim: function(dist){
                        var data = {};
                        data[direc] = dist;
                        thumbList.animate(data, 300, function(){
                            mark = 1;
                        });
                    }
                };

                fn.moveTo(hashNum);

                thumbs.bind('click', function(){
                    var k = $(this).index();
                    if(mark){
                        mark = 0;
                        fn.moveTo(index = k);
                    }
                });
                $.each($.merge(options.prevButton, options.nextButton), function(i, item){

                    if(i === 0 || i === 1){
                        $(item).bind('click', function(){
                            if(mark){
                                mark = 0;
                                fn.moveTo(--index);
                            }

                        });
                    }else{
                        $(item).bind('click', function(){
                            if(mark){
                                mark = 0;
                                fn.moveTo(++index);
                            }
                        });

                    }
                    //滚轮查看图片
                    if(options.mouseWheel === true){
                        $(item).parent().mousewheel(function(event, delta){
                            if(mark){
                                mark = 0;
                                delta > 0 ? fn.moveTo(--index) : fn.moveTo(++index);
                                event.preventDefault();
                            }
                        });
                    }
                });
            });
        }

    });

}));


