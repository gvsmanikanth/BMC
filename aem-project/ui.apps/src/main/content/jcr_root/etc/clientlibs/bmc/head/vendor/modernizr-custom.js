(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * modernizr v3.3.1
 * Build http://modernizr.com/download?-backgroundsize-cssgradients-flexbox-flexboxlegacy-svg-touchevents-video-mq-setclasses-dontmin
 *
 * Copyright (c)
 *  Faruk Ates
 *  Paul Irish
 *  Alex Sexton
 *  Ryan Seddon
 *  Patrick Kettner
 *  Stu Cox
 *  Richard Herrera

 * MIT License
 */

/*
 * Modernizr tests which native CSS3 and HTML5 features are available in the
 * current UA and makes the results available to you in two ways: as properties on
 * a global `Modernizr` object, and as classes on the `<html>` element. This
 * information allows you to progressively enhance your pages with a granular level
 * of control over the experience.
*/

;(function(window, document, undefined){
  var classes = [];


  var tests = [];
  inputs = {};
  attrs = {};


  /**
   *
   * ModernizrProto is the constructor for Modernizr
   *
   * @class
   * @access public
   */

  var ModernizrProto = {
    // The current version, dummy
    _version: '3.3.1',

    // Any settings that don't work as separate modules
    // can go in here as configuration.
    _config: {
      'classPrefix': '',
      'enableClasses': true,
      'enableJSClass': true,
      'usePrefixes': true
    },

    // Queue of tests
    _q: [],

    // Stub these for people who are listening
    on: function(test, cb) {
      // I don't really think people should do this, but we can
      // safe guard it a bit.
      // -- NOTE:: this gets WAY overridden in src/addTest for actual async tests.
      // This is in case people listen to synchronous tests. I would leave it out,
      // but the code to *disallow* sync tests in the real version of this
      // function is actually larger than this.
      var self = this;
      setTimeout(function() {
        cb(self[test]);
      }, 0);
    },

    addTest: function(name, fn, options) {
      tests.push({name: name, fn: fn, options: options});
    },

    addAsyncTest: function(fn) {
      tests.push({name: null, fn: fn});
    }
  };



  // Fake some of Object.create so we can force non test results to be non "own" properties.
  var Modernizr = function() {};
  Modernizr.prototype = ModernizrProto;

  // Leak modernizr globally when you `require` it rather than force it here.
  // Overwrite name so constructor name is nicer :D
  Modernizr = new Modernizr();


/*!
{
  "name": "SVG",
  "property": "svg",
  "caniuse": "svg",
  "tags": ["svg"],
  "authors": ["Erik Dahlstrom"],
  "polyfills": [
    "svgweb",
    "raphael",
    "amplesdk",
    "canvg",
    "svg-boilerplate",
    "sie",
    "dojogfx",
    "fabricjs"
  ]
}
!*/
/* DOC
Detects support for SVG in `<embed>` or `<object>` elements.
*/

  Modernizr.addTest('svg', !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect);


  /**
   * is returns a boolean if the typeof an obj is exactly type.
   *
   * @access private
   * @function is
   * @param {*} obj - A thing we want to check the type of
   * @param {string} type - A string to compare the typeof against
   * @returns {boolean}
   */

  function is(obj, type) {
    return typeof obj === type;
  }
  ;

  /**
   * Run through all tests and detect their support in the current UA.
   *
   * @access private
   */

  function testRunner() {
    var featureNames;
    var feature;
    var aliasIdx;
    var result;
    var nameIdx;
    var featureName;
    var featureNameSplit;

    for (var featureIdx in tests) {
      if (tests.hasOwnProperty(featureIdx)) {
        featureNames = [];
        feature = tests[featureIdx];
        // run the test, throw the return value into the Modernizr,
        // then based on that boolean, define an appropriate className
        // and push it into an array of classes we'll join later.
        //
        // If there is no name, it's an 'async' test that is run,
        // but not directly added to the object. That should
        // be done with a post-run addTest call.
        if (feature.name) {
          featureNames.push(feature.name.toLowerCase());

          if (feature.options && feature.options.aliases && feature.options.aliases.length) {
            // Add all the aliases into the names list
            for (aliasIdx = 0; aliasIdx < feature.options.aliases.length; aliasIdx++) {
              featureNames.push(feature.options.aliases[aliasIdx].toLowerCase());
            }
          }
        }

        // Run the test, or use the raw value if it's not a function
        result = is(feature.fn, 'function') ? feature.fn() : feature.fn;


        // Set each of the names on the Modernizr object
        for (nameIdx = 0; nameIdx < featureNames.length; nameIdx++) {
          featureName = featureNames[nameIdx];
          // Support dot properties as sub tests. We don't do checking to make sure
          // that the implied parent tests have been added. You must call them in
          // order (either in the test, or make the parent test a dependency).
          //
          // Cap it to TWO to make the logic simple and because who needs that kind of subtesting
          // hashtag famous last words
          featureNameSplit = featureName.split('.');

          if (featureNameSplit.length === 1) {
            Modernizr[featureNameSplit[0]] = result;
          } else {
            // cast to a Boolean, if not one already
            /* jshint -W053 */
            if (Modernizr[featureNameSplit[0]] && !(Modernizr[featureNameSplit[0]] instanceof Boolean)) {
              Modernizr[featureNameSplit[0]] = new Boolean(Modernizr[featureNameSplit[0]]);
            }

            Modernizr[featureNameSplit[0]][featureNameSplit[1]] = result;
          }

          classes.push((result ? '' : 'no-') + featureNameSplit.join('-'));
        }
      }
    }
  }
  ;

  /**
   * docElement is a convenience wrapper to grab the root element of the document
   *
   * @access private
   * @returns {HTMLElement|SVGElement} The root element of the document
   */

  var docElement = document.documentElement;


  /**
   * A convenience helper to check if the document we are running in is an SVG document
   *
   * @access private
   * @returns {boolean}
   */

  var isSVG = docElement.nodeName.toLowerCase() === 'svg';


  /**
   * setClasses takes an array of class names and adds them to the root element
   *
   * @access private
   * @function setClasses
   * @param {string[]} classes - Array of class names
   */

  // Pass in an and array of class names, e.g.:
  //  ['no-webp', 'borderradius', ...]
  function setClasses(classes) {
    var className = docElement.className;
    var classPrefix = Modernizr._config.classPrefix || '';

    if (isSVG) {
      className = className.baseVal;
    }

    // Change `no-js` to `js` (independently of the `enableClasses` option)
    // Handle classPrefix on this too
    if (Modernizr._config.enableJSClass) {
      var reJS = new RegExp('(^|\\s)' + classPrefix + 'no-js(\\s|$)');
      className = className.replace(reJS, '$1' + classPrefix + 'js$2');
    }

    if (Modernizr._config.enableClasses) {
      // Add the new classes
      className += ' ' + classPrefix + classes.join(' ' + classPrefix);
      isSVG ? docElement.className.baseVal = className : docElement.className = className;
    }

  }

  ;

  /**
   * List of property values to set for css tests. See ticket #21
   * http://git.io/vUGl4
   *
   * @memberof Modernizr
   * @name Modernizr._prefixes
   * @optionName Modernizr._prefixes
   * @optionProp prefixes
   * @access public
   * @example
   *
   * Modernizr._prefixes is the internal list of prefixes that we test against
   * inside of things like [prefixed](#modernizr-prefixed) and [prefixedCSS](#-code-modernizr-prefixedcss). It is simply
   * an array of kebab-case vendor prefixes you can use within your code.
   *
   * Some common use cases include
   *
   * Generating all possible prefixed version of a CSS property
   * ```js
   * var rule = Modernizr._prefixes.join('transform: rotate(20deg); ');
   *
   * rule === 'transform: rotate(20deg); webkit-transform: rotate(20deg); moz-transform: rotate(20deg); o-transform: rotate(20deg); ms-transform: rotate(20deg);'
   * ```
   *
   * Generating all possible prefixed version of a CSS value
   * ```js
   * rule = 'display:' +  Modernizr._prefixes.join('flex; display:') + 'flex';
   *
   * rule === 'display:flex; display:-webkit-flex; display:-moz-flex; display:-o-flex; display:-ms-flex; display:flex'
   * ```
   */

  var prefixes = (ModernizrProto._config.usePrefixes ? ' -webkit- -moz- -o- -ms- '.split(' ') : []);

  // expose these for the plugin API. Look in the source for how to join() them against your input
  ModernizrProto._prefixes = prefixes;



  /**
   * createElement is a convenience wrapper around document.createElement. Since we
   * use createElement all over the place, this allows for (slightly) smaller code
   * as well as abstracting away issues with creating elements in contexts other than
   * HTML documents (e.g. SVG documents).
   *
   * @access private
   * @function createElement
   * @returns {HTMLElement|SVGElement} An HTML or SVG element
   */

  function createElement() {
    if (typeof document.createElement !== 'function') {
      // This is the case in IE7, where the type of createElement is "object".
      // For this reason, we cannot call apply() as Object is not a Function.
      return document.createElement(arguments[0]);
    } else if (isSVG) {
      return document.createElementNS.call(document, 'http://www.w3.org/2000/svg', arguments[0]);
    } else {
      return document.createElement.apply(document, arguments);
    }
  }

  ;
/*!
{
  "name": "HTML5 Video",
  "property": "video",
  "caniuse": "video",
  "tags": ["html5"],
  "knownBugs": [
    "Without QuickTime, `Modernizr.video.h264` will be `undefined`; https://github.com/Modernizr/Modernizr/issues/546"
  ],
  "polyfills": [
    "html5media",
    "mediaelementjs",
    "sublimevideo",
    "videojs",
    "leanbackplayer",
    "videoforeverybody"
  ]
}
!*/
/* DOC
Detects support for the video element, as well as testing what types of content it supports.

Subproperties are provided to describe support for `ogg`, `h264` and `webm` formats, e.g.:

```javascript
Modernizr.video         // true
Modernizr.video.ogg     // 'probably'
```
*/

  // Codec values from : github.com/NielsLeenheer/html5test/blob/9106a8/index.html#L845
  //                     thx to NielsLeenheer and zcorpan

  // Note: in some older browsers, "no" was a return value instead of empty string.
  //   It was live in FF3.5.0 and 3.5.1, but fixed in 3.5.2
  //   It was also live in Safari 4.0.0 - 4.0.4, but fixed in 4.0.5

  Modernizr.addTest('video', function() {
    /* jshint -W053 */
    var elem = createElement('video');
    var bool = false;

    // IE9 Running on Windows Server SKU can cause an exception to be thrown, bug #224
    try {
      if (bool = !!elem.canPlayType) {
        bool = new Boolean(bool);
        bool.ogg = elem.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, '');

        // Without QuickTime, this value will be `undefined`. github.com/Modernizr/Modernizr/issues/546
        bool.h264 = elem.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, '');

        bool.webm = elem.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, '');

        bool.vp9 = elem.canPlayType('video/webm; codecs="vp9"').replace(/^no$/, '');

        bool.hls = elem.canPlayType('application/x-mpegURL; codecs="avc1.42E01E"').replace(/^no$/, '');
      }
    } catch (e) {}

    return bool;
  });

/*!
{
  "name": "CSS Gradients",
  "caniuse": "css-gradients",
  "property": "cssgradients",
  "tags": ["css"],
  "knownBugs": ["False-positives on webOS (https://github.com/Modernizr/Modernizr/issues/202)"],
  "notes": [{
    "name": "Webkit Gradient Syntax",
    "href": "https://webkit.org/blog/175/introducing-css-gradients/"
  },{
    "name": "Linear Gradient Syntax",
    "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/linear-gradient"
  },{
    "name": "W3C Gradient Spec",
    "href": "https://drafts.csswg.org/css-images-3/#gradients"
  }]
}
!*/


  Modernizr.addTest('cssgradients', function() {

    var str1 = 'background-image:';
    var str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));';
    var css = '';
    var angle;

    for (var i = 0, len = prefixes.length - 1; i < len; i++) {
      angle = (i === 0 ? 'to ' : '');
      css += str1 + prefixes[i] + 'linear-gradient(' + angle + 'left top, #9f9, white);';
    }

    if (Modernizr._config.usePrefixes) {
    // legacy webkit syntax (FIXME: remove when syntax not in use anymore)
      css += str1 + '-webkit-' + str2;
    }

    var elem = createElement('a');
    var style = elem.style;
    style.cssText = css;

    // IE6 returns undefined so cast to string
    return ('' + style.backgroundImage).indexOf('gradient') > -1;
  });


  /**
   * getBody returns the body of a document, or an element that can stand in for
   * the body if a real body does not exist
   *
   * @access private
   * @function getBody
   * @returns {HTMLElement|SVGElement} Returns the real body of a document, or an
   * artificially created element that stands in for the body
   */

  function getBody() {
    // After page load injecting a fake body doesn't work so check if body exists
    var body = document.body;

    if (!body) {
      // Can't use the real body create a fake one.
      body = createElement(isSVG ? 'svg' : 'body');
      body.fake = true;
    }

    return body;
  }

  ;

  /**
   * injectElementWithStyles injects an element with style element and some CSS rules
   *
   * @access private
   * @function injectElementWithStyles
   * @param {string} rule - String representing a css rule
   * @param {function} callback - A function that is used to test the injected element
   * @param {number} [nodes] - An integer representing the number of additional nodes you want injected
   * @param {string[]} [testnames] - An array of strings that are used as ids for the additional nodes
   * @returns {boolean}
   */

  function injectElementWithStyles(rule, callback, nodes, testnames) {
    var mod = 'modernizr';
    var style;
    var ret;
    var node;
    var docOverflow;
    var div = createElement('div');
    var body = getBody();

    if (parseInt(nodes, 10)) {
      // In order not to give false positives we create a node for each test
      // This also allows the method to scale for unspecified uses
      while (nodes--) {
        node = createElement('div');
        node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
        div.appendChild(node);
      }
    }

    style = createElement('style');
    style.type = 'text/css';
    style.id = 's' + mod;

    // IE6 will false positive on some tests due to the style element inside the test div somehow interfering offsetHeight, so insert it into body or fakebody.
    // Opera will act all quirky when injecting elements in documentElement when page is served as xml, needs fakebody too. #270
    (!body.fake ? div : body).appendChild(style);
    body.appendChild(div);

    if (style.styleSheet) {
      style.styleSheet.cssText = rule;
    } else {
      style.appendChild(document.createTextNode(rule));
    }
    div.id = mod;

    if (body.fake) {
      //avoid crashing IE8, if background image is used
      body.style.background = '';
      //Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and scrollbars are visible
      body.style.overflow = 'hidden';
      docOverflow = docElement.style.overflow;
      docElement.style.overflow = 'hidden';
      docElement.appendChild(body);
    }

    ret = callback(div, rule);
    // If this is done after page load we don't want to remove the body so check if body exists
    if (body.fake) {
      body.parentNode.removeChild(body);
      docElement.style.overflow = docOverflow;
      // Trigger layout so kinetic scrolling isn't disabled in iOS6+
      docElement.offsetHeight;
    } else {
      div.parentNode.removeChild(div);
    }

    return !!ret;

  }

  ;

  /**
   * testStyles injects an element with style element and some CSS rules
   *
   * @memberof Modernizr
   * @name Modernizr.testStyles
   * @optionName Modernizr.testStyles()
   * @optionProp testStyles
   * @access public
   * @function testStyles
   * @param {string} rule - String representing a css rule
   * @param {function} callback - A function that is used to test the injected element
   * @param {number} [nodes] - An integer representing the number of additional nodes you want injected
   * @param {string[]} [testnames] - An array of strings that are used as ids for the additional nodes
   * @returns {boolean}
   * @example
   *
   * `Modernizr.testStyles` takes a CSS rule and injects it onto the current page
   * along with (possibly multiple) DOM elements. This lets you check for features
   * that can not be detected by simply checking the [IDL](https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/Interface_development_guide/IDL_interface_rules).
   *
   * ```js
   * Modernizr.testStyles('#modernizr { width: 9px; color: papayawhip; }', function(elem, rule) {
   *   // elem is the first DOM node in the page (by default #modernizr)
   *   // rule is the first argument you supplied - the CSS rule in string form
   *
   *   addTest('widthworks', elem.style.width === '9px')
   * });
   * ```
   *
   * If your test requires multiple nodes, you can include a third argument
   * indicating how many additional div elements to include on the page. The
   * additional nodes are injected as children of the `elem` that is returned as
   * the first argument to the callback.
   *
   * ```js
   * Modernizr.testStyles('#modernizr {width: 1px}; #modernizr2 {width: 2px}', function(elem) {
   *   document.getElementById('modernizr').style.width === '1px'; // true
   *   document.getElementById('modernizr2').style.width === '2px'; // true
   *   elem.firstChild === document.getElementById('modernizr2'); // true
   * }, 1);
   * ```
   *
   * By default, all of the additional elements have an ID of `modernizr[n]`, where
   * `n` is its index (e.g. the first additional, second overall is `#modernizr2`,
   * the second additional is `#modernizr3`, etc.).
   * If you want to have more meaningful IDs for your function, you can provide
   * them as the fourth argument, as an array of strings
   *
   * ```js
   * Modernizr.testStyles('#foo {width: 10px}; #bar {height: 20px}', function(elem) {
   *   elem.firstChild === document.getElementById('foo'); // true
   *   elem.lastChild === document.getElementById('bar'); // true
   * }, 2, ['foo', 'bar']);
   * ```
   *
   */

  var testStyles = ModernizrProto.testStyles = injectElementWithStyles;

