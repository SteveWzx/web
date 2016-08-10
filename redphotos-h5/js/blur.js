
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;

//获取canvas对象
var canvas = document.getElementById("blur-canvas");

//获取canvas的上下文
var context = canvas.getContext("2d");

//指定canvas的宽高
canvas.width = canvasWidth;
canvas.height = canvasHeight;

var image = new Image();
var radius = 50;
var clippingRegion = {x: -1, y: -1, r: radius};

var leftMargin = 0, topMargin = 0;

image.src = "img/Penguins.jpg";
image.onload = function(e){
	$("#blur-div").css("width",canvasWidth + "px");
	$("#blur-div").css("height", canvasHeight + "px");
	
	$("#blur-image").css("width",image.width + "px");
	$("#blur-image").css("height", image.height + "px");
	
	leftMargin = (image.width - canvas.width) / 2;
	topMargin = (image.height - canvas.height) / 2;

	/*alert("leftMargin:" + leftMargin);
	alert("topMargin:" + topMargin);*/

	$("#blur-image").css("top",String(-topMargin) + "px");
	$("#blur-image").css("left", String(-leftMargin) + "px");
	
	initCanvas();
}

/**
 * 初始化canvas
 */
function initCanvas(){
	var theLeft = leftMargin < 0 ? -leftMargin : 0;
	var theTop = topMargin < 0 ? -topMargin : 0;
	
	clippingRegion = {x: Math.random() * (canvas.width - 2 * radius - 2 * theLeft) + radius + theLeft, 
					  y: Math.random() * (canvas.height - 2 * radius - 2 * theTop) + radius + theTop, 
					  r: radius};
	draw(image, clippingRegion);
}

/**
 * 在canvas上绘制图片
 * @param {Object} image
 */
function draw(image, clippingRegion){
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	context.save();
	setClippingRegion(clippingRegion);
	context.drawImage(image, 
			Math.max(leftMargin, 0), Math.max(topMargin, 0), 
			Math.max(canvas.width, image.width), Math.max(canvas.height, image.height), 
			leftMargin < 0 ? -leftMargin : 0, topMargin < 0 ? -topMargin : 0, 
			Math.max(canvas.width, image.width), Math.max(canvas.height, image.height));
	context.restore();
}

/**
 * 剪辑区域
 * @param {Object} clippingRegion
 */
function setClippingRegion(clippingRegion){
	context.beginPath();
	context.arc(clippingRegion.x, clippingRegion.y, clippingRegion.r, 0, Math.PI*2, false);
	context.clip();
}

/**
 * 显示
 */
function show(){
	var interval = setInterval(function(){
		clippingRegion.r += 20;
		
		if(clippingRegion.r > 2 * Math.max(canvas.width, canvas.height)){
			clearInterval(interval);
		}
		draw(image, clippingRegion);
	}, 50);
}

/**
 * 重置
 */
function reset(){
	initCanvas();
}

/**
 * 禁用手动发大功能
 */
canvas.addEventListener("touchstart", function(e){
	e.preventDefault();
});

