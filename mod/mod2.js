/**
 * Created by steve on 2015/5/5.
 */
//模块的定义
var module = (function(mod){

    mod.reduce = function() {
        mod.count--;
    };

    return mod;

})(window.module || {});















