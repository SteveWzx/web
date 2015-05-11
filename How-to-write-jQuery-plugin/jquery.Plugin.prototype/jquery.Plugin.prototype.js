/**
 * 
 * jQuery Plugin Mod
 * 
 **/

(function ( $, window, document, undefined ) {

	'use strict';
	
	var pluginName = 'test';

	var defaults = {
        bcolor : "white",
        fcolor : "black"
    };

	function Plugin ( element, options ) {

		this.element = element;
		this.$element = $(element);
		this.settings = $.extend( {}, defaults, options );
		
		this._init();

	}

	Plugin.prototype = {

        // private method
		_init: function () {

            var self = this;

            self.$element.each(function(){
                $(this).css("color", self.settings.fcolor);
                $(this).css("backgroundColor", self.settings.bcolor);
            })

        },

		// public method
		name: function () {}

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