jQuery(function ($) {
	
	// Var to store Service Response:
	var objWMARedirect = [];
	
	// defualt language code
	var GeoIPLanguageCode = "en-US";
	
	// Static variabls
	var sessionCookie = "session";
	var persistCookie = "persist";
	
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
	
	//Parse BMCMeta object in page and get redirection details as well as page geoIPLanguageCode
	function parseBMCDataAndCheckRedirection(pURL){
    	//Return true if pattern not found
		var redirectionPossible = null;
		
		if(this.bmcMeta && typeof(bmcMeta) !== "undefined" && typeof(bmcMeta.page)!== "undefined" &&  typeof(bmcMeta.page.GeoIP)!== "undefined" && typeof(bmcMeta.page.GeoIP.GeoIPRedirectExcluded) !== "undefined")
		{
			redirectionPossible = !bmcMeta.page.GeoIP.GeoIPRedirectExcluded;
			GeoIPLanguageCode = bmcMeta.page.GeoIP.GeoIPLanguageCode;
		}
		
		if (redirectionPossible == null)
			redirectionPossible = false;
			
		return redirectionPossible;
	}
	
	function onNoShowGeoIPAlert(){
		window.showHideHeaderPrompt();
	}
	
	//Chaeck for Redirection, function calls on every page load 
	function checkRedirection() 
    {
    	if(parseBMCDataAndCheckRedirection()){
    		var cookie = $.cookie("p_Country");
	    	if(cookie){
	    		if(GeoIPLanguageCode == cookie){
	    			onNoShowGeoIPAlert();
	    		}
	    		else{
	    			getDatafromServer();
	    		}
	    	}
	    	else{
	    		getDatafromServer();
		    }
		  }
		  else {
		  	onNoShowGeoIPAlert();
		  }
    }
    
    
    
    function getEnvironment()
    {
    	var environment = "";
    	
    	if(this.bmcMeta && typeof(bmcMeta) !== "undefined" && typeof(bmcMeta.site)!== "undefined" && typeof(bmcMeta.site.environment) !== "undefined"){
			environment = bmcMeta.site.environment;
		}
		
		return environment;
    }
    
    
    function getCorrectServiceURL(){
    	var dataUrl = "";
    	var environment = getEnvironment();
    	
    	if(environment == "dev." || environment == "stage."){
			//Relative Path for dev and stage.
			dataUrl = "/templates/ServiceGeoIP";
		}
		else{
			//Hard-coaded production URL - Relative URL causing issue on international sites. 
			dataUrl = "http://www.bmc.com/templates/ServiceGeoIP";
		}
		
		return dataUrl;
    }
    
    
    function getDatafromServer(){
    	
		var dataUrl = getCorrectServiceURL();
		
    	try{
    			var success = function(data){
		           
		            objWMARedirect = data.serviceGeoIPRedirect;
		            //no, force, prompt
		            if(objWMARedirect.redirect == "no")
					{
						$.cookie('p_Country', objWMARedirect.suggestedLangCode);
						onNoShowGeoIPAlert();
					}
					else if(objWMARedirect.redirect == "prompt") 
					{
						showCountryRedirectPrompt();
					}
					else if(objWMARedirect.redirect == "force")
					{
						$.cookie('p_Country', objWMARedirect.suggestedLangCode);
						
						var newURL = getRedirectURL(objWMARedirect.suggestedCountryDomain,objWMARedirect.suggestedLangCode);
						window.location= newURL;
					}
		        };
				
				var reqData = "action=get&GeoIPLanguageCode="+GeoIPLanguageCode;
				
				$.ajax({
				type: 'GET',
				url: dataUrl,
				data: reqData,//"action=get", //"req_url="+pURL, //window.location.href,
				dataType: 'jsonp',
				crossDmain:true,
				cache:false,
				success: success,
				jsonpCallback:"jsonpResponse",
				error:function(jqXHR, textStatus, errorThrown){
		            onNoShowGeoIPAlert();
		        }
				});
		}
		catch(err){
			
		}
    }
    
    
    function getRedirectURL(newDomain,pCookie){
    	
    	var runningEnvironemnt = getEnvironment();
    	
    	var newURL = "";
    	var url = window.location.href;
    	
    	if(runningEnvironemnt == "dev." || runningEnvironemnt == "stage."){
    		
    		newURL = UpdateQueryString("langID",pCookie,window.location.href);// + newDomain;
    	}
    	else{
    		var urlstring = url.replace(/https?:\/\/[^\/]+/i, "");
    		newURL = newDomain+urlstring;
    		
    	}    	
    	return newURL;
    }
    
    //boolRedirectFlag == true - redirect to requested page
    //boolRedirectFlag == false - do not redirect
    //boolRedirectFlag == null - redirect to default domain
    
    function setCookiesOnDotCom(type,pCookieValue,boolRedirectFlag){
    	
		var dataUrl = getCorrectServiceURL();
    	
    	try{
    			
				var success = function(data){
		           
		            $.cookie('p_Country', pCookieValue);
		             if(boolRedirectFlag){
		            	var newURL = getRedirectURL(data.suggestedCountryDomain,pCookieValue);
						window.location= newURL;
					} 
					else if(boolRedirectFlag == null){
		            	window.location= data.suggestedCountryDomain;
					}
		        };
		        
		        formattedData = "action=set&value=" + pCookieValue + "&type="+type;
		       		
				$.ajax({
				type: 'GET',
				url: dataUrl,
				data: formattedData, //"req_url="+pURL, //window.location.href,
				dataType: 'jsonp',
				crossDmain:true,
				cache:false,
				success: success,
				jsonpCallback:"jsonpResponse2",
				error:function(jqXHR, textStatus, errorThrown){
		            //console.log(errorThrown);
		        }
				});
		}
		catch(err){
			
		}
    }
    
    function showCountryRedirectPrompt(){
					var strMessage = '<div class="layout-inner-wrap">' +
										'<div class="alert">'+
								        '<a class="alert-region-close" href=""></a>'+
								     	'<p>It looks like you are located in '+objWMARedirect["suggestedCountryName"] +'.</p>'+
								     	'<a class="btn" id="a_redirectMe" href="">Take me to the BMC <strong>'+objWMARedirect["suggestedCountryName"]+' ('+ objWMARedirect["suggestedCountryLanguage"]+')</strong> site '+
								     	'<span class="flag flag-'+objWMARedirect["suggestedCountryFlagCode"]+'"></span><span class="a-arrow-content"></span></a>'+
								     	'<P><input type="checkbox" name="cb_remember_country_prompt" id="cb_remember_country_prompt" checked="checked">'+
								        '<label for="cb_country_choice" selection=true>Remember my selection</label></P>'+
								        '<p><a href="" id="a_doNotRedirect" style="display: block;padding-bottom: 1em;">No, thanks. I will stay on the BMC <strong>'+objWMARedirect["currentCountryName"]+' ('+objWMARedirect["currentCountryLanguage"]+')</strong> site'+
								        '<span class="a-arrow-content"></span>'+
								        '</a></p></div></div>';	
					
					$(".layout-rediect-alert ").append(strMessage);
					$(".layout-rediect-alert ").show(500);
					
					$("#a_redirectMe").click(function(e){
						e.preventDefault();
						var userSelection = "persistent";
						var isRemember = $("#cb_remember_country_prompt").is(':checked');
						
					   	if(isRemember){
							setCookiesOnDotCom(persistCookie,objWMARedirect.suggestedLangCode,true);
						}
						else{
							
							setCookiesOnDotCom(sessionCookie,objWMARedirect.suggestedLangCode,true);
						}
					});
					
					$("#a_doNotRedirect").click(function(e){
						e.preventDefault();
						if($("#cb_remember_country_prompt").is(':checked'))
						{
							setCookiesOnDotCom(persistCookie,objWMARedirect.currentLangCode,false);
						}
						else
						{
							setCookiesOnDotCom(sessionCookie,objWMARedirect.currentLangCode,false);
						}
						hideCountryRedirectPrompt();
					});
					
				    $(".alert-region-close").click(function(e){
				    	e.preventDefault();
				    	setCookiesOnDotCom(sessionCookie,objWMARedirect.currentLangCode,false);
				    	hideCountryRedirectPrompt();
					});
    }
    
    
    function hideCountryRedirectPrompt(){
		 $(".layout-rediect-alert").hide(500);
	}

    $(document).ready(function() {
	   //Added boolean check to enable GeoIP redirection logic. set cookie - runRedirectRoutine = true;
		checkRedirection();
	});
	///
	
	// Country modal popup - Store selection in cookie - Called "p_Country"
	$('.country-modal-inner-wrap li li').click(function(e) {
		e.preventDefault();
		
		var userSelection = "persistent";
		
		var value = $(this).data("langid"); //e.currentTarget.dataset.langid;
		if($(".country-modal-inner-wrap input").is(':checked'))
		{
			hideCountryRedirectPrompt();
			setCookiesOnDotCom(persistCookie,value,true);
		}
		else
		{
			hideCountryRedirectPrompt();
			setCookiesOnDotCom(sessionCookie,value,true);
		}
		
	});
//End - Country Modal popup

	// Country Website Link list
		$('.international-link').click(function(e) {
			e.preventDefault();
			var value = $(this).data("langid"); 
			setCookiesOnDotCom(sessionCookie,value,null);
		});
	//End - Country Website Link list
	
});// document ready