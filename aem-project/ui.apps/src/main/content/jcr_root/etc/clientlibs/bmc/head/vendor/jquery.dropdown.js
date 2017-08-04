(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * jQuery Dropdown: A simple dropdown plugin
 *
 * Contribute: https://github.com/claviska/jquery-dropdown
 *
 * @license: MIT license: http://opensource.org/licenses/MIT
 *
 */
if (jQuery) (function ($) {

    $.extend($.fn, {
        jqDropdown: function (method, data) {

            switch (method) {
                case 'show':
                    show(null, $(this));
                    return $(this);
                case 'hide':
                    hide();
                    return $(this);
                case 'attach':
                    return $(this).attr('data-jq-dropdown', data);
                case 'detach':
                    hide();
                    return $(this).removeAttr('data-jq-dropdown');
                case 'disable':
                    return $(this).addClass('jq-dropdown-disabled');
                case 'enable':
                    hide();
                    return $(this).removeClass('jq-dropdown-disabled');
            }

        }
    });

    function show(event, object) {

        var trigger = event ? $(this) : object,
            jqDropdown = $(trigger.attr('data-jq-dropdown')),
            isOpen = trigger.hasClass('jq-dropdown-open');

        // In some cases we don't want to show it
        if (event) {
            if ($(event.target).hasClass('jq-dropdown-ignore')) return;

            event.preventDefault();
            event.stopPropagation();
        } else {
            if (trigger !== object.target && $(object.target).hasClass('jq-dropdown-ignore')) return;
        }
        hide();

        if (isOpen || trigger.hasClass('jq-dropdown-disabled')) return;

        // Show it
        trigger.addClass('jq-dropdown-open');
        jqDropdown
            .data('jq-dropdown-trigger', trigger)
            .show();

        // Position it
        position();

        // Trigger the show callback
        jqDropdown
            .trigger('show', {
                jqDropdown: jqDropdown,
                trigger: trigger
            });

    }

    function hide(event) {

        // In some cases we don't hide them
        var targetGroup = event ? $(event.target).parents().addBack() : null;

        // Are we clicking anywhere in a jq-dropdown?
        if (targetGroup && targetGroup.is('.jq-dropdown')) {
            // Is it a jq-dropdown menu?
            if (targetGroup.is('.jq-dropdown-menu')) {
                // Did we click on an option? If so close it.
                if (!targetGroup.is('A')) return;
            } else {
                // Nope, it's a panel. Leave it open.
                return;
            }
        }

        // Hide any jq-dropdown that may be showing
        $(document).find('.jq-dropdown:visible').each(function () {
            var jqDropdown = $(this);
            jqDropdown
                .hide()
                .removeData('jq-dropdown-trigger')
                .trigger('hide', { jqDropdown: jqDropdown });
        });

        // Remove all jq-dropdown-open classes
        $(document).find('.jq-dropdown-open').removeClass('jq-dropdown-open');

    }

    function position() {

        var jqDropdown = $('.jq-dropdown:visible').eq(0),
            trigger = jqDropdown.data('jq-dropdown-trigger'),
            hOffset = trigger ? parseInt(trigger.attr('data-horizontal-offset') || 0, 10) : null,
            vOffset = trigger ? parseInt(trigger.attr('data-vertical-offset') || 0, 10) : null;

        if (jqDropdown.length === 0 || !trigger) return;

        // Position the jq-dropdown relative-to-parent...
        if (jqDropdown.hasClass('jq-dropdown-relative')) {
            jqDropdown.css({
                left: jqDropdown.hasClass('jq-dropdown-anchor-right') ?
                    trigger.position().left - (jqDropdown.outerWidth(true) - trigger.outerWidth(true)) - parseInt(trigger.css('margin-right'), 10) + hOffset :
                    trigger.position().left + parseInt(trigger.css('margin-left'), 10) + hOffset,
                top: trigger.position().top + trigger.outerHeight(true) - parseInt(trigger.css('margin-top'), 10) + vOffset
            });
        } else {
            // ...or relative to document
            jqDropdown.css({
                left: jqDropdown.hasClass('jq-dropdown-anchor-right') ?
                    trigger.offset().left - (jqDropdown.outerWidth() - trigger.outerWidth()) + hOffset : trigger.offset().left + hOffset,
                top: trigger.offset().top + trigger.outerHeight() + vOffset
            });
        }
    }

    $(document).on('click.jq-dropdown', '[data-jq-dropdown]', show);
    $(document).on('click.jq-dropdown', hide);
    $(window).on('resize', position);

})(jQuery);
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5LmRyb3Bkb3duLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qXHJcbiAqIGpRdWVyeSBEcm9wZG93bjogQSBzaW1wbGUgZHJvcGRvd24gcGx1Z2luXHJcbiAqXHJcbiAqIENvbnRyaWJ1dGU6IGh0dHBzOi8vZ2l0aHViLmNvbS9jbGF2aXNrYS9qcXVlcnktZHJvcGRvd25cclxuICpcclxuICogQGxpY2Vuc2U6IE1JVCBsaWNlbnNlOiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXHJcbiAqXHJcbiAqL1xyXG5pZiAoalF1ZXJ5KSAoZnVuY3Rpb24gKCQpIHtcclxuXHJcbiAgICAkLmV4dGVuZCgkLmZuLCB7XHJcbiAgICAgICAganFEcm9wZG93bjogZnVuY3Rpb24gKG1ldGhvZCwgZGF0YSkge1xyXG5cclxuICAgICAgICAgICAgc3dpdGNoIChtZXRob2QpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3Nob3cnOlxyXG4gICAgICAgICAgICAgICAgICAgIHNob3cobnVsbCwgJCh0aGlzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQodGhpcyk7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdoaWRlJzpcclxuICAgICAgICAgICAgICAgICAgICBoaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQodGhpcyk7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdhdHRhY2gnOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkKHRoaXMpLmF0dHIoJ2RhdGEtanEtZHJvcGRvd24nLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2RldGFjaCc6XHJcbiAgICAgICAgICAgICAgICAgICAgaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkKHRoaXMpLnJlbW92ZUF0dHIoJ2RhdGEtanEtZHJvcGRvd24nKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2Rpc2FibGUnOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkKHRoaXMpLmFkZENsYXNzKCdqcS1kcm9wZG93bi1kaXNhYmxlZCcpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnZW5hYmxlJzpcclxuICAgICAgICAgICAgICAgICAgICBoaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQodGhpcykucmVtb3ZlQ2xhc3MoJ2pxLWRyb3Bkb3duLWRpc2FibGVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gc2hvdyhldmVudCwgb2JqZWN0KSB7XHJcblxyXG4gICAgICAgIHZhciB0cmlnZ2VyID0gZXZlbnQgPyAkKHRoaXMpIDogb2JqZWN0LFxyXG4gICAgICAgICAgICBqcURyb3Bkb3duID0gJCh0cmlnZ2VyLmF0dHIoJ2RhdGEtanEtZHJvcGRvd24nKSksXHJcbiAgICAgICAgICAgIGlzT3BlbiA9IHRyaWdnZXIuaGFzQ2xhc3MoJ2pxLWRyb3Bkb3duLW9wZW4nKTtcclxuXHJcbiAgICAgICAgLy8gSW4gc29tZSBjYXNlcyB3ZSBkb24ndCB3YW50IHRvIHNob3cgaXRcclxuICAgICAgICBpZiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgaWYgKCQoZXZlbnQudGFyZ2V0KS5oYXNDbGFzcygnanEtZHJvcGRvd24taWdub3JlJykpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0cmlnZ2VyICE9PSBvYmplY3QudGFyZ2V0ICYmICQob2JqZWN0LnRhcmdldCkuaGFzQ2xhc3MoJ2pxLWRyb3Bkb3duLWlnbm9yZScpKSByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGhpZGUoKTtcclxuXHJcbiAgICAgICAgaWYgKGlzT3BlbiB8fCB0cmlnZ2VyLmhhc0NsYXNzKCdqcS1kcm9wZG93bi1kaXNhYmxlZCcpKSByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIFNob3cgaXRcclxuICAgICAgICB0cmlnZ2VyLmFkZENsYXNzKCdqcS1kcm9wZG93bi1vcGVuJyk7XHJcbiAgICAgICAganFEcm9wZG93blxyXG4gICAgICAgICAgICAuZGF0YSgnanEtZHJvcGRvd24tdHJpZ2dlcicsIHRyaWdnZXIpXHJcbiAgICAgICAgICAgIC5zaG93KCk7XHJcblxyXG4gICAgICAgIC8vIFBvc2l0aW9uIGl0XHJcbiAgICAgICAgcG9zaXRpb24oKTtcclxuXHJcbiAgICAgICAgLy8gVHJpZ2dlciB0aGUgc2hvdyBjYWxsYmFja1xyXG4gICAgICAgIGpxRHJvcGRvd25cclxuICAgICAgICAgICAgLnRyaWdnZXIoJ3Nob3cnLCB7XHJcbiAgICAgICAgICAgICAgICBqcURyb3Bkb3duOiBqcURyb3Bkb3duLFxyXG4gICAgICAgICAgICAgICAgdHJpZ2dlcjogdHJpZ2dlclxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaGlkZShldmVudCkge1xyXG5cclxuICAgICAgICAvLyBJbiBzb21lIGNhc2VzIHdlIGRvbid0IGhpZGUgdGhlbVxyXG4gICAgICAgIHZhciB0YXJnZXRHcm91cCA9IGV2ZW50ID8gJChldmVudC50YXJnZXQpLnBhcmVudHMoKS5hZGRCYWNrKCkgOiBudWxsO1xyXG5cclxuICAgICAgICAvLyBBcmUgd2UgY2xpY2tpbmcgYW55d2hlcmUgaW4gYSBqcS1kcm9wZG93bj9cclxuICAgICAgICBpZiAodGFyZ2V0R3JvdXAgJiYgdGFyZ2V0R3JvdXAuaXMoJy5qcS1kcm9wZG93bicpKSB7XHJcbiAgICAgICAgICAgIC8vIElzIGl0IGEganEtZHJvcGRvd24gbWVudT9cclxuICAgICAgICAgICAgaWYgKHRhcmdldEdyb3VwLmlzKCcuanEtZHJvcGRvd24tbWVudScpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBEaWQgd2UgY2xpY2sgb24gYW4gb3B0aW9uPyBJZiBzbyBjbG9zZSBpdC5cclxuICAgICAgICAgICAgICAgIGlmICghdGFyZ2V0R3JvdXAuaXMoJ0EnKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gTm9wZSwgaXQncyBhIHBhbmVsLiBMZWF2ZSBpdCBvcGVuLlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBIaWRlIGFueSBqcS1kcm9wZG93biB0aGF0IG1heSBiZSBzaG93aW5nXHJcbiAgICAgICAgJChkb2N1bWVudCkuZmluZCgnLmpxLWRyb3Bkb3duOnZpc2libGUnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGpxRHJvcGRvd24gPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICBqcURyb3Bkb3duXHJcbiAgICAgICAgICAgICAgICAuaGlkZSgpXHJcbiAgICAgICAgICAgICAgICAucmVtb3ZlRGF0YSgnanEtZHJvcGRvd24tdHJpZ2dlcicpXHJcbiAgICAgICAgICAgICAgICAudHJpZ2dlcignaGlkZScsIHsganFEcm9wZG93bjoganFEcm9wZG93biB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gUmVtb3ZlIGFsbCBqcS1kcm9wZG93bi1vcGVuIGNsYXNzZXNcclxuICAgICAgICAkKGRvY3VtZW50KS5maW5kKCcuanEtZHJvcGRvd24tb3BlbicpLnJlbW92ZUNsYXNzKCdqcS1kcm9wZG93bi1vcGVuJyk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHBvc2l0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIganFEcm9wZG93biA9ICQoJy5qcS1kcm9wZG93bjp2aXNpYmxlJykuZXEoMCksXHJcbiAgICAgICAgICAgIHRyaWdnZXIgPSBqcURyb3Bkb3duLmRhdGEoJ2pxLWRyb3Bkb3duLXRyaWdnZXInKSxcclxuICAgICAgICAgICAgaE9mZnNldCA9IHRyaWdnZXIgPyBwYXJzZUludCh0cmlnZ2VyLmF0dHIoJ2RhdGEtaG9yaXpvbnRhbC1vZmZzZXQnKSB8fCAwLCAxMCkgOiBudWxsLFxyXG4gICAgICAgICAgICB2T2Zmc2V0ID0gdHJpZ2dlciA/IHBhcnNlSW50KHRyaWdnZXIuYXR0cignZGF0YS12ZXJ0aWNhbC1vZmZzZXQnKSB8fCAwLCAxMCkgOiBudWxsO1xyXG5cclxuICAgICAgICBpZiAoanFEcm9wZG93bi5sZW5ndGggPT09IDAgfHwgIXRyaWdnZXIpIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gUG9zaXRpb24gdGhlIGpxLWRyb3Bkb3duIHJlbGF0aXZlLXRvLXBhcmVudC4uLlxyXG4gICAgICAgIGlmIChqcURyb3Bkb3duLmhhc0NsYXNzKCdqcS1kcm9wZG93bi1yZWxhdGl2ZScpKSB7XHJcbiAgICAgICAgICAgIGpxRHJvcGRvd24uY3NzKHtcclxuICAgICAgICAgICAgICAgIGxlZnQ6IGpxRHJvcGRvd24uaGFzQ2xhc3MoJ2pxLWRyb3Bkb3duLWFuY2hvci1yaWdodCcpID9cclxuICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyLnBvc2l0aW9uKCkubGVmdCAtIChqcURyb3Bkb3duLm91dGVyV2lkdGgodHJ1ZSkgLSB0cmlnZ2VyLm91dGVyV2lkdGgodHJ1ZSkpIC0gcGFyc2VJbnQodHJpZ2dlci5jc3MoJ21hcmdpbi1yaWdodCcpLCAxMCkgKyBoT2Zmc2V0IDpcclxuICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyLnBvc2l0aW9uKCkubGVmdCArIHBhcnNlSW50KHRyaWdnZXIuY3NzKCdtYXJnaW4tbGVmdCcpLCAxMCkgKyBoT2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgdG9wOiB0cmlnZ2VyLnBvc2l0aW9uKCkudG9wICsgdHJpZ2dlci5vdXRlckhlaWdodCh0cnVlKSAtIHBhcnNlSW50KHRyaWdnZXIuY3NzKCdtYXJnaW4tdG9wJyksIDEwKSArIHZPZmZzZXRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gLi4ub3IgcmVsYXRpdmUgdG8gZG9jdW1lbnRcclxuICAgICAgICAgICAganFEcm9wZG93bi5jc3Moe1xyXG4gICAgICAgICAgICAgICAgbGVmdDoganFEcm9wZG93bi5oYXNDbGFzcygnanEtZHJvcGRvd24tYW5jaG9yLXJpZ2h0JykgP1xyXG4gICAgICAgICAgICAgICAgICAgIHRyaWdnZXIub2Zmc2V0KCkubGVmdCAtIChqcURyb3Bkb3duLm91dGVyV2lkdGgoKSAtIHRyaWdnZXIub3V0ZXJXaWR0aCgpKSArIGhPZmZzZXQgOiB0cmlnZ2VyLm9mZnNldCgpLmxlZnQgKyBoT2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgdG9wOiB0cmlnZ2VyLm9mZnNldCgpLnRvcCArIHRyaWdnZXIub3V0ZXJIZWlnaHQoKSArIHZPZmZzZXRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljay5qcS1kcm9wZG93bicsICdbZGF0YS1qcS1kcm9wZG93bl0nLCBzaG93KTtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljay5qcS1kcm9wZG93bicsIGhpZGUpO1xyXG4gICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBwb3NpdGlvbik7XHJcblxyXG59KShqUXVlcnkpOyJdfQ==
