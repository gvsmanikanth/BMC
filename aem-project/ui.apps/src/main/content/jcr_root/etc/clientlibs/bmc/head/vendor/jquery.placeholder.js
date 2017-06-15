(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*! http://mths.be/placeholder v2.0.8 by @mathias */

;(function(window, document, $) {

	// Opera Mini v7 doesn’t support placeholder although its DOM seems to indicate so
	var isOperaMini = Object.prototype.toString.call(window.operamini) == '[object OperaMini]';
	var isInputSupported = 'placeholder' in document.createElement('input') && !isOperaMini;
	var isTextareaSupported = 'placeholder' in document.createElement('textarea') && !isOperaMini;
	var prototype = $.fn;
	var valHooks = $.valHooks;
	var propHooks = $.propHooks;
	var hooks;
	var placeholder;

	if (isInputSupported && isTextareaSupported) {

		placeholder = prototype.placeholder = function() {
			return this;
		};

		placeholder.input = placeholder.textarea = true;

	} else {

		placeholder = prototype.placeholder = function() {
			var $this = this;
			$this
				.filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
				.not('.placeholder')
				.bind({
					'focus.placeholder': clearPlaceholder,
					'blur.placeholder': setPlaceholder
				})
				.data('placeholder-enabled', true)
				.trigger('blur.placeholder');
			return $this;
		};

		placeholder.input = isInputSupported;
		placeholder.textarea = isTextareaSupported;

		hooks = {
			'get': function(element) {
				var $element = $(element);

				var $passwordInput = $element.data('placeholder-password');
				if ($passwordInput) {
					return $passwordInput[0].value;
				}

				return $element.data('placeholder-enabled') && $element.hasClass('placeholder') ? '' : element.value;
			},
			'set': function(element, value) {
				var $element = $(element);

				var $passwordInput = $element.data('placeholder-password');
				if ($passwordInput) {
					return $passwordInput[0].value = value;
				}

				if (!$element.data('placeholder-enabled')) {
					return element.value = value;
				}
				if (value == '') {
					element.value = value;
					// Issue #56: Setting the placeholder causes problems if the element continues to have focus.
					if (element != safeActiveElement()) {
						// We can't use `triggerHandler` here because of dummy text/password inputs :(
						setPlaceholder.call(element);
					}
				} else if ($element.hasClass('placeholder')) {
					clearPlaceholder.call(element, true, value) || (element.value = value);
				} else {
					element.value = value;
				}
				// `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
				return $element;
			}
		};

		if (!isInputSupported) {
			valHooks.input = hooks;
			propHooks.value = hooks;
		}
		if (!isTextareaSupported) {
			valHooks.textarea = hooks;
			propHooks.value = hooks;
		}

		$(function() {
			// Look for forms
			$(document).delegate('form', 'submit.placeholder', function() {
				// Clear the placeholder values so they don't get submitted
				var $inputs = $('.placeholder', this).each(clearPlaceholder);
				setTimeout(function() {
					$inputs.each(setPlaceholder);
				}, 10);
			});
		});

		// Clear placeholder values upon page reload
		$(window).bind('beforeunload.placeholder', function() {
			$('.placeholder').each(function() {
				this.value = '';
			});
		});

	}

	function args(elem) {
		// Return an object of element attributes
		var newAttrs = {};
		var rinlinejQuery = /^jQuery\d+$/;
		$.each(elem.attributes, function(i, attr) {
			if (attr.specified && !rinlinejQuery.test(attr.name)) {
				newAttrs[attr.name] = attr.value;
			}
		});
		return newAttrs;
	}

	function clearPlaceholder(event, value) {
		var input = this;
		var $input = $(input);
		if (input.value == $input.attr('placeholder') && $input.hasClass('placeholder')) {
			if ($input.data('placeholder-password')) {
				$input = $input.hide().next().show().attr('id', $input.removeAttr('id').data('placeholder-id'));
				// If `clearPlaceholder` was called from `$.valHooks.input.set`
				if (event === true) {
					return $input[0].value = value;
				}
				$input.focus();
			} else {
				input.value = '';
				$input.removeClass('placeholder');
				input == safeActiveElement() && input.select();
			}
		}
	}

	function setPlaceholder() {
		var $replacement;
		var input = this;
		var $input = $(input);
		var id = this.id;
		if (input.value == '') {
			if (input.type == 'password') {
				if (!$input.data('placeholder-textinput')) {
					try {
						$replacement = $input.clone().attr({ 'type': 'text' });
					} catch(e) {
						$replacement = $('<input>').attr($.extend(args(this), { 'type': 'text' }));
					}
					$replacement
						.removeAttr('name')
						.data({
							'placeholder-password': $input,
							'placeholder-id': id
						})
						.bind('focus.placeholder', clearPlaceholder);
					$input
						.data({
							'placeholder-textinput': $replacement,
							'placeholder-id': id
						})
						.before($replacement);
				}
				$input = $input.removeAttr('id').hide().prev().attr('id', id).show();
				// Note: `$input[0] != input` now!
			}
			$input.addClass('placeholder');
			$input[0].value = $input.attr('placeholder');
		} else {
			$input.removeClass('placeholder');
		}
	}

	function safeActiveElement() {
		// Avoid IE9 `document.activeElement` of death
		// https://github.com/mathiasbynens/jquery-placeholder/pull/99
		try {
			return document.activeElement;
		} catch (exception) {}
	}

}(window, document, jQuery));
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5LnBsYWNlaG9sZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qISBodHRwOi8vbXRocy5iZS9wbGFjZWhvbGRlciB2Mi4wLjggYnkgQG1hdGhpYXMgKi9cblxuOyhmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50LCAkKSB7XG5cblx0Ly8gT3BlcmEgTWluaSB2NyBkb2VzbuKAmXQgc3VwcG9ydCBwbGFjZWhvbGRlciBhbHRob3VnaCBpdHMgRE9NIHNlZW1zIHRvIGluZGljYXRlIHNvXG5cdHZhciBpc09wZXJhTWluaSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh3aW5kb3cub3BlcmFtaW5pKSA9PSAnW29iamVjdCBPcGVyYU1pbmldJztcblx0dmFyIGlzSW5wdXRTdXBwb3J0ZWQgPSAncGxhY2Vob2xkZXInIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JykgJiYgIWlzT3BlcmFNaW5pO1xuXHR2YXIgaXNUZXh0YXJlYVN1cHBvcnRlZCA9ICdwbGFjZWhvbGRlcicgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKSAmJiAhaXNPcGVyYU1pbmk7XG5cdHZhciBwcm90b3R5cGUgPSAkLmZuO1xuXHR2YXIgdmFsSG9va3MgPSAkLnZhbEhvb2tzO1xuXHR2YXIgcHJvcEhvb2tzID0gJC5wcm9wSG9va3M7XG5cdHZhciBob29rcztcblx0dmFyIHBsYWNlaG9sZGVyO1xuXG5cdGlmIChpc0lucHV0U3VwcG9ydGVkICYmIGlzVGV4dGFyZWFTdXBwb3J0ZWQpIHtcblxuXHRcdHBsYWNlaG9sZGVyID0gcHJvdG90eXBlLnBsYWNlaG9sZGVyID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9O1xuXG5cdFx0cGxhY2Vob2xkZXIuaW5wdXQgPSBwbGFjZWhvbGRlci50ZXh0YXJlYSA9IHRydWU7XG5cblx0fSBlbHNlIHtcblxuXHRcdHBsYWNlaG9sZGVyID0gcHJvdG90eXBlLnBsYWNlaG9sZGVyID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJHRoaXMgPSB0aGlzO1xuXHRcdFx0JHRoaXNcblx0XHRcdFx0LmZpbHRlcigoaXNJbnB1dFN1cHBvcnRlZCA/ICd0ZXh0YXJlYScgOiAnOmlucHV0JykgKyAnW3BsYWNlaG9sZGVyXScpXG5cdFx0XHRcdC5ub3QoJy5wbGFjZWhvbGRlcicpXG5cdFx0XHRcdC5iaW5kKHtcblx0XHRcdFx0XHQnZm9jdXMucGxhY2Vob2xkZXInOiBjbGVhclBsYWNlaG9sZGVyLFxuXHRcdFx0XHRcdCdibHVyLnBsYWNlaG9sZGVyJzogc2V0UGxhY2Vob2xkZXJcblx0XHRcdFx0fSlcblx0XHRcdFx0LmRhdGEoJ3BsYWNlaG9sZGVyLWVuYWJsZWQnLCB0cnVlKVxuXHRcdFx0XHQudHJpZ2dlcignYmx1ci5wbGFjZWhvbGRlcicpO1xuXHRcdFx0cmV0dXJuICR0aGlzO1xuXHRcdH07XG5cblx0XHRwbGFjZWhvbGRlci5pbnB1dCA9IGlzSW5wdXRTdXBwb3J0ZWQ7XG5cdFx0cGxhY2Vob2xkZXIudGV4dGFyZWEgPSBpc1RleHRhcmVhU3VwcG9ydGVkO1xuXG5cdFx0aG9va3MgPSB7XG5cdFx0XHQnZ2V0JzogZnVuY3Rpb24oZWxlbWVudCkge1xuXHRcdFx0XHR2YXIgJGVsZW1lbnQgPSAkKGVsZW1lbnQpO1xuXG5cdFx0XHRcdHZhciAkcGFzc3dvcmRJbnB1dCA9ICRlbGVtZW50LmRhdGEoJ3BsYWNlaG9sZGVyLXBhc3N3b3JkJyk7XG5cdFx0XHRcdGlmICgkcGFzc3dvcmRJbnB1dCkge1xuXHRcdFx0XHRcdHJldHVybiAkcGFzc3dvcmRJbnB1dFswXS52YWx1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAkZWxlbWVudC5kYXRhKCdwbGFjZWhvbGRlci1lbmFibGVkJykgJiYgJGVsZW1lbnQuaGFzQ2xhc3MoJ3BsYWNlaG9sZGVyJykgPyAnJyA6IGVsZW1lbnQudmFsdWU7XG5cdFx0XHR9LFxuXHRcdFx0J3NldCc6IGZ1bmN0aW9uKGVsZW1lbnQsIHZhbHVlKSB7XG5cdFx0XHRcdHZhciAkZWxlbWVudCA9ICQoZWxlbWVudCk7XG5cblx0XHRcdFx0dmFyICRwYXNzd29yZElucHV0ID0gJGVsZW1lbnQuZGF0YSgncGxhY2Vob2xkZXItcGFzc3dvcmQnKTtcblx0XHRcdFx0aWYgKCRwYXNzd29yZElucHV0KSB7XG5cdFx0XHRcdFx0cmV0dXJuICRwYXNzd29yZElucHV0WzBdLnZhbHVlID0gdmFsdWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoISRlbGVtZW50LmRhdGEoJ3BsYWNlaG9sZGVyLWVuYWJsZWQnKSkge1xuXHRcdFx0XHRcdHJldHVybiBlbGVtZW50LnZhbHVlID0gdmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHZhbHVlID09ICcnKSB7XG5cdFx0XHRcdFx0ZWxlbWVudC52YWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHRcdC8vIElzc3VlICM1NjogU2V0dGluZyB0aGUgcGxhY2Vob2xkZXIgY2F1c2VzIHByb2JsZW1zIGlmIHRoZSBlbGVtZW50IGNvbnRpbnVlcyB0byBoYXZlIGZvY3VzLlxuXHRcdFx0XHRcdGlmIChlbGVtZW50ICE9IHNhZmVBY3RpdmVFbGVtZW50KCkpIHtcblx0XHRcdFx0XHRcdC8vIFdlIGNhbid0IHVzZSBgdHJpZ2dlckhhbmRsZXJgIGhlcmUgYmVjYXVzZSBvZiBkdW1teSB0ZXh0L3Bhc3N3b3JkIGlucHV0cyA6KFxuXHRcdFx0XHRcdFx0c2V0UGxhY2Vob2xkZXIuY2FsbChlbGVtZW50KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAoJGVsZW1lbnQuaGFzQ2xhc3MoJ3BsYWNlaG9sZGVyJykpIHtcblx0XHRcdFx0XHRjbGVhclBsYWNlaG9sZGVyLmNhbGwoZWxlbWVudCwgdHJ1ZSwgdmFsdWUpIHx8IChlbGVtZW50LnZhbHVlID0gdmFsdWUpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGVsZW1lbnQudmFsdWUgPSB2YWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBgc2V0YCBjYW4gbm90IHJldHVybiBgdW5kZWZpbmVkYDsgc2VlIGh0dHA6Ly9qc2FwaS5pbmZvL2pxdWVyeS8xLjcuMS92YWwjTDIzNjNcblx0XHRcdFx0cmV0dXJuICRlbGVtZW50O1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRpZiAoIWlzSW5wdXRTdXBwb3J0ZWQpIHtcblx0XHRcdHZhbEhvb2tzLmlucHV0ID0gaG9va3M7XG5cdFx0XHRwcm9wSG9va3MudmFsdWUgPSBob29rcztcblx0XHR9XG5cdFx0aWYgKCFpc1RleHRhcmVhU3VwcG9ydGVkKSB7XG5cdFx0XHR2YWxIb29rcy50ZXh0YXJlYSA9IGhvb2tzO1xuXHRcdFx0cHJvcEhvb2tzLnZhbHVlID0gaG9va3M7XG5cdFx0fVxuXG5cdFx0JChmdW5jdGlvbigpIHtcblx0XHRcdC8vIExvb2sgZm9yIGZvcm1zXG5cdFx0XHQkKGRvY3VtZW50KS5kZWxlZ2F0ZSgnZm9ybScsICdzdWJtaXQucGxhY2Vob2xkZXInLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly8gQ2xlYXIgdGhlIHBsYWNlaG9sZGVyIHZhbHVlcyBzbyB0aGV5IGRvbid0IGdldCBzdWJtaXR0ZWRcblx0XHRcdFx0dmFyICRpbnB1dHMgPSAkKCcucGxhY2Vob2xkZXInLCB0aGlzKS5lYWNoKGNsZWFyUGxhY2Vob2xkZXIpO1xuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRpbnB1dHMuZWFjaChzZXRQbGFjZWhvbGRlcik7XG5cdFx0XHRcdH0sIDEwKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0Ly8gQ2xlYXIgcGxhY2Vob2xkZXIgdmFsdWVzIHVwb24gcGFnZSByZWxvYWRcblx0XHQkKHdpbmRvdykuYmluZCgnYmVmb3JldW5sb2FkLnBsYWNlaG9sZGVyJywgZnVuY3Rpb24oKSB7XG5cdFx0XHQkKCcucGxhY2Vob2xkZXInKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aGlzLnZhbHVlID0gJyc7XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHR9XG5cblx0ZnVuY3Rpb24gYXJncyhlbGVtKSB7XG5cdFx0Ly8gUmV0dXJuIGFuIG9iamVjdCBvZiBlbGVtZW50IGF0dHJpYnV0ZXNcblx0XHR2YXIgbmV3QXR0cnMgPSB7fTtcblx0XHR2YXIgcmlubGluZWpRdWVyeSA9IC9ealF1ZXJ5XFxkKyQvO1xuXHRcdCQuZWFjaChlbGVtLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uKGksIGF0dHIpIHtcblx0XHRcdGlmIChhdHRyLnNwZWNpZmllZCAmJiAhcmlubGluZWpRdWVyeS50ZXN0KGF0dHIubmFtZSkpIHtcblx0XHRcdFx0bmV3QXR0cnNbYXR0ci5uYW1lXSA9IGF0dHIudmFsdWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIG5ld0F0dHJzO1xuXHR9XG5cblx0ZnVuY3Rpb24gY2xlYXJQbGFjZWhvbGRlcihldmVudCwgdmFsdWUpIHtcblx0XHR2YXIgaW5wdXQgPSB0aGlzO1xuXHRcdHZhciAkaW5wdXQgPSAkKGlucHV0KTtcblx0XHRpZiAoaW5wdXQudmFsdWUgPT0gJGlucHV0LmF0dHIoJ3BsYWNlaG9sZGVyJykgJiYgJGlucHV0Lmhhc0NsYXNzKCdwbGFjZWhvbGRlcicpKSB7XG5cdFx0XHRpZiAoJGlucHV0LmRhdGEoJ3BsYWNlaG9sZGVyLXBhc3N3b3JkJykpIHtcblx0XHRcdFx0JGlucHV0ID0gJGlucHV0LmhpZGUoKS5uZXh0KCkuc2hvdygpLmF0dHIoJ2lkJywgJGlucHV0LnJlbW92ZUF0dHIoJ2lkJykuZGF0YSgncGxhY2Vob2xkZXItaWQnKSk7XG5cdFx0XHRcdC8vIElmIGBjbGVhclBsYWNlaG9sZGVyYCB3YXMgY2FsbGVkIGZyb20gYCQudmFsSG9va3MuaW5wdXQuc2V0YFxuXHRcdFx0XHRpZiAoZXZlbnQgPT09IHRydWUpIHtcblx0XHRcdFx0XHRyZXR1cm4gJGlucHV0WzBdLnZhbHVlID0gdmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0JGlucHV0LmZvY3VzKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpbnB1dC52YWx1ZSA9ICcnO1xuXHRcdFx0XHQkaW5wdXQucmVtb3ZlQ2xhc3MoJ3BsYWNlaG9sZGVyJyk7XG5cdFx0XHRcdGlucHV0ID09IHNhZmVBY3RpdmVFbGVtZW50KCkgJiYgaW5wdXQuc2VsZWN0KCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gc2V0UGxhY2Vob2xkZXIoKSB7XG5cdFx0dmFyICRyZXBsYWNlbWVudDtcblx0XHR2YXIgaW5wdXQgPSB0aGlzO1xuXHRcdHZhciAkaW5wdXQgPSAkKGlucHV0KTtcblx0XHR2YXIgaWQgPSB0aGlzLmlkO1xuXHRcdGlmIChpbnB1dC52YWx1ZSA9PSAnJykge1xuXHRcdFx0aWYgKGlucHV0LnR5cGUgPT0gJ3Bhc3N3b3JkJykge1xuXHRcdFx0XHRpZiAoISRpbnB1dC5kYXRhKCdwbGFjZWhvbGRlci10ZXh0aW5wdXQnKSkge1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHQkcmVwbGFjZW1lbnQgPSAkaW5wdXQuY2xvbmUoKS5hdHRyKHsgJ3R5cGUnOiAndGV4dCcgfSk7XG5cdFx0XHRcdFx0fSBjYXRjaChlKSB7XG5cdFx0XHRcdFx0XHQkcmVwbGFjZW1lbnQgPSAkKCc8aW5wdXQ+JykuYXR0cigkLmV4dGVuZChhcmdzKHRoaXMpLCB7ICd0eXBlJzogJ3RleHQnIH0pKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0JHJlcGxhY2VtZW50XG5cdFx0XHRcdFx0XHQucmVtb3ZlQXR0cignbmFtZScpXG5cdFx0XHRcdFx0XHQuZGF0YSh7XG5cdFx0XHRcdFx0XHRcdCdwbGFjZWhvbGRlci1wYXNzd29yZCc6ICRpbnB1dCxcblx0XHRcdFx0XHRcdFx0J3BsYWNlaG9sZGVyLWlkJzogaWRcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQuYmluZCgnZm9jdXMucGxhY2Vob2xkZXInLCBjbGVhclBsYWNlaG9sZGVyKTtcblx0XHRcdFx0XHQkaW5wdXRcblx0XHRcdFx0XHRcdC5kYXRhKHtcblx0XHRcdFx0XHRcdFx0J3BsYWNlaG9sZGVyLXRleHRpbnB1dCc6ICRyZXBsYWNlbWVudCxcblx0XHRcdFx0XHRcdFx0J3BsYWNlaG9sZGVyLWlkJzogaWRcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQuYmVmb3JlKCRyZXBsYWNlbWVudCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0JGlucHV0ID0gJGlucHV0LnJlbW92ZUF0dHIoJ2lkJykuaGlkZSgpLnByZXYoKS5hdHRyKCdpZCcsIGlkKS5zaG93KCk7XG5cdFx0XHRcdC8vIE5vdGU6IGAkaW5wdXRbMF0gIT0gaW5wdXRgIG5vdyFcblx0XHRcdH1cblx0XHRcdCRpbnB1dC5hZGRDbGFzcygncGxhY2Vob2xkZXInKTtcblx0XHRcdCRpbnB1dFswXS52YWx1ZSA9ICRpbnB1dC5hdHRyKCdwbGFjZWhvbGRlcicpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkaW5wdXQucmVtb3ZlQ2xhc3MoJ3BsYWNlaG9sZGVyJyk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gc2FmZUFjdGl2ZUVsZW1lbnQoKSB7XG5cdFx0Ly8gQXZvaWQgSUU5IGBkb2N1bWVudC5hY3RpdmVFbGVtZW50YCBvZiBkZWF0aFxuXHRcdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRoaWFzYnluZW5zL2pxdWVyeS1wbGFjZWhvbGRlci9wdWxsLzk5XG5cdFx0dHJ5IHtcblx0XHRcdHJldHVybiBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXHRcdH0gY2F0Y2ggKGV4Y2VwdGlvbikge31cblx0fVxuXG59KHdpbmRvdywgZG9jdW1lbnQsIGpRdWVyeSkpOyJdfQ==
