(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * FloatLabels
 * Version: 1.0
 * URL: http://clubdesign.github.io/floatlabels.js/
 * Description: 
 * Author: Marcus Pohorely ( http://www.clubdesign.at )
 * Copyright: Copyright 2013 / 2014 http://www.clubdesign.at
 */

;(function ( $, window, document, undefined ) {

        var pluginName = "floatlabel",
            defaults = {
                slideInput                      : true,
                labelStartTop                   : '20px',
                labelEndTop                     : '10px',
                paddingOffset                   : '10px',
                transitionDuration              : 0.3,
                transitionEasing                : 'ease-in-out',
                labelClass                      : '',
                typeMatches                     : /text|password|email|number|search|url/
            };

        function Plugin ( element, options ) {
            
            this.$element       = $(element);
            this.settings       = $.extend( {}, defaults, options );

            this.init();
        
        }

        Plugin.prototype = {

            init: function () {

                var self          = this,
                    settings      = this.settings,
                    transDuration = settings.transitionDuration,
                    transEasing   = settings.transitionEasing,
                    thisElement   = this.$element;
                
                var animationCss = {
                    '-webkit-transition'            : 'all ' + transDuration + 's ' + transEasing,
                    '-moz-transition'               : 'all ' + transDuration + 's ' + transEasing,
                    '-o-transition'                 : 'all ' + transDuration + 's ' + transEasing,
                    '-ms-transition'                : 'all ' + transDuration + 's ' + transEasing,
                    'transition'                    : 'all ' + transDuration + 's ' + transEasing
                };

                if( thisElement.prop('tagName').toUpperCase() !== 'INPUT' ) { return; }

                if( !settings.typeMatches.test( thisElement.attr('type') ) ) { return; }

                

                var elementID = thisElement.attr('id');

                if( !elementID ) {
                    elementID = Math.floor( Math.random() * 100 ) + 1;
                    thisElement.attr('id', elementID);
                }

                var placeholderText     = thisElement.attr('placeholder');
                var floatingText        = thisElement.data('label');
                var extraClasses        = thisElement.data('class');

                if( !extraClasses ) { extraClasses = ''; }

                if( !placeholderText || placeholderText === '' ) { placeholderText = "You forgot to add placeholder attribute!"; }
                if( !floatingText || floatingText === '' ) { floatingText = placeholderText; }

                this.inputPaddingTop    = parseFloat( thisElement.css('padding-top') ) + parseFloat(settings.paddingOffset);

                thisElement.wrap('<div class="floatlabel-wrapper" style="position:relative"></div>');
                thisElement.before('<label for="' + elementID + '" class="label-floatlabel ' + settings.labelClass + ' ' + extraClasses + '">' + floatingText + '</label>');

                this.$label = thisElement.prev('label');
                this.$label.css({
                    'position'                      : 'absolute',
                    'top'                           : settings.labelStartTop,
                    'left'                          : thisElement.css('padding-left'),
                    'display'                       : 'none',
                    '-moz-opacity'                  : '0',
                    '-khtml-opacity'                : '0',
                    '-webkit-opacity'               : '0',
                    'opacity'                       : '0'
                });

                if( !settings.slideInput ) {
                    
                    thisElement.css({
                        'padding-top'                   : this.inputPaddingTop
                    });

                }

                thisElement.on('keyup blur change', function( e ) {
                    self.checkValue( e );
                });


                window.setTimeout( function() {

                    self.$label.css( animationCss );
                    self.$element.css( animationCss );

                }, 100);

                this.checkValue();

            },

            checkValue: function( e ) {

                if( e ) {

                    var keyCode         = e.keyCode || e.which;
                    if( keyCode === 9 ) { return; }
                
                }

                var thisElement  = this.$element, 
                    currentFlout = thisElement.data('flout');

                if( thisElement.val() !== "" ) { thisElement.data('flout', '1'); }
                if( thisElement.val() === "" ) { thisElement.data('flout', '0'); }



                if( thisElement.data('flout') === '1' && currentFlout !== '1' ) {
                    this.showLabel();
                }

                if( thisElement.data('flout') === '0' && currentFlout !== '0' ) {
                    this.hideLabel();
                }

            },
            showLabel: function() {

                var self = this;

                self.$label.css({
                    'display'                       : 'block'
                });

                window.setTimeout(function() {

                    self.$label.css({
                        'top'                           : self.settings.labelEndTop,
                        '-moz-opacity'                  : '1',
                        '-khtml-opacity'                : '1',
                        '-webkit-opacity'               : '1',
                        'opacity'                       : '1'
                    });

                    if( self.settings.slideInput ) {

                        self.$element.css({
                            'padding-top'               : self.inputPaddingTop
                        });

                    }
                    self.$element.addClass('active-floatlabel');
                }, 50);

            },

            hideLabel: function() {

                var self = this;

                self.$label.css({
                    'top'                           : self.settings.labelStartTop,
                    '-moz-opacity'                  : '0',
                    '-khtml-opacity'                : '0',
                    '-webkit-opacity'               : '0',
                    'opacity'                       : '0'
                });

                if( self.settings.slideInput ) {

                    self.$element.css({
                        'padding-top'               : parseFloat( self.inputPaddingTop ) - parseFloat(this.settings.paddingOffset)
                    });

                }
                self.$element.removeClass('active-floatlabel');

                window.setTimeout(function() {
                    self.$label.css({
                        'display'                       : 'none'
                    });
                }, self.settings.transitionDuration * 1000);

            }
        };

        $.fn[ pluginName ] = function ( options ) {
            return this.each(function() {
                if ( !$.data( this, "plugin_" + pluginName ) ) {
                    $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
                }
            });
        };

})( jQuery, window, document );
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5LmZsb2F0bGFiZWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBGbG9hdExhYmVsc1xuICogVmVyc2lvbjogMS4wXG4gKiBVUkw6IGh0dHA6Ly9jbHViZGVzaWduLmdpdGh1Yi5pby9mbG9hdGxhYmVscy5qcy9cbiAqIERlc2NyaXB0aW9uOiBcbiAqIEF1dGhvcjogTWFyY3VzIFBvaG9yZWx5ICggaHR0cDovL3d3dy5jbHViZGVzaWduLmF0IClcbiAqIENvcHlyaWdodDogQ29weXJpZ2h0IDIwMTMgLyAyMDE0IGh0dHA6Ly93d3cuY2x1YmRlc2lnbi5hdFxuICovXG5cbjsoZnVuY3Rpb24gKCAkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQgKSB7XG5cbiAgICAgICAgdmFyIHBsdWdpbk5hbWUgPSBcImZsb2F0bGFiZWxcIixcbiAgICAgICAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgICAgIHNsaWRlSW5wdXQgICAgICAgICAgICAgICAgICAgICAgOiB0cnVlLFxuICAgICAgICAgICAgICAgIGxhYmVsU3RhcnRUb3AgICAgICAgICAgICAgICAgICAgOiAnMjBweCcsXG4gICAgICAgICAgICAgICAgbGFiZWxFbmRUb3AgICAgICAgICAgICAgICAgICAgICA6ICcxMHB4JyxcbiAgICAgICAgICAgICAgICBwYWRkaW5nT2Zmc2V0ICAgICAgICAgICAgICAgICAgIDogJzEwcHgnLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb25EdXJhdGlvbiAgICAgICAgICAgICAgOiAwLjMsXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbkVhc2luZyAgICAgICAgICAgICAgICA6ICdlYXNlLWluLW91dCcsXG4gICAgICAgICAgICAgICAgbGFiZWxDbGFzcyAgICAgICAgICAgICAgICAgICAgICA6ICcnLFxuICAgICAgICAgICAgICAgIHR5cGVNYXRjaGVzICAgICAgICAgICAgICAgICAgICAgOiAvdGV4dHxwYXNzd29yZHxlbWFpbHxudW1iZXJ8c2VhcmNofHVybC9cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gUGx1Z2luICggZWxlbWVudCwgb3B0aW9ucyApIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy4kZWxlbWVudCAgICAgICA9ICQoZWxlbWVudCk7XG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzICAgICAgID0gJC5leHRlbmQoIHt9LCBkZWZhdWx0cywgb3B0aW9ucyApO1xuXG4gICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICBQbHVnaW4ucHJvdG90eXBlID0ge1xuXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgc2VsZiAgICAgICAgICA9IHRoaXMsXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzICAgICAgPSB0aGlzLnNldHRpbmdzLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc0R1cmF0aW9uID0gc2V0dGluZ3MudHJhbnNpdGlvbkR1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc0Vhc2luZyAgID0gc2V0dGluZ3MudHJhbnNpdGlvbkVhc2luZyxcbiAgICAgICAgICAgICAgICAgICAgdGhpc0VsZW1lbnQgICA9IHRoaXMuJGVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIGFuaW1hdGlvbkNzcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgJy13ZWJraXQtdHJhbnNpdGlvbicgICAgICAgICAgICA6ICdhbGwgJyArIHRyYW5zRHVyYXRpb24gKyAncyAnICsgdHJhbnNFYXNpbmcsXG4gICAgICAgICAgICAgICAgICAgICctbW96LXRyYW5zaXRpb24nICAgICAgICAgICAgICAgOiAnYWxsICcgKyB0cmFuc0R1cmF0aW9uICsgJ3MgJyArIHRyYW5zRWFzaW5nLFxuICAgICAgICAgICAgICAgICAgICAnLW8tdHJhbnNpdGlvbicgICAgICAgICAgICAgICAgIDogJ2FsbCAnICsgdHJhbnNEdXJhdGlvbiArICdzICcgKyB0cmFuc0Vhc2luZyxcbiAgICAgICAgICAgICAgICAgICAgJy1tcy10cmFuc2l0aW9uJyAgICAgICAgICAgICAgICA6ICdhbGwgJyArIHRyYW5zRHVyYXRpb24gKyAncyAnICsgdHJhbnNFYXNpbmcsXG4gICAgICAgICAgICAgICAgICAgICd0cmFuc2l0aW9uJyAgICAgICAgICAgICAgICAgICAgOiAnYWxsICcgKyB0cmFuc0R1cmF0aW9uICsgJ3MgJyArIHRyYW5zRWFzaW5nXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGlmKCB0aGlzRWxlbWVudC5wcm9wKCd0YWdOYW1lJykudG9VcHBlckNhc2UoKSAhPT0gJ0lOUFVUJyApIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgICAgICAgICBpZiggIXNldHRpbmdzLnR5cGVNYXRjaGVzLnRlc3QoIHRoaXNFbGVtZW50LmF0dHIoJ3R5cGUnKSApICkgeyByZXR1cm47IH1cblxuICAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRJRCA9IHRoaXNFbGVtZW50LmF0dHIoJ2lkJyk7XG5cbiAgICAgICAgICAgICAgICBpZiggIWVsZW1lbnRJRCApIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudElEID0gTWF0aC5mbG9vciggTWF0aC5yYW5kb20oKSAqIDEwMCApICsgMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpc0VsZW1lbnQuYXR0cignaWQnLCBlbGVtZW50SUQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBwbGFjZWhvbGRlclRleHQgICAgID0gdGhpc0VsZW1lbnQuYXR0cigncGxhY2Vob2xkZXInKTtcbiAgICAgICAgICAgICAgICB2YXIgZmxvYXRpbmdUZXh0ICAgICAgICA9IHRoaXNFbGVtZW50LmRhdGEoJ2xhYmVsJyk7XG4gICAgICAgICAgICAgICAgdmFyIGV4dHJhQ2xhc3NlcyAgICAgICAgPSB0aGlzRWxlbWVudC5kYXRhKCdjbGFzcycpO1xuXG4gICAgICAgICAgICAgICAgaWYoICFleHRyYUNsYXNzZXMgKSB7IGV4dHJhQ2xhc3NlcyA9ICcnOyB9XG5cbiAgICAgICAgICAgICAgICBpZiggIXBsYWNlaG9sZGVyVGV4dCB8fCBwbGFjZWhvbGRlclRleHQgPT09ICcnICkgeyBwbGFjZWhvbGRlclRleHQgPSBcIllvdSBmb3Jnb3QgdG8gYWRkIHBsYWNlaG9sZGVyIGF0dHJpYnV0ZSFcIjsgfVxuICAgICAgICAgICAgICAgIGlmKCAhZmxvYXRpbmdUZXh0IHx8IGZsb2F0aW5nVGV4dCA9PT0gJycgKSB7IGZsb2F0aW5nVGV4dCA9IHBsYWNlaG9sZGVyVGV4dDsgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dFBhZGRpbmdUb3AgICAgPSBwYXJzZUZsb2F0KCB0aGlzRWxlbWVudC5jc3MoJ3BhZGRpbmctdG9wJykgKSArIHBhcnNlRmxvYXQoc2V0dGluZ3MucGFkZGluZ09mZnNldCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzRWxlbWVudC53cmFwKCc8ZGl2IGNsYXNzPVwiZmxvYXRsYWJlbC13cmFwcGVyXCIgc3R5bGU9XCJwb3NpdGlvbjpyZWxhdGl2ZVwiPjwvZGl2PicpO1xuICAgICAgICAgICAgICAgIHRoaXNFbGVtZW50LmJlZm9yZSgnPGxhYmVsIGZvcj1cIicgKyBlbGVtZW50SUQgKyAnXCIgY2xhc3M9XCJsYWJlbC1mbG9hdGxhYmVsICcgKyBzZXR0aW5ncy5sYWJlbENsYXNzICsgJyAnICsgZXh0cmFDbGFzc2VzICsgJ1wiPicgKyBmbG9hdGluZ1RleHQgKyAnPC9sYWJlbD4nKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuJGxhYmVsID0gdGhpc0VsZW1lbnQucHJldignbGFiZWwnKTtcbiAgICAgICAgICAgICAgICB0aGlzLiRsYWJlbC5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAncG9zaXRpb24nICAgICAgICAgICAgICAgICAgICAgIDogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICAgICAgJ3RvcCcgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHNldHRpbmdzLmxhYmVsU3RhcnRUb3AsXG4gICAgICAgICAgICAgICAgICAgICdsZWZ0JyAgICAgICAgICAgICAgICAgICAgICAgICAgOiB0aGlzRWxlbWVudC5jc3MoJ3BhZGRpbmctbGVmdCcpLFxuICAgICAgICAgICAgICAgICAgICAnZGlzcGxheScgICAgICAgICAgICAgICAgICAgICAgIDogJ25vbmUnLFxuICAgICAgICAgICAgICAgICAgICAnLW1vei1vcGFjaXR5JyAgICAgICAgICAgICAgICAgIDogJzAnLFxuICAgICAgICAgICAgICAgICAgICAnLWtodG1sLW9wYWNpdHknICAgICAgICAgICAgICAgIDogJzAnLFxuICAgICAgICAgICAgICAgICAgICAnLXdlYmtpdC1vcGFjaXR5JyAgICAgICAgICAgICAgIDogJzAnLFxuICAgICAgICAgICAgICAgICAgICAnb3BhY2l0eScgICAgICAgICAgICAgICAgICAgICAgIDogJzAnXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiggIXNldHRpbmdzLnNsaWRlSW5wdXQgKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB0aGlzRWxlbWVudC5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3BhZGRpbmctdG9wJyAgICAgICAgICAgICAgICAgICA6IHRoaXMuaW5wdXRQYWRkaW5nVG9wXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpc0VsZW1lbnQub24oJ2tleXVwIGJsdXIgY2hhbmdlJywgZnVuY3Rpb24oIGUgKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY2hlY2tWYWx1ZSggZSApO1xuICAgICAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgc2VsZi4kbGFiZWwuY3NzKCBhbmltYXRpb25Dc3MgKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi4kZWxlbWVudC5jc3MoIGFuaW1hdGlvbkNzcyApO1xuXG4gICAgICAgICAgICAgICAgfSwgMTAwKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tWYWx1ZSgpO1xuXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBjaGVja1ZhbHVlOiBmdW5jdGlvbiggZSApIHtcblxuICAgICAgICAgICAgICAgIGlmKCBlICkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBrZXlDb2RlICAgICAgICAgPSBlLmtleUNvZGUgfHwgZS53aGljaDtcbiAgICAgICAgICAgICAgICAgICAgaWYoIGtleUNvZGUgPT09IDkgKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciB0aGlzRWxlbWVudCAgPSB0aGlzLiRlbGVtZW50LCBcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEZsb3V0ID0gdGhpc0VsZW1lbnQuZGF0YSgnZmxvdXQnKTtcblxuICAgICAgICAgICAgICAgIGlmKCB0aGlzRWxlbWVudC52YWwoKSAhPT0gXCJcIiApIHsgdGhpc0VsZW1lbnQuZGF0YSgnZmxvdXQnLCAnMScpOyB9XG4gICAgICAgICAgICAgICAgaWYoIHRoaXNFbGVtZW50LnZhbCgpID09PSBcIlwiICkgeyB0aGlzRWxlbWVudC5kYXRhKCdmbG91dCcsICcwJyk7IH1cblxuXG5cbiAgICAgICAgICAgICAgICBpZiggdGhpc0VsZW1lbnQuZGF0YSgnZmxvdXQnKSA9PT0gJzEnICYmIGN1cnJlbnRGbG91dCAhPT0gJzEnICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dMYWJlbCgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmKCB0aGlzRWxlbWVudC5kYXRhKCdmbG91dCcpID09PSAnMCcgJiYgY3VycmVudEZsb3V0ICE9PSAnMCcgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGlkZUxhYmVsKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2hvd0xhYmVsOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgICAgIHNlbGYuJGxhYmVsLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICdkaXNwbGF5JyAgICAgICAgICAgICAgICAgICAgICAgOiAnYmxvY2snXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICBzZWxmLiRsYWJlbC5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3RvcCcgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHNlbGYuc2V0dGluZ3MubGFiZWxFbmRUb3AsXG4gICAgICAgICAgICAgICAgICAgICAgICAnLW1vei1vcGFjaXR5JyAgICAgICAgICAgICAgICAgIDogJzEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJy1raHRtbC1vcGFjaXR5JyAgICAgICAgICAgICAgICA6ICcxJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICctd2Via2l0LW9wYWNpdHknICAgICAgICAgICAgICAgOiAnMScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnb3BhY2l0eScgICAgICAgICAgICAgICAgICAgICAgIDogJzEnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKCBzZWxmLnNldHRpbmdzLnNsaWRlSW5wdXQgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuJGVsZW1lbnQuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAncGFkZGluZy10b3AnICAgICAgICAgICAgICAgOiBzZWxmLmlucHV0UGFkZGluZ1RvcFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZWxmLiRlbGVtZW50LmFkZENsYXNzKCdhY3RpdmUtZmxvYXRsYWJlbCcpO1xuICAgICAgICAgICAgICAgIH0sIDUwKTtcblxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgaGlkZUxhYmVsOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgICAgIHNlbGYuJGxhYmVsLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICd0b3AnICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBzZWxmLnNldHRpbmdzLmxhYmVsU3RhcnRUb3AsXG4gICAgICAgICAgICAgICAgICAgICctbW96LW9wYWNpdHknICAgICAgICAgICAgICAgICAgOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICcta2h0bWwtb3BhY2l0eScgICAgICAgICAgICAgICAgOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICctd2Via2l0LW9wYWNpdHknICAgICAgICAgICAgICAgOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICdvcGFjaXR5JyAgICAgICAgICAgICAgICAgICAgICAgOiAnMCdcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmKCBzZWxmLnNldHRpbmdzLnNsaWRlSW5wdXQgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgc2VsZi4kZWxlbWVudC5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3BhZGRpbmctdG9wJyAgICAgICAgICAgICAgIDogcGFyc2VGbG9hdCggc2VsZi5pbnB1dFBhZGRpbmdUb3AgKSAtIHBhcnNlRmxvYXQodGhpcy5zZXR0aW5ncy5wYWRkaW5nT2Zmc2V0KVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZWxmLiRlbGVtZW50LnJlbW92ZUNsYXNzKCdhY3RpdmUtZmxvYXRsYWJlbCcpO1xuXG4gICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuJGxhYmVsLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAnZGlzcGxheScgICAgICAgICAgICAgICAgICAgICAgIDogJ25vbmUnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sIHNlbGYuc2V0dGluZ3MudHJhbnNpdGlvbkR1cmF0aW9uICogMTAwMCk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAkLmZuWyBwbHVnaW5OYW1lIF0gPSBmdW5jdGlvbiAoIG9wdGlvbnMgKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICggISQuZGF0YSggdGhpcywgXCJwbHVnaW5fXCIgKyBwbHVnaW5OYW1lICkgKSB7XG4gICAgICAgICAgICAgICAgICAgICQuZGF0YSggdGhpcywgXCJwbHVnaW5fXCIgKyBwbHVnaW5OYW1lLCBuZXcgUGx1Z2luKCB0aGlzLCBvcHRpb25zICkgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxufSkoIGpRdWVyeSwgd2luZG93LCBkb2N1bWVudCApOyJdfQ==
