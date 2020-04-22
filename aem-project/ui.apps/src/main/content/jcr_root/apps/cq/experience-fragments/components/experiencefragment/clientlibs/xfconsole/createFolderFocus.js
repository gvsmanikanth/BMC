/*
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
 */

;(function($, ns, channel) {

    channel.on('coral-overlay:open', function(event){
        var form = $(event.target).find('form');
        if(form && form.attr('id') == 'cq-common-createfolderform') {
            form.find('input:first').focus();
        }
    });

})(jQuery, Granite.author, $(document));