/**
 * Extension to the standard checkbox component. It enables/disables  other components based on the
 * selection made in the checkbox.
 */
(function(document, $) {
    "use strict";

    // when dialog gets injected
    $(document).on("foundation-contentloaded", function(e) {
        // if there is already an inital value make sure the according target element becomes visible
        enableDisable($(".keysight-cq-dialog-checkbox-inherit", e.target));
    });

    $(document).on("change", ".keysight-cq-dialog-checkbox-inherit", function(e) {
        enableDisable($(this));
    });

    function enableDisable(el){
        el.each(function(i, element) {
            if ($(element).attr("type") === "checkbox"){
                if ($(element).prop('checked')){
                    $('.inherit-checkbox-field').hide();
                } else {
                    $('.inherit-checkbox-field').show();
                }
            }
        })
    }
})(document,Granite.$);