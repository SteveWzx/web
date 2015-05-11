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
            this.$element.css("color", this.settings.fcolor);
            this.$element.css("backgroundColor", this.settings.bcolor);
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