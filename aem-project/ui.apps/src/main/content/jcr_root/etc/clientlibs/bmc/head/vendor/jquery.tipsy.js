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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5LnRpcHN5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gdGlwc3ksIGZhY2Vib29rIHN0eWxlIHRvb2x0aXBzIGZvciBqcXVlcnlcclxuLy8gdmVyc2lvbiAxLjAuMGFcclxuLy8gKGMpIDIwMDgtMjAxMCBqYXNvbiBmcmFtZSBbamFzb25Ab25laGFja29yYW5vdGhlci5jb21dXHJcbi8vIHJlbGVhdGVkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxyXG5cclxuKGZ1bmN0aW9uKCQpIHtcclxuICAgIFxyXG4gICAgZnVuY3Rpb24gZml4VGl0bGUoJGVsZSkge1xyXG4gICAgICAgIGlmICgkZWxlLmF0dHIoJ3RpdGxlJykgfHwgdHlwZW9mKCRlbGUuYXR0cignb3JpZ2luYWwtdGl0bGUnKSkgIT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgJGVsZS5hdHRyKCdvcmlnaW5hbC10aXRsZScsICRlbGUuYXR0cigndGl0bGUnKSB8fCAnJykucmVtb3ZlQXR0cigndGl0bGUnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIFRpcHN5KGVsZW1lbnQsIG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLiRlbGVtZW50ID0gJChlbGVtZW50KTtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xyXG4gICAgICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgZml4VGl0bGUodGhpcy4kZWxlbWVudCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIFRpcHN5LnByb3RvdHlwZSA9IHtcclxuICAgICAgICBzaG93OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHRpdGxlID0gdGhpcy5nZXRUaXRsZSgpO1xyXG4gICAgICAgICAgICBpZiAodGl0bGUgJiYgdGhpcy5lbmFibGVkKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgJHRpcCA9IHRoaXMudGlwKCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICR0aXAuZmluZCgnLnRpcHN5LWlubmVyJylbdGhpcy5vcHRpb25zLmh0bWwgPyAnaHRtbCcgOiAndGV4dCddKHRpdGxlKTtcclxuICAgICAgICAgICAgICAgICR0aXBbMF0uY2xhc3NOYW1lID0gJ3RpcHN5JzsgLy8gcmVzZXQgY2xhc3NuYW1lIGluIGNhc2Ugb2YgZHluYW1pYyBncmF2aXR5XHJcbiAgICAgICAgICAgICAgICAkdGlwLnJlbW92ZSgpLmNzcyh7dG9wOiAwLCBsZWZ0OiAwLCB2aXNpYmlsaXR5OiAnaGlkZGVuJywgZGlzcGxheTogJ2Jsb2NrJ30pLmFwcGVuZFRvKGRvY3VtZW50LmJvZHkpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB2YXIgcG9zID0gJC5leHRlbmQoe30sIHRoaXMuJGVsZW1lbnQub2Zmc2V0KCksIHtcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy4kZWxlbWVudFswXS5vZmZzZXRXaWR0aCxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuJGVsZW1lbnRbMF0ub2Zmc2V0SGVpZ2h0XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmFyIGFjdHVhbFdpZHRoID0gJHRpcFswXS5vZmZzZXRXaWR0aCwgYWN0dWFsSGVpZ2h0ID0gJHRpcFswXS5vZmZzZXRIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICB2YXIgZ3Jhdml0eSA9ICh0eXBlb2YgdGhpcy5vcHRpb25zLmdyYXZpdHkgPT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHRoaXMub3B0aW9ucy5ncmF2aXR5LmNhbGwodGhpcy4kZWxlbWVudFswXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHRoaXMub3B0aW9ucy5ncmF2aXR5O1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB2YXIgdHA7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGdyYXZpdHkuY2hhckF0KDApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRwID0ge3RvcDogcG9zLnRvcCArIHBvcy5oZWlnaHQgKyB0aGlzLm9wdGlvbnMub2Zmc2V0LCBsZWZ0OiBwb3MubGVmdCArIHBvcy53aWR0aCAvIDIgLSBhY3R1YWxXaWR0aCAvIDJ9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdzJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHAgPSB7dG9wOiBwb3MudG9wIC0gYWN0dWFsSGVpZ2h0IC0gdGhpcy5vcHRpb25zLm9mZnNldCwgbGVmdDogcG9zLmxlZnQgKyBwb3Mud2lkdGggLyAyIC0gYWN0dWFsV2lkdGggLyAyfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRwID0ge3RvcDogcG9zLnRvcCArIHBvcy5oZWlnaHQgLyAyIC0gYWN0dWFsSGVpZ2h0IC8gMiwgbGVmdDogcG9zLmxlZnQgLSBhY3R1YWxXaWR0aCAtIHRoaXMub3B0aW9ucy5vZmZzZXR9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICd3JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHAgPSB7dG9wOiBwb3MudG9wICsgcG9zLmhlaWdodCAvIDIgLSBhY3R1YWxIZWlnaHQgLyAyLCBsZWZ0OiBwb3MubGVmdCArIHBvcy53aWR0aCArIHRoaXMub3B0aW9ucy5vZmZzZXR9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKGdyYXZpdHkubGVuZ3RoID09IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZ3Jhdml0eS5jaGFyQXQoMSkgPT0gJ3cnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRwLmxlZnQgPSBwb3MubGVmdCArIHBvcy53aWR0aCAvIDIgLSAxNTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cC5sZWZ0ID0gcG9zLmxlZnQgKyBwb3Mud2lkdGggLyAyIC0gYWN0dWFsV2lkdGggKyAxNTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICR0aXAuY3NzKHRwKS5hZGRDbGFzcygndGlwc3ktJyArIGdyYXZpdHkpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmZhZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkdGlwLnN0b3AoKS5jc3Moe29wYWNpdHk6IDAsIGRpc3BsYXk6ICdibG9jaycsIHZpc2liaWxpdHk6ICd2aXNpYmxlJ30pLmFuaW1hdGUoe29wYWNpdHk6IHRoaXMub3B0aW9ucy5vcGFjaXR5fSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICR0aXAuY3NzKHt2aXNpYmlsaXR5OiAndmlzaWJsZScsIG9wYWNpdHk6IHRoaXMub3B0aW9ucy5vcGFjaXR5fSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIFxyXG4gICAgICAgIGhpZGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmZhZGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGlwKCkuc3RvcCgpLmZhZGVPdXQoZnVuY3Rpb24oKSB7ICQodGhpcykucmVtb3ZlKCk7IH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aXAoKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXHJcbiAgICAgICAgZ2V0VGl0bGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgdGl0bGUsICRlID0gdGhpcy4kZWxlbWVudCwgbyA9IHRoaXMub3B0aW9ucztcclxuICAgICAgICAgICAgZml4VGl0bGUoJGUpO1xyXG4gICAgICAgICAgICB2YXIgdGl0bGUsIG8gPSB0aGlzLm9wdGlvbnM7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygby50aXRsZSA9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgdGl0bGUgPSAkZS5hdHRyKG8udGl0bGUgPT0gJ3RpdGxlJyA/ICdvcmlnaW5hbC10aXRsZScgOiBvLnRpdGxlKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygby50aXRsZSA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZSA9IG8udGl0bGUuY2FsbCgkZVswXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGl0bGUgPSAoJycgKyB0aXRsZSkucmVwbGFjZSgvKF5cXHMqfFxccyokKS8sIFwiXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGl0bGUgfHwgby5mYWxsYmFjaztcclxuICAgICAgICB9LFxyXG4gICAgICAgIFxyXG4gICAgICAgIHRpcDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy4kdGlwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiR0aXAgPSAkKCc8ZGl2IGNsYXNzPVwidGlwc3lcIj48L2Rpdj4nKS5odG1sKCc8ZGl2IGNsYXNzPVwidGlwc3ktYXJyb3dcIj48L2Rpdj48ZGl2IGNsYXNzPVwidGlwc3ktaW5uZXJcIi8+PC9kaXY+Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuJHRpcDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIFxyXG4gICAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLiRlbGVtZW50WzBdLnBhcmVudE5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kZWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBcclxuICAgICAgICBlbmFibGU6IGZ1bmN0aW9uKCkgeyB0aGlzLmVuYWJsZWQgPSB0cnVlOyB9LFxyXG4gICAgICAgIGRpc2FibGU6IGZ1bmN0aW9uKCkgeyB0aGlzLmVuYWJsZWQgPSBmYWxzZTsgfSxcclxuICAgICAgICB0b2dnbGVFbmFibGVkOiBmdW5jdGlvbigpIHsgdGhpcy5lbmFibGVkID0gIXRoaXMuZW5hYmxlZDsgfVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgJC5mbi50aXBzeSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuICAgICAgICBcclxuICAgICAgICBpZiAob3B0aW9ucyA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhKCd0aXBzeScpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMgPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YSgndGlwc3knKVtvcHRpb25zXSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBvcHRpb25zID0gJC5leHRlbmQoe30sICQuZm4udGlwc3kuZGVmYXVsdHMsIG9wdGlvbnMpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGdldChlbGUpIHtcclxuICAgICAgICAgICAgdmFyIHRpcHN5ID0gJC5kYXRhKGVsZSwgJ3RpcHN5Jyk7XHJcbiAgICAgICAgICAgIGlmICghdGlwc3kpIHtcclxuICAgICAgICAgICAgICAgIHRpcHN5ID0gbmV3IFRpcHN5KGVsZSwgJC5mbi50aXBzeS5lbGVtZW50T3B0aW9ucyhlbGUsIG9wdGlvbnMpKTtcclxuICAgICAgICAgICAgICAgICQuZGF0YShlbGUsICd0aXBzeScsIHRpcHN5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGlwc3k7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGVudGVyKCkge1xyXG4gICAgICAgICAgICB2YXIgdGlwc3kgPSBnZXQodGhpcyk7XHJcbiAgICAgICAgICAgIHRpcHN5LmhvdmVyU3RhdGUgPSAnaW4nO1xyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5kZWxheUluID09IDApIHtcclxuICAgICAgICAgICAgICAgIHRpcHN5LnNob3coKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGlmICh0aXBzeS5ob3ZlclN0YXRlID09ICdpbicpIHRpcHN5LnNob3coKTsgfSwgb3B0aW9ucy5kZWxheUluKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gbGVhdmUoKSB7XHJcbiAgICAgICAgICAgIHZhciB0aXBzeSA9IGdldCh0aGlzKTtcclxuICAgICAgICAgICAgdGlwc3kuaG92ZXJTdGF0ZSA9ICdvdXQnO1xyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5kZWxheU91dCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aXBzeS5oaWRlKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBpZiAodGlwc3kuaG92ZXJTdGF0ZSA9PSAnb3V0JykgdGlwc3kuaGlkZSgpOyB9LCBvcHRpb25zLmRlbGF5T3V0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKCFvcHRpb25zLmxpdmUpIHRoaXMuZWFjaChmdW5jdGlvbigpIHsgZ2V0KHRoaXMpOyB9KTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAob3B0aW9ucy50cmlnZ2VyICE9ICdtYW51YWwnKSB7XHJcbiAgICAgICAgICAgIHZhciBiaW5kZXIgICA9IG9wdGlvbnMubGl2ZSA/ICdsaXZlJyA6ICdiaW5kJyxcclxuICAgICAgICAgICAgICAgIGV2ZW50SW4gID0gb3B0aW9ucy50cmlnZ2VyID09ICdob3ZlcicgPyAnbW91c2VlbnRlcicgOiAnZm9jdXMnLFxyXG4gICAgICAgICAgICAgICAgZXZlbnRPdXQgPSBvcHRpb25zLnRyaWdnZXIgPT0gJ2hvdmVyJyA/ICdtb3VzZWxlYXZlJyA6ICdibHVyJztcclxuICAgICAgICAgICAgdGhpc1tiaW5kZXJdKGV2ZW50SW4sIGVudGVyKVtiaW5kZXJdKGV2ZW50T3V0LCBsZWF2ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIFxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgJC5mbi50aXBzeS5kZWZhdWx0cyA9IHtcclxuICAgICAgICBkZWxheUluOiAwLFxyXG4gICAgICAgIGRlbGF5T3V0OiAwLFxyXG4gICAgICAgIGZhZGU6IGZhbHNlLFxyXG4gICAgICAgIGZhbGxiYWNrOiAnJyxcclxuICAgICAgICBncmF2aXR5OiAnbicsXHJcbiAgICAgICAgaHRtbDogZmFsc2UsXHJcbiAgICAgICAgbGl2ZTogZmFsc2UsXHJcbiAgICAgICAgb2Zmc2V0OiAwLFxyXG4gICAgICAgIG9wYWNpdHk6IDAuOCxcclxuICAgICAgICB0aXRsZTogJ3RpdGxlJyxcclxuICAgICAgICB0cmlnZ2VyOiAnaG92ZXInXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICAvLyBPdmVyd3JpdGUgdGhpcyBtZXRob2QgdG8gcHJvdmlkZSBvcHRpb25zIG9uIGEgcGVyLWVsZW1lbnQgYmFzaXMuXHJcbiAgICAvLyBGb3IgZXhhbXBsZSwgeW91IGNvdWxkIHN0b3JlIHRoZSBncmF2aXR5IGluIGEgJ3RpcHN5LWdyYXZpdHknIGF0dHJpYnV0ZTpcclxuICAgIC8vIHJldHVybiAkLmV4dGVuZCh7fSwgb3B0aW9ucywge2dyYXZpdHk6ICQoZWxlKS5hdHRyKCd0aXBzeS1ncmF2aXR5JykgfHwgJ24nIH0pO1xyXG4gICAgLy8gKHJlbWVtYmVyIC0gZG8gbm90IG1vZGlmeSAnb3B0aW9ucycgaW4gcGxhY2UhKVxyXG4gICAgJC5mbi50aXBzeS5lbGVtZW50T3B0aW9ucyA9IGZ1bmN0aW9uKGVsZSwgb3B0aW9ucykge1xyXG4gICAgICAgIHJldHVybiAkLm1ldGFkYXRhID8gJC5leHRlbmQoe30sIG9wdGlvbnMsICQoZWxlKS5tZXRhZGF0YSgpKSA6IG9wdGlvbnM7XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICAkLmZuLnRpcHN5LmF1dG9OUyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiAkKHRoaXMpLm9mZnNldCgpLnRvcCA+ICgkKGRvY3VtZW50KS5zY3JvbGxUb3AoKSArICQod2luZG93KS5oZWlnaHQoKSAvIDIpID8gJ3MnIDogJ24nO1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgJC5mbi50aXBzeS5hdXRvV0UgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gJCh0aGlzKS5vZmZzZXQoKS5sZWZ0ID4gKCQoZG9jdW1lbnQpLnNjcm9sbExlZnQoKSArICQod2luZG93KS53aWR0aCgpIC8gMikgPyAnZScgOiAndyc7XHJcbiAgICB9O1xyXG4gICAgXHJcbn0pKGpRdWVyeSk7XHJcbiJdfQ==
