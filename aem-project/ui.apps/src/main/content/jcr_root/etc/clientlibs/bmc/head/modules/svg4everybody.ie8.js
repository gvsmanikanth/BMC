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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tb2R1bGVzL3N2ZzRldmVyeWJvZHkuaWU4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiEgc3ZnNGV2ZXJ5Ym9keSB2MS4wLjAgfCBnaXRodWIuY29tL2pvbmF0aGFudG5lYWwvc3ZnNGV2ZXJ5Ym9keSAqL1xuKGZ1bmN0aW9uIChkb2N1bWVudCwgdXNlcywgcmVxdWVzdEFuaW1hdGlvbkZyYW1lLCBDQUNIRSwgTFRFSUU4LCBJRTlUTzExKSB7XG5cdGZ1bmN0aW9uIGVtYmVkKHN2ZywgZykge1xuXHRcdGlmIChnKSB7XG5cdFx0XHR2YXJcblx0XHRcdHZpZXdCb3ggPSBnLmdldEF0dHJpYnV0ZSgndmlld0JveCcpLFxuXHRcdFx0ZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksXG5cdFx0XHRjbG9uZSA9IGcuY2xvbmVOb2RlKHRydWUpO1xuXG5cdFx0XHRpZiAodmlld0JveCkge1xuXHRcdFx0XHRzdmcuc2V0QXR0cmlidXRlKCd2aWV3Qm94Jywgdmlld0JveCk7XG5cdFx0XHR9XG5cblx0XHRcdHdoaWxlIChjbG9uZS5jaGlsZE5vZGVzLmxlbmd0aCkge1xuXHRcdFx0XHRmcmFnbWVudC5hcHBlbmRDaGlsZChjbG9uZS5jaGlsZE5vZGVzWzBdKTtcblx0XHRcdH1cblxuXHRcdFx0c3ZnLmFwcGVuZENoaWxkKGZyYWdtZW50KTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBvbmxvYWQoKSB7XG5cdFx0dmFyIHhociA9IHRoaXMsIHggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd4JyksIHMgPSB4aHIucztcblxuXHRcdHguaW5uZXJIVE1MID0geGhyLnJlc3BvbnNlVGV4dDtcblxuXHRcdHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRzLnNwbGljZSgwKS5tYXAoZnVuY3Rpb24gKGFycmF5KSB7XG5cdFx0XHRcdGVtYmVkKGFycmF5WzBdLCB4LnF1ZXJ5U2VsZWN0b3IoJyMnICsgYXJyYXlbMV0ucmVwbGFjZSgvKFxcVykvZywgJ1xcXFwkMScpKSk7XG5cdFx0XHR9KTtcblx0XHR9O1xuXG5cdFx0eGhyLm9ubG9hZCgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gb25mcmFtZSgpIHtcblx0XHR2YXIgdXNlO1xuXG5cdFx0d2hpbGUgKCh1c2UgPSB1c2VzWzBdKSkge1xuXHRcdFx0aWYgKExURUlFOCkge1xuXHRcdFx0XHR2YXIgaW1nID0gbmV3IEltYWdlKCksIHNyYywgcTtcblxuXHRcdFx0XHRzcmMgPSB1c2UuZ2V0QXR0cmlidXRlKCd4bGluazpocmVmJyk7XG5cdFx0XHRcdHEgPSAoL1xcP1teI10rLy5leGVjKHNyYykgfHwgWycnXSlbMF07XG5cdFx0XHRcdGltZy5zcmMgPSBzcmMucmVwbGFjZSgvXFw/W14jXSsvLCAnJykucmVwbGFjZSgnIycsICcuJykucmVwbGFjZSgvXlxcLi8sICcnKSArICcucG5nJyArIHE7XG5cblx0XHRcdFx0dXNlLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGltZywgdXNlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhclxuXHRcdFx0XHRzdmcgPSB1c2UucGFyZW50Tm9kZSxcblx0XHRcdFx0dXJsID0gdXNlLmdldEF0dHJpYnV0ZSgneGxpbms6aHJlZicpLnNwbGl0KCcjJyksXG5cdFx0XHRcdHVybF9yb290ID0gdXJsWzBdLFxuXHRcdFx0XHR1cmxfaGFzaCA9IHVybFsxXTtcblxuXHRcdFx0XHRzdmcucmVtb3ZlQ2hpbGQodXNlKTtcblxuXHRcdFx0XHRpZiAodXJsX3Jvb3QubGVuZ3RoKSB7XG5cdFx0XHRcdFx0dmFyIHhociA9IENBQ0hFW3VybF9yb290XSA9IENBQ0hFW3VybF9yb290XSB8fCBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuXHRcdFx0XHRcdGlmICgheGhyLnMpIHtcblx0XHRcdFx0XHRcdHhoci5zID0gW107XG5cblx0XHRcdFx0XHRcdHhoci5vcGVuKCdHRVQnLCB1cmxfcm9vdCk7XG5cblx0XHRcdFx0XHRcdHhoci5vbmxvYWQgPSBvbmxvYWQ7XG5cblx0XHRcdFx0XHRcdHhoci5zZW5kKCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0eGhyLnMucHVzaChbc3ZnLCB1cmxfaGFzaF0pO1xuXG5cdFx0XHRcdFx0aWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG5cdFx0XHRcdFx0XHR4aHIub25sb2FkKCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZW1iZWQoc3ZnLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh1cmxfaGFzaCkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKG9uZnJhbWUpO1xuXHR9XG5cblx0aWYgKExURUlFOCB8fCBJRTlUTzExKSB7XG5cdFx0b25mcmFtZSgpO1xuXHR9XG59KShcblx0ZG9jdW1lbnQsXG5cdGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCd1c2UnKSxcblx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cuc2V0VGltZW91dCxcblx0e30sXG5cdC9NU0lFXFxzWzEtOF1cXGIvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCksXG5cdC9UcmlkZW50XFwvWzU2N11cXGIvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgfHwgL0VkZ2VcXC8xMi8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSB8fCAobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQXBwbGVXZWJLaXRcXC8oXFxkKykvKSB8fCBbXSlbMV0gPCA1MzcsXG5cdGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N2ZycpLFxuXHRkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1c2UnKVxuKTtcbiJdfQ==
