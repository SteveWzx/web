$(function ($) {

    var $inTodo = $('#new-todo'),
        $oTodo = $('#todo-list'),
        $oMain = $('#main'),
        $ohast = $('#filters a'),
        $oLeft = $('#todo-count').find('strong'),
        $oClear = $('#clear-completed');
        sHash = location.hash,
        ENTER_KEY = 13,
        ESCAPE_KEY = 27,
        nLen = 0,
        nClear = 0;

    var foot = function() {
        var len = $oTodo.children().length,
            $oFooter = $('#footer');
        if(len){
            $oFooter.css('display','block');
        }else{
            $oFooter.css('display','none');
        }
    };

    $inTodo.on('keydown',function(ev){
        switch (ev.keyCode) {
            case ENTER_KEY:
                var sVal = $(this).val();
                var sLi = ['<li data-complete=','{"key":false}','><div class="view"><input class="toggle" type="checkbox"><label>',sVal,'</label><button class="destroy"></button></div><input class="edit" value="',sVal,'"></li>'].join('');
                var $li = $(sLi);
                if(sVal){
                    $oTodo.append(sLi);
                }
                $oMain.css('display','block');
                $(this).val('');
                if(!$li.data('complete').key){
                    nLen++;
                }
                $oLeft.html(nLen);
                break;
            case ESCAPE_KEY:
                $(this).val('');
                break;
        }
        foot();

    });

    $oTodo.on('click','.toggle',function(){
        var $oPli = $(this).parents('li'),
            $li = $oTodo.children(),
            $oLeft = $('#todo-count').find('strong');

        if($oPli.hasClass('completed')){
            $oPli.removeClass('completed');
            $(this).prop("checked", false);
            $oPli.data('complete',{ key : false });
            $inTodo.focus();
            nLen++;
            nClear--;
            $oLeft.html(nLen);
        }else{
            $oPli.addClass('completed');
            $(this).prop("checked", true);
            $oPli.data('complete',{ key : true });
            $inTodo.focus();
            nLen--;
            nClear++;
            $oLeft.html(nLen);
        }

        if(nClear){
            $oClear.css('display','block');
        }else{
            $oClear.css('display','none');
        }

    });

    $oTodo.on('click','.destroy',function(){
        var $pli = $(this).parents('li');
        if(!$pli.data('complete').key){
            nLen--;
        }
        if($pli.data('complete').key){
            nClear--;
        }
        if(nClear){
            $oClear.css('display','block');
        }else{
            $oClear.css('display','none');
        }
        $oLeft.html(nLen);
        $pli.remove();
        $inTodo.focus();
        foot();
    });

    $oTodo.on('dblclick','label',function(){
        var $oPli = $(this).parents('li'),
            $oEdit = $oPli.find('.edit'),
            nEval = $oEdit.val();
        $oPli.addClass('editing');
        $oEdit.focus();
        $oEdit.val('');
        $oEdit.val(nEval);
    });

    $oTodo.on('blur','.edit',function(){
        var $oPli = $(this).parents('li'),
            $oEdit = $oPli.find('.edit'),
            $oLabel = $oPli.find('label'),
            sVal = $oLabel.html();
        $oPli.removeClass('editing');
        $oEdit.val(sVal);
        $inTodo.focus();
    });

    $oTodo.on('keydown','.edit',function(ev){
        var $oPli = $(this).parents('li'),
            $oLabel = $oPli.find('label');
        switch (ev.keyCode) {
            case ENTER_KEY:
                var nEval = $(this).val();
                $oLabel.html(nEval);
                $oPli.removeClass('editing');
                $inTodo.focus();
                break;
            case ESCAPE_KEY:
                $oPli.removeClass('editing');
                $inTodo.focus();
                break;
        }
    });

    var fnHash = function(str) {
        var $li = $('#todo-list li');
        switch (str) {
            case 'all':
                $li.each(function(){
                    $(this).css('display','block');
                });
                break;
            case 'active':
                $li.each(function(i, ele){
                    if($(ele).data('complete').key){
                        $(this).css('display','none');
                    }else{
                        $(this).css('display','block');
                    }
                });
                break;
            case 'completed':
                $li.each(function(i, ele){
                    if($(ele).data('complete').key){
                        $(this).css('display','block');
                    }else{
                        $(this).css('display','none');
                    }
                });
                break;
        }
    };

    $ohast.click(function(){
        var hName = $(this).attr('href').slice(1);
        fnHash(hName);
        $(this).addClass('selected').parent().siblings().find('a').removeClass('selected');
    });

    fnHash(sHash);

    $oClear.click(function(){
        var $li = $oTodo.children();
        $li.each(function(i, ele){
            if($(ele).data('complete').key){
                nClear--;
                $(this).remove();
            }
        });

        if(nClear){
            $oClear.css('display','block');
        }else{
            $oClear.css('display','none');
        }
    });

});
