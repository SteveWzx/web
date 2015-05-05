var module = (function(mod){

    mod.count = 0;

    mod.increment = function() {
        mod.count++;
    };
    mod.reset = function() {
        mod.count = 0;
    };
    mod.get = function() {
        console.log(mod.count);
    };

    return mod;

})(window.module || {});















