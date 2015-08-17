;(function($) {

	var LightBox = function(setting) {
		var self = this;
		this.defaulSetting = {
			speed: 400
		}
		$.extend(this.defaulSetting, setting || {});

		// 创建遮罩
		this.popupMask = $('<div id="G-lightbox-mask">');
		this.popupWin = $('<div id="G-lightbox-popup">');

		// 保存body
		this.bodyNode = $(document.body);
		// 渲染剩余的dom并且插入body
		this.renderDOM();

		//获取图片的预览区域
		this.picViewArea = this.popupWin.find('div.lightbox-pic-view');
		// 获取图片
		this.popupPic = this.popupWin.find('img.lightbox-image');
		// 标题描述区
		this.picCaptionArea = this.popupWin.find('div.lightbox-pic-caption');
		// 左右切换按钮
		this.prevBtn = this.popupWin.find('span.lightbox-prev-btn');
		this.nextBtn = this.popupWin.find('span.lightbox-next-btn');
		// 描述文本
		this.captionText = this.popupWin.find('p.lightbox-pic-desc');
		// 当前索引
		this.currentIndex = this.popupWin.find('span.lightbox-of-index');
		// 关闭按钮
		this.closeBtn = this.popupWin.find('span.lightbox-close-btn');

		// 准备开发事件委托，获取数组数据
		this.groupName = null;
		this.groupData = []; //存放同一组数据
		this.bodyNode.delegate('.js-lightbox, *[data-role=lightbox]', 'click', function(e) {
			// 阻止事件冒泡
			e.stopPropagation();
			var currentGroupName = $(this).attr('data-group');
			if(currentGroupName != self.groupName) {
				self.groupName = currentGroupName;
				// 根据当前组名获取同一组数据
				self.getGroup();
			};

			// 初始化弹出
			self.initPopup( $(this) );
		});

		// 关闭遮罩弹出层
		this.popupMask.click(function() {
			$(this).fadeOut();
			self.popupWin.fadeOut();
			self.clear = false;
		});
		this.closeBtn.click(function() {
			self.popupMask.fadeOut();
			self.popupWin.fadeOut();
			self.clear = false;
		});

		// 绑定上下切换按钮事件
		this.flag = true;
		this.nextBtn.hover(function() {
			if( !$(this).hasClass('disabled') && self.groupData.length > 1 ) {
				$(this).addClass('lightbox-next-btn-show');
			};
		}, function() {
			if( !$(this).hasClass('disabled') && self.groupData.length > 1 ) {
				$(this).removeClass('lightbox-next-btn-show');
			};
		}).click(function(e) {
			if( !$(this).hasClass('disabled') && self.flag ) {
				self.flag = false;
				e.stopPropagation();
				self.goto('next');
			};
		});

		this.prevBtn.hover(function() {
			if( !$(this).hasClass('disabled') && self.groupData.length > 1 ) {
				$(this).addClass('lightbox-prev-btn-show');
			};
		}, function() {
			if( !$(this).hasClass('disabled') && self.groupData.length > 1 ) {
				$(this).removeClass('lightbox-prev-btn-show');
			};
		}).click(function(e) {
			if( !$(this).hasClass('disabled') && self.flag ) {
				self.flag = false;
				e.stopPropagation();
				self.goto('prev');
			};
		});

		// 绑定窗口调整事件
		var timer = null;
		this.clear = false;
		$(window).resize(function() {
			clearInterval(timer);
			if(self.clear) {
				timer = window.setTimeout(function() {
					self.loadPicSize(self.groupData[self.index].src);
				}, 500);
			}
		}).keyup(function(e) {
			var keyValue = e.whick;
			if(keyValue == 38 || keyValue == 37) {
				self.prevBtn.click();
			} else if(keyValue == 40 || keyValue == 39) {
				self.nextBtn.click();
			}
		});
	};

	LightBox.prototype = {
		// 前后图切换
		goto: function(dir) {
			if(dir === 'next') {
				this.index ++;

				if(this.index >= this.groupData.length - 1) {
					this.nextBtn.addClass('disabled').removeClass('lightbox-next-btn-show');
				};
				if(this.index != 0) {
					this.prevBtn.removeClass('disabled');
				};
				var src = this.groupData[this.index].src;
				this.loadPicSize(src);

			} else if( dir === 'prev') {
				this.index --;
				if(this.index <= 0) {
					this.prevBtn.addClass('disabled').removeClass('lightbox-prev-btn-show');
				};
				if(this.index != this.groupData.length - 1) {
					this.nextBtn.removeClass('disabled');
				};
				var src = this.groupData[this.index].src;
				this.loadPicSize(src);
			};
		},
		// 显示遮罩和弹出层
		showMaskAndPopup: function(sourceSrc, currentId) {
			var self = this;

			this.popupPic.hide();
			this.picCaptionArea.hide();
			this.popupMask.fadeIn();

			var winWidth = $(window).width(),
				winHeight = $(window).height();

			this.picViewArea.css({
				width: winWidth / 2,
				hieght: winHeight / 2
			});

			var viewHeight = winHeight / 2 + 10;

			this.popupWin.fadeIn();
			// 设置弹出层
			this.popupWin.css({
				width: winWidth / 2 + 10,
				hieght: winHeight / 2 + 10,
				// marginLeft: (winWidth / 2 + 10) / 2,
				top: -viewHeight
			}).animate({
				top: (winHeight - viewHeight) / 2
			}, self.defaulSetting.speed, function() {
				// 加载图片
				self.loadPicSize(sourceSrc);
			});

			// 根据当前点击的元素ID获取当前组别里面的索引
			this.index = this.getIndexOf(currentId);

			// 前后切换按钮
			var groupDataLength = this.groupData.length;
			if( groupDataLength > 1 ) {
				if(this.index === 0) {
					this.prevBtn.addClass('disabled');
					this.nextBtn.removeClass('disabled');
				} else if( this.index === groupDataLength - 1 ) {
					this.nextBtn.addClass('disabled');
					this.prevBtn.removeClass('disabled');
				} else {
					this.nextBtn.removeClass('disabled');
					this.prevBtn.removeClass('disabled');
				}
			}
		},
		// 改变图片尺寸大小
		changePic: function( width, height ) {
			var self = this,
				winHeight = $(window).height(),
				winWidth = $(window).width();

			//如果图片的宽高大于浏览器视口的宽高比例，就看下是否溢出
			var scale = Math.min(winWidth / (width + 10), winHeight /(height + 10), 1);
			width = width * scale;
			height = height * scale;

			this.picViewArea.animate({
				width: width - 10,
				height: height - 10
			}, self.defaulSetting.speed);

			this.popupWin.animate({
				width: width,
				height: height,
				marginLeft: -(width / 2),
				top: (winHeight - height) / 2
			}, self.defaulSetting.speed, function () {
				self.popupPic.css({
					width: width - 10,
					height: height - 10
				}).fadeIn();
				self.picCaptionArea.fadeIn();
				self.flag = true;
				self.clear = true;
			});

			// 设置描述文字及当前索引
			this.captionText.text(this.groupData[this.index].caption);
			this.currentIndex.text('当前索引: ' + (this.index + 1) + ' of ' + this.groupData.length);
		},
		// 读取图片尺寸
		loadPicSize: function( sourceSrc ) {
			var self = this;
			this.picCaptionArea.hide();

			self.popupPic.css({
				width: 'auto',
				height: 'auto'
			}).hide();

			this.preLoadImg(sourceSrc, function() {

				self.popupPic.attr('src', sourceSrc);
				var picWidth = self.popupPic.width();
					picHeight = self.popupPic.height();

				// 改变图片尺寸大小
				self.changePic(picWidth, picHeight);
			});
		},
		// 加载图片
		preLoadImg: function( src, callback ) {
			var img = new Image();
			if( !!window.ActiveXObject ) {
				img.onreadyStateChange = function() {
					if(this.readyState == 'complete') {
						callback();
					};
				};
			} else {
				img.onload = function() {
					callback();
				}
			}
			img.src = src;
		},
		// 获取索引
		getIndexOf: function( currentId ) {
			var index = 0;

			$(this.groupData).each(function(i) {
				index = i;
				if(this.id === currentId) {
					return false;
					// 在each中，return false 相当break
				}
			});

			return index;
		},
		// 初始化弹出
		initPopup: function( currentObj ) {

			var self = this,
				sourceSrc = currentObj.attr('data-source'),
				currentId = currentObj.attr('data-id');

			this.showMaskAndPopup(sourceSrc, currentId);
		},
		// 获取同一组数据
		getGroup: function() {
			var self = this;
			// 根据当前的组别获取页面中所有相同组别的对象

			var groupList = this.bodyNode.find('*[data-group=' + this.groupName + ']');

			// 清空数组
			self.groupData.length = 0;

			groupList.each(function() {

				self.groupData.push({
					src: $(this).attr('data-source'),
					id: $(this).attr('data-id'),
					caption: $(this).attr('data-caption')
				});
			})
		},
		// 渲染DOM结构
		renderDOM: function() {
			var strDom = '<div class="lightbox-pic-view">' +
							'<span class="lightbox-btn lightbox-prev-btn"></span>' +
							'<img class="lightbox-image" src="">' +
							'<span class="lightbox-btn lightbox-next-btn"></span>' +
						'</div>' +
						'<div class="lightbox-pic-caption">' +
							'<div class="lightbox-caption-area">' +
								'<p class="lightbox-pic-desc"></p>' +
								'<span class="lightbox-of-index">当前索引值: 0 of 0</span>' +
							'</div>' +
							'<span class="lightbox-close-btn"></span>' +
						'</div>';
			// 插入到this.popupWin;
			this.popupWin.html(strDom);
			this.bodyNode.append(this.popupMask, this.popupWin);
		}
	};

	window["LightBox"] = LightBox;
})(jQuery);