!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.noscope=e()}}(function(){return function e(t,n,r){function o(a,u){if(!n[a]){if(!t[a]){var d="function"==typeof require&&require;if(!u&&d)return d(a,!0);if(i)return i(a,!0);var f=new Error("Cannot find module '"+a+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[a]={exports:{}};t[a][0].call(l.exports,function(e){var n=t[a][1][e];return o(n?n:e)},l,l.exports,e,t,n,r)}return n[a].exports}for(var i="function"==typeof require&&require,a=0;a<r.length;a++)o(r[a]);return o}({1:[function(){!function(e,t,n,r,o,i){function a(t,n){if(n){var r=n.getAttribute("viewBox"),o=e.createDocumentFragment(),i=n.cloneNode(!0);for(r&&t.setAttribute("viewBox",r);i.childNodes.length;)o.appendChild(i.childNodes[0]);t.appendChild(o)}}function u(){var t=this,n=e.createElement("x"),r=t.s;n.innerHTML=t.responseText,t.onload=function(){r.splice(0).map(function(e){a(e[0],n.querySelector("#"+e[1].replace(/(\W)/g,"\\$1")))})},t.onload()}function d(){for(var i;i=t[0];)if(o){var f,l,s=new Image;f=i.getAttribute("xlink:href"),l=(/\?[^#]+/.exec(f)||[""])[0],s.src=f.replace(/\?[^#]+/,"").replace("#",".").replace(/^\./,"")+".png"+l,i.parentNode.replaceChild(s,i)}else{var c=i.parentNode,p=i.getAttribute("xlink:href").split("#"),g=p[0],m=p[1];if(c.removeChild(i),g.length){var v=r[g]=r[g]||new XMLHttpRequest;v.s||(v.s=[],v.open("GET",g),v.onload=u,v.send()),v.s.push([c,m]),4===v.readyState&&v.onload()}else a(c,e.getElementById(m))}n(d)}(o||i)&&d()}(document,document.getElementsByTagName("use"),window.requestAnimationFrame||window.setTimeout,{},/MSIE\s[1-8]\b/.test(navigator.userAgent),/Trident\/[567]\b/.test(navigator.userAgent)||/Edge\/12/.test(navigator.userAgent)||(navigator.userAgent.match(/AppleWebKit\/(\d+)/)||[])[1]<537,document.createElement("svg"),document.createElement("use"))},{}]},{},[1])(1)});