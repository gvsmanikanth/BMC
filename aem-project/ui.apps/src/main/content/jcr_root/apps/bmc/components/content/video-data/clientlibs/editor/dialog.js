(function (document, $, Coral) {
    "use strict";
    var dialogContentHeight = "38rem";

    $(document).on("foundation-contentloaded", function (e) {
        $(".cq-dialog-floating .cq-dialog-content").css("height", dialogContentHeight);

        if ($(".typeid-group .coral-Radio-input:checked").length === 0) {
            $(".typeid-group .coral-Radio-input").first().attr('checked', 'checked');
        }

        $(".coral-RadioGroup.cq-dialog-radiogroup-showhide", e.target).each(function (i, radioGroup) {
            var target = $(radioGroup).data("cqDialogRadiogroupShowhideTarget");
            if (target) {
                $(".coral-Radio-input", radioGroup).each(function (j, radio) {
                    Coral.commons.ready(radio, function (radio) {
                        var $radio = $(radio);
                        if ($radio.is(":checked"))
                            showHide(radio, target);

                        $radio.on("change", function () {
                            showHide(radio, target);
                        });
                    });
                });
            }
        });
    });

    function showHide(radio, target) {
        $(target).each(function() {
            var $target = $(this);

            // hide visible targets and disable targets if appropriate (validation)
            var $container = $target;
            var $control = $target;
            if ($container.is(".coral-Textfield, .coral-PathBrowser") ) {
                $container = $target.parent();

                if ($control.is(":not(input)"))
                    $control = $control.find("input");

                if (!$container.hasClass("hide")) {
                    $container.addClass("hide");
                    $target.removeClass("hide");
                    $control.attr("disabled", "disabled");
                }
            } else {
                $container.not(".hide").addClass("hide");
            }


            // show/enable targets as appropriate, supporting multiple values in the target's data-showhidetargetvalue attribute
            var targetValues = $target.attr("data-showhidetargetvalue");
            if (targetValues !== undefined) {
                if ($.inArray(radio.value, targetValues.replace(/,\s+/g, ',').split(',')) !== -1) {
                    $container.removeClass("hide");
                    $control.removeAttr("disabled");
                }
            }
        });
    }

})(document, Granite.$, Coral);
