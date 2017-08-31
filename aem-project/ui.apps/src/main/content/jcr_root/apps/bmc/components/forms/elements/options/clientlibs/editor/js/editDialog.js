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
    var FIELD_TYPE = '.cmp-form-options-type';
    var EDIT_DIALOG = ".core-wcm-form-options-v1";
    var OPTIONS_REQUIRED = ".cmp-form-textfield-required";
    var VALIDATION_TYPES = '.cmp-form-validation-types';
    var REQUIRED_MESSAGE = '.cmp-form-textfield-constraintmessage';
    var MULTI_OPTIONS = 'data-granite-coral-multifield-composite';
    var MULTI_OPTION = 'coral-multifield-item';
    var MULTI_REMOVE = '.coral-Multifield-remove';
    var MULTI_ADD = 'coral-multifield > button';

    /**
     * Initialise the conditional display of the various elements of the dialog
     * @param dialog The dialog on which the operation is to be performed
     */
    function initialise(dialog) {
        
        if(!$(OPTIONS_REQUIRED).attr('checked')){
            $(REQUIRED_MESSAGE).hide();         
        }

        $(OPTIONS_REQUIRED).on('click', function(e){
            if(!this.hasAttribute('checked')){
                $(REQUIRED_MESSAGE).show();
            }else{
                $(REQUIRED_MESSAGE).hide();
            }
        });

        $(FIELD_TYPE).on('change', function(){
            $(REQUIRED_MESSAGE).hide();
            $(VALIDATION_TYPES).hide();
            $(OPTIONS_REQUIRED).removeAttr('checked');
            $(MULTI_OPTION).each(function(){
                $(this).remove();
            });
            $(MULTI_ADD).show();
        });

        $('['+MULTI_OPTIONS+']').on('click', function(e){
            var target = $(e.target); 
            if($(FIELD_TYPE).val() == 'checkbox'){
                if($(MULTI_REMOVE).length > 0){
                    $(MULTI_ADD).hide();
                }else{
                    $(MULTI_ADD).show();
                }
            }
        }).trigger('click');

    }

    channel.on("foundation-contentloaded", function (e) {
        if ($(e.target).find(EDIT_DIALOG).length > 0) {
            Coral.commons.ready(e.target, function (component) {
                initialise(component);
            });
        }
    });

})(jQuery, jQuery(document), Coral);
