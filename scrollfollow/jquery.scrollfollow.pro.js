/*!
 * jQuery scrollFollow Pro
 *
 */
(function ( $, window, document, undefined ) {

    var pluginName = 'scrollFollow';

    var defaults = {
        relativeTo: 'top',
        speed: 500,
        offset: 0,
        killSwitch: 'killSwitch',
        onText: 'Turn Slide Off',
        offText: 'Turn Slide On',
        delay: 0
    };

    function Plugin ( element, options ) {

        this.element = element;
        this.$element = $(element);
        this.options = $.extend(true, {}, defaults, options );

        this.cont = this.$element.parent();
        this.position = this.$element.css('position');
        this.isActive = true;

        // Finds the default positioning of the box.
        this.initialOffsetTop =  parseInt( this.$element.offset().top );
        this.initialTop = parseInt( this.$element.css( 'top' ) ) || 0;

        // Run an initial animation on page load
        this.lastScroll = 0;

        this.init();

    }

    Plugin.prototype = {

        init: function() {
            if ( this.$element.css( 'position' ) == 'relative' ){
                this.paddingAdjustment = parseInt( this.cont.css( 'paddingTop' ) ) + parseInt( this.cont.css( 'paddingBottom' ) );
            }else{
                this.paddingAdjustment = 0;
            }
            this.scroll();
            this.resize();
            this.cookie();
            this.ani();
        },
        ani: function() {
            // The script runs on every scroll which really means many times during a scroll.
            // We don't want multiple slides to queue up.
            this.$element.queue( [ ] );
            // A bunch of values we need to determine where to animate to
            var viewportHeight = parseInt( $( window ).height() );
            var pageScroll =  parseInt( $( document ).scrollTop() );
            var parentTop =  parseInt( this.cont.offset().top );
            var parentHeight = parseInt( this.cont.prop( 'offsetHeight' ) );
            var boxHeight = parseInt( this.$element.prop( 'offsetHeight' ) + ( parseInt( this.$element.css( 'marginTop' ) ) || 0 ) + ( parseInt( this.$element.css( 'marginBottom' ) ) || 0 ) );
            var aniTop;
            var self = this;

            // Make sure the user wants the animation to happen
            if ( this.isActive )
            {
                // If the box should animate relative to the top of the window
                if ( this.options.relativeTo == 'top' )
                {
                    // Don't animate until window scroll > offsetTop
                    if ( this.initialOffsetTop >= ( pageScroll + this.options.offset ) )
                    {
                        aniTop = this.$element.initialTop;
                    }
                    else
                    {
                        aniTop = Math.min( ( Math.max( ( -parentTop ), ( pageScroll - this.initialOffsetTop + this.initialTop ) ) + this.options.offset ), ( parentHeight - boxHeight - this.paddingAdjustment ) );
                    }
                }
                // If the box should animate relative to the bottom of the window
                else if ( this.options.relativeTo == 'bottom' )
                {
                    // Don't animate until the bottom of the window is close enough to the bottom of the box
                    if ( ( this.initialOffsetTop + boxHeight ) >= ( pageScroll + viewportHeight + this.options.offset ) )
                    {
                        aniTop = this.initialTop;
                    }
                    else
                    {
                        aniTop = Math.min( ( pageScroll + viewportHeight - boxHeight - this.options.offset ), ( parentHeight - boxHeight ) );
                    }
                }

                // Checks to see if the relevant scroll was the last one
                // "-20" is to account for inaccuracy in the timeout
                if ( ( new Date().getTime() - this.lastScroll ) >= ( this.options.delay - 20 ) )
                {
                    this.$element.animate(
                        {
                            top: aniTop
                        }, self.options.speed
                    );
                }
            }

        },
        scroll: function() {
            var self = this;
            // Animate the box when the page is scrolled
            $( window ).scroll( function ()
                {
                    // Sets up the delay of the animation
                    $.fn.scrollFollow.interval = setTimeout( function(){ self.ani();} , self.options.delay );

                    // To check against right before setting the animation
                    self.lastScroll = new Date().getTime();
                }
            );
        },
        resize: function() {
            var self = this;
            // Animate the box when the page is resized
            $( window ).resize( function ()
                {
                    // Sets up the delay of the animation
                    $.fn.scrollFollow.interval = setTimeout( function(){ self.ani();} , self.options.delay );

                    // To check against right before setting the animation
                    self.lastScroll = new Date().getTime();
                }
            );
        },
        cookie: function() {

            var self = this;
            var _on = function() {
                self.isActive = true;

                $( this ).text( self.options.onText );

                $.cookie( 'scrollFollowSetting' + this.$element.prop( 'id' ), true, { expires: 365, path: '/'} );

                self.ani();
            };
            var _off = function() {
                self.isActive = false;

                $( this ).text( self.options.offText );

                self.$element.animate(
                    {
                        top: self.initialTop
                    }, self.options.speed
                );

                $.cookie( 'scrollFollowSetting' + self.$element.prop( 'id' ), false, { expires: 365, path: '/'} );
            };

            if ( $.cookie != undefined ){
                if( $.cookie( 'scrollFollowSetting' + this.$element.prop( 'id' ) ) == 'false' ){
                    this.isActive = false;
                    $( '#' + this.options.killSwitch ).text( this.options.offText ).toggle(_on,_off);
                }
                else{
                    $( '#' + this.options.killSwitch ).text( this.options.onText ).toggle(_off,_on);
                }
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

