(function( global, factory ){
	function log(content){
		console && console.log(content);
	}
	//log(window+","+factory);
	log(global);
	factory(2,9213);
})(typeof window !=="undefined"?window:this,function(a,b){
	alert(a+b);
})