/**
 * Created by steve on 2015/5/5.
 */
var ready = function (fn){
    if(document.addEventListener){
        document.addEventListener('DOMContentLoaded', fn, false);
    }
    else{
        document.attachEvent('onreadystatechange', function (){
            if(document.readyState=='complete'){
                fn();
            }
        });
    }
};

ready(function (){
    console.log("我是body中通过外部通过ready生成的脚本");
});