/*!
{
  "name": "Touch Events",
  "property": "touchevents",
  "caniuse" : "touch",
  "tags": ["media", "attribute"],
  "notes": [{
    "name": "Touch Events spec",
    "href": "https://www.w3.org/TR/2013/WD-touch-events-20130124/"
  }],
  "warnings": [
    "Indicates if the browser supports the Touch Events spec, and does not necessarily reflect a touchscreen device"
  ],
  "knownBugs": [
    "False-positive on some configurations of Nokia N900",
    "False-positive on some BlackBerry 6.0 builds – https://github.com/Modernizr/Modernizr/issues/372#issuecomment-3112695"
  ]
}
!*/
/* DOC
Indicates if the browser supports the W3C Touch Events API.

This *does not* necessarily reflect a touchscreen device:

* Older touchscreen devices only emulate mouse events
* Modern IE touch devices implement the Pointer Events API instead: use `Modernizr.pointerevents` to detect support for that
* Some browsers & OS setups may enable touch APIs when no touchscreen is connected
* Future browsers may implement other event models for touch interactions

See this article: [You Can't Detect A Touchscreen](http://www.stucox.com/blog/you-cant-detect-a-touchscreen/).

It's recommended to bind both mouse and touch/pointer events simultaneously – see [this HTML5 Rocks tutorial](http://www.html5rocks.com/en/mobile/touchandmouse/).

This test will also return `true` for Firefox 4 Multitouch support.
*/

  // Chrome (desktop) used to lie about its support on this, but that has since been rectified: http://crbug.com/36415
  Modernizr.addTest('touchevents', function() {
    var bool;
    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
      bool = true;
    } else {
      // include the 'heartz' as a way to have a non matching MQ to help terminate the join
      // https://git.io/vznFH
      var query = ['@media (', prefixes.join('touch-enabled),('), 'heartz', ')', '{#modernizr{top:9px;position:absolute}}'].join('');
      testStyles(query, function(node) {
        bool = node.offsetTop === 9;
      });
    }
    return bool;
  });


  /**
   * Modernizr.mq tests a given media query, live against the current state of the window
   * adapted from matchMedia polyfill by Scott Jehl and Paul Irish
   * gist.github.com/786768
   *
   * @memberof Modernizr
   * @name Modernizr.mq
   * @optionName Modernizr.mq()
   * @optionProp mq
   * @access public
   * @function mq
   * @param {string} mq - String of the media query we want to test
   * @returns {boolean}
   * @example
   * Modernizr.mq allows for you to programmatically check if the current browser
   * window state matches a media query.
   *
   * ```js
   *  var query = Modernizr.mq('(min-width: 900px)');
   *
   *  if (query) {
   *    // the browser window is larger than 900px
   *  }
   * ```
   *
   * Only valid media queries are supported, therefore you must always include values
   * with your media query
   *
   * ```js
   * // good
   *  Modernizr.mq('(min-width: 900px)');
   *
   * // bad
   *  Modernizr.mq('min-width');
   * ```
   *
   * If you would just like to test that media queries are supported in general, use
   *
   * ```js
   *  Modernizr.mq('only all'); // true if MQ are supported, false if not
   * ```
   *
   *
   * Note that if the browser does not support media queries (e.g. old IE) mq will
   * always return false.
   */

  var mq = (function() {
    var matchMedia = window.matchMedia || window.msMatchMedia;
    if (matchMedia) {
      return function(mq) {
        var mql = matchMedia(mq);
        return mql && mql.matches || false;
      };
    }

    return function(mq) {
      var bool = false;

      injectElementWithStyles('@media ' + mq + ' { #modernizr { position: absolute; } }', function(node) {
        bool = (window.getComputedStyle ?
                window.getComputedStyle(node, null) :
                node.currentStyle).position == 'absolute';
      });

      return bool;
    };
  })();


  ModernizrProto.mq = mq;



  /**
   * If the browsers follow the spec, then they would expose vendor-specific style as:
   *   elem.style.WebkitBorderRadius
   * instead of something like the following, which would be technically incorrect:
   *   elem.style.webkitBorderRadius

   * Webkit ghosts their properties in lowercase but Opera & Moz do not.
   * Microsoft uses a lowercase `ms` instead of the correct `Ms` in IE8+
   *   erik.eae.net/archives/2008/03/10/21.48.10/

   * More here: github.com/Modernizr/Modernizr/issues/issue/21
   *
   * @access private
   * @returns {string} The string representing the vendor-specific style properties
   */

  var omPrefixes = 'Moz O ms Webkit';


  var cssomPrefixes = (ModernizrProto._config.usePrefixes ? omPrefixes.split(' ') : []);
  ModernizrProto._cssomPrefixes = cssomPrefixes;


  /**
   * List of JavaScript DOM values used for tests
   *
   * @memberof Modernizr
   * @name Modernizr._domPrefixes
   * @optionName Modernizr._domPrefixes
   * @optionProp domPrefixes
   * @access public
   * @example
   *
   * Modernizr._domPrefixes is exactly the same as [_prefixes](#modernizr-_prefixes), but rather
   * than kebab-case properties, all properties are their Capitalized variant
   *
   * ```js
   * Modernizr._domPrefixes === [ "Moz", "O", "ms", "Webkit" ];
   * ```
   */

  var domPrefixes = (ModernizrProto._config.usePrefixes ? omPrefixes.toLowerCase().split(' ') : []);
  ModernizrProto._domPrefixes = domPrefixes;



  /**
   * contains checks to see if a string contains another string
   *
   * @access private
   * @function contains
   * @param {string} str - The string we want to check for substrings
   * @param {string} substr - The substring we want to search the first string for
   * @returns {boolean}
   */

  function contains(str, substr) {
    return !!~('' + str).indexOf(substr);
  }

  ;

  /**
   * cssToDOM takes a kebab-case string and converts it to camelCase
   * e.g. box-sizing -> boxSizing
   *
   * @access private
   * @function cssToDOM
   * @param {string} name - String name of kebab-case prop we want to convert
   * @returns {string} The camelCase version of the supplied name
   */

  function cssToDOM(name) {
    return name.replace(/([a-z])-([a-z])/g, function(str, m1, m2) {
      return m1 + m2.toUpperCase();
    }).replace(/^-/, '');
  }
  ;

  /**
   * fnBind is a super small [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) polyfill.
   *
   * @access private
   * @function fnBind
   * @param {function} fn - a function you want to change `this` reference to
   * @param {object} that - the `this` you want to call the function with
   * @returns {function} The wrapped version of the supplied function
   */

  function fnBind(fn, that) {
    return function() {
      return fn.apply(that, arguments);
    };
  }

  ;

  /**
   * testDOMProps is a generic DOM property test; if a browser supports
   *   a certain property, it won't return undefined for it.
   *
   * @access private
   * @function testDOMProps
   * @param {array.<string>} props - An array of properties to test for
   * @param {object} obj - An object or Element you want to use to test the parameters again
   * @param {boolean|object} elem - An Element to bind the property lookup again. Use `false` to prevent the check
   */
  function testDOMProps(props, obj, elem) {
    var item;

    for (var i in props) {
      if (props[i] in obj) {

        // return the property name as a string
        if (elem === false) {
          return props[i];
        }

        item = obj[props[i]];

        // let's bind a function
        if (is(item, 'function')) {
          // bind to obj unless overriden
          return fnBind(item, elem || obj);
        }

        // return the unbound function or obj or value
        return item;
      }
    }
    return false;
  }

  ;

  /**
   * Create our "modernizr" element that we do most feature tests on.
   *
   * @access private
   */

  var modElem = {
    elem: createElement('modernizr')
  };

  // Clean up this element
  Modernizr._q.push(function() {
    delete modElem.elem;
  });



  var mStyle = {
    style: modElem.elem.style
  };

  // kill ref for gc, must happen before mod.elem is removed, so we unshift on to
  // the front of the queue.
  Modernizr._q.unshift(function() {
    delete mStyle.style;
  });



  /**
   * domToCSS takes a camelCase string and converts it to kebab-case
   * e.g. boxSizing -> box-sizing
   *
   * @access private
   * @function domToCSS
   * @param {string} name - String name of camelCase prop we want to convert
   * @returns {string} The kebab-case version of the supplied name
   */

  function domToCSS(name) {
    return name.replace(/([A-Z])/g, function(str, m1) {
      return '-' + m1.toLowerCase();
    }).replace(/^ms-/, '-ms-');
  }
  ;

  /**
   * nativeTestProps allows for us to use native feature detection functionality if available.
   * some prefixed form, or false, in the case of an unsupported rule
   *
   * @access private
   * @function nativeTestProps
   * @param {array} props - An array of property names
   * @param {string} value - A string representing the value we want to check via @supports
   * @returns {boolean|undefined} A boolean when @supports exists, undefined otherwise
   */

  // Accepts a list of property names and a single value
  // Returns `undefined` if native detection not available
  function nativeTestProps(props, value) {
    var i = props.length;
    // Start with the JS API: http://www.w3.org/TR/css3-conditional/#the-css-interface
    if ('CSS' in window && 'supports' in window.CSS) {
      // Try every prefixed variant of the property
      while (i--) {
        if (window.CSS.supports(domToCSS(props[i]), value)) {
          return true;
        }
      }
      return false;
    }
    // Otherwise fall back to at-rule (for Opera 12.x)
    else if ('CSSSupportsRule' in window) {
      // Build a condition string for every prefixed variant
      var conditionText = [];
      while (i--) {
        conditionText.push('(' + domToCSS(props[i]) + ':' + value + ')');
      }
      conditionText = conditionText.join(' or ');
      return injectElementWithStyles('@supports (' + conditionText + ') { #modernizr { position: absolute; } }', function(node) {
        return getComputedStyle(node, null).position == 'absolute';
      });
    }
    return undefined;
  }
  ;

  // testProps is a generic CSS / DOM property test.

  // In testing support for a given CSS property, it's legit to test:
  //    `elem.style[styleName] !== undefined`
  // If the property is supported it will return an empty string,
  // if unsupported it will return undefined.

  // We'll take advantage of this quick test and skip setting a style
  // on our modernizr element, but instead just testing undefined vs
  // empty string.

  // Property names can be provided in either camelCase or kebab-case.

  function testProps(props, prefixed, value, skipValueTest) {
    skipValueTest = is(skipValueTest, 'undefined') ? false : skipValueTest;

    // Try native detect first
    if (!is(value, 'undefined')) {
      var result = nativeTestProps(props, value);
      if (!is(result, 'undefined')) {
        return result;
      }
    }

    // Otherwise do it properly
    var afterInit, i, propsLength, prop, before;

    // If we don't have a style element, that means we're running async or after
    // the core tests, so we'll need to create our own elements to use

    // inside of an SVG element, in certain browsers, the `style` element is only
    // defined for valid tags. Therefore, if `modernizr` does not have one, we
    // fall back to a less used element and hope for the best.
    var elems = ['modernizr', 'tspan'];
    while (!mStyle.style) {
      afterInit = true;
      mStyle.modElem = createElement(elems.shift());
      mStyle.style = mStyle.modElem.style;
    }

    // Delete the objects if we created them.
    function cleanElems() {
      if (afterInit) {
        delete mStyle.style;
        delete mStyle.modElem;
      }
    }

    propsLength = props.length;
    for (i = 0; i < propsLength; i++) {
      prop = props[i];
      before = mStyle.style[prop];

      if (contains(prop, '-')) {
        prop = cssToDOM(prop);
      }

      if (mStyle.style[prop] !== undefined) {

        // If value to test has been passed in, do a set-and-check test.
        // 0 (integer) is a valid property value, so check that `value` isn't
        // undefined, rather than just checking it's truthy.
        if (!skipValueTest && !is(value, 'undefined')) {

          // Needs a try catch block because of old IE. This is slow, but will
          // be avoided in most cases because `skipValueTest` will be used.
          try {
            mStyle.style[prop] = value;
          } catch (e) {}

          // If the property value has changed, we assume the value used is
          // supported. If `value` is empty string, it'll fail here (because
          // it hasn't changed), which matches how browsers have implemented
          // CSS.supports()
          if (mStyle.style[prop] != before) {
            cleanElems();
            return prefixed == 'pfx' ? prop : true;
          }
        }
        // Otherwise just return true, or the property name if this is a
        // `prefixed()` call
        else {
          cleanElems();
          return prefixed == 'pfx' ? prop : true;
        }
      }
    }
    cleanElems();
    return false;
  }

  ;

  /**
   * testPropsAll tests a list of DOM properties we want to check against.
   * We specify literally ALL possible (known and/or likely) properties on
   * the element including the non-vendor prefixed one, for forward-
   * compatibility.
   *
   * @access private
   * @function testPropsAll
   * @param {string} prop - A string of the property to test for
   * @param {string|object} [prefixed] - An object to check the prefixed properties on. Use a string to skip
   * @param {HTMLElement|SVGElement} [elem] - An element used to test the property and value against
   * @param {string} [value] - A string of a css value
   * @param {boolean} [skipValueTest] - An boolean representing if you want to test if value sticks when set
   */
  function testPropsAll(prop, prefixed, elem, value, skipValueTest) {

    var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1),
    props = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

    // did they call .prefixed('boxSizing') or are we just testing a prop?
    if (is(prefixed, 'string') || is(prefixed, 'undefined')) {
      return testProps(props, prefixed, value, skipValueTest);

      // otherwise, they called .prefixed('requestAnimationFrame', window[, elem])
    } else {
      props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
      return testDOMProps(props, prefixed, elem);
    }
  }

  // Modernizr.testAllProps() investigates whether a given style property,
  // or any of its vendor-prefixed variants, is recognized
  //
  // Note that the property names must be provided in the camelCase variant.
  // Modernizr.testAllProps('boxSizing')
  ModernizrProto.testAllProps = testPropsAll;



  /**
   * testAllProps determines whether a given CSS property is supported in the browser
   *
   * @memberof Modernizr
   * @name Modernizr.testAllProps
   * @optionName Modernizr.testAllProps()
   * @optionProp testAllProps
   * @access public
   * @function testAllProps
   * @param {string} prop - String naming the property to test (either camelCase or kebab-case)
   * @param {string} [value] - String of the value to test
   * @param {boolean} [skipValueTest=false] - Whether to skip testing that the value is supported when using non-native detection
   * @example
   *
   * testAllProps determines whether a given CSS property, in some prefixed form,
   * is supported by the browser.
   *
   * ```js
   * testAllProps('boxSizing')  // true
   * ```
   *
   * It can optionally be given a CSS value in string form to test if a property
   * value is valid
   *
   * ```js
   * testAllProps('display', 'block') // true
   * testAllProps('display', 'penguin') // false
   * ```
   *
   * A boolean can be passed as a third parameter to skip the value check when
   * native detection (@supports) isn't available.
   *
   * ```js
   * testAllProps('shapeOutside', 'content-box', true);
   * ```
   */

  function testAllProps(prop, value, skipValueTest) {
    return testPropsAll(prop, undefined, undefined, value, skipValueTest);
  }
  ModernizrProto.testAllProps = testAllProps;

/*!
{
  "name": "Background Size",
  "property": "backgroundsize",
  "tags": ["css"],
  "knownBugs": ["This will false positive in Opera Mini - https://github.com/Modernizr/Modernizr/issues/396"],
  "notes": [{
    "name": "Related Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/396"
  }]
}
!*/

  Modernizr.addTest('backgroundsize', testAllProps('backgroundSize', '100%', true));

/*!
{
  "name": "Flexbox",
  "property": "flexbox",
  "caniuse": "flexbox",
  "tags": ["css"],
  "notes": [{
    "name": "The _new_ flexbox",
    "href": "http://dev.w3.org/csswg/css3-flexbox"
  }],
  "warnings": [
    "A `true` result for this detect does not imply that the `flex-wrap` property is supported; see the `flexwrap` detect."
  ]
}
!*/
/* DOC
Detects support for the Flexible Box Layout model, a.k.a. Flexbox, which allows easy manipulation of layout order and sizing within a container.
*/

  Modernizr.addTest('flexbox', testAllProps('flexBasis', '1px', true));

/*!
{
  "name": "Flexbox (legacy)",
  "property": "flexboxlegacy",
  "tags": ["css"],
  "polyfills": ["flexie"],
  "notes": [{
    "name": "The _old_ flexbox",
    "href": "https://www.w3.org/TR/2009/WD-css3-flexbox-20090723/"
  }]
}
!*/

  Modernizr.addTest('flexboxlegacy', testAllProps('boxDirection', 'reverse', true));
  
  //Added to detect transition
   Modernizr.addTest('csstransitions',testAllProps('transition'));
  
  
    /*>>webforms*/
    // input features and input types go directly onto the ret object, bypassing the tests loop.
    // Hold this guy to execute in a moment.
    
    function webforms() {
        /*>>input*/
        // Run through HTML5's new input attributes to see if the UA understands any.
        // We're using f which is the <input> element created early on
        // Mike Taylr has created a comprehensive resource for testing these attributes
        //   when applied to all input types:
        //   miketaylr.com/code/input-type-attr.html
        // spec: www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary

        // Only input placeholder is tested while textarea's placeholder is not.
        // Currently Safari 4 and Opera 11 have support only for the input placeholder
        // Both tests are available in feature-detects/forms-placeholder.js
        Modernizr['input'] = (function( props ) {
        	var input1 = document.createElement('input');
            for ( var i = 0, len = props.length; i < len; i++ ) {
                attrs[ props[i] ] = !!(props[i] in input1);
            }
            if (attrs.list){
              // safari false positive's on datalist: webk.it/74252
              // see also github.com/Modernizr/Modernizr/issues/146
              attrs.list = !!(document.createElement('datalist') && window.HTMLDataListElement);
            }
            return attrs;
        })('autocomplete autofocus list placeholder max min multiple pattern required step'.split(' '));
        /*>>input*/
    }

    /*>>webforms*/
    // input tests need to run.
    Modernizr.input || webforms();
    /*>>webforms*/

  

  // Run each test
  testRunner();

  // Remove the "no-js" class if it exists
  setClasses(classes);

  delete ModernizrProto.addTest;
  delete ModernizrProto.addAsyncTest;

  // Run the things that are supposed to run after the tests
  for (var i = 0; i < Modernizr._q.length; i++) {
    Modernizr._q[i]();
  }

  // Leak Modernizr namespace
  window.Modernizr = Modernizr;


