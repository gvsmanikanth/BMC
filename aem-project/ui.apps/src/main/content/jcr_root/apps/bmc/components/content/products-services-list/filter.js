"use strict";
use(function () {
    var alphaClassPrefix = "alpha-";
    return {
        alphaClass: alphaClassPrefix + this.linkName.charAt(0).toLowerCase()
    };
});