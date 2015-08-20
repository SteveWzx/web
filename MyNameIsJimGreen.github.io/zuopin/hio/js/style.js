window.onload = function(){
	var item = document.querySelector(".item_img2"),
	    item2 = document.querySelector(".item_img2 div.i2 img"),
	    item3 = document.querySelector(".item_img2 div.i2"),
	    oW = item.offsetWidth,oH = item.offsetHeight,
	    oW2 = item2.clientWidth;
	console.log(oW+","+oH);
	console.log(oW2);
	item3.style.left = (oW-oW2)/2+"px";
	item3.style.top = (oH-oW2)/2+"px";
}