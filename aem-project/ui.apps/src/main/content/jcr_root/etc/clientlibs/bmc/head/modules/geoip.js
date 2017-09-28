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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL2dlb2lwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwialF1ZXJ5KGZ1bmN0aW9uICgkKSB7XG5cdFxuXHQvLyBWYXIgdG8gc3RvcmUgU2VydmljZSBSZXNwb25zZTpcblx0dmFyIG9ialdNQVJlZGlyZWN0ID0gW107XG5cdFxuXHQvLyBkZWZ1YWx0IGxhbmd1YWdlIGNvZGVcblx0dmFyIEdlb0lQTGFuZ3VhZ2VDb2RlID0gXCJlbi1VU1wiO1xuXHRcblx0Ly8gU3RhdGljIHZhcmlhYmxzXG5cdHZhciBzZXNzaW9uQ29va2llID0gXCJzZXNzaW9uXCI7XG5cdHZhciBwZXJzaXN0Q29va2llID0gXCJwZXJzaXN0XCI7XG5cdFxuXHQvLyBSZXR1cm5zIGFycmF5IG9mIG9mIHF1ZXJ5c3RyaW5nIHZhcmlhYmxlcy5cblx0ZnVuY3Rpb24gZ2V0VXJsVmFycygpXG5cdHtcblx0ICAgIHZhciB2YXJzID0gW10sIGhhc2g7XG5cdCAgICB2YXIgaGFzaGVzID0gd2luZG93LmxvY2F0aW9uLmhyZWYuc2xpY2Uod2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZignPycpICsgMSkuc3BsaXQoJyYnKTtcblx0ICAgIGZvcih2YXIgaSA9IDA7IGkgPCBoYXNoZXMubGVuZ3RoOyBpKyspXG5cdCAgICB7XG5cdCAgICAgICAgaGFzaCA9IGhhc2hlc1tpXS5zcGxpdCgnPScpO1xuXHQgICAgICAgIHZhcnMucHVzaChoYXNoWzBdKTtcblx0ICAgICAgICB2YXJzW2hhc2hbMF1dID0gaGFzaFsxXTtcblx0ICAgIH1cblx0ICAgIHJldHVybiB2YXJzO1xuXHR9XG5cdFxuXHQvLyBBZGQsIGVkaXQsIGRlbGV0ZSBxdWVyeXN0cmluZyBwYXJhbWV0ZXNcblx0Ly8ga2V5OiBwYXJhbWV0ZXIgSURcblx0Ly8gdmFsdWU6IHBhcmFtZXRlciB2YWx1ZSA6IGlmIHBhcmFtZXRlciBpcyBibGFuayBpdCByZW1vdmVzIHRoZSBpdGVtIGZvciBxdWVyeXN0cmluZ1xuXHQvLyB1cmw6IHJvdyBVUkxcblx0ZnVuY3Rpb24gVXBkYXRlUXVlcnlTdHJpbmcoa2V5LCB2YWx1ZSwgdXJsKSB7XG5cdCAgICBpZiAoIXVybCkgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdCAgICB2YXIgcmUgPSBuZXcgUmVnRXhwKFwiKFs/Jl0pXCIgKyBrZXkgKyBcIj0uKj8oJnwjfCQpKC4qKVwiLCBcImdpXCIpLFxuXHQgICAgICAgIGhhc2g7XG5cdFxuXHQgICAgaWYgKHJlLnRlc3QodXJsKSkge1xuXHQgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlICE9PSBudWxsKVxuXHQgICAgICAgICAgICByZXR1cm4gdXJsLnJlcGxhY2UocmUsICckMScgKyBrZXkgKyBcIj1cIiArIHZhbHVlICsgJyQyJDMnKTtcblx0ICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgaGFzaCA9IHVybC5zcGxpdCgnIycpO1xuXHQgICAgICAgICAgICB1cmwgPSBoYXNoWzBdLnJlcGxhY2UocmUsICckMSQzJykucmVwbGFjZSgvKCZ8XFw/KSQvLCAnJyk7XG5cdCAgICAgICAgICAgIGlmICh0eXBlb2YgaGFzaFsxXSAhPT0gJ3VuZGVmaW5lZCcgJiYgaGFzaFsxXSAhPT0gbnVsbCkgXG5cdCAgICAgICAgICAgICAgICB1cmwgKz0gJyMnICsgaGFzaFsxXTtcblx0ICAgICAgICAgICAgcmV0dXJuIHVybDtcblx0ICAgICAgICB9XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0ICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZSAhPT0gbnVsbCkge1xuXHQgICAgICAgICAgICB2YXIgc2VwYXJhdG9yID0gdXJsLmluZGV4T2YoJz8nKSAhPT0gLTEgPyAnJicgOiAnPyc7XG5cdCAgICAgICAgICAgIGhhc2ggPSB1cmwuc3BsaXQoJyMnKTtcblx0ICAgICAgICAgICAgdXJsID0gaGFzaFswXSArIHNlcGFyYXRvciArIGtleSArICc9JyArIHZhbHVlO1xuXHQgICAgICAgICAgICBpZiAodHlwZW9mIGhhc2hbMV0gIT09ICd1bmRlZmluZWQnICYmIGhhc2hbMV0gIT09IG51bGwpIFxuXHQgICAgICAgICAgICAgICAgdXJsICs9ICcjJyArIGhhc2hbMV07XG5cdCAgICAgICAgICAgIHJldHVybiB1cmw7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGVsc2Vcblx0ICAgICAgICAgICAgcmV0dXJuIHVybDtcblx0ICAgIH1cblx0fVxuXHRcblx0Ly9QYXJzZSBCTUNNZXRhIG9iamVjdCBpbiBwYWdlIGFuZCBnZXQgcmVkaXJlY3Rpb24gZGV0YWlscyBhcyB3ZWxsIGFzIHBhZ2UgZ2VvSVBMYW5ndWFnZUNvZGVcblx0ZnVuY3Rpb24gcGFyc2VCTUNEYXRhQW5kQ2hlY2tSZWRpcmVjdGlvbihwVVJMKXtcbiAgICBcdC8vUmV0dXJuIHRydWUgaWYgcGF0dGVybiBub3QgZm91bmRcblx0XHR2YXIgcmVkaXJlY3Rpb25Qb3NzaWJsZSA9IG51bGw7XG5cdFx0XG5cdFx0aWYodGhpcy5ibWNNZXRhICYmIHR5cGVvZihibWNNZXRhKSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YoYm1jTWV0YS5wYWdlKSE9PSBcInVuZGVmaW5lZFwiICYmICB0eXBlb2YoYm1jTWV0YS5wYWdlLkdlb0lQKSE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZihibWNNZXRhLnBhZ2UuR2VvSVAuR2VvSVBSZWRpcmVjdEV4Y2x1ZGVkKSAhPT0gXCJ1bmRlZmluZWRcIilcblx0XHR7XG5cdFx0XHRyZWRpcmVjdGlvblBvc3NpYmxlID0gIWJtY01ldGEucGFnZS5HZW9JUC5HZW9JUFJlZGlyZWN0RXhjbHVkZWQ7XG5cdFx0XHRHZW9JUExhbmd1YWdlQ29kZSA9IGJtY01ldGEucGFnZS5HZW9JUC5HZW9JUExhbmd1YWdlQ29kZTtcblx0XHR9XG5cdFx0XG5cdFx0aWYgKHJlZGlyZWN0aW9uUG9zc2libGUgPT0gbnVsbClcblx0XHRcdHJlZGlyZWN0aW9uUG9zc2libGUgPSBmYWxzZTtcblx0XHRcdFxuXHRcdHJldHVybiByZWRpcmVjdGlvblBvc3NpYmxlO1xuXHR9XG5cdFxuXHRmdW5jdGlvbiBvbk5vU2hvd0dlb0lQQWxlcnQoKXtcblx0XHR3aW5kb3cuc2hvd0hpZGVIZWFkZXJQcm9tcHQoKTtcblx0fVxuXHRcblx0Ly9DaGFlY2sgZm9yIFJlZGlyZWN0aW9uLCBmdW5jdGlvbiBjYWxscyBvbiBldmVyeSBwYWdlIGxvYWQgXG5cdGZ1bmN0aW9uIGNoZWNrUmVkaXJlY3Rpb24oKSBcbiAgICB7XG4gICAgXHRpZihwYXJzZUJNQ0RhdGFBbmRDaGVja1JlZGlyZWN0aW9uKCkpe1xuICAgIFx0XHR2YXIgY29va2llID0gJC5jb29raWUoXCJwX0NvdW50cnlcIik7XG5cdCAgICBcdGlmKGNvb2tpZSl7XG5cdCAgICBcdFx0aWYoR2VvSVBMYW5ndWFnZUNvZGUgPT0gY29va2llKXtcblx0ICAgIFx0XHRcdC8vY29uc29sZS5sb2coXCJEbyBOb3RoaW5nIC0tPiBjb29raWUgbWF0Y2hlZCB3aXRoIEdlb0lQTGFuZ3VhZ2VDb2RlLS0+IFwiICsgY29va2llKTtcblx0ICAgIFx0XHRcdG9uTm9TaG93R2VvSVBBbGVydCgpO1xuXHQgICAgXHRcdH1cblx0ICAgIFx0XHRlbHNle1xuXHQgICAgXHRcdFx0Z2V0RGF0YWZyb21TZXJ2ZXIoKTtcblx0ICAgIFx0XHR9XG5cdCAgICBcdH1cblx0ICAgIFx0ZWxzZXtcblx0ICAgIFx0XHRnZXREYXRhZnJvbVNlcnZlcigpO1xuXHRcdCAgICB9XG5cdFx0ICB9XG5cdFx0ICBlbHNlIHtcblx0XHQgIFx0Ly9jb25zb2xlLmxvZyhcIlVSTCBtYXRjaGVkIHdpdGggZXhjbHVzc2lvbiBwYXJhbWV0ZXJzIC0gZG8gbm90IGNoZWNrIGZvciByZWRpcmVjdGlvblwiKTtcblx0XHQgIFx0b25Ob1Nob3dHZW9JUEFsZXJ0KCk7XG5cdFx0ICB9XG4gICAgfVxuICAgIFxuICAgIFxuICAgIFxuICAgIGZ1bmN0aW9uIGdldEVudmlyb25tZW50KClcbiAgICB7XG4gICAgXHR2YXIgZW52aXJvbm1lbnQgPSBcIlwiO1xuICAgIFx0XG4gICAgXHRpZih0aGlzLmJtY01ldGEgJiYgdHlwZW9mKGJtY01ldGEpICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZihibWNNZXRhLnNpdGUpIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mKGJtY01ldGEuc2l0ZS5lbnZpcm9ubWVudCkgIT09IFwidW5kZWZpbmVkXCIpe1xuXHRcdFx0ZW52aXJvbm1lbnQgPSBibWNNZXRhLnNpdGUuZW52aXJvbm1lbnQ7XG5cdFx0fVxuXHRcdFxuXHRcdHJldHVybiBlbnZpcm9ubWVudDtcbiAgICB9XG4gICAgXG4gICAgXG4gICAgZnVuY3Rpb24gZ2V0Q29ycmVjdFNlcnZpY2VVUkwoKXtcbiAgICBcdHZhciBkYXRhVXJsID0gXCJcIjtcbiAgICBcdHZhciBlbnZpcm9ubWVudCA9IGdldEVudmlyb25tZW50KCk7XG4gICAgXHRcbiAgICBcdGlmKGVudmlyb25tZW50ID09IFwiZGV2LlwiIHx8IGVudmlyb25tZW50ID09IFwic3RhZ2UuXCIpe1xuXHRcdFx0Ly9SZWxhdGl2ZSBQYXRoIGZvciBkZXYgYW5kIHN0YWdlLlxuXHRcdFx0ZGF0YVVybCA9IFwiL3RlbXBsYXRlcy9TZXJ2aWNlR2VvSVBcIjtcblx0XHR9XG5cdFx0ZWxzZXtcblx0XHRcdC8vSGFyZC1jb2FkZWQgcHJvZHVjdGlvbiBVUkwgLSBSZWxhdGl2ZSBVUkwgY2F1c2luZyBpc3N1ZSBvbiBpbnRlcm5hdGlvbmFsIHNpdGVzLiBcblx0XHRcdGRhdGFVcmwgPSBcImh0dHA6Ly93d3cuYm1jLmNvbS90ZW1wbGF0ZXMvU2VydmljZUdlb0lQXCI7XG5cdFx0fVxuXHRcdFxuXHRcdHJldHVybiBkYXRhVXJsO1xuICAgIH1cbiAgICBcbiAgICBcbiAgICBmdW5jdGlvbiBnZXREYXRhZnJvbVNlcnZlcigpe1xuICAgIFx0XG5cdFx0dmFyIGRhdGFVcmwgPSBnZXRDb3JyZWN0U2VydmljZVVSTCgpO1xuXHRcdFxuICAgIFx0dHJ5e1xuICAgIFx0XHRcdHZhciBzdWNjZXNzID0gZnVuY3Rpb24oZGF0YSl7XG5cdFx0ICAgICAgICAgICBcblx0XHQgICAgICAgICAgICBvYmpXTUFSZWRpcmVjdCA9IGRhdGEuc2VydmljZUdlb0lQUmVkaXJlY3Q7XG5cdFx0ICAgICAgICAgICAgLy9ubywgZm9yY2UsIHByb21wdFxuXHRcdCAgICAgICAgICAgIGlmKG9ialdNQVJlZGlyZWN0LnJlZGlyZWN0ID09IFwibm9cIilcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHQkLmNvb2tpZSgncF9Db3VudHJ5Jywgb2JqV01BUmVkaXJlY3Quc3VnZ2VzdGVkTGFuZ0NvZGUpO1xuXHRcdFx0XHRcdFx0b25Ob1Nob3dHZW9JUEFsZXJ0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgaWYob2JqV01BUmVkaXJlY3QucmVkaXJlY3QgPT0gXCJwcm9tcHRcIikgXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0c2hvd0NvdW50cnlSZWRpcmVjdFByb21wdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIGlmKG9ialdNQVJlZGlyZWN0LnJlZGlyZWN0ID09IFwiZm9yY2VcIilcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHQkLmNvb2tpZSgncF9Db3VudHJ5Jywgb2JqV01BUmVkaXJlY3Quc3VnZ2VzdGVkTGFuZ0NvZGUpO1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHR2YXIgbmV3VVJMID0gZ2V0UmVkaXJlY3RVUkwob2JqV01BUmVkaXJlY3Quc3VnZ2VzdGVkQ291bnRyeURvbWFpbixvYmpXTUFSZWRpcmVjdC5zdWdnZXN0ZWRMYW5nQ29kZSk7XG5cdFx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb249IG5ld1VSTDtcblx0XHRcdFx0XHR9XG5cdFx0ICAgICAgICB9O1xuXHRcdFx0XHRcblx0XHRcdFx0dmFyIHJlcURhdGEgPSBcImFjdGlvbj1nZXQmR2VvSVBMYW5ndWFnZUNvZGU9XCIrR2VvSVBMYW5ndWFnZUNvZGU7XG5cdFx0XHRcdFxuXHRcdFx0XHQkLmFqYXgoe1xuXHRcdFx0XHR0eXBlOiAnR0VUJyxcblx0XHRcdFx0dXJsOiBkYXRhVXJsLFxuXHRcdFx0XHRkYXRhOiByZXFEYXRhLC8vXCJhY3Rpb249Z2V0XCIsIC8vXCJyZXFfdXJsPVwiK3BVUkwsIC8vd2luZG93LmxvY2F0aW9uLmhyZWYsXG5cdFx0XHRcdGRhdGFUeXBlOiAnanNvbnAnLFxuXHRcdFx0XHRjcm9zc0RtYWluOnRydWUsXG5cdFx0XHRcdGNhY2hlOmZhbHNlLFxuXHRcdFx0XHRzdWNjZXNzOiBzdWNjZXNzLFxuXHRcdFx0XHRqc29ucENhbGxiYWNrOlwianNvbnBSZXNwb25zZVwiLFxuXHRcdFx0XHRlcnJvcjpmdW5jdGlvbihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pe1xuXHRcdCAgICAgICAgICAgIC8vY29uc29sZS5sb2coZXJyb3JUaHJvd24pO1xuXHRcdCAgICAgICAgICAgIG9uTm9TaG93R2VvSVBBbGVydCgpO1xuXHRcdCAgICAgICAgfVxuXHRcdFx0XHR9KTtcblx0XHR9XG5cdFx0Y2F0Y2goZXJyKXtcblx0XHRcdC8vY29uc29sZS5sb2coIFwiQ291bnRyeSByZWRpcmVjdCBjYWxsIGZhaWxlZFwiICk7XG5cdFx0fVxuICAgIH1cbiAgICBcbiAgICBcbiAgICBmdW5jdGlvbiBnZXRSZWRpcmVjdFVSTChuZXdEb21haW4scENvb2tpZSl7XG4gICAgXHRcbiAgICBcdHZhciBydW5uaW5nRW52aXJvbmVtbnQgPSBnZXRFbnZpcm9ubWVudCgpO1xuICAgIFx0XG4gICAgXHR2YXIgbmV3VVJMID0gXCJcIjtcbiAgICBcdHZhciB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICBcdFxuICAgIFx0aWYocnVubmluZ0Vudmlyb25lbW50ID09IFwiZGV2LlwiIHx8IHJ1bm5pbmdFbnZpcm9uZW1udCA9PSBcInN0YWdlLlwiKXtcbiAgICBcdFx0XG4gICAgXHRcdG5ld1VSTCA9IFVwZGF0ZVF1ZXJ5U3RyaW5nKFwibGFuZ0lEXCIscENvb2tpZSx3aW5kb3cubG9jYXRpb24uaHJlZik7Ly8gKyBuZXdEb21haW47XG4gICAgXHR9XG4gICAgXHRlbHNle1xuICAgIFx0XHR2YXIgdXJsc3RyaW5nID0gdXJsLnJlcGxhY2UoL2h0dHBzPzpcXC9cXC9bXlxcL10rL2ksIFwiXCIpO1xuICAgIFx0XHRuZXdVUkwgPSBuZXdEb21haW4rdXJsc3RyaW5nO1xuICAgIFx0XHRcbiAgICBcdH0gICAgXHRcbiAgICBcdHJldHVybiBuZXdVUkw7XG4gICAgfVxuICAgIFxuICAgIC8vYm9vbFJlZGlyZWN0RmxhZyA9PSB0cnVlIC0gcmVkaXJlY3QgdG8gcmVxdWVzdGVkIHBhZ2VcbiAgICAvL2Jvb2xSZWRpcmVjdEZsYWcgPT0gZmFsc2UgLSBkbyBub3QgcmVkaXJlY3RcbiAgICAvL2Jvb2xSZWRpcmVjdEZsYWcgPT0gbnVsbCAtIHJlZGlyZWN0IHRvIGRlZmF1bHQgZG9tYWluXG4gICAgXG4gICAgZnVuY3Rpb24gc2V0Q29va2llc09uRG90Q29tKHR5cGUscENvb2tpZVZhbHVlLGJvb2xSZWRpcmVjdEZsYWcpe1xuICAgIFx0XG5cdFx0dmFyIGRhdGFVcmwgPSBnZXRDb3JyZWN0U2VydmljZVVSTCgpO1xuICAgIFx0XG4gICAgXHR0cnl7XG4gICAgXHRcdFx0XG5cdFx0XHRcdHZhciBzdWNjZXNzID0gZnVuY3Rpb24oZGF0YSl7XG5cdFx0ICAgICAgICAgICBcblx0XHQgICAgICAgICAgICAkLmNvb2tpZSgncF9Db3VudHJ5JywgcENvb2tpZVZhbHVlKTtcblx0XHQgICAgICAgICAgICAgaWYoYm9vbFJlZGlyZWN0RmxhZyl7XG5cdFx0ICAgICAgICAgICAgXHR2YXIgbmV3VVJMID0gZ2V0UmVkaXJlY3RVUkwoZGF0YS5zdWdnZXN0ZWRDb3VudHJ5RG9tYWluLHBDb29raWVWYWx1ZSk7XG5cdFx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb249IG5ld1VSTDtcblx0XHRcdFx0XHR9IFxuXHRcdFx0XHRcdGVsc2UgaWYoYm9vbFJlZGlyZWN0RmxhZyA9PSBudWxsKXtcblx0XHQgICAgICAgICAgICBcdHdpbmRvdy5sb2NhdGlvbj0gZGF0YS5zdWdnZXN0ZWRDb3VudHJ5RG9tYWluO1xuXHRcdFx0XHRcdH1cblx0XHQgICAgICAgIH07XG5cdFx0ICAgICAgICBcblx0XHQgICAgICAgIGZvcm1hdHRlZERhdGEgPSBcImFjdGlvbj1zZXQmdmFsdWU9XCIgKyBwQ29va2llVmFsdWUgKyBcIiZ0eXBlPVwiK3R5cGU7XG5cdFx0ICAgICAgIFx0XHRcblx0XHRcdFx0JC5hamF4KHtcblx0XHRcdFx0dHlwZTogJ0dFVCcsXG5cdFx0XHRcdHVybDogZGF0YVVybCxcblx0XHRcdFx0ZGF0YTogZm9ybWF0dGVkRGF0YSwgLy9cInJlcV91cmw9XCIrcFVSTCwgLy93aW5kb3cubG9jYXRpb24uaHJlZixcblx0XHRcdFx0ZGF0YVR5cGU6ICdqc29ucCcsXG5cdFx0XHRcdGNyb3NzRG1haW46dHJ1ZSxcblx0XHRcdFx0Y2FjaGU6ZmFsc2UsXG5cdFx0XHRcdHN1Y2Nlc3M6IHN1Y2Nlc3MsXG5cdFx0XHRcdGpzb25wQ2FsbGJhY2s6XCJqc29ucFJlc3BvbnNlMlwiLFxuXHRcdFx0XHRlcnJvcjpmdW5jdGlvbihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pe1xuXHRcdCAgICAgICAgICAgIC8vY29uc29sZS5sb2coZXJyb3JUaHJvd24pO1xuXHRcdCAgICAgICAgfVxuXHRcdFx0XHR9KTtcblx0XHR9XG5cdFx0Y2F0Y2goZXJyKXtcblx0XHRcdC8vY29uc29sZS5sb2coIFwiQ291bnRyeSByZWRpcmVjdCBjYWxsIGZhaWxlZFwiICk7XG5cdFx0fVxuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBzaG93Q291bnRyeVJlZGlyZWN0UHJvbXB0KCl7XG4gICAgXHQvL2NvbnNvbGUubG9nKFwiY2FsbCBBSkFYIHJlcXVlc3RcIik7XG5cdCAgICBcdFx0Ly9kYXRhOiBcInJlcV91cmw9XCIrd2luZG93LmxvY2F0aW9uLmhyZWYsXG5cdFx0ICAgICAgICBcdC8vY29uc29sZS5sb2cob2JqV01BUmVkaXJlY3QpO1xuXHRcdFx0XHRcdHZhciBzdHJNZXNzYWdlID0gJzxkaXYgY2xhc3M9XCJsYXlvdXQtaW5uZXItd3JhcFwiPicgK1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQnPGRpdiBjbGFzcz1cImFsZXJ0XCI+Jytcblx0XHRcdFx0XHRcdFx0XHQgICAgICAgICc8YSBjbGFzcz1cImFsZXJ0LXJlZ2lvbi1jbG9zZVwiIGhyZWY9XCJcIj48L2E+Jytcblx0XHRcdFx0XHRcdFx0XHQgICAgIFx0JzxwPkl0IGxvb2tzIGxpa2UgeW91IGFyZSBsb2NhdGVkIGluICcrb2JqV01BUmVkaXJlY3RbXCJzdWdnZXN0ZWRDb3VudHJ5TmFtZVwiXSArJy48L3A+Jytcblx0XHRcdFx0XHRcdFx0XHQgICAgIFx0JzxhIGNsYXNzPVwiYnRuXCIgaWQ9XCJhX3JlZGlyZWN0TWVcIiBocmVmPVwiXCI+VGFrZSBtZSB0byB0aGUgQk1DIDxzdHJvbmc+JytvYmpXTUFSZWRpcmVjdFtcInN1Z2dlc3RlZENvdW50cnlOYW1lXCJdKycgKCcrIG9ialdNQVJlZGlyZWN0W1wic3VnZ2VzdGVkQ291bnRyeUxhbmd1YWdlXCJdKycpPC9zdHJvbmc+IHNpdGUgJytcblx0XHRcdFx0XHRcdFx0XHQgICAgIFx0JzxzcGFuIGNsYXNzPVwiZmxhZyBmbGFnLScrb2JqV01BUmVkaXJlY3RbXCJzdWdnZXN0ZWRDb3VudHJ5RmxhZ0NvZGVcIl0rJ1wiPjwvc3Bhbj48c3BhbiBjbGFzcz1cImEtYXJyb3ctY29udGVudFwiPjwvc3Bhbj48L2E+Jytcblx0XHRcdFx0XHRcdFx0XHQgICAgIFx0JzxQPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwiY2JfcmVtZW1iZXJfY291bnRyeV9wcm9tcHRcIiBpZD1cImNiX3JlbWVtYmVyX2NvdW50cnlfcHJvbXB0XCIgY2hlY2tlZD1cImNoZWNrZWRcIj4nK1xuXHRcdFx0XHRcdFx0XHRcdCAgICAgICAgJzxsYWJlbCBmb3I9XCJjYl9jb3VudHJ5X2Nob2ljZVwiIHNlbGVjdGlvbj10cnVlPlJlbWVtYmVyIG15IHNlbGVjdGlvbjwvbGFiZWw+PC9QPicrXG5cdFx0XHRcdFx0XHRcdFx0ICAgICAgICAnPHA+PGEgaHJlZj1cIlwiIGlkPVwiYV9kb05vdFJlZGlyZWN0XCIgc3R5bGU9XCJkaXNwbGF5OiBibG9jaztwYWRkaW5nLWJvdHRvbTogMWVtO1wiPk5vLCB0aGFua3MuIEkgd2lsbCBzdGF5IG9uIHRoZSBCTUMgPHN0cm9uZz4nK29ialdNQVJlZGlyZWN0W1wiY3VycmVudENvdW50cnlOYW1lXCJdKycgKCcrb2JqV01BUmVkaXJlY3RbXCJjdXJyZW50Q291bnRyeUxhbmd1YWdlXCJdKycpPC9zdHJvbmc+IHNpdGUnK1xuXHRcdFx0XHRcdFx0XHRcdCAgICAgICAgJzxzcGFuIGNsYXNzPVwiYS1hcnJvdy1jb250ZW50XCI+PC9zcGFuPicrXG5cdFx0XHRcdFx0XHRcdFx0ICAgICAgICAnPC9hPjwvcD48L2Rpdj48L2Rpdj4nO1x0XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0JChcIi5sYXlvdXQtcmVkaWVjdC1hbGVydCBcIikuYXBwZW5kKHN0ck1lc3NhZ2UpO1xuXHRcdFx0XHRcdC8vJCgnYm9keScpLmFkZENsYXNzKCdjb3VudHJ5LXJlZGlyZWN0LXByb21wdC1tb2RhbC1hY3RpdmUnKTtcblx0XHRcdFx0XHQkKFwiLmxheW91dC1yZWRpZWN0LWFsZXJ0IFwiKS5zaG93KDUwMCk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0JChcIiNhX3JlZGlyZWN0TWVcIikuY2xpY2soZnVuY3Rpb24oZSl7XG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHR2YXIgdXNlclNlbGVjdGlvbiA9IFwicGVyc2lzdGVudFwiO1xuXHRcdFx0XHRcdFx0dmFyIGlzUmVtZW1iZXIgPSAkKFwiI2NiX3JlbWVtYmVyX2NvdW50cnlfcHJvbXB0XCIpLmlzKCc6Y2hlY2tlZCcpO1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0ICAgXHRpZihpc1JlbWVtYmVyKXtcblx0XHRcdFx0XHRcdFx0c2V0Q29va2llc09uRG90Q29tKHBlcnNpc3RDb29raWUsb2JqV01BUmVkaXJlY3Quc3VnZ2VzdGVkTGFuZ0NvZGUsdHJ1ZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0XHQvLyQuY29va2llKCdwX0NvdW50cnknLCBvYmpXTUFSZWRpcmVjdC5zdWdnZXN0ZWRMYW5nQ29kZSk7XG5cdFx0XHRcdFx0XHRcdC8vd2luZG93LmxvY2F0aW9uID0gb2JqV01BUmVkaXJlY3Quc3VnZ2VzdGVkQ291bnRyeURvbWFpbjtcblx0XHRcdFx0XHRcdFx0c2V0Q29va2llc09uRG90Q29tKHNlc3Npb25Db29raWUsb2JqV01BUmVkaXJlY3Quc3VnZ2VzdGVkTGFuZ0NvZGUsdHJ1ZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0JChcIiNhX2RvTm90UmVkaXJlY3RcIikuY2xpY2soZnVuY3Rpb24oZSl7XG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRpZigkKFwiI2NiX3JlbWVtYmVyX2NvdW50cnlfcHJvbXB0XCIpLmlzKCc6Y2hlY2tlZCcpKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRzZXRDb29raWVzT25Eb3RDb20ocGVyc2lzdENvb2tpZSxvYmpXTUFSZWRpcmVjdC5jdXJyZW50TGFuZ0NvZGUsZmFsc2UpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHQvLyQuY29va2llKCdwX0NvdW50cnknLCBvYmpXTUFSZWRpcmVjdC5jdXJyZW50TGFuZ0NvZGUpO1xuXHRcdFx0XHRcdFx0XHRzZXRDb29raWVzT25Eb3RDb20oc2Vzc2lvbkNvb2tpZSxvYmpXTUFSZWRpcmVjdC5jdXJyZW50TGFuZ0NvZGUsZmFsc2UpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aGlkZUNvdW50cnlSZWRpcmVjdFByb21wdCgpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHQgICAgJChcIi5hbGVydC1yZWdpb24tY2xvc2VcIikuY2xpY2soZnVuY3Rpb24oZSl7XG5cdFx0XHRcdCAgICBcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0ICAgIFx0Ly8kLmNvb2tpZSgncF9Db3VudHJ5Jywgb2JqV01BUmVkaXJlY3QuY3VycmVudExhbmdDb2RlKTtcblx0XHRcdFx0ICAgIFx0c2V0Q29va2llc09uRG90Q29tKHNlc3Npb25Db29raWUsb2JqV01BUmVkaXJlY3QuY3VycmVudExhbmdDb2RlLGZhbHNlKTtcblx0XHRcdFx0ICAgIFx0aGlkZUNvdW50cnlSZWRpcmVjdFByb21wdCgpO1xuXHRcdFx0XHRcdH0pO1xuICAgIH1cbiAgICBcbiAgICBcbiAgICBmdW5jdGlvbiBoaWRlQ291bnRyeVJlZGlyZWN0UHJvbXB0KCl7XG5cdFx0ICQoXCIubGF5b3V0LXJlZGllY3QtYWxlcnRcIikuaGlkZSg1MDApO1xuXHR9XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcblx0ICAgLy9BZGRlZCBib29sZWFuIGNoZWNrIHRvIGVuYWJsZSBHZW9JUCByZWRpcmVjdGlvbiBsb2dpYy4gc2V0IGNvb2tpZSAtIHJ1blJlZGlyZWN0Um91dGluZSA9IHRydWU7XG4gICAgICAgXHQgXHRcbiAgICAgICBcdC8qdmFyIGNoZWNrZm9yUmVkaXJlY3RSb3V0aW5lID0gJC5jb29raWUoXCJ0ZXN0R2VvSVBcIik7XG5cdFx0aWYoY2hlY2tmb3JSZWRpcmVjdFJvdXRpbmUpXG5cdFx0e1xuXHRcdFx0aWYoY2hlY2tmb3JSZWRpcmVjdFJvdXRpbmUudG9TdHJpbmcoKSA9PSBcInRydWVcIil7XG5cdFx0XHRcdGNoZWNrUmVkaXJlY3Rpb24oKTtcblx0XHRcdFx0JChcIi5uYXZpZ2F0aW9uLWNvdW50cnlcIikuc2hvdygpO1xuXHRcdFx0fVxuXHRcdH0qL1xuXHRcdFxuXHRcdGNoZWNrUmVkaXJlY3Rpb24oKTtcblx0fSk7XG5cdC8vL1xuXHRcblx0Ly8gQ291bnRyeSBtb2RhbCBwb3B1cCAtIFN0b3JlIHNlbGVjdGlvbiBpbiBjb29raWUgLSBDYWxsZWQgXCJwX0NvdW50cnlcIlxuXHQkKCcuY291bnRyeS1tb2RhbC1pbm5lci13cmFwIGxpIGxpJykuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcblx0XHR2YXIgdXNlclNlbGVjdGlvbiA9IFwicGVyc2lzdGVudFwiO1xuXHRcdFxuXHRcdHZhciB2YWx1ZSA9ICQodGhpcykuZGF0YShcImxhbmdpZFwiKTsgLy9lLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5sYW5naWQ7XG5cdFx0aWYoJChcIi5jb3VudHJ5LW1vZGFsLWlubmVyLXdyYXAgaW5wdXRcIikuaXMoJzpjaGVja2VkJykpXG5cdFx0e1xuXHRcdFx0aGlkZUNvdW50cnlSZWRpcmVjdFByb21wdCgpO1xuXHRcdFx0c2V0Q29va2llc09uRG90Q29tKHBlcnNpc3RDb29raWUsdmFsdWUsdHJ1ZSk7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHQvLyQuY29va2llKCdwX0NvdW50cnknLCB2YWx1ZSk7XG5cdFx0XHRoaWRlQ291bnRyeVJlZGlyZWN0UHJvbXB0KCk7XG5cdFx0XHRzZXRDb29raWVzT25Eb3RDb20oc2Vzc2lvbkNvb2tpZSx2YWx1ZSx0cnVlKTtcblx0XHR9XG5cdFx0XG5cdH0pO1xuLy9FbmQgLSBDb3VudHJ5IE1vZGFsIHBvcHVwXG5cblx0Ly8gQ291bnRyeSBXZWJzaXRlIExpbmsgbGlzdFxuXHRcdCQoJy5pbnRlcm5hdGlvbmFsLWxpbmsnKS5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHQvL3ZhciB2YWx1ZSA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmxhbmdpZDtcblx0XHRcdHZhciB2YWx1ZSA9ICQodGhpcykuZGF0YShcImxhbmdpZFwiKTsgXG5cdFx0XHRzZXRDb29raWVzT25Eb3RDb20oc2Vzc2lvbkNvb2tpZSx2YWx1ZSxudWxsKTtcblx0XHR9KTtcblx0Ly9FbmQgLSBDb3VudHJ5IFdlYnNpdGUgTGluayBsaXN0XG5cdFxufSk7Ly8gZG9jdW1lbnQgcmVhZHkiXX0=
