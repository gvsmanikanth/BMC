(function (document, $) {
    "use strict";

    // when dialog gets injected
    $(document).on("foundation-contentloaded", function (e) {
        // if there is already an inital value make sure the according target element becomes visible
        showHideHandler($(".cq-dialog-dropdown-showhide", e.target));
    });

    $(document).on("selected", ".cq-dialog-dropdown-showhide", function (e) {
        showHideHandler($(this));
    });

    function showHideHandler(el) {
        el.each(function (i, element) {
            if($(element).is("coral-select")) {
                // handle Coral3 base drop-down
                Coral.commons.ready(element, function (component) {
                    showHide(component, element);
                    component.on("change", function () {
                        showHide(component, element);
                    });
                });
            } else {
                // handle Coral2 based drop-down
                var component = $(element).data("select");
                if (component) {
                    showHide(component, element);
                }
            }
        })
    }

    function showHide(component, element) {
        // get the selector to find the target elements. its stored as data-.. attribute
        var target = $(element).data("cqDialogDropdownShowhideTarget");
        var $target = $(target);

        if (target) {
            var value;
            if (typeof component.selectedItem.value !== "undefined") {
                value = component.selectedItem.value;
            } else if (typeof component.getValue === "function") {
                value = component.getValue();
            }

            // make sure all unselected target elements are hidden.
            $target.not(".hide").addClass("hide");

            // unhide the target element that contains the selected value as data-showhidetargetvalue attribute
            $target.filter("[data-showhidetargetvalue='" + value + "']").removeClass("hide"); // deprecated
        }
    }

})(document, Granite.$);