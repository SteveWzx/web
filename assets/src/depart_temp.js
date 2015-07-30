define(function(){
    return {
        source1:'<ul class="zc_list">'
            +'{{each Result as value index}}'
            +'<li {{if index == 0}} class="zc_liston" {{/if}} data-id="{{value.Id}}"><a href="#">{{value.Name}}</a></li>'
            +'{{/each}}'
            +'</ul>',
        source2:'{{each Result as value index}}'
            +'<li>{{value.Name}}</li>'
            +'{{/each}}'
    };
});