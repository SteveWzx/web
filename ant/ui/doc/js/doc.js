$(window).scroll(function(){
	var top = $(this).scrollTop();
	if(top > 60){
		$('body').css('padding-top', 60);
		$('.doc-top').css({
			position: 'fixed',
			top: 0,
			left: 0,
			zIndex: 10,
			width: '100%'
		});
	}else{
		$('body').css('padding-top', 0);
		$('.doc-top').css({
			position: 'static',
			top: 0
		});
	}
	if(top > 160){
		$('.doc-nav-list').css({
			position: 'fixed',
			top: 60,
			width: 160
		});
	}else{
		$('.doc-nav-list').css({
			position: 'static',
			top: 0
		});
	}
});

$('.doc-content').monitor('dl', {
	dirWrap:'.doc-fast-nav',
	listWrap: '.doc-nav-list p',
	disTop:{maxTop: 99999},
	topDiff: 70
});
$('.ant-toplace').toPlace('top', {
	animate: true,
	speed: 200
});