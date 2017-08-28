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
    var FIELD_TYPE = '.cmp-form-textfield-types';
    var EDIT_DIALOG = ".cmp-form-textfield-editDialog";
    var OPTIONS_REQUIRED = ".cmp-form-textfield-required";
    var VALIDATION_TYPES = '.cmp-form-validation-types';
    var REQUIRED_MESSAGE = '.cmp-form-textfield-constraintmessage';


    /**
     * Initialise the conditional display of the various elements of the dialog
     * @param dialog The dialog on which the operation is to be performed
     */
    function initialise(dialog) {
        syncValidationTypes(false);
        $(FIELD_TYPE).on('change', function(){
            syncValidationTypes(true);
        });

        $(OPTIONS_REQUIRED).on('change', function(){
            syncValidationTypes(true);
        });
    }

    function syncValidationTypes(reset){
        var ignoredFieldTypes = ['textarea', 'date', 'number', 'tel', 'password'];
        var textValidationTypes = ['none', 'alpha-only', 'first-name', 'last-name'];
        var emailValidationTypes = ['none', 'email-all', 'email-business', 'email-business-competitor'];

        //disable or enable, access to the validation select list, based on of if field type is flagged as an ignored type or not.
        if($.inArray($(FIELD_TYPE).val(), ignoredFieldTypes) !== -1){
                $(VALIDATION_TYPES).parent().hide(); //hide validation types select list
        } else {
            if($(OPTIONS_REQUIRED).attr('checked')){
                $(VALIDATION_TYPES).parent().show(); //show validation types select list (but only if required is checked as well)
            }
        }

        //prime validation select list, based on text field type
        if($(FIELD_TYPE).val() == 'text'){
            $(VALIDATION_TYPES).find('coral-selectlist-item').each(function(i){
                $(this).hide();               
               if($.inArray($(this).val(), textValidationTypes) !== -1 || i === 0){
                    $(this).show();
                }
            }); 
            if(reset === true){ $(VALIDATION_TYPES).val(0); }
        }

        //prime validation select list, based on email field types
        if($(FIELD_TYPE).val() == 'email'){
            $(VALIDATION_TYPES).find('coral-selectlist-item').each(function(i){
                $(this).hide();
                if($.inArray($(this).val(), emailValidationTypes) !== -1 || i === 0){
                    $(this).show();
                }
            }); 
           if(reset === true){ $(VALIDATION_TYPES).val(0); } //always set validaiton type value to 0 as none to start with
        }         
    }

    channel.on("foundation-contentloaded", function (e) {
        if ($(e.target).find(EDIT_DIALOG).length > 0) {
            Coral.commons.ready(e.target, function (component) {
                initialise(component);
            });
        }
    });

})(jQuery, jQuery(document), Coral);
