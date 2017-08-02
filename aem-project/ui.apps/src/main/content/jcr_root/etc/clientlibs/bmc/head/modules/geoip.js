(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
	    			//console.log("Do Nothing --> cookie matched with GeoIPLanguageCode--> " + cookie);
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
		  	//console.log("URL matched with exclussion parameters - do not check for redirection");
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
		            //console.log(errorThrown);
		            onNoShowGeoIPAlert();
		        }
				});
		}
		catch(err){
			//console.log( "Country redirect call failed" );
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
			//console.log( "Country redirect call failed" );
		}
    }
    
    function showCountryRedirectPrompt(){
    	//console.log("call AJAX request");
	    		//data: "req_url="+window.location.href,
		        	//console.log(objWMARedirect);
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
					//$('body').addClass('country-redirect-prompt-modal-active');
					$(".layout-rediect-alert ").show(500);
					
					$("#a_redirectMe").click(function(e){
						e.preventDefault();
						var userSelection = "persistent";
						var isRemember = $("#cb_remember_country_prompt").is(':checked');
						
					   	if(isRemember){
							setCookiesOnDotCom(persistCookie,objWMARedirect.suggestedLangCode,true);
						}
						else{
							//$.cookie('p_Country', objWMARedirect.suggestedLangCode);
							//window.location = objWMARedirect.suggestedCountryDomain;
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
							//$.cookie('p_Country', objWMARedirect.currentLangCode);
							setCookiesOnDotCom(sessionCookie,objWMARedirect.currentLangCode,false);
						}
						hideCountryRedirectPrompt();
					});
					
				    $(".alert-region-close").click(function(e){
				    	e.preventDefault();
				    	//$.cookie('p_Country', objWMARedirect.currentLangCode);
				    	setCookiesOnDotCom(sessionCookie,objWMARedirect.currentLangCode,false);
				    	hideCountryRedirectPrompt();
					});
    }
    
    
    function hideCountryRedirectPrompt(){
		 $(".layout-rediect-alert").hide(500);
	}

    $(document).ready(function() {
	   //Added boolean check to enable GeoIP redirection logic. set cookie - runRedirectRoutine = true;
       	 	
       	/*var checkforRedirectRoutine = $.cookie("testGeoIP");
		if(checkforRedirectRoutine)
		{
			if(checkforRedirectRoutine.toString() == "true"){
				checkRedirection();
				$(".navigation-country").show();
			}
		}*/
		
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
			//$.cookie('p_Country', value);
			hideCountryRedirectPrompt();
			setCookiesOnDotCom(sessionCookie,value,true);
		}
		
	});
