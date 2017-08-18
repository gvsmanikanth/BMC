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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5LmZsb2F0bGFiZWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXHJcbiAqIEZsb2F0TGFiZWxzXHJcbiAqIFZlcnNpb246IDEuMFxyXG4gKiBVUkw6IGh0dHA6Ly9jbHViZGVzaWduLmdpdGh1Yi5pby9mbG9hdGxhYmVscy5qcy9cclxuICogRGVzY3JpcHRpb246IFxyXG4gKiBBdXRob3I6IE1hcmN1cyBQb2hvcmVseSAoIGh0dHA6Ly93d3cuY2x1YmRlc2lnbi5hdCApXHJcbiAqIENvcHlyaWdodDogQ29weXJpZ2h0IDIwMTMgLyAyMDE0IGh0dHA6Ly93d3cuY2x1YmRlc2lnbi5hdFxyXG4gKi9cclxuXHJcbjsoZnVuY3Rpb24gKCAkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQgKSB7XHJcblxyXG4gICAgICAgIHZhciBwbHVnaW5OYW1lID0gXCJmbG9hdGxhYmVsXCIsXHJcbiAgICAgICAgICAgIGRlZmF1bHRzID0ge1xyXG4gICAgICAgICAgICAgICAgc2xpZGVJbnB1dCAgICAgICAgICAgICAgICAgICAgICA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBsYWJlbFN0YXJ0VG9wICAgICAgICAgICAgICAgICAgIDogJzIwcHgnLFxyXG4gICAgICAgICAgICAgICAgbGFiZWxFbmRUb3AgICAgICAgICAgICAgICAgICAgICA6ICcxMHB4JyxcclxuICAgICAgICAgICAgICAgIHBhZGRpbmdPZmZzZXQgICAgICAgICAgICAgICAgICAgOiAnMTBweCcsXHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uRHVyYXRpb24gICAgICAgICAgICAgIDogMC4zLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbkVhc2luZyAgICAgICAgICAgICAgICA6ICdlYXNlLWluLW91dCcsXHJcbiAgICAgICAgICAgICAgICBsYWJlbENsYXNzICAgICAgICAgICAgICAgICAgICAgIDogJycsXHJcbiAgICAgICAgICAgICAgICB0eXBlTWF0Y2hlcyAgICAgICAgICAgICAgICAgICAgIDogL3RleHR8cGFzc3dvcmR8ZW1haWx8bnVtYmVyfHNlYXJjaHx1cmwvXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIFBsdWdpbiAoIGVsZW1lbnQsIG9wdGlvbnMgKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50ICAgICAgID0gJChlbGVtZW50KTtcclxuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncyAgICAgICA9ICQuZXh0ZW5kKCB7fSwgZGVmYXVsdHMsIG9wdGlvbnMgKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgUGx1Z2luLnByb3RvdHlwZSA9IHtcclxuXHJcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiAgICAgICAgICA9IHRoaXMsXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3MgICAgICA9IHRoaXMuc2V0dGluZ3MsXHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNEdXJhdGlvbiA9IHNldHRpbmdzLnRyYW5zaXRpb25EdXJhdGlvbixcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc0Vhc2luZyAgID0gc2V0dGluZ3MudHJhbnNpdGlvbkVhc2luZyxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzRWxlbWVudCAgID0gdGhpcy4kZWxlbWVudDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmFyIGFuaW1hdGlvbkNzcyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAnLXdlYmtpdC10cmFuc2l0aW9uJyAgICAgICAgICAgIDogJ2FsbCAnICsgdHJhbnNEdXJhdGlvbiArICdzICcgKyB0cmFuc0Vhc2luZyxcclxuICAgICAgICAgICAgICAgICAgICAnLW1vei10cmFuc2l0aW9uJyAgICAgICAgICAgICAgIDogJ2FsbCAnICsgdHJhbnNEdXJhdGlvbiArICdzICcgKyB0cmFuc0Vhc2luZyxcclxuICAgICAgICAgICAgICAgICAgICAnLW8tdHJhbnNpdGlvbicgICAgICAgICAgICAgICAgIDogJ2FsbCAnICsgdHJhbnNEdXJhdGlvbiArICdzICcgKyB0cmFuc0Vhc2luZyxcclxuICAgICAgICAgICAgICAgICAgICAnLW1zLXRyYW5zaXRpb24nICAgICAgICAgICAgICAgIDogJ2FsbCAnICsgdHJhbnNEdXJhdGlvbiArICdzICcgKyB0cmFuc0Vhc2luZyxcclxuICAgICAgICAgICAgICAgICAgICAndHJhbnNpdGlvbicgICAgICAgICAgICAgICAgICAgIDogJ2FsbCAnICsgdHJhbnNEdXJhdGlvbiArICdzICcgKyB0cmFuc0Vhc2luZ1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiggdGhpc0VsZW1lbnQucHJvcCgndGFnTmFtZScpLnRvVXBwZXJDYXNlKCkgIT09ICdJTlBVVCcgKSB7IHJldHVybjsgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmKCAhc2V0dGluZ3MudHlwZU1hdGNoZXMudGVzdCggdGhpc0VsZW1lbnQuYXR0cigndHlwZScpICkgKSB7IHJldHVybjsgfVxyXG5cclxuICAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50SUQgPSB0aGlzRWxlbWVudC5hdHRyKCdpZCcpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKCAhZWxlbWVudElEICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRJRCA9IE1hdGguZmxvb3IoIE1hdGgucmFuZG9tKCkgKiAxMDAgKSArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpc0VsZW1lbnQuYXR0cignaWQnLCBlbGVtZW50SUQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBwbGFjZWhvbGRlclRleHQgICAgID0gdGhpc0VsZW1lbnQuYXR0cigncGxhY2Vob2xkZXInKTtcclxuICAgICAgICAgICAgICAgIHZhciBmbG9hdGluZ1RleHQgICAgICAgID0gdGhpc0VsZW1lbnQuZGF0YSgnbGFiZWwnKTtcclxuICAgICAgICAgICAgICAgIHZhciBleHRyYUNsYXNzZXMgICAgICAgID0gdGhpc0VsZW1lbnQuZGF0YSgnY2xhc3MnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiggIWV4dHJhQ2xhc3NlcyApIHsgZXh0cmFDbGFzc2VzID0gJyc7IH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiggIXBsYWNlaG9sZGVyVGV4dCB8fCBwbGFjZWhvbGRlclRleHQgPT09ICcnICkgeyBwbGFjZWhvbGRlclRleHQgPSBcIllvdSBmb3Jnb3QgdG8gYWRkIHBsYWNlaG9sZGVyIGF0dHJpYnV0ZSFcIjsgfVxyXG4gICAgICAgICAgICAgICAgaWYoICFmbG9hdGluZ1RleHQgfHwgZmxvYXRpbmdUZXh0ID09PSAnJyApIHsgZmxvYXRpbmdUZXh0ID0gcGxhY2Vob2xkZXJUZXh0OyB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dFBhZGRpbmdUb3AgICAgPSBwYXJzZUZsb2F0KCB0aGlzRWxlbWVudC5jc3MoJ3BhZGRpbmctdG9wJykgKSArIHBhcnNlRmxvYXQoc2V0dGluZ3MucGFkZGluZ09mZnNldCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpc0VsZW1lbnQud3JhcCgnPGRpdiBjbGFzcz1cImZsb2F0bGFiZWwtd3JhcHBlclwiIHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmVcIj48L2Rpdj4nKTtcclxuICAgICAgICAgICAgICAgIHRoaXNFbGVtZW50LmJlZm9yZSgnPGxhYmVsIGZvcj1cIicgKyBlbGVtZW50SUQgKyAnXCIgY2xhc3M9XCJsYWJlbC1mbG9hdGxhYmVsICcgKyBzZXR0aW5ncy5sYWJlbENsYXNzICsgJyAnICsgZXh0cmFDbGFzc2VzICsgJ1wiPicgKyBmbG9hdGluZ1RleHQgKyAnPC9sYWJlbD4nKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLiRsYWJlbCA9IHRoaXNFbGVtZW50LnByZXYoJ2xhYmVsJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRsYWJlbC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICdwb3NpdGlvbicgICAgICAgICAgICAgICAgICAgICAgOiAnYWJzb2x1dGUnLFxyXG4gICAgICAgICAgICAgICAgICAgICd0b3AnICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBzZXR0aW5ncy5sYWJlbFN0YXJ0VG9wLFxyXG4gICAgICAgICAgICAgICAgICAgICdsZWZ0JyAgICAgICAgICAgICAgICAgICAgICAgICAgOiB0aGlzRWxlbWVudC5jc3MoJ3BhZGRpbmctbGVmdCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICdkaXNwbGF5JyAgICAgICAgICAgICAgICAgICAgICAgOiAnbm9uZScsXHJcbiAgICAgICAgICAgICAgICAgICAgJy1tb3otb3BhY2l0eScgICAgICAgICAgICAgICAgICA6ICcwJyxcclxuICAgICAgICAgICAgICAgICAgICAnLWtodG1sLW9wYWNpdHknICAgICAgICAgICAgICAgIDogJzAnLFxyXG4gICAgICAgICAgICAgICAgICAgICctd2Via2l0LW9wYWNpdHknICAgICAgICAgICAgICAgOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ29wYWNpdHknICAgICAgICAgICAgICAgICAgICAgICA6ICcwJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoICFzZXR0aW5ncy5zbGlkZUlucHV0ICkge1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXNFbGVtZW50LmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdwYWRkaW5nLXRvcCcgICAgICAgICAgICAgICAgICAgOiB0aGlzLmlucHV0UGFkZGluZ1RvcFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzRWxlbWVudC5vbigna2V5dXAgYmx1ciBjaGFuZ2UnLCBmdW5jdGlvbiggZSApIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmNoZWNrVmFsdWUoIGUgKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuJGxhYmVsLmNzcyggYW5pbWF0aW9uQ3NzICk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi4kZWxlbWVudC5jc3MoIGFuaW1hdGlvbkNzcyApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sIDEwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja1ZhbHVlKCk7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgY2hlY2tWYWx1ZTogZnVuY3Rpb24oIGUgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoIGUgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBrZXlDb2RlICAgICAgICAgPSBlLmtleUNvZGUgfHwgZS53aGljaDtcclxuICAgICAgICAgICAgICAgICAgICBpZigga2V5Q29kZSA9PT0gOSApIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdGhpc0VsZW1lbnQgID0gdGhpcy4kZWxlbWVudCwgXHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEZsb3V0ID0gdGhpc0VsZW1lbnQuZGF0YSgnZmxvdXQnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiggdGhpc0VsZW1lbnQudmFsKCkgIT09IFwiXCIgKSB7IHRoaXNFbGVtZW50LmRhdGEoJ2Zsb3V0JywgJzEnKTsgfVxyXG4gICAgICAgICAgICAgICAgaWYoIHRoaXNFbGVtZW50LnZhbCgpID09PSBcIlwiICkgeyB0aGlzRWxlbWVudC5kYXRhKCdmbG91dCcsICcwJyk7IH1cclxuXHJcblxyXG5cclxuICAgICAgICAgICAgICAgIGlmKCB0aGlzRWxlbWVudC5kYXRhKCdmbG91dCcpID09PSAnMScgJiYgY3VycmVudEZsb3V0ICE9PSAnMScgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93TGFiZWwoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiggdGhpc0VsZW1lbnQuZGF0YSgnZmxvdXQnKSA9PT0gJzAnICYmIGN1cnJlbnRGbG91dCAhPT0gJzAnICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGlkZUxhYmVsKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzaG93TGFiZWw6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLiRsYWJlbC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICdkaXNwbGF5JyAgICAgICAgICAgICAgICAgICAgICAgOiAnYmxvY2snXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi4kbGFiZWwuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3RvcCcgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHNlbGYuc2V0dGluZ3MubGFiZWxFbmRUb3AsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICctbW96LW9wYWNpdHknICAgICAgICAgICAgICAgICAgOiAnMScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICcta2h0bWwtb3BhY2l0eScgICAgICAgICAgICAgICAgOiAnMScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICctd2Via2l0LW9wYWNpdHknICAgICAgICAgICAgICAgOiAnMScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdvcGFjaXR5JyAgICAgICAgICAgICAgICAgICAgICAgOiAnMSdcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIHNlbGYuc2V0dGluZ3Muc2xpZGVJbnB1dCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuJGVsZW1lbnQuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwYWRkaW5nLXRvcCcgICAgICAgICAgICAgICA6IHNlbGYuaW5wdXRQYWRkaW5nVG9wXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi4kZWxlbWVudC5hZGRDbGFzcygnYWN0aXZlLWZsb2F0bGFiZWwnKTtcclxuICAgICAgICAgICAgICAgIH0sIDUwKTtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBoaWRlTGFiZWw6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLiRsYWJlbC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICd0b3AnICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBzZWxmLnNldHRpbmdzLmxhYmVsU3RhcnRUb3AsXHJcbiAgICAgICAgICAgICAgICAgICAgJy1tb3otb3BhY2l0eScgICAgICAgICAgICAgICAgICA6ICcwJyxcclxuICAgICAgICAgICAgICAgICAgICAnLWtodG1sLW9wYWNpdHknICAgICAgICAgICAgICAgIDogJzAnLFxyXG4gICAgICAgICAgICAgICAgICAgICctd2Via2l0LW9wYWNpdHknICAgICAgICAgICAgICAgOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ29wYWNpdHknICAgICAgICAgICAgICAgICAgICAgICA6ICcwJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoIHNlbGYuc2V0dGluZ3Muc2xpZGVJbnB1dCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi4kZWxlbWVudC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAncGFkZGluZy10b3AnICAgICAgICAgICAgICAgOiBwYXJzZUZsb2F0KCBzZWxmLmlucHV0UGFkZGluZ1RvcCApIC0gcGFyc2VGbG9hdCh0aGlzLnNldHRpbmdzLnBhZGRpbmdPZmZzZXQpXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc2VsZi4kZWxlbWVudC5yZW1vdmVDbGFzcygnYWN0aXZlLWZsb2F0bGFiZWwnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLiRsYWJlbC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGlzcGxheScgICAgICAgICAgICAgICAgICAgICAgIDogJ25vbmUnXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9LCBzZWxmLnNldHRpbmdzLnRyYW5zaXRpb25EdXJhdGlvbiAqIDEwMDApO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICQuZm5bIHBsdWdpbk5hbWUgXSA9IGZ1bmN0aW9uICggb3B0aW9ucyApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGlmICggISQuZGF0YSggdGhpcywgXCJwbHVnaW5fXCIgKyBwbHVnaW5OYW1lICkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJC5kYXRhKCB0aGlzLCBcInBsdWdpbl9cIiArIHBsdWdpbk5hbWUsIG5ldyBQbHVnaW4oIHRoaXMsIG9wdGlvbnMgKSApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxufSkoIGpRdWVyeSwgd2luZG93LCBkb2N1bWVudCApOyJdfQ==
