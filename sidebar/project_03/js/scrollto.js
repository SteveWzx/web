define(['jquery'],function($){
	function ScrollTo(opts){
		this.opts = $.extend({},ScrollTo.DEFAULTS,opts);
		this.$el=$('html,body');
	}
	ScrollTo.prototype.move = function() {
		if ($(window).scrollTop() != this.opts.dest) {
			if (!this.$el.is(':animated')) {
				this.$el.animate({
					scrollTop:dest
				},opts.speed);
			}
		}
		
	};
	ScrollTo.prototype.go=function(){
		if ($(window).scrollTop() != this.opts.dest) {
			if (!this.$el.is(':animated')) {
				this.$el.scrollTop(dest);
			}
		}
	};
	ScrollTo.DEFAULTS={
		dest:0,
		speed:800
	};
	return {
		ScrollTo:ScrollTo
	};
});