(function (document, $, Coral) {
    "use strict";

    // radiogroup-showhide:
    // support show/hide of containers/fields with granite/ui/components/foundation/form/radiogroup (ala dropdownshowhide)
    //  Properties expected on RadioGroup tag:
    //      class="cq-dialog-radiogroup-showhide"
    //      cq-dialog-radiogroup-showhide-target="{selector text}"
    //  Property expected on target tags:
    //      showhidetargetvalue="{value1[,value2,...]}" (value(s) from radiogroup radio items)

    var nextRadioGroupInstanceId = 1;
    $(document).on("foundation-contentloaded", function (e) {
        // foundation-contentloaded will/should be triggered on main dialog load, and also on each multifield item add

        // get data for any RadioGroup(s) not yet processed
        $(".coral-RadioGroup.cq-dialog-radiogroup-showhide").map(function(i, radioGroup) {
            var $radioGroup = $(radioGroup);

            // only want/need to process each RadioGroup once per dialog lifetime
            if ($radioGroup.data("showHideProcessed") === true)
                return;
            $radioGroup.data("showHideProcessed", true);

            var targetSelector = $radioGroup.data("cqDialogRadiogroupShowhideTarget");
            if (!targetSelector)
                return;

            var $radioInputs = $radioGroup.find(".coral-Radio-input");
            var $multifieldItem = $radioGroup.parents(".coral-Multifield-input");
            var isMultifield = ($multifieldItem.length > 0);
            var $showHideTargets = isMultifield ? $(targetSelector, $multifieldItem) : $(targetSelector);

            // verify reasonable input names
            var inputNames = $.uniqueSort($radioInputs.map(function() { return $(this).attr("name"); }).get());
            if (inputNames.length !== 1 || inputNames[0].substring(0, 2) !== "./")
                return; // radio inputs do not share the same name, or name doesn't start with "./" -- probably not a thing, but bail
            var inputName = inputNames[0].substr(2);

            return {
                InstanceId: nextRadioGroupInstanceId++,
                Name: inputName,
                $RadioGroup: $radioGroup,
                $RadioInputs: $radioInputs,
                $ShowHideTargets: $showHideTargets,
                IsInMultifield: isMultifield,
                MultifieldValidator: getMultifieldValidator($multifieldItem)
            };
        }).each(function (i, item) {
            // process the new RadioGroup data...

            if (item.IsInMultifield) {
                // in order to support multifield, change the name of the radio inputs and inject a hidden field to track the value
                item.$RadioGroup.parent().removeClass("coral-Form-fieldwrapper");
                item.$RadioInputs.attr("name", item.Name + "-" + item.InstanceId);
                var $hiddenValueInput = $('<div class="coral-Form-fieldwrapper"><input type="hidden" name="./' + item.Name + '"></div>')
                    .appendTo(item.$RadioGroup.parent().parent())
                    .children();
            }

            var hasSelection = (item.$RadioInputs.filter(":checked").length > 0);
            item.$RadioInputs.each(function (j, radio) {
                if (item.IsInMultifield) {
                    // early initialize of validation state for hidden fields
                    var $inputs = item.$ShowHideTargets.find("input");
                    hideInputs($inputs, item);
                }

                // finish init after field values have been loaded
                Coral.commons.ready(radio, function (radio) {
                    var $radio = $(radio);

                    // ensure initial selection
                    if (hasSelection === false) {
                        var value = $hiddenValueInput ? $hiddenValueInput.val() : "";
                        if (value === radio.value || value === "") {
                            $radio.attr("checked", "checked");
                            hasSelection = true;
                        }
                    }
                    if ($radio.is(":checked")) {
                        if ($hiddenValueInput)
                            $hiddenValueInput.val(radio.value);
                        showHide(radio, item);
                    }

                    $radio.on("change", function () {
                        if ($hiddenValueInput)
                            $hiddenValueInput.val(radio.value);
                        showHide(radio, item);
                    });
                });
            });
        });
    });

    function showHide(radio, item) {
        var needsValidationUpdate = false;
        item.$ShowHideTargets.each(function () {
            var $target = $(this);

            // hide visible targets and disable inputs if appropriate (validation)
            var $container = $target;
            if ($container.is(".coral-Textfield, .coral-PathBrowser")) {
                $target.removeClass("hide");
                $container = $target.parent();
            }

            var $inputs = $container.find("input, foundation-autocomplete");

            $container.addClass("hide");
            if (hideInputs($inputs, item))
                needsValidationUpdate = true;

            // show/enable targets as appropriate, supporting multiple values in the target's data-showhidetargetvalue attribute
            var targetValues = $target.attr("data-showhidetargetvalue");
            if (targetValues !== undefined) {
                if ($.inArray(radio.value, targetValues.replace(/,\s+/g, ',').split(',')) !== -1) {
                    $container.removeClass("hide");
                    showInputs($inputs, item);
                }
            }
        });

        if (needsValidationUpdate && item.IsInMultifield)
            item.MultifieldValidator();
    }

    function hideInputs($inputs, item) {
        var needsValidationUpdate = false;

        $inputs.each(function () {
            var $input = $(this);
            if ($input.attr("required")) {
                $input.attr("data-was-required", "true");
                $input.removeAttr("required");
                needsValidationUpdate = true;
            }
            if ($input.attr("aria-required") === "true") {
                $input.attr("aria-was-required", "true");
                $input.removeAttr("aria-required");
                needsValidationUpdate = true;
            }
        });

        $inputs.attr("disabled", "disabled");

        return needsValidationUpdate;
    }

    function showInputs($inputs, item) {
        $inputs.each(function () {
            var $input = $(this);
            if ($input.attr("data-was-required")) {
                $input.attr("required", "required");
                $input.removeAttr("data-was-required");
            }
            if ($input.attr("aria-was-required") === "true") {
                $input.attr("aria-required", "true");
                $input.removeAttr("aria-was-required");
            }
        });

        $inputs.removeAttr("disabled");
    }

    function getMultifieldValidator(multifieldItem) {
        var $item = $(multifieldItem);
        if ($item.length === 0)
            return function(){};

        var validator;
        var registry = $(window).adaptTo("foundation-registry");
        return function() {
            if (!validator) {
                // get installed Granite UI validators matching the expected multifield selector
                var validators = $(registry.get("foundation.validation.validator")).map(function () {
                    return (this.selector === "[data-acs-commons-nested] >* input, [data-acs-commons-nested] >* textarea")
                        ? this : null;
                });
                if (validators.length === 0)
                    return;

                // multiple duplicate validators typically installed due to bug(s) in the acs-commons js
                validator = validators.last()[0];
            }

            var error = validator.validate($item);
            if (error) {
                validator.show($item, error);
            } else {
                validator.clear($item);
            }
        }
    }

})(document, Granite.$, Coral);
