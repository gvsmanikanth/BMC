(function($) {

    var REGEX_SELECTOR = "publicationDate.validation",

        foundationReg = $(window).adaptTo("foundation-registry");

    foundationReg.register("foundation.validation.validator", {
        selector: "[data-validation='" + REGEX_SELECTOR + "']",
        validate: function(el) {

            var regex_pattern = /^$|\d{4}-\d{2}-\d{2}$/;
            var error_message = "Please use date format: yyyy-mm-dd.";
            var result = el.value.match(regex_pattern);

            if (result === null) {
                return error_message;
            }
        }
    });

}(jQuery));