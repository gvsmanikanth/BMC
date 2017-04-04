;(function($){
	
	//DXP-157: Cleanup guide pages for category.
	
	if ($("body").hasClass("page-category") == true) {
	 	  $('.itil-nav a').each(function() {
		    if (jQuery(this).attr('href')  ===  window.location.pathname) {
		      jQuery(this).addClass('current');
		    }
		  });
		  
		  $('.itil-nav li').each(function() {
		    var href = jQuery(this).find('a').attr('href');
		    if (href === window.location.pathname) {
		      jQuery(this).addClass('current');
		    }
		  });
		  
		  this.getPageName = function() {
			    var index = window.location.href.lastIndexOf("/") + 1,
			        filenameWithExtension = window.location.href.substr(index),
			        filename = filenameWithExtension.split(".")[0];  

			    return filename;                                     
			};
		  
		  var pageName = "[data-showon='"+getPageName()+"']";
		  $(pageName).show();
	
		  $(document).scroll(function(){	
	          if( $(document).scrollTop() > 200 ){
	               $('.stt_container').fadeIn();
	          }
	          else{
	               $('.stt_container').fadeOut();
	          }
		  });
        
        $('.stt_container').click(function(){
            $('html,body').animate({
                            scrollTop: '0px'
            },500);
        });
	}

}(jQuery));