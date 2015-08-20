;(function(window,document){
  
  // 获取可视区的宽度
  var winWidth = document.documentElement.clientWidth || document.body.clientWidth;
  
  //每列的宽
  var width = 200;
  
  //列之间的间隔
  var space = 10;

  // 每列占据的真实的宽
  var colWidth = width + space;

  var cols = 0;

  var container = document.getElementById("container");

  var url = "http://www.wookmark.com/api/json/popular?callback=a";
  
  function setCells(){
     cols = Math.floor(winWidth / colWidth);

     document.title = cols;

     container.style.width = cols * colWidth - 10 +"px";
  }
  setCells();

  ajax("http://www.wookmark.com/api/json/popular?callback=a",function(responseText){
     alert(responseText);
  });

















  

  function ajax(url,success,param,method,async){


      // 获取ajax对象
      var xmlhttp = new XMLHttpRequest();

      // 默认什么也不执行
      success = success || function(){};

      // 默认是异步方式调用ajax
      if(async === undefined){
        async = true;
      }

      // 默认get方法
      method = method || "GET";

      
      if(method.toUpperCase() === "GET"){

        // GET 方式

        if(param){

          url += "?";

          for(name in param){

              url += name + "=" + param[name];

          }

        }

        xmlhttp.open(method,url,async);
        
        xmlhttp.send();

      } else {

         if(param){

         
          var maramstr  = "";

          for(name in param){
              maramstr  += name +"=" + param[name]+"&";
          }

          maramstr = maramstr.substring(0,maramstr.length-1);

          xmlhttp.open(method,url,async);

          xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");

          xmlhttp.send(paramstr);

         }else{

          xmlhttp.open(method,url,async);

          xmlhttp.send();

         }
          
      }

      xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState==4 && xmlhttp.status==200){
           fn(xmlhttp.responseText);
        }
        alert("ssss");
      }

   }
  




})(window,document,undefined);