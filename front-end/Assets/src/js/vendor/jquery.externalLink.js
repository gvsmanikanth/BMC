/*
 * Standardize the link behavior of picked items:
    Page/form - open in same window
    Document - open in separate window
    External web page or pdf/Docs - open in separate window
 * 
 * */


//$("a").externalLink(); //Apply rules to all links.
//$("a").externalLink({fileTypes:".doc,.pdf"}); //Apply rules to all links and matching filters to open in new window.

(function($){
	$.fn.externalLink = function(options){
	    var defaults = {fileTypes:""};
	    var opts = $.extend(defaults,options);
	    var typesArray = opts.fileTypes.split(',');
	    var extValid = new RegExp('/'+window.location.host+'/');
	    var jsValid = new RegExp('javascript');
		var isForm = new RegExp('\/forms\/');
	   	    
	    return this.each(function(){
	    	if(!extValid.test(this.href)) {
	    		if(!jsValid.test(this.href)){
					if(!this.href.indexOf("mailto")){
						this.target="";
					}else{
						this.target="_blank";
					}
	    		}
	    	}
	    	else {
		    	if(typesArray[0]!=="") {
		    		for(var i=0;i<typesArray.length;i=i+1) {
		    			if(this.href.indexOf(typesArray[i])>-1) {
		    				this.target="_blank";
		    			}
		    		}
		    	}
				
	    	}
			

	    		
	    });
	};
})(jQuery);