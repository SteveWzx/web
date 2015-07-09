require.config({
	paths:{
		jquery: 'jquery-1.11.3.min'
	}
});
require(['jquery','backtop'],function($,backtop){
	/*new backtop.BackTop($('#backTop'),{
		mode:'move'
	});*/
	$('#backTop').backtop({
		mode:'move'
	});
});