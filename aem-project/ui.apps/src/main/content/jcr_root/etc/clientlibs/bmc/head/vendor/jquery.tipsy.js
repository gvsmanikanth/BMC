(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// tipsy, facebook style tooltips for jquery
// version 1.0.0a
// (c) 2008-2010 jason frame [jason@onehackoranother.com]
// releated under the MIT license

(function($) {
    
    function fixTitle($ele) {
        if ($ele.attr('title') || typeof($ele.attr('original-title')) != 'string') {
            $ele.attr('original-title', $ele.attr('title') || '').removeAttr('title');
        }
    }
    
    function Tipsy(element, options) {
        this.$element = $(element);
        this.options = options;
        this.enabled = true;
        fixTitle(this.$element);
    }
    
    Tipsy.prototype = {
        show: function() {
            var title = this.getTitle();
            if (title && this.enabled) {
                var $tip = this.tip();
                
                $tip.find('.tipsy-inner')[this.options.html ? 'html' : 'text'](title);
                $tip[0].className = 'tipsy'; // reset classname in case of dynamic gravity
                $tip.remove().css({top: 0, left: 0, visibility: 'hidden', display: 'block'}).appendTo(document.body);
                
                var pos = $.extend({}, this.$element.offset(), {
                    width: this.$element[0].offsetWidth,
                    height: this.$element[0].offsetHeight
                });
                
                var actualWidth = $tip[0].offsetWidth, actualHeight = $tip[0].offsetHeight;
                var gravity = (typeof this.options.gravity == 'function')
                                ? this.options.gravity.call(this.$element[0])
                                : this.options.gravity;
                
                var tp;
                switch (gravity.charAt(0)) {
                    case 'n':
                        tp = {top: pos.top + pos.height + this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
                        break;
                    case 's':
                        tp = {top: pos.top - actualHeight - this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
                        break;
                    case 'e':
                        tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth - this.options.offset};
                        break;
                    case 'w':
                        tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width + this.options.offset};
                        break;
                }
                
                if (gravity.length == 2) {
                    if (gravity.charAt(1) == 'w') {
                        tp.left = pos.left + pos.width / 2 - 15;
                    } else {
                        tp.left = pos.left + pos.width / 2 - actualWidth + 15;
                    }
                }
                
                $tip.css(tp).addClass('tipsy-' + gravity);
                
                if (this.options.fade) {
                    $tip.stop().css({opacity: 0, display: 'block', visibility: 'visible'}).animate({opacity: this.options.opacity});
                } else {
                    $tip.css({visibility: 'visible', opacity: this.options.opacity});
                }
            }
        },
        
        hide: function() {
            if (this.options.fade) {
                this.tip().stop().fadeOut(function() { $(this).remove(); });
            } else {
                this.tip().remove();
            }
        },
        
        getTitle: function() {
            var title, $e = this.$element, o = this.options;
            fixTitle($e);
            var title, o = this.options;
            if (typeof o.title == 'string') {
                title = $e.attr(o.title == 'title' ? 'original-title' : o.title);
            } else if (typeof o.title == 'function') {
                title = o.title.call($e[0]);
            }
            title = ('' + title).replace(/(^\s*|\s*$)/, "");
            return title || o.fallback;
        },
        
        tip: function() {
            if (!this.$tip) {
                this.$tip = $('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"/></div>');
            }
            return this.$tip;
        },
        
        validate: function() {
            if (!this.$element[0].parentNode) {
                this.hide();
                this.$element = null;
                this.options = null;
            }
        },
        
        enable: function() { this.enabled = true; },
        disable: function() { this.enabled = false; },
        toggleEnabled: function() { this.enabled = !this.enabled; }
    };
    
    $.fn.tipsy = function(options) {
        
        if (options === true) {
            return this.data('tipsy');
        } else if (typeof options == 'string') {
            return this.data('tipsy')[options]();
        }
        
        options = $.extend({}, $.fn.tipsy.defaults, options);
        
        function get(ele) {
            var tipsy = $.data(ele, 'tipsy');
            if (!tipsy) {
                tipsy = new Tipsy(ele, $.fn.tipsy.elementOptions(ele, options));
                $.data(ele, 'tipsy', tipsy);
            }
            return tipsy;
        }
        
        function enter() {
            var tipsy = get(this);
            tipsy.hoverState = 'in';
            if (options.delayIn == 0) {
                tipsy.show();
            } else {
                setTimeout(function() { if (tipsy.hoverState == 'in') tipsy.show(); }, options.delayIn);
            }
        };
        
        function leave() {
            var tipsy = get(this);
            tipsy.hoverState = 'out';
            if (options.delayOut == 0) {
                tipsy.hide();
            } else {
                setTimeout(function() { if (tipsy.hoverState == 'out') tipsy.hide(); }, options.delayOut);
            }
        };
        
        if (!options.live) this.each(function() { get(this); });
        
        if (options.trigger != 'manual') {
            var binder   = options.live ? 'live' : 'bind',
                eventIn  = options.trigger == 'hover' ? 'mouseenter' : 'focus',
                eventOut = options.trigger == 'hover' ? 'mouseleave' : 'blur';
            this[binder](eventIn, enter)[binder](eventOut, leave);
        }
        
        return this;
        
    };
    
    $.fn.tipsy.defaults = {
        delayIn: 0,
        delayOut: 0,
        fade: false,
        fallback: '',
        gravity: 'n',
        html: false,
        live: false,
        offset: 0,
        opacity: 0.8,
        title: 'title',
        trigger: 'hover'
    };
    
    // Overwrite this method to provide options on a per-element basis.
    // For example, you could store the gravity in a 'tipsy-gravity' attribute:
    // return $.extend({}, options, {gravity: $(ele).attr('tipsy-gravity') || 'n' });
    // (remember - do not modify 'options' in place!)
    $.fn.tipsy.elementOptions = function(ele, options) {
        return $.metadata ? $.extend({}, options, $(ele).metadata()) : options;
    };
    
    $.fn.tipsy.autoNS = function() {
        return $(this).offset().top > ($(document).scrollTop() + $(window).height() / 2) ? 's' : 'n';
    };
    
    $.fn.tipsy.autoWE = function() {
        return $(this).offset().left > ($(document).scrollLeft() + $(window).width() / 2) ? 'e' : 'w';
    };
    
})(jQuery);

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5LnRpcHN5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gdGlwc3ksIGZhY2Vib29rIHN0eWxlIHRvb2x0aXBzIGZvciBqcXVlcnlcbi8vIHZlcnNpb24gMS4wLjBhXG4vLyAoYykgMjAwOC0yMDEwIGphc29uIGZyYW1lIFtqYXNvbkBvbmVoYWNrb3Jhbm90aGVyLmNvbV1cbi8vIHJlbGVhdGVkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuXG4oZnVuY3Rpb24oJCkge1xuICAgIFxuICAgIGZ1bmN0aW9uIGZpeFRpdGxlKCRlbGUpIHtcbiAgICAgICAgaWYgKCRlbGUuYXR0cigndGl0bGUnKSB8fCB0eXBlb2YoJGVsZS5hdHRyKCdvcmlnaW5hbC10aXRsZScpKSAhPSAnc3RyaW5nJykge1xuICAgICAgICAgICAgJGVsZS5hdHRyKCdvcmlnaW5hbC10aXRsZScsICRlbGUuYXR0cigndGl0bGUnKSB8fCAnJykucmVtb3ZlQXR0cigndGl0bGUnKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBUaXBzeShlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuJGVsZW1lbnQgPSAkKGVsZW1lbnQpO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xuICAgICAgICBmaXhUaXRsZSh0aGlzLiRlbGVtZW50KTtcbiAgICB9XG4gICAgXG4gICAgVGlwc3kucHJvdG90eXBlID0ge1xuICAgICAgICBzaG93OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0aXRsZSA9IHRoaXMuZ2V0VGl0bGUoKTtcbiAgICAgICAgICAgIGlmICh0aXRsZSAmJiB0aGlzLmVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHRpcCA9IHRoaXMudGlwKCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgJHRpcC5maW5kKCcudGlwc3ktaW5uZXInKVt0aGlzLm9wdGlvbnMuaHRtbCA/ICdodG1sJyA6ICd0ZXh0J10odGl0bGUpO1xuICAgICAgICAgICAgICAgICR0aXBbMF0uY2xhc3NOYW1lID0gJ3RpcHN5JzsgLy8gcmVzZXQgY2xhc3NuYW1lIGluIGNhc2Ugb2YgZHluYW1pYyBncmF2aXR5XG4gICAgICAgICAgICAgICAgJHRpcC5yZW1vdmUoKS5jc3Moe3RvcDogMCwgbGVmdDogMCwgdmlzaWJpbGl0eTogJ2hpZGRlbicsIGRpc3BsYXk6ICdibG9jayd9KS5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgcG9zID0gJC5leHRlbmQoe30sIHRoaXMuJGVsZW1lbnQub2Zmc2V0KCksIHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuJGVsZW1lbnRbMF0ub2Zmc2V0V2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy4kZWxlbWVudFswXS5vZmZzZXRIZWlnaHRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgYWN0dWFsV2lkdGggPSAkdGlwWzBdLm9mZnNldFdpZHRoLCBhY3R1YWxIZWlnaHQgPSAkdGlwWzBdLm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgICAgICB2YXIgZ3Jhdml0eSA9ICh0eXBlb2YgdGhpcy5vcHRpb25zLmdyYXZpdHkgPT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyB0aGlzLm9wdGlvbnMuZ3Jhdml0eS5jYWxsKHRoaXMuJGVsZW1lbnRbMF0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogdGhpcy5vcHRpb25zLmdyYXZpdHk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIHRwO1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoZ3Jhdml0eS5jaGFyQXQoMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbic6XG4gICAgICAgICAgICAgICAgICAgICAgICB0cCA9IHt0b3A6IHBvcy50b3AgKyBwb3MuaGVpZ2h0ICsgdGhpcy5vcHRpb25zLm9mZnNldCwgbGVmdDogcG9zLmxlZnQgKyBwb3Mud2lkdGggLyAyIC0gYWN0dWFsV2lkdGggLyAyfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRwID0ge3RvcDogcG9zLnRvcCAtIGFjdHVhbEhlaWdodCAtIHRoaXMub3B0aW9ucy5vZmZzZXQsIGxlZnQ6IHBvcy5sZWZ0ICsgcG9zLndpZHRoIC8gMiAtIGFjdHVhbFdpZHRoIC8gMn07XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICB0cCA9IHt0b3A6IHBvcy50b3AgKyBwb3MuaGVpZ2h0IC8gMiAtIGFjdHVhbEhlaWdodCAvIDIsIGxlZnQ6IHBvcy5sZWZ0IC0gYWN0dWFsV2lkdGggLSB0aGlzLm9wdGlvbnMub2Zmc2V0fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICd3JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRwID0ge3RvcDogcG9zLnRvcCArIHBvcy5oZWlnaHQgLyAyIC0gYWN0dWFsSGVpZ2h0IC8gMiwgbGVmdDogcG9zLmxlZnQgKyBwb3Mud2lkdGggKyB0aGlzLm9wdGlvbnMub2Zmc2V0fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoZ3Jhdml0eS5sZW5ndGggPT0gMikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZ3Jhdml0eS5jaGFyQXQoMSkgPT0gJ3cnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cC5sZWZ0ID0gcG9zLmxlZnQgKyBwb3Mud2lkdGggLyAyIC0gMTU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cC5sZWZ0ID0gcG9zLmxlZnQgKyBwb3Mud2lkdGggLyAyIC0gYWN0dWFsV2lkdGggKyAxNTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAkdGlwLmNzcyh0cCkuYWRkQ2xhc3MoJ3RpcHN5LScgKyBncmF2aXR5KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmZhZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgJHRpcC5zdG9wKCkuY3NzKHtvcGFjaXR5OiAwLCBkaXNwbGF5OiAnYmxvY2snLCB2aXNpYmlsaXR5OiAndmlzaWJsZSd9KS5hbmltYXRlKHtvcGFjaXR5OiB0aGlzLm9wdGlvbnMub3BhY2l0eX0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICR0aXAuY3NzKHt2aXNpYmlsaXR5OiAndmlzaWJsZScsIG9wYWNpdHk6IHRoaXMub3B0aW9ucy5vcGFjaXR5fSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgaGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmZhZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRpcCgpLnN0b3AoKS5mYWRlT3V0KGZ1bmN0aW9uKCkgeyAkKHRoaXMpLnJlbW92ZSgpOyB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aXAoKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXG4gICAgICAgIGdldFRpdGxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0aXRsZSwgJGUgPSB0aGlzLiRlbGVtZW50LCBvID0gdGhpcy5vcHRpb25zO1xuICAgICAgICAgICAgZml4VGl0bGUoJGUpO1xuICAgICAgICAgICAgdmFyIHRpdGxlLCBvID0gdGhpcy5vcHRpb25zO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBvLnRpdGxlID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgdGl0bGUgPSAkZS5hdHRyKG8udGl0bGUgPT0gJ3RpdGxlJyA/ICdvcmlnaW5hbC10aXRsZScgOiBvLnRpdGxlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG8udGl0bGUgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHRpdGxlID0gby50aXRsZS5jYWxsKCRlWzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRpdGxlID0gKCcnICsgdGl0bGUpLnJlcGxhY2UoLyheXFxzKnxcXHMqJCkvLCBcIlwiKTtcbiAgICAgICAgICAgIHJldHVybiB0aXRsZSB8fCBvLmZhbGxiYWNrO1xuICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgdGlwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy4kdGlwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kdGlwID0gJCgnPGRpdiBjbGFzcz1cInRpcHN5XCI+PC9kaXY+JykuaHRtbCgnPGRpdiBjbGFzcz1cInRpcHN5LWFycm93XCI+PC9kaXY+PGRpdiBjbGFzcz1cInRpcHN5LWlubmVyXCIvPjwvZGl2PicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuJHRpcDtcbiAgICAgICAgfSxcbiAgICAgICAgXG4gICAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy4kZWxlbWVudFswXS5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy4kZWxlbWVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXG4gICAgICAgIGVuYWJsZTogZnVuY3Rpb24oKSB7IHRoaXMuZW5hYmxlZCA9IHRydWU7IH0sXG4gICAgICAgIGRpc2FibGU6IGZ1bmN0aW9uKCkgeyB0aGlzLmVuYWJsZWQgPSBmYWxzZTsgfSxcbiAgICAgICAgdG9nZ2xlRW5hYmxlZDogZnVuY3Rpb24oKSB7IHRoaXMuZW5hYmxlZCA9ICF0aGlzLmVuYWJsZWQ7IH1cbiAgICB9O1xuICAgIFxuICAgICQuZm4udGlwc3kgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIFxuICAgICAgICBpZiAob3B0aW9ucyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YSgndGlwc3knKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucyA9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YSgndGlwc3knKVtvcHRpb25zXSgpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBvcHRpb25zID0gJC5leHRlbmQoe30sICQuZm4udGlwc3kuZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgICAgICBcbiAgICAgICAgZnVuY3Rpb24gZ2V0KGVsZSkge1xuICAgICAgICAgICAgdmFyIHRpcHN5ID0gJC5kYXRhKGVsZSwgJ3RpcHN5Jyk7XG4gICAgICAgICAgICBpZiAoIXRpcHN5KSB7XG4gICAgICAgICAgICAgICAgdGlwc3kgPSBuZXcgVGlwc3koZWxlLCAkLmZuLnRpcHN5LmVsZW1lbnRPcHRpb25zKGVsZSwgb3B0aW9ucykpO1xuICAgICAgICAgICAgICAgICQuZGF0YShlbGUsICd0aXBzeScsIHRpcHN5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aXBzeTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgZnVuY3Rpb24gZW50ZXIoKSB7XG4gICAgICAgICAgICB2YXIgdGlwc3kgPSBnZXQodGhpcyk7XG4gICAgICAgICAgICB0aXBzeS5ob3ZlclN0YXRlID0gJ2luJztcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmRlbGF5SW4gPT0gMCkge1xuICAgICAgICAgICAgICAgIHRpcHN5LnNob3coKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgaWYgKHRpcHN5LmhvdmVyU3RhdGUgPT0gJ2luJykgdGlwc3kuc2hvdygpOyB9LCBvcHRpb25zLmRlbGF5SW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgZnVuY3Rpb24gbGVhdmUoKSB7XG4gICAgICAgICAgICB2YXIgdGlwc3kgPSBnZXQodGhpcyk7XG4gICAgICAgICAgICB0aXBzeS5ob3ZlclN0YXRlID0gJ291dCc7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5kZWxheU91dCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgdGlwc3kuaGlkZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBpZiAodGlwc3kuaG92ZXJTdGF0ZSA9PSAnb3V0JykgdGlwc3kuaGlkZSgpOyB9LCBvcHRpb25zLmRlbGF5T3V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIGlmICghb3B0aW9ucy5saXZlKSB0aGlzLmVhY2goZnVuY3Rpb24oKSB7IGdldCh0aGlzKTsgfSk7XG4gICAgICAgIFxuICAgICAgICBpZiAob3B0aW9ucy50cmlnZ2VyICE9ICdtYW51YWwnKSB7XG4gICAgICAgICAgICB2YXIgYmluZGVyICAgPSBvcHRpb25zLmxpdmUgPyAnbGl2ZScgOiAnYmluZCcsXG4gICAgICAgICAgICAgICAgZXZlbnRJbiAgPSBvcHRpb25zLnRyaWdnZXIgPT0gJ2hvdmVyJyA/ICdtb3VzZWVudGVyJyA6ICdmb2N1cycsXG4gICAgICAgICAgICAgICAgZXZlbnRPdXQgPSBvcHRpb25zLnRyaWdnZXIgPT0gJ2hvdmVyJyA/ICdtb3VzZWxlYXZlJyA6ICdibHVyJztcbiAgICAgICAgICAgIHRoaXNbYmluZGVyXShldmVudEluLCBlbnRlcilbYmluZGVyXShldmVudE91dCwgbGVhdmUpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgXG4gICAgfTtcbiAgICBcbiAgICAkLmZuLnRpcHN5LmRlZmF1bHRzID0ge1xuICAgICAgICBkZWxheUluOiAwLFxuICAgICAgICBkZWxheU91dDogMCxcbiAgICAgICAgZmFkZTogZmFsc2UsXG4gICAgICAgIGZhbGxiYWNrOiAnJyxcbiAgICAgICAgZ3Jhdml0eTogJ24nLFxuICAgICAgICBodG1sOiBmYWxzZSxcbiAgICAgICAgbGl2ZTogZmFsc2UsXG4gICAgICAgIG9mZnNldDogMCxcbiAgICAgICAgb3BhY2l0eTogMC44LFxuICAgICAgICB0aXRsZTogJ3RpdGxlJyxcbiAgICAgICAgdHJpZ2dlcjogJ2hvdmVyJ1xuICAgIH07XG4gICAgXG4gICAgLy8gT3ZlcndyaXRlIHRoaXMgbWV0aG9kIHRvIHByb3ZpZGUgb3B0aW9ucyBvbiBhIHBlci1lbGVtZW50IGJhc2lzLlxuICAgIC8vIEZvciBleGFtcGxlLCB5b3UgY291bGQgc3RvcmUgdGhlIGdyYXZpdHkgaW4gYSAndGlwc3ktZ3Jhdml0eScgYXR0cmlidXRlOlxuICAgIC8vIHJldHVybiAkLmV4dGVuZCh7fSwgb3B0aW9ucywge2dyYXZpdHk6ICQoZWxlKS5hdHRyKCd0aXBzeS1ncmF2aXR5JykgfHwgJ24nIH0pO1xuICAgIC8vIChyZW1lbWJlciAtIGRvIG5vdCBtb2RpZnkgJ29wdGlvbnMnIGluIHBsYWNlISlcbiAgICAkLmZuLnRpcHN5LmVsZW1lbnRPcHRpb25zID0gZnVuY3Rpb24oZWxlLCBvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiAkLm1ldGFkYXRhID8gJC5leHRlbmQoe30sIG9wdGlvbnMsICQoZWxlKS5tZXRhZGF0YSgpKSA6IG9wdGlvbnM7XG4gICAgfTtcbiAgICBcbiAgICAkLmZuLnRpcHN5LmF1dG9OUyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJCh0aGlzKS5vZmZzZXQoKS50b3AgPiAoJChkb2N1bWVudCkuc2Nyb2xsVG9wKCkgKyAkKHdpbmRvdykuaGVpZ2h0KCkgLyAyKSA/ICdzJyA6ICduJztcbiAgICB9O1xuICAgIFxuICAgICQuZm4udGlwc3kuYXV0b1dFID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkKHRoaXMpLm9mZnNldCgpLmxlZnQgPiAoJChkb2N1bWVudCkuc2Nyb2xsTGVmdCgpICsgJCh3aW5kb3cpLndpZHRoKCkgLyAyKSA/ICdlJyA6ICd3JztcbiAgICB9O1xuICAgIFxufSkoalF1ZXJ5KTtcbiJdfQ==
