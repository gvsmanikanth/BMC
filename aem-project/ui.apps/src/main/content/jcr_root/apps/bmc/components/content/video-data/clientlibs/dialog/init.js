(function (document, $, Coral) {
    "use strict";
    var dialogContentHeight = "38rem";

    $(document).on("foundation-contentloaded", function (e) {
        $(".cq-dialog-floating .cq-dialog-content").css("height", dialogContentHeight);
    });
})(document, Granite.$, Coral);