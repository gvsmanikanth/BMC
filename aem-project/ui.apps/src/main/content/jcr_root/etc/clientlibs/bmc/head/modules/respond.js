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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3Jlc3BvbmQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyohIFJlc3BvbmQuanMgdjEuNC4wOiBtaW4vbWF4LXdpZHRoIG1lZGlhIHF1ZXJ5IHBvbHlmaWxsLiAoYykgU2NvdHQgSmVobC4gTUlUIExpYy4gai5tcC9yZXNwb25kanMgICovXG4oZnVuY3Rpb24oIHcgKXtcblxuXHRcInVzZSBzdHJpY3RcIjtcblxuXHQvL2V4cG9zZWQgbmFtZXNwYWNlXG5cdHZhciByZXNwb25kID0ge307XG5cdHcucmVzcG9uZCA9IHJlc3BvbmQ7XG5cblx0Ly9kZWZpbmUgdXBkYXRlIGV2ZW4gaW4gbmF0aXZlLW1xLXN1cHBvcnRpbmcgYnJvd3NlcnMsIHRvIGF2b2lkIGVycm9yc1xuXHRyZXNwb25kLnVwZGF0ZSA9IGZ1bmN0aW9uKCl7fTtcblxuXHQvL2RlZmluZSBhamF4IG9ialxuXHR2YXIgcmVxdWVzdFF1ZXVlID0gW10sXG5cdFx0eG1sSHR0cCA9IChmdW5jdGlvbigpIHtcblx0XHRcdHZhciB4bWxodHRwbWV0aG9kID0gZmFsc2U7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHR4bWxodHRwbWV0aG9kID0gbmV3IHcuWE1MSHR0cFJlcXVlc3QoKTtcblx0XHRcdH1cblx0XHRcdGNhdGNoKCBlICl7XG5cdFx0XHRcdHhtbGh0dHBtZXRob2QgPSBuZXcgdy5BY3RpdmVYT2JqZWN0KCBcIk1pY3Jvc29mdC5YTUxIVFRQXCIgKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmdW5jdGlvbigpe1xuXHRcdFx0XHRyZXR1cm4geG1saHR0cG1ldGhvZDtcblx0XHRcdH07XG5cdFx0fSkoKSxcblxuXHRcdC8vdHdlYWtlZCBBamF4IGZ1bmN0aW9ucyBmcm9tIFF1aXJrc21vZGVcblx0XHRhamF4ID0gZnVuY3Rpb24oIHVybCwgY2FsbGJhY2sgKSB7XG5cdFx0XHR2YXIgcmVxID0geG1sSHR0cCgpO1xuXHRcdFx0aWYgKCFyZXEpe1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRyZXEub3BlbiggXCJHRVRcIiwgdXJsLCB0cnVlICk7XG5cdFx0XHRyZXEub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRpZiAoIHJlcS5yZWFkeVN0YXRlICE9PSA0IHx8IHJlcS5zdGF0dXMgIT09IDIwMCAmJiByZXEuc3RhdHVzICE9PSAzMDQgKXtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2FsbGJhY2soIHJlcS5yZXNwb25zZVRleHQgKTtcblx0XHRcdH07XG5cdFx0XHRpZiAoIHJlcS5yZWFkeVN0YXRlID09PSA0ICl7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHJlcS5zZW5kKCBudWxsICk7XG5cdFx0fTtcblxuXHQvL2V4cG9zZSBmb3IgdGVzdGluZ1xuXHRyZXNwb25kLmFqYXggPSBhamF4O1xuXHRyZXNwb25kLnF1ZXVlID0gcmVxdWVzdFF1ZXVlO1xuXG5cdC8vIGV4cG9zZSBmb3IgdGVzdGluZ1xuXHRyZXNwb25kLnJlZ2V4ID0ge1xuXHRcdG1lZGlhOiAvQG1lZGlhW15cXHtdK1xceyhbXlxce1xcfV0qXFx7W15cXH1cXHtdKlxcfSkrL2dpLFxuXHRcdGtleWZyYW1lczogL0AoPzpcXC0oPzpvfG1venx3ZWJraXQpXFwtKT9rZXlmcmFtZXNbXlxce10rXFx7KD86W15cXHtcXH1dKlxce1teXFx9XFx7XSpcXH0pK1teXFx9XSpcXH0vZ2ksXG5cdFx0dXJsczogLyh1cmxcXCgpWydcIl0/KFteXFwvXFwpJ1wiXVteOlxcKSdcIl0rKVsnXCJdPyhcXCkpL2csXG5cdFx0ZmluZFN0eWxlczogL0BtZWRpYSAqKFteXFx7XSspXFx7KFtcXFNcXHNdKz8pJC8sXG5cdFx0b25seTogLyhvbmx5XFxzKyk/KFthLXpBLVpdKylcXHM/Lyxcblx0XHRtaW53OiAvXFwoW1xcc10qbWluXFwtd2lkdGhcXHMqOltcXHNdKihbXFxzXSpbMC05XFwuXSspKHB4fGVtKVtcXHNdKlxcKS8sXG5cdFx0bWF4dzogL1xcKFtcXHNdKm1heFxcLXdpZHRoXFxzKjpbXFxzXSooW1xcc10qWzAtOVxcLl0rKShweHxlbSlbXFxzXSpcXCkvXG5cdH07XG5cblx0Ly9leHBvc2UgbWVkaWEgcXVlcnkgc3VwcG9ydCBmbGFnIGZvciBleHRlcm5hbCB1c2Vcblx0cmVzcG9uZC5tZWRpYVF1ZXJpZXNTdXBwb3J0ZWQgPSB3Lm1hdGNoTWVkaWEgJiYgdy5tYXRjaE1lZGlhKCBcIm9ubHkgYWxsXCIgKSAhPT0gbnVsbCAmJiB3Lm1hdGNoTWVkaWEoIFwib25seSBhbGxcIiApLm1hdGNoZXM7XG5cblx0Ly9pZiBtZWRpYSBxdWVyaWVzIGFyZSBzdXBwb3J0ZWQsIGV4aXQgaGVyZVxuXHRpZiggcmVzcG9uZC5tZWRpYVF1ZXJpZXNTdXBwb3J0ZWQgKXtcblx0XHRyZXR1cm47XG5cdH1cblxuXHQvL2RlZmluZSB2YXJzXG5cdHZhciBkb2MgPSB3LmRvY3VtZW50LFxuXHRcdGRvY0VsZW0gPSBkb2MuZG9jdW1lbnRFbGVtZW50LFxuXHRcdG1lZGlhc3R5bGVzID0gW10sXG5cdFx0cnVsZXMgPSBbXSxcblx0XHRhcHBlbmRlZEVscyA9IFtdLFxuXHRcdHBhcnNlZFNoZWV0cyA9IHt9LFxuXHRcdHJlc2l6ZVRocm90dGxlID0gMzAsXG5cdFx0aGVhZCA9IGRvYy5nZXRFbGVtZW50c0J5VGFnTmFtZSggXCJoZWFkXCIgKVswXSB8fCBkb2NFbGVtLFxuXHRcdGJhc2UgPSBkb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoIFwiYmFzZVwiIClbMF0sXG5cdFx0bGlua3MgPSBoZWFkLmdldEVsZW1lbnRzQnlUYWdOYW1lKCBcImxpbmtcIiApLFxuXG5cdFx0bGFzdENhbGwsXG5cdFx0cmVzaXplRGVmZXIsXG5cblx0XHQvL2NhY2hlZCBjb250YWluZXIgZm9yIDFlbSB2YWx1ZSwgcG9wdWxhdGVkIHRoZSBmaXJzdCB0aW1lIGl0J3MgbmVlZGVkXG5cdFx0ZW1pbnB4LFxuXG5cdFx0Ly8gcmV0dXJucyB0aGUgdmFsdWUgb2YgMWVtIGluIHBpeGVsc1xuXHRcdGdldEVtVmFsdWUgPSBmdW5jdGlvbigpIHtcblx0XHRcdHZhciByZXQsXG5cdFx0XHRcdGRpdiA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKSxcblx0XHRcdFx0Ym9keSA9IGRvYy5ib2R5LFxuXHRcdFx0XHRvcmlnaW5hbEhUTUxGb250U2l6ZSA9IGRvY0VsZW0uc3R5bGUuZm9udFNpemUsXG5cdFx0XHRcdG9yaWdpbmFsQm9keUZvbnRTaXplID0gYm9keSAmJiBib2R5LnN0eWxlLmZvbnRTaXplLFxuXHRcdFx0XHRmYWtlVXNlZCA9IGZhbHNlO1xuXG5cdFx0XHRkaXYuc3R5bGUuY3NzVGV4dCA9IFwicG9zaXRpb246YWJzb2x1dGU7Zm9udC1zaXplOjFlbTt3aWR0aDoxZW1cIjtcblxuXHRcdFx0aWYoICFib2R5ICl7XG5cdFx0XHRcdGJvZHkgPSBmYWtlVXNlZCA9IGRvYy5jcmVhdGVFbGVtZW50KCBcImJvZHlcIiApO1xuXHRcdFx0XHRib2R5LnN0eWxlLmJhY2tncm91bmQgPSBcIm5vbmVcIjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gMWVtIGluIGEgbWVkaWEgcXVlcnkgaXMgdGhlIHZhbHVlIG9mIHRoZSBkZWZhdWx0IGZvbnQgc2l6ZSBvZiB0aGUgYnJvd3NlclxuXHRcdFx0Ly8gcmVzZXQgZG9jRWxlbSBhbmQgYm9keSB0byBlbnN1cmUgdGhlIGNvcnJlY3QgdmFsdWUgaXMgcmV0dXJuZWRcblx0XHRcdGRvY0VsZW0uc3R5bGUuZm9udFNpemUgPSBcIjEwMCVcIjtcblx0XHRcdGJvZHkuc3R5bGUuZm9udFNpemUgPSBcIjEwMCVcIjtcblxuXHRcdFx0Ym9keS5hcHBlbmRDaGlsZCggZGl2ICk7XG5cblx0XHRcdGlmKCBmYWtlVXNlZCApe1xuXHRcdFx0XHRkb2NFbGVtLmluc2VydEJlZm9yZSggYm9keSwgZG9jRWxlbS5maXJzdENoaWxkICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldCA9IGRpdi5vZmZzZXRXaWR0aDtcblxuXHRcdFx0aWYoIGZha2VVc2VkICl7XG5cdFx0XHRcdGRvY0VsZW0ucmVtb3ZlQ2hpbGQoIGJvZHkgKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRib2R5LnJlbW92ZUNoaWxkKCBkaXYgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gcmVzdG9yZSB0aGUgb3JpZ2luYWwgdmFsdWVzXG5cdFx0XHRkb2NFbGVtLnN0eWxlLmZvbnRTaXplID0gb3JpZ2luYWxIVE1MRm9udFNpemU7XG5cdFx0XHRpZiggb3JpZ2luYWxCb2R5Rm9udFNpemUgKSB7XG5cdFx0XHRcdGJvZHkuc3R5bGUuZm9udFNpemUgPSBvcmlnaW5hbEJvZHlGb250U2l6ZTtcblx0XHRcdH1cblxuXG5cdFx0XHQvL2Fsc28gdXBkYXRlIGVtaW5weCBiZWZvcmUgcmV0dXJuaW5nXG5cdFx0XHRyZXQgPSBlbWlucHggPSBwYXJzZUZsb2F0KHJldCk7XG5cblx0XHRcdHJldHVybiByZXQ7XG5cdFx0fSxcblxuXHRcdC8vZW5hYmxlL2Rpc2FibGUgc3R5bGVzXG5cdFx0YXBwbHlNZWRpYSA9IGZ1bmN0aW9uKCBmcm9tUmVzaXplICl7XG5cdFx0XHR2YXIgbmFtZSA9IFwiY2xpZW50V2lkdGhcIixcblx0XHRcdFx0ZG9jRWxlbVByb3AgPSBkb2NFbGVtWyBuYW1lIF0sXG5cdFx0XHRcdGN1cnJXaWR0aCA9IGRvYy5jb21wYXRNb2RlID09PSBcIkNTUzFDb21wYXRcIiAmJiBkb2NFbGVtUHJvcCB8fCBkb2MuYm9keVsgbmFtZSBdIHx8IGRvY0VsZW1Qcm9wLFxuXHRcdFx0XHRzdHlsZUJsb2Nrc1x0PSB7fSxcblx0XHRcdFx0bGFzdExpbmsgPSBsaW5rc1sgbGlua3MubGVuZ3RoLTEgXSxcblx0XHRcdFx0bm93ID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcblxuXHRcdFx0Ly90aHJvdHRsZSByZXNpemUgY2FsbHNcblx0XHRcdGlmKCBmcm9tUmVzaXplICYmIGxhc3RDYWxsICYmIG5vdyAtIGxhc3RDYWxsIDwgcmVzaXplVGhyb3R0bGUgKXtcblx0XHRcdFx0dy5jbGVhclRpbWVvdXQoIHJlc2l6ZURlZmVyICk7XG5cdFx0XHRcdHJlc2l6ZURlZmVyID0gdy5zZXRUaW1lb3V0KCBhcHBseU1lZGlhLCByZXNpemVUaHJvdHRsZSApO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0bGFzdENhbGwgPSBub3c7XG5cdFx0XHR9XG5cblx0XHRcdGZvciggdmFyIGkgaW4gbWVkaWFzdHlsZXMgKXtcblx0XHRcdFx0aWYoIG1lZGlhc3R5bGVzLmhhc093blByb3BlcnR5KCBpICkgKXtcblx0XHRcdFx0XHR2YXIgdGhpc3N0eWxlID0gbWVkaWFzdHlsZXNbIGkgXSxcblx0XHRcdFx0XHRcdG1pbiA9IHRoaXNzdHlsZS5taW53LFxuXHRcdFx0XHRcdFx0bWF4ID0gdGhpc3N0eWxlLm1heHcsXG5cdFx0XHRcdFx0XHRtaW5udWxsID0gbWluID09PSBudWxsLFxuXHRcdFx0XHRcdFx0bWF4bnVsbCA9IG1heCA9PT0gbnVsbCxcblx0XHRcdFx0XHRcdGVtID0gXCJlbVwiO1xuXG5cdFx0XHRcdFx0aWYoICEhbWluICl7XG5cdFx0XHRcdFx0XHRtaW4gPSBwYXJzZUZsb2F0KCBtaW4gKSAqICggbWluLmluZGV4T2YoIGVtICkgPiAtMSA/ICggZW1pbnB4IHx8IGdldEVtVmFsdWUoKSApIDogMSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiggISFtYXggKXtcblx0XHRcdFx0XHRcdG1heCA9IHBhcnNlRmxvYXQoIG1heCApICogKCBtYXguaW5kZXhPZiggZW0gKSA+IC0xID8gKCBlbWlucHggfHwgZ2V0RW1WYWx1ZSgpICkgOiAxICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gaWYgdGhlcmUncyBubyBtZWRpYSBxdWVyeSBhdCBhbGwgKHRoZSAoKSBwYXJ0KSwgb3IgbWluIG9yIG1heCBpcyBub3QgbnVsbCwgYW5kIGlmIGVpdGhlciBpcyBwcmVzZW50LCB0aGV5J3JlIHRydWVcblx0XHRcdFx0XHRpZiggIXRoaXNzdHlsZS5oYXNxdWVyeSB8fCAoICFtaW5udWxsIHx8ICFtYXhudWxsICkgJiYgKCBtaW5udWxsIHx8IGN1cnJXaWR0aCA+PSBtaW4gKSAmJiAoIG1heG51bGwgfHwgY3VycldpZHRoIDw9IG1heCApICl7XG5cdFx0XHRcdFx0XHRpZiggIXN0eWxlQmxvY2tzWyB0aGlzc3R5bGUubWVkaWEgXSApe1xuXHRcdFx0XHRcdFx0XHRzdHlsZUJsb2Nrc1sgdGhpc3N0eWxlLm1lZGlhIF0gPSBbXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHN0eWxlQmxvY2tzWyB0aGlzc3R5bGUubWVkaWEgXS5wdXNoKCBydWxlc1sgdGhpc3N0eWxlLnJ1bGVzIF0gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly9yZW1vdmUgYW55IGV4aXN0aW5nIHJlc3BvbmQgc3R5bGUgZWxlbWVudChzKVxuXHRcdFx0Zm9yKCB2YXIgaiBpbiBhcHBlbmRlZEVscyApe1xuXHRcdFx0XHRpZiggYXBwZW5kZWRFbHMuaGFzT3duUHJvcGVydHkoIGogKSApe1xuXHRcdFx0XHRcdGlmKCBhcHBlbmRlZEVsc1sgaiBdICYmIGFwcGVuZGVkRWxzWyBqIF0ucGFyZW50Tm9kZSA9PT0gaGVhZCApe1xuXHRcdFx0XHRcdFx0aGVhZC5yZW1vdmVDaGlsZCggYXBwZW5kZWRFbHNbIGogXSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0YXBwZW5kZWRFbHMubGVuZ3RoID0gMDtcblxuXHRcdFx0Ly9pbmplY3QgYWN0aXZlIHN0eWxlcywgZ3JvdXBlZCBieSBtZWRpYSB0eXBlXG5cdFx0XHRmb3IoIHZhciBrIGluIHN0eWxlQmxvY2tzICl7XG5cdFx0XHRcdGlmKCBzdHlsZUJsb2Nrcy5oYXNPd25Qcm9wZXJ0eSggayApICl7XG5cdFx0XHRcdFx0dmFyIHNzID0gZG9jLmNyZWF0ZUVsZW1lbnQoIFwic3R5bGVcIiApLFxuXHRcdFx0XHRcdFx0Y3NzID0gc3R5bGVCbG9ja3NbIGsgXS5qb2luKCBcIlxcblwiICk7XG5cblx0XHRcdFx0XHRzcy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXHRcdFx0XHRcdHNzLm1lZGlhID0gaztcblxuXHRcdFx0XHRcdC8vb3JpZ2luYWxseSwgc3Mgd2FzIGFwcGVuZGVkIHRvIGEgZG9jdW1lbnRGcmFnbWVudCBhbmQgc2hlZXRzIHdlcmUgYXBwZW5kZWQgaW4gYnVsay5cblx0XHRcdFx0XHQvL3RoaXMgY2F1c2VkIGNyYXNoZXMgaW4gSUUgaW4gYSBudW1iZXIgb2YgY2lyY3Vtc3RhbmNlcywgc3VjaCBhcyB3aGVuIHRoZSBIVE1MIGVsZW1lbnQgaGFkIGEgYmcgaW1hZ2Ugc2V0LCBzbyBhcHBlbmRpbmcgYmVmb3JlaGFuZCBzZWVtcyBiZXN0LiBUaGFua3MgdG8gQGR2ZWx5ayBmb3IgdGhlIGluaXRpYWwgcmVzZWFyY2ggb24gdGhpcyBvbmUhXG5cdFx0XHRcdFx0aGVhZC5pbnNlcnRCZWZvcmUoIHNzLCBsYXN0TGluay5uZXh0U2libGluZyApO1xuXG5cdFx0XHRcdFx0aWYgKCBzcy5zdHlsZVNoZWV0ICl7XG5cdFx0XHRcdFx0XHRzcy5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0c3MuYXBwZW5kQ2hpbGQoIGRvYy5jcmVhdGVUZXh0Tm9kZSggY3NzICkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvL3B1c2ggdG8gYXBwZW5kZWRFbHMgdG8gdHJhY2sgZm9yIGxhdGVyIHJlbW92YWxcblx0XHRcdFx0XHRhcHBlbmRlZEVscy5wdXNoKCBzcyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvL2ZpbmQgbWVkaWEgYmxvY2tzIGluIGNzcyB0ZXh0LCBjb252ZXJ0IHRvIHN0eWxlIGJsb2Nrc1xuXHRcdHRyYW5zbGF0ZSA9IGZ1bmN0aW9uKCBzdHlsZXMsIGhyZWYsIG1lZGlhICl7XG5cdFx0XHR2YXIgcXMgPSBzdHlsZXMucmVwbGFjZSggcmVzcG9uZC5yZWdleC5rZXlmcmFtZXMsICcnICkubWF0Y2goIHJlc3BvbmQucmVnZXgubWVkaWEgKSxcblx0XHRcdFx0cWwgPSBxcyAmJiBxcy5sZW5ndGggfHwgMDtcblxuXHRcdFx0Ly90cnkgdG8gZ2V0IENTUyBwYXRoXG5cdFx0XHRocmVmID0gaHJlZi5zdWJzdHJpbmcoIDAsIGhyZWYubGFzdEluZGV4T2YoIFwiL1wiICkgKTtcblxuXHRcdFx0dmFyIHJlcFVybHMgPSBmdW5jdGlvbiggY3NzICl7XG5cdFx0XHRcdFx0cmV0dXJuIGNzcy5yZXBsYWNlKCByZXNwb25kLnJlZ2V4LnVybHMsIFwiJDFcIiArIGhyZWYgKyBcIiQyJDNcIiApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR1c2VNZWRpYSA9ICFxbCAmJiBtZWRpYTtcblxuXHRcdFx0Ly9pZiBwYXRoIGV4aXN0cywgdGFjayBvbiB0cmFpbGluZyBzbGFzaFxuXHRcdFx0aWYoIGhyZWYubGVuZ3RoICl7IGhyZWYgKz0gXCIvXCI7IH1cblxuXHRcdFx0Ly9pZiBubyBpbnRlcm5hbCBxdWVyaWVzIGV4aXN0LCBidXQgbWVkaWEgYXR0ciBkb2VzLCB1c2UgdGhhdFxuXHRcdFx0Ly9ub3RlOiB0aGlzIGN1cnJlbnRseSBsYWNrcyBzdXBwb3J0IGZvciBzaXR1YXRpb25zIHdoZXJlIGEgbWVkaWEgYXR0ciBpcyBzcGVjaWZpZWQgb24gYSBsaW5rIEFORFxuXHRcdFx0XHQvL2l0cyBhc3NvY2lhdGVkIHN0eWxlc2hlZXQgaGFzIGludGVybmFsIENTUyBtZWRpYSBxdWVyaWVzLlxuXHRcdFx0XHQvL0luIHRob3NlIGNhc2VzLCB0aGUgbWVkaWEgYXR0cmlidXRlIHdpbGwgY3VycmVudGx5IGJlIGlnbm9yZWQuXG5cdFx0XHRpZiggdXNlTWVkaWEgKXtcblx0XHRcdFx0cWwgPSAxO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IoIHZhciBpID0gMDsgaSA8IHFsOyBpKysgKXtcblx0XHRcdFx0dmFyIGZ1bGxxLCB0aGlzcSwgZWFjaHEsIGVxbDtcblxuXHRcdFx0XHQvL21lZGlhIGF0dHJcblx0XHRcdFx0aWYoIHVzZU1lZGlhICl7XG5cdFx0XHRcdFx0ZnVsbHEgPSBtZWRpYTtcblx0XHRcdFx0XHRydWxlcy5wdXNoKCByZXBVcmxzKCBzdHlsZXMgKSApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vcGFyc2UgZm9yIHN0eWxlc1xuXHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdGZ1bGxxID0gcXNbIGkgXS5tYXRjaCggcmVzcG9uZC5yZWdleC5maW5kU3R5bGVzICkgJiYgUmVnRXhwLiQxO1xuXHRcdFx0XHRcdHJ1bGVzLnB1c2goIFJlZ0V4cC4kMiAmJiByZXBVcmxzKCBSZWdFeHAuJDIgKSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZWFjaHEgPSBmdWxscS5zcGxpdCggXCIsXCIgKTtcblx0XHRcdFx0ZXFsID0gZWFjaHEubGVuZ3RoO1xuXG5cdFx0XHRcdGZvciggdmFyIGogPSAwOyBqIDwgZXFsOyBqKysgKXtcblx0XHRcdFx0XHR0aGlzcSA9IGVhY2hxWyBqIF07XG5cdFx0XHRcdFx0bWVkaWFzdHlsZXMucHVzaCgge1xuXHRcdFx0XHRcdFx0bWVkaWEgOiB0aGlzcS5zcGxpdCggXCIoXCIgKVsgMCBdLm1hdGNoKCByZXNwb25kLnJlZ2V4Lm9ubHkgKSAmJiBSZWdFeHAuJDIgfHwgXCJhbGxcIixcblx0XHRcdFx0XHRcdHJ1bGVzIDogcnVsZXMubGVuZ3RoIC0gMSxcblx0XHRcdFx0XHRcdGhhc3F1ZXJ5IDogdGhpc3EuaW5kZXhPZihcIihcIikgPiAtMSxcblx0XHRcdFx0XHRcdG1pbncgOiB0aGlzcS5tYXRjaCggcmVzcG9uZC5yZWdleC5taW53ICkgJiYgcGFyc2VGbG9hdCggUmVnRXhwLiQxICkgKyAoIFJlZ0V4cC4kMiB8fCBcIlwiICksXG5cdFx0XHRcdFx0XHRtYXh3IDogdGhpc3EubWF0Y2goIHJlc3BvbmQucmVnZXgubWF4dyApICYmIHBhcnNlRmxvYXQoIFJlZ0V4cC4kMSApICsgKCBSZWdFeHAuJDIgfHwgXCJcIiApXG5cdFx0XHRcdFx0fSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGFwcGx5TWVkaWEoKTtcblx0XHR9LFxuXG5cdFx0Ly9yZWN1cnNlIHRocm91Z2ggcmVxdWVzdCBxdWV1ZSwgZ2V0IGNzcyB0ZXh0XG5cdFx0bWFrZVJlcXVlc3RzID0gZnVuY3Rpb24oKXtcblx0XHRcdGlmKCByZXF1ZXN0UXVldWUubGVuZ3RoICl7XG5cdFx0XHRcdHZhciB0aGlzUmVxdWVzdCA9IHJlcXVlc3RRdWV1ZS5zaGlmdCgpO1xuXG5cdFx0XHRcdGFqYXgoIHRoaXNSZXF1ZXN0LmhyZWYsIGZ1bmN0aW9uKCBzdHlsZXMgKXtcblx0XHRcdFx0XHR0cmFuc2xhdGUoIHN0eWxlcywgdGhpc1JlcXVlc3QuaHJlZiwgdGhpc1JlcXVlc3QubWVkaWEgKTtcblx0XHRcdFx0XHRwYXJzZWRTaGVldHNbIHRoaXNSZXF1ZXN0LmhyZWYgXSA9IHRydWU7XG5cblx0XHRcdFx0XHQvLyBieSB3cmFwcGluZyByZWN1cnNpdmUgZnVuY3Rpb24gY2FsbCBpbiBzZXRUaW1lb3V0XG5cdFx0XHRcdFx0Ly8gd2UgcHJldmVudCBcIlN0YWNrIG92ZXJmbG93XCIgZXJyb3IgaW4gSUU3XG5cdFx0XHRcdFx0dy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IG1ha2VSZXF1ZXN0cygpOyB9LDApO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdC8vbG9vcCBzdHlsZXNoZWV0cywgc2VuZCB0ZXh0IGNvbnRlbnQgdG8gdHJhbnNsYXRlXG5cdFx0cmlwQ1NTID0gZnVuY3Rpb24oKXtcblxuXHRcdFx0Zm9yKCB2YXIgaSA9IDA7IGkgPCBsaW5rcy5sZW5ndGg7IGkrKyApe1xuXHRcdFx0XHR2YXIgc2hlZXQgPSBsaW5rc1sgaSBdLFxuXHRcdFx0XHRocmVmID0gc2hlZXQuaHJlZixcblx0XHRcdFx0bWVkaWEgPSBzaGVldC5tZWRpYSxcblx0XHRcdFx0aXNDU1MgPSBzaGVldC5yZWwgJiYgc2hlZXQucmVsLnRvTG93ZXJDYXNlKCkgPT09IFwic3R5bGVzaGVldFwiO1xuXG5cdFx0XHRcdC8vb25seSBsaW5rcyBwbHogYW5kIHByZXZlbnQgcmUtcGFyc2luZ1xuXHRcdFx0XHRpZiggISFocmVmICYmIGlzQ1NTICYmICFwYXJzZWRTaGVldHNbIGhyZWYgXSApe1xuXHRcdFx0XHRcdC8vIHNlbGVjdGl2aXpyIGV4cG9zZXMgY3NzIHRocm91Z2ggdGhlIHJhd0Nzc1RleHQgZXhwYW5kb1xuXHRcdFx0XHRcdGlmIChzaGVldC5zdHlsZVNoZWV0ICYmIHNoZWV0LnN0eWxlU2hlZXQucmF3Q3NzVGV4dCkge1xuXHRcdFx0XHRcdFx0dHJhbnNsYXRlKCBzaGVldC5zdHlsZVNoZWV0LnJhd0Nzc1RleHQsIGhyZWYsIG1lZGlhICk7XG5cdFx0XHRcdFx0XHRwYXJzZWRTaGVldHNbIGhyZWYgXSA9IHRydWU7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGlmKCAoIS9eKFthLXpBLVo6XSpcXC9cXC8pLy50ZXN0KCBocmVmICkgJiYgIWJhc2UpIHx8XG5cdFx0XHRcdFx0XHRcdGhyZWYucmVwbGFjZSggUmVnRXhwLiQxLCBcIlwiICkuc3BsaXQoIFwiL1wiIClbMF0gPT09IHcubG9jYXRpb24uaG9zdCApe1xuXHRcdFx0XHRcdFx0XHQvLyBJRTcgZG9lc24ndCBoYW5kbGUgdXJscyB0aGF0IHN0YXJ0IHdpdGggJy8vJyBmb3IgYWpheCByZXF1ZXN0XG5cdFx0XHRcdFx0XHRcdC8vIG1hbnVhbGx5IGFkZCBpbiB0aGUgcHJvdG9jb2xcblx0XHRcdFx0XHRcdFx0aWYgKCBocmVmLnN1YnN0cmluZygwLDIpID09PSBcIi8vXCIgKSB7IGhyZWYgPSB3LmxvY2F0aW9uLnByb3RvY29sICsgaHJlZjsgfVxuXHRcdFx0XHRcdFx0XHRyZXF1ZXN0UXVldWUucHVzaCgge1xuXHRcdFx0XHRcdFx0XHRcdGhyZWY6IGhyZWYsXG5cdFx0XHRcdFx0XHRcdFx0bWVkaWE6IG1lZGlhXG5cdFx0XHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdG1ha2VSZXF1ZXN0cygpO1xuXHRcdH07XG5cblx0Ly90cmFuc2xhdGUgQ1NTXG5cdHJpcENTUygpO1xuXG5cdC8vZXhwb3NlIHVwZGF0ZSBmb3IgcmUtcnVubmluZyByZXNwb25kIGxhdGVyIG9uXG5cdHJlc3BvbmQudXBkYXRlID0gcmlwQ1NTO1xuXG5cdC8vZXhwb3NlIGdldEVtVmFsdWVcblx0cmVzcG9uZC5nZXRFbVZhbHVlID0gZ2V0RW1WYWx1ZTtcblxuXHQvL2FkanVzdCBvbiByZXNpemVcblx0ZnVuY3Rpb24gY2FsbE1lZGlhKCl7XG5cdFx0YXBwbHlNZWRpYSggdHJ1ZSApO1xuXHR9XG5cblx0aWYoIHcuYWRkRXZlbnRMaXN0ZW5lciApe1xuXHRcdHcuYWRkRXZlbnRMaXN0ZW5lciggXCJyZXNpemVcIiwgY2FsbE1lZGlhLCBmYWxzZSApO1xuXHR9XG5cdGVsc2UgaWYoIHcuYXR0YWNoRXZlbnQgKXtcblx0XHR3LmF0dGFjaEV2ZW50KCBcIm9ucmVzaXplXCIsIGNhbGxNZWRpYSApO1xuXHR9XG59KSh0aGlzKTtcbiJdfQ==
