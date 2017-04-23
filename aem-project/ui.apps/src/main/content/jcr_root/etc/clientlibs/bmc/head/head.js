(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./vendor/modernizr-custom');

},{"./vendor/modernizr-custom":2}],2:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9oZWFkLmpzIiwianMvdmVuZG9yL21vZGVybml6ci1jdXN0b20uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZSgnLi92ZW5kb3IvbW9kZXJuaXpyLWN1c3RvbScpO1xuIiwiLyohXG4gKiBtb2Rlcm5penIgdjMuMy4xXG4gKiBCdWlsZCBodHRwOi8vbW9kZXJuaXpyLmNvbS9kb3dubG9hZD8tYmFja2dyb3VuZHNpemUtY3NzZ3JhZGllbnRzLWZsZXhib3gtZmxleGJveGxlZ2FjeS1zdmctdG91Y2hldmVudHMtdmlkZW8tbXEtc2V0Y2xhc3Nlcy1kb250bWluXG4gKlxuICogQ29weXJpZ2h0IChjKVxuICogIEZhcnVrIEF0ZXNcbiAqICBQYXVsIElyaXNoXG4gKiAgQWxleCBTZXh0b25cbiAqICBSeWFuIFNlZGRvblxuICogIFBhdHJpY2sgS2V0dG5lclxuICogIFN0dSBDb3hcbiAqICBSaWNoYXJkIEhlcnJlcmFcblxuICogTUlUIExpY2Vuc2VcbiAqL1xuXG4vKlxuICogTW9kZXJuaXpyIHRlc3RzIHdoaWNoIG5hdGl2ZSBDU1MzIGFuZCBIVE1MNSBmZWF0dXJlcyBhcmUgYXZhaWxhYmxlIGluIHRoZVxuICogY3VycmVudCBVQSBhbmQgbWFrZXMgdGhlIHJlc3VsdHMgYXZhaWxhYmxlIHRvIHlvdSBpbiB0d28gd2F5czogYXMgcHJvcGVydGllcyBvblxuICogYSBnbG9iYWwgYE1vZGVybml6cmAgb2JqZWN0LCBhbmQgYXMgY2xhc3NlcyBvbiB0aGUgYDxodG1sPmAgZWxlbWVudC4gVGhpc1xuICogaW5mb3JtYXRpb24gYWxsb3dzIHlvdSB0byBwcm9ncmVzc2l2ZWx5IGVuaGFuY2UgeW91ciBwYWdlcyB3aXRoIGEgZ3JhbnVsYXIgbGV2ZWxcbiAqIG9mIGNvbnRyb2wgb3ZlciB0aGUgZXhwZXJpZW5jZS5cbiovXG5cbjsoZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKXtcbiAgdmFyIGNsYXNzZXMgPSBbXTtcblxuXG4gIHZhciB0ZXN0cyA9IFtdO1xuICBpbnB1dHMgPSB7fTtcbiAgYXR0cnMgPSB7fTtcblxuXG4gIC8qKlxuICAgKlxuICAgKiBNb2Rlcm5penJQcm90byBpcyB0aGUgY29uc3RydWN0b3IgZm9yIE1vZGVybml6clxuICAgKlxuICAgKiBAY2xhc3NcbiAgICogQGFjY2VzcyBwdWJsaWNcbiAgICovXG5cbiAgdmFyIE1vZGVybml6clByb3RvID0ge1xuICAgIC8vIFRoZSBjdXJyZW50IHZlcnNpb24sIGR1bW15XG4gICAgX3ZlcnNpb246ICczLjMuMScsXG5cbiAgICAvLyBBbnkgc2V0dGluZ3MgdGhhdCBkb24ndCB3b3JrIGFzIHNlcGFyYXRlIG1vZHVsZXNcbiAgICAvLyBjYW4gZ28gaW4gaGVyZSBhcyBjb25maWd1cmF0aW9uLlxuICAgIF9jb25maWc6IHtcbiAgICAgICdjbGFzc1ByZWZpeCc6ICcnLFxuICAgICAgJ2VuYWJsZUNsYXNzZXMnOiB0cnVlLFxuICAgICAgJ2VuYWJsZUpTQ2xhc3MnOiB0cnVlLFxuICAgICAgJ3VzZVByZWZpeGVzJzogdHJ1ZVxuICAgIH0sXG5cbiAgICAvLyBRdWV1ZSBvZiB0ZXN0c1xuICAgIF9xOiBbXSxcblxuICAgIC8vIFN0dWIgdGhlc2UgZm9yIHBlb3BsZSB3aG8gYXJlIGxpc3RlbmluZ1xuICAgIG9uOiBmdW5jdGlvbih0ZXN0LCBjYikge1xuICAgICAgLy8gSSBkb24ndCByZWFsbHkgdGhpbmsgcGVvcGxlIHNob3VsZCBkbyB0aGlzLCBidXQgd2UgY2FuXG4gICAgICAvLyBzYWZlIGd1YXJkIGl0IGEgYml0LlxuICAgICAgLy8gLS0gTk9URTo6IHRoaXMgZ2V0cyBXQVkgb3ZlcnJpZGRlbiBpbiBzcmMvYWRkVGVzdCBmb3IgYWN0dWFsIGFzeW5jIHRlc3RzLlxuICAgICAgLy8gVGhpcyBpcyBpbiBjYXNlIHBlb3BsZSBsaXN0ZW4gdG8gc3luY2hyb25vdXMgdGVzdHMuIEkgd291bGQgbGVhdmUgaXQgb3V0LFxuICAgICAgLy8gYnV0IHRoZSBjb2RlIHRvICpkaXNhbGxvdyogc3luYyB0ZXN0cyBpbiB0aGUgcmVhbCB2ZXJzaW9uIG9mIHRoaXNcbiAgICAgIC8vIGZ1bmN0aW9uIGlzIGFjdHVhbGx5IGxhcmdlciB0aGFuIHRoaXMuXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBjYihzZWxmW3Rlc3RdKTtcbiAgICAgIH0sIDApO1xuICAgIH0sXG5cbiAgICBhZGRUZXN0OiBmdW5jdGlvbihuYW1lLCBmbiwgb3B0aW9ucykge1xuICAgICAgdGVzdHMucHVzaCh7bmFtZTogbmFtZSwgZm46IGZuLCBvcHRpb25zOiBvcHRpb25zfSk7XG4gICAgfSxcblxuICAgIGFkZEFzeW5jVGVzdDogZnVuY3Rpb24oZm4pIHtcbiAgICAgIHRlc3RzLnB1c2goe25hbWU6IG51bGwsIGZuOiBmbn0pO1xuICAgIH1cbiAgfTtcblxuXG5cbiAgLy8gRmFrZSBzb21lIG9mIE9iamVjdC5jcmVhdGUgc28gd2UgY2FuIGZvcmNlIG5vbiB0ZXN0IHJlc3VsdHMgdG8gYmUgbm9uIFwib3duXCIgcHJvcGVydGllcy5cbiAgdmFyIE1vZGVybml6ciA9IGZ1bmN0aW9uKCkge307XG4gIE1vZGVybml6ci5wcm90b3R5cGUgPSBNb2Rlcm5penJQcm90bztcblxuICAvLyBMZWFrIG1vZGVybml6ciBnbG9iYWxseSB3aGVuIHlvdSBgcmVxdWlyZWAgaXQgcmF0aGVyIHRoYW4gZm9yY2UgaXQgaGVyZS5cbiAgLy8gT3ZlcndyaXRlIG5hbWUgc28gY29uc3RydWN0b3IgbmFtZSBpcyBuaWNlciA6RFxuICBNb2Rlcm5penIgPSBuZXcgTW9kZXJuaXpyKCk7XG5cblxuLyohXG57XG4gIFwibmFtZVwiOiBcIlNWR1wiLFxuICBcInByb3BlcnR5XCI6IFwic3ZnXCIsXG4gIFwiY2FuaXVzZVwiOiBcInN2Z1wiLFxuICBcInRhZ3NcIjogW1wic3ZnXCJdLFxuICBcImF1dGhvcnNcIjogW1wiRXJpayBEYWhsc3Ryb21cIl0sXG4gIFwicG9seWZpbGxzXCI6IFtcbiAgICBcInN2Z3dlYlwiLFxuICAgIFwicmFwaGFlbFwiLFxuICAgIFwiYW1wbGVzZGtcIixcbiAgICBcImNhbnZnXCIsXG4gICAgXCJzdmctYm9pbGVycGxhdGVcIixcbiAgICBcInNpZVwiLFxuICAgIFwiZG9qb2dmeFwiLFxuICAgIFwiZmFicmljanNcIlxuICBdXG59XG4hKi9cbi8qIERPQ1xuRGV0ZWN0cyBzdXBwb3J0IGZvciBTVkcgaW4gYDxlbWJlZD5gIG9yIGA8b2JqZWN0PmAgZWxlbWVudHMuXG4qL1xuXG4gIE1vZGVybml6ci5hZGRUZXN0KCdzdmcnLCAhIWRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyAmJiAhIWRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3ZnJykuY3JlYXRlU1ZHUmVjdCk7XG5cblxuICAvKipcbiAgICogaXMgcmV0dXJucyBhIGJvb2xlYW4gaWYgdGhlIHR5cGVvZiBhbiBvYmogaXMgZXhhY3RseSB0eXBlLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICogQGZ1bmN0aW9uIGlzXG4gICAqIEBwYXJhbSB7Kn0gb2JqIC0gQSB0aGluZyB3ZSB3YW50IHRvIGNoZWNrIHRoZSB0eXBlIG9mXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIC0gQSBzdHJpbmcgdG8gY29tcGFyZSB0aGUgdHlwZW9mIGFnYWluc3RcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuXG4gIGZ1bmN0aW9uIGlzKG9iaiwgdHlwZSkge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSB0eXBlO1xuICB9XG4gIDtcblxuICAvKipcbiAgICogUnVuIHRocm91Z2ggYWxsIHRlc3RzIGFuZCBkZXRlY3QgdGhlaXIgc3VwcG9ydCBpbiB0aGUgY3VycmVudCBVQS5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHRlc3RSdW5uZXIoKSB7XG4gICAgdmFyIGZlYXR1cmVOYW1lcztcbiAgICB2YXIgZmVhdHVyZTtcbiAgICB2YXIgYWxpYXNJZHg7XG4gICAgdmFyIHJlc3VsdDtcbiAgICB2YXIgbmFtZUlkeDtcbiAgICB2YXIgZmVhdHVyZU5hbWU7XG4gICAgdmFyIGZlYXR1cmVOYW1lU3BsaXQ7XG5cbiAgICBmb3IgKHZhciBmZWF0dXJlSWR4IGluIHRlc3RzKSB7XG4gICAgICBpZiAodGVzdHMuaGFzT3duUHJvcGVydHkoZmVhdHVyZUlkeCkpIHtcbiAgICAgICAgZmVhdHVyZU5hbWVzID0gW107XG4gICAgICAgIGZlYXR1cmUgPSB0ZXN0c1tmZWF0dXJlSWR4XTtcbiAgICAgICAgLy8gcnVuIHRoZSB0ZXN0LCB0aHJvdyB0aGUgcmV0dXJuIHZhbHVlIGludG8gdGhlIE1vZGVybml6cixcbiAgICAgICAgLy8gdGhlbiBiYXNlZCBvbiB0aGF0IGJvb2xlYW4sIGRlZmluZSBhbiBhcHByb3ByaWF0ZSBjbGFzc05hbWVcbiAgICAgICAgLy8gYW5kIHB1c2ggaXQgaW50byBhbiBhcnJheSBvZiBjbGFzc2VzIHdlJ2xsIGpvaW4gbGF0ZXIuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIElmIHRoZXJlIGlzIG5vIG5hbWUsIGl0J3MgYW4gJ2FzeW5jJyB0ZXN0IHRoYXQgaXMgcnVuLFxuICAgICAgICAvLyBidXQgbm90IGRpcmVjdGx5IGFkZGVkIHRvIHRoZSBvYmplY3QuIFRoYXQgc2hvdWxkXG4gICAgICAgIC8vIGJlIGRvbmUgd2l0aCBhIHBvc3QtcnVuIGFkZFRlc3QgY2FsbC5cbiAgICAgICAgaWYgKGZlYXR1cmUubmFtZSkge1xuICAgICAgICAgIGZlYXR1cmVOYW1lcy5wdXNoKGZlYXR1cmUubmFtZS50b0xvd2VyQ2FzZSgpKTtcblxuICAgICAgICAgIGlmIChmZWF0dXJlLm9wdGlvbnMgJiYgZmVhdHVyZS5vcHRpb25zLmFsaWFzZXMgJiYgZmVhdHVyZS5vcHRpb25zLmFsaWFzZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBBZGQgYWxsIHRoZSBhbGlhc2VzIGludG8gdGhlIG5hbWVzIGxpc3RcbiAgICAgICAgICAgIGZvciAoYWxpYXNJZHggPSAwOyBhbGlhc0lkeCA8IGZlYXR1cmUub3B0aW9ucy5hbGlhc2VzLmxlbmd0aDsgYWxpYXNJZHgrKykge1xuICAgICAgICAgICAgICBmZWF0dXJlTmFtZXMucHVzaChmZWF0dXJlLm9wdGlvbnMuYWxpYXNlc1thbGlhc0lkeF0udG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUnVuIHRoZSB0ZXN0LCBvciB1c2UgdGhlIHJhdyB2YWx1ZSBpZiBpdCdzIG5vdCBhIGZ1bmN0aW9uXG4gICAgICAgIHJlc3VsdCA9IGlzKGZlYXR1cmUuZm4sICdmdW5jdGlvbicpID8gZmVhdHVyZS5mbigpIDogZmVhdHVyZS5mbjtcblxuXG4gICAgICAgIC8vIFNldCBlYWNoIG9mIHRoZSBuYW1lcyBvbiB0aGUgTW9kZXJuaXpyIG9iamVjdFxuICAgICAgICBmb3IgKG5hbWVJZHggPSAwOyBuYW1lSWR4IDwgZmVhdHVyZU5hbWVzLmxlbmd0aDsgbmFtZUlkeCsrKSB7XG4gICAgICAgICAgZmVhdHVyZU5hbWUgPSBmZWF0dXJlTmFtZXNbbmFtZUlkeF07XG4gICAgICAgICAgLy8gU3VwcG9ydCBkb3QgcHJvcGVydGllcyBhcyBzdWIgdGVzdHMuIFdlIGRvbid0IGRvIGNoZWNraW5nIHRvIG1ha2Ugc3VyZVxuICAgICAgICAgIC8vIHRoYXQgdGhlIGltcGxpZWQgcGFyZW50IHRlc3RzIGhhdmUgYmVlbiBhZGRlZC4gWW91IG11c3QgY2FsbCB0aGVtIGluXG4gICAgICAgICAgLy8gb3JkZXIgKGVpdGhlciBpbiB0aGUgdGVzdCwgb3IgbWFrZSB0aGUgcGFyZW50IHRlc3QgYSBkZXBlbmRlbmN5KS5cbiAgICAgICAgICAvL1xuICAgICAgICAgIC8vIENhcCBpdCB0byBUV08gdG8gbWFrZSB0aGUgbG9naWMgc2ltcGxlIGFuZCBiZWNhdXNlIHdobyBuZWVkcyB0aGF0IGtpbmQgb2Ygc3VidGVzdGluZ1xuICAgICAgICAgIC8vIGhhc2h0YWcgZmFtb3VzIGxhc3Qgd29yZHNcbiAgICAgICAgICBmZWF0dXJlTmFtZVNwbGl0ID0gZmVhdHVyZU5hbWUuc3BsaXQoJy4nKTtcblxuICAgICAgICAgIGlmIChmZWF0dXJlTmFtZVNwbGl0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgTW9kZXJuaXpyW2ZlYXR1cmVOYW1lU3BsaXRbMF1dID0gcmVzdWx0O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBjYXN0IHRvIGEgQm9vbGVhbiwgaWYgbm90IG9uZSBhbHJlYWR5XG4gICAgICAgICAgICAvKiBqc2hpbnQgLVcwNTMgKi9cbiAgICAgICAgICAgIGlmIChNb2Rlcm5penJbZmVhdHVyZU5hbWVTcGxpdFswXV0gJiYgIShNb2Rlcm5penJbZmVhdHVyZU5hbWVTcGxpdFswXV0gaW5zdGFuY2VvZiBCb29sZWFuKSkge1xuICAgICAgICAgICAgICBNb2Rlcm5penJbZmVhdHVyZU5hbWVTcGxpdFswXV0gPSBuZXcgQm9vbGVhbihNb2Rlcm5penJbZmVhdHVyZU5hbWVTcGxpdFswXV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBNb2Rlcm5penJbZmVhdHVyZU5hbWVTcGxpdFswXV1bZmVhdHVyZU5hbWVTcGxpdFsxXV0gPSByZXN1bHQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY2xhc3Nlcy5wdXNoKChyZXN1bHQgPyAnJyA6ICduby0nKSArIGZlYXR1cmVOYW1lU3BsaXQuam9pbignLScpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICA7XG5cbiAgLyoqXG4gICAqIGRvY0VsZW1lbnQgaXMgYSBjb252ZW5pZW5jZSB3cmFwcGVyIHRvIGdyYWIgdGhlIHJvb3QgZWxlbWVudCBvZiB0aGUgZG9jdW1lbnRcbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudHxTVkdFbGVtZW50fSBUaGUgcm9vdCBlbGVtZW50IG9mIHRoZSBkb2N1bWVudFxuICAgKi9cblxuICB2YXIgZG9jRWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcblxuXG4gIC8qKlxuICAgKiBBIGNvbnZlbmllbmNlIGhlbHBlciB0byBjaGVjayBpZiB0aGUgZG9jdW1lbnQgd2UgYXJlIHJ1bm5pbmcgaW4gaXMgYW4gU1ZHIGRvY3VtZW50XG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cbiAgdmFyIGlzU1ZHID0gZG9jRWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc3ZnJztcblxuXG4gIC8qKlxuICAgKiBzZXRDbGFzc2VzIHRha2VzIGFuIGFycmF5IG9mIGNsYXNzIG5hbWVzIGFuZCBhZGRzIHRoZW0gdG8gdGhlIHJvb3QgZWxlbWVudFxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICogQGZ1bmN0aW9uIHNldENsYXNzZXNcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gY2xhc3NlcyAtIEFycmF5IG9mIGNsYXNzIG5hbWVzXG4gICAqL1xuXG4gIC8vIFBhc3MgaW4gYW4gYW5kIGFycmF5IG9mIGNsYXNzIG5hbWVzLCBlLmcuOlxuICAvLyAgWyduby13ZWJwJywgJ2JvcmRlcnJhZGl1cycsIC4uLl1cbiAgZnVuY3Rpb24gc2V0Q2xhc3NlcyhjbGFzc2VzKSB7XG4gICAgdmFyIGNsYXNzTmFtZSA9IGRvY0VsZW1lbnQuY2xhc3NOYW1lO1xuICAgIHZhciBjbGFzc1ByZWZpeCA9IE1vZGVybml6ci5fY29uZmlnLmNsYXNzUHJlZml4IHx8ICcnO1xuXG4gICAgaWYgKGlzU1ZHKSB7XG4gICAgICBjbGFzc05hbWUgPSBjbGFzc05hbWUuYmFzZVZhbDtcbiAgICB9XG5cbiAgICAvLyBDaGFuZ2UgYG5vLWpzYCB0byBganNgIChpbmRlcGVuZGVudGx5IG9mIHRoZSBgZW5hYmxlQ2xhc3Nlc2Agb3B0aW9uKVxuICAgIC8vIEhhbmRsZSBjbGFzc1ByZWZpeCBvbiB0aGlzIHRvb1xuICAgIGlmIChNb2Rlcm5penIuX2NvbmZpZy5lbmFibGVKU0NsYXNzKSB7XG4gICAgICB2YXIgcmVKUyA9IG5ldyBSZWdFeHAoJyhefFxcXFxzKScgKyBjbGFzc1ByZWZpeCArICduby1qcyhcXFxcc3wkKScpO1xuICAgICAgY2xhc3NOYW1lID0gY2xhc3NOYW1lLnJlcGxhY2UocmVKUywgJyQxJyArIGNsYXNzUHJlZml4ICsgJ2pzJDInKTtcbiAgICB9XG5cbiAgICBpZiAoTW9kZXJuaXpyLl9jb25maWcuZW5hYmxlQ2xhc3Nlcykge1xuICAgICAgLy8gQWRkIHRoZSBuZXcgY2xhc3Nlc1xuICAgICAgY2xhc3NOYW1lICs9ICcgJyArIGNsYXNzUHJlZml4ICsgY2xhc3Nlcy5qb2luKCcgJyArIGNsYXNzUHJlZml4KTtcbiAgICAgIGlzU1ZHID8gZG9jRWxlbWVudC5jbGFzc05hbWUuYmFzZVZhbCA9IGNsYXNzTmFtZSA6IGRvY0VsZW1lbnQuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICAgIH1cblxuICB9XG5cbiAgO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIHByb3BlcnR5IHZhbHVlcyB0byBzZXQgZm9yIGNzcyB0ZXN0cy4gU2VlIHRpY2tldCAjMjFcbiAgICogaHR0cDovL2dpdC5pby92VUdsNFxuICAgKlxuICAgKiBAbWVtYmVyb2YgTW9kZXJuaXpyXG4gICAqIEBuYW1lIE1vZGVybml6ci5fcHJlZml4ZXNcbiAgICogQG9wdGlvbk5hbWUgTW9kZXJuaXpyLl9wcmVmaXhlc1xuICAgKiBAb3B0aW9uUHJvcCBwcmVmaXhlc1xuICAgKiBAYWNjZXNzIHB1YmxpY1xuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBNb2Rlcm5penIuX3ByZWZpeGVzIGlzIHRoZSBpbnRlcm5hbCBsaXN0IG9mIHByZWZpeGVzIHRoYXQgd2UgdGVzdCBhZ2FpbnN0XG4gICAqIGluc2lkZSBvZiB0aGluZ3MgbGlrZSBbcHJlZml4ZWRdKCNtb2Rlcm5penItcHJlZml4ZWQpIGFuZCBbcHJlZml4ZWRDU1NdKCMtY29kZS1tb2Rlcm5penItcHJlZml4ZWRjc3MpLiBJdCBpcyBzaW1wbHlcbiAgICogYW4gYXJyYXkgb2Yga2ViYWItY2FzZSB2ZW5kb3IgcHJlZml4ZXMgeW91IGNhbiB1c2Ugd2l0aGluIHlvdXIgY29kZS5cbiAgICpcbiAgICogU29tZSBjb21tb24gdXNlIGNhc2VzIGluY2x1ZGVcbiAgICpcbiAgICogR2VuZXJhdGluZyBhbGwgcG9zc2libGUgcHJlZml4ZWQgdmVyc2lvbiBvZiBhIENTUyBwcm9wZXJ0eVxuICAgKiBgYGBqc1xuICAgKiB2YXIgcnVsZSA9IE1vZGVybml6ci5fcHJlZml4ZXMuam9pbigndHJhbnNmb3JtOiByb3RhdGUoMjBkZWcpOyAnKTtcbiAgICpcbiAgICogcnVsZSA9PT0gJ3RyYW5zZm9ybTogcm90YXRlKDIwZGVnKTsgd2Via2l0LXRyYW5zZm9ybTogcm90YXRlKDIwZGVnKTsgbW96LXRyYW5zZm9ybTogcm90YXRlKDIwZGVnKTsgby10cmFuc2Zvcm06IHJvdGF0ZSgyMGRlZyk7IG1zLXRyYW5zZm9ybTogcm90YXRlKDIwZGVnKTsnXG4gICAqIGBgYFxuICAgKlxuICAgKiBHZW5lcmF0aW5nIGFsbCBwb3NzaWJsZSBwcmVmaXhlZCB2ZXJzaW9uIG9mIGEgQ1NTIHZhbHVlXG4gICAqIGBgYGpzXG4gICAqIHJ1bGUgPSAnZGlzcGxheTonICsgIE1vZGVybml6ci5fcHJlZml4ZXMuam9pbignZmxleDsgZGlzcGxheTonKSArICdmbGV4JztcbiAgICpcbiAgICogcnVsZSA9PT0gJ2Rpc3BsYXk6ZmxleDsgZGlzcGxheTotd2Via2l0LWZsZXg7IGRpc3BsYXk6LW1vei1mbGV4OyBkaXNwbGF5Oi1vLWZsZXg7IGRpc3BsYXk6LW1zLWZsZXg7IGRpc3BsYXk6ZmxleCdcbiAgICogYGBgXG4gICAqL1xuXG4gIHZhciBwcmVmaXhlcyA9IChNb2Rlcm5penJQcm90by5fY29uZmlnLnVzZVByZWZpeGVzID8gJyAtd2Via2l0LSAtbW96LSAtby0gLW1zLSAnLnNwbGl0KCcgJykgOiBbXSk7XG5cbiAgLy8gZXhwb3NlIHRoZXNlIGZvciB0aGUgcGx1Z2luIEFQSS4gTG9vayBpbiB0aGUgc291cmNlIGZvciBob3cgdG8gam9pbigpIHRoZW0gYWdhaW5zdCB5b3VyIGlucHV0XG4gIE1vZGVybml6clByb3RvLl9wcmVmaXhlcyA9IHByZWZpeGVzO1xuXG5cblxuICAvKipcbiAgICogY3JlYXRlRWxlbWVudCBpcyBhIGNvbnZlbmllbmNlIHdyYXBwZXIgYXJvdW5kIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQuIFNpbmNlIHdlXG4gICAqIHVzZSBjcmVhdGVFbGVtZW50IGFsbCBvdmVyIHRoZSBwbGFjZSwgdGhpcyBhbGxvd3MgZm9yIChzbGlnaHRseSkgc21hbGxlciBjb2RlXG4gICAqIGFzIHdlbGwgYXMgYWJzdHJhY3RpbmcgYXdheSBpc3N1ZXMgd2l0aCBjcmVhdGluZyBlbGVtZW50cyBpbiBjb250ZXh0cyBvdGhlciB0aGFuXG4gICAqIEhUTUwgZG9jdW1lbnRzIChlLmcuIFNWRyBkb2N1bWVudHMpLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICogQGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnRcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50fFNWR0VsZW1lbnR9IEFuIEhUTUwgb3IgU1ZHIGVsZW1lbnRcbiAgICovXG5cbiAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudCgpIHtcbiAgICBpZiAodHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIFRoaXMgaXMgdGhlIGNhc2UgaW4gSUU3LCB3aGVyZSB0aGUgdHlwZSBvZiBjcmVhdGVFbGVtZW50IGlzIFwib2JqZWN0XCIuXG4gICAgICAvLyBGb3IgdGhpcyByZWFzb24sIHdlIGNhbm5vdCBjYWxsIGFwcGx5KCkgYXMgT2JqZWN0IGlzIG5vdCBhIEZ1bmN0aW9uLlxuICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYXJndW1lbnRzWzBdKTtcbiAgICB9IGVsc2UgaWYgKGlzU1ZHKSB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TLmNhbGwoZG9jdW1lbnQsICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsIGFyZ3VtZW50c1swXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50LmFwcGx5KGRvY3VtZW50LCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIDtcbi8qIVxue1xuICBcIm5hbWVcIjogXCJIVE1MNSBWaWRlb1wiLFxuICBcInByb3BlcnR5XCI6IFwidmlkZW9cIixcbiAgXCJjYW5pdXNlXCI6IFwidmlkZW9cIixcbiAgXCJ0YWdzXCI6IFtcImh0bWw1XCJdLFxuICBcImtub3duQnVnc1wiOiBbXG4gICAgXCJXaXRob3V0IFF1aWNrVGltZSwgYE1vZGVybml6ci52aWRlby5oMjY0YCB3aWxsIGJlIGB1bmRlZmluZWRgOyBodHRwczovL2dpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci9pc3N1ZXMvNTQ2XCJcbiAgXSxcbiAgXCJwb2x5ZmlsbHNcIjogW1xuICAgIFwiaHRtbDVtZWRpYVwiLFxuICAgIFwibWVkaWFlbGVtZW50anNcIixcbiAgICBcInN1YmxpbWV2aWRlb1wiLFxuICAgIFwidmlkZW9qc1wiLFxuICAgIFwibGVhbmJhY2twbGF5ZXJcIixcbiAgICBcInZpZGVvZm9yZXZlcnlib2R5XCJcbiAgXVxufVxuISovXG4vKiBET0NcbkRldGVjdHMgc3VwcG9ydCBmb3IgdGhlIHZpZGVvIGVsZW1lbnQsIGFzIHdlbGwgYXMgdGVzdGluZyB3aGF0IHR5cGVzIG9mIGNvbnRlbnQgaXQgc3VwcG9ydHMuXG5cblN1YnByb3BlcnRpZXMgYXJlIHByb3ZpZGVkIHRvIGRlc2NyaWJlIHN1cHBvcnQgZm9yIGBvZ2dgLCBgaDI2NGAgYW5kIGB3ZWJtYCBmb3JtYXRzLCBlLmcuOlxuXG5gYGBqYXZhc2NyaXB0XG5Nb2Rlcm5penIudmlkZW8gICAgICAgICAvLyB0cnVlXG5Nb2Rlcm5penIudmlkZW8ub2dnICAgICAvLyAncHJvYmFibHknXG5gYGBcbiovXG5cbiAgLy8gQ29kZWMgdmFsdWVzIGZyb20gOiBnaXRodWIuY29tL05pZWxzTGVlbmhlZXIvaHRtbDV0ZXN0L2Jsb2IvOTEwNmE4L2luZGV4Lmh0bWwjTDg0NVxuICAvLyAgICAgICAgICAgICAgICAgICAgIHRoeCB0byBOaWVsc0xlZW5oZWVyIGFuZCB6Y29ycGFuXG5cbiAgLy8gTm90ZTogaW4gc29tZSBvbGRlciBicm93c2VycywgXCJub1wiIHdhcyBhIHJldHVybiB2YWx1ZSBpbnN0ZWFkIG9mIGVtcHR5IHN0cmluZy5cbiAgLy8gICBJdCB3YXMgbGl2ZSBpbiBGRjMuNS4wIGFuZCAzLjUuMSwgYnV0IGZpeGVkIGluIDMuNS4yXG4gIC8vICAgSXQgd2FzIGFsc28gbGl2ZSBpbiBTYWZhcmkgNC4wLjAgLSA0LjAuNCwgYnV0IGZpeGVkIGluIDQuMC41XG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ3ZpZGVvJywgZnVuY3Rpb24oKSB7XG4gICAgLyoganNoaW50IC1XMDUzICovXG4gICAgdmFyIGVsZW0gPSBjcmVhdGVFbGVtZW50KCd2aWRlbycpO1xuICAgIHZhciBib29sID0gZmFsc2U7XG5cbiAgICAvLyBJRTkgUnVubmluZyBvbiBXaW5kb3dzIFNlcnZlciBTS1UgY2FuIGNhdXNlIGFuIGV4Y2VwdGlvbiB0byBiZSB0aHJvd24sIGJ1ZyAjMjI0XG4gICAgdHJ5IHtcbiAgICAgIGlmIChib29sID0gISFlbGVtLmNhblBsYXlUeXBlKSB7XG4gICAgICAgIGJvb2wgPSBuZXcgQm9vbGVhbihib29sKTtcbiAgICAgICAgYm9vbC5vZ2cgPSBlbGVtLmNhblBsYXlUeXBlKCd2aWRlby9vZ2c7IGNvZGVjcz1cInRoZW9yYVwiJykucmVwbGFjZSgvXm5vJC8sICcnKTtcblxuICAgICAgICAvLyBXaXRob3V0IFF1aWNrVGltZSwgdGhpcyB2YWx1ZSB3aWxsIGJlIGB1bmRlZmluZWRgLiBnaXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvaXNzdWVzLzU0NlxuICAgICAgICBib29sLmgyNjQgPSBlbGVtLmNhblBsYXlUeXBlKCd2aWRlby9tcDQ7IGNvZGVjcz1cImF2YzEuNDJFMDFFXCInKS5yZXBsYWNlKC9ebm8kLywgJycpO1xuXG4gICAgICAgIGJvb2wud2VibSA9IGVsZW0uY2FuUGxheVR5cGUoJ3ZpZGVvL3dlYm07IGNvZGVjcz1cInZwOCwgdm9yYmlzXCInKS5yZXBsYWNlKC9ebm8kLywgJycpO1xuXG4gICAgICAgIGJvb2wudnA5ID0gZWxlbS5jYW5QbGF5VHlwZSgndmlkZW8vd2VibTsgY29kZWNzPVwidnA5XCInKS5yZXBsYWNlKC9ebm8kLywgJycpO1xuXG4gICAgICAgIGJvb2wuaGxzID0gZWxlbS5jYW5QbGF5VHlwZSgnYXBwbGljYXRpb24veC1tcGVnVVJMOyBjb2RlY3M9XCJhdmMxLjQyRTAxRVwiJykucmVwbGFjZSgvXm5vJC8sICcnKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7fVxuXG4gICAgcmV0dXJuIGJvb2w7XG4gIH0pO1xuXG4vKiFcbntcbiAgXCJuYW1lXCI6IFwiQ1NTIEdyYWRpZW50c1wiLFxuICBcImNhbml1c2VcIjogXCJjc3MtZ3JhZGllbnRzXCIsXG4gIFwicHJvcGVydHlcIjogXCJjc3NncmFkaWVudHNcIixcbiAgXCJ0YWdzXCI6IFtcImNzc1wiXSxcbiAgXCJrbm93bkJ1Z3NcIjogW1wiRmFsc2UtcG9zaXRpdmVzIG9uIHdlYk9TIChodHRwczovL2dpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci9pc3N1ZXMvMjAyKVwiXSxcbiAgXCJub3Rlc1wiOiBbe1xuICAgIFwibmFtZVwiOiBcIldlYmtpdCBHcmFkaWVudCBTeW50YXhcIixcbiAgICBcImhyZWZcIjogXCJodHRwczovL3dlYmtpdC5vcmcvYmxvZy8xNzUvaW50cm9kdWNpbmctY3NzLWdyYWRpZW50cy9cIlxuICB9LHtcbiAgICBcIm5hbWVcIjogXCJMaW5lYXIgR3JhZGllbnQgU3ludGF4XCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQ1NTL2xpbmVhci1ncmFkaWVudFwiXG4gIH0se1xuICAgIFwibmFtZVwiOiBcIlczQyBHcmFkaWVudCBTcGVjXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly9kcmFmdHMuY3Nzd2cub3JnL2Nzcy1pbWFnZXMtMy8jZ3JhZGllbnRzXCJcbiAgfV1cbn1cbiEqL1xuXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ2Nzc2dyYWRpZW50cycsIGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIHN0cjEgPSAnYmFja2dyb3VuZC1pbWFnZTonO1xuICAgIHZhciBzdHIyID0gJ2dyYWRpZW50KGxpbmVhcixsZWZ0IHRvcCxyaWdodCBib3R0b20sZnJvbSgjOWY5KSx0byh3aGl0ZSkpOyc7XG4gICAgdmFyIGNzcyA9ICcnO1xuICAgIHZhciBhbmdsZTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBwcmVmaXhlcy5sZW5ndGggLSAxOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGFuZ2xlID0gKGkgPT09IDAgPyAndG8gJyA6ICcnKTtcbiAgICAgIGNzcyArPSBzdHIxICsgcHJlZml4ZXNbaV0gKyAnbGluZWFyLWdyYWRpZW50KCcgKyBhbmdsZSArICdsZWZ0IHRvcCwgIzlmOSwgd2hpdGUpOyc7XG4gICAgfVxuXG4gICAgaWYgKE1vZGVybml6ci5fY29uZmlnLnVzZVByZWZpeGVzKSB7XG4gICAgLy8gbGVnYWN5IHdlYmtpdCBzeW50YXggKEZJWE1FOiByZW1vdmUgd2hlbiBzeW50YXggbm90IGluIHVzZSBhbnltb3JlKVxuICAgICAgY3NzICs9IHN0cjEgKyAnLXdlYmtpdC0nICsgc3RyMjtcbiAgICB9XG5cbiAgICB2YXIgZWxlbSA9IGNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICB2YXIgc3R5bGUgPSBlbGVtLnN0eWxlO1xuICAgIHN0eWxlLmNzc1RleHQgPSBjc3M7XG5cbiAgICAvLyBJRTYgcmV0dXJucyB1bmRlZmluZWQgc28gY2FzdCB0byBzdHJpbmdcbiAgICByZXR1cm4gKCcnICsgc3R5bGUuYmFja2dyb3VuZEltYWdlKS5pbmRleE9mKCdncmFkaWVudCcpID4gLTE7XG4gIH0pO1xuXG5cbiAgLyoqXG4gICAqIGdldEJvZHkgcmV0dXJucyB0aGUgYm9keSBvZiBhIGRvY3VtZW50LCBvciBhbiBlbGVtZW50IHRoYXQgY2FuIHN0YW5kIGluIGZvclxuICAgKiB0aGUgYm9keSBpZiBhIHJlYWwgYm9keSBkb2VzIG5vdCBleGlzdFxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICogQGZ1bmN0aW9uIGdldEJvZHlcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50fFNWR0VsZW1lbnR9IFJldHVybnMgdGhlIHJlYWwgYm9keSBvZiBhIGRvY3VtZW50LCBvciBhblxuICAgKiBhcnRpZmljaWFsbHkgY3JlYXRlZCBlbGVtZW50IHRoYXQgc3RhbmRzIGluIGZvciB0aGUgYm9keVxuICAgKi9cblxuICBmdW5jdGlvbiBnZXRCb2R5KCkge1xuICAgIC8vIEFmdGVyIHBhZ2UgbG9hZCBpbmplY3RpbmcgYSBmYWtlIGJvZHkgZG9lc24ndCB3b3JrIHNvIGNoZWNrIGlmIGJvZHkgZXhpc3RzXG4gICAgdmFyIGJvZHkgPSBkb2N1bWVudC5ib2R5O1xuXG4gICAgaWYgKCFib2R5KSB7XG4gICAgICAvLyBDYW4ndCB1c2UgdGhlIHJlYWwgYm9keSBjcmVhdGUgYSBmYWtlIG9uZS5cbiAgICAgIGJvZHkgPSBjcmVhdGVFbGVtZW50KGlzU1ZHID8gJ3N2ZycgOiAnYm9keScpO1xuICAgICAgYm9keS5mYWtlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gYm9keTtcbiAgfVxuXG4gIDtcblxuICAvKipcbiAgICogaW5qZWN0RWxlbWVudFdpdGhTdHlsZXMgaW5qZWN0cyBhbiBlbGVtZW50IHdpdGggc3R5bGUgZWxlbWVudCBhbmQgc29tZSBDU1MgcnVsZXNcbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqIEBmdW5jdGlvbiBpbmplY3RFbGVtZW50V2l0aFN0eWxlc1xuICAgKiBAcGFyYW0ge3N0cmluZ30gcnVsZSAtIFN0cmluZyByZXByZXNlbnRpbmcgYSBjc3MgcnVsZVxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIEEgZnVuY3Rpb24gdGhhdCBpcyB1c2VkIHRvIHRlc3QgdGhlIGluamVjdGVkIGVsZW1lbnRcbiAgICogQHBhcmFtIHtudW1iZXJ9IFtub2Rlc10gLSBBbiBpbnRlZ2VyIHJlcHJlc2VudGluZyB0aGUgbnVtYmVyIG9mIGFkZGl0aW9uYWwgbm9kZXMgeW91IHdhbnQgaW5qZWN0ZWRcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gW3Rlc3RuYW1lc10gLSBBbiBhcnJheSBvZiBzdHJpbmdzIHRoYXQgYXJlIHVzZWQgYXMgaWRzIGZvciB0aGUgYWRkaXRpb25hbCBub2Rlc1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cbiAgZnVuY3Rpb24gaW5qZWN0RWxlbWVudFdpdGhTdHlsZXMocnVsZSwgY2FsbGJhY2ssIG5vZGVzLCB0ZXN0bmFtZXMpIHtcbiAgICB2YXIgbW9kID0gJ21vZGVybml6cic7XG4gICAgdmFyIHN0eWxlO1xuICAgIHZhciByZXQ7XG4gICAgdmFyIG5vZGU7XG4gICAgdmFyIGRvY092ZXJmbG93O1xuICAgIHZhciBkaXYgPSBjcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB2YXIgYm9keSA9IGdldEJvZHkoKTtcblxuICAgIGlmIChwYXJzZUludChub2RlcywgMTApKSB7XG4gICAgICAvLyBJbiBvcmRlciBub3QgdG8gZ2l2ZSBmYWxzZSBwb3NpdGl2ZXMgd2UgY3JlYXRlIGEgbm9kZSBmb3IgZWFjaCB0ZXN0XG4gICAgICAvLyBUaGlzIGFsc28gYWxsb3dzIHRoZSBtZXRob2QgdG8gc2NhbGUgZm9yIHVuc3BlY2lmaWVkIHVzZXNcbiAgICAgIHdoaWxlIChub2Rlcy0tKSB7XG4gICAgICAgIG5vZGUgPSBjcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbm9kZS5pZCA9IHRlc3RuYW1lcyA/IHRlc3RuYW1lc1tub2Rlc10gOiBtb2QgKyAobm9kZXMgKyAxKTtcbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHN0eWxlID0gY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcbiAgICBzdHlsZS5pZCA9ICdzJyArIG1vZDtcblxuICAgIC8vIElFNiB3aWxsIGZhbHNlIHBvc2l0aXZlIG9uIHNvbWUgdGVzdHMgZHVlIHRvIHRoZSBzdHlsZSBlbGVtZW50IGluc2lkZSB0aGUgdGVzdCBkaXYgc29tZWhvdyBpbnRlcmZlcmluZyBvZmZzZXRIZWlnaHQsIHNvIGluc2VydCBpdCBpbnRvIGJvZHkgb3IgZmFrZWJvZHkuXG4gICAgLy8gT3BlcmEgd2lsbCBhY3QgYWxsIHF1aXJreSB3aGVuIGluamVjdGluZyBlbGVtZW50cyBpbiBkb2N1bWVudEVsZW1lbnQgd2hlbiBwYWdlIGlzIHNlcnZlZCBhcyB4bWwsIG5lZWRzIGZha2Vib2R5IHRvby4gIzI3MFxuICAgICghYm9keS5mYWtlID8gZGl2IDogYm9keSkuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgIGJvZHkuYXBwZW5kQ2hpbGQoZGl2KTtcblxuICAgIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG4gICAgICBzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBydWxlO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShydWxlKSk7XG4gICAgfVxuICAgIGRpdi5pZCA9IG1vZDtcblxuICAgIGlmIChib2R5LmZha2UpIHtcbiAgICAgIC8vYXZvaWQgY3Jhc2hpbmcgSUU4LCBpZiBiYWNrZ3JvdW5kIGltYWdlIGlzIHVzZWRcbiAgICAgIGJvZHkuc3R5bGUuYmFja2dyb3VuZCA9ICcnO1xuICAgICAgLy9TYWZhcmkgNS4xMy81LjEuNCBPU1ggc3RvcHMgbG9hZGluZyBpZiA6Oi13ZWJraXQtc2Nyb2xsYmFyIGlzIHVzZWQgYW5kIHNjcm9sbGJhcnMgYXJlIHZpc2libGVcbiAgICAgIGJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICAgIGRvY092ZXJmbG93ID0gZG9jRWxlbWVudC5zdHlsZS5vdmVyZmxvdztcbiAgICAgIGRvY0VsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICAgIGRvY0VsZW1lbnQuYXBwZW5kQ2hpbGQoYm9keSk7XG4gICAgfVxuXG4gICAgcmV0ID0gY2FsbGJhY2soZGl2LCBydWxlKTtcbiAgICAvLyBJZiB0aGlzIGlzIGRvbmUgYWZ0ZXIgcGFnZSBsb2FkIHdlIGRvbid0IHdhbnQgdG8gcmVtb3ZlIHRoZSBib2R5IHNvIGNoZWNrIGlmIGJvZHkgZXhpc3RzXG4gICAgaWYgKGJvZHkuZmFrZSkge1xuICAgICAgYm9keS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGJvZHkpO1xuICAgICAgZG9jRWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9IGRvY092ZXJmbG93O1xuICAgICAgLy8gVHJpZ2dlciBsYXlvdXQgc28ga2luZXRpYyBzY3JvbGxpbmcgaXNuJ3QgZGlzYWJsZWQgaW4gaU9TNitcbiAgICAgIGRvY0VsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgIH0gZWxzZSB7XG4gICAgICBkaXYucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkaXYpO1xuICAgIH1cblxuICAgIHJldHVybiAhIXJldDtcblxuICB9XG5cbiAgO1xuXG4gIC8qKlxuICAgKiB0ZXN0U3R5bGVzIGluamVjdHMgYW4gZWxlbWVudCB3aXRoIHN0eWxlIGVsZW1lbnQgYW5kIHNvbWUgQ1NTIHJ1bGVzXG4gICAqXG4gICAqIEBtZW1iZXJvZiBNb2Rlcm5penJcbiAgICogQG5hbWUgTW9kZXJuaXpyLnRlc3RTdHlsZXNcbiAgICogQG9wdGlvbk5hbWUgTW9kZXJuaXpyLnRlc3RTdHlsZXMoKVxuICAgKiBAb3B0aW9uUHJvcCB0ZXN0U3R5bGVzXG4gICAqIEBhY2Nlc3MgcHVibGljXG4gICAqIEBmdW5jdGlvbiB0ZXN0U3R5bGVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBydWxlIC0gU3RyaW5nIHJlcHJlc2VudGluZyBhIGNzcyBydWxlXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gQSBmdW5jdGlvbiB0aGF0IGlzIHVzZWQgdG8gdGVzdCB0aGUgaW5qZWN0ZWQgZWxlbWVudFxuICAgKiBAcGFyYW0ge251bWJlcn0gW25vZGVzXSAtIEFuIGludGVnZXIgcmVwcmVzZW50aW5nIHRoZSBudW1iZXIgb2YgYWRkaXRpb25hbCBub2RlcyB5b3Ugd2FudCBpbmplY3RlZFxuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBbdGVzdG5hbWVzXSAtIEFuIGFycmF5IG9mIHN0cmluZ3MgdGhhdCBhcmUgdXNlZCBhcyBpZHMgZm9yIHRoZSBhZGRpdGlvbmFsIG5vZGVzXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBgTW9kZXJuaXpyLnRlc3RTdHlsZXNgIHRha2VzIGEgQ1NTIHJ1bGUgYW5kIGluamVjdHMgaXQgb250byB0aGUgY3VycmVudCBwYWdlXG4gICAqIGFsb25nIHdpdGggKHBvc3NpYmx5IG11bHRpcGxlKSBET00gZWxlbWVudHMuIFRoaXMgbGV0cyB5b3UgY2hlY2sgZm9yIGZlYXR1cmVzXG4gICAqIHRoYXQgY2FuIG5vdCBiZSBkZXRlY3RlZCBieSBzaW1wbHkgY2hlY2tpbmcgdGhlIFtJRExdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvTW96aWxsYS9EZXZlbG9wZXJfZ3VpZGUvSW50ZXJmYWNlX2RldmVsb3BtZW50X2d1aWRlL0lETF9pbnRlcmZhY2VfcnVsZXMpLlxuICAgKlxuICAgKiBgYGBqc1xuICAgKiBNb2Rlcm5penIudGVzdFN0eWxlcygnI21vZGVybml6ciB7IHdpZHRoOiA5cHg7IGNvbG9yOiBwYXBheWF3aGlwOyB9JywgZnVuY3Rpb24oZWxlbSwgcnVsZSkge1xuICAgKiAgIC8vIGVsZW0gaXMgdGhlIGZpcnN0IERPTSBub2RlIGluIHRoZSBwYWdlIChieSBkZWZhdWx0ICNtb2Rlcm5penIpXG4gICAqICAgLy8gcnVsZSBpcyB0aGUgZmlyc3QgYXJndW1lbnQgeW91IHN1cHBsaWVkIC0gdGhlIENTUyBydWxlIGluIHN0cmluZyBmb3JtXG4gICAqXG4gICAqICAgYWRkVGVzdCgnd2lkdGh3b3JrcycsIGVsZW0uc3R5bGUud2lkdGggPT09ICc5cHgnKVxuICAgKiB9KTtcbiAgICogYGBgXG4gICAqXG4gICAqIElmIHlvdXIgdGVzdCByZXF1aXJlcyBtdWx0aXBsZSBub2RlcywgeW91IGNhbiBpbmNsdWRlIGEgdGhpcmQgYXJndW1lbnRcbiAgICogaW5kaWNhdGluZyBob3cgbWFueSBhZGRpdGlvbmFsIGRpdiBlbGVtZW50cyB0byBpbmNsdWRlIG9uIHRoZSBwYWdlLiBUaGVcbiAgICogYWRkaXRpb25hbCBub2RlcyBhcmUgaW5qZWN0ZWQgYXMgY2hpbGRyZW4gb2YgdGhlIGBlbGVtYCB0aGF0IGlzIHJldHVybmVkIGFzXG4gICAqIHRoZSBmaXJzdCBhcmd1bWVudCB0byB0aGUgY2FsbGJhY2suXG4gICAqXG4gICAqIGBgYGpzXG4gICAqIE1vZGVybml6ci50ZXN0U3R5bGVzKCcjbW9kZXJuaXpyIHt3aWR0aDogMXB4fTsgI21vZGVybml6cjIge3dpZHRoOiAycHh9JywgZnVuY3Rpb24oZWxlbSkge1xuICAgKiAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2Rlcm5penInKS5zdHlsZS53aWR0aCA9PT0gJzFweCc7IC8vIHRydWVcbiAgICogICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kZXJuaXpyMicpLnN0eWxlLndpZHRoID09PSAnMnB4JzsgLy8gdHJ1ZVxuICAgKiAgIGVsZW0uZmlyc3RDaGlsZCA9PT0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGVybml6cjInKTsgLy8gdHJ1ZVxuICAgKiB9LCAxKTtcbiAgICogYGBgXG4gICAqXG4gICAqIEJ5IGRlZmF1bHQsIGFsbCBvZiB0aGUgYWRkaXRpb25hbCBlbGVtZW50cyBoYXZlIGFuIElEIG9mIGBtb2Rlcm5penJbbl1gLCB3aGVyZVxuICAgKiBgbmAgaXMgaXRzIGluZGV4IChlLmcuIHRoZSBmaXJzdCBhZGRpdGlvbmFsLCBzZWNvbmQgb3ZlcmFsbCBpcyBgI21vZGVybml6cjJgLFxuICAgKiB0aGUgc2Vjb25kIGFkZGl0aW9uYWwgaXMgYCNtb2Rlcm5penIzYCwgZXRjLikuXG4gICAqIElmIHlvdSB3YW50IHRvIGhhdmUgbW9yZSBtZWFuaW5nZnVsIElEcyBmb3IgeW91ciBmdW5jdGlvbiwgeW91IGNhbiBwcm92aWRlXG4gICAqIHRoZW0gYXMgdGhlIGZvdXJ0aCBhcmd1bWVudCwgYXMgYW4gYXJyYXkgb2Ygc3RyaW5nc1xuICAgKlxuICAgKiBgYGBqc1xuICAgKiBNb2Rlcm5penIudGVzdFN0eWxlcygnI2ZvbyB7d2lkdGg6IDEwcHh9OyAjYmFyIHtoZWlnaHQ6IDIwcHh9JywgZnVuY3Rpb24oZWxlbSkge1xuICAgKiAgIGVsZW0uZmlyc3RDaGlsZCA9PT0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZvbycpOyAvLyB0cnVlXG4gICAqICAgZWxlbS5sYXN0Q2hpbGQgPT09IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYXInKTsgLy8gdHJ1ZVxuICAgKiB9LCAyLCBbJ2ZvbycsICdiYXInXSk7XG4gICAqIGBgYFxuICAgKlxuICAgKi9cblxuICB2YXIgdGVzdFN0eWxlcyA9IE1vZGVybml6clByb3RvLnRlc3RTdHlsZXMgPSBpbmplY3RFbGVtZW50V2l0aFN0eWxlcztcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIlRvdWNoIEV2ZW50c1wiLFxuICBcInByb3BlcnR5XCI6IFwidG91Y2hldmVudHNcIixcbiAgXCJjYW5pdXNlXCIgOiBcInRvdWNoXCIsXG4gIFwidGFnc1wiOiBbXCJtZWRpYVwiLCBcImF0dHJpYnV0ZVwiXSxcbiAgXCJub3Rlc1wiOiBbe1xuICAgIFwibmFtZVwiOiBcIlRvdWNoIEV2ZW50cyBzcGVjXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly93d3cudzMub3JnL1RSLzIwMTMvV0QtdG91Y2gtZXZlbnRzLTIwMTMwMTI0L1wiXG4gIH1dLFxuICBcIndhcm5pbmdzXCI6IFtcbiAgICBcIkluZGljYXRlcyBpZiB0aGUgYnJvd3NlciBzdXBwb3J0cyB0aGUgVG91Y2ggRXZlbnRzIHNwZWMsIGFuZCBkb2VzIG5vdCBuZWNlc3NhcmlseSByZWZsZWN0IGEgdG91Y2hzY3JlZW4gZGV2aWNlXCJcbiAgXSxcbiAgXCJrbm93bkJ1Z3NcIjogW1xuICAgIFwiRmFsc2UtcG9zaXRpdmUgb24gc29tZSBjb25maWd1cmF0aW9ucyBvZiBOb2tpYSBOOTAwXCIsXG4gICAgXCJGYWxzZS1wb3NpdGl2ZSBvbiBzb21lIEJsYWNrQmVycnkgNi4wIGJ1aWxkcyDigJMgaHR0cHM6Ly9naXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvaXNzdWVzLzM3MiNpc3N1ZWNvbW1lbnQtMzExMjY5NVwiXG4gIF1cbn1cbiEqL1xuLyogRE9DXG5JbmRpY2F0ZXMgaWYgdGhlIGJyb3dzZXIgc3VwcG9ydHMgdGhlIFczQyBUb3VjaCBFdmVudHMgQVBJLlxuXG5UaGlzICpkb2VzIG5vdCogbmVjZXNzYXJpbHkgcmVmbGVjdCBhIHRvdWNoc2NyZWVuIGRldmljZTpcblxuKiBPbGRlciB0b3VjaHNjcmVlbiBkZXZpY2VzIG9ubHkgZW11bGF0ZSBtb3VzZSBldmVudHNcbiogTW9kZXJuIElFIHRvdWNoIGRldmljZXMgaW1wbGVtZW50IHRoZSBQb2ludGVyIEV2ZW50cyBBUEkgaW5zdGVhZDogdXNlIGBNb2Rlcm5penIucG9pbnRlcmV2ZW50c2AgdG8gZGV0ZWN0IHN1cHBvcnQgZm9yIHRoYXRcbiogU29tZSBicm93c2VycyAmIE9TIHNldHVwcyBtYXkgZW5hYmxlIHRvdWNoIEFQSXMgd2hlbiBubyB0b3VjaHNjcmVlbiBpcyBjb25uZWN0ZWRcbiogRnV0dXJlIGJyb3dzZXJzIG1heSBpbXBsZW1lbnQgb3RoZXIgZXZlbnQgbW9kZWxzIGZvciB0b3VjaCBpbnRlcmFjdGlvbnNcblxuU2VlIHRoaXMgYXJ0aWNsZTogW1lvdSBDYW4ndCBEZXRlY3QgQSBUb3VjaHNjcmVlbl0oaHR0cDovL3d3dy5zdHVjb3guY29tL2Jsb2cveW91LWNhbnQtZGV0ZWN0LWEtdG91Y2hzY3JlZW4vKS5cblxuSXQncyByZWNvbW1lbmRlZCB0byBiaW5kIGJvdGggbW91c2UgYW5kIHRvdWNoL3BvaW50ZXIgZXZlbnRzIHNpbXVsdGFuZW91c2x5IOKAkyBzZWUgW3RoaXMgSFRNTDUgUm9ja3MgdHV0b3JpYWxdKGh0dHA6Ly93d3cuaHRtbDVyb2Nrcy5jb20vZW4vbW9iaWxlL3RvdWNoYW5kbW91c2UvKS5cblxuVGhpcyB0ZXN0IHdpbGwgYWxzbyByZXR1cm4gYHRydWVgIGZvciBGaXJlZm94IDQgTXVsdGl0b3VjaCBzdXBwb3J0LlxuKi9cblxuICAvLyBDaHJvbWUgKGRlc2t0b3ApIHVzZWQgdG8gbGllIGFib3V0IGl0cyBzdXBwb3J0IG9uIHRoaXMsIGJ1dCB0aGF0IGhhcyBzaW5jZSBiZWVuIHJlY3RpZmllZDogaHR0cDovL2NyYnVnLmNvbS8zNjQxNVxuICBNb2Rlcm5penIuYWRkVGVzdCgndG91Y2hldmVudHMnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgYm9vbDtcbiAgICBpZiAoKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdykgfHwgd2luZG93LkRvY3VtZW50VG91Y2ggJiYgZG9jdW1lbnQgaW5zdGFuY2VvZiBEb2N1bWVudFRvdWNoKSB7XG4gICAgICBib29sID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaW5jbHVkZSB0aGUgJ2hlYXJ0eicgYXMgYSB3YXkgdG8gaGF2ZSBhIG5vbiBtYXRjaGluZyBNUSB0byBoZWxwIHRlcm1pbmF0ZSB0aGUgam9pblxuICAgICAgLy8gaHR0cHM6Ly9naXQuaW8vdnpuRkhcbiAgICAgIHZhciBxdWVyeSA9IFsnQG1lZGlhICgnLCBwcmVmaXhlcy5qb2luKCd0b3VjaC1lbmFibGVkKSwoJyksICdoZWFydHonLCAnKScsICd7I21vZGVybml6cnt0b3A6OXB4O3Bvc2l0aW9uOmFic29sdXRlfX0nXS5qb2luKCcnKTtcbiAgICAgIHRlc3RTdHlsZXMocXVlcnksIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgYm9vbCA9IG5vZGUub2Zmc2V0VG9wID09PSA5O1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBib29sO1xuICB9KTtcblxuXG4gIC8qKlxuICAgKiBNb2Rlcm5penIubXEgdGVzdHMgYSBnaXZlbiBtZWRpYSBxdWVyeSwgbGl2ZSBhZ2FpbnN0IHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSB3aW5kb3dcbiAgICogYWRhcHRlZCBmcm9tIG1hdGNoTWVkaWEgcG9seWZpbGwgYnkgU2NvdHQgSmVobCBhbmQgUGF1bCBJcmlzaFxuICAgKiBnaXN0LmdpdGh1Yi5jb20vNzg2NzY4XG4gICAqXG4gICAqIEBtZW1iZXJvZiBNb2Rlcm5penJcbiAgICogQG5hbWUgTW9kZXJuaXpyLm1xXG4gICAqIEBvcHRpb25OYW1lIE1vZGVybml6ci5tcSgpXG4gICAqIEBvcHRpb25Qcm9wIG1xXG4gICAqIEBhY2Nlc3MgcHVibGljXG4gICAqIEBmdW5jdGlvbiBtcVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbXEgLSBTdHJpbmcgb2YgdGhlIG1lZGlhIHF1ZXJ5IHdlIHdhbnQgdG8gdGVzdFxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICogQGV4YW1wbGVcbiAgICogTW9kZXJuaXpyLm1xIGFsbG93cyBmb3IgeW91IHRvIHByb2dyYW1tYXRpY2FsbHkgY2hlY2sgaWYgdGhlIGN1cnJlbnQgYnJvd3NlclxuICAgKiB3aW5kb3cgc3RhdGUgbWF0Y2hlcyBhIG1lZGlhIHF1ZXJ5LlxuICAgKlxuICAgKiBgYGBqc1xuICAgKiAgdmFyIHF1ZXJ5ID0gTW9kZXJuaXpyLm1xKCcobWluLXdpZHRoOiA5MDBweCknKTtcbiAgICpcbiAgICogIGlmIChxdWVyeSkge1xuICAgKiAgICAvLyB0aGUgYnJvd3NlciB3aW5kb3cgaXMgbGFyZ2VyIHRoYW4gOTAwcHhcbiAgICogIH1cbiAgICogYGBgXG4gICAqXG4gICAqIE9ubHkgdmFsaWQgbWVkaWEgcXVlcmllcyBhcmUgc3VwcG9ydGVkLCB0aGVyZWZvcmUgeW91IG11c3QgYWx3YXlzIGluY2x1ZGUgdmFsdWVzXG4gICAqIHdpdGggeW91ciBtZWRpYSBxdWVyeVxuICAgKlxuICAgKiBgYGBqc1xuICAgKiAvLyBnb29kXG4gICAqICBNb2Rlcm5penIubXEoJyhtaW4td2lkdGg6IDkwMHB4KScpO1xuICAgKlxuICAgKiAvLyBiYWRcbiAgICogIE1vZGVybml6ci5tcSgnbWluLXdpZHRoJyk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBJZiB5b3Ugd291bGQganVzdCBsaWtlIHRvIHRlc3QgdGhhdCBtZWRpYSBxdWVyaWVzIGFyZSBzdXBwb3J0ZWQgaW4gZ2VuZXJhbCwgdXNlXG4gICAqXG4gICAqIGBgYGpzXG4gICAqICBNb2Rlcm5penIubXEoJ29ubHkgYWxsJyk7IC8vIHRydWUgaWYgTVEgYXJlIHN1cHBvcnRlZCwgZmFsc2UgaWYgbm90XG4gICAqIGBgYFxuICAgKlxuICAgKlxuICAgKiBOb3RlIHRoYXQgaWYgdGhlIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBtZWRpYSBxdWVyaWVzIChlLmcuIG9sZCBJRSkgbXEgd2lsbFxuICAgKiBhbHdheXMgcmV0dXJuIGZhbHNlLlxuICAgKi9cblxuICB2YXIgbXEgPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIG1hdGNoTWVkaWEgPSB3aW5kb3cubWF0Y2hNZWRpYSB8fCB3aW5kb3cubXNNYXRjaE1lZGlhO1xuICAgIGlmIChtYXRjaE1lZGlhKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24obXEpIHtcbiAgICAgICAgdmFyIG1xbCA9IG1hdGNoTWVkaWEobXEpO1xuICAgICAgICByZXR1cm4gbXFsICYmIG1xbC5tYXRjaGVzIHx8IGZhbHNlO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24obXEpIHtcbiAgICAgIHZhciBib29sID0gZmFsc2U7XG5cbiAgICAgIGluamVjdEVsZW1lbnRXaXRoU3R5bGVzKCdAbWVkaWEgJyArIG1xICsgJyB7ICNtb2Rlcm5penIgeyBwb3NpdGlvbjogYWJzb2x1dGU7IH0gfScsIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgYm9vbCA9ICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSA/XG4gICAgICAgICAgICAgICAgd2luZG93LmdldENvbXB1dGVkU3R5bGUobm9kZSwgbnVsbCkgOlxuICAgICAgICAgICAgICAgIG5vZGUuY3VycmVudFN0eWxlKS5wb3NpdGlvbiA9PSAnYWJzb2x1dGUnO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBib29sO1xuICAgIH07XG4gIH0pKCk7XG5cblxuICBNb2Rlcm5penJQcm90by5tcSA9IG1xO1xuXG5cblxuICAvKipcbiAgICogSWYgdGhlIGJyb3dzZXJzIGZvbGxvdyB0aGUgc3BlYywgdGhlbiB0aGV5IHdvdWxkIGV4cG9zZSB2ZW5kb3Itc3BlY2lmaWMgc3R5bGUgYXM6XG4gICAqICAgZWxlbS5zdHlsZS5XZWJraXRCb3JkZXJSYWRpdXNcbiAgICogaW5zdGVhZCBvZiBzb21ldGhpbmcgbGlrZSB0aGUgZm9sbG93aW5nLCB3aGljaCB3b3VsZCBiZSB0ZWNobmljYWxseSBpbmNvcnJlY3Q6XG4gICAqICAgZWxlbS5zdHlsZS53ZWJraXRCb3JkZXJSYWRpdXNcblxuICAgKiBXZWJraXQgZ2hvc3RzIHRoZWlyIHByb3BlcnRpZXMgaW4gbG93ZXJjYXNlIGJ1dCBPcGVyYSAmIE1veiBkbyBub3QuXG4gICAqIE1pY3Jvc29mdCB1c2VzIGEgbG93ZXJjYXNlIGBtc2AgaW5zdGVhZCBvZiB0aGUgY29ycmVjdCBgTXNgIGluIElFOCtcbiAgICogICBlcmlrLmVhZS5uZXQvYXJjaGl2ZXMvMjAwOC8wMy8xMC8yMS40OC4xMC9cblxuICAgKiBNb3JlIGhlcmU6IGdpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci9pc3N1ZXMvaXNzdWUvMjFcbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2ZW5kb3Itc3BlY2lmaWMgc3R5bGUgcHJvcGVydGllc1xuICAgKi9cblxuICB2YXIgb21QcmVmaXhlcyA9ICdNb3ogTyBtcyBXZWJraXQnO1xuXG5cbiAgdmFyIGNzc29tUHJlZml4ZXMgPSAoTW9kZXJuaXpyUHJvdG8uX2NvbmZpZy51c2VQcmVmaXhlcyA/IG9tUHJlZml4ZXMuc3BsaXQoJyAnKSA6IFtdKTtcbiAgTW9kZXJuaXpyUHJvdG8uX2Nzc29tUHJlZml4ZXMgPSBjc3NvbVByZWZpeGVzO1xuXG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgSmF2YVNjcmlwdCBET00gdmFsdWVzIHVzZWQgZm9yIHRlc3RzXG4gICAqXG4gICAqIEBtZW1iZXJvZiBNb2Rlcm5penJcbiAgICogQG5hbWUgTW9kZXJuaXpyLl9kb21QcmVmaXhlc1xuICAgKiBAb3B0aW9uTmFtZSBNb2Rlcm5penIuX2RvbVByZWZpeGVzXG4gICAqIEBvcHRpb25Qcm9wIGRvbVByZWZpeGVzXG4gICAqIEBhY2Nlc3MgcHVibGljXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIE1vZGVybml6ci5fZG9tUHJlZml4ZXMgaXMgZXhhY3RseSB0aGUgc2FtZSBhcyBbX3ByZWZpeGVzXSgjbW9kZXJuaXpyLV9wcmVmaXhlcyksIGJ1dCByYXRoZXJcbiAgICogdGhhbiBrZWJhYi1jYXNlIHByb3BlcnRpZXMsIGFsbCBwcm9wZXJ0aWVzIGFyZSB0aGVpciBDYXBpdGFsaXplZCB2YXJpYW50XG4gICAqXG4gICAqIGBgYGpzXG4gICAqIE1vZGVybml6ci5fZG9tUHJlZml4ZXMgPT09IFsgXCJNb3pcIiwgXCJPXCIsIFwibXNcIiwgXCJXZWJraXRcIiBdO1xuICAgKiBgYGBcbiAgICovXG5cbiAgdmFyIGRvbVByZWZpeGVzID0gKE1vZGVybml6clByb3RvLl9jb25maWcudXNlUHJlZml4ZXMgPyBvbVByZWZpeGVzLnRvTG93ZXJDYXNlKCkuc3BsaXQoJyAnKSA6IFtdKTtcbiAgTW9kZXJuaXpyUHJvdG8uX2RvbVByZWZpeGVzID0gZG9tUHJlZml4ZXM7XG5cblxuXG4gIC8qKlxuICAgKiBjb250YWlucyBjaGVja3MgdG8gc2VlIGlmIGEgc3RyaW5nIGNvbnRhaW5zIGFub3RoZXIgc3RyaW5nXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKiBAZnVuY3Rpb24gY29udGFpbnNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0ciAtIFRoZSBzdHJpbmcgd2Ugd2FudCB0byBjaGVjayBmb3Igc3Vic3RyaW5nc1xuICAgKiBAcGFyYW0ge3N0cmluZ30gc3Vic3RyIC0gVGhlIHN1YnN0cmluZyB3ZSB3YW50IHRvIHNlYXJjaCB0aGUgZmlyc3Qgc3RyaW5nIGZvclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cbiAgZnVuY3Rpb24gY29udGFpbnMoc3RyLCBzdWJzdHIpIHtcbiAgICByZXR1cm4gISF+KCcnICsgc3RyKS5pbmRleE9mKHN1YnN0cik7XG4gIH1cblxuICA7XG5cbiAgLyoqXG4gICAqIGNzc1RvRE9NIHRha2VzIGEga2ViYWItY2FzZSBzdHJpbmcgYW5kIGNvbnZlcnRzIGl0IHRvIGNhbWVsQ2FzZVxuICAgKiBlLmcuIGJveC1zaXppbmcgLT4gYm94U2l6aW5nXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKiBAZnVuY3Rpb24gY3NzVG9ET01cbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBTdHJpbmcgbmFtZSBvZiBrZWJhYi1jYXNlIHByb3Agd2Ugd2FudCB0byBjb252ZXJ0XG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjYW1lbENhc2UgdmVyc2lvbiBvZiB0aGUgc3VwcGxpZWQgbmFtZVxuICAgKi9cblxuICBmdW5jdGlvbiBjc3NUb0RPTShuYW1lKSB7XG4gICAgcmV0dXJuIG5hbWUucmVwbGFjZSgvKFthLXpdKS0oW2Etel0pL2csIGZ1bmN0aW9uKHN0ciwgbTEsIG0yKSB7XG4gICAgICByZXR1cm4gbTEgKyBtMi50b1VwcGVyQ2FzZSgpO1xuICAgIH0pLnJlcGxhY2UoL14tLywgJycpO1xuICB9XG4gIDtcblxuICAvKipcbiAgICogZm5CaW5kIGlzIGEgc3VwZXIgc21hbGwgW2JpbmRdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0Z1bmN0aW9uL2JpbmQpIHBvbHlmaWxsLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICogQGZ1bmN0aW9uIGZuQmluZFxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmbiAtIGEgZnVuY3Rpb24geW91IHdhbnQgdG8gY2hhbmdlIGB0aGlzYCByZWZlcmVuY2UgdG9cbiAgICogQHBhcmFtIHtvYmplY3R9IHRoYXQgLSB0aGUgYHRoaXNgIHlvdSB3YW50IHRvIGNhbGwgdGhlIGZ1bmN0aW9uIHdpdGhcbiAgICogQHJldHVybnMge2Z1bmN0aW9ufSBUaGUgd3JhcHBlZCB2ZXJzaW9uIG9mIHRoZSBzdXBwbGllZCBmdW5jdGlvblxuICAgKi9cblxuICBmdW5jdGlvbiBmbkJpbmQoZm4sIHRoYXQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9XG5cbiAgO1xuXG4gIC8qKlxuICAgKiB0ZXN0RE9NUHJvcHMgaXMgYSBnZW5lcmljIERPTSBwcm9wZXJ0eSB0ZXN0OyBpZiBhIGJyb3dzZXIgc3VwcG9ydHNcbiAgICogICBhIGNlcnRhaW4gcHJvcGVydHksIGl0IHdvbid0IHJldHVybiB1bmRlZmluZWQgZm9yIGl0LlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICogQGZ1bmN0aW9uIHRlc3RET01Qcm9wc1xuICAgKiBAcGFyYW0ge2FycmF5LjxzdHJpbmc+fSBwcm9wcyAtIEFuIGFycmF5IG9mIHByb3BlcnRpZXMgdG8gdGVzdCBmb3JcbiAgICogQHBhcmFtIHtvYmplY3R9IG9iaiAtIEFuIG9iamVjdCBvciBFbGVtZW50IHlvdSB3YW50IHRvIHVzZSB0byB0ZXN0IHRoZSBwYXJhbWV0ZXJzIGFnYWluXG4gICAqIEBwYXJhbSB7Ym9vbGVhbnxvYmplY3R9IGVsZW0gLSBBbiBFbGVtZW50IHRvIGJpbmQgdGhlIHByb3BlcnR5IGxvb2t1cCBhZ2Fpbi4gVXNlIGBmYWxzZWAgdG8gcHJldmVudCB0aGUgY2hlY2tcbiAgICovXG4gIGZ1bmN0aW9uIHRlc3RET01Qcm9wcyhwcm9wcywgb2JqLCBlbGVtKSB7XG4gICAgdmFyIGl0ZW07XG5cbiAgICBmb3IgKHZhciBpIGluIHByb3BzKSB7XG4gICAgICBpZiAocHJvcHNbaV0gaW4gb2JqKSB7XG5cbiAgICAgICAgLy8gcmV0dXJuIHRoZSBwcm9wZXJ0eSBuYW1lIGFzIGEgc3RyaW5nXG4gICAgICAgIGlmIChlbGVtID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybiBwcm9wc1tpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGl0ZW0gPSBvYmpbcHJvcHNbaV1dO1xuXG4gICAgICAgIC8vIGxldCdzIGJpbmQgYSBmdW5jdGlvblxuICAgICAgICBpZiAoaXMoaXRlbSwgJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICAvLyBiaW5kIHRvIG9iaiB1bmxlc3Mgb3ZlcnJpZGVuXG4gICAgICAgICAgcmV0dXJuIGZuQmluZChpdGVtLCBlbGVtIHx8IG9iaik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZXR1cm4gdGhlIHVuYm91bmQgZnVuY3Rpb24gb3Igb2JqIG9yIHZhbHVlXG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICA7XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBvdXIgXCJtb2Rlcm5penJcIiBlbGVtZW50IHRoYXQgd2UgZG8gbW9zdCBmZWF0dXJlIHRlc3RzIG9uLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG5cbiAgdmFyIG1vZEVsZW0gPSB7XG4gICAgZWxlbTogY3JlYXRlRWxlbWVudCgnbW9kZXJuaXpyJylcbiAgfTtcblxuICAvLyBDbGVhbiB1cCB0aGlzIGVsZW1lbnRcbiAgTW9kZXJuaXpyLl9xLnB1c2goZnVuY3Rpb24oKSB7XG4gICAgZGVsZXRlIG1vZEVsZW0uZWxlbTtcbiAgfSk7XG5cblxuXG4gIHZhciBtU3R5bGUgPSB7XG4gICAgc3R5bGU6IG1vZEVsZW0uZWxlbS5zdHlsZVxuICB9O1xuXG4gIC8vIGtpbGwgcmVmIGZvciBnYywgbXVzdCBoYXBwZW4gYmVmb3JlIG1vZC5lbGVtIGlzIHJlbW92ZWQsIHNvIHdlIHVuc2hpZnQgb24gdG9cbiAgLy8gdGhlIGZyb250IG9mIHRoZSBxdWV1ZS5cbiAgTW9kZXJuaXpyLl9xLnVuc2hpZnQoZnVuY3Rpb24oKSB7XG4gICAgZGVsZXRlIG1TdHlsZS5zdHlsZTtcbiAgfSk7XG5cblxuXG4gIC8qKlxuICAgKiBkb21Ub0NTUyB0YWtlcyBhIGNhbWVsQ2FzZSBzdHJpbmcgYW5kIGNvbnZlcnRzIGl0IHRvIGtlYmFiLWNhc2VcbiAgICogZS5nLiBib3hTaXppbmcgLT4gYm94LXNpemluZ1xuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICogQGZ1bmN0aW9uIGRvbVRvQ1NTXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gU3RyaW5nIG5hbWUgb2YgY2FtZWxDYXNlIHByb3Agd2Ugd2FudCB0byBjb252ZXJ0XG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBrZWJhYi1jYXNlIHZlcnNpb24gb2YgdGhlIHN1cHBsaWVkIG5hbWVcbiAgICovXG5cbiAgZnVuY3Rpb24gZG9tVG9DU1MobmFtZSkge1xuICAgIHJldHVybiBuYW1lLnJlcGxhY2UoLyhbQS1aXSkvZywgZnVuY3Rpb24oc3RyLCBtMSkge1xuICAgICAgcmV0dXJuICctJyArIG0xLnRvTG93ZXJDYXNlKCk7XG4gICAgfSkucmVwbGFjZSgvXm1zLS8sICctbXMtJyk7XG4gIH1cbiAgO1xuXG4gIC8qKlxuICAgKiBuYXRpdmVUZXN0UHJvcHMgYWxsb3dzIGZvciB1cyB0byB1c2UgbmF0aXZlIGZlYXR1cmUgZGV0ZWN0aW9uIGZ1bmN0aW9uYWxpdHkgaWYgYXZhaWxhYmxlLlxuICAgKiBzb21lIHByZWZpeGVkIGZvcm0sIG9yIGZhbHNlLCBpbiB0aGUgY2FzZSBvZiBhbiB1bnN1cHBvcnRlZCBydWxlXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKiBAZnVuY3Rpb24gbmF0aXZlVGVzdFByb3BzXG4gICAqIEBwYXJhbSB7YXJyYXl9IHByb3BzIC0gQW4gYXJyYXkgb2YgcHJvcGVydHkgbmFtZXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gQSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSB3ZSB3YW50IHRvIGNoZWNrIHZpYSBAc3VwcG9ydHNcbiAgICogQHJldHVybnMge2Jvb2xlYW58dW5kZWZpbmVkfSBBIGJvb2xlYW4gd2hlbiBAc3VwcG9ydHMgZXhpc3RzLCB1bmRlZmluZWQgb3RoZXJ3aXNlXG4gICAqL1xuXG4gIC8vIEFjY2VwdHMgYSBsaXN0IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBhIHNpbmdsZSB2YWx1ZVxuICAvLyBSZXR1cm5zIGB1bmRlZmluZWRgIGlmIG5hdGl2ZSBkZXRlY3Rpb24gbm90IGF2YWlsYWJsZVxuICBmdW5jdGlvbiBuYXRpdmVUZXN0UHJvcHMocHJvcHMsIHZhbHVlKSB7XG4gICAgdmFyIGkgPSBwcm9wcy5sZW5ndGg7XG4gICAgLy8gU3RhcnQgd2l0aCB0aGUgSlMgQVBJOiBodHRwOi8vd3d3LnczLm9yZy9UUi9jc3MzLWNvbmRpdGlvbmFsLyN0aGUtY3NzLWludGVyZmFjZVxuICAgIGlmICgnQ1NTJyBpbiB3aW5kb3cgJiYgJ3N1cHBvcnRzJyBpbiB3aW5kb3cuQ1NTKSB7XG4gICAgICAvLyBUcnkgZXZlcnkgcHJlZml4ZWQgdmFyaWFudCBvZiB0aGUgcHJvcGVydHlcbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgaWYgKHdpbmRvdy5DU1Muc3VwcG9ydHMoZG9tVG9DU1MocHJvcHNbaV0pLCB2YWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBPdGhlcndpc2UgZmFsbCBiYWNrIHRvIGF0LXJ1bGUgKGZvciBPcGVyYSAxMi54KVxuICAgIGVsc2UgaWYgKCdDU1NTdXBwb3J0c1J1bGUnIGluIHdpbmRvdykge1xuICAgICAgLy8gQnVpbGQgYSBjb25kaXRpb24gc3RyaW5nIGZvciBldmVyeSBwcmVmaXhlZCB2YXJpYW50XG4gICAgICB2YXIgY29uZGl0aW9uVGV4dCA9IFtdO1xuICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICBjb25kaXRpb25UZXh0LnB1c2goJygnICsgZG9tVG9DU1MocHJvcHNbaV0pICsgJzonICsgdmFsdWUgKyAnKScpO1xuICAgICAgfVxuICAgICAgY29uZGl0aW9uVGV4dCA9IGNvbmRpdGlvblRleHQuam9pbignIG9yICcpO1xuICAgICAgcmV0dXJuIGluamVjdEVsZW1lbnRXaXRoU3R5bGVzKCdAc3VwcG9ydHMgKCcgKyBjb25kaXRpb25UZXh0ICsgJykgeyAjbW9kZXJuaXpyIHsgcG9zaXRpb246IGFic29sdXRlOyB9IH0nLCBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIHJldHVybiBnZXRDb21wdXRlZFN0eWxlKG5vZGUsIG51bGwpLnBvc2l0aW9uID09ICdhYnNvbHV0ZSc7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICA7XG5cbiAgLy8gdGVzdFByb3BzIGlzIGEgZ2VuZXJpYyBDU1MgLyBET00gcHJvcGVydHkgdGVzdC5cblxuICAvLyBJbiB0ZXN0aW5nIHN1cHBvcnQgZm9yIGEgZ2l2ZW4gQ1NTIHByb3BlcnR5LCBpdCdzIGxlZ2l0IHRvIHRlc3Q6XG4gIC8vICAgIGBlbGVtLnN0eWxlW3N0eWxlTmFtZV0gIT09IHVuZGVmaW5lZGBcbiAgLy8gSWYgdGhlIHByb3BlcnR5IGlzIHN1cHBvcnRlZCBpdCB3aWxsIHJldHVybiBhbiBlbXB0eSBzdHJpbmcsXG4gIC8vIGlmIHVuc3VwcG9ydGVkIGl0IHdpbGwgcmV0dXJuIHVuZGVmaW5lZC5cblxuICAvLyBXZSdsbCB0YWtlIGFkdmFudGFnZSBvZiB0aGlzIHF1aWNrIHRlc3QgYW5kIHNraXAgc2V0dGluZyBhIHN0eWxlXG4gIC8vIG9uIG91ciBtb2Rlcm5penIgZWxlbWVudCwgYnV0IGluc3RlYWQganVzdCB0ZXN0aW5nIHVuZGVmaW5lZCB2c1xuICAvLyBlbXB0eSBzdHJpbmcuXG5cbiAgLy8gUHJvcGVydHkgbmFtZXMgY2FuIGJlIHByb3ZpZGVkIGluIGVpdGhlciBjYW1lbENhc2Ugb3Iga2ViYWItY2FzZS5cblxuICBmdW5jdGlvbiB0ZXN0UHJvcHMocHJvcHMsIHByZWZpeGVkLCB2YWx1ZSwgc2tpcFZhbHVlVGVzdCkge1xuICAgIHNraXBWYWx1ZVRlc3QgPSBpcyhza2lwVmFsdWVUZXN0LCAndW5kZWZpbmVkJykgPyBmYWxzZSA6IHNraXBWYWx1ZVRlc3Q7XG5cbiAgICAvLyBUcnkgbmF0aXZlIGRldGVjdCBmaXJzdFxuICAgIGlmICghaXModmFsdWUsICd1bmRlZmluZWQnKSkge1xuICAgICAgdmFyIHJlc3VsdCA9IG5hdGl2ZVRlc3RQcm9wcyhwcm9wcywgdmFsdWUpO1xuICAgICAgaWYgKCFpcyhyZXN1bHQsICd1bmRlZmluZWQnKSkge1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE90aGVyd2lzZSBkbyBpdCBwcm9wZXJseVxuICAgIHZhciBhZnRlckluaXQsIGksIHByb3BzTGVuZ3RoLCBwcm9wLCBiZWZvcmU7XG5cbiAgICAvLyBJZiB3ZSBkb24ndCBoYXZlIGEgc3R5bGUgZWxlbWVudCwgdGhhdCBtZWFucyB3ZSdyZSBydW5uaW5nIGFzeW5jIG9yIGFmdGVyXG4gICAgLy8gdGhlIGNvcmUgdGVzdHMsIHNvIHdlJ2xsIG5lZWQgdG8gY3JlYXRlIG91ciBvd24gZWxlbWVudHMgdG8gdXNlXG5cbiAgICAvLyBpbnNpZGUgb2YgYW4gU1ZHIGVsZW1lbnQsIGluIGNlcnRhaW4gYnJvd3NlcnMsIHRoZSBgc3R5bGVgIGVsZW1lbnQgaXMgb25seVxuICAgIC8vIGRlZmluZWQgZm9yIHZhbGlkIHRhZ3MuIFRoZXJlZm9yZSwgaWYgYG1vZGVybml6cmAgZG9lcyBub3QgaGF2ZSBvbmUsIHdlXG4gICAgLy8gZmFsbCBiYWNrIHRvIGEgbGVzcyB1c2VkIGVsZW1lbnQgYW5kIGhvcGUgZm9yIHRoZSBiZXN0LlxuICAgIHZhciBlbGVtcyA9IFsnbW9kZXJuaXpyJywgJ3RzcGFuJ107XG4gICAgd2hpbGUgKCFtU3R5bGUuc3R5bGUpIHtcbiAgICAgIGFmdGVySW5pdCA9IHRydWU7XG4gICAgICBtU3R5bGUubW9kRWxlbSA9IGNyZWF0ZUVsZW1lbnQoZWxlbXMuc2hpZnQoKSk7XG4gICAgICBtU3R5bGUuc3R5bGUgPSBtU3R5bGUubW9kRWxlbS5zdHlsZTtcbiAgICB9XG5cbiAgICAvLyBEZWxldGUgdGhlIG9iamVjdHMgaWYgd2UgY3JlYXRlZCB0aGVtLlxuICAgIGZ1bmN0aW9uIGNsZWFuRWxlbXMoKSB7XG4gICAgICBpZiAoYWZ0ZXJJbml0KSB7XG4gICAgICAgIGRlbGV0ZSBtU3R5bGUuc3R5bGU7XG4gICAgICAgIGRlbGV0ZSBtU3R5bGUubW9kRWxlbTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwcm9wc0xlbmd0aCA9IHByb3BzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgcHJvcHNMZW5ndGg7IGkrKykge1xuICAgICAgcHJvcCA9IHByb3BzW2ldO1xuICAgICAgYmVmb3JlID0gbVN0eWxlLnN0eWxlW3Byb3BdO1xuXG4gICAgICBpZiAoY29udGFpbnMocHJvcCwgJy0nKSkge1xuICAgICAgICBwcm9wID0gY3NzVG9ET00ocHJvcCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChtU3R5bGUuc3R5bGVbcHJvcF0gIT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgIC8vIElmIHZhbHVlIHRvIHRlc3QgaGFzIGJlZW4gcGFzc2VkIGluLCBkbyBhIHNldC1hbmQtY2hlY2sgdGVzdC5cbiAgICAgICAgLy8gMCAoaW50ZWdlcikgaXMgYSB2YWxpZCBwcm9wZXJ0eSB2YWx1ZSwgc28gY2hlY2sgdGhhdCBgdmFsdWVgIGlzbid0XG4gICAgICAgIC8vIHVuZGVmaW5lZCwgcmF0aGVyIHRoYW4ganVzdCBjaGVja2luZyBpdCdzIHRydXRoeS5cbiAgICAgICAgaWYgKCFza2lwVmFsdWVUZXN0ICYmICFpcyh2YWx1ZSwgJ3VuZGVmaW5lZCcpKSB7XG5cbiAgICAgICAgICAvLyBOZWVkcyBhIHRyeSBjYXRjaCBibG9jayBiZWNhdXNlIG9mIG9sZCBJRS4gVGhpcyBpcyBzbG93LCBidXQgd2lsbFxuICAgICAgICAgIC8vIGJlIGF2b2lkZWQgaW4gbW9zdCBjYXNlcyBiZWNhdXNlIGBza2lwVmFsdWVUZXN0YCB3aWxsIGJlIHVzZWQuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIG1TdHlsZS5zdHlsZVtwcm9wXSA9IHZhbHVlO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHt9XG5cbiAgICAgICAgICAvLyBJZiB0aGUgcHJvcGVydHkgdmFsdWUgaGFzIGNoYW5nZWQsIHdlIGFzc3VtZSB0aGUgdmFsdWUgdXNlZCBpc1xuICAgICAgICAgIC8vIHN1cHBvcnRlZC4gSWYgYHZhbHVlYCBpcyBlbXB0eSBzdHJpbmcsIGl0J2xsIGZhaWwgaGVyZSAoYmVjYXVzZVxuICAgICAgICAgIC8vIGl0IGhhc24ndCBjaGFuZ2VkKSwgd2hpY2ggbWF0Y2hlcyBob3cgYnJvd3NlcnMgaGF2ZSBpbXBsZW1lbnRlZFxuICAgICAgICAgIC8vIENTUy5zdXBwb3J0cygpXG4gICAgICAgICAgaWYgKG1TdHlsZS5zdHlsZVtwcm9wXSAhPSBiZWZvcmUpIHtcbiAgICAgICAgICAgIGNsZWFuRWxlbXMoKTtcbiAgICAgICAgICAgIHJldHVybiBwcmVmaXhlZCA9PSAncGZ4JyA/IHByb3AgOiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBPdGhlcndpc2UganVzdCByZXR1cm4gdHJ1ZSwgb3IgdGhlIHByb3BlcnR5IG5hbWUgaWYgdGhpcyBpcyBhXG4gICAgICAgIC8vIGBwcmVmaXhlZCgpYCBjYWxsXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGNsZWFuRWxlbXMoKTtcbiAgICAgICAgICByZXR1cm4gcHJlZml4ZWQgPT0gJ3BmeCcgPyBwcm9wIDogdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBjbGVhbkVsZW1zKCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgO1xuXG4gIC8qKlxuICAgKiB0ZXN0UHJvcHNBbGwgdGVzdHMgYSBsaXN0IG9mIERPTSBwcm9wZXJ0aWVzIHdlIHdhbnQgdG8gY2hlY2sgYWdhaW5zdC5cbiAgICogV2Ugc3BlY2lmeSBsaXRlcmFsbHkgQUxMIHBvc3NpYmxlIChrbm93biBhbmQvb3IgbGlrZWx5KSBwcm9wZXJ0aWVzIG9uXG4gICAqIHRoZSBlbGVtZW50IGluY2x1ZGluZyB0aGUgbm9uLXZlbmRvciBwcmVmaXhlZCBvbmUsIGZvciBmb3J3YXJkLVxuICAgKiBjb21wYXRpYmlsaXR5LlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICogQGZ1bmN0aW9uIHRlc3RQcm9wc0FsbFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcCAtIEEgc3RyaW5nIG9mIHRoZSBwcm9wZXJ0eSB0byB0ZXN0IGZvclxuICAgKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IFtwcmVmaXhlZF0gLSBBbiBvYmplY3QgdG8gY2hlY2sgdGhlIHByZWZpeGVkIHByb3BlcnRpZXMgb24uIFVzZSBhIHN0cmluZyB0byBza2lwXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR8U1ZHRWxlbWVudH0gW2VsZW1dIC0gQW4gZWxlbWVudCB1c2VkIHRvIHRlc3QgdGhlIHByb3BlcnR5IGFuZCB2YWx1ZSBhZ2FpbnN0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbdmFsdWVdIC0gQSBzdHJpbmcgb2YgYSBjc3MgdmFsdWVcbiAgICogQHBhcmFtIHtib29sZWFufSBbc2tpcFZhbHVlVGVzdF0gLSBBbiBib29sZWFuIHJlcHJlc2VudGluZyBpZiB5b3Ugd2FudCB0byB0ZXN0IGlmIHZhbHVlIHN0aWNrcyB3aGVuIHNldFxuICAgKi9cbiAgZnVuY3Rpb24gdGVzdFByb3BzQWxsKHByb3AsIHByZWZpeGVkLCBlbGVtLCB2YWx1ZSwgc2tpcFZhbHVlVGVzdCkge1xuXG4gICAgdmFyIHVjUHJvcCA9IHByb3AuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBwcm9wLnNsaWNlKDEpLFxuICAgIHByb3BzID0gKHByb3AgKyAnICcgKyBjc3NvbVByZWZpeGVzLmpvaW4odWNQcm9wICsgJyAnKSArIHVjUHJvcCkuc3BsaXQoJyAnKTtcblxuICAgIC8vIGRpZCB0aGV5IGNhbGwgLnByZWZpeGVkKCdib3hTaXppbmcnKSBvciBhcmUgd2UganVzdCB0ZXN0aW5nIGEgcHJvcD9cbiAgICBpZiAoaXMocHJlZml4ZWQsICdzdHJpbmcnKSB8fCBpcyhwcmVmaXhlZCwgJ3VuZGVmaW5lZCcpKSB7XG4gICAgICByZXR1cm4gdGVzdFByb3BzKHByb3BzLCBwcmVmaXhlZCwgdmFsdWUsIHNraXBWYWx1ZVRlc3QpO1xuXG4gICAgICAvLyBvdGhlcndpc2UsIHRoZXkgY2FsbGVkIC5wcmVmaXhlZCgncmVxdWVzdEFuaW1hdGlvbkZyYW1lJywgd2luZG93WywgZWxlbV0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHByb3BzID0gKHByb3AgKyAnICcgKyAoZG9tUHJlZml4ZXMpLmpvaW4odWNQcm9wICsgJyAnKSArIHVjUHJvcCkuc3BsaXQoJyAnKTtcbiAgICAgIHJldHVybiB0ZXN0RE9NUHJvcHMocHJvcHMsIHByZWZpeGVkLCBlbGVtKTtcbiAgICB9XG4gIH1cblxuICAvLyBNb2Rlcm5penIudGVzdEFsbFByb3BzKCkgaW52ZXN0aWdhdGVzIHdoZXRoZXIgYSBnaXZlbiBzdHlsZSBwcm9wZXJ0eSxcbiAgLy8gb3IgYW55IG9mIGl0cyB2ZW5kb3ItcHJlZml4ZWQgdmFyaWFudHMsIGlzIHJlY29nbml6ZWRcbiAgLy9cbiAgLy8gTm90ZSB0aGF0IHRoZSBwcm9wZXJ0eSBuYW1lcyBtdXN0IGJlIHByb3ZpZGVkIGluIHRoZSBjYW1lbENhc2UgdmFyaWFudC5cbiAgLy8gTW9kZXJuaXpyLnRlc3RBbGxQcm9wcygnYm94U2l6aW5nJylcbiAgTW9kZXJuaXpyUHJvdG8udGVzdEFsbFByb3BzID0gdGVzdFByb3BzQWxsO1xuXG5cblxuICAvKipcbiAgICogdGVzdEFsbFByb3BzIGRldGVybWluZXMgd2hldGhlciBhIGdpdmVuIENTUyBwcm9wZXJ0eSBpcyBzdXBwb3J0ZWQgaW4gdGhlIGJyb3dzZXJcbiAgICpcbiAgICogQG1lbWJlcm9mIE1vZGVybml6clxuICAgKiBAbmFtZSBNb2Rlcm5penIudGVzdEFsbFByb3BzXG4gICAqIEBvcHRpb25OYW1lIE1vZGVybml6ci50ZXN0QWxsUHJvcHMoKVxuICAgKiBAb3B0aW9uUHJvcCB0ZXN0QWxsUHJvcHNcbiAgICogQGFjY2VzcyBwdWJsaWNcbiAgICogQGZ1bmN0aW9uIHRlc3RBbGxQcm9wc1xuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcCAtIFN0cmluZyBuYW1pbmcgdGhlIHByb3BlcnR5IHRvIHRlc3QgKGVpdGhlciBjYW1lbENhc2Ugb3Iga2ViYWItY2FzZSlcbiAgICogQHBhcmFtIHtzdHJpbmd9IFt2YWx1ZV0gLSBTdHJpbmcgb2YgdGhlIHZhbHVlIHRvIHRlc3RcbiAgICogQHBhcmFtIHtib29sZWFufSBbc2tpcFZhbHVlVGVzdD1mYWxzZV0gLSBXaGV0aGVyIHRvIHNraXAgdGVzdGluZyB0aGF0IHRoZSB2YWx1ZSBpcyBzdXBwb3J0ZWQgd2hlbiB1c2luZyBub24tbmF0aXZlIGRldGVjdGlvblxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiB0ZXN0QWxsUHJvcHMgZGV0ZXJtaW5lcyB3aGV0aGVyIGEgZ2l2ZW4gQ1NTIHByb3BlcnR5LCBpbiBzb21lIHByZWZpeGVkIGZvcm0sXG4gICAqIGlzIHN1cHBvcnRlZCBieSB0aGUgYnJvd3Nlci5cbiAgICpcbiAgICogYGBganNcbiAgICogdGVzdEFsbFByb3BzKCdib3hTaXppbmcnKSAgLy8gdHJ1ZVxuICAgKiBgYGBcbiAgICpcbiAgICogSXQgY2FuIG9wdGlvbmFsbHkgYmUgZ2l2ZW4gYSBDU1MgdmFsdWUgaW4gc3RyaW5nIGZvcm0gdG8gdGVzdCBpZiBhIHByb3BlcnR5XG4gICAqIHZhbHVlIGlzIHZhbGlkXG4gICAqXG4gICAqIGBgYGpzXG4gICAqIHRlc3RBbGxQcm9wcygnZGlzcGxheScsICdibG9jaycpIC8vIHRydWVcbiAgICogdGVzdEFsbFByb3BzKCdkaXNwbGF5JywgJ3Blbmd1aW4nKSAvLyBmYWxzZVxuICAgKiBgYGBcbiAgICpcbiAgICogQSBib29sZWFuIGNhbiBiZSBwYXNzZWQgYXMgYSB0aGlyZCBwYXJhbWV0ZXIgdG8gc2tpcCB0aGUgdmFsdWUgY2hlY2sgd2hlblxuICAgKiBuYXRpdmUgZGV0ZWN0aW9uIChAc3VwcG9ydHMpIGlzbid0IGF2YWlsYWJsZS5cbiAgICpcbiAgICogYGBganNcbiAgICogdGVzdEFsbFByb3BzKCdzaGFwZU91dHNpZGUnLCAnY29udGVudC1ib3gnLCB0cnVlKTtcbiAgICogYGBgXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHRlc3RBbGxQcm9wcyhwcm9wLCB2YWx1ZSwgc2tpcFZhbHVlVGVzdCkge1xuICAgIHJldHVybiB0ZXN0UHJvcHNBbGwocHJvcCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHZhbHVlLCBza2lwVmFsdWVUZXN0KTtcbiAgfVxuICBNb2Rlcm5penJQcm90by50ZXN0QWxsUHJvcHMgPSB0ZXN0QWxsUHJvcHM7XG5cbi8qIVxue1xuICBcIm5hbWVcIjogXCJCYWNrZ3JvdW5kIFNpemVcIixcbiAgXCJwcm9wZXJ0eVwiOiBcImJhY2tncm91bmRzaXplXCIsXG4gIFwidGFnc1wiOiBbXCJjc3NcIl0sXG4gIFwia25vd25CdWdzXCI6IFtcIlRoaXMgd2lsbCBmYWxzZSBwb3NpdGl2ZSBpbiBPcGVyYSBNaW5pIC0gaHR0cHM6Ly9naXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvaXNzdWVzLzM5NlwiXSxcbiAgXCJub3Rlc1wiOiBbe1xuICAgIFwibmFtZVwiOiBcIlJlbGF0ZWQgSXNzdWVcIixcbiAgICBcImhyZWZcIjogXCJodHRwczovL2dpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci9pc3N1ZXMvMzk2XCJcbiAgfV1cbn1cbiEqL1xuXG4gIE1vZGVybml6ci5hZGRUZXN0KCdiYWNrZ3JvdW5kc2l6ZScsIHRlc3RBbGxQcm9wcygnYmFja2dyb3VuZFNpemUnLCAnMTAwJScsIHRydWUpKTtcblxuLyohXG57XG4gIFwibmFtZVwiOiBcIkZsZXhib3hcIixcbiAgXCJwcm9wZXJ0eVwiOiBcImZsZXhib3hcIixcbiAgXCJjYW5pdXNlXCI6IFwiZmxleGJveFwiLFxuICBcInRhZ3NcIjogW1wiY3NzXCJdLFxuICBcIm5vdGVzXCI6IFt7XG4gICAgXCJuYW1lXCI6IFwiVGhlIF9uZXdfIGZsZXhib3hcIixcbiAgICBcImhyZWZcIjogXCJodHRwOi8vZGV2LnczLm9yZy9jc3N3Zy9jc3MzLWZsZXhib3hcIlxuICB9XSxcbiAgXCJ3YXJuaW5nc1wiOiBbXG4gICAgXCJBIGB0cnVlYCByZXN1bHQgZm9yIHRoaXMgZGV0ZWN0IGRvZXMgbm90IGltcGx5IHRoYXQgdGhlIGBmbGV4LXdyYXBgIHByb3BlcnR5IGlzIHN1cHBvcnRlZDsgc2VlIHRoZSBgZmxleHdyYXBgIGRldGVjdC5cIlxuICBdXG59XG4hKi9cbi8qIERPQ1xuRGV0ZWN0cyBzdXBwb3J0IGZvciB0aGUgRmxleGlibGUgQm94IExheW91dCBtb2RlbCwgYS5rLmEuIEZsZXhib3gsIHdoaWNoIGFsbG93cyBlYXN5IG1hbmlwdWxhdGlvbiBvZiBsYXlvdXQgb3JkZXIgYW5kIHNpemluZyB3aXRoaW4gYSBjb250YWluZXIuXG4qL1xuXG4gIE1vZGVybml6ci5hZGRUZXN0KCdmbGV4Ym94JywgdGVzdEFsbFByb3BzKCdmbGV4QmFzaXMnLCAnMXB4JywgdHJ1ZSkpO1xuXG4vKiFcbntcbiAgXCJuYW1lXCI6IFwiRmxleGJveCAobGVnYWN5KVwiLFxuICBcInByb3BlcnR5XCI6IFwiZmxleGJveGxlZ2FjeVwiLFxuICBcInRhZ3NcIjogW1wiY3NzXCJdLFxuICBcInBvbHlmaWxsc1wiOiBbXCJmbGV4aWVcIl0sXG4gIFwibm90ZXNcIjogW3tcbiAgICBcIm5hbWVcIjogXCJUaGUgX29sZF8gZmxleGJveFwiLFxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vd3d3LnczLm9yZy9UUi8yMDA5L1dELWNzczMtZmxleGJveC0yMDA5MDcyMy9cIlxuICB9XVxufVxuISovXG5cbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ2ZsZXhib3hsZWdhY3knLCB0ZXN0QWxsUHJvcHMoJ2JveERpcmVjdGlvbicsICdyZXZlcnNlJywgdHJ1ZSkpO1xuICBcbiAgLy9BZGRlZCB0byBkZXRlY3QgdHJhbnNpdGlvblxuICAgTW9kZXJuaXpyLmFkZFRlc3QoJ2Nzc3RyYW5zaXRpb25zJyx0ZXN0QWxsUHJvcHMoJ3RyYW5zaXRpb24nKSk7XG4gIFxuICBcbiAgICAvKj4+d2ViZm9ybXMqL1xuICAgIC8vIGlucHV0IGZlYXR1cmVzIGFuZCBpbnB1dCB0eXBlcyBnbyBkaXJlY3RseSBvbnRvIHRoZSByZXQgb2JqZWN0LCBieXBhc3NpbmcgdGhlIHRlc3RzIGxvb3AuXG4gICAgLy8gSG9sZCB0aGlzIGd1eSB0byBleGVjdXRlIGluIGEgbW9tZW50LlxuICAgIFxuICAgIGZ1bmN0aW9uIHdlYmZvcm1zKCkge1xuICAgICAgICAvKj4+aW5wdXQqL1xuICAgICAgICAvLyBSdW4gdGhyb3VnaCBIVE1MNSdzIG5ldyBpbnB1dCBhdHRyaWJ1dGVzIHRvIHNlZSBpZiB0aGUgVUEgdW5kZXJzdGFuZHMgYW55LlxuICAgICAgICAvLyBXZSdyZSB1c2luZyBmIHdoaWNoIGlzIHRoZSA8aW5wdXQ+IGVsZW1lbnQgY3JlYXRlZCBlYXJseSBvblxuICAgICAgICAvLyBNaWtlIFRheWxyIGhhcyBjcmVhdGVkIGEgY29tcHJlaGVuc2l2ZSByZXNvdXJjZSBmb3IgdGVzdGluZyB0aGVzZSBhdHRyaWJ1dGVzXG4gICAgICAgIC8vICAgd2hlbiBhcHBsaWVkIHRvIGFsbCBpbnB1dCB0eXBlczpcbiAgICAgICAgLy8gICBtaWtldGF5bHIuY29tL2NvZGUvaW5wdXQtdHlwZS1hdHRyLmh0bWxcbiAgICAgICAgLy8gc3BlYzogd3d3LndoYXR3Zy5vcmcvc3BlY3Mvd2ViLWFwcHMvY3VycmVudC13b3JrL211bHRpcGFnZS90aGUtaW5wdXQtZWxlbWVudC5odG1sI2lucHV0LXR5cGUtYXR0ci1zdW1tYXJ5XG5cbiAgICAgICAgLy8gT25seSBpbnB1dCBwbGFjZWhvbGRlciBpcyB0ZXN0ZWQgd2hpbGUgdGV4dGFyZWEncyBwbGFjZWhvbGRlciBpcyBub3QuXG4gICAgICAgIC8vIEN1cnJlbnRseSBTYWZhcmkgNCBhbmQgT3BlcmEgMTEgaGF2ZSBzdXBwb3J0IG9ubHkgZm9yIHRoZSBpbnB1dCBwbGFjZWhvbGRlclxuICAgICAgICAvLyBCb3RoIHRlc3RzIGFyZSBhdmFpbGFibGUgaW4gZmVhdHVyZS1kZXRlY3RzL2Zvcm1zLXBsYWNlaG9sZGVyLmpzXG4gICAgICAgIE1vZGVybml6clsnaW5wdXQnXSA9IChmdW5jdGlvbiggcHJvcHMgKSB7XG4gICAgICAgIFx0dmFyIGlucHV0MSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgICAgICBmb3IgKCB2YXIgaSA9IDAsIGxlbiA9IHByb3BzLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xuICAgICAgICAgICAgICAgIGF0dHJzWyBwcm9wc1tpXSBdID0gISEocHJvcHNbaV0gaW4gaW5wdXQxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhdHRycy5saXN0KXtcbiAgICAgICAgICAgICAgLy8gc2FmYXJpIGZhbHNlIHBvc2l0aXZlJ3Mgb24gZGF0YWxpc3Q6IHdlYmsuaXQvNzQyNTJcbiAgICAgICAgICAgICAgLy8gc2VlIGFsc28gZ2l0aHViLmNvbS9Nb2Rlcm5penIvTW9kZXJuaXpyL2lzc3Vlcy8xNDZcbiAgICAgICAgICAgICAgYXR0cnMubGlzdCA9ICEhKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RhdGFsaXN0JykgJiYgd2luZG93LkhUTUxEYXRhTGlzdEVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGF0dHJzO1xuICAgICAgICB9KSgnYXV0b2NvbXBsZXRlIGF1dG9mb2N1cyBsaXN0IHBsYWNlaG9sZGVyIG1heCBtaW4gbXVsdGlwbGUgcGF0dGVybiByZXF1aXJlZCBzdGVwJy5zcGxpdCgnICcpKTtcbiAgICAgICAgLyo+PmlucHV0Ki9cbiAgICB9XG5cbiAgICAvKj4+d2ViZm9ybXMqL1xuICAgIC8vIGlucHV0IHRlc3RzIG5lZWQgdG8gcnVuLlxuICAgIE1vZGVybml6ci5pbnB1dCB8fCB3ZWJmb3JtcygpO1xuICAgIC8qPj53ZWJmb3JtcyovXG5cbiAgXG5cbiAgLy8gUnVuIGVhY2ggdGVzdFxuICB0ZXN0UnVubmVyKCk7XG5cbiAgLy8gUmVtb3ZlIHRoZSBcIm5vLWpzXCIgY2xhc3MgaWYgaXQgZXhpc3RzXG4gIHNldENsYXNzZXMoY2xhc3Nlcyk7XG5cbiAgZGVsZXRlIE1vZGVybml6clByb3RvLmFkZFRlc3Q7XG4gIGRlbGV0ZSBNb2Rlcm5penJQcm90by5hZGRBc3luY1Rlc3Q7XG5cbiAgLy8gUnVuIHRoZSB0aGluZ3MgdGhhdCBhcmUgc3VwcG9zZWQgdG8gcnVuIGFmdGVyIHRoZSB0ZXN0c1xuICBmb3IgKHZhciBpID0gMDsgaSA8IE1vZGVybml6ci5fcS5sZW5ndGg7IGkrKykge1xuICAgIE1vZGVybml6ci5fcVtpXSgpO1xuICB9XG5cbiAgLy8gTGVhayBNb2Rlcm5penIgbmFtZXNwYWNlXG4gIHdpbmRvdy5Nb2Rlcm5penIgPSBNb2Rlcm5penI7XG5cblxuO1xuXG59KSh3aW5kb3csIGRvY3VtZW50KTtcbiJdfQ==
