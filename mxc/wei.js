/*
 * JavaScript Object: jWei
 * @created by weiweiqin 2013.10.16
 * required jquery1.9.1
 * 
 */
(function(window,$,undefined) {
	"use strict";
	/**
	 * 日志对象
	 */
	var Log = window.Log = (window.Log || {});
	
	Log.info = function(){
			try {
				//runable morden browser,IE9+、safari、chrome、friefox、the lastest opera
				console.info.apply(console, arguments);
			} catch (e) {
				try {
					//runable opera browser
					opera.postError.apply(opera, arguments);
				} catch (e) {
					//runable IE6-IE8
					alert(Array.prototype.join.call(arguments, " "));
				}
			}
	};
	
	Log.error = function(){
		try {
			console.error.apply(console, arguments);
		} catch (e) {
			try {
				opera.postError.apply(opera, arguments);
			} catch (e) {
				alert(Array.prototype.join.call(arguments, " "));
			}
		}
	};
	
	/**
	 * clean jquery ajax cache
	 * async: false, 
	 */
    jQuery.ajaxSetup({
        cache : false
    });
    
	// sure the object is singleton
	var jWei = window.jWei = (window.jWei || {}),
		  document = window.document;
	
	jWei._init = function(){
		this.confirm = (function(){
				var html = ' <div class="noty-confirm-bar clearfix">'+
				 	  '<span class="noty-confirm-text"></span>'+
				 	  '<div class="noty-confirm-btn">'+
					  '<button class="btn btn-primary" id="btn_ok" style="margin-right:5px"><i class="icon-ok icon-white"></i>确定</button>'+
					  '<button class="btn btn-danger" id="btn_cancel"><i class="icon-remove icon-white"></i>取消</button>'+
				 	  '</div></div>',
					  timer = 400,
					  load = false,
					  confirm = undefined,
					  overlay = undefined;
				return function(setting){
					overlay = jWei.Overlay.getInstance();
					if(!load){
						$(document.body).append(html);
						confirm = $(".noty-confirm-bar");
						confirm.find("#btn_ok").click(function(){
							setting.ok();
							overlay.hide();
							confirm.slideUp(timer);
						});
						confirm.find("#btn_cancel").click(function(){
							overlay.hide();
							confirm.slideUp(timer);
						});
						load = true;
					}
					confirm.find(".noty-confirm-text").html(setting.content);
					overlay.show();
					confirm.slideDown(timer);
				};
			})(); 
		
		this.popUp = (function(){
			var defaultSetting = {
					width:'400px',
					title:"",
					content:"",
					popUpId:"",
					ok:null,
					//create iframe by url
					iframeSrc:"",
					height:'',
					//是否动画
					animate:false
			},
			cacheDomArry = [],
			getByCache = function(domId){
				var jq = undefined;
				for(var i = 0 ;i<cacheDomArry.length;i++){
					if(cacheDomArry[i][domId]){
						jq =  cacheDomArry[i][domId];
						break;
					} 
				}
				if(!jq){
					jq = $("#"+domId).detach();
					var obj = {};
					obj[domId] = jq;
					cacheDomArry.push(obj);
				}
				return jq;
			};
			
			return function(config){
				var that = this.popUp;
				//还原默认配置
				$.extend(that,defaultSetting);
				$.extend(that,defaultSetting,config);
				var jq = undefined,
					 jPopUp =  jWei.PopupContainer.getInstance(),
					 popBody = jPopUp.getBody();
			 
				popBody.find(".popup-modal").find("iframe").size()>0?popBody.find(".popup-modal").remove():popBody.find(".popup-modal").detach();
				if(!that.iframeSrc){
					that.popUpId?jq=getByCache(that.popUpId):jq='<div class="popup-modal">'+that.content+'</div>';
					popBody.append(jq);
				}else{
					var iframe = document.createElement("iframe");
					iframe.frameBorder = 0;
					iframe.scrolling="no";
					iframe.src = that.iframeSrc;
					iframe.style.width =  that.width;
					that.width = parseInt(that.width)+60+"px";
					iframe.style.height = that.height;
					jq='<div class="popup-modal"></div>';
					$(jq).appendTo(popBody).empty().append(iframe);
				}
				//设置确定按钮
				if(that.ok){
					jPopUp.getOkBtn().show();
					jPopUp.getOkBtn().data("ok",that.ok);
				}else{
					jPopUp.getOkBtn().hide();
				}
				return jPopUp.setAnimate(that.animate).setTilte(that.title).setWidth(that.width).show();
			};
		})();
	};
	
	jWei.util = {
		isIE : function() {
			return $.browser.msie;
		},
		
		//阻止密码框复制、粘贴、剪切、右键功能
		stopPasswordOper: function(){
			$("input[type='password']").each(function() {
				$(this).bind("contextmenu copy paste cut", function() {
					return false;
				});
			});
		},
		
		//阻止复制、粘贴、剪切、右键功能,通过表单id
		stopFormOper: function(id){
			$("#"+id).bind("contextmenu copy paste cut", function() {
				return false;
			});
		},
		
		//判断是否是PC设备
		isPC:function(){
			if(navigator.userAgent.match(/Android/i)) {
				   return false;
				 }
				//判断是否是iphone或者ipad
				if ((navigator.userAgent.indexOf('iPhone') != -1) || (navigator.userAgent.indexOf('iPod') != -1) || (navigator.userAgent.indexOf('iPad') != -1)) {
					return false;
				}
				
				return true;
		},
		
		//判断是否是移动设备
		isMobile:function(){
			
			if((navigator.userAgent.indexOf('iPhone') != -1) || (navigator.userAgent.indexOf('iPod') != -1) || navigator.userAgent.match(/Android/i)){
				return true;
			}
			return false;
			
		}
	};
		
	/**
	 * defined Overlay singleton
	 */
	jWei.Overlay = (function(){
		var  html = '<div class="noty-modal-mask"></div>',
		instantiated = false,
		init = function (){
			var overlay = $(html).appendTo(document.body);
			return {
				show:function(){
					overlay.fadeIn();
					return overlay;
				},
				hide:function(){
					overlay.fadeOut();
					return overlay;
				}
			};
		};
		return {
			  getInstance: function () {
		            if (!instantiated) {
		                instantiated = init();
		            }
		            return instantiated;
		      }
		};
	})();
	
	/**
	 * defined PopupContainer singleton
	 */
	
	jWei.PopupContainer = (function(){
		var instantiated = false,
		 	  html = '<div  class="popup"><div class="popup-title">'+
		 				'<button type="button" class="close btn-close">×</button>'+
	    				'<h3 class="popup-title-content"></h3></div><div class="popup-body"></div>'+
	    				'<div class="popup-foot clearfix">'+
	    				'<button class="btn btn-close">返回修改</button>'+
	    				'<button class="btn  btn-danger btn-ok"><i class="icon-ok  icon-white"></i>确定提交</button></div></div>',
	    	init = function (){
				$(document.body).append(html);
				var popUp = $(".popup"),
					  overlay = jWei.Overlay.getInstance(),
					  closePopUp = function (){
							this.isAnimate?popUp.slideUp(200):popUp.hide();
							overlay.hide();
					  };
				popUp.find(".btn-close").each(function(){
					$(this).click(function(){
						closePopUp.call(jWei.PopupContainer.getInstance());
					});
				});
			
				popUp.find(".btn-ok").click(function(){
					if(typeof $(this).data("ok") === 'function'){
						var result = $(this).data("ok")();
						if(result === false){
							return;
						}
					}
				closePopUp.call(jWei.PopupContainer.getInstance());
			});
			
			return {
				isAnimate:false,
				
				setAnimate:function(animate){
					this.isAnimate = animate;
					return this;
				},
				close:function(){
					closePopUp.call(this);
				},
				setTilte:function(content){
					popUp.find(".popup-title-content").html(content);
					return this;
				},
				
				setWidth:function(width){
					popUp.css("width",width);
					return this;
				},
				
				getBody:function(){
					return popUp.find(".popup-body");
				},
				
				getFoot:function(){
					return popUp.find(".popup-foot");
				},
				
				show:function(){
					overlay.show();
					popUp.find(".popup-modal").show();
					this.calPosition();
					popUp.show();
					this.isAnimate?this.animate():"";
					return this;
				},
				
				calPosition:function(){
					 var clientWidth = document.body.clientWidth,
					       popUpWidth = popUp.outerWidth(),
					       left = (clientWidth - popUpWidth)/2;
					 popUp.css("left",left);
				},
				
				animate:function(){
					 popUp.css("top",-500);
					 popUp.animate({top:'+=550'},200);
				},
				
				getOkBtn:function(){
					return popUp.find(".btn-ok");
				}
				
			};
		};
		
		return {
			  getInstance: function () {
		            if (!instantiated) {
		                instantiated = init();
		            }
		            return instantiated;
		      }
		};
	})();
	
	/**
	 * defined class Datagrid
	 * 
	 * @param {Object}
	 *            options
	 * 
	 * example var grid = new jWei.Datagrid({ renderTo : $("#cameraTab"),
	 * tabWidth:"100%", legendTitle:"摄像头列表", url : "${ctx}/camera/getList",
	 * colModels : [ { name : "cameraname", displayName : "摄像头名称", width :
	 * "100px" }, { name : "remoteip", displayName : "转发IP", width : "100px" }
	 * });
	 */
	jWei.Datagrid = function(config) {
		var defaultSetting = {
			showCheck : false,
			limit : 10,
			start : 0,
			data : {
				currPage : 1
			},
			tabWidth : "800px",
			legendTitle : "查询结果",
			isSearch : false,
			showCols : true,
			fieldset:false
		};
		$.extend(this, defaultSetting, config);
		this._init();
	};

	jWei.Datagrid.prototype = {
		dataList : undefined,
		totalCount : 0,
		isSearch : false,
		page : undefined,
		$tabWrap : undefined,
		chkWidth : 70,
		$thead : undefined,
		$tbody : undefined,
		_init : function() {
			if (this.colModels) {
				// 设置表头信息
				this._settingTabStyle();
				// 设置全选checkbox
				this._settingSelectAll();
				// 设置表头
				this._settingTabTh();
				if (this.showCols) {
					// 设置coolTools
					this._settingTools();
				}
				// 获取数据
				this._getData(this.data);
			}
		},

		/**
		 * 设置表格样式
		 */
		_settingTabStyle : function() {
			var renderTo = this.renderTo, fieldId = "jq_" + $.now(), theadId = "jq_"
					+ $.now(), width = this.legendTitle.length * 20 + "px", thead = $('<thead id='
					+ theadId + '><tr></tr></thead>');
			renderTo.append(thead);
			this.$thead = $("#" + theadId);
			renderTo.addClass("table table-striped  table-hover");
			if(this.fieldset){
				renderTo.wrap($('<fieldset id=' + fieldId + ' style="width:'
						+ this.tabWidth
						+ ';"><div class="tab-content table-responsive"></div></fieldset>'));
			}else{
				renderTo.wrap($('<div class="tab-content table-responsive"></div>'));
			}
			
			this.$tabWrap = $("#" + fieldId);
			// 兼容IE7设置宽度
			this.$tabWrap.find(".tab-content").before(
					'<legend style="width:' + width + ';">' + this.legendTitle
							+ '</legend>');
		},

		/**
		 * 设置全选checkbox
		 */
		_settingSelectAll : function() {
			var that = this;
			if (this.showCheck) {
				var th = $('<th width="'
						+ this.chkWidth
						+ 'px"><label class="tab-th-check"><input type="checkbox" class="checkall" id="selectAll_id"/>全选</label></th>');
				this.$thead.find("tr").append(th);
				th.find(".checkall").click(
						function() {
							var checked = $(this).prop("checked");
							that.$tbody.find(".head-check").each(function() {
								$(this).prop("checked", checked);
							});
						});
			}
		},

		/**
		 * 设置表头
		 */
		_settingTabTh : function() {
			var thead = this.$thead;
			$.each(this.colModels, function(i, item) {
				thead.find("tr").append(
						'<th width="' + item.width + '" data-col="' + item.name
								+ '">' + item.displayName + '</th>');
			});
		},

		/**
		 * 设置栏目选择工具条
		 */
		_settingTools : function() {
			var toolsHtml = [
					'<div class="col-tools">',
					'<dt class="tool-col-show">',
					'</dt>',
					'<button class="btn btn-info tools-btn" id="tools_btn"><span class="glyphicon glyphicon-chevron-down"></span></button>',
					'</div>' ].join(""), $tabWrap = this.$tabWrap, toolCol = $tabWrap
					.find(".tab-content").append(toolsHtml).find(
							".tool-col-show");
					$.each(this.colModels,function(i, item) {
								toolCol.append('<dl><dd><label><input type="checkbox" checked class="chk-item" value="'
												+ item.name
												+ '"/>'
												+ item.displayName
												+ '</label></dd></dl>');
							});

			$tabWrap.find(".tab-content").find("#tools_btn").unbind("click")
					.click(
							function() {
								toolCol.is(":hidden") ? toolCol.show()
										: toolCol.hide();
							});

			$tabWrap.find(".tab-content").find(".chk-item").each(
					function() {
						$(this).click(
								function() {
									var colName = $(this).val(), checked = $(
											this).prop("checked");
									$tabWrap.find(".tab-content").find(
											"[data-col='" + colName + "']")
											.each(
													function() {
														checked ? $(this)
																.show() : $(
																this).hide();
													});
								});
					});

			toolCol.mouseleave(function() {
				$(this).fadeOut();
			});
		},

		_getData : function(data) {
			var grid = this, mask = new jWei.Mask(grid.renderTo.attr("id"))
					.start();

			var jajax = jQuery.ajax({
				type : 'GET',
				contentType : 'application/json',
				url : this.url,
				data : data,
				async:false,
				dataType : 'json',
				success : function(data) {
					// 获取数据
					grid.dataList = data.obj.list;
					grid.totalCount = data.obj.totalCount;

					if (!grid.totalCount) {
						grid._drawEmptyGrid();
						mask.end();
						return;
					}
					// 绘制表格
					grid._drawGrid();
					// 绘制分页
					if (grid.isSearch) {
						grid.page ? grid.page.destroy() : "";
						grid.page = new jWei.Page(1, grid.limit,
								grid.totalCount, grid.renderTo, grid);
						grid.isSearch = false;
					} else {
						!grid.page ? grid.page = new jWei.Page(1, grid.limit,
								grid.totalCount, grid.renderTo, grid) : "";
					}
					mask.end();
				},
				error : function(data) {
					mask.end();
				}
			});

			setTimeout(function() {
				jajax.abort();
				mask.end();
			}, 4000);
		},
		_drawGrid : function() {
			var grid = this, tbodyId = "jq_" + $.now(), tbody = $('<tbody id='
					+ tbodyId + '></tbody>');
			grid._cleanGrid();
			tbody.appendTo(grid.renderTo);
			grid.$tbody = $("#" + tbodyId);
			$.each(grid.dataList, function(index, item) {
				var tr = $('<tr></tr>');
				if (grid.showCheck) {
					var chkTd = $('<td><input class="head-check" value="'
							+ item[grid.showCheck.chkValue] + '" name="'
							+ grid.showCheck.chkName + '[' + index
							+ ']" type="checkbox"/></td>');
					tr.append(chkTd);
					if (grid.showCheck.handler) {
						grid.showCheck.handler(item[grid.showCheck.chkValue],
								item, chkTd, tr);
					}
				}
				for ( var i in grid.colModels) {
					var tdVal = item;
					if(grid.colModels[i].name){
						var express = grid.colModels[i].name.split("_");
						for(var x =0;x<express.length;x++){
							tdVal = tdVal[express[x]];
						}
					}
					var td = $('<td data-col="' + grid.colModels[i].name
							+ '"></td>'), chk = grid.$tabWrap
							.find(".col-tools").find(
									"input[value='" + grid.colModels[i].name
											+ "']").prop("checked");
					(chk !== undefined && !chk) ? td.hide() : "";
					tr.append(td);
					grid.colModels[i].ellipsis ? td
							.append('<div class="ellipsis" style="width:'
									+ grid.colModels[i].width + '"  title="'
									+ tdVal + '">'
									+ tdVal + '</div>')
							: td.html(tdVal);
					grid.colModels[i].handler ? grid.colModels[i].handler(
							tdVal, item, td, tr) : "";
				}
				grid.$tbody.append(tr);
			});
		},

		_drawEmptyGrid : function() {
			var grid = this, tbodyId = "jq_" + $.now(), tbody = $('<tbody id='
					+ tbodyId + '></tbody>');
			grid._cleanGrid();
			tbody.appendTo(grid.renderTo);
			grid.$tbody = $("#" + tbodyId);
			// clear page obj
			if (grid.page) {
				grid.page.destroy();
				grid.page = null;
			}
			if(grid.$tbody){
				grid.$tbody.appendTo(grid.renderTo);
			}
			if (!grid.totalCount) {
				var emptyData = '<tr><td colspan="100">暂无记录</td></tr>';
				grid.$tbody.append(emptyData);
				return;
			}
		},

		_cleanGrid : function() {
			if (this.$tbody) {
				this.$tbody.html("");
			}
		},

		_reload : function(data) {
			if (!data.currPage) {
				this.data = $.extend(this.data, {
					currPage : 1
				});
			}
			this.renderTo.find("#selectAll_id").prop("checked", false);
			this.data = $.extend(this.data, data || {});
			this._getData(this.data);
			if (this.page) {
				this.page.currPage = this.data.currPage;
				this.page.setPage();
				this.page.resetElmStatus();
			}
		},
		
		reload:function(){
			this._getData(this.data);
			if(this.page){
				this.page.currPage = this.data.currPage;
				this.page.setPage();
				this.page.resetElmStatus();
			}
		},

		/**
		 * search method param data 搜索条件
		 */
		search : function(formId) {
			var formData = $("#" + formId).serializeArray(), data = {};
			$(formData).each(function() {
				data[this.name] = this.value;
			});

			this.isSearch = true;
			this._reload(data);
		}
	};

	
	/**
	*defined Page class
	*/
	jWei.Page = function(currPage,pageSize,totalCount,renderTo,grid){
		this.currPage = currPage;
		this.pageSize = pageSize;
		this.setPageNum(totalCount);
		this.renderTo = renderTo;
		this.grid = grid;
		this.initPage();
	};
	
	jWei.Page.prototype = {
		pageNum:undefined,
		pageSize:10,
		setNextPage:function(){
			var page = this;
			this.ulElm.append(this.nextPageElm);
			this.nextPageElm.click(function(){
				if(!$(this).hasClass('disabled')){
					page.grid._reload({currPage:page.currPage+1});
				}
				return false;
			});
		},
		
		setPrevPage:function(){
			var page = this;
			this.ulElm.append(this.prevPageElm);
			this.prevPageElm.click(function(){
				if(!$(this).hasClass('disabled')){
					page.grid._reload({currPage:page.currPage-1});
				}
				return false;
			});
		},
		
		setFirstPage:function(){
			var page = this;
			this.ulElm.append(this.firstPageElm);
			this.firstPageElm.click(function(){
				if(!$(this).hasClass('disabled')){
					page.grid._reload({currPage:1});
				}
				return false;
			});
		},
		
		setLastPage:function(){
			var page = this;
			this.ulElm.append(this.lastPageElm);
			this.lastPageElm.click(function(){
				if(!$(this).hasClass('disabled')){
					var pageNum = page.getPageNum();
					page.grid._reload({currPage:pageNum});
				}
				return false;
			});
		},
		
		setAllPage:function(){
			this.ulElm.append(this.totalPageElm);
		},
		
		setPage:function(){
			var pageNum = this.getPageNum();
			var page = this;
			this.clearPage();
			if(pageNum){
				for(var i =this.getStartPage();i<=this.getEndPage();i++){
					var liElm = null;
					if(i == this.currPage){
						liElm = $('<li class="active pageno"><a>'+i+'</a></li>');
					}else{
						liElm = $('<li data-pageno="'+i+'" class="pageno"><a>'+i+'</a></li>');
						liElm.click(handler);
					}
					this.nextPageElm.before(liElm);
					
				}
				if(pageNum == 1){
					this.setNextDisabled();
					this.setLastDisabled();
				}
			}
			
			function handler(){
				var no = $(this).attr('data-pageno');
				var data = {currPage:parseInt(no)};
				page.grid._reload(data);
				return false;
			}
		},
		
		
		getStartPage:function(){
			var pageNum = this.getPageNum();
			var currPage = this.currPage;
			if(currPage < 7){
				return 1;
			}else{
				var endPage = currPage + 5;
				if(endPage>pageNum){
					var startPage = currPage - (5+endPage-pageNum);
					return startPage <1?1:startPage;
				}
				return currPage - 5 <1 ? 1:currPage-5;
			}
		},
		
		getEndPage:function(){
			var pageNum = this.getPageNum();
			var currPage = this.currPage;
			if(currPage < 7){
				return pageNum > this.pageSize?this.pageSize:pageNum;
			}else{
				var endPage = currPage +5;
				return pageNum>endPage?endPage:pageNum;
			}
		},
		
		
		clearPage:function(){
			this.ulElm.find('li').each(function(){
				if($(this).hasClass('pageno')){
					$(this).remove();
				}	
			});
		},
		
		getPageNum:function(){
			return this.pageNum;
		},
		
		setPageNum:function(totalCount){
			var num = Math.floor(totalCount / this.pageSize);
			this.pageNum =  totalCount % this.pageSize == 0?num:num+1;
		},
		
		initPage:function(){
			this.pageDiv = $('<div class="pagination pagination-small" id="pager"></div>');
			this.ulElm = $('<ul class="pagination pagination-sm"></ul>');
			this.nextPageElm = $('<li><a>»</a></li>');
			this.prevPageElm = $('<li class="disabled"><a>«</a></li>');
			this.firstPageElm = $('<li class="disabled"><a>首页</a></li>');
			this.lastPageElm = $('<li><a>末页</a></li>');
			this.totalPageElm = $('<li style="margin-top:3px;" class="disabled"><a>共'+this.getPageNum()+'页</a></li>');
			this.drawPage();
		},
		
		drawPage:function(){
			this.renderTo.after(this.pageDiv);
			this.pageDiv.append(this.ulElm);
			this.setFirstPage();
			this.setPrevPage();
			this.setNextPage();
			this.setLastPage();
			this.setAllPage();
			this.setPage();
		},
		
		resetElmStatus : function() {
			this.setFirstDisabled();
			this.setPrevDisabled();
			this.setNextDisabled();
			this.setLastDisabled();
		},
	
		setFirstDisabled:function(){
			if(this.currPage ==1){
				this.firstPageElm.addClass('disabled');
			}else{
				this.firstPageElm.removeClass('disabled');
			}
		},
		
		setLastDisabled:function(){
			if(this.currPage ==  this.getPageNum() || this.getPageNum() == 1){
				this.lastPageElm.addClass('disabled');
			}else{
				this.lastPageElm.removeClass('disabled');
			}
		},
		
		setPrevDisabled:function(){
			if(this.currPage == 1){
				this.prevPageElm.addClass('disabled');
			}else{
				this.prevPageElm.removeClass('disabled');
			}
		},
		
		setNextDisabled:function(){
			if(this.currPage ==  this.getPageNum() || this.getPageNum() == 1){
				this.nextPageElm.addClass('disabled');
			}else{
				this.nextPageElm.removeClass('disabled');
			}
		},
		destroy:function(){
			this.pageDiv.remove();
		}
	};
	
	/**
	 * mask class
	 * @param {Object} elm 需要遮罩dom元素id或jquery对象
	 */
	jWei.Mask = function(elm){
		elm instanceof jQuery?this.jElm = elm:this.jElm = $("#"+elm);
	};
	
	jWei.Mask.prototype = {
		loadingDiv: $('<div></div>'),
		overlayDiv: $('<div></div>'),
		position:{width:0,height:0,top:0,left:0},
		
		/**
		 * public method
		 * 启动遮罩
		 */
		start:function(){
			return this._setPosition()._setOverlayPosition()._setLoadingPosition();
		}, 
		/**
		 * public method
		 * 结束遮罩
		 */
		end:function(){
			this.loadingDiv.remove();
			this.overlayDiv.remove();
			return this;
		},
		
		_setOverlayPosition:function(){
			$(document.body).append(this.overlayDiv);
			this.overlayDiv.addClass("loading-overlay");
			this.overlayDiv.css('left',this.position.left+'px');
			this.overlayDiv.css('top',this.position.top+'px');
			this.overlayDiv.css('width',this.position.width+'px');
			this.overlayDiv.css('height',this.position.height+'px');
			return this;
		},
		
		_setPosition:function(){
			var jElm = this.jElm;
			this.position.width = jElm.outerWidth();
			this.position.height = jElm.outerHeight();
			this.position.left = jElm.offset().left;
			this.position.top = jElm.offset().top;
			return this;
		},
		
		_setLoadingPosition:function(){
			$(document.body).append(this.loadingDiv);
			this.loadingDiv.addClass("loading-indicator");
			var loadDivWid = this.loadingDiv.outerWidth();
			var loadDivHei = this.loadingDiv.outerHeight();
			var left = this.position.left+(this.position.width - loadDivWid)/2;
			var top = this.position.top +(this.position.height-loadDivHei)/2;
			this.loadingDiv.css('left',left);
			this.loadingDiv.css('top',top);
			return this;
		}
	};
	
	/**
	 * Tips obj
	 */
	jWei.Tips = {

		_init:function(jqSelector,options){
			
			if(jqSelector){
				
				var that = this;

				jqSelector.each(function(){

					var $t = {
						tipWrap : $('<div class="SD-tipbox"></div>'),
						tipContent : $('<div class="cntBox"></div>'),
						tipArrow : $('<div class="SD-tipbox-direction"><em>&#9670;</em><span>&#9670;</span></div>'),
						tipClose : $('<a title="关闭" onclick="return false" class="close-ico" href="#">关闭</a>'),
						options : {}
					};

					$.extend($t.options,that._defaultOptions,options);

					//show arrow
					if($t.options.showArrow){
						$t.tipWrap.append($t.tipContent).append($t.tipArrow).appendTo(document.body).attr("id","tip"+that._generalId());		
						$t.tipArrow.addClass("SD-tipbox-"+$t.options.position);	
					}else{
						$t.tipWrap.append($t.tipContent).appendTo(document.body).attr("id","tip"+that._generalId());					
					}
					

					if($t.options.content){
						$t.tipContent.html($t.options.content);
					}else{
						$t.tipContent.html($(this).data("tips"));
					}

					

					$(this).data("jtip",$t);

					if($t.options.show){
						that._show($(this));
					}

					if($t.options.closeAble){
						$t.tipWrap.append($t.tipClose);
						var _tipObj = $(this);
						$t.tipClose.on("click", function(){
							that._hide(_tipObj);
							_tipObj.unbind("mouseover");
						});

						$(this).one("mouseover",function(){
							that._show($(this));
						});

					}else{

						$(this).bind("mouseover focus",function(){
							that._show($(this));
						});

						$(this).bind("mouseout blur",function(){
							that._hide($(this));
						});

					}
					
				});
				
			}
			
		},
		_generalId:function(){
			return $.now();
		},
		/**
		*public method
		*@param jqSelector jquery对象
		*@param options tip设置对象
		*/
		tip:function(jqSelector,options){
			this._init(jqSelector,options);
		},
		
		error:function(message){
			this._initTipDiv(message,'error');
		},
		
		warn:function(message){
			this._initTipDiv(message,'warn');
		},
		
		success:function(message){
			this._initTipDiv(message,'success');
		},
		
		_initTipDiv:function(message,type){
			var id = this._tipHtml.lastId; 
			if(id){
				$("#"+id).remove();
			}
			var jTip = '';
			if('error' === type){
				jTip= $(this._tipHtml.error);
			}else if('warn' === type){
				jTip= $(this._tipHtml.warn);
			}else if('success' === type){
				jTip= $(this._tipHtml.success);
			}
			id = $.now()+"wTip";
			this._tipHtml.lastId = id;
			jTip.attr("id",id);
			jTip.appendTo(document.body);
			jTip.html(message);
			jTip.slideDown(400).delay(800).slideUp(400);
		},

		_show:function(jElm){
			var width = jElm.outerWidth(),
				height = jElm.outerHeight(),
				left = jElm.offset().left,
				top = jElm.offset().top,
				$t = jElm.data("jtip"),
				position = $t.options.position,
				showArrow = $t.options.showArrow,
				tHeight = $t.tipWrap.outerHeight(),
				tWidth = $t.tipWrap.outerWidth();

			if(position == 'top'){
				if(showArrow){
					$t.tipWrap.css("left",left+(width-tWidth)/2+"px");
					$t.tipWrap.css("top",top-tHeight-9+"px");
				}else{
					$t.tipWrap.css("left",left+(width-tWidth)/2+"px");
					$t.tipWrap.css("top",top-tHeight+"px");
				}
			}else if(position == 'right'){
				if(showArrow){
					$t.tipWrap.css("left",left+width+9+"px");
					$t.tipWrap.css("top",top+(height-tHeight)/2+"px");
				}else{
					$t.tipWrap.css("left",left+width+"px");
					$t.tipWrap.css("top",top+(height-tHeight)/2+"px");
				}
			}else if(position == 'bottom'){
				if(showArrow){
					$t.tipWrap.css("left",left+(width-tWidth)/2+"px");
					$t.tipWrap.css("top",top+height+9+"px");
				}else{
					$t.tipWrap.css("left",left+(width-tWidth)/2+"px");
					$t.tipWrap.css("top",top+height+"px");
				}
			}else if(position == 'left'){
				if(showArrow){
					$t.tipWrap.css("left",left-tWidth-9+"px");
					$t.tipWrap.css("top",top+(height-tHeight)/2+"px");
				}else{
					$t.tipWrap.css("left",left-tWidth+"px");
					$t.tipWrap.css("top",top+(height-tHeight)/2+"px");
				}
			}
			$t.tipWrap.show();
		},
		/**
		* 如果空间不足重新计算tips位置
		*/
		//TODO
		_recalPostion:function(){

		},

		_hide:function(jElm){
			var $t = jElm.data("jtip");
			$t.tipWrap.hide();
		},


		_defaultOptions:{
			position:'right',
			closeAble:false,
			show:false,
			content:'',
			showArrow:true
		},
		
		_tipHtml:{
			success:'<div class="tip-success"></div>',
			warn:'<div class="tip-warn"></div>',
			error:'<div class="tip-error"></div>',
			lastId:''
		}
	};
	
   jWei._init();

})(window,jQuery);
