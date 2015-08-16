(function(document){
	var body = document.querySelector(".body");
		search_text = body.querySelector(".J_autocomplete"),
	    formSearch = body.querySelector(".s-form-search"),
	    headerBar = body.querySelector(".headerbar"),
	    button = formSearch.querySelector("button"),
	    logo = body.querySelector(".logo");
	    searchInput = formSearch.querySelector("input"),
	    selectTxt = body.querySelector(".s-input-tab-txt"),
	    tab = body.querySelector(".s-input-tab-nav"),
	    tabLi = tab.getElementsByTagName("li"),
	    cover = body.querySelector(".cover"),
        close = body.querySelector(".top-bar-btn"),
        submit = body.querySelector(".icon-search"),
	    i = 0,
	    len = tabLi.length,
	    ajax = data = value = null;
	    function log(content){
	    	window.console && window.console.log(content);
	    }
	selectTxt.onclick = function(){
		if(tab.className.indexOf("on")==-1){
			tab.className= "s-input-tab-nav on";
		}else{
			tab.className = "s-input-tab-nav off";
		}
	}
	while(i<len){
		tabLi[i++].onclick = function(){
			selectTxt.innerText = this.innerText;
			tab.className = "s-input-tab-nav off";
		}
	}
	searchInput.onfocus = function(){
		cover.style.display = close.style.display = "block";
		headerBar.className = "headerbar bg";
		cover.style.height = body.offsetHeight - 45 +"px";
		logo.style.display = "none";
	}
	close.onclick = function(){
		data = searchInput.value;
		closeCover();
		if(!searchInput.value){
			searchInput.value = data;
		}
		
	}
	searchInput.oninput = function(){
		if(!this.value){
			button.style.display="none";
		}else{
			button.style.cssText = "display: inline-block; -webkit-transform-origin: 0px 0px 0px; opacity: 1; -webkit-transform: scale(1, 1);";		
		}
	}
	button.onclick = function(){
		searchInput.value = "";
		return false;
	}
	submit.onclick = function(){
		value = searchInput.value;
		if(!value)return false;
//	    ajax = new XMLHttpRequest();
//	    ajax.open("GET", "search?q="+searchInput.value, true);
//	    //ajax.setRequestHeder("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
//	    ajax.send(null);
//	    ajax.onreadystatechange = function(){
//	    	if(ajax.readyState === 4 && ajax.status === 200){
//	    		data = JSON.parse(ajax.responseText);
//	    		log(data);
//	    		listView(data);
//	    	}
//	    }
		data = '['+
		'{"href":"#","img":"images/list/sss.jpg","title":"郭丽霞","price":"20","score":"2.4","count":"20","area":"离您200米"},'+
		'{"href":"#","img":"images/list/sss.jpg","title":"陈振林","price":"30","score":"4.2","count":"200","area":"离您300米"},'+
		'{"href":"#","img":"images/list/j_3.jpg","title":"刘凤华","price":"40","score":"2.3","count":"20","area":"离您400米"},'+
		'{"href":"#","img":"images/list/j_4.jpg","title":"向林秀","price":"50","score":"3.8","count":"60","area":"离您500米"},'+
		'{"href":"#","img":"images/list/m_6.jpg","title":"朱云霄","price":"60","score":"2.5","count":"50","area":"离您600米"},'+
		'{"href":"#","img":"images/list/m_5.jpg","title":"冉丽丽","price":"70","score":"1.2","count":"10","area":"离您700米"}'
	 +']'
		if(value === "美业"){
			data = '['+
				'{"href":"#","img":"images/list/m_1.jpg","title":"陆相冻","price":"20","score":"2.4","count":"20","area":"离您200米"},'+
				'{"href":"#","img":"images/list/m_2.jpg","title":"贾海珍","price":"30","score":"4.2","count":"200","area":"离您300米"},'+
				'{"href":"#","img":"images/list/m_3.jpg","title":"李秀丽","price":"40","score":"2.3","count":"20","area":"离您400米"},'+
				'{"href":"#","img":"images/list/m_4.jpg","title":"崔久新","price":"50","score":"3.8","count":"60","area":"离您500米"},'+
				'{"href":"#","img":"images/list/m_6.jpg","title":"王佳欣","price":"60","score":"2.5","count":"50","area":"离您600米"},'+
				'{"href":"#","img":"images/list/m_5.jpg","title":"张艾琳","price":"70","score":"1.2","count":"10","area":"离您700米"}'
			+']'
		}else if(value === "家政"){
			data = '['+
				'{"href":"#","img":"images/list/j_1.jpg","title":"曾映红","price":"20","score":"2.4","count":"20","area":"离您200米"},'+
				'{"href":"#","img":"images/list/j_2.jpg","title":"张克林","price":"30","score":"4.2","count":"200","area":"离您300米"},'+
				'{"href":"#","img":"images/list/j_3.jpg","title":"李氏力","price":"40","score":"2.3","count":"20","area":"离您400米"},'+
				'{"href":"#","img":"images/list/j_4.jpg","title":"王晓庆","price":"50","score":"3.8","count":"60","area":"离您500米"},'+
				'{"href":"#","img":"images/list/j_6.jpg","title":"赵淑华","price":"60","score":"2.5","count":"50","area":"离您600米"},'+
				'{"href":"#","img":"images/list/j_5.jpg","title":"熊晓波","price":"70","score":"1.2","count":"10","area":"离您700米"}'
			+']'
		}
		listView(JSON.parse(data));
	    return false;
	}
	function closeCover(){
		cover.style.display = close.style.display = "none";
		headerBar.className = "headerbar";
		logo.style.display = "block";
	}
	function listView(data){
		if(!data)return;
		var len = data.length,i = 0,
		    pageContainer = document.querySelector(".page-container"),
		    tempLi = pageContainer.getElementsByTagName("li")[0],
		    newLi = pa = item = null;
		//先删除listview
		pageContainer.innerHTML = "";
    	pageContainer.appendChild(tempLi.cloneNode(true));
		
		//复制模板并解析
        for(i=0;i<len;i++){
        	newLi = tempLi.cloneNode(true);
        	newLi.style.display = "block";
        	pageContainer.appendChild(newLi);
        	pa = newLi.querySelector(".p a");
        	item = data[i];
        	pa.href=item.href;
        	pa.querySelector("img").src = item.img;
        	var d = newLi.querySelector(".d");
        	d.querySelector("a h3").innerHTML = item.title;
        	d.querySelector(".d-price .h .font-num").innerHTML = item.price;
        	d.querySelector(".d-fright").innerHTML = "评分："+item.score;
        	d.querySelector(".d-num .font-num").innerHTML = item.count;
        	d.querySelector(".d-area").innerHTML = item.area;
        }  
        closeCover(); 
	}
	
	var q = location.href.substring(location.href.indexOf("=")+1);
	if(q){
		searchInput.value = decodeURIComponent(q);
		submit.click();
	}
	
})(document)