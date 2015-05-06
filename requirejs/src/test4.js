// JavaScript Document
define(['jquery','src/test3','src/test1'],function($,test3,test1){

    console.log('test4-before:a'+test1.a);

    $(document).on('click', function () {
        console.log('test4-after:a'+test1.a);
        test3.show();
    });

});
