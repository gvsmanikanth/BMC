/**
 * Extension to the standard checkbox component. It enables/disables  other components based on the
 * selection made in the checkbox.
 */
(function(document, $) {
    "use strict";

    // when dialog gets injected
    $(document).on("foundation-contentloaded", function(e) {
        // if there is already an inital value make sure the according target element becomes visible
        console.log($(".bmc-cq-dialog-add-heading-name > .coral-Multifield-add").html($(".bmc-cq-dialog-add-heading-name").attr( 'data-label' )));
        console.log($(".bmc-cq-dialog-add-resource-name > .coral-Multifield-add").html($(".bmc-cq-dialog-add-resource-name").attr( 'data-label' )));
    });
})(document,Granite.$);