(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// @cookie
// Cookies get/set/delete
// there is also a jQuery cookie plugin that does more magic but seems to usually be overkill

// cookie reader by Lea Verou: http://lea.verou.me/2009/12/reading-cookies-the-regular-expression-way/
function getCookie(name) {
	// Escape regexp special characters
	name = name.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');

	var regex = new RegExp('(?:^|;)\\s?' + name + '=(.*?)(?:;|$)','i'),
		match = document.cookie.match(regex);

	return match && unescape(match[1]);
}

function setCookie(cookie) {
	var MILS = 1000 * 60 * 60 * 24; // value to convert days to miliseconds
	var now = Date.now();
	var name = cookie.name ? cookie.name + '=' : false;
	var val = cookie.val ? cookie.val : '';
	var expires = cookie.days ? '; expires=' + new Date((cookie.days * MILS) + now).toUTCString() : cookie.mils? '; expires=' + new Date(cookie.mils + now).toUTCString()  : '';
	var path = cookie.path ? '; path=' + cookie.path : '; path=/';
	var domain = cookie.domain ? '; domain=' + cookie.domain : '';
	var secure = cookie.secure ? '; secure' : '';

	if (name) {
		document.cookie = name + val + expires + path + domain + secure;
	}
}

function deleteCookie(cookieName) {
	setCookie({name:cookieName,expires:false});
}

exports.get = getCookie;
exports.set = setCookie;
exports.delete = deleteCookie;
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9saWIvY29va2llcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIEBjb29raWVcclxuLy8gQ29va2llcyBnZXQvc2V0L2RlbGV0ZVxyXG4vLyB0aGVyZSBpcyBhbHNvIGEgalF1ZXJ5IGNvb2tpZSBwbHVnaW4gdGhhdCBkb2VzIG1vcmUgbWFnaWMgYnV0IHNlZW1zIHRvIHVzdWFsbHkgYmUgb3ZlcmtpbGxcclxuXHJcbi8vIGNvb2tpZSByZWFkZXIgYnkgTGVhIFZlcm91OiBodHRwOi8vbGVhLnZlcm91Lm1lLzIwMDkvMTIvcmVhZGluZy1jb29raWVzLXRoZS1yZWd1bGFyLWV4cHJlc3Npb24td2F5L1xyXG5mdW5jdGlvbiBnZXRDb29raWUobmFtZSkge1xyXG5cdC8vIEVzY2FwZSByZWdleHAgc3BlY2lhbCBjaGFyYWN0ZXJzXHJcblx0bmFtZSA9IG5hbWUucmVwbGFjZSgvKFsuKis/Xj0hOiR7fSgpfFtcXF1cXC9cXFxcXSkvZywgJ1xcXFwkMScpO1xyXG5cclxuXHR2YXIgcmVnZXggPSBuZXcgUmVnRXhwKCcoPzpefDspXFxcXHM/JyArIG5hbWUgKyAnPSguKj8pKD86O3wkKScsJ2knKSxcclxuXHRcdG1hdGNoID0gZG9jdW1lbnQuY29va2llLm1hdGNoKHJlZ2V4KTtcclxuXHJcblx0cmV0dXJuIG1hdGNoICYmIHVuZXNjYXBlKG1hdGNoWzFdKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0Q29va2llKGNvb2tpZSkge1xyXG5cdHZhciBNSUxTID0gMTAwMCAqIDYwICogNjAgKiAyNDsgLy8gdmFsdWUgdG8gY29udmVydCBkYXlzIHRvIG1pbGlzZWNvbmRzXHJcblx0dmFyIG5vdyA9IERhdGUubm93KCk7XHJcblx0dmFyIG5hbWUgPSBjb29raWUubmFtZSA/IGNvb2tpZS5uYW1lICsgJz0nIDogZmFsc2U7XHJcblx0dmFyIHZhbCA9IGNvb2tpZS52YWwgPyBjb29raWUudmFsIDogJyc7XHJcblx0dmFyIGV4cGlyZXMgPSBjb29raWUuZGF5cyA/ICc7IGV4cGlyZXM9JyArIG5ldyBEYXRlKChjb29raWUuZGF5cyAqIE1JTFMpICsgbm93KS50b1VUQ1N0cmluZygpIDogY29va2llLm1pbHM/ICc7IGV4cGlyZXM9JyArIG5ldyBEYXRlKGNvb2tpZS5taWxzICsgbm93KS50b1VUQ1N0cmluZygpICA6ICcnO1xyXG5cdHZhciBwYXRoID0gY29va2llLnBhdGggPyAnOyBwYXRoPScgKyBjb29raWUucGF0aCA6ICc7IHBhdGg9Lyc7XHJcblx0dmFyIGRvbWFpbiA9IGNvb2tpZS5kb21haW4gPyAnOyBkb21haW49JyArIGNvb2tpZS5kb21haW4gOiAnJztcclxuXHR2YXIgc2VjdXJlID0gY29va2llLnNlY3VyZSA/ICc7IHNlY3VyZScgOiAnJztcclxuXHJcblx0aWYgKG5hbWUpIHtcclxuXHRcdGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyB2YWwgKyBleHBpcmVzICsgcGF0aCArIGRvbWFpbiArIHNlY3VyZTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlbGV0ZUNvb2tpZShjb29raWVOYW1lKSB7XHJcblx0c2V0Q29va2llKHtuYW1lOmNvb2tpZU5hbWUsZXhwaXJlczpmYWxzZX0pO1xyXG59XHJcblxyXG5leHBvcnRzLmdldCA9IGdldENvb2tpZTtcclxuZXhwb3J0cy5zZXQgPSBzZXRDb29raWU7XHJcbmV4cG9ydHMuZGVsZXRlID0gZGVsZXRlQ29va2llOyJdfQ==
