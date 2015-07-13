define(function(){
    return {
        source1:'{{each Result as value index}}'
            +'<li><span class="zc_sp">{{value.ServiceName}}</span><em>|</em><span class="zc_sp">{{value.Short}}</span></li>'
            +'{{/each}}'
    };
});