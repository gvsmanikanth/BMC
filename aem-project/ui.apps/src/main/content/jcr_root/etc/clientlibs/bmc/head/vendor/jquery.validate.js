(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noscope = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
if($('#leadgen') || $('#nonleadgen'))	{
	//Add hard limits to form fields, if they are not already defined
	if(!$('#C_Salutation1').attr('maxlength'))
		$('#C_Salutation1').attr('maxlength', '15');
	if(!$('#C_Title').attr('maxlength'))
		$('#C_Title').attr('maxlength', '75');
	if(!$('#C_Address1').attr('maxlength'))
		$('#C_Address1').attr('maxlength', '60');
	if(!$('#C_Address2').attr('maxlength'))
		$('#C_Address2').attr('maxlength', '60');
	if(!$('#C_Address3').attr('maxlength'))
		$('#C_Address3').attr('maxlength', '60');
	if(!$('#C_State_Prov').attr('maxlength'))
		$('#C_State_Prov').attr('maxlength', '20');
	if(!$('#C_Zip_Postal').attr('maxlength'))
		$('#C_Zip_Postal').attr('maxlength', '10');
	if(!$('#C_BusPhone').attr('maxlength'))
		$('#C_BusPhone').attr('maxlength', '40');
	

	//Switch-on reg-ex validations, if not already defined
	if(!$('#C_FirstName').attr('data-validation-type'))
		$('#C_FirstName').attr('data-validation-type', 'fname');
	if(!$('#C_LastName').attr('data-validation-type'))
		$('#C_LastName').attr('data-validation-type', 'lname');
	if(!$('#C_BusPhone').attr('data-validation-type'))
		$('#C_BusPhone').attr('data-validation-type', 'tel');
	
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
				var $input = $(this),
					value = $input.val(),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy92ZW5kb3IvanF1ZXJ5LnZhbGlkYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaWYoJCgnI2xlYWRnZW4nKSB8fCAkKCcjbm9ubGVhZGdlbicpKVx0e1xuXHQvL0FkZCBoYXJkIGxpbWl0cyB0byBmb3JtIGZpZWxkcywgaWYgdGhleSBhcmUgbm90IGFscmVhZHkgZGVmaW5lZFxuXHRpZighJCgnI0NfU2FsdXRhdGlvbjEnKS5hdHRyKCdtYXhsZW5ndGgnKSlcblx0XHQkKCcjQ19TYWx1dGF0aW9uMScpLmF0dHIoJ21heGxlbmd0aCcsICcxNScpO1xuXHRpZighJCgnI0NfVGl0bGUnKS5hdHRyKCdtYXhsZW5ndGgnKSlcblx0XHQkKCcjQ19UaXRsZScpLmF0dHIoJ21heGxlbmd0aCcsICc3NScpO1xuXHRpZighJCgnI0NfQWRkcmVzczEnKS5hdHRyKCdtYXhsZW5ndGgnKSlcblx0XHQkKCcjQ19BZGRyZXNzMScpLmF0dHIoJ21heGxlbmd0aCcsICc2MCcpO1xuXHRpZighJCgnI0NfQWRkcmVzczInKS5hdHRyKCdtYXhsZW5ndGgnKSlcblx0XHQkKCcjQ19BZGRyZXNzMicpLmF0dHIoJ21heGxlbmd0aCcsICc2MCcpO1xuXHRpZighJCgnI0NfQWRkcmVzczMnKS5hdHRyKCdtYXhsZW5ndGgnKSlcblx0XHQkKCcjQ19BZGRyZXNzMycpLmF0dHIoJ21heGxlbmd0aCcsICc2MCcpO1xuXHRpZighJCgnI0NfU3RhdGVfUHJvdicpLmF0dHIoJ21heGxlbmd0aCcpKVxuXHRcdCQoJyNDX1N0YXRlX1Byb3YnKS5hdHRyKCdtYXhsZW5ndGgnLCAnMjAnKTtcblx0aWYoISQoJyNDX1ppcF9Qb3N0YWwnKS5hdHRyKCdtYXhsZW5ndGgnKSlcblx0XHQkKCcjQ19aaXBfUG9zdGFsJykuYXR0cignbWF4bGVuZ3RoJywgJzEwJyk7XG5cdGlmKCEkKCcjQ19CdXNQaG9uZScpLmF0dHIoJ21heGxlbmd0aCcpKVxuXHRcdCQoJyNDX0J1c1Bob25lJykuYXR0cignbWF4bGVuZ3RoJywgJzQwJyk7XG5cdFxuXG5cdC8vU3dpdGNoLW9uIHJlZy1leCB2YWxpZGF0aW9ucywgaWYgbm90IGFscmVhZHkgZGVmaW5lZFxuXHRpZighJCgnI0NfRmlyc3ROYW1lJykuYXR0cignZGF0YS12YWxpZGF0aW9uLXR5cGUnKSlcblx0XHQkKCcjQ19GaXJzdE5hbWUnKS5hdHRyKCdkYXRhLXZhbGlkYXRpb24tdHlwZScsICdmbmFtZScpO1xuXHRpZighJCgnI0NfTGFzdE5hbWUnKS5hdHRyKCdkYXRhLXZhbGlkYXRpb24tdHlwZScpKVxuXHRcdCQoJyNDX0xhc3ROYW1lJykuYXR0cignZGF0YS12YWxpZGF0aW9uLXR5cGUnLCAnbG5hbWUnKTtcblx0aWYoISQoJyNDX0J1c1Bob25lJykuYXR0cignZGF0YS12YWxpZGF0aW9uLXR5cGUnKSlcblx0XHQkKCcjQ19CdXNQaG9uZScpLmF0dHIoJ2RhdGEtdmFsaWRhdGlvbi10eXBlJywgJ3RlbCcpO1xuXHRcblx0Ly9NaWxpbmQ6IENvbW1lbnRpbmcgb3V0IHRoaXMgbG9naWMgYXMgd2Ugd2lsbCB1cGRhdGUgdGhlIEZpZWxkU2V0IGZvciBVbnN1YnNjcmliZSBmb3JtXG5cdC8vQ2hhbmdlIHJlZy1leCB2YWxpZGF0aW9uIHBhdHRlcm4gZm9yIFVuc3Vic2NyaWJlIGZvcm1cblx0Lypcblx0aWYodHlwZW9mIGJtY01ldGEgIT09ICd1bmRlZmluZWQnICYmIGJtY01ldGEuaGFzT3duUHJvcGVydHkoXCJmb3JtXCIpKVx0e1xuXHRcdGlmKGJtY01ldGEuZm9ybS5uYW1lLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihcInVuc3Vic2NyaWJlXCIpID4gLTEpXHR7XG5cdFx0XHQkKCcjQ19FbWFpbEFkZHJlc3MnKS5hdHRyKCd0eXBlJywgJ3RleHQnKTtcblx0XHRcdCQoJyNDX0VtYWlsQWRkcmVzcycpLmF0dHIoJ2RhdGEtdmFsaWRhdGlvbi10eXBlJywgJ2FsbGVtYWlscycpO1xuXHRcdH1cblx0fVxuXHQqL1xuXHRcbn1cdC8vRU9DIGZvciBMZWFkZ2VuIG9yIE5vbkxlYWRnZW4gZm9ybVx0XG5cblxuKGZ1bmN0aW9uKCQpIHtcblx0JC5mbi52YWxpZGF0ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciAkdGhpcyA9IHRoaXMsXG5cdFx0XHQkZm9ybSA9ICQodGhpcyksXG5cdFx0XHQkaW5wdXRzID0gJGZvcm0uZmluZCgnaW5wdXQsIHRleHRhcmVhLCBzZWxlY3QnKSxcblx0XHRcdCRzdWJtaXRCdXR0b24gPSAkZm9ybS5maW5kKCdidXR0b25bdHlwZT1cInN1Ym1pdFwiXScpLFxuXHRcdFx0YWpheEZvcm0gPSAkZm9ybS5kYXRhKCdhamF4LXVybCcpICE9PSB1bmRlZmluZWQ7XHQvLyBib29sZWFuIHRoYXQgZGV0ZXJtaW5lcyBpZiBhIGZvcm0gaXMgc3VibWl0dGVkIHdpdGggQUpBWFxuXG5cdFx0Ly8gaW5pdGlhbGl6ZSB0aGUgZm9ybSBzdGF0ZVxuXHRcdCRmb3JtLmRhdGEoJ3ZhbGlkJywgdHJ1ZSk7XG5cdFx0ZW5hYmxlTG9hZGluZ1N0YXRlKCRzdWJtaXRCdXR0b24pO1xuXG5cdFx0Ly8gYmFzZSByZWdleCBwYXR0ZXJuczsgaHR0cDovL3JlZ2V4MTAxLmNvbS8gaXMgYSBnb29kIHRlc3RpbmcgZW52aXJvbm1lbnRcblx0XHQkdGhpcy5wYXR0ZXJucyA9IHtcblx0XHRcdC8vJ2VtYWlsJyA6IFwiXlthLXpBLVpdW2EtekEtWjAtOS4hIyQlJicqKy89P15fYHt8fX4tXSpAW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KD86XFxcXC5bYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8pKyRcIixcdC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzg4MjkzNjNcblx0XHRcdCdlbWFpbCcgOiBcIl5bYS16QS1aXVthLXpBLVowLTkuISMkJSYnKisvPT9eX2B7fH1+LV0qQCg/IShnbWFpbFxcXFwuW2EtekEtWjAtOS5dKyQpfChob3RtYWlsXFxcXC5bYS16QS1aMC05Ll0rJCl8KHpvaG9cXFxcLlthLXpBLVowLTkuXSskKXwoeWFuZGV4XFxcXC5bYS16QS1aMC05Ll0rJCl8KG91dGxvb2tcXFxcLlthLXpBLVowLTkuXSskKXwoYWltXFxcXC5bYS16QS1aMC05Ll0rJCl8KGljbG91ZFxcXFwuW2EtekEtWjAtOS5dKyQpfChtZVxcXFwuW2EtekEtWjAtOS5dKyQpfChtYWNcXFxcLlthLXpBLVowLTkuXSskKXwoeWFob29cXFxcLlthLXpBLVowLTkuXSskKXwobWFpbC5jb20kKXwoaW5ib3hcXFxcLlthLXpBLVowLTkuXSskKXwoZ214XFxcXC5bYS16QS1aMC05Ll0rJCl8KG15d2F5XFxcXC5bYS16QS1aMC05Ll0rJCl8KG1zblxcXFwuW2EtekEtWjAtOS5dKyQpKVthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPyg/OlxcXFwuW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KSskXCIsXG5cdFx0XHQnYWxsZW1haWxzJyA6IFwiXlthLXpBLVpdW2EtekEtWjAtOS4hIyQlJicqKy89P15fYHt8fX4tXSpAW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KD86XFxcXC5bYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8pKyRcIixcblx0XHRcdC8vJ3RlbCcgOiBcIl5bMC05LS5dKyRcIixcdC8vIHRoaXMgd2lsbCBhbGxvdyBudW1iZXJzLCBoeXBoZW5zLCBhbmQgcGVyaW9kc1xuXHRcdFx0J3RlbCdcdDogXCJeKFswLTktLisgKCldKlxcXFxkKXsxMH1bLS4rICgpXSokXCIsXHQvLyB0aGlzIHdpbGwgYWxsb3cgbnVtYmVycywgaHlwaGVucywgcGVyaW9kcywgcGx1cywgc3BhY2UgYW5kIG9wZW4gJiBjbG9zZSBwYXJlbnRoZXNpcyBBTkQgYXQgbGVhc3QgMTAgZGlnaXRzXG5cdFx0XHQvLyduYW1lJyA6IFwiXlteMC05XSskXCJcdC8vIHRoaXMgd2lsbCBleGNsdWRlIG51bWVyaWMgZGF0YVxuXHRcdFx0J2ZuYW1lJyA6IFwiXlteMC05IF1bXjAtOV17MCwyNX0kXCIsXHQvLyB0aGlzIHdpbGwgZXhjbHVkZSBudW1lcmljIGRhdGEgYW5kIGNhbm5vdCBiZWdpbiB3aXRoIHNwYWNlXG5cdFx0XHQnbG5hbWUnIDogXCJeW14wLTkgXVteMC05XXswLDQwfSRcIixcdC8vIHRoaXMgd2lsbCBleGNsdWRlIG51bWVyaWMgZGF0YSBhbmQgY2Fubm90IGJlZ2luIHdpdGggc3BhY2Vcblx0XHRcdFxuXHRcdFx0Ly9OZXcgcmVndWxhciBleHByZXNzaW9ucyBhZGRlZCB0byBhY2NvbW9kYXRlIHVzZXItdW5kZXJzdGFuZGFibGUgb3B0aW9ucyBpbiBDTVNcblx0XHRcdCdlbWFpbC1idXNpbmVzcycgOiBcIl5bYS16QS1aXVthLXpBLVowLTkuISMkJSYnKisvPT9eX2B7fH1+LV0qQCg/IShnbWFpbFxcXFwuW2EtekEtWjAtOS5dKyQpfChob3RtYWlsXFxcXC5bYS16QS1aMC05Ll0rJCl8KHpvaG9cXFxcLlthLXpBLVowLTkuXSskKXwoeWFuZGV4XFxcXC5bYS16QS1aMC05Ll0rJCl8KG91dGxvb2tcXFxcLlthLXpBLVowLTkuXSskKXwoYWltXFxcXC5bYS16QS1aMC05Ll0rJCl8KGljbG91ZFxcXFwuW2EtekEtWjAtOS5dKyQpfChtZVxcXFwuW2EtekEtWjAtOS5dKyQpfChtYWNcXFxcLlthLXpBLVowLTkuXSskKXwoeWFob29cXFxcLlthLXpBLVowLTkuXSskKXwobWFpbC5jb20kKXwoaW5ib3hcXFxcLlthLXpBLVowLTkuXSskKXwoZ214XFxcXC5bYS16QS1aMC05Ll0rJCl8KG15d2F5XFxcXC5bYS16QS1aMC05Ll0rJCl8KG1zblxcXFwuW2EtekEtWjAtOS5dKyQpKVthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPyg/OlxcXFwuW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KSskXCIsXG5cdFx0XHQnZW1haWwtYnVzaW5lc3MtY29tcGV0aXRvcicgOiBcIl5bYS16QS1aXVthLXpBLVowLTkuISMkJSYnKisvPT9eX2B7fH1+LV0qQCg/IShnbWFpbFxcXFwuW2EtekEtWjAtOS5dKyQpfChob3RtYWlsXFxcXC5bYS16QS1aMC05Ll0rJCl8KHpvaG9cXFxcLlthLXpBLVowLTkuXSskKXwoeWFuZGV4XFxcXC5bYS16QS1aMC05Ll0rJCl8KG91dGxvb2tcXFxcLlthLXpBLVowLTkuXSskKXwoYWltXFxcXC5bYS16QS1aMC05Ll0rJCl8KGljbG91ZFxcXFwuW2EtekEtWjAtOS5dKyQpfChtZVxcXFwuW2EtekEtWjAtOS5dKyQpfChtYWNcXFxcLlthLXpBLVowLTkuXSskKXwoeWFob29cXFxcLlthLXpBLVowLTkuXSskKXwobWFpbC5jb20kKXwoaW5ib3hcXFxcLlthLXpBLVowLTkuXSskKXwoZ214XFxcXC5bYS16QS1aMC05Ll0rJCl8KG15d2F5XFxcXC5bYS16QS1aMC05Ll0rJCl8KGlibS5jb20kKXwoaHBlLmNvbSQpfChocC5jb20kKXwoY2hlZi5pbyQpfCh0cmlwd2lyZS5jb20kKXwoc2VydmljZW5vdy5jb20kKXwoYm1jLmNvbSQpfChtc25cXFxcLlthLXpBLVowLTkuXSskKSlbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8oPzpcXFxcLlthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPykrJFwiLFxuXHRcdFx0J2VtYWlsLWFsbCcgOiBcIl5bYS16QS1aXVthLXpBLVowLTkuISMkJSYnKisvPT9eX2B7fH1+LV0qQFthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPyg/OlxcXFwuW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KSskXCIsXG5cdFx0XHQnYWxwaGEtb25seScgOiBcIl5bXjAtOSBdW0EteiBdKyRcIixcdC8vdGhpcyB3aWxsIGV4Y2x1ZGUgbnVtZXJpYyBkYXRhIGFuZCBjYW5ub3QgYmVnaW4gd2l0aCBzcGFjZSBidXQgY2FuIGhhdmUgc3BhY2UgaW4tYmV0d2VlbiBmb3IgZG91YmxlIG5hbWVzXG5cdFx0XHQndGVsZXBob25lLW51bWJlcidcdDogXCJeKFswLTktLisgKCldKlxcXFxkKXsxMH1bLS4rICgpXSokXCJcdC8vIHRoaXMgd2lsbCBhbGxvdyBudW1iZXJzLCBoeXBoZW5zLCBwZXJpb2RzLCBwbHVzLCBzcGFjZSBhbmQgb3BlbiAmIGNsb3NlIHBhcmVudGhlc2lzIEFORCBhdCBsZWFzdCAxMCBkaWdpdHNcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gZGlzYWJsZUxvYWRpbmdTdGF0ZSgkZWxlbWVudCkge1xuXHRcdFx0JGVsZW1lbnRcblx0XHRcdFx0LmF0dHIoJ2Rpc2FibGVkJywgZmFsc2UpXG5cdFx0XHRcdC5yZW1vdmVDbGFzcygnYnRuLWxvYWRpbmcnKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBlbmFibGVMb2FkaW5nU3RhdGUoJGVsZW1lbnQpIHtcblx0XHRcdCRlbGVtZW50XG5cdFx0XHRcdC5hdHRyKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpXG5cdFx0XHRcdC5hZGRDbGFzcygnYnRuLWxvYWRpbmcnKTtcblx0XHR9XG5cblx0XHQvLyBzZXRzIGFuIGlucHV0IGFuZCB0aGUgZm9ybSBhcyBpbnZhbGlkXG5cdFx0ZnVuY3Rpb24gc2V0SW52YWxpZCgkaW5wdXQsIHJhZGlvT3JDaGVja2JveCwgbmFtZSkge1xuXHRcdFx0Ly8gYXBwbHkgZXJyb3Igc3R5bGVzXG5cdFx0XHRpZiAoJGlucHV0LnBhcmVudCgpLmlzKCcuZGVjb3JhdG9yLXNlbGVjdCcpKSB7XG5cdFx0XHRcdCRpbnB1dC5wYXJlbnQoKS5hZGRDbGFzcygndmFsaWRhdGlvbi1lcnJvcicpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAocmFkaW9PckNoZWNrYm94KSB7XG5cdFx0XHRcdCQoJ2xhYmVsW2Zvcj1cIicgKyBuYW1lICsgJ1wiXScpLmFkZENsYXNzKCd2YWxpZGF0aW9uLWVycm9yJyk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0JGlucHV0LmFkZENsYXNzKCd2YWxpZGF0aW9uLWVycm9yJyk7XG5cblx0XHRcdFx0Ly9Mb2dpYyB0byBzaG93IEVycm9yIGhpbnRcblx0XHRcdFx0dmFyIGVycl9oaW50ID0gKCRpbnB1dC5kYXRhKCdlcnJvci1oaW50JykgIT0gJycpID8gJGlucHV0LmRhdGEoJ2Vycm9yLWhpbnQnKSA6ICRpbnB1dC5hdHRyKCdwbGFjZWhvbGRlcicpO1xuXHRcdFx0XHQkaW5wdXQucHJldignbGFiZWw6Zmlyc3QnKS50ZXh0KGVycl9oaW50KTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0Ly8gcmVzZXQgdG8gT3JpZ2luYWwgTGFiZWxcbiAgICAgICRpbnB1dFxuICAgICAgICAub24oJ2tleXVwIGNoYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmKCRpbnB1dC52YWwoKS5sZW5ndGggPT0gMClcbiAgICAgICAgICAgICRpbnB1dC5wcmV2KCdsYWJlbDpmaXJzdCcpLnRleHQoJGlucHV0LmF0dHIoJ3BsYWNlaG9sZGVyJykpO1xuICAgICAgICB9KTtcblxuXHRcdFx0Ly8gcmVtb3ZlIGVycm9yIHN0eWxlcyBpZiBhIHZhbHVlIGlzIGNoYW5nZWRcblx0XHRcdCRpbnB1dFxuXHRcdFx0XHQub24oJ2tleXVwIGNoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQodGhpcylcblx0XHRcdFx0XHRcdC5hZGQoJ2xhYmVsW2Zvcj1cIicgKyBuYW1lICsgJ1wiXScpXG5cdFx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoJ3ZhbGlkYXRpb24tZXJyb3InKVxuXHRcdFx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoJ3ZhbGlkYXRpb24tZXJyb3InKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdCRmb3JtXG5cdFx0XHRcdC5kYXRhKCd2YWxpZCcsIGZhbHNlKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzY3JvbGxUb0Zvcm0oKSB7XG5cdFx0XHQkKCdodG1sLCBib2R5Jylcblx0XHRcdFx0LmFuaW1hdGUoe1xuXHRcdFx0XHRcdHNjcm9sbFRvcDogJGZvcm0ub2Zmc2V0KCkudG9wIC0gMTAwXG5cdFx0XHRcdH0sIDUwMCk7XG5cblx0XHRcdGRpc2FibGVMb2FkaW5nU3RhdGUoJHN1Ym1pdEJ1dHRvbik7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2Nyb2xsVG9JbnZhbGlkKCkge1xuXHRcdFx0JCgnaHRtbCwgYm9keScpXG5cdFx0XHRcdC5hbmltYXRlKHtcblx0XHRcdFx0XHRzY3JvbGxUb3A6ICQoJy52YWxpZGF0aW9uLWVycm9yJykub2Zmc2V0KCkudG9wIC0gMTAwXG5cdFx0XHRcdH0sIDUwMCk7XG5cblx0XHRcdGRpc2FibGVMb2FkaW5nU3RhdGUoJHN1Ym1pdEJ1dHRvbik7XG5cdFx0fVxuXHRcdFxuXHRcdC8vIHRvIGJlIHVzZWQgZm9yIHRlc3RpbmcgVW5pY29kZSBpbnB1dFxuXHRcdGZ1bmN0aW9uIGdldExlbmd0aEluQnl0ZXMoc3RyKSB7XG5cdFx0ICB2YXIgYiA9IHN0ci5tYXRjaCgvW15cXHgwMC1cXHhmZl0vZyk7XG5cdFx0ICByZXR1cm4gKHN0ci5sZW5ndGggKyAoIWIgPyAwOiBiLmxlbmd0aCkpOyBcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzdWJtaXRWYWxpZEFqYXhGb3JtKCkge1xuXHRcdFx0dmFyIHN1Ym1pdHRlZE9iamVjdCA9ICRmb3JtLnNlcmlhbGl6ZU9iamVjdCgpO1xuXG5cdFx0XHQvLyBjb21iaW5lIFRvcGljIG9mIEludGVyZXN0IHdpdGggQ29tbWVudHNcblx0XHRcdHN1Ym1pdHRlZE9iamVjdC5DX0Rlc2NyaXB0aW9uMSA9ICdUb3BpYyBvZiBpbnRlcmVzdDogJyArIHN1Ym1pdHRlZE9iamVjdC5DX1Byb2R1Y3RJbnRlcmVzdCArICdcXHJcXG5BZGRpdGlvbmFsIGNvbW1lbnRzOiAnICsgc3VibWl0dGVkT2JqZWN0LkNfRGVzY3JpcHRpb24xO1xuXG5cdFx0XHQkLmFqYXgoe1xuXHRcdFx0XHR1cmw6ICRmb3JtLmRhdGEoJ2FqYXgtdXJsJyksXG5cdFx0XHRcdHR5cGU6ICdQT1NUJyxcblx0XHRcdFx0ZGF0YVR5cGU6ICdIVE1MJyxcblx0XHRcdFx0ZGF0YTogc3VibWl0dGVkT2JqZWN0XG5cdFx0XHR9KVxuXHRcdFx0LmRvbmUoZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHQkZm9ybVxuXHRcdFx0XHRcdC5maW5kKCcudmFsaWRhdGlvbi1lcnJvcicpXG5cdFx0XHRcdFx0LnJlbW92ZSgpXG5cdFx0XHRcdFx0LmVuZCgpXG5cdFx0XHRcdFx0LmVtcHR5KClcblx0XHRcdFx0XHQuaGlkZSgpXG5cdFx0XHRcdFx0Lmh0bWwoJzxoMj5UaGFuayB5b3UsICcgKyBzdWJtaXR0ZWRPYmplY3QuQ19GaXJzdE5hbWUgKyAnLjwvaDI+PHA+V2Ugd2lsbCBiZSBpbiB0b3VjaCBzb29uIHRvIGRpc2N1c3MgeW91ciBuZWVkczwvcD4nKVxuXHRcdFx0XHRcdC5mYWRlSW4oKTtcblxuXHRcdFx0XHRzY3JvbGxUb0Zvcm0oKTtcblx0XHRcdH0pXG5cdFx0XHQvLyBpZiB0aGUgVVJMIGNhbm5vdCBiZSBsb2NhdGVkXG5cdFx0XHQuZmFpbChmdW5jdGlvbihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcblx0XHRcdFx0JGZvcm1cblx0XHRcdFx0XHQuZW1wdHkoKVxuXHRcdFx0XHRcdC5oaWRlKClcblx0XHRcdFx0XHQuaHRtbCgnPHAgY2xhc3M9XCJ2YWxpZGF0aW9uLWVycm9yXCI+JyArIGVycm9yVGhyb3duICsgJzwvcD4nKVxuXHRcdFx0XHRcdC5mYWRlSW4oKTtcblxuXHRcdFx0XHRzY3JvbGxUb0Zvcm0oKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdC8vIHZhbGlkYXRlIGVhY2ggaW5wdXRcblx0XHQkaW5wdXRzXG5cdFx0XHQuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyICRpbnB1dCA9ICQodGhpcyksXG5cdFx0XHRcdFx0dmFsdWUgPSAkaW5wdXQudmFsKCksXG5cdFx0XHRcdFx0cmVxdWlyZWQgPSAkaW5wdXQuYXR0cigncmVxdWlyZWQnKSAhPT0gdW5kZWZpbmVkLFxuXHRcdFx0XHRcdHR5cGUgPSAkaW5wdXQuYXR0cigndHlwZScpLFxuXHRcdFx0XHRcdC8vTWlsaW5kOiBWYWxpZGF0aW9uIHR5cGUgZ2V0cyBoaWdoZXIgcHJlY2VkZW5jZSB0aGFuIHR5cGVcblx0XHRcdFx0XHQvL3ZhbGlkYXRpb25UeXBlID0gKHR5cGUgPT09ICd0ZXh0JykgPyAkaW5wdXQuZGF0YSgndmFsaWRhdGlvbi10eXBlJykgOiB0eXBlLFxuXHRcdFx0XHRcdHZhbGlkYXRpb25UeXBlID0gKCRpbnB1dC5kYXRhKCd2YWxpZGF0aW9uLXR5cGUnKSkgPyAkaW5wdXQuZGF0YSgndmFsaWRhdGlvbi10eXBlJykgOiB0eXBlLFxuXHRcdFx0XHRcblx0XHRcdFx0XHRyYWRpb09yQ2hlY2tib3ggPSAodHlwZSA9PT0gJ3JhZGlvJyB8fCB0eXBlID09PSAnY2hlY2tib3gnKSxcblx0XHRcdFx0XHRuYW1lID0gJGlucHV0LmF0dHIoJ25hbWUnKSxcblx0XHRcdFx0XHRwYXR0ZXJuO1xuXG5cdFx0XHRcdC8vIHRlc3QgaWYgdGhlIGlucHV0IGlzIHJlcXVpcmVkXG5cdFx0XHRcdGlmIChyZXF1aXJlZCAmJiAodmFsdWUgPT09ICcnIHx8IHZhbHVlID09PSBudWxsKSkge1xuXHRcdFx0XHRcdHNldEludmFsaWQoJGlucHV0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmIChyZXF1aXJlZCAmJiByYWRpb09yQ2hlY2tib3ggJiYgJCgnW25hbWU9XCInICsgbmFtZSArICdcIl06Y2hlY2tlZCcpLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdHNldEludmFsaWQoJGlucHV0LCByYWRpb09yQ2hlY2tib3gsIG5hbWUpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gdGVzdCB0aGUgaW5wdXQgYWdhaW5zdCBpdHMgcmVnZXggcGF0dGVyblxuXHRcdFx0XHRpZiAocmVxdWlyZWQgJiYgJHRoaXMucGF0dGVybnNbdmFsaWRhdGlvblR5cGVdKSB7XG5cdFx0XHRcdFx0cGF0dGVybiA9IG5ldyBSZWdFeHAoJHRoaXMucGF0dGVybnNbdmFsaWRhdGlvblR5cGVdKTtcblxuXHRcdFx0XHRcdGlmICghcGF0dGVybi50ZXN0KHZhbHVlLnRvTG93ZXJDYXNlKCkpKSB7XG5cdFx0XHRcdFx0XHRzZXRJbnZhbGlkKCRpbnB1dCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gdGVzdCBmb3IgVW5pY29kZSBpbnB1dCBpLmUuIG5vbi1FbmdsaXNoIGNoYXJhY3RlcnNcblx0XHRcdFx0aWYgKHR5cGUgPT0gJ3RleHQnKSB7XG5cdFx0XHRcdFx0Ly9DaGFyIGxlbmd0aCAhPSBOby4gb2YgQnl0ZXMgOj0gaW5wdXQgaXMgVW5pY29kZVxuXHRcdFx0XHRcdGlmICh2YWx1ZS5sZW5ndGggIT0gZ2V0TGVuZ3RoSW5CeXRlcyh2YWx1ZSkpIHtcblx0XHRcdFx0XHRcdHNldEludmFsaWQoJGlucHV0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyB0ZXN0IGlmIHRoZSBob25leXBvdCBpcyBmaWxsZWQgb3V0XG5cdFx0XHRcdGlmICgkaW5wdXQuZGF0YSgnaW5wdXQtaG9uZXlwb3QnKSAmJiAkaW5wdXQudmFsKCkgIT09ICcnKSB7XG5cdFx0XHRcdFx0c2V0SW52YWxpZCgkaW5wdXQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnByb21pc2UoKVxuXHRcdFx0LmRvbmUoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICgkZm9ybS5kYXRhKCd2YWxpZCcpKSB7XG5cdFx0XHRcdFx0aWYgKGFqYXhGb3JtKSB7XG5cdFx0XHRcdFx0XHRzdWJtaXRWYWxpZEFqYXhGb3JtKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0JGZvcm0uc3VibWl0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHNjcm9sbFRvSW52YWxpZCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0fTtcbn0pIChqUXVlcnkpOyJdfQ==
