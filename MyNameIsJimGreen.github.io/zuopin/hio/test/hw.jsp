<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible">
<meta name="format-detection" content="telephone=no">
<meta content="320" name="MobileOptimized">
<meta content="yes" name="apple-mobile-web-app-capable">
<meta content="black" name="apple-mobile-web-app-status-bar-style">
<meta name="format-detection" content="telephone=no">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<meta name="description" content="">
<meta name="keywords" content="">
<title></title>
<style type="text/css">
 #d{
   height: 200px;
   width:200px;
   background: red;
   padding: 10px;
   border: 2px #ccc solid;
   box-sizing:border-box;
 }
</style>
<script type="text/javascript">
function log(content){
	 window.console && window.console.log(content);
}
  window.onload = function(){
	  var oDiv = document.getElementById("d");
	  oDiv.onclick = function(e){
		 log(this.clientWidth+","+this.clientHeight); 
		 log(this.offsetWidth+","+this.offsetHeight); 
	  }
  }
</script>
</head>
<body>
 <div id="d">
 </div>
</body>
</html>