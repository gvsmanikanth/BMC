/**
 * Extension to the standard checkbox component. It enables/disables  other components based on the
 * selection made in the checkbox.
 */
(function(document, $) {
    "use strict";

    // when dialog gets injected
    $(document).on("foundation-contentloaded", function(e) {
        // if there is already an inital value make sure the according target element becomes visible
        $(".cq-FileUpload-label").html("Drop an asset here from the DAM");
    });
})(document,Granite.$);