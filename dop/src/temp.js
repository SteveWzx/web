define(function(){
    return {
        source:'<div class="{{typeId}}">'
                +'{{each goods as value index}}'
                +   '<ul {{if value.num == 0}} class="fix cho_list" {{else}} class="fix cho_list cho_list_on" {{/if}}>'
                +   '<li class="cho_list_li">{{value.name}}</li>'
                +   '<li class="cho_list_li tc g6">{{value.price}}{{value.units}}</li>'
                +   '<li class="cho_list_li tc">'
                +        '<a href="javascript:;" {{if value.num == 0}} class="cho_btn" {{else}} class="cho_btn cho_out" {{/if}} name="choOpt" title="购买" rel="1" id="{{value.id}}">购买</a>'
                +        '<span {{if value.num == 0}} class="cho_nums cho_out" {{else}} class="cho_nums" {{/if}}>'
                +            '<a href="javascript:;" class="cho_desc" name="choOpt" title="减少一份" data-id="{{value.id}}"></a>'
                +            '<input type="text" class="cho_input" name="choInput" value="{{value.num+1}}" id="{{value.id}}" title="修改数量" />'
                +            '<a href="javascript:;" class="cho_asc" name="choOpt" title="增加一份" data-id="{{value.id}}"></a>'
                +        '</span>'
                +    '</li>'
                +    '</ul>'
                +'{{/each}}'
                +'</div>'
    };
});
