/*******************************************************************************
 * Copyright 2016 Adobe Systems Incorporated
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
(function ($, channel, Coral) {
    'use strict';
    var EDIT_DIALOG = "foundation-autocomplete[name='./PURLPageUrl']";
    console.log("dialog js loaded");

    /**
     * Initialise the conditional display of the various elements of the dialog
     * @param dialog The dialog on which the operation is to be performed
     */
    function initialise(dialog, url) {
        var field = $(dialog).find(EDIT_DIALOG).find("input");
        if ($(field).val() == "") {
            var pageName = getPageName(url);
            $(field).val(pageName + "/ty");
        }
    }

    function getPageName(url) {
        var slice = '/editor.html/';
        return url.slice(url.indexOf(slice) + slice.length - 1, url.lastIndexOf("."));
    }

    channel.on("foundation-contentloaded", function (e) {
        if ($(e.target).find(EDIT_DIALOG).length > 0) {
            Coral.commons.ready(e.target, function (component) {
                initialise(component, channel[0].URL);
            });
        }
    });

})(jQuery, jQuery(document), Coral);
