!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;n="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,n.noscope=e()}}(function(){return function e(n,t,r){function o(f,u){if(!t[f]){if(!n[f]){var d="function"==typeof require&&require;if(!u&&d)return d(f,!0);if(i)return i(f,!0);var a=new Error("Cannot find module '"+f+"'");throw a.code="MODULE_NOT_FOUND",a}var c=t[f]={exports:{}};n[f][0].call(c.exports,function(e){var t=n[f][1][e];return o(t?t:e)},c,c.exports,e,n,t,r)}return t[f].exports}for(var i="function"==typeof require&&require,f=0;f<r.length;f++)o(r[f]);return o}({1:[function(){$(document).ready(function(){function e(){var n="";"undefined"!=typeof bmcMeta&&bmcMeta.hasOwnProperty("user")&&(n=bmcMeta.user.sVi),""!==n?$("#C_Lead_Rating_Override1").val()!==n&&$("#C_Lead_Rating_Override1").val(n):setTimeout(e,500)}setTimeout(e,5e3),$("form.customerform").submit(function(){e()})})},{}]},{},[1])(1)});