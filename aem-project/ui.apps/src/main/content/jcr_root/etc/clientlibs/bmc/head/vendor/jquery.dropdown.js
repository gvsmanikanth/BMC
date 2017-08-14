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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5LmRyb3Bkb3duLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qXG4gKiBqUXVlcnkgRHJvcGRvd246IEEgc2ltcGxlIGRyb3Bkb3duIHBsdWdpblxuICpcbiAqIENvbnRyaWJ1dGU6IGh0dHBzOi8vZ2l0aHViLmNvbS9jbGF2aXNrYS9qcXVlcnktZHJvcGRvd25cbiAqXG4gKiBAbGljZW5zZTogTUlUIGxpY2Vuc2U6IGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcbiAqXG4gKi9cbmlmIChqUXVlcnkpIChmdW5jdGlvbiAoJCkge1xuXG4gICAgJC5leHRlbmQoJC5mbiwge1xuICAgICAgICBqcURyb3Bkb3duOiBmdW5jdGlvbiAobWV0aG9kLCBkYXRhKSB7XG5cbiAgICAgICAgICAgIHN3aXRjaCAobWV0aG9kKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnc2hvdyc6XG4gICAgICAgICAgICAgICAgICAgIHNob3cobnVsbCwgJCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkKHRoaXMpO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2hpZGUnOlxuICAgICAgICAgICAgICAgICAgICBoaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkKHRoaXMpO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2F0dGFjaCc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkKHRoaXMpLmF0dHIoJ2RhdGEtanEtZHJvcGRvd24nLCBkYXRhKTtcbiAgICAgICAgICAgICAgICBjYXNlICdkZXRhY2gnOlxuICAgICAgICAgICAgICAgICAgICBoaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkKHRoaXMpLnJlbW92ZUF0dHIoJ2RhdGEtanEtZHJvcGRvd24nKTtcbiAgICAgICAgICAgICAgICBjYXNlICdkaXNhYmxlJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQodGhpcykuYWRkQ2xhc3MoJ2pxLWRyb3Bkb3duLWRpc2FibGVkJyk7XG4gICAgICAgICAgICAgICAgY2FzZSAnZW5hYmxlJzpcbiAgICAgICAgICAgICAgICAgICAgaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJCh0aGlzKS5yZW1vdmVDbGFzcygnanEtZHJvcGRvd24tZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBzaG93KGV2ZW50LCBvYmplY3QpIHtcblxuICAgICAgICB2YXIgdHJpZ2dlciA9IGV2ZW50ID8gJCh0aGlzKSA6IG9iamVjdCxcbiAgICAgICAgICAgIGpxRHJvcGRvd24gPSAkKHRyaWdnZXIuYXR0cignZGF0YS1qcS1kcm9wZG93bicpKSxcbiAgICAgICAgICAgIGlzT3BlbiA9IHRyaWdnZXIuaGFzQ2xhc3MoJ2pxLWRyb3Bkb3duLW9wZW4nKTtcblxuICAgICAgICAvLyBJbiBzb21lIGNhc2VzIHdlIGRvbid0IHdhbnQgdG8gc2hvdyBpdFxuICAgICAgICBpZiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmICgkKGV2ZW50LnRhcmdldCkuaGFzQ2xhc3MoJ2pxLWRyb3Bkb3duLWlnbm9yZScpKSByZXR1cm47XG5cbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0cmlnZ2VyICE9PSBvYmplY3QudGFyZ2V0ICYmICQob2JqZWN0LnRhcmdldCkuaGFzQ2xhc3MoJ2pxLWRyb3Bkb3duLWlnbm9yZScpKSByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaGlkZSgpO1xuXG4gICAgICAgIGlmIChpc09wZW4gfHwgdHJpZ2dlci5oYXNDbGFzcygnanEtZHJvcGRvd24tZGlzYWJsZWQnKSkgcmV0dXJuO1xuXG4gICAgICAgIC8vIFNob3cgaXRcbiAgICAgICAgdHJpZ2dlci5hZGRDbGFzcygnanEtZHJvcGRvd24tb3BlbicpO1xuICAgICAgICBqcURyb3Bkb3duXG4gICAgICAgICAgICAuZGF0YSgnanEtZHJvcGRvd24tdHJpZ2dlcicsIHRyaWdnZXIpXG4gICAgICAgICAgICAuc2hvdygpO1xuXG4gICAgICAgIC8vIFBvc2l0aW9uIGl0XG4gICAgICAgIHBvc2l0aW9uKCk7XG5cbiAgICAgICAgLy8gVHJpZ2dlciB0aGUgc2hvdyBjYWxsYmFja1xuICAgICAgICBqcURyb3Bkb3duXG4gICAgICAgICAgICAudHJpZ2dlcignc2hvdycsIHtcbiAgICAgICAgICAgICAgICBqcURyb3Bkb3duOiBqcURyb3Bkb3duLFxuICAgICAgICAgICAgICAgIHRyaWdnZXI6IHRyaWdnZXJcbiAgICAgICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGlkZShldmVudCkge1xuXG4gICAgICAgIC8vIEluIHNvbWUgY2FzZXMgd2UgZG9uJ3QgaGlkZSB0aGVtXG4gICAgICAgIHZhciB0YXJnZXRHcm91cCA9IGV2ZW50ID8gJChldmVudC50YXJnZXQpLnBhcmVudHMoKS5hZGRCYWNrKCkgOiBudWxsO1xuXG4gICAgICAgIC8vIEFyZSB3ZSBjbGlja2luZyBhbnl3aGVyZSBpbiBhIGpxLWRyb3Bkb3duP1xuICAgICAgICBpZiAodGFyZ2V0R3JvdXAgJiYgdGFyZ2V0R3JvdXAuaXMoJy5qcS1kcm9wZG93bicpKSB7XG4gICAgICAgICAgICAvLyBJcyBpdCBhIGpxLWRyb3Bkb3duIG1lbnU/XG4gICAgICAgICAgICBpZiAodGFyZ2V0R3JvdXAuaXMoJy5qcS1kcm9wZG93bi1tZW51JykpIHtcbiAgICAgICAgICAgICAgICAvLyBEaWQgd2UgY2xpY2sgb24gYW4gb3B0aW9uPyBJZiBzbyBjbG9zZSBpdC5cbiAgICAgICAgICAgICAgICBpZiAoIXRhcmdldEdyb3VwLmlzKCdBJykpIHJldHVybjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gTm9wZSwgaXQncyBhIHBhbmVsLiBMZWF2ZSBpdCBvcGVuLlxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEhpZGUgYW55IGpxLWRyb3Bkb3duIHRoYXQgbWF5IGJlIHNob3dpbmdcbiAgICAgICAgJChkb2N1bWVudCkuZmluZCgnLmpxLWRyb3Bkb3duOnZpc2libGUnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBqcURyb3Bkb3duID0gJCh0aGlzKTtcbiAgICAgICAgICAgIGpxRHJvcGRvd25cbiAgICAgICAgICAgICAgICAuaGlkZSgpXG4gICAgICAgICAgICAgICAgLnJlbW92ZURhdGEoJ2pxLWRyb3Bkb3duLXRyaWdnZXInKVxuICAgICAgICAgICAgICAgIC50cmlnZ2VyKCdoaWRlJywgeyBqcURyb3Bkb3duOiBqcURyb3Bkb3duIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBSZW1vdmUgYWxsIGpxLWRyb3Bkb3duLW9wZW4gY2xhc3Nlc1xuICAgICAgICAkKGRvY3VtZW50KS5maW5kKCcuanEtZHJvcGRvd24tb3BlbicpLnJlbW92ZUNsYXNzKCdqcS1kcm9wZG93bi1vcGVuJyk7XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwb3NpdGlvbigpIHtcblxuICAgICAgICB2YXIganFEcm9wZG93biA9ICQoJy5qcS1kcm9wZG93bjp2aXNpYmxlJykuZXEoMCksXG4gICAgICAgICAgICB0cmlnZ2VyID0ganFEcm9wZG93bi5kYXRhKCdqcS1kcm9wZG93bi10cmlnZ2VyJyksXG4gICAgICAgICAgICBoT2Zmc2V0ID0gdHJpZ2dlciA/IHBhcnNlSW50KHRyaWdnZXIuYXR0cignZGF0YS1ob3Jpem9udGFsLW9mZnNldCcpIHx8IDAsIDEwKSA6IG51bGwsXG4gICAgICAgICAgICB2T2Zmc2V0ID0gdHJpZ2dlciA/IHBhcnNlSW50KHRyaWdnZXIuYXR0cignZGF0YS12ZXJ0aWNhbC1vZmZzZXQnKSB8fCAwLCAxMCkgOiBudWxsO1xuXG4gICAgICAgIGlmIChqcURyb3Bkb3duLmxlbmd0aCA9PT0gMCB8fCAhdHJpZ2dlcikgcmV0dXJuO1xuXG4gICAgICAgIC8vIFBvc2l0aW9uIHRoZSBqcS1kcm9wZG93biByZWxhdGl2ZS10by1wYXJlbnQuLi5cbiAgICAgICAgaWYgKGpxRHJvcGRvd24uaGFzQ2xhc3MoJ2pxLWRyb3Bkb3duLXJlbGF0aXZlJykpIHtcbiAgICAgICAgICAgIGpxRHJvcGRvd24uY3NzKHtcbiAgICAgICAgICAgICAgICBsZWZ0OiBqcURyb3Bkb3duLmhhc0NsYXNzKCdqcS1kcm9wZG93bi1hbmNob3ItcmlnaHQnKSA/XG4gICAgICAgICAgICAgICAgICAgIHRyaWdnZXIucG9zaXRpb24oKS5sZWZ0IC0gKGpxRHJvcGRvd24ub3V0ZXJXaWR0aCh0cnVlKSAtIHRyaWdnZXIub3V0ZXJXaWR0aCh0cnVlKSkgLSBwYXJzZUludCh0cmlnZ2VyLmNzcygnbWFyZ2luLXJpZ2h0JyksIDEwKSArIGhPZmZzZXQgOlxuICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyLnBvc2l0aW9uKCkubGVmdCArIHBhcnNlSW50KHRyaWdnZXIuY3NzKCdtYXJnaW4tbGVmdCcpLCAxMCkgKyBoT2Zmc2V0LFxuICAgICAgICAgICAgICAgIHRvcDogdHJpZ2dlci5wb3NpdGlvbigpLnRvcCArIHRyaWdnZXIub3V0ZXJIZWlnaHQodHJ1ZSkgLSBwYXJzZUludCh0cmlnZ2VyLmNzcygnbWFyZ2luLXRvcCcpLCAxMCkgKyB2T2Zmc2V0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIC4uLm9yIHJlbGF0aXZlIHRvIGRvY3VtZW50XG4gICAgICAgICAgICBqcURyb3Bkb3duLmNzcyh7XG4gICAgICAgICAgICAgICAgbGVmdDoganFEcm9wZG93bi5oYXNDbGFzcygnanEtZHJvcGRvd24tYW5jaG9yLXJpZ2h0JykgP1xuICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyLm9mZnNldCgpLmxlZnQgLSAoanFEcm9wZG93bi5vdXRlcldpZHRoKCkgLSB0cmlnZ2VyLm91dGVyV2lkdGgoKSkgKyBoT2Zmc2V0IDogdHJpZ2dlci5vZmZzZXQoKS5sZWZ0ICsgaE9mZnNldCxcbiAgICAgICAgICAgICAgICB0b3A6IHRyaWdnZXIub2Zmc2V0KCkudG9wICsgdHJpZ2dlci5vdXRlckhlaWdodCgpICsgdk9mZnNldFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2suanEtZHJvcGRvd24nLCAnW2RhdGEtanEtZHJvcGRvd25dJywgc2hvdyk7XG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrLmpxLWRyb3Bkb3duJywgaGlkZSk7XG4gICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBwb3NpdGlvbik7XG5cbn0pKGpRdWVyeSk7Il19
