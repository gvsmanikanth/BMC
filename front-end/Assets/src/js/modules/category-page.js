;(function($){
	
	//DXP-157: Cleanup guide pages for category.
	
	if ($("body").hasClass("page-category") == true) {
	 	  
		  //DXP-1064: Added ".float-rail-nav a" selector to add current class using front-end.
		  
		  $('.itil-nav a, .float-rail-nav a').each(function() {
			
			var link_href = jQuery(this).attr('href');
			
		    if (getPageName(link_href)  ===  getPageName(window.location.pathname)) {
		      jQuery(this).addClass('current');
		    }
		  });
		  
		  
		  //DXP-1064: Added ".float-rail-nav li" selector to add current class using front-end.
		  
		  $('.itil-nav li, .float-rail-nav li').each(function() {
			var full_href = jQuery(this).find('a').attr('href');
			
			if(full_href){
			    var href = getPageName(full_href);
			    if (href === getPageName(window.location.pathname)) {
			      jQuery(this).addClass('current');
			    }
			}
			
		  });	  
		  
		 //DXP-1064: Updated function to return page name for current page comparison.
		  
		  function getPageName (pPath) {
			  if(pPath){
			    var index = pPath.lastIndexOf("/") + 1,
			        filenameWithExtension = pPath.substr(index),
			        filename = filenameWithExtension.split(".")[0];  
			    return filename;
			  }
			  else{
				return "";  
			  }
		  };
		  
		  var pageName = "[data-showon='"+getPageName(window.location.href)+"']";
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