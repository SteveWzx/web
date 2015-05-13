/*!
 * jQuery Gallery Pro
 *
 */
(function ( $, window, document, undefined ) {

    'use strict';

    var pluginName = 'photoAlbum';

    var defaults = {
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
            tagLab          : 'a',
            triggerClass    : 'current-page'
        },
        operate         : function(){}
    };

    function Plugin ( element, options ) {

        this.element = element;
        this.$element = $(element);
        this.options = $.extend(true, {}, defaults, options );

        this.thumbList = this.$element.find('ul:first');
        this.thumbs = this.thumbList.find('li');
        this.thumbWrap = this.thumbList.parent();
        this.length = this.thumbs.length;
        this.index = 0;
        this.hashNum = 0;
        this.imgArray = [];
        this.size = 0;
        this.thumbSize = 0;
        this.direc = 'left';
        this.visNum = 0;
        this.mark = 1;//设置滚动速度标志
        this.target = 0;
        this.x = 0;

        this.init();

    }

    Plugin.prototype = {

        init: function() {
            this.hash();
            this.loadImg();
            this.setData(this.hashNum);
            this.direct();
            this.page();
            this.moveTo(this.hashNum);
            this.click();
            this.run();

        },
        hash: function() {
            var hasher = 0;
            if(this.options.holdPage === true){
                if(!isNaN(location.hash.slice(3))){
                    if($.trim(location.hash.slice(3)) === ''){
                        hasher = 0;
                    }else{
                        hasher = parseInt(location.hash.slice(3));
                    }
                }
            }else{
                hasher = 0;
            }
            this.index = this.hashNum = hasher;
        },
        setOpacity: function(obj) {
            if(this.options.animate.opacity){
                $(obj).css('opacity', 0);
            }
        },
        setData: function(n) {
            var data = null;
            var self = this;
            location.href = location.hash === '' ? '#p=' + n : location.href.replace(location.hash, '#p=' + n);
            this.setOpacity(this.imgArray[n]);
            data = $.parseJSON(this.thumbs.eq(n).attr(this.options.dataAttr));
            $(this.options.photoPanel).children('img').remove().end().prepend(this.imgArray[n]).children('img').animate({opacity: 1}, self.options.animate.speed);
            $(this.options.dataPanel).html(data.data);
        },
        loadImg: function() {
            var self = this;
            $.each(this.thumbs, function(i, o){
                var img = new Image(),
                    data = null,
                    maxWidth = $(self.options.photoPanel).parent().width(),
                    maxHeight = $(self.options.photoPanel).parent().height();

                data = $.parseJSON($(o).attr(self.options.dataAttr));
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

                self.setOpacity(img);
                self.imgArray[i] = img;
            });
        },
        direct: function (){
            if(this.options.vertical === true){
                this.direc = 'top';
                this.thumbSize = this.thumbs.eq(0).outerHeight(true);
                this.size = this.thumbWrap.height();
                this.thumbList.height(this.length * this.thumbSize);
            }else{
                this.thumbSize = this.thumbs.eq(0).outerWidth(true);
                this.size = this.thumbWrap.width();
                this.thumbList.width(this.length * this.thumbSize);
            }
        },
        page: function() {
            var tp = '';
            var self = this;
            this.thumbs.eq(0).addClass(this.options.triggerClass);
            $(this.options.totalPanel).html(this.length);

            if(this.options.pages.tagLab === 'a'){
                $.each(this.thumbs, function(k, v){
                    tp += '<a href="javascript:;">' + (k + 1) + '</a>';
                });
            }else{
                $.each(this.thumbs, function(k, v){
                    tp += '<' + self.options.pages.tagLab + '>' + (k + 1) + '</' + self.options.pages.tagLab + '>';
                });
            }

            $(this.options.pages.pagePanel).append(tp).find(this.options.pages.tagLab).bind('click', function(){
                self.index = $(this).index();
                self.moveTo(self.index);
            }).eq(0).addClass(this.options.pages.triggerClass);

            this.pageItem = $(this.options.pages.pagePanel).find(this.options.pages.tagLab);
        },
        moveTo: function(n) {
            var wrapSize = this.thumbSize * this.length;
            this.options.operate(this.index); //每滚动一次图片要执行的回调函数
            if(this.index >= this.length || this.index < 0){
                this.mark = 1;
                this.index = this.index >= this.length - 1 ? this.length - 1 : 0;
                return false;
            }

            this.setData(n);

            $(this.options.numPanel).html(n + 1);
            this.thumbs.eq(n).addClass(this.options.triggerClass).siblings().removeClass(this.options.triggerClass);
            this.pageItem.eq(n).addClass(this.options.pages.triggerClass).siblings().removeClass(this.options.pages.triggerClass);

            this.visNum = Math.ceil(this.size / this.thumbSize);
            this.x = this.visNum - 3; //滚动方程
            if(n <= Math.ceil(this.visNum / 2) || wrapSize <= this.size){
                this.target = 0;
            }else if(n === this.length - 1){
                this.target = -(n - (this.x + 2)) * this.thumbSize;
            }else if(n === this.length - 2){
                this.target = -(n - (this.x + 1)) * this.thumbSize;
            }else{
                this.target = -(n - this.x) * this.thumbSize;
            }
            this.anim(this.target);
        },
        anim: function(dist){
            var data = {};
            var self = this;
            data[this.direc] = dist;
            this.thumbList.animate(data, 300, function(){
                self.mark = 1;
            });
        },
        click: function() {
            var self = this;
            this.thumbs.bind('click', function(){
                self.index = $(this).index();
                if(self.mark){
                    self.mark = 0;
                    self.moveTo(self.index);
                }
            });
        },
        run: function() {
            var self = this;
            $.each($.merge(this.options.prevButton, this.options.nextButton), function(i, item){

                if(i === 0 || i === 1){
                    $(item).bind('click', function(){
                        if(self.mark){
                            self.mark = 0;
                            self.moveTo(--self.index);
                        }
                    });
                }else{
                    $(item).bind('click', function(){
                        if(self.mark){
                            self.mark = 0;
                            self.moveTo(++self.index);
                        }
                    });
                }
                //滚轮查看图片
                if(self.options.mouseWheel === true){
                    $(item).parent().mousewheel(function(event, delta){
                        if(self.mark){
                            self.mark = 0;
                            delta > 0 ? self.moveTo(--self.index) : self.moveTo(++self.index);
                            event.preventDefault();
                        }
                    });
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

