/*!
 * jQuery tab Pro
 *
 */
(function ( $, window, document, undefined ) {

    var pluginName = 'tab';

    var defaults = {
        type            : 'mouseover', //事件类型
        triggerClass    : 'current', //选项卡的默认class
        tab             : 'ul:first > li',
        panelClass      : 'panel',
        defaultPanel    : 0, //显示指定索引值的面板, 默认为0
        async           : {state: false, url: 'a.php', type: 'get', dataType: 'json', data: [], error: function(){}, success: function(jQ, data){}},
        slideTab        : {trigger: '', sliding: false, vertical: false, speed: 300},
        opacity         : false,
        delay           : 200, //在mouseover下的延迟时间, 单位毫秒
        operate         : function(){} //切换结束时要执行的回调函数
    };

    function Plugin ( element, options ) {

        this.element = element;
        this.$element = $(element);
        this.options = $.extend(true, {}, defaults, options );

        this.tabs = this.$element.find(this.options.tab);
        this.items = this.$element.find('.' + this.options.panelClass);
        this.dir = 'left';
        this.sizeAttr = 'width';
        this.data = {};

        this.init();

    }

    Plugin.prototype = {

        init: function() {
            this.options.delay = this.options.type == 'click' ? 0 : this.options.delay;
            this.time = this.options.opacity === true ? 600 : 0;
            if(this.options.slideTab.sliding === true){
                if(this.options.slideTab.vertical === true){
                    this.dir = 'top';
                    this.sizeAttr = 'height';
                    $(this.options.slideTab.trigger).height(this.tabs.eq(this.options.defaultPanel).outerHeight());
                }else{
                    $(this.options.slideTab.trigger).width(this.tabs.eq(this.options.defaultPanel).outerWidth());
                }
            }
            this.bind();
            this.animFn(this.options.defaultPanel);
        },
        animData: function(n){
            this.data[this.dir] = this.tabs.eq(n).position()[this.dir];
            this.data[this.sizeAttr] = this.sizeAttr === 'width' ? this.tabs.eq(n).outerWidth() : this.tabs.eq(n).outerHeight();
            return this.data;
        },
        animFn: function(n){

            var dataArr = this.options.async.data,
                dataStr = dataArr[n],
                dataUrl = '',
                dataObj = {},
                self = this;

            this.tabs.eq(this.options.defaultPanel).attr('data-j-tab', 1);
            this.tabs.eq(n).addClass(this.options.triggerClass).siblings().removeClass(this.options.triggerClass);
            this.$element.find(this.options.slideTab.trigger).animate(self.animData(n), self.options.slideTab.speed);

            if(this.options.async.state === true && this.tabs.eq(n).attr('data-j-tab') !== '1' && dataStr !== 0){

                dataUrl = this.options.async.url.split(',').length === 1 ? this.options.async.url.split(',')[0] : this.options.async.url.split(',')[n];
                dataObj = dataStr.indexOf('&') > -1 ? this._toJson(dataStr.split('&')) : this._toJson(dataStr.split());

                $.ajax({
                    url         : dataUrl,
                    type        : self.options.async.type,
                    data        : dataObj,
                    dataType    : self.options.async.dataType,
                    error       : function(){
                        self.options.async.error(self.items.eq(n));
                    },
                    success     : function(data){
                        self.tabs.eq(n).attr('data-j-tab', 1);
                        self.options.async.success(self.items.eq(n), data);
                    }

                });
            }

            this.items.eq(n).fadeIn(this.time).siblings('.' + this.options.panelClass).hide();
            this.options.operate(n);
        },
        _toJson: function(array){
            var length = array.length,
                i = 0,
                json = {};

            for(; i < length; i++){

                json[array[i].split('=')[0]] = array[i].split('=')[1];
            }
            return json;
        },
        bind: function() {
            var self = this;
            var timer = null;
            this.tabs.bind(this.options.type, function(){
                var index = $(this).index();
                clearTimeout(timer);
                timer = setTimeout(function(){
                    self.animFn(index);
                } , self.options.delay);
            });

            this.tabs.mouseout(function(){
                clearTimeout(timer);
                timer = null;
            });
        }
    };

    $.fn[ pluginName ] = function (options) {

        this.each(function() {
            if ( !$.data( this, 'plugin_' + pluginName ) ) {
                $.data( this, 'plugin_' + pluginName, new Plugin( this, options ) );
            }
        });

        // chain jQuery functions
        return this;
    };


})( jQuery, window, document );

