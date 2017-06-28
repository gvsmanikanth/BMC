(function (document, $, Coral) {
    "use strict";

    // radiogroup-showhide:
    // support show/hide of containers/fields with granite/ui/components/foundation/form/radiogroup (ala dropdownshowhide)
    //  Properties expected on RadioGroup tag:
    //      class="cq-dialog-radiogroup-showhide"
    //      cq-dialog-radiogroup-showhide-target="{selector text}"
    //  Property expected on target tags:
    //      showhidetargetvalue="{value1[,value2,...]}" (value(s) from radiogroup radio items)
    $(document).on("foundation-contentloaded", function (e) {

        $(".coral-RadioGroup.cq-dialog-radiogroup-showhide", e.target).each(function (i, radioGroup) {
            var $radioGroup = $(radioGroup);

            var targetSelector = $(radioGroup).data("cqDialogRadiogroupShowhideTarget");
            if (targetSelector) {
                var $radioInputs = $radioGroup.find(".coral-Radio-input");
                var hasSelection = ($radioInputs.filter(":checked").length > 0);

                // use multifield container for context, if appropriate
                var $targetSelectorContext = $radioGroup.parents(".coral-Multifield-input");
                // otherwise keep default context
                if ($targetSelectorContext.length === 0)
                    $targetSelectorContext = undefined;

                $radioGroup.find(".coral-Radio-input").each(function (j, radio) {
                    Coral.commons.ready(radio, function (radio) {
                        var $radio = $(radio);
                        var $targets = $(targetSelector, $targetSelectorContext);

                        // ensure initial selection
                        if (hasSelection === false) {
                            $radio.attr("checked", "checked");
                            hasSelection = true;
                        }
                        if ($radio.is(":checked")) {
                            showHide(radio, $targets);
                        }

                        $radio.on("change", function () {
                            showHide(radio, $targets);
                        });
                    });
                });
            }
        });
    });

    function showHide(radio, $targets) {
        $targets.each(function() {
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
