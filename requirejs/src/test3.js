// JavaScript Document
define(['src/test1','src/test2'],function(a,b){

    console.log('test3:a'+a.a);

    var show = function () {
        alert(a.a + b.b)
    };

    return{
        show : show
    }

});