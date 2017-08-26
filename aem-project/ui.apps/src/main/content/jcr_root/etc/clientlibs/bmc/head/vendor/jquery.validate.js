(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
if($('#leadgen') || $('#nonleadgen'))	{
	//Add hard limits to form fields, if they are not already defined
	if(!$('[data-type="C_Salutation1"]').attr('maxlength'))
		$('[data-type="C_Salutation1"]').attr('maxlength', '15');
	if(!$('[data-type="C_Title"]').attr('maxlength'))
		$('[data-type="C_Title"]').attr('maxlength', '75');
	if(!$('[data-type="C_Address1"]').attr('maxlength'))
		$('[data-type="C_Address1"]').attr('maxlength', '60');
	if(!$('[data-type="C_Address2"]').attr('maxlength'))
		$('[data-type="C_Address2"]').attr('maxlength', '60');
	if(!$('[data-type="C_Address3"]').attr('maxlength'))
		$('[data-type="C_Address3"]').attr('maxlength', '60');
	if(!$('[data-type="C_State_Prov"]').attr('maxlength'))
		$('[data-type="C_State_Prov"]').attr('maxlength', '20');
	if(!$('[data-type="C_Zip_Postal"]').attr('maxlength'))
		$('[data-type="C_Zip_Postal"]').attr('maxlength', '10');
	if(!$('[data-type="C_BusPhone"]').attr('maxlength'))
		$('[data-type="C_BusPhone"]').attr('maxlength', '40');
	

	//Switch-on reg-ex validations, if not already defined
	if(!$('[data-type="C_FirstName"]').attr('data-validation-type'))
		$('[data-type="C_FirstName"]').attr('data-validation-type', 'fname');
	if(!$('[data-type="C_LastName"]').attr('data-validation-type'))
		$('[data-type="C_LastName"]').attr('data-validation-type', 'lname');
	if(!$('[data-type="C_BusPhone"]').attr('data-validation-type'))
		$('[data-type="C_BusPhone"]').attr('data-validation-type', 'tel');
	

	//Milind: Commenting out this logic as we will update the FieldSet for Unsubscribe form
	//Change reg-ex validation pattern for Unsubscribe form
	/*
	if(typeof bmcMeta !== 'undefined' && bmcMeta.hasOwnProperty("form"))	{
		if(bmcMeta.form.name.toLowerCase().indexOf("unsubscribe") > -1)	{
			$('#C_EmailAddress').attr('type', 'text');
			$('#C_EmailAddress').attr('data-validation-type', 'allemails');
		}
	}
	*/
	
}	//EOC for Leadgen or NonLeadgen form	


(function($) {
	$.fn.validate = function() {
		var $this = this,
			$form = $(this),
			$inputs = $form.find('input, textarea, select'),
			$submitButton = $form.find('button[type="submit"]'),
			ajaxForm = $form.data('ajax-url') !== undefined;	// boolean that determines if a form is submitted with AJAX

		// initialize the form state
		$form.data('valid', true);
		enableLoadingState($submitButton);

		// base regex patterns; http://regex101.com/ is a good testing environment
		$this.patterns = {
			//'email' : "^[a-zA-Z][a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$",	// http://stackoverflow.com/a/8829363
			'email' : "^[a-zA-Z][a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]*@(?!(gmail\\.[a-zA-Z0-9.]+$)|(hotmail\\.[a-zA-Z0-9.]+$)|(zoho\\.[a-zA-Z0-9.]+$)|(yandex\\.[a-zA-Z0-9.]+$)|(outlook\\.[a-zA-Z0-9.]+$)|(aim\\.[a-zA-Z0-9.]+$)|(icloud\\.[a-zA-Z0-9.]+$)|(me\\.[a-zA-Z0-9.]+$)|(mac\\.[a-zA-Z0-9.]+$)|(yahoo\\.[a-zA-Z0-9.]+$)|(mail.com$)|(inbox\\.[a-zA-Z0-9.]+$)|(gmx\\.[a-zA-Z0-9.]+$)|(myway\\.[a-zA-Z0-9.]+$)|(msn\\.[a-zA-Z0-9.]+$))[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$",
			'allemails' : "^[a-zA-Z][a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$",
			//'tel' : "^[0-9-.]+$",	// this will allow numbers, hyphens, and periods
			'tel'	: "^([0-9-.+ ()]*\\d){10}[-.+ ()]*$",	// this will allow numbers, hyphens, periods, plus, space and open & close parenthesis AND at least 10 digits
			//'name' : "^[^0-9]+$"	// this will exclude numeric data
			'fname' : "^[^0-9 ][^0-9]{0,25}$",	// this will exclude numeric data and cannot begin with space
			'lname' : "^[^0-9 ][^0-9]{0,40}$",	// this will exclude numeric data and cannot begin with space
			
			//New regular expressions added to accomodate user-understandable options in CMS
			'email-business' : "^[a-zA-Z][a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]*@(?!(gmail\\.[a-zA-Z0-9.]+$)|(hotmail\\.[a-zA-Z0-9.]+$)|(zoho\\.[a-zA-Z0-9.]+$)|(yandex\\.[a-zA-Z0-9.]+$)|(outlook\\.[a-zA-Z0-9.]+$)|(aim\\.[a-zA-Z0-9.]+$)|(icloud\\.[a-zA-Z0-9.]+$)|(me\\.[a-zA-Z0-9.]+$)|(mac\\.[a-zA-Z0-9.]+$)|(yahoo\\.[a-zA-Z0-9.]+$)|(mail.com$)|(inbox\\.[a-zA-Z0-9.]+$)|(gmx\\.[a-zA-Z0-9.]+$)|(myway\\.[a-zA-Z0-9.]+$)|(msn\\.[a-zA-Z0-9.]+$))[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$",
			'email-business-competitor' : "^[a-zA-Z][a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]*@(?!(gmail\\.[a-zA-Z0-9.]+$)|(hotmail\\.[a-zA-Z0-9.]+$)|(zoho\\.[a-zA-Z0-9.]+$)|(yandex\\.[a-zA-Z0-9.]+$)|(outlook\\.[a-zA-Z0-9.]+$)|(aim\\.[a-zA-Z0-9.]+$)|(icloud\\.[a-zA-Z0-9.]+$)|(me\\.[a-zA-Z0-9.]+$)|(mac\\.[a-zA-Z0-9.]+$)|(yahoo\\.[a-zA-Z0-9.]+$)|(mail.com$)|(inbox\\.[a-zA-Z0-9.]+$)|(gmx\\.[a-zA-Z0-9.]+$)|(myway\\.[a-zA-Z0-9.]+$)|(ibm.com$)|(hpe.com$)|(hp.com$)|(chef.io$)|(tripwire.com$)|(servicenow.com$)|(bmc.com$)|(msn\\.[a-zA-Z0-9.]+$))[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$",
			'email-all' : "^[a-zA-Z][a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$",
			'alpha-only' : "^[^0-9 ][A-z ]+$",	//this will exclude numeric data and cannot begin with space but can have space in-between for double names
			'telephone-number'	: "^([0-9-.+ ()]*\\d){10}[-.+ ()]*$"	// this will allow numbers, hyphens, periods, plus, space and open & close parenthesis AND at least 10 digits
		};

		function disableLoadingState($element) {
			$element
				.attr('disabled', false)
				.removeClass('btn-loading');
		}

		function enableLoadingState($element) {
			$element
				.attr('disabled', 'disabled')
				.addClass('btn-loading');
		}

		// sets an input and the form as invalid
		function setInvalid($input, radioOrCheckbox, name) {
			// apply error styles
			if ($input.parent().is('.decorator-select')) {
				$input.parent().addClass('validation-error');
			}
			else if (radioOrCheckbox) {
				$('label[for="' + name + '"]').addClass('validation-error');
			}
			else {
				$input.addClass('validation-error');

				//Logic to show Error hint
				var err_hint = ($input.data('error-hint') != '') ? $input.data('error-hint') : $input.attr('placeholder');
				$input.prev('label:first').text(err_hint);
			}
			
			// reset to Original Label
      $input
        .on('keyup change', function() {
          if($input.val().length == 0)
            $input.prev('label:first').text($input.attr('placeholder'));
        });

			// remove error styles if a value is changed
			$input
				.on('keyup change', function() {
					$(this)
						.add('label[for="' + name + '"]')
						.removeClass('validation-error')
						.parent()
						.removeClass('validation-error');
				});

			$form
				.data('valid', false);
		}

		function scrollToForm() {
			$('html, body')
				.animate({
					scrollTop: $form.offset().top - 100
				}, 500);

			disableLoadingState($submitButton);
		}

		function scrollToInvalid() {
			$('html, body')
				.animate({
					scrollTop: $('.validation-error').offset().top - 100
				}, 500);

			disableLoadingState($submitButton);
		}
		
		// to be used for testing Unicode input
		function getLengthInBytes(str) {
		  var b = str.match(/[^\x00-\xff]/g);
		  return (str.length + (!b ? 0: b.length)); 
		}

		function submitValidAjaxForm() {
			var submittedObject = $form.serializeObject();

			// combine Topic of Interest with Comments
			submittedObject.C_Description1 = 'Topic of interest: ' + submittedObject.C_ProductInterest + '\r\nAdditional comments: ' + submittedObject.C_Description1;

			$.ajax({
				url: $form.data('ajax-url'),
				type: 'POST',
				dataType: 'HTML',
				data: submittedObject
			})
			.done(function(data) {
				$form
					.find('.validation-error')
					.remove()
					.end()
					.empty()
					.hide()
					.html('<h2>Thank you, ' + submittedObject.C_FirstName + '.</h2><p>We will be in touch soon to discuss your needs</p>')
					.fadeIn();

				scrollToForm();
			})
			// if the URL cannot be located
			.fail(function(jqXHR, textStatus, errorThrown) {
				$form
					.empty()
					.hide()
					.html('<p class="validation-error">' + errorThrown + '</p>')
					.fadeIn();

				scrollToForm();
			});
		}

		// validate each input
		$inputs
			.each(function() {
				var $input = $(this);
				if($input.get(0).getAttribute('required') != 'false'){
					var	value = $input.val(),
						required = $input.attr('required') !== undefined,
						type = $input.attr('type'),
						//Milind: Validation type gets higher precedence than type
						//validationType = (type === 'text') ? $input.data('validation-type') : type,
						validationType = ($input.data('validation-type')) ? $input.data('validation-type') : type,
					
						radioOrCheckbox = (type === 'radio' || type === 'checkbox'),
						name = $input.attr('name'),
						pattern;

					// test if the input is required
					if (required && (value === '' || value === null)) {
						setInvalid($input);
					}
					else if (required && radioOrCheckbox && $('[name="' + name + '"]:checked').length === 0) {
						setInvalid($input, radioOrCheckbox, name);
					}

					// test the input against its regex pattern
					if (required && $this.patterns[validationType]) {
						pattern = new RegExp($this.patterns[validationType]);

						if (!pattern.test(value.toLowerCase())) {
							setInvalid($input);
						}
					}

					// test for Unicode input i.e. non-English characters
					if (type == 'text') {
						//Char length != No. of Bytes := input is Unicode
						if (value.length != getLengthInBytes(value)) {
							setInvalid($input);
						}
					}

					// test if the honeypot is filled out
					if ($input.data('input-honeypot') && $input.val() !== '') {
						setInvalid($input);
					}
				}
			})
			.promise()
			.done(function() {
				if ($form.data('valid')) {
					if (ajaxForm) {
						submitValidAjaxForm();
					}
					else {
						$form.submit();
					}
				}
				else {
					scrollToInvalid();
				}
			});
	};
}) (jQuery);
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5LnZhbGlkYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaWYoJCgnI2xlYWRnZW4nKSB8fCAkKCcjbm9ubGVhZGdlbicpKVx0e1xuXHQvL0FkZCBoYXJkIGxpbWl0cyB0byBmb3JtIGZpZWxkcywgaWYgdGhleSBhcmUgbm90IGFscmVhZHkgZGVmaW5lZFxuXHRpZighJCgnW2RhdGEtdHlwZT1cIkNfU2FsdXRhdGlvbjFcIl0nKS5hdHRyKCdtYXhsZW5ndGgnKSlcblx0XHQkKCdbZGF0YS10eXBlPVwiQ19TYWx1dGF0aW9uMVwiXScpLmF0dHIoJ21heGxlbmd0aCcsICcxNScpO1xuXHRpZighJCgnW2RhdGEtdHlwZT1cIkNfVGl0bGVcIl0nKS5hdHRyKCdtYXhsZW5ndGgnKSlcblx0XHQkKCdbZGF0YS10eXBlPVwiQ19UaXRsZVwiXScpLmF0dHIoJ21heGxlbmd0aCcsICc3NScpO1xuXHRpZighJCgnW2RhdGEtdHlwZT1cIkNfQWRkcmVzczFcIl0nKS5hdHRyKCdtYXhsZW5ndGgnKSlcblx0XHQkKCdbZGF0YS10eXBlPVwiQ19BZGRyZXNzMVwiXScpLmF0dHIoJ21heGxlbmd0aCcsICc2MCcpO1xuXHRpZighJCgnW2RhdGEtdHlwZT1cIkNfQWRkcmVzczJcIl0nKS5hdHRyKCdtYXhsZW5ndGgnKSlcblx0XHQkKCdbZGF0YS10eXBlPVwiQ19BZGRyZXNzMlwiXScpLmF0dHIoJ21heGxlbmd0aCcsICc2MCcpO1xuXHRpZighJCgnW2RhdGEtdHlwZT1cIkNfQWRkcmVzczNcIl0nKS5hdHRyKCdtYXhsZW5ndGgnKSlcblx0XHQkKCdbZGF0YS10eXBlPVwiQ19BZGRyZXNzM1wiXScpLmF0dHIoJ21heGxlbmd0aCcsICc2MCcpO1xuXHRpZighJCgnW2RhdGEtdHlwZT1cIkNfU3RhdGVfUHJvdlwiXScpLmF0dHIoJ21heGxlbmd0aCcpKVxuXHRcdCQoJ1tkYXRhLXR5cGU9XCJDX1N0YXRlX1Byb3ZcIl0nKS5hdHRyKCdtYXhsZW5ndGgnLCAnMjAnKTtcblx0aWYoISQoJ1tkYXRhLXR5cGU9XCJDX1ppcF9Qb3N0YWxcIl0nKS5hdHRyKCdtYXhsZW5ndGgnKSlcblx0XHQkKCdbZGF0YS10eXBlPVwiQ19aaXBfUG9zdGFsXCJdJykuYXR0cignbWF4bGVuZ3RoJywgJzEwJyk7XG5cdGlmKCEkKCdbZGF0YS10eXBlPVwiQ19CdXNQaG9uZVwiXScpLmF0dHIoJ21heGxlbmd0aCcpKVxuXHRcdCQoJ1tkYXRhLXR5cGU9XCJDX0J1c1Bob25lXCJdJykuYXR0cignbWF4bGVuZ3RoJywgJzQwJyk7XG5cdFxuXG5cdC8vU3dpdGNoLW9uIHJlZy1leCB2YWxpZGF0aW9ucywgaWYgbm90IGFscmVhZHkgZGVmaW5lZFxuXHRpZighJCgnW2RhdGEtdHlwZT1cIkNfRmlyc3ROYW1lXCJdJykuYXR0cignZGF0YS12YWxpZGF0aW9uLXR5cGUnKSlcblx0XHQkKCdbZGF0YS10eXBlPVwiQ19GaXJzdE5hbWVcIl0nKS5hdHRyKCdkYXRhLXZhbGlkYXRpb24tdHlwZScsICdmbmFtZScpO1xuXHRpZighJCgnW2RhdGEtdHlwZT1cIkNfTGFzdE5hbWVcIl0nKS5hdHRyKCdkYXRhLXZhbGlkYXRpb24tdHlwZScpKVxuXHRcdCQoJ1tkYXRhLXR5cGU9XCJDX0xhc3ROYW1lXCJdJykuYXR0cignZGF0YS12YWxpZGF0aW9uLXR5cGUnLCAnbG5hbWUnKTtcblx0aWYoISQoJ1tkYXRhLXR5cGU9XCJDX0J1c1Bob25lXCJdJykuYXR0cignZGF0YS12YWxpZGF0aW9uLXR5cGUnKSlcblx0XHQkKCdbZGF0YS10eXBlPVwiQ19CdXNQaG9uZVwiXScpLmF0dHIoJ2RhdGEtdmFsaWRhdGlvbi10eXBlJywgJ3RlbCcpO1xuXHRcblxuXHQvL01pbGluZDogQ29tbWVudGluZyBvdXQgdGhpcyBsb2dpYyBhcyB3ZSB3aWxsIHVwZGF0ZSB0aGUgRmllbGRTZXQgZm9yIFVuc3Vic2NyaWJlIGZvcm1cblx0Ly9DaGFuZ2UgcmVnLWV4IHZhbGlkYXRpb24gcGF0dGVybiBmb3IgVW5zdWJzY3JpYmUgZm9ybVxuXHQvKlxuXHRpZih0eXBlb2YgYm1jTWV0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgYm1jTWV0YS5oYXNPd25Qcm9wZXJ0eShcImZvcm1cIikpXHR7XG5cdFx0aWYoYm1jTWV0YS5mb3JtLm5hbWUudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwidW5zdWJzY3JpYmVcIikgPiAtMSlcdHtcblx0XHRcdCQoJyNDX0VtYWlsQWRkcmVzcycpLmF0dHIoJ3R5cGUnLCAndGV4dCcpO1xuXHRcdFx0JCgnI0NfRW1haWxBZGRyZXNzJykuYXR0cignZGF0YS12YWxpZGF0aW9uLXR5cGUnLCAnYWxsZW1haWxzJyk7XG5cdFx0fVxuXHR9XG5cdCovXG5cdFxufVx0Ly9FT0MgZm9yIExlYWRnZW4gb3IgTm9uTGVhZGdlbiBmb3JtXHRcblxuXG4oZnVuY3Rpb24oJCkge1xuXHQkLmZuLnZhbGlkYXRlID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyICR0aGlzID0gdGhpcyxcblx0XHRcdCRmb3JtID0gJCh0aGlzKSxcblx0XHRcdCRpbnB1dHMgPSAkZm9ybS5maW5kKCdpbnB1dCwgdGV4dGFyZWEsIHNlbGVjdCcpLFxuXHRcdFx0JHN1Ym1pdEJ1dHRvbiA9ICRmb3JtLmZpbmQoJ2J1dHRvblt0eXBlPVwic3VibWl0XCJdJyksXG5cdFx0XHRhamF4Rm9ybSA9ICRmb3JtLmRhdGEoJ2FqYXgtdXJsJykgIT09IHVuZGVmaW5lZDtcdC8vIGJvb2xlYW4gdGhhdCBkZXRlcm1pbmVzIGlmIGEgZm9ybSBpcyBzdWJtaXR0ZWQgd2l0aCBBSkFYXG5cblx0XHQvLyBpbml0aWFsaXplIHRoZSBmb3JtIHN0YXRlXG5cdFx0JGZvcm0uZGF0YSgndmFsaWQnLCB0cnVlKTtcblx0XHRlbmFibGVMb2FkaW5nU3RhdGUoJHN1Ym1pdEJ1dHRvbik7XG5cblx0XHQvLyBiYXNlIHJlZ2V4IHBhdHRlcm5zOyBodHRwOi8vcmVnZXgxMDEuY29tLyBpcyBhIGdvb2QgdGVzdGluZyBlbnZpcm9ubWVudFxuXHRcdCR0aGlzLnBhdHRlcm5zID0ge1xuXHRcdFx0Ly8nZW1haWwnIDogXCJeW2EtekEtWl1bYS16QS1aMC05LiEjJCUmJyorLz0/Xl9ge3x9fi1dKkBbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8oPzpcXFxcLlthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPykrJFwiLFx0Ly8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvODgyOTM2M1xuXHRcdFx0J2VtYWlsJyA6IFwiXlthLXpBLVpdW2EtekEtWjAtOS4hIyQlJicqKy89P15fYHt8fX4tXSpAKD8hKGdtYWlsXFxcXC5bYS16QS1aMC05Ll0rJCl8KGhvdG1haWxcXFxcLlthLXpBLVowLTkuXSskKXwoem9ob1xcXFwuW2EtekEtWjAtOS5dKyQpfCh5YW5kZXhcXFxcLlthLXpBLVowLTkuXSskKXwob3V0bG9va1xcXFwuW2EtekEtWjAtOS5dKyQpfChhaW1cXFxcLlthLXpBLVowLTkuXSskKXwoaWNsb3VkXFxcXC5bYS16QS1aMC05Ll0rJCl8KG1lXFxcXC5bYS16QS1aMC05Ll0rJCl8KG1hY1xcXFwuW2EtekEtWjAtOS5dKyQpfCh5YWhvb1xcXFwuW2EtekEtWjAtOS5dKyQpfChtYWlsLmNvbSQpfChpbmJveFxcXFwuW2EtekEtWjAtOS5dKyQpfChnbXhcXFxcLlthLXpBLVowLTkuXSskKXwobXl3YXlcXFxcLlthLXpBLVowLTkuXSskKXwobXNuXFxcXC5bYS16QS1aMC05Ll0rJCkpW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KD86XFxcXC5bYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8pKyRcIixcblx0XHRcdCdhbGxlbWFpbHMnIDogXCJeW2EtekEtWl1bYS16QS1aMC05LiEjJCUmJyorLz0/Xl9ge3x9fi1dKkBbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8oPzpcXFxcLlthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPykrJFwiLFxuXHRcdFx0Ly8ndGVsJyA6IFwiXlswLTktLl0rJFwiLFx0Ly8gdGhpcyB3aWxsIGFsbG93IG51bWJlcnMsIGh5cGhlbnMsIGFuZCBwZXJpb2RzXG5cdFx0XHQndGVsJ1x0OiBcIl4oWzAtOS0uKyAoKV0qXFxcXGQpezEwfVstLisgKCldKiRcIixcdC8vIHRoaXMgd2lsbCBhbGxvdyBudW1iZXJzLCBoeXBoZW5zLCBwZXJpb2RzLCBwbHVzLCBzcGFjZSBhbmQgb3BlbiAmIGNsb3NlIHBhcmVudGhlc2lzIEFORCBhdCBsZWFzdCAxMCBkaWdpdHNcblx0XHRcdC8vJ25hbWUnIDogXCJeW14wLTldKyRcIlx0Ly8gdGhpcyB3aWxsIGV4Y2x1ZGUgbnVtZXJpYyBkYXRhXG5cdFx0XHQnZm5hbWUnIDogXCJeW14wLTkgXVteMC05XXswLDI1fSRcIixcdC8vIHRoaXMgd2lsbCBleGNsdWRlIG51bWVyaWMgZGF0YSBhbmQgY2Fubm90IGJlZ2luIHdpdGggc3BhY2Vcblx0XHRcdCdsbmFtZScgOiBcIl5bXjAtOSBdW14wLTldezAsNDB9JFwiLFx0Ly8gdGhpcyB3aWxsIGV4Y2x1ZGUgbnVtZXJpYyBkYXRhIGFuZCBjYW5ub3QgYmVnaW4gd2l0aCBzcGFjZVxuXHRcdFx0XG5cdFx0XHQvL05ldyByZWd1bGFyIGV4cHJlc3Npb25zIGFkZGVkIHRvIGFjY29tb2RhdGUgdXNlci11bmRlcnN0YW5kYWJsZSBvcHRpb25zIGluIENNU1xuXHRcdFx0J2VtYWlsLWJ1c2luZXNzJyA6IFwiXlthLXpBLVpdW2EtekEtWjAtOS4hIyQlJicqKy89P15fYHt8fX4tXSpAKD8hKGdtYWlsXFxcXC5bYS16QS1aMC05Ll0rJCl8KGhvdG1haWxcXFxcLlthLXpBLVowLTkuXSskKXwoem9ob1xcXFwuW2EtekEtWjAtOS5dKyQpfCh5YW5kZXhcXFxcLlthLXpBLVowLTkuXSskKXwob3V0bG9va1xcXFwuW2EtekEtWjAtOS5dKyQpfChhaW1cXFxcLlthLXpBLVowLTkuXSskKXwoaWNsb3VkXFxcXC5bYS16QS1aMC05Ll0rJCl8KG1lXFxcXC5bYS16QS1aMC05Ll0rJCl8KG1hY1xcXFwuW2EtekEtWjAtOS5dKyQpfCh5YWhvb1xcXFwuW2EtekEtWjAtOS5dKyQpfChtYWlsLmNvbSQpfChpbmJveFxcXFwuW2EtekEtWjAtOS5dKyQpfChnbXhcXFxcLlthLXpBLVowLTkuXSskKXwobXl3YXlcXFxcLlthLXpBLVowLTkuXSskKXwobXNuXFxcXC5bYS16QS1aMC05Ll0rJCkpW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KD86XFxcXC5bYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8pKyRcIixcblx0XHRcdCdlbWFpbC1idXNpbmVzcy1jb21wZXRpdG9yJyA6IFwiXlthLXpBLVpdW2EtekEtWjAtOS4hIyQlJicqKy89P15fYHt8fX4tXSpAKD8hKGdtYWlsXFxcXC5bYS16QS1aMC05Ll0rJCl8KGhvdG1haWxcXFxcLlthLXpBLVowLTkuXSskKXwoem9ob1xcXFwuW2EtekEtWjAtOS5dKyQpfCh5YW5kZXhcXFxcLlthLXpBLVowLTkuXSskKXwob3V0bG9va1xcXFwuW2EtekEtWjAtOS5dKyQpfChhaW1cXFxcLlthLXpBLVowLTkuXSskKXwoaWNsb3VkXFxcXC5bYS16QS1aMC05Ll0rJCl8KG1lXFxcXC5bYS16QS1aMC05Ll0rJCl8KG1hY1xcXFwuW2EtekEtWjAtOS5dKyQpfCh5YWhvb1xcXFwuW2EtekEtWjAtOS5dKyQpfChtYWlsLmNvbSQpfChpbmJveFxcXFwuW2EtekEtWjAtOS5dKyQpfChnbXhcXFxcLlthLXpBLVowLTkuXSskKXwobXl3YXlcXFxcLlthLXpBLVowLTkuXSskKXwoaWJtLmNvbSQpfChocGUuY29tJCl8KGhwLmNvbSQpfChjaGVmLmlvJCl8KHRyaXB3aXJlLmNvbSQpfChzZXJ2aWNlbm93LmNvbSQpfChibWMuY29tJCl8KG1zblxcXFwuW2EtekEtWjAtOS5dKyQpKVthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPyg/OlxcXFwuW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KSskXCIsXG5cdFx0XHQnZW1haWwtYWxsJyA6IFwiXlthLXpBLVpdW2EtekEtWjAtOS4hIyQlJicqKy89P15fYHt8fX4tXSpAW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KD86XFxcXC5bYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8pKyRcIixcblx0XHRcdCdhbHBoYS1vbmx5JyA6IFwiXlteMC05IF1bQS16IF0rJFwiLFx0Ly90aGlzIHdpbGwgZXhjbHVkZSBudW1lcmljIGRhdGEgYW5kIGNhbm5vdCBiZWdpbiB3aXRoIHNwYWNlIGJ1dCBjYW4gaGF2ZSBzcGFjZSBpbi1iZXR3ZWVuIGZvciBkb3VibGUgbmFtZXNcblx0XHRcdCd0ZWxlcGhvbmUtbnVtYmVyJ1x0OiBcIl4oWzAtOS0uKyAoKV0qXFxcXGQpezEwfVstLisgKCldKiRcIlx0Ly8gdGhpcyB3aWxsIGFsbG93IG51bWJlcnMsIGh5cGhlbnMsIHBlcmlvZHMsIHBsdXMsIHNwYWNlIGFuZCBvcGVuICYgY2xvc2UgcGFyZW50aGVzaXMgQU5EIGF0IGxlYXN0IDEwIGRpZ2l0c1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBkaXNhYmxlTG9hZGluZ1N0YXRlKCRlbGVtZW50KSB7XG5cdFx0XHQkZWxlbWVudFxuXHRcdFx0XHQuYXR0cignZGlzYWJsZWQnLCBmYWxzZSlcblx0XHRcdFx0LnJlbW92ZUNsYXNzKCdidG4tbG9hZGluZycpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGVuYWJsZUxvYWRpbmdTdGF0ZSgkZWxlbWVudCkge1xuXHRcdFx0JGVsZW1lbnRcblx0XHRcdFx0LmF0dHIoJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJylcblx0XHRcdFx0LmFkZENsYXNzKCdidG4tbG9hZGluZycpO1xuXHRcdH1cblxuXHRcdC8vIHNldHMgYW4gaW5wdXQgYW5kIHRoZSBmb3JtIGFzIGludmFsaWRcblx0XHRmdW5jdGlvbiBzZXRJbnZhbGlkKCRpbnB1dCwgcmFkaW9PckNoZWNrYm94LCBuYW1lKSB7XG5cdFx0XHQvLyBhcHBseSBlcnJvciBzdHlsZXNcblx0XHRcdGlmICgkaW5wdXQucGFyZW50KCkuaXMoJy5kZWNvcmF0b3Itc2VsZWN0JykpIHtcblx0XHRcdFx0JGlucHV0LnBhcmVudCgpLmFkZENsYXNzKCd2YWxpZGF0aW9uLWVycm9yJyk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChyYWRpb09yQ2hlY2tib3gpIHtcblx0XHRcdFx0JCgnbGFiZWxbZm9yPVwiJyArIG5hbWUgKyAnXCJdJykuYWRkQ2xhc3MoJ3ZhbGlkYXRpb24tZXJyb3InKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHQkaW5wdXQuYWRkQ2xhc3MoJ3ZhbGlkYXRpb24tZXJyb3InKTtcblxuXHRcdFx0XHQvL0xvZ2ljIHRvIHNob3cgRXJyb3IgaGludFxuXHRcdFx0XHR2YXIgZXJyX2hpbnQgPSAoJGlucHV0LmRhdGEoJ2Vycm9yLWhpbnQnKSAhPSAnJykgPyAkaW5wdXQuZGF0YSgnZXJyb3ItaGludCcpIDogJGlucHV0LmF0dHIoJ3BsYWNlaG9sZGVyJyk7XG5cdFx0XHRcdCRpbnB1dC5wcmV2KCdsYWJlbDpmaXJzdCcpLnRleHQoZXJyX2hpbnQpO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHQvLyByZXNldCB0byBPcmlnaW5hbCBMYWJlbFxuICAgICAgJGlucHV0XG4gICAgICAgIC5vbigna2V5dXAgY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYoJGlucHV0LnZhbCgpLmxlbmd0aCA9PSAwKVxuICAgICAgICAgICAgJGlucHV0LnByZXYoJ2xhYmVsOmZpcnN0JykudGV4dCgkaW5wdXQuYXR0cigncGxhY2Vob2xkZXInKSk7XG4gICAgICAgIH0pO1xuXG5cdFx0XHQvLyByZW1vdmUgZXJyb3Igc3R5bGVzIGlmIGEgdmFsdWUgaXMgY2hhbmdlZFxuXHRcdFx0JGlucHV0XG5cdFx0XHRcdC5vbigna2V5dXAgY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCh0aGlzKVxuXHRcdFx0XHRcdFx0LmFkZCgnbGFiZWxbZm9yPVwiJyArIG5hbWUgKyAnXCJdJylcblx0XHRcdFx0XHRcdC5yZW1vdmVDbGFzcygndmFsaWRhdGlvbi1lcnJvcicpXG5cdFx0XHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0XHRcdC5yZW1vdmVDbGFzcygndmFsaWRhdGlvbi1lcnJvcicpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0JGZvcm1cblx0XHRcdFx0LmRhdGEoJ3ZhbGlkJywgZmFsc2UpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNjcm9sbFRvRm9ybSgpIHtcblx0XHRcdCQoJ2h0bWwsIGJvZHknKVxuXHRcdFx0XHQuYW5pbWF0ZSh7XG5cdFx0XHRcdFx0c2Nyb2xsVG9wOiAkZm9ybS5vZmZzZXQoKS50b3AgLSAxMDBcblx0XHRcdFx0fSwgNTAwKTtcblxuXHRcdFx0ZGlzYWJsZUxvYWRpbmdTdGF0ZSgkc3VibWl0QnV0dG9uKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzY3JvbGxUb0ludmFsaWQoKSB7XG5cdFx0XHQkKCdodG1sLCBib2R5Jylcblx0XHRcdFx0LmFuaW1hdGUoe1xuXHRcdFx0XHRcdHNjcm9sbFRvcDogJCgnLnZhbGlkYXRpb24tZXJyb3InKS5vZmZzZXQoKS50b3AgLSAxMDBcblx0XHRcdFx0fSwgNTAwKTtcblxuXHRcdFx0ZGlzYWJsZUxvYWRpbmdTdGF0ZSgkc3VibWl0QnV0dG9uKTtcblx0XHR9XG5cdFx0XG5cdFx0Ly8gdG8gYmUgdXNlZCBmb3IgdGVzdGluZyBVbmljb2RlIGlucHV0XG5cdFx0ZnVuY3Rpb24gZ2V0TGVuZ3RoSW5CeXRlcyhzdHIpIHtcblx0XHQgIHZhciBiID0gc3RyLm1hdGNoKC9bXlxceDAwLVxceGZmXS9nKTtcblx0XHQgIHJldHVybiAoc3RyLmxlbmd0aCArICghYiA/IDA6IGIubGVuZ3RoKSk7IFxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHN1Ym1pdFZhbGlkQWpheEZvcm0oKSB7XG5cdFx0XHR2YXIgc3VibWl0dGVkT2JqZWN0ID0gJGZvcm0uc2VyaWFsaXplT2JqZWN0KCk7XG5cblx0XHRcdC8vIGNvbWJpbmUgVG9waWMgb2YgSW50ZXJlc3Qgd2l0aCBDb21tZW50c1xuXHRcdFx0c3VibWl0dGVkT2JqZWN0LkNfRGVzY3JpcHRpb24xID0gJ1RvcGljIG9mIGludGVyZXN0OiAnICsgc3VibWl0dGVkT2JqZWN0LkNfUHJvZHVjdEludGVyZXN0ICsgJ1xcclxcbkFkZGl0aW9uYWwgY29tbWVudHM6ICcgKyBzdWJtaXR0ZWRPYmplY3QuQ19EZXNjcmlwdGlvbjE7XG5cblx0XHRcdCQuYWpheCh7XG5cdFx0XHRcdHVybDogJGZvcm0uZGF0YSgnYWpheC11cmwnKSxcblx0XHRcdFx0dHlwZTogJ1BPU1QnLFxuXHRcdFx0XHRkYXRhVHlwZTogJ0hUTUwnLFxuXHRcdFx0XHRkYXRhOiBzdWJtaXR0ZWRPYmplY3Rcblx0XHRcdH0pXG5cdFx0XHQuZG9uZShmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdCRmb3JtXG5cdFx0XHRcdFx0LmZpbmQoJy52YWxpZGF0aW9uLWVycm9yJylcblx0XHRcdFx0XHQucmVtb3ZlKClcblx0XHRcdFx0XHQuZW5kKClcblx0XHRcdFx0XHQuZW1wdHkoKVxuXHRcdFx0XHRcdC5oaWRlKClcblx0XHRcdFx0XHQuaHRtbCgnPGgyPlRoYW5rIHlvdSwgJyArIHN1Ym1pdHRlZE9iamVjdC5DX0ZpcnN0TmFtZSArICcuPC9oMj48cD5XZSB3aWxsIGJlIGluIHRvdWNoIHNvb24gdG8gZGlzY3VzcyB5b3VyIG5lZWRzPC9wPicpXG5cdFx0XHRcdFx0LmZhZGVJbigpO1xuXG5cdFx0XHRcdHNjcm9sbFRvRm9ybSgpO1xuXHRcdFx0fSlcblx0XHRcdC8vIGlmIHRoZSBVUkwgY2Fubm90IGJlIGxvY2F0ZWRcblx0XHRcdC5mYWlsKGZ1bmN0aW9uKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikge1xuXHRcdFx0XHQkZm9ybVxuXHRcdFx0XHRcdC5lbXB0eSgpXG5cdFx0XHRcdFx0LmhpZGUoKVxuXHRcdFx0XHRcdC5odG1sKCc8cCBjbGFzcz1cInZhbGlkYXRpb24tZXJyb3JcIj4nICsgZXJyb3JUaHJvd24gKyAnPC9wPicpXG5cdFx0XHRcdFx0LmZhZGVJbigpO1xuXG5cdFx0XHRcdHNjcm9sbFRvRm9ybSgpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Ly8gdmFsaWRhdGUgZWFjaCBpbnB1dFxuXHRcdCRpbnB1dHNcblx0XHRcdC5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgJGlucHV0ID0gJCh0aGlzKTtcblx0XHRcdFx0aWYoJGlucHV0LmdldCgwKS5nZXRBdHRyaWJ1dGUoJ3JlcXVpcmVkJykgIT0gJ2ZhbHNlJyl7XG5cdFx0XHRcdFx0dmFyXHR2YWx1ZSA9ICRpbnB1dC52YWwoKSxcblx0XHRcdFx0XHRcdHJlcXVpcmVkID0gJGlucHV0LmF0dHIoJ3JlcXVpcmVkJykgIT09IHVuZGVmaW5lZCxcblx0XHRcdFx0XHRcdHR5cGUgPSAkaW5wdXQuYXR0cigndHlwZScpLFxuXHRcdFx0XHRcdFx0Ly9NaWxpbmQ6IFZhbGlkYXRpb24gdHlwZSBnZXRzIGhpZ2hlciBwcmVjZWRlbmNlIHRoYW4gdHlwZVxuXHRcdFx0XHRcdFx0Ly92YWxpZGF0aW9uVHlwZSA9ICh0eXBlID09PSAndGV4dCcpID8gJGlucHV0LmRhdGEoJ3ZhbGlkYXRpb24tdHlwZScpIDogdHlwZSxcblx0XHRcdFx0XHRcdHZhbGlkYXRpb25UeXBlID0gKCRpbnB1dC5kYXRhKCd2YWxpZGF0aW9uLXR5cGUnKSkgPyAkaW5wdXQuZGF0YSgndmFsaWRhdGlvbi10eXBlJykgOiB0eXBlLFxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0cmFkaW9PckNoZWNrYm94ID0gKHR5cGUgPT09ICdyYWRpbycgfHwgdHlwZSA9PT0gJ2NoZWNrYm94JyksXG5cdFx0XHRcdFx0XHRuYW1lID0gJGlucHV0LmF0dHIoJ25hbWUnKSxcblx0XHRcdFx0XHRcdHBhdHRlcm47XG5cblx0XHRcdFx0XHQvLyB0ZXN0IGlmIHRoZSBpbnB1dCBpcyByZXF1aXJlZFxuXHRcdFx0XHRcdGlmIChyZXF1aXJlZCAmJiAodmFsdWUgPT09ICcnIHx8IHZhbHVlID09PSBudWxsKSkge1xuXHRcdFx0XHRcdFx0c2V0SW52YWxpZCgkaW5wdXQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIGlmIChyZXF1aXJlZCAmJiByYWRpb09yQ2hlY2tib3ggJiYgJCgnW25hbWU9XCInICsgbmFtZSArICdcIl06Y2hlY2tlZCcpLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdFx0c2V0SW52YWxpZCgkaW5wdXQsIHJhZGlvT3JDaGVja2JveCwgbmFtZSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gdGVzdCB0aGUgaW5wdXQgYWdhaW5zdCBpdHMgcmVnZXggcGF0dGVyblxuXHRcdFx0XHRcdGlmIChyZXF1aXJlZCAmJiAkdGhpcy5wYXR0ZXJuc1t2YWxpZGF0aW9uVHlwZV0pIHtcblx0XHRcdFx0XHRcdHBhdHRlcm4gPSBuZXcgUmVnRXhwKCR0aGlzLnBhdHRlcm5zW3ZhbGlkYXRpb25UeXBlXSk7XG5cblx0XHRcdFx0XHRcdGlmICghcGF0dGVybi50ZXN0KHZhbHVlLnRvTG93ZXJDYXNlKCkpKSB7XG5cdFx0XHRcdFx0XHRcdHNldEludmFsaWQoJGlucHV0KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyB0ZXN0IGZvciBVbmljb2RlIGlucHV0IGkuZS4gbm9uLUVuZ2xpc2ggY2hhcmFjdGVyc1xuXHRcdFx0XHRcdGlmICh0eXBlID09ICd0ZXh0Jykge1xuXHRcdFx0XHRcdFx0Ly9DaGFyIGxlbmd0aCAhPSBOby4gb2YgQnl0ZXMgOj0gaW5wdXQgaXMgVW5pY29kZVxuXHRcdFx0XHRcdFx0aWYgKHZhbHVlLmxlbmd0aCAhPSBnZXRMZW5ndGhJbkJ5dGVzKHZhbHVlKSkge1xuXHRcdFx0XHRcdFx0XHRzZXRJbnZhbGlkKCRpbnB1dCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gdGVzdCBpZiB0aGUgaG9uZXlwb3QgaXMgZmlsbGVkIG91dFxuXHRcdFx0XHRcdGlmICgkaW5wdXQuZGF0YSgnaW5wdXQtaG9uZXlwb3QnKSAmJiAkaW5wdXQudmFsKCkgIT09ICcnKSB7XG5cdFx0XHRcdFx0XHRzZXRJbnZhbGlkKCRpbnB1dCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnByb21pc2UoKVxuXHRcdFx0LmRvbmUoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICgkZm9ybS5kYXRhKCd2YWxpZCcpKSB7XG5cdFx0XHRcdFx0aWYgKGFqYXhGb3JtKSB7XG5cdFx0XHRcdFx0XHRzdWJtaXRWYWxpZEFqYXhGb3JtKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0JGZvcm0uc3VibWl0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHNjcm9sbFRvSW52YWxpZCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0fTtcbn0pIChqUXVlcnkpOyJdfQ==
