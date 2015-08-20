;(function($){
   
   var LightBox = function(){

   	  var self = this;
      
   	  //创建遮罩和弹出框
   	  this.popupMask = $('<div id="G-lightbox-mask">');

   	  this.popupWin = $('<div id="G-lightbox-popup">');

   	  //保存body
   	  this.bodyNode = $(document.body);

   	  //渲染剩余的DOM并且插入到body下
   	  this.renderDOM();
      
      this.picViewArea = this.popupWin.find("div.lightbox-pic-view");// 图片预览区

      this.popupPic = this.popupWin.find("img.lightbox-img");// 图片

      this.picCaptionArea = this.popupWin.find("div.lightbox-pic-caption");// 图片描述区域

      this.nextBtn = this.popupWin.find("span.lightbox-next-btn");// 下一张

      this.prevBtn = this.popupWin.find("span.lightbox-prev-btn");// 上一张

      this.captionText = this.popupWin.find("p.lightbox-pic-desc");// 描述文本
      
      this.currentIndex = this.popupWin.find("span.lightbox-of-index");// 图片当前索引

      this.closeBtn = this.popupWin.find("span.lightbox-close-btn");// 关闭按钮
      

      this.groupName = null;
      
      // 放置同一组数据
      this.groupData = [];
   	  
   	  // 事件委托，获取组数据
   	  this.bodyNode.on("click",".js-lightbox,*[data-role=lightbox]",function(e){

   	  	  //阻止事件冒泡，防止影响别的功能
   	  	  e.stopPropagation();

          //获取当前组名
          var currentGroupName = $(this).attr("data-group");

          //防止点击同一组重复获取数据
          if(currentGroupName != self.groupName){

             //记录当前组名
          	 self.groupName = currentGroupName;

             //根据当前组名获取同一组数据
             self.getGroup();

          };

          // 初始化弹出框
          self.initPopup($(this));

   	  });
       
       
       
      this.popupMask.click(function(){
          
          self.popupMask.fadeOut();

          self.popupWin.fadeOut();

          self.clear = false;

   	  });

   	  this.closeBtn.click(function(){
          
          self.popupMask.fadeOut();

          self.popupWin.fadeOut();

          self.clear = false;

   	  });

   	  this.nextBtn.hover(function(){
          
          if( !$(this).hasClass("disabled") && self.groupData.length > 1 ){
              
               $(this).addClass("lightbox-next-btn-show");

          };

   	  },function(){
         
          if( !$(this).hasClass("disabled") && self.groupData.length > 1 ){
              
               $(this).removeClass("lightbox-next-btn-show");

          };

   	  }).click(function(e){

   	  	if( !$(this).hasClass("disabled") && self.flag ){

   	  		self.flag = false;

   	  		e.stopPropagation();

   	  		self.goto("next");
   	  	};
   	  	 
   	  });

   	   this.prevBtn.hover(function(){
          
          if( !$(this).hasClass("disabled") && self.groupData.length > 1 ){
              
               $(this).addClass("lightbox-prev-btn-show");

          }

   	  },function(){
         
          if( !$(this).hasClass("disabled") && self.groupData.length > 1 ){
              
               $(this).removeClass("lightbox-prev-btn-show");

          }

   	  }).click(function(e){

		if( !$(this).hasClass("disabled") && self.flag ){

   	  		self.flag = false;

   	  		e.stopPropagation();

   	  		self.goto("prev");
   	  	};
   	  	 
   	  });

     var timer = null;

     this.clear = false;

     $(window).resize(function(){
       
       if( self.clear ) {
        
        window.clearTimeout(timer);

        timer = setTimeout(function(){
    
       	  self.loadPicSize(self.groupData[self.index].src);

        },500);

       }

     });
   };

   LightBox.prototype = {

   	   goto:function(dir){

         if ( dir === "next" ) { 
            
           this.index ++ ;

           if( this.index >= this.groupData.length - 1 ) {

           	this.nextBtn.addClass("disabled").removeClass("lightbox-next-btn-show");
            
           };     

           if( this.index != 0 ) {

            this.prevBtn.removeClass("disabled");

           };     

           var src = this.groupData[this.index].src;

           this.loadPicSize(src);

         }else if ( dir === "prev" ){
           
           this.index -- ;

           if( this.index <= 0 ) {
           	
           	this.prevBtn.addClass("disabled").removeClass("lightbox-prev-btn-show");
            
           };     

           if( this.index != this.groupData.length - 1 ) {

            this.nextBtn.removeClass("disabled");

           };     

           var src = this.groupData[this.index].src;

           this.loadPicSize(src);
 
         };

   	   },

   	   preLoadImg:function(sourceSrc,callback){
           
           var img = new Image();

           if(!!window.ActiveXObject){

               img.onreadystatechange = function(){
            
               	  if(readyState == "complete"){
                    
                       callback();
                  
               	  }

               }
           } else {

           	  img.onload = function(){

           	  	callback();

           	  };

           };

           img.src = sourceSrc;

   	   },

   	   changePic:function(width,height){

   	   	   var 
   	   	       self = this,
   	   	       winWidth = $(window).width(),
   	   	       winHeight = $(window).height();

   	   	       // 如果图片的宽高大于浏览器可视区的宽高，就看下是否溢出
               var scale = Math.min(winWidth/(width+10),winHeight/(height+10),1);

               width = width * scale;

               height = height * scale;

           this.picViewArea.animate({
 
                width:width-10,

                height:height-10

           });

           this.popupWin.animate({

           	 width:width,

           	 height:height,

           	 marginLeft:-(width/2),

           	 top:(winHeight-height)/2

           },function(){

           	self.popupPic.css({

           		width:width-10,

           		height:height-10

           	}).fadeIn();

           	self.picCaptionArea.fadeIn();

           	self.flag = true;

           	self.clear = true;

           })

           // 设置描述文字和当前索引

           this.captionText.text(this.groupData[this.index].caption);
           
           this.currentIndex.text("当前索引: "+(this.index+1)+" of "+this.groupData.length);

   	   },

   	   loadPicSize:function(sourceSrc){

   	   	     var self = this;

   	   	     self.popupPic.css({

   	   	     	width:"auto",

   	   	     	height:"auto"

   	   	     }).hide();

   	   	     this.picCaptionArea.hide();

   	   	     this.preLoadImg(sourceSrc,function(){

             self.popupPic.attr("src",sourceSrc);

             var 
                 picWidth = self.popupPic.width(),
                 picHeight = self.popupPic.height();

              self.changePic(picWidth,picHeight);

   	   	   });
          
   	   },

   	   getIndexOf:function(currentId){
          
          var index = 0;
          
          $(this.groupData).each(function(i){
             
             index = i;
             
             if(this.id === currentId){
             
             	return false;
             
             };

          });

          return index;
   	   },

   	   showMaskAndPopup:function(sourceSrc,currentId){
   	   	  
   	   	  var self = this;
   	   	  
   	   	  this.popupPic.hide();
   	   	  
   	   	  this.picCaptionArea.hide();

   	   	  this.popupMask.fadeIn();

   	   	  var 
   	   	      winWidth = $(window).width(),
   	   	      winHeight = $(window).height();

   	   	  this.picViewArea.css({

   	   	  	width:winWidth/2,

   	   	  	height:winHeight/2

   	   	  });

   	   	  this.popupWin.fadeIn();
          
          var viewHeight = winHeight/2+10;

   	   	  this.popupWin.css({

   	   	  	width:winWidth/2+10,

   	   	  	height:viewHeight,

   	   	  	marginLeft:-(winWidth/2+10)/2,

   	   	  	top:-viewHeight

   	   	  }).animate({

   	   	  	top:(winHeight-viewHeight)/2

   	   	  },function(){

               // 加载图片
               self.loadPicSize(sourceSrc);

   	   	  });

   	   	  // 根据当前点击的元素ID获取当前组别里面的索引

   	   	  this.index = this.getIndexOf(currentId);
          
          var groupDataLength = this.groupData.length;

          if( groupDataLength > 1 ) {
             
             if( this.index === 0 ) {
                 
                 this.prevBtn.addClass("disabled");

                 this.nextBtn.removeClass("disabled");

             } else if(this.index === groupDataLength-1) {
                 
                 this.nextBtn.addClass("disabled");

                 this.prevBtn.removeClass("disabled");

             } else {

             	 this.prevBtn.removeClass("disabled");

                 this.nextBtn.removeClass("disabled");

             };

          } else {
             
             this.prevBtn.addClass("disabled");

             this.nextBtn.addClass("disabled");

          };

   	   },
   	   initPopup:function(currentObj){
          
          var 
              self = this,
              sourceSrc = currentObj.attr("data-source") || currentObj.attr("src"),
              currentId = currentObj.attr("data-id");

          this.showMaskAndPopup(sourceSrc,currentId);

   	   },
   	   getGroup:function(){
            
          var self = this;

          // 根据当前的组别名称获取页面中所相同组别的对象

          var groupList = this.bodyNode.find("*[data-group="+this.groupName+"]");
          // 清空数据
          self.groupData = [];
          groupList.each(function(){
               var _this = $(this);
               self.groupData.push({
               	                   // 如果用户没有定义data-source，就取img 的 src地址
                                   src:_this.attr("data-source") || _this.attr("src"),
                                   id:_this.attr("data-id"),
                                   caption:_this.attr("data-caption")
                                  });
              
           });

   	   },
       renderDOM:function(){

			       var strDom =   '<div class="lightbox-pic-view">'+
            									'<span class="lightbox-btn lightbox-prev-btn"></span>'+
            									'<img class="lightbox-img" src="images/4.jpg" alt=" ">'+
            									'<span class="lightbox-btn lightbox-next-btn"></span>'+
            								'</div>'+
            								'<div class="lightbox-pic-caption">'+
            									'<div class="lightbox-caption-area">'+	
            							         '<p class="lightbox-pic-desc"></p>'+
            							         '<span class="lightbox-of-index">当前索引：0 of 0</span>'+
            									'</div>'+
            									'<span class="lightbox-close-btn"></span>'+
            								'</div>';
			    
			     //插入到this.popupWin

			     this.popupWin.html(strDom);

			     //遮罩和弹出框插入到body对象

			     this.bodyNode.append(this.popupMask,this.popupWin);

       }

   }
   window.LightBox = LightBox;

})(jQuery);