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

        tab: function(opts){

            var defaultOptions = {
                    type            : 'mouseover', //事件类型
                    triggerClass    : 'current', //选项卡的默认class
                    tab             : 'ul:first > li',
                    panelClass      : 'panel',
                    defaultPanel    : 0, //显示指定索引值的面板, 默认为0
                    async           : {state: false, url: 'a.php', type: 'get', dataType: 'json', data: [], error: function(){}, success: function(jQ, data){}},
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
                    dir = 'left',
                    sizeAttr = 'width',
                    data = {},
                    animFn = null,
                    switchFn = null,
                    timer = null;

                time = options.opacity === true ? 600 : 0;
                options.slideTab.sliding === true ? (options.slideTab.vertical === true ?
                    (dir = 'top', sizeAttr = 'height', $(options.slideTab.trigger).height(tabs.eq(options.defaultPanel).outerHeight())) :
                    $(options.slideTab.trigger).width(tabs.eq(options.defaultPanel).outerWidth())) : 0;

                animFn = function(n){
                    data[dir] = tabs.eq(n).position()[dir];
                    data[sizeAttr] = sizeAttr === 'width' ? tabs.eq(n).outerWidth() : tabs.eq(n).outerHeight();
                    return data;
                };

                switchFn = function(n){

                    var dataArr = options.async.data,
                        dataStr = dataArr[n],
                        dataUrl = '',
                        dataObj = {};

                    tabs.eq(options.defaultPanel).attr('data-j-tab', 1);
                    tabs.eq(n).addClass(options.triggerClass).siblings().removeClass(options.triggerClass);
                    $(obj).find(options.slideTab.trigger).animate(animFn(n), options.slideTab.speed);

                    if(options.async.state === true && tabs.eq(n).attr('data-j-tab') !== '1' && dataStr !== 0){

                        dataUrl = options.async.url.split(',').length === 1 ? options.async.url.split(',')[0] : options.async.url.split(',')[n];
                        dataObj = dataStr.indexOf('&') > -1 ? toJson(dataStr.split('&')) : toJson(dataStr.split());

                        $.ajax({

                            url         : dataUrl,
                            type        : options.async.type,
                            data        : dataObj,
                            dataType    : options.async.dataType,
                            error       : function(){
                                options.async.error(items.eq(n));
                            },
                            success     : function(data){
                                tabs.eq(n).attr('data-j-tab', 1);
                                options.async.success(items.eq(n), data);
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
        }
    });

}));
