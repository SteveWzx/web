define(function(){
    return {
        source1:'<ul class="zc_list">'
                +'{{each Result as value index}}'
                +'<li {{if index == 0}} class="zc_liston" {{/if}} data-id="{{value.Id}}"><a href="#">{{value.Name}}</a></li>'
                +'{{/each}}'
                +'</ul>',
        source2:'{{each Result as value index}}'
                +'<p class="zc_til02"><a href="#" class="zc_btn btn_edit">编辑</a>{{value.Name}}</p>'
                +'<div class="zc_indiv">'
                +    '<p><label for="lxr">联系人：</label><input type="text" name="lxr" id="lxr" class="zc_in" value="{{value.Contacts}}"><label for="phone">电话：</label><input type="text" name="phone" id="phone" class="zc_in" value="{{value.Mobile}}"></p>'
                +    '<p><label for="tgs">提供商：</label><input type="text" name="tgs" id="tgs" class="zc_in" value="{{value.Isp}}"><label for="beiz">名称：</label><input type="text" name="beiz" id="beiz" class="zc_in" value="{{value.Name}}"></p>'
                +    '<p><label for="dz">地&nbsp;&nbsp;&nbsp;址：</label><input type="text" name="dz" id="dz" class="zc_in w420" value="{{value.Addr}}"></p>'
                +'</div>'
                +'{{/each}}',
        source3:'<div class="zc_til03 zc_bom_left">'
                +    '<a href="#" class="zc_btn btn_area">添加</a>机房区域'
                +'</div>'
                +'<div class="zc_til03 zc_bom_right">'
                +    '<a href="#" class="zc_btn btn_rack">添加</a>机柜'
                +'</div>',
        source4:'{{each Result as value index}}'
                +'<li {{if index == 0}} class="zc_liston" {{/if}} data-id="{{value.Id}}"><a href="#">{{value.Name}}</a></li>'
                +'{{/each}}',
        source5:'<p class="zc_bom_rtil"><span class="zc_sp01">名称</span><em>|</em><span class="zc_sp02">Unit</span><em>|</em><span class="zc_sp03">服务器数量</span></p>'
                +'<ul>'
                +'{{each Result as value index}}'
                +'<li><span class="zc_sp01">{{value.Name}}</span><em>|</em><span class="zc_sp02">{{value.Unit}}</span><em>|</em><span class="zc_sp03">{{value.ComputeNum}}</span></li>'
                +'{{/each}}'
                +'</ul>',
        source6:'<p class="zc_inrtab"><a href="#" data-type="0" class="zc_inrtabon">内网IP</a><a href="#" data-type="1">外网IP</a><a href="#" class="nobg" data-type="2">管理网IP</a></p>'
                +'<a href="#" class="zc_btn btn_ip">添加</a>',
        source7:'{{each Result as value index}}'
                +'{{if value.Status == 0 }}'
                +'<li><span class="zc_lp00">未使用</span><em>|</em><span class="zc_lp02">{{value.IpAddr}}</span><em>|</em><span class="zc_lp03">{{value.Mask}}</span></li>'
                +'{{else if value.Status == 1 }}'
                +'<li><span class="zc_lp00 zc_lp01">使用中</span><em>|</em><span class="zc_lp02">{{value.IpAddr}}</span><em>|</em><span class="zc_lp03">{{value.Mask}}</span></li>'
                +'{{/if}}'
                +'{{/each}}'
    };
});