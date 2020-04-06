(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["CoveoBmcV2Extension"] = factory();
	else
		root["CoveoBmcV2Extension"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 32);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target, parent) {
  if (parent){
    return parent.querySelector(target);
  }
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target, parent) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target, parent);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(4);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertAt.before, target);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}

	if(options.attrs.nonce === undefined) {
		var nonce = getNonce();
		if (nonce) {
			options.attrs.nonce = nonce;
		}
	}

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function getNonce() {
	if (false) {}

	return __webpack_require__.nc;
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = typeof options.transform === 'function'
		 ? options.transform(obj.css) 
		 : options.transform.default(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 4 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "js/cultures/en.js";

/***/ }),
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(25);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(3)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(27);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(3)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(5);
__webpack_require__(33);
__webpack_require__(34);
__webpack_require__(24);
module.exports = __webpack_require__(26);


/***/ }),
/* 33 */
/***/ (function(module, exports) {

document.addEventListener('DOMContentLoaded', function () {
 
  const searchEl = document.getElementById('search');
  Coveo.SearchEndpoint.endpoints["default"] = new Coveo.SearchEndpoint({
    restUri: 'https://platform.cloud.coveo.com/rest/search',
    accessToken: supportCoveoAccessToken,
    anonymous: true
  });
  
  if (searchEl) {
    Coveo.init(searchEl, {
      externalComponents: [document.getElementById('searchbox')],
      Analytics:{
        searchHub: 'PublicSearch'
      },
      Searchbox:{
        placeholder: 'Search BMC Support',
        height:44
      },
      ResultLink:{
        alwaysOpenInNewWindow: true
      },
    });

    Coveo.$$(searchEl).on('newResultDisplayed', function(e, args) {
       if (args.result.raw.syssource.indexOf('Confluence') > -1){
          if(!args.result.raw.syscontainsattachment) {
              Coveo.$(args.item).find('.CoveoResultFolding').remove();
              Coveo.$(args.item).find('.coveo-folding-footer').remove()
          }
       }
       if (args.result.raw.syssource.indexOf('Communities') > -1){
          if(!args.result.raw.jivecontainsattachment) {
              Coveo.$(args.item).find('.CoveoResultFolding').remove();
              Coveo.$(args.item).find('.coveo-folding-footer').remove()
          }
       }
    });

    Coveo.$$(searchEl).on('preprocessResults', function(e, args) {
      args.results.results.forEach(function(r) { 
        if(r.raw.sfsc_karecordtype__c == 'FAQ/Procedural') {
              r.clickUri = supportcentralurl + "/sc_KnowledgeArticle?sfdcid=" + r.raw.sfkbid + "&type=FAQ";
          } else if (r.raw.sfsc_karecordtype__c == 'Product/Service Description') {
              r.clickUri = supportcentralurl + "/sc_KnowledgeArticle?sfdcid=" + r.raw.sfkbid + "&type=ProductDescription";
          } else if (r.raw.sfsc_karecordtype__c == 'Solutions to a Product Problem') {
              r.clickUri = supportcentralurl + "/sc_KnowledgeArticle?sfdcid=" + r.raw.sfkbid + "&type=Solution";
          }
      });
    });

     //Add analytics custom events    
     Coveo.$$(searchEl).on('changeAnalyticsCustomData', function(e, args) {
         if (args.type=='ClickEvent') {
             const matchEl = document.querySelector("[href='"+args.metaObject.documentURL+"']");
             if(matchEl){
              const resultEl = Coveo.$$(matchEl).closest('.CoveoResult');
              const result = resultEl ? resultEl.data('CoveoResult') : {};
               if (result && result.raw.sfkbid) {
                   args.metaObject.documentauthor = result.raw.sysauthor;
               }
             }
         }
     });
  }

   const globalSearchBoxItems = document.querySelectorAll('#supprt-search-input, #supportSearchBox');
   globalSearchBoxItems.forEach(function (sbEl) {
     
     const sbInputEl = sbEl.querySelector('input.CoveoQuerybox');
     if(sbInputEl) {
      sbInputEl.setAttribute("placeholder", 'Search BMC Support');
     }
     
     if( !searchEl || sbEl.id !== 'supprt-search-input'){
      Coveo.$$(sbEl).on("beforeRedirect", function (e, data) {
        if(sbInputEl && sbInputEl.value) {
          data.searchPageUri = data.searchPageUri + '?q=' + encodeURIComponent(sbInputEl.value);
        }
      });
      Coveo.initSearchbox(sbEl, '/support/resources/support-search.html');
     }
   });
});

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(35);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(3)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(36)(false);
// Module
exports.push([module.i, ".CoveoResult .CoveoChatterThumbnail .coveo-chatter-thumbnail-img {\n  border-radius: 50%; }\n\n.CoveoResult .CoveoChatterThumbnail .coveo-chatter-thumbnail-placeholder {\n  text-align: center;\n  border-radius: 2px;\n  width: 30px;\n  height: 30px;\n  background-size: 30px 30px; }\n\n.CoveoResult .coveo-salesforce-thumbnail-container.coveo-salesforce-thumbnail-placeholder {\n  text-align: center; }\n\n.CoveoResult .coveo-salesforce-thumbnail-container.coveo-salesforce-thumbnail-placeholder > img.coveo-salesforce-thumbnail-img {\n  display: none; }\n\n.CoveoSearchInterface.coveo-chat-ended .CoveoResultActionsSendLiveAgent {\n  display: none; }\n\n.CoveoResultActionsMenu {\n  display: none;\n  position: relative;\n  height: 1.5rem;\n  right: 0;\n  border: 1px solid #ccc;\n  border-radius: 6px;\n  margin-top: -24px;\n  background: white; }\n  .CoveoResultActionsMenu .coveo-hidden {\n    display: none; }\n  .CoveoResultActionsMenu.coveo-menu-opened {\n    display: flex;\n    flex-flow: row nowrap;\n    justify-content: flex-end;\n    float: right; }\n  .CoveoResultActionsMenu .coveo-result-actions-menu-menu-item {\n    height: initial;\n    padding: 0 8px;\n    margin: 0;\n    cursor: pointer;\n    position: relative;\n    border-left: 1px solid #ccc;\n    border-top-right-radius: inherit;\n    border-bottom-right-radius: inherit;\n    line-height: 1.5em; }\n    .CoveoResultActionsMenu .coveo-result-actions-menu-menu-item.coveo-hidden {\n      display: none; }\n    .CoveoResultActionsMenu .coveo-result-actions-menu-menu-item:not(.coveo-hidden):not([style*=\"display: none\"]) {\n      border-left: none; }\n    .CoveoResultActionsMenu .coveo-result-actions-menu-menu-item:not(.coveo-hidden):not([style*=\"display: none\"]) ~ .coveo-result-actions-menu-menu-item:not(.coveo-hidden):not([style*=\"display: none\"]) {\n      border-left: thin solid #bcc3ca; }\n    .CoveoResultActionsMenu .coveo-result-actions-menu-menu-item:first-child {\n      border: transparent;\n      border-top-left-radius: inherit;\n      border-bottom-left-radius: inherit; }\n    .CoveoResultActionsMenu .coveo-result-actions-menu-menu-item.CoveoAttachToCase span {\n      visibility: visible;\n      height: 100%; }\n    .CoveoResultActionsMenu .coveo-result-actions-menu-menu-item .coveo-icon-for-quickview-svg {\n      margin: 0; }\n    .CoveoResultActionsMenu .coveo-result-actions-menu-menu-item:hover {\n      background-color: #f3f2f2; }\n    .CoveoResultActionsMenu .coveo-result-actions-menu-menu-item svg {\n      height: 16px;\n      width: 16px;\n      fill: #1d4f76;\n      vertical-align: middle; }\n    .CoveoResultActionsMenu .coveo-result-actions-menu-menu-item.CoveoQuickview:hover .coveo-caption-for-icon {\n      /* reset the value to initial for the quickview so popperjs can work properly. */\n      bottom: initial; }\n      .CoveoResultActionsMenu .coveo-result-actions-menu-menu-item.CoveoQuickview:hover .coveo-caption-for-icon:before {\n        border: transparent; }\n    .CoveoResultActionsMenu .coveo-result-actions-menu-menu-item:hover .coveo-caption-for-icon {\n      display: inline;\n      bottom: 30px;\n      transform: translateX(-50%);\n      left: 50%; }\n    .CoveoResultActionsMenu .coveo-result-actions-menu-menu-item .coveo-caption-for-icon {\n      font-size: 12px;\n      display: none;\n      background: #263e55;\n      color: white;\n      border-radius: 2px;\n      padding: 6px 16px;\n      position: absolute;\n      white-space: nowrap;\n      z-index: 99; }\n      .CoveoResultActionsMenu .coveo-result-actions-menu-menu-item .coveo-caption-for-icon:before {\n        border: solid;\n        border-color: #263e55 transparent;\n        border-width: 7px 6px 0;\n        content: '';\n        position: absolute;\n        z-index: 99;\n        bottom: -6px;\n        top: initial;\n        left: calc(50% - 6px); }\n\n.CoveoResultActionsPostToFeed,\n.CoveoResultActionsSendEmail,\n.CoveoResultActionsSendLiveAgent,\n.CoveoResultQuickAction {\n  cursor: pointer;\n  position: relative;\n  margin: 0 0 0 .5em;\n  line-height: 1.5em;\n  text-align: center; }\n  .CoveoResultActionsPostToFeed svg,\n  .CoveoResultActionsSendEmail svg,\n  .CoveoResultActionsSendLiveAgent svg,\n  .CoveoResultQuickAction svg {\n    height: 16px;\n    width: 16px;\n    fill: #1d4f76;\n    vertical-align: middle; }\n  .CoveoResultActionsPostToFeed.coveo-hidden,\n  .CoveoResultActionsSendEmail.coveo-hidden,\n  .CoveoResultActionsSendLiveAgent.coveo-hidden,\n  .CoveoResultQuickAction.coveo-hidden {\n    display: none; }\n  .CoveoResultActionsPostToFeed > span,\n  .CoveoResultActionsSendEmail > span,\n  .CoveoResultActionsSendLiveAgent > span,\n  .CoveoResultQuickAction > span {\n    display: inline-block; }\n  .CoveoResultActionsPostToFeed:hover .coveo-caption-for-icon,\n  .CoveoResultActionsSendEmail:hover .coveo-caption-for-icon,\n  .CoveoResultActionsSendLiveAgent:hover .coveo-caption-for-icon,\n  .CoveoResultQuickAction:hover .coveo-caption-for-icon {\n    display: inline;\n    bottom: 26px;\n    transform: translateX(-50%);\n    left: 50%; }\n  .CoveoResultActionsPostToFeed .coveo-caption-for-icon,\n  .CoveoResultActionsSendEmail .coveo-caption-for-icon,\n  .CoveoResultActionsSendLiveAgent .coveo-caption-for-icon,\n  .CoveoResultQuickAction .coveo-caption-for-icon {\n    font-size: 12px;\n    display: none;\n    background: #263e55;\n    color: white;\n    border-radius: 2px;\n    padding: 6px 16px;\n    position: absolute;\n    white-space: nowrap;\n    z-index: 99; }\n    .CoveoResultActionsPostToFeed .coveo-caption-for-icon:before,\n    .CoveoResultActionsSendEmail .coveo-caption-for-icon:before,\n    .CoveoResultActionsSendLiveAgent .coveo-caption-for-icon:before,\n    .CoveoResultQuickAction .coveo-caption-for-icon:before {\n      border: solid;\n      border-color: #263e55 transparent;\n      border-width: 7px 6px 0;\n      content: '';\n      position: absolute;\n      z-index: 99;\n      bottom: -6px;\n      top: initial;\n      left: calc(50% - 6px); }\n\n/*\n* @param direction vertical or horizontal\n* @param position type of positioning to apply (relative/absolute)\n*/\n/*\n* @param $selector css selector on which to apply the icon. Can be '&' if the icon should be applied on the current element;\n* @param $size size of the icon to use\n*/\n@-webkit-keyframes coveo-spin {\n  from {\n    -webkit-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -ms-transform: rotate(0deg);\n    -o-transform: rotate(0deg);\n    transform: rotate(0deg); }\n  to {\n    -webkit-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -ms-transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    transform: rotate(360deg); } }\n\n@-moz-keyframes coveo-spin {\n  from {\n    -webkit-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -ms-transform: rotate(0deg);\n    -o-transform: rotate(0deg);\n    transform: rotate(0deg); }\n  to {\n    -webkit-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -ms-transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    transform: rotate(360deg); } }\n\n@-o-keyframes coveo-spin {\n  from {\n    -webkit-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -ms-transform: rotate(0deg);\n    -o-transform: rotate(0deg);\n    transform: rotate(0deg); }\n  to {\n    -webkit-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -ms-transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    transform: rotate(360deg); } }\n\n@keyframes coveo-spin {\n  from {\n    -webkit-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -ms-transform: rotate(0deg);\n    -o-transform: rotate(0deg);\n    transform: rotate(0deg); }\n  to {\n    -webkit-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -ms-transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    transform: rotate(360deg); } }\n\n@-webkit-keyframes smooth-spin {\n  from {\n    transform: rotate(0deg);\n    -o-transform: rotate(0deg);\n    -ms-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -webkit-transform: rotate(0deg); }\n  to {\n    transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    -ms-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -webkit-transform: rotate(360deg); } }\n\n@-moz-keyframes smooth-spin {\n  from {\n    transform: rotate(0deg);\n    -o-transform: rotate(0deg);\n    -ms-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -webkit-transform: rotate(0deg); }\n  to {\n    transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    -ms-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -webkit-transform: rotate(360deg); } }\n\n@-o-keyframes smooth-spin {\n  from {\n    transform: rotate(0deg);\n    -o-transform: rotate(0deg);\n    -ms-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -webkit-transform: rotate(0deg); }\n  to {\n    transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    -ms-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -webkit-transform: rotate(360deg); } }\n\n@keyframes smooth-spin {\n  from {\n    transform: rotate(0deg);\n    -o-transform: rotate(0deg);\n    -ms-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -webkit-transform: rotate(0deg); }\n  to {\n    transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    -ms-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -webkit-transform: rotate(360deg); } }\n\n.coveo-label {\n  color: black;\n  font-size: 1em;\n  font-weight: normal; }\n\n.coveo-content {\n  color: black;\n  font-size: 1em; }\n\n.coveo-link {\n  color: #004990;\n  text-decoration: none; }\n  .coveo-link:hover {\n    text-decoration: underline; }\n\n.coveo-user-actions-opened .CoveoUserActions {\n  display: block; }\n\n.coveo-user-actions-opened .coveo-main-section {\n  display: none; }\n\n.CoveoUserActions {\n  display: none;\n  margin-top: 10px;\n  max-width: 1200px;\n  padding: 0 1em;\n  border: 1px solid #b5c4cf;\n  background-color: #f7f8f9; }\n  .CoveoUserActions > h1 {\n    color: #004990;\n    font-size: 2em;\n    font-weight: bold;\n    margin: 0.5em 0; }\n  .CoveoUserActions .coveo-no-actions {\n    padding: 3em;\n    text-align: center; }\n  .CoveoUserActions .coveo-close {\n    display: inline-block;\n    width: 1em;\n    height: 1em;\n    text-align: right; }\n  .CoveoUserActions-opened .coveo-user-actions {\n    display: block; }\n  .CoveoUserActions-opened .coveo-main-section {\n    display: none; }\n\n.coveo-expandable-list {\n  padding-bottom: 1.5em; }\n  .coveo-expandable-list .coveo-title {\n    font-size: 1em;\n    font-weight: normal;\n    margin: 0 0 0.75em;\n    text-transform: uppercase; }\n  .coveo-expandable-list .coveo-list {\n    margin: 0;\n    padding: 0;\n    list-style-type: none; }\n    .coveo-expandable-list .coveo-list li .coveo-list-row {\n      display: flex; }\n      .coveo-expandable-list .coveo-list li .coveo-list-row a {\n        width: calc(100% - 24px);\n        margin-bottom: 7px; }\n      .coveo-expandable-list .coveo-list li .coveo-list-row .coveo-row-icon {\n        position: relative;\n        width: 24px; }\n        .coveo-expandable-list .coveo-list li .coveo-list-row .coveo-row-icon > svg {\n          position: absolute;\n          top: 2px;\n          height: 1em;\n          width: 1em; }\n  .coveo-expandable-list .coveo-more-less {\n    font-size: 0.9em;\n    border: 0;\n    padding: 0;\n    color: #004990;\n    text-decoration: underline;\n    font-weight: normal;\n    background-color: transparent;\n    cursor: pointer;\n    margin-top: 0.5em;\n    margin-left: 24px; }\n\n.coveo-user-activity {\n  margin-top: 1em;\n  background-color: #f7f8f9; }\n  .coveo-user-activity .coveo-header {\n    font-size: 1em;\n    padding-bottom: 2em;\n    display: flex;\n    flex-flow: row nowrap;\n    align-content: flex-start; }\n    .coveo-user-activity .coveo-header .coveo-cell {\n      margin-right: 2em; }\n      .coveo-user-activity .coveo-header .coveo-cell:last-child {\n        margin-right: 0em; }\n    .coveo-user-activity .coveo-header .coveo-data {\n      margin-top: 1em;\n      font-weight: bold; }\n  .coveo-user-activity .coveo-activity {\n    margin: 0;\n    padding: 0 0 1.5em 0;\n    list-style-type: none; }\n    .coveo-user-activity .coveo-activity .coveo-data {\n      font-weight: bold; }\n    .coveo-user-activity .coveo-activity .coveo-folded {\n      cursor: pointer;\n      border: 0;\n      border-top: thin solid #cfd9e0;\n      border-bottom: thin solid #cfd9e0;\n      padding: 0.5em 0;\n      text-align: center; }\n      .coveo-user-activity .coveo-activity .coveo-folded hr {\n        height: 0;\n        border: 0;\n        border-bottom: thin solid #cfd9e0;\n        overflow: visible; }\n        .coveo-user-activity .coveo-activity .coveo-folded hr .coveo-text {\n          position: relative;\n          top: -0.5em;\n          display: inline-block;\n          vertical-align: top;\n          line-height: 1em;\n          height: 1em;\n          padding: 0 0.5em;\n          background-color: #f7f8f9; }\n    .coveo-user-activity .coveo-activity .coveo-bubble {\n      height: 1.5em;\n      border-left: thin solid #004990;\n      margin-left: 0.5em; }\n    .coveo-user-activity .coveo-activity .coveo-click a {\n      cursor: pointer;\n      color: #004990;\n      word-wrap: break-word;\n      text-decoration: none; }\n      .coveo-user-activity .coveo-activity .coveo-click a:hover {\n        text-decoration: underline; }\n    .coveo-user-activity .coveo-activity .coveo-click,\n    .coveo-user-activity .coveo-activity .coveo-search,\n    .coveo-user-activity .coveo-activity .coveo-custom,\n    .coveo-user-activity .coveo-activity .coveo-view {\n      position: relative;\n      margin-left: 0.5em;\n      border-left: thin solid #004990;\n      padding-left: 1.5em; }\n      .coveo-user-activity .coveo-activity .coveo-click .coveo-icon,\n      .coveo-user-activity .coveo-activity .coveo-search .coveo-icon,\n      .coveo-user-activity .coveo-activity .coveo-custom .coveo-icon,\n      .coveo-user-activity .coveo-activity .coveo-view .coveo-icon {\n        position: absolute;\n        left: -0.75em;\n        top: -0.1em;\n        padding: 0;\n        height: 1.5em;\n        width: 1.5em; }\n        .coveo-user-activity .coveo-activity .coveo-click .coveo-icon > svg,\n        .coveo-user-activity .coveo-activity .coveo-search .coveo-icon > svg,\n        .coveo-user-activity .coveo-activity .coveo-custom .coveo-icon > svg,\n        .coveo-user-activity .coveo-activity .coveo-view .coveo-icon > svg {\n          height: 1.5em;\n          width: 1.5em; }\n      .coveo-user-activity .coveo-activity .coveo-click > div,\n      .coveo-user-activity .coveo-activity .coveo-search > div,\n      .coveo-user-activity .coveo-activity .coveo-custom > div,\n      .coveo-user-activity .coveo-activity .coveo-view > div {\n        padding-bottom: 0.5em; }\n      .coveo-user-activity .coveo-activity .coveo-click:last-child,\n      .coveo-user-activity .coveo-activity .coveo-search:last-child,\n      .coveo-user-activity .coveo-activity .coveo-custom:last-child,\n      .coveo-user-activity .coveo-activity .coveo-view:last-child {\n        padding-bottom: 0;\n        border-left: 0; }\n\n.coveo-accordion:first-child {\n  border-top: 0; }\n  .coveo-accordion:first-child .coveo-accordion-header {\n    border-top: 0; }\n\n.coveo-accordion-header {\n  cursor: pointer;\n  display: flex;\n  flex-flow: row nowrap;\n  align-content: center;\n  align-items: baseline;\n  justify-content: space-between;\n  border-top: 1px solid #b5c4cf;\n  padding: 1em 0; }\n  .coveo-accordion-header-title {\n    font-size: 1.5em;\n    font-weight: bold;\n    text-align: left;\n    width: auto; }\n  .coveo-accordion-header .coveo-arrow-down svg {\n    height: 1em;\n    fill: black;\n    transform: rotate(180deg);\n    width: 0.5em;\n    padding: 0.25em 0 0; }\n\n.coveo-accordion.coveo-folded .coveo-accordion-foldable {\n  display: none; }\n\n.coveo-accordion.coveo-folded .coveo-arrow-down svg {\n  transform: initial;\n  padding: 0 0 0.25em; }\n\n/**\n * Ensure base css for button is present.\n */\n.coveo-dropdown-header-wrapper {\n  width: 100%;\n  display: inline-flex;\n  flex-wrap: nowrap;\n  -webkit-box-pack: end;\n  justify-content: flex-end;\n  margin: 0px;\n  padding: 0px; }\n  .coveo-dropdown-header-wrapper .coveo-user-actions-dropdown-header {\n    border: thin solid #bcc3ca;\n    border-radius: 2px;\n    background-color: white; }\n  .coveo-dropdown-header-wrapper a {\n    margin-right: 10px; }\n  .coveo-dropdown-header-wrapper .coveo-dropdown-header {\n    font-size: 12px;\n    display: inline-block;\n    padding: 0 7px;\n    height: 22px;\n    font-weight: 700;\n    line-height: 20px;\n    letter-spacing: 0.09px;\n    vertical-align: middle;\n    white-space: normal;\n    color: #1d4f76;\n    cursor: pointer;\n    text-transform: uppercase; }\n    .coveo-dropdown-header-wrapper .coveo-dropdown-header p {\n      line-height: 16px; }\n    .coveo-dropdown-header-wrapper .coveo-dropdown-header * {\n      display: inline-block;\n      margin: 0; }\n\n/* hide after a query is made. */\n.coveo-after-initialization .coveo-hide-after-query {\n  display: none;\n  visibility: hidden; }\n\n/* show before a query is made. */\n.coveo-during-initialization .coveo-hide-after-query {\n  display: inherit;\n  visibility: inherit; }\n\n.CoveoResultsPreferences {\n  font-family: \"Lato\", \"Helvetica Neue\", Helvetica, Arial, sans-serif, sans-serif;\n  font-size: 15px;\n  color: #373737; }\n\n.CoveoResultsFiltersPreferences {\n  font-family: \"Lato\", \"Helvetica Neue\", Helvetica, Arial, sans-serif, sans-serif;\n  font-size: 15px;\n  color: #373737; }\n\n.coveo-modal-container.salesforce-quickview-modal-container .coveo-modal-body {\n  padding: 0; }\n  .coveo-modal-container.salesforce-quickview-modal-container .coveo-modal-body iframe {\n    border: transparent; }\n\n/* Override the salesforce clasic override of the list item margin (ML Facets see SFINT-2376). */\n.CoveoDynamicFacet li.coveo-dynamic-facet-value {\n  margin-left: 0; }\n", ""]);



/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return '@media ' + item[2] + '{' + content + '}';
      } else {
        return content;
      }
    }).join('');
  }; // import a list of modules into the list


  list.i = function (modules, mediaQuery) {
    if (typeof modules === 'string') {
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    for (var i = 0; i < this.length; i++) {
      var id = this[i][0];

      if (id != null) {
        alreadyImportedModules[id] = true;
      }
    }

    for (i = 0; i < modules.length; i++) {
      var item = modules[i]; // skip already imported module
      // this implementation is not 100% perfect for weird media query combinations
      // when a module is imported multiple times with different media queries.
      // I hope this will never occur (Hey this way we have smaller bundles)

      if (item[0] == null || !alreadyImportedModules[item[0]]) {
        if (mediaQuery && !item[2]) {
          item[2] = mediaQuery;
        } else if (mediaQuery) {
          item[2] = '(' + item[2] + ') and (' + mediaQuery + ')';
        }

        list.push(item);
      }
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || '';
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;
  return '/*# ' + data + ' */';
}

/***/ })
/******/ ]);
});