define(function(){
    return {
        source:'{{each json as val index}}'
                +'<div class="{{val.typeId}}">'
                +'{{each val.goods as value index}}'
                +   '<ul {{if value.num == 0}} class="fix cho_list" {{else}} class="fix cho_list cho_list_on" {{/if}}>'
                +   '<li class="cho_list_li">{{value.name}}</li>'
                +   '<li class="cho_list_li tc g6">{{value.price}}{{value.units}}</li>'
                +   '<li class="cho_list_li tc">'
                +        '<a href="javascript:;" {{if value.num == 0}} class="btn cho_btn" {{else}} class="btn cho_btn cho_out" {{/if}} name="choOpt" data-rel="{{1}}" title="购买" id="{{value.id}}">购买</a>'
                +        '<span {{if value.num == 0}} class="cho_nums cho_out" {{else}} class="cho_nums" {{/if}}>'
                +            '<a href="javascript:;" class="btn cho_desc" name="choOpt" title="减少一份" data-rel="{{value.num-1}}" data-id="{{value.id}}"></a>'
                +            '<input type="text" class="cho_input" name="choInput" value="{{value.num}}" id="{{value.id}}" title="修改数量" />'
                +            '<a href="javascript:;" class="btn cho_asc" name="choOpt" title="增加一份" data-rel="{{value.num+1}}" data-id="{{value.id}}"></a>'
                +        '</span>'
                +    '</li>'
                +    '</ul>'
                +'{{/each}}'
                +'</div>'
                +'{{/each}}',
        source2:'<ul class="rel cho_menu">'
                +'{{each json as value index}}'
                +    '<li><a href="javascript:" name="choLink" class="cho_link" data-id="{{value.typeId}}">{{value.typeId}}<span class="ml20" id="{{value.typeId}}"></span></a></li>'
                +'{{/each}}'
                +'</ul>'
    };
});
