define(['jquery'],function($){
	function Widget(){
		this.boudingBox = null; //属性：最外层容器
	}
	Widget.prototype={
		render:function(container){		//方法：渲染组件
            this.renderUI();
			this.bindUI();
			this.syncUI();
			$(container||document.body).append(this.boudingBox);
		},
        renderUI:function(){},	//接口：添加dom节点
        bindUI:function(){},	//接口：监听事件
        syncUI:function(){},	//接口：初始化组件属性
		destroy:function(){		 //方法：渲染组件
			this.destructor();
			this.boudingBox.remove();
		},
		destructor:function(){} //接口：销毁前的处理函数
	};
	return{
		Widget:Widget
	}
});