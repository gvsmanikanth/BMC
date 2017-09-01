(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*! svg4everybody v1.0.0 | github.com/jonathantneal/svg4everybody */
(function (document, uses, requestAnimationFrame, CACHE, LTEIE8, IE9TO11) {
	function embed(svg, g) {
		if (g) {
			var
			viewBox = g.getAttribute('viewBox'),
			fragment = document.createDocumentFragment(),
			clone = g.cloneNode(true);

			if (viewBox) {
				svg.setAttribute('viewBox', viewBox);
			}

			while (clone.childNodes.length) {
				fragment.appendChild(clone.childNodes[0]);
			}

			svg.appendChild(fragment);
		}
	}

	function onload() {
		var xhr = this, x = document.createElement('x'), s = xhr.s;

		x.innerHTML = xhr.responseText;

		xhr.onload = function () {
			s.splice(0).map(function (array) {
				embed(array[0], x.querySelector('#' + array[1].replace(/(\W)/g, '\\$1')));
			});
		};

		xhr.onload();
	}

	function onframe() {
		var use;

		while ((use = uses[0])) {
			if (LTEIE8) {
				var img = new Image(), src, q;

				src = use.getAttribute('xlink:href');
				q = (/\?[^#]+/.exec(src) || [''])[0];
				img.src = src.replace(/\?[^#]+/, '').replace('#', '.').replace(/^\./, '') + '.png' + q;

				use.parentNode.replaceChild(img, use);
			} else {
				var
				svg = use.parentNode,
				url = use.getAttribute('xlink:href').split('#'),
				url_root = url[0],
				url_hash = url[1];

				svg.removeChild(use);

				if (url_root.length) {
					var xhr = CACHE[url_root] = CACHE[url_root] || new XMLHttpRequest();

					if (!xhr.s) {
						xhr.s = [];

						xhr.open('GET', url_root);

						xhr.onload = onload;

						xhr.send();
					}

					xhr.s.push([svg, url_hash]);

					if (xhr.readyState === 4) {
						xhr.onload();
					}

				} else {
					embed(svg, document.getElementById(url_hash));
				}
			}
		}

		requestAnimationFrame(onframe);
	}

	if (LTEIE8 || IE9TO11) {
		onframe();
	}
})(
	document,
	document.getElementsByTagName('use'),
	window.requestAnimationFrame || window.setTimeout,
	{},
	/MSIE\s[1-8]\b/.test(navigator.userAgent),
	/Trident\/[567]\b/.test(navigator.userAgent) || /Edge\/12/.test(navigator.userAgent) || (navigator.userAgent.match(/AppleWebKit\/(\d+)/) || [])[1] < 537,
	document.createElement('svg'),
	document.createElement('use')
);

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3N2ZzRldmVyeWJvZHkuaWU4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiEgc3ZnNGV2ZXJ5Ym9keSB2MS4wLjAgfCBnaXRodWIuY29tL2pvbmF0aGFudG5lYWwvc3ZnNGV2ZXJ5Ym9keSAqL1xyXG4oZnVuY3Rpb24gKGRvY3VtZW50LCB1c2VzLCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUsIENBQ0hFLCBMVEVJRTgsIElFOVRPMTEpIHtcclxuXHRmdW5jdGlvbiBlbWJlZChzdmcsIGcpIHtcclxuXHRcdGlmIChnKSB7XHJcblx0XHRcdHZhclxyXG5cdFx0XHR2aWV3Qm94ID0gZy5nZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnKSxcclxuXHRcdFx0ZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksXHJcblx0XHRcdGNsb25lID0gZy5jbG9uZU5vZGUodHJ1ZSk7XHJcblxyXG5cdFx0XHRpZiAodmlld0JveCkge1xyXG5cdFx0XHRcdHN2Zy5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCB2aWV3Qm94KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0d2hpbGUgKGNsb25lLmNoaWxkTm9kZXMubGVuZ3RoKSB7XHJcblx0XHRcdFx0ZnJhZ21lbnQuYXBwZW5kQ2hpbGQoY2xvbmUuY2hpbGROb2Rlc1swXSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHN2Zy5hcHBlbmRDaGlsZChmcmFnbWVudCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBvbmxvYWQoKSB7XHJcblx0XHR2YXIgeGhyID0gdGhpcywgeCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3gnKSwgcyA9IHhoci5zO1xyXG5cclxuXHRcdHguaW5uZXJIVE1MID0geGhyLnJlc3BvbnNlVGV4dDtcclxuXHJcblx0XHR4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRzLnNwbGljZSgwKS5tYXAoZnVuY3Rpb24gKGFycmF5KSB7XHJcblx0XHRcdFx0ZW1iZWQoYXJyYXlbMF0sIHgucXVlcnlTZWxlY3RvcignIycgKyBhcnJheVsxXS5yZXBsYWNlKC8oXFxXKS9nLCAnXFxcXCQxJykpKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHhoci5vbmxvYWQoKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIG9uZnJhbWUoKSB7XHJcblx0XHR2YXIgdXNlO1xyXG5cclxuXHRcdHdoaWxlICgodXNlID0gdXNlc1swXSkpIHtcclxuXHRcdFx0aWYgKExURUlFOCkge1xyXG5cdFx0XHRcdHZhciBpbWcgPSBuZXcgSW1hZ2UoKSwgc3JjLCBxO1xyXG5cclxuXHRcdFx0XHRzcmMgPSB1c2UuZ2V0QXR0cmlidXRlKCd4bGluazpocmVmJyk7XHJcblx0XHRcdFx0cSA9ICgvXFw/W14jXSsvLmV4ZWMoc3JjKSB8fCBbJyddKVswXTtcclxuXHRcdFx0XHRpbWcuc3JjID0gc3JjLnJlcGxhY2UoL1xcP1teI10rLywgJycpLnJlcGxhY2UoJyMnLCAnLicpLnJlcGxhY2UoL15cXC4vLCAnJykgKyAnLnBuZycgKyBxO1xyXG5cclxuXHRcdFx0XHR1c2UucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoaW1nLCB1c2UpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHZhclxyXG5cdFx0XHRcdHN2ZyA9IHVzZS5wYXJlbnROb2RlLFxyXG5cdFx0XHRcdHVybCA9IHVzZS5nZXRBdHRyaWJ1dGUoJ3hsaW5rOmhyZWYnKS5zcGxpdCgnIycpLFxyXG5cdFx0XHRcdHVybF9yb290ID0gdXJsWzBdLFxyXG5cdFx0XHRcdHVybF9oYXNoID0gdXJsWzFdO1xyXG5cclxuXHRcdFx0XHRzdmcucmVtb3ZlQ2hpbGQodXNlKTtcclxuXHJcblx0XHRcdFx0aWYgKHVybF9yb290Lmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0dmFyIHhociA9IENBQ0hFW3VybF9yb290XSA9IENBQ0hFW3VybF9yb290XSB8fCBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHJcblx0XHRcdFx0XHRpZiAoIXhoci5zKSB7XHJcblx0XHRcdFx0XHRcdHhoci5zID0gW107XHJcblxyXG5cdFx0XHRcdFx0XHR4aHIub3BlbignR0VUJywgdXJsX3Jvb3QpO1xyXG5cclxuXHRcdFx0XHRcdFx0eGhyLm9ubG9hZCA9IG9ubG9hZDtcclxuXHJcblx0XHRcdFx0XHRcdHhoci5zZW5kKCk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0eGhyLnMucHVzaChbc3ZnLCB1cmxfaGFzaF0pO1xyXG5cclxuXHRcdFx0XHRcdGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xyXG5cdFx0XHRcdFx0XHR4aHIub25sb2FkKCk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRlbWJlZChzdmcsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHVybF9oYXNoKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKG9uZnJhbWUpO1xyXG5cdH1cclxuXHJcblx0aWYgKExURUlFOCB8fCBJRTlUTzExKSB7XHJcblx0XHRvbmZyYW1lKCk7XHJcblx0fVxyXG59KShcclxuXHRkb2N1bWVudCxcclxuXHRkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndXNlJyksXHJcblx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cuc2V0VGltZW91dCxcclxuXHR7fSxcclxuXHQvTVNJRVxcc1sxLThdXFxiLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpLFxyXG5cdC9UcmlkZW50XFwvWzU2N11cXGIvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgfHwgL0VkZ2VcXC8xMi8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSB8fCAobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQXBwbGVXZWJLaXRcXC8oXFxkKykvKSB8fCBbXSlbMV0gPCA1MzcsXHJcblx0ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3ZnJyksXHJcblx0ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndXNlJylcclxuKTtcclxuIl19
