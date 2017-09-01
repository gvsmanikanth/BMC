(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * jQuery Scrollspy Plugin
 * Author: @sxalexander
 * Licensed under the MIT license
 */
;(function ( $, window, document, undefined ) {

    $.fn.extend({
      scrollspy: function ( options ) {

          var defaults = {
            min: 0,
            max: 0,
            mode: 'vertical',
            namespace: 'scrollspy',
            buffer: 0,
            container: window,
            onEnter: options.onEnter ? options.onEnter : [],
            onLeave: options.onLeave ? options.onLeave : [],
            onTick: options.onTick ? options.onTick : []
          }

          var options = $.extend( {}, defaults, options );

          return this.each(function (i) {

              var element = this;
              var o = options;
              var $container = $(o.container);
              var mode = o.mode;
              var buffer = o.buffer;
              var enters = leaves = 0;
              var inside = false;

              /* add listener to container */
              $container.bind('scroll.' + o.namespace, function(e){
                  var position = {top: $(this).scrollTop(), left: $(this).scrollLeft()};
                  var xy = (mode == 'vertical') ? position.top + buffer : position.left + buffer;
                  var max = o.max;
                  var min = o.min;

                  /* fix max */
                  if($.isFunction(o.max)){
                    max = o.max();
                  }

                  /* fix max */
                  if($.isFunction(o.min)){
                    min = o.min();
                  }

                  if(max == 0){
                      max = (mode == 'vertical') ? $container.height() : $container.outerWidth() + $(element).outerWidth();
                  }

                  /* if we have reached the minimum bound but are below the max ... */
                  if(xy >= min && xy <= max){
                    /* trigger enter event */
                    if(!inside){
                       inside = true;
                       enters++;

                       /* fire enter event */
                       $(element).trigger('scrollEnter', {position: position})
                       if($.isFunction(o.onEnter)){
                         o.onEnter(element, position);
                       }

                     }

                     /* trigger tick event */
                     $(element).trigger('scrollTick', {position: position, inside: inside, enters: enters, leaves: leaves})
                     if($.isFunction(o.onTick)){
                       o.onTick(element, position, inside, enters, leaves);
                     }
                  }else{

                    if(inside){
                      inside = false;
                      leaves++;
                      /* trigger leave event */
                      $(element).trigger('scrollLeave', {position: position, leaves:leaves})

                      if($.isFunction(o.onLeave)){
                        o.onLeave(element, position);
                      }
                    }
                  }
              });

          });
      }

    })


})( jQuery, window, document, undefined );

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5LnNjcm9sbHNweS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyohXHJcbiAqIGpRdWVyeSBTY3JvbGxzcHkgUGx1Z2luXHJcbiAqIEF1dGhvcjogQHN4YWxleGFuZGVyXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxyXG4gKi9cclxuOyhmdW5jdGlvbiAoICQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCApIHtcclxuXHJcbiAgICAkLmZuLmV4dGVuZCh7XHJcbiAgICAgIHNjcm9sbHNweTogZnVuY3Rpb24gKCBvcHRpb25zICkge1xyXG5cclxuICAgICAgICAgIHZhciBkZWZhdWx0cyA9IHtcclxuICAgICAgICAgICAgbWluOiAwLFxyXG4gICAgICAgICAgICBtYXg6IDAsXHJcbiAgICAgICAgICAgIG1vZGU6ICd2ZXJ0aWNhbCcsXHJcbiAgICAgICAgICAgIG5hbWVzcGFjZTogJ3Njcm9sbHNweScsXHJcbiAgICAgICAgICAgIGJ1ZmZlcjogMCxcclxuICAgICAgICAgICAgY29udGFpbmVyOiB3aW5kb3csXHJcbiAgICAgICAgICAgIG9uRW50ZXI6IG9wdGlvbnMub25FbnRlciA/IG9wdGlvbnMub25FbnRlciA6IFtdLFxyXG4gICAgICAgICAgICBvbkxlYXZlOiBvcHRpb25zLm9uTGVhdmUgPyBvcHRpb25zLm9uTGVhdmUgOiBbXSxcclxuICAgICAgICAgICAgb25UaWNrOiBvcHRpb25zLm9uVGljayA/IG9wdGlvbnMub25UaWNrIDogW11cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB2YXIgb3B0aW9ucyA9ICQuZXh0ZW5kKCB7fSwgZGVmYXVsdHMsIG9wdGlvbnMgKTtcclxuXHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChpKSB7XHJcblxyXG4gICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gdGhpcztcclxuICAgICAgICAgICAgICB2YXIgbyA9IG9wdGlvbnM7XHJcbiAgICAgICAgICAgICAgdmFyICRjb250YWluZXIgPSAkKG8uY29udGFpbmVyKTtcclxuICAgICAgICAgICAgICB2YXIgbW9kZSA9IG8ubW9kZTtcclxuICAgICAgICAgICAgICB2YXIgYnVmZmVyID0gby5idWZmZXI7XHJcbiAgICAgICAgICAgICAgdmFyIGVudGVycyA9IGxlYXZlcyA9IDA7XHJcbiAgICAgICAgICAgICAgdmFyIGluc2lkZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAvKiBhZGQgbGlzdGVuZXIgdG8gY29udGFpbmVyICovXHJcbiAgICAgICAgICAgICAgJGNvbnRhaW5lci5iaW5kKCdzY3JvbGwuJyArIG8ubmFtZXNwYWNlLCBmdW5jdGlvbihlKXtcclxuICAgICAgICAgICAgICAgICAgdmFyIHBvc2l0aW9uID0ge3RvcDogJCh0aGlzKS5zY3JvbGxUb3AoKSwgbGVmdDogJCh0aGlzKS5zY3JvbGxMZWZ0KCl9O1xyXG4gICAgICAgICAgICAgICAgICB2YXIgeHkgPSAobW9kZSA9PSAndmVydGljYWwnKSA/IHBvc2l0aW9uLnRvcCArIGJ1ZmZlciA6IHBvc2l0aW9uLmxlZnQgKyBidWZmZXI7XHJcbiAgICAgICAgICAgICAgICAgIHZhciBtYXggPSBvLm1heDtcclxuICAgICAgICAgICAgICAgICAgdmFyIG1pbiA9IG8ubWluO1xyXG5cclxuICAgICAgICAgICAgICAgICAgLyogZml4IG1heCAqL1xyXG4gICAgICAgICAgICAgICAgICBpZigkLmlzRnVuY3Rpb24oby5tYXgpKXtcclxuICAgICAgICAgICAgICAgICAgICBtYXggPSBvLm1heCgpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAvKiBmaXggbWF4ICovXHJcbiAgICAgICAgICAgICAgICAgIGlmKCQuaXNGdW5jdGlvbihvLm1pbikpe1xyXG4gICAgICAgICAgICAgICAgICAgIG1pbiA9IG8ubWluKCk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgIGlmKG1heCA9PSAwKXtcclxuICAgICAgICAgICAgICAgICAgICAgIG1heCA9IChtb2RlID09ICd2ZXJ0aWNhbCcpID8gJGNvbnRhaW5lci5oZWlnaHQoKSA6ICRjb250YWluZXIub3V0ZXJXaWR0aCgpICsgJChlbGVtZW50KS5vdXRlcldpZHRoKCk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgIC8qIGlmIHdlIGhhdmUgcmVhY2hlZCB0aGUgbWluaW11bSBib3VuZCBidXQgYXJlIGJlbG93IHRoZSBtYXggLi4uICovXHJcbiAgICAgICAgICAgICAgICAgIGlmKHh5ID49IG1pbiAmJiB4eSA8PSBtYXgpe1xyXG4gICAgICAgICAgICAgICAgICAgIC8qIHRyaWdnZXIgZW50ZXIgZXZlbnQgKi9cclxuICAgICAgICAgICAgICAgICAgICBpZighaW5zaWRlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICBpbnNpZGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGVudGVycysrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAvKiBmaXJlIGVudGVyIGV2ZW50ICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgJChlbGVtZW50KS50cmlnZ2VyKCdzY3JvbGxFbnRlcicsIHtwb3NpdGlvbjogcG9zaXRpb259KVxyXG4gICAgICAgICAgICAgICAgICAgICAgIGlmKCQuaXNGdW5jdGlvbihvLm9uRW50ZXIpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgIG8ub25FbnRlcihlbGVtZW50LCBwb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgLyogdHJpZ2dlciB0aWNrIGV2ZW50ICovXHJcbiAgICAgICAgICAgICAgICAgICAgICQoZWxlbWVudCkudHJpZ2dlcignc2Nyb2xsVGljaycsIHtwb3NpdGlvbjogcG9zaXRpb24sIGluc2lkZTogaW5zaWRlLCBlbnRlcnM6IGVudGVycywgbGVhdmVzOiBsZWF2ZXN9KVxyXG4gICAgICAgICAgICAgICAgICAgICBpZigkLmlzRnVuY3Rpb24oby5vblRpY2spKXtcclxuICAgICAgICAgICAgICAgICAgICAgICBvLm9uVGljayhlbGVtZW50LCBwb3NpdGlvbiwgaW5zaWRlLCBlbnRlcnMsIGxlYXZlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGluc2lkZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICBpbnNpZGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgIGxlYXZlcysrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgLyogdHJpZ2dlciBsZWF2ZSBldmVudCAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgJChlbGVtZW50KS50cmlnZ2VyKCdzY3JvbGxMZWF2ZScsIHtwb3NpdGlvbjogcG9zaXRpb24sIGxlYXZlczpsZWF2ZXN9KVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIGlmKCQuaXNGdW5jdGlvbihvLm9uTGVhdmUpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgby5vbkxlYXZlKGVsZW1lbnQsIHBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgIH0pXHJcblxyXG5cclxufSkoIGpRdWVyeSwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkICk7XHJcbiJdfQ==
