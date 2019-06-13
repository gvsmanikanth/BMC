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

(function ($) {
    'use strict';

  function showorhidecaption() {
         if($('.dropdownselect option:selected').val() == 'align_bottom'){
        /*$('.hide-for-tab').addClass("hide");
        $('.hide-for-tab-caption-popup').addClass("hide");
        $('.core-image-hyperlink').addClass("hide");*/
		
		$('.core-image-link .coral-InputGroup-input').attr('disabled','disabled');
		$('.hide-for-tab-caption-popup .coral-Checkbox-input').attr('disabled','disabled');
		$('.core-image-hyperlink .coral-Checkbox-input').attr('disabled','disabled');
    }else{
		/*$('.hide-for-tab').removeClass("hide");
        $('.hide-for-tab-caption-popup').removeClass("hide");
        $('.core-image-hyperlink').removeClass("hide");*/
		
		$('.core-image-link .coral-InputGroup-input').removeAttr('disabled');
		$('.hide-for-tab-caption-popup .coral-Checkbox-input').removeAttr('disabled');
		$('.core-image-hyperlink .coral-Checkbox-input').removeAttr('disabled');
    }
  }

    $(document).on("coral-component:attached", function(e) {
showorhidecaption();
});


$(document).on("selected", ".dropdownselect", function(e) {
   showorhidecaption();
});


    function toggleInputs(isDecorative) {

        var alt = $(".core-image-alt");
        var link = $(".core-image-link");
        var hyperlink =$(".core-image-hyperlink");
        if (isDecorative.checked) {
            alt.addClass("hide");
            alt.find("input").attr("aria-required", "false");
            link.addClass("hide");
 			hyperlink.addClass("hide");
        } else {
            alt.removeClass("hide");
            alt.find("input").attr("aria-required", "true");
            link.removeClass("hide");
            hyperlink.removeClass("hide");
        }
    }

    $(document).on("coral-component:attached", ".core-image-decorative", function(e) {
        toggleInputs(e.target);
    });

    $(document).on("change", ".core-image-decorative", function(e) {
        toggleInputs(e.target);
    });

  $(document).on("coral-component:attached", ".dropdownselect", function(e) {

      console.log("11"+e.target);
    });

    $(document).on("change", ".dropdownselect", function(e) {
        console.log("22"+e.target);
    });



})(jQuery);
