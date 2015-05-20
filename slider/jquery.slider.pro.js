/*!
 * jQuery tab Pro
 *
 */
(function ( $, window, document, undefined ) {

    var pluginName = 'slide';

    var defaults = {
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
    };

    function Plugin ( element, options ) {

        this.element = element;
        this.$element = $(element);
        this.options = $.extend(true, {}, defaults, options );

        this.init();

    }

    Plugin.prototype = {

        init: function() {
            this.moveObj = this.$element.find('ul:first');
            this.slideItem = this.$element.find('ul:first > li');
            this.triggerItem = this.$element.find('ul:last > li');
            this.picItem = this.$element.find('img');
            this.length = this.k = this.slideItem.length;
            this.timer = null;
            this.size = this.slideItem.eq(0).height();
            this.dir = 'top';
            this.current = {};
            this.reset = {};
            this.mark = 1;
            this.index = 0;
            this.curIndex = 0;
            this.distance = 0;
            this.delay = this.options.type == 'click' ? 0 : 200;

            var self = this;

            if(this.options.trigger === true){
                var pageli = this.$element.find('ul:last');
                this.slideItem.each(function(i){
                    if(!i){
                        pageli.append($('<li>').text(1).addClass(self.options.triggerClass));
                    }else{
                        pageli.append($('<li>'+ (i + 1) +'</li>'));
                    }
                });

                this.triggerItem = pageli.children();
            }

            if(this.options.opacity === true){
                this.options.animate = false; //打开透明度变化时, 运动失去效果
                this.slideItem.each(function(key, obj){
                    $(obj).css({position: 'absolute', left: 0, top: 0, zIndex: self.k--});
                    if(key){
                        $(obj).css('opacity', 0);
                        self.current['opacity'] = 0;
                        self.reset['opacity'] = 1;
                    }
                });
            }

            if(this.options.animate === true){
                this.slideItem.first().clone().addClass('first-clone').appendTo(this.moveObj)
                    .end().last().clone().addClass('last-clone').prependTo(this.moveObj);

                if(this.options.vertical === false){
                    this.dir = 'left';
                    this.size = this.slideItem.eq(0).width();
                    this.moveObj.css('width', (this.length + 2 ) * this.size).css(this.dir, - this.size);
                }else{
                    this.moveObj.css('height', (this.length + 2 ) * this.size).css(this.dir, - this.size);
                }
            }

            if(!$.isEmptyObject($(this.options.prevButton).get(0)) && !$.isEmptyObject($(this.options.nextButton).get(0))){
                $(document).on({
                    click: function(event){
                        var target = $(event.target);
                        self.clear();
                        if(target.closest(self.options.prevButton).length > 0 && self.mark){
                            self.mark = 0;
                            self.moveTo(--self.index);
                        }else if(target.closest(self.options.nextButton).length > 0 && self.mark){
                            self.mark = 0;
                            self.moveTo(++self.index);
                        }
                    },
                    mouseout: function(){
                        self.start();
                    }
                }, this.options.prevButton + ',' + this.options.nextButton);
            }

            this.start();

            this.bind();
        },
        moveTo: function(w){
            var self = this;
            this.index = w;
            if(this.options.animate === true){
                this.distance = - (this.index + 1) * this.size;
                w = (this.index === this.length ? 0 : (this.index < 0 ? this.length - 1 : w ));
                this.anim();
            }else if(this.options.opacity === true){
                w = this.index > length - 1 ? 0 : this.index;
                this.setOpacity();
            }else{
                w = this.index = (this.index > this.length - 1 ? 0 : (this.index < 0 ? this.length - 1 : w ));
                this.distance = - w * this.size;
                this.moveObj.css(this.dir, this.distance);
                this.mark = 1;
            }
            this.triggerItem.eq(w).addClass(this.options.triggerClass).siblings().removeClass(this.options.triggerClass);
            $(this.options.dataPanel).html(this.picItem.eq(w).attr(this.options.dataAttr));
        },
        anim: function(){
            var self = this;
            var data = {};
            data[this.dir] = this.distance;
            this.moveObj.animate(data, this.options.speed, function(){
                self.mark = 1;
                if(self.index === self.length){
                    self.index = 0;
                    self.moveObj.css(self.dir, - self.size);
                }else if(self.index < 0){
                    self.index = self.length - 1;
                    self.moveObj.css(self.dir, - self.length * self.size);
                }
            });
        },
        setOpacity: function(){
            var self = this;
            var temp = this.curIndex;
            if(this.index >= this.length){
                this.index = 0;
            }else if(this.index < 0){
                this.index = this.length - 1;
            }
            this.curIndex = this.index;
            if(temp !== this.curIndex){
                this.slideItem.eq(temp).css({zIndex: 1}).animate(this.current, this.options.speed, function(){
                    self.mark = 1;
                });
                this.slideItem.eq(this.curIndex).css({position:'absolute', zIndex: this.length}).animate(this.reset, this.options.speed);
            }
        },
        auto: function(){
            var self = this;
            this.clear();
            this.timer = setInterval(function(){
                self.index === (self.options.animate === true ? self.length : self.length - 1) ? self.index = 0 : self.index++;
                self.moveTo(self.index);
            }, this.options.time);
        },
        start: function(){
            this.clear();
            if(this.options.auto === true){
                this.auto();
            }
        },
        clear: function(){
            clearTimeout(this.timer);
            clearInterval(this.timer);
        },
        bind: function() {
            var self = this;
            this.triggerItem.bind(this.options.type, function(){
                var index = $(this).index();
                self.clear();
                self.timer = setTimeout(function(){
                    self.moveTo(index);
                }, self.delay);
            });

            this.triggerItem.mouseout(function(){
                self.start();
            });

            this.slideItem.bind({
                mouseover: function(){
                    self.clear();
                },
                mouseout: function(){
                    self.start();
                }
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

