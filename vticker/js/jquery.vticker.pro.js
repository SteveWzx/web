/**
 *
 * jQuery Plugin vticker
 *
 **/

(function ( $, window, document, undefined ) {

    'use strict';

    var pluginName = 'vTicker';

    var defaults = {
        speed: 700,
        pause: 4000,
        showItems: 3,
        animation: '',
        mousePause: true,
        isPaused: false,
        direction: 'up',
        height: 0
    };

    function Plugin ( element, options ) {

        this.element = element;
        this.$element = $(element);
        this.settings = $.extend( {}, defaults, options );

        this.init();

    }

    Plugin.prototype = {

        init: function () {

            var self = this;
            var maxHeight = 0;

            this.$element.css({ overflow: 'hidden', position: 'relative' })
                .children('ul').css({ position: 'absolute', margin: 0, padding: 0 })
                .children('li').css({ margin: 0, padding: 0 });

            if (this.settings.height == 0) {
                this.$element.children('ul').children('li').each(function () {
                    if ($(this).height() > maxHeight) {
                        maxHeight = $(this).height();
                    }
                });
                this.$element.children('ul').children('li').each(function () {
                    $(this).height(maxHeight);
                });
                this.$element.height(maxHeight * this.settings.showItems);
            }else {
                this.$element.height(this.settings.height);
            }

            var interval = setInterval(function () {
                if (self.settings.direction == 'up') {
                    self._moveUp(self.$element, maxHeight, self.settings);
                }else {
                    self._moveDown(self.$element, maxHeight, self.settings);
                }
            }, self.settings.pause);

            if (this.settings.mousePause) {
                this.$element.bind("mouseenter", function () {
                    this.settings.isPaused = true;
                }).bind("mouseleave", function () {
                    this.settings.isPaused = false;
                });
            }

        },

        _moveUp: function (obj2, height, options) {

            if (options.isPaused) return;

            var obj = obj2.children('ul');

            var clone = obj.children('li:first').clone(true);

            if (options.height > 0) {
                height = obj.children('li:first').height();
            }

            obj.animate({ top: '-=' + height + 'px' }, options.speed, function () {
                $(this).children('li:first').remove();
                clone.appendTo($(this));
                $(this).css('top', '0px');
            });

            if (options.animation == 'fade') {
                obj.children('li:first').fadeOut(options.speed);
                if (options.height == 0) {
                    obj.children('li:eq(' + options.showItems + ')').hide().fadeIn(options.speed).show();
                }
            }

        },

        _moveDown: function (obj2, height, options) {
            if (options.isPaused)
                return;

            var obj = obj2.children('ul');

            var clone = obj.children('li:last').clone(true);

            if (options.height > 0) {
                height = obj.children('li:first').height();
            }

            obj.css('top', '-' + height + 'px').prepend(clone);

            obj.animate({ top: 0 }, options.speed, function () {
                $(this).children('li:last').remove();
            });

            if (options.animation == 'fade') {
                if (options.height == 0) {
                    obj.children('li:eq(' + options.showItems + ')').fadeOut(options.speed);
                }
                obj.children('li:first').hide().fadeIn(options.speed).show();
            }
        }

    };

    $.fn[ pluginName ] = function (options) {

        this.each(function() {
            if ( !$.data( this, 'plugin_' + pluginName ) ) {
                $.data( this, 'plugin_' + pluginName, new Plugin( this, options ) );
            }
        });

        return this;
    };


})( jQuery, window, document );