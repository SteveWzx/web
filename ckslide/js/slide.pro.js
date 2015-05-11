/**
 *
 * jQuery Plugin Mod
 *
 **/

(function ( $, window, document, undefined ) {

    'use strict';

    var pluginName = 'ckSlide';

    var defaults = {
        autoPlay: false,
        dir: null,
        isAnimate: false
    };

    function Plugin ( element, options ) {

        this.element = element;
        this.$element = $(element);
        this.settings = $.extend( {}, defaults, options );

        this.$slidewrap = this.$element.find('.ck-slide-wrapper');
        this.$slide = this.$slidewrap.find('li');
        this.count = this.$slide.length;
        this.index = 0;
        this.time = null;

        this.init();

    }

    Plugin.prototype = {

        init: function() {
            this.next();
            this.prev();
            this.click();
            this.over();
            this.leave();
            this.auto();
            var box = this.$element.find('.ck-slidebox');
            box.css({
                'margin-left':-(box.width() / 2)
            });
            switch(this.settings.dir){
                case "x":
                    this.settings['width'] = this.$element.width();
                    this.$slidewrap.css({
                        'width':this.count * this.settings['width']
                    });
                    this.$slide.css({
                        'float':'left',
                        'position':'relative'
                    });
                    this.$slidewrap.wrap('<div class="ck-slide-dir"></div>');
                    this.$slide.show();
                    break;
            }
        },
        next: function() {
            var self = this;
            this.$element.find('.ck-next').on('click', function(){
                if(self.settings['isAnimate'] == true){
                    return;
                }

                var old = self.index;
                if(self.index >= self.count - 1){
                    self.index = 0;
                }else{
                    self.index++;
                }
                self.change(self.index, old);
            });
        },
        prev: function() {
            var self = this;
            this.$element.find('.ck-prev').on('click', function(){
                if(self.settings['isAnimate'] == true){
                    return;
                }

                var old = self.index;
                if(self.index <= 0){
                    self.index = self.count - 1;
                }else{
                    self.index--;
                }
                self.change(self.index, old);
            });
        },
        click: function() {
            var self = this;
            this.$element.find('.ck-slidebox li').each(function(cindex){
                $(this).on('click.slidebox', function(){
                    self.change(cindex, self.index);
                    self.index = cindex;
                });
            });
        },
        change: function (show, hide){
            var self = this;
            if(this.settings.dir == 'x'){
                var x = show * this.settings['width'];
                this.$slidewrap.stop().animate({'margin-left':-x}, function(){self.settings['isAnimate'] = false;});
                this.settings['isAnimate'] = true
            }else{
                this.$slide.eq(hide).stop().animate({opacity:0});
                this.$slide.eq(show).show().css({opacity:0}).stop().animate({opacity:1});
            }

            this.$element.find('.ck-slidebox li').removeClass('current');
            this.$element.find('.ck-slidebox li').eq(show).addClass('current');
        },
        over: function() {
            var self = this;
            this.$element.on('mouseover', function(){
                if(self.settings.autoPlay){
                    clearInterval(self.time);
                }
                self.$element.find('.ctrl-slide').css({opacity:0.6});
            });
        },
        leave: function() {
            var self = this;
            this.$element.on('mouseleave', function(){
                if(self.settings.autoPlay){
                    self.auto();
                }
                self.$element.find('.ctrl-slide').css({opacity:0.15});
            });
        },
        auto: function() {
            var self = this;
            if(this.settings.autoPlay){
                this.time  = setInterval(function(){
                    var old = self.index;
                    if(self.index >= self.count - 1){
                        self.index = 0;
                    }else{
                        self.index++;
                    }
                    self.change(self.index, old);
                }, 2000);
            }
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