(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*! Respond.js v1.4.0: min/max-width media query polyfill. (c) Scott Jehl. MIT Lic. j.mp/respondjs  */
(function( w ){

	"use strict";

	//exposed namespace
	var respond = {};
	w.respond = respond;

	//define update even in native-mq-supporting browsers, to avoid errors
	respond.update = function(){};

	//define ajax obj
	var requestQueue = [],
		xmlHttp = (function() {
			var xmlhttpmethod = false;
			try {
				xmlhttpmethod = new w.XMLHttpRequest();
			}
			catch( e ){
				xmlhttpmethod = new w.ActiveXObject( "Microsoft.XMLHTTP" );
			}
			return function(){
				return xmlhttpmethod;
			};
		})(),

		//tweaked Ajax functions from Quirksmode
		ajax = function( url, callback ) {
			var req = xmlHttp();
			if (!req){
				return;
			}
			req.open( "GET", url, true );
			req.onreadystatechange = function () {
				if ( req.readyState !== 4 || req.status !== 200 && req.status !== 304 ){
					return;
				}
				callback( req.responseText );
			};
			if ( req.readyState === 4 ){
				return;
			}
			req.send( null );
		};

	//expose for testing
	respond.ajax = ajax;
	respond.queue = requestQueue;

	// expose for testing
	respond.regex = {
		media: /@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi,
		keyframes: /@(?:\-(?:o|moz|webkit)\-)?keyframes[^\{]+\{(?:[^\{\}]*\{[^\}\{]*\})+[^\}]*\}/gi,
		urls: /(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g,
		findStyles: /@media *([^\{]+)\{([\S\s]+?)$/,
		only: /(only\s+)?([a-zA-Z]+)\s?/,
		minw: /\([\s]*min\-width\s*:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/,
		maxw: /\([\s]*max\-width\s*:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/
	};

	//expose media query support flag for external use
	respond.mediaQueriesSupported = w.matchMedia && w.matchMedia( "only all" ) !== null && w.matchMedia( "only all" ).matches;

	//if media queries are supported, exit here
	if( respond.mediaQueriesSupported ){
		return;
	}

	//define vars
	var doc = w.document,
		docElem = doc.documentElement,
		mediastyles = [],
		rules = [],
		appendedEls = [],
		parsedSheets = {},
		resizeThrottle = 30,
		head = doc.getElementsByTagName( "head" )[0] || docElem,
		base = doc.getElementsByTagName( "base" )[0],
		links = head.getElementsByTagName( "link" ),

		lastCall,
		resizeDefer,

		//cached container for 1em value, populated the first time it's needed
		eminpx,

		// returns the value of 1em in pixels
		getEmValue = function() {
			var ret,
				div = doc.createElement('div'),
				body = doc.body,
				originalHTMLFontSize = docElem.style.fontSize,
				originalBodyFontSize = body && body.style.fontSize,
				fakeUsed = false;

			div.style.cssText = "position:absolute;font-size:1em;width:1em";

			if( !body ){
				body = fakeUsed = doc.createElement( "body" );
				body.style.background = "none";
			}

			// 1em in a media query is the value of the default font size of the browser
			// reset docElem and body to ensure the correct value is returned
			docElem.style.fontSize = "100%";
			body.style.fontSize = "100%";

			body.appendChild( div );

			if( fakeUsed ){
				docElem.insertBefore( body, docElem.firstChild );
			}

			ret = div.offsetWidth;

			if( fakeUsed ){
				docElem.removeChild( body );
			}
			else {
				body.removeChild( div );
			}

			// restore the original values
			docElem.style.fontSize = originalHTMLFontSize;
			if( originalBodyFontSize ) {
				body.style.fontSize = originalBodyFontSize;
			}


			//also update eminpx before returning
			ret = eminpx = parseFloat(ret);

			return ret;
		},

		//enable/disable styles
		applyMedia = function( fromResize ){
			var name = "clientWidth",
				docElemProp = docElem[ name ],
				currWidth = doc.compatMode === "CSS1Compat" && docElemProp || doc.body[ name ] || docElemProp,
				styleBlocks	= {},
				lastLink = links[ links.length-1 ],
				now = (new Date()).getTime();

			//throttle resize calls
			if( fromResize && lastCall && now - lastCall < resizeThrottle ){
				w.clearTimeout( resizeDefer );
				resizeDefer = w.setTimeout( applyMedia, resizeThrottle );
				return;
			}
			else {
				lastCall = now;
			}

			for( var i in mediastyles ){
				if( mediastyles.hasOwnProperty( i ) ){
					var thisstyle = mediastyles[ i ],
						min = thisstyle.minw,
						max = thisstyle.maxw,
						minnull = min === null,
						maxnull = max === null,
						em = "em";

					if( !!min ){
						min = parseFloat( min ) * ( min.indexOf( em ) > -1 ? ( eminpx || getEmValue() ) : 1 );
					}
					if( !!max ){
						max = parseFloat( max ) * ( max.indexOf( em ) > -1 ? ( eminpx || getEmValue() ) : 1 );
					}

					// if there's no media query at all (the () part), or min or max is not null, and if either is present, they're true
					if( !thisstyle.hasquery || ( !minnull || !maxnull ) && ( minnull || currWidth >= min ) && ( maxnull || currWidth <= max ) ){
						if( !styleBlocks[ thisstyle.media ] ){
							styleBlocks[ thisstyle.media ] = [];
						}
						styleBlocks[ thisstyle.media ].push( rules[ thisstyle.rules ] );
					}
				}
			}

			//remove any existing respond style element(s)
			for( var j in appendedEls ){
				if( appendedEls.hasOwnProperty( j ) ){
					if( appendedEls[ j ] && appendedEls[ j ].parentNode === head ){
						head.removeChild( appendedEls[ j ] );
					}
				}
			}
			appendedEls.length = 0;

			//inject active styles, grouped by media type
			for( var k in styleBlocks ){
				if( styleBlocks.hasOwnProperty( k ) ){
					var ss = doc.createElement( "style" ),
						css = styleBlocks[ k ].join( "\n" );

					ss.type = "text/css";
					ss.media = k;

					//originally, ss was appended to a documentFragment and sheets were appended in bulk.
					//this caused crashes in IE in a number of circumstances, such as when the HTML element had a bg image set, so appending beforehand seems best. Thanks to @dvelyk for the initial research on this one!
					head.insertBefore( ss, lastLink.nextSibling );

					if ( ss.styleSheet ){
						ss.styleSheet.cssText = css;
					}
					else {
						ss.appendChild( doc.createTextNode( css ) );
					}

					//push to appendedEls to track for later removal
					appendedEls.push( ss );
				}
			}
		},
		//find media blocks in css text, convert to style blocks
		translate = function( styles, href, media ){
			var qs = styles.replace( respond.regex.keyframes, '' ).match( respond.regex.media ),
				ql = qs && qs.length || 0;

			//try to get CSS path
			href = href.substring( 0, href.lastIndexOf( "/" ) );

			var repUrls = function( css ){
					return css.replace( respond.regex.urls, "$1" + href + "$2$3" );
				},
				useMedia = !ql && media;

			//if path exists, tack on trailing slash
			if( href.length ){ href += "/"; }

			//if no internal queries exist, but media attr does, use that
			//note: this currently lacks support for situations where a media attr is specified on a link AND
				//its associated stylesheet has internal CSS media queries.
				//In those cases, the media attribute will currently be ignored.
			if( useMedia ){
				ql = 1;
			}

			for( var i = 0; i < ql; i++ ){
				var fullq, thisq, eachq, eql;

				//media attr
				if( useMedia ){
					fullq = media;
					rules.push( repUrls( styles ) );
				}
				//parse for styles
				else{
					fullq = qs[ i ].match( respond.regex.findStyles ) && RegExp.$1;
					rules.push( RegExp.$2 && repUrls( RegExp.$2 ) );
				}

				eachq = fullq.split( "," );
				eql = eachq.length;

				for( var j = 0; j < eql; j++ ){
					thisq = eachq[ j ];
					mediastyles.push( {
						media : thisq.split( "(" )[ 0 ].match( respond.regex.only ) && RegExp.$2 || "all",
						rules : rules.length - 1,
						hasquery : thisq.indexOf("(") > -1,
						minw : thisq.match( respond.regex.minw ) && parseFloat( RegExp.$1 ) + ( RegExp.$2 || "" ),
						maxw : thisq.match( respond.regex.maxw ) && parseFloat( RegExp.$1 ) + ( RegExp.$2 || "" )
					} );
				}
			}

			applyMedia();
		},

		//recurse through request queue, get css text
		makeRequests = function(){
			if( requestQueue.length ){
				var thisRequest = requestQueue.shift();

				ajax( thisRequest.href, function( styles ){
					translate( styles, thisRequest.href, thisRequest.media );
					parsedSheets[ thisRequest.href ] = true;

					// by wrapping recursive function call in setTimeout
					// we prevent "Stack overflow" error in IE7
					w.setTimeout(function(){ makeRequests(); },0);
				} );
			}
		},

		//loop stylesheets, send text content to translate
		ripCSS = function(){

			for( var i = 0; i < links.length; i++ ){
				var sheet = links[ i ],
				href = sheet.href,
				media = sheet.media,
				isCSS = sheet.rel && sheet.rel.toLowerCase() === "stylesheet";

				//only links plz and prevent re-parsing
				if( !!href && isCSS && !parsedSheets[ href ] ){
					// selectivizr exposes css through the rawCssText expando
					if (sheet.styleSheet && sheet.styleSheet.rawCssText) {
						translate( sheet.styleSheet.rawCssText, href, media );
						parsedSheets[ href ] = true;
					} else {
						if( (!/^([a-zA-Z:]*\/\/)/.test( href ) && !base) ||
							href.replace( RegExp.$1, "" ).split( "/" )[0] === w.location.host ){
							// IE7 doesn't handle urls that start with '//' for ajax request
							// manually add in the protocol
							if ( href.substring(0,2) === "//" ) { href = w.location.protocol + href; }
							requestQueue.push( {
								href: href,
								media: media
							} );
						}
					}
				}
			}
			makeRequests();
		};

	//translate CSS
	ripCSS();

	//expose update for re-running respond later on
	respond.update = ripCSS;

	//expose getEmValue
	respond.getEmValue = getEmValue;

	//adjust on resize
	function callMedia(){
		applyMedia( true );
	}

	if( w.addEventListener ){
		w.addEventListener( "resize", callMedia, false );
	}
	else if( w.attachEvent ){
		w.attachEvent( "onresize", callMedia );
	}
})(this);

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3Jlc3BvbmQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyohIFJlc3BvbmQuanMgdjEuNC4wOiBtaW4vbWF4LXdpZHRoIG1lZGlhIHF1ZXJ5IHBvbHlmaWxsLiAoYykgU2NvdHQgSmVobC4gTUlUIExpYy4gai5tcC9yZXNwb25kanMgICovXHJcbihmdW5jdGlvbiggdyApe1xyXG5cclxuXHRcInVzZSBzdHJpY3RcIjtcclxuXHJcblx0Ly9leHBvc2VkIG5hbWVzcGFjZVxyXG5cdHZhciByZXNwb25kID0ge307XHJcblx0dy5yZXNwb25kID0gcmVzcG9uZDtcclxuXHJcblx0Ly9kZWZpbmUgdXBkYXRlIGV2ZW4gaW4gbmF0aXZlLW1xLXN1cHBvcnRpbmcgYnJvd3NlcnMsIHRvIGF2b2lkIGVycm9yc1xyXG5cdHJlc3BvbmQudXBkYXRlID0gZnVuY3Rpb24oKXt9O1xyXG5cclxuXHQvL2RlZmluZSBhamF4IG9ialxyXG5cdHZhciByZXF1ZXN0UXVldWUgPSBbXSxcclxuXHRcdHhtbEh0dHAgPSAoZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciB4bWxodHRwbWV0aG9kID0gZmFsc2U7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0eG1saHR0cG1ldGhvZCA9IG5ldyB3LlhNTEh0dHBSZXF1ZXN0KCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Y2F0Y2goIGUgKXtcclxuXHRcdFx0XHR4bWxodHRwbWV0aG9kID0gbmV3IHcuQWN0aXZlWE9iamVjdCggXCJNaWNyb3NvZnQuWE1MSFRUUFwiICk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0cmV0dXJuIHhtbGh0dHBtZXRob2Q7XHJcblx0XHRcdH07XHJcblx0XHR9KSgpLFxyXG5cclxuXHRcdC8vdHdlYWtlZCBBamF4IGZ1bmN0aW9ucyBmcm9tIFF1aXJrc21vZGVcclxuXHRcdGFqYXggPSBmdW5jdGlvbiggdXJsLCBjYWxsYmFjayApIHtcclxuXHRcdFx0dmFyIHJlcSA9IHhtbEh0dHAoKTtcclxuXHRcdFx0aWYgKCFyZXEpe1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXEub3BlbiggXCJHRVRcIiwgdXJsLCB0cnVlICk7XHJcblx0XHRcdHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0aWYgKCByZXEucmVhZHlTdGF0ZSAhPT0gNCB8fCByZXEuc3RhdHVzICE9PSAyMDAgJiYgcmVxLnN0YXR1cyAhPT0gMzA0ICl7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhbGxiYWNrKCByZXEucmVzcG9uc2VUZXh0ICk7XHJcblx0XHRcdH07XHJcblx0XHRcdGlmICggcmVxLnJlYWR5U3RhdGUgPT09IDQgKXtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0cmVxLnNlbmQoIG51bGwgKTtcclxuXHRcdH07XHJcblxyXG5cdC8vZXhwb3NlIGZvciB0ZXN0aW5nXHJcblx0cmVzcG9uZC5hamF4ID0gYWpheDtcclxuXHRyZXNwb25kLnF1ZXVlID0gcmVxdWVzdFF1ZXVlO1xyXG5cclxuXHQvLyBleHBvc2UgZm9yIHRlc3RpbmdcclxuXHRyZXNwb25kLnJlZ2V4ID0ge1xyXG5cdFx0bWVkaWE6IC9AbWVkaWFbXlxce10rXFx7KFteXFx7XFx9XSpcXHtbXlxcfVxce10qXFx9KSsvZ2ksXHJcblx0XHRrZXlmcmFtZXM6IC9AKD86XFwtKD86b3xtb3p8d2Via2l0KVxcLSk/a2V5ZnJhbWVzW15cXHtdK1xceyg/OlteXFx7XFx9XSpcXHtbXlxcfVxce10qXFx9KStbXlxcfV0qXFx9L2dpLFxyXG5cdFx0dXJsczogLyh1cmxcXCgpWydcIl0/KFteXFwvXFwpJ1wiXVteOlxcKSdcIl0rKVsnXCJdPyhcXCkpL2csXHJcblx0XHRmaW5kU3R5bGVzOiAvQG1lZGlhICooW15cXHtdKylcXHsoW1xcU1xcc10rPykkLyxcclxuXHRcdG9ubHk6IC8ob25seVxccyspPyhbYS16QS1aXSspXFxzPy8sXHJcblx0XHRtaW53OiAvXFwoW1xcc10qbWluXFwtd2lkdGhcXHMqOltcXHNdKihbXFxzXSpbMC05XFwuXSspKHB4fGVtKVtcXHNdKlxcKS8sXHJcblx0XHRtYXh3OiAvXFwoW1xcc10qbWF4XFwtd2lkdGhcXHMqOltcXHNdKihbXFxzXSpbMC05XFwuXSspKHB4fGVtKVtcXHNdKlxcKS9cclxuXHR9O1xyXG5cclxuXHQvL2V4cG9zZSBtZWRpYSBxdWVyeSBzdXBwb3J0IGZsYWcgZm9yIGV4dGVybmFsIHVzZVxyXG5cdHJlc3BvbmQubWVkaWFRdWVyaWVzU3VwcG9ydGVkID0gdy5tYXRjaE1lZGlhICYmIHcubWF0Y2hNZWRpYSggXCJvbmx5IGFsbFwiICkgIT09IG51bGwgJiYgdy5tYXRjaE1lZGlhKCBcIm9ubHkgYWxsXCIgKS5tYXRjaGVzO1xyXG5cclxuXHQvL2lmIG1lZGlhIHF1ZXJpZXMgYXJlIHN1cHBvcnRlZCwgZXhpdCBoZXJlXHJcblx0aWYoIHJlc3BvbmQubWVkaWFRdWVyaWVzU3VwcG9ydGVkICl7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuXHQvL2RlZmluZSB2YXJzXHJcblx0dmFyIGRvYyA9IHcuZG9jdW1lbnQsXHJcblx0XHRkb2NFbGVtID0gZG9jLmRvY3VtZW50RWxlbWVudCxcclxuXHRcdG1lZGlhc3R5bGVzID0gW10sXHJcblx0XHRydWxlcyA9IFtdLFxyXG5cdFx0YXBwZW5kZWRFbHMgPSBbXSxcclxuXHRcdHBhcnNlZFNoZWV0cyA9IHt9LFxyXG5cdFx0cmVzaXplVGhyb3R0bGUgPSAzMCxcclxuXHRcdGhlYWQgPSBkb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoIFwiaGVhZFwiIClbMF0gfHwgZG9jRWxlbSxcclxuXHRcdGJhc2UgPSBkb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoIFwiYmFzZVwiIClbMF0sXHJcblx0XHRsaW5rcyA9IGhlYWQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoIFwibGlua1wiICksXHJcblxyXG5cdFx0bGFzdENhbGwsXHJcblx0XHRyZXNpemVEZWZlcixcclxuXHJcblx0XHQvL2NhY2hlZCBjb250YWluZXIgZm9yIDFlbSB2YWx1ZSwgcG9wdWxhdGVkIHRoZSBmaXJzdCB0aW1lIGl0J3MgbmVlZGVkXHJcblx0XHRlbWlucHgsXHJcblxyXG5cdFx0Ly8gcmV0dXJucyB0aGUgdmFsdWUgb2YgMWVtIGluIHBpeGVsc1xyXG5cdFx0Z2V0RW1WYWx1ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgcmV0LFxyXG5cdFx0XHRcdGRpdiA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKSxcclxuXHRcdFx0XHRib2R5ID0gZG9jLmJvZHksXHJcblx0XHRcdFx0b3JpZ2luYWxIVE1MRm9udFNpemUgPSBkb2NFbGVtLnN0eWxlLmZvbnRTaXplLFxyXG5cdFx0XHRcdG9yaWdpbmFsQm9keUZvbnRTaXplID0gYm9keSAmJiBib2R5LnN0eWxlLmZvbnRTaXplLFxyXG5cdFx0XHRcdGZha2VVc2VkID0gZmFsc2U7XHJcblxyXG5cdFx0XHRkaXYuc3R5bGUuY3NzVGV4dCA9IFwicG9zaXRpb246YWJzb2x1dGU7Zm9udC1zaXplOjFlbTt3aWR0aDoxZW1cIjtcclxuXHJcblx0XHRcdGlmKCAhYm9keSApe1xyXG5cdFx0XHRcdGJvZHkgPSBmYWtlVXNlZCA9IGRvYy5jcmVhdGVFbGVtZW50KCBcImJvZHlcIiApO1xyXG5cdFx0XHRcdGJvZHkuc3R5bGUuYmFja2dyb3VuZCA9IFwibm9uZVwiO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyAxZW0gaW4gYSBtZWRpYSBxdWVyeSBpcyB0aGUgdmFsdWUgb2YgdGhlIGRlZmF1bHQgZm9udCBzaXplIG9mIHRoZSBicm93c2VyXHJcblx0XHRcdC8vIHJlc2V0IGRvY0VsZW0gYW5kIGJvZHkgdG8gZW5zdXJlIHRoZSBjb3JyZWN0IHZhbHVlIGlzIHJldHVybmVkXHJcblx0XHRcdGRvY0VsZW0uc3R5bGUuZm9udFNpemUgPSBcIjEwMCVcIjtcclxuXHRcdFx0Ym9keS5zdHlsZS5mb250U2l6ZSA9IFwiMTAwJVwiO1xyXG5cclxuXHRcdFx0Ym9keS5hcHBlbmRDaGlsZCggZGl2ICk7XHJcblxyXG5cdFx0XHRpZiggZmFrZVVzZWQgKXtcclxuXHRcdFx0XHRkb2NFbGVtLmluc2VydEJlZm9yZSggYm9keSwgZG9jRWxlbS5maXJzdENoaWxkICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldCA9IGRpdi5vZmZzZXRXaWR0aDtcclxuXHJcblx0XHRcdGlmKCBmYWtlVXNlZCApe1xyXG5cdFx0XHRcdGRvY0VsZW0ucmVtb3ZlQ2hpbGQoIGJvZHkgKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRib2R5LnJlbW92ZUNoaWxkKCBkaXYgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gcmVzdG9yZSB0aGUgb3JpZ2luYWwgdmFsdWVzXHJcblx0XHRcdGRvY0VsZW0uc3R5bGUuZm9udFNpemUgPSBvcmlnaW5hbEhUTUxGb250U2l6ZTtcclxuXHRcdFx0aWYoIG9yaWdpbmFsQm9keUZvbnRTaXplICkge1xyXG5cdFx0XHRcdGJvZHkuc3R5bGUuZm9udFNpemUgPSBvcmlnaW5hbEJvZHlGb250U2l6ZTtcclxuXHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdC8vYWxzbyB1cGRhdGUgZW1pbnB4IGJlZm9yZSByZXR1cm5pbmdcclxuXHRcdFx0cmV0ID0gZW1pbnB4ID0gcGFyc2VGbG9hdChyZXQpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHJldDtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly9lbmFibGUvZGlzYWJsZSBzdHlsZXNcclxuXHRcdGFwcGx5TWVkaWEgPSBmdW5jdGlvbiggZnJvbVJlc2l6ZSApe1xyXG5cdFx0XHR2YXIgbmFtZSA9IFwiY2xpZW50V2lkdGhcIixcclxuXHRcdFx0XHRkb2NFbGVtUHJvcCA9IGRvY0VsZW1bIG5hbWUgXSxcclxuXHRcdFx0XHRjdXJyV2lkdGggPSBkb2MuY29tcGF0TW9kZSA9PT0gXCJDU1MxQ29tcGF0XCIgJiYgZG9jRWxlbVByb3AgfHwgZG9jLmJvZHlbIG5hbWUgXSB8fCBkb2NFbGVtUHJvcCxcclxuXHRcdFx0XHRzdHlsZUJsb2Nrc1x0PSB7fSxcclxuXHRcdFx0XHRsYXN0TGluayA9IGxpbmtzWyBsaW5rcy5sZW5ndGgtMSBdLFxyXG5cdFx0XHRcdG5vdyA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XHJcblxyXG5cdFx0XHQvL3Rocm90dGxlIHJlc2l6ZSBjYWxsc1xyXG5cdFx0XHRpZiggZnJvbVJlc2l6ZSAmJiBsYXN0Q2FsbCAmJiBub3cgLSBsYXN0Q2FsbCA8IHJlc2l6ZVRocm90dGxlICl7XHJcblx0XHRcdFx0dy5jbGVhclRpbWVvdXQoIHJlc2l6ZURlZmVyICk7XHJcblx0XHRcdFx0cmVzaXplRGVmZXIgPSB3LnNldFRpbWVvdXQoIGFwcGx5TWVkaWEsIHJlc2l6ZVRocm90dGxlICk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdGxhc3RDYWxsID0gbm93O1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmb3IoIHZhciBpIGluIG1lZGlhc3R5bGVzICl7XHJcblx0XHRcdFx0aWYoIG1lZGlhc3R5bGVzLmhhc093blByb3BlcnR5KCBpICkgKXtcclxuXHRcdFx0XHRcdHZhciB0aGlzc3R5bGUgPSBtZWRpYXN0eWxlc1sgaSBdLFxyXG5cdFx0XHRcdFx0XHRtaW4gPSB0aGlzc3R5bGUubWludyxcclxuXHRcdFx0XHRcdFx0bWF4ID0gdGhpc3N0eWxlLm1heHcsXHJcblx0XHRcdFx0XHRcdG1pbm51bGwgPSBtaW4gPT09IG51bGwsXHJcblx0XHRcdFx0XHRcdG1heG51bGwgPSBtYXggPT09IG51bGwsXHJcblx0XHRcdFx0XHRcdGVtID0gXCJlbVwiO1xyXG5cclxuXHRcdFx0XHRcdGlmKCAhIW1pbiApe1xyXG5cdFx0XHRcdFx0XHRtaW4gPSBwYXJzZUZsb2F0KCBtaW4gKSAqICggbWluLmluZGV4T2YoIGVtICkgPiAtMSA/ICggZW1pbnB4IHx8IGdldEVtVmFsdWUoKSApIDogMSApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYoICEhbWF4ICl7XHJcblx0XHRcdFx0XHRcdG1heCA9IHBhcnNlRmxvYXQoIG1heCApICogKCBtYXguaW5kZXhPZiggZW0gKSA+IC0xID8gKCBlbWlucHggfHwgZ2V0RW1WYWx1ZSgpICkgOiAxICk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Ly8gaWYgdGhlcmUncyBubyBtZWRpYSBxdWVyeSBhdCBhbGwgKHRoZSAoKSBwYXJ0KSwgb3IgbWluIG9yIG1heCBpcyBub3QgbnVsbCwgYW5kIGlmIGVpdGhlciBpcyBwcmVzZW50LCB0aGV5J3JlIHRydWVcclxuXHRcdFx0XHRcdGlmKCAhdGhpc3N0eWxlLmhhc3F1ZXJ5IHx8ICggIW1pbm51bGwgfHwgIW1heG51bGwgKSAmJiAoIG1pbm51bGwgfHwgY3VycldpZHRoID49IG1pbiApICYmICggbWF4bnVsbCB8fCBjdXJyV2lkdGggPD0gbWF4ICkgKXtcclxuXHRcdFx0XHRcdFx0aWYoICFzdHlsZUJsb2Nrc1sgdGhpc3N0eWxlLm1lZGlhIF0gKXtcclxuXHRcdFx0XHRcdFx0XHRzdHlsZUJsb2Nrc1sgdGhpc3N0eWxlLm1lZGlhIF0gPSBbXTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRzdHlsZUJsb2Nrc1sgdGhpc3N0eWxlLm1lZGlhIF0ucHVzaCggcnVsZXNbIHRoaXNzdHlsZS5ydWxlcyBdICk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvL3JlbW92ZSBhbnkgZXhpc3RpbmcgcmVzcG9uZCBzdHlsZSBlbGVtZW50KHMpXHJcblx0XHRcdGZvciggdmFyIGogaW4gYXBwZW5kZWRFbHMgKXtcclxuXHRcdFx0XHRpZiggYXBwZW5kZWRFbHMuaGFzT3duUHJvcGVydHkoIGogKSApe1xyXG5cdFx0XHRcdFx0aWYoIGFwcGVuZGVkRWxzWyBqIF0gJiYgYXBwZW5kZWRFbHNbIGogXS5wYXJlbnROb2RlID09PSBoZWFkICl7XHJcblx0XHRcdFx0XHRcdGhlYWQucmVtb3ZlQ2hpbGQoIGFwcGVuZGVkRWxzWyBqIF0gKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0YXBwZW5kZWRFbHMubGVuZ3RoID0gMDtcclxuXHJcblx0XHRcdC8vaW5qZWN0IGFjdGl2ZSBzdHlsZXMsIGdyb3VwZWQgYnkgbWVkaWEgdHlwZVxyXG5cdFx0XHRmb3IoIHZhciBrIGluIHN0eWxlQmxvY2tzICl7XHJcblx0XHRcdFx0aWYoIHN0eWxlQmxvY2tzLmhhc093blByb3BlcnR5KCBrICkgKXtcclxuXHRcdFx0XHRcdHZhciBzcyA9IGRvYy5jcmVhdGVFbGVtZW50KCBcInN0eWxlXCIgKSxcclxuXHRcdFx0XHRcdFx0Y3NzID0gc3R5bGVCbG9ja3NbIGsgXS5qb2luKCBcIlxcblwiICk7XHJcblxyXG5cdFx0XHRcdFx0c3MudHlwZSA9IFwidGV4dC9jc3NcIjtcclxuXHRcdFx0XHRcdHNzLm1lZGlhID0gaztcclxuXHJcblx0XHRcdFx0XHQvL29yaWdpbmFsbHksIHNzIHdhcyBhcHBlbmRlZCB0byBhIGRvY3VtZW50RnJhZ21lbnQgYW5kIHNoZWV0cyB3ZXJlIGFwcGVuZGVkIGluIGJ1bGsuXHJcblx0XHRcdFx0XHQvL3RoaXMgY2F1c2VkIGNyYXNoZXMgaW4gSUUgaW4gYSBudW1iZXIgb2YgY2lyY3Vtc3RhbmNlcywgc3VjaCBhcyB3aGVuIHRoZSBIVE1MIGVsZW1lbnQgaGFkIGEgYmcgaW1hZ2Ugc2V0LCBzbyBhcHBlbmRpbmcgYmVmb3JlaGFuZCBzZWVtcyBiZXN0LiBUaGFua3MgdG8gQGR2ZWx5ayBmb3IgdGhlIGluaXRpYWwgcmVzZWFyY2ggb24gdGhpcyBvbmUhXHJcblx0XHRcdFx0XHRoZWFkLmluc2VydEJlZm9yZSggc3MsIGxhc3RMaW5rLm5leHRTaWJsaW5nICk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCBzcy5zdHlsZVNoZWV0ICl7XHJcblx0XHRcdFx0XHRcdHNzLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRzcy5hcHBlbmRDaGlsZCggZG9jLmNyZWF0ZVRleHROb2RlKCBjc3MgKSApO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdC8vcHVzaCB0byBhcHBlbmRlZEVscyB0byB0cmFjayBmb3IgbGF0ZXIgcmVtb3ZhbFxyXG5cdFx0XHRcdFx0YXBwZW5kZWRFbHMucHVzaCggc3MgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHQvL2ZpbmQgbWVkaWEgYmxvY2tzIGluIGNzcyB0ZXh0LCBjb252ZXJ0IHRvIHN0eWxlIGJsb2Nrc1xyXG5cdFx0dHJhbnNsYXRlID0gZnVuY3Rpb24oIHN0eWxlcywgaHJlZiwgbWVkaWEgKXtcclxuXHRcdFx0dmFyIHFzID0gc3R5bGVzLnJlcGxhY2UoIHJlc3BvbmQucmVnZXgua2V5ZnJhbWVzLCAnJyApLm1hdGNoKCByZXNwb25kLnJlZ2V4Lm1lZGlhICksXHJcblx0XHRcdFx0cWwgPSBxcyAmJiBxcy5sZW5ndGggfHwgMDtcclxuXHJcblx0XHRcdC8vdHJ5IHRvIGdldCBDU1MgcGF0aFxyXG5cdFx0XHRocmVmID0gaHJlZi5zdWJzdHJpbmcoIDAsIGhyZWYubGFzdEluZGV4T2YoIFwiL1wiICkgKTtcclxuXHJcblx0XHRcdHZhciByZXBVcmxzID0gZnVuY3Rpb24oIGNzcyApe1xyXG5cdFx0XHRcdFx0cmV0dXJuIGNzcy5yZXBsYWNlKCByZXNwb25kLnJlZ2V4LnVybHMsIFwiJDFcIiArIGhyZWYgKyBcIiQyJDNcIiApO1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0dXNlTWVkaWEgPSAhcWwgJiYgbWVkaWE7XHJcblxyXG5cdFx0XHQvL2lmIHBhdGggZXhpc3RzLCB0YWNrIG9uIHRyYWlsaW5nIHNsYXNoXHJcblx0XHRcdGlmKCBocmVmLmxlbmd0aCApeyBocmVmICs9IFwiL1wiOyB9XHJcblxyXG5cdFx0XHQvL2lmIG5vIGludGVybmFsIHF1ZXJpZXMgZXhpc3QsIGJ1dCBtZWRpYSBhdHRyIGRvZXMsIHVzZSB0aGF0XHJcblx0XHRcdC8vbm90ZTogdGhpcyBjdXJyZW50bHkgbGFja3Mgc3VwcG9ydCBmb3Igc2l0dWF0aW9ucyB3aGVyZSBhIG1lZGlhIGF0dHIgaXMgc3BlY2lmaWVkIG9uIGEgbGluayBBTkRcclxuXHRcdFx0XHQvL2l0cyBhc3NvY2lhdGVkIHN0eWxlc2hlZXQgaGFzIGludGVybmFsIENTUyBtZWRpYSBxdWVyaWVzLlxyXG5cdFx0XHRcdC8vSW4gdGhvc2UgY2FzZXMsIHRoZSBtZWRpYSBhdHRyaWJ1dGUgd2lsbCBjdXJyZW50bHkgYmUgaWdub3JlZC5cclxuXHRcdFx0aWYoIHVzZU1lZGlhICl7XHJcblx0XHRcdFx0cWwgPSAxO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmb3IoIHZhciBpID0gMDsgaSA8IHFsOyBpKysgKXtcclxuXHRcdFx0XHR2YXIgZnVsbHEsIHRoaXNxLCBlYWNocSwgZXFsO1xyXG5cclxuXHRcdFx0XHQvL21lZGlhIGF0dHJcclxuXHRcdFx0XHRpZiggdXNlTWVkaWEgKXtcclxuXHRcdFx0XHRcdGZ1bGxxID0gbWVkaWE7XHJcblx0XHRcdFx0XHRydWxlcy5wdXNoKCByZXBVcmxzKCBzdHlsZXMgKSApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvL3BhcnNlIGZvciBzdHlsZXNcclxuXHRcdFx0XHRlbHNle1xyXG5cdFx0XHRcdFx0ZnVsbHEgPSBxc1sgaSBdLm1hdGNoKCByZXNwb25kLnJlZ2V4LmZpbmRTdHlsZXMgKSAmJiBSZWdFeHAuJDE7XHJcblx0XHRcdFx0XHRydWxlcy5wdXNoKCBSZWdFeHAuJDIgJiYgcmVwVXJscyggUmVnRXhwLiQyICkgKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGVhY2hxID0gZnVsbHEuc3BsaXQoIFwiLFwiICk7XHJcblx0XHRcdFx0ZXFsID0gZWFjaHEubGVuZ3RoO1xyXG5cclxuXHRcdFx0XHRmb3IoIHZhciBqID0gMDsgaiA8IGVxbDsgaisrICl7XHJcblx0XHRcdFx0XHR0aGlzcSA9IGVhY2hxWyBqIF07XHJcblx0XHRcdFx0XHRtZWRpYXN0eWxlcy5wdXNoKCB7XHJcblx0XHRcdFx0XHRcdG1lZGlhIDogdGhpc3Euc3BsaXQoIFwiKFwiIClbIDAgXS5tYXRjaCggcmVzcG9uZC5yZWdleC5vbmx5ICkgJiYgUmVnRXhwLiQyIHx8IFwiYWxsXCIsXHJcblx0XHRcdFx0XHRcdHJ1bGVzIDogcnVsZXMubGVuZ3RoIC0gMSxcclxuXHRcdFx0XHRcdFx0aGFzcXVlcnkgOiB0aGlzcS5pbmRleE9mKFwiKFwiKSA+IC0xLFxyXG5cdFx0XHRcdFx0XHRtaW53IDogdGhpc3EubWF0Y2goIHJlc3BvbmQucmVnZXgubWludyApICYmIHBhcnNlRmxvYXQoIFJlZ0V4cC4kMSApICsgKCBSZWdFeHAuJDIgfHwgXCJcIiApLFxyXG5cdFx0XHRcdFx0XHRtYXh3IDogdGhpc3EubWF0Y2goIHJlc3BvbmQucmVnZXgubWF4dyApICYmIHBhcnNlRmxvYXQoIFJlZ0V4cC4kMSApICsgKCBSZWdFeHAuJDIgfHwgXCJcIiApXHJcblx0XHRcdFx0XHR9ICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRhcHBseU1lZGlhKCk7XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vcmVjdXJzZSB0aHJvdWdoIHJlcXVlc3QgcXVldWUsIGdldCBjc3MgdGV4dFxyXG5cdFx0bWFrZVJlcXVlc3RzID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYoIHJlcXVlc3RRdWV1ZS5sZW5ndGggKXtcclxuXHRcdFx0XHR2YXIgdGhpc1JlcXVlc3QgPSByZXF1ZXN0UXVldWUuc2hpZnQoKTtcclxuXHJcblx0XHRcdFx0YWpheCggdGhpc1JlcXVlc3QuaHJlZiwgZnVuY3Rpb24oIHN0eWxlcyApe1xyXG5cdFx0XHRcdFx0dHJhbnNsYXRlKCBzdHlsZXMsIHRoaXNSZXF1ZXN0LmhyZWYsIHRoaXNSZXF1ZXN0Lm1lZGlhICk7XHJcblx0XHRcdFx0XHRwYXJzZWRTaGVldHNbIHRoaXNSZXF1ZXN0LmhyZWYgXSA9IHRydWU7XHJcblxyXG5cdFx0XHRcdFx0Ly8gYnkgd3JhcHBpbmcgcmVjdXJzaXZlIGZ1bmN0aW9uIGNhbGwgaW4gc2V0VGltZW91dFxyXG5cdFx0XHRcdFx0Ly8gd2UgcHJldmVudCBcIlN0YWNrIG92ZXJmbG93XCIgZXJyb3IgaW4gSUU3XHJcblx0XHRcdFx0XHR3LnNldFRpbWVvdXQoZnVuY3Rpb24oKXsgbWFrZVJlcXVlc3RzKCk7IH0sMCk7XHJcblx0XHRcdFx0fSApO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vbG9vcCBzdHlsZXNoZWV0cywgc2VuZCB0ZXh0IGNvbnRlbnQgdG8gdHJhbnNsYXRlXHJcblx0XHRyaXBDU1MgPSBmdW5jdGlvbigpe1xyXG5cclxuXHRcdFx0Zm9yKCB2YXIgaSA9IDA7IGkgPCBsaW5rcy5sZW5ndGg7IGkrKyApe1xyXG5cdFx0XHRcdHZhciBzaGVldCA9IGxpbmtzWyBpIF0sXHJcblx0XHRcdFx0aHJlZiA9IHNoZWV0LmhyZWYsXHJcblx0XHRcdFx0bWVkaWEgPSBzaGVldC5tZWRpYSxcclxuXHRcdFx0XHRpc0NTUyA9IHNoZWV0LnJlbCAmJiBzaGVldC5yZWwudG9Mb3dlckNhc2UoKSA9PT0gXCJzdHlsZXNoZWV0XCI7XHJcblxyXG5cdFx0XHRcdC8vb25seSBsaW5rcyBwbHogYW5kIHByZXZlbnQgcmUtcGFyc2luZ1xyXG5cdFx0XHRcdGlmKCAhIWhyZWYgJiYgaXNDU1MgJiYgIXBhcnNlZFNoZWV0c1sgaHJlZiBdICl7XHJcblx0XHRcdFx0XHQvLyBzZWxlY3Rpdml6ciBleHBvc2VzIGNzcyB0aHJvdWdoIHRoZSByYXdDc3NUZXh0IGV4cGFuZG9cclxuXHRcdFx0XHRcdGlmIChzaGVldC5zdHlsZVNoZWV0ICYmIHNoZWV0LnN0eWxlU2hlZXQucmF3Q3NzVGV4dCkge1xyXG5cdFx0XHRcdFx0XHR0cmFuc2xhdGUoIHNoZWV0LnN0eWxlU2hlZXQucmF3Q3NzVGV4dCwgaHJlZiwgbWVkaWEgKTtcclxuXHRcdFx0XHRcdFx0cGFyc2VkU2hlZXRzWyBocmVmIF0gPSB0cnVlO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0aWYoICghL14oW2EtekEtWjpdKlxcL1xcLykvLnRlc3QoIGhyZWYgKSAmJiAhYmFzZSkgfHxcclxuXHRcdFx0XHRcdFx0XHRocmVmLnJlcGxhY2UoIFJlZ0V4cC4kMSwgXCJcIiApLnNwbGl0KCBcIi9cIiApWzBdID09PSB3LmxvY2F0aW9uLmhvc3QgKXtcclxuXHRcdFx0XHRcdFx0XHQvLyBJRTcgZG9lc24ndCBoYW5kbGUgdXJscyB0aGF0IHN0YXJ0IHdpdGggJy8vJyBmb3IgYWpheCByZXF1ZXN0XHJcblx0XHRcdFx0XHRcdFx0Ly8gbWFudWFsbHkgYWRkIGluIHRoZSBwcm90b2NvbFxyXG5cdFx0XHRcdFx0XHRcdGlmICggaHJlZi5zdWJzdHJpbmcoMCwyKSA9PT0gXCIvL1wiICkgeyBocmVmID0gdy5sb2NhdGlvbi5wcm90b2NvbCArIGhyZWY7IH1cclxuXHRcdFx0XHRcdFx0XHRyZXF1ZXN0UXVldWUucHVzaCgge1xyXG5cdFx0XHRcdFx0XHRcdFx0aHJlZjogaHJlZixcclxuXHRcdFx0XHRcdFx0XHRcdG1lZGlhOiBtZWRpYVxyXG5cdFx0XHRcdFx0XHRcdH0gKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRtYWtlUmVxdWVzdHMoKTtcclxuXHRcdH07XHJcblxyXG5cdC8vdHJhbnNsYXRlIENTU1xyXG5cdHJpcENTUygpO1xyXG5cclxuXHQvL2V4cG9zZSB1cGRhdGUgZm9yIHJlLXJ1bm5pbmcgcmVzcG9uZCBsYXRlciBvblxyXG5cdHJlc3BvbmQudXBkYXRlID0gcmlwQ1NTO1xyXG5cclxuXHQvL2V4cG9zZSBnZXRFbVZhbHVlXHJcblx0cmVzcG9uZC5nZXRFbVZhbHVlID0gZ2V0RW1WYWx1ZTtcclxuXHJcblx0Ly9hZGp1c3Qgb24gcmVzaXplXHJcblx0ZnVuY3Rpb24gY2FsbE1lZGlhKCl7XHJcblx0XHRhcHBseU1lZGlhKCB0cnVlICk7XHJcblx0fVxyXG5cclxuXHRpZiggdy5hZGRFdmVudExpc3RlbmVyICl7XHJcblx0XHR3LmFkZEV2ZW50TGlzdGVuZXIoIFwicmVzaXplXCIsIGNhbGxNZWRpYSwgZmFsc2UgKTtcclxuXHR9XHJcblx0ZWxzZSBpZiggdy5hdHRhY2hFdmVudCApe1xyXG5cdFx0dy5hdHRhY2hFdmVudCggXCJvbnJlc2l6ZVwiLCBjYWxsTWVkaWEgKTtcclxuXHR9XHJcbn0pKHRoaXMpO1xyXG4iXX0=
