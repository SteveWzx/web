
$(function(){
    $('.photo-box').photoAlbum({
        prevButton: ['.thumb-prev-btn', '.photo-prev'],
        nextButton: ['.thumb-next-btn', '.photo-next'],
        pages: {pagePanel: '.page-num', triggerClass: 'current'},
        animate: {opacity: true, speed: 600},
        holdPage: true,
        mouseWheel: true,
        operate: function(index, length){
            //alert(index);
        }
    });
});

