 (function(_doc){	
	  function log(content){
		  console && console.log(content); 
	  }
	  var widthPX = document.body.offsetWidth,
	      play = document.querySelector(".play"),
	      play_box = play.querySelector(".play_box"),
	      imgs = play_box.querySelectorAll("li img"),index = i = j = 0,len = imgs.length,
	      search_page = document.querySelector(".search-page"),
	      ser_text = document.querySelector(".ser_text"),
	      serInput = document.querySelector(".ser-input"),
	      suggest = search_page.querySelector(".suggest"),
	      meat = suggest.querySelector(".meat"),
	      clear = suggest.querySelector(".clear-history");
	      key = "h",
	      tabLi = search_page.querySelectorAll(".search-tab li"),
	      close = search_page.querySelector(".close"),
	      serBtn = search_page.querySelector(".ser-btn"),
	      target  = null;
	      play.style.width = widthPX + "px";
	      play_box.style.width = widthPX*len + "px";
	      while(i<len){imgs[i++].style.width = widthPX + "px";}
      function showHistory(index){
    	  var historyData = JSON.parse(localStorage.getItem(key+index));
    	  meat.innerHTML = "";
    	  //log(meat.innerHTML);
    	  if(historyData){
    		  var dataArr = historyData.data;
        	  if(dataArr&&dataArr.length){
        		  suggest.style.display = "block";
        		  clear.style.display = "inline-block";
        		  for(i = dataArr.length-1;i>=0;i--){
        			  var newLi = document.createElement("li"),
            		      newDiv = document.createElement("div");
            		  newDiv.innerHTML = dataArr[i];
            		  newLi.appendChild(newDiv);
            		  meat.appendChild(newLi);
            		  newDiv.onclick = "nnn";
        		  }
        	  }else{
        		  suggest.style.display = clear.style.display = "none"; 
        	  }
    	  }
      }
      ser_text.onclick = function(){
    	  search_page.style.display = "block";
    	  serInput.focus();
    	  showHistory(index);
    	  clear.onclick = function(){
    		  localStorage.setItem(key+index,"{\"data\":[]}");
    		  meat.innerHTML = "";
    		  this.style.display = "none";
    	  }
      }
     
      for(i = 0;i<tabLi.length;i++){
    	  tabLi[i].onclick = function(){
    		  for(j = 0,len=tabLi.length;j<len;j++){
    			  tabLi[j].className = "";
    		  }
    		  this.className = "cur";
    		  index = this.getAttribute("index");
    		  showHistory(index);
    		  //log(index);
    	  }
      }
      
      close.onclick = function(){
    	  search_page.style.display = "none";
      }
      serBtn.onclick = function(){
    	  var value = serInput.value,historyData = obj_his = pos = d = del = null;
    	  if(value){
    		  historyData = localStorage.getItem(key+index);
    		  if(historyData){
    			  obj_his = JSON.parse(historyData);
    			  d = obj_his.data;
    			  pos = d.indexOf(value);
    			  if(pos === -1){
    				  d.push(value);  
    			  }else if(pos !== d.length){
    				  del = d.splice(pos,1);
    				  d.push(del[0]);
    			  }
    			  localStorage.setItem(key+index,JSON.stringify(obj_his)); 
    			  log(pos);
    		  }else{
        		  localStorage.setItem(key+index,'{"data":[\"'+value+'\"]}');
        	  }
    		  location = location.href.substring(0,location.href.lastIndexOf("/")+1)+"search.html?q="+value;
    	  }
    	  
      }
      meat.onclick = function(e){
    	 target = e.target;
    	 if(target!==this && target.parentNode!==this){
    		 serInput.value = target.innerHTML;
    		 //document.forms[0].submit();
    		 serBtn.click();
    	 }  
      }
    })(document)