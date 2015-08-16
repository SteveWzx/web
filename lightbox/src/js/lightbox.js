;(function($){
    
    var LightBox = function(settings){
        var self = this;

        this.settings = {
            speed:500
        };

        $.extend(this.settings,settings ||{});

        //创建遮罩层和弹出框
        this.popupMask = $('<div id="G-lightbox-mask">');
        this.popupWin = $('<div id="G-lightbox-popup">');

        //保存body
        this.bodyNode = $(document.body); 
        
        //渲染剩余的dom，并且插入到body
        this.renderDOM();
        this.picViewArea = this.popupWin.find("div.lightbox-pic-view");//图片预览区域
        this.popupPic = this.popupWin.find("img.lightbox-image");//图片
        this.picCaptionArea =  this.popupWin.find("div.lightbox-pic-caption");//图片描述区域
        this.nextBtn = this.popupWin.find("span.lightbox-next-btn");//下一张按钮
        this.prevBtn = this.popupWin.find("span.lightbox-prev-btn");//上一张按钮

        this.captionText = this.popupWin.find("p.lightbox-pic-desc");//图片描述
        this.currentIndex = this.popupWin.find("span.lightbox-of-index");//图片当前索引
        this.closeBtn = this.popupWin.find("span.lightbox-btn-close");//关闭按钮


        //准备开发时间委托，获取组数据
        this.groupName = null;
        this.groupData = [];    //定义一个数组，放置同一组数据
        /*var lightbox = $(".js-lightbox,[data-role=lightbox]");
        lightbox.click(function(){
            alert(1);  //这种添加监听的方式不利于后面出现新元素时的事件绑定
        })*/
        this.bodyNode.delegate(".js-lightbox,*[data-role=lightbox]","click",function(e){
            
            //阻止事件冒泡
            e.stopPropagation();
            //alert($(this).attr("data-group"));

            var currentGroupName = $(this).attr("data-group");

            //第一次点击获取同一组的数据，再次点击时，如果和上一个属于同一组数据，就不再重复获取
            if(currentGroupName != self.groupName){
                self.groupName = currentGroupName;
                //根据当前组别获取同一组数据
                self.getGroup();
            }
           //初始化弹出
            self.initPopup($(this));
        });

        //关闭弹出
        this.popupMask.click(function(){
            $(this).fadeOut();
            self.popupWin.fadeOut();
            self.clear = false;
        });
         this.closeBtn.click(function(){
            self.popupMask.fadeOut();
            self.popupWin.fadeOut();
            self.clear = false;
         });
         //绑定上下切换按钮 
        this.flag = true; //防止连续点击时出错
        this.nextBtn.hover(function(){
                            if(!$(this).hasClass("disabled") && self.groupData.length>1){
                                $(this).addClass("lightbox-next-btn-show");
                            }

                        },function(){
                            if(!$(this).hasClass("disabled") && self.groupData.length>1){
                                $(this).removeClass("lightbox-next-btn-show");
                            }
                        }).click(function(e){
                            if(!$(this).hasClass("disabled") && self.flag){
                                self.flag = false;
                                e.stopPropagation();
                                self.goto("next");
                            }
                        });
        this.prevBtn.hover(function(){
                            if(!$(this).hasClass("disabled") && self.groupData.length>1){
                                $(this).addClass("lightbox-prev-btn-show");
                            }
                        },function(){
                            if(!$(this).hasClass("disabled") && self.groupData.length>1){
                                $(this).removeClass("lightbox-prev-btn-show");
                            }
                        }).click(function(e){
                            if(!$(this).hasClass("disabled") && self.flag){
                                self.flag = false; //动画未结束连续点击，就不让点下一次了
                                e.stopPropagation();
                                self.goto("prev");
                            }
                        });
        //绑定窗口调整事件
        var timer = null;
        var clear = false;
        $(window).resize(function(){
            if(self.clear){
                window.clearTimeout(timer);
                timer = window.setTimeout(function(){
                    self.loadPicSize(self.groupData[self.index].src);
                },500);
            }
        }).keyup(function(e){
            var keyValue = e.which;
            //console.log(keyValue);
            if(self.clear){
                if(keyValue == 38 || keyValue == 37){
                    self.prevBtn.click();
                }else if(keyValue == 40 || keyValue == 39){
                    self.nextBtn.click();
                }
            }
        });
        
    };
    LightBox.prototype = {
        goto:function(dir){
            if(dir === "next"){
                //this.groupData
                //this.index
                //console.log("next");
                this.index++;
                if(this.index >= this.groupData.length-1){
                    this.nextBtn.addClass("disabled").removeClass("lightbox-next-btn-show");
                }
                if(this.index !== 0){
                    this.prevBtn.removeClass("disabled");
                }

                var src = this.groupData[this.index].src;
                this.loadPicSize(src);

            }else if(dir === "prev"){
                this.index--;
                if(this.index <=0 ){
                    this.prevBtn.addClass("disabled").removeClass("lightbox-prev-btn-show");
                }
                if(this.index != this.groupData.length-1){
                    this.nextBtn.removeClass("disabled");
                }
                var src = this.groupData[this.index].src;
                this.loadPicSize(src);
                //console.log("prev");

            }


        },
        loadPicSize:function(sourceSrc){
            //console.log(sourceSrc);
            var self = this;
            //把上一次图片的宽高清空
            self.popupPic.css({
                width:"auto",
                height:"auto"
            }).hide();
            this.picCaptionArea.hide();


            this.preLoadImg(sourceSrc,function(){
                //alert("图片加载完成");
                self.popupPic.attr("src",sourceSrc);
                var picWidth = self.popupPic.width(),
                    picHeight = self.popupPic.height();

                console.log(picWidth + ":"+ picHeight);

                self.changePic(picWidth,picHeight);

            });
            
        },
        changePic:function(width,height){
            var self = this,
                winWidth = $(window).width(),
                winHeight = $(window).height();

            /*var  winWidth = self.settings.maxWidth;
            var  winHeight = self.settings.maxHeight;*/

            //如果图片的宽高大于浏览器视口的宽高比例，看下是否溢出
            
            var scale = Math.min(winWidth/(width+10),winHeight/(height+10),1);

            width = width*scale;
            height = height*scale;


            this.picViewArea.animate({
                                        width:width-10,
                                        height:height-10
                                    },self.settings.speed);


            this.popupWin.animate({
                                    width:width,
                                    height:height,
                                    marginLeft:-(width/2),
                                    top:(winHeight-height)/2
                                },self.settings.speed,function(){
                                    self.popupPic.css({
                                        width:width-10,
                                        height:height-10
                                    }).fadeIn();
                                    self.picCaptionArea.fadeIn();
                                    self.flag = true;
                                    self.clear = true;
                                });
            //设置描述文字和当前索引
            console.log(this.index);

             this.captionText.text(this.groupData[this.index].caption);
             this.currentIndex.text("当前索引：" + (this.index+1)+" of "+this.groupData.length);


        },
        //预加载图片
        preLoadImg:function(src,callback){

            var img = new Image();
            if(!!window.ActiveXObject){
                img.onreadystatechange = function(){
                    if(this.readyState == "complete"){
                        callback();
                    }
                };
            }else{
                img.onload = function(){
                    callback();
                };
            }
            img.src = src;
        },
        showMaskAndPoupup:function(sourceSrc,currentId){
            //console.log(sourceSrc);
            var self = this;

            this.popupPic.hide();
            this.picCaptionArea.hide();

            /*设置遮罩层透明度*/
            this.popupMask.css({opacity:self.settings.maskOpacity});
            this.popupMask.fadeIn();
            //获取视口宽高
            var winWidth = $(window).width();
            var winHeight = $(window).height();

            /*var  winWidth = self.settings.maxWidth;
            var  winHeight = self.settings.maxHeight;*/
            
            //设置图片区域宽度高度
            this.picViewArea.css({
                                 width:winWidth/2,
                                 height:winHeight/2
                                });
            this.popupWin.fadeIn();

            var viewHeight = winHeight/2+10;
            //设置弹出框位置
            this.popupWin.css({
                                width:winWidth/2+10,
                                height:winHeight/2+10,
                                marginLeft:-(winWidth/2+10)/2,
                                top:-viewHeight
                                }).animate({
                                    top:(winHeight-viewHeight)/2
                                    },self.settings.speed,function(){
                                        //加载图片
                                        self.loadPicSize(sourceSrc);
                                });
            //根据当前点击的元素id获取在当前组别里的索引
            //注册到当前类（LightBox）上去
            this.index = this.getIndexOf(currentId);
            //$(this).index();  不用jQuery自带index 的原因是：防止img标签被其他标签比如p隔开，获取不到正确的index，数组下并不是按img分类的。
            //console.log(this.index);
            
            var groupDataLength = this.groupData.length;
            if (groupDataLength>1) {
                if(this.index === 0){
                    this.prevBtn.addClass("disabled");
                    this.nextBtn.removeClass("disabled");
                }else if(this.index === groupDataLength-1){
                    this.nextBtn.addClass("disabled");
                    this.prevBtn.removeClass("disabled");
                }else{
                    this.nextBtn.removeClass("disabled");
                    this.prevBtn.removeClass("disabled");
                }
            }
            
        },
        /*获取元素在一组数据中的索引*/
        getIndexOf:function(currentId){
            var index = 0;
            $(this.groupData).each(function(i){
                index = i;
                if(this.id === currentId){
                    return false;
                }
            });

            return index;
        },
        initPopup:function(currentObj){
            var self = this,
                sourceSrc = currentObj.attr("data-source"),
                currentId = currentObj.attr("data-id");


                //显示遮罩层和弹出框
                this.showMaskAndPoupup(sourceSrc,currentId);
        },

        getGroup:function(){
            var self = this;

            //根据当前的组别名称获取页面中所有相同组别的对象
            var groupList = this.bodyNode.find("*[data-group="+this.groupName+"]");
            //alert(groupList.size());
            //清空数组数据
            self.groupData.length = 0;
            groupList.each(function(){
                self.groupData.push({
                    src:$(this).attr("data-source"),
                    id:$(this).attr("data-id"),
                    caption:$(this).attr("data-caption")
                });
            });

            console.log(self.groupData);
            

        },
        renderDOM:function(){
            var strDom = '<div class="lightbox-pic-view">'+
                            '<span class="lightbox-btn lightbox-prev-btn ">  </span>'+
                            '<img class="lightbox-image" src="images/1.jpg" >'+
                            '<span class="lightbox-btn lightbox-next-btn ">  </span>'+
                        '</div>'+ 
                        '<div class="lightbox-pic-caption">'+
                            '<div class="lightbox-caption-area">'+
                                '<p class="lightbox-pic-desc">图片标题</p>'+
                                '<span class="lightbox-of-index">当前索引：1 of 4</span>'+
                            '</div>'+
                            '<span class="lightbox-btn-close"></span>'+
                       '</div>';
       // 插入到this.popumWin  
       this.popupWin.html(strDom);
       //把遮罩层和弹出框插入到body
       this.bodyNode.append(this.popupMask, this.popupWin);
        }
    };
    window.LightBox = LightBox;
})(jQuery);