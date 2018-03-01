/*
 * Product Interest pre-select on Contact form
 */

//WEB-2626 - Product Interest
(function($){ 


	// Returns array of of querystring variables.
	function getUrlVars()
	{
	    var vars = [], hash;
	    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	    for(var i = 0; i < hashes.length; i++)
	    {
	        hash = hashes[i].split('=');
	        vars.push(hash[0]);
	        vars[hash[0]] = hash[1];
	    }
	    return vars;
	}
	
	// Add, edit, delete querystring parametes
	// key: parameter ID
	// value: parameter value : if parameter is blank it removes the item for querystring
	// url: row URL
	function UpdateQueryString(key, value, url) {
	    if (!url) url = window.location.href;
	    var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
	        hash;
	
	    if (re.test(url)) {
	        if (typeof value !== 'undefined' && value !== null)
	            return url.replace(re, '$1' + key + "=" + value + '$2$3');
	        else {
	            hash = url.split('#');
	            url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
	            if (typeof hash[1] !== 'undefined' && hash[1] !== null) 
	                url += '#' + hash[1];
	            return url;
	        }
	    }
	    else {
	        if (typeof value !== 'undefined' && value !== null) {
	            var separator = url.indexOf('?') !== -1 ? '&' : '?';
	            hash = url.split('#');
	            url = hash[0] + separator + key + '=' + value;
	            if (typeof hash[1] !== 'undefined' && hash[1] !== null) 
	                url += '#' + hash[1];
	            return url;
	        }
	        else
	            return url;
	    }
	}


	//Select all anchors tag and paas the dynamic parameter.
	$.fn.productInterest = function(){
	    var isForm = new RegExp('\/forms\/');
		if (typeof bmcMeta !== 'undefined' && typeof bmcMeta.page !== 'undefined'  && typeof bmcMeta.page.productCategories !== 'undefined') {
		var prodIntrest  = bmcMeta.page.productCategories;
		if(prodIntrest != ""){
			 return this.each(function(){
			    	if(isForm.test(this.href)){
		    			var prodIntrest  = bmcMeta.page.productCategories;
						$(this).attr("href", UpdateQueryString("productInterest" , prodIntrest,this.href));
		    		} 
			});
		}
	    }
	};
	
	
	//Check the parameter from the URL and match the Option value.
	if(window.location.href.indexOf("form") > -1) {
		var selectedText = getUrlVars()["productInterest"];
		if(selectedText){
			selectedText = selectedText.toLowerCase().replace(/%20|_/g,' ');
			$( document ).ready(function() {
				$('[name="C_Product_Interest1"]').find("option").each(function(){
					if(this.value.toLowerCase() == selectedText){
						$(this).attr("selected","selected");    
					}
				});
			});
		}
	}  
	
})(jQuery);