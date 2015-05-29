$(function ($) {

    var $inTodo = $('#new-todo'),
        $oTodo = $('#todo-list'),
        $oMain = $('#main'),
        ENTER_KEY = 13,
        ESCAPE_KEY = 27;

    $inTodo.on('keydown',function(ev){
        switch (ev.keyCode) {
            case ENTER_KEY:
                var sVal = $(this).val();
                var sLi = ['<li><div class="view"><input class="toggle" type="checkbox"><label>',sVal,'</label><button class="destroy"></button></div><input class="edit" value="',sVal,'"></li>'].join('');
                $oTodo.append(sLi);
                $oMain.css('display','block');
                $(this).val('');
                break;
            case ESCAPE_KEY:
                $(this).val('');
                break;
        }
    });

    $oTodo.on('click','.toggle',function(){
        var $oPli = $(this).parents('li');
        if($oPli.hasClass('completed')){
            $oPli.removeClass('completed');
            $(this).prop("checked", false);
            $inTodo.focus();
        }else{
            $oPli.addClass('completed');
            $(this).prop("checked", true);
            $inTodo.focus();
        }
    });

    $oTodo.on('click','.destroy',function(){
        $(this).parents('li').remove();
        $inTodo.focus();
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
        var $oPli = $(this).parents('li');
        $oPli.removeClass('editing');
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

});
