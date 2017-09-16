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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9saWIvY29va2llcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIEBjb29raWVcbi8vIENvb2tpZXMgZ2V0L3NldC9kZWxldGVcbi8vIHRoZXJlIGlzIGFsc28gYSBqUXVlcnkgY29va2llIHBsdWdpbiB0aGF0IGRvZXMgbW9yZSBtYWdpYyBidXQgc2VlbXMgdG8gdXN1YWxseSBiZSBvdmVya2lsbFxuXG4vLyBjb29raWUgcmVhZGVyIGJ5IExlYSBWZXJvdTogaHR0cDovL2xlYS52ZXJvdS5tZS8yMDA5LzEyL3JlYWRpbmctY29va2llcy10aGUtcmVndWxhci1leHByZXNzaW9uLXdheS9cbmZ1bmN0aW9uIGdldENvb2tpZShuYW1lKSB7XG5cdC8vIEVzY2FwZSByZWdleHAgc3BlY2lhbCBjaGFyYWN0ZXJzXG5cdG5hbWUgPSBuYW1lLnJlcGxhY2UoLyhbLiorP149IToke30oKXxbXFxdXFwvXFxcXF0pL2csICdcXFxcJDEnKTtcblxuXHR2YXIgcmVnZXggPSBuZXcgUmVnRXhwKCcoPzpefDspXFxcXHM/JyArIG5hbWUgKyAnPSguKj8pKD86O3wkKScsJ2knKSxcblx0XHRtYXRjaCA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaChyZWdleCk7XG5cblx0cmV0dXJuIG1hdGNoICYmIHVuZXNjYXBlKG1hdGNoWzFdKTtcbn1cblxuZnVuY3Rpb24gc2V0Q29va2llKGNvb2tpZSkge1xuXHR2YXIgTUlMUyA9IDEwMDAgKiA2MCAqIDYwICogMjQ7IC8vIHZhbHVlIHRvIGNvbnZlcnQgZGF5cyB0byBtaWxpc2Vjb25kc1xuXHR2YXIgbm93ID0gRGF0ZS5ub3coKTtcblx0dmFyIG5hbWUgPSBjb29raWUubmFtZSA/IGNvb2tpZS5uYW1lICsgJz0nIDogZmFsc2U7XG5cdHZhciB2YWwgPSBjb29raWUudmFsID8gY29va2llLnZhbCA6ICcnO1xuXHR2YXIgZXhwaXJlcyA9IGNvb2tpZS5kYXlzID8gJzsgZXhwaXJlcz0nICsgbmV3IERhdGUoKGNvb2tpZS5kYXlzICogTUlMUykgKyBub3cpLnRvVVRDU3RyaW5nKCkgOiBjb29raWUubWlscz8gJzsgZXhwaXJlcz0nICsgbmV3IERhdGUoY29va2llLm1pbHMgKyBub3cpLnRvVVRDU3RyaW5nKCkgIDogJyc7XG5cdHZhciBwYXRoID0gY29va2llLnBhdGggPyAnOyBwYXRoPScgKyBjb29raWUucGF0aCA6ICc7IHBhdGg9Lyc7XG5cdHZhciBkb21haW4gPSBjb29raWUuZG9tYWluID8gJzsgZG9tYWluPScgKyBjb29raWUuZG9tYWluIDogJyc7XG5cdHZhciBzZWN1cmUgPSBjb29raWUuc2VjdXJlID8gJzsgc2VjdXJlJyA6ICcnO1xuXG5cdGlmIChuYW1lKSB7XG5cdFx0ZG9jdW1lbnQuY29va2llID0gbmFtZSArIHZhbCArIGV4cGlyZXMgKyBwYXRoICsgZG9tYWluICsgc2VjdXJlO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZUNvb2tpZShjb29raWVOYW1lKSB7XG5cdHNldENvb2tpZSh7bmFtZTpjb29raWVOYW1lLGV4cGlyZXM6ZmFsc2V9KTtcbn1cblxuZXhwb3J0cy5nZXQgPSBnZXRDb29raWU7XG5leHBvcnRzLnNldCA9IHNldENvb2tpZTtcbmV4cG9ydHMuZGVsZXRlID0gZGVsZXRlQ29va2llOyJdfQ==
