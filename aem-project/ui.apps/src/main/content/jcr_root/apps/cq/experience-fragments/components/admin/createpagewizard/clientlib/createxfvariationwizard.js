/*******************************************************************************
 * ADOBE CONFIDENTIAL
 * __________________
 *
 * Copyright 2016 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 ******************************************************************************/

;(function ($) {

    $(function () {
        $("#createxfvariation").click(function () {
            setTimeout(function () {
                var firstInput = $("input[type='text']:first");
                firstInput.focus(function () {
                    // Set cursor at the end of the input
                    var self = this;
                    setTimeout(function(){ self.selectionStart = self.selectionEnd = 10000; });
                });
                firstInput.focus();
            }, 200);
        });
    });

})(jQuery);