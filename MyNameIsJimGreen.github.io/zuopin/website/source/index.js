/**
 * Main JS file for Casper behaviours
 */

/*globals jQuery, document */
(function ($) {
    "use strict";

    $(document).ready(function(){

        /**
         *
         * Post list in Home
         *
         */

         $('.home-template .post, .archive-template .post').each( function() {

            if($(this).hasClass('ad')) return;

            var image = $(this).find('.post-content img').first();
            var imgUrl = image.attr('src');
            var siteUrl = $(this).find('.post-content a').last().attr('href');

            var thumbnail = $(this).find('.post-featured-image > .thumbnail >img');
    
            if(!thumbnail.attr('data-original')) {
              thumbnail.attr('data-original', imgUrl);
            }

            if(siteUrl) {
              $(this).find('a').attr('href', siteUrl);
            }

            $(this).find('.post-content').remove();
         
          });


         /* lazyload */

         $(".thumbnail > img").lazyload();

         if($('body').hasClass('home-template')) {
          console.log('home');
          var source=$('#ad-template').html();
          var template = Handlebars.compile(source);

          var topHtml = template({ads: ads.slice(0,2)}),
            bottomHtml = template({ads: ads.slice(2)});

          $('#post-list').prepend(topHtml);
          $('#post-list').append(bottomHtml);

         }


          /**
          *
          * Complete Post infos
          *
         */
         $('.post-template').each(function(){
            var $link = $(this).find('.post-content a').first().addClass('url');
            $(this).find('.post h1').first().html($link).append('<i class="fa fa-external-link"></i>');
         });


         $('.post-template .post-content img').wrap(function(){
          var src = $(this).attr('src');

          return $('<a class="mfp-zoom"></a>').attr('href', src);
         });


          $('.post-template .post-content a').magnificPopup({
            type: 'image',
            closeOnContentClick: true,
            showCloseBtn: false,


          });

		//open outgoing links in new window
		//$('a[href^="http://"]').add('a[href^="https://"]').attr('target','_blank');


    });

}(jQuery));