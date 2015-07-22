define(['jquery','drag'],function($){

    $.fn.extend({

        dialog: function(opts){

            var defaultOptions = {
                    title           : '对话框', //对话框标题
                    content         : 'hello world !', //对话框内容
                    container       : '.dialog-bd', //对话框内容容器的class或者id
                    close           : '.dialog-close', //对话框关闭按钮的class或者id
                    confirm         : '.dialog-confirm', //对话框确认按钮的class或者id
                    cancel          : '.dialog-cancel', //对话框取消按钮的class或者id
                    opacity         : 0.1,
                    operate         : function(){}, //点击确定按钮触发的操作
                    animate         : false, //是否支持动画, 默认无动画
                    mask            : true //是否打开遮罩层, 默认打开
                },
                options = $.extend(defaultOptions, opts);

            this.find(options.container).html(options.content);

            var docHeight = $(document).height(),
                height = this.height(),
                width = this.width(),
                top = $(document).scrollTop() + $(window).height() / 2 - height / 2,
                left = $(document).width() / 2 - width / 2,
                maskCss = {
                    position          : 'absolute',
                    top               : 0,
                    left              : 0,
                    width             : '100%',
                    height            : docHeight,
                    backgroundColor   : '#000',
                    opacity           : 0,
                    filter            : 'alpha(opacity=' + options.opacity * 100 + ')',
                    zIndex            : 100000000
                },
                popCss = {
                    display           : 'block',
                    position          : 'absolute',
                    top               : top - 30,
                    left              : left,
                    overflow          : 'hidden',
                    zIndex            : 100000001
                },
                fn = null,
                self = this,
                maskId = 'tinkerMask' + (+ new Date()),
                mask = $('<div id="' + maskId + '">');

            fn = {
                showMask: function(){
                    mask.appendTo($('body')).css(maskCss);
                },
                anim: function(top, opacity){
                    mask.animate({opacity: opacity}, 500);
                    self.animate({top: top, opacity: 1}, 400, 'linear');
                },
                showDialog: function(){
                    self.css(popCss);
                    if(options.animate === true){
                        if(options.mask === true){
                            this.showMask();
                            this.anim(top, options.opacity);
                        }else{
                            this.anim(top);
                        }
                    }else{
                        if(options.mask === true){
                            maskCss.opacity = options.opacity;
                            this.showMask();
                            self.css('top', top);
                        }else{
                            self.css('top', top);
                        }
                    }
                },
                closeDialog: function(callback){
                    var callFn = function(){
                        if(callback){
                            options.operate(maskId);
                        }
                    };

                    if(options.animate === true){
                        self.animate({top: popCss.top, opacity: 0}, 600, function(){
                            self.css({display: 'none'});
                            callFn();
                        });
                        $('#' + maskId).animate({opacity: 0}, 200, function(){
                            $('#' + maskId).remove();
                        });
                    }else{
                        self.hide();
                        $('#' + maskId).remove();
                        callFn();
                    }

                }

            };

            fn.showDialog();
            this.drag({
                operate: function(pos){
                    popCss.top = pos.top - 30;
                }
            });

            this.bind('click', function(event){
                var target = $(event.target),
                    closeCond = target.hasClass(options.close.slice(1)) ||
                        options.close.slice(1) === target.attr('id') ||
                        target.hasClass(options.cancel.slice(1)) ||
                        options.cancel.slice(1) === target.attr('id'),

                    confirmCond = target.hasClass(options.confirm.slice(1)) ||
                        options.confirm.slice(1) === target.attr('id');

                if(closeCond){
                    fn.closeDialog();
                    self.unbind('click');
                }else if(confirmCond){
                    fn.closeDialog(options.operate);
                    self.unbind('click');
                }
            });

        }

    });

});
