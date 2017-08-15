(function(document, $) {
    "use strict";

    // when dialog gets injected
    $(document).on("foundation-contentloaded", function(e) {
        // if there is already an inital value make sure the according target element becomes visible
        enableDisable($(".keysight-cq-dialog-dropdown-showhide", e.target));
    });

    $(document).on("selected", ".keysight-cq-dialog-dropdown-showhide", function(e) {
        enableDisable($(this));
    });

    function enableDisable(el){
        el.each(function(i, element) {

            var widget = $(element).data("select");

            if (widget) {

                // get the selector to find the target elements. its stored as data-.. attribute
                var target = $(element).data("cqDialogDropdownShowhideTarget");

                // get the selected value
                var value = widget.getValue();
                // make sure all unselected target elements are hidden.

                $(target).not(".hide").addClass("hide"); // NB: deprecated (use hidden attribute in the future)


                // unhide the target element that contains the selected value as data-showhidetargetvalue attribute
                $(target).filter("[data-showhidetargetvalue='" + value + "']").each(function(){
                        $(this).removeClass("hide");
                });
                if(value != "litStation"){
                	$(".videoElement").removeClass("hide");
                }
            }
        })
    }
})(document,Granite.$);