define(['jquery','artpl','src/temp','src/data'],function($, template, temp, data){

    /*var Calculate = function(json) {
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
            var render = template.compile(temp.source),
                renderLeft = template.compile(temp.source2),
                html = render(json),
                htmlLeft = renderLeft(json);
            this.layout = $('#listOut');
            this.layout.append(html);
            this.left = $('.cho_left');
            this.left.append(htmlLeft);
        }
    };

    new Calculate(data);

    $('.fruits').hide();
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
    });

    return {
        calculate : Calculate
    }*/

    var object = {

        init: function() {
            this.data = data;
            this.layout = $('#listOut');
            this.left = $('.cho_left');
            this.htmlTil = this.layout.html();
            this.htmlLine = this.left.html();
            this.render(this.data);
            this.bind();
        },
        render: function(json){
            this.layout.empty();
            this.left.empty();
            var render = template.compile(temp.source),
                renderLeft = template.compile(temp.source2),
                html = render(json),
                htmlLeft = renderLeft(json);
            this.layout.html(this.htmlTil+html);
            this.left.html(this.htmlLine+htmlLeft);
            this.event();
        },
        event: function() {
            $('#listOut>div:gt(0)').hide();
            $('.cho_menu>li>a').click(function(){
                $(this).addClass('cho_link_on').parent('li').siblings().find('a').removeClass('cho_link_on');
                var til = $(this).data('id');
                $('#listOut>.'+til).show().siblings('div').hide();
            });
        },
        bind: function() {
            var self = this;

            $(document).on('click','.btn',function(){
                var id = $(this).data('id'),
                    num = Number($(this).data('rel')) || 0,
                    index = $('#listOut>div').index($(this).parents('div')),
                    index2 = $(this).parents('ul').index(),
                    name = $(this).parents('div').attr('class');

                console.log(index,index2);
                self.data.json[index].goods[index2].num = num;
                self.render(self.data);
                return false;

            });

        }

    };

    object.init();

});
