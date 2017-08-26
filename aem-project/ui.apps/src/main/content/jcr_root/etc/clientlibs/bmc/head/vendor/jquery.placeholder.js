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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5LnBsYWNlaG9sZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qISBodHRwOi8vbXRocy5iZS9wbGFjZWhvbGRlciB2Mi4wLjggYnkgQG1hdGhpYXMgKi9cclxuXHJcbjsoZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCwgJCkge1xyXG5cclxuXHQvLyBPcGVyYSBNaW5pIHY3IGRvZXNu4oCZdCBzdXBwb3J0IHBsYWNlaG9sZGVyIGFsdGhvdWdoIGl0cyBET00gc2VlbXMgdG8gaW5kaWNhdGUgc29cclxuXHR2YXIgaXNPcGVyYU1pbmkgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwod2luZG93Lm9wZXJhbWluaSkgPT0gJ1tvYmplY3QgT3BlcmFNaW5pXSc7XHJcblx0dmFyIGlzSW5wdXRTdXBwb3J0ZWQgPSAncGxhY2Vob2xkZXInIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JykgJiYgIWlzT3BlcmFNaW5pO1xyXG5cdHZhciBpc1RleHRhcmVhU3VwcG9ydGVkID0gJ3BsYWNlaG9sZGVyJyBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpICYmICFpc09wZXJhTWluaTtcclxuXHR2YXIgcHJvdG90eXBlID0gJC5mbjtcclxuXHR2YXIgdmFsSG9va3MgPSAkLnZhbEhvb2tzO1xyXG5cdHZhciBwcm9wSG9va3MgPSAkLnByb3BIb29rcztcclxuXHR2YXIgaG9va3M7XHJcblx0dmFyIHBsYWNlaG9sZGVyO1xyXG5cclxuXHRpZiAoaXNJbnB1dFN1cHBvcnRlZCAmJiBpc1RleHRhcmVhU3VwcG9ydGVkKSB7XHJcblxyXG5cdFx0cGxhY2Vob2xkZXIgPSBwcm90b3R5cGUucGxhY2Vob2xkZXIgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9O1xyXG5cclxuXHRcdHBsYWNlaG9sZGVyLmlucHV0ID0gcGxhY2Vob2xkZXIudGV4dGFyZWEgPSB0cnVlO1xyXG5cclxuXHR9IGVsc2Uge1xyXG5cclxuXHRcdHBsYWNlaG9sZGVyID0gcHJvdG90eXBlLnBsYWNlaG9sZGVyID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciAkdGhpcyA9IHRoaXM7XHJcblx0XHRcdCR0aGlzXHJcblx0XHRcdFx0LmZpbHRlcigoaXNJbnB1dFN1cHBvcnRlZCA/ICd0ZXh0YXJlYScgOiAnOmlucHV0JykgKyAnW3BsYWNlaG9sZGVyXScpXHJcblx0XHRcdFx0Lm5vdCgnLnBsYWNlaG9sZGVyJylcclxuXHRcdFx0XHQuYmluZCh7XHJcblx0XHRcdFx0XHQnZm9jdXMucGxhY2Vob2xkZXInOiBjbGVhclBsYWNlaG9sZGVyLFxyXG5cdFx0XHRcdFx0J2JsdXIucGxhY2Vob2xkZXInOiBzZXRQbGFjZWhvbGRlclxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LmRhdGEoJ3BsYWNlaG9sZGVyLWVuYWJsZWQnLCB0cnVlKVxyXG5cdFx0XHRcdC50cmlnZ2VyKCdibHVyLnBsYWNlaG9sZGVyJyk7XHJcblx0XHRcdHJldHVybiAkdGhpcztcclxuXHRcdH07XHJcblxyXG5cdFx0cGxhY2Vob2xkZXIuaW5wdXQgPSBpc0lucHV0U3VwcG9ydGVkO1xyXG5cdFx0cGxhY2Vob2xkZXIudGV4dGFyZWEgPSBpc1RleHRhcmVhU3VwcG9ydGVkO1xyXG5cclxuXHRcdGhvb2tzID0ge1xyXG5cdFx0XHQnZ2V0JzogZnVuY3Rpb24oZWxlbWVudCkge1xyXG5cdFx0XHRcdHZhciAkZWxlbWVudCA9ICQoZWxlbWVudCk7XHJcblxyXG5cdFx0XHRcdHZhciAkcGFzc3dvcmRJbnB1dCA9ICRlbGVtZW50LmRhdGEoJ3BsYWNlaG9sZGVyLXBhc3N3b3JkJyk7XHJcblx0XHRcdFx0aWYgKCRwYXNzd29yZElucHV0KSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gJHBhc3N3b3JkSW5wdXRbMF0udmFsdWU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRyZXR1cm4gJGVsZW1lbnQuZGF0YSgncGxhY2Vob2xkZXItZW5hYmxlZCcpICYmICRlbGVtZW50Lmhhc0NsYXNzKCdwbGFjZWhvbGRlcicpID8gJycgOiBlbGVtZW50LnZhbHVlO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHQnc2V0JzogZnVuY3Rpb24oZWxlbWVudCwgdmFsdWUpIHtcclxuXHRcdFx0XHR2YXIgJGVsZW1lbnQgPSAkKGVsZW1lbnQpO1xyXG5cclxuXHRcdFx0XHR2YXIgJHBhc3N3b3JkSW5wdXQgPSAkZWxlbWVudC5kYXRhKCdwbGFjZWhvbGRlci1wYXNzd29yZCcpO1xyXG5cdFx0XHRcdGlmICgkcGFzc3dvcmRJbnB1dCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuICRwYXNzd29yZElucHV0WzBdLnZhbHVlID0gdmFsdWU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoISRlbGVtZW50LmRhdGEoJ3BsYWNlaG9sZGVyLWVuYWJsZWQnKSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGVsZW1lbnQudmFsdWUgPSB2YWx1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHZhbHVlID09ICcnKSB7XHJcblx0XHRcdFx0XHRlbGVtZW50LnZhbHVlID0gdmFsdWU7XHJcblx0XHRcdFx0XHQvLyBJc3N1ZSAjNTY6IFNldHRpbmcgdGhlIHBsYWNlaG9sZGVyIGNhdXNlcyBwcm9ibGVtcyBpZiB0aGUgZWxlbWVudCBjb250aW51ZXMgdG8gaGF2ZSBmb2N1cy5cclxuXHRcdFx0XHRcdGlmIChlbGVtZW50ICE9IHNhZmVBY3RpdmVFbGVtZW50KCkpIHtcclxuXHRcdFx0XHRcdFx0Ly8gV2UgY2FuJ3QgdXNlIGB0cmlnZ2VySGFuZGxlcmAgaGVyZSBiZWNhdXNlIG9mIGR1bW15IHRleHQvcGFzc3dvcmQgaW5wdXRzIDooXHJcblx0XHRcdFx0XHRcdHNldFBsYWNlaG9sZGVyLmNhbGwoZWxlbWVudCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIGlmICgkZWxlbWVudC5oYXNDbGFzcygncGxhY2Vob2xkZXInKSkge1xyXG5cdFx0XHRcdFx0Y2xlYXJQbGFjZWhvbGRlci5jYWxsKGVsZW1lbnQsIHRydWUsIHZhbHVlKSB8fCAoZWxlbWVudC52YWx1ZSA9IHZhbHVlKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0ZWxlbWVudC52YWx1ZSA9IHZhbHVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBgc2V0YCBjYW4gbm90IHJldHVybiBgdW5kZWZpbmVkYDsgc2VlIGh0dHA6Ly9qc2FwaS5pbmZvL2pxdWVyeS8xLjcuMS92YWwjTDIzNjNcclxuXHRcdFx0XHRyZXR1cm4gJGVsZW1lbnQ7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0aWYgKCFpc0lucHV0U3VwcG9ydGVkKSB7XHJcblx0XHRcdHZhbEhvb2tzLmlucHV0ID0gaG9va3M7XHJcblx0XHRcdHByb3BIb29rcy52YWx1ZSA9IGhvb2tzO1xyXG5cdFx0fVxyXG5cdFx0aWYgKCFpc1RleHRhcmVhU3VwcG9ydGVkKSB7XHJcblx0XHRcdHZhbEhvb2tzLnRleHRhcmVhID0gaG9va3M7XHJcblx0XHRcdHByb3BIb29rcy52YWx1ZSA9IGhvb2tzO1xyXG5cdFx0fVxyXG5cclxuXHRcdCQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdC8vIExvb2sgZm9yIGZvcm1zXHJcblx0XHRcdCQoZG9jdW1lbnQpLmRlbGVnYXRlKCdmb3JtJywgJ3N1Ym1pdC5wbGFjZWhvbGRlcicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdC8vIENsZWFyIHRoZSBwbGFjZWhvbGRlciB2YWx1ZXMgc28gdGhleSBkb24ndCBnZXQgc3VibWl0dGVkXHJcblx0XHRcdFx0dmFyICRpbnB1dHMgPSAkKCcucGxhY2Vob2xkZXInLCB0aGlzKS5lYWNoKGNsZWFyUGxhY2Vob2xkZXIpO1xyXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHQkaW5wdXRzLmVhY2goc2V0UGxhY2Vob2xkZXIpO1xyXG5cdFx0XHRcdH0sIDEwKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBDbGVhciBwbGFjZWhvbGRlciB2YWx1ZXMgdXBvbiBwYWdlIHJlbG9hZFxyXG5cdFx0JCh3aW5kb3cpLmJpbmQoJ2JlZm9yZXVubG9hZC5wbGFjZWhvbGRlcicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKCcucGxhY2Vob2xkZXInKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRoaXMudmFsdWUgPSAnJztcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBhcmdzKGVsZW0pIHtcclxuXHRcdC8vIFJldHVybiBhbiBvYmplY3Qgb2YgZWxlbWVudCBhdHRyaWJ1dGVzXHJcblx0XHR2YXIgbmV3QXR0cnMgPSB7fTtcclxuXHRcdHZhciByaW5saW5lalF1ZXJ5ID0gL15qUXVlcnlcXGQrJC87XHJcblx0XHQkLmVhY2goZWxlbS5hdHRyaWJ1dGVzLCBmdW5jdGlvbihpLCBhdHRyKSB7XHJcblx0XHRcdGlmIChhdHRyLnNwZWNpZmllZCAmJiAhcmlubGluZWpRdWVyeS50ZXN0KGF0dHIubmFtZSkpIHtcclxuXHRcdFx0XHRuZXdBdHRyc1thdHRyLm5hbWVdID0gYXR0ci52YWx1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbmV3QXR0cnM7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBjbGVhclBsYWNlaG9sZGVyKGV2ZW50LCB2YWx1ZSkge1xyXG5cdFx0dmFyIGlucHV0ID0gdGhpcztcclxuXHRcdHZhciAkaW5wdXQgPSAkKGlucHV0KTtcclxuXHRcdGlmIChpbnB1dC52YWx1ZSA9PSAkaW5wdXQuYXR0cigncGxhY2Vob2xkZXInKSAmJiAkaW5wdXQuaGFzQ2xhc3MoJ3BsYWNlaG9sZGVyJykpIHtcclxuXHRcdFx0aWYgKCRpbnB1dC5kYXRhKCdwbGFjZWhvbGRlci1wYXNzd29yZCcpKSB7XHJcblx0XHRcdFx0JGlucHV0ID0gJGlucHV0LmhpZGUoKS5uZXh0KCkuc2hvdygpLmF0dHIoJ2lkJywgJGlucHV0LnJlbW92ZUF0dHIoJ2lkJykuZGF0YSgncGxhY2Vob2xkZXItaWQnKSk7XHJcblx0XHRcdFx0Ly8gSWYgYGNsZWFyUGxhY2Vob2xkZXJgIHdhcyBjYWxsZWQgZnJvbSBgJC52YWxIb29rcy5pbnB1dC5zZXRgXHJcblx0XHRcdFx0aWYgKGV2ZW50ID09PSB0cnVlKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gJGlucHV0WzBdLnZhbHVlID0gdmFsdWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCRpbnB1dC5mb2N1cygpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlucHV0LnZhbHVlID0gJyc7XHJcblx0XHRcdFx0JGlucHV0LnJlbW92ZUNsYXNzKCdwbGFjZWhvbGRlcicpO1xyXG5cdFx0XHRcdGlucHV0ID09IHNhZmVBY3RpdmVFbGVtZW50KCkgJiYgaW5wdXQuc2VsZWN0KCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldFBsYWNlaG9sZGVyKCkge1xyXG5cdFx0dmFyICRyZXBsYWNlbWVudDtcclxuXHRcdHZhciBpbnB1dCA9IHRoaXM7XHJcblx0XHR2YXIgJGlucHV0ID0gJChpbnB1dCk7XHJcblx0XHR2YXIgaWQgPSB0aGlzLmlkO1xyXG5cdFx0aWYgKGlucHV0LnZhbHVlID09ICcnKSB7XHJcblx0XHRcdGlmIChpbnB1dC50eXBlID09ICdwYXNzd29yZCcpIHtcclxuXHRcdFx0XHRpZiAoISRpbnB1dC5kYXRhKCdwbGFjZWhvbGRlci10ZXh0aW5wdXQnKSkge1xyXG5cdFx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdFx0JHJlcGxhY2VtZW50ID0gJGlucHV0LmNsb25lKCkuYXR0cih7ICd0eXBlJzogJ3RleHQnIH0pO1xyXG5cdFx0XHRcdFx0fSBjYXRjaChlKSB7XHJcblx0XHRcdFx0XHRcdCRyZXBsYWNlbWVudCA9ICQoJzxpbnB1dD4nKS5hdHRyKCQuZXh0ZW5kKGFyZ3ModGhpcyksIHsgJ3R5cGUnOiAndGV4dCcgfSkpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0JHJlcGxhY2VtZW50XHJcblx0XHRcdFx0XHRcdC5yZW1vdmVBdHRyKCduYW1lJylcclxuXHRcdFx0XHRcdFx0LmRhdGEoe1xyXG5cdFx0XHRcdFx0XHRcdCdwbGFjZWhvbGRlci1wYXNzd29yZCc6ICRpbnB1dCxcclxuXHRcdFx0XHRcdFx0XHQncGxhY2Vob2xkZXItaWQnOiBpZFxyXG5cdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHQuYmluZCgnZm9jdXMucGxhY2Vob2xkZXInLCBjbGVhclBsYWNlaG9sZGVyKTtcclxuXHRcdFx0XHRcdCRpbnB1dFxyXG5cdFx0XHRcdFx0XHQuZGF0YSh7XHJcblx0XHRcdFx0XHRcdFx0J3BsYWNlaG9sZGVyLXRleHRpbnB1dCc6ICRyZXBsYWNlbWVudCxcclxuXHRcdFx0XHRcdFx0XHQncGxhY2Vob2xkZXItaWQnOiBpZFxyXG5cdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHQuYmVmb3JlKCRyZXBsYWNlbWVudCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCRpbnB1dCA9ICRpbnB1dC5yZW1vdmVBdHRyKCdpZCcpLmhpZGUoKS5wcmV2KCkuYXR0cignaWQnLCBpZCkuc2hvdygpO1xyXG5cdFx0XHRcdC8vIE5vdGU6IGAkaW5wdXRbMF0gIT0gaW5wdXRgIG5vdyFcclxuXHRcdFx0fVxyXG5cdFx0XHQkaW5wdXQuYWRkQ2xhc3MoJ3BsYWNlaG9sZGVyJyk7XHJcblx0XHRcdCRpbnB1dFswXS52YWx1ZSA9ICRpbnB1dC5hdHRyKCdwbGFjZWhvbGRlcicpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JGlucHV0LnJlbW92ZUNsYXNzKCdwbGFjZWhvbGRlcicpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2FmZUFjdGl2ZUVsZW1lbnQoKSB7XHJcblx0XHQvLyBBdm9pZCBJRTkgYGRvY3VtZW50LmFjdGl2ZUVsZW1lbnRgIG9mIGRlYXRoXHJcblx0XHQvLyBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9qcXVlcnktcGxhY2Vob2xkZXIvcHVsbC85OVxyXG5cdFx0dHJ5IHtcclxuXHRcdFx0cmV0dXJuIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XHJcblx0XHR9IGNhdGNoIChleGNlcHRpb24pIHt9XHJcblx0fVxyXG5cclxufSh3aW5kb3csIGRvY3VtZW50LCBqUXVlcnkpKTsiXX0=