;

})(window, document);

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvbW9kZXJuaXpyLWN1c3RvbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyohXHJcbiAqIG1vZGVybml6ciB2My4zLjFcclxuICogQnVpbGQgaHR0cDovL21vZGVybml6ci5jb20vZG93bmxvYWQ/LWJhY2tncm91bmRzaXplLWNzc2dyYWRpZW50cy1mbGV4Ym94LWZsZXhib3hsZWdhY3ktc3ZnLXRvdWNoZXZlbnRzLXZpZGVvLW1xLXNldGNsYXNzZXMtZG9udG1pblxyXG4gKlxyXG4gKiBDb3B5cmlnaHQgKGMpXHJcbiAqICBGYXJ1ayBBdGVzXHJcbiAqICBQYXVsIElyaXNoXHJcbiAqICBBbGV4IFNleHRvblxyXG4gKiAgUnlhbiBTZWRkb25cclxuICogIFBhdHJpY2sgS2V0dG5lclxyXG4gKiAgU3R1IENveFxyXG4gKiAgUmljaGFyZCBIZXJyZXJhXHJcblxyXG4gKiBNSVQgTGljZW5zZVxyXG4gKi9cclxuXHJcbi8qXHJcbiAqIE1vZGVybml6ciB0ZXN0cyB3aGljaCBuYXRpdmUgQ1NTMyBhbmQgSFRNTDUgZmVhdHVyZXMgYXJlIGF2YWlsYWJsZSBpbiB0aGVcclxuICogY3VycmVudCBVQSBhbmQgbWFrZXMgdGhlIHJlc3VsdHMgYXZhaWxhYmxlIHRvIHlvdSBpbiB0d28gd2F5czogYXMgcHJvcGVydGllcyBvblxyXG4gKiBhIGdsb2JhbCBgTW9kZXJuaXpyYCBvYmplY3QsIGFuZCBhcyBjbGFzc2VzIG9uIHRoZSBgPGh0bWw+YCBlbGVtZW50LiBUaGlzXHJcbiAqIGluZm9ybWF0aW9uIGFsbG93cyB5b3UgdG8gcHJvZ3Jlc3NpdmVseSBlbmhhbmNlIHlvdXIgcGFnZXMgd2l0aCBhIGdyYW51bGFyIGxldmVsXHJcbiAqIG9mIGNvbnRyb2wgb3ZlciB0aGUgZXhwZXJpZW5jZS5cclxuKi9cclxuXHJcbjsoZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKXtcclxuICB2YXIgY2xhc3NlcyA9IFtdO1xyXG5cclxuXHJcbiAgdmFyIHRlc3RzID0gW107XHJcbiAgaW5wdXRzID0ge307XHJcbiAgYXR0cnMgPSB7fTtcclxuXHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogTW9kZXJuaXpyUHJvdG8gaXMgdGhlIGNvbnN0cnVjdG9yIGZvciBNb2Rlcm5penJcclxuICAgKlxyXG4gICAqIEBjbGFzc1xyXG4gICAqIEBhY2Nlc3MgcHVibGljXHJcbiAgICovXHJcblxyXG4gIHZhciBNb2Rlcm5penJQcm90byA9IHtcclxuICAgIC8vIFRoZSBjdXJyZW50IHZlcnNpb24sIGR1bW15XHJcbiAgICBfdmVyc2lvbjogJzMuMy4xJyxcclxuXHJcbiAgICAvLyBBbnkgc2V0dGluZ3MgdGhhdCBkb24ndCB3b3JrIGFzIHNlcGFyYXRlIG1vZHVsZXNcclxuICAgIC8vIGNhbiBnbyBpbiBoZXJlIGFzIGNvbmZpZ3VyYXRpb24uXHJcbiAgICBfY29uZmlnOiB7XHJcbiAgICAgICdjbGFzc1ByZWZpeCc6ICcnLFxyXG4gICAgICAnZW5hYmxlQ2xhc3Nlcyc6IHRydWUsXHJcbiAgICAgICdlbmFibGVKU0NsYXNzJzogdHJ1ZSxcclxuICAgICAgJ3VzZVByZWZpeGVzJzogdHJ1ZVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBRdWV1ZSBvZiB0ZXN0c1xyXG4gICAgX3E6IFtdLFxyXG5cclxuICAgIC8vIFN0dWIgdGhlc2UgZm9yIHBlb3BsZSB3aG8gYXJlIGxpc3RlbmluZ1xyXG4gICAgb246IGZ1bmN0aW9uKHRlc3QsIGNiKSB7XHJcbiAgICAgIC8vIEkgZG9uJ3QgcmVhbGx5IHRoaW5rIHBlb3BsZSBzaG91bGQgZG8gdGhpcywgYnV0IHdlIGNhblxyXG4gICAgICAvLyBzYWZlIGd1YXJkIGl0IGEgYml0LlxyXG4gICAgICAvLyAtLSBOT1RFOjogdGhpcyBnZXRzIFdBWSBvdmVycmlkZGVuIGluIHNyYy9hZGRUZXN0IGZvciBhY3R1YWwgYXN5bmMgdGVzdHMuXHJcbiAgICAgIC8vIFRoaXMgaXMgaW4gY2FzZSBwZW9wbGUgbGlzdGVuIHRvIHN5bmNocm9ub3VzIHRlc3RzLiBJIHdvdWxkIGxlYXZlIGl0IG91dCxcclxuICAgICAgLy8gYnV0IHRoZSBjb2RlIHRvICpkaXNhbGxvdyogc3luYyB0ZXN0cyBpbiB0aGUgcmVhbCB2ZXJzaW9uIG9mIHRoaXNcclxuICAgICAgLy8gZnVuY3Rpb24gaXMgYWN0dWFsbHkgbGFyZ2VyIHRoYW4gdGhpcy5cclxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNiKHNlbGZbdGVzdF0pO1xyXG4gICAgICB9LCAwKTtcclxuICAgIH0sXHJcblxyXG4gICAgYWRkVGVzdDogZnVuY3Rpb24obmFtZSwgZm4sIG9wdGlvbnMpIHtcclxuICAgICAgdGVzdHMucHVzaCh7bmFtZTogbmFtZSwgZm46IGZuLCBvcHRpb25zOiBvcHRpb25zfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGFkZEFzeW5jVGVzdDogZnVuY3Rpb24oZm4pIHtcclxuICAgICAgdGVzdHMucHVzaCh7bmFtZTogbnVsbCwgZm46IGZufSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcblxyXG5cclxuICAvLyBGYWtlIHNvbWUgb2YgT2JqZWN0LmNyZWF0ZSBzbyB3ZSBjYW4gZm9yY2Ugbm9uIHRlc3QgcmVzdWx0cyB0byBiZSBub24gXCJvd25cIiBwcm9wZXJ0aWVzLlxyXG4gIHZhciBNb2Rlcm5penIgPSBmdW5jdGlvbigpIHt9O1xyXG4gIE1vZGVybml6ci5wcm90b3R5cGUgPSBNb2Rlcm5penJQcm90bztcclxuXHJcbiAgLy8gTGVhayBtb2Rlcm5penIgZ2xvYmFsbHkgd2hlbiB5b3UgYHJlcXVpcmVgIGl0IHJhdGhlciB0aGFuIGZvcmNlIGl0IGhlcmUuXHJcbiAgLy8gT3ZlcndyaXRlIG5hbWUgc28gY29uc3RydWN0b3IgbmFtZSBpcyBuaWNlciA6RFxyXG4gIE1vZGVybml6ciA9IG5ldyBNb2Rlcm5penIoKTtcclxuXHJcblxyXG4vKiFcclxue1xyXG4gIFwibmFtZVwiOiBcIlNWR1wiLFxyXG4gIFwicHJvcGVydHlcIjogXCJzdmdcIixcclxuICBcImNhbml1c2VcIjogXCJzdmdcIixcclxuICBcInRhZ3NcIjogW1wic3ZnXCJdLFxyXG4gIFwiYXV0aG9yc1wiOiBbXCJFcmlrIERhaGxzdHJvbVwiXSxcclxuICBcInBvbHlmaWxsc1wiOiBbXHJcbiAgICBcInN2Z3dlYlwiLFxyXG4gICAgXCJyYXBoYWVsXCIsXHJcbiAgICBcImFtcGxlc2RrXCIsXHJcbiAgICBcImNhbnZnXCIsXHJcbiAgICBcInN2Zy1ib2lsZXJwbGF0ZVwiLFxyXG4gICAgXCJzaWVcIixcclxuICAgIFwiZG9qb2dmeFwiLFxyXG4gICAgXCJmYWJyaWNqc1wiXHJcbiAgXVxyXG59XHJcbiEqL1xyXG4vKiBET0NcclxuRGV0ZWN0cyBzdXBwb3J0IGZvciBTVkcgaW4gYDxlbWJlZD5gIG9yIGA8b2JqZWN0PmAgZWxlbWVudHMuXHJcbiovXHJcblxyXG4gIE1vZGVybml6ci5hZGRUZXN0KCdzdmcnLCAhIWRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyAmJiAhIWRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3ZnJykuY3JlYXRlU1ZHUmVjdCk7XHJcblxyXG5cclxuICAvKipcclxuICAgKiBpcyByZXR1cm5zIGEgYm9vbGVhbiBpZiB0aGUgdHlwZW9mIGFuIG9iaiBpcyBleGFjdGx5IHR5cGUuXHJcbiAgICpcclxuICAgKiBAYWNjZXNzIHByaXZhdGVcclxuICAgKiBAZnVuY3Rpb24gaXNcclxuICAgKiBAcGFyYW0geyp9IG9iaiAtIEEgdGhpbmcgd2Ugd2FudCB0byBjaGVjayB0aGUgdHlwZSBvZlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIC0gQSBzdHJpbmcgdG8gY29tcGFyZSB0aGUgdHlwZW9mIGFnYWluc3RcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgKi9cclxuXHJcbiAgZnVuY3Rpb24gaXMob2JqLCB0eXBlKSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gdHlwZTtcclxuICB9XHJcbiAgO1xyXG5cclxuICAvKipcclxuICAgKiBSdW4gdGhyb3VnaCBhbGwgdGVzdHMgYW5kIGRldGVjdCB0aGVpciBzdXBwb3J0IGluIHRoZSBjdXJyZW50IFVBLlxyXG4gICAqXHJcbiAgICogQGFjY2VzcyBwcml2YXRlXHJcbiAgICovXHJcblxyXG4gIGZ1bmN0aW9uIHRlc3RSdW5uZXIoKSB7XHJcbiAgICB2YXIgZmVhdHVyZU5hbWVzO1xyXG4gICAgdmFyIGZlYXR1cmU7XHJcbiAgICB2YXIgYWxpYXNJZHg7XHJcbiAgICB2YXIgcmVzdWx0O1xyXG4gICAgdmFyIG5hbWVJZHg7XHJcbiAgICB2YXIgZmVhdHVyZU5hbWU7XHJcbiAgICB2YXIgZmVhdHVyZU5hbWVTcGxpdDtcclxuXHJcbiAgICBmb3IgKHZhciBmZWF0dXJlSWR4IGluIHRlc3RzKSB7XHJcbiAgICAgIGlmICh0ZXN0cy5oYXNPd25Qcm9wZXJ0eShmZWF0dXJlSWR4KSkge1xyXG4gICAgICAgIGZlYXR1cmVOYW1lcyA9IFtdO1xyXG4gICAgICAgIGZlYXR1cmUgPSB0ZXN0c1tmZWF0dXJlSWR4XTtcclxuICAgICAgICAvLyBydW4gdGhlIHRlc3QsIHRocm93IHRoZSByZXR1cm4gdmFsdWUgaW50byB0aGUgTW9kZXJuaXpyLFxyXG4gICAgICAgIC8vIHRoZW4gYmFzZWQgb24gdGhhdCBib29sZWFuLCBkZWZpbmUgYW4gYXBwcm9wcmlhdGUgY2xhc3NOYW1lXHJcbiAgICAgICAgLy8gYW5kIHB1c2ggaXQgaW50byBhbiBhcnJheSBvZiBjbGFzc2VzIHdlJ2xsIGpvaW4gbGF0ZXIuXHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyBJZiB0aGVyZSBpcyBubyBuYW1lLCBpdCdzIGFuICdhc3luYycgdGVzdCB0aGF0IGlzIHJ1bixcclxuICAgICAgICAvLyBidXQgbm90IGRpcmVjdGx5IGFkZGVkIHRvIHRoZSBvYmplY3QuIFRoYXQgc2hvdWxkXHJcbiAgICAgICAgLy8gYmUgZG9uZSB3aXRoIGEgcG9zdC1ydW4gYWRkVGVzdCBjYWxsLlxyXG4gICAgICAgIGlmIChmZWF0dXJlLm5hbWUpIHtcclxuICAgICAgICAgIGZlYXR1cmVOYW1lcy5wdXNoKGZlYXR1cmUubmFtZS50b0xvd2VyQ2FzZSgpKTtcclxuXHJcbiAgICAgICAgICBpZiAoZmVhdHVyZS5vcHRpb25zICYmIGZlYXR1cmUub3B0aW9ucy5hbGlhc2VzICYmIGZlYXR1cmUub3B0aW9ucy5hbGlhc2VzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAvLyBBZGQgYWxsIHRoZSBhbGlhc2VzIGludG8gdGhlIG5hbWVzIGxpc3RcclxuICAgICAgICAgICAgZm9yIChhbGlhc0lkeCA9IDA7IGFsaWFzSWR4IDwgZmVhdHVyZS5vcHRpb25zLmFsaWFzZXMubGVuZ3RoOyBhbGlhc0lkeCsrKSB7XHJcbiAgICAgICAgICAgICAgZmVhdHVyZU5hbWVzLnB1c2goZmVhdHVyZS5vcHRpb25zLmFsaWFzZXNbYWxpYXNJZHhdLnRvTG93ZXJDYXNlKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBSdW4gdGhlIHRlc3QsIG9yIHVzZSB0aGUgcmF3IHZhbHVlIGlmIGl0J3Mgbm90IGEgZnVuY3Rpb25cclxuICAgICAgICByZXN1bHQgPSBpcyhmZWF0dXJlLmZuLCAnZnVuY3Rpb24nKSA/IGZlYXR1cmUuZm4oKSA6IGZlYXR1cmUuZm47XHJcblxyXG5cclxuICAgICAgICAvLyBTZXQgZWFjaCBvZiB0aGUgbmFtZXMgb24gdGhlIE1vZGVybml6ciBvYmplY3RcclxuICAgICAgICBmb3IgKG5hbWVJZHggPSAwOyBuYW1lSWR4IDwgZmVhdHVyZU5hbWVzLmxlbmd0aDsgbmFtZUlkeCsrKSB7XHJcbiAgICAgICAgICBmZWF0dXJlTmFtZSA9IGZlYXR1cmVOYW1lc1tuYW1lSWR4XTtcclxuICAgICAgICAgIC8vIFN1cHBvcnQgZG90IHByb3BlcnRpZXMgYXMgc3ViIHRlc3RzLiBXZSBkb24ndCBkbyBjaGVja2luZyB0byBtYWtlIHN1cmVcclxuICAgICAgICAgIC8vIHRoYXQgdGhlIGltcGxpZWQgcGFyZW50IHRlc3RzIGhhdmUgYmVlbiBhZGRlZC4gWW91IG11c3QgY2FsbCB0aGVtIGluXHJcbiAgICAgICAgICAvLyBvcmRlciAoZWl0aGVyIGluIHRoZSB0ZXN0LCBvciBtYWtlIHRoZSBwYXJlbnQgdGVzdCBhIGRlcGVuZGVuY3kpLlxyXG4gICAgICAgICAgLy9cclxuICAgICAgICAgIC8vIENhcCBpdCB0byBUV08gdG8gbWFrZSB0aGUgbG9naWMgc2ltcGxlIGFuZCBiZWNhdXNlIHdobyBuZWVkcyB0aGF0IGtpbmQgb2Ygc3VidGVzdGluZ1xyXG4gICAgICAgICAgLy8gaGFzaHRhZyBmYW1vdXMgbGFzdCB3b3Jkc1xyXG4gICAgICAgICAgZmVhdHVyZU5hbWVTcGxpdCA9IGZlYXR1cmVOYW1lLnNwbGl0KCcuJyk7XHJcblxyXG4gICAgICAgICAgaWYgKGZlYXR1cmVOYW1lU3BsaXQubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgIE1vZGVybml6cltmZWF0dXJlTmFtZVNwbGl0WzBdXSA9IHJlc3VsdDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGNhc3QgdG8gYSBCb29sZWFuLCBpZiBub3Qgb25lIGFscmVhZHlcclxuICAgICAgICAgICAgLyoganNoaW50IC1XMDUzICovXHJcbiAgICAgICAgICAgIGlmIChNb2Rlcm5penJbZmVhdHVyZU5hbWVTcGxpdFswXV0gJiYgIShNb2Rlcm5penJbZmVhdHVyZU5hbWVTcGxpdFswXV0gaW5zdGFuY2VvZiBCb29sZWFuKSkge1xyXG4gICAgICAgICAgICAgIE1vZGVybml6cltmZWF0dXJlTmFtZVNwbGl0WzBdXSA9IG5ldyBCb29sZWFuKE1vZGVybml6cltmZWF0dXJlTmFtZVNwbGl0WzBdXSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIE1vZGVybml6cltmZWF0dXJlTmFtZVNwbGl0WzBdXVtmZWF0dXJlTmFtZVNwbGl0WzFdXSA9IHJlc3VsdDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBjbGFzc2VzLnB1c2goKHJlc3VsdCA/ICcnIDogJ25vLScpICsgZmVhdHVyZU5hbWVTcGxpdC5qb2luKCctJykpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICA7XHJcblxyXG4gIC8qKlxyXG4gICAqIGRvY0VsZW1lbnQgaXMgYSBjb252ZW5pZW5jZSB3cmFwcGVyIHRvIGdyYWIgdGhlIHJvb3QgZWxlbWVudCBvZiB0aGUgZG9jdW1lbnRcclxuICAgKlxyXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxyXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudHxTVkdFbGVtZW50fSBUaGUgcm9vdCBlbGVtZW50IG9mIHRoZSBkb2N1bWVudFxyXG4gICAqL1xyXG5cclxuICB2YXIgZG9jRWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIEEgY29udmVuaWVuY2UgaGVscGVyIHRvIGNoZWNrIGlmIHRoZSBkb2N1bWVudCB3ZSBhcmUgcnVubmluZyBpbiBpcyBhbiBTVkcgZG9jdW1lbnRcclxuICAgKlxyXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAqL1xyXG5cclxuICB2YXIgaXNTVkcgPSBkb2NFbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzdmcnO1xyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogc2V0Q2xhc3NlcyB0YWtlcyBhbiBhcnJheSBvZiBjbGFzcyBuYW1lcyBhbmQgYWRkcyB0aGVtIHRvIHRoZSByb290IGVsZW1lbnRcclxuICAgKlxyXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxyXG4gICAqIEBmdW5jdGlvbiBzZXRDbGFzc2VzXHJcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gY2xhc3NlcyAtIEFycmF5IG9mIGNsYXNzIG5hbWVzXHJcbiAgICovXHJcblxyXG4gIC8vIFBhc3MgaW4gYW4gYW5kIGFycmF5IG9mIGNsYXNzIG5hbWVzLCBlLmcuOlxyXG4gIC8vICBbJ25vLXdlYnAnLCAnYm9yZGVycmFkaXVzJywgLi4uXVxyXG4gIGZ1bmN0aW9uIHNldENsYXNzZXMoY2xhc3Nlcykge1xyXG4gICAgdmFyIGNsYXNzTmFtZSA9IGRvY0VsZW1lbnQuY2xhc3NOYW1lO1xyXG4gICAgdmFyIGNsYXNzUHJlZml4ID0gTW9kZXJuaXpyLl9jb25maWcuY2xhc3NQcmVmaXggfHwgJyc7XHJcblxyXG4gICAgaWYgKGlzU1ZHKSB7XHJcbiAgICAgIGNsYXNzTmFtZSA9IGNsYXNzTmFtZS5iYXNlVmFsO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENoYW5nZSBgbm8tanNgIHRvIGBqc2AgKGluZGVwZW5kZW50bHkgb2YgdGhlIGBlbmFibGVDbGFzc2VzYCBvcHRpb24pXHJcbiAgICAvLyBIYW5kbGUgY2xhc3NQcmVmaXggb24gdGhpcyB0b29cclxuICAgIGlmIChNb2Rlcm5penIuX2NvbmZpZy5lbmFibGVKU0NsYXNzKSB7XHJcbiAgICAgIHZhciByZUpTID0gbmV3IFJlZ0V4cCgnKF58XFxcXHMpJyArIGNsYXNzUHJlZml4ICsgJ25vLWpzKFxcXFxzfCQpJyk7XHJcbiAgICAgIGNsYXNzTmFtZSA9IGNsYXNzTmFtZS5yZXBsYWNlKHJlSlMsICckMScgKyBjbGFzc1ByZWZpeCArICdqcyQyJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKE1vZGVybml6ci5fY29uZmlnLmVuYWJsZUNsYXNzZXMpIHtcclxuICAgICAgLy8gQWRkIHRoZSBuZXcgY2xhc3Nlc1xyXG4gICAgICBjbGFzc05hbWUgKz0gJyAnICsgY2xhc3NQcmVmaXggKyBjbGFzc2VzLmpvaW4oJyAnICsgY2xhc3NQcmVmaXgpO1xyXG4gICAgICBpc1NWRyA/IGRvY0VsZW1lbnQuY2xhc3NOYW1lLmJhc2VWYWwgPSBjbGFzc05hbWUgOiBkb2NFbGVtZW50LmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICA7XHJcblxyXG4gIC8qKlxyXG4gICAqIExpc3Qgb2YgcHJvcGVydHkgdmFsdWVzIHRvIHNldCBmb3IgY3NzIHRlc3RzLiBTZWUgdGlja2V0ICMyMVxyXG4gICAqIGh0dHA6Ly9naXQuaW8vdlVHbDRcclxuICAgKlxyXG4gICAqIEBtZW1iZXJvZiBNb2Rlcm5penJcclxuICAgKiBAbmFtZSBNb2Rlcm5penIuX3ByZWZpeGVzXHJcbiAgICogQG9wdGlvbk5hbWUgTW9kZXJuaXpyLl9wcmVmaXhlc1xyXG4gICAqIEBvcHRpb25Qcm9wIHByZWZpeGVzXHJcbiAgICogQGFjY2VzcyBwdWJsaWNcclxuICAgKiBAZXhhbXBsZVxyXG4gICAqXHJcbiAgICogTW9kZXJuaXpyLl9wcmVmaXhlcyBpcyB0aGUgaW50ZXJuYWwgbGlzdCBvZiBwcmVmaXhlcyB0aGF0IHdlIHRlc3QgYWdhaW5zdFxyXG4gICAqIGluc2lkZSBvZiB0aGluZ3MgbGlrZSBbcHJlZml4ZWRdKCNtb2Rlcm5penItcHJlZml4ZWQpIGFuZCBbcHJlZml4ZWRDU1NdKCMtY29kZS1tb2Rlcm5penItcHJlZml4ZWRjc3MpLiBJdCBpcyBzaW1wbHlcclxuICAgKiBhbiBhcnJheSBvZiBrZWJhYi1jYXNlIHZlbmRvciBwcmVmaXhlcyB5b3UgY2FuIHVzZSB3aXRoaW4geW91ciBjb2RlLlxyXG4gICAqXHJcbiAgICogU29tZSBjb21tb24gdXNlIGNhc2VzIGluY2x1ZGVcclxuICAgKlxyXG4gICAqIEdlbmVyYXRpbmcgYWxsIHBvc3NpYmxlIHByZWZpeGVkIHZlcnNpb24gb2YgYSBDU1MgcHJvcGVydHlcclxuICAgKiBgYGBqc1xyXG4gICAqIHZhciBydWxlID0gTW9kZXJuaXpyLl9wcmVmaXhlcy5qb2luKCd0cmFuc2Zvcm06IHJvdGF0ZSgyMGRlZyk7ICcpO1xyXG4gICAqXHJcbiAgICogcnVsZSA9PT0gJ3RyYW5zZm9ybTogcm90YXRlKDIwZGVnKTsgd2Via2l0LXRyYW5zZm9ybTogcm90YXRlKDIwZGVnKTsgbW96LXRyYW5zZm9ybTogcm90YXRlKDIwZGVnKTsgby10cmFuc2Zvcm06IHJvdGF0ZSgyMGRlZyk7IG1zLXRyYW5zZm9ybTogcm90YXRlKDIwZGVnKTsnXHJcbiAgICogYGBgXHJcbiAgICpcclxuICAgKiBHZW5lcmF0aW5nIGFsbCBwb3NzaWJsZSBwcmVmaXhlZCB2ZXJzaW9uIG9mIGEgQ1NTIHZhbHVlXHJcbiAgICogYGBganNcclxuICAgKiBydWxlID0gJ2Rpc3BsYXk6JyArICBNb2Rlcm5penIuX3ByZWZpeGVzLmpvaW4oJ2ZsZXg7IGRpc3BsYXk6JykgKyAnZmxleCc7XHJcbiAgICpcclxuICAgKiBydWxlID09PSAnZGlzcGxheTpmbGV4OyBkaXNwbGF5Oi13ZWJraXQtZmxleDsgZGlzcGxheTotbW96LWZsZXg7IGRpc3BsYXk6LW8tZmxleDsgZGlzcGxheTotbXMtZmxleDsgZGlzcGxheTpmbGV4J1xyXG4gICAqIGBgYFxyXG4gICAqL1xyXG5cclxuICB2YXIgcHJlZml4ZXMgPSAoTW9kZXJuaXpyUHJvdG8uX2NvbmZpZy51c2VQcmVmaXhlcyA/ICcgLXdlYmtpdC0gLW1vei0gLW8tIC1tcy0gJy5zcGxpdCgnICcpIDogW10pO1xyXG5cclxuICAvLyBleHBvc2UgdGhlc2UgZm9yIHRoZSBwbHVnaW4gQVBJLiBMb29rIGluIHRoZSBzb3VyY2UgZm9yIGhvdyB0byBqb2luKCkgdGhlbSBhZ2FpbnN0IHlvdXIgaW5wdXRcclxuICBNb2Rlcm5penJQcm90by5fcHJlZml4ZXMgPSBwcmVmaXhlcztcclxuXHJcblxyXG5cclxuICAvKipcclxuICAgKiBjcmVhdGVFbGVtZW50IGlzIGEgY29udmVuaWVuY2Ugd3JhcHBlciBhcm91bmQgZG9jdW1lbnQuY3JlYXRlRWxlbWVudC4gU2luY2Ugd2VcclxuICAgKiB1c2UgY3JlYXRlRWxlbWVudCBhbGwgb3ZlciB0aGUgcGxhY2UsIHRoaXMgYWxsb3dzIGZvciAoc2xpZ2h0bHkpIHNtYWxsZXIgY29kZVxyXG4gICAqIGFzIHdlbGwgYXMgYWJzdHJhY3RpbmcgYXdheSBpc3N1ZXMgd2l0aCBjcmVhdGluZyBlbGVtZW50cyBpbiBjb250ZXh0cyBvdGhlciB0aGFuXHJcbiAgICogSFRNTCBkb2N1bWVudHMgKGUuZy4gU1ZHIGRvY3VtZW50cykuXHJcbiAgICpcclxuICAgKiBAYWNjZXNzIHByaXZhdGVcclxuICAgKiBAZnVuY3Rpb24gY3JlYXRlRWxlbWVudFxyXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudHxTVkdFbGVtZW50fSBBbiBIVE1MIG9yIFNWRyBlbGVtZW50XHJcbiAgICovXHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQoKSB7XHJcbiAgICBpZiAodHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgLy8gVGhpcyBpcyB0aGUgY2FzZSBpbiBJRTcsIHdoZXJlIHRoZSB0eXBlIG9mIGNyZWF0ZUVsZW1lbnQgaXMgXCJvYmplY3RcIi5cclxuICAgICAgLy8gRm9yIHRoaXMgcmVhc29uLCB3ZSBjYW5ub3QgY2FsbCBhcHBseSgpIGFzIE9iamVjdCBpcyBub3QgYSBGdW5jdGlvbi5cclxuICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYXJndW1lbnRzWzBdKTtcclxuICAgIH0gZWxzZSBpZiAoaXNTVkcpIHtcclxuICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUy5jYWxsKGRvY3VtZW50LCAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCBhcmd1bWVudHNbMF0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQuYXBwbHkoZG9jdW1lbnQsIGFyZ3VtZW50cyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICA7XHJcbi8qIVxyXG57XHJcbiAgXCJuYW1lXCI6IFwiSFRNTDUgVmlkZW9cIixcclxuICBcInByb3BlcnR5XCI6IFwidmlkZW9cIixcclxuICBcImNhbml1c2VcIjogXCJ2aWRlb1wiLFxyXG4gIFwidGFnc1wiOiBbXCJodG1sNVwiXSxcclxuICBcImtub3duQnVnc1wiOiBbXHJcbiAgICBcIldpdGhvdXQgUXVpY2tUaW1lLCBgTW9kZXJuaXpyLnZpZGVvLmgyNjRgIHdpbGwgYmUgYHVuZGVmaW5lZGA7IGh0dHBzOi8vZ2l0aHViLmNvbS9Nb2Rlcm5penIvTW9kZXJuaXpyL2lzc3Vlcy81NDZcIlxyXG4gIF0sXHJcbiAgXCJwb2x5ZmlsbHNcIjogW1xyXG4gICAgXCJodG1sNW1lZGlhXCIsXHJcbiAgICBcIm1lZGlhZWxlbWVudGpzXCIsXHJcbiAgICBcInN1YmxpbWV2aWRlb1wiLFxyXG4gICAgXCJ2aWRlb2pzXCIsXHJcbiAgICBcImxlYW5iYWNrcGxheWVyXCIsXHJcbiAgICBcInZpZGVvZm9yZXZlcnlib2R5XCJcclxuICBdXHJcbn1cclxuISovXHJcbi8qIERPQ1xyXG5EZXRlY3RzIHN1cHBvcnQgZm9yIHRoZSB2aWRlbyBlbGVtZW50LCBhcyB3ZWxsIGFzIHRlc3Rpbmcgd2hhdCB0eXBlcyBvZiBjb250ZW50IGl0IHN1cHBvcnRzLlxyXG5cclxuU3VicHJvcGVydGllcyBhcmUgcHJvdmlkZWQgdG8gZGVzY3JpYmUgc3VwcG9ydCBmb3IgYG9nZ2AsIGBoMjY0YCBhbmQgYHdlYm1gIGZvcm1hdHMsIGUuZy46XHJcblxyXG5gYGBqYXZhc2NyaXB0XHJcbk1vZGVybml6ci52aWRlbyAgICAgICAgIC8vIHRydWVcclxuTW9kZXJuaXpyLnZpZGVvLm9nZyAgICAgLy8gJ3Byb2JhYmx5J1xyXG5gYGBcclxuKi9cclxuXHJcbiAgLy8gQ29kZWMgdmFsdWVzIGZyb20gOiBnaXRodWIuY29tL05pZWxzTGVlbmhlZXIvaHRtbDV0ZXN0L2Jsb2IvOTEwNmE4L2luZGV4Lmh0bWwjTDg0NVxyXG4gIC8vICAgICAgICAgICAgICAgICAgICAgdGh4IHRvIE5pZWxzTGVlbmhlZXIgYW5kIHpjb3JwYW5cclxuXHJcbiAgLy8gTm90ZTogaW4gc29tZSBvbGRlciBicm93c2VycywgXCJub1wiIHdhcyBhIHJldHVybiB2YWx1ZSBpbnN0ZWFkIG9mIGVtcHR5IHN0cmluZy5cclxuICAvLyAgIEl0IHdhcyBsaXZlIGluIEZGMy41LjAgYW5kIDMuNS4xLCBidXQgZml4ZWQgaW4gMy41LjJcclxuICAvLyAgIEl0IHdhcyBhbHNvIGxpdmUgaW4gU2FmYXJpIDQuMC4wIC0gNC4wLjQsIGJ1dCBmaXhlZCBpbiA0LjAuNVxyXG5cclxuICBNb2Rlcm5penIuYWRkVGVzdCgndmlkZW8nLCBmdW5jdGlvbigpIHtcclxuICAgIC8qIGpzaGludCAtVzA1MyAqL1xyXG4gICAgdmFyIGVsZW0gPSBjcmVhdGVFbGVtZW50KCd2aWRlbycpO1xyXG4gICAgdmFyIGJvb2wgPSBmYWxzZTtcclxuXHJcbiAgICAvLyBJRTkgUnVubmluZyBvbiBXaW5kb3dzIFNlcnZlciBTS1UgY2FuIGNhdXNlIGFuIGV4Y2VwdGlvbiB0byBiZSB0aHJvd24sIGJ1ZyAjMjI0XHJcbiAgICB0cnkge1xyXG4gICAgICBpZiAoYm9vbCA9ICEhZWxlbS5jYW5QbGF5VHlwZSkge1xyXG4gICAgICAgIGJvb2wgPSBuZXcgQm9vbGVhbihib29sKTtcclxuICAgICAgICBib29sLm9nZyA9IGVsZW0uY2FuUGxheVR5cGUoJ3ZpZGVvL29nZzsgY29kZWNzPVwidGhlb3JhXCInKS5yZXBsYWNlKC9ebm8kLywgJycpO1xyXG5cclxuICAgICAgICAvLyBXaXRob3V0IFF1aWNrVGltZSwgdGhpcyB2YWx1ZSB3aWxsIGJlIGB1bmRlZmluZWRgLiBnaXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvaXNzdWVzLzU0NlxyXG4gICAgICAgIGJvb2wuaDI2NCA9IGVsZW0uY2FuUGxheVR5cGUoJ3ZpZGVvL21wNDsgY29kZWNzPVwiYXZjMS40MkUwMUVcIicpLnJlcGxhY2UoL15ubyQvLCAnJyk7XHJcblxyXG4gICAgICAgIGJvb2wud2VibSA9IGVsZW0uY2FuUGxheVR5cGUoJ3ZpZGVvL3dlYm07IGNvZGVjcz1cInZwOCwgdm9yYmlzXCInKS5yZXBsYWNlKC9ebm8kLywgJycpO1xyXG5cclxuICAgICAgICBib29sLnZwOSA9IGVsZW0uY2FuUGxheVR5cGUoJ3ZpZGVvL3dlYm07IGNvZGVjcz1cInZwOVwiJykucmVwbGFjZSgvXm5vJC8sICcnKTtcclxuXHJcbiAgICAgICAgYm9vbC5obHMgPSBlbGVtLmNhblBsYXlUeXBlKCdhcHBsaWNhdGlvbi94LW1wZWdVUkw7IGNvZGVjcz1cImF2YzEuNDJFMDFFXCInKS5yZXBsYWNlKC9ebm8kLywgJycpO1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlKSB7fVxyXG5cclxuICAgIHJldHVybiBib29sO1xyXG4gIH0pO1xyXG5cclxuLyohXHJcbntcclxuICBcIm5hbWVcIjogXCJDU1MgR3JhZGllbnRzXCIsXHJcbiAgXCJjYW5pdXNlXCI6IFwiY3NzLWdyYWRpZW50c1wiLFxyXG4gIFwicHJvcGVydHlcIjogXCJjc3NncmFkaWVudHNcIixcclxuICBcInRhZ3NcIjogW1wiY3NzXCJdLFxyXG4gIFwia25vd25CdWdzXCI6IFtcIkZhbHNlLXBvc2l0aXZlcyBvbiB3ZWJPUyAoaHR0cHM6Ly9naXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvaXNzdWVzLzIwMilcIl0sXHJcbiAgXCJub3Rlc1wiOiBbe1xyXG4gICAgXCJuYW1lXCI6IFwiV2Via2l0IEdyYWRpZW50IFN5bnRheFwiLFxyXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly93ZWJraXQub3JnL2Jsb2cvMTc1L2ludHJvZHVjaW5nLWNzcy1ncmFkaWVudHMvXCJcclxuICB9LHtcclxuICAgIFwibmFtZVwiOiBcIkxpbmVhciBHcmFkaWVudCBTeW50YXhcIixcclxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0NTUy9saW5lYXItZ3JhZGllbnRcIlxyXG4gIH0se1xyXG4gICAgXCJuYW1lXCI6IFwiVzNDIEdyYWRpZW50IFNwZWNcIixcclxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vZHJhZnRzLmNzc3dnLm9yZy9jc3MtaW1hZ2VzLTMvI2dyYWRpZW50c1wiXHJcbiAgfV1cclxufVxyXG4hKi9cclxuXHJcblxyXG4gIE1vZGVybml6ci5hZGRUZXN0KCdjc3NncmFkaWVudHMnLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICB2YXIgc3RyMSA9ICdiYWNrZ3JvdW5kLWltYWdlOic7XHJcbiAgICB2YXIgc3RyMiA9ICdncmFkaWVudChsaW5lYXIsbGVmdCB0b3AscmlnaHQgYm90dG9tLGZyb20oIzlmOSksdG8od2hpdGUpKTsnO1xyXG4gICAgdmFyIGNzcyA9ICcnO1xyXG4gICAgdmFyIGFuZ2xlO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBwcmVmaXhlcy5sZW5ndGggLSAxOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgYW5nbGUgPSAoaSA9PT0gMCA/ICd0byAnIDogJycpO1xyXG4gICAgICBjc3MgKz0gc3RyMSArIHByZWZpeGVzW2ldICsgJ2xpbmVhci1ncmFkaWVudCgnICsgYW5nbGUgKyAnbGVmdCB0b3AsICM5ZjksIHdoaXRlKTsnO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChNb2Rlcm5penIuX2NvbmZpZy51c2VQcmVmaXhlcykge1xyXG4gICAgLy8gbGVnYWN5IHdlYmtpdCBzeW50YXggKEZJWE1FOiByZW1vdmUgd2hlbiBzeW50YXggbm90IGluIHVzZSBhbnltb3JlKVxyXG4gICAgICBjc3MgKz0gc3RyMSArICctd2Via2l0LScgKyBzdHIyO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBlbGVtID0gY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgdmFyIHN0eWxlID0gZWxlbS5zdHlsZTtcclxuICAgIHN0eWxlLmNzc1RleHQgPSBjc3M7XHJcblxyXG4gICAgLy8gSUU2IHJldHVybnMgdW5kZWZpbmVkIHNvIGNhc3QgdG8gc3RyaW5nXHJcbiAgICByZXR1cm4gKCcnICsgc3R5bGUuYmFja2dyb3VuZEltYWdlKS5pbmRleE9mKCdncmFkaWVudCcpID4gLTE7XHJcbiAgfSk7XHJcblxyXG5cclxuICAvKipcclxuICAgKiBnZXRCb2R5IHJldHVybnMgdGhlIGJvZHkgb2YgYSBkb2N1bWVudCwgb3IgYW4gZWxlbWVudCB0aGF0IGNhbiBzdGFuZCBpbiBmb3JcclxuICAgKiB0aGUgYm9keSBpZiBhIHJlYWwgYm9keSBkb2VzIG5vdCBleGlzdFxyXG4gICAqXHJcbiAgICogQGFjY2VzcyBwcml2YXRlXHJcbiAgICogQGZ1bmN0aW9uIGdldEJvZHlcclxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR8U1ZHRWxlbWVudH0gUmV0dXJucyB0aGUgcmVhbCBib2R5IG9mIGEgZG9jdW1lbnQsIG9yIGFuXHJcbiAgICogYXJ0aWZpY2lhbGx5IGNyZWF0ZWQgZWxlbWVudCB0aGF0IHN0YW5kcyBpbiBmb3IgdGhlIGJvZHlcclxuICAgKi9cclxuXHJcbiAgZnVuY3Rpb24gZ2V0Qm9keSgpIHtcclxuICAgIC8vIEFmdGVyIHBhZ2UgbG9hZCBpbmplY3RpbmcgYSBmYWtlIGJvZHkgZG9lc24ndCB3b3JrIHNvIGNoZWNrIGlmIGJvZHkgZXhpc3RzXHJcbiAgICB2YXIgYm9keSA9IGRvY3VtZW50LmJvZHk7XHJcblxyXG4gICAgaWYgKCFib2R5KSB7XHJcbiAgICAgIC8vIENhbid0IHVzZSB0aGUgcmVhbCBib2R5IGNyZWF0ZSBhIGZha2Ugb25lLlxyXG4gICAgICBib2R5ID0gY3JlYXRlRWxlbWVudChpc1NWRyA/ICdzdmcnIDogJ2JvZHknKTtcclxuICAgICAgYm9keS5mYWtlID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYm9keTtcclxuICB9XHJcblxyXG4gIDtcclxuXHJcbiAgLyoqXHJcbiAgICogaW5qZWN0RWxlbWVudFdpdGhTdHlsZXMgaW5qZWN0cyBhbiBlbGVtZW50IHdpdGggc3R5bGUgZWxlbWVudCBhbmQgc29tZSBDU1MgcnVsZXNcclxuICAgKlxyXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxyXG4gICAqIEBmdW5jdGlvbiBpbmplY3RFbGVtZW50V2l0aFN0eWxlc1xyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBydWxlIC0gU3RyaW5nIHJlcHJlc2VudGluZyBhIGNzcyBydWxlXHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBBIGZ1bmN0aW9uIHRoYXQgaXMgdXNlZCB0byB0ZXN0IHRoZSBpbmplY3RlZCBlbGVtZW50XHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IFtub2Rlc10gLSBBbiBpbnRlZ2VyIHJlcHJlc2VudGluZyB0aGUgbnVtYmVyIG9mIGFkZGl0aW9uYWwgbm9kZXMgeW91IHdhbnQgaW5qZWN0ZWRcclxuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBbdGVzdG5hbWVzXSAtIEFuIGFycmF5IG9mIHN0cmluZ3MgdGhhdCBhcmUgdXNlZCBhcyBpZHMgZm9yIHRoZSBhZGRpdGlvbmFsIG5vZGVzXHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICovXHJcblxyXG4gIGZ1bmN0aW9uIGluamVjdEVsZW1lbnRXaXRoU3R5bGVzKHJ1bGUsIGNhbGxiYWNrLCBub2RlcywgdGVzdG5hbWVzKSB7XHJcbiAgICB2YXIgbW9kID0gJ21vZGVybml6cic7XHJcbiAgICB2YXIgc3R5bGU7XHJcbiAgICB2YXIgcmV0O1xyXG4gICAgdmFyIG5vZGU7XHJcbiAgICB2YXIgZG9jT3ZlcmZsb3c7XHJcbiAgICB2YXIgZGl2ID0gY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB2YXIgYm9keSA9IGdldEJvZHkoKTtcclxuXHJcbiAgICBpZiAocGFyc2VJbnQobm9kZXMsIDEwKSkge1xyXG4gICAgICAvLyBJbiBvcmRlciBub3QgdG8gZ2l2ZSBmYWxzZSBwb3NpdGl2ZXMgd2UgY3JlYXRlIGEgbm9kZSBmb3IgZWFjaCB0ZXN0XHJcbiAgICAgIC8vIFRoaXMgYWxzbyBhbGxvd3MgdGhlIG1ldGhvZCB0byBzY2FsZSBmb3IgdW5zcGVjaWZpZWQgdXNlc1xyXG4gICAgICB3aGlsZSAobm9kZXMtLSkge1xyXG4gICAgICAgIG5vZGUgPSBjcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBub2RlLmlkID0gdGVzdG5hbWVzID8gdGVzdG5hbWVzW25vZGVzXSA6IG1vZCArIChub2RlcyArIDEpO1xyXG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChub2RlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0eWxlID0gY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcclxuICAgIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xyXG4gICAgc3R5bGUuaWQgPSAncycgKyBtb2Q7XHJcblxyXG4gICAgLy8gSUU2IHdpbGwgZmFsc2UgcG9zaXRpdmUgb24gc29tZSB0ZXN0cyBkdWUgdG8gdGhlIHN0eWxlIGVsZW1lbnQgaW5zaWRlIHRoZSB0ZXN0IGRpdiBzb21laG93IGludGVyZmVyaW5nIG9mZnNldEhlaWdodCwgc28gaW5zZXJ0IGl0IGludG8gYm9keSBvciBmYWtlYm9keS5cclxuICAgIC8vIE9wZXJhIHdpbGwgYWN0IGFsbCBxdWlya3kgd2hlbiBpbmplY3RpbmcgZWxlbWVudHMgaW4gZG9jdW1lbnRFbGVtZW50IHdoZW4gcGFnZSBpcyBzZXJ2ZWQgYXMgeG1sLCBuZWVkcyBmYWtlYm9keSB0b28uICMyNzBcclxuICAgICghYm9keS5mYWtlID8gZGl2IDogYm9keSkuYXBwZW5kQ2hpbGQoc3R5bGUpO1xyXG4gICAgYm9keS5hcHBlbmRDaGlsZChkaXYpO1xyXG5cclxuICAgIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XHJcbiAgICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IHJ1bGU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShydWxlKSk7XHJcbiAgICB9XHJcbiAgICBkaXYuaWQgPSBtb2Q7XHJcblxyXG4gICAgaWYgKGJvZHkuZmFrZSkge1xyXG4gICAgICAvL2F2b2lkIGNyYXNoaW5nIElFOCwgaWYgYmFja2dyb3VuZCBpbWFnZSBpcyB1c2VkXHJcbiAgICAgIGJvZHkuc3R5bGUuYmFja2dyb3VuZCA9ICcnO1xyXG4gICAgICAvL1NhZmFyaSA1LjEzLzUuMS40IE9TWCBzdG9wcyBsb2FkaW5nIGlmIDo6LXdlYmtpdC1zY3JvbGxiYXIgaXMgdXNlZCBhbmQgc2Nyb2xsYmFycyBhcmUgdmlzaWJsZVxyXG4gICAgICBib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XHJcbiAgICAgIGRvY092ZXJmbG93ID0gZG9jRWxlbWVudC5zdHlsZS5vdmVyZmxvdztcclxuICAgICAgZG9jRWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xyXG4gICAgICBkb2NFbGVtZW50LmFwcGVuZENoaWxkKGJvZHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldCA9IGNhbGxiYWNrKGRpdiwgcnVsZSk7XHJcbiAgICAvLyBJZiB0aGlzIGlzIGRvbmUgYWZ0ZXIgcGFnZSBsb2FkIHdlIGRvbid0IHdhbnQgdG8gcmVtb3ZlIHRoZSBib2R5IHNvIGNoZWNrIGlmIGJvZHkgZXhpc3RzXHJcbiAgICBpZiAoYm9keS5mYWtlKSB7XHJcbiAgICAgIGJvZHkucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChib2R5KTtcclxuICAgICAgZG9jRWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9IGRvY092ZXJmbG93O1xyXG4gICAgICAvLyBUcmlnZ2VyIGxheW91dCBzbyBraW5ldGljIHNjcm9sbGluZyBpc24ndCBkaXNhYmxlZCBpbiBpT1M2K1xyXG4gICAgICBkb2NFbGVtZW50Lm9mZnNldEhlaWdodDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRpdi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRpdik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuICEhcmV0O1xyXG5cclxuICB9XHJcblxyXG4gIDtcclxuXHJcbiAgLyoqXHJcbiAgICogdGVzdFN0eWxlcyBpbmplY3RzIGFuIGVsZW1lbnQgd2l0aCBzdHlsZSBlbGVtZW50IGFuZCBzb21lIENTUyBydWxlc1xyXG4gICAqXHJcbiAgICogQG1lbWJlcm9mIE1vZGVybml6clxyXG4gICAqIEBuYW1lIE1vZGVybml6ci50ZXN0U3R5bGVzXHJcbiAgICogQG9wdGlvbk5hbWUgTW9kZXJuaXpyLnRlc3RTdHlsZXMoKVxyXG4gICAqIEBvcHRpb25Qcm9wIHRlc3RTdHlsZXNcclxuICAgKiBAYWNjZXNzIHB1YmxpY1xyXG4gICAqIEBmdW5jdGlvbiB0ZXN0U3R5bGVzXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJ1bGUgLSBTdHJpbmcgcmVwcmVzZW50aW5nIGEgY3NzIHJ1bGVcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIEEgZnVuY3Rpb24gdGhhdCBpcyB1c2VkIHRvIHRlc3QgdGhlIGluamVjdGVkIGVsZW1lbnRcclxuICAgKiBAcGFyYW0ge251bWJlcn0gW25vZGVzXSAtIEFuIGludGVnZXIgcmVwcmVzZW50aW5nIHRoZSBudW1iZXIgb2YgYWRkaXRpb25hbCBub2RlcyB5b3Ugd2FudCBpbmplY3RlZFxyXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IFt0ZXN0bmFtZXNdIC0gQW4gYXJyYXkgb2Ygc3RyaW5ncyB0aGF0IGFyZSB1c2VkIGFzIGlkcyBmb3IgdGhlIGFkZGl0aW9uYWwgbm9kZXNcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgKiBAZXhhbXBsZVxyXG4gICAqXHJcbiAgICogYE1vZGVybml6ci50ZXN0U3R5bGVzYCB0YWtlcyBhIENTUyBydWxlIGFuZCBpbmplY3RzIGl0IG9udG8gdGhlIGN1cnJlbnQgcGFnZVxyXG4gICAqIGFsb25nIHdpdGggKHBvc3NpYmx5IG11bHRpcGxlKSBET00gZWxlbWVudHMuIFRoaXMgbGV0cyB5b3UgY2hlY2sgZm9yIGZlYXR1cmVzXHJcbiAgICogdGhhdCBjYW4gbm90IGJlIGRldGVjdGVkIGJ5IHNpbXBseSBjaGVja2luZyB0aGUgW0lETF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9Nb3ppbGxhL0RldmVsb3Blcl9ndWlkZS9JbnRlcmZhY2VfZGV2ZWxvcG1lbnRfZ3VpZGUvSURMX2ludGVyZmFjZV9ydWxlcykuXHJcbiAgICpcclxuICAgKiBgYGBqc1xyXG4gICAqIE1vZGVybml6ci50ZXN0U3R5bGVzKCcjbW9kZXJuaXpyIHsgd2lkdGg6IDlweDsgY29sb3I6IHBhcGF5YXdoaXA7IH0nLCBmdW5jdGlvbihlbGVtLCBydWxlKSB7XHJcbiAgICogICAvLyBlbGVtIGlzIHRoZSBmaXJzdCBET00gbm9kZSBpbiB0aGUgcGFnZSAoYnkgZGVmYXVsdCAjbW9kZXJuaXpyKVxyXG4gICAqICAgLy8gcnVsZSBpcyB0aGUgZmlyc3QgYXJndW1lbnQgeW91IHN1cHBsaWVkIC0gdGhlIENTUyBydWxlIGluIHN0cmluZyBmb3JtXHJcbiAgICpcclxuICAgKiAgIGFkZFRlc3QoJ3dpZHRod29ya3MnLCBlbGVtLnN0eWxlLndpZHRoID09PSAnOXB4JylcclxuICAgKiB9KTtcclxuICAgKiBgYGBcclxuICAgKlxyXG4gICAqIElmIHlvdXIgdGVzdCByZXF1aXJlcyBtdWx0aXBsZSBub2RlcywgeW91IGNhbiBpbmNsdWRlIGEgdGhpcmQgYXJndW1lbnRcclxuICAgKiBpbmRpY2F0aW5nIGhvdyBtYW55IGFkZGl0aW9uYWwgZGl2IGVsZW1lbnRzIHRvIGluY2x1ZGUgb24gdGhlIHBhZ2UuIFRoZVxyXG4gICAqIGFkZGl0aW9uYWwgbm9kZXMgYXJlIGluamVjdGVkIGFzIGNoaWxkcmVuIG9mIHRoZSBgZWxlbWAgdGhhdCBpcyByZXR1cm5lZCBhc1xyXG4gICAqIHRoZSBmaXJzdCBhcmd1bWVudCB0byB0aGUgY2FsbGJhY2suXHJcbiAgICpcclxuICAgKiBgYGBqc1xyXG4gICAqIE1vZGVybml6ci50ZXN0U3R5bGVzKCcjbW9kZXJuaXpyIHt3aWR0aDogMXB4fTsgI21vZGVybml6cjIge3dpZHRoOiAycHh9JywgZnVuY3Rpb24oZWxlbSkge1xyXG4gICAqICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGVybml6cicpLnN0eWxlLndpZHRoID09PSAnMXB4JzsgLy8gdHJ1ZVxyXG4gICAqICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGVybml6cjInKS5zdHlsZS53aWR0aCA9PT0gJzJweCc7IC8vIHRydWVcclxuICAgKiAgIGVsZW0uZmlyc3RDaGlsZCA9PT0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGVybml6cjInKTsgLy8gdHJ1ZVxyXG4gICAqIH0sIDEpO1xyXG4gICAqIGBgYFxyXG4gICAqXHJcbiAgICogQnkgZGVmYXVsdCwgYWxsIG9mIHRoZSBhZGRpdGlvbmFsIGVsZW1lbnRzIGhhdmUgYW4gSUQgb2YgYG1vZGVybml6cltuXWAsIHdoZXJlXHJcbiAgICogYG5gIGlzIGl0cyBpbmRleCAoZS5nLiB0aGUgZmlyc3QgYWRkaXRpb25hbCwgc2Vjb25kIG92ZXJhbGwgaXMgYCNtb2Rlcm5penIyYCxcclxuICAgKiB0aGUgc2Vjb25kIGFkZGl0aW9uYWwgaXMgYCNtb2Rlcm5penIzYCwgZXRjLikuXHJcbiAgICogSWYgeW91IHdhbnQgdG8gaGF2ZSBtb3JlIG1lYW5pbmdmdWwgSURzIGZvciB5b3VyIGZ1bmN0aW9uLCB5b3UgY2FuIHByb3ZpZGVcclxuICAgKiB0aGVtIGFzIHRoZSBmb3VydGggYXJndW1lbnQsIGFzIGFuIGFycmF5IG9mIHN0cmluZ3NcclxuICAgKlxyXG4gICAqIGBgYGpzXHJcbiAgICogTW9kZXJuaXpyLnRlc3RTdHlsZXMoJyNmb28ge3dpZHRoOiAxMHB4fTsgI2JhciB7aGVpZ2h0OiAyMHB4fScsIGZ1bmN0aW9uKGVsZW0pIHtcclxuICAgKiAgIGVsZW0uZmlyc3RDaGlsZCA9PT0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZvbycpOyAvLyB0cnVlXHJcbiAgICogICBlbGVtLmxhc3RDaGlsZCA9PT0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhcicpOyAvLyB0cnVlXHJcbiAgICogfSwgMiwgWydmb28nLCAnYmFyJ10pO1xyXG4gICAqIGBgYFxyXG4gICAqXHJcbiAgICovXHJcblxyXG4gIHZhciB0ZXN0U3R5bGVzID0gTW9kZXJuaXpyUHJvdG8udGVzdFN0eWxlcyA9IGluamVjdEVsZW1lbnRXaXRoU3R5bGVzO1xyXG5cclxuLyohXHJcbntcclxuICBcIm5hbWVcIjogXCJUb3VjaCBFdmVudHNcIixcclxuICBcInByb3BlcnR5XCI6IFwidG91Y2hldmVudHNcIixcclxuICBcImNhbml1c2VcIiA6IFwidG91Y2hcIixcclxuICBcInRhZ3NcIjogW1wibWVkaWFcIiwgXCJhdHRyaWJ1dGVcIl0sXHJcbiAgXCJub3Rlc1wiOiBbe1xyXG4gICAgXCJuYW1lXCI6IFwiVG91Y2ggRXZlbnRzIHNwZWNcIixcclxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vd3d3LnczLm9yZy9UUi8yMDEzL1dELXRvdWNoLWV2ZW50cy0yMDEzMDEyNC9cIlxyXG4gIH1dLFxyXG4gIFwid2FybmluZ3NcIjogW1xyXG4gICAgXCJJbmRpY2F0ZXMgaWYgdGhlIGJyb3dzZXIgc3VwcG9ydHMgdGhlIFRvdWNoIEV2ZW50cyBzcGVjLCBhbmQgZG9lcyBub3QgbmVjZXNzYXJpbHkgcmVmbGVjdCBhIHRvdWNoc2NyZWVuIGRldmljZVwiXHJcbiAgXSxcclxuICBcImtub3duQnVnc1wiOiBbXHJcbiAgICBcIkZhbHNlLXBvc2l0aXZlIG9uIHNvbWUgY29uZmlndXJhdGlvbnMgb2YgTm9raWEgTjkwMFwiLFxyXG4gICAgXCJGYWxzZS1wb3NpdGl2ZSBvbiBzb21lIEJsYWNrQmVycnkgNi4wIGJ1aWxkcyDigJMgaHR0cHM6Ly9naXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvaXNzdWVzLzM3MiNpc3N1ZWNvbW1lbnQtMzExMjY5NVwiXHJcbiAgXVxyXG59XHJcbiEqL1xyXG4vKiBET0NcclxuSW5kaWNhdGVzIGlmIHRoZSBicm93c2VyIHN1cHBvcnRzIHRoZSBXM0MgVG91Y2ggRXZlbnRzIEFQSS5cclxuXHJcblRoaXMgKmRvZXMgbm90KiBuZWNlc3NhcmlseSByZWZsZWN0IGEgdG91Y2hzY3JlZW4gZGV2aWNlOlxyXG5cclxuKiBPbGRlciB0b3VjaHNjcmVlbiBkZXZpY2VzIG9ubHkgZW11bGF0ZSBtb3VzZSBldmVudHNcclxuKiBNb2Rlcm4gSUUgdG91Y2ggZGV2aWNlcyBpbXBsZW1lbnQgdGhlIFBvaW50ZXIgRXZlbnRzIEFQSSBpbnN0ZWFkOiB1c2UgYE1vZGVybml6ci5wb2ludGVyZXZlbnRzYCB0byBkZXRlY3Qgc3VwcG9ydCBmb3IgdGhhdFxyXG4qIFNvbWUgYnJvd3NlcnMgJiBPUyBzZXR1cHMgbWF5IGVuYWJsZSB0b3VjaCBBUElzIHdoZW4gbm8gdG91Y2hzY3JlZW4gaXMgY29ubmVjdGVkXHJcbiogRnV0dXJlIGJyb3dzZXJzIG1heSBpbXBsZW1lbnQgb3RoZXIgZXZlbnQgbW9kZWxzIGZvciB0b3VjaCBpbnRlcmFjdGlvbnNcclxuXHJcblNlZSB0aGlzIGFydGljbGU6IFtZb3UgQ2FuJ3QgRGV0ZWN0IEEgVG91Y2hzY3JlZW5dKGh0dHA6Ly93d3cuc3R1Y294LmNvbS9ibG9nL3lvdS1jYW50LWRldGVjdC1hLXRvdWNoc2NyZWVuLykuXHJcblxyXG5JdCdzIHJlY29tbWVuZGVkIHRvIGJpbmQgYm90aCBtb3VzZSBhbmQgdG91Y2gvcG9pbnRlciBldmVudHMgc2ltdWx0YW5lb3VzbHkg4oCTIHNlZSBbdGhpcyBIVE1MNSBSb2NrcyB0dXRvcmlhbF0oaHR0cDovL3d3dy5odG1sNXJvY2tzLmNvbS9lbi9tb2JpbGUvdG91Y2hhbmRtb3VzZS8pLlxyXG5cclxuVGhpcyB0ZXN0IHdpbGwgYWxzbyByZXR1cm4gYHRydWVgIGZvciBGaXJlZm94IDQgTXVsdGl0b3VjaCBzdXBwb3J0LlxyXG4qL1xyXG5cclxuICAvLyBDaHJvbWUgKGRlc2t0b3ApIHVzZWQgdG8gbGllIGFib3V0IGl0cyBzdXBwb3J0IG9uIHRoaXMsIGJ1dCB0aGF0IGhhcyBzaW5jZSBiZWVuIHJlY3RpZmllZDogaHR0cDovL2NyYnVnLmNvbS8zNjQxNVxyXG4gIE1vZGVybml6ci5hZGRUZXN0KCd0b3VjaGV2ZW50cycsIGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGJvb2w7XHJcbiAgICBpZiAoKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdykgfHwgd2luZG93LkRvY3VtZW50VG91Y2ggJiYgZG9jdW1lbnQgaW5zdGFuY2VvZiBEb2N1bWVudFRvdWNoKSB7XHJcbiAgICAgIGJvb2wgPSB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gaW5jbHVkZSB0aGUgJ2hlYXJ0eicgYXMgYSB3YXkgdG8gaGF2ZSBhIG5vbiBtYXRjaGluZyBNUSB0byBoZWxwIHRlcm1pbmF0ZSB0aGUgam9pblxyXG4gICAgICAvLyBodHRwczovL2dpdC5pby92em5GSFxyXG4gICAgICB2YXIgcXVlcnkgPSBbJ0BtZWRpYSAoJywgcHJlZml4ZXMuam9pbigndG91Y2gtZW5hYmxlZCksKCcpLCAnaGVhcnR6JywgJyknLCAneyNtb2Rlcm5penJ7dG9wOjlweDtwb3NpdGlvbjphYnNvbHV0ZX19J10uam9pbignJyk7XHJcbiAgICAgIHRlc3RTdHlsZXMocXVlcnksIGZ1bmN0aW9uKG5vZGUpIHtcclxuICAgICAgICBib29sID0gbm9kZS5vZmZzZXRUb3AgPT09IDk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJvb2w7XHJcbiAgfSk7XHJcblxyXG5cclxuICAvKipcclxuICAgKiBNb2Rlcm5penIubXEgdGVzdHMgYSBnaXZlbiBtZWRpYSBxdWVyeSwgbGl2ZSBhZ2FpbnN0IHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSB3aW5kb3dcclxuICAgKiBhZGFwdGVkIGZyb20gbWF0Y2hNZWRpYSBwb2x5ZmlsbCBieSBTY290dCBKZWhsIGFuZCBQYXVsIElyaXNoXHJcbiAgICogZ2lzdC5naXRodWIuY29tLzc4Njc2OFxyXG4gICAqXHJcbiAgICogQG1lbWJlcm9mIE1vZGVybml6clxyXG4gICAqIEBuYW1lIE1vZGVybml6ci5tcVxyXG4gICAqIEBvcHRpb25OYW1lIE1vZGVybml6ci5tcSgpXHJcbiAgICogQG9wdGlvblByb3AgbXFcclxuICAgKiBAYWNjZXNzIHB1YmxpY1xyXG4gICAqIEBmdW5jdGlvbiBtcVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtcSAtIFN0cmluZyBvZiB0aGUgbWVkaWEgcXVlcnkgd2Ugd2FudCB0byB0ZXN0XHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICogQGV4YW1wbGVcclxuICAgKiBNb2Rlcm5penIubXEgYWxsb3dzIGZvciB5b3UgdG8gcHJvZ3JhbW1hdGljYWxseSBjaGVjayBpZiB0aGUgY3VycmVudCBicm93c2VyXHJcbiAgICogd2luZG93IHN0YXRlIG1hdGNoZXMgYSBtZWRpYSBxdWVyeS5cclxuICAgKlxyXG4gICAqIGBgYGpzXHJcbiAgICogIHZhciBxdWVyeSA9IE1vZGVybml6ci5tcSgnKG1pbi13aWR0aDogOTAwcHgpJyk7XHJcbiAgICpcclxuICAgKiAgaWYgKHF1ZXJ5KSB7XHJcbiAgICogICAgLy8gdGhlIGJyb3dzZXIgd2luZG93IGlzIGxhcmdlciB0aGFuIDkwMHB4XHJcbiAgICogIH1cclxuICAgKiBgYGBcclxuICAgKlxyXG4gICAqIE9ubHkgdmFsaWQgbWVkaWEgcXVlcmllcyBhcmUgc3VwcG9ydGVkLCB0aGVyZWZvcmUgeW91IG11c3QgYWx3YXlzIGluY2x1ZGUgdmFsdWVzXHJcbiAgICogd2l0aCB5b3VyIG1lZGlhIHF1ZXJ5XHJcbiAgICpcclxuICAgKiBgYGBqc1xyXG4gICAqIC8vIGdvb2RcclxuICAgKiAgTW9kZXJuaXpyLm1xKCcobWluLXdpZHRoOiA5MDBweCknKTtcclxuICAgKlxyXG4gICAqIC8vIGJhZFxyXG4gICAqICBNb2Rlcm5penIubXEoJ21pbi13aWR0aCcpO1xyXG4gICAqIGBgYFxyXG4gICAqXHJcbiAgICogSWYgeW91IHdvdWxkIGp1c3QgbGlrZSB0byB0ZXN0IHRoYXQgbWVkaWEgcXVlcmllcyBhcmUgc3VwcG9ydGVkIGluIGdlbmVyYWwsIHVzZVxyXG4gICAqXHJcbiAgICogYGBganNcclxuICAgKiAgTW9kZXJuaXpyLm1xKCdvbmx5IGFsbCcpOyAvLyB0cnVlIGlmIE1RIGFyZSBzdXBwb3J0ZWQsIGZhbHNlIGlmIG5vdFxyXG4gICAqIGBgYFxyXG4gICAqXHJcbiAgICpcclxuICAgKiBOb3RlIHRoYXQgaWYgdGhlIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBtZWRpYSBxdWVyaWVzIChlLmcuIG9sZCBJRSkgbXEgd2lsbFxyXG4gICAqIGFsd2F5cyByZXR1cm4gZmFsc2UuXHJcbiAgICovXHJcblxyXG4gIHZhciBtcSA9IChmdW5jdGlvbigpIHtcclxuICAgIHZhciBtYXRjaE1lZGlhID0gd2luZG93Lm1hdGNoTWVkaWEgfHwgd2luZG93Lm1zTWF0Y2hNZWRpYTtcclxuICAgIGlmIChtYXRjaE1lZGlhKSB7XHJcbiAgICAgIHJldHVybiBmdW5jdGlvbihtcSkge1xyXG4gICAgICAgIHZhciBtcWwgPSBtYXRjaE1lZGlhKG1xKTtcclxuICAgICAgICByZXR1cm4gbXFsICYmIG1xbC5tYXRjaGVzIHx8IGZhbHNlO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmdW5jdGlvbihtcSkge1xyXG4gICAgICB2YXIgYm9vbCA9IGZhbHNlO1xyXG5cclxuICAgICAgaW5qZWN0RWxlbWVudFdpdGhTdHlsZXMoJ0BtZWRpYSAnICsgbXEgKyAnIHsgI21vZGVybml6ciB7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgfSB9JywgZnVuY3Rpb24obm9kZSkge1xyXG4gICAgICAgIGJvb2wgPSAod2luZG93LmdldENvbXB1dGVkU3R5bGUgP1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmdldENvbXB1dGVkU3R5bGUobm9kZSwgbnVsbCkgOlxyXG4gICAgICAgICAgICAgICAgbm9kZS5jdXJyZW50U3R5bGUpLnBvc2l0aW9uID09ICdhYnNvbHV0ZSc7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcmV0dXJuIGJvb2w7XHJcbiAgICB9O1xyXG4gIH0pKCk7XHJcblxyXG5cclxuICBNb2Rlcm5penJQcm90by5tcSA9IG1xO1xyXG5cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIElmIHRoZSBicm93c2VycyBmb2xsb3cgdGhlIHNwZWMsIHRoZW4gdGhleSB3b3VsZCBleHBvc2UgdmVuZG9yLXNwZWNpZmljIHN0eWxlIGFzOlxyXG4gICAqICAgZWxlbS5zdHlsZS5XZWJraXRCb3JkZXJSYWRpdXNcclxuICAgKiBpbnN0ZWFkIG9mIHNvbWV0aGluZyBsaWtlIHRoZSBmb2xsb3dpbmcsIHdoaWNoIHdvdWxkIGJlIHRlY2huaWNhbGx5IGluY29ycmVjdDpcclxuICAgKiAgIGVsZW0uc3R5bGUud2Via2l0Qm9yZGVyUmFkaXVzXHJcblxyXG4gICAqIFdlYmtpdCBnaG9zdHMgdGhlaXIgcHJvcGVydGllcyBpbiBsb3dlcmNhc2UgYnV0IE9wZXJhICYgTW96IGRvIG5vdC5cclxuICAgKiBNaWNyb3NvZnQgdXNlcyBhIGxvd2VyY2FzZSBgbXNgIGluc3RlYWQgb2YgdGhlIGNvcnJlY3QgYE1zYCBpbiBJRTgrXHJcbiAgICogICBlcmlrLmVhZS5uZXQvYXJjaGl2ZXMvMjAwOC8wMy8xMC8yMS40OC4xMC9cclxuXHJcbiAgICogTW9yZSBoZXJlOiBnaXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvaXNzdWVzL2lzc3VlLzIxXHJcbiAgICpcclxuICAgKiBAYWNjZXNzIHByaXZhdGVcclxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdmVuZG9yLXNwZWNpZmljIHN0eWxlIHByb3BlcnRpZXNcclxuICAgKi9cclxuXHJcbiAgdmFyIG9tUHJlZml4ZXMgPSAnTW96IE8gbXMgV2Via2l0JztcclxuXHJcblxyXG4gIHZhciBjc3NvbVByZWZpeGVzID0gKE1vZGVybml6clByb3RvLl9jb25maWcudXNlUHJlZml4ZXMgPyBvbVByZWZpeGVzLnNwbGl0KCcgJykgOiBbXSk7XHJcbiAgTW9kZXJuaXpyUHJvdG8uX2Nzc29tUHJlZml4ZXMgPSBjc3NvbVByZWZpeGVzO1xyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogTGlzdCBvZiBKYXZhU2NyaXB0IERPTSB2YWx1ZXMgdXNlZCBmb3IgdGVzdHNcclxuICAgKlxyXG4gICAqIEBtZW1iZXJvZiBNb2Rlcm5penJcclxuICAgKiBAbmFtZSBNb2Rlcm5penIuX2RvbVByZWZpeGVzXHJcbiAgICogQG9wdGlvbk5hbWUgTW9kZXJuaXpyLl9kb21QcmVmaXhlc1xyXG4gICAqIEBvcHRpb25Qcm9wIGRvbVByZWZpeGVzXHJcbiAgICogQGFjY2VzcyBwdWJsaWNcclxuICAgKiBAZXhhbXBsZVxyXG4gICAqXHJcbiAgICogTW9kZXJuaXpyLl9kb21QcmVmaXhlcyBpcyBleGFjdGx5IHRoZSBzYW1lIGFzIFtfcHJlZml4ZXNdKCNtb2Rlcm5penItX3ByZWZpeGVzKSwgYnV0IHJhdGhlclxyXG4gICAqIHRoYW4ga2ViYWItY2FzZSBwcm9wZXJ0aWVzLCBhbGwgcHJvcGVydGllcyBhcmUgdGhlaXIgQ2FwaXRhbGl6ZWQgdmFyaWFudFxyXG4gICAqXHJcbiAgICogYGBganNcclxuICAgKiBNb2Rlcm5penIuX2RvbVByZWZpeGVzID09PSBbIFwiTW96XCIsIFwiT1wiLCBcIm1zXCIsIFwiV2Via2l0XCIgXTtcclxuICAgKiBgYGBcclxuICAgKi9cclxuXHJcbiAgdmFyIGRvbVByZWZpeGVzID0gKE1vZGVybml6clByb3RvLl9jb25maWcudXNlUHJlZml4ZXMgPyBvbVByZWZpeGVzLnRvTG93ZXJDYXNlKCkuc3BsaXQoJyAnKSA6IFtdKTtcclxuICBNb2Rlcm5penJQcm90by5fZG9tUHJlZml4ZXMgPSBkb21QcmVmaXhlcztcclxuXHJcblxyXG5cclxuICAvKipcclxuICAgKiBjb250YWlucyBjaGVja3MgdG8gc2VlIGlmIGEgc3RyaW5nIGNvbnRhaW5zIGFub3RoZXIgc3RyaW5nXHJcbiAgICpcclxuICAgKiBAYWNjZXNzIHByaXZhdGVcclxuICAgKiBAZnVuY3Rpb24gY29udGFpbnNcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyIC0gVGhlIHN0cmluZyB3ZSB3YW50IHRvIGNoZWNrIGZvciBzdWJzdHJpbmdzXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN1YnN0ciAtIFRoZSBzdWJzdHJpbmcgd2Ugd2FudCB0byBzZWFyY2ggdGhlIGZpcnN0IHN0cmluZyBmb3JcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgKi9cclxuXHJcbiAgZnVuY3Rpb24gY29udGFpbnMoc3RyLCBzdWJzdHIpIHtcclxuICAgIHJldHVybiAhIX4oJycgKyBzdHIpLmluZGV4T2Yoc3Vic3RyKTtcclxuICB9XHJcblxyXG4gIDtcclxuXHJcbiAgLyoqXHJcbiAgICogY3NzVG9ET00gdGFrZXMgYSBrZWJhYi1jYXNlIHN0cmluZyBhbmQgY29udmVydHMgaXQgdG8gY2FtZWxDYXNlXHJcbiAgICogZS5nLiBib3gtc2l6aW5nIC0+IGJveFNpemluZ1xyXG4gICAqXHJcbiAgICogQGFjY2VzcyBwcml2YXRlXHJcbiAgICogQGZ1bmN0aW9uIGNzc1RvRE9NXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBTdHJpbmcgbmFtZSBvZiBrZWJhYi1jYXNlIHByb3Agd2Ugd2FudCB0byBjb252ZXJ0XHJcbiAgICogQHJldHVybnMge3N0cmluZ30gVGhlIGNhbWVsQ2FzZSB2ZXJzaW9uIG9mIHRoZSBzdXBwbGllZCBuYW1lXHJcbiAgICovXHJcblxyXG4gIGZ1bmN0aW9uIGNzc1RvRE9NKG5hbWUpIHtcclxuICAgIHJldHVybiBuYW1lLnJlcGxhY2UoLyhbYS16XSktKFthLXpdKS9nLCBmdW5jdGlvbihzdHIsIG0xLCBtMikge1xyXG4gICAgICByZXR1cm4gbTEgKyBtMi50b1VwcGVyQ2FzZSgpO1xyXG4gICAgfSkucmVwbGFjZSgvXi0vLCAnJyk7XHJcbiAgfVxyXG4gIDtcclxuXHJcbiAgLyoqXHJcbiAgICogZm5CaW5kIGlzIGEgc3VwZXIgc21hbGwgW2JpbmRdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0Z1bmN0aW9uL2JpbmQpIHBvbHlmaWxsLlxyXG4gICAqXHJcbiAgICogQGFjY2VzcyBwcml2YXRlXHJcbiAgICogQGZ1bmN0aW9uIGZuQmluZFxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuIC0gYSBmdW5jdGlvbiB5b3Ugd2FudCB0byBjaGFuZ2UgYHRoaXNgIHJlZmVyZW5jZSB0b1xyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSB0aGF0IC0gdGhlIGB0aGlzYCB5b3Ugd2FudCB0byBjYWxsIHRoZSBmdW5jdGlvbiB3aXRoXHJcbiAgICogQHJldHVybnMge2Z1bmN0aW9ufSBUaGUgd3JhcHBlZCB2ZXJzaW9uIG9mIHRoZSBzdXBwbGllZCBmdW5jdGlvblxyXG4gICAqL1xyXG5cclxuICBmdW5jdGlvbiBmbkJpbmQoZm4sIHRoYXQpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgO1xyXG5cclxuICAvKipcclxuICAgKiB0ZXN0RE9NUHJvcHMgaXMgYSBnZW5lcmljIERPTSBwcm9wZXJ0eSB0ZXN0OyBpZiBhIGJyb3dzZXIgc3VwcG9ydHNcclxuICAgKiAgIGEgY2VydGFpbiBwcm9wZXJ0eSwgaXQgd29uJ3QgcmV0dXJuIHVuZGVmaW5lZCBmb3IgaXQuXHJcbiAgICpcclxuICAgKiBAYWNjZXNzIHByaXZhdGVcclxuICAgKiBAZnVuY3Rpb24gdGVzdERPTVByb3BzXHJcbiAgICogQHBhcmFtIHthcnJheS48c3RyaW5nPn0gcHJvcHMgLSBBbiBhcnJheSBvZiBwcm9wZXJ0aWVzIHRvIHRlc3QgZm9yXHJcbiAgICogQHBhcmFtIHtvYmplY3R9IG9iaiAtIEFuIG9iamVjdCBvciBFbGVtZW50IHlvdSB3YW50IHRvIHVzZSB0byB0ZXN0IHRoZSBwYXJhbWV0ZXJzIGFnYWluXHJcbiAgICogQHBhcmFtIHtib29sZWFufG9iamVjdH0gZWxlbSAtIEFuIEVsZW1lbnQgdG8gYmluZCB0aGUgcHJvcGVydHkgbG9va3VwIGFnYWluLiBVc2UgYGZhbHNlYCB0byBwcmV2ZW50IHRoZSBjaGVja1xyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHRlc3RET01Qcm9wcyhwcm9wcywgb2JqLCBlbGVtKSB7XHJcbiAgICB2YXIgaXRlbTtcclxuXHJcbiAgICBmb3IgKHZhciBpIGluIHByb3BzKSB7XHJcbiAgICAgIGlmIChwcm9wc1tpXSBpbiBvYmopIHtcclxuXHJcbiAgICAgICAgLy8gcmV0dXJuIHRoZSBwcm9wZXJ0eSBuYW1lIGFzIGEgc3RyaW5nXHJcbiAgICAgICAgaWYgKGVsZW0gPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICByZXR1cm4gcHJvcHNbaV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpdGVtID0gb2JqW3Byb3BzW2ldXTtcclxuXHJcbiAgICAgICAgLy8gbGV0J3MgYmluZCBhIGZ1bmN0aW9uXHJcbiAgICAgICAgaWYgKGlzKGl0ZW0sICdmdW5jdGlvbicpKSB7XHJcbiAgICAgICAgICAvLyBiaW5kIHRvIG9iaiB1bmxlc3Mgb3ZlcnJpZGVuXHJcbiAgICAgICAgICByZXR1cm4gZm5CaW5kKGl0ZW0sIGVsZW0gfHwgb2JqKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHJldHVybiB0aGUgdW5ib3VuZCBmdW5jdGlvbiBvciBvYmogb3IgdmFsdWVcclxuICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgO1xyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgb3VyIFwibW9kZXJuaXpyXCIgZWxlbWVudCB0aGF0IHdlIGRvIG1vc3QgZmVhdHVyZSB0ZXN0cyBvbi5cclxuICAgKlxyXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxyXG4gICAqL1xyXG5cclxuICB2YXIgbW9kRWxlbSA9IHtcclxuICAgIGVsZW06IGNyZWF0ZUVsZW1lbnQoJ21vZGVybml6cicpXHJcbiAgfTtcclxuXHJcbiAgLy8gQ2xlYW4gdXAgdGhpcyBlbGVtZW50XHJcbiAgTW9kZXJuaXpyLl9xLnB1c2goZnVuY3Rpb24oKSB7XHJcbiAgICBkZWxldGUgbW9kRWxlbS5lbGVtO1xyXG4gIH0pO1xyXG5cclxuXHJcblxyXG4gIHZhciBtU3R5bGUgPSB7XHJcbiAgICBzdHlsZTogbW9kRWxlbS5lbGVtLnN0eWxlXHJcbiAgfTtcclxuXHJcbiAgLy8ga2lsbCByZWYgZm9yIGdjLCBtdXN0IGhhcHBlbiBiZWZvcmUgbW9kLmVsZW0gaXMgcmVtb3ZlZCwgc28gd2UgdW5zaGlmdCBvbiB0b1xyXG4gIC8vIHRoZSBmcm9udCBvZiB0aGUgcXVldWUuXHJcbiAgTW9kZXJuaXpyLl9xLnVuc2hpZnQoZnVuY3Rpb24oKSB7XHJcbiAgICBkZWxldGUgbVN0eWxlLnN0eWxlO1xyXG4gIH0pO1xyXG5cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIGRvbVRvQ1NTIHRha2VzIGEgY2FtZWxDYXNlIHN0cmluZyBhbmQgY29udmVydHMgaXQgdG8ga2ViYWItY2FzZVxyXG4gICAqIGUuZy4gYm94U2l6aW5nIC0+IGJveC1zaXppbmdcclxuICAgKlxyXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxyXG4gICAqIEBmdW5jdGlvbiBkb21Ub0NTU1xyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gU3RyaW5nIG5hbWUgb2YgY2FtZWxDYXNlIHByb3Agd2Ugd2FudCB0byBjb252ZXJ0XHJcbiAgICogQHJldHVybnMge3N0cmluZ30gVGhlIGtlYmFiLWNhc2UgdmVyc2lvbiBvZiB0aGUgc3VwcGxpZWQgbmFtZVxyXG4gICAqL1xyXG5cclxuICBmdW5jdGlvbiBkb21Ub0NTUyhuYW1lKSB7XHJcbiAgICByZXR1cm4gbmFtZS5yZXBsYWNlKC8oW0EtWl0pL2csIGZ1bmN0aW9uKHN0ciwgbTEpIHtcclxuICAgICAgcmV0dXJuICctJyArIG0xLnRvTG93ZXJDYXNlKCk7XHJcbiAgICB9KS5yZXBsYWNlKC9ebXMtLywgJy1tcy0nKTtcclxuICB9XHJcbiAgO1xyXG5cclxuICAvKipcclxuICAgKiBuYXRpdmVUZXN0UHJvcHMgYWxsb3dzIGZvciB1cyB0byB1c2UgbmF0aXZlIGZlYXR1cmUgZGV0ZWN0aW9uIGZ1bmN0aW9uYWxpdHkgaWYgYXZhaWxhYmxlLlxyXG4gICAqIHNvbWUgcHJlZml4ZWQgZm9ybSwgb3IgZmFsc2UsIGluIHRoZSBjYXNlIG9mIGFuIHVuc3VwcG9ydGVkIHJ1bGVcclxuICAgKlxyXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxyXG4gICAqIEBmdW5jdGlvbiBuYXRpdmVUZXN0UHJvcHNcclxuICAgKiBAcGFyYW0ge2FycmF5fSBwcm9wcyAtIEFuIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gQSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSB3ZSB3YW50IHRvIGNoZWNrIHZpYSBAc3VwcG9ydHNcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbnx1bmRlZmluZWR9IEEgYm9vbGVhbiB3aGVuIEBzdXBwb3J0cyBleGlzdHMsIHVuZGVmaW5lZCBvdGhlcndpc2VcclxuICAgKi9cclxuXHJcbiAgLy8gQWNjZXB0cyBhIGxpc3Qgb2YgcHJvcGVydHkgbmFtZXMgYW5kIGEgc2luZ2xlIHZhbHVlXHJcbiAgLy8gUmV0dXJucyBgdW5kZWZpbmVkYCBpZiBuYXRpdmUgZGV0ZWN0aW9uIG5vdCBhdmFpbGFibGVcclxuICBmdW5jdGlvbiBuYXRpdmVUZXN0UHJvcHMocHJvcHMsIHZhbHVlKSB7XHJcbiAgICB2YXIgaSA9IHByb3BzLmxlbmd0aDtcclxuICAgIC8vIFN0YXJ0IHdpdGggdGhlIEpTIEFQSTogaHR0cDovL3d3dy53My5vcmcvVFIvY3NzMy1jb25kaXRpb25hbC8jdGhlLWNzcy1pbnRlcmZhY2VcclxuICAgIGlmICgnQ1NTJyBpbiB3aW5kb3cgJiYgJ3N1cHBvcnRzJyBpbiB3aW5kb3cuQ1NTKSB7XHJcbiAgICAgIC8vIFRyeSBldmVyeSBwcmVmaXhlZCB2YXJpYW50IG9mIHRoZSBwcm9wZXJ0eVxyXG4gICAgICB3aGlsZSAoaS0tKSB7XHJcbiAgICAgICAgaWYgKHdpbmRvdy5DU1Muc3VwcG9ydHMoZG9tVG9DU1MocHJvcHNbaV0pLCB2YWx1ZSkpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICAvLyBPdGhlcndpc2UgZmFsbCBiYWNrIHRvIGF0LXJ1bGUgKGZvciBPcGVyYSAxMi54KVxyXG4gICAgZWxzZSBpZiAoJ0NTU1N1cHBvcnRzUnVsZScgaW4gd2luZG93KSB7XHJcbiAgICAgIC8vIEJ1aWxkIGEgY29uZGl0aW9uIHN0cmluZyBmb3IgZXZlcnkgcHJlZml4ZWQgdmFyaWFudFxyXG4gICAgICB2YXIgY29uZGl0aW9uVGV4dCA9IFtdO1xyXG4gICAgICB3aGlsZSAoaS0tKSB7XHJcbiAgICAgICAgY29uZGl0aW9uVGV4dC5wdXNoKCcoJyArIGRvbVRvQ1NTKHByb3BzW2ldKSArICc6JyArIHZhbHVlICsgJyknKTtcclxuICAgICAgfVxyXG4gICAgICBjb25kaXRpb25UZXh0ID0gY29uZGl0aW9uVGV4dC5qb2luKCcgb3IgJyk7XHJcbiAgICAgIHJldHVybiBpbmplY3RFbGVtZW50V2l0aFN0eWxlcygnQHN1cHBvcnRzICgnICsgY29uZGl0aW9uVGV4dCArICcpIHsgI21vZGVybml6ciB7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgfSB9JywgZnVuY3Rpb24obm9kZSkge1xyXG4gICAgICAgIHJldHVybiBnZXRDb21wdXRlZFN0eWxlKG5vZGUsIG51bGwpLnBvc2l0aW9uID09ICdhYnNvbHV0ZSc7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICB9XHJcbiAgO1xyXG5cclxuICAvLyB0ZXN0UHJvcHMgaXMgYSBnZW5lcmljIENTUyAvIERPTSBwcm9wZXJ0eSB0ZXN0LlxyXG5cclxuICAvLyBJbiB0ZXN0aW5nIHN1cHBvcnQgZm9yIGEgZ2l2ZW4gQ1NTIHByb3BlcnR5LCBpdCdzIGxlZ2l0IHRvIHRlc3Q6XHJcbiAgLy8gICAgYGVsZW0uc3R5bGVbc3R5bGVOYW1lXSAhPT0gdW5kZWZpbmVkYFxyXG4gIC8vIElmIHRoZSBwcm9wZXJ0eSBpcyBzdXBwb3J0ZWQgaXQgd2lsbCByZXR1cm4gYW4gZW1wdHkgc3RyaW5nLFxyXG4gIC8vIGlmIHVuc3VwcG9ydGVkIGl0IHdpbGwgcmV0dXJuIHVuZGVmaW5lZC5cclxuXHJcbiAgLy8gV2UnbGwgdGFrZSBhZHZhbnRhZ2Ugb2YgdGhpcyBxdWljayB0ZXN0IGFuZCBza2lwIHNldHRpbmcgYSBzdHlsZVxyXG4gIC8vIG9uIG91ciBtb2Rlcm5penIgZWxlbWVudCwgYnV0IGluc3RlYWQganVzdCB0ZXN0aW5nIHVuZGVmaW5lZCB2c1xyXG4gIC8vIGVtcHR5IHN0cmluZy5cclxuXHJcbiAgLy8gUHJvcGVydHkgbmFtZXMgY2FuIGJlIHByb3ZpZGVkIGluIGVpdGhlciBjYW1lbENhc2Ugb3Iga2ViYWItY2FzZS5cclxuXHJcbiAgZnVuY3Rpb24gdGVzdFByb3BzKHByb3BzLCBwcmVmaXhlZCwgdmFsdWUsIHNraXBWYWx1ZVRlc3QpIHtcclxuICAgIHNraXBWYWx1ZVRlc3QgPSBpcyhza2lwVmFsdWVUZXN0LCAndW5kZWZpbmVkJykgPyBmYWxzZSA6IHNraXBWYWx1ZVRlc3Q7XHJcblxyXG4gICAgLy8gVHJ5IG5hdGl2ZSBkZXRlY3QgZmlyc3RcclxuICAgIGlmICghaXModmFsdWUsICd1bmRlZmluZWQnKSkge1xyXG4gICAgICB2YXIgcmVzdWx0ID0gbmF0aXZlVGVzdFByb3BzKHByb3BzLCB2YWx1ZSk7XHJcbiAgICAgIGlmICghaXMocmVzdWx0LCAndW5kZWZpbmVkJykpIHtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gT3RoZXJ3aXNlIGRvIGl0IHByb3Blcmx5XHJcbiAgICB2YXIgYWZ0ZXJJbml0LCBpLCBwcm9wc0xlbmd0aCwgcHJvcCwgYmVmb3JlO1xyXG5cclxuICAgIC8vIElmIHdlIGRvbid0IGhhdmUgYSBzdHlsZSBlbGVtZW50LCB0aGF0IG1lYW5zIHdlJ3JlIHJ1bm5pbmcgYXN5bmMgb3IgYWZ0ZXJcclxuICAgIC8vIHRoZSBjb3JlIHRlc3RzLCBzbyB3ZSdsbCBuZWVkIHRvIGNyZWF0ZSBvdXIgb3duIGVsZW1lbnRzIHRvIHVzZVxyXG5cclxuICAgIC8vIGluc2lkZSBvZiBhbiBTVkcgZWxlbWVudCwgaW4gY2VydGFpbiBicm93c2VycywgdGhlIGBzdHlsZWAgZWxlbWVudCBpcyBvbmx5XHJcbiAgICAvLyBkZWZpbmVkIGZvciB2YWxpZCB0YWdzLiBUaGVyZWZvcmUsIGlmIGBtb2Rlcm5penJgIGRvZXMgbm90IGhhdmUgb25lLCB3ZVxyXG4gICAgLy8gZmFsbCBiYWNrIHRvIGEgbGVzcyB1c2VkIGVsZW1lbnQgYW5kIGhvcGUgZm9yIHRoZSBiZXN0LlxyXG4gICAgdmFyIGVsZW1zID0gWydtb2Rlcm5penInLCAndHNwYW4nXTtcclxuICAgIHdoaWxlICghbVN0eWxlLnN0eWxlKSB7XHJcbiAgICAgIGFmdGVySW5pdCA9IHRydWU7XHJcbiAgICAgIG1TdHlsZS5tb2RFbGVtID0gY3JlYXRlRWxlbWVudChlbGVtcy5zaGlmdCgpKTtcclxuICAgICAgbVN0eWxlLnN0eWxlID0gbVN0eWxlLm1vZEVsZW0uc3R5bGU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRGVsZXRlIHRoZSBvYmplY3RzIGlmIHdlIGNyZWF0ZWQgdGhlbS5cclxuICAgIGZ1bmN0aW9uIGNsZWFuRWxlbXMoKSB7XHJcbiAgICAgIGlmIChhZnRlckluaXQpIHtcclxuICAgICAgICBkZWxldGUgbVN0eWxlLnN0eWxlO1xyXG4gICAgICAgIGRlbGV0ZSBtU3R5bGUubW9kRWxlbTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3BzTGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IHByb3BzTGVuZ3RoOyBpKyspIHtcclxuICAgICAgcHJvcCA9IHByb3BzW2ldO1xyXG4gICAgICBiZWZvcmUgPSBtU3R5bGUuc3R5bGVbcHJvcF07XHJcblxyXG4gICAgICBpZiAoY29udGFpbnMocHJvcCwgJy0nKSkge1xyXG4gICAgICAgIHByb3AgPSBjc3NUb0RPTShwcm9wKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG1TdHlsZS5zdHlsZVtwcm9wXSAhPT0gdW5kZWZpbmVkKSB7XHJcblxyXG4gICAgICAgIC8vIElmIHZhbHVlIHRvIHRlc3QgaGFzIGJlZW4gcGFzc2VkIGluLCBkbyBhIHNldC1hbmQtY2hlY2sgdGVzdC5cclxuICAgICAgICAvLyAwIChpbnRlZ2VyKSBpcyBhIHZhbGlkIHByb3BlcnR5IHZhbHVlLCBzbyBjaGVjayB0aGF0IGB2YWx1ZWAgaXNuJ3RcclxuICAgICAgICAvLyB1bmRlZmluZWQsIHJhdGhlciB0aGFuIGp1c3QgY2hlY2tpbmcgaXQncyB0cnV0aHkuXHJcbiAgICAgICAgaWYgKCFza2lwVmFsdWVUZXN0ICYmICFpcyh2YWx1ZSwgJ3VuZGVmaW5lZCcpKSB7XHJcblxyXG4gICAgICAgICAgLy8gTmVlZHMgYSB0cnkgY2F0Y2ggYmxvY2sgYmVjYXVzZSBvZiBvbGQgSUUuIFRoaXMgaXMgc2xvdywgYnV0IHdpbGxcclxuICAgICAgICAgIC8vIGJlIGF2b2lkZWQgaW4gbW9zdCBjYXNlcyBiZWNhdXNlIGBza2lwVmFsdWVUZXN0YCB3aWxsIGJlIHVzZWQuXHJcbiAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBtU3R5bGUuc3R5bGVbcHJvcF0gPSB2YWx1ZTtcclxuICAgICAgICAgIH0gY2F0Y2ggKGUpIHt9XHJcblxyXG4gICAgICAgICAgLy8gSWYgdGhlIHByb3BlcnR5IHZhbHVlIGhhcyBjaGFuZ2VkLCB3ZSBhc3N1bWUgdGhlIHZhbHVlIHVzZWQgaXNcclxuICAgICAgICAgIC8vIHN1cHBvcnRlZC4gSWYgYHZhbHVlYCBpcyBlbXB0eSBzdHJpbmcsIGl0J2xsIGZhaWwgaGVyZSAoYmVjYXVzZVxyXG4gICAgICAgICAgLy8gaXQgaGFzbid0IGNoYW5nZWQpLCB3aGljaCBtYXRjaGVzIGhvdyBicm93c2VycyBoYXZlIGltcGxlbWVudGVkXHJcbiAgICAgICAgICAvLyBDU1Muc3VwcG9ydHMoKVxyXG4gICAgICAgICAgaWYgKG1TdHlsZS5zdHlsZVtwcm9wXSAhPSBiZWZvcmUpIHtcclxuICAgICAgICAgICAgY2xlYW5FbGVtcygpO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJlZml4ZWQgPT0gJ3BmeCcgPyBwcm9wIDogdHJ1ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gT3RoZXJ3aXNlIGp1c3QgcmV0dXJuIHRydWUsIG9yIHRoZSBwcm9wZXJ0eSBuYW1lIGlmIHRoaXMgaXMgYVxyXG4gICAgICAgIC8vIGBwcmVmaXhlZCgpYCBjYWxsXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBjbGVhbkVsZW1zKCk7XHJcbiAgICAgICAgICByZXR1cm4gcHJlZml4ZWQgPT0gJ3BmeCcgPyBwcm9wIDogdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNsZWFuRWxlbXMoKTtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIDtcclxuXHJcbiAgLyoqXHJcbiAgICogdGVzdFByb3BzQWxsIHRlc3RzIGEgbGlzdCBvZiBET00gcHJvcGVydGllcyB3ZSB3YW50IHRvIGNoZWNrIGFnYWluc3QuXHJcbiAgICogV2Ugc3BlY2lmeSBsaXRlcmFsbHkgQUxMIHBvc3NpYmxlIChrbm93biBhbmQvb3IgbGlrZWx5KSBwcm9wZXJ0aWVzIG9uXHJcbiAgICogdGhlIGVsZW1lbnQgaW5jbHVkaW5nIHRoZSBub24tdmVuZG9yIHByZWZpeGVkIG9uZSwgZm9yIGZvcndhcmQtXHJcbiAgICogY29tcGF0aWJpbGl0eS5cclxuICAgKlxyXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxyXG4gICAqIEBmdW5jdGlvbiB0ZXN0UHJvcHNBbGxcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcCAtIEEgc3RyaW5nIG9mIHRoZSBwcm9wZXJ0eSB0byB0ZXN0IGZvclxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gW3ByZWZpeGVkXSAtIEFuIG9iamVjdCB0byBjaGVjayB0aGUgcHJlZml4ZWQgcHJvcGVydGllcyBvbi4gVXNlIGEgc3RyaW5nIHRvIHNraXBcclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fFNWR0VsZW1lbnR9IFtlbGVtXSAtIEFuIGVsZW1lbnQgdXNlZCB0byB0ZXN0IHRoZSBwcm9wZXJ0eSBhbmQgdmFsdWUgYWdhaW5zdFxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbdmFsdWVdIC0gQSBzdHJpbmcgb2YgYSBjc3MgdmFsdWVcclxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtza2lwVmFsdWVUZXN0XSAtIEFuIGJvb2xlYW4gcmVwcmVzZW50aW5nIGlmIHlvdSB3YW50IHRvIHRlc3QgaWYgdmFsdWUgc3RpY2tzIHdoZW4gc2V0XHJcbiAgICovXHJcbiAgZnVuY3Rpb24gdGVzdFByb3BzQWxsKHByb3AsIHByZWZpeGVkLCBlbGVtLCB2YWx1ZSwgc2tpcFZhbHVlVGVzdCkge1xyXG5cclxuICAgIHZhciB1Y1Byb3AgPSBwcm9wLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcHJvcC5zbGljZSgxKSxcclxuICAgIHByb3BzID0gKHByb3AgKyAnICcgKyBjc3NvbVByZWZpeGVzLmpvaW4odWNQcm9wICsgJyAnKSArIHVjUHJvcCkuc3BsaXQoJyAnKTtcclxuXHJcbiAgICAvLyBkaWQgdGhleSBjYWxsIC5wcmVmaXhlZCgnYm94U2l6aW5nJykgb3IgYXJlIHdlIGp1c3QgdGVzdGluZyBhIHByb3A/XHJcbiAgICBpZiAoaXMocHJlZml4ZWQsICdzdHJpbmcnKSB8fCBpcyhwcmVmaXhlZCwgJ3VuZGVmaW5lZCcpKSB7XHJcbiAgICAgIHJldHVybiB0ZXN0UHJvcHMocHJvcHMsIHByZWZpeGVkLCB2YWx1ZSwgc2tpcFZhbHVlVGVzdCk7XHJcblxyXG4gICAgICAvLyBvdGhlcndpc2UsIHRoZXkgY2FsbGVkIC5wcmVmaXhlZCgncmVxdWVzdEFuaW1hdGlvbkZyYW1lJywgd2luZG93WywgZWxlbV0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwcm9wcyA9IChwcm9wICsgJyAnICsgKGRvbVByZWZpeGVzKS5qb2luKHVjUHJvcCArICcgJykgKyB1Y1Byb3ApLnNwbGl0KCcgJyk7XHJcbiAgICAgIHJldHVybiB0ZXN0RE9NUHJvcHMocHJvcHMsIHByZWZpeGVkLCBlbGVtKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIE1vZGVybml6ci50ZXN0QWxsUHJvcHMoKSBpbnZlc3RpZ2F0ZXMgd2hldGhlciBhIGdpdmVuIHN0eWxlIHByb3BlcnR5LFxyXG4gIC8vIG9yIGFueSBvZiBpdHMgdmVuZG9yLXByZWZpeGVkIHZhcmlhbnRzLCBpcyByZWNvZ25pemVkXHJcbiAgLy9cclxuICAvLyBOb3RlIHRoYXQgdGhlIHByb3BlcnR5IG5hbWVzIG11c3QgYmUgcHJvdmlkZWQgaW4gdGhlIGNhbWVsQ2FzZSB2YXJpYW50LlxyXG4gIC8vIE1vZGVybml6ci50ZXN0QWxsUHJvcHMoJ2JveFNpemluZycpXHJcbiAgTW9kZXJuaXpyUHJvdG8udGVzdEFsbFByb3BzID0gdGVzdFByb3BzQWxsO1xyXG5cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIHRlc3RBbGxQcm9wcyBkZXRlcm1pbmVzIHdoZXRoZXIgYSBnaXZlbiBDU1MgcHJvcGVydHkgaXMgc3VwcG9ydGVkIGluIHRoZSBicm93c2VyXHJcbiAgICpcclxuICAgKiBAbWVtYmVyb2YgTW9kZXJuaXpyXHJcbiAgICogQG5hbWUgTW9kZXJuaXpyLnRlc3RBbGxQcm9wc1xyXG4gICAqIEBvcHRpb25OYW1lIE1vZGVybml6ci50ZXN0QWxsUHJvcHMoKVxyXG4gICAqIEBvcHRpb25Qcm9wIHRlc3RBbGxQcm9wc1xyXG4gICAqIEBhY2Nlc3MgcHVibGljXHJcbiAgICogQGZ1bmN0aW9uIHRlc3RBbGxQcm9wc1xyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wIC0gU3RyaW5nIG5hbWluZyB0aGUgcHJvcGVydHkgdG8gdGVzdCAoZWl0aGVyIGNhbWVsQ2FzZSBvciBrZWJhYi1jYXNlKVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbdmFsdWVdIC0gU3RyaW5nIG9mIHRoZSB2YWx1ZSB0byB0ZXN0XHJcbiAgICogQHBhcmFtIHtib29sZWFufSBbc2tpcFZhbHVlVGVzdD1mYWxzZV0gLSBXaGV0aGVyIHRvIHNraXAgdGVzdGluZyB0aGF0IHRoZSB2YWx1ZSBpcyBzdXBwb3J0ZWQgd2hlbiB1c2luZyBub24tbmF0aXZlIGRldGVjdGlvblxyXG4gICAqIEBleGFtcGxlXHJcbiAgICpcclxuICAgKiB0ZXN0QWxsUHJvcHMgZGV0ZXJtaW5lcyB3aGV0aGVyIGEgZ2l2ZW4gQ1NTIHByb3BlcnR5LCBpbiBzb21lIHByZWZpeGVkIGZvcm0sXHJcbiAgICogaXMgc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyLlxyXG4gICAqXHJcbiAgICogYGBganNcclxuICAgKiB0ZXN0QWxsUHJvcHMoJ2JveFNpemluZycpICAvLyB0cnVlXHJcbiAgICogYGBgXHJcbiAgICpcclxuICAgKiBJdCBjYW4gb3B0aW9uYWxseSBiZSBnaXZlbiBhIENTUyB2YWx1ZSBpbiBzdHJpbmcgZm9ybSB0byB0ZXN0IGlmIGEgcHJvcGVydHlcclxuICAgKiB2YWx1ZSBpcyB2YWxpZFxyXG4gICAqXHJcbiAgICogYGBganNcclxuICAgKiB0ZXN0QWxsUHJvcHMoJ2Rpc3BsYXknLCAnYmxvY2snKSAvLyB0cnVlXHJcbiAgICogdGVzdEFsbFByb3BzKCdkaXNwbGF5JywgJ3Blbmd1aW4nKSAvLyBmYWxzZVxyXG4gICAqIGBgYFxyXG4gICAqXHJcbiAgICogQSBib29sZWFuIGNhbiBiZSBwYXNzZWQgYXMgYSB0aGlyZCBwYXJhbWV0ZXIgdG8gc2tpcCB0aGUgdmFsdWUgY2hlY2sgd2hlblxyXG4gICAqIG5hdGl2ZSBkZXRlY3Rpb24gKEBzdXBwb3J0cykgaXNuJ3QgYXZhaWxhYmxlLlxyXG4gICAqXHJcbiAgICogYGBganNcclxuICAgKiB0ZXN0QWxsUHJvcHMoJ3NoYXBlT3V0c2lkZScsICdjb250ZW50LWJveCcsIHRydWUpO1xyXG4gICAqIGBgYFxyXG4gICAqL1xyXG5cclxuICBmdW5jdGlvbiB0ZXN0QWxsUHJvcHMocHJvcCwgdmFsdWUsIHNraXBWYWx1ZVRlc3QpIHtcclxuICAgIHJldHVybiB0ZXN0UHJvcHNBbGwocHJvcCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHZhbHVlLCBza2lwVmFsdWVUZXN0KTtcclxuICB9XHJcbiAgTW9kZXJuaXpyUHJvdG8udGVzdEFsbFByb3BzID0gdGVzdEFsbFByb3BzO1xyXG5cclxuLyohXHJcbntcclxuICBcIm5hbWVcIjogXCJCYWNrZ3JvdW5kIFNpemVcIixcclxuICBcInByb3BlcnR5XCI6IFwiYmFja2dyb3VuZHNpemVcIixcclxuICBcInRhZ3NcIjogW1wiY3NzXCJdLFxyXG4gIFwia25vd25CdWdzXCI6IFtcIlRoaXMgd2lsbCBmYWxzZSBwb3NpdGl2ZSBpbiBPcGVyYSBNaW5pIC0gaHR0cHM6Ly9naXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvaXNzdWVzLzM5NlwiXSxcclxuICBcIm5vdGVzXCI6IFt7XHJcbiAgICBcIm5hbWVcIjogXCJSZWxhdGVkIElzc3VlXCIsXHJcbiAgICBcImhyZWZcIjogXCJodHRwczovL2dpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci9pc3N1ZXMvMzk2XCJcclxuICB9XVxyXG59XHJcbiEqL1xyXG5cclxuICBNb2Rlcm5penIuYWRkVGVzdCgnYmFja2dyb3VuZHNpemUnLCB0ZXN0QWxsUHJvcHMoJ2JhY2tncm91bmRTaXplJywgJzEwMCUnLCB0cnVlKSk7XHJcblxyXG4vKiFcclxue1xyXG4gIFwibmFtZVwiOiBcIkZsZXhib3hcIixcclxuICBcInByb3BlcnR5XCI6IFwiZmxleGJveFwiLFxyXG4gIFwiY2FuaXVzZVwiOiBcImZsZXhib3hcIixcclxuICBcInRhZ3NcIjogW1wiY3NzXCJdLFxyXG4gIFwibm90ZXNcIjogW3tcclxuICAgIFwibmFtZVwiOiBcIlRoZSBfbmV3XyBmbGV4Ym94XCIsXHJcbiAgICBcImhyZWZcIjogXCJodHRwOi8vZGV2LnczLm9yZy9jc3N3Zy9jc3MzLWZsZXhib3hcIlxyXG4gIH1dLFxyXG4gIFwid2FybmluZ3NcIjogW1xyXG4gICAgXCJBIGB0cnVlYCByZXN1bHQgZm9yIHRoaXMgZGV0ZWN0IGRvZXMgbm90IGltcGx5IHRoYXQgdGhlIGBmbGV4LXdyYXBgIHByb3BlcnR5IGlzIHN1cHBvcnRlZDsgc2VlIHRoZSBgZmxleHdyYXBgIGRldGVjdC5cIlxyXG4gIF1cclxufVxyXG4hKi9cclxuLyogRE9DXHJcbkRldGVjdHMgc3VwcG9ydCBmb3IgdGhlIEZsZXhpYmxlIEJveCBMYXlvdXQgbW9kZWwsIGEuay5hLiBGbGV4Ym94LCB3aGljaCBhbGxvd3MgZWFzeSBtYW5pcHVsYXRpb24gb2YgbGF5b3V0IG9yZGVyIGFuZCBzaXppbmcgd2l0aGluIGEgY29udGFpbmVyLlxyXG4qL1xyXG5cclxuICBNb2Rlcm5penIuYWRkVGVzdCgnZmxleGJveCcsIHRlc3RBbGxQcm9wcygnZmxleEJhc2lzJywgJzFweCcsIHRydWUpKTtcclxuXHJcbi8qIVxyXG57XHJcbiAgXCJuYW1lXCI6IFwiRmxleGJveCAobGVnYWN5KVwiLFxyXG4gIFwicHJvcGVydHlcIjogXCJmbGV4Ym94bGVnYWN5XCIsXHJcbiAgXCJ0YWdzXCI6IFtcImNzc1wiXSxcclxuICBcInBvbHlmaWxsc1wiOiBbXCJmbGV4aWVcIl0sXHJcbiAgXCJub3Rlc1wiOiBbe1xyXG4gICAgXCJuYW1lXCI6IFwiVGhlIF9vbGRfIGZsZXhib3hcIixcclxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vd3d3LnczLm9yZy9UUi8yMDA5L1dELWNzczMtZmxleGJveC0yMDA5MDcyMy9cIlxyXG4gIH1dXHJcbn1cclxuISovXHJcblxyXG4gIE1vZGVybml6ci5hZGRUZXN0KCdmbGV4Ym94bGVnYWN5JywgdGVzdEFsbFByb3BzKCdib3hEaXJlY3Rpb24nLCAncmV2ZXJzZScsIHRydWUpKTtcclxuICBcclxuICAvL0FkZGVkIHRvIGRldGVjdCB0cmFuc2l0aW9uXHJcbiAgIE1vZGVybml6ci5hZGRUZXN0KCdjc3N0cmFuc2l0aW9ucycsdGVzdEFsbFByb3BzKCd0cmFuc2l0aW9uJykpO1xyXG4gIFxyXG4gIFxyXG4gICAgLyo+PndlYmZvcm1zKi9cclxuICAgIC8vIGlucHV0IGZlYXR1cmVzIGFuZCBpbnB1dCB0eXBlcyBnbyBkaXJlY3RseSBvbnRvIHRoZSByZXQgb2JqZWN0LCBieXBhc3NpbmcgdGhlIHRlc3RzIGxvb3AuXHJcbiAgICAvLyBIb2xkIHRoaXMgZ3V5IHRvIGV4ZWN1dGUgaW4gYSBtb21lbnQuXHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIHdlYmZvcm1zKCkge1xyXG4gICAgICAgIC8qPj5pbnB1dCovXHJcbiAgICAgICAgLy8gUnVuIHRocm91Z2ggSFRNTDUncyBuZXcgaW5wdXQgYXR0cmlidXRlcyB0byBzZWUgaWYgdGhlIFVBIHVuZGVyc3RhbmRzIGFueS5cclxuICAgICAgICAvLyBXZSdyZSB1c2luZyBmIHdoaWNoIGlzIHRoZSA8aW5wdXQ+IGVsZW1lbnQgY3JlYXRlZCBlYXJseSBvblxyXG4gICAgICAgIC8vIE1pa2UgVGF5bHIgaGFzIGNyZWF0ZWQgYSBjb21wcmVoZW5zaXZlIHJlc291cmNlIGZvciB0ZXN0aW5nIHRoZXNlIGF0dHJpYnV0ZXNcclxuICAgICAgICAvLyAgIHdoZW4gYXBwbGllZCB0byBhbGwgaW5wdXQgdHlwZXM6XHJcbiAgICAgICAgLy8gICBtaWtldGF5bHIuY29tL2NvZGUvaW5wdXQtdHlwZS1hdHRyLmh0bWxcclxuICAgICAgICAvLyBzcGVjOiB3d3cud2hhdHdnLm9yZy9zcGVjcy93ZWItYXBwcy9jdXJyZW50LXdvcmsvbXVsdGlwYWdlL3RoZS1pbnB1dC1lbGVtZW50Lmh0bWwjaW5wdXQtdHlwZS1hdHRyLXN1bW1hcnlcclxuXHJcbiAgICAgICAgLy8gT25seSBpbnB1dCBwbGFjZWhvbGRlciBpcyB0ZXN0ZWQgd2hpbGUgdGV4dGFyZWEncyBwbGFjZWhvbGRlciBpcyBub3QuXHJcbiAgICAgICAgLy8gQ3VycmVudGx5IFNhZmFyaSA0IGFuZCBPcGVyYSAxMSBoYXZlIHN1cHBvcnQgb25seSBmb3IgdGhlIGlucHV0IHBsYWNlaG9sZGVyXHJcbiAgICAgICAgLy8gQm90aCB0ZXN0cyBhcmUgYXZhaWxhYmxlIGluIGZlYXR1cmUtZGV0ZWN0cy9mb3Jtcy1wbGFjZWhvbGRlci5qc1xyXG4gICAgICAgIE1vZGVybml6clsnaW5wdXQnXSA9IChmdW5jdGlvbiggcHJvcHMgKSB7XHJcbiAgICAgICAgXHR2YXIgaW5wdXQxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuICAgICAgICAgICAgZm9yICggdmFyIGkgPSAwLCBsZW4gPSBwcm9wcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcclxuICAgICAgICAgICAgICAgIGF0dHJzWyBwcm9wc1tpXSBdID0gISEocHJvcHNbaV0gaW4gaW5wdXQxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoYXR0cnMubGlzdCl7XHJcbiAgICAgICAgICAgICAgLy8gc2FmYXJpIGZhbHNlIHBvc2l0aXZlJ3Mgb24gZGF0YWxpc3Q6IHdlYmsuaXQvNzQyNTJcclxuICAgICAgICAgICAgICAvLyBzZWUgYWxzbyBnaXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvaXNzdWVzLzE0NlxyXG4gICAgICAgICAgICAgIGF0dHJzLmxpc3QgPSAhIShkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkYXRhbGlzdCcpICYmIHdpbmRvdy5IVE1MRGF0YUxpc3RFbGVtZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYXR0cnM7XHJcbiAgICAgICAgfSkoJ2F1dG9jb21wbGV0ZSBhdXRvZm9jdXMgbGlzdCBwbGFjZWhvbGRlciBtYXggbWluIG11bHRpcGxlIHBhdHRlcm4gcmVxdWlyZWQgc3RlcCcuc3BsaXQoJyAnKSk7XHJcbiAgICAgICAgLyo+PmlucHV0Ki9cclxuICAgIH1cclxuXHJcbiAgICAvKj4+d2ViZm9ybXMqL1xyXG4gICAgLy8gaW5wdXQgdGVzdHMgbmVlZCB0byBydW4uXHJcbiAgICBNb2Rlcm5penIuaW5wdXQgfHwgd2ViZm9ybXMoKTtcclxuICAgIC8qPj53ZWJmb3JtcyovXHJcblxyXG4gIFxyXG5cclxuICAvLyBSdW4gZWFjaCB0ZXN0XHJcbiAgdGVzdFJ1bm5lcigpO1xyXG5cclxuICAvLyBSZW1vdmUgdGhlIFwibm8tanNcIiBjbGFzcyBpZiBpdCBleGlzdHNcclxuICBzZXRDbGFzc2VzKGNsYXNzZXMpO1xyXG5cclxuICBkZWxldGUgTW9kZXJuaXpyUHJvdG8uYWRkVGVzdDtcclxuICBkZWxldGUgTW9kZXJuaXpyUHJvdG8uYWRkQXN5bmNUZXN0O1xyXG5cclxuICAvLyBSdW4gdGhlIHRoaW5ncyB0aGF0IGFyZSBzdXBwb3NlZCB0byBydW4gYWZ0ZXIgdGhlIHRlc3RzXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBNb2Rlcm5penIuX3EubGVuZ3RoOyBpKyspIHtcclxuICAgIE1vZGVybml6ci5fcVtpXSgpO1xyXG4gIH1cclxuXHJcbiAgLy8gTGVhayBNb2Rlcm5penIgbmFtZXNwYWNlXHJcbiAgd2luZG93Lk1vZGVybml6ciA9IE1vZGVybml6cjtcclxuXHJcblxyXG47XHJcblxyXG59KSh3aW5kb3csIGRvY3VtZW50KTtcclxuIl19
