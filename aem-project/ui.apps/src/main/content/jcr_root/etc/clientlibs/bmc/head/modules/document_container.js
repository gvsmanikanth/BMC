!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;n="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,n.noscope=e()}}(function(){return function e(n,t,o){function r(f,u){if(!t[f]){if(!n[f]){var d="function"==typeof require&&require;if(!u&&d)return d(f,!0);if(i)return i(f,!0);var c=new Error("Cannot find module '"+f+"'");throw c.code="MODULE_NOT_FOUND",c}var l=t[f]={exports:{}};n[f][0].call(l.exports,function(e){var t=n[f][1][e];return r(t?t:e)},l,l.exports,e,n,t,o)}return t[f].exports}for(var i="function"==typeof require&&require,f=0;f<o.length;f++)r(o[f]);return r}({1:[function(){!function(e){function n(){var e=window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight||document.body.offsetHeight;return e}if(e("body").hasClass("document_container")){var t=n();document.getElementById("pdfReader")&&(document.getElementById("pdfReader").style.height=t-80+"px")}}(jQuery)},{}]},{},[1])(1)});