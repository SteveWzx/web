;(function($,window,undefined) {
  
  var 
      win = $(window),
      docx = $(document);

      var Dialog = function(options){
        this.settings = $.extend({},Dialog.defaults,options);
        this.init();
      };

    Dialog.prototype = {


      constructor:Dialog,

      init:function(){
        
          this.create();
          if (!isNaN(this.settings.time)&&this.settings.time!=null) {
                this.time();
          }
      },
      create:function(){

          var temp = '<div class="dialog-content">'+this.settings.content+'</div>'
         
          if( this.settings.ok || this.settings.cancel ){
               temp += '<div class="dialog-footer"></div>';
          }
          this.dialog = $("<div>").addClass("dialog").css({zIndex:this.settings.zIndex}).html(temp).appendTo("body");
          $("<div>").addClass("cover").appendTo("body");
          
          if($.isFunction(this.settings.ok)){
             this.ok();
          }

          if($.isFunction(this.settings.cancel)){
             this.cancel();
          }

          this.size();
          
          // this.position();

      },
      ok:function(){
            
            var
                _this = this,
                footer = this.dialog.find(".dialog-footer");
            $("<a>",{
              href:"javascript:;",
              text:this.settings.okText
            }).on("click",function(){
              var okCallback = _this.settings.ok();//执行ok回调，取出返回值
              if(okCallback === undefined || okCallback){
                _this.close();
              }
            }).addClass("dialog-ok").appendTo(footer);

      },
      cancel:function(){
            var 
                _this = this,
                footer = this.dialog.find(".dialog-footer");
            $("<a>",{
              href:"javascript:;",
              text:this.settings.cancelText
            }).on("click",function(){
               var cancelCallback = _this.settings.cancel();
                 if (cancelCallback == undefined || cancelCallback) {
                     _this.close();
                 }
            }).addClass("dialog-cancel").appendTo(footer);
      },

      size:function(){
          
           var content = this.dialog.find(".dialog-content");
           
           content.css({
             width:this.settings.width,
             height:this.settings.height
           })

      },

      position:function(){
        var 
            _this = this,
             winWidth = win.width(),
                winHeight = win.height(),
                scrollTop = 0;
            this.dialog.css({ 
                left : (winWidth - _this.dialog.width()) / 2,
                top : (winHeight - _this.dialog.height()) / 2 + scrollTop
            });
      },
      close : function() {
            this.dialog.remove();
            $('.cover').remove();
        },
      time : function() {
          
          var _this = this;
          
          this.closeTimer = setTimeout(function() {
              _this.close();
          }, this.settings.time);

      }
    };
    
    Dialog.defaults = {
      
      content:"确定吗？",

      height:70,

      width:230,

      ok:null,

      cancel:null,

      okText:"好",

      cancelText:"取消",

      zIndex:999999

    };

    var newDialog = function(options){
      return new Dialog(options);
    };
    //把Dialog对象挂载到$下
    window.newDialog = $.newDialog = $.dialog = newDialog;

})(window.Zepto || window.jQuery,window);