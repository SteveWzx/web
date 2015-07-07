;(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($) {

    $.fn.extend({

        drag: function(opts){

            var defaultOptions = {
                    parent      :   true,
                    operate     :   undefined
                },
                options = $.extend(defaultOptions, opts);

            return this.each(function(key, obj){

                var selfHeight = $(obj).height(),
                    selfWidth = $(obj).width(),
                    parent = $(obj).offsetParent(),
                    node,
                    pos = {
                        top: 0,
                        left: 0
                    },
                    width,
                    height,
                    diffWidth,
                    diffHeight;

                $(obj).css({position: 'absolute'});

                if(parent.css('position').toLowerCase() === 'relative' || parent.css('position').toLowerCase() === 'absolute'){
                    width = parent.width();
                    height = parent.height();
                }
                else{
                    width = $(window).width();
                    height = $(document).height();
                }

                diffWidth = width - selfWidth - 2;
                diffHeight = height - selfHeight - 2;

                node = options.parent === true ? $(obj).children().eq(0) : $(obj);

                node.bind('mousedown', function(event){

                    var node = options.parent === true ? $(this).parent() : $(this),
                        left = node.position().left,
                        top = node.position().top,
                        tempLeft = event.pageX - left,
                        tempTop = event.pageY - top,
                        flag = 0;

                    if(node.get(0).setCapture){
                        node.get(0).setCapture();
                    }

                    $(document).bind({
                        mousemove: function(event){
                            var left = event.pageX - tempLeft,
                                top = event.pageY - tempTop;

                            flag = 1;

                            if(left < 0){
                                left = 0;
                            }
                            if(left >= diffWidth){
                                left = diffWidth;
                            }
                            if(top < 0){
                                top = 0;
                            }
                            if(top >= diffHeight){
                                top = diffHeight;
                            }

                            pos.left = left;
                            pos.top = top;
                            $(obj).css({top: top, left: left});

                        },
                        mouseup: function(){
                            if($(obj).get(0).releaseCapture){
                                $(obj).get(0).releaseCapture();
                            }
                            $(this).unbind('mousemove mouseup');

                            if(typeof options.operate == 'function' && flag){
                                options.operate({top: pos.top, left: pos.left});
                            }

                        }

                    });
                    return false;
                });

            });
        }

    });

}));