//End - Country Modal popup

	// Country Website Link list
		$('.international-link').click(function(e) {
			e.preventDefault();
			//var value = e.currentTarget.dataset.langid;
			var value = $(this).data("langid"); 
			setCookiesOnDotCom(sessionCookie,value,null);
		});
	//End - Country Website Link list
	
});// document ready
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2dlb2lwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwialF1ZXJ5KGZ1bmN0aW9uICgkKSB7XHJcblx0XHJcblx0Ly8gVmFyIHRvIHN0b3JlIFNlcnZpY2UgUmVzcG9uc2U6XHJcblx0dmFyIG9ialdNQVJlZGlyZWN0ID0gW107XHJcblx0XHJcblx0Ly8gZGVmdWFsdCBsYW5ndWFnZSBjb2RlXHJcblx0dmFyIEdlb0lQTGFuZ3VhZ2VDb2RlID0gXCJlbi1VU1wiO1xyXG5cdFxyXG5cdC8vIFN0YXRpYyB2YXJpYWJsc1xyXG5cdHZhciBzZXNzaW9uQ29va2llID0gXCJzZXNzaW9uXCI7XHJcblx0dmFyIHBlcnNpc3RDb29raWUgPSBcInBlcnNpc3RcIjtcclxuXHRcclxuXHQvLyBSZXR1cm5zIGFycmF5IG9mIG9mIHF1ZXJ5c3RyaW5nIHZhcmlhYmxlcy5cclxuXHRmdW5jdGlvbiBnZXRVcmxWYXJzKClcclxuXHR7XHJcblx0ICAgIHZhciB2YXJzID0gW10sIGhhc2g7XHJcblx0ICAgIHZhciBoYXNoZXMgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5zbGljZSh3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKCc/JykgKyAxKS5zcGxpdCgnJicpO1xyXG5cdCAgICBmb3IodmFyIGkgPSAwOyBpIDwgaGFzaGVzLmxlbmd0aDsgaSsrKVxyXG5cdCAgICB7XHJcblx0ICAgICAgICBoYXNoID0gaGFzaGVzW2ldLnNwbGl0KCc9Jyk7XHJcblx0ICAgICAgICB2YXJzLnB1c2goaGFzaFswXSk7XHJcblx0ICAgICAgICB2YXJzW2hhc2hbMF1dID0gaGFzaFsxXTtcclxuXHQgICAgfVxyXG5cdCAgICByZXR1cm4gdmFycztcclxuXHR9XHJcblx0XHJcblx0Ly8gQWRkLCBlZGl0LCBkZWxldGUgcXVlcnlzdHJpbmcgcGFyYW1ldGVzXHJcblx0Ly8ga2V5OiBwYXJhbWV0ZXIgSURcclxuXHQvLyB2YWx1ZTogcGFyYW1ldGVyIHZhbHVlIDogaWYgcGFyYW1ldGVyIGlzIGJsYW5rIGl0IHJlbW92ZXMgdGhlIGl0ZW0gZm9yIHF1ZXJ5c3RyaW5nXHJcblx0Ly8gdXJsOiByb3cgVVJMXHJcblx0ZnVuY3Rpb24gVXBkYXRlUXVlcnlTdHJpbmcoa2V5LCB2YWx1ZSwgdXJsKSB7XHJcblx0ICAgIGlmICghdXJsKSB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcclxuXHQgICAgdmFyIHJlID0gbmV3IFJlZ0V4cChcIihbPyZdKVwiICsga2V5ICsgXCI9Lio/KCZ8I3wkKSguKilcIiwgXCJnaVwiKSxcclxuXHQgICAgICAgIGhhc2g7XHJcblx0XHJcblx0ICAgIGlmIChyZS50ZXN0KHVybCkpIHtcclxuXHQgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlICE9PSBudWxsKVxyXG5cdCAgICAgICAgICAgIHJldHVybiB1cmwucmVwbGFjZShyZSwgJyQxJyArIGtleSArIFwiPVwiICsgdmFsdWUgKyAnJDIkMycpO1xyXG5cdCAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgaGFzaCA9IHVybC5zcGxpdCgnIycpO1xyXG5cdCAgICAgICAgICAgIHVybCA9IGhhc2hbMF0ucmVwbGFjZShyZSwgJyQxJDMnKS5yZXBsYWNlKC8oJnxcXD8pJC8sICcnKTtcclxuXHQgICAgICAgICAgICBpZiAodHlwZW9mIGhhc2hbMV0gIT09ICd1bmRlZmluZWQnICYmIGhhc2hbMV0gIT09IG51bGwpIFxyXG5cdCAgICAgICAgICAgICAgICB1cmwgKz0gJyMnICsgaGFzaFsxXTtcclxuXHQgICAgICAgICAgICByZXR1cm4gdXJsO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICB9XHJcblx0ICAgIGVsc2Uge1xyXG5cdCAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgIT09IG51bGwpIHtcclxuXHQgICAgICAgICAgICB2YXIgc2VwYXJhdG9yID0gdXJsLmluZGV4T2YoJz8nKSAhPT0gLTEgPyAnJicgOiAnPyc7XHJcblx0ICAgICAgICAgICAgaGFzaCA9IHVybC5zcGxpdCgnIycpO1xyXG5cdCAgICAgICAgICAgIHVybCA9IGhhc2hbMF0gKyBzZXBhcmF0b3IgKyBrZXkgKyAnPScgKyB2YWx1ZTtcclxuXHQgICAgICAgICAgICBpZiAodHlwZW9mIGhhc2hbMV0gIT09ICd1bmRlZmluZWQnICYmIGhhc2hbMV0gIT09IG51bGwpIFxyXG5cdCAgICAgICAgICAgICAgICB1cmwgKz0gJyMnICsgaGFzaFsxXTtcclxuXHQgICAgICAgICAgICByZXR1cm4gdXJsO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgZWxzZVxyXG5cdCAgICAgICAgICAgIHJldHVybiB1cmw7XHJcblx0ICAgIH1cclxuXHR9XHJcblx0XHJcblx0Ly9QYXJzZSBCTUNNZXRhIG9iamVjdCBpbiBwYWdlIGFuZCBnZXQgcmVkaXJlY3Rpb24gZGV0YWlscyBhcyB3ZWxsIGFzIHBhZ2UgZ2VvSVBMYW5ndWFnZUNvZGVcclxuXHRmdW5jdGlvbiBwYXJzZUJNQ0RhdGFBbmRDaGVja1JlZGlyZWN0aW9uKHBVUkwpe1xyXG4gICAgXHQvL1JldHVybiB0cnVlIGlmIHBhdHRlcm4gbm90IGZvdW5kXHJcblx0XHR2YXIgcmVkaXJlY3Rpb25Qb3NzaWJsZSA9IG51bGw7XHJcblx0XHRcclxuXHRcdGlmKHRoaXMuYm1jTWV0YSAmJiB0eXBlb2YoYm1jTWV0YSkgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mKGJtY01ldGEucGFnZSkhPT0gXCJ1bmRlZmluZWRcIiAmJiAgdHlwZW9mKGJtY01ldGEucGFnZS5HZW9JUCkhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YoYm1jTWV0YS5wYWdlLkdlb0lQLkdlb0lQUmVkaXJlY3RFeGNsdWRlZCkgIT09IFwidW5kZWZpbmVkXCIpXHJcblx0XHR7XHJcblx0XHRcdHJlZGlyZWN0aW9uUG9zc2libGUgPSAhYm1jTWV0YS5wYWdlLkdlb0lQLkdlb0lQUmVkaXJlY3RFeGNsdWRlZDtcclxuXHRcdFx0R2VvSVBMYW5ndWFnZUNvZGUgPSBibWNNZXRhLnBhZ2UuR2VvSVAuR2VvSVBMYW5ndWFnZUNvZGU7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmIChyZWRpcmVjdGlvblBvc3NpYmxlID09IG51bGwpXHJcblx0XHRcdHJlZGlyZWN0aW9uUG9zc2libGUgPSBmYWxzZTtcclxuXHRcdFx0XHJcblx0XHRyZXR1cm4gcmVkaXJlY3Rpb25Qb3NzaWJsZTtcclxuXHR9XHJcblx0XHJcblx0ZnVuY3Rpb24gb25Ob1Nob3dHZW9JUEFsZXJ0KCl7XHJcblx0XHR3aW5kb3cuc2hvd0hpZGVIZWFkZXJQcm9tcHQoKTtcclxuXHR9XHJcblx0XHJcblx0Ly9DaGFlY2sgZm9yIFJlZGlyZWN0aW9uLCBmdW5jdGlvbiBjYWxscyBvbiBldmVyeSBwYWdlIGxvYWQgXHJcblx0ZnVuY3Rpb24gY2hlY2tSZWRpcmVjdGlvbigpIFxyXG4gICAge1xyXG4gICAgXHRpZihwYXJzZUJNQ0RhdGFBbmRDaGVja1JlZGlyZWN0aW9uKCkpe1xyXG4gICAgXHRcdHZhciBjb29raWUgPSAkLmNvb2tpZShcInBfQ291bnRyeVwiKTtcclxuXHQgICAgXHRpZihjb29raWUpe1xyXG5cdCAgICBcdFx0aWYoR2VvSVBMYW5ndWFnZUNvZGUgPT0gY29va2llKXtcclxuXHQgICAgXHRcdFx0Ly9jb25zb2xlLmxvZyhcIkRvIE5vdGhpbmcgLS0+IGNvb2tpZSBtYXRjaGVkIHdpdGggR2VvSVBMYW5ndWFnZUNvZGUtLT4gXCIgKyBjb29raWUpO1xyXG5cdCAgICBcdFx0XHRvbk5vU2hvd0dlb0lQQWxlcnQoKTtcclxuXHQgICAgXHRcdH1cclxuXHQgICAgXHRcdGVsc2V7XHJcblx0ICAgIFx0XHRcdGdldERhdGFmcm9tU2VydmVyKCk7XHJcblx0ICAgIFx0XHR9XHJcblx0ICAgIFx0fVxyXG5cdCAgICBcdGVsc2V7XHJcblx0ICAgIFx0XHRnZXREYXRhZnJvbVNlcnZlcigpO1xyXG5cdFx0ICAgIH1cclxuXHRcdCAgfVxyXG5cdFx0ICBlbHNlIHtcclxuXHRcdCAgXHQvL2NvbnNvbGUubG9nKFwiVVJMIG1hdGNoZWQgd2l0aCBleGNsdXNzaW9uIHBhcmFtZXRlcnMgLSBkbyBub3QgY2hlY2sgZm9yIHJlZGlyZWN0aW9uXCIpO1xyXG5cdFx0ICBcdG9uTm9TaG93R2VvSVBBbGVydCgpO1xyXG5cdFx0ICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIFxyXG4gICAgXHJcbiAgICBmdW5jdGlvbiBnZXRFbnZpcm9ubWVudCgpXHJcbiAgICB7XHJcbiAgICBcdHZhciBlbnZpcm9ubWVudCA9IFwiXCI7XHJcbiAgICBcdFxyXG4gICAgXHRpZih0aGlzLmJtY01ldGEgJiYgdHlwZW9mKGJtY01ldGEpICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZihibWNNZXRhLnNpdGUpIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mKGJtY01ldGEuc2l0ZS5lbnZpcm9ubWVudCkgIT09IFwidW5kZWZpbmVkXCIpe1xyXG5cdFx0XHRlbnZpcm9ubWVudCA9IGJtY01ldGEuc2l0ZS5lbnZpcm9ubWVudDtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIGVudmlyb25tZW50O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIGdldENvcnJlY3RTZXJ2aWNlVVJMKCl7XHJcbiAgICBcdHZhciBkYXRhVXJsID0gXCJcIjtcclxuICAgIFx0dmFyIGVudmlyb25tZW50ID0gZ2V0RW52aXJvbm1lbnQoKTtcclxuICAgIFx0XHJcbiAgICBcdGlmKGVudmlyb25tZW50ID09IFwiZGV2LlwiIHx8IGVudmlyb25tZW50ID09IFwic3RhZ2UuXCIpe1xyXG5cdFx0XHQvL1JlbGF0aXZlIFBhdGggZm9yIGRldiBhbmQgc3RhZ2UuXHJcblx0XHRcdGRhdGFVcmwgPSBcIi90ZW1wbGF0ZXMvU2VydmljZUdlb0lQXCI7XHJcblx0XHR9XHJcblx0XHRlbHNle1xyXG5cdFx0XHQvL0hhcmQtY29hZGVkIHByb2R1Y3Rpb24gVVJMIC0gUmVsYXRpdmUgVVJMIGNhdXNpbmcgaXNzdWUgb24gaW50ZXJuYXRpb25hbCBzaXRlcy4gXHJcblx0XHRcdGRhdGFVcmwgPSBcImh0dHA6Ly93d3cuYm1jLmNvbS90ZW1wbGF0ZXMvU2VydmljZUdlb0lQXCI7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiBkYXRhVXJsO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIGdldERhdGFmcm9tU2VydmVyKCl7XHJcbiAgICBcdFxyXG5cdFx0dmFyIGRhdGFVcmwgPSBnZXRDb3JyZWN0U2VydmljZVVSTCgpO1xyXG5cdFx0XHJcbiAgICBcdHRyeXtcclxuICAgIFx0XHRcdHZhciBzdWNjZXNzID0gZnVuY3Rpb24oZGF0YSl7XHJcblx0XHQgICAgICAgICAgIFxyXG5cdFx0ICAgICAgICAgICAgb2JqV01BUmVkaXJlY3QgPSBkYXRhLnNlcnZpY2VHZW9JUFJlZGlyZWN0O1xyXG5cdFx0ICAgICAgICAgICAgLy9ubywgZm9yY2UsIHByb21wdFxyXG5cdFx0ICAgICAgICAgICAgaWYob2JqV01BUmVkaXJlY3QucmVkaXJlY3QgPT0gXCJub1wiKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHQkLmNvb2tpZSgncF9Db3VudHJ5Jywgb2JqV01BUmVkaXJlY3Quc3VnZ2VzdGVkTGFuZ0NvZGUpO1xyXG5cdFx0XHRcdFx0XHRvbk5vU2hvd0dlb0lQQWxlcnQoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2UgaWYob2JqV01BUmVkaXJlY3QucmVkaXJlY3QgPT0gXCJwcm9tcHRcIikgXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHNob3dDb3VudHJ5UmVkaXJlY3RQcm9tcHQoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2UgaWYob2JqV01BUmVkaXJlY3QucmVkaXJlY3QgPT0gXCJmb3JjZVwiKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHQkLmNvb2tpZSgncF9Db3VudHJ5Jywgb2JqV01BUmVkaXJlY3Quc3VnZ2VzdGVkTGFuZ0NvZGUpO1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0dmFyIG5ld1VSTCA9IGdldFJlZGlyZWN0VVJMKG9ialdNQVJlZGlyZWN0LnN1Z2dlc3RlZENvdW50cnlEb21haW4sb2JqV01BUmVkaXJlY3Quc3VnZ2VzdGVkTGFuZ0NvZGUpO1xyXG5cdFx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb249IG5ld1VSTDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdCAgICAgICAgfTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHR2YXIgcmVxRGF0YSA9IFwiYWN0aW9uPWdldCZHZW9JUExhbmd1YWdlQ29kZT1cIitHZW9JUExhbmd1YWdlQ29kZTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHQkLmFqYXgoe1xyXG5cdFx0XHRcdHR5cGU6ICdHRVQnLFxyXG5cdFx0XHRcdHVybDogZGF0YVVybCxcclxuXHRcdFx0XHRkYXRhOiByZXFEYXRhLC8vXCJhY3Rpb249Z2V0XCIsIC8vXCJyZXFfdXJsPVwiK3BVUkwsIC8vd2luZG93LmxvY2F0aW9uLmhyZWYsXHJcblx0XHRcdFx0ZGF0YVR5cGU6ICdqc29ucCcsXHJcblx0XHRcdFx0Y3Jvc3NEbWFpbjp0cnVlLFxyXG5cdFx0XHRcdGNhY2hlOmZhbHNlLFxyXG5cdFx0XHRcdHN1Y2Nlc3M6IHN1Y2Nlc3MsXHJcblx0XHRcdFx0anNvbnBDYWxsYmFjazpcImpzb25wUmVzcG9uc2VcIixcclxuXHRcdFx0XHRlcnJvcjpmdW5jdGlvbihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pe1xyXG5cdFx0ICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhlcnJvclRocm93bik7XHJcblx0XHQgICAgICAgICAgICBvbk5vU2hvd0dlb0lQQWxlcnQoKTtcclxuXHRcdCAgICAgICAgfVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0Y2F0Y2goZXJyKXtcclxuXHRcdFx0Ly9jb25zb2xlLmxvZyggXCJDb3VudHJ5IHJlZGlyZWN0IGNhbGwgZmFpbGVkXCIgKTtcclxuXHRcdH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgXHJcbiAgICBmdW5jdGlvbiBnZXRSZWRpcmVjdFVSTChuZXdEb21haW4scENvb2tpZSl7XHJcbiAgICBcdFxyXG4gICAgXHR2YXIgcnVubmluZ0Vudmlyb25lbW50ID0gZ2V0RW52aXJvbm1lbnQoKTtcclxuICAgIFx0XHJcbiAgICBcdHZhciBuZXdVUkwgPSBcIlwiO1xyXG4gICAgXHR2YXIgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XHJcbiAgICBcdFxyXG4gICAgXHRpZihydW5uaW5nRW52aXJvbmVtbnQgPT0gXCJkZXYuXCIgfHwgcnVubmluZ0Vudmlyb25lbW50ID09IFwic3RhZ2UuXCIpe1xyXG4gICAgXHRcdFxyXG4gICAgXHRcdG5ld1VSTCA9IFVwZGF0ZVF1ZXJ5U3RyaW5nKFwibGFuZ0lEXCIscENvb2tpZSx3aW5kb3cubG9jYXRpb24uaHJlZik7Ly8gKyBuZXdEb21haW47XHJcbiAgICBcdH1cclxuICAgIFx0ZWxzZXtcclxuICAgIFx0XHR2YXIgdXJsc3RyaW5nID0gdXJsLnJlcGxhY2UoL2h0dHBzPzpcXC9cXC9bXlxcL10rL2ksIFwiXCIpO1xyXG4gICAgXHRcdG5ld1VSTCA9IG5ld0RvbWFpbit1cmxzdHJpbmc7XHJcbiAgICBcdFx0XHJcbiAgICBcdH0gICAgXHRcclxuICAgIFx0cmV0dXJuIG5ld1VSTDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy9ib29sUmVkaXJlY3RGbGFnID09IHRydWUgLSByZWRpcmVjdCB0byByZXF1ZXN0ZWQgcGFnZVxyXG4gICAgLy9ib29sUmVkaXJlY3RGbGFnID09IGZhbHNlIC0gZG8gbm90IHJlZGlyZWN0XHJcbiAgICAvL2Jvb2xSZWRpcmVjdEZsYWcgPT0gbnVsbCAtIHJlZGlyZWN0IHRvIGRlZmF1bHQgZG9tYWluXHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIHNldENvb2tpZXNPbkRvdENvbSh0eXBlLHBDb29raWVWYWx1ZSxib29sUmVkaXJlY3RGbGFnKXtcclxuICAgIFx0XHJcblx0XHR2YXIgZGF0YVVybCA9IGdldENvcnJlY3RTZXJ2aWNlVVJMKCk7XHJcbiAgICBcdFxyXG4gICAgXHR0cnl7XHJcbiAgICBcdFx0XHRcclxuXHRcdFx0XHR2YXIgc3VjY2VzcyA9IGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0ICAgICAgICAgICBcclxuXHRcdCAgICAgICAgICAgICQuY29va2llKCdwX0NvdW50cnknLCBwQ29va2llVmFsdWUpO1xyXG5cdFx0ICAgICAgICAgICAgIGlmKGJvb2xSZWRpcmVjdEZsYWcpe1xyXG5cdFx0ICAgICAgICAgICAgXHR2YXIgbmV3VVJMID0gZ2V0UmVkaXJlY3RVUkwoZGF0YS5zdWdnZXN0ZWRDb3VudHJ5RG9tYWluLHBDb29raWVWYWx1ZSk7XHJcblx0XHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbj0gbmV3VVJMO1xyXG5cdFx0XHRcdFx0fSBcclxuXHRcdFx0XHRcdGVsc2UgaWYoYm9vbFJlZGlyZWN0RmxhZyA9PSBudWxsKXtcclxuXHRcdCAgICAgICAgICAgIFx0d2luZG93LmxvY2F0aW9uPSBkYXRhLnN1Z2dlc3RlZENvdW50cnlEb21haW47XHJcblx0XHRcdFx0XHR9XHJcblx0XHQgICAgICAgIH07XHJcblx0XHQgICAgICAgIFxyXG5cdFx0ICAgICAgICBmb3JtYXR0ZWREYXRhID0gXCJhY3Rpb249c2V0JnZhbHVlPVwiICsgcENvb2tpZVZhbHVlICsgXCImdHlwZT1cIit0eXBlO1xyXG5cdFx0ICAgICAgIFx0XHRcclxuXHRcdFx0XHQkLmFqYXgoe1xyXG5cdFx0XHRcdHR5cGU6ICdHRVQnLFxyXG5cdFx0XHRcdHVybDogZGF0YVVybCxcclxuXHRcdFx0XHRkYXRhOiBmb3JtYXR0ZWREYXRhLCAvL1wicmVxX3VybD1cIitwVVJMLCAvL3dpbmRvdy5sb2NhdGlvbi5ocmVmLFxyXG5cdFx0XHRcdGRhdGFUeXBlOiAnanNvbnAnLFxyXG5cdFx0XHRcdGNyb3NzRG1haW46dHJ1ZSxcclxuXHRcdFx0XHRjYWNoZTpmYWxzZSxcclxuXHRcdFx0XHRzdWNjZXNzOiBzdWNjZXNzLFxyXG5cdFx0XHRcdGpzb25wQ2FsbGJhY2s6XCJqc29ucFJlc3BvbnNlMlwiLFxyXG5cdFx0XHRcdGVycm9yOmZ1bmN0aW9uKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bil7XHJcblx0XHQgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGVycm9yVGhyb3duKTtcclxuXHRcdCAgICAgICAgfVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0Y2F0Y2goZXJyKXtcclxuXHRcdFx0Ly9jb25zb2xlLmxvZyggXCJDb3VudHJ5IHJlZGlyZWN0IGNhbGwgZmFpbGVkXCIgKTtcclxuXHRcdH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgZnVuY3Rpb24gc2hvd0NvdW50cnlSZWRpcmVjdFByb21wdCgpe1xyXG4gICAgXHQvL2NvbnNvbGUubG9nKFwiY2FsbCBBSkFYIHJlcXVlc3RcIik7XHJcblx0ICAgIFx0XHQvL2RhdGE6IFwicmVxX3VybD1cIit3aW5kb3cubG9jYXRpb24uaHJlZixcclxuXHRcdCAgICAgICAgXHQvL2NvbnNvbGUubG9nKG9ialdNQVJlZGlyZWN0KTtcclxuXHRcdFx0XHRcdHZhciBzdHJNZXNzYWdlID0gJzxkaXYgY2xhc3M9XCJsYXlvdXQtaW5uZXItd3JhcFwiPicgK1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCc8ZGl2IGNsYXNzPVwiYWxlcnRcIj4nK1xyXG5cdFx0XHRcdFx0XHRcdFx0ICAgICAgICAnPGEgY2xhc3M9XCJhbGVydC1yZWdpb24tY2xvc2VcIiBocmVmPVwiXCI+PC9hPicrXHJcblx0XHRcdFx0XHRcdFx0XHQgICAgIFx0JzxwPkl0IGxvb2tzIGxpa2UgeW91IGFyZSBsb2NhdGVkIGluICcrb2JqV01BUmVkaXJlY3RbXCJzdWdnZXN0ZWRDb3VudHJ5TmFtZVwiXSArJy48L3A+JytcclxuXHRcdFx0XHRcdFx0XHRcdCAgICAgXHQnPGEgY2xhc3M9XCJidG5cIiBpZD1cImFfcmVkaXJlY3RNZVwiIGhyZWY9XCJcIj5UYWtlIG1lIHRvIHRoZSBCTUMgPHN0cm9uZz4nK29ialdNQVJlZGlyZWN0W1wic3VnZ2VzdGVkQ291bnRyeU5hbWVcIl0rJyAoJysgb2JqV01BUmVkaXJlY3RbXCJzdWdnZXN0ZWRDb3VudHJ5TGFuZ3VhZ2VcIl0rJyk8L3N0cm9uZz4gc2l0ZSAnK1xyXG5cdFx0XHRcdFx0XHRcdFx0ICAgICBcdCc8c3BhbiBjbGFzcz1cImZsYWcgZmxhZy0nK29ialdNQVJlZGlyZWN0W1wic3VnZ2VzdGVkQ291bnRyeUZsYWdDb2RlXCJdKydcIj48L3NwYW4+PHNwYW4gY2xhc3M9XCJhLWFycm93LWNvbnRlbnRcIj48L3NwYW4+PC9hPicrXHJcblx0XHRcdFx0XHRcdFx0XHQgICAgIFx0JzxQPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwiY2JfcmVtZW1iZXJfY291bnRyeV9wcm9tcHRcIiBpZD1cImNiX3JlbWVtYmVyX2NvdW50cnlfcHJvbXB0XCIgY2hlY2tlZD1cImNoZWNrZWRcIj4nK1xyXG5cdFx0XHRcdFx0XHRcdFx0ICAgICAgICAnPGxhYmVsIGZvcj1cImNiX2NvdW50cnlfY2hvaWNlXCIgc2VsZWN0aW9uPXRydWU+UmVtZW1iZXIgbXkgc2VsZWN0aW9uPC9sYWJlbD48L1A+JytcclxuXHRcdFx0XHRcdFx0XHRcdCAgICAgICAgJzxwPjxhIGhyZWY9XCJcIiBpZD1cImFfZG9Ob3RSZWRpcmVjdFwiIHN0eWxlPVwiZGlzcGxheTogYmxvY2s7cGFkZGluZy1ib3R0b206IDFlbTtcIj5ObywgdGhhbmtzLiBJIHdpbGwgc3RheSBvbiB0aGUgQk1DIDxzdHJvbmc+JytvYmpXTUFSZWRpcmVjdFtcImN1cnJlbnRDb3VudHJ5TmFtZVwiXSsnICgnK29ialdNQVJlZGlyZWN0W1wiY3VycmVudENvdW50cnlMYW5ndWFnZVwiXSsnKTwvc3Ryb25nPiBzaXRlJytcclxuXHRcdFx0XHRcdFx0XHRcdCAgICAgICAgJzxzcGFuIGNsYXNzPVwiYS1hcnJvdy1jb250ZW50XCI+PC9zcGFuPicrXHJcblx0XHRcdFx0XHRcdFx0XHQgICAgICAgICc8L2E+PC9wPjwvZGl2PjwvZGl2Pic7XHRcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0JChcIi5sYXlvdXQtcmVkaWVjdC1hbGVydCBcIikuYXBwZW5kKHN0ck1lc3NhZ2UpO1xyXG5cdFx0XHRcdFx0Ly8kKCdib2R5JykuYWRkQ2xhc3MoJ2NvdW50cnktcmVkaXJlY3QtcHJvbXB0LW1vZGFsLWFjdGl2ZScpO1xyXG5cdFx0XHRcdFx0JChcIi5sYXlvdXQtcmVkaWVjdC1hbGVydCBcIikuc2hvdyg1MDApO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHQkKFwiI2FfcmVkaXJlY3RNZVwiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0XHR2YXIgdXNlclNlbGVjdGlvbiA9IFwicGVyc2lzdGVudFwiO1xyXG5cdFx0XHRcdFx0XHR2YXIgaXNSZW1lbWJlciA9ICQoXCIjY2JfcmVtZW1iZXJfY291bnRyeV9wcm9tcHRcIikuaXMoJzpjaGVja2VkJyk7XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0ICAgXHRpZihpc1JlbWVtYmVyKXtcclxuXHRcdFx0XHRcdFx0XHRzZXRDb29raWVzT25Eb3RDb20ocGVyc2lzdENvb2tpZSxvYmpXTUFSZWRpcmVjdC5zdWdnZXN0ZWRMYW5nQ29kZSx0cnVlKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRlbHNle1xyXG5cdFx0XHRcdFx0XHRcdC8vJC5jb29raWUoJ3BfQ291bnRyeScsIG9ialdNQVJlZGlyZWN0LnN1Z2dlc3RlZExhbmdDb2RlKTtcclxuXHRcdFx0XHRcdFx0XHQvL3dpbmRvdy5sb2NhdGlvbiA9IG9ialdNQVJlZGlyZWN0LnN1Z2dlc3RlZENvdW50cnlEb21haW47XHJcblx0XHRcdFx0XHRcdFx0c2V0Q29va2llc09uRG90Q29tKHNlc3Npb25Db29raWUsb2JqV01BUmVkaXJlY3Quc3VnZ2VzdGVkTGFuZ0NvZGUsdHJ1ZSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHQkKFwiI2FfZG9Ob3RSZWRpcmVjdFwiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0XHRpZigkKFwiI2NiX3JlbWVtYmVyX2NvdW50cnlfcHJvbXB0XCIpLmlzKCc6Y2hlY2tlZCcpKVxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0c2V0Q29va2llc09uRG90Q29tKHBlcnNpc3RDb29raWUsb2JqV01BUmVkaXJlY3QuY3VycmVudExhbmdDb2RlLGZhbHNlKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHQvLyQuY29va2llKCdwX0NvdW50cnknLCBvYmpXTUFSZWRpcmVjdC5jdXJyZW50TGFuZ0NvZGUpO1xyXG5cdFx0XHRcdFx0XHRcdHNldENvb2tpZXNPbkRvdENvbShzZXNzaW9uQ29va2llLG9ialdNQVJlZGlyZWN0LmN1cnJlbnRMYW5nQ29kZSxmYWxzZSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aGlkZUNvdW50cnlSZWRpcmVjdFByb21wdCgpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHQgICAgJChcIi5hbGVydC1yZWdpb24tY2xvc2VcIikuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRcdFx0ICAgIFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdCAgICBcdC8vJC5jb29raWUoJ3BfQ291bnRyeScsIG9ialdNQVJlZGlyZWN0LmN1cnJlbnRMYW5nQ29kZSk7XHJcblx0XHRcdFx0ICAgIFx0c2V0Q29va2llc09uRG90Q29tKHNlc3Npb25Db29raWUsb2JqV01BUmVkaXJlY3QuY3VycmVudExhbmdDb2RlLGZhbHNlKTtcclxuXHRcdFx0XHQgICAgXHRoaWRlQ291bnRyeVJlZGlyZWN0UHJvbXB0KCk7XHJcblx0XHRcdFx0XHR9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgXHJcbiAgICBmdW5jdGlvbiBoaWRlQ291bnRyeVJlZGlyZWN0UHJvbXB0KCl7XHJcblx0XHQgJChcIi5sYXlvdXQtcmVkaWVjdC1hbGVydFwiKS5oaWRlKDUwMCk7XHJcblx0fVxyXG5cclxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xyXG5cdCAgIC8vQWRkZWQgYm9vbGVhbiBjaGVjayB0byBlbmFibGUgR2VvSVAgcmVkaXJlY3Rpb24gbG9naWMuIHNldCBjb29raWUgLSBydW5SZWRpcmVjdFJvdXRpbmUgPSB0cnVlO1xyXG4gICAgICAgXHQgXHRcclxuICAgICAgIFx0Lyp2YXIgY2hlY2tmb3JSZWRpcmVjdFJvdXRpbmUgPSAkLmNvb2tpZShcInRlc3RHZW9JUFwiKTtcclxuXHRcdGlmKGNoZWNrZm9yUmVkaXJlY3RSb3V0aW5lKVxyXG5cdFx0e1xyXG5cdFx0XHRpZihjaGVja2ZvclJlZGlyZWN0Um91dGluZS50b1N0cmluZygpID09IFwidHJ1ZVwiKXtcclxuXHRcdFx0XHRjaGVja1JlZGlyZWN0aW9uKCk7XHJcblx0XHRcdFx0JChcIi5uYXZpZ2F0aW9uLWNvdW50cnlcIikuc2hvdygpO1xyXG5cdFx0XHR9XHJcblx0XHR9Ki9cclxuXHRcdFxyXG5cdFx0Y2hlY2tSZWRpcmVjdGlvbigpO1xyXG5cdH0pO1xyXG5cdC8vL1xyXG5cdFxyXG5cdC8vIENvdW50cnkgbW9kYWwgcG9wdXAgLSBTdG9yZSBzZWxlY3Rpb24gaW4gY29va2llIC0gQ2FsbGVkIFwicF9Db3VudHJ5XCJcclxuXHQkKCcuY291bnRyeS1tb2RhbC1pbm5lci13cmFwIGxpIGxpJykuY2xpY2soZnVuY3Rpb24oZSkge1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHJcblx0XHR2YXIgdXNlclNlbGVjdGlvbiA9IFwicGVyc2lzdGVudFwiO1xyXG5cdFx0XHJcblx0XHR2YXIgdmFsdWUgPSAkKHRoaXMpLmRhdGEoXCJsYW5naWRcIik7IC8vZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQubGFuZ2lkO1xyXG5cdFx0aWYoJChcIi5jb3VudHJ5LW1vZGFsLWlubmVyLXdyYXAgaW5wdXRcIikuaXMoJzpjaGVja2VkJykpXHJcblx0XHR7XHJcblx0XHRcdGhpZGVDb3VudHJ5UmVkaXJlY3RQcm9tcHQoKTtcclxuXHRcdFx0c2V0Q29va2llc09uRG90Q29tKHBlcnNpc3RDb29raWUsdmFsdWUsdHJ1ZSk7XHJcblx0XHR9XHJcblx0XHRlbHNlXHJcblx0XHR7XHJcblx0XHRcdC8vJC5jb29raWUoJ3BfQ291bnRyeScsIHZhbHVlKTtcclxuXHRcdFx0aGlkZUNvdW50cnlSZWRpcmVjdFByb21wdCgpO1xyXG5cdFx0XHRzZXRDb29raWVzT25Eb3RDb20oc2Vzc2lvbkNvb2tpZSx2YWx1ZSx0cnVlKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdH0pO1xyXG4vL0VuZCAtIENvdW50cnkgTW9kYWwgcG9wdXBcclxuXHJcblx0Ly8gQ291bnRyeSBXZWJzaXRlIExpbmsgbGlzdFxyXG5cdFx0JCgnLmludGVybmF0aW9uYWwtbGluaycpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHQvL3ZhciB2YWx1ZSA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmxhbmdpZDtcclxuXHRcdFx0dmFyIHZhbHVlID0gJCh0aGlzKS5kYXRhKFwibGFuZ2lkXCIpOyBcclxuXHRcdFx0c2V0Q29va2llc09uRG90Q29tKHNlc3Npb25Db29raWUsdmFsdWUsbnVsbCk7XHJcblx0XHR9KTtcclxuXHQvL0VuZCAtIENvdW50cnkgV2Vic2l0ZSBMaW5rIGxpc3RcclxuXHRcclxufSk7Ly8gZG9jdW1lbnQgcmVhZHkiXX0=
