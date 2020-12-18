(function($) { // Begin jQuery
  $(function() { // DOM ready      
  if($('.orion-seconday-nav').length > 0){
    $('body').addClass('orion-body');
 
    // If a link has a dropdown, add sub menu toggle.
    $('.orion-seconday-nav .nav-wrap ul li a:not(:only-child)').click(function(e) {
      $(this).siblings('.nav-dropdown').toggle();
      $(this).toggleClass('dropdownSelected');
      // Close one dropdown when selecting another
      $('.orion-seconday-nav .nav-dropdown').not($(this).siblings()).hide();
      e.stopPropagation();
    });
    // Clicking away from dropdown will remove the dropdown class
    $('html').click(function() {
      $('.nav-dropdown').hide();
      $(this).find('.dropdownSelected').removeClass("dropdownSelected");
    });
    // Toggle open and close nav styles on click
    $('.orion-seconday-nav  #nav-toggle').click(function() {
      $('.orion-seconday-nav .nav-wrap ul').slideToggle();
      $('.orion-seconday-nav .nav-wrap .nav-cta').slideToggle();

    });
    // Hamburger to X toggle
    $('.orion-seconday-nav  #nav-toggle').on('click', function() {
      this.classList.toggle('active');
    });


	window.addEventListener("scroll", onFirstScroll);
	
	function onFirstScroll(){
		
	  // Sticky nav implimentation  
      stickyNav = $(".orion-seconday-nav");
      
	  navHeight = $(".layout-header").height();
	  
	  if($(".layout-navigation").height() <=75){
		navHeight += 50; 
	  }
	  if($(".layout-header").height() <70){
		navHeight = 30; 
	  }

      navHeight += $("#consent_blackbar").height();

      stickyNav.scrollspy({
        min: navHeight,
        max: 10000,
        onEnter: function(element, position) {
          stickyNav.addClass('fixed');
		  //$('.layout-header').hide();
          $('.layout-navigation').hide();
		  $("#consent_blackbar").hide();
          //$('.layout-navigation').css('visibility', 'hidden');
          //$('.layout-header').css('visibility', 'hidden');
          $('body').css('top', navHeight);
        },
        onLeave: function(element, position) {
          stickyNav.removeClass('fixed');
		  //$('.layout-header').show();
          $('.layout-navigation').show();
          $("#consent_blackbar").show();
          //$('.layout-navigation').css('visibility', 'visible');
          //$('.layout-header').css('visibility', 'visible');
          $('body').css('top', '0');
        }
      });

	  window.removeEventListener("scroll", onFirstScroll);

	}

  if($('.orion-seconday-nav').length > 0){
    var current = location.pathname;
    for(var i = 0; i < $('.orion-seconday-nav .nav-list li ').length; i++) {  
        var lilist = $('.orion-seconday-nav .nav-list li ')[i];
        var elementList = $(lilist).children('a');//querySelectorAll("a");
        //var elementList = $('.orion-seconday-nav .nav-list li')[i];
        var innerElementList=$(lilist).children('ul li a');
        //var innerElementList=$('.orion-seconday-nav .nav-list li ul li')[i];
        for(var j = 0; j < elementList.length; j++) {
            if($(elementList[j]).attr('href') !== -1){
                $(elementList[j]).parent().addClass('activePage');
            }   
        }
        for(var k = 0; k < innerElementList.length; k++){
            if($(innerElementList[k]).attr('href') !== -1){
                $(innerElementList[k]).parent().addClass('activePage');
                $(innerElementList[k]).parent().parent().parent().addClass('activePage');
            }
        }       
    }
} 
/* commenting this code as this is not working in IE11 Added above without "each"
         // Adding Active Navigation Class Based on URL
      if($('.orion-seconday-nav').length > 0){
        var current = location.pathname;
        $('.orion-seconday-nav .nav-list li ').each(function(){
                    
            var $this = $(this);
            $this.children('a').each(function(){
                // if the current path is like this link, make it active
                if(current.indexOf($(this).attr('href')) !== -1){
                    $(this).parent().addClass('activePage');
                }
            });
            $this.children('ul li a').each(function(){
                // if the current path is like this link, make it active
                if(current.indexOf($(this).attr('href')) !== -1){
                    $(this).parent().addClass('activePage');
                    $(this).parent().parent().parent().addClass('activePage');
                }
            });
            
        })
    } 
*/
    }
  }); // end DOM ready
})(jQuery); // end jQuery