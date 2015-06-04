define(['jquery','artpl','src/temp','src/data'],function($, template, temp, data){

    var Calculate = function(json) {
        this.json = json;
        if (!(this instanceof Calculate)) {
            return new Calculate(json);
        }
        this.init();
    };

    Calculate.prototype = {
        init : function() {
            this.render(this.json);
        },
        render: function(json){
            /*var render = template.compile(temp.source);
            var html = render(data);
            this.layout = $('#listOut');
            this.layout.append(html);*/
            console.log(json);
            var renderLeft = template.compile(temp.source2);
            var htmlLeft = renderLeft(json);
            this.left = $('.cho_left');
            this.left.append(htmlLeft);
        }
    };

    new Calculate(data);

    /*$('.fruits').hide();
    $('.cho_menu>li>a').click(function(){
        $(this).addClass('cho_link_on').parent('li').siblings().find('a').removeClass('cho_link_on');
        var goods = $(this).data('id');
        $('#listOut>.'+[goods]).show().siblings('div').hide();
    });

    $(document).on('click','.cho_btn',function(){
        $(this).hide();
        $(this).next().show().parents('ul').addClass('cho_list_on');
        var name = $(this).parents('div').attr('class');
        var type = 0;
        $(this).parents('.'+name).find('ul').each(function(i, ele){
            if($(ele).hasClass('cho_list_on')){
                type++;
                $('.cho_menu').find('#'+name).html('×'+type);
            }
        });
    });

    $(document).on('click','.cho_desc',function(){
        var $tex = $(this).next("input[type='text']");
        var num = $tex.val();
        if(num>1){
            num--;
            $tex.val(num);
        }else{
            $(this).parent().hide();
            $(this).parents('.cho_list_li').find('.cho_btn').show();
            $(this).parents('.cho_list').removeClass('cho_list_on');
            var name = $(this).parents('div').attr('class');
            var type = 0;
            $(this).parents('.'+name).find('ul').each(function(i, ele){
                if($(ele).hasClass('cho_list_on')){
                    type++;
                    $('.cho_menu').find('#'+name).html('×'+type);
                }
                if(type == 0){
                    $('.cho_menu').find('#'+name).html('');
                }
            });
        }
        return false;
    });

    $(document).on('click','.cho_asc',function(){
        var $tex = $(this).prev("input[type='text']");
        var num = $tex.val();
        num++;
        $tex.val(num);
        return false;
    });*/

    return {
        calculate : Calculate
    }

});
