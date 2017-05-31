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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5LnNjcm9sbHNweS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyohXG4gKiBqUXVlcnkgU2Nyb2xsc3B5IFBsdWdpblxuICogQXV0aG9yOiBAc3hhbGV4YW5kZXJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICovXG47KGZ1bmN0aW9uICggJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkICkge1xuXG4gICAgJC5mbi5leHRlbmQoe1xuICAgICAgc2Nyb2xsc3B5OiBmdW5jdGlvbiAoIG9wdGlvbnMgKSB7XG5cbiAgICAgICAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICBtaW46IDAsXG4gICAgICAgICAgICBtYXg6IDAsXG4gICAgICAgICAgICBtb2RlOiAndmVydGljYWwnLFxuICAgICAgICAgICAgbmFtZXNwYWNlOiAnc2Nyb2xsc3B5JyxcbiAgICAgICAgICAgIGJ1ZmZlcjogMCxcbiAgICAgICAgICAgIGNvbnRhaW5lcjogd2luZG93LFxuICAgICAgICAgICAgb25FbnRlcjogb3B0aW9ucy5vbkVudGVyID8gb3B0aW9ucy5vbkVudGVyIDogW10sXG4gICAgICAgICAgICBvbkxlYXZlOiBvcHRpb25zLm9uTGVhdmUgPyBvcHRpb25zLm9uTGVhdmUgOiBbXSxcbiAgICAgICAgICAgIG9uVGljazogb3B0aW9ucy5vblRpY2sgPyBvcHRpb25zLm9uVGljayA6IFtdXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIG9wdGlvbnMgPSAkLmV4dGVuZCgge30sIGRlZmF1bHRzLCBvcHRpb25zICk7XG5cbiAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChpKSB7XG5cbiAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzO1xuICAgICAgICAgICAgICB2YXIgbyA9IG9wdGlvbnM7XG4gICAgICAgICAgICAgIHZhciAkY29udGFpbmVyID0gJChvLmNvbnRhaW5lcik7XG4gICAgICAgICAgICAgIHZhciBtb2RlID0gby5tb2RlO1xuICAgICAgICAgICAgICB2YXIgYnVmZmVyID0gby5idWZmZXI7XG4gICAgICAgICAgICAgIHZhciBlbnRlcnMgPSBsZWF2ZXMgPSAwO1xuICAgICAgICAgICAgICB2YXIgaW5zaWRlID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgLyogYWRkIGxpc3RlbmVyIHRvIGNvbnRhaW5lciAqL1xuICAgICAgICAgICAgICAkY29udGFpbmVyLmJpbmQoJ3Njcm9sbC4nICsgby5uYW1lc3BhY2UsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgICAgdmFyIHBvc2l0aW9uID0ge3RvcDogJCh0aGlzKS5zY3JvbGxUb3AoKSwgbGVmdDogJCh0aGlzKS5zY3JvbGxMZWZ0KCl9O1xuICAgICAgICAgICAgICAgICAgdmFyIHh5ID0gKG1vZGUgPT0gJ3ZlcnRpY2FsJykgPyBwb3NpdGlvbi50b3AgKyBidWZmZXIgOiBwb3NpdGlvbi5sZWZ0ICsgYnVmZmVyO1xuICAgICAgICAgICAgICAgICAgdmFyIG1heCA9IG8ubWF4O1xuICAgICAgICAgICAgICAgICAgdmFyIG1pbiA9IG8ubWluO1xuXG4gICAgICAgICAgICAgICAgICAvKiBmaXggbWF4ICovXG4gICAgICAgICAgICAgICAgICBpZigkLmlzRnVuY3Rpb24oby5tYXgpKXtcbiAgICAgICAgICAgICAgICAgICAgbWF4ID0gby5tYXgoKTtcbiAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgLyogZml4IG1heCAqL1xuICAgICAgICAgICAgICAgICAgaWYoJC5pc0Z1bmN0aW9uKG8ubWluKSl7XG4gICAgICAgICAgICAgICAgICAgIG1pbiA9IG8ubWluKCk7XG4gICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgIGlmKG1heCA9PSAwKXtcbiAgICAgICAgICAgICAgICAgICAgICBtYXggPSAobW9kZSA9PSAndmVydGljYWwnKSA/ICRjb250YWluZXIuaGVpZ2h0KCkgOiAkY29udGFpbmVyLm91dGVyV2lkdGgoKSArICQoZWxlbWVudCkub3V0ZXJXaWR0aCgpO1xuICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAvKiBpZiB3ZSBoYXZlIHJlYWNoZWQgdGhlIG1pbmltdW0gYm91bmQgYnV0IGFyZSBiZWxvdyB0aGUgbWF4IC4uLiAqL1xuICAgICAgICAgICAgICAgICAgaWYoeHkgPj0gbWluICYmIHh5IDw9IG1heCl7XG4gICAgICAgICAgICAgICAgICAgIC8qIHRyaWdnZXIgZW50ZXIgZXZlbnQgKi9cbiAgICAgICAgICAgICAgICAgICAgaWYoIWluc2lkZSl7XG4gICAgICAgICAgICAgICAgICAgICAgIGluc2lkZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgIGVudGVycysrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgIC8qIGZpcmUgZW50ZXIgZXZlbnQgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgJChlbGVtZW50KS50cmlnZ2VyKCdzY3JvbGxFbnRlcicsIHtwb3NpdGlvbjogcG9zaXRpb259KVxuICAgICAgICAgICAgICAgICAgICAgICBpZigkLmlzRnVuY3Rpb24oby5vbkVudGVyKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgby5vbkVudGVyKGVsZW1lbnQsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgIC8qIHRyaWdnZXIgdGljayBldmVudCAqL1xuICAgICAgICAgICAgICAgICAgICAgJChlbGVtZW50KS50cmlnZ2VyKCdzY3JvbGxUaWNrJywge3Bvc2l0aW9uOiBwb3NpdGlvbiwgaW5zaWRlOiBpbnNpZGUsIGVudGVyczogZW50ZXJzLCBsZWF2ZXM6IGxlYXZlc30pXG4gICAgICAgICAgICAgICAgICAgICBpZigkLmlzRnVuY3Rpb24oby5vblRpY2spKXtcbiAgICAgICAgICAgICAgICAgICAgICAgby5vblRpY2soZWxlbWVudCwgcG9zaXRpb24sIGluc2lkZSwgZW50ZXJzLCBsZWF2ZXMpO1xuICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfWVsc2V7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoaW5zaWRlKXtcbiAgICAgICAgICAgICAgICAgICAgICBpbnNpZGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICBsZWF2ZXMrKztcbiAgICAgICAgICAgICAgICAgICAgICAvKiB0cmlnZ2VyIGxlYXZlIGV2ZW50ICovXG4gICAgICAgICAgICAgICAgICAgICAgJChlbGVtZW50KS50cmlnZ2VyKCdzY3JvbGxMZWF2ZScsIHtwb3NpdGlvbjogcG9zaXRpb24sIGxlYXZlczpsZWF2ZXN9KVxuXG4gICAgICAgICAgICAgICAgICAgICAgaWYoJC5pc0Z1bmN0aW9uKG8ub25MZWF2ZSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgby5vbkxlYXZlKGVsZW1lbnQsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgIH0pXG5cblxufSkoIGpRdWVyeSwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkICk7XG4iXX0=
