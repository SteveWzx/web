define(['jquery'],function($){
    return {
        source1:'{{each Result as value index}}'
            +'<ul class="zc_fp">'
            +'<li class="zc_fpli zc_fpli01"><span class="zc_fp1">{{value.AssetNumber}}</span><span>{{value.Sn}}</span><span>{{value.Name}}</span></li>'
            +'<li class="zc_fpli zc_fpli02"><span>{{value.Brand}}</span><span>{{value.Model}}</span></li>'
            +'<li class="zc_fpli zc_fpli03"><span>{{value.CpuNum}}</span><span>{{value.CoreNum}}</span><span>{{value.Memory}}</span><span>{{value.Disk}}</span><span>{{value.Raid}}</span></li>'
            +'<li class="zc_fpli zc_fpli04"><span>{{value.MroomId.Name}}</span><span>{{value.MareaId.Name}}</span><span>{{value.RackId.Name}}</span><span>内网ip</span><span>外网ip</span><span>管理网ip</span></li>'
            +'<li class="zc_fpli zc_fpli05"><span>{{Date.parse(value.BuyTime).toString("M/d/yyyy HH:mm")}}</span><span>{{Date.parse(value.CreateTime).toString("M/d/yyyy HH:mm")}}</span><span>{{Date.parse(value.UpdateTime).toString("M/d/yyyy HH:mm")}}</span><span>{{Date.parse(value.ExpirationDate).toString("M/d/yyyy HH:mm")}}</span></li>'
            +'<li class="zc_fpli zc_fpli06"><span>{{value.DepartmentId.Name}}</span><span>{{value.BusinessId.Name}}</span><span>{{value.ServiceTypeId.ServiceName}}</span><span>{{value.Admin}}</span><span>{{value.User}}</span><span>{{value.Status}}</span><span>{{value.Notes}}</span></li>'
            +'</ul>'
            +'{{/each}}'
    };
});