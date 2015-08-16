 function move(obj,json,fnEnd){
	 clearInterval(obj.timer);
	 obj.timer = setInterval(function(){
		 var bBtn = true,attr;
		 for(attr in json){
			 var iCur = iSpeed = 0;
			 if(attr === "opacity"){
				 iCur = Math.round(getStyle(obj,attr)*100);
			 }else{
				 iCur = parseInt(getStyle(obj,attr));
			 }
			 iSpeed = (json[attr] - iCur)/7;
			 iSpeed = iSpeed > 0 ? Math.ceil(iSpeed):Math.floor(iSpeed);
			 if(iCur !== json[attr]){
				 bBtn = false;
			 }
			 if(attr === "opacity"){
				 obj.style.filter = "alpha(opacity="+(iCur + iSpeed)+")";
				 obj.style.opacity = (iCur + iSpeed)/100;
			 }else{
				 obj.style[attr] = iCur + iSpeed + "px";
			 }
		 }
		 if(bBtn){
			 clearInterval(obj.timer);
			 if(fnEnd){
				 fnEnd.call(obj);
			 }
		 }
	 },30);
 }
 function getStyle(obj, attr){
	 if(getComputedStyle){
		 return getComputedStyle(obj,false)[attr];
	 }else{
		 return obj.currentStyle[attr];
	 }
 }
 function hasClass(obj,sClass){
	 return obj.className && obj.className.indexOf(sClass) !== -1;
 }
 function addClass(obj,sClass){
	 var ac = obj.className.split(" ");		 
	 if(!ac.length){
		 obj.className = sClass;
		 return;
	 }
	 if(hasClass(obj,sClass)){
		 return;
	 }
	 obj.className = obj.className + " " + sClass;
 }
 function removeClass(obj,sClass){
	 var ac = obj.className.split(" ");
	 if(!ac.length)return;
     ac.splice(ac.indexOf(sClass),1);
     obj.className = ac.join(" ");
 }
 function swithClass(obj,sClass){
	 if(hasClass(obj,sClass)){
		 removeClass(obj,sClass);
	 }else{
		 addClass(obj,sClass);
	 }
 }
 function log(content){
	 console && console.log(content);
 }