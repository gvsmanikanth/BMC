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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9oZWFkLmpzIiwianMvdmVuZG9yL21vZGVybml6ci1jdXN0b20uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZSgnLi92ZW5kb3IvbW9kZXJuaXpyLWN1c3RvbScpO1xyXG4iLCIvKiFcclxuICogbW9kZXJuaXpyIHYzLjMuMVxyXG4gKiBCdWlsZCBodHRwOi8vbW9kZXJuaXpyLmNvbS9kb3dubG9hZD8tYmFja2dyb3VuZHNpemUtY3NzZ3JhZGllbnRzLWZsZXhib3gtZmxleGJveGxlZ2FjeS1zdmctdG91Y2hldmVudHMtdmlkZW8tbXEtc2V0Y2xhc3Nlcy1kb250bWluXHJcbiAqXHJcbiAqIENvcHlyaWdodCAoYylcclxuICogIEZhcnVrIEF0ZXNcclxuICogIFBhdWwgSXJpc2hcclxuICogIEFsZXggU2V4dG9uXHJcbiAqICBSeWFuIFNlZGRvblxyXG4gKiAgUGF0cmljayBLZXR0bmVyXHJcbiAqICBTdHUgQ294XHJcbiAqICBSaWNoYXJkIEhlcnJlcmFcclxuXHJcbiAqIE1JVCBMaWNlbnNlXHJcbiAqL1xyXG5cclxuLypcclxuICogTW9kZXJuaXpyIHRlc3RzIHdoaWNoIG5hdGl2ZSBDU1MzIGFuZCBIVE1MNSBmZWF0dXJlcyBhcmUgYXZhaWxhYmxlIGluIHRoZVxyXG4gKiBjdXJyZW50IFVBIGFuZCBtYWtlcyB0aGUgcmVzdWx0cyBhdmFpbGFibGUgdG8geW91IGluIHR3byB3YXlzOiBhcyBwcm9wZXJ0aWVzIG9uXHJcbiAqIGEgZ2xvYmFsIGBNb2Rlcm5penJgIG9iamVjdCwgYW5kIGFzIGNsYXNzZXMgb24gdGhlIGA8aHRtbD5gIGVsZW1lbnQuIFRoaXNcclxuICogaW5mb3JtYXRpb24gYWxsb3dzIHlvdSB0byBwcm9ncmVzc2l2ZWx5IGVuaGFuY2UgeW91ciBwYWdlcyB3aXRoIGEgZ3JhbnVsYXIgbGV2ZWxcclxuICogb2YgY29udHJvbCBvdmVyIHRoZSBleHBlcmllbmNlLlxyXG4qL1xyXG5cclxuOyhmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQpe1xyXG4gIHZhciBjbGFzc2VzID0gW107XHJcblxyXG5cclxuICB2YXIgdGVzdHMgPSBbXTtcclxuICBpbnB1dHMgPSB7fTtcclxuICBhdHRycyA9IHt9O1xyXG5cclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBNb2Rlcm5penJQcm90byBpcyB0aGUgY29uc3RydWN0b3IgZm9yIE1vZGVybml6clxyXG4gICAqXHJcbiAgICogQGNsYXNzXHJcbiAgICogQGFjY2VzcyBwdWJsaWNcclxuICAgKi9cclxuXHJcbiAgdmFyIE1vZGVybml6clByb3RvID0ge1xyXG4gICAgLy8gVGhlIGN1cnJlbnQgdmVyc2lvbiwgZHVtbXlcclxuICAgIF92ZXJzaW9uOiAnMy4zLjEnLFxyXG5cclxuICAgIC8vIEFueSBzZXR0aW5ncyB0aGF0IGRvbid0IHdvcmsgYXMgc2VwYXJhdGUgbW9kdWxlc1xyXG4gICAgLy8gY2FuIGdvIGluIGhlcmUgYXMgY29uZmlndXJhdGlvbi5cclxuICAgIF9jb25maWc6IHtcclxuICAgICAgJ2NsYXNzUHJlZml4JzogJycsXHJcbiAgICAgICdlbmFibGVDbGFzc2VzJzogdHJ1ZSxcclxuICAgICAgJ2VuYWJsZUpTQ2xhc3MnOiB0cnVlLFxyXG4gICAgICAndXNlUHJlZml4ZXMnOiB0cnVlXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIFF1ZXVlIG9mIHRlc3RzXHJcbiAgICBfcTogW10sXHJcblxyXG4gICAgLy8gU3R1YiB0aGVzZSBmb3IgcGVvcGxlIHdobyBhcmUgbGlzdGVuaW5nXHJcbiAgICBvbjogZnVuY3Rpb24odGVzdCwgY2IpIHtcclxuICAgICAgLy8gSSBkb24ndCByZWFsbHkgdGhpbmsgcGVvcGxlIHNob3VsZCBkbyB0aGlzLCBidXQgd2UgY2FuXHJcbiAgICAgIC8vIHNhZmUgZ3VhcmQgaXQgYSBiaXQuXHJcbiAgICAgIC8vIC0tIE5PVEU6OiB0aGlzIGdldHMgV0FZIG92ZXJyaWRkZW4gaW4gc3JjL2FkZFRlc3QgZm9yIGFjdHVhbCBhc3luYyB0ZXN0cy5cclxuICAgICAgLy8gVGhpcyBpcyBpbiBjYXNlIHBlb3BsZSBsaXN0ZW4gdG8gc3luY2hyb25vdXMgdGVzdHMuIEkgd291bGQgbGVhdmUgaXQgb3V0LFxyXG4gICAgICAvLyBidXQgdGhlIGNvZGUgdG8gKmRpc2FsbG93KiBzeW5jIHRlc3RzIGluIHRoZSByZWFsIHZlcnNpb24gb2YgdGhpc1xyXG4gICAgICAvLyBmdW5jdGlvbiBpcyBhY3R1YWxseSBsYXJnZXIgdGhhbiB0aGlzLlxyXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY2Ioc2VsZlt0ZXN0XSk7XHJcbiAgICAgIH0sIDApO1xyXG4gICAgfSxcclxuXHJcbiAgICBhZGRUZXN0OiBmdW5jdGlvbihuYW1lLCBmbiwgb3B0aW9ucykge1xyXG4gICAgICB0ZXN0cy5wdXNoKHtuYW1lOiBuYW1lLCBmbjogZm4sIG9wdGlvbnM6IG9wdGlvbnN9KTtcclxuICAgIH0sXHJcblxyXG4gICAgYWRkQXN5bmNUZXN0OiBmdW5jdGlvbihmbikge1xyXG4gICAgICB0ZXN0cy5wdXNoKHtuYW1lOiBudWxsLCBmbjogZm59KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuXHJcblxyXG4gIC8vIEZha2Ugc29tZSBvZiBPYmplY3QuY3JlYXRlIHNvIHdlIGNhbiBmb3JjZSBub24gdGVzdCByZXN1bHRzIHRvIGJlIG5vbiBcIm93blwiIHByb3BlcnRpZXMuXHJcbiAgdmFyIE1vZGVybml6ciA9IGZ1bmN0aW9uKCkge307XHJcbiAgTW9kZXJuaXpyLnByb3RvdHlwZSA9IE1vZGVybml6clByb3RvO1xyXG5cclxuICAvLyBMZWFrIG1vZGVybml6ciBnbG9iYWxseSB3aGVuIHlvdSBgcmVxdWlyZWAgaXQgcmF0aGVyIHRoYW4gZm9yY2UgaXQgaGVyZS5cclxuICAvLyBPdmVyd3JpdGUgbmFtZSBzbyBjb25zdHJ1Y3RvciBuYW1lIGlzIG5pY2VyIDpEXHJcbiAgTW9kZXJuaXpyID0gbmV3IE1vZGVybml6cigpO1xyXG5cclxuXHJcbi8qIVxyXG57XHJcbiAgXCJuYW1lXCI6IFwiU1ZHXCIsXHJcbiAgXCJwcm9wZXJ0eVwiOiBcInN2Z1wiLFxyXG4gIFwiY2FuaXVzZVwiOiBcInN2Z1wiLFxyXG4gIFwidGFnc1wiOiBbXCJzdmdcIl0sXHJcbiAgXCJhdXRob3JzXCI6IFtcIkVyaWsgRGFobHN0cm9tXCJdLFxyXG4gIFwicG9seWZpbGxzXCI6IFtcclxuICAgIFwic3Znd2ViXCIsXHJcbiAgICBcInJhcGhhZWxcIixcclxuICAgIFwiYW1wbGVzZGtcIixcclxuICAgIFwiY2FudmdcIixcclxuICAgIFwic3ZnLWJvaWxlcnBsYXRlXCIsXHJcbiAgICBcInNpZVwiLFxyXG4gICAgXCJkb2pvZ2Z4XCIsXHJcbiAgICBcImZhYnJpY2pzXCJcclxuICBdXHJcbn1cclxuISovXHJcbi8qIERPQ1xyXG5EZXRlY3RzIHN1cHBvcnQgZm9yIFNWRyBpbiBgPGVtYmVkPmAgb3IgYDxvYmplY3Q+YCBlbGVtZW50cy5cclxuKi9cclxuXHJcbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ3N2ZycsICEhZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TICYmICEhZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdzdmcnKS5jcmVhdGVTVkdSZWN0KTtcclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIGlzIHJldHVybnMgYSBib29sZWFuIGlmIHRoZSB0eXBlb2YgYW4gb2JqIGlzIGV4YWN0bHkgdHlwZS5cclxuICAgKlxyXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxyXG4gICAqIEBmdW5jdGlvbiBpc1xyXG4gICAqIEBwYXJhbSB7Kn0gb2JqIC0gQSB0aGluZyB3ZSB3YW50IHRvIGNoZWNrIHRoZSB0eXBlIG9mXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgLSBBIHN0cmluZyB0byBjb21wYXJlIHRoZSB0eXBlb2YgYWdhaW5zdFxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAqL1xyXG5cclxuICBmdW5jdGlvbiBpcyhvYmosIHR5cGUpIHtcclxuICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSB0eXBlO1xyXG4gIH1cclxuICA7XHJcblxyXG4gIC8qKlxyXG4gICAqIFJ1biB0aHJvdWdoIGFsbCB0ZXN0cyBhbmQgZGV0ZWN0IHRoZWlyIHN1cHBvcnQgaW4gdGhlIGN1cnJlbnQgVUEuXHJcbiAgICpcclxuICAgKiBAYWNjZXNzIHByaXZhdGVcclxuICAgKi9cclxuXHJcbiAgZnVuY3Rpb24gdGVzdFJ1bm5lcigpIHtcclxuICAgIHZhciBmZWF0dXJlTmFtZXM7XHJcbiAgICB2YXIgZmVhdHVyZTtcclxuICAgIHZhciBhbGlhc0lkeDtcclxuICAgIHZhciByZXN1bHQ7XHJcbiAgICB2YXIgbmFtZUlkeDtcclxuICAgIHZhciBmZWF0dXJlTmFtZTtcclxuICAgIHZhciBmZWF0dXJlTmFtZVNwbGl0O1xyXG5cclxuICAgIGZvciAodmFyIGZlYXR1cmVJZHggaW4gdGVzdHMpIHtcclxuICAgICAgaWYgKHRlc3RzLmhhc093blByb3BlcnR5KGZlYXR1cmVJZHgpKSB7XHJcbiAgICAgICAgZmVhdHVyZU5hbWVzID0gW107XHJcbiAgICAgICAgZmVhdHVyZSA9IHRlc3RzW2ZlYXR1cmVJZHhdO1xyXG4gICAgICAgIC8vIHJ1biB0aGUgdGVzdCwgdGhyb3cgdGhlIHJldHVybiB2YWx1ZSBpbnRvIHRoZSBNb2Rlcm5penIsXHJcbiAgICAgICAgLy8gdGhlbiBiYXNlZCBvbiB0aGF0IGJvb2xlYW4sIGRlZmluZSBhbiBhcHByb3ByaWF0ZSBjbGFzc05hbWVcclxuICAgICAgICAvLyBhbmQgcHVzaCBpdCBpbnRvIGFuIGFycmF5IG9mIGNsYXNzZXMgd2UnbGwgam9pbiBsYXRlci5cclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vIElmIHRoZXJlIGlzIG5vIG5hbWUsIGl0J3MgYW4gJ2FzeW5jJyB0ZXN0IHRoYXQgaXMgcnVuLFxyXG4gICAgICAgIC8vIGJ1dCBub3QgZGlyZWN0bHkgYWRkZWQgdG8gdGhlIG9iamVjdC4gVGhhdCBzaG91bGRcclxuICAgICAgICAvLyBiZSBkb25lIHdpdGggYSBwb3N0LXJ1biBhZGRUZXN0IGNhbGwuXHJcbiAgICAgICAgaWYgKGZlYXR1cmUubmFtZSkge1xyXG4gICAgICAgICAgZmVhdHVyZU5hbWVzLnB1c2goZmVhdHVyZS5uYW1lLnRvTG93ZXJDYXNlKCkpO1xyXG5cclxuICAgICAgICAgIGlmIChmZWF0dXJlLm9wdGlvbnMgJiYgZmVhdHVyZS5vcHRpb25zLmFsaWFzZXMgJiYgZmVhdHVyZS5vcHRpb25zLmFsaWFzZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIC8vIEFkZCBhbGwgdGhlIGFsaWFzZXMgaW50byB0aGUgbmFtZXMgbGlzdFxyXG4gICAgICAgICAgICBmb3IgKGFsaWFzSWR4ID0gMDsgYWxpYXNJZHggPCBmZWF0dXJlLm9wdGlvbnMuYWxpYXNlcy5sZW5ndGg7IGFsaWFzSWR4KyspIHtcclxuICAgICAgICAgICAgICBmZWF0dXJlTmFtZXMucHVzaChmZWF0dXJlLm9wdGlvbnMuYWxpYXNlc1thbGlhc0lkeF0udG9Mb3dlckNhc2UoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFJ1biB0aGUgdGVzdCwgb3IgdXNlIHRoZSByYXcgdmFsdWUgaWYgaXQncyBub3QgYSBmdW5jdGlvblxyXG4gICAgICAgIHJlc3VsdCA9IGlzKGZlYXR1cmUuZm4sICdmdW5jdGlvbicpID8gZmVhdHVyZS5mbigpIDogZmVhdHVyZS5mbjtcclxuXHJcblxyXG4gICAgICAgIC8vIFNldCBlYWNoIG9mIHRoZSBuYW1lcyBvbiB0aGUgTW9kZXJuaXpyIG9iamVjdFxyXG4gICAgICAgIGZvciAobmFtZUlkeCA9IDA7IG5hbWVJZHggPCBmZWF0dXJlTmFtZXMubGVuZ3RoOyBuYW1lSWR4KyspIHtcclxuICAgICAgICAgIGZlYXR1cmVOYW1lID0gZmVhdHVyZU5hbWVzW25hbWVJZHhdO1xyXG4gICAgICAgICAgLy8gU3VwcG9ydCBkb3QgcHJvcGVydGllcyBhcyBzdWIgdGVzdHMuIFdlIGRvbid0IGRvIGNoZWNraW5nIHRvIG1ha2Ugc3VyZVxyXG4gICAgICAgICAgLy8gdGhhdCB0aGUgaW1wbGllZCBwYXJlbnQgdGVzdHMgaGF2ZSBiZWVuIGFkZGVkLiBZb3UgbXVzdCBjYWxsIHRoZW0gaW5cclxuICAgICAgICAgIC8vIG9yZGVyIChlaXRoZXIgaW4gdGhlIHRlc3QsIG9yIG1ha2UgdGhlIHBhcmVudCB0ZXN0IGEgZGVwZW5kZW5jeSkuXHJcbiAgICAgICAgICAvL1xyXG4gICAgICAgICAgLy8gQ2FwIGl0IHRvIFRXTyB0byBtYWtlIHRoZSBsb2dpYyBzaW1wbGUgYW5kIGJlY2F1c2Ugd2hvIG5lZWRzIHRoYXQga2luZCBvZiBzdWJ0ZXN0aW5nXHJcbiAgICAgICAgICAvLyBoYXNodGFnIGZhbW91cyBsYXN0IHdvcmRzXHJcbiAgICAgICAgICBmZWF0dXJlTmFtZVNwbGl0ID0gZmVhdHVyZU5hbWUuc3BsaXQoJy4nKTtcclxuXHJcbiAgICAgICAgICBpZiAoZmVhdHVyZU5hbWVTcGxpdC5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgTW9kZXJuaXpyW2ZlYXR1cmVOYW1lU3BsaXRbMF1dID0gcmVzdWx0O1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gY2FzdCB0byBhIEJvb2xlYW4sIGlmIG5vdCBvbmUgYWxyZWFkeVxyXG4gICAgICAgICAgICAvKiBqc2hpbnQgLVcwNTMgKi9cclxuICAgICAgICAgICAgaWYgKE1vZGVybml6cltmZWF0dXJlTmFtZVNwbGl0WzBdXSAmJiAhKE1vZGVybml6cltmZWF0dXJlTmFtZVNwbGl0WzBdXSBpbnN0YW5jZW9mIEJvb2xlYW4pKSB7XHJcbiAgICAgICAgICAgICAgTW9kZXJuaXpyW2ZlYXR1cmVOYW1lU3BsaXRbMF1dID0gbmV3IEJvb2xlYW4oTW9kZXJuaXpyW2ZlYXR1cmVOYW1lU3BsaXRbMF1dKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgTW9kZXJuaXpyW2ZlYXR1cmVOYW1lU3BsaXRbMF1dW2ZlYXR1cmVOYW1lU3BsaXRbMV1dID0gcmVzdWx0O1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGNsYXNzZXMucHVzaCgocmVzdWx0ID8gJycgOiAnbm8tJykgKyBmZWF0dXJlTmFtZVNwbGl0LmpvaW4oJy0nKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIDtcclxuXHJcbiAgLyoqXHJcbiAgICogZG9jRWxlbWVudCBpcyBhIGNvbnZlbmllbmNlIHdyYXBwZXIgdG8gZ3JhYiB0aGUgcm9vdCBlbGVtZW50IG9mIHRoZSBkb2N1bWVudFxyXG4gICAqXHJcbiAgICogQGFjY2VzcyBwcml2YXRlXHJcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50fFNWR0VsZW1lbnR9IFRoZSByb290IGVsZW1lbnQgb2YgdGhlIGRvY3VtZW50XHJcbiAgICovXHJcblxyXG4gIHZhciBkb2NFbGVtZW50ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogQSBjb252ZW5pZW5jZSBoZWxwZXIgdG8gY2hlY2sgaWYgdGhlIGRvY3VtZW50IHdlIGFyZSBydW5uaW5nIGluIGlzIGFuIFNWRyBkb2N1bWVudFxyXG4gICAqXHJcbiAgICogQGFjY2VzcyBwcml2YXRlXHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICovXHJcblxyXG4gIHZhciBpc1NWRyA9IGRvY0VsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3N2Zyc7XHJcblxyXG5cclxuICAvKipcclxuICAgKiBzZXRDbGFzc2VzIHRha2VzIGFuIGFycmF5IG9mIGNsYXNzIG5hbWVzIGFuZCBhZGRzIHRoZW0gdG8gdGhlIHJvb3QgZWxlbWVudFxyXG4gICAqXHJcbiAgICogQGFjY2VzcyBwcml2YXRlXHJcbiAgICogQGZ1bmN0aW9uIHNldENsYXNzZXNcclxuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBjbGFzc2VzIC0gQXJyYXkgb2YgY2xhc3MgbmFtZXNcclxuICAgKi9cclxuXHJcbiAgLy8gUGFzcyBpbiBhbiBhbmQgYXJyYXkgb2YgY2xhc3MgbmFtZXMsIGUuZy46XHJcbiAgLy8gIFsnbm8td2VicCcsICdib3JkZXJyYWRpdXMnLCAuLi5dXHJcbiAgZnVuY3Rpb24gc2V0Q2xhc3NlcyhjbGFzc2VzKSB7XHJcbiAgICB2YXIgY2xhc3NOYW1lID0gZG9jRWxlbWVudC5jbGFzc05hbWU7XHJcbiAgICB2YXIgY2xhc3NQcmVmaXggPSBNb2Rlcm5penIuX2NvbmZpZy5jbGFzc1ByZWZpeCB8fCAnJztcclxuXHJcbiAgICBpZiAoaXNTVkcpIHtcclxuICAgICAgY2xhc3NOYW1lID0gY2xhc3NOYW1lLmJhc2VWYWw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2hhbmdlIGBuby1qc2AgdG8gYGpzYCAoaW5kZXBlbmRlbnRseSBvZiB0aGUgYGVuYWJsZUNsYXNzZXNgIG9wdGlvbilcclxuICAgIC8vIEhhbmRsZSBjbGFzc1ByZWZpeCBvbiB0aGlzIHRvb1xyXG4gICAgaWYgKE1vZGVybml6ci5fY29uZmlnLmVuYWJsZUpTQ2xhc3MpIHtcclxuICAgICAgdmFyIHJlSlMgPSBuZXcgUmVnRXhwKCcoXnxcXFxccyknICsgY2xhc3NQcmVmaXggKyAnbm8tanMoXFxcXHN8JCknKTtcclxuICAgICAgY2xhc3NOYW1lID0gY2xhc3NOYW1lLnJlcGxhY2UocmVKUywgJyQxJyArIGNsYXNzUHJlZml4ICsgJ2pzJDInKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoTW9kZXJuaXpyLl9jb25maWcuZW5hYmxlQ2xhc3Nlcykge1xyXG4gICAgICAvLyBBZGQgdGhlIG5ldyBjbGFzc2VzXHJcbiAgICAgIGNsYXNzTmFtZSArPSAnICcgKyBjbGFzc1ByZWZpeCArIGNsYXNzZXMuam9pbignICcgKyBjbGFzc1ByZWZpeCk7XHJcbiAgICAgIGlzU1ZHID8gZG9jRWxlbWVudC5jbGFzc05hbWUuYmFzZVZhbCA9IGNsYXNzTmFtZSA6IGRvY0VsZW1lbnQuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIDtcclxuXHJcbiAgLyoqXHJcbiAgICogTGlzdCBvZiBwcm9wZXJ0eSB2YWx1ZXMgdG8gc2V0IGZvciBjc3MgdGVzdHMuIFNlZSB0aWNrZXQgIzIxXHJcbiAgICogaHR0cDovL2dpdC5pby92VUdsNFxyXG4gICAqXHJcbiAgICogQG1lbWJlcm9mIE1vZGVybml6clxyXG4gICAqIEBuYW1lIE1vZGVybml6ci5fcHJlZml4ZXNcclxuICAgKiBAb3B0aW9uTmFtZSBNb2Rlcm5penIuX3ByZWZpeGVzXHJcbiAgICogQG9wdGlvblByb3AgcHJlZml4ZXNcclxuICAgKiBAYWNjZXNzIHB1YmxpY1xyXG4gICAqIEBleGFtcGxlXHJcbiAgICpcclxuICAgKiBNb2Rlcm5penIuX3ByZWZpeGVzIGlzIHRoZSBpbnRlcm5hbCBsaXN0IG9mIHByZWZpeGVzIHRoYXQgd2UgdGVzdCBhZ2FpbnN0XHJcbiAgICogaW5zaWRlIG9mIHRoaW5ncyBsaWtlIFtwcmVmaXhlZF0oI21vZGVybml6ci1wcmVmaXhlZCkgYW5kIFtwcmVmaXhlZENTU10oIy1jb2RlLW1vZGVybml6ci1wcmVmaXhlZGNzcykuIEl0IGlzIHNpbXBseVxyXG4gICAqIGFuIGFycmF5IG9mIGtlYmFiLWNhc2UgdmVuZG9yIHByZWZpeGVzIHlvdSBjYW4gdXNlIHdpdGhpbiB5b3VyIGNvZGUuXHJcbiAgICpcclxuICAgKiBTb21lIGNvbW1vbiB1c2UgY2FzZXMgaW5jbHVkZVxyXG4gICAqXHJcbiAgICogR2VuZXJhdGluZyBhbGwgcG9zc2libGUgcHJlZml4ZWQgdmVyc2lvbiBvZiBhIENTUyBwcm9wZXJ0eVxyXG4gICAqIGBgYGpzXHJcbiAgICogdmFyIHJ1bGUgPSBNb2Rlcm5penIuX3ByZWZpeGVzLmpvaW4oJ3RyYW5zZm9ybTogcm90YXRlKDIwZGVnKTsgJyk7XHJcbiAgICpcclxuICAgKiBydWxlID09PSAndHJhbnNmb3JtOiByb3RhdGUoMjBkZWcpOyB3ZWJraXQtdHJhbnNmb3JtOiByb3RhdGUoMjBkZWcpOyBtb3otdHJhbnNmb3JtOiByb3RhdGUoMjBkZWcpOyBvLXRyYW5zZm9ybTogcm90YXRlKDIwZGVnKTsgbXMtdHJhbnNmb3JtOiByb3RhdGUoMjBkZWcpOydcclxuICAgKiBgYGBcclxuICAgKlxyXG4gICAqIEdlbmVyYXRpbmcgYWxsIHBvc3NpYmxlIHByZWZpeGVkIHZlcnNpb24gb2YgYSBDU1MgdmFsdWVcclxuICAgKiBgYGBqc1xyXG4gICAqIHJ1bGUgPSAnZGlzcGxheTonICsgIE1vZGVybml6ci5fcHJlZml4ZXMuam9pbignZmxleDsgZGlzcGxheTonKSArICdmbGV4JztcclxuICAgKlxyXG4gICAqIHJ1bGUgPT09ICdkaXNwbGF5OmZsZXg7IGRpc3BsYXk6LXdlYmtpdC1mbGV4OyBkaXNwbGF5Oi1tb3otZmxleDsgZGlzcGxheTotby1mbGV4OyBkaXNwbGF5Oi1tcy1mbGV4OyBkaXNwbGF5OmZsZXgnXHJcbiAgICogYGBgXHJcbiAgICovXHJcblxyXG4gIHZhciBwcmVmaXhlcyA9IChNb2Rlcm5penJQcm90by5fY29uZmlnLnVzZVByZWZpeGVzID8gJyAtd2Via2l0LSAtbW96LSAtby0gLW1zLSAnLnNwbGl0KCcgJykgOiBbXSk7XHJcblxyXG4gIC8vIGV4cG9zZSB0aGVzZSBmb3IgdGhlIHBsdWdpbiBBUEkuIExvb2sgaW4gdGhlIHNvdXJjZSBmb3IgaG93IHRvIGpvaW4oKSB0aGVtIGFnYWluc3QgeW91ciBpbnB1dFxyXG4gIE1vZGVybml6clByb3RvLl9wcmVmaXhlcyA9IHByZWZpeGVzO1xyXG5cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIGNyZWF0ZUVsZW1lbnQgaXMgYSBjb252ZW5pZW5jZSB3cmFwcGVyIGFyb3VuZCBkb2N1bWVudC5jcmVhdGVFbGVtZW50LiBTaW5jZSB3ZVxyXG4gICAqIHVzZSBjcmVhdGVFbGVtZW50IGFsbCBvdmVyIHRoZSBwbGFjZSwgdGhpcyBhbGxvd3MgZm9yIChzbGlnaHRseSkgc21hbGxlciBjb2RlXHJcbiAgICogYXMgd2VsbCBhcyBhYnN0cmFjdGluZyBhd2F5IGlzc3VlcyB3aXRoIGNyZWF0aW5nIGVsZW1lbnRzIGluIGNvbnRleHRzIG90aGVyIHRoYW5cclxuICAgKiBIVE1MIGRvY3VtZW50cyAoZS5nLiBTVkcgZG9jdW1lbnRzKS5cclxuICAgKlxyXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxyXG4gICAqIEBmdW5jdGlvbiBjcmVhdGVFbGVtZW50XHJcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50fFNWR0VsZW1lbnR9IEFuIEhUTUwgb3IgU1ZHIGVsZW1lbnRcclxuICAgKi9cclxuXHJcbiAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudCgpIHtcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAvLyBUaGlzIGlzIHRoZSBjYXNlIGluIElFNywgd2hlcmUgdGhlIHR5cGUgb2YgY3JlYXRlRWxlbWVudCBpcyBcIm9iamVjdFwiLlxyXG4gICAgICAvLyBGb3IgdGhpcyByZWFzb24sIHdlIGNhbm5vdCBjYWxsIGFwcGx5KCkgYXMgT2JqZWN0IGlzIG5vdCBhIEZ1bmN0aW9uLlxyXG4gICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChhcmd1bWVudHNbMF0pO1xyXG4gICAgfSBlbHNlIGlmIChpc1NWRykge1xyXG4gICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TLmNhbGwoZG9jdW1lbnQsICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsIGFyZ3VtZW50c1swXSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudC5hcHBseShkb2N1bWVudCwgYXJndW1lbnRzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIDtcclxuLyohXHJcbntcclxuICBcIm5hbWVcIjogXCJIVE1MNSBWaWRlb1wiLFxyXG4gIFwicHJvcGVydHlcIjogXCJ2aWRlb1wiLFxyXG4gIFwiY2FuaXVzZVwiOiBcInZpZGVvXCIsXHJcbiAgXCJ0YWdzXCI6IFtcImh0bWw1XCJdLFxyXG4gIFwia25vd25CdWdzXCI6IFtcclxuICAgIFwiV2l0aG91dCBRdWlja1RpbWUsIGBNb2Rlcm5penIudmlkZW8uaDI2NGAgd2lsbCBiZSBgdW5kZWZpbmVkYDsgaHR0cHM6Ly9naXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvaXNzdWVzLzU0NlwiXHJcbiAgXSxcclxuICBcInBvbHlmaWxsc1wiOiBbXHJcbiAgICBcImh0bWw1bWVkaWFcIixcclxuICAgIFwibWVkaWFlbGVtZW50anNcIixcclxuICAgIFwic3VibGltZXZpZGVvXCIsXHJcbiAgICBcInZpZGVvanNcIixcclxuICAgIFwibGVhbmJhY2twbGF5ZXJcIixcclxuICAgIFwidmlkZW9mb3JldmVyeWJvZHlcIlxyXG4gIF1cclxufVxyXG4hKi9cclxuLyogRE9DXHJcbkRldGVjdHMgc3VwcG9ydCBmb3IgdGhlIHZpZGVvIGVsZW1lbnQsIGFzIHdlbGwgYXMgdGVzdGluZyB3aGF0IHR5cGVzIG9mIGNvbnRlbnQgaXQgc3VwcG9ydHMuXHJcblxyXG5TdWJwcm9wZXJ0aWVzIGFyZSBwcm92aWRlZCB0byBkZXNjcmliZSBzdXBwb3J0IGZvciBgb2dnYCwgYGgyNjRgIGFuZCBgd2VibWAgZm9ybWF0cywgZS5nLjpcclxuXHJcbmBgYGphdmFzY3JpcHRcclxuTW9kZXJuaXpyLnZpZGVvICAgICAgICAgLy8gdHJ1ZVxyXG5Nb2Rlcm5penIudmlkZW8ub2dnICAgICAvLyAncHJvYmFibHknXHJcbmBgYFxyXG4qL1xyXG5cclxuICAvLyBDb2RlYyB2YWx1ZXMgZnJvbSA6IGdpdGh1Yi5jb20vTmllbHNMZWVuaGVlci9odG1sNXRlc3QvYmxvYi85MTA2YTgvaW5kZXguaHRtbCNMODQ1XHJcbiAgLy8gICAgICAgICAgICAgICAgICAgICB0aHggdG8gTmllbHNMZWVuaGVlciBhbmQgemNvcnBhblxyXG5cclxuICAvLyBOb3RlOiBpbiBzb21lIG9sZGVyIGJyb3dzZXJzLCBcIm5vXCIgd2FzIGEgcmV0dXJuIHZhbHVlIGluc3RlYWQgb2YgZW1wdHkgc3RyaW5nLlxyXG4gIC8vICAgSXQgd2FzIGxpdmUgaW4gRkYzLjUuMCBhbmQgMy41LjEsIGJ1dCBmaXhlZCBpbiAzLjUuMlxyXG4gIC8vICAgSXQgd2FzIGFsc28gbGl2ZSBpbiBTYWZhcmkgNC4wLjAgLSA0LjAuNCwgYnV0IGZpeGVkIGluIDQuMC41XHJcblxyXG4gIE1vZGVybml6ci5hZGRUZXN0KCd2aWRlbycsIGZ1bmN0aW9uKCkge1xyXG4gICAgLyoganNoaW50IC1XMDUzICovXHJcbiAgICB2YXIgZWxlbSA9IGNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJyk7XHJcbiAgICB2YXIgYm9vbCA9IGZhbHNlO1xyXG5cclxuICAgIC8vIElFOSBSdW5uaW5nIG9uIFdpbmRvd3MgU2VydmVyIFNLVSBjYW4gY2F1c2UgYW4gZXhjZXB0aW9uIHRvIGJlIHRocm93biwgYnVnICMyMjRcclxuICAgIHRyeSB7XHJcbiAgICAgIGlmIChib29sID0gISFlbGVtLmNhblBsYXlUeXBlKSB7XHJcbiAgICAgICAgYm9vbCA9IG5ldyBCb29sZWFuKGJvb2wpO1xyXG4gICAgICAgIGJvb2wub2dnID0gZWxlbS5jYW5QbGF5VHlwZSgndmlkZW8vb2dnOyBjb2RlY3M9XCJ0aGVvcmFcIicpLnJlcGxhY2UoL15ubyQvLCAnJyk7XHJcblxyXG4gICAgICAgIC8vIFdpdGhvdXQgUXVpY2tUaW1lLCB0aGlzIHZhbHVlIHdpbGwgYmUgYHVuZGVmaW5lZGAuIGdpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci9pc3N1ZXMvNTQ2XHJcbiAgICAgICAgYm9vbC5oMjY0ID0gZWxlbS5jYW5QbGF5VHlwZSgndmlkZW8vbXA0OyBjb2RlY3M9XCJhdmMxLjQyRTAxRVwiJykucmVwbGFjZSgvXm5vJC8sICcnKTtcclxuXHJcbiAgICAgICAgYm9vbC53ZWJtID0gZWxlbS5jYW5QbGF5VHlwZSgndmlkZW8vd2VibTsgY29kZWNzPVwidnA4LCB2b3JiaXNcIicpLnJlcGxhY2UoL15ubyQvLCAnJyk7XHJcblxyXG4gICAgICAgIGJvb2wudnA5ID0gZWxlbS5jYW5QbGF5VHlwZSgndmlkZW8vd2VibTsgY29kZWNzPVwidnA5XCInKS5yZXBsYWNlKC9ebm8kLywgJycpO1xyXG5cclxuICAgICAgICBib29sLmhscyA9IGVsZW0uY2FuUGxheVR5cGUoJ2FwcGxpY2F0aW9uL3gtbXBlZ1VSTDsgY29kZWNzPVwiYXZjMS40MkUwMUVcIicpLnJlcGxhY2UoL15ubyQvLCAnJyk7XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGUpIHt9XHJcblxyXG4gICAgcmV0dXJuIGJvb2w7XHJcbiAgfSk7XHJcblxyXG4vKiFcclxue1xyXG4gIFwibmFtZVwiOiBcIkNTUyBHcmFkaWVudHNcIixcclxuICBcImNhbml1c2VcIjogXCJjc3MtZ3JhZGllbnRzXCIsXHJcbiAgXCJwcm9wZXJ0eVwiOiBcImNzc2dyYWRpZW50c1wiLFxyXG4gIFwidGFnc1wiOiBbXCJjc3NcIl0sXHJcbiAgXCJrbm93bkJ1Z3NcIjogW1wiRmFsc2UtcG9zaXRpdmVzIG9uIHdlYk9TIChodHRwczovL2dpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci9pc3N1ZXMvMjAyKVwiXSxcclxuICBcIm5vdGVzXCI6IFt7XHJcbiAgICBcIm5hbWVcIjogXCJXZWJraXQgR3JhZGllbnQgU3ludGF4XCIsXHJcbiAgICBcImhyZWZcIjogXCJodHRwczovL3dlYmtpdC5vcmcvYmxvZy8xNzUvaW50cm9kdWNpbmctY3NzLWdyYWRpZW50cy9cIlxyXG4gIH0se1xyXG4gICAgXCJuYW1lXCI6IFwiTGluZWFyIEdyYWRpZW50IFN5bnRheFwiLFxyXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQ1NTL2xpbmVhci1ncmFkaWVudFwiXHJcbiAgfSx7XHJcbiAgICBcIm5hbWVcIjogXCJXM0MgR3JhZGllbnQgU3BlY1wiLFxyXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly9kcmFmdHMuY3Nzd2cub3JnL2Nzcy1pbWFnZXMtMy8jZ3JhZGllbnRzXCJcclxuICB9XVxyXG59XHJcbiEqL1xyXG5cclxuXHJcbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ2Nzc2dyYWRpZW50cycsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIHZhciBzdHIxID0gJ2JhY2tncm91bmQtaW1hZ2U6JztcclxuICAgIHZhciBzdHIyID0gJ2dyYWRpZW50KGxpbmVhcixsZWZ0IHRvcCxyaWdodCBib3R0b20sZnJvbSgjOWY5KSx0byh3aGl0ZSkpOyc7XHJcbiAgICB2YXIgY3NzID0gJyc7XHJcbiAgICB2YXIgYW5nbGU7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHByZWZpeGVzLmxlbmd0aCAtIDE7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICBhbmdsZSA9IChpID09PSAwID8gJ3RvICcgOiAnJyk7XHJcbiAgICAgIGNzcyArPSBzdHIxICsgcHJlZml4ZXNbaV0gKyAnbGluZWFyLWdyYWRpZW50KCcgKyBhbmdsZSArICdsZWZ0IHRvcCwgIzlmOSwgd2hpdGUpOyc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKE1vZGVybml6ci5fY29uZmlnLnVzZVByZWZpeGVzKSB7XHJcbiAgICAvLyBsZWdhY3kgd2Via2l0IHN5bnRheCAoRklYTUU6IHJlbW92ZSB3aGVuIHN5bnRheCBub3QgaW4gdXNlIGFueW1vcmUpXHJcbiAgICAgIGNzcyArPSBzdHIxICsgJy13ZWJraXQtJyArIHN0cjI7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGVsZW0gPSBjcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICB2YXIgc3R5bGUgPSBlbGVtLnN0eWxlO1xyXG4gICAgc3R5bGUuY3NzVGV4dCA9IGNzcztcclxuXHJcbiAgICAvLyBJRTYgcmV0dXJucyB1bmRlZmluZWQgc28gY2FzdCB0byBzdHJpbmdcclxuICAgIHJldHVybiAoJycgKyBzdHlsZS5iYWNrZ3JvdW5kSW1hZ2UpLmluZGV4T2YoJ2dyYWRpZW50JykgPiAtMTtcclxuICB9KTtcclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIGdldEJvZHkgcmV0dXJucyB0aGUgYm9keSBvZiBhIGRvY3VtZW50LCBvciBhbiBlbGVtZW50IHRoYXQgY2FuIHN0YW5kIGluIGZvclxyXG4gICAqIHRoZSBib2R5IGlmIGEgcmVhbCBib2R5IGRvZXMgbm90IGV4aXN0XHJcbiAgICpcclxuICAgKiBAYWNjZXNzIHByaXZhdGVcclxuICAgKiBAZnVuY3Rpb24gZ2V0Qm9keVxyXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudHxTVkdFbGVtZW50fSBSZXR1cm5zIHRoZSByZWFsIGJvZHkgb2YgYSBkb2N1bWVudCwgb3IgYW5cclxuICAgKiBhcnRpZmljaWFsbHkgY3JlYXRlZCBlbGVtZW50IHRoYXQgc3RhbmRzIGluIGZvciB0aGUgYm9keVxyXG4gICAqL1xyXG5cclxuICBmdW5jdGlvbiBnZXRCb2R5KCkge1xyXG4gICAgLy8gQWZ0ZXIgcGFnZSBsb2FkIGluamVjdGluZyBhIGZha2UgYm9keSBkb2Vzbid0IHdvcmsgc28gY2hlY2sgaWYgYm9keSBleGlzdHNcclxuICAgIHZhciBib2R5ID0gZG9jdW1lbnQuYm9keTtcclxuXHJcbiAgICBpZiAoIWJvZHkpIHtcclxuICAgICAgLy8gQ2FuJ3QgdXNlIHRoZSByZWFsIGJvZHkgY3JlYXRlIGEgZmFrZSBvbmUuXHJcbiAgICAgIGJvZHkgPSBjcmVhdGVFbGVtZW50KGlzU1ZHID8gJ3N2ZycgOiAnYm9keScpO1xyXG4gICAgICBib2R5LmZha2UgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBib2R5O1xyXG4gIH1cclxuXHJcbiAgO1xyXG5cclxuICAvKipcclxuICAgKiBpbmplY3RFbGVtZW50V2l0aFN0eWxlcyBpbmplY3RzIGFuIGVsZW1lbnQgd2l0aCBzdHlsZSBlbGVtZW50IGFuZCBzb21lIENTUyBydWxlc1xyXG4gICAqXHJcbiAgICogQGFjY2VzcyBwcml2YXRlXHJcbiAgICogQGZ1bmN0aW9uIGluamVjdEVsZW1lbnRXaXRoU3R5bGVzXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJ1bGUgLSBTdHJpbmcgcmVwcmVzZW50aW5nIGEgY3NzIHJ1bGVcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIEEgZnVuY3Rpb24gdGhhdCBpcyB1c2VkIHRvIHRlc3QgdGhlIGluamVjdGVkIGVsZW1lbnRcclxuICAgKiBAcGFyYW0ge251bWJlcn0gW25vZGVzXSAtIEFuIGludGVnZXIgcmVwcmVzZW50aW5nIHRoZSBudW1iZXIgb2YgYWRkaXRpb25hbCBub2RlcyB5b3Ugd2FudCBpbmplY3RlZFxyXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IFt0ZXN0bmFtZXNdIC0gQW4gYXJyYXkgb2Ygc3RyaW5ncyB0aGF0IGFyZSB1c2VkIGFzIGlkcyBmb3IgdGhlIGFkZGl0aW9uYWwgbm9kZXNcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgKi9cclxuXHJcbiAgZnVuY3Rpb24gaW5qZWN0RWxlbWVudFdpdGhTdHlsZXMocnVsZSwgY2FsbGJhY2ssIG5vZGVzLCB0ZXN0bmFtZXMpIHtcclxuICAgIHZhciBtb2QgPSAnbW9kZXJuaXpyJztcclxuICAgIHZhciBzdHlsZTtcclxuICAgIHZhciByZXQ7XHJcbiAgICB2YXIgbm9kZTtcclxuICAgIHZhciBkb2NPdmVyZmxvdztcclxuICAgIHZhciBkaXYgPSBjcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHZhciBib2R5ID0gZ2V0Qm9keSgpO1xyXG5cclxuICAgIGlmIChwYXJzZUludChub2RlcywgMTApKSB7XHJcbiAgICAgIC8vIEluIG9yZGVyIG5vdCB0byBnaXZlIGZhbHNlIHBvc2l0aXZlcyB3ZSBjcmVhdGUgYSBub2RlIGZvciBlYWNoIHRlc3RcclxuICAgICAgLy8gVGhpcyBhbHNvIGFsbG93cyB0aGUgbWV0aG9kIHRvIHNjYWxlIGZvciB1bnNwZWNpZmllZCB1c2VzXHJcbiAgICAgIHdoaWxlIChub2Rlcy0tKSB7XHJcbiAgICAgICAgbm9kZSA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIG5vZGUuaWQgPSB0ZXN0bmFtZXMgPyB0ZXN0bmFtZXNbbm9kZXNdIDogbW9kICsgKG5vZGVzICsgMSk7XHJcbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKG5vZGUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3R5bGUgPSBjcmVhdGVFbGVtZW50KCdzdHlsZScpO1xyXG4gICAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XHJcbiAgICBzdHlsZS5pZCA9ICdzJyArIG1vZDtcclxuXHJcbiAgICAvLyBJRTYgd2lsbCBmYWxzZSBwb3NpdGl2ZSBvbiBzb21lIHRlc3RzIGR1ZSB0byB0aGUgc3R5bGUgZWxlbWVudCBpbnNpZGUgdGhlIHRlc3QgZGl2IHNvbWVob3cgaW50ZXJmZXJpbmcgb2Zmc2V0SGVpZ2h0LCBzbyBpbnNlcnQgaXQgaW50byBib2R5IG9yIGZha2Vib2R5LlxyXG4gICAgLy8gT3BlcmEgd2lsbCBhY3QgYWxsIHF1aXJreSB3aGVuIGluamVjdGluZyBlbGVtZW50cyBpbiBkb2N1bWVudEVsZW1lbnQgd2hlbiBwYWdlIGlzIHNlcnZlZCBhcyB4bWwsIG5lZWRzIGZha2Vib2R5IHRvby4gIzI3MFxyXG4gICAgKCFib2R5LmZha2UgPyBkaXYgOiBib2R5KS5hcHBlbmRDaGlsZChzdHlsZSk7XHJcbiAgICBib2R5LmFwcGVuZENoaWxkKGRpdik7XHJcblxyXG4gICAgaWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcclxuICAgICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gcnVsZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHJ1bGUpKTtcclxuICAgIH1cclxuICAgIGRpdi5pZCA9IG1vZDtcclxuXHJcbiAgICBpZiAoYm9keS5mYWtlKSB7XHJcbiAgICAgIC8vYXZvaWQgY3Jhc2hpbmcgSUU4LCBpZiBiYWNrZ3JvdW5kIGltYWdlIGlzIHVzZWRcclxuICAgICAgYm9keS5zdHlsZS5iYWNrZ3JvdW5kID0gJyc7XHJcbiAgICAgIC8vU2FmYXJpIDUuMTMvNS4xLjQgT1NYIHN0b3BzIGxvYWRpbmcgaWYgOjotd2Via2l0LXNjcm9sbGJhciBpcyB1c2VkIGFuZCBzY3JvbGxiYXJzIGFyZSB2aXNpYmxlXHJcbiAgICAgIGJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcclxuICAgICAgZG9jT3ZlcmZsb3cgPSBkb2NFbGVtZW50LnN0eWxlLm92ZXJmbG93O1xyXG4gICAgICBkb2NFbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XHJcbiAgICAgIGRvY0VsZW1lbnQuYXBwZW5kQ2hpbGQoYm9keSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0ID0gY2FsbGJhY2soZGl2LCBydWxlKTtcclxuICAgIC8vIElmIHRoaXMgaXMgZG9uZSBhZnRlciBwYWdlIGxvYWQgd2UgZG9uJ3Qgd2FudCB0byByZW1vdmUgdGhlIGJvZHkgc28gY2hlY2sgaWYgYm9keSBleGlzdHNcclxuICAgIGlmIChib2R5LmZha2UpIHtcclxuICAgICAgYm9keS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGJvZHkpO1xyXG4gICAgICBkb2NFbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gZG9jT3ZlcmZsb3c7XHJcbiAgICAgIC8vIFRyaWdnZXIgbGF5b3V0IHNvIGtpbmV0aWMgc2Nyb2xsaW5nIGlzbid0IGRpc2FibGVkIGluIGlPUzYrXHJcbiAgICAgIGRvY0VsZW1lbnQub2Zmc2V0SGVpZ2h0O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZGl2LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZGl2KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gISFyZXQ7XHJcblxyXG4gIH1cclxuXHJcbiAgO1xyXG5cclxuICAvKipcclxuICAgKiB0ZXN0U3R5bGVzIGluamVjdHMgYW4gZWxlbWVudCB3aXRoIHN0eWxlIGVsZW1lbnQgYW5kIHNvbWUgQ1NTIHJ1bGVzXHJcbiAgICpcclxuICAgKiBAbWVtYmVyb2YgTW9kZXJuaXpyXHJcbiAgICogQG5hbWUgTW9kZXJuaXpyLnRlc3RTdHlsZXNcclxuICAgKiBAb3B0aW9uTmFtZSBNb2Rlcm5penIudGVzdFN0eWxlcygpXHJcbiAgICogQG9wdGlvblByb3AgdGVzdFN0eWxlc1xyXG4gICAqIEBhY2Nlc3MgcHVibGljXHJcbiAgICogQGZ1bmN0aW9uIHRlc3RTdHlsZXNcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcnVsZSAtIFN0cmluZyByZXByZXNlbnRpbmcgYSBjc3MgcnVsZVxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gQSBmdW5jdGlvbiB0aGF0IGlzIHVzZWQgdG8gdGVzdCB0aGUgaW5qZWN0ZWQgZWxlbWVudFxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbbm9kZXNdIC0gQW4gaW50ZWdlciByZXByZXNlbnRpbmcgdGhlIG51bWJlciBvZiBhZGRpdGlvbmFsIG5vZGVzIHlvdSB3YW50IGluamVjdGVkXHJcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gW3Rlc3RuYW1lc10gLSBBbiBhcnJheSBvZiBzdHJpbmdzIHRoYXQgYXJlIHVzZWQgYXMgaWRzIGZvciB0aGUgYWRkaXRpb25hbCBub2Rlc1xyXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAqIEBleGFtcGxlXHJcbiAgICpcclxuICAgKiBgTW9kZXJuaXpyLnRlc3RTdHlsZXNgIHRha2VzIGEgQ1NTIHJ1bGUgYW5kIGluamVjdHMgaXQgb250byB0aGUgY3VycmVudCBwYWdlXHJcbiAgICogYWxvbmcgd2l0aCAocG9zc2libHkgbXVsdGlwbGUpIERPTSBlbGVtZW50cy4gVGhpcyBsZXRzIHlvdSBjaGVjayBmb3IgZmVhdHVyZXNcclxuICAgKiB0aGF0IGNhbiBub3QgYmUgZGV0ZWN0ZWQgYnkgc2ltcGx5IGNoZWNraW5nIHRoZSBbSURMXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL01vemlsbGEvRGV2ZWxvcGVyX2d1aWRlL0ludGVyZmFjZV9kZXZlbG9wbWVudF9ndWlkZS9JRExfaW50ZXJmYWNlX3J1bGVzKS5cclxuICAgKlxyXG4gICAqIGBgYGpzXHJcbiAgICogTW9kZXJuaXpyLnRlc3RTdHlsZXMoJyNtb2Rlcm5penIgeyB3aWR0aDogOXB4OyBjb2xvcjogcGFwYXlhd2hpcDsgfScsIGZ1bmN0aW9uKGVsZW0sIHJ1bGUpIHtcclxuICAgKiAgIC8vIGVsZW0gaXMgdGhlIGZpcnN0IERPTSBub2RlIGluIHRoZSBwYWdlIChieSBkZWZhdWx0ICNtb2Rlcm5penIpXHJcbiAgICogICAvLyBydWxlIGlzIHRoZSBmaXJzdCBhcmd1bWVudCB5b3Ugc3VwcGxpZWQgLSB0aGUgQ1NTIHJ1bGUgaW4gc3RyaW5nIGZvcm1cclxuICAgKlxyXG4gICAqICAgYWRkVGVzdCgnd2lkdGh3b3JrcycsIGVsZW0uc3R5bGUud2lkdGggPT09ICc5cHgnKVxyXG4gICAqIH0pO1xyXG4gICAqIGBgYFxyXG4gICAqXHJcbiAgICogSWYgeW91ciB0ZXN0IHJlcXVpcmVzIG11bHRpcGxlIG5vZGVzLCB5b3UgY2FuIGluY2x1ZGUgYSB0aGlyZCBhcmd1bWVudFxyXG4gICAqIGluZGljYXRpbmcgaG93IG1hbnkgYWRkaXRpb25hbCBkaXYgZWxlbWVudHMgdG8gaW5jbHVkZSBvbiB0aGUgcGFnZS4gVGhlXHJcbiAgICogYWRkaXRpb25hbCBub2RlcyBhcmUgaW5qZWN0ZWQgYXMgY2hpbGRyZW4gb2YgdGhlIGBlbGVtYCB0aGF0IGlzIHJldHVybmVkIGFzXHJcbiAgICogdGhlIGZpcnN0IGFyZ3VtZW50IHRvIHRoZSBjYWxsYmFjay5cclxuICAgKlxyXG4gICAqIGBgYGpzXHJcbiAgICogTW9kZXJuaXpyLnRlc3RTdHlsZXMoJyNtb2Rlcm5penIge3dpZHRoOiAxcHh9OyAjbW9kZXJuaXpyMiB7d2lkdGg6IDJweH0nLCBmdW5jdGlvbihlbGVtKSB7XHJcbiAgICogICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kZXJuaXpyJykuc3R5bGUud2lkdGggPT09ICcxcHgnOyAvLyB0cnVlXHJcbiAgICogICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kZXJuaXpyMicpLnN0eWxlLndpZHRoID09PSAnMnB4JzsgLy8gdHJ1ZVxyXG4gICAqICAgZWxlbS5maXJzdENoaWxkID09PSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kZXJuaXpyMicpOyAvLyB0cnVlXHJcbiAgICogfSwgMSk7XHJcbiAgICogYGBgXHJcbiAgICpcclxuICAgKiBCeSBkZWZhdWx0LCBhbGwgb2YgdGhlIGFkZGl0aW9uYWwgZWxlbWVudHMgaGF2ZSBhbiBJRCBvZiBgbW9kZXJuaXpyW25dYCwgd2hlcmVcclxuICAgKiBgbmAgaXMgaXRzIGluZGV4IChlLmcuIHRoZSBmaXJzdCBhZGRpdGlvbmFsLCBzZWNvbmQgb3ZlcmFsbCBpcyBgI21vZGVybml6cjJgLFxyXG4gICAqIHRoZSBzZWNvbmQgYWRkaXRpb25hbCBpcyBgI21vZGVybml6cjNgLCBldGMuKS5cclxuICAgKiBJZiB5b3Ugd2FudCB0byBoYXZlIG1vcmUgbWVhbmluZ2Z1bCBJRHMgZm9yIHlvdXIgZnVuY3Rpb24sIHlvdSBjYW4gcHJvdmlkZVxyXG4gICAqIHRoZW0gYXMgdGhlIGZvdXJ0aCBhcmd1bWVudCwgYXMgYW4gYXJyYXkgb2Ygc3RyaW5nc1xyXG4gICAqXHJcbiAgICogYGBganNcclxuICAgKiBNb2Rlcm5penIudGVzdFN0eWxlcygnI2ZvbyB7d2lkdGg6IDEwcHh9OyAjYmFyIHtoZWlnaHQ6IDIwcHh9JywgZnVuY3Rpb24oZWxlbSkge1xyXG4gICAqICAgZWxlbS5maXJzdENoaWxkID09PSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm9vJyk7IC8vIHRydWVcclxuICAgKiAgIGVsZW0ubGFzdENoaWxkID09PSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFyJyk7IC8vIHRydWVcclxuICAgKiB9LCAyLCBbJ2ZvbycsICdiYXInXSk7XHJcbiAgICogYGBgXHJcbiAgICpcclxuICAgKi9cclxuXHJcbiAgdmFyIHRlc3RTdHlsZXMgPSBNb2Rlcm5penJQcm90by50ZXN0U3R5bGVzID0gaW5qZWN0RWxlbWVudFdpdGhTdHlsZXM7XHJcblxyXG4vKiFcclxue1xyXG4gIFwibmFtZVwiOiBcIlRvdWNoIEV2ZW50c1wiLFxyXG4gIFwicHJvcGVydHlcIjogXCJ0b3VjaGV2ZW50c1wiLFxyXG4gIFwiY2FuaXVzZVwiIDogXCJ0b3VjaFwiLFxyXG4gIFwidGFnc1wiOiBbXCJtZWRpYVwiLCBcImF0dHJpYnV0ZVwiXSxcclxuICBcIm5vdGVzXCI6IFt7XHJcbiAgICBcIm5hbWVcIjogXCJUb3VjaCBFdmVudHMgc3BlY1wiLFxyXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly93d3cudzMub3JnL1RSLzIwMTMvV0QtdG91Y2gtZXZlbnRzLTIwMTMwMTI0L1wiXHJcbiAgfV0sXHJcbiAgXCJ3YXJuaW5nc1wiOiBbXHJcbiAgICBcIkluZGljYXRlcyBpZiB0aGUgYnJvd3NlciBzdXBwb3J0cyB0aGUgVG91Y2ggRXZlbnRzIHNwZWMsIGFuZCBkb2VzIG5vdCBuZWNlc3NhcmlseSByZWZsZWN0IGEgdG91Y2hzY3JlZW4gZGV2aWNlXCJcclxuICBdLFxyXG4gIFwia25vd25CdWdzXCI6IFtcclxuICAgIFwiRmFsc2UtcG9zaXRpdmUgb24gc29tZSBjb25maWd1cmF0aW9ucyBvZiBOb2tpYSBOOTAwXCIsXHJcbiAgICBcIkZhbHNlLXBvc2l0aXZlIG9uIHNvbWUgQmxhY2tCZXJyeSA2LjAgYnVpbGRzIOKAkyBodHRwczovL2dpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci9pc3N1ZXMvMzcyI2lzc3VlY29tbWVudC0zMTEyNjk1XCJcclxuICBdXHJcbn1cclxuISovXHJcbi8qIERPQ1xyXG5JbmRpY2F0ZXMgaWYgdGhlIGJyb3dzZXIgc3VwcG9ydHMgdGhlIFczQyBUb3VjaCBFdmVudHMgQVBJLlxyXG5cclxuVGhpcyAqZG9lcyBub3QqIG5lY2Vzc2FyaWx5IHJlZmxlY3QgYSB0b3VjaHNjcmVlbiBkZXZpY2U6XHJcblxyXG4qIE9sZGVyIHRvdWNoc2NyZWVuIGRldmljZXMgb25seSBlbXVsYXRlIG1vdXNlIGV2ZW50c1xyXG4qIE1vZGVybiBJRSB0b3VjaCBkZXZpY2VzIGltcGxlbWVudCB0aGUgUG9pbnRlciBFdmVudHMgQVBJIGluc3RlYWQ6IHVzZSBgTW9kZXJuaXpyLnBvaW50ZXJldmVudHNgIHRvIGRldGVjdCBzdXBwb3J0IGZvciB0aGF0XHJcbiogU29tZSBicm93c2VycyAmIE9TIHNldHVwcyBtYXkgZW5hYmxlIHRvdWNoIEFQSXMgd2hlbiBubyB0b3VjaHNjcmVlbiBpcyBjb25uZWN0ZWRcclxuKiBGdXR1cmUgYnJvd3NlcnMgbWF5IGltcGxlbWVudCBvdGhlciBldmVudCBtb2RlbHMgZm9yIHRvdWNoIGludGVyYWN0aW9uc1xyXG5cclxuU2VlIHRoaXMgYXJ0aWNsZTogW1lvdSBDYW4ndCBEZXRlY3QgQSBUb3VjaHNjcmVlbl0oaHR0cDovL3d3dy5zdHVjb3guY29tL2Jsb2cveW91LWNhbnQtZGV0ZWN0LWEtdG91Y2hzY3JlZW4vKS5cclxuXHJcbkl0J3MgcmVjb21tZW5kZWQgdG8gYmluZCBib3RoIG1vdXNlIGFuZCB0b3VjaC9wb2ludGVyIGV2ZW50cyBzaW11bHRhbmVvdXNseSDigJMgc2VlIFt0aGlzIEhUTUw1IFJvY2tzIHR1dG9yaWFsXShodHRwOi8vd3d3Lmh0bWw1cm9ja3MuY29tL2VuL21vYmlsZS90b3VjaGFuZG1vdXNlLykuXHJcblxyXG5UaGlzIHRlc3Qgd2lsbCBhbHNvIHJldHVybiBgdHJ1ZWAgZm9yIEZpcmVmb3ggNCBNdWx0aXRvdWNoIHN1cHBvcnQuXHJcbiovXHJcblxyXG4gIC8vIENocm9tZSAoZGVza3RvcCkgdXNlZCB0byBsaWUgYWJvdXQgaXRzIHN1cHBvcnQgb24gdGhpcywgYnV0IHRoYXQgaGFzIHNpbmNlIGJlZW4gcmVjdGlmaWVkOiBodHRwOi8vY3JidWcuY29tLzM2NDE1XHJcbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ3RvdWNoZXZlbnRzJywgZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgYm9vbDtcclxuICAgIGlmICgoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KSB8fCB3aW5kb3cuRG9jdW1lbnRUb3VjaCAmJiBkb2N1bWVudCBpbnN0YW5jZW9mIERvY3VtZW50VG91Y2gpIHtcclxuICAgICAgYm9vbCA9IHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBpbmNsdWRlIHRoZSAnaGVhcnR6JyBhcyBhIHdheSB0byBoYXZlIGEgbm9uIG1hdGNoaW5nIE1RIHRvIGhlbHAgdGVybWluYXRlIHRoZSBqb2luXHJcbiAgICAgIC8vIGh0dHBzOi8vZ2l0LmlvL3Z6bkZIXHJcbiAgICAgIHZhciBxdWVyeSA9IFsnQG1lZGlhICgnLCBwcmVmaXhlcy5qb2luKCd0b3VjaC1lbmFibGVkKSwoJyksICdoZWFydHonLCAnKScsICd7I21vZGVybml6cnt0b3A6OXB4O3Bvc2l0aW9uOmFic29sdXRlfX0nXS5qb2luKCcnKTtcclxuICAgICAgdGVzdFN0eWxlcyhxdWVyeSwgZnVuY3Rpb24obm9kZSkge1xyXG4gICAgICAgIGJvb2wgPSBub2RlLm9mZnNldFRvcCA9PT0gOTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYm9vbDtcclxuICB9KTtcclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIE1vZGVybml6ci5tcSB0ZXN0cyBhIGdpdmVuIG1lZGlhIHF1ZXJ5LCBsaXZlIGFnYWluc3QgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIHdpbmRvd1xyXG4gICAqIGFkYXB0ZWQgZnJvbSBtYXRjaE1lZGlhIHBvbHlmaWxsIGJ5IFNjb3R0IEplaGwgYW5kIFBhdWwgSXJpc2hcclxuICAgKiBnaXN0LmdpdGh1Yi5jb20vNzg2NzY4XHJcbiAgICpcclxuICAgKiBAbWVtYmVyb2YgTW9kZXJuaXpyXHJcbiAgICogQG5hbWUgTW9kZXJuaXpyLm1xXHJcbiAgICogQG9wdGlvbk5hbWUgTW9kZXJuaXpyLm1xKClcclxuICAgKiBAb3B0aW9uUHJvcCBtcVxyXG4gICAqIEBhY2Nlc3MgcHVibGljXHJcbiAgICogQGZ1bmN0aW9uIG1xXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1xIC0gU3RyaW5nIG9mIHRoZSBtZWRpYSBxdWVyeSB3ZSB3YW50IHRvIHRlc3RcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgKiBAZXhhbXBsZVxyXG4gICAqIE1vZGVybml6ci5tcSBhbGxvd3MgZm9yIHlvdSB0byBwcm9ncmFtbWF0aWNhbGx5IGNoZWNrIGlmIHRoZSBjdXJyZW50IGJyb3dzZXJcclxuICAgKiB3aW5kb3cgc3RhdGUgbWF0Y2hlcyBhIG1lZGlhIHF1ZXJ5LlxyXG4gICAqXHJcbiAgICogYGBganNcclxuICAgKiAgdmFyIHF1ZXJ5ID0gTW9kZXJuaXpyLm1xKCcobWluLXdpZHRoOiA5MDBweCknKTtcclxuICAgKlxyXG4gICAqICBpZiAocXVlcnkpIHtcclxuICAgKiAgICAvLyB0aGUgYnJvd3NlciB3aW5kb3cgaXMgbGFyZ2VyIHRoYW4gOTAwcHhcclxuICAgKiAgfVxyXG4gICAqIGBgYFxyXG4gICAqXHJcbiAgICogT25seSB2YWxpZCBtZWRpYSBxdWVyaWVzIGFyZSBzdXBwb3J0ZWQsIHRoZXJlZm9yZSB5b3UgbXVzdCBhbHdheXMgaW5jbHVkZSB2YWx1ZXNcclxuICAgKiB3aXRoIHlvdXIgbWVkaWEgcXVlcnlcclxuICAgKlxyXG4gICAqIGBgYGpzXHJcbiAgICogLy8gZ29vZFxyXG4gICAqICBNb2Rlcm5penIubXEoJyhtaW4td2lkdGg6IDkwMHB4KScpO1xyXG4gICAqXHJcbiAgICogLy8gYmFkXHJcbiAgICogIE1vZGVybml6ci5tcSgnbWluLXdpZHRoJyk7XHJcbiAgICogYGBgXHJcbiAgICpcclxuICAgKiBJZiB5b3Ugd291bGQganVzdCBsaWtlIHRvIHRlc3QgdGhhdCBtZWRpYSBxdWVyaWVzIGFyZSBzdXBwb3J0ZWQgaW4gZ2VuZXJhbCwgdXNlXHJcbiAgICpcclxuICAgKiBgYGBqc1xyXG4gICAqICBNb2Rlcm5penIubXEoJ29ubHkgYWxsJyk7IC8vIHRydWUgaWYgTVEgYXJlIHN1cHBvcnRlZCwgZmFsc2UgaWYgbm90XHJcbiAgICogYGBgXHJcbiAgICpcclxuICAgKlxyXG4gICAqIE5vdGUgdGhhdCBpZiB0aGUgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IG1lZGlhIHF1ZXJpZXMgKGUuZy4gb2xkIElFKSBtcSB3aWxsXHJcbiAgICogYWx3YXlzIHJldHVybiBmYWxzZS5cclxuICAgKi9cclxuXHJcbiAgdmFyIG1xID0gKGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIG1hdGNoTWVkaWEgPSB3aW5kb3cubWF0Y2hNZWRpYSB8fCB3aW5kb3cubXNNYXRjaE1lZGlhO1xyXG4gICAgaWYgKG1hdGNoTWVkaWEpIHtcclxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKG1xKSB7XHJcbiAgICAgICAgdmFyIG1xbCA9IG1hdGNoTWVkaWEobXEpO1xyXG4gICAgICAgIHJldHVybiBtcWwgJiYgbXFsLm1hdGNoZXMgfHwgZmFsc2U7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKG1xKSB7XHJcbiAgICAgIHZhciBib29sID0gZmFsc2U7XHJcblxyXG4gICAgICBpbmplY3RFbGVtZW50V2l0aFN0eWxlcygnQG1lZGlhICcgKyBtcSArICcgeyAjbW9kZXJuaXpyIHsgcG9zaXRpb246IGFic29sdXRlOyB9IH0nLCBmdW5jdGlvbihub2RlKSB7XHJcbiAgICAgICAgYm9vbCA9ICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSA/XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShub2RlLCBudWxsKSA6XHJcbiAgICAgICAgICAgICAgICBub2RlLmN1cnJlbnRTdHlsZSkucG9zaXRpb24gPT0gJ2Fic29sdXRlJztcclxuICAgICAgfSk7XHJcblxyXG4gICAgICByZXR1cm4gYm9vbDtcclxuICAgIH07XHJcbiAgfSkoKTtcclxuXHJcblxyXG4gIE1vZGVybml6clByb3RvLm1xID0gbXE7XHJcblxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogSWYgdGhlIGJyb3dzZXJzIGZvbGxvdyB0aGUgc3BlYywgdGhlbiB0aGV5IHdvdWxkIGV4cG9zZSB2ZW5kb3Itc3BlY2lmaWMgc3R5bGUgYXM6XHJcbiAgICogICBlbGVtLnN0eWxlLldlYmtpdEJvcmRlclJhZGl1c1xyXG4gICAqIGluc3RlYWQgb2Ygc29tZXRoaW5nIGxpa2UgdGhlIGZvbGxvd2luZywgd2hpY2ggd291bGQgYmUgdGVjaG5pY2FsbHkgaW5jb3JyZWN0OlxyXG4gICAqICAgZWxlbS5zdHlsZS53ZWJraXRCb3JkZXJSYWRpdXNcclxuXHJcbiAgICogV2Via2l0IGdob3N0cyB0aGVpciBwcm9wZXJ0aWVzIGluIGxvd2VyY2FzZSBidXQgT3BlcmEgJiBNb3ogZG8gbm90LlxyXG4gICAqIE1pY3Jvc29mdCB1c2VzIGEgbG93ZXJjYXNlIGBtc2AgaW5zdGVhZCBvZiB0aGUgY29ycmVjdCBgTXNgIGluIElFOCtcclxuICAgKiAgIGVyaWsuZWFlLm5ldC9hcmNoaXZlcy8yMDA4LzAzLzEwLzIxLjQ4LjEwL1xyXG5cclxuICAgKiBNb3JlIGhlcmU6IGdpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci9pc3N1ZXMvaXNzdWUvMjFcclxuICAgKlxyXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxyXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2ZW5kb3Itc3BlY2lmaWMgc3R5bGUgcHJvcGVydGllc1xyXG4gICAqL1xyXG5cclxuICB2YXIgb21QcmVmaXhlcyA9ICdNb3ogTyBtcyBXZWJraXQnO1xyXG5cclxuXHJcbiAgdmFyIGNzc29tUHJlZml4ZXMgPSAoTW9kZXJuaXpyUHJvdG8uX2NvbmZpZy51c2VQcmVmaXhlcyA/IG9tUHJlZml4ZXMuc3BsaXQoJyAnKSA6IFtdKTtcclxuICBNb2Rlcm5penJQcm90by5fY3Nzb21QcmVmaXhlcyA9IGNzc29tUHJlZml4ZXM7XHJcblxyXG5cclxuICAvKipcclxuICAgKiBMaXN0IG9mIEphdmFTY3JpcHQgRE9NIHZhbHVlcyB1c2VkIGZvciB0ZXN0c1xyXG4gICAqXHJcbiAgICogQG1lbWJlcm9mIE1vZGVybml6clxyXG4gICAqIEBuYW1lIE1vZGVybml6ci5fZG9tUHJlZml4ZXNcclxuICAgKiBAb3B0aW9uTmFtZSBNb2Rlcm5penIuX2RvbVByZWZpeGVzXHJcbiAgICogQG9wdGlvblByb3AgZG9tUHJlZml4ZXNcclxuICAgKiBAYWNjZXNzIHB1YmxpY1xyXG4gICAqIEBleGFtcGxlXHJcbiAgICpcclxuICAgKiBNb2Rlcm5penIuX2RvbVByZWZpeGVzIGlzIGV4YWN0bHkgdGhlIHNhbWUgYXMgW19wcmVmaXhlc10oI21vZGVybml6ci1fcHJlZml4ZXMpLCBidXQgcmF0aGVyXHJcbiAgICogdGhhbiBrZWJhYi1jYXNlIHByb3BlcnRpZXMsIGFsbCBwcm9wZXJ0aWVzIGFyZSB0aGVpciBDYXBpdGFsaXplZCB2YXJpYW50XHJcbiAgICpcclxuICAgKiBgYGBqc1xyXG4gICAqIE1vZGVybml6ci5fZG9tUHJlZml4ZXMgPT09IFsgXCJNb3pcIiwgXCJPXCIsIFwibXNcIiwgXCJXZWJraXRcIiBdO1xyXG4gICAqIGBgYFxyXG4gICAqL1xyXG5cclxuICB2YXIgZG9tUHJlZml4ZXMgPSAoTW9kZXJuaXpyUHJvdG8uX2NvbmZpZy51c2VQcmVmaXhlcyA/IG9tUHJlZml4ZXMudG9Mb3dlckNhc2UoKS5zcGxpdCgnICcpIDogW10pO1xyXG4gIE1vZGVybml6clByb3RvLl9kb21QcmVmaXhlcyA9IGRvbVByZWZpeGVzO1xyXG5cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIGNvbnRhaW5zIGNoZWNrcyB0byBzZWUgaWYgYSBzdHJpbmcgY29udGFpbnMgYW5vdGhlciBzdHJpbmdcclxuICAgKlxyXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxyXG4gICAqIEBmdW5jdGlvbiBjb250YWluc1xyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgLSBUaGUgc3RyaW5nIHdlIHdhbnQgdG8gY2hlY2sgZm9yIHN1YnN0cmluZ3NcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3Vic3RyIC0gVGhlIHN1YnN0cmluZyB3ZSB3YW50IHRvIHNlYXJjaCB0aGUgZmlyc3Qgc3RyaW5nIGZvclxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAqL1xyXG5cclxuICBmdW5jdGlvbiBjb250YWlucyhzdHIsIHN1YnN0cikge1xyXG4gICAgcmV0dXJuICEhfignJyArIHN0cikuaW5kZXhPZihzdWJzdHIpO1xyXG4gIH1cclxuXHJcbiAgO1xyXG5cclxuICAvKipcclxuICAgKiBjc3NUb0RPTSB0YWtlcyBhIGtlYmFiLWNhc2Ugc3RyaW5nIGFuZCBjb252ZXJ0cyBpdCB0byBjYW1lbENhc2VcclxuICAgKiBlLmcuIGJveC1zaXppbmcgLT4gYm94U2l6aW5nXHJcbiAgICpcclxuICAgKiBAYWNjZXNzIHByaXZhdGVcclxuICAgKiBAZnVuY3Rpb24gY3NzVG9ET01cclxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIFN0cmluZyBuYW1lIG9mIGtlYmFiLWNhc2UgcHJvcCB3ZSB3YW50IHRvIGNvbnZlcnRcclxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY2FtZWxDYXNlIHZlcnNpb24gb2YgdGhlIHN1cHBsaWVkIG5hbWVcclxuICAgKi9cclxuXHJcbiAgZnVuY3Rpb24gY3NzVG9ET00obmFtZSkge1xyXG4gICAgcmV0dXJuIG5hbWUucmVwbGFjZSgvKFthLXpdKS0oW2Etel0pL2csIGZ1bmN0aW9uKHN0ciwgbTEsIG0yKSB7XHJcbiAgICAgIHJldHVybiBtMSArIG0yLnRvVXBwZXJDYXNlKCk7XHJcbiAgICB9KS5yZXBsYWNlKC9eLS8sICcnKTtcclxuICB9XHJcbiAgO1xyXG5cclxuICAvKipcclxuICAgKiBmbkJpbmQgaXMgYSBzdXBlciBzbWFsbCBbYmluZF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvRnVuY3Rpb24vYmluZCkgcG9seWZpbGwuXHJcbiAgICpcclxuICAgKiBAYWNjZXNzIHByaXZhdGVcclxuICAgKiBAZnVuY3Rpb24gZm5CaW5kXHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gZm4gLSBhIGZ1bmN0aW9uIHlvdSB3YW50IHRvIGNoYW5nZSBgdGhpc2AgcmVmZXJlbmNlIHRvXHJcbiAgICogQHBhcmFtIHtvYmplY3R9IHRoYXQgLSB0aGUgYHRoaXNgIHlvdSB3YW50IHRvIGNhbGwgdGhlIGZ1bmN0aW9uIHdpdGhcclxuICAgKiBAcmV0dXJucyB7ZnVuY3Rpb259IFRoZSB3cmFwcGVkIHZlcnNpb24gb2YgdGhlIHN1cHBsaWVkIGZ1bmN0aW9uXHJcbiAgICovXHJcblxyXG4gIGZ1bmN0aW9uIGZuQmluZChmbiwgdGhhdCkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICA7XHJcblxyXG4gIC8qKlxyXG4gICAqIHRlc3RET01Qcm9wcyBpcyBhIGdlbmVyaWMgRE9NIHByb3BlcnR5IHRlc3Q7IGlmIGEgYnJvd3NlciBzdXBwb3J0c1xyXG4gICAqICAgYSBjZXJ0YWluIHByb3BlcnR5LCBpdCB3b24ndCByZXR1cm4gdW5kZWZpbmVkIGZvciBpdC5cclxuICAgKlxyXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxyXG4gICAqIEBmdW5jdGlvbiB0ZXN0RE9NUHJvcHNcclxuICAgKiBAcGFyYW0ge2FycmF5LjxzdHJpbmc+fSBwcm9wcyAtIEFuIGFycmF5IG9mIHByb3BlcnRpZXMgdG8gdGVzdCBmb3JcclxuICAgKiBAcGFyYW0ge29iamVjdH0gb2JqIC0gQW4gb2JqZWN0IG9yIEVsZW1lbnQgeW91IHdhbnQgdG8gdXNlIHRvIHRlc3QgdGhlIHBhcmFtZXRlcnMgYWdhaW5cclxuICAgKiBAcGFyYW0ge2Jvb2xlYW58b2JqZWN0fSBlbGVtIC0gQW4gRWxlbWVudCB0byBiaW5kIHRoZSBwcm9wZXJ0eSBsb29rdXAgYWdhaW4uIFVzZSBgZmFsc2VgIHRvIHByZXZlbnQgdGhlIGNoZWNrXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gdGVzdERPTVByb3BzKHByb3BzLCBvYmosIGVsZW0pIHtcclxuICAgIHZhciBpdGVtO1xyXG5cclxuICAgIGZvciAodmFyIGkgaW4gcHJvcHMpIHtcclxuICAgICAgaWYgKHByb3BzW2ldIGluIG9iaikge1xyXG5cclxuICAgICAgICAvLyByZXR1cm4gdGhlIHByb3BlcnR5IG5hbWUgYXMgYSBzdHJpbmdcclxuICAgICAgICBpZiAoZWxlbSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIHJldHVybiBwcm9wc1tpXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGl0ZW0gPSBvYmpbcHJvcHNbaV1dO1xyXG5cclxuICAgICAgICAvLyBsZXQncyBiaW5kIGEgZnVuY3Rpb25cclxuICAgICAgICBpZiAoaXMoaXRlbSwgJ2Z1bmN0aW9uJykpIHtcclxuICAgICAgICAgIC8vIGJpbmQgdG8gb2JqIHVubGVzcyBvdmVycmlkZW5cclxuICAgICAgICAgIHJldHVybiBmbkJpbmQoaXRlbSwgZWxlbSB8fCBvYmopO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcmV0dXJuIHRoZSB1bmJvdW5kIGZ1bmN0aW9uIG9yIG9iaiBvciB2YWx1ZVxyXG4gICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICA7XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBvdXIgXCJtb2Rlcm5penJcIiBlbGVtZW50IHRoYXQgd2UgZG8gbW9zdCBmZWF0dXJlIHRlc3RzIG9uLlxyXG4gICAqXHJcbiAgICogQGFjY2VzcyBwcml2YXRlXHJcbiAgICovXHJcblxyXG4gIHZhciBtb2RFbGVtID0ge1xyXG4gICAgZWxlbTogY3JlYXRlRWxlbWVudCgnbW9kZXJuaXpyJylcclxuICB9O1xyXG5cclxuICAvLyBDbGVhbiB1cCB0aGlzIGVsZW1lbnRcclxuICBNb2Rlcm5penIuX3EucHVzaChmdW5jdGlvbigpIHtcclxuICAgIGRlbGV0ZSBtb2RFbGVtLmVsZW07XHJcbiAgfSk7XHJcblxyXG5cclxuXHJcbiAgdmFyIG1TdHlsZSA9IHtcclxuICAgIHN0eWxlOiBtb2RFbGVtLmVsZW0uc3R5bGVcclxuICB9O1xyXG5cclxuICAvLyBraWxsIHJlZiBmb3IgZ2MsIG11c3QgaGFwcGVuIGJlZm9yZSBtb2QuZWxlbSBpcyByZW1vdmVkLCBzbyB3ZSB1bnNoaWZ0IG9uIHRvXHJcbiAgLy8gdGhlIGZyb250IG9mIHRoZSBxdWV1ZS5cclxuICBNb2Rlcm5penIuX3EudW5zaGlmdChmdW5jdGlvbigpIHtcclxuICAgIGRlbGV0ZSBtU3R5bGUuc3R5bGU7XHJcbiAgfSk7XHJcblxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogZG9tVG9DU1MgdGFrZXMgYSBjYW1lbENhc2Ugc3RyaW5nIGFuZCBjb252ZXJ0cyBpdCB0byBrZWJhYi1jYXNlXHJcbiAgICogZS5nLiBib3hTaXppbmcgLT4gYm94LXNpemluZ1xyXG4gICAqXHJcbiAgICogQGFjY2VzcyBwcml2YXRlXHJcbiAgICogQGZ1bmN0aW9uIGRvbVRvQ1NTXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBTdHJpbmcgbmFtZSBvZiBjYW1lbENhc2UgcHJvcCB3ZSB3YW50IHRvIGNvbnZlcnRcclxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUga2ViYWItY2FzZSB2ZXJzaW9uIG9mIHRoZSBzdXBwbGllZCBuYW1lXHJcbiAgICovXHJcblxyXG4gIGZ1bmN0aW9uIGRvbVRvQ1NTKG5hbWUpIHtcclxuICAgIHJldHVybiBuYW1lLnJlcGxhY2UoLyhbQS1aXSkvZywgZnVuY3Rpb24oc3RyLCBtMSkge1xyXG4gICAgICByZXR1cm4gJy0nICsgbTEudG9Mb3dlckNhc2UoKTtcclxuICAgIH0pLnJlcGxhY2UoL15tcy0vLCAnLW1zLScpO1xyXG4gIH1cclxuICA7XHJcblxyXG4gIC8qKlxyXG4gICAqIG5hdGl2ZVRlc3RQcm9wcyBhbGxvd3MgZm9yIHVzIHRvIHVzZSBuYXRpdmUgZmVhdHVyZSBkZXRlY3Rpb24gZnVuY3Rpb25hbGl0eSBpZiBhdmFpbGFibGUuXHJcbiAgICogc29tZSBwcmVmaXhlZCBmb3JtLCBvciBmYWxzZSwgaW4gdGhlIGNhc2Ugb2YgYW4gdW5zdXBwb3J0ZWQgcnVsZVxyXG4gICAqXHJcbiAgICogQGFjY2VzcyBwcml2YXRlXHJcbiAgICogQGZ1bmN0aW9uIG5hdGl2ZVRlc3RQcm9wc1xyXG4gICAqIEBwYXJhbSB7YXJyYXl9IHByb3BzIC0gQW4gYXJyYXkgb2YgcHJvcGVydHkgbmFtZXNcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIHdlIHdhbnQgdG8gY2hlY2sgdmlhIEBzdXBwb3J0c1xyXG4gICAqIEByZXR1cm5zIHtib29sZWFufHVuZGVmaW5lZH0gQSBib29sZWFuIHdoZW4gQHN1cHBvcnRzIGV4aXN0cywgdW5kZWZpbmVkIG90aGVyd2lzZVxyXG4gICAqL1xyXG5cclxuICAvLyBBY2NlcHRzIGEgbGlzdCBvZiBwcm9wZXJ0eSBuYW1lcyBhbmQgYSBzaW5nbGUgdmFsdWVcclxuICAvLyBSZXR1cm5zIGB1bmRlZmluZWRgIGlmIG5hdGl2ZSBkZXRlY3Rpb24gbm90IGF2YWlsYWJsZVxyXG4gIGZ1bmN0aW9uIG5hdGl2ZVRlc3RQcm9wcyhwcm9wcywgdmFsdWUpIHtcclxuICAgIHZhciBpID0gcHJvcHMubGVuZ3RoO1xyXG4gICAgLy8gU3RhcnQgd2l0aCB0aGUgSlMgQVBJOiBodHRwOi8vd3d3LnczLm9yZy9UUi9jc3MzLWNvbmRpdGlvbmFsLyN0aGUtY3NzLWludGVyZmFjZVxyXG4gICAgaWYgKCdDU1MnIGluIHdpbmRvdyAmJiAnc3VwcG9ydHMnIGluIHdpbmRvdy5DU1MpIHtcclxuICAgICAgLy8gVHJ5IGV2ZXJ5IHByZWZpeGVkIHZhcmlhbnQgb2YgdGhlIHByb3BlcnR5XHJcbiAgICAgIHdoaWxlIChpLS0pIHtcclxuICAgICAgICBpZiAod2luZG93LkNTUy5zdXBwb3J0cyhkb21Ub0NTUyhwcm9wc1tpXSksIHZhbHVlKSkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIC8vIE90aGVyd2lzZSBmYWxsIGJhY2sgdG8gYXQtcnVsZSAoZm9yIE9wZXJhIDEyLngpXHJcbiAgICBlbHNlIGlmICgnQ1NTU3VwcG9ydHNSdWxlJyBpbiB3aW5kb3cpIHtcclxuICAgICAgLy8gQnVpbGQgYSBjb25kaXRpb24gc3RyaW5nIGZvciBldmVyeSBwcmVmaXhlZCB2YXJpYW50XHJcbiAgICAgIHZhciBjb25kaXRpb25UZXh0ID0gW107XHJcbiAgICAgIHdoaWxlIChpLS0pIHtcclxuICAgICAgICBjb25kaXRpb25UZXh0LnB1c2goJygnICsgZG9tVG9DU1MocHJvcHNbaV0pICsgJzonICsgdmFsdWUgKyAnKScpO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbmRpdGlvblRleHQgPSBjb25kaXRpb25UZXh0LmpvaW4oJyBvciAnKTtcclxuICAgICAgcmV0dXJuIGluamVjdEVsZW1lbnRXaXRoU3R5bGVzKCdAc3VwcG9ydHMgKCcgKyBjb25kaXRpb25UZXh0ICsgJykgeyAjbW9kZXJuaXpyIHsgcG9zaXRpb246IGFic29sdXRlOyB9IH0nLCBmdW5jdGlvbihub2RlKSB7XHJcbiAgICAgICAgcmV0dXJuIGdldENvbXB1dGVkU3R5bGUobm9kZSwgbnVsbCkucG9zaXRpb24gPT0gJ2Fic29sdXRlJztcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gIH1cclxuICA7XHJcblxyXG4gIC8vIHRlc3RQcm9wcyBpcyBhIGdlbmVyaWMgQ1NTIC8gRE9NIHByb3BlcnR5IHRlc3QuXHJcblxyXG4gIC8vIEluIHRlc3Rpbmcgc3VwcG9ydCBmb3IgYSBnaXZlbiBDU1MgcHJvcGVydHksIGl0J3MgbGVnaXQgdG8gdGVzdDpcclxuICAvLyAgICBgZWxlbS5zdHlsZVtzdHlsZU5hbWVdICE9PSB1bmRlZmluZWRgXHJcbiAgLy8gSWYgdGhlIHByb3BlcnR5IGlzIHN1cHBvcnRlZCBpdCB3aWxsIHJldHVybiBhbiBlbXB0eSBzdHJpbmcsXHJcbiAgLy8gaWYgdW5zdXBwb3J0ZWQgaXQgd2lsbCByZXR1cm4gdW5kZWZpbmVkLlxyXG5cclxuICAvLyBXZSdsbCB0YWtlIGFkdmFudGFnZSBvZiB0aGlzIHF1aWNrIHRlc3QgYW5kIHNraXAgc2V0dGluZyBhIHN0eWxlXHJcbiAgLy8gb24gb3VyIG1vZGVybml6ciBlbGVtZW50LCBidXQgaW5zdGVhZCBqdXN0IHRlc3RpbmcgdW5kZWZpbmVkIHZzXHJcbiAgLy8gZW1wdHkgc3RyaW5nLlxyXG5cclxuICAvLyBQcm9wZXJ0eSBuYW1lcyBjYW4gYmUgcHJvdmlkZWQgaW4gZWl0aGVyIGNhbWVsQ2FzZSBvciBrZWJhYi1jYXNlLlxyXG5cclxuICBmdW5jdGlvbiB0ZXN0UHJvcHMocHJvcHMsIHByZWZpeGVkLCB2YWx1ZSwgc2tpcFZhbHVlVGVzdCkge1xyXG4gICAgc2tpcFZhbHVlVGVzdCA9IGlzKHNraXBWYWx1ZVRlc3QsICd1bmRlZmluZWQnKSA/IGZhbHNlIDogc2tpcFZhbHVlVGVzdDtcclxuXHJcbiAgICAvLyBUcnkgbmF0aXZlIGRldGVjdCBmaXJzdFxyXG4gICAgaWYgKCFpcyh2YWx1ZSwgJ3VuZGVmaW5lZCcpKSB7XHJcbiAgICAgIHZhciByZXN1bHQgPSBuYXRpdmVUZXN0UHJvcHMocHJvcHMsIHZhbHVlKTtcclxuICAgICAgaWYgKCFpcyhyZXN1bHQsICd1bmRlZmluZWQnKSkge1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBPdGhlcndpc2UgZG8gaXQgcHJvcGVybHlcclxuICAgIHZhciBhZnRlckluaXQsIGksIHByb3BzTGVuZ3RoLCBwcm9wLCBiZWZvcmU7XHJcblxyXG4gICAgLy8gSWYgd2UgZG9uJ3QgaGF2ZSBhIHN0eWxlIGVsZW1lbnQsIHRoYXQgbWVhbnMgd2UncmUgcnVubmluZyBhc3luYyBvciBhZnRlclxyXG4gICAgLy8gdGhlIGNvcmUgdGVzdHMsIHNvIHdlJ2xsIG5lZWQgdG8gY3JlYXRlIG91ciBvd24gZWxlbWVudHMgdG8gdXNlXHJcblxyXG4gICAgLy8gaW5zaWRlIG9mIGFuIFNWRyBlbGVtZW50LCBpbiBjZXJ0YWluIGJyb3dzZXJzLCB0aGUgYHN0eWxlYCBlbGVtZW50IGlzIG9ubHlcclxuICAgIC8vIGRlZmluZWQgZm9yIHZhbGlkIHRhZ3MuIFRoZXJlZm9yZSwgaWYgYG1vZGVybml6cmAgZG9lcyBub3QgaGF2ZSBvbmUsIHdlXHJcbiAgICAvLyBmYWxsIGJhY2sgdG8gYSBsZXNzIHVzZWQgZWxlbWVudCBhbmQgaG9wZSBmb3IgdGhlIGJlc3QuXHJcbiAgICB2YXIgZWxlbXMgPSBbJ21vZGVybml6cicsICd0c3BhbiddO1xyXG4gICAgd2hpbGUgKCFtU3R5bGUuc3R5bGUpIHtcclxuICAgICAgYWZ0ZXJJbml0ID0gdHJ1ZTtcclxuICAgICAgbVN0eWxlLm1vZEVsZW0gPSBjcmVhdGVFbGVtZW50KGVsZW1zLnNoaWZ0KCkpO1xyXG4gICAgICBtU3R5bGUuc3R5bGUgPSBtU3R5bGUubW9kRWxlbS5zdHlsZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBEZWxldGUgdGhlIG9iamVjdHMgaWYgd2UgY3JlYXRlZCB0aGVtLlxyXG4gICAgZnVuY3Rpb24gY2xlYW5FbGVtcygpIHtcclxuICAgICAgaWYgKGFmdGVySW5pdCkge1xyXG4gICAgICAgIGRlbGV0ZSBtU3R5bGUuc3R5bGU7XHJcbiAgICAgICAgZGVsZXRlIG1TdHlsZS5tb2RFbGVtO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvcHNMZW5ndGggPSBwcm9wcy5sZW5ndGg7XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgcHJvcHNMZW5ndGg7IGkrKykge1xyXG4gICAgICBwcm9wID0gcHJvcHNbaV07XHJcbiAgICAgIGJlZm9yZSA9IG1TdHlsZS5zdHlsZVtwcm9wXTtcclxuXHJcbiAgICAgIGlmIChjb250YWlucyhwcm9wLCAnLScpKSB7XHJcbiAgICAgICAgcHJvcCA9IGNzc1RvRE9NKHByb3ApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAobVN0eWxlLnN0eWxlW3Byb3BdICE9PSB1bmRlZmluZWQpIHtcclxuXHJcbiAgICAgICAgLy8gSWYgdmFsdWUgdG8gdGVzdCBoYXMgYmVlbiBwYXNzZWQgaW4sIGRvIGEgc2V0LWFuZC1jaGVjayB0ZXN0LlxyXG4gICAgICAgIC8vIDAgKGludGVnZXIpIGlzIGEgdmFsaWQgcHJvcGVydHkgdmFsdWUsIHNvIGNoZWNrIHRoYXQgYHZhbHVlYCBpc24ndFxyXG4gICAgICAgIC8vIHVuZGVmaW5lZCwgcmF0aGVyIHRoYW4ganVzdCBjaGVja2luZyBpdCdzIHRydXRoeS5cclxuICAgICAgICBpZiAoIXNraXBWYWx1ZVRlc3QgJiYgIWlzKHZhbHVlLCAndW5kZWZpbmVkJykpIHtcclxuXHJcbiAgICAgICAgICAvLyBOZWVkcyBhIHRyeSBjYXRjaCBibG9jayBiZWNhdXNlIG9mIG9sZCBJRS4gVGhpcyBpcyBzbG93LCBidXQgd2lsbFxyXG4gICAgICAgICAgLy8gYmUgYXZvaWRlZCBpbiBtb3N0IGNhc2VzIGJlY2F1c2UgYHNraXBWYWx1ZVRlc3RgIHdpbGwgYmUgdXNlZC5cclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIG1TdHlsZS5zdHlsZVtwcm9wXSA9IHZhbHVlO1xyXG4gICAgICAgICAgfSBjYXRjaCAoZSkge31cclxuXHJcbiAgICAgICAgICAvLyBJZiB0aGUgcHJvcGVydHkgdmFsdWUgaGFzIGNoYW5nZWQsIHdlIGFzc3VtZSB0aGUgdmFsdWUgdXNlZCBpc1xyXG4gICAgICAgICAgLy8gc3VwcG9ydGVkLiBJZiBgdmFsdWVgIGlzIGVtcHR5IHN0cmluZywgaXQnbGwgZmFpbCBoZXJlIChiZWNhdXNlXHJcbiAgICAgICAgICAvLyBpdCBoYXNuJ3QgY2hhbmdlZCksIHdoaWNoIG1hdGNoZXMgaG93IGJyb3dzZXJzIGhhdmUgaW1wbGVtZW50ZWRcclxuICAgICAgICAgIC8vIENTUy5zdXBwb3J0cygpXHJcbiAgICAgICAgICBpZiAobVN0eWxlLnN0eWxlW3Byb3BdICE9IGJlZm9yZSkge1xyXG4gICAgICAgICAgICBjbGVhbkVsZW1zKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcmVmaXhlZCA9PSAncGZ4JyA/IHByb3AgOiB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBPdGhlcndpc2UganVzdCByZXR1cm4gdHJ1ZSwgb3IgdGhlIHByb3BlcnR5IG5hbWUgaWYgdGhpcyBpcyBhXHJcbiAgICAgICAgLy8gYHByZWZpeGVkKClgIGNhbGxcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIGNsZWFuRWxlbXMoKTtcclxuICAgICAgICAgIHJldHVybiBwcmVmaXhlZCA9PSAncGZ4JyA/IHByb3AgOiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2xlYW5FbGVtcygpO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgO1xyXG5cclxuICAvKipcclxuICAgKiB0ZXN0UHJvcHNBbGwgdGVzdHMgYSBsaXN0IG9mIERPTSBwcm9wZXJ0aWVzIHdlIHdhbnQgdG8gY2hlY2sgYWdhaW5zdC5cclxuICAgKiBXZSBzcGVjaWZ5IGxpdGVyYWxseSBBTEwgcG9zc2libGUgKGtub3duIGFuZC9vciBsaWtlbHkpIHByb3BlcnRpZXMgb25cclxuICAgKiB0aGUgZWxlbWVudCBpbmNsdWRpbmcgdGhlIG5vbi12ZW5kb3IgcHJlZml4ZWQgb25lLCBmb3IgZm9yd2FyZC1cclxuICAgKiBjb21wYXRpYmlsaXR5LlxyXG4gICAqXHJcbiAgICogQGFjY2VzcyBwcml2YXRlXHJcbiAgICogQGZ1bmN0aW9uIHRlc3RQcm9wc0FsbFxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wIC0gQSBzdHJpbmcgb2YgdGhlIHByb3BlcnR5IHRvIHRlc3QgZm9yXHJcbiAgICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSBbcHJlZml4ZWRdIC0gQW4gb2JqZWN0IHRvIGNoZWNrIHRoZSBwcmVmaXhlZCBwcm9wZXJ0aWVzIG9uLiBVc2UgYSBzdHJpbmcgdG8gc2tpcFxyXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR8U1ZHRWxlbWVudH0gW2VsZW1dIC0gQW4gZWxlbWVudCB1c2VkIHRvIHRlc3QgdGhlIHByb3BlcnR5IGFuZCB2YWx1ZSBhZ2FpbnN0XHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IFt2YWx1ZV0gLSBBIHN0cmluZyBvZiBhIGNzcyB2YWx1ZVxyXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3NraXBWYWx1ZVRlc3RdIC0gQW4gYm9vbGVhbiByZXByZXNlbnRpbmcgaWYgeW91IHdhbnQgdG8gdGVzdCBpZiB2YWx1ZSBzdGlja3Mgd2hlbiBzZXRcclxuICAgKi9cclxuICBmdW5jdGlvbiB0ZXN0UHJvcHNBbGwocHJvcCwgcHJlZml4ZWQsIGVsZW0sIHZhbHVlLCBza2lwVmFsdWVUZXN0KSB7XHJcblxyXG4gICAgdmFyIHVjUHJvcCA9IHByb3AuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBwcm9wLnNsaWNlKDEpLFxyXG4gICAgcHJvcHMgPSAocHJvcCArICcgJyArIGNzc29tUHJlZml4ZXMuam9pbih1Y1Byb3AgKyAnICcpICsgdWNQcm9wKS5zcGxpdCgnICcpO1xyXG5cclxuICAgIC8vIGRpZCB0aGV5IGNhbGwgLnByZWZpeGVkKCdib3hTaXppbmcnKSBvciBhcmUgd2UganVzdCB0ZXN0aW5nIGEgcHJvcD9cclxuICAgIGlmIChpcyhwcmVmaXhlZCwgJ3N0cmluZycpIHx8IGlzKHByZWZpeGVkLCAndW5kZWZpbmVkJykpIHtcclxuICAgICAgcmV0dXJuIHRlc3RQcm9wcyhwcm9wcywgcHJlZml4ZWQsIHZhbHVlLCBza2lwVmFsdWVUZXN0KTtcclxuXHJcbiAgICAgIC8vIG90aGVyd2lzZSwgdGhleSBjYWxsZWQgLnByZWZpeGVkKCdyZXF1ZXN0QW5pbWF0aW9uRnJhbWUnLCB3aW5kb3dbLCBlbGVtXSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHByb3BzID0gKHByb3AgKyAnICcgKyAoZG9tUHJlZml4ZXMpLmpvaW4odWNQcm9wICsgJyAnKSArIHVjUHJvcCkuc3BsaXQoJyAnKTtcclxuICAgICAgcmV0dXJuIHRlc3RET01Qcm9wcyhwcm9wcywgcHJlZml4ZWQsIGVsZW0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gTW9kZXJuaXpyLnRlc3RBbGxQcm9wcygpIGludmVzdGlnYXRlcyB3aGV0aGVyIGEgZ2l2ZW4gc3R5bGUgcHJvcGVydHksXHJcbiAgLy8gb3IgYW55IG9mIGl0cyB2ZW5kb3ItcHJlZml4ZWQgdmFyaWFudHMsIGlzIHJlY29nbml6ZWRcclxuICAvL1xyXG4gIC8vIE5vdGUgdGhhdCB0aGUgcHJvcGVydHkgbmFtZXMgbXVzdCBiZSBwcm92aWRlZCBpbiB0aGUgY2FtZWxDYXNlIHZhcmlhbnQuXHJcbiAgLy8gTW9kZXJuaXpyLnRlc3RBbGxQcm9wcygnYm94U2l6aW5nJylcclxuICBNb2Rlcm5penJQcm90by50ZXN0QWxsUHJvcHMgPSB0ZXN0UHJvcHNBbGw7XHJcblxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogdGVzdEFsbFByb3BzIGRldGVybWluZXMgd2hldGhlciBhIGdpdmVuIENTUyBwcm9wZXJ0eSBpcyBzdXBwb3J0ZWQgaW4gdGhlIGJyb3dzZXJcclxuICAgKlxyXG4gICAqIEBtZW1iZXJvZiBNb2Rlcm5penJcclxuICAgKiBAbmFtZSBNb2Rlcm5penIudGVzdEFsbFByb3BzXHJcbiAgICogQG9wdGlvbk5hbWUgTW9kZXJuaXpyLnRlc3RBbGxQcm9wcygpXHJcbiAgICogQG9wdGlvblByb3AgdGVzdEFsbFByb3BzXHJcbiAgICogQGFjY2VzcyBwdWJsaWNcclxuICAgKiBAZnVuY3Rpb24gdGVzdEFsbFByb3BzXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHByb3AgLSBTdHJpbmcgbmFtaW5nIHRoZSBwcm9wZXJ0eSB0byB0ZXN0IChlaXRoZXIgY2FtZWxDYXNlIG9yIGtlYmFiLWNhc2UpXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IFt2YWx1ZV0gLSBTdHJpbmcgb2YgdGhlIHZhbHVlIHRvIHRlc3RcclxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtza2lwVmFsdWVUZXN0PWZhbHNlXSAtIFdoZXRoZXIgdG8gc2tpcCB0ZXN0aW5nIHRoYXQgdGhlIHZhbHVlIGlzIHN1cHBvcnRlZCB3aGVuIHVzaW5nIG5vbi1uYXRpdmUgZGV0ZWN0aW9uXHJcbiAgICogQGV4YW1wbGVcclxuICAgKlxyXG4gICAqIHRlc3RBbGxQcm9wcyBkZXRlcm1pbmVzIHdoZXRoZXIgYSBnaXZlbiBDU1MgcHJvcGVydHksIGluIHNvbWUgcHJlZml4ZWQgZm9ybSxcclxuICAgKiBpcyBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIuXHJcbiAgICpcclxuICAgKiBgYGBqc1xyXG4gICAqIHRlc3RBbGxQcm9wcygnYm94U2l6aW5nJykgIC8vIHRydWVcclxuICAgKiBgYGBcclxuICAgKlxyXG4gICAqIEl0IGNhbiBvcHRpb25hbGx5IGJlIGdpdmVuIGEgQ1NTIHZhbHVlIGluIHN0cmluZyBmb3JtIHRvIHRlc3QgaWYgYSBwcm9wZXJ0eVxyXG4gICAqIHZhbHVlIGlzIHZhbGlkXHJcbiAgICpcclxuICAgKiBgYGBqc1xyXG4gICAqIHRlc3RBbGxQcm9wcygnZGlzcGxheScsICdibG9jaycpIC8vIHRydWVcclxuICAgKiB0ZXN0QWxsUHJvcHMoJ2Rpc3BsYXknLCAncGVuZ3VpbicpIC8vIGZhbHNlXHJcbiAgICogYGBgXHJcbiAgICpcclxuICAgKiBBIGJvb2xlYW4gY2FuIGJlIHBhc3NlZCBhcyBhIHRoaXJkIHBhcmFtZXRlciB0byBza2lwIHRoZSB2YWx1ZSBjaGVjayB3aGVuXHJcbiAgICogbmF0aXZlIGRldGVjdGlvbiAoQHN1cHBvcnRzKSBpc24ndCBhdmFpbGFibGUuXHJcbiAgICpcclxuICAgKiBgYGBqc1xyXG4gICAqIHRlc3RBbGxQcm9wcygnc2hhcGVPdXRzaWRlJywgJ2NvbnRlbnQtYm94JywgdHJ1ZSk7XHJcbiAgICogYGBgXHJcbiAgICovXHJcblxyXG4gIGZ1bmN0aW9uIHRlc3RBbGxQcm9wcyhwcm9wLCB2YWx1ZSwgc2tpcFZhbHVlVGVzdCkge1xyXG4gICAgcmV0dXJuIHRlc3RQcm9wc0FsbChwcm9wLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdmFsdWUsIHNraXBWYWx1ZVRlc3QpO1xyXG4gIH1cclxuICBNb2Rlcm5penJQcm90by50ZXN0QWxsUHJvcHMgPSB0ZXN0QWxsUHJvcHM7XHJcblxyXG4vKiFcclxue1xyXG4gIFwibmFtZVwiOiBcIkJhY2tncm91bmQgU2l6ZVwiLFxyXG4gIFwicHJvcGVydHlcIjogXCJiYWNrZ3JvdW5kc2l6ZVwiLFxyXG4gIFwidGFnc1wiOiBbXCJjc3NcIl0sXHJcbiAgXCJrbm93bkJ1Z3NcIjogW1wiVGhpcyB3aWxsIGZhbHNlIHBvc2l0aXZlIGluIE9wZXJhIE1pbmkgLSBodHRwczovL2dpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci9pc3N1ZXMvMzk2XCJdLFxyXG4gIFwibm90ZXNcIjogW3tcclxuICAgIFwibmFtZVwiOiBcIlJlbGF0ZWQgSXNzdWVcIixcclxuICAgIFwiaHJlZlwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9Nb2Rlcm5penIvTW9kZXJuaXpyL2lzc3Vlcy8zOTZcIlxyXG4gIH1dXHJcbn1cclxuISovXHJcblxyXG4gIE1vZGVybml6ci5hZGRUZXN0KCdiYWNrZ3JvdW5kc2l6ZScsIHRlc3RBbGxQcm9wcygnYmFja2dyb3VuZFNpemUnLCAnMTAwJScsIHRydWUpKTtcclxuXHJcbi8qIVxyXG57XHJcbiAgXCJuYW1lXCI6IFwiRmxleGJveFwiLFxyXG4gIFwicHJvcGVydHlcIjogXCJmbGV4Ym94XCIsXHJcbiAgXCJjYW5pdXNlXCI6IFwiZmxleGJveFwiLFxyXG4gIFwidGFnc1wiOiBbXCJjc3NcIl0sXHJcbiAgXCJub3Rlc1wiOiBbe1xyXG4gICAgXCJuYW1lXCI6IFwiVGhlIF9uZXdfIGZsZXhib3hcIixcclxuICAgIFwiaHJlZlwiOiBcImh0dHA6Ly9kZXYudzMub3JnL2Nzc3dnL2NzczMtZmxleGJveFwiXHJcbiAgfV0sXHJcbiAgXCJ3YXJuaW5nc1wiOiBbXHJcbiAgICBcIkEgYHRydWVgIHJlc3VsdCBmb3IgdGhpcyBkZXRlY3QgZG9lcyBub3QgaW1wbHkgdGhhdCB0aGUgYGZsZXgtd3JhcGAgcHJvcGVydHkgaXMgc3VwcG9ydGVkOyBzZWUgdGhlIGBmbGV4d3JhcGAgZGV0ZWN0LlwiXHJcbiAgXVxyXG59XHJcbiEqL1xyXG4vKiBET0NcclxuRGV0ZWN0cyBzdXBwb3J0IGZvciB0aGUgRmxleGlibGUgQm94IExheW91dCBtb2RlbCwgYS5rLmEuIEZsZXhib3gsIHdoaWNoIGFsbG93cyBlYXN5IG1hbmlwdWxhdGlvbiBvZiBsYXlvdXQgb3JkZXIgYW5kIHNpemluZyB3aXRoaW4gYSBjb250YWluZXIuXHJcbiovXHJcblxyXG4gIE1vZGVybml6ci5hZGRUZXN0KCdmbGV4Ym94JywgdGVzdEFsbFByb3BzKCdmbGV4QmFzaXMnLCAnMXB4JywgdHJ1ZSkpO1xyXG5cclxuLyohXHJcbntcclxuICBcIm5hbWVcIjogXCJGbGV4Ym94IChsZWdhY3kpXCIsXHJcbiAgXCJwcm9wZXJ0eVwiOiBcImZsZXhib3hsZWdhY3lcIixcclxuICBcInRhZ3NcIjogW1wiY3NzXCJdLFxyXG4gIFwicG9seWZpbGxzXCI6IFtcImZsZXhpZVwiXSxcclxuICBcIm5vdGVzXCI6IFt7XHJcbiAgICBcIm5hbWVcIjogXCJUaGUgX29sZF8gZmxleGJveFwiLFxyXG4gICAgXCJocmVmXCI6IFwiaHR0cHM6Ly93d3cudzMub3JnL1RSLzIwMDkvV0QtY3NzMy1mbGV4Ym94LTIwMDkwNzIzL1wiXHJcbiAgfV1cclxufVxyXG4hKi9cclxuXHJcbiAgTW9kZXJuaXpyLmFkZFRlc3QoJ2ZsZXhib3hsZWdhY3knLCB0ZXN0QWxsUHJvcHMoJ2JveERpcmVjdGlvbicsICdyZXZlcnNlJywgdHJ1ZSkpO1xyXG4gIFxyXG4gIC8vQWRkZWQgdG8gZGV0ZWN0IHRyYW5zaXRpb25cclxuICAgTW9kZXJuaXpyLmFkZFRlc3QoJ2Nzc3RyYW5zaXRpb25zJyx0ZXN0QWxsUHJvcHMoJ3RyYW5zaXRpb24nKSk7XHJcbiAgXHJcbiAgXHJcbiAgICAvKj4+d2ViZm9ybXMqL1xyXG4gICAgLy8gaW5wdXQgZmVhdHVyZXMgYW5kIGlucHV0IHR5cGVzIGdvIGRpcmVjdGx5IG9udG8gdGhlIHJldCBvYmplY3QsIGJ5cGFzc2luZyB0aGUgdGVzdHMgbG9vcC5cclxuICAgIC8vIEhvbGQgdGhpcyBndXkgdG8gZXhlY3V0ZSBpbiBhIG1vbWVudC5cclxuICAgIFxyXG4gICAgZnVuY3Rpb24gd2ViZm9ybXMoKSB7XHJcbiAgICAgICAgLyo+PmlucHV0Ki9cclxuICAgICAgICAvLyBSdW4gdGhyb3VnaCBIVE1MNSdzIG5ldyBpbnB1dCBhdHRyaWJ1dGVzIHRvIHNlZSBpZiB0aGUgVUEgdW5kZXJzdGFuZHMgYW55LlxyXG4gICAgICAgIC8vIFdlJ3JlIHVzaW5nIGYgd2hpY2ggaXMgdGhlIDxpbnB1dD4gZWxlbWVudCBjcmVhdGVkIGVhcmx5IG9uXHJcbiAgICAgICAgLy8gTWlrZSBUYXlsciBoYXMgY3JlYXRlZCBhIGNvbXByZWhlbnNpdmUgcmVzb3VyY2UgZm9yIHRlc3RpbmcgdGhlc2UgYXR0cmlidXRlc1xyXG4gICAgICAgIC8vICAgd2hlbiBhcHBsaWVkIHRvIGFsbCBpbnB1dCB0eXBlczpcclxuICAgICAgICAvLyAgIG1pa2V0YXlsci5jb20vY29kZS9pbnB1dC10eXBlLWF0dHIuaHRtbFxyXG4gICAgICAgIC8vIHNwZWM6IHd3dy53aGF0d2cub3JnL3NwZWNzL3dlYi1hcHBzL2N1cnJlbnQtd29yay9tdWx0aXBhZ2UvdGhlLWlucHV0LWVsZW1lbnQuaHRtbCNpbnB1dC10eXBlLWF0dHItc3VtbWFyeVxyXG5cclxuICAgICAgICAvLyBPbmx5IGlucHV0IHBsYWNlaG9sZGVyIGlzIHRlc3RlZCB3aGlsZSB0ZXh0YXJlYSdzIHBsYWNlaG9sZGVyIGlzIG5vdC5cclxuICAgICAgICAvLyBDdXJyZW50bHkgU2FmYXJpIDQgYW5kIE9wZXJhIDExIGhhdmUgc3VwcG9ydCBvbmx5IGZvciB0aGUgaW5wdXQgcGxhY2Vob2xkZXJcclxuICAgICAgICAvLyBCb3RoIHRlc3RzIGFyZSBhdmFpbGFibGUgaW4gZmVhdHVyZS1kZXRlY3RzL2Zvcm1zLXBsYWNlaG9sZGVyLmpzXHJcbiAgICAgICAgTW9kZXJuaXpyWydpbnB1dCddID0gKGZ1bmN0aW9uKCBwcm9wcyApIHtcclxuICAgICAgICBcdHZhciBpbnB1dDEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG4gICAgICAgICAgICBmb3IgKCB2YXIgaSA9IDAsIGxlbiA9IHByb3BzLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xyXG4gICAgICAgICAgICAgICAgYXR0cnNbIHByb3BzW2ldIF0gPSAhIShwcm9wc1tpXSBpbiBpbnB1dDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChhdHRycy5saXN0KXtcclxuICAgICAgICAgICAgICAvLyBzYWZhcmkgZmFsc2UgcG9zaXRpdmUncyBvbiBkYXRhbGlzdDogd2Viay5pdC83NDI1MlxyXG4gICAgICAgICAgICAgIC8vIHNlZSBhbHNvIGdpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci9pc3N1ZXMvMTQ2XHJcbiAgICAgICAgICAgICAgYXR0cnMubGlzdCA9ICEhKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RhdGFsaXN0JykgJiYgd2luZG93LkhUTUxEYXRhTGlzdEVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBhdHRycztcclxuICAgICAgICB9KSgnYXV0b2NvbXBsZXRlIGF1dG9mb2N1cyBsaXN0IHBsYWNlaG9sZGVyIG1heCBtaW4gbXVsdGlwbGUgcGF0dGVybiByZXF1aXJlZCBzdGVwJy5zcGxpdCgnICcpKTtcclxuICAgICAgICAvKj4+aW5wdXQqL1xyXG4gICAgfVxyXG5cclxuICAgIC8qPj53ZWJmb3JtcyovXHJcbiAgICAvLyBpbnB1dCB0ZXN0cyBuZWVkIHRvIHJ1bi5cclxuICAgIE1vZGVybml6ci5pbnB1dCB8fCB3ZWJmb3JtcygpO1xyXG4gICAgLyo+PndlYmZvcm1zKi9cclxuXHJcbiAgXHJcblxyXG4gIC8vIFJ1biBlYWNoIHRlc3RcclxuICB0ZXN0UnVubmVyKCk7XHJcblxyXG4gIC8vIFJlbW92ZSB0aGUgXCJuby1qc1wiIGNsYXNzIGlmIGl0IGV4aXN0c1xyXG4gIHNldENsYXNzZXMoY2xhc3Nlcyk7XHJcblxyXG4gIGRlbGV0ZSBNb2Rlcm5penJQcm90by5hZGRUZXN0O1xyXG4gIGRlbGV0ZSBNb2Rlcm5penJQcm90by5hZGRBc3luY1Rlc3Q7XHJcblxyXG4gIC8vIFJ1biB0aGUgdGhpbmdzIHRoYXQgYXJlIHN1cHBvc2VkIHRvIHJ1biBhZnRlciB0aGUgdGVzdHNcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IE1vZGVybml6ci5fcS5sZW5ndGg7IGkrKykge1xyXG4gICAgTW9kZXJuaXpyLl9xW2ldKCk7XHJcbiAgfVxyXG5cclxuICAvLyBMZWFrIE1vZGVybml6ciBuYW1lc3BhY2VcclxuICB3aW5kb3cuTW9kZXJuaXpyID0gTW9kZXJuaXpyO1xyXG5cclxuXHJcbjtcclxuXHJcbn0pKHdpbmRvdywgZG9jdW1lbnQpO1xyXG4iXX0=
