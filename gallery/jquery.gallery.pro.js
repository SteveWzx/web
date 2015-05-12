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
            numTag          : 'a',
            triggerClass    : 'current-page'
        },
        operate         : function(){}
    };

    function Plugin ( element, options ) {

        this.element = element;
        this.$element = $(element);
        this.settings = $.extend( {}, defaults, options );

        this.init();

    }

    Plugin.prototype = {

        init: function() {

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

